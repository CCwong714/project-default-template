# Cocota Design Tokens

Target: `https://cocotastudio.com/`

## Core palette

- Canvas: `#FAFAFA`
- Ink: `#000000`
- Secondary text: `#757575`
- Muted text: `#A4A4A4`
- Lime interaction dot: `#9FF870`
- Branding card: `#ED0200`
- Web design card: `#2835F6`
- Footer: `#000000` on `#FAFAFA`

## Typography

- Family: Neue Haas Grotesk Display Pro, regular (`public/assets/cocota/grotesk.woff2`)
- Body: 16–24px, line-height 1.3
- Display XL: fluid 40.32px mobile to 168px large desktop, line-height .9
- Display L: fluid 40.32px mobile to 104px desktop, line-height 1.05
- Editorial copy: fluid 32.256px mobile to 64px desktop, line-height 1.05–1.1
- Labels: 13–17px, line-height 1.3

## Geometry

- Desktop page gutter: 20px at 1440px
- Mobile page gutter: 16px at 390px
- Desktop section spacing: 176–178px
- Mobile section spacing: 80–120px
- Desktop card radius: 32px
- Mobile card radius: 8px
- Pill radius: 999px
- Hairlines: 1px solid current color

## Motion

- Primary easing: `cubic-bezier(.55, 0, .1, 1)`
- Fast interaction: 450ms
- Section reveal: 600–900ms
- Large text reveal: clipped upward, 850–1200ms, deliberately staggered
- Image parallax: approximately 10% overscan with slow vertical translation
- Sprite cadence: stepped frame animation at 200ms per frame
- Respect `prefers-reduced-motion`; all content remains visible and readable.
