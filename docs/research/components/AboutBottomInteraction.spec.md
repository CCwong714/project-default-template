# AboutBottomInteraction Specification

## Overview
- **Target files:** `src/components/cocota/AboutSection.tsx`, `src/components/cocota/useCocotaMotion.ts`, `src/app/globals.css`
- **User reference:** `Screen Recording 2026-07-21 at 15.00.09.mov`
- **Original section:** `https://cocotastudio.com/` `.home_about .cnt_bottom`
- **Interaction model:** viewport-driven sprite playback plus pointer/focus-driven link label swap

## DOM Structure
- The left column contains one animated sprite and the existing green dot/tooltip.
- The right column contains a static paragraph followed by a two-line, overflow-clipped link label.
- The second link label is decorative and hidden from assistive technology.

## Computed Styles From Original

### Layout at the inspected 1389 × 929 viewport
- container: two equal grid columns, `19.2917px` gap, aligned to the bottom
- top margin: `136.649px` at this viewport (project equivalent: `17rem`)
- left column: `justify-content: flex-end`, `padding-right: 90.0278px` (project equivalent: `11.2rem`)
- right text: `321.523px` wide (project equivalent: `40rem`)
- paragraph/link font size: `19.2917px`; line height: `25.0792px` (`1.3em`)
- link top margin: `25.7222px` (project equivalent: `3.2rem`)

### Person sprite
- source: `/assets/cocota/sprite-presenting.webp`
- content: yellow presenting outfit with handheld microphone
- frames: `7`
- desktop sprite width: `15.2rem`; mobile width: `8.8rem`
- frame duration: `200ms`; full loop: `1.4s`
- timing: `steps(7)`
- initial playback state: paused

### Work link
- outer link height: `1.3em`
- overflow: hidden
- label track: vertical flex column, aligned left
- both labels: single line and underlined
- initial transform: `translateY(0)`
- hover/focus transform: `translateY(-1.3em)`
- transition: `transform 450ms cubic-bezier(.55, 0, .1, 1)`

## States & Behaviors

### Sprite playback
- **Trigger:** sprite intersects the viewport.
- **Before:** animation is paused on its first frame.
- **Visible:** run the seven-frame loop continuously.
- **After leaving:** pause playback, matching the original observer-controlled `.act` state.

### Link label swap
- **Default label:** `DISCOVER OUR WORK`
- **Hover/focus label:** `IT'S A KIND OF MAGIC!`
- The whole label track moves vertically; this is not an underline-growth animation.
- The original has no arrow icon in this link.

### Paragraph
- The adjacent paragraph has no separate entrance transform or opacity animation in the original.

### Reduced motion
- Keep the presenting sprite on its first frame.
- Link content remains usable; the existing global reduced-motion rule reduces its transition duration.

## Assets
- Reuse existing `public/assets/cocota/sprite-presenting.webp`.
- No new asset download is required.

## Responsive Behavior
- **Desktop:** two-column grid; sprite is right-aligned in the left column.
- **Mobile/tablet:** stack to one column with a `4rem` gap and `6.4rem` horizontal margins; sprite is left-aligned and uses `8.8rem` width.
