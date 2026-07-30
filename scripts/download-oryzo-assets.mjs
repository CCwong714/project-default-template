import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url))
const PUBLIC_ROOT = join(PROJECT_ROOT, 'public')
const SOURCE_ORIGIN = 'https://oryzo.ai'

const requiredPaths = [
  '/_astro/SplatsWorker-DSMxtdkh.js',
  '/_astro/splat_sorter_bg-BfJrILzx.wasm',
  '/fonts/msdf/Inter.json',
  '/fonts/msdf/Inter.webp',
  '/meta/apple-touch-icon.png',
  '/meta/favicon-96x96.png',
  '/meta/favicon.ico',
  '/meta/favicon.svg',
  '/meta/og_image.png',
  '/meta/site.webmanifest',
  '/models/BARK.buf',
  '/models/COASTER_FLIP_ANIM.buf',
  '/models/COFFEE_BEAN.buf',
  '/models/coaster.buf',
  '/models/coaster_hero_animation.buf',
  '/models/featuresAnimations/CAMERA_ANIM.buf',
  '/models/featuresAnimations/COASTER_ANIM.buf',
  '/models/featuresAnimations/COFFEE_ANIM.buf',
  '/models/hand.buf',
  '/models/hand_animation.buf',
  '/models/hero_camera.buf',
  '/models/stack_camera.buf',
  '/models/sustainability_text.buf',
  '/models/sustainability_text_outline.buf',
  '/models/table/COFFEE/COVER.buf',
  '/models/table/COFFEE/CUP.buf',
  '/models/table/COFFEE/LABEL.buf',
  '/models/table/DESK.buf',
  '/models/table/PINBOARD.buf',
  '/models/table/TRAY_COVERS.buf',
  '/models/table/WALL.buf',
  '/models/table/water_bear.buf',
  '/models/wearable/coaster_first.buf',
  '/models/wearable/condom_back.buf',
  '/models/wearable/condom_front.buf',
  '/privacy_policy.pdf',
  '/rive/oryzo.riv',
  '/splats/props.sog',
  '/splats/table_reflection.sog',
  '/terms_and_conditions.pdf',
]

const inputFiles = [
  '.clone-ui/source/raw.html',
  '.clone-ui/source/index.TL6TuoJb.css',
  '.clone-ui/source/hoisted.CRsATKbF.js',
  '.clone-ui/source/SplatsWorker-DSMxtdkh.js',
]
const assetPattern =
  /\/(?:_astro|fonts|images|meta|models|rive|splats|textures)\/[^"'`()<>\\\s,;]+?\.(?:avif|buf|css|ico|js|json|mp4|png|riv|sog|svg|wasm|webmanifest|webp|woff2)/g
const discoveredPaths = new Set(requiredPaths)

for (const inputFile of inputFiles) {
  const source = await readFile(join(PROJECT_ROOT, inputFile), 'utf8')

  for (const assetPath of source.match(assetPattern) ?? []) {
    if (!assetPath.includes('${')) {
      discoveredPaths.add(assetPath)
    }
  }
}

const pathsToDownload = [...discoveredPaths].sort()
const failures = []
let downloadedCount = 0

for (const assetPath of pathsToDownload) {
  const destination = join(PUBLIC_ROOT, assetPath)

  try {
    const response = await fetch(new URL(assetPath, SOURCE_ORIGIN))

    if (!response.ok) {
      failures.push(`${response.status} ${assetPath}`)
      continue
    }

    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, new Uint8Array(await response.arrayBuffer()))
    downloadedCount += 1
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    failures.push(`${message} ${assetPath}`)
  }
}

console.log(
  `Downloaded ${downloadedCount}/${pathsToDownload.length} Oryzo assets.`,
)

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
}
