import type { Track } from "./types";

export const gitTrack: Track = {
  id: "git",
  title: "Git",
  description: "Master version control with Git",
  longDescription:
    "From first commit to enterprise workflows — learn Git from the ground up and become proficient in the world's most popular version control system.",
  icon: "GitBranch",
  color: "#f05033",
  gradient: "track-git-gradient",
  tags: ["version-control", "collaboration", "workflow"],
  modules: [
    {
      id: "intro-to-git",
      title: "Introduction to Git",
      level: "beginner",
      description: "Understand what Git is, why it matters, and how it fits into your workflow.",
      lessons: [
        {
          id: "what-is-git",
          title: "What is Git?",
          duration: 8,
          type: "lesson",
          description: "Understand the problem Git solves and why version control is essential.",
          objectives: [
            "Explain what version control is and why it matters",
            "Describe the history and philosophy of Git",
            "Differentiate between centralized and distributed VCS",
          ],
          content: `# What is Git?

Git is a **distributed version control system** (DVCS) that tracks changes in files over time and enables multiple people to collaborate on a codebase simultaneously.

## The Problem Git Solves

Imagine you're working on a project and you make a change that breaks everything. Without version control, you'd either:
- Manually undo changes (error-prone)
- Keep dozens of backup copies: \`project-final\`, \`project-final-v2\`, \`project-REAL-final\`
- Hope your teammate hasn't overwritten your work

Git eliminates these problems by giving you a complete, reliable history of every change ever made.

> **Note:** Git tracks changes at the file level — not the directory level. Empty directories are not tracked.

## A Brief History

Git was created by **Linus Torvalds** in 2005 to manage development of the Linux kernel, after the open-source community lost access to the proprietary BitKeeper VCS they'd been using.

Torvalds had specific goals:
- Speed
- Simple design
- Strong support for non-linear development (thousands of parallel branches)
- Fully distributed
- Able to handle large projects like the Linux kernel

## Centralized vs. Distributed

| Centralized (SVN, CVS) | Distributed (Git) |
|------------------------|-------------------|
| Single server holds history | Every developer has full history |
| Requires network to commit | Commit locally, sync later |
| Server outage = no commits | Works offline |
| Single point of failure | Redundant copies everywhere |

## Why Git Won

Git became the industry standard because it's:

- **Fast** — most operations are local, no network needed
- **Safe** — it almost never loses data permanently
- **Flexible** — supports any workflow imaginable
- **Free and open-source** — no licensing concerns

\`\`\`bash
# Check if Git is installed
git --version
# git version 2.44.0
\`\`\`

## Key Concepts at a Glance

- **Repository (repo)** — A directory tracked by Git, containing your files and their full history
- **Commit** — A snapshot of your files at a point in time
- **Branch** — An independent line of development
- **Remote** — A copy of the repository on another machine (e.g., GitHub)

> **Tip:** Git stores snapshots, not differences. Each commit is a complete picture of your files at that moment (with deduplication for unchanged files).

## The Three States

Files in Git exist in one of three states:

\`\`\`
Working Directory  →  Staging Area  →  Repository
   (modified)           (staged)        (committed)
\`\`\`

You'll learn exactly what these mean in the next lessons. For now, remember that Git has a deliberate two-step process: you stage changes, then commit them.
`,
        },
        {
          id: "installing-git",
          title: "Installing Git",
          duration: 5,
          type: "lesson",
          description: "Get Git installed on macOS, Linux, and Windows.",
          content: `# Installing Git

## macOS

**Option 1: Homebrew (recommended)**
\`\`\`bash
brew install git
\`\`\`

**Option 2: Xcode Command Line Tools**
\`\`\`bash
xcode-select --install
\`\`\`

**Option 3: Download from git-scm.com**
Visit the [official Git website](https://git-scm.com/download/mac) and download the installer.

## Linux (Debian/Ubuntu)

\`\`\`bash
sudo apt update
sudo apt install git
\`\`\`

## Linux (Fedora/RHEL)

\`\`\`bash
sudo dnf install git
\`\`\`

## Windows

**Option 1: Git for Windows (recommended)**
Download from [gitforwindows.org](https://gitforwindows.org/). This includes Git Bash, a terminal emulator that lets you use Unix-style commands.

**Option 2: winget**
\`\`\`powershell
winget install --id Git.Git -e --source winget
\`\`\`

## Verify Installation

\`\`\`bash
git --version
# git version 2.44.0
\`\`\`

## First-Time Configuration

Before making your first commit, tell Git who you are:

\`\`\`bash
git config --global user.name "Jane Doe"
git config --global user.email "jane@example.com"
\`\`\`

Set your preferred editor (VS Code shown):
\`\`\`bash
git config --global core.editor "code --wait"
\`\`\`

Set the default branch name to \`main\`:
\`\`\`bash
git config --global init.defaultBranch main
\`\`\`

View your configuration:
\`\`\`bash
git config --list
\`\`\`

> **Note:** The \`--global\` flag applies the setting to all repos on your machine. Omit it to set it only for the current repo.
`,
        },
        {
          id: "git-workflow-overview",
          title: "Git Workflow Overview",
          duration: 10,
          type: "lesson",
          description: "Understand the standard Git workflow from init to push.",
          content: `# Git Workflow Overview

Understanding the standard Git workflow will make all future concepts click faster.

## The Core Loop

\`\`\`
1. Make changes to files
2. Stage the changes you want to include
3. Commit with a descriptive message
4. (Optional) Push to a remote repository
\`\`\`

## Visual Representation

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Working Directory                     │
│  (your actual files — what you see in your editor)      │
└─────────────────────┬───────────────────────────────────┘
                      │ git add
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Staging Area (Index)                  │
│  (snapshot of what your next commit will look like)     │
└─────────────────────┬───────────────────────────────────┘
                      │ git commit
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Local Repository (.git/)              │
│  (complete history of all commits)                      │
└─────────────────────┬───────────────────────────────────┘
                      │ git push
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Remote Repository (GitHub)            │
│  (shared history accessible to your team)               │
└─────────────────────────────────────────────────────────┘
\`\`\`

## Example Workflow

\`\`\`bash
# 1. Initialize a new project
mkdir my-project && cd my-project
git init

# 2. Create a file
echo "# My Project" > README.md

# 3. Stage it
git add README.md

# 4. Commit it
git commit -m "Initial commit: add README"

# 5. Connect to GitHub and push
git remote add origin https://github.com/you/my-project.git
git push -u origin main
\`\`\`

## The Staging Area: Git's Superpower

Most version control systems commit everything at once. Git's staging area lets you build the perfect commit:

\`\`\`bash
# You've changed 5 files, but only 2 are related to the feature you're committing
git add feature-file-1.py feature-file-2.py

# The other 3 files remain unstaged — they'll go in a different commit
git commit -m "feat: add user authentication"

# Now commit the other changes
git add bugfix.py
git commit -m "fix: handle empty username edge case"
\`\`\`

> **Pro tip:** Small, focused commits make code review easier and bugs easier to find. The staging area is what makes this possible.
`,
        },
      ],
    },
    {
      id: "git-fundamentals",
      title: "Git Fundamentals",
      level: "beginner",
      description: "Learn the essential Git commands you'll use every day.",
      lessons: [
        {
          id: "git-init-clone",
          title: "git init & git clone",
          duration: 12,
          type: "lesson",
          description: "Start a new repository or get a copy of an existing one.",
          content: `# git init & git clone

There are two ways to start working with a Git repository: create one from scratch, or clone an existing one.

## git init — Starting Fresh

\`\`\`bash
mkdir my-project
cd my-project
git init
# Initialized empty Git repository in /path/my-project/.git/
\`\`\`

This creates a hidden \`.git/\` directory that contains your entire repository history. **Don't delete this directory** — it is the repository.

\`\`\`bash
ls -la
# drwxr-xr-x  .git/
# -rw-r--r--  README.md
\`\`\`

### What's Inside .git/?

\`\`\`
.git/
├── HEAD          # Points to the current branch
├── config        # Repository-local configuration
├── objects/      # All commits, trees, and blobs (content)
├── refs/         # Branch and tag pointers
│   ├── heads/    # Local branches
│   └── tags/     # Tags
└── hooks/        # Scripts that run on Git events
\`\`\`

## git clone — Copy an Existing Repo

\`\`\`bash
# Clone from GitHub (HTTPS)
git clone https://github.com/torvalds/linux.git

# Clone from GitHub (SSH — requires SSH key setup)
git clone git@github.com:torvalds/linux.git

# Clone into a custom directory name
git clone https://github.com/user/repo.git my-custom-name

# Shallow clone (only latest commit — faster for large repos)
git clone --depth=1 https://github.com/user/repo.git
\`\`\`

Cloning does the following automatically:
1. Creates the local directory
2. Initializes \`.git/\`
3. Downloads all history
4. Sets up the \`origin\` remote pointing to the source URL
5. Checks out the default branch

## Verify the Setup

\`\`\`bash
# Check the remote configuration
git remote -v
# origin  https://github.com/user/repo.git (fetch)
# origin  https://github.com/user/repo.git (push)

# Check which branch you're on
git branch
# * main
\`\`\`

> **Warning:** Running \`git init\` inside an existing repo (especially your home directory) creates a nested repository. Always check with \`git status\` before running \`git init\`.
`,
        },
        {
          id: "add-commit-status",
          title: "add, commit & status",
          duration: 15,
          type: "lesson",
          description: "Stage changes and create commits — the core Git workflow.",
          content: `# add, commit & status

These three commands form the heart of every Git workflow.

## git status — Your Situation Report

Always the first command to run:

\`\`\`bash
git status
\`\`\`

\`\`\`
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        server.js
        package.json

no changes added to commit (use "git add" and/or "git commit -a")
\`\`\`

Status shows you three categories:
- **Changes staged for commit** — ready to be committed
- **Changes not staged** — modified tracked files, not yet staged
- **Untracked files** — Git doesn't know about these yet

## git add — Staging Changes

\`\`\`bash
# Stage a specific file
git add README.md

# Stage multiple files
git add server.js package.json

# Stage all changes in current directory (and subdirectories)
git add .

# Stage parts of a file interactively (patch mode)
git add -p README.md

# Stage all tracked, modified files (but not untracked)
git add -u
\`\`\`

> **Warning:** \`git add .\` stages everything including large files, secrets, and build artifacts. Use \`.gitignore\` to prevent accidentally staging unwanted files.

## git commit — Saving a Snapshot

\`\`\`bash
# Commit with a message
git commit -m "Add user authentication module"

# Open editor for a longer commit message
git commit

# Stage all tracked files and commit in one step
git commit -am "Fix typo in README"
\`\`\`

### Writing Great Commit Messages

A good commit message follows this convention:

\`\`\`
<type>: <short summary> (50 chars max)
<blank line>
<optional body — explain what and why, not how>
<optional footer — issue references, breaking changes>
\`\`\`

Common types: \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\`, \`chore\`

**Bad:**
\`\`\`
fixed stuff
\`\`\`

**Good:**
\`\`\`
fix: prevent race condition in user session handler

Sessions were being created before the DB write completed.
This adds an await to ensure sequential execution.

Closes #42
\`\`\`

## git log — View History

\`\`\`bash
# Full log
git log

# Compact one-line per commit
git log --oneline

# Show graph with branches
git log --oneline --graph --all

# Last 5 commits
git log -5

# Commits by a specific author
git log --author="Jane"
\`\`\`
`,
        },
        {
          id: "git-log-diff",
          title: "git log & git diff",
          duration: 10,
          type: "lesson",
          description: "Inspect your history and understand exactly what changed.",
          content: `# git log & git diff

## git log — Exploring History

\`\`\`bash
# Default log (most recent first)
git log

# Each commit on one line
git log --oneline

# Example output:
# a1b2c3d feat: add login form
# 9f8e7d6 fix: handle null user edge case
# 3c4d5e6 docs: update README setup instructions
\`\`\`

### Filtering the Log

\`\`\`bash
# Commits touching a specific file
git log -- README.md

# Commits in a date range
git log --after="2024-01-01" --before="2024-06-01"

# Search commit messages
git log --grep="authentication"

# Commits that added or removed a string
git log -S "function login"

# Pretty format
git log --pretty=format:"%h %an %ar %s"
# a1b2c3d Jane Doe 2 days ago feat: add login form
\`\`\`

### The Commit Object

Each commit contains:
- A unique SHA-1 hash (e.g., \`a1b2c3d4e5f6...\`)
- Author name and email
- Timestamp
- Commit message
- Pointer to parent commit(s)
- A snapshot of all files

\`\`\`bash
# Show a specific commit's details
git show a1b2c3d

# Show what files changed
git show --stat a1b2c3d
\`\`\`

## git diff — What Changed?

\`\`\`bash
# Changes in working directory (not yet staged)
git diff

# Changes that are staged (ready to commit)
git diff --staged
# or: git diff --cached

# Diff between two commits
git diff HEAD~3 HEAD

# Diff between two branches
git diff main feature-login

# Diff for a specific file
git diff -- README.md
\`\`\`

### Reading a Diff

\`\`\`diff
diff --git a/server.js b/server.js
index 1234abc..5678def 100644
--- a/server.js
+++ b/server.js
@@ -10,7 +10,8 @@ app.listen(3000)
 const express = require('express')
 const app = express()

-app.get('/', (req, res) => res.send('Hello'))
+app.get('/', (req, res) => {
+  res.json({ message: 'Hello, World!' })
+})

 app.listen(3000)
\`\`\`

- Lines with \`-\` (red) were **removed**
- Lines with \`+\` (green) were **added**
- Lines without prefix are context (unchanged)
- \`@@\` shows which lines the chunk starts at
`,
        },
      ],
    },
    {
      id: "working-with-changes",
      title: "Working with Changes",
      level: "beginner",
      description: "Control the staging area, undo mistakes, and manage what Git ignores.",
      lessons: [
        {
          id: "staging-area",
          title: "The Staging Area in Depth",
          duration: 12,
          type: "lesson",
          description: "Master the staging area to craft precise, meaningful commits.",
          content: `# The Staging Area in Depth

The staging area (also called the "index") is what makes Git's workflow different from all other version control systems. Understanding it unlocks Git's full power.

## The Three States, Revisited

\`\`\`
┌──────────────────┐    git add     ┌──────────────────┐   git commit  ┌──────────────┐
│ Working Directory│ ────────────→  │  Staging Area    │ ───────────→  │  Repository  │
│ (your edits)     │                │  (next commit)   │               │  (.git/)     │
└──────────────────┘                └──────────────────┘               └──────────────┘
         ↑                                                                      │
         └──────────────────────── git checkout ─────────────────────────────┘
\`\`\`

## Staging Partial Changes (git add -p)

This is one of Git's most powerful features — stage only some changes from a file:

\`\`\`bash
git add -p server.js
\`\`\`

Git will show you each "hunk" (change block) and ask what to do:

\`\`\`
@@ -15,6 +15,8 @@ app.use(express.json())
+// Add health check endpoint
+app.get('/health', (req, res) => res.json({ status: 'ok' }))

 app.get('/users', async (req, res) => {
Stage this hunk [y,n,q,a,d,s,?]?
\`\`\`

Options:
- \`y\` — stage this hunk
- \`n\` — skip this hunk
- \`s\` — split into smaller hunks
- \`e\` — manually edit the hunk
- \`q\` — quit (stage nothing more)
- \`a\` — stage this and all remaining hunks

## Unstaging Files

\`\`\`bash
# Unstage a file (keep changes in working directory)
git restore --staged README.md

# Unstage everything
git restore --staged .

# Older syntax (still works)
git reset HEAD README.md
\`\`\`

## Discarding Working Directory Changes

\`\`\`bash
# Discard changes to a file (DESTRUCTIVE — cannot undo)
git restore README.md

# Discard all unstaged changes (DESTRUCTIVE)
git restore .
\`\`\`

> **Warning:** \`git restore\` (without \`--staged\`) permanently discards your working directory changes. There's no undo. Only do this if you're sure.

## Checking What's Staged

\`\`\`bash
# See staged changes as a diff
git diff --staged

# See staged files only (no diff)
git status --short
# M  README.md    ← modified, staged
#  M server.js   ← modified, NOT staged
# ?? new-file.js ← untracked
\`\`\`

The two characters in \`--short\` output show staging area status (left) and working directory status (right).
`,
        },
        {
          id: "gitignore",
          title: ".gitignore",
          duration: 8,
          type: "lesson",
          description: "Tell Git which files to ignore — secrets, builds, and clutter.",
          content: `# .gitignore

The \`.gitignore\` file tells Git which files and directories to ignore. Files matching patterns in \`.gitignore\` won't appear in \`git status\` and can't be accidentally staged.

## Creating a .gitignore

\`\`\`bash
touch .gitignore
git add .gitignore
git commit -m "chore: add .gitignore"
\`\`\`

## Pattern Syntax

\`\`\`gitignore
# Comments start with #

# Ignore specific files
.env
*.log
npm-debug.log

# Ignore directories (trailing slash)
node_modules/
dist/
build/
.cache/

# Ignore by extension
*.pyc
*.class
*.o

# Ignore nested paths
**/coverage/
src/**/*.test.js.snap

# Negate a pattern (track this even if a parent pattern ignores it)
!src/important.log
\`\`\`

## Common .gitignore Patterns by Language/Tool

**Node.js:**
\`\`\`gitignore
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
\`\`\`

**Python:**
\`\`\`gitignore
__pycache__/
*.pyc
*.pyo
.venv/
venv/
.env
*.egg-info/
dist/
\`\`\`

**General:**
\`\`\`gitignore
# OS files
.DS_Store
Thumbs.db
desktop.ini

# Editor files
.vscode/
.idea/
*.swp
*~

# Secrets (ALWAYS ignore these)
.env
.env.*
secrets.json
credentials.json
*.pem
*.key
\`\`\`

## Global .gitignore

For patterns that apply to all your projects (like OS/editor files):

\`\`\`bash
git config --global core.excludesfile ~/.gitignore_global
\`\`\`

Then add patterns to \`~/.gitignore_global\`.

## When .gitignore Doesn't Work

If a file was already tracked and you add it to \`.gitignore\`, Git will keep tracking it. You need to untrack it first:

\`\`\`bash
# Remove from tracking (keep local file)
git rm --cached .env

# Remove directory from tracking
git rm -r --cached node_modules/

# Then commit the removal
git commit -m "chore: remove accidentally tracked secrets"
\`\`\`

> **Tip:** GitHub maintains a collection of useful templates at github.com/github/gitignore. Use these as starting points.
`,
        },
        {
          id: "undoing-changes",
          title: "Undoing Changes",
          duration: 15,
          type: "lesson",
          description: "Fix mistakes at every stage — working directory, staging, and history.",
          content: `# Undoing Changes

Git gives you multiple ways to undo — the right choice depends on where the change is and whether others have seen it.

## The Undo Decision Tree

\`\`\`
Did you commit?
├── No → In staging? → git restore / git restore --staged
└── Yes → Did you push?
    ├── No → git reset (rewrite history safely)
    └── Yes → git revert (safe, creates new commit)
\`\`\`

## Before Committing

\`\`\`bash
# Unstage a file (keep changes)
git restore --staged README.md

# Discard working directory changes (DESTRUCTIVE)
git restore README.md

# Discard ALL unstaged changes
git restore .
\`\`\`

## Amending the Last Commit

Fix the most recent commit (message, forgotten files, or both):

\`\`\`bash
# Change just the commit message
git commit --amend -m "feat: add user login with OAuth support"

# Add a forgotten file to the last commit
git add forgot-this.js
git commit --amend --no-edit  # keeps the same message

# Change both files and message
git add extra-file.js
git commit --amend -m "feat: complete OAuth login implementation"
\`\`\`

> **Warning:** \`--amend\` rewrites the last commit. Only do this if the commit hasn't been pushed to a shared branch.

## git reset — Rewriting History (local only)

\`\`\`bash
# Move HEAD back N commits, keep changes staged
git reset --soft HEAD~1

# Move HEAD back N commits, keep changes in working directory (DEFAULT)
git reset HEAD~1
# or: git reset --mixed HEAD~1

# Move HEAD back N commits, DISCARD all changes (DESTRUCTIVE)
git reset --hard HEAD~1

# Reset to a specific commit hash
git reset --hard abc1234
\`\`\`

| Mode | Commit | Staging Area | Working Directory |
|------|--------|--------------|-------------------|
| \`--soft\` | undo | unchanged | unchanged |
| \`--mixed\` | undo | cleared | unchanged |
| \`--hard\` | undo | cleared | cleared |

## git revert — Safe Public Undo

Creates a new commit that undoes a previous commit's changes. Safe for shared branches:

\`\`\`bash
# Revert the most recent commit
git revert HEAD

# Revert a specific commit (creates a new "revert" commit)
git revert abc1234

# Revert without opening an editor
git revert HEAD --no-edit
\`\`\`

\`\`\`
Before: A → B → C  (C is the bad commit)
After:  A → B → C → D  (D reverts C's changes)
\`\`\`

## Recovering "Lost" Commits

Even after \`git reset --hard\`, commits aren't immediately deleted. Git's reflog records every HEAD movement:

\`\`\`bash
# View reflog
git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~1
# 9f8e7d6 HEAD@{1}: commit: feat: add OAuth login
# 3c4d5e6 HEAD@{2}: commit: fix: handle null user

# Recover by resetting to the "lost" commit
git reset --hard 9f8e7d6
\`\`\`

Git keeps unreachable commits for ~30 days before garbage collection. You almost always can recover from mistakes.
`,
        },
      ],
    },
    {
      id: "branching-basics",
      title: "Branching Basics",
      level: "beginner",
      description: "Create branches to develop features in isolation and merge them back.",
      lessons: [
        {
          id: "creating-branches",
          title: "Creating & Switching Branches",
          duration: 12,
          type: "lesson",
          description: "Use branches to work on features without disrupting main.",
          content: `# Creating & Switching Branches

Branches are one of Git's most powerful features. A branch is simply a lightweight, movable pointer to a commit.

## What is a Branch?

\`\`\`
main:    A → B → C → D
                      ↑
                     HEAD
\`\`\`

When you create a branch, you create a new pointer:

\`\`\`
main:    A → B → C → D
                      ↑
feature: (same pointer, initially)
\`\`\`

As you commit on the feature branch:

\`\`\`
main:    A → B → C → D
                      \\
feature:               E → F → G
                                ↑
                               HEAD
\`\`\`

## Creating Branches

\`\`\`bash
# Create a branch (stays on current branch)
git branch feature-login

# Create AND switch to the branch
git switch -c feature-login
# older syntax: git checkout -b feature-login

# Create a branch from a specific commit
git switch -c hotfix abc1234

# Create a branch tracking a remote branch
git switch -c feature-login origin/feature-login
\`\`\`

## Switching Branches

\`\`\`bash
# Switch to an existing branch
git switch main
# older syntax: git checkout main

# Switch to the previous branch
git switch -

# List all branches (* = current)
git branch
# * feature-login
#   main
#   bugfix-auth

# List branches with last commit
git branch -v
# * feature-login  a1b2c3d feat: add login form
#   main           9f8e7d6 fix: handle null user
\`\`\`

## Naming Branches

Use descriptive, consistent names:

\`\`\`bash
# Good patterns
feature/user-authentication
feature/JIRA-123-add-login
fix/null-pointer-in-auth
hotfix/critical-security-patch
release/2.1.0
docs/update-api-reference
chore/upgrade-dependencies
\`\`\`

## Branch Safety

When you switch branches, Git updates your working directory to match that branch's state. Before switching:

\`\`\`bash
# Check for uncommitted changes
git status

# If you have changes, either:
# 1. Commit them
git add . && git commit -m "WIP: partial work"

# 2. Stash them (covered in intermediate module)
git stash

# 3. Discard them (DESTRUCTIVE)
git restore .
\`\`\`
`,
        },
        {
          id: "merging-branches",
          title: "Merging Branches",
          duration: 15,
          type: "lesson",
          description: "Combine your branch's work back into main.",
          content: `# Merging Branches

After completing work on a feature branch, you merge it back into the main branch.

## git merge

\`\`\`bash
# Switch to the target branch (the one receiving changes)
git switch main

# Merge the feature branch
git merge feature-login
\`\`\`

## Fast-Forward Merge

When the target branch hasn't moved since you branched off, Git does a "fast-forward" — it just moves the pointer forward:

\`\`\`
Before:                After:
main: A → B → C        main: A → B → C → D → E
              \\                                ↑
feature:       D → E   feature: (still at E)
\`\`\`

\`\`\`bash
git merge feature-login
# Updating c123456..e789abc
# Fast-forward
#  login.js | 42 ++++++++++++++++++++++
\`\`\`

## Three-Way Merge

When both branches have new commits, Git creates a merge commit:

\`\`\`
Before:         After:
main: A → B → C → D → M  (merge commit)
              \\         /
feature:       E → F → G
\`\`\`

\`\`\`bash
git merge feature-login
# Merge made by the 'ort' strategy.
#  login.js | 42 ++++++++++++++++++++++
# 1 file changed, 42 insertions(+)
\`\`\`

## Resolving Merge Conflicts

A conflict occurs when the same line was changed differently on both branches:

\`\`\`bash
git merge feature-login
# Auto-merging server.js
# CONFLICT (content): Merge conflict in server.js
# Automatic merge failed; fix conflicts and then commit the result.
\`\`\`

Open the conflicting file — Git marks conflicts like this:

\`\`\`javascript
<<<<<<< HEAD (main branch — your current branch)
const PORT = 3000;
=======
const PORT = process.env.PORT || 8080;
>>>>>>> feature-login (the branch being merged)
\`\`\`

**Resolve by editing the file** to the correct final state:

\`\`\`javascript
const PORT = process.env.PORT || 3000;
\`\`\`

Then mark as resolved and complete the merge:

\`\`\`bash
# Stage the resolved file
git add server.js

# Complete the merge
git commit
# (Git prepopulates a merge commit message)
\`\`\`

## Merge Strategies

\`\`\`bash
# Always create a merge commit (even for fast-forwards)
git merge --no-ff feature-login

# Squash all feature commits into one (before merging)
git merge --squash feature-login
git commit -m "feat: add user login (#42)"

# Abort a merge in progress
git merge --abort
\`\`\`

> **Tip:** Many teams use \`--no-ff\` to preserve a record that a feature branch existed, which makes the history easier to understand.

## Deleting Merged Branches

After merging, branches are just pointers — they cost almost nothing, but cleaning up keeps things organized:

\`\`\`bash
# Delete a merged branch
git branch -d feature-login

# Force delete (even if not merged)
git branch -D feature-login

# Delete a remote tracking branch
git push origin --delete feature-login
\`\`\`
`,
        },
      ],
    },
    {
      id: "remote-repositories",
      title: "Remote Repositories",
      level: "intermediate",
      description: "Push, pull, and collaborate using GitHub and other remote hosts.",
      lessons: [
        {
          id: "github-basics",
          title: "GitHub & Remote Basics",
          duration: 15,
          type: "lesson",
          description: "Connect your local repository to GitHub and collaborate with others.",
          content: `# GitHub & Remote Basics

A **remote** is a version of your repository hosted on the internet or another network. GitHub is the most popular remote host, but others include GitLab, Bitbucket, and self-hosted options.

## git remote

\`\`\`bash
# List remotes
git remote -v
# origin  https://github.com/you/repo.git (fetch)
# origin  https://github.com/you/repo.git (push)

# Add a remote
git remote add origin https://github.com/you/repo.git

# Add a second remote (e.g., upstream of a fork)
git remote add upstream https://github.com/original/repo.git

# Change a remote URL
git remote set-url origin git@github.com:you/repo.git

# Remove a remote
git remote remove upstream
\`\`\`

## git push — Sending Commits

\`\`\`bash
# Push current branch to origin
git push

# Push and set tracking (-u = --set-upstream)
git push -u origin main

# Push a specific branch
git push origin feature-login

# Push all branches
git push --all origin

# Push tags
git push --tags
\`\`\`

After \`-u\`, future \`git push\` commands know where to push without specifying the remote and branch.

## git pull — Getting Updates

\`\`\`bash
# Pull changes from tracked remote branch
git pull

# Pull from a specific remote/branch
git pull origin main

# Pull with rebase instead of merge
git pull --rebase origin main
\`\`\`

\`git pull\` is shorthand for \`git fetch\` + \`git merge\`.

## git fetch — Get Updates Without Merging

\`\`\`bash
# Download updates from origin (doesn't touch working directory)
git fetch

# Download from all remotes
git fetch --all

# Download a specific remote
git fetch upstream
\`\`\`

After fetching, you can inspect before merging:

\`\`\`bash
git fetch origin
git log HEAD..origin/main --oneline  # commits on remote not in local
git diff HEAD origin/main            # diff between local and remote
git merge origin/main                # merge when ready
\`\`\`

## HTTPS vs SSH

**HTTPS** — Easier setup, requires credentials each time (or credential manager):
\`\`\`
https://github.com/user/repo.git
\`\`\`

**SSH** — Requires one-time key setup, more convenient long-term:
\`\`\`
git@github.com:user/repo.git
\`\`\`

Setting up SSH:
\`\`\`bash
# Generate an SSH key
ssh-keygen -t ed25519 -C "your@email.com"

# Copy the public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH Keys → New SSH Key
# Test the connection
ssh -T git@github.com
# Hi username! You've successfully authenticated.
\`\`\`
`,
        },
      ],
    },
    {
      id: "advanced-git",
      title: "Advanced Git",
      level: "advanced",
      description: "Rebase, cherry-pick, stash, and Git internals for power users.",
      lessons: [
        {
          id: "git-rebase",
          title: "git rebase",
          duration: 20,
          type: "lesson",
          description: "Rewrite history cleanly for a linear commit graph.",
          content: `# git rebase

Rebase is the most powerful — and most misunderstood — Git command. It moves or replays commits onto a different base.

## Merge vs Rebase

\`\`\`
# After merge:
main:    A → B → C ─────────── M
                   \\           /
feature:            D → E → F

# After rebase:
main:    A → B → C → D' → E' → F'
\`\`\`

Rebase creates a **linear history** by replaying your branch's commits on top of the current target.

## Basic Rebase

\`\`\`bash
# Move feature-login to the tip of main
git switch feature-login
git rebase main
\`\`\`

This replays each commit from \`feature-login\` on top of \`main\`, creating new commits (D', E', F').

## Interactive Rebase

The real power — rewrite, reorder, squash, or delete commits:

\`\`\`bash
# Interactively edit last 4 commits
git rebase -i HEAD~4
\`\`\`

This opens an editor:
\`\`\`
pick a1b2c3d feat: add login form
pick 9f8e7d6 WIP: partial implementation
pick 3c4d5e6 fix: typo
pick 7d8e9f0 fix: another typo

# Commands:
# p, pick   = use commit as-is
# r, reword = use commit but edit message
# e, edit   = pause and amend the commit
# s, squash = meld into previous commit
# f, fixup  = like squash, discard this commit's message
# d, drop   = remove commit
\`\`\`

Example — squash "WIP" and typo commits:
\`\`\`
pick a1b2c3d feat: add login form
squash 9f8e7d6 WIP: partial implementation
fixup 3c4d5e6 fix: typo
fixup 7d8e9f0 fix: another typo
\`\`\`

Result: one clean commit with the message from the first pick.

## git cherry-pick

Apply a specific commit from another branch:

\`\`\`bash
# Apply one commit
git cherry-pick abc1234

# Apply a range of commits
git cherry-pick abc1234..def5678

# Apply without committing (let you inspect first)
git cherry-pick --no-commit abc1234
\`\`\`

Use cases:
- Backport a bug fix to a release branch
- Grab a specific feature from an experimental branch
- Recover accidentally deleted commits

## git stash

Temporarily save uncommitted changes to a stack:

\`\`\`bash
# Save changes (tracked files only)
git stash

# Save with a descriptive name
git stash push -m "WIP: half-finished login form"

# Include untracked files
git stash -u

# List stashes
git stash list
# stash@{0}: On feature-login: WIP: half-finished login form
# stash@{1}: On main: experiment with caching

# Apply most recent stash (keeps stash)
git stash apply

# Apply and remove from stash stack
git stash pop

# Apply a specific stash
git stash apply stash@{1}

# Show stash diff
git stash show -p stash@{0}

# Drop a stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
\`\`\`

## The Golden Rule of Rebase

> **Never rebase commits that exist on a public shared branch.**

Rebasing rewrites commit hashes. If others have based work on those commits, you'll create diverging histories that are painful to resolve.

Safe to rebase:
- Your local feature branch (before pushing)
- A branch only you are working on

Unsafe:
- \`main\`, \`develop\` or any shared branch
- Any branch others have pulled
`,
        },
      ],
    },
    {
      id: "collaboration-workflows",
      title: "Collaboration Workflows",
      level: "intermediate",
      description: "Work effectively in teams using pull requests, code reviews, and branching strategies.",
      lessons: [
        {
          id: "pull-requests",
          title: "Pull Requests & Code Review",
          duration: 14,
          type: "lesson",
          description: "Learn how to create, review, and merge pull requests effectively.",
          objectives: [
            "Create well-structured pull requests",
            "Write actionable review comments",
            "Use GitHub review features (approve, request changes)",
            "Resolve merge conflicts in PRs",
          ],
          content: `# Pull Requests & Code Review

## What is a Pull Request?

A **Pull Request (PR)** is a proposal to merge changes from one branch into another. It's the primary collaboration mechanism on GitHub — it triggers review, CI checks, and discussion before changes land on the main branch.

## Creating a Great PR

### 1. Keep it Focused

One PR = one thing. Smaller PRs get reviewed faster and are easier to reason about.

\`\`\`bash
# Feature branch from main
git checkout -b feat/add-health-endpoint

# Make changes, commit atomically
git add src/health.ts
git commit -m "feat: add /health endpoint returning service status"

git add tests/health.test.ts
git commit -m "test: add integration tests for /health endpoint"

# Push and open PR
git push -u origin feat/add-health-endpoint
\`\`\`

### 2. Write a Clear Description

A good PR description includes:
- **What** — what changed and why
- **How to test** — steps to verify the change
- **Screenshots** — for UI changes
- **References** — link to issue/ticket

### 3. Self-review First

Before requesting review, review your own diff:

\`\`\`bash
# See exactly what you're proposing
git diff main...HEAD

# Interactive staging to review hunks
git add -p
\`\`\`

## Code Review Etiquette

### As a Reviewer

- **Be specific** — point to the line, explain why it's a concern
- **Be constructive** — suggest alternatives, not just problems
- **Distinguish blocking issues from nits** — prefix with \`nit:\` for minor style issues
- **Approve when satisfied** — don't withhold approval over nits

### As an Author

- **Respond to all comments** — even if just "done" or "agreed, will fix"
- **Don't take it personally** — reviewers critique code, not you
- **Explain your reasoning** — if you disagree, explain clearly

## Reviewing in GitHub

\`\`\`bash
# Fetch a PR locally to test it
gh pr checkout 42

# Or manually
git fetch origin pull/42/head:pr-42
git checkout pr-42
\`\`\`

## Resolving Conflicts

When your branch is behind main, GitHub shows a conflict:

\`\`\`bash
# Update your branch with latest main
git checkout feat/add-health-endpoint
git fetch origin
git merge origin/main

# Or rebase (cleaner history)
git rebase origin/main

# Resolve conflicts, then continue
git add src/conflicted-file.ts
git rebase --continue

# Push the updated branch
git push --force-with-lease
\`\`\`

> **Use \`--force-with-lease\` instead of \`--force\`** — it fails if someone else pushed to the branch, preventing accidental overwrites.

## Merge Strategies

| Strategy | Command | When |
|----------|---------|------|
| Merge commit | Default | Preserve full history |
| Squash and merge | GitHub button | Clean main, single commit per PR |
| Rebase and merge | GitHub button | Linear history, preserve commits |
`,
        },
        {
          id: "branching-strategies",
          title: "Branching Strategies",
          duration: 12,
          type: "lesson",
          description: "Choose and implement the right branching model for your team.",
          objectives: [
            "Understand trunk-based development vs GitFlow",
            "Implement feature flags for large changes",
            "Use branch protection rules",
            "Manage release branches",
          ],
          content: `# Branching Strategies

## Trunk-Based Development (Recommended)

All developers commit to \`main\` (the "trunk") frequently — multiple times per day. Feature flags hide incomplete work.

\`\`\`
main ●───●───●───●───●───●
      ↑   ↑   ↑   ↑
   short-lived feature branches (< 2 days)
\`\`\`

**Benefits:**
- Continuous integration is real — no long-lived divergence
- Conflicts discovered immediately
- Deployable at any time
- Works best with CI/CD and feature flags

\`\`\`bash
# Short-lived feature branch
git checkout -b feat/update-login-form
# ... make changes ...
git push -u origin feat/update-login-form
# Open PR, get review, merge — same day
\`\`\`

## GitFlow (for release-oriented projects)

\`\`\`
main      ●──────────────────────●──●
           ↑                    ↑  ↑
develop   ●──●──●──●──●──●──●──●
                ↑           ↑
           feature/*    release/1.2
\`\`\`

Branches:
- \`main\` — production only, tagged releases
- \`develop\` — integration branch
- \`feature/*\` — new features (from develop)
- \`release/*\` — stabilization (from develop, merged to both main and develop)
- \`hotfix/*\` — production fixes (from main, merged to both)

GitFlow is heavier overhead but suits teams with scheduled release cycles (e.g., mobile apps, packaged software).

## Branch Naming Conventions

\`\`\`bash
feat/add-oauth-login
fix/null-pointer-exception-in-parser
chore/upgrade-dependencies
docs/update-api-reference
refactor/extract-auth-middleware
\`\`\`

## Branch Protection Rules (GitHub)

Enforce quality on \`main\`:
- Require pull request before merging
- Require status checks (CI must pass)
- Require at least N approvals
- Require linear history (no merge commits)
- Restrict who can push directly

\`\`\`bash
# Using GitHub CLI
gh api repos/{owner}/{repo}/branches/main/protection \\
  --method PUT \\
  -f required_status_checks[strict]=true \\
  -f required_pull_request_reviews[required_approving_review_count]=1 \\
  -f enforce_admins=false
\`\`\`

## Feature Flags

Ship incomplete features hidden behind a flag:

\`\`\`typescript
// Simple env-based feature flag
const NEW_CHECKOUT = process.env.FEATURE_NEW_CHECKOUT === "true";

function renderCheckout() {
  if (NEW_CHECKOUT) {
    return <NewCheckoutFlow />;
  }
  return <LegacyCheckout />;
}
\`\`\`

Feature flags let you merge to \`main\` continuously without exposing unfinished features — the heart of trunk-based development.
`,
        },
      ],
    },
    {
      id: "git-internals",
      title: "Git Internals",
      level: "advanced",
      description: "Understand how Git works under the hood.",
      lessons: [
        {
          id: "git-objects",
          title: "Git Object Model",
          duration: 16,
          type: "lesson",
          description: "Explore blobs, trees, commits, and tags — the four object types that make Git tick.",
          objectives: [
            "Understand the four Git object types",
            "Inspect objects with git cat-file",
            "Understand how commits form a DAG",
            "Use git reflog to recover lost work",
          ],
          content: `# Git Object Model

Git is fundamentally a **content-addressable filesystem**. Every piece of data is stored as an object, identified by its SHA-1 hash.

## The Four Object Types

| Type | Description |
|------|-------------|
| **blob** | File content (no filename, no metadata) |
| **tree** | Directory: maps names → blob/tree SHA |
| **commit** | Snapshot: points to tree + parent commits |
| **tag** | Annotated tag pointing to a commit |

## Blobs

\`\`\`bash
# Every unique file content is stored once, regardless of filename
echo "hello" | git hash-object -w --stdin
# 8c7e5a667f1b771847fe88c01c3de34413a1b220

# Inspect a blob
git cat-file -t 8c7e5a
# blob
git cat-file -p 8c7e5a
# hello
\`\`\`

## Trees

\`\`\`bash
# View the tree for the current commit
git cat-file -p HEAD^{tree}
# 100644 blob a1b2c3...  README.md
# 040000 tree d4e5f6...  src
# 100644 blob 789abc...  package.json

# The tree under src/
git cat-file -p d4e5f6
# 100644 blob 111222...  index.ts
# 100644 blob 333444...  utils.ts
\`\`\`

## Commits

\`\`\`bash
# Inspect a commit object
git cat-file -p HEAD
# tree abc123...
# parent def456...
# author Alice <alice@example.com> 1710000000 +0000
# committer Alice <alice@example.com> 1710000000 +0000
#
# feat: add health endpoint
\`\`\`

Each commit points to:
- One **tree** (the complete project snapshot)
- Zero or more **parent** commits (zero for the first commit, two for merges)

## The Directed Acyclic Graph (DAG)

\`\`\`
C3 ← C4 ← C5 (main)
      ↑
      C4' ← C6 (feature)
\`\`\`

Commits form a DAG — each commit points backward to its parent(s). Branches are just lightweight **named pointers** (refs) to commits.

\`\`\`bash
# See what a branch ref points to
cat .git/refs/heads/main
# a1b2c3d4...

# HEAD points to the current branch
cat .git/HEAD
# ref: refs/heads/main
\`\`\`

## Recovering Lost Work with Reflog

\`\`\`bash
# git reflog records every movement of HEAD
git reflog
# abc123 HEAD@{0}: commit: add feature
# def456 HEAD@{1}: checkout: moving from main to feature
# 789abc HEAD@{2}: reset: moving to HEAD~1

# Recover a commit you accidentally reset
git checkout -b recovery HEAD@{2}
# or
git reset --hard HEAD@{2}
\`\`\`

> **The reflog is your safety net.** Almost nothing in Git is truly gone — the reflog keeps a log of every HEAD position for 90 days.

## Pack Files

Git periodically runs \`git gc\` (garbage collection) which:
1. Compresses loose objects into **pack files** (\`.git/objects/pack/\`)
2. Uses delta compression to store similar objects efficiently
3. Removes unreachable objects older than the configured threshold

\`\`\`bash
# Manually trigger GC / repack
git gc --aggressive

# Count loose vs packed objects
git count-objects -v
\`\`\`
`,
        },
      ],
    },
  ],
};
