# Cocota visual and hover correction audit — 2026-07-20

Source of truth: `https://cocotastudio.com/`, inspected at 1440 × 900 and 390 × 844.

## Typography

- The downloaded `NHaasGroteskDSPro-55Rg.woff2` matches the local font byte-for-byte.
- Desktop root scale is 8.33333 px at 1440 px. Body/UI copy is 20 px / 26 px.
- Mobile root scale is 10.08 px at 390 px. Small UI copy is 17.136 px / 22.2768 px.
- Display type uses normal tracking, not negative letter-spacing.
- Hero/display: 140 px / 126 px desktop; 40.32 px / 36.288 px mobile.
- Large supporting copy and card titles: 53.3333 px desktop; 32.256 px mobile.

## Hero character placement

- Desktop primary sprite sits after `THOUGHTFUL` on line 1.
- Desktop secondary sprite sits before `SOULFUL` on line 3.
- Mobile primary sprite is positioned above the right side of line 1.
- Mobile secondary sprite shares the final `BRANDS` row; the row is as tall as the sprite and the word aligns to its bottom edge.
- Desktop sprite frame is 126.664 × 128.328 px at 1440 px. Mobile frame is 88.703 × 89.867 px at 390 px.
- The live site randomizes character sheets between page loads. The clone uses one verified desktop/mobile set while preserving the live placement, frame counts, 0.2 s-per-frame timing, dots, and tooltips.

## Hover states

### Navigation

- Desktop link labels vertically swap to a duplicate label over 450 ms using `cubic-bezier(.55, 0, .1, 1)`.
- The `COCOTA® / Brand & Design Studio` pair is duplicated as one row and translates upward by exactly one 26 px line on hover.
- Language links use a 2 px underline at `bottom: 0`. The selected language keeps the underline visible; an unselected language expands it from right to left over 450 ms.
- `Let's talk!` keeps its outlined pill at rest. A black pseudo-element, inset by `-.4rem`, scales upward from the bottom while the label transitions to `#fafafa` over 450 ms.

### Character sprites

- Sprite animation runs continuously while active.
- Hover shrinks the lime dot and scales the lime tooltip from the dot's side.

### Service cards

- Rest: two 50% cards; description opacity 0.
- Hovering the group neutralizes both cards to `#eee`, black text, and hidden arrows.
- Hovered card expands to 60%, restores its red/blue background and white text, reveals description and underline, and rotates the arrow 45 degrees.
- Mobile keeps cards at 100%, with their descriptions visible and without width redistribution.

### Work cards

- Media radius transitions from 26.667 px to 8 px.
- The white case-study button expands from 37.5 px, fades in its text, and rotates the arrow from -45 degrees to 0.
- The project emoji appears and follows the pointer on desktop.

### Client cards

- Hover fades text to 0 and reveals the client's full-bleed image.
- A translucent client logo follows the pointer over the card.

### Footer cards

- Rest: two white 50% cards; descriptions hidden.
- Hovering the group neutralizes both to `#eee`; the hovered card expands to 60%, turns `#003223`, reveals its text/underline, and restores a rotated arrow.
- Only the `Let's talk` card contains the waving character.
