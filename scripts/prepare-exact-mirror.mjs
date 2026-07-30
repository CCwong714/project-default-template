import { readFile, writeFile } from 'node:fs/promises'

const SOURCE_HTML = new URL(
  '../.clone-ui/source/raw-2026-07-30.html',
  import.meta.url,
)
const OUTPUT_HTML = new URL('../index.html', import.meta.url)
const ANALYTICS_ENABLED = 'gtag:{enabled:true'
const ANALYTICS_DISABLED = 'gtag:{enabled:false'
const ANALYTICS_ID = 'id:"G-7H4C5RTJQM"'
const LOCAL_ANALYTICS_ID = 'id:"LOCAL-MIRROR-DISABLED"'
const ANALYTICS_URL = 'url:"https://www.googletagmanager.com/gtag/js"'
const LOCAL_ANALYTICS_URL = 'url:"/analytics-disabled.js"'
const HEAD_MARKER = '<head>'
const LOCAL_ONLY_META =
  '<meta name="robots" content="noindex,nofollow"><meta name="referrer" content="strict-origin-when-cross-origin">'

const sourceHtml = await readFile(SOURCE_HTML, 'utf8')

if (!sourceHtml.includes('/_nuxt/CbdjwYMp.js')) {
  throw new Error(
    'The captured Noomo entry bundle is missing from source HTML.',
  )
}

const withoutAnalytics = sourceHtml
  .replace(ANALYTICS_ENABLED, ANALYTICS_DISABLED)
  .replace(ANALYTICS_ID, LOCAL_ANALYTICS_ID)
  .replace(ANALYTICS_URL, LOCAL_ANALYTICS_URL)
const localMirrorHtml = withoutAnalytics.replace(
  HEAD_MARKER,
  `${HEAD_MARKER}${LOCAL_ONLY_META}`,
)

await writeFile(OUTPUT_HTML, localMirrorHtml)
