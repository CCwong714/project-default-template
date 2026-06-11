---
name: typescript-type-only
description: Use this skill when a project or codebase should enforce TypeScript type aliases instead of interface declarations, and when all type names must start with a capital T such as TUser or TApiResponse.
---

# TypeScript Type-Only Rule

Use this skill when working in a TypeScript project that follows two strict rules:

1. Never use `interface`.
2. Always name `type` aliases with a leading `T`.

## Rules

- Replace every `interface` with a `type` alias.
- New types must use names like `TUser`, `TButtonProps`, `TRequestPayload`, and `TApiResponse`.
- Do not create type aliases without the `T` prefix.
- When renaming a type, update all imports, exports, annotations, generics, and references consistently.

## Preferred Patterns

- Use `type` for object shapes.
- Use `type` for unions, intersections, mapped types, and function signatures.
- For React props, prefer names like `TProps`, `TButtonProps`, or `TModalProps`.
- For API models, prefer names like `TUserDto`, `TOrderItem`, or `TCreatePostRequest`.

## Refactor Guidance

- Convert `interface User { name: string }` to `type TUser = { name: string }`.
- Convert `interface Props extends BaseProps {}` to `type TProps = TBaseProps & {}`.
- If an existing non-prefixed alias appears, rename it to a `T`-prefixed form unless the user explicitly asks to preserve the old public API.

## Validation Checklist

- No `interface` declarations remain in the changed scope.
- All newly added or renamed type aliases start with `T`.
- References still compile after the rename.
- Exported type names stay consistent across files.

## Response Style

- When making edits, proactively normalize nearby TypeScript types to this convention if the change is low risk.
- If a rename would break a large public API, pause and call out the tradeoff before changing it broadly.
