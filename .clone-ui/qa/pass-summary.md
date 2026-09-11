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

---

# Pacôme project routes — 2026-08-20 QA

## Pass A — desktop layout

- Compared the public source and local clone at 1280 × 720.
- The project panel resolves to `x=30, y=30, width=1220`; the hero is 690px
  high and the fully revealed next card is `602 × 338.625` at `y=190.6875`.
- Info, CTA and alternating styleframe geometry match the source grid.

## Pass B — responsive layout

- Verified at 390 × 844 with no horizontal overflow.
- The project panel resolves to `x=15, width=360`; the 60dvh hero, close
  control, mobile info stack and next-project card stay within the viewport.

## Pass C — interactions and transitions

- Verified list links and the WebGL focused-card hit path enter project routes.
- Ran the scroll-end progress transition through all nine routes and explicitly
  verified `the-purity-revealed -> paths-of-life`.
- Every route replacement resets internal scroll and progress to zero.
- Closing a project returns to a fixed 1280 × 720 home experience without
  replaying the entry overlay or moving the UI; the selected list/spiral mode is
  retained for the return.

## Pass D — independent adversarial review

- A fresh read-only reviewer found no blocking issue.
- It confirmed route order, the final-to-first seam, URL/scroll reset, mobile
  overflow, hidden underlying chrome and stable exit geometry.
- A reported 30px next-card offset was rejected after distinguishing the
  source's hidden initial sticky position (`y≈220.69`) from its fully revealed
  position (`y≈190.69`), which is the state shown in the reference sequence.

## Pass E — final code and browser checks

- `npm run check` passes Prettier, ESLint, TypeScript, 40 Vitest assertions and
  the production Vite build.
- The source Typekit stylesheet loads `Indivisible Variable` successfully.
- No runtime error was observed in the final desktop browser refresh.
