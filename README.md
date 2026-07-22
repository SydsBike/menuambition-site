# MenuAmbition — static site (Astro)

A faithful rebuild of **menuambition.com** (now offline) as a fully static
[Astro](https://astro.build) site, for stakeholder review. All copy was
reconstructed from Wayback Machine captures of the original site and ported
verbatim; see `menuambition-astro-spec.md` for the build spec.

## Commands

```bash
npm install      # once
npm run dev      # dev server with HMR
npm run build    # static build → dist/
npm run preview  # serve the built dist/ locally
```

Pure static output — no SSR, no adapter, no UI-framework integrations. The
only client JS is the mobile nav toggle, the Vimeo video modal, the inert
form handlers, and the impact calculator.

## Where things live

| What | Where |
|---|---|
| Pages | `src/pages/` (`about.astro` → `/about/`, etc.) |
| Blog posts | `src/content/posts/` — **adding a post = one new `.md` file** (frontmatter: `title`, `excerpt`, `heroType`, optional `vimeoId`/`thumb`, `order`); it appears on `/blog/` and gets a root-level route automatically via `src/pages/[slug].astro` |
| Layout / header / footer | `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `Footer.astro` |
| Design system | `src/styles/global.css` (imported once in the layout) |
| Static assets | `public/assets/images/` (URL: `/assets/images/…`) |
| Team photos | `src/assets/team/` (optimized through Astro's image pipeline) |

## Swapping in Rick Pedi's photo

`PersonCard.astro` supports a photo or a gray placeholder. When Rick's photo
arrives, drop it in `src/assets/team/rick-pedi.jpg` and change his card in
`src/pages/about.astro`:

```astro
---
import rickPhoto from '../assets/team/rick-pedi.jpg';
---
<PersonCard name="Rick Pedi" title="Founder and CEO" photo={rickPhoto}>
```

That's the whole change (add `photoPosition="center 25%"`-style tuning if the
crop needs a nudge).

## Placeholder imagery

~24 original images (team headshots, blog thumbnails/banners) were never
archived by the Wayback Machine. Gray avatar placeholders and the
navy→blue→teal **BrandBlock** gradient stand in for them by design — do not
hotlink or invent replacements.

## Deferred to deployment

`@astrojs/sitemap`, canonical tags, and absolute `og:url` values all require
setting `site` in `astro.config.mjs`, which depends on the final domain.
Add them at deployment time, not before.
