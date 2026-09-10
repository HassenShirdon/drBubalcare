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
    await expect(page.getByRole('heading', { name: /patient case review/i })).toBeVisible({ timeout: 10000 });
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

  const continueBtn = (page: import('@playwright/test').Page) =>
    page.getByRole('button', { name: /continue/i });

  // Complete the required demographics (age + sex) on step 1.
  async function fillDemographics(page: import('@playwright/test').Page, age = '34') {
    await page.getByLabel('Age').fill(age);
    await page.getByRole('radio', { name: 'Female' }).check();
  }

  // Fill the required fields across the wizard and submit.
  // Returns the resolved POST /api/cases response.
  async function completeAndSubmit(page: import('@playwright/test').Page) {
    // Step 1: About You
    await page.getByLabel('Age').fill('38');
    await page.getByRole('radio', { name: 'Female' }).check();
    await continueBtn(page).click();

    // Step 2: Service & Reason
    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByRole('radio', { name: /comprehensive second opinion/i }).check();
    await page.getByLabel(/main concern/i).fill(
      'I am seeking a second opinion about a suspicious thyroid nodule that was found on a recent ultrasound of my neck.',
    );
    await continueBtn(page).click();

    // Step 3: Main Medical Problem (diagnosis is required)
    await page.getByLabel('Diagnosis / suspected diagnosis').fill('Suspicious thyroid nodule');
    await continueBtn(page).click();

    // Steps 4-9 are optional; continue through them.
    for (let i = 0; i < 7; i += 1) {
      await continueBtn(page).click();
    }

    // Step 10: Consent & submission
    await page.getByRole('checkbox', { name: /consent to clinical review/i }).check();
    await page.getByRole('checkbox', { name: /confirm that the information/i }).check();
    await page.getByRole('checkbox', { name: /consent to secure processing/i }).check();
    await page.getByLabel(/signature/i).fill('E2E Patient');

    const postResponse = page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'POST',
      { timeout: 60000 },
    );
    await page.getByRole('button', { name: /submit & create case/i }).click();
    const response = await postResponse;
    return response;
  }

  test('new case page renders with demographics as the first step', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');
    await expect(page.getByRole('heading', { name: /patient case review/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /about you/i })).toBeVisible();
    await expect(page.getByLabel('Age')).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Male' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Female' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Other' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Prefer not to say' })).toBeVisible();
  });

  test('wizard shows ten steps and progress indicator', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await expect(page.getByText(/1 of 10/)).toBeVisible();
    await expect(page.getByRole('progressbar')).toBeVisible();
    for (const label of ['About You', 'Service & Reason', 'Medical Problem', 'Medical History', 'Current Treatment', 'Test Results', 'Previous Opinions', 'Lifestyle', 'Family & Goals', 'Review & Consent']) {
      await expect(page.getByRole('button', { name: new RegExp(label, 'i') })).toBeVisible();
    }
  });

  test('blocks advancing when age is empty on first step', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.getByRole('button', { name: /continue/i }).click();
    // The wizard should not advance past the invalid demographics step.
    await expect(page.getByRole('heading', { name: /about you/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel('Age')).toBeVisible();
  });

  test('blocks advancing when age is out of range', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.getByLabel('Age').fill('150');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByRole('heading', { name: /about you/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel('Age')).toBeVisible();
  });

  test('blocks advancing when sex is not selected', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.getByLabel('Age').fill('41');
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByRole('heading', { name: /about you/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('radio', { name: 'Male' })).toBeVisible();
  });

  test('continue advances from demographics to service step', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await fillDemographics(page);
    await continueBtn(page).click();
    await expect(page.getByRole('heading', { name: /choose a service/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /specialist opinion/i })).toBeVisible();
  });

  test('back button returns from service step to demographics', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await fillDemographics(page);
    await continueBtn(page).click();
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page.getByRole('heading', { name: /about you/i })).toBeVisible();
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

  test('creates a new specialist opinion case through the wizard', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    const response = await completeAndSubmit(page);
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

  test('case detail page shows the intake recap including age and sex', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    const response = await completeAndSubmit(page);
    expect(response.status()).toBe(201);

    await page.waitForFunction(
      () => /\/patient\/cases\/(?!new)/.test(window.location.pathname),
      { timeout: 15000 },
    );
    await page.waitForResponse(
      (res) => res.url().includes('/api/cases') && res.request().method() === 'GET',
      { timeout: 30000 },
    );

    await expect(page.getByRole('heading', { name: /patient case review summary/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Age', { exact: true })).toBeVisible();
    await expect(page.getByText('38', { exact: true })).toBeVisible();
    await expect(page.getByText('Sex', { exact: true })).toBeVisible();
    await expect(page.getByText('Female', { exact: true })).toBeVisible();
  });

  test('newly created case appears in cases list', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    const response = await completeAndSubmit(page);
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

    const response = await completeAndSubmit(page);
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

    const response = await completeAndSubmit(page);
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

  test('submission without consent checkboxes is blocked client-side', async ({ page }) => {
    await page.goto('/patient/cases/new');
    await page.waitForLoadState('load');

    // Complete all steps but leave the consent/signature step empty.
    await page.getByLabel('Age').fill('45');
    await page.getByRole('radio', { name: 'Male' }).check();
    await continueBtn(page).click();

    await page.getByRole('button', { name: /specialist opinion/i }).click();
    await page.getByRole('radio', { name: /comprehensive second opinion/i }).check();
    await page.getByLabel(/main concern/i).fill(
      'I would like a specialist to review my most recent blood work and endocrine panel results in detail.',
    );
    await continueBtn(page).click();

    await page.getByLabel('Diagnosis / suspected diagnosis').fill('Endocrine imbalance');
    await continueBtn(page).click();

    for (let i = 0; i < 7; i += 1) {
      await continueBtn(page).click();
    }

    // Attempt submission without consent; no POST should be issued.
    let postFired = false;
    page.on('response', (res) => {
      if (res.url().includes('/api/cases') && res.request().method() === 'POST') postFired = true;
    });
    await page.getByRole('button', { name: /submit & create case/i }).click();

    await expect(page.getByText(/consent to clinical review is required/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('heading', { name: /consent, confirmation & submission/i })).toBeVisible();
    expect(postFired).toBe(false);
  });
});
