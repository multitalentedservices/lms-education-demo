# COMPONENT-CONSISTENCY PASS — Sabaq Academy LMS Demo (Queue #8)

Pass run: 2026-11-21, top-up pass (this build predates the recorded-pass requirement; the pass was run retrospectively against the build's existing filed captures — no re-shoot, no code touched).
Method: every page's full-page captures read by eye (desktop 1440 + phone 390 for all pages; tablet 768 filed and covered by the audit), plus the flow captures for error/disabled states. Machine audit cross-check: `screenshots/audit.json` (+ probe320, nojs, reduced sets) — 0 overflow, 0 leaf text-overflow, 0 broken images in every set.
Checks per page: (1) buttons form one system · (2) fields aligned + labelled with visible error states · (3) spacing rhythm holds · (4) palette discipline (only the Signoff-Pack §3 tokens) · (5) disabled states visibly disabled where they occur.

## Per-page results

### Home (index.html) — PASS
- Captures: screenshots/index-desktop.png · index-phone.png · index-tablet.png
- Buttons: one system — filled green "Browse courses" (primary) + transparent green-outline "My Learning" (`.alt` secondary), same 52px height/radius/border; card "View course" buttons identical full-width green on all 3 featured cards, both viewports.
- Fields: none on this page.
- Spacing/palette: hero → featured grid → notice panel → footer rhythm identical at both widths; paper/paper2/green/ink only. No defects.

### Course Catalogue (courses.html) — PASS
- Captures: screenshots/courses-desktop.png · courses-phone.png · courses-tablet.png · flow-filter-empty.png
- Buttons: the same card button system across all 12 cards; grid alignment holds in 3-column desktop and 1-column phone layouts.
- Fields: Search / Category / Level / Sort — every control has a bold label above it, all four fields identical height (52px), border and radius, aligned in one row on desktop and stacked in the same order on phone. Empty state (flow-filter-empty.png) names the exact constraint ("category = Data, level = Advanced") with a one-click reset in the same dashed-panel system as other empty states.
- Palette: chips on paper2 with line borders throughout; no stray colour. No defects.

### Course Detail (course.html) — PASS
- Captures: screenshots/course-desktop.png · course-phone.png · course-tablet.png · flow-course-detail.png
- Buttons: "Enrol now (demo)" filled green + "Ask on WhatsApp" outline — the same primary/secondary pair as Home; the price panel repeats the same filled enrol button. Curriculum accordion rows are uniform (module header + hairline-separated lesson rows with right-aligned durations).
- Fields: none on this page. Panels (instructor, price summary) share one system: paper2 ground, green outline, serif heading.
- No defects.

### Enrol (enrol.html) — PASS
- Captures: screenshots/enrol-desktop.png · enrol-phone.png · enrol-tablet.png · flow-enrol-errors.png · flow-enrol-confirmation.png
- Fields: Course select, Full name, Email, Mobile — bold label above every field, identical 52px height / 2px border / 10px radius, full-width alignment; the price line sits directly under the course select in the same position in every capture.
- Error states: VISIBLE — flow-enrol-errors.png shows the mobile error in the semantic error red directly under the field, naming the constraint ("Enter a Pakistani mobile in the format 03XX XXXXXXX (11 digits starting 03)"); the battery + flow log record the same pattern for name/email and live clearing as each field is fixed.
- Buttons: single filled-green "Confirm demo enrolment"; the payment panel is the shared notice-panel system, honestly labelled a placeholder. No defects.

### My Learning (learning.html) — PASS
- Captures: screenshots/learning-desktop.png · learning-phone.png · learning-tablet.png · flow-learning-progress.png
- Empty state (phone capture read): dashed panel + centred heading + the same filled-green "Browse courses" button — identical empty-state system to the catalogue's. Enrolled state (flow-learning-progress.png): progress bar in the single green on a paper2 track, "Mark progress +10%" and cancel controls in the same button system; progress persisted across reload in the flow run.
- No defects.

## Disabled states
- The button system defines a disabled state in css/style.css (`.btn:disabled` — opacity .55 + `cursor: not-allowed`), i.e. visibly faded, not just inert.
- No disabled button occurs in any filed capture or flow: the demo's flows never disable a control (validation is message-based, and the seat/capacity rules are enforced with named errors instead). Recorded honestly as **defined in the system, not exercised in the captured flows** — not claimed as visually verified.

## Defects found
- **None.** All 5 pages pass on all five checks at desktop and phone widths, with the audit sets (tablet, 320px probe, JS-disabled, reduced-motion) at 0 findings.

## Outcome
**PASS — 5 of 5 pages.** This pass changes no code and no score; it is filed as evidence for the AICOS-112 §0 read (see Signoff-Pack.md) and the owner's all-pages verification gate.
