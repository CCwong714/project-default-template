# Runtime behaviors

These behaviors are supplied by the localized source runtime rather than a
parallel React state model.

## Load, scroll and audio

- The source preloader gates the Phoenix, textures, fonts and camera timelines.
- A click/tap releases the experience and permits audio playback.
- The original GSAP scroll mapping drives camera, Phoenix rig, materials,
  particles, copy, controls and footer across all 20 sections.
- Native touch and wheel input remain intact.
- Sound stays user-gesture gated.

## Pointer and palette

- Desktop pointer movement drives the liquid-glass lens and source WebGL spirit
  trail.
- Interactive controls retain their source hover and sound behavior.
- `Reimagine Phoenix` is a repeatable in-place command. Every activation
  generates a new Phoenix palette and does not navigate.

## Responsive behavior

- Mobile uses the dedicated source camera timeline.
- The glass `Menu` pill opens the original full-screen navigation layer.
- The final contact footer remains composed over the ember Phoenix.

## Local mirror changes

- Google Tag Manager is disabled and replaced by `analytics-disabled.js`.
- Source-origin runtime assets have local paths.
- A `noindex` directive prevents an accidental local fidelity copy from being
  indexed.
