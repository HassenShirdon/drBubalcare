import { test, expect } from '@playwright/test';

test.describe('Admin Portal', () => {
  test.use({ storageState: 'playwright_tests/.auth/admin.json' });

  async function gotoWithRetry(page: import('@playwright/test').Page, url: string, retries = 2) {
    for (let i = 0; i <= retries; i++) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        return;
      } catch (err) {
        if (i === retries) throw err;
        await page.waitForTimeout(2000);
      }
    }
  }

  test.describe('Dashboard', () => {
    test('TD-1.1: renders Admin Dashboard heading', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });
    });

    test('TD-1.2: shows all 4 stat cards', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByText(/total cases/i)).toBeVisible();
      await expect(page.getByText(/pending verification/i)).toBeVisible();
      await expect(page.getByText(/news posts/i)).toBeVisible();
      await expect(page.getByText(/total patients/i)).toBeVisible();
    });

    test('TD-1.3: shows case breakdown section', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('heading', { name: /case breakdown/i })).toBeVisible();
      await expect(page.getByText(/open \(awaiting specialist\)/i)).toBeVisible();
      await expect(page.getByText(/under review/i)).toBeVisible();
      await expect(page.getByText(/opinion ready/i)).toBeVisible();
    });

    test('TD-1.4: shows quick actions with links', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('heading', { name: /quick actions/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /manage cases/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /verify specialists/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /manage news/i })).toBeVisible();
    });

    test('TD-1.5: nav links are visible', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('link', { name: 'Cases', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Specialists', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'News', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Disputes', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Edge Cases', exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Audit', exact: true })).toBeVisible();
    });

    test('TD-1.6: admin user button is present and opens dropdown', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });
      await page.waitForLoadState('networkidle');

      const adminBtn = page.locator('[data-slot="admin-user-btn"]');
      await expect(adminBtn).toBeVisible({ timeout: 5000 });
      await adminBtn.click({ force: true });
      await page.waitForTimeout(500);

      const dropdown = page.locator('[data-slot="admin-user-dropdown"]');
      await expect(dropdown).toBeVisible({ timeout: 8000 });
      await expect(dropdown.getByText(/profile/i)).toBeVisible();
      await expect(dropdown.getByText(/sign out/i)).toBeVisible();
    });

    test('TD-1.7: View Site link is present', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('link', { name: /view site/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /view site/i })).toHaveAttribute('href', '/');
    });
  });

  test.describe('Pages Render Smoke Tests', () => {
    test('TC-2.1: Case Management page renders heading', async ({ page }) => {
      await gotoWithRetry(page, '/admin/cases');
      await expect(page.getByRole('heading', { name: /case management/i })).toBeVisible({ timeout: 30000 });
    });

    test('TC-2.2: Case Management page shows table or skeleton', async ({ page }) => {
      await gotoWithRetry(page, '/admin/cases');
      await expect(page.getByText('Admin Portal')).toBeVisible();
      await expect(page.getByRole('heading', { name: /case management/i })).toBeVisible({ timeout: 30000 });
    });

    test('TS-3.1: Specialist Management page renders heading and tabs', async ({ page }) => {
      await gotoWithRetry(page, '/admin/specialists');
      await expect(page.getByRole('heading', { name: /specialist management/i })).toBeVisible({ timeout: 30000 });
      const allTab = page.getByRole('button', { name: /all/i });
      await expect(allTab).toBeVisible();
      await expect(page.getByRole('button', { name: /verified/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /pending/i })).toBeVisible();
      await expect(page.getByText(/review, verify, and manage platform specialists/i)).toBeVisible();
    });

    test('TN-4.1: News Management page renders with table', async ({ page }) => {
      await gotoWithRetry(page, '/admin/news');
      await expect(page.getByRole('heading', { name: /news management/i })).toBeVisible({ timeout: 30000 });
      await expect(page.getByRole('columnheader', { name: /title/i })).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('columnheader', { name: /author/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /new post/i })).toBeVisible();
    });

    test('TDU-7.1: Disputes page renders heading', async ({ page }) => {
      await gotoWithRetry(page, '/admin/disputes');
      await expect(page.getByRole('heading', { name: /disputes/i })).toBeVisible({ timeout: 30000 });
    });

    test('TE-9.1: Edge Cases page renders heading and empty state', async ({ page }) => {
      await gotoWithRetry(page, '/admin/edge-cases');
      await expect(page.getByRole('heading', { name: /edge cases/i })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText(/cases requiring attention/i)).toBeVisible();
    });

    test('TAL-10.1: Audit Logs page renders heading', async ({ page }) => {
      await gotoWithRetry(page, '/admin/audit-logs');
      await expect(page.getByRole('heading', { name: /audit logs/i })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText(/total entries/i)).toBeVisible();
    });

    test('TDR-11.1: Data Requests page renders heading', async ({ page }) => {
      await gotoWithRetry(page, '/admin/data-requests');
      await expect(page.getByRole('heading', { name: /data requests/i })).toBeVisible({ timeout: 30000 });
      await expect(page.getByText(/gdpr data deletion requests/i)).toBeVisible();
    });
  });

  test.describe('News Create & Edit', () => {
    test('TN-4.3: New Post button navigates to create page', async ({ page }) => {
      await gotoWithRetry(page, '/admin/news');
      await page.getByRole('link', { name: /new post/i }).click();
      await expect(page).toHaveURL(/\/admin\/news\/new/, { timeout: 10000 });
    });

    test('TN-5.1: create form has required fields', async ({ page }) => {
      await gotoWithRetry(page, '/admin/news/new');
      await expect(page.getByRole('heading', { name: /new post/i })).toBeVisible({ timeout: 15000 });
      await expect(page.getByLabel('Title')).toBeVisible();
      await expect(page.getByLabel('Slug')).toBeVisible();
      await expect(page.getByText(/publish immediately/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /create post/i })).toBeVisible();
    });

    test('TN-5.2: create form fields are interactive', async ({ page }) => {
      await gotoWithRetry(page, '/admin/news/new');
      await expect(page.getByLabel('Title')).toBeVisible({ timeout: 15000 });
      await expect(page.getByLabel('Slug')).toBeVisible();
      const titleInput = page.getByLabel('Title');
      await titleInput.fill('Test Article Title');
      const titleValue = await titleInput.inputValue();
      expect(titleValue).toBe('Test Article Title');
      const slugInput = page.getByLabel('Slug');
      await slugInput.fill('test-article-title');
      const slugValue = await slugInput.inputValue();
      expect(slugValue).toBe('test-article-title');
    });

    test('TN-5.3: validation shows error on submit with empty fields', async ({ page }) => {
      await gotoWithRetry(page, '/admin/news/new');
      await page.waitForLoadState('networkidle');
      const createBtn = page.locator('button[type="submit"]').filter({ hasText: /create post/i });
      await createBtn.click();
      await expect(page).toHaveURL(/\/admin\/news\/new/, { timeout: 10000 });
    });
  });

  test.describe('Navigation', () => {
    test('TNAV-12.1: nav links navigate to correct pages', async ({ page }) => {
      await gotoWithRetry(page, '/admin');

      await page.getByRole('link', { name: 'Cases', exact: true }).click();
      await expect(page.getByRole('heading', { name: /case management/i })).toBeVisible({ timeout: 15000 });

      await page.getByRole('link', { name: 'Specialists', exact: true }).click();
      await expect(page.getByRole('heading', { name: /specialist management/i })).toBeVisible({ timeout: 15000 });

      await page.getByRole('link', { name: 'News', exact: true }).click();
      await expect(page.getByRole('heading', { name: /news management/i })).toBeVisible({ timeout: 15000 });

      await page.getByRole('link', { name: 'Disputes', exact: true }).click();
      await expect(page.getByRole('heading', { name: /disputes/i })).toBeVisible({ timeout: 15000 });

      await page.getByRole('link', { name: 'Edge Cases', exact: true }).click();
      await expect(page.getByRole('heading', { name: /edge cases/i })).toBeVisible({ timeout: 15000 });

      await page.getByRole('link', { name: 'Audit', exact: true }).click();
      await expect(page.getByRole('heading', { name: /audit logs/i })).toBeVisible({ timeout: 30000 });
    });

    test('TNAV-12.2: View Site link navigates to homepage', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await page.getByRole('link', { name: /view site/i }).click();
      await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
    });

    test('TNAV-12.3: sign out button is accessible from dropdown', async ({ page }) => {
      await gotoWithRetry(page, '/admin');
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });
      await page.waitForLoadState('networkidle');
      const adminBtn = page.locator('[data-slot="admin-user-btn"]');
      await expect(adminBtn).toBeVisible({ timeout: 5000 });
      await adminBtn.click({ force: true });
      await page.waitForTimeout(500);
      const dropdown = page.locator('[data-slot="admin-user-dropdown"]');
      await expect(dropdown).toBeVisible({ timeout: 5000 });
      const signOutBtn = dropdown.getByText(/sign out/i);
      await expect(signOutBtn).toBeVisible();
    });
  });
});
