# Personal Site - Project Overview

## Purpose
A personal portfolio website for Quoc Phan, a product designer. The site showcases professional experience in fintech, CRM, case management, and bioinformatics platforms.

## Tech Stack
- **Framework**: Astro v5.16.3
- **Styling**: Tailwind CSS v4.1.17 (via Vite plugin)
- **Language**: TypeScript (strict mode)
- **Deployment**: Netlify
- **Font**: Lato (Google Fonts) - weights: 300, 400, 600, 700

## Project Structure
```
src/
├── components/       # Reusable Astro components
│   ├── BaseHead.astro
│   ├── Header.astro
│   ├── Footer.astro
│   └── ProjectCard.astro
├── layouts/          # Page layouts
│   └── BaseLayout.astro
├── pages/            # Routes
│   ├── index.astro   # Home page
│   ├── contact.astro
│   └── work/
│       ├── index.astro
│       └── [slug].astro
├── content/          # Content collections
│   ├── config.ts
│   └── projects/
├── styles/
│   └── global.css    # Global styles + Tailwind imports
public/               # Static assets
```

## Key Design Specifications
- Max content width: 1024px
- Text width in content: 924px
- Primary text color: #1E1E1E
- Section padding: 50px
- Gap between content paragraphs: 24px
