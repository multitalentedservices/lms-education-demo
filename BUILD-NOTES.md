# BUILD NOTES — Sabaq Academy, LMS / Education Demo (Portfolio Queue #8)

Client-facing owner: BalanceBit Solutions · Production: MTS · DEMO data only.
Pricing v3 mapping: LMS tier — presented honestly on every page as a **plugin-based MVP-style LMS front-end**, not a custom platform.

## Fictional academy
**Sabaq Academy** ("sabaq" = a lesson) — a fictional online academy for learners in Pakistan and worldwide. 12 fictional courses, 5 categories (Web Development, Design, Business, Data, Languages), fictional instructors, demo ratings, PKR prices, limited demo seats.

## Design identity (own, distinct from all predecessors)
- **Scholarly paper-and-green:** warm paper `#FAF6EC`, ink `#22271F`, deep academic green `#173F2C` (dark variant `#0F2E1F`), muted olive-grey text `#47503F`, hairline `#D8CFB8`. One accent discipline: green only; the only extra hue is the semantic error red `#B3261E`.
- **Type:** Lora (scholarly serif display) + DM Sans (humanist sans body). Distinct from Gift Basket (cream/terracotta/emerald editorial), Restaurant (ink/parchment/brick, Fraunces), MTS (black/white/lime poster), Salon (porcelain/blush/bronze, Cormorant), Clinic (white/petrol, Libre Franklin), Real Estate (navy/copper, Space Grotesk), Booking Engine (white/slate SaaS, indigo/rose/teal skins).
- Justification: an academy should feel like a well-kept library register — paper ground, ink text, one bookish green — not a SaaS dashboard or a shop.

## References consulted (fresh research, 2026-11-21)
- **Coursera catalogue UX** (search results opened 2026-11-21): cards lead with category/level, skills and rating metadata, and the catalogue is organised around category + level faceting. Taken: category + level + search faceting with a live "Showing X of Y" count, and metadata-dense course cards.
- **Udemy course detail pages** (course pages opened via search 2026-11-21): "What you'll learn" list, a course-content summary line (sections • lectures • total length) above a curriculum accordion, instructor block, and a price panel. Taken: what-you-learn list, computed curriculum totals line (modules • lessons • total duration), module accordion with per-lesson durations, instructor card and price summary — all data computed from the same logic module, never hand-typed.
- Design-Inspiration-Library: Stripe/Linear entries informed only the discipline (hierarchy before decoration); the visual system here is deliberately anti-SaaS.

## Features
- Pages: Home, Course Catalogue, Course Detail (dynamic, `course.html?id=`), Enrol, My Learning.
- Catalogue: combined category + level + search filters, 4 sorts, live counts, URL-param state kept in sync with the controls (lesson 28), empty state naming the exact constraint with one-click reset.
- Detail: curriculum accordion with totals computed exactly by `js/logic.js`, what-you-learn, fictional instructor card, price summary, seat count, WhatsApp enquiry (click recorded to `lm_wa_log`, lesson 21).
- Enrolment: course preselected from detail, validation naming the constraint (name ≥3 chars; email format; PK mobile `03XX XXXXXXX`), errors clear live as fixed (lessons 25/26), honest payment-placeholder step (PK route note: JazzCash/EasyPaisa/card via a PK processor — demo takes no payment, stores nothing on a server), deterministic-style reference `LM-DEMO-####`, exact totals.
- Discount rule: 15% launch discount on courses priced PKR 25,000 or more, computed in the shared logic module and battery-proven at the boundary (24,999 → 0; 25,000 → 3,750).
- Seats: shown on detail; enrolment decrements, cancel in My Learning restores — proven cross-surface in the flow run (lesson 30).
- My Learning: localStorage enrolments, progress bar with a "Mark progress +10%" interaction that persists across reload (proven in flow run), cancel enrolment, continue links back to curriculum.

## Media
- 6 real generated photos, one consistent warm documentary style (deep green / warm cream): hero + one per category. Each ≤ 120 KB (56–74 KB), total 405 KB.
- Video: none — photo + CSS motion (hero drift animation, disabled under prefers-reduced-motion). Video generation is region-blocked (403); not attempted.

## Stack & QA
- Hand-coded HTML/CSS/vanilla JS, zero packages/CDN libs (Google Fonts only). One pure-logic module (`js/logic.js`) shared by site and Node test battery (lesson 13).
- Reveal-by-default: no JS-hidden content anywhere; JS-disabled captures filed.
- Tests: see `tests.js` / `tests-output.log`. Screenshots + flow run: see `screenshots/` (audit JSON per set, `flow-log.txt`, `keyboard-walk.md`).

## Disclosures
- One test assertion was corrected during the build: the Beginner filter count was initially written as 6 from a hand count; the catalogue data contains 7 Beginner courses, verified by recounting the data. The assertion was amended to 7 and the battery re-run — disclosed here per lesson 9, not silently.
- A syntax error in the first draft of `js/logic.js` (misplaced brace in the course factory) was caught by the battery's first run and fixed before any pass was claimed.
