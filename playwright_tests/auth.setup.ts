import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_DIR = path.resolve(__dirname, '.auth');

fs.mkdirSync(AUTH_DIR, { recursive: true });

const PATIENT_EMAIL = `e2e-patient-${Date.now()}@test.com`;
const PATIENT_PASSWORD = 'TestPatient123!';
const DOCTOR_EMAIL = `e2e-doctor-${Date.now()}@test.com`;
const DOCTOR_PASSWORD = 'TestDoctor123!';

async function waitForServerReady(request, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const res = await request.post('http://localhost:3000/api/test/create-admin', {
        timeout: 5000,
      });
      if (res.ok()) return;
    } catch {
      // server still booting
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('Dev server did not become ready in time');
}

async function createUserViaApi(request, { name, email, password, role, specialty, experience }) {
  const response = await request.post('http://localhost:3000/api/test/create-user', {
    data: { name, email, password, role, specialty, experience },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function signInViaApi(page, request, email, password) {
  const response = await request.post('http://localhost:3000/api/test/login', {
    data: { email, password },
  });
  expect(response.ok()).toBeTruthy();

  const setCookie = response.headers()['set-cookie'];
  const tokenValue = setCookie.split(';')[0].split('=').slice(1).join('=');
  await page.context().addCookies([{
    name: 'next-auth.session-token',
    value: tokenValue,
    domain: 'localhost',
    path: '/',
  }]);
}

async function gotoWithRetry(page, url) {
  try {
    await page.goto(url);
  } catch (err) {
    if (err.message?.includes('ERR_ABORTED')) {
      await page.goto(url);
    } else {
      throw err;
    }
  }
}

function portalUrlRegex(portal) {
  return new RegExp(`^https?:\\/\\/[^\\/]+\\/${portal}(?=[\\/?#]|$)`);
}

setup('sign up as patient and save auth state', async ({ page, request }) => {
  await waitForServerReady(request);
  await createUserViaApi(request, {
    name: 'E2E Patient',
    email: PATIENT_EMAIL,
    password: PATIENT_PASSWORD,
    role: 'PATIENT',
  });
  await signInViaApi(page, request, PATIENT_EMAIL, PATIENT_PASSWORD);

  await gotoWithRetry(page, '/patient');
  await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 30000 });
  await expect(page).toHaveURL(portalUrlRegex('patient'));

  await page.context().storageState({ path: path.join(AUTH_DIR, 'patient.json') });
});

setup('sign up as doctor and save auth state', async ({ page, request }) => {
  await waitForServerReady(request);
  await createUserViaApi(request, {
    name: 'E2E Doctor',
    email: DOCTOR_EMAIL,
    password: DOCTOR_PASSWORD,
    role: 'DOCTOR',
    specialty: 'Cardiology',
    experience: '7-10 Yrs',
  });
  await signInViaApi(page, request, DOCTOR_EMAIL, DOCTOR_PASSWORD);

  await gotoWithRetry(page, '/doctor');
  await expect(page.getByText(/welcome back/i)).toBeVisible({ timeout: 30000 });
  await expect(page).toHaveURL(portalUrlRegex('doctor'));

  await page.context().storageState({ path: path.join(AUTH_DIR, 'doctor.json') });
});

setup('create admin and save auth state', async ({ page, request }) => {
  await waitForServerReady(request);

  const response = await request.post('http://localhost:3000/api/test/create-admin');
  const body = await response.json();
  expect(response.ok()).toBeTruthy();
  if (body.message === 'Admin created') {
    console.log('Admin setup: created');
  }

  await signInViaApi(page, request, 'admin@drbubalcare.test', 'TestAdmin123!');
  await gotoWithRetry(page, '/admin');

  await expect(page.getByText(/admin dashboard/i)).toBeVisible({ timeout: 30000 });
  await expect(page).toHaveURL(portalUrlRegex('admin'));

  await page.context().storageState({ path: path.join(AUTH_DIR, 'admin.json') });
});
