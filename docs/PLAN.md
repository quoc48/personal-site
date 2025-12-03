# Personal Portfolio Website - Implementation Plan

> **Project Location**: `/Users/quocphan/Personal Site/`
> **Task Tracking**: `docs/TASKS.md`

## Overview
Build a minimal, clean portfolio website with 3 pages (Home, Work, Contact) + project detail pages. Future: blog, video player, image comparison slider.

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | **Astro** | Content-first, zero JS by default, simple file-based routing |
| Styling | **Tailwind CSS v4** | Utility-first, responsive built-in |
| Content | **Markdown files** | No CMS dependency, human-readable, Git-versioned |
| Deployment | **Netlify** | Beginner-friendly UI, free tier, auto-deploy from Git |

### Future Libraries
- Video Player: [Plyr](https://plyr.io/)
- Image Slider: [img-comparison-slider](https://img-comparison-slider.sneas.io/)

## Project Structure

```
/src/
├── components/
│   ├── BaseHead.astro      # SEO, meta tags
│   ├── Header.astro        # Navigation
│   ├── Footer.astro        # Footer + social links
│   └── ProjectCard.astro   # Project list item
├── layouts/
│   ├── BaseLayout.astro    # Main wrapper
│   └── ProjectLayout.astro # Project detail layout
├── pages/
│   ├── index.astro         # Home
│   ├── work/
│   │   ├── index.astro     # Project list
│   │   └── [slug].astro    # Project detail
│   └── contact.astro       # Contact
├── content/
│   ├── config.ts           # Collection schemas
│   └── projects/           # Project .md files
└── styles/
    └── global.css
```

## Content Management

### Adding a New Project
1. Create new `.md` file in `src/content/projects/`
2. Add images to `public/images/projects/[project-name]/`
3. Commit and push to GitHub
4. Site rebuilds automatically (1-2 min)

### Project Template
```markdown
---
title: "Project Name"
description: "Brief description"
date: 2025-01-15
thumbnail: "/images/projects/project-name/thumb.jpg"
tags: ["Design", "Development"]
featured: true
---

## Overview
Write about the project...
```

## Design Guidelines

- **Color**: Minimal palette (white bg, dark text, blue accent)
- **Typography**: Inter or system fonts, 16px base
- **Spacing**: Generous white space, consistent scale
- **Interactions**: Subtle hover states, no flashy animations

## Confirmed Details

- **Social channels**: LinkedIn + GitHub (+ Email contact)
- **Domain**: Start with free Netlify subdomain
