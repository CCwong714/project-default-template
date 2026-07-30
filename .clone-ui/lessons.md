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
