import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and branding', async ({ page }) => {
    await expect(page).toHaveTitle(/Dr Bubal Care/);
    await expect(page.getByRole('link', { name: /dr bubal care/i }).first()).toBeVisible();
  });

  test('navigation links are visible', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /specializations/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('hero section renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /waiting weeks for a specialist opinion/i, level: 1 })).toBeVisible();
  });

  test('how it works section is present', async ({ page }) => {
    const howItWorks = page.getByRole('heading', { name: /get answers in 3 simple steps/i });
    await howItWorks.scrollIntoViewIfNeeded();
    await expect(howItWorks).toBeVisible();
  });

  test('services section lists offerings', async ({ page }) => {
    const servicesHeading = page.getByRole('heading', { name: /how we help you/i });
    await servicesHeading.scrollIntoViewIfNeeded();
    await expect(servicesHeading).toBeVisible();
  });

  test('specializations section visible', async ({ page }) => {
    const spec = page.getByRole('heading', { name: /expert care across every specialty/i });
    await spec.scrollIntoViewIfNeeded();
    await expect(spec).toBeVisible();
  });

  test('social proof section shows testimonials', async ({ page }) => {
    const socialProof = page.getByRole('heading', { name: /trusted by patients and specialists worldwide/i });
    await socialProof.scrollIntoViewIfNeeded();
    await expect(socialProof).toBeVisible();
  });

  test('footer contains company info and links', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByText('Dr Bubal Care', { exact: true })).toBeVisible();
    await expect(page.getByText(/evidence-based medical excellence/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /terms/i })).toBeVisible();
  });

  test('has start your case now call to action', async ({ page }) => {
    const cta = page.getByRole('button', { name: /start your case now/i });
    await expect(cta).toBeVisible();
  });
});
