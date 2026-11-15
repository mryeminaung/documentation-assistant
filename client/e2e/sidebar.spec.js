import { test, expect } from '@playwright/test'

test.describe('Sidebar mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.splash-dot', { state: 'hidden', timeout: 10000 })
  })

  test('collapse button is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    await expect(page.getByRole('button', { name: 'Collapse sidebar' })).toBeVisible()
  })

  test('sidebar mode button is hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('button', { name: /collapse sidebar|expand sidebar/i })).toBeHidden()
  })

  test('clicking collapse switches to the compact rail', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    const nav = page.locator('nav[aria-label="Task"]')
    await page.getByRole('button', { name: 'Collapse sidebar' }).click()
    await expect(nav).toHaveAttribute('data-compact', 'true')
    await expect(page.getByRole('button', { name: 'Explain Code' })).toBeVisible()
  })

  test('clicking expand restores the labeled sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    const nav = page.locator('nav[aria-label="Task"]')
    await page.getByRole('button', { name: 'Collapse sidebar' }).click()
    await page.getByRole('button', { name: 'Expand sidebar' }).click()
    await expect(nav).toHaveAttribute('data-compact', 'false')
  })
})
