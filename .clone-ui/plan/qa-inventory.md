# Exact-mirror QA inventory

## Runtime invariants

- Exactly one WebGL canvas on desktop and mobile.
- All runtime requests resolve locally; no source-origin or analytics request.
- The captured Nuxt entry, CSS, fonts, models, camera timelines, textures,
  decoders and audio exist in the production build.
- No horizontal document overflow.

## Viewports

- Desktop: 1920 × 873.
- Reference recording: 1918 × 930.
- Mobile: 390 × 844.

## Scroll evidence

- Desktop checkpoints: 0%, 5%, then every 10% through 100%.
- Mobile checkpoints: 0%, 25%, 50%, 75% and 100%.
- The final settled checkpoint must expose the contact footer.
- Section boundaries come from the 20 source records totaling 4230 logical
  scroll units in the captured Nuxt payload.

## Interaction evidence

- Move the pointer across the desktop canvas and capture the liquid lens plus
  WebGL spirit trail.
- Click `Reimagine Phoenix` twice. Both clicks must change the Phoenix palette
  without changing the URL.
- Open and close the original mobile full-screen menu.
- Confirm the source start/audio controls render and remain user-gesture gated.

## Failure signals

- Browser console errors or warnings on a clean desktop/mobile load.
- A blank or additional canvas.
- Failed, external or analytics network requests.
- Palette control navigation or an unchanged second click.
- Missing pointer trail, footer or mobile menu.
