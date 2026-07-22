# ShowreelScrollAnimation Specification

## Overview
- **Target files:** `src/components/cocota/ShowreelSection.tsx`, `src/app/globals.css`
- **Reference screenshot:** `docs/design-references/cocotastudio.com/original-reel-transition.jpg`
- **User recording:** `Screen Recording 2026-07-21 at 14.15.46.mov`
- **Interaction model:** scroll-driven sticky media; no click or hover trigger

## DOM Structure
- A `section.showreel` owns the scroll timeline and occupies `150vh` on desktop.
- A `div.showreel-sticky` remains sticky at `top: 0` and fills the viewport (`100vh`).
- The video fills the sticky viewport and uses `object-fit: cover`.

## Exact Original-Site Geometry

### Section
- position: `relative`
- height: `150vh`
- desktop scroll travel while observed by the animation: section entering at the bottom of the viewport through section leaving at the top

### Sticky viewport
- position: `sticky`
- top: `0`
- width: `100%`
- height/min-height: `100vh`
- overflow: `hidden`
- transform origin: center
- will-change: `transform`

### Video
- position/fill behavior: fills the sticky viewport
- width: `100%`
- height: `100%`
- object-fit: `cover`

## States & Behaviors

### Desktop scroll timeline
- **Trigger start:** the showreel section's leading edge reaches the bottom of the viewport (`entry 0%`).
- **Trigger end:** the showreel section's trailing edge leaves the top of the viewport (`exit 100%`).
- Original implementation uses a normalized GSAP timeline with total duration `1.1` over the complete entry-to-exit scroll range.

#### State A — entering (timeline 0% to 40.909%)
- Scale: `.95` to `1`.
- Border radius: `3.2rem` to `0`.
- Easing: GSAP default `power1.out` per segment (quadratic ease-out; use a close CSS cubic-bezier equivalent).
- The section itself enters through normal document scrolling while the media grows, producing the recorded reveal from below the hero.

#### State B — full-screen hold (timeline 40.909% to 72.727%)
- Scale: `1`.
- Border radius: `0`.
- Sticky viewport remains pinned while the video continues playing.

#### State C — leaving (timeline 72.727% to 100%)
- Scale: `1` to `.95`.
- Border radius: `0` to `3.2rem`.
- Easing: GSAP default `power1.out` per segment.
- The parent section clips/ends the sticky phase as the media leaves the viewport.

### Mobile
- Preserve the clone's established mobile behavior: standard document flow, `aspect-ratio: 248 / 176`, `8px` radius, no sticky scroll animation.

### Reduced motion
- Disable the scroll interpolation and render a stable full-size viewport state without animated scaling.

## Implementation Guidance
- Prefer a named `view-timeline` on `.showreel` and bind the sticky child's animation to the parent timeline. Do not use the sticky child's own anonymous `view()` timeline because its pinned geometry makes progress unreliable.
- Map the original `0/.45/.8/1.1` timing to keyframe offsets `0%`, `40.909%`, `72.727%`, and `100%`.
- Keep a safe non-scroll-timeline fallback with the existing contained/rounded visual.
- Do not add GSAP or another dependency for this isolated interaction.

## Assets
- Video: `public/assets/cocota/showreel.mp4`
- No new assets required.

## Text Content
- No visible text.
- Retain `aria-label="Cocota showreel"`.

## Responsive Behavior
- **Desktop (1440px):** 150vh parent, 100vh sticky media, `.95 → 1 → .95` scale choreography.
- **Tablet landscape:** same sticky choreography.
- **Mobile/portrait:** existing in-flow 248:176 media with 8px radius and no scroll animation.
