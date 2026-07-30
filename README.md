# Noomo Digital Storytelling — exact Canvas mirror

This project localizes the public production experience from
`https://storytelling.noomoagency.com/`. The active page is the captured
Nuxt/Three.js/GSAP runtime and its original one-canvas asset graph, not the
earlier React approximation.

## What is reproduced

- The original WebGL Phoenix, camera timelines, shaders, particles and all 20
  scroll-driven acts.
- Desktop and mobile camera behavior, loading/start sequence, sound controls and
  full-screen mobile menu.
- The liquid-glass pointer with WebGL spirit trail.
- The repeatable, non-navigating `Reimagine Phoenix` palette control.
- The final crystal, fire, ember and contact sequences.

The older React implementation remains in `src/features/storytelling/` only as
unreferenced project history. The browser entry is generated from the captured
production shell in `.clone-ui/source/` and uses assets under `public/`.

## Setup

```bash
nvm use
npm install
npm run dev
```

Run all engineering gates with:

```bash
npm run check
```

This checks formatting, ESLint, TypeScript, Vitest, the localized asset graph and
the production Vite build. Google Tag Manager is disabled by the preparation
script and replaced with a local empty file.

## Evidence

- Source and implementation record: `.clone-ui/plan/provenance.md`
- Exact section map: `.clone-ui/plan/section-map.json`
- Desktop/mobile and interaction receipts: `.clone-ui/qa/exact-mirror/`
- Research notes: `docs/research/`

## Usage boundary

The mirrored minified runtime, models, textures, fonts, audio and design remain
material of Noomo/the source owners. Treat this repository as a private local
fidelity reference unless you have permission to redistribute those files.
