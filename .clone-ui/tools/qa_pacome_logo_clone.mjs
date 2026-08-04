import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'

import { chromium } from 'playwright'

const CLONE_URL = 'http://127.0.0.1:5173/'
const OUTPUT_DIR = '.clone-ui/qa/pacome/logo-interaction'
const CHROME_PATH =
  '/Users/ccwong/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

async function enterExperience(page) {
  const quietEntry = page.getByRole('button', {
    exact: true,
    name: 'enter without sound',
  })
  await quietEntry.waitFor({ state: 'visible', timeout: 20_000 })
  await quietEntry.click()
  await page.locator('.site-logo').waitFor({ state: 'visible' })
}

async function inspectLogo(page) {
  const logo = page.locator('.site-logo')
  return {
    animationSvgCount: await logo.locator('.site-logo__animation svg').count(),
    ariaLabel: await logo.getAttribute('aria-label'),
    box: await logo.boundingBox(),
    innerBox: await logo.locator('.site-logo__animation').boundingBox(),
    style: await logo.evaluate((element) => {
      const computed = getComputedStyle(element)
      return {
        height: computed.height,
        left: computed.left,
        position: computed.position,
        top: computed.top,
        width: computed.width,
      }
    }),
  }
}

async function runDesktop(browser) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    viewport: { height: 900, width: 1440 },
  })
  const page = await context.newPage()
  const consoleErrors = []
  const faceRequests = []
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
  page.on('response', (response) => {
    if (/\/face[1345]\.json$/.test(response.url())) {
      faceRequests.push({ status: response.status(), url: response.url() })
    }
  })

  await page.goto(CLONE_URL, { waitUntil: 'domcontentloaded' })
  await enterExperience(page)
  const logo = page.locator('.site-logo')
  const animation = logo.locator('.site-logo__animation')
  await page.waitForTimeout(2100)
  await animation.screenshot({ path: `${OUTPUT_DIR}/clone-click-0-2000.png` })

  const labels = []
  for (let clickIndex = 1; clickIndex <= 4; clickIndex += 1) {
    const clickStartedAt = Date.now()
    await logo.click()
    labels.push(await logo.getAttribute('aria-label'))
    for (const elapsedMs of [90, 240, 750, 2000]) {
      const remainingMs = Math.max(elapsedMs - (Date.now() - clickStartedAt), 0)
      await page.waitForTimeout(remainingMs)
      await animation.screenshot({
        path: `${OUTPUT_DIR}/clone-click-${clickIndex}-${String(elapsedMs).padStart(4, '0')}.png`,
      })
    }
    assert.equal(await animation.locator('svg').count(), 1)
  }

  assert.deepEqual(labels, [
    'Change Pacôme logo expression (2 of 4)',
    'Change Pacôme logo expression (3 of 4)',
    'Change Pacôme logo expression (4 of 4)',
    'Change Pacôme logo expression (1 of 4)',
  ])

  let logoFocused = false
  for (let attempt = 0; attempt < 8; attempt += 1) {
    await page.keyboard.press('Tab')
    logoFocused = await logo.evaluate(
      (element) => document.activeElement === element,
    )
    if (logoFocused) {
      break
    }
  }
  assert.equal(logoFocused, true)
  const focusOutline = await logo.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  )
  assert.equal(focusOutline, 'solid')
  for (const key of ['Space', 'Enter', 'Space', 'Enter']) {
    await page.keyboard.press(key)
    await page.waitForTimeout(40)
  }
  assert.equal(
    await logo.getAttribute('aria-label'),
    'Change Pacôme logo expression (1 of 4)',
  )

  for (let clickIndex = 0; clickIndex < 6; clickIndex += 1) {
    await logo.click()
    await page.waitForTimeout(30)
  }
  await page.waitForTimeout(300)
  assert.equal(await animation.locator('svg').count(), 1)
  assert.equal(
    await logo.getAttribute('aria-label'),
    'Change Pacôme logo expression (3 of 4)',
  )

  const inspection = await inspectLogo(page)
  assert.equal(inspection.box?.width, 64)
  assert.equal(inspection.box?.height, 64)
  assert.equal(inspection.innerBox?.width, 64)
  assert.equal(inspection.innerBox?.height, 64)
  assert.equal(inspection.style.top, '30px')
  assert.equal(inspection.style.left, '30px')
  assert.equal(consoleErrors.length, 0)
  assert.ok(faceRequests.length >= 5)
  assert.ok(faceRequests.every((response) => response.status === 200))

  await context.close()
  return { consoleErrors, faceRequests, focusOutline, inspection, labels }
}

async function runMobile(browser) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  })
  const page = await context.newPage()
  await page.goto(CLONE_URL, { waitUntil: 'domcontentloaded' })
  await enterExperience(page)
  const logo = page.locator('.site-logo')
  await page.waitForTimeout(2100)
  await logo.click()
  await page.waitForTimeout(2000)
  await logo.locator('.site-logo__animation').screenshot({
    path: `${OUTPUT_DIR}/clone-mobile-click-1-2000.png`,
  })

  const inspection = await inspectLogo(page)
  assert.equal(inspection.box?.width, 64)
  assert.equal(inspection.box?.height, 64)
  assert.equal(inspection.style.top, '15px')
  assert.equal(inspection.style.left, '15px')
  assert.equal(inspection.ariaLabel, 'Change Pacôme logo expression (2 of 4)')

  await context.close()
  return inspection
}

async function runReducedMotion(browser) {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { height: 900, width: 1440 },
  })
  const page = await context.newPage()
  await page.goto(CLONE_URL, { waitUntil: 'domcontentloaded' })
  await enterExperience(page)
  const logo = page.locator('.site-logo')
  const animation = logo.locator('.site-logo__animation')
  await page.waitForTimeout(500)
  await logo.click()
  await page.waitForTimeout(500)
  const first = await animation.screenshot()
  await page.waitForTimeout(300)
  const second = await animation.screenshot()
  assert.equal(first.equals(second), true)
  assert.equal(await animation.locator('svg').count(), 1)

  await context.close()
  return { stableFrame: true }
}

async function runFailureFallback(browser) {
  const context = await browser.newContext({
    viewport: { height: 900, width: 1440 },
  })
  const page = await context.newPage()
  await page.route('**/face3.json', (route) => route.abort())
  await page.goto(CLONE_URL, { waitUntil: 'domcontentloaded' })
  await enterExperience(page)
  const logo = page.locator('.site-logo')
  await page.waitForTimeout(500)
  await logo.click()
  const fallback = logo.locator('.site-logo__fallback')
  await fallback.waitFor({ state: 'visible' })
  assert.equal(await fallback.count(), 1)

  await logo.click()
  await page.waitForTimeout(500)
  assert.equal(await fallback.count(), 0)
  assert.equal(await logo.locator('.site-logo__animation svg').count(), 1)

  await context.close()
  return { recoveredOnNextExpression: true, staticFallback: true }
}

await mkdir(OUTPUT_DIR, { recursive: true })
const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
})

try {
  const desktop = await runDesktop(browser)
  const mobile = await runMobile(browser)
  const reducedMotion = await runReducedMotion(browser)
  const failureFallback = await runFailureFallback(browser)
  await writeFile(
    `${OUTPUT_DIR}/results.json`,
    `${JSON.stringify(
      { desktop, failureFallback, mobile, reducedMotion },
      null,
      2,
    )}\n`,
  )
} finally {
  await browser.close()
}
