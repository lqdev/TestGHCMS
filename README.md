# GitHub CMS - Eleventy Blog Platform

A GitHub-native, AI-assisted blog platform powered by Eleventy. Publish content using GitHub Issues, customize with AI assistance, and deploy automatically to GitHub Pages.

## Features

- **Issue-Driven Publishing**: Create posts by opening GitHub Issues - no code required
- **Multiple Post Types**: Articles, notes, responses, bookmarks, media posts, and reviews
- **IndieWeb Support**: Built-in Microformats2 and Webmentions
- **GitHub Discussions**: Automatic comment threads for each post
- **AI Customization**: Request site customizations via GitHub Copilot
- **Static Site Generation**: Fast, secure, and SEO-friendly with Eleventy
- **GitHub Pages Deployment**: Automatic deployment on every commit

## Quick Start

### 1. Use This Template

Click "Use this template" to create your own repository.

### 2. Enable GitHub Pages

1. Go to **Settings** > **Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**

### 3. Set Up Repository Labels

Labels are required for the post creation workflow. Run the label sync workflow:

1. Go to **Actions** > **Setup Repository Labels**
2. Click **"Run workflow"** > **"Run workflow"**

This will create all necessary labels (post, article, note, etc.) from `.github/labels.yml`.

### 4. Configure Your Site

1. Open a new issue using the **"Initial Site Setup"** template
2. Fill in your site details (title, description, URL, etc.)
3. The setup action will update your `site.config.yml` file

Alternatively, edit `site.config.yml` directly:

```yaml
site:
  title: "Your Blog Title"
  description: "Your blog description"
  url: "https://yourusername.github.io/yourrepo"
  author:
    name: "Your Name"
    email: "your.email@example.com"
```

### 5. Create Your First Post

#### Creating an Article

1. Go to **Issues** > **New Issue**
2. Select **"Publish Article"**
3. Fill in the form:
   - Title
   - Content (Markdown supported)
   - Tags (optional)
   - Description (optional)
4. Click **"Submit new issue"**
5. The post will be automatically created and a PR will be opened
6. Merge the PR to publish

#### Creating a Note

1. Go to **Issues** > **New Issue**
2. Select **"Post Note"**
3. Write your content
4. Submit the issue

### 5. Site Will Auto-Deploy

Once you merge the PR, GitHub Actions will:
1. Build your site with Eleventy
2. Deploy to GitHub Pages
3. Your post will be live!

## Post Types

### Articles
Long-form blog posts with titles, descriptions, and full content.

**Use for**: Tutorials, essays, detailed posts

### Notes
Short-form content, status updates, or quick thoughts.

**Use for**: Twitter-like updates, quick thoughts, microblogging

### Responses
Replies, reposts, or likes of other content.

**Use for**: IndieWeb interactions, replies to other posts

### Bookmarks
Save and share links with commentary.

**Use for**: Link sharing, reading lists

### Media
Photo posts, image galleries, or media-rich content.

**Use for**: Photo blogs, galleries

### Reviews
Product, book, movie, or service reviews.

**Use for**: Review content with ratings

## Configuration

### Enable/Disable Post Types

Edit `site.config.yml`:

```yaml
postTypes:
  article:
    enabled: true
  note:
    enabled: true
  response:
    enabled: false  # Disable by setting to false
```

### Enable Features

```yaml
features:
  discussions:
    enabled: true        # Auto-create GitHub Discussions
  webmentions:
    enabled: true        # Enable Webmentions support
  rss:
    enabled: true        # Generate RSS feed
```

### Customize Theme

```yaml
theme:
  style: "minimal"
  colorScheme: "light"  # or "dark" or "auto"
  accentColor: "#0969da"
```

## Local Development

### Prerequisites

- Node.js 20 or higher
- npm

### Setup

```bash
# Clone your repository
git clone https://github.com/yourusername/yourrepo.git
cd yourrepo

# Install dependencies
npm install

# Run development server
npm start
```

Visit `http://localhost:8080` to see your site.

### Build for Production

```bash
npm run build
```

Output will be in the `_site` directory.

## Customization

### Manual Customization

- **Layouts**: Edit files in `_layouts/`
- **Styles**: Edit `styles/main.css`
- **Site Config**: Edit `site.config.yml`
- **Eleventy Config**: Edit `.eleventy.js`

### AI-Assisted Customization (Coming Soon)

Open an issue using the **"Help Me Customize My Site"** template and describe what you want to change. GitHub Copilot will create a PR with the requested changes.

## Project Structure

```
.
├── _articles/              # Article posts
├── _notes/                 # Note posts
├── _responses/             # Response posts
├── _bookmarks/             # Bookmark posts
├── _media/                 # Media posts
├── _reviews/               # Review posts
├── _layouts/               # Nunjucks templates
│   ├── base.njk           # Base layout
│   ├── article.njk        # Article layout
│   └── note.njk           # Note layout
├── _includes/             # Reusable template parts
├── _data/                 # Global data files
├── styles/                # CSS files
│   └── main.css          # Main stylesheet
├── .github/
│   ├── ISSUE_TEMPLATE/   # Issue forms
│   │   ├── article.yml
│   │   ├── note.yml
│   │   └── setup.yml
│   └── workflows/        # GitHub Actions
│       ├── post-from-issue.yml
│       └── deploy.yml
├── .eleventy.js          # Eleventy configuration
├── site.config.yml       # Site configuration
└── package.json          # Dependencies
```

## Workflows

### Post Creation Workflow

1. User opens issue with post content
2. Issue is labeled with post type (article, note, etc.)
3. GitHub Action parses issue form
4. Action creates markdown file in appropriate folder
5. Action opens PR with the new post
6. User reviews and merges PR
7. Deploy action builds and publishes site

### Deployment Workflow

1. PR merged to `main` branch
2. Deploy action runs
3. Site built with Eleventy
4. Built site deployed to GitHub Pages

## IndieWeb Features

### Microformats2

All posts include proper microformats markup:
- `h-entry` for posts
- `h-card` for author info
- `p-name`, `e-content`, `dt-published`, etc.

### Webmentions

To enable Webmentions:

1. Sign up at [webmention.io](https://webmention.io/)
2. Add verification to your site
3. Update `site.config.yml`:

```yaml
features:
  webmentions:
    enabled: true
    send: true
    receive: true
```

## GitHub Discussions Integration

When enabled, each post can have an associated GitHub Discussion for comments.

To enable:

```yaml
features:
  discussions:
    enabled: true
    autoCreate: true
```

## Troubleshooting

### Workflow Not Triggering When Creating Post

**Problem**: Creating an issue from a post template doesn't trigger the workflow.

**Solution**: The required labels may not exist in your repository. GitHub issue forms can only apply labels that already exist.

1. Go to **Actions** > **Setup Repository Labels**
2. Click **"Run workflow"** > **"Run workflow"**
3. Wait for completion, then try creating a new post issue

Alternatively, manually create the labels:
- `post`, `article`, `note`, `response`, `bookmark`, `media`, `review`

### Posts Not Appearing

- Check that the PR was merged to `main`
- Verify the deploy action completed successfully
- Check that the post file is in the correct folder (`_articles/`, `_notes/`, etc.)

### Site Not Deploying

- Verify GitHub Pages is enabled in Settings
- Check that Actions have write permissions
- Review the deploy workflow logs

### Issue Template Not Creating Post

- Ensure issue has the `post` label (or the workflow will use title prefix as fallback)
- Check the workflow run logs
- Verify the issue body matches the expected format

## Contributing

Contributions are welcome! Please open an issue or PR.

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [Eleventy](https://www.11ty.dev/)
- [GitHub Actions](https://github.com/features/actions)
- [GitHub Pages](https://pages.github.com/)

Inspired by the IndieWeb movement and GitHub-native workflows.

## Support

- Documentation: [GitHub Wiki](../../wiki)
- Issues: [GitHub Issues](../../issues)
- Discussions: [GitHub Discussions](../../discussions)

---

Made with ❤️ for the IndieWeb
