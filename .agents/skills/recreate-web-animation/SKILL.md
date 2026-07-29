---
name: recreate-web-animation
description: Inspect, implement, debug, and visually verify web motion across CSS transitions and keyframes, Framer Motion, GSAP and ScrollTrigger, Lenis, Lottie, Canvas, WebGL, and Three.js. Use when recreating animation from a live website, screenshot sequence, screen recording, Figma motion data, or existing code; when a cloned interface needs accurate timing, easing, gestures, scroll behavior, or reduced-motion support; or when animation technology must be detected before implementation.
---

# Recreate Web Animation

Reproduce motion from observable evidence while using the simplest technology that matches the original behavior.

Before implementation, read [`references/technology-routing.md`](references/technology-routing.md) completely.

## Evidence contract

Capture or infer only from observable signals:

- Initial and final visual states.
- Trigger: load, viewport entry, hover, focus, press, drag, route change, or scroll progress.
- Animated properties and transform origin.
- Duration, delay, easing or spring behavior, stagger, repetition, and direction.
- Whether progress is time-based, gesture-driven, or scroll-linked.
- Desktop/mobile differences and reduced-motion behavior.
- Existing libraries, DOM attributes, canvas elements, asset types, and runtime signatures.

When exact values are unavailable, record the evidence and mark tuned values as approximations.

## Workflow

### 1. Inspect before coding

1. Inspect the repository's framework, installed animation libraries, styling conventions, and browser targets.
2. Observe the source animation at the relevant viewport and interaction state.
3. Distinguish true animation from video, GIF, animated image formats, Lottie JSON, or canvas rendering.
4. Build a compact motion inventory by component and trigger.

### 2. Route each effect

Choose one primary implementation per effect:

- Use CSS transitions or keyframes for simple hover, focus, opacity, transform, and self-contained loops.
- Use Framer Motion when React lifecycle, variants, presence, layout transitions, gestures, or component orchestration are central.
- Use GSAP timelines for tightly coordinated sequences; add ScrollTrigger for pin, scrub, parallax, or scroll-linked timelines.
- Use Lenis only when the source has deliberate smooth scrolling and it materially affects timing; synchronize it with ScrollTrigger.
- Reuse Lottie JSON when the source is a Lottie animation and reuse is permitted.
- Use Three.js only when the source genuinely uses WebGL, 3D scenes, shaders, particles, or model rendering.
- Preserve native video or animated media instead of rebuilding it in JavaScript.

Do not stack multiple animation libraries on one effect without a demonstrated need.

### 3. Implement in stable layers

1. Make the static layout correct first.
2. Implement the simplest local transitions.
3. Add entry/exit and component orchestration.
4. Add scroll-linked or pointer-driven behavior.
5. Add global smooth scrolling only after section motion is stable.
6. Scope cleanup to component lifecycles and remove listeners, observers, timelines, and animation frames.

Prefer `transform` and `opacity`; animate layout or paint-heavy properties only when fidelity requires it.

### 4. Accessibility and resilience

- Provide a useful static state when JavaScript or motion is unavailable.
- Respect `prefers-reduced-motion`; remove nonessential movement and avoid replacing it with a long fade.
- Keep controls usable by keyboard and assistive technology throughout animation.
- Prevent motion from trapping focus, blocking input, or causing unexpected layout shifts.
- Guard browser-only APIs during server rendering.
- Check touch behavior, viewport resizing, orientation changes, and iOS Safari.

### 5. Motion QA

Compare the source and implementation using equivalent conditions:

1. Verify trigger position and initial state.
2. Verify direction, distance, scale, transform origin, and opacity range.
3. Verify duration, delay, easing, spring settling, and stagger.
4. Verify scroll start/end, scrub relationship, pin spacing, and reverse behavior.
5. Verify gesture thresholds, velocity response, cancellation, and bounds.
6. Verify desktop, mobile, reduced-motion, and low-performance behavior.

Tune one variable family at a time. Fix shared timing tokens and trigger math before adding per-element overrides.

## Output

Provide:

- The detected motion technology and evidence.
- The chosen implementation and why it is the minimum faithful option.
- The files changed and any new dependency.
- The viewports and interaction states verified.
- Any approximation, browser limitation, or remaining mismatch.

