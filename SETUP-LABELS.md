# Repository Setup Guide

This guide explains why labels didn't automatically apply to issue #7 and how to prevent this issue.

## Why Labels Weren't Applied

When issue #7 was created using the note template, no labels were applied because:

**GitHub issue forms can only apply labels that already exist in the repository.**

The note template (`./github/ISSUE_TEMPLATE/note.yml`) correctly defines:
```yaml
labels: ["note", "post"]
```

However, these labels don't exist in the repository, so GitHub silently skips applying them.

## Solution: Create Required Labels

### Automatic Setup (Recommended)

Use the provided workflow to automatically create all required labels:

1. Navigate to **Actions** tab
2. Select **"Setup Repository Labels"** workflow
3. Click **"Run workflow"** dropdown
4. Click **"Run workflow"** button
5. Wait for the workflow to complete (~10 seconds)

This creates all labels defined in `.github/labels.yml`:
- `post` - Main label to trigger post creation workflow
- `article`, `note`, `response`, `bookmark`, `media`, `review` - Post type labels
- `setup`, `config` - Configuration labels
- `automated-post`, `automated-setup` - PR automation labels

### Manual Setup

If you prefer to create labels manually:

1. Go to **Issues** tab
2. Click **Labels**
3. Click **New label** for each required label:

| Label | Description | Color |
|-------|-------------|-------|
| post | Indicates an issue is a post creation request | `0E8A16` |
| article | Long-form blog post | `1D76DB` |
| note | Short-form note or status update | `5319E7` |
| response | Response to another post or content | `FBCA04` |
| bookmark | Bookmarked link or resource | `D93F0B` |
| media | Photo or media post | `E99695` |
| review | Review of a product, service, or content | `BFD4F2` |
| setup | Initial site setup configuration | `C2E0C6` |
| config | Site configuration change | `C2E0C6` |

## Verification

After creating labels, test the setup:

1. Go to **Issues** > **New issue**
2. Select **"Post Note"** template
3. Fill out the form and submit
4. Verify the issue has `note` and `post` labels applied
5. Check that the **"Create Post from Issue"** workflow runs

## How the Workflow Works

The post creation workflow (`./github/workflows/post-from-issue.yml`) has two trigger mechanisms:

### Primary: Label Detection
```yaml
if: contains(github.event.issue.labels.*.name, 'post')
```

### Fallback: Title Prefix Detection
```yaml
if: |
  startsWith(github.event.issue.title, '[Note]') ||
  startsWith(github.event.issue.title, '[Article]') ||
  ...
```

This dual approach ensures posts are created even if labels fail to apply.

## Important Notes

1. **Labels must exist before issue creation** - GitHub won't create labels on-the-fly
2. **Issue forms are read-only** - Labels defined in templates are applied automatically IF they exist
3. **Workflows cannot create labels during issue creation** - Label creation requires `issues: write` permission and must happen before issues are created
4. **Title prefix fallback** - The workflow checks title prefixes (`[Note]`, `[Article]`, etc.) when labels are missing

## Additional Resources

- GitHub Documentation: [Creating labels](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels#creating-a-label)
- GitHub Documentation: [Issue form syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)
