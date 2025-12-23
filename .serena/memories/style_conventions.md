# Style & Conventions

## Code Style
- **TypeScript**: Strict mode enabled
- **File naming**: kebab-case for files, PascalCase for components
- **Component format**: `.astro` files with frontmatter script section

## Astro Component Structure
```astro
---
// TypeScript/JavaScript imports and logic
import Component from './Component.astro';

const data = await getData();
---

<!-- HTML template with Tailwind classes -->
<div class="flex items-center">
  <Component />
</div>
```

## Tailwind CSS Conventions
- Use arbitrary values for exact Figma specs: `px-[50px]`, `text-[#1E1E1E]`
- Prefer semantic classes when available: `text-xl`, `font-light`
- Custom theme variables defined in `global.css` using `@theme`

## Typography (Lato Font)
| Weight | Tailwind Class | Usage |
|--------|---------------|-------|
| 300 | `font-light` | Body text |
| 400 | `font-normal` | Links |
| 600 | `font-semibold` | Emphasis (name) |
| 700 | `font-bold` | Logo |

## Design Tokens
- Primary text: `#1E1E1E`
- Secondary text: `#757575`
- Background: `#FFFFFF`
- Max width: 1024px
- Content width: 924px
- Section padding: 50px
