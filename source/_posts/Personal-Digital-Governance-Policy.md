---
title: Personal Digital Governance Policy
date: 2026-04-05
updated: 2026-04-05
categories:
  - "Reflections"
tags:
  - "essay"
excerpt: The document explains how my digital artifacts and platforms should be organized, disclosed, and handled if I die or become incapacitated.
sticky: 4
---

## Purpose

**You never know which one will come first, tomorrow or the accident.** For that reason, I need a **personal digital governance policy** such that if I suddenly die or become incapacitated:

- trusted people can act promptly and coherently;
- my digital presence can remain legible rather than collapse into silence or confusion; and
- my ongoing work can be continued, concluded, or handed off.

This document serves both as a **living governance policy** and as a **directive for death or incapacity**. It has three tasks:

- To **enumerate** and **classify** the digital artifacts I create and the digital platforms I use.
- To **match** digital artifacts to digital platforms best suited to store or disseminate them.
- To **specify** what trusted people should do if I die or become incapacitated.

The underlying philosophy is simple: **public-first**. I shall make all my digital artifacts public, or prepare them for public release.

## Digital Artifacts

Major digital artifacts I create fall into two categories: **storage artifacts** and **dissemination artifacts**.

### Storage Artifacts

These digital artifacts are intended for archival storage:

- **Quipu**: an auditable trail of work and life, including records of ongoing projects, drafts, notes, commitments, and other materials needed to understand continuity.
  - The Quipu contains an `AGENTS.md` file so that agents such as pi, Codex, Claude Code, and similar systems can perform natural-language queries against its contents.
- **Secrets**: accounts, passwords, PEM keys, etc.

### Dissemination Artifacts

These digital artifacts should be created with the sole purpose of public dissemination:

- **Source code**
- **Multimedia**: photos, music, videos, etc.
- **Announcements**
- **Memos**
- **Essays**: philosophical writings, life philosophy, metaphysical reflections, literary essays, and other discursive personal writing that is neither a memo nor gray literature.
- **Gray literature**: manifestos, playbooks, policy documents, position papers, technical reports, etc.

## Digital Platforms

Major digital platforms I use fall into three categories: **storage platforms**, **dissemination platforms**, and **ephemeral platforms**.

### Storage Platforms

These digital platforms are intended for archival storage:

- External hard drive
- rsync.net

The rsync.net SSH username and password are distributed to family members, trusted friends, and other trusted people.

### Dissemination Platforms

These digital platforms are used for public dissemination rather than archival storage:

- GitHub Pages personal website
- GitHub
- Substack
- Zenodo
- Instagram
- LinkedIn
- WeChat
- X

Whenever possible, all dissemination platforms should link to one another so that audiences can move between them and discover the full body of public work.

### Ephemeral Platforms

All personal devices, whether at home, at work, or elsewhere, are ephemeral platforms:

- Mobile phone
- Laptop
- Desktop
- Other personal computing devices

Ephmeral platforms are **not** password-protected. Anything stored on ephemeral platforms should be assumed vulnerable to loss, theft, compromise, casual access, or replacement.

## Matching Digital Artifacts to Digital Platforms

### Quipu

**Primary digital platform:**
- A Git repository within rsync.net

**Backup and replication:**
- Cloned to an external hard drive
- Cloned to ephemeral platforms on demand

### Secrets

**Primary digital platform:**
- A Git repository within rsync.net

**Backup and replication:**
- Cloned to an external hard drive

**Access model:**
- Access individual files on ephemeral devices only on demand

Secrets are maintained primarily for operational continuity and handoff. Their confidentiality after death is **not** a design goal.

### Source Code

**Primary digital platform:**
- GitHub

### Multimedia

**Primary digital platforms:**
- Personal-event multimedia: publish to Instagram and WeChat with polished text descriptions suited to the platform
- Professional-event multimedia: publish to LinkedIn, WeChat, and X with polished text descriptions suited to the platform

### Announcements

**Primary digital platforms:**
- LinkedIn
- X
- Personal website

Announcements should be released with polished text suited to the audience and platform.

### Memos

**Primary digital platform:**
- Personal website

Memos should be released with polished text on the personal website.

### Essays

**Primary digital platform:**
- Substack

**Public announcement:**
- Publish announcement posts with polished text to LinkedIn, X, and the personal website

Essays cover philosophical writings, life philosophy, metaphysical reflections, and literary essays. They are dissemination-first artifacts aimed at readership rather than archival permanence.

### Gray Literature

**Primary digital platform:**
- Zenodo

**Public announcement:**
- Publish announcement posts with polished text to LinkedIn, X, and the personal website

## What Trusted People Should Do If I Die or Become Incapacitated

If I die or become incapacitated, trusted people should **use their best judgment** in light of clarity and good faith:

- Notify relevant people:
   - family
   - close friends
   - collaborators
   - employers or institutions, if appropriate
- Obtain access to relevant platforms:
   - Storage platforms
     - External hard drive
     - rsync.net
   - Ephemeral platforms
     - Mobile phone
     - Laptop
     - Desktop
     - Other personal computing devices
- Read the Quipu:
   - identify current projects
   - identify unfinished obligations
   - identify any information relevant to handoff
- Read the secrets. Find instructions for accessing or managing important accounts.
- Maintain public communication.
- Continue or conclude ongoing work:
   - hand off active work where possible
   - publish or archive materials that should not be lost

## Outcome

A sound personal digital governance policy ensures that digital artifacts are not merely created, but also properly stored, disseminated, and handed off when necessary. The goal is continuity: continuity of presence, continuity of work, continuity of communication, and continuity of the public record.
