# StoryOverlay Specification

## Overview

- Target: `src/features/storytelling/components/StoryOverlay.tsx`
- Evidence: `docs/design-references/source-desktop-fine-01.png` through
  `source-desktop-fine-21.png`
- Interaction model: scroll-driven

## DOM

Fixed semantic sections. Only the active or transitioning copy is exposed visually.
Repeated letter-level spans are decorative; screen readers receive intact text.

## Styles

- Sans copy: TT Neoris
- Editorial words: The Seasons italic
- Dark copy on lavender/white scenes
- White copy on ember/dark scenes
- Entry/exit uses opacity, translateY, blur, and scale

## Behavior

Map copy windows exactly from `PAGE_TOPOLOGY.md`. Clamp each local section progress
and use fade-in/hold/fade-out curves.

## Responsive

- Desktop max widths: 320–940px depending on scene.
- Mobile uses 20px gutters and 46–72px editorial words.
