# NewsLoopCarousel Specification

## Overview
- **Target files:** `src/components/cocota/NewsSection.tsx`, `src/app/globals.css`
- **User reference:** `Screen Recording 2026-07-21 at 15.43.49.mov`
- **Original section:** `https://cocotastudio.com/` `.home_news`
- **Interaction model:** button-controlled, infinite-loop carousel

## DOM Structure
- A clipped section contains the heading row and one non-scrollable carousel viewport.
- The heading row contains `WHAT'S NEW` plus previous/next buttons.
- The carousel track contains three copies of the original site's 13-item dataset (39 rendered cards) so either direction can cross the first/last boundary without a visible gap.
- Duplicate slides are hidden from assistive technology.

## Computed Styles From Original

### Desktop at 1920 × 929
- outer section width: `1920px`; overflow: hidden
- content width: `1872px` with `24px` page gutters
- heading row height: `79.1875px`; padding: `24px 0`
- controls gap: `32px`; button width: `20px`
- carousel top margin: `32px`
- carousel gap: `24px`
- slides visible: `4.1`
- computed slide width: `438.438px`
- slide grid: `163px 251.438px`
- image size: `163px × 163px`

### Transition
- per move: `1` slide
- duration: `400ms`
- easing: `cubic-bezier(.25, 1, .5, 1)`
- measured desktop step: `462.438px` (`438.438px` slide + `24px` gap)

## States & Behaviors

### Horizontal input
- Horizontal wheel/trackpad input does not change the carousel transform.
- The rail is not a native horizontal scroll container and has no scroll snapping.
- Touch action remains vertical-page scrolling only (`pan-y`).

### Previous/next buttons
- Previous moves exactly one slide left.
- Next moves exactly one slide right.
- Buttons remain enabled at both ends because the carousel is a loop.
- Keep accepting presses during the current `400ms` transition. Each press retargets the same transform by one additional slide from its current interpolated position, so rapid clicking stays fluid instead of pausing between cards.
- Only the transition-free clone reset may temporarily reject input.

### Infinite loop
- Render one copy before and one copy after the real slide set.
- Start on the middle copy.
- After entering either clone set, reset to the equivalent middle-copy position with transitions disabled, then re-enable transitions on the following frame.
- The reset must not be visually detectable.

### Arrow hover/focus
- Each arrow uses the site's two-copy vertical label pattern.
- Hover/focus moves the arrow track upward by `1.3em` over `450ms` with `cubic-bezier(.55, 0, .1, 1)`.

## Assets
- All 13 news images are downloaded from the original site and stored locally under `public/assets/cocota/news/`.
- The extraction/download manifest is `scripts/download-cocota-news-assets.mjs`.

## Original Content Order
1. `Studio Insights` — Don’t miss a thing! Join our Newsletter 📩 — `#b2a49c`
2. `Studio Insights` — Success Story Talk about IA at the EMEA WEConnect Conference 🎤 — `#e93d3b`
3. `Design leadership` — Cocota’s CEO named Lovie Awards Jury🏅 — `#ff5824`
4. `Just Launched` — Branding of a beauty oil UK based company — `#b89671`
5. `Campaign Launch` — Havaianas 🏖️ 2025 Activation in European Stores — `#e93d3b`
6. `Work in Progress` — Branding of a care provider UK based company — `#588da0`
7. `Studio insights` — DISC Personality Workshop — `#7a7a7a`
8. `Events` — We organized a fun afterwork event for international business leaders — `#589fd7`
9. `Design leaderhip` — Cocota’s Creative Director Teaching Interface Design at UPV, 2026 — `#000000`
10. `Studio Talks` — Talk 🎤 Stratosferica Madrid Urban City Walks on February 26-28 — `#555555`
11. `Recognitions` — Cocota, Site of the Day at the Awwwards🏅 — `#ff5824`
12. `Studio Talks` — Talk 🎤 at Europe Supplier Diversity & Inclusion Conferece in Paris — `#2835f6`
13. `Recognition` — European Design Awards 2024 Winners in Digital Design 🥈 — `#af0896`

Items 1, 11, 12, and 13 retain their original external links. Original spelling and capitalization are preserved verbatim, including `leaderhip`, `Awwwards`, and `Conferece`.

## Responsive Behavior
- **Desktop:** `4.1` slides per view; `2.4rem` gap.
- **Tablet:** `1.6` slides per view; `2.4rem` gap.
- **Mobile:** `1.1` slides per view; `1.6rem` gap; `13.2rem` image column.
