# Cloud Transition Specification

## Overview

- **Target file:** `src/features/home/components/CloudScene.tsx`
- **Source:** saved original DOM/CSS and Webflow action list `a-14`
  (“Nuages”).
- **Interaction model:** scroll-driven (`SCROLLING_IN_VIEW`, smoothing `50`).

## DOM Structure

The 200vh scene contains three independent layers:

1. `nuage-unique.svg`, the moving foreground cloud.
2. A 100vh `#12141d` curtain aligned to the top of the scene.
3. The full-width day or night cloud illustration.

## Computed Styles

- Scene: `display:flex`, `align-items:center`, `width:100vw`, `height:200vh`.
- Moving cloud: `position:absolute`, `z-index:20`, `width:30%`.
- Curtain: `position:relative`, `z-index:1`, `width:100%`, `height:100vh`,
  `align-self:flex-start`, background `#12141d`.
- Sky layer: `position:absolute`, `z-index:10`, `width:100vw`.

## States & Behaviors

- At progress `0`: moving cloud `translateY(50vh)`.
- At progress `1`: moving cloud `translateY(0vh)`.
- The two Webflow keyframes have no easing; interpolation is linear.
- Day and night use identical geometry and behavior.

## Assets

- `5eb569b80956a118a87eda16_nuage-unique.svg`
- `5eb5688f5c02e669d2e64797_nuage-soleil.svg`
- `5eb56a6c5c02e6488fe65793_nuage-lune.svg`

## Responsive Behavior

The original keeps the same layered construction and percentage widths at
desktop, tablet, and mobile breakpoints.
