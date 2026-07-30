import { test, expect } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('/patient');
  await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 30000 });
  await expect(page).toHaveURL(/\/patient/);
});
