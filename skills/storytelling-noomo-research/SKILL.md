---
name: storytelling-noomo-research
description: Inspect and maintain evidence for the Noomo digital storytelling clone. Use when re-checking the source site, extracting assets or computed styles, updating the page topology, documenting desktop/mobile behavior, or resolving a mismatch whose source truth is unclear.
---

# Noomo Story Research

1. Read `docs/research/SOURCE_ANALYSIS.md`, `PAGE_TOPOLOGY.md`,
   `BEHAVIORS.md`, and `DESIGN_TOKENS.md`.
2. Open the source in a real browser at 1440 × 1000 and 390 × 844.
3. Wait for the loader, trigger the start gesture, then scroll before clicking
   anything else.
4. Record every finding from observable DOM, computed style, loaded resources,
   screenshots, or runtime signatures. Mark tuned estimates explicitly.
5. Store screenshots in `docs/design-references/` and specifications in
   `docs/research/components/`.
6. Keep source-derived assets isolated under `public/assets/noomo/`.
7. Update the research docs before changing code when the evidence changes.

Read `references/evidence-contract.md` before a new extraction pass.
