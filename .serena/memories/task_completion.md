# Task Completion Checklist

## Before Completing a Task

1. **Verify Changes Work**
   - Run `npm run dev` and check in browser
   - Ensure no console errors

2. **Code Quality**
   - TypeScript: No type errors
   - Tailwind: Classes are valid
   - HTML: Proper semantic structure

3. **Design Fidelity**
   - Match Figma specifications exactly
   - Check typography (font, size, weight, line-height)
   - Verify colors match design tokens
   - Confirm spacing/padding values

## Deployment Steps

1. Stage changes: `git add <files>`
2. Commit with descriptive message
3. Push to main: `git push origin main`
4. Netlify auto-deploys from main branch
5. Verify on live site after ~1-2 minutes

## Files to Never Commit
- `.mcp.json` (MCP config)
- `.playwright-mcp/` (Playwright screenshots)
- `node_modules/`
- `.astro/` (generated)
