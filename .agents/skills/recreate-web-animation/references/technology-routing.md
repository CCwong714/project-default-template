# Animation Technology Routing

Use this reference to identify the source technology and choose an implementation without layering redundant libraries.

## Routing table

| Evidence or requirement | Preferred implementation | Notes |
| --- | --- | --- |
| Hover/focus/press changes in opacity, color, or transform | CSS transition | Keep interaction state in CSS when no orchestration is needed. |
| Repeating decorative loop with fixed keyframes | CSS keyframes | Pause or simplify for reduced motion. |
| React mount/unmount, route transition, modal, carousel, shared layout | Framer Motion | Prefer variants and `AnimatePresence`; keep state in React. |
| Parent-child stagger or gesture-driven React UI | Framer Motion | Use motion values and variants before adding a second library. |
| Multi-step cinematic timeline | GSAP timeline | Scope timeline creation and cleanup to the component. |
| Scroll-linked progress, pin, scrub, parallax | GSAP + ScrollTrigger | Verify start/end markers and mobile behavior. |
| Deliberate global smooth scrolling | Lenis | Add only when source evidence supports it; synchronize RAF and ScrollTrigger. |
| Vector animation backed by JSON | Lottie | Reuse the JSON and renderer when permitted. |
| `<canvas>`, WebGL context, shaders, 3D models, particles | Three.js or source-equivalent WebGL | Verify DPR caps, resize cleanup, and fallbacks. |
| Background video, GIF, animated WebP/AVIF | Native media | Do not rebuild encoded media as DOM animation. |

## Detection signals

Look for several corroborating signals rather than relying on a class name:

- CSS: computed `transition-*`, `animation-*`, keyframe names, and state pseudo-classes.
- Framer Motion: React motion wrappers, generated transform styles, presence/layout behavior, or project dependencies such as `framer-motion` or `motion`.
- GSAP: project dependencies, `gsap` globals, inline transforms updated per frame, timeline behavior, or ScrollTrigger markers/configuration.
- Lenis: dependency or global names, transformed scroll containers, smooth interpolation, and GSAP synchronization.
- Lottie: JSON animation assets, `lottie-web`, SVG/canvas render containers, and frame-based vector playback.
- Three.js/WebGL: canvas contexts, renderer loops, shader sources, model or texture assets, and 3D camera behavior.
- Native media: `<video>`, `<img>` with animated formats, CSS backgrounds, and network assets.

## Implementation constraints

### CSS

- Prefer transitions for state changes and keyframes for autonomous sequences.
- Centralize repeated duration and easing values in design tokens.
- Avoid transition-all when only a small set of properties changes.

### Framer Motion

- Use variants for related states and parent-child orchestration.
- Use `AnimatePresence` only for elements that actually mount and unmount.
- Prefer transform-based layout motion and stable React keys.
- Ensure reduced-motion handling produces an immediate, usable state.

### GSAP and ScrollTrigger

- Register plugins once in the correct client boundary.
- Create timelines in component scope and revert or kill them on cleanup.
- Recalculate on breakpoint and content-size changes.
- Validate pin spacing, nested scrollers, refresh timing, and reverse scroll.

### Lenis

- Keep one scrolling authority.
- Avoid combining native smooth scrolling, Lenis, and another smooth-scroll library.
- Synchronize Lenis updates with ScrollTrigger and clean up RAF callbacks.

### Lottie

- Preserve aspect ratio, renderer choice, loop direction, speed, and segment behavior.
- Lazy-load large animations and provide a static fallback.

### Three.js

- Cap device pixel ratio for performance.
- Dispose geometries, materials, textures, controls, and animation frames.
- Pause or reduce rendering when offscreen, hidden, or reduced motion is requested.
- Provide a static fallback when WebGL is unavailable.

## Visual QA measurements

Compare these independently:

- Trigger position or timestamp.
- Initial and final state.
- Translation distance and direction.
- Scale, rotation, and transform origin.
- Duration, delay, easing curve, and spring settling.
- Stagger interval and order.
- Scroll start/end points and progress mapping.
- Gesture threshold, velocity, bounds, and release behavior.
- Loop seam, repeat delay, and direction.
- Reduced-motion result.

Change only one measurement family per iteration so regressions remain attributable.
