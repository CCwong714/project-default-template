# AboutWordReveal Specification

## Overview
- **Target files:** `src/components/cocota/AboutSection.tsx`, `src/components/cocota/useCocotaMotion.ts`, `src/app/globals.css`
- **User reference:** `Screen Recording 2026-07-21 at 14.36.15.mov`
- **Original section:** `https://cocotastudio.com/` `.home_about`
- **Interaction model:** scroll-triggered word reveal; title and body copy trigger independently

## DOM Structure
- About section remains in normal document flow.
- The kicker/title is one reveal target containing individually masked words.
- The large paragraph is a second reveal target containing individually masked words.
- Every mask keeps real inter-word whitespace in the DOM so copied/selected text does not collapse into one concatenated string.
- Service cards keep their existing reveal behavior under a separate `data-reveal` target.

## Computed Styles From Original

### Kicker/title
- font size at the inspected desktop viewport: `19.2917px` (project equivalent: `2.4rem`)
- line height: `25.0792px`
- text transform: uppercase
- line/mask overflow: hidden
- initial word transform: `translateY(130%) rotate(5deg)`
- final word transform: `translateY(0) rotate(0deg)`

### Large body copy
- font size at the inspected desktop viewport: `51.4444px` (project equivalent: `6.4rem`)
- line height: `56.5889px` (`1.1`)
- line/mask overflow: hidden
- initial word transform: `translateY(130%) rotate(5deg)`
- final word transform: `translateY(0) rotate(0deg)`

## States & Behaviors

### Trigger model
- Original uses a separate observer marker for title and body copy.
- Each marker is positioned `25vh` below its target's top and fires when it enters the viewport.
- Equivalent trigger: reveal a target when its own top crosses approximately `75vh`.
- Title and body must not inherit an early `inview` class from the entire About section.
- Each target animates once.

### Word motion
- Duration: `900ms` per word.
- Easing: GSAP `power2.inOut`, represented by existing project token `--intro-power2: cubic-bezier(.645, .045, .355, 1)`.
- Stagger: `50ms` per word, resetting at the start of every visually wrapped line.
- Opacity remains `1`; the reveal is produced by overflow clipping plus transform, not fading.
- Transform origin uses the normal center origin, matching the original computed style.

### Responsive line handling
- Word delays must be derived from each word mask's layout `offsetTop`, so the 50ms stagger resets correctly after responsive line wrapping.
- Recompute line indexes on resize before an unrevealed target animates.

### Reduced motion
- Words render immediately at the final transform with no transition.

## Assets
- N/A.

## Text Content
- Title: `A DESIGN AGENCY FOR BRAND (R)EVOLUTION`
- Copy: `Cocota is a creative partner offering integrated design solutions that explore the digital-branding nexus. We extract beauty from purpose to get your company higher, your vision farther, and your impact harder.`

## Responsive Behavior
- **Desktop:** title is normally one line; copy wraps to several large-text lines. Apply 50ms stagger independently per visual line.
- **Tablet:** derive visual lines from layout rather than hard-coded nth-child groups.
- **Mobile:** same 130%/5deg reveal and 900ms/50ms rhythm at the existing mobile font sizes.
