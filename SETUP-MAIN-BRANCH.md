# Setting Up the Main Branch

The main branch needs to be created manually due to GitHub permissions. Here are your options:

## Option 1: Via GitHub Web Interface (Easiest)

1. Go to your repository on GitHub: https://github.com/lqdev/TestGHCMS
2. Click the branch dropdown (currently showing `claude/init-project-011CUaSzTMLqmDY2rktLPb1S`)
3. Click **"View all branches"**
4. Find `claude/init-project-011CUaSzTMLqmDY2rktLPb1S`
5. Click the three dots menu (⋯) next to it
6. Select **"Set as default branch"** or **"Rename branch"** to `main`

**OR**

1. Go to **Settings** > **Branches**
2. Under "Default branch", click the switch icon
3. Select `claude/init-project-011CUaSzTMLqmDY2rktLPb1S` as the default
4. Then optionally rename it to `main`

## Option 2: Via Command Line (If you have write access)

```bash
# Make sure you're on the branch with all the code
git checkout claude/init-project-011CUaSzTMLqmDY2rktLPb1S

# Create and push main branch
git checkout -b main
git push -u origin main

# Set main as default via GitHub CLI (if installed)
gh repo edit --default-branch main

# Delete the old branch (optional)
git push origin --delete claude/init-project-011CUaSzTMLqmDY2rktLPb1S
git branch -d claude/init-project-011CUaSzTMLqmDY2rktLPb1S
```

## Option 3: Create a Pull Request

You could also:
1. Create a PR from `claude/init-project-011CUaSzTMLqmDY2rktLPb1S`
2. Set the target to a new `main` branch
3. Merge it to create `main`

## After Setting Main as Default

Once you have a `main` branch set as default:

1. **The deploy workflow will trigger** on pushes to `main` (after you add the workflows from WORKFLOWS.md)
2. **GitHub Pages will deploy** automatically
3. **Your site will be live** at your GitHub Pages URL

## Current State

All your code is safely on: `claude/init-project-011CUaSzTMLqmDY2rktLPb1S`

This branch contains:
- ✅ Complete Eleventy setup
- ✅ All layouts and templates
- ✅ Issue templates
- ✅ Example posts
- ✅ Documentation
- ✅ CSS styling

You just need to make it the default branch (and optionally rename it to `main`).
