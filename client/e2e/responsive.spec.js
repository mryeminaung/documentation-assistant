import { test, expect } from '@playwright/test'

const compactViewports = [
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
]

const desktopViewports = [
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]

async function openApp(page, viewport) {
  await page.setViewportSize(viewport)
  await page.goto('/')
  await page.waitForSelector('.splash-dot', { state: 'hidden', timeout: 10000 })
}

for (const viewport of compactViewports) {
  test(`uses workspace tabs without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await openApp(page, viewport)

    await expect(page.getByRole('tablist', { name: 'Workspace panels' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Code Editor' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: 'Code Editor' })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: 'AI Response' })).toBeHidden()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })
}

for (const viewport of desktopViewports) {
  test(`keeps the split workspace at ${viewport.width}px`, async ({ page }) => {
    await openApp(page, viewport)

    await expect(page.getByRole('tablist', { name: 'Workspace panels' })).toBeHidden()
    await expect(page.getByRole('tabpanel', { name: 'Code Editor' })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: 'AI Response' })).toBeVisible()
    await expect(page.getByRole('separator', { name: /resize code editor/i })).toBeVisible()
  })
}

test('preserves editor content while switching mobile workspace tabs', async ({ page }) => {
  await openApp(page, { width: 390, height: 844 })

  const editor = page.getByLabel('Source code editor')
  await editor.click()
  await editor.pressSequentially('const preserved = true')
  await page.getByRole('tab', { name: 'AI Response' }).click()
  await page.getByRole('tab', { name: 'Code Editor' }).click()

  await expect(editor).toContainText('const preserved = true')
})

test('shows a successful response without moving focus to its tab', async ({ page }) => {
  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: '# Generated response' }),
    })
  })
  await openApp(page, { width: 390, height: 844 })

  const editor = page.getByLabel('Source code editor')
  await editor.click()
  await editor.pressSequentially('const ready = true')
  const generate = page.getByRole('button', { name: 'Generate', exact: true })
  await generate.click()

  await expect(page.getByRole('tab', { name: 'AI Response' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('Generated response', { exact: true })).toBeVisible()
  await expect(generate).toBeFocused()
})
