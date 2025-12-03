// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-site.netlify.app', // Update with your actual Netlify URL
  vite: {
    plugins: [tailwindcss()]
  }
});
