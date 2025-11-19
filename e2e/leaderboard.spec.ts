import { test, expect } from '@playwright/test'

test.describe('Leaderboard Page', () => {
  test('should load leaderboard', async ({ page }) => {
    await page.goto('/leaderboard')
    await expect(page.getByRole('heading', { name: /leaderboard/i })).toBeVisible()
  })

  test('should display top players', async ({ page }) => {
    await page.goto('/leaderboard')
    const table = page.getByRole('table')
    await expect(table).toBeVisible()
  })

  test('should show player ranks and scores', async ({ page }) => {
    await page.goto('/leaderboard')
    await expect(page.getByText(/rank/i)).toBeVisible()
    await expect(page.getByText(/score/i)).toBeVisible()
  })

  test('should allow filtering by timeframe', async ({ page }) => {
    await page.goto('/leaderboard')
    await page.getByRole('button', { name: /daily/i }).click()
    await page.getByRole('button', { name: /weekly/i }).click()
    await page.getByRole('button', { name: /all time/i }).click()
  })
})
