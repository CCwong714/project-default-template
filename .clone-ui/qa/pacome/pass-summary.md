# Pacome clone verification summary

## Pass A — source reconstruction

- Captured entry, spiral, inertia, list, menu and About states from the live
  desktop site, plus entry, spiral, list, menu and About at mobile width.
- Extracted the nine project titles, image posters, sound assets, exact UI
  colors, spacing, typography reference and About content from source output.
- Compared the provided recording thumbnail with the live source behavior.

## Pass B — behavior

- Verified continuing downward and upward motion after wheel input stops.
- Verified mid-coast reversal, rapid alternating direction and reduced-motion
  behavior with numeric runtime diagnostics.
- Verified entry, list/spiral, menu, sound, showreel, About and project routes.

## Pass C — safety and fidelity

- Scanned captured source material for prompt-injection patterns; no actionable
  instruction was found, so the source was treated as visual evidence only.
- Browser QA completed with zero console errors and all nine HLS project
  textures available after buffering.

## Pass D — adversarial review

- A fresh review identified missing HLS playback, an incomplete About route,
  helix geometry drift, invented chrome, focus issues and hidden-runtime work.
- The implementation now uses HLS with local fallbacks, includes the complete
  About experience, has retuned helix geometry, removes the invented indicator,
  traps/restores dialog focus, and pauses the WebGL/media runtime while hidden.

## 2026-08-04 — Home automatic motion iteration

- **Pass A — sanity:** live source inspection and production-runtime evidence
  both confirm a positive default direction and a non-zero minimum idle speed.
- **Pass B — computed styles:** no CSS or typography changed in this iteration;
  the existing size/style comparison remains unchanged.
- **Pass C — motion QA:** autoplay advanced from `0.00628` to `0.06851` without
  input. Downward and upward motion both continued after input stopped;
  mid-coast reversal, rapid alternating input, pause and reduced-motion checks
  passed with zero console errors.
- **Pass D — adversarial:** fixed missing velocity-driven shader deformation,
  reversed project ordering, source-inaccurate touch gestures and refresh-rate
  drift. The runtime intentionally remains paused while the helix is hidden by
  list/menu/showreel UI.
- **Pass E — lessons:** documented minimum-speed motion and braking-distance QA
  in `.clone-ui/lessons.md`.

## 2026-08-04 — Outward card curvature iteration

- **Pass A — sanity:** the video reference and production shader both show the
  card center displaced outward; the previous edge-forward curve was inverted.
- **Pass B — computed styles:** no DOM typography or CSS changed; this iteration
  is isolated to Three.js geometry and shader uniforms.
- **Pass C — visual:** source/local desktop entry and 120ms wheel states were
  compared at the same viewport. Desktop and mobile automated QA preserved
  autoplay, both directions, reversal and reduced-motion behavior with zero
  console errors.
- **Pass D — adversarial:** no blocking curvature or cylinder-orientation drift
  remained. The reviewer identified crisp backfaces as an apparent-concavity
  risk; the source's nine-tap backface blur was added.
- **Pass E — lessons:** documented center-versus-edge displacement and the need
  to derive cylinder position and tangent rotation from one shared angle.

## 2026-08-04 — Top-left logo hover iteration

- **Pass A — sanity:** the source rendered DOM confirms the hover uses separate
  inline `Click!!` and gradient-star SVGs rather than a generic logo scale.
- **Pass B — computed motion:** matched the source's 80px tag, 32px star,
  half-scale initial state, 200ms opacity transition, 500ms spring transform,
  `-5deg` rotation, `-12px` lift and 0.95 pressed scale.
- **Pass C — visual:** the desktop hover capture resolves to opacity `1`, an
  approximately `-5deg` transform and an 83px rendered bound; the mobile spiral
  capture keeps the hover artwork hidden. Existing runtime QA remains clean.
- **Pass D — adversarial:** an independent reviewer found no blocking SVG,
  motion, pointer-gating, accessibility or logo-placement drift. Its test-gap
  note was addressed by locking the initial, hover, active and pointer states.
- **Pass E — lessons:** documented that logo hover artwork must be preserved as
  a separate animated asset and gated to hover-capable fine pointers.

## 2026-08-04 — Logo click-expression iteration

- **Pass A — sanity:** production-runtime inspection confirmed the exact
  `face1 → face3 → face4 → face5` modulo sequence, non-looping 25fps Lottie SVG
  playback and the matching `smiley1` through `smiley4` sound mapping. The
  clone is pinned to the source's `lottie-web` 5.12.1 runtime.
- **Pass B — computed geometry:** desktop and mobile runs preserved the source
  64px logo, at 30px and 15px viewport offsets respectively, while keeping the
  existing hover artwork and pressed state.
- **Pass C — visual and interaction:** source and clone were compared at
  absolute 90ms, 240ms, 750ms and 2000ms checkpoints for all four expressions.
  The click cycle, focus outline, Space/Enter activation, rapid replacement,
  reduced-motion settled frame and missing-asset fallback all passed with zero
  console errors.
- **Pass D — adversarial:** the independent review found no blocking drift in
  face order, playback, sound mapping, keyboard semantics, cleanup or responsive
  placement. Its intermediate-frame QA gap was closed with absolute-time source
  and clone captures; reduced motion intentionally settles without animation.
- **Pass E — lessons:** documented that the expressive states live between
  identical endpoints and that sequential screenshot waits must not be labeled
  as absolute interaction timings.
