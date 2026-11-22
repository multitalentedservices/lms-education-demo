# SIGN-OFF PACK — Prepared for AICOS-112 §0 (Design Systems & Template Library)

Build: Sabaq Academy — LMS / Education Demo (plugin-based MVP-style LMS front-end), Portfolio Queue #8
Client-facing owner: BalanceBit Solutions · Production: MTS · Date prepared: 2026-11-21 (top-up pass — this build predates the pack requirement; the pack documents the site exactly as built, nothing aspirational)
Status: **prepared for AICOS-112's §0 sign-off — the sign-off itself is AICOS-112's to record; it has NOT been given yet and is not claimed anywhere in this build.**

## 1. Design-direction note
- **Identity:** "Scholarly paper-and-green." An academy register executed as a well-kept library book: warm paper ground, ink text, one deep academic green, a scholarly serif for display and a humanist sans for body.
- **Register:** a dark-green demo bar and a ruled header (2px ink rule under the nav) frame every page like a register's cover; course cards read as catalogue entries — category · level chip on a tinted band, serif title, one metadata line (instructor · demo rating · lessons · duration), price, and a single full-width green action. The course detail page is a prospectus: what-you-learn list, a curriculum accordion whose totals line (modules · lessons · total duration) is computed from the data, an instructor panel and a price-summary panel, both on the tinted paper band with a green outline.
- **Why it fits an LMS:** a catalogue is a scanning instrument and a curriculum is a document. The paper/serif register gives both the calm of a printed prospectus, and the single green keeps every action (browse, view, enrol, confirm) in one unmistakable colour. The §0 screenshot test: this layout could not belong to a shop (no cart/checkout), a clinic (no practitioners), a salon or a SaaS product — it reads as an academy's catalogue at a glance, on desktop and phone.
- **Distinctness from all predecessors:** no predecessor used a warm paper ground with an academic green and a scholarly serif (Lora). Gift Basket is cream/terracotta/emerald editorial, Restaurant ink/parchment/brick with Fraunces, MTS black/white/lime poster, Salon porcelain/blush/bronze with Cormorant, Clinic white/petrol with Libre Franklin, Real Estate navy/copper with Space Grotesk, Booking Engine white/slate SaaS with indigo/rose/teal skins. This build is deliberately anti-SaaS.

## 2. Inspiration references actually used (researched 2026-11-21, as recorded in BUILD-NOTES.md)
- **Coursera catalogue UX** (search results opened 2026-11-21): cards lead with category/level, skills and rating metadata; catalogue organised around category + level faceting. Taken: category + level + search faceting with a live "Showing X of Y" count, and metadata-dense course cards. Patterns taken, no assets or text copied.
- **Udemy course detail pages** (course pages opened via search 2026-11-21): "What you'll learn" list, course-content summary line (sections • lectures • total length) above a curriculum accordion, instructor block, price panel. Taken: what-you-learn list, computed curriculum totals line, module accordion with per-lesson durations, instructor card and price summary — all computed from the same logic module, never hand-typed. Patterns taken, no assets or text copied.
- Design-Inspiration-Library (`~/workspace/mts-webdev-company/Design-Inspiration-Library.md`): the library has no education/LMS section; its Corporate services entries (Stripe + Linear) informed hierarchy discipline only — restraint, hierarchy before decoration. No library visual system was adopted; the visual system here is this build's own.

## 3. Palette & type token table (complete — the only colours in the build, from css/style.css `:root`)
| Token | Hex | Role |
|---|---|---|
| --paper | #FAF6EC | Warm paper page ground |
| --paper2 | #F1EAD8 | Tinted band: chips, notice/instructor/price panels, progress track |
| --ink | #22271F | Body text, headlines, header/footer rules |
| --muted | #47503F | Secondary text, field borders |
| --green | #173F2C | THE accent: primary buttons, links, active nav, focus ring |
| --green-dark | #0F2E1F | Demo bar ground (dark variant of the accent) |
| --line | #D8CFB8 | Hairlines, card borders |
| --error | #B3261E | Semantic error red — the ONLY extra hue, form errors only |
| --focus | #173F2C | Focus ring (= the accent) |

Card ground is #FFFFFF (literal in the stylesheet, not a token). Contrast (computed from hex in the battery, all PASS — exact values in tests-output.log and Scorecard-Verdict.md): ink on paper 14.12:1 · green on paper 10.91:1 · error red on paper 6.06:1 · focus 10.91:1 vs the 3:1 bar; 9 contrast assertions, every text pairing ≥ 4.5:1.

| Type token | Face | Role |
|---|---|---|
| Display | "Lora", Georgia, serif | Headlines, logo, card titles (scholarly serif) |
| Body | "DM Sans", system-ui, sans-serif | Body, forms, UI (17px base); form fields 16px (no iOS zoom) |

Component tokens: one button system (`.btn` — 52px min-height, 10px radius, 2px border; filled green = primary action, `.alt` transparent/green-outline = secondary; `:disabled` = opacity .55 + not-allowed cursor), one field system (52px, 2px muted border, 10px radius, bold label above, error line below in --error), one card system (white ground, 1px --line border, 14px radius, 16/9 image, identical body rhythm: chip → title → meta → price → full-width button), one chip system (pill, --paper2 ground, --line border).

## 4. Evidence filed for the sign-off read
- Full-page captures of every page at 1440 / 768 / 390 + 320px homepage probe + JS-disabled and reduced-motion sets: `screenshots/` (audit.json per set — 0 overflow / 0 leaf text-overflow / 0 broken images in every set).
- Component-consistency pass, page by page: `Component-Consistency-Pass.md` (filed in the same top-up pass as this pack).
- Flow evidence: `screenshots/flow-log.txt` + flow captures (filter empty state, course detail, enrol errors, enrol confirmation LM-DEMO-1372 at PKR 35,700 exact, learning progress persistence, cross-surface seat proof 8 → 7 → 8).
- Test battery: `tests-output.log` — 82 PASS / 0 FAIL, including 9 contrast assertions computed from the tokens above. One assertion amendment is disclosed in BUILD-NOTES.md (Beginner count 6 → 7 after recount).

## 5. What AICOS-112 is asked to record
- §0 screenshot test result against §1 above (layout could not belong to another industry).
- Palette/type discipline confirmation against §3 (no stray colours in the rendered captures).
- Sign-off, or defects returned as: what is wrong · where · what fixed looks like.
