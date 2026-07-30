# ExperienceCanvas Specification

## Overview

- Target: `src/features/storytelling/components/ExperienceCanvas.tsx`
- Evidence: `docs/design-references/source-desktop-started.png`
- Interaction model: scroll-driven, time-driven idle animation

## DOM

Fixed full-viewport canvas with a CSS gradient fallback. The DOM layer remains
non-interactive while pointer coordinates drive Phoenix parallax and a
camera-relative spirit ribbon inside WebGL.

## Styles

- position: fixed
- inset: 0
- width/height: 100vw / 100dvh
- z-index: 0
- background: lavender-to-ice radial gradient

## Behavior

- Load Phoenix, camera timeline, crystals, textures, HDR, and Draco decoder.
- Use one RAF loop and one normalized smoothed progress value.
- Generate a new multi-hue Phoenix material target whenever the Reimagine
  Phoenix command version changes.
- Smooth pointer coordinates and render a fading sprite ribbon in the same
  WebGL scene.
- Cap DPR and dispose all resources.
- Preserve a visible fallback when WebGL is unavailable.

## Responsive

- Desktop uses `cam.glb`.
- Mobile uses `cam-mob.glb`.
- Recalculate aspect and renderer size on resize.
