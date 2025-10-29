const https = require('https');
const { execSync } = require('child_process');

/**
 * Fetch discussion comments from GitHub GraphQL API
 * This data file will be available as `discussionComments` in templates
 */
module.exports = async function() {
  // Get configuration
  const owner = 'lqdev';
  const repo = 'TestGHCMS';
  
  // Get GitHub token from environment (optional, works without for public repos)
  const token = process.env.GITHUB_TOKEN;
  
  // Try to use gh CLI first if available
  try {
    const ghData = await fetchViaGhCli(owner, repo);
    if (ghData) {
      console.log('Successfully fetched discussion comments via gh CLI');
      return ghData;
    }
  } catch (error) {
    // Fall through to try direct API
  }
  
  // GraphQL query to fetch all discussions with their comments
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        discussions(first: 100) {
          nodes {
            number
            title
            url
            comments(first: 100) {
              nodes {
                id
                body
                bodyHTML
                createdAt
                updatedAt
                author {
                  login
                  url
                  avatarUrl
                }
                replies(first: 10) {
                  nodes {
                    id
                    body
                    bodyHTML
                    createdAt
                    updatedAt
                    author {
                      login
                      url
                      avatarUrl
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    owner: owner,
    repo: repo
  };

  try {
    const data = await fetchGraphQL(query, variables, token);
    
    if (!data || !data.repository || !data.repository.discussions) {
      console.log('No discussions found or API error');
      return {};
    }

    // Transform data into a map of discussion number -> comments
    const commentsMap = {};
    
    data.repository.discussions.nodes.forEach(discussion => {
      commentsMap[discussion.number] = {
        title: discussion.title,
        url: discussion.url,
        comments: discussion.comments.nodes.map(comment => ({
          id: comment.id,
          body: comment.body,
          bodyHTML: comment.bodyHTML,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: comment.author,
          replies: comment.replies.nodes.map(reply => ({
            id: reply.id,
            body: reply.body,
            bodyHTML: reply.bodyHTML,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            author: reply.author
          }))
        }))
      };
    });

    console.log(`Successfully fetched ${Object.keys(commentsMap).length} discussions`);
    return commentsMap;
  } catch (error) {
    console.error('Error fetching discussion comments:', error.message);
    // Return empty object on error to allow build to continue
    return {};
  }
};

/**
 * Try to fetch using gh CLI which may have credentials
 */
async function fetchViaGhCli(owner, repo) {
  try {
    // Check if gh is available and authenticated
    execSync('gh auth status', { stdio: 'ignore' });
    
    // Fetch discussions using gh CLI
    const result = execSync(
      `gh api graphql -f query='
        query {
          repository(owner: "${owner}", name: "${repo}") {
            discussions(first: 100) {
              nodes {
                number
                title
                url
                comments(first: 100) {
                  nodes {
                    id
                    body
                    bodyHTML
                    createdAt
                    updatedAt
                    author {
                      login
                      url
                      avatarUrl
                    }
                    replies(first: 10) {
                      nodes {
                        id
                        body
                        bodyHTML
                        createdAt
                        updatedAt
                        author {
                          login
                          url
                          avatarUrl
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      '`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    
    const parsed = JSON.parse(result);
    
    if (!parsed.data || !parsed.data.repository || !parsed.data.repository.discussions) {
      return null;
    }
    
    // Transform data into a map
    const commentsMap = {};
    parsed.data.repository.discussions.nodes.forEach(discussion => {
      commentsMap[discussion.number] = {
        title: discussion.title,
        url: discussion.url,
        comments: discussion.comments.nodes.map(comment => ({
          id: comment.id,
          body: comment.body,
          bodyHTML: comment.bodyHTML,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: comment.author,
          replies: comment.replies.nodes.map(reply => ({
            id: reply.id,
            body: reply.body,
            bodyHTML: reply.bodyHTML,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            author: reply.author
          }))
        }))
      };
    });
    
    return commentsMap;
  } catch (error) {
    // gh CLI not available or not authenticated
    return null;
  }
}

/**
 * Make a GraphQL API request to GitHub
 */
function fetchGraphQL(query, variables, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      query: query,
      variables: variables
    });

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'Eleventy-GitHub-CMS',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        // Handle non-200 status codes
        if (res.statusCode !== 200) {
          console.log(`GitHub API returned status ${res.statusCode}`);
          if (res.statusCode === 403 || res.statusCode === 401) {
            console.log('Hint: Set GITHUB_TOKEN environment variable for authenticated requests');
          }
          resolve(null);
          return;
        }
        
        try {
          const parsed = JSON.parse(responseData);
          
          if (parsed.errors) {
            console.error('GraphQL errors:', JSON.stringify(parsed.errors, null, 2));
            reject(new Error('GraphQL query failed'));
            return;
          }
          
          resolve(parsed.data);
        } catch (error) {
          reject(new Error('Failed to parse response: ' + error.message));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}
