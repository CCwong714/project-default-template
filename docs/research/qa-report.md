# Clone QA Report

## Automated checks

- Formatting: Prettier
- Static analysis: ESLint
- Type safety: TypeScript `--noEmit`
- Interaction tests: Vitest + Testing Library
- Production output: TypeScript project build + Vite build

The interaction test proves the required order:

1. `Open`
2. `Reply`
3. `Take Compass`
4. `Take Map`
5. `Take Potion`
6. `Listen to the satyr`

The Satyr timing and `Attack !` unlock were also replayed in the real browser.

## Browser matrix

| Viewport   | Horizontal overflow | Gate result                          |
| ---------- | ------------------: | ------------------------------------ |
| 1440 × 900 |                 0px | All gates and final chapter verified |
| 768 × 900  |                 0px | Inventory layout and unlock verified |
| 390 × 844  |                 0px | Inventory and Satyr layout verified  |

## Key visual references

- `clone-desktop-1440-hero.png`
- `clone-gate-open-desktop.png`
- `clone-gate-reply-desktop.png`
- `clone-gate-inventory-final-desktop.png`
- `clone-gate-attack-pixel-aligned-desktop.png`
- `clone-tablet-768-inventory.png`
- `clone-mobile-inventory-final.png`
- `clone-mobile-satyr-final.png`

All reference captures live in `docs/design-references`.

## Accessibility and motion

- Semantic buttons are used for every action.
- Locked inventory actions use the native `disabled` attribute.
- Status changes use polite live regions.
- Keyboard focus is visibly styled.
- A skip link and document-level H1 are present.
- The contact form has labels, names, types, and autocomplete hints.
- Reduced-motion preferences collapse CSS animation and transition durations.
- Touch controls use `touch-action: manipulation`.
