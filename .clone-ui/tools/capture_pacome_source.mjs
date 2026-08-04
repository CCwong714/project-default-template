import { writeFile } from 'node:fs/promises'

import { chromium } from 'playwright'

const SOURCE_URL = 'https://pacomepertant.com/'
const OUTPUT_DIR = '.clone-ui/source/pacome/captures'
const CHROME_PATH =
  '/Users/ccwong/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

async function enterExperience(page) {
  const quietEntry = page.getByRole('button', {
    exact: true,
    name: 'enter without sound',
  })

  await quietEntry.waitFor({ state: 'visible' })
  await quietEntry.click()
  await page.waitForTimeout(1400)
}

async function captureDesktop(browser) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    viewport: { height: 873, width: 1920 },
  })
  const page = await context.newPage()
  await page.goto(SOURCE_URL, { waitUntil: 'domcontentloaded' })
  await page.screenshot({ path: `${OUTPUT_DIR}/source-desktop-entry.png` })
  await enterExperience(page)
  await writeFile(
    '.clone-ui/source/pacome/rendered.html',
    await page.locator('html').evaluate((element) => element.outerHTML),
  )
  await page.screenshot({ path: `${OUTPUT_DIR}/source-desktop-spiral.png` })

  await page.mouse.wheel(0, 612)
  await page.waitForTimeout(120)
  await page.screenshot({
    path: `${OUTPUT_DIR}/source-desktop-inertia-0120.png`,
  })
  await page.waitForTimeout(1200)
  await page.screenshot({
    path: `${OUTPUT_DIR}/source-desktop-inertia-1320.png`,
  })
  await page.waitForTimeout(2800)
  await page.screenshot({
    path: `${OUTPUT_DIR}/source-desktop-inertia-4120.png`,
  })

  await page.getByRole('button', { exact: true, name: 'list list' }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUTPUT_DIR}/source-desktop-list.png` })

  await page.getByRole('button', { exact: true, name: 'm e n u' }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUTPUT_DIR}/source-desktop-menu.png` })
  await context.close()
}

async function captureMobile(browser) {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    viewport: { height: 844, width: 390 },
  })
  const page = await context.newPage()
  await page.goto(SOURCE_URL, { waitUntil: 'domcontentloaded' })
  await page.screenshot({ path: `${OUTPUT_DIR}/source-mobile-entry.png` })
  await enterExperience(page)
  await page.screenshot({ path: `${OUTPUT_DIR}/source-mobile-spiral.png` })

  await page.getByRole('button', { exact: true, name: 'list list' }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUTPUT_DIR}/source-mobile-list.png` })

  await page.getByRole('button', { exact: true, name: 'm e n u' }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: `${OUTPUT_DIR}/source-mobile-menu.png` })
  await context.close()
}

async function captureAbout(browser) {
  const viewports = [
    { height: 873, name: 'desktop', width: 1920 },
    { height: 844, name: 'mobile', width: 390 },
  ]

  for (const viewport of viewports) {
    const context = await browser.newContext({
      deviceScaleFactor: 1,
      hasTouch: viewport.name === 'mobile',
      isMobile: viewport.name === 'mobile',
      viewport: { height: viewport.height, width: viewport.width },
    })
    const page = await context.newPage()
    await page.goto(`${SOURCE_URL}about`, { waitUntil: 'domcontentloaded' })
    const quietEntry = page.getByRole('button', {
      exact: true,
      name: 'enter without sound',
    })
    if (await quietEntry.isVisible()) {
      await quietEntry.click()
      await page.waitForTimeout(1400)
    }
    await page.screenshot({
      path: `${OUTPUT_DIR}/source-${viewport.name}-about.png`,
    })
    await context.close()
  }
}

const browser = await chromium.launch({
  executablePath: CHROME_PATH,
  headless: true,
})

try {
  await captureDesktop(browser)
  await captureMobile(browser)
  await captureAbout(browser)
} finally {
  await browser.close()
}
