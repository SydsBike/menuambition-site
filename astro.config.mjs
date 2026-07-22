// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Fully static build (no adapter, no SSR — spec §0).
// 'directory' format emits /about/index.html so routes serve as /about/ (spec §3).
// `site` is the canonical origin (bare domain 301s to www).
export default defineConfig({
  site: 'https://www.menuambition.com',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
