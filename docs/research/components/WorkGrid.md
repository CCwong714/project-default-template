# WorkGrid Specification

## Overview
- **Target files:** `src/components/cocota/WorkSection.tsx`, `src/app/globals.css`
- **Original section:** `https://cocotastudio.com/` `.home_works`
- **User reference:** `Screen Recording 2026-07-21 at 16.05.56.mov`
- **Interaction model:** page-scroll-driven image/video parallax plus pointer hover interactions

## DOM Structure
- The section contains the `STRATEGIC CREATIVITY SINCE 2017` heading and a six-column work grid.
- Every work card contains one clipped `.work-media` viewport.
- The image or video is absolutely positioned inside that viewport with 20% vertical overscan.
- Havaianas, Wild, and Faster Displays use images; Musotoku uses a looping muted video. All four visuals use the same parallax calculation.

## Original Computed Styles at 1920 × 929

### Grid
- width: `1872px`
- columns: `repeat(6, 292px)`
- column gap: `24px`
- row gap: `104px`
- top margin: `178px`
- small card width: `608px`
- large card width: `1240px`

### Media viewport
- aspect ratio: `1112 / 719`
- overflow: `clip`
- border radius: `32px`
- small media: `608px × 393.117px`
- large media: `1240px × 801.758px`

### Parallax visual
- position: `absolute`
- top: `-10%` of the media height
- width: `100%`
- height: `120%` of the media height
- object fit: `cover`
- small visual height: `471.734px`
- large visual height: `962.109px`

## Scroll Behavior

### Trigger and progress
- Each media viewport owns its own independent scroll progress.
- Start: media top reaches the bottom edge of the viewport.
- End: media bottom leaves the top edge of the viewport.
- Raw progress:
  `clamp((viewportHeight - mediaRect.top) / (viewportHeight + mediaRect.height), 0, 1)`
- The original GSAP timeline uses its default `power1.out` ease:
  `easedProgress = 1 - (1 - rawProgress)²`

### Visual transform
- Start transform: `translateY(-10%)`
- End transform: `translateY(10%)`
- Current transform:
  `-10 + (20 × easedProgress)` percent of the visual's own `120%` height.
- Apply the result every animation frame while scrolling. There is no CSS transition lag on the transform.
- Recalculate on resize and once immediately after mount.

### Measured original states
- Small card, media top `820.3px`: visual transform `-32.318px` (`-6.85%`).
- Small card, media top `370.3px`: visual transform `15.708px` (`3.33%`).
- Small card fully above viewport: visual transform clamps at `47.173px` (`10%`).
- Large card, media top `820.3px`: visual transform `-72.837px` (`-7.57%`).
- Large card, media top `370.3px`: visual transform `7.914px` (`0.82%`).
- Large card fully above viewport: visual transform clamps at `96.211px` (`10%`).

## Implementation Requirement
- Do not depend on CSS `animation-timeline: view()` because browser support is inconsistent and caused the cloned site to remain static.
- Use one passive window scroll listener, schedule work with `requestAnimationFrame`, and update only CSS custom properties on the four visual elements.
- Cancel a queued animation frame and remove listeners when the component unmounts.

## Assets
- `/assets/cocota/work-havaianas.webp`
- `/assets/cocota/work-wild.webp`
- `/assets/cocota/work-faster.webp`
- `/assets/cocota/work-musotoku.mp4`

## Responsive Behavior
- Desktop keeps the alternating `2/4` then `4/2` grid spans.
- Mobile becomes one column and keeps the same per-card scroll progress formula.
- The visual remains `120%` tall at all breakpoints, so the full `-10%` to `10%` motion never exposes an empty edge.
