import { copyFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_ROOT = join(PROJECT_ROOT, 'public')
const manifestArgument = process.argv[2]

if (!manifestArgument) {
  throw new Error(
    'Usage: node scripts/import-oryzo-assets.mjs /absolute/path/to/browser-asset-manifest.json',
  )
}

const bundleManifest = resolve(manifestArgument)
const manifest = JSON.parse(await readFile(bundleManifest, 'utf8'))
const sourceAssets = manifest.assets.filter(({ url }) =>
  url.startsWith('https://oryzo.ai/'),
)

for (const asset of sourceAssets) {
  const { pathname } = new URL(asset.url)
  const destination = join(PUBLIC_ROOT, pathname)

  await mkdir(dirname(destination), { recursive: true })
  await copyFile(asset.path, destination)
}

await copyFile(
  join(PROJECT_ROOT, '.clone-ui/source/index.TL6TuoJb.css'),
  join(PUBLIC_ROOT, '_astro/index.TL6TuoJb.css'),
)
await copyFile(
  join(PROJECT_ROOT, '.clone-ui/source/hoisted.CRsATKbF.js'),
  join(PUBLIC_ROOT, '_astro/hoisted.CRsATKbF.js'),
)

console.log(`Imported ${sourceAssets.length} source assets into public/.`)
