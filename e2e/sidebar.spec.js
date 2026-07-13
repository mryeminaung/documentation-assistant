import { test, expect } from '@playwright/test'

test.describe('Sidebar toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.splash-dot', { state: 'hidden', timeout: 10000 })
  })

  test('hamburger button is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    const hamburger = page.getByRole('button', { name: /close sidebar|open sidebar/i })
    await expect(hamburger).toBeVisible()
  })

  test('hamburger button is hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    const hamburger = page.getByRole('button', { name: /close sidebar|open sidebar/i })
    await expect(hamburger).toBeHidden()
  })

  test('clicking hamburger hides the sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    const nav = page.locator('nav[aria-label="Task"]')
    await expect(nav).toBeVisible()

    const hamburger = page.getByRole('button', { name: 'Close sidebar' })
    await hamburger.click()

    await expect(nav).toBeHidden()
  })

  test('clicking hamburger again shows the sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    const nav = page.locator('nav[aria-label="Task"]')
    const hamburger = page.getByRole('button', { name: 'Close sidebar' })

    // Hide
    await hamburger.click()
    await expect(nav).toBeHidden()

    // Show again
    const openButton = page.getByRole('button', { name: 'Open sidebar' })
    await openButton.click()
    await expect(nav).toBeVisible()
  })
})
