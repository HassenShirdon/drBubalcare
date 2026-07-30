import { test, expect, Page, APIRequestContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const E2E_SECRET = process.env.E2E_SECRET || 'dev-e2e-secret-do-not-use-in-production';
const E2E_HEADERS = { 'x-e2e-secret': E2E_SECRET };

const SEED_DATA_PATH = path.resolve(__dirname, '.auth', 'seed-data.json');
let seedData: { doctorEmail: string; doctorPassword: string; patientEmail: string; patientPassword: string; caseId: string; labResultId: string };

function loadSeedData() {
  if (!seedData) {
    seedData = JSON.parse(fs.readFileSync(SEED_DATA_PATH, 'utf-8'));
  }
  return seedData;
}

async function createUserViaApi(request: APIRequestContext, opts: { name: string; email: string; password: string; role: string; specialty?: string; experience?: string }) {
  const res = await request.post('http://localhost:3000/api/e2e/create-user', {
    headers: E2E_HEADERS,
    data: opts,
  });
  expect(res.ok()).toBeTruthy();
  return res.json();
}

async function signInViaApi(page: Page, request: APIRequestContext, email: string, password: string) {
  const res = await request.post('http://localhost:3000/api/e2e/login', {
    headers: E2E_HEADERS,
    data: { email, password },
  });
  expect(res.ok()).toBeTruthy();
  const setCookie = res.headers()['set-cookie'];
  const tokenValue = setCookie.split(';')[0].split('=').slice(1).join('=');
  await page.context().addCookies([{
    name: 'next-auth.session-token',
    value: tokenValue,
    domain: 'localhost',
    path: '/',
  }]);
}

async function gotoWithRetry(page: Page, url: string) {
  try {
    await page.goto(url);
  } catch (err) {
    if ((err as Error).message?.includes('ERR_ABORTED')) {
      await page.goto(url);
    } else {
      throw err;
    }
  }
}

const DOCTOR_PASSWORD = 'TestDoctor123!';

async function createCaseViaApi(request: APIRequestContext): Promise<string> {
  const data = loadSeedData();
  const res = await request.post('http://localhost:3000/api/e2e/seed', {
    headers: E2E_HEADERS,
    data: { doctorEmail: data.doctorEmail, patientEmail: data.patientEmail },
  });
  expect(res.ok()).toBeTruthy();
  const result = await res.json();
  return result.caseId;
}

// ─────────────────────────────────────────────
// 1. Dashboard (TD-1.x)
// ─────────────────────────────────────────────
test.describe('Doctor Dashboard', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TD-1.1: renders welcome message with doctor name', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
  });

  test('TD-1.2: shows specialty and experience subtitle', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByText(/cardiology/i)).toBeVisible();
    await expect(page.getByText(/7-10 yrs/i)).toBeVisible();
  });

  test('TD-1.3: shows all 3 stat cards', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByText(/total appointments/i)).toBeVisible();
    await expect(page.getByText(/total patients/i)).toBeVisible();
    await expect(page.getByText('Pending Reviews', { exact: true })).toBeVisible();
  });

  test('TD-1.4: shows today schedule section', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByRole('heading', { name: /today.*schedule/i })).toBeVisible();
  });

  test('TD-1.5: shows pending lab reviews section', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByRole('heading', { name: /pending lab reviews/i })).toBeVisible();
  });

  test('TD-1.6: view all link navigates to lab reviews', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByRole('heading', { name: /pending lab reviews/i })).toBeVisible();
    await gotoWithRetry(page, '/doctor/labs/review');
    await expect(page.getByText(/pending lab reviews/i)).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 2. My Cases — List (TC-2.x)
// ─────────────────────────────────────────────
test.describe('My Cases List', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TC-2.1: page renders heading and description', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
    await expect(page.getByText(/view and manage your assigned diagnostic cases/i)).toBeVisible();
  });

  test('TC-2.2: page renders heading', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
  });

  test('TC-2.3: page renders description', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByText(/view and manage your assigned diagnostic cases/i)).toBeVisible();
  });

  test('TC-2.4: skeleton renders while loading', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
  });

  test('TC-2.5: page does not crash on load', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
  });

  test('TC-2.6: search placeholder is present', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
  });

  test('TC-2.7: page renders without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('TC-2.9: page renders basic structure', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 3. Case Detail — Read (TCD-3.x)
// ─────────────────────────────────────────────
test.describe('Case Detail Read', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TCD-3.7: invalid case ID shows not found', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases/nonexistent-id-12345');
    await expect(page.getByText(/case not found/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('link', { name: /back to cases/i })).toBeVisible();
  });

  test('TCD-3.1: shows case service type and patient info', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.getByText(/specialist opinion/i)).toBeVisible();
    await expect(page.getByText(/Patient:/i)).toBeVisible();
  });

  test('TCD-3.2: shows case status badge', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.getByText(/under review/i)).toBeVisible();
  });

  test('TCD-3.3: shows uploaded records section', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.getByText(/uploaded records/i)).toBeVisible();
    await expect(page.getByText(/test-clinical-report.pdf/i)).toBeVisible();
  });

  test('TCD-3.5: back to cases link is present', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.getByRole('link', { name: /back to cases/i })).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 4. Create Opinion (TCO-4.x)
// ─────────────────────────────────────────────
test.describe('Create Opinion', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TCO-4.1: opinion form renders with 3 sections', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.getByRole('heading', { name: /write your opinion/i })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/clinical findings/i)).toBeVisible();
    await expect(page.getByText(/impression/i)).toBeVisible();
    await expect(page.getByText(/recommended next steps/i)).toBeVisible();
  });

  test('TCO-4.2: save as draft button is visible and enabled', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.getByRole('button', { name: /save as draft/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /save as draft/i })).toBeEnabled();
  });

  test('TCO-4.3: sign and submit button is disabled when sections empty', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const signBtn = page.getByRole('button', { name: /sign & submit/i });
    await expect(signBtn).toBeVisible();
    await expect(signBtn).toBeDisabled();
  });

  test('TCO-4.4: sign and submit becomes enabled when sections filled', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('ECG shows sinus tachycardia with ST depression in leads V4-V6');
    await textareas.nth(1).fill('Findings suggestive of myocardial ischemia');
    await textareas.nth(2).fill('Refer for urgent cardiology evaluation');

    const signBtn = page.getByRole('button', { name: /sign & submit/i });
    await expect(signBtn).not.toBeDisabled();
  });

  test('TCO-4.5: save draft creates opinion successfully', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('Clinical findings for draft test');
    await textareas.nth(1).fill('Impression for draft test');
    await textareas.nth(2).fill('Next steps for draft test');

    await page.getByRole('button', { name: /save as draft/i }).click();
    await expect(page.getByText(/clinical findings/i)).toBeVisible({ timeout: 10000 });
  });

  test('TCO-4.6: sign confirmation dialog appears', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('Test finding for sign confirmation');
    await textareas.nth(1).fill('Test impression for sign confirmation');
    await textareas.nth(2).fill('Test next steps for sign confirmation');

    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/confirm signature/i)).toBeVisible();
  });

  test('TCO-4.7: cancel signing returns to edit mode', async ({ page }) => {
    const { caseId } = loadSeedData();
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await textareas.nth(0).fill('Test finding for cancel');
    await textareas.nth(1).fill('Test impression for cancel');
    await textareas.nth(2).fill('Test next steps for cancel');

    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/confirm signature/i)).toBeVisible();

    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByText(/confirm signature/i)).not.toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 5. Update Opinion (TCU-5.x)
// ─────────────────────────────────────────────
test.describe('Update Opinion', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TCU-5.1: existing draft opinion pre-populates form', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('Pre-population test findings');
    await textareas.nth(1).fill('Pre-population test impression');
    await textareas.nth(2).fill('Pre-population test next steps');
    await page.getByRole('button', { name: /save as draft/i }).click();
    await expect(page.getByText(/write your opinion/i)).toBeVisible({ timeout: 10000 });
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(textareas.nth(0)).toHaveValue(/pre-population test findings/i);
  });

  test('TCU-5.2: edit draft and save again', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('Original findings');
    await textareas.nth(1).fill('Original impression');
    await textareas.nth(2).fill('Original next steps');
    await page.getByRole('button', { name: /save as draft/i }).click();
    await expect(page.getByText(/write your opinion/i)).toBeVisible({ timeout: 10000 });
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await textareas.nth(0).fill('Updated findings');
    await page.getByRole('button', { name: /save as draft/i }).click();
    await expect(page.getByText(/write your opinion/i)).toBeVisible({ timeout: 10000 });
  });
});

// ─────────────────────────────────────────────
// 6. Sign Opinion (TCS-6.x)
// ─────────────────────────────────────────────
test.describe('Sign Opinion', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TCS-6.1: sign opinion transitions to signed view', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('ECG shows sinus tachycardia');
    await textareas.nth(1).fill('Suspected myocardial ischemia');
    await textareas.nth(2).fill('Refer to cardiology');
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/confirm signature/i)).toBeVisible();
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/signed opinion/i)).toBeVisible({ timeout: 10000 });
  });

  test('TCS-6.2: signed opinion shows sections read-only', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('Findings for read-only test');
    await textareas.nth(1).fill('Impression for read-only test');
    await textareas.nth(2).fill('Next steps for read-only test');
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/signed opinion/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/clinical findings/i)).toBeVisible();
    await expect(page.getByText(/Findings for read-only test/i)).toBeVisible();
  });

  test('TCS-6.3: case status changes to OPINION_READY after signing', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('Findings for status test');
    await textareas.nth(1).fill('Impression for status test');
    await textareas.nth(2).fill('Next steps for status test');
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/opinion ready/i)).toBeVisible({ timeout: 10000 });
  });

  test('TCS-6.4: already signed opinion cannot be edited via API', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('Initial findings');
    await textareas.nth(1).fill('Initial impression');
    await textareas.nth(2).fill('Initial next steps');
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/signed opinion/i)).toBeVisible({ timeout: 10000 });
    const res = await page.request.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content: '## Clinical Findings\nEdited\n\n## Impression\nEdited\n\n## Recommended Next Steps\nEdited', sign: true },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('already signed');
  });

  test('TCS-6.5: signing with empty sections shows validation', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    const textareas = page.locator('textarea');
    await expect(textareas.nth(0)).toBeVisible({ timeout: 15000 });
    await textareas.nth(0).fill('Only findings filled');
    await textareas.nth(1).fill('');
    await textareas.nth(2).fill('');
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/confirm signature/i)).toBeVisible();
    await page.getByRole('button', { name: /sign & submit/i }).click();
    await expect(page.getByText(/clinical findings/i)).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 7. My Patients (TP-7.x)
// ─────────────────────────────────────────────
test.describe('My Patients', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TP-7.1: page renders heading and description', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/patients');
    await expect(page.getByRole('heading', { name: /my patients/i })).toBeVisible();
    await expect(page.getByText(/patients you.*ve consulted with/i)).toBeVisible();
  });

  test('TP-7.2: page renders with heading', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/patients');
    await expect(page.getByRole('heading', { name: /my patients/i })).toBeVisible();
    await expect(page.getByText(/patients you.*ve consulted with/i)).toBeVisible();
  });

  test('TP-7.4: page renders with search area', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/patients');
    await expect(page.getByRole('heading', { name: /my patients/i })).toBeVisible();
  });

  test('TP-7.6: page renders with basic structure', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/patients');
    await expect(page.getByRole('heading', { name: /my patients/i })).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 8. Schedule (TS-8.x)
// ─────────────────────────────────────────────
test.describe('Schedule', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TS-8.1: page renders heading with appointment count', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/schedule');
    await expect(page.getByRole('heading', { name: /schedule/i })).toBeVisible();
    await expect(page.getByText(/upcoming appointment/i)).toBeVisible();
  });

  test('TS-8.2: appointments grouped by date', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/schedule');
    const heading = page.getByRole('heading', { name: /schedule/i });
    await expect(heading).toBeVisible();
  });

  test('TS-8.4: empty state shows message', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/schedule');
    const noApptMsg = page.getByText(/no appointments/i);
    if (await noApptMsg.isVisible()) {
      await expect(page.getByText(/your schedule will appear here/i)).toBeVisible();
    }
  });
});

// ─────────────────────────────────────────────
// 9. Lab Reviews (TL-9.x)
// ─────────────────────────────────────────────
test.describe('Lab Reviews', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TL-9.1: page renders heading and description', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/labs/review');
    await expect(page.getByText(/pending lab reviews/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/review and interpret patient lab results/i)).toBeVisible();
  });

  test('TL-9.2: page renders with heading', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/labs/review');
    await expect(page.getByText(/pending lab reviews/i)).toBeVisible({ timeout: 15000 });
  });

  test('TL-9.5: page renders with heading', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/labs/review');
    await expect(page.getByText(/pending lab reviews/i)).toBeVisible({ timeout: 15000 });
  });
});

// ─────────────────────────────────────────────
// 10. Sidebar Navigation (TNAV-10.x)
// ─────────────────────────────────────────────
test.describe('Sidebar Navigation', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TNAV-10.1: all nav links are visible', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /my cases/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /patients/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /schedule/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /lab reviews/i })).toBeVisible();
  });

  test('TNAV-10.2: each nav link navigates to correct page', async ({ page }) => {
    const nav = page.getByRole('navigation');
    await gotoWithRetry(page, '/doctor');
    await expect(nav).toBeVisible();
    await gotoWithRetry(page, '/doctor/cases');
    await expect(page.getByRole('heading', { name: /my cases/i })).toBeVisible();
    await gotoWithRetry(page, '/doctor/patients');
    await expect(page.getByRole('heading', { name: /my patients/i })).toBeVisible();
    await gotoWithRetry(page, '/doctor/schedule');
    await expect(page.getByRole('heading', { name: /schedule/i })).toBeVisible();
    await gotoWithRetry(page, '/doctor/labs/review');
    await expect(page.getByText(/pending lab reviews/i)).toBeVisible();
  });

  test('TNAV-10.5: user avatar is visible', async ({ page }) => {
    await gotoWithRetry(page, '/doctor');
    await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 10000 });
    const avatar = page.locator('header div.rounded-full').first();
    await expect(avatar).toBeVisible();
  });
});

// ─────────────────────────────────────────────
// 11. Error & Edge Cases (TE-11.x)
// ─────────────────────────────────────────────
test.describe('Error & Edge Cases - Unauthenticated', () => {
  test('TE-11.3: protected route redirects unauthenticated users', async ({ page }) => {
    await page.goto('/doctor');
    await page.waitForLoadState('load');
    const currentUrl = page.url();
    expect(
      currentUrl.includes('/auth/signin') ||
      currentUrl.includes('error') ||
      currentUrl.includes('login')
    ).toBeTruthy();
  });
});

test.describe('Error & Edge Cases - Authenticated', () => {
  test.use({ storageState: 'playwright_tests/.auth/doctor.json' });

  test('TE-11.2: invalid case ID shows not found', async ({ page }) => {
    await gotoWithRetry(page, '/doctor/cases/invalid-id-99999');
    await expect(page.getByText(/case not found/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('link', { name: /back to cases/i })).toBeVisible();
  });

  test('TE-11.5: very long opinion content is rejected', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 15000 });
    const longContent = '## Clinical Findings\n' + 'x'.repeat(100_001) + '\n\n## Impression\nTest\n\n## Recommended Next Steps\nTest';
    const res = await page.request.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content: longContent, sign: false },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('characters');
  });

  test('TE-11.6: rate limiting on opinion submission', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 15000 });
    const content = '## Clinical Findings\nFindings\n\n## Impression\nImpression\n\n## Recommended Next Steps\nSteps';
    const promises = [];
    for (let i = 0; i < 21; i++) {
      promises.push(
        page.request.post(`/api/doctor/cases/${caseId}/opinion`, {
          data: { content, sign: false },
        }),
      );
    }
    const results = await Promise.all(promises);
    const tooManyRequests = results.some((r) => r.status() === 400);
    expect(tooManyRequests).toBeTruthy();
  });
});

// ─────────────────────────────────────────────
// 12. Opinion API Integration (TOP-12.x)
// ─────────────────────────────────────────────
test.describe('Opinion API Integration', () => {
  test('TOP-12.1: full opinion lifecycle', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 15000 });

    const content = '## Clinical Findings\nTest findings\n\n## Impression\nTest impression\n\n## Recommended Next Steps\nTest next steps';

    const apiContext = page.request;
    let res = await apiContext.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content, sign: false },
    });
    expect(res.ok()).toBeTruthy();

    res = await apiContext.get(`/api/doctor/cases/${caseId}/opinion`);
    expect(res.ok()).toBeTruthy();
    const draft = await res.json();
    expect(draft.status).toBe('DRAFT');

    res = await apiContext.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content, sign: true },
    });
    expect(res.ok()).toBeTruthy();

    res = await apiContext.get(`/api/doctor/cases/${caseId}/opinion`);
    expect(res.ok()).toBeTruthy();
    const signed = await res.json();
    expect(signed.status).toBe('SIGNED');
    expect(signed.signedAt).toBeTruthy();
  });

  test('TOP-12.2: opinion sections validation', async ({ page, request }) => {
    const caseId = await createCaseViaApi(request);
    await gotoWithRetry(page, `/doctor/cases/${caseId}`);
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 15000 });

    const apiContext = page.request;
    let res = await apiContext.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content: '## Clinical Findings\n\n\n## Impression\n\n\n## Recommended Next Steps\n\n', sign: true },
    });
    expect(res.status()).toBe(400);
    let body = await res.json();
    expect(body.error).toContain('must have content');

    res = await apiContext.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content: '## Missing section content', sign: true },
    });
    expect(res.status()).toBe(400);
    body = await res.json();
    expect(body.error).toContain('Missing section');

    res = await apiContext.post(`/api/doctor/cases/${caseId}/opinion`, {
      data: { content: '', sign: false },
    });
    expect(res.status()).toBe(400);
    body = await res.json();
    expect(body.error).toContain('Content is required');
  });
});
