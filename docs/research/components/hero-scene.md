# HeroScene 组件规格

## Overview

- **Target file:** `src/features/home/components/HeroScene.tsx`
- **Reference:** user screenshot `Screenshot 2026-07-23 at 14.46.06.png`
- **Comparison viewport:** 1920 × 930
- **Interaction model:** sticky opening screen with hover-only language motion

## Exact desktop geometry

| Element              | Original computed rectangle         |
| -------------------- | ----------------------------------- |
| Opening viewport     | x 0, y 0, 1920 × 930                |
| English flag control | x 900, y 50, 50 × 40                |
| English flag image   | x 910, y 58.86, 30 × 22.30          |
| French flag control  | x 970, y 50, 50 × 40                |
| French flag image    | x 980, y 60, 30 × 22.30             |
| Logo                 | x 787.20, y 336.19, 345.59 × 257.63 |
| CSSDA award          | x 1726.41, y 40, 153.59 × 153.59    |
| Scroll label         | x 908.42, y 764, 103.14 × 30        |
| Mouse Lottie         | x 945, y 809, 30 × 30               |

## Computed styles

### Wallpaper

- Background image: original desktop wallpaper asset.
- `background-position: 50% 0`
- `background-size: cover`
- `opacity: 0.3`
- Full viewport dimensions.

### Language controls

- Wrapper: full viewport width, absolute top, `padding: 50px 0`.
- Control: `width: 50px`, `height: 40px`, `margin: 0 10px`,
  `padding: 10px`, `opacity: 0.76`.
- Flag image: `width: 30px`, natural rendered height `22.2969px`.
- Active language is not transformed.
- Desktop hover at 1280px and wider:
  `transform: scale(1.2) rotate(25deg)`.

### Logo

- SVG natural ratio: 201 × 150.
- Width equals 20% of the original 1728px padded content area:
  `345.59375px`, equivalent to `18vw`.
- Minimum width: `200px`.
- Centered at the exact viewport center.

### CSSDA award

- `width: 8vw`
- `min-width: 60px`
- `top: 40px`
- `right: 40px`
- `opacity: 1`

### Scroll cue

- Wrapper: absolute bottom, `height: 20vh`.
- Label: Inter, `16px`, `font-weight: 600`, `line-height: 30px`,
  `margin-top: 20px`.
- Lottie: `30px × 30px`, `margin-top: 15px`.

### Quote artwork

- The hatched blue circle uses the original `.image-19` sizing:
  `width: 25vw`, `min-width: 150px`, `max-width: 600px`.
- The three-circle SVG uses the original `.image-20` sizing:
  `width: 40vw`, `min-width: 240px`, `max-width: 1000px`.
- The circle artwork intentionally scales from `1.5 → 1` while rotating
  `0deg → 132deg`; the base width must remain the original 40vw geometry.

## Responsive behavior

- **Tablet:** retain 50 × 40 flag controls and 30px flag art; logo remains
  `18vw` until the 200px minimum is reached.
- **Mobile ≤479px:** mobile wallpaper, hidden Scroll label, 57vw Logo, 40px
  CSSDA award with a 30px right margin.
