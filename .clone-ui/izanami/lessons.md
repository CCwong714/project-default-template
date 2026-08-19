# Izanami clone lessons

- Preserve the unusually tall square desktop backgrounds; cropping them to `100vh` changes the scroll composition.
- Menu text begins after the page frame shrinks and finishes later than the overlay opacity.
- Project panels are sticky on desktop and become long stacked sections on mobile.
- Pointer motion must decay after input stops; a persistent cursor blur does not match the source.
- Use the captured 1920×873 and 390×844 states for all visual comparisons.

## 2026-08-05 — The cursor footprint is a constant Gaussian splat

- Smell: velocity-scaled DOM circles and interpolated bridge drops made the affected area grow far beyond the cursor.
- Source truth: the production shader keeps `u_point_size` at `0.0005` and injects one splat at the current pointer position per rendered frame; velocity changes the distortion strength, not its radius.
- Mitigation: derive a constant 1%-falloff diameter from viewport height, apply a Gaussian radial mask, and coalesce pointer events to one current-position splat per animation frame.

## 2026-08-06 — Visible refraction requires a real displacement field

- Smell: translucent DOM circles remain barely visible on misty photography and cannot bend high-contrast image features into the source's crescent and teardrop shapes.
- Failure: backdrop blur adds a soft lens but leaves the underlying pixels in place, so the interaction reads as a faint glow instead of stirred liquid.
- Truth: the source advects velocity and dye through a stable-fluid framebuffer, then offsets the rendered image along that field; one pressure pass per frame keeps the curl organic and responsive.
- Mitigation: capture visible page imagery and declared CSS image backgrounds into a viewport texture, distort it with the GPU fluid field, composite it below UI text, and retain coarse-pointer and reduced-motion fallbacks. Bound the capture/upload loop to the dye decay window so the idle page does not continuously upload a full viewport texture.

## 2026-08-06 — The loader is a timed scene transition, not a spinner

- Smell: a refresh jumps directly to the hero or shows a generic centered spinner even though the source keeps the hero title and a lower-left numeric counter on a black field.
- Failure: the opening loses the source's deliberate pause, or a timer reaches 100 while a cold-load image or font is still missing.
- Truth: the source splits “Remember who you are” into characters, ties numeric progress to font and image tasks, eases the completed value over three seconds, then fades the black loader for three seconds while the header and aside reveal after a one-second delay.
- Mitigation: preload the active picture sources and used fonts, preserve the loader's source DOM geometry, and run resource progress, loader exit, and global-control reveal as separate coordinated tracks; lock scrolling and inert the underlying shell until the exit completes.

## 2026-08-07 — Header hover is cloned-text replacement, not a generic underline

- **Smell:** JA shows only a faint or collapsed line, while MENU dots split sideways and its label stays static.
- **Failure:** a generic underline and one text node cannot reproduce the source's vertical text exchange; CSS transition reversal also finishes too early after a quick pointer exit.
- **Truth:** the source clips paired text layers at `0/-110%` and `130/0%`, grows a left-origin line over 700ms, and replaces MENU dots vertically between `-300%`, `0`, and `300%`; interrupted motion starts a fresh 700ms `quart.out` return.
- **Mitigation:** preserve the source's head/body grid and cloned layers, animate exact GSAP targets, kill in-flight tweens before every enter/leave, and retain static CSS states only for reduced-motion, keyboard, and coarse-pointer fallbacks.

## 2026-08-07 — Background continuity and sticky distance share one geometry

- **Smell:** a square background ends at the DOM box, leaks into the next card, or the same wheel gesture travels a different distance even when individual screenshots look close.
- **Failure:** treating the WebGL background, Lenis input, and sticky-card compression as independent effects shifts every downstream handoff.
- **Truth:** the source uses Lenis defaults, moves background meshes at 0.8 of the section travel, fades common backgrounds through their final viewport, clips the Projects background at its square target, and compresses the sticky stack by half of the first section.
- **Mitigation:** measure source section boundaries first, derive the sticky target from natural panel heights, and verify identical wheel input plus the exact background/card boundary on desktop and mobile before tuning visual details.

## 2026-08-10 — The Projects background is an unclipped desktop mesh

- **Smell:** the Projects image target begins after Philosophy, yet the reference recording already shows its architecture beneath the entering Philosophy collage.
- **Failure:** clipping the image to `.izanami-projects-intro` creates a black gap, and making School opaque too early removes the source's visible background overlap.
- **Truth:** the source moves the desktop mesh by `0.8 × (scroll - targetTop)` without a Projects scissor, then fades it from the target rectangle's bottom. On mobile the runtime skips that post-effect translation, so early bleed would be incorrect.
- **Mitigation:** animate the complete desktop background plane from its measured layout top, keep the Philosophy and School foregrounds above it, allow overflow through the intended handoff, and isolate mobile to the DOM-aligned fade path.

## 2026-08-10 — Mobile background targets are shorter than their content sections

- **Smell:** the mobile forest lingers through the Philosophy handoff, or the Company photograph remains behind copy that should already be on black.
- **Failure:** sharing the desktop post-effect translation with mobile shifts every image transition; fading Company against the full content section also delays black by roughly 35vw.
- **Truth:** the source mobile runtime skips mesh translation but keeps the bottom-driven fade. Its Company image target is 175.1243781095vw, while the section continues to 210.4727564103vw; Latin copy also depends on the dedicated Shippori Latin subset for exact line breaks.
- **Mitigation:** split translation and fade by media query, attach fades to the actual image target, and verify font-backed text geometry at the recording width plus a narrower 390px regression viewport.

## 2026-08-12 — Preserve authored alpha before colour-grading source photography

- **Smell:** the correct source photograph still looks muddy, especially toward the lower edge, so the asset itself appears suspect.
- **Failure:** a synthetic black readability gradient, reduced cloud opacity, and clouds placed 23.631840796vw to 33.0625vw too low compound into a much darker frame and remove the source's white-grey mist.
- **Truth:** the local and live Hero files are byte-identical; the source renders no dark Hero pseudo-element, keeps both authored cloud images at opacity 1, and resolves their vertical positions through both the shared wrapper and per-cloud offsets.
- **Mitigation:** verify asset hashes, computed ancestor styles, and cumulative geometry before adding filters; remove non-source darkening layers and compare luminance zones at the exact viewport while allowing only for horizontal cloud phase differences.

## 2026-08-12 — CTA hover is a translating whole-button line

- **Smell:** the CTA appears to fill a short leading dash, while the label only nudges or swaps too quickly.
- **Failure:** treating the line as a five-vw progress slot hides the source's strike-through sweep, and a shared CSS transition cannot reproduce the slower line-only return after pointer exit.
- **Truth:** the source positions two full-width absolute lines inside the button block. Its hover runtime moves the interactive line from `-(text width + remaining tail + buffer)` to `text offset - buffer`, exchanges paired text at `0/-130%` and `130/0%` over 700ms `quart.out`, then returns only the line over 1.1s. The declared 70ms text delay is not passed to the actual hover tweens.
- **Mitigation:** preserve the full-line geometry, calculate offsets after layout at the source's 1600/402 design bases, kill all in-flight tweens before enter/leave, and mirror the motion for focus while leaving a static readable state for coarse pointers and reduced motion.

## 2026-08-12 — Pointer-silent sections must clear accumulated fluid

- **Smell:** a nominally static black section still shows liquid folds when the pointer moves, or a trail from the previous photographic section remains visible after the handoff.
- **Failure:** filtering only the current pointer event prevents new splats but leaves the existing velocity and dye targets rendering until their multi-second decay completes.
- **Truth:** the source runtime still forwards desktop pointer movement globally, while the supplied recording and explicit requirement establish the observed contract: no visible response throughout School, Craft, and Retreat.
- **Mitigation:** mark the complete static stack as a disabled region, test the pointer against its live viewport rectangle on both pointer and scroll events, cancel the pending frame, clear every fluid target on entry, hide the composite, and rebase the pointer when restoring the empty canvas so the first outside event cannot create a jump trail.

## 2026-08-12 — One Footer can contain two distinct hover runtimes

- **Smell:** every Footer link receives one generic underline transition, so the small navigation feels too short while the large next-page title stretches across the full container.
- **Failure:** sharing a 115% CSS transition erases the source's 110% regular-link exchange, 130% next-button exchange, geometry-derived long-line travel, and intersection entry sweep; CSS reversal also shortens interrupted motion.
- **Truth:** regular Footer links and TOP use a 0.7s `quart.out` 110%/130% roll plus left-origin line scale. The large Philosophy control instead uses the button runtime's 130% text exchange, a 40px desktop line buffer and 1.1s line return, preceded by two 0.7s sweep lines and a 1.2s staggered character reveal.
- **Mitigation:** preserve separate DOM geometries and motion hooks for regular links and next-page buttons, measure the long line after fonts resolve, kill in-flight tweens on reversal, and verify idle/active transform matrices against the live runtime rather than comparing only settled screenshots.

## 2026-08-13 — A locale switch is a source-defined content boundary

- **Smell:** clicking JA only scrolls to the top, or every English word is mechanically translated even though the source keeps its global UI bilingual through shared English labels.
- **Failure:** treating localization as a text replacement pass changes the source hierarchy, CTA widths, navigation rhythm, and authored line breaks; a cosmetic toggle also loses the source's shareable `/ja/` URL and reload behavior.
- **Truth:** the source routes EN to `/` and JA to `/ja/`. Its Japanese home page translates descriptive copy only, retains English Hero/headings/buttons/navigation, and inserts one mobile-only break inside the first Company paragraph.
- **Mitigation:** extract locale copy verbatim from the trusted content portions of the source HTML, keep shared labels outside the locale map, derive active state and document metadata from the route, and test the complete JA-to-EN cycle plus dense mobile paragraphs in a real browser.

## 2026-08-13 — A correct hover tween can still occupy the wrong grid cell

- **Smell:** cloned text reaches the correct transform matrices and the line reaches scale 1, yet the line appears above the label or spans a visibly different width.
- **Failure:** placing the inner text nodes in `grid-area: 1 / 1` is insufficient when their clip wrapper remains auto-placed; the explicit line takes row one and the wrapper falls into a second row. A parent-level uppercase transform can also alter the measured line width even when the authored copy looks equivalent.
- **Truth:** the source places the clone-target wrapper and strike line in the same grid area, clips with 0.1em block padding, and preserves the authored `whatsapp`, `Instagram`, and `privacy policy` casing.
- **Mitigation:** compare wrapper, line, and text rectangles in addition to animation matrices; verify text-transform and settled width against the live source before declaring a hover primitive matched.

## 2026-08-14 — A shared `sticky` class is not proof of pinned motion

- **Smell:** the Company section looks smooth in isolated screenshots, but “Who we are” stops at the viewport top for several hundred pixels before Footer, so normal scrolling feels like a pause.
- **Failure:** interpreting the source's `.sticky` utility name as `position: sticky` added a pin the source never had; leaving the vertical label in normal flow then pushed the entire centered Company group down by roughly 13.5vw.
- **Truth:** the source `.sticky` utility is only a full-height grid. Its label and main content overlap in the same grid cell, while the whole Company group moves one-for-one with document scroll; a 321px source scroll moves the content -321px.
- **Mitigation:** verify computed position and two scroll samples instead of trusting class names, overlap label/content with the source grid, reserve actual sticky behavior for the Projects panels, and keep scrubbed reveals to transform/opacity rather than repainting whole blocks with CSS blur.
