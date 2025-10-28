# GitHub Actions Workflows

Due to GitHub App permission restrictions, workflow files must be added manually. Below are the two workflows needed for this platform to function.

## Setup Instructions

1. Create the `.github/workflows/` directory if it doesn't exist
2. Copy each workflow below into its respective file
3. Commit and push the workflows

```bash
mkdir -p .github/workflows
# Copy the workflows from this file
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push
```

---

## File: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## File: `.github/workflows/post-from-issue.yml`

```yaml
name: Create Post from Issue

on:
  issues:
    types: [opened, labeled]

jobs:
  create-post:
    if: contains(github.event.issue.labels.*.name, 'post')
    runs-on: ubuntu-latest

    permissions:
      contents: write
      issues: write
      pull-requests: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Parse issue and create post
        id: parse-issue
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue;
            const body = issue.body;
            const labels = issue.labels.map(l => l.name);

            // Determine post type
            let postType = 'note';
            if (labels.includes('article')) postType = 'article';
            else if (labels.includes('response')) postType = 'response';
            else if (labels.includes('bookmark')) postType = 'bookmark';
            else if (labels.includes('media')) postType = 'media';
            else if (labels.includes('review')) postType = 'review';

            core.setOutput('postType', postType);

            // Parse form fields
            const fields = {};
            const fieldRegex = /### (.+?)\s*\n\s*(.+?)(?=\n###|\n$)/gs;
            let match;

            while ((match = fieldRegex.exec(body)) !== null) {
              const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
              const value = match[2].trim();
              if (value && value !== '_No response_' && value !== 'no') {
                fields[key] = value;
              }
            }

            core.setOutput('fields', JSON.stringify(fields));

            // Generate filename
            const date = new Date().toISOString().split('T')[0];
            const slug = (fields.title || issue.title)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
              .substring(0, 50);
            const filename = `${date}-${slug}.md`;

            core.setOutput('filename', filename);
            core.setOutput('date', date);

      - name: Create post file
        env:
          POST_TYPE: ${{ steps.parse-issue.outputs.postType }}
          FILENAME: ${{ steps.parse-issue.outputs.filename }}
          FIELDS: ${{ steps.parse-issue.outputs.fields }}
          ISSUE_NUMBER: ${{ github.event.issue.number }}
          ISSUE_TITLE: ${{ github.event.issue.title }}
          DATE: ${{ steps.parse-issue.outputs.date }}
        run: |
          # Parse fields
          TITLE=$(echo "$FIELDS" | jq -r '.title // ""')
          CONTENT=$(echo "$FIELDS" | jq -r '.content // ""')
          DESCRIPTION=$(echo "$FIELDS" | jq -r '.description // ""')
          TAGS=$(echo "$FIELDS" | jq -r '.tags // ""')
          AUTHOR=$(echo "$FIELDS" | jq -r '.author // ""')
          CANONICAL_URL=$(echo "$FIELDS" | jq -r '.canonical_url // ""')

          # If no title in fields, use issue title (remove [Type] prefix)
          if [ -z "$TITLE" ]; then
            TITLE=$(echo "$ISSUE_TITLE" | sed 's/^\[.*\] //')
          fi

          # Create directory if it doesn't exist
          mkdir -p "_${POST_TYPE}s"

          # Create frontmatter
          cat > "_${POST_TYPE}s/$FILENAME" <<EOF
          ---
          layout: $POST_TYPE
          title: "$TITLE"
          date: $DATE
          EOF

          # Add optional fields
          [ -n "$DESCRIPTION" ] && echo "description: \"$DESCRIPTION\"" >> "_${POST_TYPE}s/$FILENAME"
          [ -n "$AUTHOR" ] && echo "author: \"$AUTHOR\"" >> "_${POST_TYPE}s/$FILENAME"
          [ -n "$CANONICAL_URL" ] && echo "canonical_url: \"$CANONICAL_URL\"" >> "_${POST_TYPE}s/$FILENAME"

          # Add tags
          if [ -n "$TAGS" ]; then
            echo "tags:" >> "_${POST_TYPE}s/$FILENAME"
            IFS=',' read -ra TAG_ARRAY <<< "$TAGS"
            for tag in "${TAG_ARRAY[@]}"; do
              tag=$(echo "$tag" | xargs)
              echo "  - $tag" >> "_${POST_TYPE}s/$FILENAME"
            done
          fi

          # Add issue reference
          echo "issue: $ISSUE_NUMBER" >> "_${POST_TYPE}s/$FILENAME"

          # Close frontmatter
          echo "---" >> "_${POST_TYPE}s/$FILENAME"
          echo "" >> "_${POST_TYPE}s/$FILENAME"

          # Add content
          echo "$CONTENT" >> "_${POST_TYPE}s/$FILENAME"

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "Add new ${{ steps.parse-issue.outputs.postType }}: ${{ github.event.issue.title }}"
          title: "New ${{ steps.parse-issue.outputs.postType }}: ${{ github.event.issue.title }}"
          body: |
            This PR was automatically created from issue #${{ github.event.issue.number }}.

            Post type: **${{ steps.parse-issue.outputs.postType }}**
            Created: ${{ steps.parse-issue.outputs.date }}

            Closes #${{ github.event.issue.number }}
          branch: "post/issue-${{ github.event.issue.number }}"
          labels: "automated-post"

      - name: Comment on issue
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: '✅ Your post has been created! A pull request will be opened shortly. Once merged, your post will be published.'
            });
```

---

## After Adding Workflows

1. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

2. **Test the deployment workflow**:
   - Push to `main` branch or trigger manually

3. **Test post creation**:
   - Create a new issue using the "Publish Article" or "Post Note" template
   - The workflow should automatically create a PR with your post
