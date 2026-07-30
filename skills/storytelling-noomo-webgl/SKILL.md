---
name: storytelling-noomo-webgl
description: Build and tune the imperative Three.js scene for the Noomo storytelling clone. Use when changing the Phoenix GLB, camera timelines, crystals, shaders, HDR lighting, particles, Draco loading, render loop, WebGL fallback, responsive camera behavior, or GPU performance.
---

# Noomo WebGL Experience

1. Read `docs/research/SOURCE_ANALYSIS.md`,
   `docs/research/components/experience-canvas.spec.md`, and
   `references/scene-contract.md`.
2. Keep Three.js outside React render state. Mount one scene engine from one
   client component and dispose it on unmount.
3. Load assets from `public/assets/noomo/`; set the Draco decoder path before
   loading compressed GLBs.
4. Use `cam.glb` above 767px and `cam-mob.glb` below it.
5. Drive camera, Phoenix, animation mixer, materials, crystals, and particles
   from one smoothed `0..1` progress value. Keep pointer smoothing and the
   palette-command version as separate engine inputs.
6. Treat “Reimagine Phoenix” as a repeatable material randomization command,
   never a link or a binary theme toggle. Smooth each new hue target and apply
   it to the Phoenix and its trail only.
7. Preserve both pointer layers: a DOM liquid lens and a camera-relative WebGL
   spirit ribbon. Disable autonomous pointer effects for coarse pointers and
   reduced motion.
8. Prefer physical materials or focused shader materials. Do not stack
   post-processing without source evidence.
9. Cap DPR, pause while hidden, handle resize/context loss, and retain a CSS
   fallback.
10. Verify typecheck, ESLint, build, desktop/mobile scroll, consecutive palette
    commands, three-point pointer movement, and reduced motion.
