# Satyr Listen Interaction Specification

## Overview

- **Target files:**
  - `src/features/home/components/SatyrGate.tsx`
  - `src/features/home/components/SatyrGate.test.tsx`
  - `src/features/home/adventure.css`
- **Static screenshot:** `docs/design-references/gate-listen-original.png`
- **Motion reference:** user recording `Screen Recording 2026-07-28 at 16.07.18.mov`
- **Interaction model:** click-driven, time-based Webflow action sequence
- **Original action list:** `a-38` (“Ecouter le bouctin”) in
  `docs/research/original-webflow.js`

## Current Defect

- Dialogue lines are laid out below the jungle artwork and overlap the action
  area.
- The clone displays `Listen carefully…`, which does not exist on the original.
- Existing lines do not travel upward as the next line enters.
- The first “Hey !” line disappears when line two enters; the original keeps it
  until the final opening beat.
- The action timing differs from the original Webflow action list.

## DOM Structure

The art wrapper contains, in this stacking order:

1. One absolutely positioned dialogue container.
2. The jungle SVG.
3. The idle Satyr Lottie.
4. The punch Lottie when attacking.
5. The tears Lottie when attacking.

The dialogue container always renders all seven dialogue rows. Hidden rows use
opacity and remain in layout so the original `58px` row rhythm is preserved.

## Computed Styles

Values were extracted from the live original at a `1916 × 932` viewport.

### Satyr Section

- width: `1916px`
- height: `932px`
- background: `rgb(18, 20, 29)`
- padding-inline: `5vw` (`95.8px`)
- layout: centered vertical flex column

### Upper Dialogue Panel

- position: absolute
- inset: `0 0 auto`
- width: `100vw`
- height: `50vh` (`466px`)
- background: `rgb(30, 32, 41)`
- initial opacity: `0`
- listening opacity: `1`
- transition duration: `500ms`

### Jungle Composition

- width at reference viewport: approximately `275px`
- height: `35vh` (`326.2px`)
- top at reference viewport: approximately `264px`

### Dialogue Container

- position: absolute
- top: `0`
- z-index: `100`
- width: `280px`
- height: `406px` (`7 × 58px`)
- display: flex
- flex-direction: column
- align-items: center
- pointer-events: none
- transform transition: `1s ease`

### Dialogue Row

- width: `280px`
- height: `58px`
- flex: `0 0 58px`
- background: `rgba(30, 32, 41, 0.72)`
- display: flex
- flex-direction: column
- align-items: center
- opacity transition: `500ms ease`

### Character Label

- margin: `0`
- font-family: Inter, sans-serif
- font-size: `16px`
- font-weight: `600`
- line-height: `30px`

### Dialogue Copy

- width: `100%`
- margin: `0 0 10px`
- font-family: Inter, sans-serif
- font-size: `15px`
- font-weight: `300`
- line-height: `18px`
- text-align: center

### Action Button

- width: `240px`
- height: `40px`
- bottom offset: `10vh`
- exit opacity transition: `500ms ease`
- enter opacity transition for Attack: `500ms ease`

## Listen States and Timing

The timing below is measured from clicking `Listen to the satyr`.

### Initial State

- Dialogue transform: `translateY(0)`
- All seven rows: opacity `0`
- Upper panel: opacity `0`
- Attack: not displayed

### 0ms

- Listen button fades from opacity `1 → 0` over `500ms`, then is removed.
- Upper panel fades from opacity `0 → 1` over `500ms`.
- Row 1, `Satyr / Hey !`, fades to opacity `1` over `500ms`.
- Dialogue moves to `translateY(-65px)` over `1s`.
- Do not render a waiting label.

### 2000ms

- Row 2 fades to opacity `1` over `500ms`.
- Dialogue moves to `translateY(-120px)` over `1s`.
- Row 1 remains visible.

### 4000ms

- Row 3 fades to opacity `1` over `500ms`.
- Dialogue moves to `translateY(-175px)` over `1s`.
- Rows 1 and 2 remain visible.

### 6000ms

- Row 4 fades to opacity `1` over `500ms`.
- Row 1 fades to opacity `0` over `500ms` but remains in layout.
- Dialogue moves to `translateY(-235px)` over `1s`.
- Attack is displayed and fades from opacity `0 → 1` over `500ms`.

## Attack States and Timing

The timing below is measured from clicking `Attack !`. It follows original
action lists `a-36`, `a-37`, and `a-63`.

### 0ms

- Attack fades out over `500ms`, then is removed.
- Row 2 fades out over `500ms`.
- Row 5, `Gus / Take that instead !`, fades in over `500ms`.
- Dialogue moves to `translateY(-295px)` over `1s`.
- Punch plays once over `2s`.
- Tears start immediately and play once over `1.5s`.

### 2000ms

- Row 3 fades out over `500ms`.
- Row 6 fades in over `500ms`.
- Dialogue moves to `translateY(-350px)` over `1s`.

### 4000ms

- Row 4 fades out over `500ms`.
- Row 7 fades in over `500ms`.
- Dialogue moves to `translateY(-415px)` over `1s`.

### 5000ms

- Mark the Satyr gate complete.
- Show the original `fleche_V2.json` continuation Lottie at `40 × 40px`.
- Loop the circular outline-to-down-arrow animation; do not substitute a
  CSS-drawn chevron.

## Accessibility

- Keep semantic buttons.
- Disable the fading button immediately after activation to prevent repeat
  clicks.
- Keep the dialogue container as an `aria-live="polite"` region.
- Opacity-zero dialogue rows must not be announced; apply `aria-hidden="true"`
  until each row becomes visible.

## Responsive Behavior

- Preserve the same timing and state sequence at every breakpoint.
- Desktop uses the exact `280px` dialogue width and `58px` row height.
- On small screens, cap row width at `90vw` without changing the seven-row
  layout or transform offsets.
- Do not introduce horizontal overflow.
