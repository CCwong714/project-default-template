# Clone UI lessons

- The source Hero is a 400vh stage. Its bottom content begins 625px before the stage ends, so the copy moves with document flow while the transformed video remains viewport-bound.
- The cinematic frame is a transform stack, not a single scaled video: an outer scale/blur/opacity layer, a 300vh perspective container, and an inner `rotateX` layer.
- The supplied recording is rendered at roughly five-sixths of the live source's 1600×900 computed typography. Pixel bounding boxes were more reliable than copying live CSS values directly.
- The Hero video is intentionally not `autoplay` or `loop`. It starts after the first non-zero scroll, completes once, and resets only when the page returns to the top.
- Hover transitions can skew CTA color screenshots. Move the pointer away and allow the short transition to settle before comparing pixels.

## Header — 2026-07-30

- The 2940×1600 recording is a 2× Retina capture of a 1470×800 CSS viewport; reproducing the viewport was necessary to trigger the same condensed navigation state.
- Unreal's desktop header uses a 50px Epic control, a 233px property-logo slot, and then a dynamically condensed main menu. At 1470px the first four links remain visible; at 1600px Documentation also remains visible.
- The source wordmark is a single official SVG asset. Using it directly avoided the spacing and glyph differences caused by reconstructing the mark and name separately.
- The 1470px header geometry is deterministic: navigation begins at x=359, actions at x≈802, and right-side controls retain fixed bounds while the search field absorbs the remaining width.
- The More panel is a blurred overlay rather than an opaque menu: 202×182px, 8px inner padding, four 41px rows, a 16px radius, and layered low-opacity shadows.
- Its nested Learning/Connect panels reuse the same material treatment at 240px wide; the Learning state is 141px tall with three 41px rows and overlaps the parent panel edge by about 9px.
- Backdrop-filter nesting changes the sampled backdrop. The header background and each menu level need to be sibling layers; placing a submenu inside an already blurred panel makes the second blur visibly too transparent.
- Source-like menu semantics require state as well as CSS hover: More, Learning, and Connect now keep `aria-expanded` synchronized while focus remains inside the navigation.

## 2026-07-30 — Initial Hero scale and color asset

**Smell**

The initial Hero looked warmer and heavier than the source even though both pages used the same city video.

**Failure**

A hand-built black radial gradient, a brightness filter on the logo, and fluid display sizing produced orange-biased midtones, nearly black edges, and oversized title and icon bounds.

**Truth**

The source places its official 2600×1463 focus-gradient over the video, renders the U logo at 330×330px with its native #0E1128 fill, and uses Inter Tight 66px/900 with a 74px line height. The gradient also has a fixed-pixel scroll contract: it scales from 1 to 1.3 and fades from 1 to 0.9 over the first 200px, then fades to zero between 200px and 300px.

**Mitigation**

Capture the source layer URL, computed element bounds, and at least three transition states before approximating visual treatment; then validate source and clone in the same CSS viewport and record the measured geometry and scroll thresholds.

## 2026-07-31 — Header Epic logo asset

**Smell**

The Epic badge occupied roughly the right area, but its shield outline and letterforms did not match the production header.

**Failure**

The local asset reconstructed the badge with simplified geometry and live Arial text inside a 38×42 view box. Constraining that asset to a 32px-high slot made it only 28.953px wide, while the adjacent CSS-border chevron rendered at approximately 8.596px.

**Truth**

The production header exposes a single-path 32×32 white Epic shield inside `epic-wf-shield`. Its 50×32px control uses a 2px gap, 4px right padding, and a separate 12×12 SVG chevron; at the 1470×801 reference viewport these elements start at x=24 and x=58 respectively.

**Mitigation**

When an exact brand mark is encapsulated in a web component, inspect its shadow DOM and copy the authoritative vector path and control geometry rather than recreating the logo from text. Verify that adjacent fixed slots keep their original coordinates after replacing the asset.

## 2026-07-31 — Hero scroll animation timeline

**Smell**

The Hero looked close in isolated screenshots, but the logo, titles, and cinematic frame crossed states at visibly different scroll positions from the production page.

**Failure**

Animation values were derived from one normalized 400vh progress value and eased transitions. The production sequence instead combines fixed-pixel thresholds with viewport-relative start points, so scaling, fading, title travel, and perspective drifted apart as the user scrolled.

**Truth**

The U logo scales from 1x to 3x over 500px while its mask fades over 600px. The initial title exits over 300px beginning at viewportHeight - 300px; the second title enters after one viewport and exits over 400px after two viewports. At the same two-viewport boundary, the video begins a one-viewport 1-to-0.5 scale, 0-to-30px blur, and 0-to--40deg rotateX transform inside a 300vh perspective container. Its opacity only fades during the second half. The concluding copy is 864px wide with 34px/42px typography and a 40px CTA, and its transition reaches the 52px section navigation at y=557 in the scrollY 2600 reference frame.

**Mitigation**

Sample the source at fixed scrollY keyframes and record each layer independently. Preserve fixed-pixel and viewport-relative timelines as separate formulas, verify transform-stack geometry rather than only CSS values, and compare the final body-copy state as part of the animation rather than treating it as unrelated content.
