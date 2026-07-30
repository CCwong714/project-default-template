# Exact Canvas mirror — QA summary

## Production runtime

- The active page loads the localized public Nuxt/Three.js/GSAP production
  runtime, with one WebGL canvas.
- The production preview resolved its scripts, CSS, fonts, 3D models, textures,
  decoders and audio locally.
- Google Tag Manager is disabled and its remote URL is absent.
- A clean production-preview load reported no browser console errors or warnings.

## Desktop

- Verified at 1920 × 873 with a 3840 × 1746 high-DPI canvas.
- Used real wheel input through the complete 36,928px document range.
- Captured the full story at 11 checkpoints and a settled contact-footer state.
- No horizontal overflow.

## Mobile

- Verified at 390 × 844 with a single 390 × 844 canvas.
- Captured five full-range checkpoints.
- Opened and closed the source full-screen menu.
- No horizontal overflow.

## Pointer and palette

- Captured the original liquid-glass pointer and its large WebGL spirit trail.
- Clicked `Reimagine Phoenix` twice; both clicks produced distinct Phoenix
  palettes while the URL remained unchanged.

## Receipts

- Desktop: `.clone-ui/qa/exact-mirror/desktop/`
- Mobile: `.clone-ui/qa/exact-mirror/mobile/`
- Pointer and palette: `.clone-ui/qa/exact-mirror/interactions/`
