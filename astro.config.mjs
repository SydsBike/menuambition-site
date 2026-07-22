// @ts-check
import { defineConfig } from 'astro/config';

// Fully static build (no adapter, no SSR — spec §0).
// 'directory' format emits /about/index.html so routes serve as /about/ (spec §3).
export default defineConfig({
  build: {
    format: 'directory',
  },
});
