# Noomo Storytelling source analysis

## Evidence

- Source: `https://storytelling.noomoagency.com/`
- Reference recording: 1918 × 930, 25.183 seconds, captured 2026-07-30.
- Live-source desktop and mobile inspection: 2026-07-30.
- The source payload contains 20 scroll sections totaling 4230 logical units.
- The desktop document measured roughly 40,000 physical scroll pixels.

## Confirmed architecture

The source is a Nuxt/Vue application with a single fixed Three.js canvas and
fixed HTML overlays. GSAP maps the long document scroll to copy, camera,
animation, material, particle, audio, navigation and footer state.

- Nuxt + Vue 3.
- Three.js `WebGLRenderer`, GLTFLoader, DRACOLoader, RGBELoader and
  AnimationMixer.
- GSAP with scroll-driven timelines.
- Dedicated desktop and mobile GLB camera timelines.
- Web Audio/HTML audio and source font files.

## Confirmed scene inputs

- `models/v20.glb`: the Phoenix rig and animation clips.
- `models/feather.glb` and seven crystal GLBs.
- `timelines/cam.glb`, `cam-mob.glb` and `dev.glb`.
- HDR lighting, ice, mountain, noise, wave, trail, sprite and crystal textures.
- Background, release-spirit and hover audio.
- TT Neoris and The Seasons source fonts.

## Implementation decision

The active implementation is an exact localized copy of the publicly served
production output. `scripts/prepare-exact-mirror.mjs` generates the root shell
from the captured page, disables analytics and points every required runtime
asset at local `public/` files.

This replaces the earlier approximate React/Three.js page as the browser entry.
The old React source remains unreferenced so existing work is not destructively
deleted.

## Boundary

This choice maximizes private fidelity, but it also carries the source owner's
minified code and media. It is not a clean-room reimplementation. Permission is
required before redistributing or commercially using those materials.
