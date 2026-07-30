# Oryzo findings

## Technology fingerprint

- Astro static production output
- Vanilla JavaScript/TypeScript bundle
- Three.js r178, WebGL2 and GLSL3
- GSAP 3.14.2 with SplitText
- Rive Canvas 2.37
- Gaussian splatting with Worker/WASM support
- Custom scroll manager
- Vimeo video and Mailchimp newsletter integration

React, Vue, Webflow, Tailwind, Lenis and GSAP ScrollTrigger were not part of the
captured production runtime.

## Fidelity-critical lessons

1. The runtime expects the home route at `/`. Serving the captured page from
   `/oryzo/index.html` caused `route not found for path: oryzo/index.html` and
   left the WebGL preloader stuck. Mounting the build at `/` fixed it.
2. The public `lusionltd/ORYZO-1` repository contains MIT-licensed OBJ
   checkpoints, a README and a paper. It is not the website source repository.
   The live page says “Code coming soon”.
3. The production experience uses six Canvas elements and twelve content
   sections. Preserve both desktop and dedicated mobile assets.
4. Adobe Typekit Halyard is a licensed remote dependency. Do not repackage its
   font binaries without permission.
5. Two wearable-gallery MP4 requests can appear as `ERR_ABORTED` when the
   browser cancels eager media loading before playback. Confirm the files exist
   and that no 404/5xx occurred before treating this as a failure.
6. A stable Oryzo clone should show no horizontal overflow at 1440, 768, or 375
   pixels; the preloader should become `display: none`; the desktop navigation
   should switch to the mobile menu below 768px.

## Evidence set

Store:

- raw public HTML and production bundles;
- a source URL and capture-date record;
- section, token, asset and embed manifests;
- desktop/mobile source screenshots;
- local screenshots at matching settled states;
- a QA report covering console, network, viewport, preloader and interactions;
- a note separating open model assets from proprietary site design/code.
