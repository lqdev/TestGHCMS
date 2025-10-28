---
layout: article
title: "Welcome to GitHub CMS"
date: 2025-01-15
description: "A new way to blog using GitHub Issues and Eleventy"
tags:
  - meta
  - blogging
  - github
---

Welcome to your new GitHub-powered blog! This platform combines the simplicity of GitHub Issues with the power of Eleventy to create a modern, IndieWeb-friendly blogging experience.

## What Makes This Different?

Traditional blogging platforms require you to learn their interface, deal with databases, and often pay for hosting. This platform takes a different approach:

- **Write in GitHub Issues**: Your content lives where your code lives
- **Automatic Publishing**: GitHub Actions handle the heavy lifting
- **Static & Fast**: Eleventy generates lightning-fast static HTML
- **IndieWeb Ready**: Built-in Microformats2 and Webmentions support

## How It Works

1. Open a GitHub Issue using one of the provided templates
2. Fill in your content (Markdown supported!)
3. Submit the issue
4. A GitHub Action creates a pull request with your post
5. Merge the PR and your site automatically deploys

## Features

### Multiple Post Types

This platform supports various post types:

- **Articles**: Long-form content like this post
- **Notes**: Quick thoughts and status updates
- **Responses**: Reply to other posts across the web
- **Bookmarks**: Share interesting links
- **Media**: Photo posts and galleries
- **Reviews**: Rate and review anything

### IndieWeb Support

Built with IndieWeb principles in mind:

- **Own Your Data**: Your content lives in your GitHub repository
- **Microformats2**: Proper semantic markup for machine-readable content
- **Webmentions**: Participate in distributed conversations

### Customization

Everything is configurable via `site.config.yml`:

```yaml
postTypes:
  article:
    enabled: true
  note:
    enabled: true

features:
  discussions: true
  webmentions: true
  rss: true
```

## Getting Started

1. **Configure Your Site**: Edit `site.config.yml` with your details
2. **Create Your First Post**: Open an issue using the "Publish Article" template
3. **Customize**: Tweak the styles, layouts, and configuration to match your taste

## What's Next?

This is just the MVP! Upcoming features include:

- AI-assisted customization via GitHub Copilot
- POSSE (Publish on your Own Site, Syndicate Elsewhere)
- Micropub endpoint for posting from IndieWeb apps
- Scheduled posts
- Enhanced media handling

## Questions?

Check out the [README](https://github.com/yourusername/yourrepo) for detailed documentation, or open a discussion if you need help.

Happy blogging!
