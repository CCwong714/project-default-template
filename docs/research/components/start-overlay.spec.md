# StartOverlay Specification

## Overview

- Target: `src/features/storytelling/components/StartOverlay.tsx`
- Evidence: source initial/top screenshots
- Interaction model: load + click/tap

## Desktop

Show the hero immediately after loading and a compact glass “Click to start” pill.

## Mobile

Show a centered “Tap to explore” glass capsule.

## Behavior

The user gesture starts audio, marks the experience as started, and enables the
scroll cue. It must remain usable if audio rejects playback.
