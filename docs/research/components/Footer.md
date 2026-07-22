# Footer

## Overview

- **Target file:** `src/components/cocota/Footer.tsx`
- **Interaction model:** page-scroll-driven sticky footer reveal plus pointer hover on CTA cards
- Black canvas, off-white type, muted secondary text.

## Desktop structure and measurements

- The footer height is dynamic, not a fixed `vh` approximation. The live site writes `min-height: calc(<footer-content offsetHeight>px + 18rem + 100vh)` after measuring the sticky grid.
- At `1440 × 900`, the content is `809px` high and the footer is `1859px` high: `809 + 150 + 900`.
- At `1920 × 873`, the root font is capped at `10px`, the content is `965px` high and the footer is `2018px` high: `965 + 180 + 873`.
- The footer starts with `margin-top: -100vh` and ends exactly at the document scroll limit without trailing blank scroll space.
- The footer content is sticky at `top: 18rem` and is constrained by the footer bottom only near the end of the page.
- Sticky content uses a three-column grid with `2.4rem` column gaps and `7.2rem` row gaps.
- Grid rows are: `126px` title, `344px` primary content, `142px` contact/funding content, and `17px` legal row.
- `AT A GLANCE` is `16.8rem / .9`; this is `140px / 126px` at 1440px and `168px / 151.2px` at 1920px.
- Company/services occupy column 1 while both CTA cards occupy columns 2–3.
- Madrid/London occupy the first parent column; Follow us/Women Owned occupy the second; the EU funding note occupies the third. All remain in the same grid row.
- At `1920px`, the Women Owned source image renders at `86.66 × 35.73px` (`8.666rem` wide) with no CSS filter; the downloaded asset is already white on transparency.
- The funding emblem is the complete `64 × 55px` European Union mark (twelve stars, white frame, and the small `EUROPEAN UNION` wordmark), not a textual star placeholder.
- CTA cards are `344px` high, use `20px` padding and a `26.67px` radius. Default widths are equal.
- CTA headings are `53.33px / 56px`; supporting copy is `20px / 26px` and appears on hover.
- Section labels are `16px / 20.8px`; address copy is about `14.17px / 18.42px`; funding/legal copy is `13px / 16.9px`.
- The bottom legal content is a single horizontal row, not two stacked rows.
- The Next.js development indicator is disabled because its default bottom-left position covers the footer Home link during local visual review.

## Reveal behavior

- The footer sits behind the final light section.
- While the last section scrolls away, the black footer is progressively revealed.
- Once visible, the compact `809px` content remains sticky instead of continuing to move as ordinary page content.
- CSS provides `calc(200vh + 18rem)` as a pre-hydration fallback. Client-side measurement then replaces it with `calc(<content-height>px + 18rem + 100vh)`.
- There is no additional scroll after the footer bottom reaches the viewport bottom.

## Hover and focus behavior

### Copy-roll links

- Company, Services, Follow us, and the four legal-policy links use the shared two-copy vertical roll; they do not draw an underline.
- Each link clips a `1.3em`-high vertical track containing two identical, non-wrapping labels.
- Hover translates the track by `-1.3em` over `450ms` with `cubic-bezier(.55, 0, .1, 1)`.
- Company/Services and Follow us links use an `0.8rem` vertical gap between items. The first link begins after the heading's existing `0.8rem` bottom margin, with no second margin added.
- The current-page Home link, address/email links, and static footer text do not use the copy-roll treatment.
- The Madrid and London street lines link to their source Google Maps destinations in a new tab. Social links also open in a new tab and retain the source URLs.
- The address blocks use one `22.1px` line box per source line and a full empty line before the email/“Coming soon…” row. At `1920px`, the rows begin at approximately `695.9px`, `718px`, `740.1px`, and `762.2px` in the bottom-aligned footer viewport.

### CTA pair

- Both cards begin at equal `50%` widths with `#fafafa` backgrounds, black text, black `9rem` arrow circles, and hidden white supporting copy.
- Hovering anywhere in the CTA pair turns both cards `#eee`, keeps them black, and fades both arrow circles to `0` opacity.
- The directly hovered card changes to `width: 60%`, `#003223`, and `#fafafa`; its title underline grows left-to-right, its supporting copy fades to full opacity, and its arrow circle returns at full opacity with a `45deg` rotation, `#fafafa` background, and green arrow strokes.
- Card color, background, width, arrow opacity/rotation/background, arrow stroke, title underline, and copy opacity all transition over `450ms` with `cubic-bezier(.55, 0, .1, 1)`.
- CTA top rows vertically center the `6.4rem / 1.05` headings against the `9rem` circles. The Newsletter copy preserves the source line break after “know!”.
- The Let's talk sprite continues its seven-frame `1.4s steps(7)` loop and remains bottom-right while the card flexes.

### Non-hoverable elements

- `AT A GLANCE`, section labels, address/body copy, the Women Owned badge, and the funding note have no pointer-hover visual change.
- Newsletter uses the source Mailchimp URL. Its entire card remains the hover target; title underline, green expansion, rotated white arrow circle, and supporting copy all activate together.

## Responsive behavior

- Desktop uses the four-row, three-column composition above.
- Mobile resets explicit desktop grid rows, collapses to one column, stacks CTA cards and keeps the same dynamic height formula, `margin-top: -100vh`, and sticky `top: 18rem`.
- The source hover rules are gated by `(hover: hover)`; coarse/touch layouts keep CTA copy visible and do not depend on hover to expose information.
