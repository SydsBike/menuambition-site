import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts (spec §3). File name = slug = URL segment, served at the site
// root via src/pages/[slug].astro. `order` gives the deterministic blog-index
// sort matching the old blog.html card order.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    /** Meta description for the post page (falls back to excerpt). */
    description: z.string().optional(),
    vimeoId: z.string().optional(),
    heroType: z.enum(['video', 'brand-block']),
    /** Card thumbnail path; omitted → the card shows the BrandBlock. */
    thumb: z.string().optional(),
    /** Blurb used when this post is listed under another post's Related Content (falls back to excerpt). */
    relatedBlurb: z.string().optional(),
    /** Blog-index sort order (matches the old blog.html). */
    order: z.number(),
  }),
});

export const collections = { posts };
