# Project Base

A clean Vite + React + TypeScript base for starting new frontend projects.

## Included

- Vite, React, TypeScript, and React Router
- Tailwind CSS v4 through the Vite plugin
- Strict TypeScript and ESLint flat config
- Vitest, Testing Library, and jsdom
- App shell with providers, routing, `ErrorBoundary`, and 404 page
- Fixed Node version through `.nvmrc`, `.node-version`, and `package.json#engines`
- `.editorconfig`, `.env.example`, and GitHub Actions CI

## Local setup

```bash
nvm use
npm install
npm run dev
```

Create a local `.env` when a project needs environment values:

```bash
cp .env.example .env
```

## Scripts

```bash
npm run dev
npm run check
npm run build
npm run lint
npm run lint:fix
npm run test
npm run test:watch
npm run typecheck
npm run preview
```

## Source layout

```text
src/
  app/                 # app shell, providers, future routing setup
  assets/              # static assets imported by the app
  features/            # feature-first product modules
  shared/              # reusable cross-feature UI and utilities
  styles/              # global styles and design tokens
  main.tsx             # Vite entry
```

Feature modules should own their pages, local components, and static config:

```text
src/features/login/
  components/          # feature-only UI
  data/                # optional local static content/config
  LoginPage.tsx        # feature entry screen
  index.ts             # public export surface
```

Use `src/shared` only for code reused across multiple features.

## New Project Checklist

1. Rename `package.json#name`.
2. Update `<title>` in `index.html`.
3. Replace `public/favicon.svg`.
4. Update `VITE_APP_NAME` in `.env.example`.
5. Replace the neutral home page with the first real feature.
6. Run `npm run check` before the first commit.

## Notes

- This repo pins Node to `24.14.0`.
- `.npmrc` enables `engine-strict=true` so mismatched Node versions fail early.
- `@/` points to `src/` for cleaner imports.
- If `package-lock.json` is out of sync after dependency changes, run `npm install` once.
