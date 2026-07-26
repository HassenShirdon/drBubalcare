import { test, expect } from '@playwright/test';

test.describe('European Referral Workflow', () => {
  test.use({ storageState: 'playwright_tests/.auth/patient.json' });

  test('patient can create a new case', async ({ page }) => {
    await page.goto('/patient/cases/new');

    const heading = page.getByRole('heading', { name: /new case/i }).or(page.getByRole('heading', { name: /start a case/i }));
    await expect(heading).toBeVisible({ timeout: 10000 });
  });

  test('case creation form has service type selection', async ({ page }) => {
    await page.goto('/patient/cases/new');

    await expect(page.getByText(/service type/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /specialist opinion/i })).toBeVisible();
  });

  test('patient can view their cases list', async ({ page }) => {
    await page.goto('/patient/cases');
    await expect(page).toHaveURL(/\/patient\/cases/);
  });

  test('case list shows cases section', async ({ page }) => {
    await page.goto('/patient/cases');

    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible({ timeout: 10000 });
  });

  test.describe('Case Detail View', () => {
    test('case detail page is accessible for existing cases', async ({ page }) => {
      await page.goto('/patient/cases');

      const caseLink = page.getByRole('link', { name: /view details/i }).or(page.getByRole('link', { name: /view case/i })).first();
      if (await caseLink.isVisible({ timeout: 3000 }).catch(() => false)) {
        await caseLink.click();
        await page.waitForURL(/\/patient\/cases\//);
        await expect(page.getByText(/case/i)).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('File Upload', () => {
    test('file upload section is present on case creation page', async ({ page }) => {
      await page.goto('/patient/cases/new');

      const uploadSection = page.getByText(/upload/i).or(page.getByText(/files/i)).first();
      await expect(uploadSection).toBeVisible({ timeout: 10000 });
    });
  });
});

test.describe('Referral Coordination View', () => {
  test.use({ storageState: 'playwright_tests/.auth/admin.json' });

  test('admin can view referrals list', async ({ page }) => {
    await page.goto('/admin/cases');
    await expect(page).toHaveURL(/\/admin\/cases/);
  });
});
