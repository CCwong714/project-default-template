---
name: storytelling-noomo-visual-qa
description: Visually validate the Noomo storytelling clone against captured source evidence. Use after UI, Three.js, scroll, responsive, audio, or asset changes; when a screenshot mismatch is reported; or before declaring the clone complete.
---

# Noomo Visual QA

1. Read `references/qa-matrix.md` and the relevant component spec.
2. Run the clone with the repository’s Node 24 toolchain.
3. Capture source and clone under the same viewport, start state, progress, and
   reduced-motion setting.
4. Compare in this order: canvas framing, background/color, typography,
   placement/scale, opacity/blur, then timing.
5. Change one measurement family per iteration.
6. Re-run keyboard, touch, menu, sound, WebGL fallback, console, ESLint,
   typecheck, tests, and build verification.
7. Record any remaining source limitation or approximation.
