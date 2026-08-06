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
