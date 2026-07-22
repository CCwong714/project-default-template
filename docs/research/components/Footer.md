# Footer

## Overview

- **Target file:** `src/components/cocota/Footer.tsx`
- **Interaction model:** page-scroll-driven sticky footer reveal plus pointer hover on CTA cards
- Black canvas, off-white type, muted secondary text.

## Desktop structure and measurements (1440 × 900)

- The footer is `1859px` high, starts with `margin-top: -100vh`, and ends exactly at the document scroll limit without trailing blank scroll space.
- The footer content is sticky at `top: 150px`; at the absolute page bottom it is constrained to `y: 64px` by the footer bottom.
- Sticky content is `809px` high and uses a three-column grid with `20px` column gaps and `60px` row gaps.
- Grid rows are: `126px` title, `344px` primary content, `142px` contact/funding content, and `17px` legal row.
- `AT A GLANCE` is `140px / 126px` and spans all three columns.
- Company/services occupy column 1 while both CTA cards occupy columns 2–3.
- Madrid/London occupy the first parent column; Follow us/Women Owned occupy the second; the EU funding note occupies the third. All remain in the same grid row.
- CTA cards are `344px` high, use `20px` padding and a `26.67px` radius. Default widths are equal.
- CTA headings are `53.33px / 56px`; supporting copy is `20px / 26px` and appears on hover.
- Section labels are `16px / 20.8px`; address copy is about `14.17px / 18.42px`; funding/legal copy is `13px / 16.9px`.
- The bottom legal content is a single horizontal row, not two stacked rows.

## Reveal behavior

- The footer sits behind the final light section.
- While the last section scrolls away, the black footer is progressively revealed.
- Once visible, the compact `809px` content remains sticky instead of continuing to move as ordinary page content.
- The footer scroll range is `calc(200vh + 7.2rem)` with `margin-top: -100vh`; there is no additional scroll after the footer bottom reaches the viewport bottom.

## Responsive behavior

- Desktop uses the four-row, three-column composition above.
- Mobile resets explicit desktop grid rows, collapses to one column, stacks CTA cards and retains the established mobile sticky scroll scene.
