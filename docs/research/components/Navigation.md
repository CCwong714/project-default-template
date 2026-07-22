# Navigation

## Overview

- **Target file:** `src/components/cocota/Navigation.tsx`
- **Interaction model:** scroll-direction-driven visibility, pointer hover, and click-driven mobile menu

## Desktop behavior

- The fixed navigation bar is about `66.33px` high with a `#fafafa` background.
- At the top it is visible in the expanded brand state.
- Below the first `90px`, the left brand condenses to the CCT mark.
- Downward scrolling beyond the top threshold hides the entire bar with `translateY(-100%)`.
- Upward scrolling immediately restores the bar with its solid `#fafafa` background.
- Hide/show transition: `transform 0.6s cubic-bezier(0.55, 0, 0.1, 1)`.
- The direction-driven transform belongs to an inner navigation bar so it does not conflict with the outer Loading entrance animation.

## Responsive behavior

- Desktop shows the brand, primary links, talk pill, and language selector.
- Mobile shows the CCT mark, talk pill, and menu button.
- Opening the mobile menu forces the bar visible, switches its controls to off-white, and locks body scrolling.
