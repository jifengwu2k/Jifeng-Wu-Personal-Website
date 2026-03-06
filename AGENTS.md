# AGENTS.md

## Purpose

This repository is a **Hexo** blog for **Jifeng Wu's Personal Website**. This file helps coding agents and other automated assistants access the blog through natural language requests.

Use this document as the first orientation point when a user asks questions like:

- "What is this blog about?"
- "Find posts about Python / PL / finance / literature"
- "Summarize the author's research interests"
- "Add a new post/page"
- "Update taxonomy / tags / categories"
- "Locate a PDF, image, utility, or static asset"

## Repository role map

### Core site configuration

- `package.json` — project scripts and Hexo dependencies
- `_config.yml` — main Hexo site configuration
- `README.md` — setup instructions and the canonical content taxonomy

### Content

- `source/_posts/` — main blog posts in Markdown
- `source/about/index.md` — About page
- `source/projects/index.md` — Projects page
- `source/categories/index.md` — Categories landing page
- `source/tags/index.md` — Tags landing page

### Static assets

- `source/static/images/` — images and diagrams
- `source/static/pdfs/` — papers, resume, transcript, reports, certificates
- `source/static/videos/` — video assets
- `source/static/utilities/` — standalone HTML utilities

### Scaffolds

- `scaffolds/post.md`
- `scaffolds/page.md`
- `scaffolds/draft.md`

## Site architecture

This is a **content-heavy personal site** with a strong emphasis on:

- programming
- systems
- software engineering
- programming languages
- AI / ML / LLM topics
- research notes and paper readings
- personal reflections
- lifestyle records
- Chinese-language writing on literature, language, food, fashion, and fitness

The site is generated with **Hexo** and uses the **Fluid** theme.

Key behavior from `_config.yml`:

- posts live in `source/_posts/`
- permalink format is `:year/:month/:day/:title/`
- `source/static/**` is copied directly via `skip_render`
- theme is `fluid`

## Post format conventions

Typical post front matter looks like:

```yaml
---
title: Example Post
date: 2026-01-01
updated: 2026-01-01
categories:
  - "Systems"
tags:
  - "reference"
  - "linux"
excerpt: Example Post
---
```

Observed conventions:

- posts usually have a `title`
- posts usually have a `date`
- many posts also have `updated`
- categories are stored as a list
- tags are stored as a list
- some posts define `excerpt`

When editing posts, preserve front matter structure and indentation.

## Canonical taxonomy rules

These rules come from `README.md` and should be treated as authoritative.

### Categories

Each post should have **exactly one** category.

Allowed categories currently include:

- `Programming`
- `Systems`
- `AI and Machine Learning`
- `Tools and Automation`
- `Mathematics`
- `Research Notes`
- `Reflections`
- `Lifestyle`
- `Linguistics and Literature`
- `Statements`

### Tags

Tags should use **lowercase kebab-case**.

Guidelines:

- prefer existing tags over creating near-duplicates
- use categories for broad sections
- use tags for format, subject, tool, or platform
- `Reference` is a **tag concept**, not a category; use the tag `reference`

Before inventing a new tag, inspect existing posts and the tag list in `README.md`.

## Content families agents should recognize

The blog contains recurring series. These are useful for natural-language grouping:

- `Paper-Reading-*` — paper reading notes / literature summaries
- `Conversation-with-*` — conversations or interviews
- `*-Financial-Statement` — monthly finance records
- coding-guideline posts such as:
  - `Python-Coding-Guidelines`
  - `Shell-Coding-Guidelines`
  - `YAML-Coding-Guidelines`
  - `C-Coding-Guidelines`

If a user asks for “all paper-reading posts” or “financial records,” use these naming patterns plus front matter.

## Editing guidance for agents

When creating or modifying content:

### New post

Place under:

- `source/_posts/<Title>.md`

Use scaffold-compatible front matter with:

- `title`
- `date`
- optional `updated`
- exactly one category
- zero or more tags
- optional `excerpt`

### New page

Place under a directory with `index.md`, for example:

- `source/<page-name>/index.md`

### Static assets

Place under:

- `source/static/images/`
- `source/static/pdfs/`
- `source/static/videos/`
- `source/static/utilities/`

### Taxonomy edits

If a post’s category or tags change, keep them aligned with `README.md`.

