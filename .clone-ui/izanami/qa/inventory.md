# Izanami QA inventory

## Verified visual states

- Desktop hero and section captures at 1920×873; exact total height: 11,510px.
- Mobile hero, menu, footer, and eight representative scroll captures at 390×844; no horizontal overflow.
- Full-page structure: Philosophy collage/copy, Projects intro, School/Craft/Retreat panels, Company, and Footer.
- Mobile footer order matches the source: navigation → social/privacy links → locations → clocks/page top.

## Verified interactions

- Menu closed → opening → settled open → closed. At 520ms the overlay was already at 0.978 opacity; at settlement all five main links and the subnav were fully opaque and unblurred.
- Rapid reversal: opening was interrupted at 120ms, then closed; overlay, page scale, body lock, and `aria-expanded` all returned to the closed state.
- The shared hover primitives cover language, menu trigger, primary nav, subnav, CTA buttons, footer navigation, social links, next-page, and page-top controls. Each has an equivalent `:focus-visible` state.
- Pointer motion produces an advected GPU velocity-and-dye field that displaces the visible page imagery into the source-matched liquid folds. The field decays to a transparent canvas after input stops and the render loop then sleeps.
- The hero title/background, collage images, text groups, project panels, and company mark were checked through representative scroll positions.
- The first-screen clock/copyright/Scroll strip becomes hidden after the source-matched orientation-aware scroll threshold.

## Fallbacks

- Coarse pointers and viewports at or below 767px do not instantiate the desktop water trail; changing those media conditions also starts or disposes the renderer dynamically.
- Reduced-motion mode disables the trail, Lenis smoothing, cloud animation, and long transitions.

Screenshots and source comparisons are stored beside this file and under `../source/captures/`.
