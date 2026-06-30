# MenuAmbition — Static Rebuild Spec (Foundation)

This document is the **source of truth** for rebuilding `menuambition.com` as a static HTML/CSS site. Read it fully before building, and follow it exactly. Build happens in **stages**, one prompt at a time — this file is the shared reference; each prompt covers specific pages.

---

## 0. Goal & constraints

- **Purpose:** a faithful **look-and-feel preview** of the original site (now offline) for stakeholder review — *not* a production app.
- **Source of truth for content:** the **latest (early-2026) Wayback Machine captures** (URLs per page in §6). This machine can reach `web.archive.org` — fetch each page's `id_` raw source and reproduce **all** of its visible content. **Do not drop any section, post, or video.**
- **Fidelity target:** match the original's layout, type, color, spacing, and copy closely. It does not need to be byte-identical to the original Divi markup — rebuild it as **clean, semantic, hand-written HTML/CSS**.
- **Non-functional by design:** the contact form and newsletter signup render fully but have **no backend** — do not wire them to anything. Email/links to real endpoints need not work.
- **Stack:** plain **HTML5 + one shared CSS file + minimal vanilla JS** (mobile nav toggle, video modal). **No frameworks, no build tools, no npm.**
- **Deploy target:** **GitHub Pages** (static; relative paths; `.nojekyll`).

---

## 1. File structure

Flat layout at repo root (simplest for GitHub Pages):

```
/
  .nojekyll
  menuambition-spec.md          (this file)
  index.html                    Home
  about.html                    About
  contact.html                  Let's Talk
  impact-calculator.html        Impact Calculator
  blog.html                     Resources (blog index)
  menu-planning-vs-menu-optimization.html      blog post (video)
  video-menuambition-in-2-minutes.html         blog post (video)
  why-menu-planning-software-falls-short.html  blog post (article)
  privacy.html                  Privacy Policy
  tos.html                      Terms of Service
  /css/styles.css
  /js/main.js                   mobile nav + video modal
  /assets/images/               real images (copied from ~/ma-images)
  /assets/placeholders/         gray avatar SVG (optional; can be inline)
  favicon.ico / icons
```

**Header & footer:** there is no templating engine. Put the **same header and footer markup in every page** and keep them byte-identical across pages. (A tiny JS injector is acceptable but not required; duplication is the robust default.)

**Inter-page navigation must work** — every nav/footer/CTA link points to the correct local `.html` file.

---

## 2. Design system

Pull from the original site's CSS. Drop these into `/css/styles.css`.

### Fonts
Load via Google Fonts in every page `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```
- **Headings & body:** Poppins. **Accent blocks:** Nunito Sans (800 weight) where the original uses it.

### Tokens
```css
:root{
  /* Brand */
  --ma-navy:#242464;          /* hero bg, nav text, dark headings accent */
  --ma-blue:#0c74bc;          /* links, "Let's Talk" pill */
  --ma-blue-cta:#0c71c3;      /* "Schedule a Demo" button */
  --ma-teal:#14ac9c;          /* eyebrows, active nav, accents */
  --ma-teal-bright:#33cccc;
  --ma-sky:#57c3f0;           /* one section eyebrow color */
  --ma-green:#87dbae; --ma-green-2:#bbdaaf; --ma-green-3:#e5fadc;

  /* Text */
  --ma-text:#2d3e50;          /* body */
  --ma-heading:#2a3443;       /* headings */
  --ma-on-navy:#ffffff;
  --ma-subhead-navy:#cbd5e0;  /* subhead text on the navy hero */

  /* Surface */
  --ma-white:#ffffff;
  --ma-bg:#ffffff;
  --ma-bg-soft:#f6f8fb;       /* light section / footer background */

  /* Layout */
  --ma-maxw:1200px;
  --ma-radius:6px;
  --ma-shadow:0 15px 35px rgba(50,50,93,.1),0 5px 15px rgba(0,0,0,.07);
  --ma-font-head:'Poppins',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --ma-font-body:'Poppins',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --ma-font-accent:'Nunito Sans',var(--ma-font-body);
}
```

### Type scale (responsive)
- `h1`: `clamp(2rem, 5vw, 2.9rem)`, weight **600**, line-height 1.15
- `h2`: `clamp(1.6rem, 3.5vw, 2.15rem)`, weight 600
- `h3`: `clamp(1.35rem, 3vw, 1.8rem)`, weight 600
- **Eyebrow** (the small label above headings, e.g. "Menu Intelligence", "Automation"): ~0.8rem, **uppercase**, letter-spacing 0.12em, weight 700, color `--ma-teal` (use `--ma-sky` only where the original does on the Automation block).
- Body: 1rem–1.125rem, line-height 1.6, color `--ma-text`.

### Buttons
- `.btn-primary` ("Schedule a Demo", section CTAs): background `--ma-blue-cta`, color #fff, padding `.85em 1.7em`, radius `--ma-radius`, weight 600, no border, subtle hover darken.
- `.btn-pill` ("Let's Talk" nav button): background `--ma-blue`, color #fff, padding `7px 20px 5px`, radius `5px`, weight 600.

### Container & sections
- Center content in `.container { max-width: var(--ma-maxw); margin-inline:auto; padding-inline:24px; }`
- Generous vertical section padding (~`clamp(56px, 8vw, 110px)` top/bottom).

---

## 3. Global header / nav

- **Sticky** top bar, white background, subtle bottom shadow (stronger on scroll).
- **Left:** logo `logo-header.png`, links to `index.html`.
- **Right (in order):** `Home`→index.html · `About`→about.html · `Impact Calculator`→impact-calculator.html · `Resources`→blog.html · **`Let's Talk`**→contact.html (rendered as `.btn-pill`).
- Active page link tinted teal (`--ma-teal`).
- **Mobile (< 980px):** collapse to a hamburger that toggles a panel (JS in `/js/main.js`).

---

## 4. Global footer

- Background `--ma-bg-soft` (light) — the only logo we have reads correctly on a light background. (If you confirm from the archive render that the original footer was navy, you may use navy **only if** you also have a white/reversed logo; otherwise keep it light.)
- **"Quick Navigation"** column: Home→index.html · About→about.html · Blog→blog.html · Contact→contact.html.
- **Footer logo:** `logo-footer.png`.
- **Newsletter signup block:** label "Subscribe to our newsletter", an email input + **SUBSCRIBE** button, helper text "You can unsubscribe at any time." — **visual only** (button does nothing / shows an inert state).
- **Copyright line:** `© Certainte LLC | Terms of Service | Privacy Policy` — Terms→tos.html, Privacy→privacy.html.
- **3 social icons** (Twitter/X, Facebook, LinkedIn) — placeholders, `href="#"` (the originals were placeholders too).

---

## 5. Asset map

Real images live in **`~/ma-images`** (29 files; JPEG-encoded despite `.png` names — that's fine, keep the `.png` references). Copy them into `assets/images/` and **rename to the semantic names below**.

### Available — copy & rename (use these directly)
| Original (in ~/ma-images) | Rename to | Used as |
|---|---|---|
| `Asset-1@2x.png` | `logo-header.png` | Header logo (wordmark) |
| `MenuAmbition_Logo-002.png` (+ `-1280x314`,`-980x240`,`-480x118`) | `logo-footer.png` (+ sizes) | Footer logo (wordmark + tagline) |
| `Asset-1@2x-3.png` (+ `-1280x909`,`-980x696`,`-480x341`) | `illus-automation.png` | Home "Automation" — calendar/dashboard in blue circle |
| `MenuAmbition-Division-1.png` (+ `-980x610`,`-480x299`) | `illus-decision.png` | Home "Decision Certainty" — scenarios in navy circle |
| `MenuAmbition-Real-Time-Menu-Changes.png` (+ sizes) | `illus-whatif.png` | Home "What-if Scenarios" — optimizer in teal circle |
| `Menuambition-Continnual-Fly-Wheel-1.png` (+ `-480x532`) | `illus-flywheel.png` | Home "Continual Improvement" — Nutrition/Appeal/Costs/Final wheel |
| `Screen-Shot-2021-01-04-at-3.35.03-PM.png` (+ sizes) | `video-thumb-home.png` | Home hero video thumbnail (apple grid + play) |
| `Asset-4.png` | `icon-healthcare.png` | Markets — Long-term Healthcare |
| `Artwork1_21680b99-98a7-43d5-bbc7-a1beb7a64124.png` | `icon-corrections.png` | Markets — Correctional Institutions |
| `Artwork-2-1.png` | `icon-k12.png` | Markets — K-12 Education |
| `shape-background-6-2.png` | `hero-shape.png` | Hero decorative shape (**optional** — hero split is done with a CSS gradient; layer this only if it composites cleanly) |
| `cropped-...-Rubiks-Cube-1-32x32.png` / `-180x180` / `-192x192` / `-270x270` | `favicon-32.png` etc. | Favicon / app icons |
| `Screen-Shot-2021-02-17-at-10.29.57-AM.png` | `og-image.png` | Social share image (`og:image`) |

### Placeholders — gray (these images were never archived; do not try to fetch them)
Render as **neutral gray placeholders**:
- **Team headshots (About page):** a reusable **gray circular avatar** (generic person silhouette, `--ma-bg-soft` fill, muted gray icon). Used for all 7 people: founders **Rick Pedi**, **Shoaib Abbasi**; advisory board **Barb Wakeen**, **Rod Hart**, **Theo Paul**, **Dave DeWalt**, **Cindy Burns**.
- **Blog/article images** (blog hero, post headers, post thumbnails): **gray rectangular image-boxes** matching the intended aspect ratio (16:9 for headers, 4:3 for thumbnails), with a subtle centered image-glyph. (Affects blog.html and the three post pages.)

### Videos — live Vimeo embeds (nothing to host)
| Vimeo ID | Title | Where |
|---|---|---|
| `486491356` | MenuAmbition in 2 Minutes (1:44) | Home hero modal **and** `video-menuambition-in-2-minutes.html` |
| `520115489` | Comparing Menu Planning with Menu Optimization (1:21) | `menu-planning-vs-menu-optimization.html` |

Embed pattern:
```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID?dnt=1" loading="lazy"
        width="1080" height="608" frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
        title="VIDEO_TITLE"></iframe>
```

---

## 6. Page inventory (10 pages)

For each page, **fetch the 2026 `id_` source** and reproduce all visible content. Fetch with:
```bash
curl -sL "https://web.archive.org/web/<TIMESTAMP>id_/https://menuambition.com<path>" -o /tmp/page.html
# then extract visible text: headings, paragraphs, lists, stats, button labels, links.
# ignore Divi wrapper <div>s, <script>, and inline <style>. Add a ~1s pause between fetches to avoid 429s.
```

| # | Route | Nav/footer label | Capture timestamp | Path | Notes |
|---|---|---|---|---|---|
| 1 | `index.html` | Home | `20260213213009` | `/` | Hero + 6 content sections + markets + newsletter. Detailed in Prompt 1. |
| 2 | `about.html` | About | `20260308034227` | `/about/` | "Our Story" + Founders (2) + Advisory Board (5), all **gray avatars**. |
| 3 | `contact.html` | Let's Talk | `20260308025146` | `/contact/` | Contact form (First/Last/Email/Company/Message + non-functional Submit) + details: **847.323.5571**, **rpedi@menuambition.com**, **350 North Orleans St, Suite 9000 N, Chicago, IL 60654**. |
| 4 | `impact-calculator.html` | Impact Calculator | `20260120121445` | `/menuambition-impact-calculator/` | Interactive calculator. Reproduce the **layout/inputs/labels**; computation may be a simple JS stub or static (confirm desired behavior in its stage). |
| 5 | `blog.html` | Resources | `20260308024829` | `/blog/` | Index of 3 posts (cards link to the 3 post pages). Gray thumbnail placeholders. |
| 6 | `menu-planning-vs-menu-optimization.html` | (blog post) | `20250321213131` | `/menu-planning-vs-menu-optimization/` | Video post → **Vimeo 520115489** + body. |
| 7 | `video-menuambition-in-2-minutes.html` | (blog post) | `20251107011427` | `/video-menuambition-in-2-minutes/` | Video post → **Vimeo 486491356** + body. |
| 8 | `why-menu-planning-software-falls-short.html` | (blog post) | `20260308023850` | `/why-menu-planning-software-falls-short-for-institutional-foodservice-operators/` | Text article — reproduce full body. |
| 9 | `privacy.html` | (footer) | `20260308034132` | `/privacy-policy/` | Long legal text — reproduce in full from the fetched source. |
| 10 | `tos.html` | (footer) | `20260308032630` | `/tos/` | Long legal text — reproduce in full. |

---

## 7. Build rules / quality bar

1. **Reproduce, don't summarize.** Pull the real copy from each page's archive source; keep every section, post, and the two videos.
2. **Semantic, accessible HTML:** landmark elements (`header`/`nav`/`main`/`footer`), `alt` on every image (descriptive for real images; e.g. `alt=""` or "placeholder" for gray boxes), visible focus states, sufficient contrast.
3. **Responsive, mobile-first.** Hamburger nav < 980px; multi-column sections stack on mobile; images scale (`max-width:100%;height:auto`).
4. **Forms are inert.** Contact + newsletter render but never submit (`e.preventDefault()`; optionally show a small "preview only" note).
5. **Gray placeholders** exactly where the asset map says — never invent or hotlink missing images.
6. **One stylesheet, minimal JS.** No frameworks, no external JS except the Vimeo iframe.
7. **Keep header/footer identical** across all pages.

---

## 8. Deploy (GitHub Pages)

1. Ensure `.nojekyll` exists at repo root (prevents Jekyll from touching the files) and **all links are relative**.
2. `git init && git add -A && git commit -m "MenuAmbition static rebuild"`.
3. Create the GitHub repo, push to `main`.
4. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root**. Site appears at `https://<user>.github.io/<repo>/`.
5. Because Pages may serve under a `/<repo>/` subpath, prefer **relative** links (`about.html`, `assets/images/...`) over root-absolute (`/about.html`) so links work in that subpath.

---

## 9. Build order (stages)

1. **Stage 1 — Foundation + Home:** scaffold, `styles.css` design system, global header/footer, `index.html`. *(Prompt 1)*
2. **Stage 2 — About + Contact.**
3. **Stage 3 — Blog index + 3 posts (incl. both videos) + Impact Calculator.**
4. **Stage 4 — Privacy + Terms.**
5. **Stage 5 — Polish:** responsive QA, modal, favicons, `og:`/meta, cross-page link check, then deploy (§8).

Verify each stage renders before starting the next.
