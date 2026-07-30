# Oryzo clone notes

This workspace contains a local fidelity mirror of the public production build at
<https://oryzo.ai/>. Run `npm run dev` and open the project root.

## Rebuild the mirror

1. `node scripts/download-oryzo-assets.mjs`
2. `node scripts/prepare-oryzo-mirror.mjs`

The final preparation step removes the Cloudflare Insights beacon and writes the
captured page to the root `index.html`. The nested `public/oryzo/index.html`
copy is evidence only; the runtime must execute at `/` because its route manager
is pathname-sensitive.

`scripts/import-oryzo-assets.mjs` is an optional browser-capture importer. Pass
an absolute asset-manifest path when using it:

`node scripts/import-oryzo-assets.mjs /absolute/path/to/manifest.json`

## Provenance and publishing

- The public `lusionltd/ORYZO-1` repository contains the MIT-licensed OBJ model
  checkpoints and paper, not the website source.
- The site design, copy and production bundle belong to Lusion. This mirror is
  suitable as a private/local implementation reference. Obtain permission
  before publishing or commercially reusing an exact copy.
- Adobe Typekit Halyard stays remote because its font binaries are licensed.
- Vimeo and Mailchimp remain external integrations. Cloudflare analytics is
  intentionally removed.

## Generated-code exceptions

`public/`, `.clone-ui/source/`, and `.clone-ui/qa/` contain captured production
output or generated evidence and are deliberately excluded from author-code
formatting and linting. Authored TypeScript and `scripts/*.mjs` enforce
`no-nested-ternary`; TypeScript also rejects explicit `any` and `unknown`.
