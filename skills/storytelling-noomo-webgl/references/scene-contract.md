# Scene Contract

- One fixed full-viewport canvas.
- Three.js r179 and WebGLRenderer.
- Phoenix: `models/v20.glb`.
- Camera timelines: `timelines/cam.glb`, `timelines/cam-mob.glb`.
- Draco decoder: `libs/draco/`.
- HDR: `textures/wooden_studio_19_1k.hdr`.
- Clip names: `Float_WingPulse`, `Idle_MainPose_flying`,
  `Idle_MainPose_gliding`, `Wing_CloseUp`.
- Progress is supplied by the scroll controller; the engine must not own page
  scrolling.
- `v20.glb` contains a `trail` object. Preserve and color it with the Phoenix
  palette instead of treating it as unrelated decoration.
- Pointer movement updates a smoothed NDC target and a fading sprite ribbon in
  camera space.
- Every increment of the palette command version must generate a visibly new
  multi-hue Phoenix glass target without navigation.
- Keep a static lavender/ember gradient fallback when assets or WebGL fail.
