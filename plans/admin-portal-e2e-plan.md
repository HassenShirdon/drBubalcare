# Admin Portal — Playwright E2E Test Plan

## Overview

End-to-end tests for the Dr. Bubal Care Admin Portal (`/admin/*`).  
Tests authenticate as **ADMIN** role using pre-saved storage state (`playwright_tests/.auth/admin.json`).  
All tests are serial within each `describe` block (admin state shared).

---

## 1. Admin Dashboard (`/admin`)

### TD-1.1: renders Admin Dashboard heading
- Navigate to `/admin`
- Assert `getByText(/admin dashboard/i)` is visible
- Verify URL is `/admin`

### TD-1.2: shows all 4 stat cards
- Assert visible text: "Total Cases", "Pending Verification", "News Posts", "Total Patients"

### TD-1.3: shows case breakdown section
- Assert heading "Case Breakdown" is visible
- Assert items: "Open (awaiting specialist)", "Under Review", "Opinion Ready"

### TD-1.4: shows quick actions with links
- Assert heading "Quick Actions" is visible
- Assert links: "Manage Cases" → `/admin/cases`, "Verify Specialists" → `/admin/specialists`, "Manage News" → `/admin/news`

### TD-1.5: nav links are visible
- Assert nav links: Cases, Specialists, News, Disputes, Edge Cases, Audit

### TD-1.6: admin user button present and opens dropdown
- Assert `[data-slot="admin-user-btn"]` is visible
- Click it
- Assert `[data-slot="admin-user-dropdown"]` is visible
- Assert dropdown contains "Profile" and "Sign out"

### TD-1.7: View Site link is present
- Assert link "View Site" visible with href `/`

---

## 2. Case Management (`/admin/cases`)

### TC-2.1: page renders heading
- Navigate to `/admin/cases`
- Assert `getByRole('heading', { name: /case management/i })` is visible
- Assert the DataTable or skeleton loads

### TC-2.2: table shows expected columns (smoke)
- Wait for table to render
- Assert column header "Patient" is visible
- Assert column header "Service Type" is visible
- Assert column header "Status" is visible

---

## 3. Specialist Management (`/admin/specialists`)

### TS-3.1: page renders heading and filter tabs
- Navigate to `/admin/specialists`
- Assert `getByRole('heading', { name: /specialist management/i })` is visible
- Assert filter buttons: All, Verified, Pending
- Assert page description text

---

## 4. News Management (`/admin/news`)

### TN-4.1: page renders with table
- Navigate to `/admin/news`
- Assert heading "News Management" is visible
- Assert DataTable rendered
- Assert column header "Title" is visible
- Assert "New Post" button/link exists

### TN-4.2: new post button navigates to create page
- Click "New Post" link
- Assert URL changes to `/admin/news/new`

---

## 5. News Create (`/admin/news/new`)

### TN-5.1: create form has required fields
- Navigate to `/admin/news/new`
- Assert heading "New Post" is visible
- Assert form fields: Title, Slug, Publish immediately checkbox, Create Post button

### TN-5.2: slug auto-generates from title
- Fill Title with a test string
- Assert Slug field auto-populates with slugified version

### TN-5.3: validation shows error for empty title
- Click "Create Post" without filling required fields
- Assert validation error for title

---

## 6. Disputes (`/admin/disputes`)

### TDU-7.1: page renders heading
- Navigate to `/admin/disputes`
- Assert heading "Disputes" is visible

---

## 7. Edge Cases (`/admin/edge-cases`)

### TE-9.1: page renders heading
- Navigate to `/admin/edge-cases`
- Assert heading "Edge Cases" is visible
- Assert description text "Cases requiring attention"
- Assert empty state message "No pending edge cases" (if no cases)

---

## 8. Audit Logs (`/admin/audit-logs`)

### TAL-10.1: page renders heading and total entries
- Navigate to `/admin/audit-logs`
- Assert heading "Audit Logs" is visible
- Assert "total entries" text is visible (even if 0)

---

## 9. Data Requests (`/admin/data-requests`)

### TDR-11.1: page renders heading and description
- Navigate to `/admin/data-requests`
- Assert heading "Data Requests" is visible
- Assert GDPR description text

---

## 10. Navigation

### TNAV-12.1: all nav links navigate to correct pages
- From `/admin`, click each nav link and verify the resulting page heading
- Cases → "Case Management" heading
- Specialists → "Specialist Management" heading
- News → "News Management" heading
- Disputes → "Disputes" heading
- Edge Cases → "Edge Cases" heading
- Audit → "Audit Logs" heading

### TNAV-12.2: View Site link navigates to homepage
- Click "View Site"
- Assert URL redirects to `/`

### TNAV-12.3: sign out redirects to homepage
- Click admin user button to open dropdown
- Click "Sign out"
- Assert URL is `/` (callback URL for signOut)

---

## Test Configuration

- **Fixture**: All tests use `storageState: 'playwright_tests/.auth/admin.json'` (pre-authenticated as ADMIN)
- **Base URL**: `http://localhost:3000`
- **Isolation**: Serial mode within admin-portal spec (auth state reuse)
- **Helper**: `gotoWithRetry(page, url, retries=2)` — retries on navigation errors
- **Timeouts**: Assertions: 10-30s depending on data load; Navigations: 30s
