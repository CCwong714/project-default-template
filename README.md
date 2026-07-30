# Oryzo AI local fidelity mirror

This project reproduces the public Oryzo experience at <https://oryzo.ai/> from
captured production output and locally mirrored public assets.

## Run

```bash
npm install
npm run dev
```

Open the root URL printed by Vite. The captured runtime must be served at `/`;
a nested pathname leaves its custom route manager in the preloader.

## Verify

```bash
npm run check
node scripts/qa-oryzo.mjs
```

The browser QA writes source/local screenshots and a failure-gated report to
`.clone-ui/qa/`.

See [NOTES.md](NOTES.md) for rebuilding, provenance, external dependencies, and
publishing constraints.
