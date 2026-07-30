import { test, expect } from '@playwright/test';

const TEST_PASSWORD = 'TestPatientPass123!';

test.describe('Patient Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup/patient');
    await page.waitForLoadState('load');
  });

  test('renders patient sign up form with all fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create a patient account/i })).toBeVisible();
    await expect(page.getByLabel('Full Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('validates required fields on submit', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/name must be at least 2 characters/i)).toBeVisible();
    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('validates password requirements', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test Patient');
    await page.getByLabel('Email').fill(`test-${Date.now()}@test.com`);
    await page.getByLabel('Password', { exact: true }).fill('short');
    await page.getByLabel('Confirm Password').fill('short');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/at least 12 characters/i)).toBeVisible();
  });

  test('validates password match', async ({ page }) => {
    await page.getByLabel('Full Name').fill('Test Patient');
    await page.getByLabel('Email').fill(`test-${Date.now()}@test.com`);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm Password').fill('DifferentPass123!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/passwords don't match/i)).toBeVisible();
  });

  test('shows error for already registered email', async ({ page, request }) => {
    const dupEmail = `dup-${Date.now()}@test.com`;

    await request.post('http://localhost:3000/api/e2e/create-user', {
      headers: { 'x-e2e-secret': process.env.E2E_SECRET || 'dev-e2e-secret-do-not-use-in-production' },
      data: { name: 'Existing User', email: dupEmail, password: TEST_PASSWORD, role: 'PATIENT' },
    });

    await page.getByLabel('Full Name').fill('New User');
    await page.getByLabel('Email').fill(dupEmail);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.locator('form').getByText(/email already registered/i)).toBeVisible({ timeout: 10000 });
  });

  test('registers new patient and redirects to dashboard', async ({ page }) => {
    const email = `reg-${Date.now()}@test.com`;

    await page.getByLabel('Full Name').fill('E2E Registration Patient');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel('Confirm Password').fill(TEST_PASSWORD);

    await page.getByRole('button', { name: /create account/i }).click();

    await page.waitForFunction(
      () => window.location.pathname === '/patient' || window.location.pathname.startsWith('/patient'),
      { timeout: 20000 },
    );
    await expect(page.getByText(/here is your health overview/i)).toBeVisible({ timeout: 15000 });
  });

  test('has link to sign in', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/auth/signin');
  });

  test('has link to doctor registration', async ({ page }) => {
    const doctorLink = page.getByRole('link', { name: /register here/i });
    await expect(doctorLink).toBeVisible();
    await expect(doctorLink).toHaveAttribute('href', '/auth/signup/doctor');
  });

  test('can toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel('Password', { exact: true });
    const toggleButton = page.getByRole('button', { name: /show password/i }).first();

    await expect(passwordInput).toHaveAttribute('type', 'password');
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: /hide password/i }).first().click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});

test.describe('Patient Dashboard', () => {
  test.use({ storageState: 'playwright_tests/.auth/patient.json' });

  test('displays welcome message and overview', async ({ page }) => {
    await page.goto('/patient');
    await page.waitForLoadState('load');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/here is your health overview/i)).toBeVisible();
  });

  test('shows upcoming appointments section', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByRole('heading', { name: /upcoming appointments/i })).toBeVisible();
  });

  test('shows recent lab results section', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByRole('heading', { name: /recent lab results/i })).toBeVisible();
  });

  test('shows quick actions section', async ({ page }) => {
    await page.goto('/patient');
    await expect(page.getByRole('heading', { name: /quick actions/i })).toBeVisible();
  });

  test('quick action: start a case navigates to new case page', async ({ page }) => {
    await page.goto('/patient');
    await page.getByRole('link', { name: /start a case/i }).first().click();
    await page.waitForURL('/patient/cases/new');
    await expect(page.getByRole('heading', { name: /start a new case/i })).toBeVisible({ timeout: 10000 });
  });

  test('quick action: book appointment navigates to directory', async ({ page }) => {
    await page.goto('/patient');
    await page.getByRole('link', { name: /book appointment/i }).click();
    await page.waitForURL('/directory');
  });

  test('quick action: upload labs navigates to labs page', async ({ page }) => {
    await page.goto('/patient');
    await page.getByRole('link', { name: /upload labs/i }).click();
    await page.waitForURL('/patient/labs');
    await expect(page.getByRole('heading', { name: /lab portal/i })).toBeVisible({ timeout: 10000 });
  });

  test('quick action: browse directory navigates to directory', async ({ page }) => {
    await page.goto('/patient');
    await page.getByRole('link', { name: /browse directory/i }).click();
    await page.waitForURL('/directory');
  });

  test('can navigate to cases list via sidebar', async ({ page }) => {
    await page.goto('/patient/cases');
    await page.waitForURL('/patient/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible({ timeout: 10000 });
  });

  test('cases list page has start case button', async ({ page }) => {
    await page.goto('/patient/cases');
    await expect(page.getByRole('link', { name: /start case/i })).toBeVisible();
  });

  test('sidebar navigation is accessible from dashboard', async ({ page }) => {
    await page.goto('/patient');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
  });

  test('view all lab results link works', async ({ page }) => {
    await page.goto('/patient');
    await page.getByRole('link', { name: /view all/i }).first().click();
    await page.waitForURL('/patient/labs');
    await expect(page.getByRole('heading', { name: /lab portal/i })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Case Submission', () => {
  test.use({ storageState: 'playwright_tests/.auth/patient.json' });

  test('new case page renders with service type selection', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');
    await expect(page.getByRole('heading', { name: /start a new case/i })).toBeVisible();
    await expect(page.getByText('Service Type', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /specialist opinion/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /result interpretation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /follow-up consultation/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /lab trend analysis/i })).toBeVisible();
  });

  test('new case page has description field', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await expect(page.getByLabel(/case description/i)).toBeVisible();
  });

  test('new case page has cancel link back to cases', async ({ page }) => {
    await page.goto('/patient/cases/new');
    const cancelLink = page.getByRole('link', { name: /cancel/i });
    await expect(cancelLink).toBeVisible();
    await expect(cancelLink).toHaveAttribute('href', '/patient/cases');
  });

  test('back to cases link is present', async ({ page }) => {
    await page.goto('/patient/cases/new');
    const backLink = page.getByRole('link', { name: /back to cases/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/patient/cases');
  });

  test('validates service type selection is required', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.getByLabel(/case description/i).fill('I have been experiencing chest pain and shortness of breath for the past two weeks. My family has a history of heart disease.');
    await page.getByRole('button', { name: /create case/i }).click();
    await expect(page.getByText('Select a service type', { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test('validates description minimum length', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByLabel(/case description/i).fill('Short');
    await page.getByRole('button', { name: /create case/i }).click();
    await expect(page.getByText(/minimum 10 characters/i)).toBeVisible({ timeout: 5000 });
  });

  test('can select a service type and see it highlighted', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await expect(page.getByRole('button', { name: /specialist opinion/i })).toHaveClass(/border-\[#1E3A5F\]/);
  });

  test('creates a new specialist opinion case successfully', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByLabel(/case description/i).fill('I need a second opinion on my recent MRI results showing a suspicious lesion in the left frontal lobe. My current neurologist is concerned about possible glioma.');

    const postResponse = page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'POST',
      { timeout: 60000 },
    );
    await page.getByRole('button', { name: /create case/i }).click();
    const response = await postResponse;
    expect(response.status()).toBe(201);

    await page.waitForFunction(
      () => /\/patient\/cases\/(?!new)/.test(window.location.pathname),
      { timeout: 15000 },
    );
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );

    await expect(page.getByRole('heading', { name: /specialist opinion/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Open', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: /uploaded records/i })).toBeVisible({ timeout: 10000 });
  });

  test('creates a result interpretation case successfully', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    await page.getByRole('button', { name: /result interpretation/i }).click();
    await page.getByLabel(/case description/i).fill('I received my latest blood work results and the values seem abnormal. I need a specialist to interpret the complete blood count and metabolic panel results.');

    const postResponse = page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'POST',
      { timeout: 60000 },
    );
    await page.getByRole('button', { name: /create case/i }).click();
    const response = await postResponse;
    expect(response.status()).toBe(201);

    await page.waitForFunction(
      () => /\/patient\/cases\/(?!new)/.test(window.location.pathname),
      { timeout: 15000 },
    );
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );

    await expect(page.getByRole('heading', { name: /result interpretation/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Open', { exact: true })).toBeVisible({ timeout: 10000 });
  });

  test('newly created case appears in cases list', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByLabel(/case description/i).fill('Follow-up review of thyroid function test results showing elevated TSH levels over the past three months.');

    const postResponse = page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'POST',
      { timeout: 60000 },
    );
    await page.getByRole('button', { name: /create case/i }).click();
    const response = await postResponse;
    expect(response.status()).toBe(201);

    await page.waitForFunction(
      () => /\/patient\/cases\/(?!new)/.test(window.location.pathname),
      { timeout: 15000 },
    );
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );

    await page.goto('/patient/cases');
    await page.waitForLoadState('load');
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );
    await expect(page.getByText(/specialist opinion/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('case detail page shows file upload section', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByLabel(/case description/i).fill('Review of dermatology images for a suspicious mole on the upper back that has changed shape and color over the past few months.');

    const postResponse = page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'POST',
      { timeout: 60000 },
    );
    await page.getByRole('button', { name: /create case/i }).click();
    const response = await postResponse;
    expect(response.status()).toBe(201);

    await page.waitForFunction(
      () => /\/patient\/cases\/(?!new)/.test(window.location.pathname),
      { timeout: 15000 },
    );
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );

    await expect(page.getByRole('heading', { name: /uploaded records/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/pdf, jpeg, png, webp/i)).toBeVisible({ timeout: 10000 });
  });

  test('case detail page shows status badge', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByLabel(/case description/i).fill('Evaluation of echocardiogram results for a patient with suspected valvular heart disease and worsening shortness of breath.');

    const postResponse = page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'POST',
      { timeout: 60000 },
    );
    await page.getByRole('button', { name: /create case/i }).click();
    const response = await postResponse;
    expect(response.status()).toBe(201);

    await page.waitForFunction(
      () => /\/patient\/cases\/(?!new)/.test(window.location.pathname),
      { timeout: 15000 },
    );
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );

    await expect(page.getByText('Open', { exact: true })).toBeVisible({ timeout: 10000 });
  });
});
