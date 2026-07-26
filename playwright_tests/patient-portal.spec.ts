import { test, expect } from '@playwright/test';

test.describe('Patient Portal', () => {
  test.use({ storageState: 'playwright_tests/.auth/patient.json' });

  test('dashboard displays welcome message', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
  });

  test('dashboard shows quick actions section', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByRole('heading', { name: /quick actions/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /start a case/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /book appointment/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /upload labs/i })).toBeVisible();
  });

  test('dashboard shows upcoming appointments section', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByRole('heading', { name: /upcoming appointments/i })).toBeVisible();
  });

  test('dashboard shows recent lab results section', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByRole('heading', { name: /recent lab results/i })).toBeVisible();
  });

  test('can navigate to start a new case', async ({ page }) => {
    await page.goto('/patient');
    await page.getByRole('link', { name: /start a case/i }).click();
    await page.waitForURL('/patient/cases/new');
    await expect(page.getByRole('heading', { name: /start a case/i }).or(page.getByRole('heading', { name: /new case/i }))).toBeVisible();
  });

  test('can navigate to cases list', async ({ page }) => {
    await page.goto('/patient/cases');
    await page.waitForURL('/patient/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible({ timeout: 10000 });
  });

  test('can access labs page', async ({ page }) => {
    await page.goto('/patient');
    const labsLink = page.getByRole('link', { name: /upload labs/i });
    await expect(labsLink).toBeVisible();
    await labsLink.click();
    await page.waitForURL('/patient/labs');
    await expect(page.getByRole('heading', { name: /lab portal/i })).toBeVisible({ timeout: 10000 });
  });

  test('sidebar navigation is accessible', async ({ page }) => {
    await page.goto('/patient');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });
});
