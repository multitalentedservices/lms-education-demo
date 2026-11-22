# PERFORMANCE PACK — Sabaq Academy LMS Demo (Queue #8)

Purpose: everything the served-preview measurement needs from the build side. The main agent serves finished sites via GitHub Pages; this pack records the measured local weights and the weight-discipline choices made so the served numbers can pass when measured. **No Lighthouse or Core Web Vitals numbers are claimed anywhere in this pack — none exist yet (see the pending section).** Filed in the 2026-11-21 top-up pass from the build's own battery output and filesystem; no figure is estimated.

## Measured weights (local, 2026-11-21, from the test battery + filesystem)
- Code (5 HTML pages + css/style.css + all js/): **37,657 B total** — budget < 400 KB, using ~9% of it (battery figure, tests-output.log).
  - Largest single file: js/logic.js (the shared pure-logic module, 10,967 B).
- Media: **405,275 B total across 6 photographs** — budget ≤ 1.6 MB, using ~25% of it (battery figure; the 220 B favicon.svg is additional and negligible).
- Per-image sizes (each under the ≤ 120 KB ceiling):
  - assets/hero.jpg — 73,907 B
  - assets/cat-design.jpg — 72,572 B
  - assets/cat-language.jpg — 71,984 B
  - assets/cat-data.jpg — 65,735 B
  - assets/cat-business.jpg — 64,749 B
  - assets/cat-web.jpg — 56,328 B
  - assets/favicon.svg — 220 B (text)

## Weight-discipline choices (why the served numbers should pass)
- **Zero JavaScript libraries and zero CSS frameworks.** Hand-coded vanilla JS + one stylesheet; the only third-party request is Google Fonts (Lora + DM Sans, `display=swap` — text renders on the fallback first, no blocked first paint waiting on font files).
- **No synchronous third-party loads beyond the font stylesheet** — no analytics, no embeds, no trackers; enrolments, progress and the WhatsApp log write only to the visitor's own localStorage.
- **One photograph per category, reused** across the home featured row, the catalogue cards and the course detail page: 12 courses are served by 6 photographs, so the 12-card catalogue page's image weight stays bounded.
- **No layout-shift machinery:** card images sit in fixed 16/9 frames, cards have stable structure, and there are no popups, cookie banners or late-injected bars. The only animation is a subtle hero drift, disabled under `prefers-reduced-motion` (reduced-motion capture set filed, 0 findings).
- **Reveal-by-default:** content is visible without JS (JS-disabled capture set filed, fully visible), so first paint is HTML + CSS + the hero image only.
- **Small DOM:** the heaviest page (Catalogue, 12 cards) is generated from the ~11 KB logic module — no per-course HTML files beyond the one dynamic detail page.

## Served-preview CWV: PENDING — to be measured on the GitHub Pages preview by the main agent
- LCP / INP / CLS: **not measured** — the build is not deployed, and no numbers are estimated or invented here (honesty rule). Lab numbers from the local file:// preview are not filed in this pack because the #11–#14 pack standard records weights only until a served measurement exists.
- Expected risk points to check at measurement: hero image weight on slow mobile (73,907 B, single image — should be the LCP element), font swap behaviour, and the 12-card catalogue page's image decode cost.
- Fixed by: the main agent deploying the GitHub Pages preview and filing a measured Lighthouse report against this pack; Area 7 of the scorecard is scored on partial (weight) evidence until then.
