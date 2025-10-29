# GitHub Discussions Integration

This site supports displaying GitHub Discussion comments directly on posts and notes.

## How It Works

When a post has a `discussionUrl` field in its frontmatter, the site will:

1. Fetch comments from the linked GitHub Discussion using the GraphQL API
2. Display them below the post content with author information, timestamps, and replies
3. Provide a link to join the discussion on GitHub

## Setup

### 1. Add Discussion URL to Posts

In your post's frontmatter, add the `discussionUrl` field:

```yaml
---
layout: article
title: "My Post Title"
discussionUrl: "https://github.com/owner/repo/discussions/30"
---
```

### 2. Enable GitHub Token for API Access

To fetch discussion comments, the build process needs access to the GitHub API.

#### For Local Development

Set the `GITHUB_TOKEN` environment variable:

```bash
export GITHUB_TOKEN="your_github_token"
npm run build
```

Or create a `.env` file (don't commit this!):

```
GITHUB_TOKEN=your_github_token
```

#### For GitHub Actions

The deploy workflow is already configured to use `secrets.GITHUB_TOKEN`, which is automatically provided by GitHub Actions. No additional setup is required!

The workflow includes:

```yaml
- name: Build site
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npm run build
```

### 3. Create GitHub Personal Access Token (Optional for Local Development)

If you want to test locally with real data:

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Eleventy Discussion Fetcher"
4. Select the following scopes:
   - `public_repo` (for public repositories)
   - Or `repo` (for private repositories)
5. Generate the token and copy it
6. Use it as your `GITHUB_TOKEN` environment variable

## Features

### Comment Display

- **Author Information**: Shows avatar, username, and link to GitHub profile
- **Timestamps**: Displays when comments were created
- **Nested Replies**: Shows comment replies with proper indentation
- **Rich Content**: Supports markdown formatting in comments
- **Graceful Fallback**: If API access fails, still shows a link to the discussion

### API Methods

The system tries three methods to fetch discussions, in order:

1. **GitHub CLI (`gh`)**: If authenticated locally
2. **Direct API with Token**: Using `GITHUB_TOKEN` environment variable
3. **Fallback**: Shows discussion link only

## Styling

Comments are styled to match the site theme with:

- Alternating backgrounds for visual separation
- Indented replies for clear hierarchy
- Avatar images with proper sizing
- Responsive design for mobile devices

Customize the styles in `styles/main.css` under the "Discussion Comments" section.

## Limitations

- Maximum 100 discussions fetched per repository
- Maximum 100 comments per discussion
- Maximum 10 replies per comment
- API rate limits apply (60 requests/hour without authentication, 5000 with)

## Troubleshooting

### "No discussions found or API error"

This message appears when:
- The API cannot be accessed without authentication
- The repository doesn't have discussions enabled
- Network issues prevent API access

**Solution**: Ensure `GITHUB_TOKEN` is set in your environment or GitHub Actions workflow.

### Comments don't show locally

**Check**:
1. Is `GITHUB_TOKEN` set? Run `echo $GITHUB_TOKEN`
2. Does the discussion exist? Visit the `discussionUrl` in your browser
3. Are there actual comments on the discussion?

### Rate Limiting

If you're hitting rate limits:
- Use authenticated requests (automatically done in GitHub Actions)
- Cache discussion data if building frequently
- Consider reducing the number of discussions/comments fetched

## Technical Details

### Data File

Discussion comments are fetched at build time by `_data/discussionComments.js`, which:
- Queries the GitHub GraphQL API
- Transforms the data into a JavaScript object
- Makes it available to all templates as `discussionComments`

### Template Integration

The data is accessed in templates using:

```njk
{% set discussionNum = discussionUrl | discussionNumber %}
{% set discussion = discussionComments[discussionNum] %}

{% if discussion and discussion.comments.length > 0 %}
  {# Display comments #}
{% endif %}
```

### Filters

- `discussionNumber`: Extracts the discussion number from a URL
- `readableDateISO`: Formats ISO date strings for display

## Future Enhancements

Potential improvements:

- Cache discussion data to reduce API calls
- Support pagination for large discussions
- Add reaction counts
- Enable discussion creation from the site
- Implement comment search/filtering
