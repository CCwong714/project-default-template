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

## 2026-08-03 — Pacome Pertant interaction recreation

- A full-screen chrome layer can silently steal wheel and pointer input from a
  WebGL canvas. Keep the shell at `pointer-events: none` and opt individual
  controls back into interaction.
- Validate directional inertia numerically after input has stopped, in both
  directions. Include a mid-coast reversal and rapid alternating impulses so a
  stale target cannot masquerade as correct momentum.
- Mux playback IDs do not guarantee a usable static MP4 rendition. Use the HLS
  manifest through `hls.js`, keep a local poster fallback, and defer streaming
  until the first user gesture.
- Do not infer a page's depth from its first viewport. The raw About route
  revealed a 500vh sticky introduction, project marquee and contact footer that
  were absent from the initial capture.
- Give the WebGL runtime a single scrolling authority. Cancel animation frames
  and pause video textures when the helix is obscured, and ignore asynchronous
  texture callbacks after disposal.

## 2026-08-04 — Loading animation and entry readiness are separate states

- Do not reduce an animated loader to its final logo frame. The Pacôme source
  uses a 67-frame, 25fps Lottie sequence before revealing the descriptive copy.
- Do not equate animation completion with application readiness. The source
  exposes entry controls only when both the loader has completed and the WebGL
  scene is ready; mirroring that gate avoids entering an untextured canvas.
- Match inherited source typography, not only the declared family name. The
  original `-0.04em` root spacing resolves to `-0.72px` on desktop and
  `-0.76px` on mobile, which materially changes pill and footer widths.

## 2026-08-04 — A WebGL carousel can move even when it is “idle”

- Do not model every wheel-driven canvas as a fixed destination that eventually
  settles. Pacôme's helix decays toward a non-zero minimum speed, starts in the
  positive direction and keeps the direction of the latest wheel gesture.
- Recreate motion-dependent shader input as well as object displacement. The
  source passes instantaneous wheel velocity into every project vertex shader,
  producing a horizontal bend that is most visible during strong impulses.
- A reversal test must distinguish braking distance from final direction. Record
  the turning point and a later sample (or instantaneous velocity); comparing
  only the pre-input and post-input positions can falsely report a failure while
  the carousel is already travelling in the requested direction.
- When source recurrence is frame-based, use a fixed-step accumulator to preserve
  its 60fps tuning without making 120Hz displays run faster or 15Hz displays run
  slower.

## 2026-08-04 — Cylinder curvature needs one shared radial coordinate system

- An edge-forward bend such as `1 - cos(x)` can have the right amplitude while
  reading as an inward bowl. For an outward card, leave both edges on the base
  surface and displace the center along local positive Z with `sin(uv.x * PI)`.
- A spiral only reads as wrapping a cylinder when mesh position and Y rotation
  come from the same angle: `x/z = cos/sin(angle) * radius` and
  `rotationY = -angle + PI / 2`. A bounded sine approximation for rotation makes
  side cards look individually twisted instead of tangent to one shared body.
- Double-sided outward surfaces look concave when viewed sharply from their
  reverse side. Match the source's backface treatment (here, a nine-tap blur) so
  rear cards communicate depth without visually inverting the front curvature.

## 2026-08-04 — Logo hover artwork is a separate animated asset

- Do not reduce a branded logo hover to scaling the logo itself. Pacôme keeps
  the 64px orb fixed and reveals separate, source-exact `Click!!` and star SVGs
  from a half-scale left-offset state with a 500ms spring transform.
- Gate hover-only artwork with `(hover: hover) and (pointer: fine)` so touch
  devices retain the clean logo state, and preserve the source's distinct
  pressed scale as an `:active` interaction.

## 2026-08-04 — Logo expressions live between identical endpoints

**Smell**: Every logo click appears to settle on the same happy face, so a final
snapshot makes the interaction look like a redundant replay.
**Failure**: Treating the final logo frame or static PNG as the interaction truth
would erase the four distinct expressions.
**Truth**: Four non-looping 25fps Lottie timelines (`face1`, `face3`, `face4`,
`face5`) share the same settled face but differ at 90ms, 240ms and 750ms.
**Mitigation**: Capture source states on an absolute clock from the click event,
recreate the source state machine and verify rapid replacement, cleanup,
keyboard activation, reduced motion and asset-failure recovery.
