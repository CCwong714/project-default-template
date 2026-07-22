# Cocota Studio Clone

This repository is now a working Next.js 16 reconstruction of [cocotastudio.com](https://cocotastudio.com/), installed on top of [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template).

The page includes the original visual language and public site assets used for the study build: custom type, responsive hero, animated team sprite sheets, sticky showreel, scroll reveals, service cards, news rail, asymmetric work grid, client filtering, awards composition, studio facts, and responsive footer.

## Run locally

Requirements: Node.js 24+ and pnpm 11+.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
```

The project scripts use webpack so the build does not depend on Turbopack spawning a separate system Node binary.

## Clone another site later

The template’s agent instructions and synchronized cloning skill remain installed in this repository. Start a new Codex task and request a clone with a target URL; the globally installed `clone-website`, `playwright`, and `screenshot` skills will be available after Codex restarts the task context.

Research notes are in [`docs/research`](docs/research), and target/local reference screenshots are in [`docs/design-references/cocotastudio.com`](docs/design-references/cocotastudio.com).

## Ownership note

The Cocota name, copy, imagery, video, and design remain the property of their respective owner. This reconstruction is intended as an authorized migration, prototyping, or learning base—not for deceptive impersonation.
