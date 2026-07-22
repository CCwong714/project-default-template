# Cocota Intro Sequence Specification

## Overview

- **Target files:** `src/components/cocota/IntroLoader.tsx`, `src/components/cocota/HeroSection.tsx`, `src/components/cocota/CocotaHome.tsx`
- **Reference:** `Screen Recording 2026-07-20 at 16.00.12.mov` and the live `https://cocotastudio.com/` home page
- **Interaction model:** time-driven, once per hard page load

## DOM Structure

- A fixed full-viewport purple loader sits above the page.
- The loader contains the original white 262 × 262 CCT SVG mark.
- The page underneath contains the fixed navigation and the hero.
- Each hero title line owns a clipped text wrapper; every visible letter is a separate inline element.
- Sprite descriptions remain inside the existing green-dot hover tips. They do not stay expanded during the intro.

## Loading Sequence

- Loader: fixed, full viewport, `z-index: 1000`, background `#8536fc`.
- Desktop CCT mark width: `26rem`; portrait touch width: `12rem`.
- Initial CCT mark state: `opacity: .3`, `translateX(-70vw) rotate(-360deg)`.
- Mark entrance: `2s`, `power2.inOut`, ending at `translateX(0) rotate(0)`.
- Mark opacity: `.3 → 1` over `.45s`, `power2.inOut`.
- Outer circle: stroke dash offset completes over `.1s`.
- Blink 1: eye holder moves down `2.2rem` and vertical T stroke scales to `0` from `2s–2.3s`.
- Blink 2: eye holder returns and vertical T stroke scales back to `1` from `2.4s–2.7s`.
- Loader exit begins at `2.8s`; the entire layer translates to `-100%` over `.6s`, `power2.inOut`.
- Scrolling stays locked until the loader exit completes at `3.4s`.

## Hero and Navigation Entrance

- Desktop hero display words (`THOUGHTFUL`, `DESIGN FOR`, `SOULFUL`, `BRANDS`) use a fixed `151px` font size; the sprite descriptions keep their original small tooltip typography.
- Main content begins fading from `opacity: 0 → 1` at `3.4s`, duration `.6s`, `power4.inOut`.
- Sprite people and green dots appear through the main-content fade without a separate position tween.
- Every hero letter starts at `translateY(120%)` inside its clipped line wrapper.
- Each letter animates to `translateY(0)` over `.9s`, `power2.inOut`.
- Per-letter stagger: `.02s`.
- Per-line stagger: `.15s` (`THOUGHTFUL` 0, `DESIGN FOR` .15, `SOULFUL` .30, `BRANDS` .45).
- Navigation starts at `opacity: 0; translateY(-100%)` and enters at `3.8s` over `.6s`, `power4.out`.

## Responsive Behavior

- The same timing and letter stagger are used on desktop and mobile.
- Mobile uses the original `12rem` loader mark size.
- Hero line layout continues to follow the existing 800px breakpoint rules.
- With reduced motion enabled, the loader is skipped and all page content is shown immediately.
