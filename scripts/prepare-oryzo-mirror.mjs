import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url))
const SOURCE_HTML = join(PROJECT_ROOT, '.clone-ui/source/raw.html')
const OUTPUT_HTML = join(PROJECT_ROOT, 'index.html')
const ARCHIVE_HTML = join(PROJECT_ROOT, 'public/oryzo/index.html')
const CLOUDFLARE_BEACON =
  /<script defer src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js"[^>]*><\/script>/

const sourceHtml = await readFile(SOURCE_HTML, 'utf8')
const localHtml = sourceHtml
  .replace(CLOUDFLARE_BEACON, '')
  .replace(
    '<head>',
    '<head><!-- Local fidelity reference generated from the public Oryzo production build. -->',
  )

await mkdir(dirname(ARCHIVE_HTML), { recursive: true })
await writeFile(OUTPUT_HTML, localHtml)
await writeFile(ARCHIVE_HTML, localHtml)

console.log('Prepared the root Oryzo mirror without third-party analytics.')
