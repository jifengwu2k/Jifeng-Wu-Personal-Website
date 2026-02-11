# Jifeng Wu Personal Website

**Do not directly clone this repository.**

This repository contains the source files for Jifeng Wu’s personal website, built with [Hexo](https://hexo.io/).

## Requirements

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)

## Installation

Follow these steps to set up the project:

### 1. Install Hexo CLI

```bash
npm install -g hexo-cli
```

### 2. Initialize a New Hexo Project

```bash
hexo init Blog
cd Blog
```

### 3. Install Dependencies

```bash
npm install
npm install --save hexo-deployer-git
npm install --save hexo-theme-fluid
```

### 4. Copy Website Source Files

Do **not** directly clone this repository into your working directory. Instead, run the following commands to copy necessary files:

```bash
tmpdir="$(mktemp -d)"
git clone https://github.com/jifengwu2k/Jifeng-Wu-Personal-Website.git "${tmpdir}"
rm -r scaffolds source
cp -r \
    "${tmpdir}/.git" \
    "${tmpdir}/.gitignore" \
    "${tmpdir}/scaffolds" \
    "${tmpdir}/source" \
    "${tmpdir}/README.md" \
    "${tmpdir}/_config.fluid.yml" \
    "${tmpdir}/_config.landscape.yml" \
    "${tmpdir}/_config.yml" \
    ./
rm -rf "${tmpdir}"
```

## Usage

From within your project directory (`Blog`):

- **Serve locally:**  
  ```bash
  hexo server
  ```
- **Generate static files:**  
  ```bash
  hexo generate
  ```
- **Deploy:**  
  ```bash
  hexo deploy
  ```

## ⚠️ Important: Delete Old Deployments and Workflow Runs

> **Why delete old GitHub Pages deployments and workflow runs?**

When you deploy a static site (like Hexo) to GitHub Pages, you may **accidentally publish sensitive data or secrets** in earlier versions, even if later removed by rebasing or force-pushing.  
**But:**  
- GitHub may retain old *deployment records*, and especially old *workflow runs* (from Actions), which can include full snapshots of your built site as downloadable "artifacts".
- **Malicious users can sometimes access these artifacts through public URLs or by using the GitHub API, even after you've "fixed" your repository.**

**Just rewriting history or force-pushing is NOT enough:**  
- Unless you also delete old deployments and workflow runs, sensitive files or secrets might remain accessible.

**The provided script** will:
1. **Delete all but the most recent deployment records**
2. **Delete all but the most recent workflow runs and their artifacts**

```python
# Credits: https://gist.github.com/dedoussis/1dca803d62a0152d97b5df4aee6ddfbc
from github import Github

# --- Configuration ---
# Replace with your actual GitHub personal access token
ACCESS_TOKEN = "YOUR_PERSONAL_ACCESS_TOKEN"
REPO_OWNER = "jifengwu2k"
REPO_NAME = "jifengwu2k.github.io"

# Authenticate with GitHub
g = Github(ACCESS_TOKEN)

# Get the repository object
repo = g.get_repo(f"{REPO_OWNER}/{REPO_NAME}")

# --- Remove old deployments ---
deployments = list(repo.get_deployments())
deployments.sort(key=lambda deployment: deployment.created_at)
if len(deployments) > 1:
  # Keep the most recent
    deployments.pop()
    for deployment in deployments:
        print('Deleting deployment', deployment, 'created at', deployment.created_at)
        g._Github__requester.requestJsonAndCheck('DELETE', deployment.url)

# --- Remove old workflow runs ---
# Get workflow runs (API is paginated)
runs = list(repo.get_workflow_runs())
runs.sort(key=lambda run: run.created_at)
if len(runs) > 1:
    # Keep the most recent
    runs.pop()
    for run in runs:
        print('Deleting workflow run:', run.id, 'created at', run.created_at)
        g._Github__requester.requestJsonAndCheck('DELETE', run.url)
```