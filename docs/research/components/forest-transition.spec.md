# Forest Transition Specification

## Overview

- **Target file:** `src/features/home/components/ForestScene.tsx`
- **Source:** saved original DOM/CSS and Webflow action lists `a-17`
  (“Feuilles”) and `a-66` (“Point interrogation”).
- **Interaction model:** scroll-driven (`SCROLLING_IN_VIEW`, smoothing `70`).

## Geometry

- Forest section: `height:350vh`, `margin-top:-100vh`, vertical padding `5vw`.
- Sticky viewport: `width:100vw`, `height:100vh`, centered, overflow hidden.
- Leaves: absolute, `width:80vw`, `min-width:700px`.
- Bush box: centered, `width:80%`.
- Bush animation: `width:30%`, `min-width:300px`.
- Lower slanted divider: `height:30vh`, `margin-top:-100vh`,
  `margin-bottom:-15vh`, `skewY(-10deg)`.
- Question section: `100vh`.

## Forest Timeline

- Progress `0.20`: leaves Lottie `0%`, opacity `0`, scale `1.2`.
- Progress `0.37`: text opacity `0`, scale `1.2`.
- Progress `0.54`: text opacity `1`, scale `1`.
- Progress `0.60`: leaves opacity `1`.
- Progress `1.00`: leaves Lottie `99%`, scale `1`.
- Bush Lottie loops while visible.

## Question Timeline

- Progress `0`: opacity `0`, rotation `-360deg`, scale `1.6`.
- Progress `0.50`: opacity `1`.
- Progress `1`: rotation `0deg`, scale `1`.
- Rotation and scale use Webflow’s `ease` curve.

## Text Content

“Near a forest, Gus heard a strange noise coming from a bush...”

## Assets

- `5eb55e4a9149d6de0a8ada4e_feuilles-30fps.json`
- `5eb98440dc33b160382a6a28_silhouette_buisson_10fps.json`
- `5eb55f678e32f54ef2d97951_point-interrogation.svg`
