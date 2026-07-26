import { test, expect } from '@playwright/test';

test.describe('Doctor Portal', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('dashboard displays welcome message', async ({ page }) => {
    await page.goto('/doctor');
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
  });

  test('dashboard shows stats cards', async ({ page }) => {
    await page.goto('/doctor');
    await expect(page.getByText(/total appointments/i)).toBeVisible();
    await expect(page.getByText(/total patients/i)).toBeVisible();
    await expect(page.getByText('Pending Reviews', { exact: true })).toBeVisible();
  });

  test('dashboard shows today schedule section', async ({ page }) => {
    await page.goto('/doctor');
    await expect(page.getByRole('heading', { name: /today.*schedule/i })).toBeVisible();
  });

  test('dashboard shows pending lab reviews section', async ({ page }) => {
    await page.goto('/doctor');
    await expect(page.getByRole('heading', { name: /pending lab reviews/i })).toBeVisible();
  });

  test('can navigate to assigned cases', async ({ page }) => {
    await page.goto('/doctor/cases');
    await expect(page).toHaveURL(/\/doctor\/cases/);
  });

  test('can navigate to schedule', async ({ page }) => {
    await page.goto('/doctor/schedule');
    await expect(page).toHaveURL(/\/doctor\/schedule/);
  });

  test('sidebar navigation is accessible', async ({ page }) => {
    await page.goto('/doctor');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});
