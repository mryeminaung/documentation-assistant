import { test, expect } from '@playwright/test'

const response = [
  '# Service overview',
  '',
  'Creates a formatted export.',
  '',
  '```ts',
  'export const ready = true',
  '```',
].join('\n')

async function openGeneratedResponse(page, { withFile = false } = {}) {
  await page.route('**/api/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: response }),
    })
  })
  await page.goto('/')
  await page.waitForSelector('.splash-dot', { state: 'hidden', timeout: 10000 })
  await page.getByRole('button', { name: 'Generate Documentation' }).click()

  if (withFile) {
    await page.locator('input[type="file"]').setInputFiles({
      name: 'payment.service.ts',
      mimeType: 'text/typescript',
      buffer: Buffer.from('export const ready = true'),
    })
    await expect(page.getByText('payment.service.ts')).toBeVisible()
  } else {
    const editor = page.getByLabel('Source code editor')
    await editor.click()
    await editor.pressSequentially('export const ready = true')
  }

  await page.getByRole('button', { name: 'Generate', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Export response' })).toBeVisible()
}

async function downloadText(download) {
  const stream = await download.createReadStream()
  const chunks = []
  for await (const chunk of stream) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

test.describe('enhanced exports', () => {
  test('exports Markdown with source metadata and a descriptive filename', async ({ page }) => {
    await openGeneratedResponse(page, { withFile: true })
    await page.getByRole('button', { name: 'Export response' }).click()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: /Markdown/ }).click()
    const download = await downloadPromise
    const markdown = await downloadText(download)

    expect(download.suggestedFilename()).toMatch(
      /^payment-service-generate-documentation-\d{4}-\d{2}-\d{2}\.md$/,
    )
    expect(markdown).toContain('# Payment Service')
    expect(markdown).toContain('- **Task:** Generate Documentation')
    expect(markdown).toContain('- **Language:** TypeScript')
    expect(markdown).toContain('- **Source:** payment.service.ts')
    expect(markdown).toContain('# Service overview')
    await expect(page.getByRole('status')).toContainText('Exported payment-service')
  })

  test('uses an untitled fallback and downloads a PDF', async ({ page }) => {
    await openGeneratedResponse(page)
    await page.getByRole('button', { name: 'Export response' }).click()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('menuitem', { name: /PDF/ }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toMatch(
      /^untitled-snippet-generate-documentation-\d{4}-\d{2}-\d{2}\.pdf$/,
    )
    await expect(page.getByRole('status')).toContainText('Exported untitled-snippet')
  })

  test('supports keyboard navigation and escape in the export menu', async ({ page }) => {
    await openGeneratedResponse(page)
    const trigger = page.getByRole('button', { name: 'Export response' })
    await trigger.click()

    const markdownItem = page.getByRole('menuitem', { name: /Markdown/ })
    const pdfItem = page.getByRole('menuitem', { name: /PDF/ })
    await expect(markdownItem).toBeFocused()
    await markdownItem.press('ArrowDown')
    await expect(pdfItem).toBeFocused()
    await pdfItem.press('Escape')
    await expect(page.getByRole('menu', { name: 'Export format' })).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})
