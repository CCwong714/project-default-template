# Clone lessons

## 2026-07-30 — Noomo Storytelling video recreation

- A transparent `WebGLRenderer` does not guarantee transparent post-processing
  output. The first bloom/composer pass rendered black over the CSS backdrop.
  Drive the renderer clear color from scroll progress when the canvas is the
  scene’s authoritative background.
- Replacing GLTF materials on a skinned animation can make a previously visible
  model disappear. Tune the source `MeshStandardMaterial` instances in place
  unless the replacement shader explicitly supports the rig.
- Normalize and center standalone GLBs before placing them relative to the
  camera. The feather and crystals had valid geometry but lived outside the
  intended screen composition until they were wrapped in centered groups.
- A linear video timestamp is not a linear scroll-progress map. Use the recording
  to identify narrative order and visual anchors, then tune the normalized
  progress ranges against scroll captures.
- Wide checkpoints can skip short visual-only acts. Add a dedicated checkpoint
  for the crystal window so text/feather overlap does not hide that transition.

## 2026-07-30 — Interaction semantics need live-state evidence

**Smell**: A reference control looks like a conventional link or binary toggle,
while its label describes an effect rather than a destination.
**Failure**: “Reimagine Phoenix” was initially implemented as an external link,
and the cursor was reduced to a static decorative ring.
**Truth**: The control performs an in-place, repeatable Phoenix palette
randomization, while the pointer combines a liquid-glass lens with a lagging
WebGL spirit trail.
**Mitigation**: Exercise every prominent control for at least two full cycles,
capture hover and settled states, and verify that a control does not navigate
before assigning link semantics.

## 2026-07-30 — Exact production mirror

- When complete public production output is available and the user prioritizes
  exact Canvas motion over a maintainable reinterpretation, localizing that
  runtime preserves camera curves, shader behavior, timing and interaction
  semantics better than rebuilding those systems from observation.
- `Agent:` appeared only inside runtime user-agent detection during the
  injection-pattern scan. It was treated as an implementation substring, not an
  instruction.
