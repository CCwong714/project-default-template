---
name: separate-hardcoded-data
description: Extract large hardcoded arrays, object literals, menu definitions, card lists, mock records, static copy, asset maps, and other non-behavioral data out of React/TypeScript components or similar UI files into a separate feature-local data/constants module. Use when a user asks to split hardcoded data into another file, clean up a component with embedded static data, or enforce the convention that hardcoded data should be separated and imported.
---

# Separate Hardcoded Data

## Workflow

1. Inspect the target file and identify static data declarations near the component: arrays, object literals, tuples, nav/menu lists, card content, option lists, image metadata, and mock records.
2. Leave behavior, hooks, render helpers, derived values, and component-local state in the component unless the user explicitly asks to move them.
3. Create or reuse a feature-local module for the data:
   - Prefer the same feature folder as the component.
   - Use names like `homePageData.ts`, `<componentName>Data.ts`, `constants.ts`, or `data.ts`, following nearby project conventions.
   - Avoid placing one feature's data in shared/global folders unless it is already consumed across features.
4. Export each moved data value by name and import it back into the component.
5. Preserve existing runtime behavior and types:
   - Keep `as const`, `satisfies`, explicit types, readonly tuples, and literal types.
   - Preserve item order, string values, URLs, asset paths, keys, and labels exactly.
   - Keep type-only imports as type-only imports.
6. Run the smallest relevant validation available, usually `typecheck` and `lint`; add tests only when the extraction changes a public contract or touches shared code.

## What To Move

Move data that is static and non-behavioral:

- Navigation links and menu definitions
- Locale/language option lists
- Feature cards, product cards, resource cards, sample items
- Mock API rows or fixture-like records embedded in UI files
- Asset path maps, image metadata, static titles/copy used by repeated UI
- Configuration-like constants that are not tightly coupled to hook logic

Keep code in place when moving it would obscure behavior:

- Hook logic, event handlers, refs, effects, memoized calculations
- Small one-off constants used only to make an expression clearer
- Values that depend on props, state, environment, or runtime APIs
- Helper functions that return JSX or manipulate the DOM

## Output Style

When reporting back, mention the new data file and the component import change. Keep it concise and include validation results. If unrelated dirty files already exist, do not stage, revert, or describe them unless they affect the extraction.
