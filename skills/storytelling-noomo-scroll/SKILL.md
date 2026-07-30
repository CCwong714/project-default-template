---
name: storytelling-noomo-scroll
description: Implement and tune scroll-linked storytelling for the Noomo clone. Use when changing normalized scroll progress, damping, copy windows, scene transitions, start/audio gating, header visibility, project hotspot behavior, footer reveal, or desktop/mobile scroll choreography.
---

# Noomo Scroll Storytelling

1. Read `docs/research/PAGE_TOPOLOGY.md`, `BEHAVIORS.md`, and
   `references/progress-map.md`.
2. Keep one source of truth: normalized physical document scroll.
3. Damp progress in RAF; never run a React state update on every raw scroll
   event.
4. Derive each copy or scene window with explicit `start`, `peak`, and `end`
   values.
5. Keep the interaction model scroll-driven. Clicks only start audio, open the
   menu, follow links, or toggle sound.
6. Use 43,300px desktop and 36,545px mobile spacer heights unless new source
   evidence changes them.
7. Preserve keyboard navigation, reduced motion, native touch scrolling, and
   browser back/forward behavior.
