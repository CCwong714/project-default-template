# SiteChrome Specification

## Overview

- Target: `src/features/storytelling/components/SiteChrome.tsx`
- Evidence: desktop and mobile top screenshots
- Interaction model: click, hover, scroll visibility

## Desktop

- Logo at 56px / 38px from the top-left region.
- Agency, Labs, Contact links at the top-right.
- Transparent background.

## Mobile

- Logo at 20px.
- Glass `Menu` pill at the top-right.
- Full-screen mobile menu with close control and social links.

## Accessibility

- Native button for menu.
- `aria-expanded`, `aria-controls`, Escape close, focus-visible styles.
- External links include safe `rel` values.
