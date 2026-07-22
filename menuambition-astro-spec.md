# MenuAmbition — Astro Rebuild Spec

Supersedes `menuambition-spec.md` (the static hand-written build). That build stays in git history and is the **content source** for this one.

---

## 0. Goal & constraints

- Rebuild the existing 10-page static site as an **Astro** project, **locally only**. **No deployment in any stage.** No Cloudflare setup, no adapter, no `wrangler`, no push to a hosting provider. Local `npm run dev` / `npm run build` / `npm run preview` only.
- **Fully static output.** Astro as a static site builder — **no SSR, no `@astrojs/cloudflare` adapter, no `output: 'server'`.** Installing an adapter can silently flip the project into server mode; don't.
- **Zero client JS except what already exists** (mobile nav, video modal, impact calculator). No React/Vue/Svelte integrations.
- Work on a branch (e.g. `astro-rebuild`), leaving `main` intact so the existing GitHub Pages preview keeps serving during the rebuild.

---

## 1. CRITICAL: port, don't re-fetch

**Do not fetch anything from web.archive.org.** All page content was already recovered, verified, and committed. Source every piece of copy from the existing HTML files in the repo:

`index.html`, `about.html`, `contact.html`, `impact-calculator.html`, `blog.html`, `menu-planning-vs-menu-optimization.html`, `video-menuambition-in-2-minutes.html`, `why-menu-planning-software-falls-short.html`, `privacy.html`, `tos.html`, plus `css/styles.css` and `js/main.js`.

If those files are not in the working tree (because the branch was reset), recover them with `git checkout b226c86 -- .` before starting.

Copy is **verbatim**. The legal pages (~2,550 and ~6,660 words) and the article body must transfer character-for-character. Do not re-type, re-summarize, or "improve" any body copy. Extract programmatically where practical.

---

## 2. Project structure

```
astro.config.mjs
package.json
src/
  layouts/
    BaseLayout.astro        <head> + Header + <slot/> + Footer
  components/
    Header.astro            sticky nav, mobile toggle
    Footer.astro            quick nav, newsletter (inert), copyright, social
    BrandBlock.astro        navy→blue→teal gradient banner (16x9 + banner variants)
    PersonCard.astro        avatar/photo + name + title + bio
    PostCard.astro          blog index card
    VideoEmbed.astro        responsive 16:9 Vimeo iframe
  pages/                    (see §3 routing)
  content/
    posts/                  3 blog posts (content collection)
  styles/
    global.css              ported from css/styles.css
  assets/
    team/shoaib-abbasi.jpg  real headshot (see §5)
public/
  assets/images/            all 29 existing images + 2 blog thumbnails, paths unchanged
  favicon files
```

`js/main.js` logic moves into component-scoped `<script>` blocks (Header for nav, VideoEmbed/BaseLayout for modal, calculator page for the calculator) or stays as a single script — either is fine, but it must all still work.

---

## 3. Routing — match the ORIGINAL site's URLs

The old build used `.html` filenames that did **not** match the real menuambition.com URLs. Fix that here, so the site is drop-in correct if the domain is ever restored.

Use Astro's default `build.format: 'directory'` so pages emit as `/about/index.html` and serve at `/about/`.

| Source file (old build) | New location | URL |
|---|---|---|
| `index.html` | `src/pages/index.astro` | `/` |
| `about.html` | `src/pages/about.astro` | `/about/` |
| `contact.html` | `src/pages/contact.astro` | `/contact/` |
| `impact-calculator.html` | `src/pages/menuambition-impact-calculator.astro` | `/menuambition-impact-calculator/` |
| `blog.html` | `src/pages/blog/index.astro` | `/blog/` |
| `privacy.html` | `src/pages/privacy-policy.astro` | `/privacy-policy/` |
| `tos.html` | `src/pages/tos.astro` | `/tos/` |
| the 3 post pages | content collection + `src/pages/[slug].astro` | see below |

**Blog posts** live at the **root level** on the original site, not under `/blog/`. Use a content collection (`src/content/posts/`) plus a root dynamic route `src/pages/[slug].astro` with `getStaticPaths()`. Static routes take precedence over the dynamic one, so `about.astro` etc. are unaffected. Post slugs:

- `menu-planning-vs-menu-optimization`
- `video-menuambition-in-2-minutes`
- `why-menu-planning-software-falls-short-for-institutional-foodservice-operators`  ← **note: full original slug, longer than the old build's filename**

Post frontmatter: `title`, `excerpt`, `vimeoId` (optional), `heroType` (`video` | `brand-block`). Body = the post copy, verbatim (raw HTML is allowed in `.md`).

`/blog/` must generate its 3 cards **from the collection**, not hand-written, so adding a 4th post is just a new file.

**Every internal link must be updated to the new URLs** (e.g. `about.html` → `/about/`, and the homepage "Related Article" link → `/why-menu-planning-software-falls-short-for-institutional-foodservice-operators/`). Zero `.html` links should remain.

*(If the root dynamic route proves fiddly, falling back to three plain `.astro` pages at the correct slugs is acceptable — but keep the blog index generated from a shared data source.)*

---

## 4. Design system

Port `css/styles.css` to `src/styles/global.css` essentially as-is — the tokens, type scale, buttons, container, and all component styles are already correct and verified. Import it once in `BaseLayout.astro`. Keep the Google Fonts links (Poppins + Nunito Sans) in the layout `<head>`.

Do not redesign anything. Visual output should be indistinguishable from the current site apart from the §5 content changes.

---

## 5. Content changes (requested — apply during the port, not after)

1. **Remove the entire Advisory Board section** from About: the heading and all five people (Barb Wakeen, Rod Hart, Theo Paul, Dave DeWalt, Cindy Burns). Also check the About intro / "Our Story" copy for any sentence that references an advisory board and report it before removing — do not silently edit narrative copy.
2. **Shoaib Abbasi gets his real photo.** Source image is landscape (~1150×740) and the frame is circular, so it needs a square crop biased toward the face: `object-fit: cover` with roughly `object-position: center 25%`. Tune it and visually confirm the crop isn't cutting the forehead or chin.
3. **Rick Pedi keeps the gray avatar placeholder** — his photo isn't available yet. `PersonCard` must support both states (photo / placeholder) so the swap is a one-line change later.
4. Everything else on About — page header, Our Story, the founders' bios — is unchanged and verbatim.

---

## 6. Impact calculator (must keep working)

Same formulas, ported as-is:

```
annualFoodSpend = adp * dailySpendPerPerson * operationDays
annualSavings   = 0.12 * annualFoodSpend
```

Live recompute on input; USD formatting with thousands separators; empty/invalid → `$0`, never `NaN`; operation days clamped 50–365.

**Regression test:** `500 / 4.50 / 365` must produce Annual Food Spend **$821,250** and Annual Savings **$98,550**.

---

## 7. Verification (local only)

Run `npm run build` then `npm run preview`, and confirm:

1. All 10 routes build and render at the §3 URLs.
2. **Zero broken internal links**, and zero remaining `.html` hrefs.
3. Header and footer identical across all pages (now structurally guaranteed by the layout — confirm it renders that way).
4. Legal pages: word counts within ~1% of the originals (Privacy ~2,550, Terms ~6,660). Diff against the old HTML's text to prove nothing was dropped.
5. Article body text matches the old build.
6. Calculator regression test passes.
7. Both Vimeo embeds present with correct IDs (486491356 on the 2-minutes post + homepage modal; 520115489 on the comparing post).
8. Blog index shows 3 cards generated from the collection, with the two real video thumbnails and the brand block on the article card.
9. About shows exactly 2 people, no Advisory Board, Shoaib with a real photo and Rick with the placeholder.
10. Mobile: hamburger nav works, sections stack.
11. `dist/` contains no server output — pure static HTML/CSS/JS.

Report the local preview URL. **Do not deploy.**

---

## 8. Build order (stages)

1. **Stage A** — scaffold Astro, port `global.css`, build `BaseLayout` + `Header` + `Footer`, port the homepage. Verify locally.
2. **Stage B** — About (with §5 changes) + Contact.
3. **Stage C** — blog content collection + `/blog/` index + 3 post routes + impact calculator.
4. **Stage D** — Privacy Policy + Terms.
5. **Stage E** — full local verification pass (§7) + a text-diff parity check against the old build.

Verify each stage before starting the next. Commit per stage on the `astro-rebuild` branch.
