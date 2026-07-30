# QA Matrix

## Viewports

- 390 × 844
- 768 × 1024
- 1440 × 1000

## States

- loader
- hero before start
- hero after start
- progress 0.05, 0.19, 0.28, 0.38, 0.43, 0.47
- progress 0.57, 0.62, 0.67, 0.71, 0.76
- progress 0.85, 0.90, 0.95, 1.00
- mobile menu open
- sound on/off
- Reimagine Phoenix click 1 and click 2, with unchanged URL
- pointer at left, center, and right; trail moving and settled
- interactive-link cursor contraction
- reduced motion
- WebGL unavailable

## Pass conditions

- No horizontal overflow.
- No console errors or unhandled promises.
- Active copy matches the progress map.
- Canvas remains crisp without DPR runaway.
- All controls are keyboard focusable and visibly focused.
- Closed menu/footer links are inert, and menu focus returns to its trigger.
- Palette clicks visibly differ while page chrome/background stay in the same
  story phase.
- `npm run check` passes.
