# Pacôme clone QA inventory

## User-visible claims

- The complete source loading sequence plays once before the entry choices appear.
- Loading copy and controls match the source measurements on desktop and mobile.
- Entry actions remain unavailable until both the Lottie sequence and local project posters are ready.
- Entry gate matches the reference and offers sound/no-sound paths.
- Spiral mode uses real project imagery on a perspective helix.
- A wheel gesture keeps moving for several seconds after the user stops.
- The post-gesture direction follows the last wheel direction for both down and up.
- List mode, menu, sound toggle, desktop and mobile layouts are functional.
- The top-left logo cycles through four source-exact animated expressions on click.
- The complete About page includes its long sticky intro, moving project strip,
  contact block and social links.

## Functional checks

- Early loading state: copy is unrevealed and both entry actions are disabled and removed from the tab order.
- Ready state: the two copy lines reveal, the primary action receives focus, and Tab/Shift+Tab cycle between the two entry choices.
- Enter with sound: gate closes, ambient loop starts, sound button reports on.
- Enter without sound: gate closes, ambient stays muted.
- Spiral/List: full round trip preserves fixed chrome and changes view.
- Wheel down: capture at 120ms, 1320ms and 4120ms; gallery angle continues increasing and velocity decays.
- Wheel up: same checkpoints; gallery angle continues decreasing and velocity decays.
- Mid-coast reversal: one opposite impulse immediately reverses the pending target.
- Rapid reversal: the final wheel direction wins without stale momentum.
- Menu: open, keyboard Escape close, close button, focus return.
- Entry and showreel dialogs trap keyboard focus; closing restores focus.
- Sound: toggle on/off after entry.
- Logo: five consecutive clicks cycle through face3, face4, face5, face1 and face3; rapid clicks always advance exactly once.
- List titles: all nine links render in source order.
- Showreel pauses the helix and resumes it after closing.
- Project videos use HLS and retain a local poster fallback.

## Visual states

- Desktop 1920x873: entry, spiral, list, menu, one in-transition inertia frame.
- Mobile 390x844: entry, spiral, list, menu.
- Desktop logo: initial state, one in-transition frame and all four settled expressions.
- Smaller desktop 1024x768: no horizontal overflow or clipped controls.
- About contact/social footer is reachable by normal page scrolling.

## Exploratory checks

- Direct navigation to `/about` still plays the complete loader and exposes both entry paths.
- Lottie data failure falls back to the static Pacôme orb while preserving entry access.
- Repeated rapid wheel-direction reversals do not leave stale forward momentum.
- Repeated Spiral/List toggles do not duplicate canvases, listeners or audio.
- Rapid logo clicks replace the active Lottie cleanly without duplicated SVG renderers.
- Reduced-motion preference disables long inertial motion while preserving navigation.

## Completed browser run

- Loading desktop: 1440x900, ten timeline captures from 0ms to 4000ms.
- Loading mobile: 375x812, seven timeline captures from 0ms to 4200ms.
- Mobile source evidence was recaptured at the true 375x812 viewport in `source-mobile-loading-final-375.png` and `source-mobile-loading-ready-375.png`; the ready capture waited for the source WebGL gate rather than assuming a fixed network duration.
- Desktop final geometry matched the source to sub-pixel rounding: Lottie `300×303 @ (570, 223.5)`, copy `300×48 @ (570, 450.5)`, primary `169.515625×46 @ (635.2421875, 530.5)`, silent action `111.046875×14 @ (664.4765625, 856)`.
- Mobile final geometry matched the source exactly: Lottie `300×303 @ (37.5, 179.5)`, copy `300×48 @ (37.5, 406.5)`, primary `168.875×46 @ (103.0625, 486.5)`, silent action `110.296875×14 @ (132.34375, 783)`.
- Both sound/no-sound entry paths passed; the post-entry overlay moved one full viewport and became hidden.
- Keyboard focus cycle passed in both directions; direct `/about` loading passed.
- WebGL initialization is guarded so unsupported contexts finish the entry gate instead of reaching the generic app error.
- Loading QA browser console errors: 0.
- Automated regression coverage: 17 tests passed, including the Lottie metadata and the dual loader/scene readiness gate.
- Desktop: 1920x873; mobile: 390x844.
- Downward checkpoints: `0 → 0.21261 → 1.24655 → 1.57590`.
- Upward checkpoints: `1.57590 → 1.36489 → 0.36413 → 0.00507`.
- Video textures after buffering: 9/9.
- Browser console errors: 0.
- Full machine-readable output: `.clone-ui/qa/pacome/results.json`.
