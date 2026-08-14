# Case-study redesign — handoff (2026-08-13)

Continues the `/casestudy` redesign from Figma **"layout updates"** section
`node-id=626-1241` (file key `vflbItxcCP2ePz74q7yZPq`). Scope: **/casestudy only**
(main portfolio root untouched).

## ⚠️ Deploy state — READ FIRST
- All redesign work is **UNCOMMITTED** in the working tree. `git status` shows it.
- **Do NOT `git push` until all 8 detail pages are done** — push to `origin/master`
  auto-deploys live via Cloudflare. Half-finished = live half-finished.
- Last DEPLOYED commit is the image-optimization work (WebP variants). The redesign
  is on top of that, unpushed.
- Local preview server: `preview_start {name:"casestudy"}` → http://localhost:8787
  (serves the `casestudy/` folder). Hard-refresh; it caches hard.

## DONE and verified (matches Figma real values)
- **Shared header** (`header.css`, markup in each page): wordmark logo left
  (`images/cases/logo-wordmark.svg`), right = "Portfolio ↗" → https://www.samueleluyera.com/
  (new tab) + "About" button (`data-open-about` → modal). bg #f4f6fa, 0.5px #dbdfe7 border.
- **About modal** (`about-modal.css` + `about-modal.js`): full-height centered 840px sheet,
  SOLID #f4f6fa overlay (no transparency/blur — user was firm on this), portrait-left
  (`images/cases/about-portrait.webp`, 832×832, re-exported from Figma node 627:1837 so the
  face is framed correctly) / 4 sections right: How I Got Here, The Work I Take, Outside
  Client Work, What's Next (copy already in the JS).
- **Hub** (`index.html`): header added; sidebar is a 0.5px #dbdfe7 box, no "Case Studies"
  title, active item = white pill + 0.5px #e8e9ed border + shadow `0 1px 1px rgba(5,22,57,.08)`,
  3 real social icons at bottom; cards are TITLE-ONLY (descriptions removed) with 0.5px border.
- **Analytics detail = THE TEMPLATE** (`healthcare-analytics.html`): header; rail is a 0.5px
  box (back → title in **Medium 500** → tags at **0.5px #d0d9eb** → **TL;DR box** bg #e4ebf8,
  label italic #13387e); description + bio/socials REMOVED; Prev/Next restyled
  (Next = white+shadow, Previous = 0.5px #dbdfe7 transparent); content column: text blocks
  inset 40px (max 560), images/tables full 640.
- **Icons**: use the REAL Figma SVG assets, NOT hand-drawn (user corrected this — important
  standing rule). Files in `images/cases/`: `icon-arrow-left.svg` (back), `icon-forward-next.svg`
  (pager forward-02 glyph; Previous flips via `.pager-prev img{transform:scaleX(-1)}`),
  `icon-x.svg` (modal close), `icon-globe/linkedin/sent.svg` (socials), `icon-call-made.svg`
  (header external arrow, inlined). Any new icon → download the asset, never draw it.

## TODO — roll template to the other 7 detail pages
Apply the identical template to: healthcare-careplans, enterprise-insurance-advisors,
finance-loan-application, marketplaces-ab-testing, mobile-actors-app, mobile-lending, ai-copilot.
Per page: add header block; restructure rail to (back → rail-title-block[h1+rail-pills] →
rail-tldr); REMOVE `.rail-desc` and the whole `.rail-bio` block; swap back+pager icons to the
real `<img>` assets; add the extra closing `</div>` (wrap now nests `.case-shell` inside `.wrap`).
Copy `healthcare-analytics.html`'s head/header/rail block as the pattern.

**BLOCKED ON USER:** each page's **TL;DR paragraph**. User said they'll provide the 7.
Only Analytics' TL;DR exists (from Figma). Do NOT invent portfolio copy — wait for them.

## Confirmed decisions (from the user)
- Scope: /casestudy only. Portfolio link → root, new tab. About → modal.
- Removed: hub card descriptions; detail-page bio+socials; detail-page description.
- Pager order on mobile was next→previous per an earlier request (kept).
