import { access, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'

const PROJECT_ROOT = new URL('..', import.meta.url).pathname
const OUTPUT_DIR = join(PROJECT_ROOT, '.clone-ui/qa')
const SECTION_OUTPUT_DIR = join(OUTPUT_DIR, 'sections')
const LOCAL_URL = 'http://127.0.0.1:4173/'
const SOURCE_URL = 'https://oryzo.ai/'
const REUSE_SECTION_SCREENSHOTS = process.argv.includes(
  '--reuse-section-screenshots',
)
const SECTION_IDS = [
  'hero',
  'ai',
  'wearable',
  'features',
  'encryption',
  'grip',
  'sustainability',
  'testimonies',
  'social-content',
  'product',
  'open-weight',
  'footer',
]
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  {
    name: 'mobile',
    width: 375,
    height: 812,
    isMobile: true,
    hasTouch: true,
  },
]

await mkdir(SECTION_OUTPUT_DIR, { recursive: true })

const browser = await chromium.launch({ headless: true })
const failures = []
const report = {
  generatedAt: new Date().toISOString(),
  sourceUrl: SOURCE_URL,
  localUrl: LOCAL_URL,
  viewports: [],
  sourceViewports: [],
  sections: [],
  sectionScreenshotsReused: REUSE_SECTION_SCREENSHOTS,
  interactions: {},
  exploratory: {},
  failures,
}

const createContext = async (viewport, permissions = []) =>
  await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.isMobile ?? false,
    hasTouch: viewport.hasTouch ?? false,
    permissions,
  })

const attachDiagnostics = (page) => {
  const diagnostics = {
    consoleErrors: [],
    failedRequests: [],
    badResponses: [],
  }

  page.on('console', (message) => {
    if (message.type() === 'error') {
      diagnostics.consoleErrors.push({
        message: message.text(),
        url: message.location().url,
      })
    }
  })
  page.on('pageerror', (error) => {
    diagnostics.consoleErrors.push({
      message: error.message,
      url: page.url(),
    })
  })
  page.on('requestfailed', (request) => {
    diagnostics.failedRequests.push({
      url: request.url(),
      reason: request.failure()?.errorText ?? 'request failed',
    })
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      diagnostics.badResponses.push({
        url: response.url(),
        status: response.status(),
      })
    }
  })

  return diagnostics
}

const waitForExperience = async (page) => {
  await page.waitForFunction(
    () => {
      const preloader = document.querySelector('#preloader')
      return preloader && getComputedStyle(preloader).display === 'none'
    },
    undefined,
    { timeout: 90_000 },
  )
  await page.waitForTimeout(800)
}

const getMetrics = async (page) =>
  await page.evaluate(() => {
    const preloader = document.querySelector('#preloader')
    const mobileMenuButton = document.querySelector('#site-header-mobile-btn')
    const desktopNav = document.querySelector('#site-header-nav')
    const hero = document.querySelector('#hero')
    const styleSnapshot = (element) => {
      if (!element) {
        return null
      }

      const style = getComputedStyle(element)
      return {
        display: style.display,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
        transform: style.transform,
        visibility: style.visibility,
      }
    }

    return {
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      document: {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        canScrollX:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      },
      title: document.title,
      sectionIds: Array.from(
        document.querySelectorAll('.section[id]'),
        (section) => section.id,
      ),
      canvasCount: document.querySelectorAll('canvas').length,
      heroText: hero?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 260),
      preloader: styleSnapshot(preloader),
      mobileMenuButton: styleSnapshot(mobileMenuButton),
      desktopNav: styleSnapshot(desktopNav),
    }
  })

const reportPath = (filename) => `.clone-ui/qa/${filename}`
const screenshotPath = (filename) => join(OUTPUT_DIR, filename)

const addViewportFailures = (label, metrics, diagnostics) => {
  if (metrics.title !== 'ORYZO AI') {
    failures.push(`${label}: unexpected title ${metrics.title}`)
  }
  if (metrics.canvasCount !== 6) {
    failures.push(`${label}: expected 6 canvases, got ${metrics.canvasCount}`)
  }
  if (metrics.preloader?.display !== 'none') {
    failures.push(`${label}: preloader did not settle`)
  }
  if (metrics.document.canScrollX) {
    failures.push(`${label}: unexpected horizontal overflow`)
  }
  if (JSON.stringify(metrics.sectionIds) !== JSON.stringify(SECTION_IDS)) {
    failures.push(`${label}: section topology differs from the evidence map`)
  }
  if (diagnostics.consoleErrors.length > 0) {
    failures.push(`${label}: console errors detected`)
  }
  if (diagnostics.badResponses.length > 0) {
    failures.push(`${label}: HTTP error responses detected`)
  }

  const unexpectedFailures = diagnostics.failedRequests.filter((request) => {
    const isWearableVideo = /wearable-gallery\/(?:bite|yoga)\.mp4$/.test(
      request.url,
    )
    const isCancelled = request.reason === 'net::ERR_ABORTED'
    return !(isWearableVideo && isCancelled)
  })

  if (unexpectedFailures.length > 0) {
    failures.push(`${label}: unexpected failed requests detected`)
  }
}

const retainedLocalContext = await createContext(VIEWPORTS[0])
const retainedLocalPage = await retainedLocalContext.newPage()
const retainedLocalDiagnostics = attachDiagnostics(retainedLocalPage)
await retainedLocalPage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' })
await waitForExperience(retainedLocalPage)

for (const viewport of VIEWPORTS) {
  await retainedLocalPage.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  })
  await retainedLocalPage.waitForTimeout(1000)

  const metrics = await getMetrics(retainedLocalPage)
  const filename = `local-${viewport.width}x${viewport.height}.png`
  await retainedLocalPage.screenshot({ path: screenshotPath(filename) })

  report.viewports.push({
    name: viewport.name,
    screenshotPath: reportPath(filename),
    metrics,
    ...retainedLocalDiagnostics,
  })
  addViewportFailures(
    `local ${viewport.name}`,
    metrics,
    retainedLocalDiagnostics,
  )
}

await retainedLocalPage.setViewportSize({
  width: VIEWPORTS[0].width,
  height: VIEWPORTS[0].height,
})
await retainedLocalPage.waitForTimeout(1000)

const retainedSourceContext = await createContext(VIEWPORTS[0])
const retainedSourcePage = await retainedSourceContext.newPage()
const retainedSourceDiagnostics = attachDiagnostics(retainedSourcePage)
await retainedSourcePage.goto(SOURCE_URL, {
  waitUntil: 'domcontentloaded',
})
await waitForExperience(retainedSourcePage)

for (const viewport of VIEWPORTS) {
  await retainedSourcePage.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  })
  await retainedSourcePage.waitForTimeout(1000)

  const metrics = await getMetrics(retainedSourcePage)
  const filename = `source-${viewport.width}x${viewport.height}.png`
  await retainedSourcePage.screenshot({ path: screenshotPath(filename) })

  report.sourceViewports.push({
    name: viewport.name,
    screenshotPath: reportPath(filename),
    metrics,
    ...retainedSourceDiagnostics,
  })

  if (metrics.preloader?.display !== 'none') {
    failures.push(`source ${viewport.name}: preloader did not settle`)
  }
  if (metrics.document.canScrollX) {
    failures.push(`source ${viewport.name}: unexpected horizontal overflow`)
  }
}

await retainedSourcePage.setViewportSize({
  width: VIEWPORTS[0].width,
  height: VIEWPORTS[0].height,
})
await retainedSourcePage.waitForTimeout(1000)

for (const viewport of VIEWPORTS) {
  const localResult = report.viewports.find(
    (entry) => entry.name === viewport.name,
  )
  const sourceResult = report.sourceViewports.find(
    (entry) => entry.name === viewport.name,
  )
  const localHero = localResult?.metrics.heroText?.toLowerCase()
  const sourceHero = sourceResult?.metrics.heroText?.toLowerCase()

  if (localHero !== sourceHero) {
    failures.push(`${viewport.name}: source/local hero copy differs`)
  }
}

const localSectionContext = retainedLocalContext
const localSectionPage = retainedLocalPage
const localSectionDiagnostics = retainedLocalDiagnostics

const sourceSectionContext = retainedSourceContext
const sourceSectionPage = retainedSourcePage

for (const sectionId of SECTION_IDS) {
  const localOffset = await localSectionPage
    .locator(`#${sectionId}`)
    .evaluate((element) => element.offsetTop)
  const sourceOffset = await sourceSectionPage
    .locator(`#${sectionId}`)
    .evaluate((element) => element.offsetTop)

  await Promise.all([
    localSectionPage.evaluate(
      (offset) => window.scrollTo(0, offset),
      localOffset,
    ),
    sourceSectionPage.evaluate(
      (offset) => window.scrollTo(0, offset),
      sourceOffset,
    ),
  ])
  await Promise.all([
    localSectionPage.waitForTimeout(1000),
    sourceSectionPage.waitForTimeout(1000),
  ])

  const localFilename = `sections/local-${sectionId}.png`
  const sourceFilename = `sections/source-${sectionId}.png`
  if (REUSE_SECTION_SCREENSHOTS) {
    await Promise.all([
      access(screenshotPath(localFilename)),
      access(screenshotPath(sourceFilename)),
    ])
  } else {
    await Promise.all([
      localSectionPage.screenshot({ path: screenshotPath(localFilename) }),
      sourceSectionPage.screenshot({ path: screenshotPath(sourceFilename) }),
    ])
  }

  const localText = await localSectionPage
    .locator(`#${sectionId}`)
    .innerText()
    .then((text) => text.replace(/\s+/g, ' ').trim())
  const sourceText = await sourceSectionPage
    .locator(`#${sectionId}`)
    .innerText()
    .then((text) => text.replace(/\s+/g, ' ').trim())

  report.sections.push({
    id: sectionId,
    localOffset,
    sourceOffset,
    localScreenshotPath: reportPath(localFilename),
    sourceScreenshotPath: reportPath(sourceFilename),
    copyMatches: localText.toLowerCase() === sourceText.toLowerCase(),
  })

  if (localText.toLowerCase() !== sourceText.toLowerCase()) {
    failures.push(`${sectionId}: source/local section copy differs`)
  }
}

if (localSectionDiagnostics.consoleErrors.length > 0) {
  failures.push('local section pass: console errors detected')
}
if (localSectionDiagnostics.badResponses.length > 0) {
  failures.push('local section pass: HTTP errors detected')
}
await Promise.all([localSectionContext.close(), sourceSectionContext.close()])

const interactionContext = await createContext(VIEWPORTS[0], [
  'clipboard-read',
  'clipboard-write',
])
const interactionPage = await interactionContext.newPage()
const interactionDiagnostics = attachDiagnostics(interactionPage)
await interactionPage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' })
await waitForExperience(interactionPage)

await interactionPage.locator('#hero-video-wrapper').click()
await interactionPage.waitForTimeout(1800)
report.interactions.videoOverlay = await interactionPage
  .locator('#video-overlay')
  .evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      opacity: Number.parseFloat(style.opacity),
      pointerEvents: style.pointerEvents,
    }
  })
await interactionPage.screenshot({
  path: screenshotPath('interaction-video-overlay.png'),
})
await interactionPage.mouse.click(24, 24)
await interactionPage.waitForTimeout(1200)
report.interactions.videoOverlayClosed = await interactionPage
  .locator('#video-overlay')
  .evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity))

await interactionPage.locator('a[href="#features"]').first().click()
await interactionPage.waitForTimeout(2200)
report.interactions.featuresNavigation = {
  featureBounds: await interactionPage.locator('#features').boundingBox(),
  headerFeaturesClass: await interactionPage
    .locator('#site-header-nav [data-id="features"]')
    .getAttribute('class'),
}
await interactionPage.screenshot({
  path: screenshotPath('interaction-features.png'),
})

await interactionPage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' })
await waitForExperience(interactionPage)

const productGeometry = await interactionPage
  .locator('#product')
  .evaluate((element) => ({
    height: element.offsetHeight,
    offset: element.offsetTop,
  }))
await interactionPage.evaluate(
  (offset) => window.scrollTo(0, offset),
  productGeometry.offset + productGeometry.height / 3,
)
await interactionPage.waitForTimeout(1800)
const proMaxOption = interactionPage.locator(
  '#product-hero-option-oryzo-pro-max',
)
await proMaxOption.click()
await interactionPage.waitForTimeout(700)
report.interactions.productSelector = {
  selectedClass: await proMaxOption.getAttribute('class'),
}
await interactionPage.screenshot({
  path: screenshotPath('interaction-product-pro-max.png'),
})

const footerOffset = await interactionPage
  .locator('#footer')
  .evaluate((element) => element.offsetTop)
await interactionPage.evaluate(
  (offset) => window.scrollTo(0, offset),
  footerOffset,
)
await interactionPage.waitForTimeout(1800)
await interactionPage.locator('#footer-love button').click()
report.interactions.copyUrl = {
  clipboardText: await interactionPage.evaluate(
    async () => await navigator.clipboard.readText(),
  ),
}

const newsletterInput = interactionPage.locator('#footer-email-input')
await newsletterInput.fill('not-an-email')
await interactionPage.locator('#footer-email-btn').click()
report.interactions.newsletterValidation = await newsletterInput.evaluate(
  (element) => ({
    invalid: element.matches(':invalid'),
    validationMessage: element.validationMessage,
  }),
)

if ((report.interactions.videoOverlay.opacity ?? 0) <= 0) {
  failures.push('interaction: video overlay did not open')
}
if (report.interactions.videoOverlayClosed > 0.001) {
  failures.push('interaction: video overlay did not close')
}
if (
  !report.interactions.featuresNavigation.headerFeaturesClass?.includes(
    'is-active',
  )
) {
  failures.push('interaction: Features navigation did not activate')
}
if (!report.interactions.productSelector.selectedClass?.includes('is-active')) {
  failures.push('interaction: Pro Max product option did not activate')
}
if (!report.interactions.copyUrl.clipboardText) {
  failures.push('interaction: Copy URL did not write to the clipboard')
}
if (
  !report.interactions.newsletterValidation.invalid ||
  !report.interactions.newsletterValidation.validationMessage
) {
  failures.push('interaction: newsletter validation feedback was not visible')
}
if (interactionDiagnostics.consoleErrors.length > 0) {
  failures.push('interaction pass: console errors detected')
}
if (interactionDiagnostics.badResponses.length > 0) {
  failures.push('interaction pass: HTTP errors detected')
}
await interactionContext.close()

const mobileContext = await createContext(VIEWPORTS[2])
const mobilePage = await mobileContext.newPage()
const mobileDiagnostics = attachDiagnostics(mobilePage)
await mobilePage.goto(LOCAL_URL, { waitUntil: 'domcontentloaded' })
await waitForExperience(mobilePage)
const menuButton = mobilePage.locator('#site-header-mobile-btn')
await menuButton.tap()
await mobilePage.waitForTimeout(900)
report.interactions.mobileMenuOpen = await mobilePage
  .locator('#site-header-mobile-menu')
  .evaluate((element) => getComputedStyle(element).transform)
await mobilePage.screenshot({
  path: screenshotPath('interaction-mobile-menu.png'),
})
await menuButton.tap()
await mobilePage.waitForTimeout(500)
report.interactions.mobileMenuClosed = await mobilePage
  .locator('#site-header-mobile-menu')
  .evaluate((element) => getComputedStyle(element).transform)

await mobilePage.reload({ waitUntil: 'domcontentloaded' })
await waitForExperience(mobilePage)
report.exploratory.mobileReload = await getMetrics(mobilePage)
if (
  report.interactions.mobileMenuOpen === report.interactions.mobileMenuClosed
) {
  failures.push('interaction: mobile menu did not change state')
}
if (report.exploratory.mobileReload.preloader?.display !== 'none') {
  failures.push('exploratory: mobile reload left the preloader visible')
}
if (mobileDiagnostics.consoleErrors.length > 0) {
  failures.push('mobile interaction pass: console errors detected')
}
await mobileContext.close()

const hashContext = await createContext(VIEWPORTS[0])
const hashPage = await hashContext.newPage()
const hashDiagnostics = attachDiagnostics(hashPage)
await hashPage.goto(`${LOCAL_URL}#features`, {
  waitUntil: 'domcontentloaded',
})
await waitForExperience(hashPage)
report.exploratory.hashDirect = {
  url: hashPage.url(),
  metrics: await getMetrics(hashPage),
}
if (hashDiagnostics.consoleErrors.length > 0) {
  failures.push('exploratory: hash-direct load produced console errors')
}
if (report.exploratory.hashDirect.metrics.preloader?.display !== 'none') {
  failures.push('exploratory: hash-direct load left the preloader visible')
}
await hashContext.close()

await browser.close()

await writeFile(
  join(OUTPUT_DIR, 'report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
)

if (failures.length > 0) {
  throw new Error(`Oryzo QA failed:\n- ${failures.join('\n- ')}`)
}

console.log(
  `Oryzo QA passed: ${VIEWPORTS.length} viewports, ${SECTION_IDS.length} source/local section states, and 8 interaction/exploratory flows.`,
)
