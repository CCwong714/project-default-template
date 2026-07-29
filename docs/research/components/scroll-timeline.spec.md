# Scroll Timeline Specification

## Overview

- **Target files:** `src/features/home/hooks/useElementScrollProgress.ts`,
  `src/features/home/components/LottieAsset.tsx`, scene components, and
  `src/features/home/adventure.css`.
- **References:** original Webflow runtime, original live DOM, and
  `Screen Recording 2026-07-23 at 15.11.13.mov` plus the Chapter 2 transition
  recording from 2026-07-27 at 16.24.47.
- **Interaction model:** native continuous page scroll with sticky scenes and
  scroll-progress-driven animation. There is no scroll snap and no Lenis-style
  replacement of wheel distance.

## Scroll Progress Model

- Match Webflow `SCROLLING_IN_VIEW`: progress is `0` when the element's top
  reaches the viewport bottom and `1` when its bottom reaches the viewport top.
- Formula:
  `clamp((viewportHeight - elementRect.top) / (viewportHeight + elementHeight), 0, 1)`.
- A 100vh opening therefore begins at `0.5` at page load and reaches `1` when it
  leaves the viewport.
- Smooth visual progress with a damped requestAnimationFrame interpolation that
  matches the action's Webflow smoothing value. Most scenes use `70`; cloud
  transitions use `50`, while the map, homecoming walk, and final chapter use
  `75`. Actual document scroll remains native.
- Interpolate each action item with Webflow's default CSS `ease` curve,
  `cubic-bezier(0.25, 0.1, 0.25, 1)`, after mapping it into its keyframe range.
- Progress must decrease when the user scrolls upward.

## Hero Timeline

- `.hero__opening` is normal flow, not sticky.
- Opening progress `0.50 → 1.00`:
  - Logo translateY `0px → -50px`.
  - Logo opacity stays `1` through `0.63`, then reaches `0.2` at `0.80`.
  - Scroll cue stays `1` through `0.85`, then reaches `0.2` at `0.95`.
- Quote section is 150vh with artwork and text centered in the full section,
  not pinned to a 100vh sticky viewport.
- At 1280×624, the quote figure is a content-height `700px × 96px` flex column
  centered in the section. It has `5vw` horizontal padding and no vertical
  padding.
- The quote is `Inter 600 14px/30px`, centered inside the resulting 572px text
  width. The author follows with no gap and uses `Inter 300 italic 15px/36px`;
  the figure's `align-items: flex-end` places that line at the right edge.
- Quote text opacity: `0` at `0`, `1` at `0.36–0.58`, `0` at `1`.
- Triangle artwork rotates `0deg → 132deg`, scales `1.5 → 1`, and fades
  `0 → 1` over quote progress.

## Lake Timeline

- Parent height: `600vh`.
- Sticky viewport: `100vh`; landscape width equals the padded scene width
  (original measured 1827px at a 1920px viewport). At a 1920×930 viewport its
  exact desktop box is `left: 46.5px`, `top: 97.59px`, `width: 1827px`,
  `height: 781.8px`.
- Static landscape uses `paysage-sans-soleil.svg`; overlay
  `paysage-fixe-soleil-rotation-2fps.json` is scrubbed from `0` at progress
  `0.18` to `1` at progress `1`.
- Fishing inset uses `zoom-peche-5fps.json`, `30%` of the padded sticky width,
  clipped inside a 1px white frame with the animation's `1080 / 1087` aspect
  ratio.
- Inset Y position: `100vh` at progress `0.25` to `15vh` at `0.60`.
- “When suddenly…”:
  - on desktop it sits in a normal-flow 47px header immediately above the lake
    artwork, with `10px 0` padding; the sticky viewport centers the combined
    header-and-art group
  - at 1280×624 the header is `x: 31.1875px`, `y: 27.984px`,
    `width: 1217.625px`; the text starts at `y: 37.984px` and the lake artwork
    starts at `y: 74.984px`
  - text uses `Inter 600 18px/27px`; “suddenly” is pink and italic
  - opacity `0 → 1` over `0.38 → 0.45`
  - translateY `-75px → 0`
  - scale `1.1 → 1`
- Fishing inset opacity: `0 → 1` over `0.38 → 0.60`.
- Lake-to-message gradient starts with `margin-top: -140vh`.
- The message gate is the natural document end until its interaction completes.

## Full-page Geometry

- Chapter: desktop `200vh`, mobile `100vh`. On desktop, the chapter section
  has `5vw` padding; the sticky frame therefore measures `90vw`, and the
  scrubbed chapter Lottie is `90%` of that sticky frame (`81vw`, with no
  arbitrary max-width cap).
- Inventory: `300vh`.
- Go: `200vh`.
- Cloud: `200vh`.
- Map journey: `2000vh`, `margin-top: -200vh`.
- Map-to-chapter gradient: `margin-top: -150vh`.
- Forest: `350vh`.
- Homecoming: desktop `1000vh`, `margin-top: -200vh`; mobile `500vh`.

## Other Scrubbed Lottie Timelines

- Chapter desktop/tablet timeline (`>= 480px`, Webflow action list
  `Chapitre Paysage`):
  - Lottie progress `0 → .98` over section progress `.20 → .75`
  - frame scale `1.4 → .9` over `.20 → .65`
  - title opacity `0 → 1` over `.33 → .53`
  - number opacity and translateY `-50px → 0` over `.35 → .55`
- Chapter phone timeline (`< 480px`, Webflow action list
  `Chapitre Portrait`):
  - Lottie progress `0 → .98` and frame scale `1.5 → .9` over `.20 → .53`
  - title opacity `0 → 1` over `.31 → .40`
  - number opacity and translateY `-50px → 0` over `.31 → .50`
  - the chapter retains its `5vw` section padding; the Lottie is a static,
    `90%`-wide flex item at `.15` opacity, and the sticky column remains
    vertically centered
  - the 30px chapter circle keeps its base 30px bottom margin and adds a 30px
    top margin
- Chapter 1's correction is a separate scroll action, not a static
  strikethrough. “of hunger” starts at progress `.40` with opacity `0` and
  `translateY(38px)`, then reaches its final position and opacity `1` at `.55`.
  It uses `Merriweather`, italic, `600`, `30px/30px`; it has no top gap and its
  right edge aligns with the complete first line. The pink line is opacity `0`
  and width `0` at `.47`, becomes fully opaque at `.55`, and grows to its final
  `140px` width at `.67`. Its right edge stays fixed to the right edge of
  “of destiny”, so the visible stroke grows from right to left.
- Travel-prep is a two-layer composition, not one static animation:
  - `personnage-sac-30fps.json` loops only while the section is in view.
  - `vent-30fps.json` is an absolutely positioned overlay and loops at `2×`
    playback speed only while the section is in view.
  - The group is `80%` of the section content width; the character is `45%`
    of that group and the centered wind overlay is `60vw`.
  - The whole character group fades `.2 → 1` over `0.15 → 0.25`, stays fully
    visible through `0.76`, then fades `1 → .2` through `0.90`.
  - Its caption enters over `0.20 → 0.34`, moving `30px → 0`, scaling
    `1.1 → 1`, and fading `0 → 1`.
- Backpack Lottie remains at frame `0` until an enabled Take button is clicked.
  Every Take click restarts the animation and plays it once over `4s`.
- Day and night cloud images move vertically from `50vh → 0` over their full
  section progress with smoothing `50`; this is scroll-driven, not time-driven.
- Map path: progress `0 → 0.99` over `0.06 → 0.92`; do not loop.
- Map captions:
  - item 1 visible `0.175 → 0.24`
  - item 2 visible `0.32 → 0.39`
  - item 3 visible `0.49 → 0.56`
  - item 4 visible `0.67 → 0.74`
  - item 5 visible `0.85 → 0.92`
- Homecoming walk: linear progress `0 → 1` over `0.15 → 0.75`; do not loop.
- “The End”: opacity/scale animate over `0.77 → 0.90`; its Lottie progress
  runs `0 → 0.99` over `0.81 → 0.90`.
- Forest is a layered composition:
  - `feuilles-30fps.json` is the full-width scrubbed leaf reveal. It starts at
    opacity `0`, scale `1.2`, and frame `0` at `0.20`; reaches full opacity at
    `0.60`; and reaches scale `1` / frame `99%` at `1.00`.
  - `silhouette_buisson_10fps.json` is a narrower bush animation below it and
    loops only while the section is in view.
  - The story text fades and scales from `1.2 → 1` over `0.37 → 0.54`.
  - The forest has no exit-opacity action. Leaves, bush, and story text remain
    at their final visible state through the end of the section.
  - The sticky forest content stays at `z-index: 0`; both bevels remain at
    `z-index: 10`. The bevels physically cover the artwork as they cross it,
    producing the original reveal/occlusion sequence.
  - The leaf layer is `80vw` with a `700px` minimum on ordinary desktop
    widths, and switches to `100%` at the original `1920px` min-width
    breakpoint.
  - Preserve the original Lottie SVG baseline space: both the leaf and bush
    containers are 4px taller than their square/aspect-ratio artwork. This
    keeps the bush/text group centered at the original vertical coordinate.
  - The green “Gus” in the forest sentence inherits the sentence's `600`
    weight and stays upright; it must not use the browser's default
    `strong`/`700` weight.
- The following question section sits at `z-index: 30`, so its solid background
  cleanly covers the outgoing lower bevel once the question section reaches the
  viewport.
- The question mark is scroll-driven, not a perpetual pulse: opacity `0 → 1`
  over `0 → 0.50`, while rotation runs `-360deg → 0deg` and scale
  `1.6 → 1` over the full section progress.

## Satyr Entrance

- The initial satyr gate is exactly `100vh` with horizontal `5vw` padding; it
  must not grow beyond the viewport because of idle dialogue content.
- The jungle/satyr composition is `35vh` high with no desktop minimum-height
  override. At `1280 × 624`, the original artwork measures about
  `184.15 × 218.40px`.
- The dialogue layer is absolutely positioned and therefore contributes no
  height while the gate is idle.
- The narration keeps the base `50px` top margin and is scroll-driven over gate
  progress `.35 → .65`: opacity `0 → 1`, translateY `30px → 0`, and scale
  `1.1 → 1`. Its orange “a satyr” emphasis stays upright at weight `600`;
  the final green “Gus.” uses weight `700` rather than the browser's heavier
  nested-strong default.
- The idle action remains absolutely positioned `10vh` from the viewport
  bottom; at `1280 × 624`, its `240 × 40px` button starts at `y = 521.6px`.

## Viewport-triggered Lottie Playback

- Webflow's `pluginLottieLoop` starts a loop when the target enters the
  viewport and resets it when the target leaves. The React player must expose
  controlled `playing` and `playbackRate` props so off-screen animations do not
  finish before the user reaches them.
- Apply that behavior to the hero cue, lake fish/waves/zoom, travel character
  and wind, forest bush, satyr idle animation, return walk, and homecoming fire.
- Satyr attack timing:
  - punch plays once over `2s`;
  - tears play once over `1.5s`;
  - neither animation loops.

## Contact Finale

- Contact section height is `200vh`.
- It contains the original 100vh “Designed by” card before the form.
- During the form scene's scroll progress, the patterned background fades
  `.2 → 1` over `0.10 → 0.31`.
- The contact card moves from `translateY(30vh)` to `0` over `0.10 → 0.50`.
- The footer stays attached below the card and does not repeat the designer
  logo; the logo belongs in the preceding “Designed by” card.

## Gate Timing

- Reply must not unlock Chapter 1 immediately.
- Clicking Reply shows the typing state first.
- After 1200ms, show Gus's reply and only then set the parent state to
  `replied`, allowing the next document block to mount.

## Accessibility and Reduced Motion

- Do not intercept wheel/touch events.
- Preserve native keyboard and anchor scrolling.
- In reduced-motion mode, use stable meaningful frames instead of leaving
  scrubbed Lottie scenes blank.
