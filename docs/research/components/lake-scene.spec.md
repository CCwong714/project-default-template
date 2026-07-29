# LakeScene Specification

## Overview

- **Target file:** `src/features/home/components/LakeScene.tsx`
- **Reference:** `output/playwright/original-lake-1920x930.png`
- **Interaction model:** native scrolling with a 600vh sticky scene, scrubbed
  landscape animation, and viewport-triggered looping Lotties.

## Desktop Geometry (1920 × 930)

- Lake container: `height: 600vh`, `margin-top: -120vh`, `padding: 5vh`.
- Sticky viewport: `1920 × 930`, with a padded art width of `1827px`.
- Landscape rectangle: `x 47–1872`, `y 98–877`.
- “When suddenly…” is horizontally centered; its visible glyph bounds begin
  around `x 883`, `y 66`.
- Fishing inset border: `x 686–1233`, top at `y 376` in the reference state.
- The fishing inset is 30% of the padded stage width and retains the original
  near-square Lottie ratio.

## Lake Intro

- The fish Lottie loops only while the intro is in view and uses the Webflow
  four-second override (`9s / 4s = 2.25×` playback speed).
- The fish animation keeps its native `250 × 150` Lottie canvas. It is a
  normal-flow flex child above the wave-and-copy group, centered by the intro
  section; it is not a full-width absolute background layer.
- The fish container has no authored opacity reduction in the original.
- Three wave Lotties are present: one above the copy and two in the lower row.
- Each wave is `20vw`, clamped to `100–300px`, using the native `250 × 60`
  ratio. On desktop the waves have no vertical margin. The original `40px`
  top/bottom margin is applied only at `≤767px`.
- The two-wave row is content-sized from its two children (`40vw`, clamped to
  `200–600px`) and keeps `justify-content: space-between`.
- Looping Lotties reset to frame zero when they leave the viewport.
- The inner wave-and-copy group follows Webflow action list `a-56`:
  - group opacity stays at `0.25` through progress `0.15`, then eases to `1`
    at progress `0.25`;
  - copy starts at opacity `0` and scale `1.1` at progress `0.20`, then eases
    to opacity `1` and scale `1` at progress `0.40`.
- This low-opacity lead-in keeps the wave background visually hidden while the
  “Gus spent a peaceful day by the lake...” copy is entering.
- The intro section retains the original `z-index: 2` opaque stacking layer so
  the negatively overlapping 600vh lake landscape cannot show through before
  the intro has scrolled away.

## Sticky Scene States

- Landscape: `paysage-sans-soleil.svg`.
- Desktop sun overlay: scrubbed from frame progress `0 → 1` over lake progress
  `0.18 → 1`.
- Portrait overlay: uses the same scrubbed progress and does not autoplay.
- Text state:
  - `0.38`: opacity `0`, `translateY(-75px)`, `scale(1.1)`.
  - `0.45`: opacity `1`, `translateY(0)`, `scale(1)`.
- Fishing inset movement:
  - `0.25`: `translateY(100vh)`.
  - `0.60`: `translateY(15vh)`.
- Only the inset animation fades from opacity `0 → 1` over `0.38 → 0.60`;
  the border, background, and 60px background-colored shadow remain opaque.
- The inset Lottie starts looping when the moving inset enters the viewport,
  and resets when the scene leaves.
- The inset is an anchor to `#message`, matching the original interaction.

## Responsive Behavior

- At `≤479px`, the horizontal landscape and desktop sun are hidden.
- The portrait SVG and scrubbed portrait Lottie fill the sticky viewport.
- The fishing inset keeps the original 30% width with a `200px` minimum.
