import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication Flows', () => {
  test.describe('Sign In Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/auth/signin');
    });

    test('renders sign in form', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.waitForLoadState('load');
      await page.getByLabel('Email').fill('nonexistent@test.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await Promise.all([
        page.waitForResponse('**/api/auth/callback/**'),
        page.getByRole('button', { name: /sign in/i }).click(),
      ]);
      await expect(page.locator('[class*="bg-red"]').first()).toBeVisible({ timeout: 5000 });
    });

    test('has link to patient signup', async ({ page }) => {
      const signUpLink = page.getByRole('link', { name: /sign up/i });
      await expect(signUpLink).toBeVisible();
      await expect(signUpLink).toHaveAttribute('href', '/auth/signup/patient');
    });

    test('has link to doctor registration', async ({ page }) => {
      const doctorLink = page.getByRole('link', { name: /register here/i });
      await expect(doctorLink).toBeVisible();
      await expect(doctorLink).toHaveAttribute('href', '/auth/signup/doctor');
    });
  });

  test.describe('Patient Sign Up', () => {
    test('renders patient sign up form', async ({ page }) => {
      await page.goto('/auth/signup/patient');
      await expect(page.getByRole('heading', { name: /create a patient account/i })).toBeVisible();
      await expect(page.getByLabel('Full Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Confirm Password')).toBeVisible();
      await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
      await page.goto('/auth/signup/patient');
      await page.waitForLoadState('load');
      await page.getByRole('button', { name: /create account/i }).click();
      await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible();
      await expect(page.getByText(/invalid email address/i)).toBeVisible();
    });

    test('validates password match', async ({ page }) => {
      await page.goto('/auth/signup/patient');
      await page.waitForLoadState('load');
      await page.getByLabel('Full Name').fill('Test Patient');
      await page.getByLabel('Email').fill(`test-${Date.now()}@test.com`);
      await page.getByLabel('Password', { exact: true }).fill('Password123!');
      await page.getByLabel('Confirm Password').fill('DifferentPassword123!');
      await page.getByRole('button', { name: /create account/i }).click();
      await expect(page.getByText(/passwords don't match/i)).toBeVisible();
    });

    test('shows error for duplicate email', async ({ page, request }) => {
      const dupEmail = `dup-${Date.now()}@test.com`;
      await request.post('http://localhost:3000/api/test/create-user', {
        data: { name: 'Dup User', email: dupEmail, password: 'DupPass123!', role: 'PATIENT' },
      });
      await page.goto('/auth/signup/patient');
      await page.waitForLoadState('load');
      await page.getByLabel('Full Name').fill('Duplicate Test');
      await page.getByLabel('Email').fill(dupEmail);
      await page.getByLabel('Password', { exact: true }).fill('TestPass123!');
      await page.getByLabel('Confirm Password').fill('TestPass123!');
      await page.getByRole('button', { name: /create account/i }).click();
      const button = page.getByRole('button', { name: /create account/i });
      await expect(button).toBeEnabled({ timeout: 25000 });
      const errorIndicator = page.getByText(/email already registered/i)
        .or(page.getByText(/something went wrong/i));
      await expect(errorIndicator).toBeVisible({ timeout: 5000 });
    });

    test('has link to sign in', async ({ page }) => {
      await page.goto('/auth/signup/patient');
      const signInLink = page.getByRole('link', { name: /sign in/i });
      await expect(signInLink).toBeVisible();
      await expect(signInLink).toHaveAttribute('href', '/auth/signin');
    });

    test('has link to doctor registration', async ({ page }) => {
      await page.goto('/auth/signup/patient');
      const doctorLink = page.getByRole('link', { name: /register here/i });
      await expect(doctorLink).toBeVisible();
      await expect(doctorLink).toHaveAttribute('href', '/auth/signup/doctor');
    });
  });

  test.describe('Doctor Sign Up', () => {
    test('renders doctor sign up form', async ({ page }) => {
      await page.goto('/auth/signup/doctor');
      await expect(page.getByRole('heading', { name: /join as a physician/i })).toBeVisible();
      await expect(page.getByLabel('Full Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Specialty')).toBeVisible();
      await expect(page.getByLabel('Experience')).toBeVisible();
      await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Confirm Password')).toBeVisible();
      await expect(page.getByRole('button', { name: /create physician account/i })).toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
      await page.goto('/auth/signup/doctor');
      await page.waitForLoadState('load');
      await page.getByRole('button', { name: /create physician account/i }).click();
      await expect(page.getByText(/specialty is required/i)).toBeVisible();
      await expect(page.getByText(/experience is required/i)).toBeVisible();
    });

    test('has link to patient registration', async ({ page }) => {
      await page.goto('/auth/signup/doctor');
      const patientLink = page.getByRole('link', { name: /register here/i });
      await expect(patientLink).toBeVisible();
      await expect(patientLink).toHaveAttribute('href', '/auth/signup/patient');
    });
  });

  test.describe('Protected Routes', () => {
    test('unauthenticated user redirected to sign in from patient', async ({ page }) => {
      await page.goto('/patient');
      await page.waitForURL('**/auth/signin**');
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });

    test('unauthenticated user redirected to sign in from doctor', async ({ page }) => {
      await page.goto('/doctor');
      await page.waitForURL('**/auth/signin**');
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });

    test('unauthenticated user redirected to sign in from admin', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForURL('**/auth/signin**');
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });
  });
});
