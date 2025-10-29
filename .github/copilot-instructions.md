# GitHub Copilot Instructions for GitHub CMS

This repository is a GitHub-native, AI-assisted blog platform powered by Eleventy. These instructions help GitHub Copilot understand the project structure, conventions, and workflows.

## Project Overview

**GitHub CMS** is an Eleventy-based static site generator that enables content publishing through GitHub Issues. It supports multiple post types (articles, notes, responses, bookmarks, media, reviews) with IndieWeb features like Microformats2 and Webmentions.

### Key Features
- Issue-driven content publishing with automated PR creation
- Multiple content types configured via `site.config.yml`
- GitHub Actions workflows for deployment and post creation
- IndieWeb protocols support (Microformats2, Webmentions)
- Static site generation with Eleventy 2.x
- Automated GitHub Pages deployment

## Project Architecture

### Core Files
- `.eleventy.js` - Eleventy configuration, filters, and collections
- `site.config.yml` - Site settings, post types, features, and theme configuration
- `package.json` - Node.js dependencies and build scripts

### Directory Structure
```
/
├── .eleventy.js           # Eleventy configuration
├── site.config.yml        # Site configuration
├── _articles/             # Long-form blog posts
├── _notes/                # Short-form content
├── _responses/            # IndieWeb responses
├── _bookmarks/            # Link bookmarks
├── _media/                # Photo/media posts
├── _reviews/              # Review posts
├── _webmentions/          # Webmention data
├── _layouts/              # Nunjucks templates (base.njk, article.njk, note.njk)
├── _data/                 # Eleventy data files
├── styles/                # CSS stylesheets
├── assets/                # Static assets (images, fonts, etc.)
├── .github/
│   ├── ISSUE_TEMPLATE/   # Issue templates for post creation
│   └── workflows/        # GitHub Actions workflows (deploy.yml, post-from-issue.yml)
└── _site/                # Generated output (not committed)
```

### Content Types
Each post type has:
- Dedicated directory: `_articles/`, `_notes/`, etc.
- Markdown files with YAML frontmatter
- Nunjucks layout template in `_layouts/`
- Configuration in `site.config.yml` under `postTypes`

## Development Guidelines

### Making Changes

#### 1. Configuration Changes
- **Site settings**: Edit `site.config.yml`
- **Enable/disable post types**: Modify `postTypes` section in `site.config.yml`
- **Theme customization**: Update `theme` section in `site.config.yml`
- **Navigation**: Edit `navigation` array in `site.config.yml`

#### 2. Template Changes
- **Layouts**: Modify Nunjucks templates in `_layouts/`
- **Pages**: Edit `.njk` or `.md` files in root directory
- **Base template**: `_layouts/base.njk` is the parent layout for all pages

#### 3. Adding Features
- **Filters**: Add custom filters in `.eleventy.js`
- **Collections**: Define collections in `.eleventy.js` (see `addCollection` examples)
- **Static assets**: Add to `styles/` or `assets/` and register with `addPassthroughCopy`

### Eleventy Conventions

#### Collections
Collections are created from post type directories:
```javascript
eleventyConfig.addCollection('articles', function(collectionApi) {
  return collectionApi.getFilteredByGlob('./_articles/*.md').sort((a, b) => b.date - a.date);
});
```

#### Filters
Custom filters are registered in `.eleventy.js`:
- `readableDate` - Format dates for display
- `htmlDateString` - HTML5 datetime attribute format
- `isoDate` - ISO 8601 format
- `limit` - Limit array length
- `truncate` - Truncate strings

#### Frontmatter Format
All content files use YAML frontmatter:
```yaml
---
layout: article
title: "Post Title"
date: 2025-01-15
description: "Brief description"
tags:
  - tag1
  - tag2
issue: 123  # GitHub issue number
---
```

### Code Style

#### JavaScript
- Use `const` and `let` (no `var`)
- ES6+ syntax (arrow functions, template literals)
- Consistent indentation (2 spaces)
- Descriptive variable names
- Comments for complex logic

#### Templates (Nunjucks)
- Use semantic HTML5 elements
- Include Microformats2 classes (h-entry, p-name, etc.)
- Keep templates simple and focused
- Use includes for reusable components

#### CSS
- System font stack for performance
- CSS custom properties for theming
- Mobile-first responsive design
- Keep selectors simple and semantic

#### Markdown
- Use standard markdown syntax
- YAML frontmatter at the top
- Blank line after frontmatter
- Consistent heading hierarchy

## Workflows

### GitHub Actions

**Note**: Due to GitHub App permission restrictions, workflow files must be added manually. See `WORKFLOWS.md` for complete workflow definitions.

#### Deploy Workflow (`.github/workflows/deploy.yml`)
- Triggers on push to `main` branch
- Installs dependencies with `npm ci`
- Builds site with `npm run build`
- Deploys to GitHub Pages

#### Post Creation Workflow (`.github/workflows/post-from-issue.yml`)
- Triggers when issue is labeled with `post`
- Parses issue body for post content
- Determines post type from labels
- Creates markdown file in appropriate directory
- Opens PR with the new post

### Issue Templates
Located in `.github/ISSUE_TEMPLATE/`:
- `article.yml` - Create long-form articles
- `note.yml` - Create short notes
- `setup.yml` - Initial site setup

## Testing and Validation

### Building
```bash
npm run build          # Build the site
npm run serve          # Build and serve locally
npm run start          # Alias for serve
npm run debug          # Build with debug output
```

### Validation
- **Build success**: Ensure `npm run build` completes without errors
- **Output check**: Verify `_site/` directory contains expected HTML
- **Link validation**: Check that all internal links work
- **Template syntax**: Nunjucks errors will fail the build

### No Test Suite
This project currently does not have a test suite. Validate changes by:
1. Running `npm run build` to ensure no errors
2. Using `npm run serve` to preview changes locally
3. Checking GitHub Actions logs after deployment

## Common Tasks

### Adding a New Post Type
1. Add configuration to `site.config.yml` under `postTypes`
2. Create directory: `_posttypename/`
3. Create layout template: `_layouts/posttypename.njk`
4. Add collection in `.eleventy.js`
5. Create issue template: `.github/ISSUE_TEMPLATE/posttypename.yml`
6. Update workflow to handle new post type

### Modifying Styles
1. Edit CSS in `styles/` directory
2. Ensure `addPassthroughCopy` includes styles in `.eleventy.js`
3. Test with `npm run serve`

### Updating Site Configuration
1. Edit `site.config.yml`
2. Changes are loaded at build time via `yaml.load()` in `.eleventy.js`
3. Rebuild to see changes

## Important Notes

### Permissions and Setup
- GitHub App workflows have limited permissions
- Workflows must be added manually (see `WORKFLOWS.md` for complete workflow definitions)
- The `.github/workflows/` directory may not exist yet - refer to `WORKFLOWS.md` for setup instructions
- Cannot directly modify `.github/workflows/` via issues

### Dependencies
- Keep `@11ty/eleventy` at major version 2.x (check `package.json` for current version)
- Core dependencies: `js-yaml`, `luxon`, `markdown-it`, `markdown-it-anchor`
- No test framework dependencies currently

### Site Generation
- Output directory: `_site/` (excluded from git)
- All content is static HTML
- No server-side processing
- SEO-friendly with semantic HTML

## Getting Help

- **Documentation**: Check README.md, WORKFLOWS.md, SETUP-MAIN-BRANCH.md
- **Eleventy Docs**: https://www.11ty.dev/docs/
- **Issue Templates**: Use provided templates for common tasks
- **Logs**: Check GitHub Actions logs for deployment issues

## Best Practices for AI Assistance

When making changes via Copilot:
1. **Understand the impact**: Check `site.config.yml` to see what features are enabled
2. **Preserve structure**: Keep directory structure and naming conventions
3. **Test locally**: Always run `npm run build` after changes
4. **Follow patterns**: Match existing code style and patterns
5. **Document changes**: Update comments for complex logic
6. **Minimal changes**: Make the smallest change needed to achieve the goal
7. **Respect configuration**: Honor settings in `site.config.yml`
8. **Check workflows**: Ensure GitHub Actions can still process changes
