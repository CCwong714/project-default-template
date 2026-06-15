---
name: src-root-imports
description: Enforce a project convention that internal imports must not use relative paths starting with ./ or ../ and must instead start with src/. Use when creating, editing, reviewing, or refactoring TypeScript, JavaScript, React, or frontend code in projects where the user says imports cannot use ./ and must start from src.
---

# Src Root Imports

## Workflow

1. Inspect the project's import alias configuration before changing paths:
   - Check `tsconfig*.json` for `baseUrl` and `paths`.
   - Check bundler config such as `vite.config.ts`, `webpack.config.*`, or `next.config.*` if imports must run in the browser/build tool.
2. Ensure `src/...` imports are supported by both TypeScript and the runtime/bundler before relying on them. If the project only has another alias such as `@`, add or request the missing `src` alias when needed for the user's convention.
3. Convert project-internal relative imports to paths that begin with `src/`.
   - Use imports like `src/features/home/homePageData`.
   - Do not substitute `@/`, `~/`, or package-style aliases for `src/` unless the user explicitly changes the convention.
4. Do not rewrite external package imports, Node built-ins, URL imports, or intentionally relative non-code assets unless the project convention covers them.
5. Keep type-only imports type-only and preserve side-effect imports.
6. After moving or creating files, update imports in touched files so no project-internal import starts with `./` or `../`.
7. Run the smallest relevant validation, usually `typecheck`, `lint`, or the existing import-sort command.

## Conversion Rules

Use the current file's location to resolve each relative import to an absolute path under `src`, then express it as a `src/...` import.

```ts
import { env } from '../../shared/lib/env'
import { homePageData } from './homePageData'
```

becomes:

```ts
import { env } from 'src/shared/lib/env'
import { homePageData } from 'src/features/home/homePageData'
```

## Guardrails

- Do not leave project-internal imports as `@/...`, `./...`, or `../...` when applying this convention.
- Do not assume `src/...` works at runtime just because TypeScript accepts it; verify or add bundler support.
- Do not change runtime behavior, exported names, file extensions, or import ordering beyond what the formatter/linter requires.
- Do not rewrite same-directory CSS/module/asset imports if the build setup expects relative URLs, unless the user explicitly includes them in the convention.
- If a path would leave `src`, keep it relative or ask for direction because it is outside the src-root convention.

## Output Style

Report that `src/...` imports were applied and which files were touched. Mention validation results and any alias config that was added, missing, or assumed.
