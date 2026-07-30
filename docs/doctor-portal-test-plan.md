# Doctor Portal — Playwright E2E Test Plan

## Auth & Setup

- All authenticated tests use `storageState: 'playwright_tests/.auth/doctor.json'` (set up by `auth.setup.ts`)
- Doctor created in auth setup has `name: 'E2E Doctor'`, `specialty: 'Cardiology'`, `experience: '7-10 Yrs'`
- For tests needing specific data (assigned cases, appointments), create via API using `POST /api/e2e/create-user` and `POST /api/e2e/login` with `x-e2e-secret` header
- Helper: `gotoWithRetry(page, url)` — retries on `ERR_ABORTED`
- Helper: `portalUrlRegex(portal)` — matches `/doctor` paths
- Base URL: `http://localhost:3000`
- Timeout: Assertions 10-30s, Navigations 30s
- Tests are serial within each `describe` block when sharing state

---

## 1. Dashboard (`/doctor`)

### TD-1.1: Renders welcome message
- Navigate to `/doctor`
- Assert `getByText(/welcome back/i)` is visible
- Verify text contains "Dr." prefix and doctor's name

### TD-1.2: Shows specialty and experience subtitle
- Assert subtitle visible with specialty ("Cardiology") and experience ("7-10 Yrs")

### TD-1.3: Shows all 3 stat cards
- Assert visible: "Total Appointments" with count
- Assert visible: "Total Patients" with count
- Assert visible: "Pending Reviews" with count

### TD-1.4: Shows today's schedule section
- Assert heading "Today's Schedule" is visible
- Assert date displayed next to heading
- If appointments exist: each shows patient name, time, status badge
- If no appointments: shows "No appointments today" empty state

### TD-1.5: Shows pending lab reviews section
- Assert heading "Pending Lab Reviews" is visible
- Assert "View all" link navigates to `/doctor/labs/review`
- If reviews exist: shows lab name, patient name, flag count
- If no reviews: shows "All labs reviewed" empty state

### TD-1.6: Dashboard links work
- Click "View all" in Pending Lab Reviews section
- Assert URL changes to `/doctor/labs/review`
- Navigate back to `/doctor`

---

## 2. My Cases — List (`/doctor/cases`)

### TC-2.1: Page renders heading and description
- Navigate to `/doctor/cases`
- Assert heading "My Cases" is visible
- Assert description "View and manage your assigned diagnostic cases"

### TC-2.2: DataTable columns render
- Wait for DataTable to load (not skeleton)
- Assert column headers: Patient, Service Type, Status, Opinion, Created, Action
- Assert each row shows patient avatar/name/age/gender

### TC-2.3: Tab filters render and switch
- Assert tabs: "All (N)", "Pending (N)", "Opinion Written (N)"
- Click "Pending" tab — assert active style applied
- Click "Opinion Written" tab — assert active style applied
- Click "All" tab — assert active style applied

### TC-2.4: Status badges display correctly
- Assert OPEN cases show blue badge
- Assert UNDER_REVIEW cases show amber badge
- Assert OPINION_READY cases show green badge
- Assert DISPUTED cases show red badge

### TC-2.5: Opinion badges display correctly
- Assert cases without opinion show "Not Started"
- Assert DRAFT opinions show amber badge
- Assert SIGNED opinions show green badge

### TC-2.6: Search filters by patient name
- Type patient name in search input
- Assert table filters to matching rows
- Assert non-matching rows are hidden

### TC-2.7: Action link navigates to case detail
- Click action arrow on a case row
- Assert URL changes to `/doctor/cases/[id]`

### TC-2.8: Loading state shows skeleton
- Open page and immediately check for `TableSkeleton` (before data loads)
- Assert skeleton columns are visible during loading

### TC-2.9: Empty state (no cases assigned)
- If doctor has no assigned cases, show empty DataTable with "No results" message
- Assert search input still visible

---

## 3. Case Detail — Read (`/doctor/cases/[id]`)

### TCD-3.1: Shows case service type and patient info
- Navigate to a specific case
- Assert heading with service type label (e.g., "Specialist Opinion")
- Assert patient name, age, gender, creation date visible

### TCD-3.2: Shows case status badge
- Assert status badge displays correct status
- Assert badge color matches status config (OPEN=blue, UNDER_REVIEW=amber, etc.)

### TCD-3.3: Shows uploaded records section
- Assert heading "Uploaded Records (N)" with count
- If records exist: each shows filename, file type, upload date, View link
- If no records: shows "No records uploaded yet."

### TCD-3.4: Shows AI pre-screen section (when available)
- Assert "AI Pre-Screen" heading visible
- Assert disclaimer "AI-Generated Pre-Screen — for specialist review only" visible
- Assert Key Findings list items visible
- Assert Differentials to Consider list items visible
- Assert Urgent Flags section visible (if flags exist)
- If no AI prescreen: section is not rendered

### TCD-3.5: Shows "Back to cases" link
- Assert link "Back to cases" with href `/doctor/cases` is visible

### TCD-3.6: Loading state shows spinner
- Navigate to case detail, assert `Loader2` spinner visible during load

### TCD-3.7: Case not found shows error
- Navigate to `/doctor/cases/invalid-id`
- Assert "Case not found" message visible
- Assert "Back to cases" link visible

---

## 4. Case Detail — Create Opinion (`/doctor/cases/[id]`)

### TCO-4.1: Opinion form renders with 3 sections
- Navigate to a case without an existing opinion
- Assert heading "Write Your Opinion" visible
- Assert textarea for "Clinical Findings" with placeholder
- Assert textarea for "Impression" with placeholder
- Assert textarea for "Recommended Next Steps" with placeholder

### TCO-4.2: "Save as Draft" button is visible and enabled
- Assert "Save as Draft" button visible
- Assert button is enabled even with empty fields

### TCO-4.3: "Sign & Submit" button is disabled when all sections empty
- Assert "Sign & Submit" button visible
- Assert button has `disabled` attribute when all sections empty

### TCO-4.4: "Sign & Submit" becomes enabled when all sections filled
- Fill all 3 textareas with valid clinical content
- Assert "Sign & Submit" button is no longer disabled

### TCO-4.5: Save draft creates opinion successfully
- Fill all 3 textareas with content
- Click "Save as Draft"
- Assert no error message visible
- Wait for success (opinion saved)
- Reload page — assert all 3 sections are pre-populated with saved content

### TCO-4.6: Sign confirmation dialog appears
- Fill all 3 sections with content
- Click "Sign & Submit"
- Assert confirmation text "Confirm signature?" visible
- Assert "Sign & Submit" (confirm) and "Cancel" buttons visible

### TCO-4.7: Cancel signing returns to edit mode
- Click "Sign & Submit" to show confirmation
- Click "Cancel"
- Assert confirmation dialog is dismissed
- Assert edit form is still visible

### TCO-4.8: Opinion form shows error on API failure
- Mock an API failure (submit without required fields)
- Assert error message displayed below form in red (`#E63946`)

---

## 5. Case Detail — Update Opinion (`/doctor/cases/[id]`)

### TCU-5.1: Existing draft opinion pre-populates form
- Navigate to a case with an existing DRAFT opinion
- Assert Clinical Findings textarea is pre-filled with saved content
- Assert Impression textarea is pre-filled with saved content
- Assert Recommended Next Steps textarea is pre-filled with saved content

### TCU-5.2: Edit draft and save again
- Modify content in one section
- Click "Save as Draft"
- Reload page
- Assert updated content is persisted

### TCU-5.3: Updating draft multiple times works
- Save draft, modify, save again — repeat 3 times
- Assert final content is persisted correctly

---

## 6. Case Detail — Sign Opinion (`/doctor/cases/[id]`)

### TCS-6.1: Sign opinion transitions case status
- Navigate to a case with filled opinions
- Click "Sign & Submit", confirm in dialog
- Assert opinion is signed successfully (no error)
- Reload page — assert "Signed Opinion" heading visible (not the edit form)
- Assert Signed date displayed
- Assert all 3 sections rendered as read-only

### TCS-6.2: Signed opinion shows all sections read-only
- Assert "Clinical Findings" section displays content as text
- Assert "Impression" section displays content as text
- Assert "Recommended Next Steps" section displays content as text
- Assert no textareas or edit buttons visible

### TCS-6.3: Case status changes to OPINION_READY after signing
- After signing, navigate back to `/doctor/cases`
- Assert case now shows "OPINION_READY" status badge (green)

### TCS-6.4: Already signed opinion cannot be edited (backend guard)
- Create a patient case, assign to doctor, sign opinion
- Attempt `POST /api/doctor/cases/[id]/opinion` with updated content
- Assert 400 response with "Opinion already signed" error

### TCS-6.5: Signing with empty sections shows validation
- Leave one section empty, attempt to sign
- Assert frontend button is disabled
- Or if backend triggered: assert error message about missing content

---

## 7. My Patients (`/doctor/patients`)

### TP-7.1: Page renders heading and description
- Navigate to `/doctor/patients`
- Assert heading "My Patients" visible
- Assert description "Patients you've consulted with"

### TP-7.2: DataTable columns render
- Wait for table to load
- Assert columns: Patient (name, age, gender), Appointments (count badge), Last Visit (date)

### TP-7.3: Patient rows show correct data
- Assert each row shows patient initial avatar
- Assert name, age, gender rendered
- Assert appointment count badge visible
- Assert last visit date formatted correctly

### TP-7.4: Search filters by patient name
- Type patient name in search input
- Assert table filters to matching rows

### TP-7.5: Loading state shows skeleton
- Assert `TableSkeleton` with 3 columns visible during load

### TP-7.6: Empty state
- If no patients yet: assert empty DataTable with "No results" message

---

## 8. Schedule (`/doctor/schedule`)

### TS-8.1: Page renders heading with appointment count
- Navigate to `/doctor/schedule`
- Assert heading "Schedule" visible
- Assert text "N upcoming appointments" with correct count

### TS-8.2: Appointments grouped by date
- Assert date group headers visible (e.g., "Monday, July 28, 2026")
- Assert each appointment shows patient initial avatar
- Assert patient name, time, and status badge

### TS-8.3: Status badges render correctly
- Assert SCHEDULED badge (blue)
- Assert CONFIRMED badge (green)
- Assert IN_PROGRESS badge (amber)
- Assert COMPLETED badge (gray)
- Assert CANCELLED badge (red)

### TS-8.4: Empty state
- If no appointments: assert "No appointments" message visible
- Assert "Your schedule will appear here" description visible

---

## 9. Lab Reviews (`/doctor/labs/review`)

### TL-9.1: Page renders heading and description
- Navigate to `/doctor/labs/review`
- Assert heading "Pending Lab Reviews" visible
- Assert description "Review and interpret patient lab results"

### TL-9.2: DataTable columns render
- Wait for table to load
- Assert columns: Patient, Lab Test, Date, Abnormal (count), Status

### TL-9.3: Abnormal count badge visible
- Assert lab rows with abnormal metrics show red count badge
- Assert lab rows with all normal metrics show "—"

### TL-9.4: Status column renders correctly
- Assert REVIEW_NEEDED shows red "Review Needed" badge
- Assert REVIEWED shows green "Reviewed" badge

### TL-9.5: Search filters by patient
- Type patient name in search input
- Assert table filters to matching rows

### TL-9.6: Loading state shows skeleton
- Assert `TableSkeleton` with 5 columns visible during load

### TL-9.7: Empty state
- If no pending reviews: assert empty DataTable with "No results" message

---

## 10. Sidebar Navigation (`/doctor`)

### TNAV-10.1: All nav links are visible on desktop
- Navigate to `/doctor`
- Assert nav links: Dashboard, My Cases, Patients, Schedule, Lab Reviews, Help Center, Logout

### TNAV-10.2: Each nav link navigates to correct page
- Click "My Cases" → assert URL `/doctor/cases`
- Click "Dashboard" → assert URL `/doctor`
- Click "Patients" → assert URL `/doctor/patients`
- Click "Schedule" → assert URL `/doctor/schedule`
- Click "Lab Reviews" → assert URL `/doctor/labs/review`

### TNAV-10.3: "New Consultation" button is visible
- Assert button "New Consultation" visible in sidebar
- Click it — assert it navigates or opens relevant action

### TNAV-10.4: Notification bell is visible
- Assert notification bell icon visible in top bar

### TNAV-10.5: User avatar is visible in top bar
- Assert user avatar/initial visible in top bar

### TNAV-10.6: Active nav link is highlighted
- Assert current page nav link has active/highlighted style

### TNAV-10.7: Logout navigates to homepage
- Click "Logout" in sidebar
- Assert URL redirects to `/` (or sign-in page)

---

## 11. Error & Edge Cases

### TE-11.1: Loading skeletons show for all data pages
- Test `/doctor/cases` shows `TableSkeleton` before data loads
- Test `/doctor/patients` shows `TableSkeleton` before data loads
- Test `/doctor/labs/review` shows `TableSkeleton` before data loads
- Test `/doctor/cases/[id]` shows loading spinner before data loads

### TE-11.2: Invalid case ID shows not found
- Navigate to `/doctor/cases/nonexistent-id`
- Assert "Case not found" message
- Assert "Back to cases" link navigates to `/doctor/cases`

### TE-11.3: Protected route redirects unauthenticated users
- Clear storage state
- Navigate to `/doctor`
- Assert redirect to `/auth/signin` or access denied

### TE-11.4: Non-doctor role cannot access doctor pages
- Use patient storage state
- Navigate to `/doctor`
- Assert redirect or 403 response

### TE-11.5: Very long opinion content is rejected
- Attempt to save opinion with >100K characters
- Assert validation error returned

### TE-11.6: Rate limiting on opinion submission
- Send >20 rapid opinion POST requests
- Assert 400 "Too many requests" response

### TE-11.7: Page title/metadata renders for all pages
- Assert `/doctor` page has appropriate title
- Assert `/doctor/cases` page has appropriate title
- Assert `/doctor/patients` page has appropriate title
- Assert `/doctor/schedule` page has appropriate title
- Assert `/doctor/labs/review` page has appropriate title

---

## 12. Opinion API — Direct Integration (via page + API)

### TOP-12.1: Full opinion lifecycle via API
1. Create a patient case via API
2. Assign case to doctor (simulate admin assignment)
3. Doctor navigates to case — assert opinion form visible
4. Save draft — assert `POST /api/doctor/cases/[id]/opinion` returns 200 with DRAFT
5. Verify draft persists on page reload
6. Edit draft and save — assert updated content
7. Sign opinion — assert `POST` with `sign: true` returns 200 with SIGNED
8. Assert case status updated to OPINION_READY
9. Navigate to cases list — assert badge shows OPINION_READY
10. Attempt to edit signed opinion — assert error

### TOP-12.2: Opinion sections validation
1. POST opinion with missing "## Clinical Findings" header + content
2. Assert 400 "Missing section" error
3. POST opinion with empty "## Impression" body
4. Assert 400 "must have content" error

---

## Test Configuration

- **Fixture**: All tests use `storageState: 'playwright_tests/.auth/doctor.json'` (pre-authenticated as DOCTOR)
- **Base URL**: `http://localhost:3000`
- **Isolation**: Serial mode within each `test.describe` block (auth state reuse)
- **Helper**: `gotoWithRetry(page, url, retries=2)` — retries on navigation errors
- **Helper**: `portalUrlRegex('doctor')` — matches `/doctor` paths
- **Timeouts**: Assertions 10-30s depending on data load; Navigations 30s
- **Data setup**: Use `POST /api/e2e/create-user` and `POST /api/e2e/login` for creating test entities
- **Teardown**: No explicit teardown needed (ephemeral test data)
- **E2E Secret**: `process.env.E2E_SECRET || 'dev-e2e-secret-do-not-use-in-production'`
- **Auth Cookie**: `next-auth.session-token` set via `signInViaApi()` helper
