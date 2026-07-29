# Finale / The End Specification

## Overview

- **Target files:**
  - `src/features/home/components/FinaleScene.tsx`
  - `src/features/home/adventure.css`
- **Motion reference:** user recording
  `Screen Recording 2026-07-28 at 16.51.39.mov`
- **Original screenshots:**
  - `docs/design-references/the-end-original-72.png`
  - `docs/design-references/the-end-original-77.png`
  - `docs/design-references/the-end-original-81.png`
  - `docs/design-references/the-end-original-85.png`
  - `docs/design-references/the-end-original-90.png`
- **Interaction model:** scroll-driven Webflow continuous action with smoothing
  `75`.
- **Original action lists:** desktop `a-33`, mobile `a-69`, designer `a-64`,
  contact `a-65`.

## Current Defects

- The contact placeholder color inherits the browser's semi-transparent white
  instead of the original solid `#999`.
- The textarea height is hard-coded, producing a `50.265625px` rendered height
  instead of the original browser-derived `50.28125px`.
- The footer link can wrap at its hyphen because it is missing the original
  `white-space: nowrap`; this can leave `Pierre-` on the first line and `Louis`
  on the second.

## Homecoming Structure

The `1000vh` homecoming section contains a `100vh` sticky wrapper:

1. Desktop landscape composition.
2. Mobile portrait landscape composition.
3. Full-viewport end overlay containing:
   1. an absolutely positioned full-viewport THE END visual;
   2. a left curtain;
   3. a right curtain.

THE END must be above the curtains. Curtains sit above the landscape and close
from both viewport edges toward the center.

## Desktop Computed Styles — 1916 × 932

### Homecoming Section

- width: `1916px`
- height: `9320px` (`1000vh`)
- margin-top: `-1864px` (`-200vh`)
- padding: `95.8px` (`5vw`) on all sides
- display: flex
- align-items: center
- justify-content: flex-start
- box-sizing: border-box

### Sticky / Landscape

- sticky width: `1724.4px` (`90vw`)
- sticky height: `932px`
- sticky position: `sticky`, top: `0`
- landscape width: `100%`
- landscape aspect ratio: original asset ratio `3457 / 1478`
- landscape screenshot bounds: approximately `x=96`, `y=98`, `w=1724`,
  `h=738`

### End Overlay

- position: absolute
- width: `100vw`
- height: `100vh`
- display: flex
- justify-content: space-between
- overflow: hidden
- THE END visual: absolute, full viewport, opacity/scale applied here only
- THE END Lottie canvas: `100% × 100%`

### Curtains

- two identical normal-flow flex children
- height: `100vh`
- initial requested width: `0vw`
- final requested width: `100vw`
- flex shrink remains enabled; when their combined width exceeds the viewport,
  each computes to `50vw` (`958px`)
- background: `rgb(18, 20, 29)`
- box-shadow: `rgb(18, 20, 29) 0 0 20px 1px`

## Scroll Timeline

The curtain width uses linear interpolation. THE END opacity, scale, and Lottie
progress use Webflow `ease` interpolation.

- `15% → 75%`: character walk Lottie `0% → 100%`.
- `72% → 90%`: each curtain requested width `0vw → 100vw`.
- `77% → 90%`: THE END opacity `0 → 1`.
- `77% → 90%`: THE END scale `2 → 1`.
- `81% → 90%`: THE END Lottie progress `0 → 99%`.

Observed original desktop states after smoothing settles:

- `72%`: curtains approximately `1px`; THE END opacity `0`, scale `2`.
- `77%`: each curtain approximately `532px`; THE END still invisible.
- `81%`: each curtain approximately `957px`; THE END opacity `0.527`, scale
  `1.473`, colored outline trails visible.
- `85%`: curtains fully closed; THE END opacity `0.895`, scale `1.105`.
- `90%`: curtains `958px` each; THE END opacity `1`, scale `1`.

## Contact Section Exact Styles

### Designer

- scene: `1916 × 932`, padding-inline `95.8px`
- background: `linear-gradient(#12141d 38%, transparent)`
- card: `300 × 300px`, min-width `240px`, radius `14px`, transparent dashed
  border, shadow `0 0 17px -1px #000`
- heading: `14px / 30px`, weight `600`
- logo: `48 × 48px`, margin-top `8px`
- Discover: height `36px`, padding `9px 30px`, margin-top `20px`

### Contact Form

- scene: `1916 × 932`, padding-inline `95.8px`
- card: `450px` wide, `40px` padding, radius `14px`, background `#12141d`,
  shadow `0 0 9px rgb(0 0 0 / 0.63)`
- icon: `90 × 90px`, margin-bottom `40px`
- heading frame: `370 × 50px`, padding `10px 30px`, margin-bottom `40px`
- heading: `14px / 30px`, weight `600`
- form/status wrapper: margin-bottom `15px`
- labels: `15px / 18px`, weight `700`, margin-bottom `5px`
- email input: `370 × 38px`, padding `8px 12px`, margin-bottom `10px`
- textarea: `370 × 50.28px`, padding `8px 12px`, margin-bottom `10px`
- inputs: `12px / 17.14px`, background `#20232f`
- placeholders: solid `#999`
- submit: `370 × 36px`, padding `9px 15px`, margin-top `20px`
- footer: `450 × 56px`, margin `20px 0`, padding `10px 26px`, radius `100px`
- footer copy: `12px / 18px`
- footer link: weight `600`, `white-space: nowrap`

The textarea should retain its native two-row automatic height rather than a
fixed pixel height. With the original `12px / 1.42857` line-height and
`8px 12px` padding, Chromium resolves it to `50.28125px` at the reference
viewport.

## Contact Scroll Timeline Verification

The contact scene uses action list `a-65` with smoothing `70`.

- `10%`: scene opacity `0.2`; card translateY `30vh`.
- `31%`: scene opacity `1`; the card continues moving upward.
- `50%`: card translateY `0`.

At `1916 × 932`, live original and clone measurements at the same absolute
scroll positions agree:

- `10%`: scene top `745.59375px`; original card translateY `279.6px`; clone
  `279.599px`.
- `31%`: scene top `354.59375px`; original card translateY `48.6951px`; clone
  `48.7591px`.
- `50%`: scene top `-0.40625px`; both cards top `154.953125px` with no
  translation.

The contact animation mapping and scene/card geometry must remain unchanged.

## Text Content

- Email placeholder: `elon.musk@tesla.com`
- Message placeholder: `I love the concept, let's work together !`
- Footer:
  `A tiny adventure 2025 - All rights reserved - Made with love by Pierre-Louis`

## Responsive Behavior

- At `479px` and below, homecoming height becomes `500vh`.
- Desktop landscape is hidden and the portrait landscape fills the sticky
  viewport with `object-fit: cover`.
- Mobile uses action list `a-69`, whose curtain and THE END keyframes are
  identical to the desktop timeline.
- THE END overlay and Lottie remain `100vw × 100vh`; do not cap their width.
