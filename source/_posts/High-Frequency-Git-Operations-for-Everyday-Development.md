---
title: High-Frequency Git Operations for Everyday Development
date: 2026-02-07
categories:
  - DevOps, SysAdmin
tags:
  - Reference
---

Here are some of the most frequent Git operations you may need in day-to-day development.

## Basic Git Operations

### Connect Your Local Folder to a GitHub Repository

You have an existing local folder with files and want to connect it to an already existing GitHub repository.

Initialize Git in your folder:

```bash
git init
```

Add your GitHub repository (replace URL with your repo):

```bash
git remote add origin https://github.com/username/repo.git
```

Fetch remote history:

```bash
git fetch origin
```

Merge remote and local files, allowing unrelated histories *(change `main` to your repo's default branch if necessary)*:

```bash
git pull origin main --allow-unrelated-histories
```

If you see an error like:

> The following untracked working tree files would be overwritten by merge...

We recommend:

```bash
# 1. Move local conflicting files to a temporary directory
# For example, back them up to a non-conflicting `backup` folder in the current directory
mkdir backup
mv conflicting-file-1 conflicting-file-2 backup/

# 2. Try pulling the remote repository content again
git pull origin main --allow-unrelated-histories

# 3. Manually merge the backed up files into the pulled files
```

Commit after resolving all conflicts:

```bash
git add .
git commit -m "Merge local files with remote repository"
```

Push to the remote repository (if needed):

```bash
git push --set-upstream origin main
```

**The `--set-upstream origin main` option is only needed for the first push; you don't need it afterward.**

### List Remotes

```bash
git remote -v
```

This will display a list of remotes with their URLs, e.g.:

```
origin  https://github.com/example/repo.git (fetch)
origin  https://github.com/example/repo.git (push)
```

### List Branches

List local branches:

```bash
git branch
```

List remote branches:

```bash
git branch -r
```

List local and remote branches:

```bash
git branch -a
```

### List Commits in Branches

To list commits in the branch `feature`:

```sh
git log feature
```

### List What Files `git add .` Would Stage

```bash
git status --short
```

Example Output:

```
M file1.txt       # modified file
?? newfile.txt     # untracked file
```

Breakdown:

- `M` = Modified (but not staged)
- `??` = Untracked (new files)

## Keeping Your Repository in Sync

### Keep a Fork Updated with an Original Repository

If you've forked a repository on GitHub, your fork won't automatically stay up to date as the original repository changes. By default, your fork links only to itself (as `origin`), and **not** to the original repository. To pull in updates from the source, you'll want to add the original repository as a new remote, commonly named `upstream`.

Here's a quick guide to achieve this:

First, go to the original repository (not your fork) on GitHub. Copy the repository's clone URL (use either HTTPS or SSH, depending on your setup).

Open your terminal and navigate to your local copy of the forked repository. Then add the original as a new remote called `upstream`:

```bash
git remote add upstream https://github.com/original-owner/original-repo.git
```
*(Replace the URL above with the actual URL of the original repository.)*

To make sure everything is set up correctly, run:

```bash
git remote -v
```

You should see output similar to:

```
origin    https://github.com/your-username/your-fork.git (fetch)
origin    https://github.com/your-username/your-fork.git (push)
upstream  https://github.com/original-owner/original-repo.git (fetch)
upstream  https://github.com/original-owner/original-repo.git (push)
```

You can now fetch all the latest branches and updates from the original repository using:

```bash
git fetch upstream
```

### Make Your Current Branch Match the Latest State of the Same Branch on a Remote

First, fetch the latest objects from the remote:

```bash
git fetch <remote-name>
```

Check the current stage of your repository (what changes you have):

```bash
git status
```

Make sure you are happy to lose these changes before performing the following destructive operations.

Hard reset your branch:

```bash
git reset --hard <remote-name>/<branch-name>
```

Removed all untracked files and folders:

```bash
git clean -fd
```

- `-f` = force
- `-d` = include directories

## File Tracking and Management

### `.gitignore` Reference

| Pattern   | Ignores                                   |
|-----------|-------------------------------------------|
| `foo`     | Any file or dir named `foo` anywhere      |
| `foo/`    | Any directory named `foo` (any level)     |
| `/foo`    | Only top-level `foo` file or dir          |
| `/foo/`   | Only top-level directory named `foo`      |

`.gitignore` files allow comments
- Lines beginning with the `#` character are treated as comments and are ignored by Git.
- Whitespace before the `#` is ignored (i.e., you can indent your comments).

### Remove Previously Committed Files Now in `.gitignore`

You added rules to `.gitignore` but some files were already committed.

Stage removal of all currently tracked files (but not delete locally):

```bash
git rm -r --cached .
```

Add everything back to the repo ("add" skips `gitignore`d files):

```bash
git add .
```

Commit the change:

```bash
git commit -m "Remove ignored files from the repository"
```

At this point, the files are only removed from the repository **from this commit onward (they'll still exist in older commits/history)**. If you want them **removed from previous commits as well**, consider **squashing multiple commits into a single commit**, as explained below.

### List Files Added, Removed, or Changed Relative to Another Commit

Run `git status` and ensure you have no unstaged changes or staged but uncommitted changes.

Then, to compare the current state (HEAD) against commit `abcdef1`:

```bash
git diff --name-status --no-renames abcdef1
```

Output looks like:

```
A  src/new_file.py
D  src/old_file.py
M  src/changed_file.py
```

- Added (A): File is present in `HEAD` but not in `abcdef1`.
- Deleted (D): File is present in `abcdef1`, but not in `HEAD`.
- Modified (M): File exists in both, but contents changed.

### Get Files and Folders from Another Branch or Commit

Copy files and folders from the tip of branch `feature` **into your current working directory**:

```bash
git checkout feature -- path/to/file path/to/folder
```

Copy files and folders from commit `abcdef1` **into your current working directory**:

```bash
git checkout abcdef1 -- path/to/file path/to/folder
```

Print a file from the tip of branch `feature` to STDOUT:

```bash
git show feature:path/to/file
```

Print a file from commit `abcdef1` to STDOUT:

```bash
git show abcdef1:path/to/file
```

## Branch and History Management

### Push to a Specific Remote

```bash
git push <remote-name> <branch-name>
```

- `<remote-name>` is the name of the remote you want to push to (e.g., `origin`, `upstream`, etc).
- `<branch-name>` is the branch you want to push (e.g., `main`, `master`, etc).

### Delete Local and Remote Branches

To delete a local branch:

```bash
git branch -d <branch-name>
```

To delete a remote branch:

```bash
git push <remote> --delete <branch-name>
```

### Squash Multiple Commits into a Single Commit

You have made several small commits *(some of which may be faulty or embarassing)* and want to clean up history by squashing them into one.

Review commit history:

```bash
git log
```

Decide how many previous commits you want to squash. 

Start an interactive rebase, e.g. with the last 3 commits:

```bash
git rebase -i HEAD~3
```

In the opened editor:

- Leave `pick` for the first commit.
- For the others, change `pick` to `squash` (or just `s`).
- Save and close.

You will then enter a second editor session. Edit the combined commit message. Save and close.

Force-push the branch to rewrite history on GitHub:

```bash
git push --force
```

> Use squashing carefully if collaborating, as force push overwrites history.

### Move a Branch to an Earlier Commit, Deleting All Later Commits

Suppose you have a branch, e.g. `my-branch`, with a commit history like this:

```
A -- B -- C -- D  (my-branch, HEAD)
```

You want to move to `B` and delete `C`, `D`.

Use `git log` to find the hash of the commit you want to reset to:

```sh
git log
# This shows the history. Copy the hash of the desired commit.
```

Use `git reset --hard <commit-hash>` to move HEAD and the branch:

```sh
git reset --hard <commit-hash>
```

- This moves `HEAD` and `my-branch` to commit B
- Commits `C` and `D` are removed from the tip of your branch (but still exist in the reflog until garbage collection).

### Create a New Commit Merging with Another Commit on Another Branch

Assumptions:

- You are on the latest commit `C` on branch `B`.
- You want to merge in the content from commit `C'` on branch `B'` and create a new commit `CC` on `B`.

Fetch the latest info:

```sh
git fetch --all
```

Ensure you're on branch `B`:

```sh
git checkout B  
```

Manually assess the differences between `C` and `C'` by [listing files added, removed, or changed relative to `C'`](#list-files-added-removed-or-changed-relative-to-another-commit). 

#### Scenario 1: CC should be a complete clone of C

Here, you want to do a merge, but content stays as in C; only history merges. `CC` is a merge commit, with parents `C` and `C'`, tree is identical to `C`.

```sh
git merge -s ours <hash of C'> -m "Merge C', keep only B's content"
```

#### Scenario 2: CC should be a complete clone of C'

You want a merge commit on branch `B` (so `CC` has parents `C` and `C'`), but **override all files so they match C'** (even if that discards local changes).

```sh
# Start the merge, do not commit yet
git merge --no-commit <hash of C'>

# Overwrite working tree with C's tree
git checkout <hash of C'> -- .

# Add everything
git add -A

# Commit
git commit -m "Merge C' into B, taking all content from C'"
```

#### Scenario 3: CC mixes content from C and C'

```sh
git merge --no-commit <hash of C'>

# Overwrite or merge specific files manually
git checkout <hash of C'> -- path/to/file1 path/to/file2

# Add everything
git add -A

# Commit
git commit -m "Manually merge selected files from C'"
```

### Recover Commit from Detached HEAD

Suppose you accidentally checked out a commit and made a new commit in detached HEAD state, but you want that commit on `dev` (tracked from `upstream/dev`):

[While on the detached HEAD commit] Create a local temporary branch:

```sh
git checkout -b temp-recovery
```

This ensures your commit won't be lost and gives it a branch reference.

Switch to your target branch. Fetch latest changes to be sure:

```sh
git fetch upstream
```

Then, switch to your local `dev` branch, or create it if missing:

```sh
git checkout dev   # if it already exists locally and is tracking upstream/dev
# or, if not:
git checkout -b dev upstream/dev
```

Copy files from your temp commit to your target branch. See:

- [List Files Added, Removed, or Changed Relative to Another Commit](#list-files-added-removed-or-changed-relative-to-another-commit)
- [Get Files and Folders from Another Branch or Commit](#get-files-and-folders-from-another-branch-or-commit)

Commit the changes (on your target branch):

```sh
git add .
git commit -m "Recovered changes from detached HEAD"
```

Push the changes up (if allowed):

```sh
git push upstream dev
```

Delete your local temp branch:

```sh
git branch -D temp-recovery
```

## Repository Management

### Set up a Git Repository on a Remote SSH Server

#### On the SSH Server

Create a "bare" Git repository (recommended for central repos):

```sh
mkdir -p /abspath/to/myproject.git
git init --bare /abspath/to/myproject.git
```

#### On Your Local Machine

```sh
mkdir -p path/to/myproject
git init path/to/myproject
cd path/to/myproject
git add .
git commit -m "Initial commit"
git branch -M main   # or master depending on your setup
git remote add origin ssh://username@your.server.com/abspath/to/myproject.git
git push -u origin main
```

#### Clone from the SSH server elsewhere

To clone onto another machine:

```sh
git clone ssh://username@your.server.com/abspath/to/myproject.git
```

### Duplicate a Repository on GitHub Without Forking

First, clone the repo you'd like to duplicate:

```bash
git clone --bare https://github.com/username/original-repo.git
```
> `--bare` makes a bare repository, useful for duplicating all branches and history.

Create a New Repository on GitHub:

- Go to GitHub.
- Click **+** (top right) > **New repository**.
- Choose the owner, **set a new name**, **don't initialize** with README, .gitignore, or license.

Push the Bare Clone to the New Repository:

```bash
cd original-repo.git
git push --mirror https://github.com/yourusername/my-new-repo.git
```
> `--mirror` copies everything (all refs, branches, tags, etc.)

Remove the local bare clone:

```bash
cd ..
rm -rf original-repo.git
```
