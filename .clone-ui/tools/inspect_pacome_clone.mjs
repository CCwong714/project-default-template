import { chromium } from 'playwright'

const chrome =
  '/Users/ccwong/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
const browser = await chromium.launch({
  executablePath: chrome,
  headless: true,
})
const context = await browser.newContext({
  viewport: { width: 1920, height: 873 },
})
const page = await context.newPage()
await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' })

const boxes = async (selectors) => {
  const result = {}
  for (const selector of selectors) {
    result[selector] = await page.locator(selector).boundingBox()
  }
  return result
}

const entry = await boxes([
  '.entry-content',
  '.entry-logo',
  '.entry-content p',
  '.entry-primary',
])
await page.getByRole('button', { name: 'enter without sound' }).click()
await page.waitForTimeout(700)
await page.getByRole('button', { name: 'list' }).click()
await page.waitForTimeout(450)
const list = await boxes([
  '.project-list',
  '.project-list nav',
  '.project-list nav a:first-child',
])
await page.getByRole('button', { name: 'menu' }).click()
await page.waitForTimeout(700)
const menu = await boxes([
  '.menu-panel',
  '.menu-close',
  '.menu-panel nav',
  '.menu-footer',
])
console.log(JSON.stringify({ entry, list, menu }, null, 2))

await context.close()
await browser.close()
