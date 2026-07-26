import { test, expect } from '@playwright/test';

test.describe('Admin Portal', () => {
  test.use({ storageState: 'playwright_tests/.auth/admin.json' });

  test('dashboard displays admin header', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/admin dashboard/i)).toBeVisible({ timeout: 10000 });
  });

  test('dashboard shows stats cards', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText(/total cases/i)).toBeVisible();
    await expect(page.getByText(/pending verification/i)).toBeVisible();
    await expect(page.getByText(/total patients/i)).toBeVisible();
  });

  test('dashboard shows case breakdown section', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /case breakdown/i })).toBeVisible();
    await expect(page.getByText(/open/i)).toBeVisible();
    await expect(page.getByText(/under review/i)).toBeVisible();
    await expect(page.getByText(/opinion ready/i)).toBeVisible();
  });

  test('dashboard shows quick actions', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: /quick actions/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /manage cases/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /verify specialists/i })).toBeVisible();
  });

  test('navigation has all admin links', async ({ page }) => {
    await page.goto('/admin');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: /cases/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /specialists/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /news/i })).toBeVisible();
  });

  test('can navigate to cases management', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('link', { name: /manage cases/i })).toHaveAttribute('href', '/admin/cases');
    await page.goto('/admin/cases');
    await expect(page.getByRole('heading', { name: /case management/i })).toBeVisible({ timeout: 15000 });
  });

  test('can navigate to specialists verification', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('link', { name: /verify specialists/i })).toHaveAttribute('href', '/admin/specialists');
    await page.goto('/admin/specialists');
    await expect(page.getByRole('heading', { name: /specialist management/i })).toBeVisible({ timeout: 15000 });
  });

  test('admin nav bar has view site link', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('link', { name: /view site/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view site/i })).toHaveAttribute('href', '/');
  });
});
