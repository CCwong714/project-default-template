# Izanami interactive website recreation

This React and TypeScript project recreates the public Izanami experience at
`https://izanami-official.com/`, using the supplied recordings, the live public
site, and captured desktop/mobile reference frames as visual evidence.

## Included behavior

- Responsive hero, philosophy, projects, company, and footer layouts.
- GSAP scroll reveals and image parallax with Lenis smooth scrolling.
- Liquid-glass pointer droplets that blur the page while the pointer moves and
  fully decay after it stops.
- Matched menu open/close choreography and shared hover transitions for links,
  project calls to action, social links, and footer navigation.
- Local Izanami imagery, Satoshi font, favicon, and source-matched typography.
- Reduced-motion and coarse-pointer fallbacks.

## Run locally

```bash
nvm use
npm install
npm run dev
```

Run all engineering gates with:

```bash
npm run check
```

The visual evidence, measurements, capture inventory, and implementation notes
are stored under `.clone-ui/izanami/`.

## Usage boundary

The source site's imagery, typography, copy, and design remain material of
Izanami and their respective owners. Treat this project as a private fidelity
reference unless you have permission to redistribute those assets.
