# Cocota Behaviors

## Navigation

- Remains fixed above the page.
- Scroll direction controls visibility: downward scrolling hides the 66px bar above the viewport; upward scrolling restores it with a `#fafafa` background over 600ms using the site easing curve.
- The brand condenses to the CCT mark after 90px while the full bar visibility remains a separate state.
- Desktop service label exposes related service links on hover/focus.
- Mobile menu opens a full black panel and locks body scrolling.

## Scroll choreography

- First load is time-driven: a purple `#8536fc` loader rolls the white CCT mark in for 2 seconds, performs a two-part blink, and slides upward off-screen by 3.4 seconds.
- Once the loader clears, the main content fades in and the hero title reveals letter-by-letter from `translateY(120%)`; lines stagger by 150ms and letters by 20ms.
- The navigation follows 400ms after the hero begins, moving from `translateY(-100%)` with a 600ms entrance.
- Section headings start clipped and rise into place when their section enters view.
- Long editorial copy uses a deliberately slow, staggered word reveal.
- Service cards enter from 32px below with a small delay between cards.
- Work media uses vertical parallax inside clipped, rounded containers.
- Awards imagery rotates and translates around the wordmark as the scene crosses the viewport.
- Facts fade and rise together; values remain final and readable after entry.
- The footer begins one viewport early behind the final light section. Its compact desktop content stays sticky while the black canvas is revealed, and the footer bottom is the document scroll limit.

## Carousels and filters

- News and client rails support previous/next controls and native horizontal scrolling.
- News and client arrows accept rapid repeated presses by continuously retargeting the running transform; they do not impose a per-slide animation lock.
- Industry pills filter the client set without a page transition.
- Industry pill labels use the original two-copy vertical hover roll (`translateY(-1.6em)` over 450ms).
- Work cards reveal a “Go to case study” pill on hover/focus.

## Responsive differences

- Desktop showreel is sticky; mobile showreel is not.
- Desktop title sizes are viewport-based; mobile titles use roughly 40px.
- Work becomes a single column and hides supporting descriptions on mobile.
- Awards list becomes one column and indents the list by 64px.
- Footer call-to-action cards stack on mobile.
