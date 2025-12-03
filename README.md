# Personal Portfolio Website

A minimal, clean portfolio website built with Astro and Tailwind CSS.

## Tech Stack

- **Framework**: [Astro](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content**: Markdown files
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
/
├── public/              # Static assets (images, videos)
├── src/
│   ├── components/      # Reusable UI components
│   ├── content/         # Markdown content (projects, blog)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Routes
│   └── styles/          # Global styles
├── docs/                # Documentation
│   ├── PLAN.md          # Implementation plan
│   └── TASKS.md         # Task tracking
└── package.json
```

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installs dependencies                       |
| `npm run dev`     | Starts local dev server at `localhost:4321` |
| `npm run build`   | Build your production site to `./dist/`     |
| `npm run preview` | Preview your build locally, before deploying|

## Adding Content

### New Project

1. Create a new `.md` file in `src/content/projects/`
2. Add project images to `public/images/projects/[project-name]/`
3. Push to GitHub - site rebuilds automatically

## License

MIT
