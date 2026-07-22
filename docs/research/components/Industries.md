# IndustriesAndClients Specification

## Overview
- **Target files:** `src/components/cocota/IndustriesSection.tsx`, `src/components/cocota/client-data.ts`, `src/app/globals.css`
- **Original section:** `https://cocotastudio.com/` `.home_ind`
- **User reference:** `Screen Recording 2026-07-21 at 16.28.51.mov`
- **Interaction model:** filter buttons plus previous/next-button-controlled infinite carousel; cards have pointer hover media

## DOM Structure
- The section contains the `THEY TRUST US` heading, introductory heading/year, nine industry filters, the `OUR CLIENTS` heading with two arrow buttons, and a clipped carousel.
- The carousel viewport is not a native horizontal scroll container.
- The track renders one dataset copy before and after the real items for seamless looping.
- Each card contains a text layer and an absolutely positioned hover-media layer with one background image/video and one pointer-following logo.

## Original Data
- All Industries: `38` clients.
- Consulting: `6` — Valora, Rubicom, Sincro, Finect, Albidania, ICEX.
- Culture: `8` — AHEC, Juventud Madrid, Museo del Traje, Kinépolis, Pichiavo, Sexy Zebras, Creative Europe, Oros.
- Fashion & Beauty: `7` — Wild, Avolta, Havaianas, Loewe, Museo del Traje, Quintussa, Círculo.
- Hospitality: `3` — Crustó, Dame la Brasa, Sal de Hierbas Encantada.
- Impact: `10` — Fiet, RPA, Wild, Sedra, Valora, UNICEF, Círculo, ICEX, Oros, Kubuka.
- Tech: `8` — Amadeus, Madrid and Beyond, Room Mate Hotels, Faster Displays, Finect, Musotoku, Albidania, Sponswatch.
- Travel: `6` — Amadeus, Madrid and Beyond, Room Mate Hotels, Avolta, Albidania, Oros.
- Other: `5` — Wild, El Corte Inglés Seguros, Gloss & Raffles, Ursa, Enresa.

## Desktop Computed Styles at 1920 × 929

### Filters and heading
- content width: `1872px` with `24px` page gutters
- filter gap: `8px`
- filter padding: `8px 16px`
- filter radius: `120px`
- filter font: `24px / 31.2px`
- selected filter border: `1px solid #000`
- heading border top: `1px solid #000`
- heading padding: `24px 0`
- arrow gap: `32px`

### Carousel
- top margin: `32px`
- visible slides: `3.45`
- gap: `24px`
- slide width: `525.5625px`
- measured movement step: `549.5625px`
- card min-height: `470px`
- card padding: `47px 32px`
- card radius: `32px`
- title min-height: `64px`
- label margin top: `24px`; font: `17px / 22.1px`
- description margin top: `28px`; right padding: `32px`; font: `24px / 31.2px`

## States and Behaviors

### Horizontal input
- Wheel/trackpad horizontal input must not move the track.
- Do not use `overflow-x: auto`, native momentum scrolling, or scroll snapping.
- Keep `touch-action: pan-y` so vertical page scrolling remains available.

### Previous/next buttons
- Each click moves exactly one card.
- Transition: `transform 400ms cubic-bezier(.25, 1, .5, 1)`.
- Do not lock the controls during the `400ms` movement. Every rapid click advances the target by one card and retargets the active transform from its current interpolated position.
- A sequence of rapid clicks therefore remains continuous; only clone-boundary resets and filter swaps temporarily reject input.
- Both directions loop forever; crossing a clone boundary resets to the equivalent middle-copy position without a visible transition.

### Filtering
- Selected pill changes immediately.
- Existing carousel fades to opacity `0` over `600ms` with `power2.inOut` (`cubic-bezier(.645, .045, .355, 1)`).
- Replace the dataset and reset the carousel to its first real item while hidden.
- New content fades to opacity `1` over `600ms` with the same easing.
- Preserve the category-specific ordering listed above.

### Card hover
- Hover media layer: opacity `0 → 1` over `600ms cubic-bezier(.55, 0, .1, 1)`.
- Text layer: opacity `1 → 0` using the same transition.
- Logo is `130px` wide, `50%` opaque, centered under the pointer with `translate(-50%, -50%)`.
- Pointer following uses a `600ms` `power3` interpolation.
- Mobile hides the hover-media layer.

### Filter hover
- Every filter label contains a real and duplicate text line in a clipped button.
- The two lines are separated vertically; hover/focus moves the label track by `translateY(-1.6em)`.
- Transition: `transform 450ms cubic-bezier(.55, 0, .1, 1)`.
- At `1920px`, the measured movement is `-38.4px`.

## Responsive Behavior
- Desktop: `3.45` slides per view; `24px` gap.
- Tablet: `1.8` slides per view; `24px` gap.
- Mobile: `1.1` slides per view; `16px` gap; filter row remains horizontally scrollable, but the client carousel does not.

## Assets
- `35` hover images, `3` hover videos, `38` SVG logos, and one shared video poster are stored under `public/assets/cocota/clients/`.
- The extraction/download manifest is `scripts/download-cocota-client-assets.mjs`.
