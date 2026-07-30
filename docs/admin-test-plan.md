# Admin Portal — Playwright Test Plan

## Auth & Setup
All admin tests use `storageState: 'playwright_tests/.auth/admin.json'` (set up by `auth.setup.ts`).

## Test Scenarios

### 1. Dashboard (`/admin`)
- **TD-1.1**: Page renders "Admin Dashboard" heading (smoke)
- **TD-1.2**: All 4 stat cards visible (Total Cases, Pending Verification, News Posts, Total Patients)
- **TD-1.3**: Case Breakdown section shows Open / Under Review / Opinion Ready
- **TD-1.4**: Quick Actions section has links to Manage Cases, Verify Specialists, Manage News
- **TD-1.5**: Nav bar has links: Cases, Specialists, News, Disputes, Edge Cases, Audit
- **TD-1.6**: Admin user dropdown shows name, Profile link, Sign Out button
- **TD-1.7**: View Site link navigates to /

### 2. Cases (`/admin/cases`)
- **TC-2.1**: Page renders "Case Management" heading
- **TC-2.2**: DataTable renders with patient, status, specialist columns
- **TC-2.3**: Search filters by patient name/email
- **TC-2.4**: Row actions dropdown opens
- **TC-2.5**: Unassigned cases show "Assign Specialist" section in dropdown
- **TC-2.6**: Pagination controls visible and functional

### 3. Specialists (`/admin/specialists`)
- **TS-3.1**: Page renders "Specialist Management" heading
- **TS-3.2**: Tab filters work (All / Verified / Pending) with correct counts
- **TS-3.3**: DataTable renders with specialist info, specialty, experience
- **TS-3.4**: VerifyButton shows confirm/cancel flow
- **TS-3.5**: Search filters by name or email
- **TS-3.6**: Pagination controls visible and functional

### 4. News (`/admin/news`)
- **TN-4.1**: Page renders "News Management" heading
- **TN-4.2**: DataTable renders with title, author, category, status columns
- **TN-4.3**: New Post button navigates to `/admin/news/new`
- **TN-4.4**: Edit button navigates to `/admin/news/[id]/edit`
- **TN-4.5**: TogglePublishButton toggles published/draft state
- **TN-4.6**: Search filters by title

### 5. News Create (`/admin/news/new`)
- **TN-5.1**: Form renders with title, slug, excerpt, category, tags, cover image, content fields
- **TN-5.2**: Slug auto-generates from title
- **TN-5.3**: Validation errors show for empty title
- **TN-5.4**: Creating a post redirects to `/admin/news`

### 6. News Edit (`/admin/news/[id]/edit`)
- **TN-6.1**: Form pre-populated with existing post data
- **TN-6.2**: Editing a post redirects to `/admin/news`

### 7. Disputes (`/admin/disputes`)
- **TDU-7.1**: Page renders "Disputes" heading
- **TDU-7.2**: DataTable renders with filed date, patient, case, status
- **TDU-7.3**: View link navigates to `/admin/disputes/[id]`
- **TDU-7.4**: Search filters by patient name

### 8. Dispute Detail (`/admin/disputes/[id]`)
- **TDU-8.1**: Page renders original opinion and patient dispute reason
- **TDU-8.2**: PENDING status shows triage section with adminNotes textarea and Dismiss/Mark Valid
- **TDU-8.3**: UNDER_REVIEW status shows Assign Peer Review section
- **TDU-8.4**: PEER_REVIEW_ASSIGNED status shows resolve section
- **TDU-8.5**: Resolved dispute shows resolution text
- **TDU-8.6**: Back link navigates to `/admin/disputes`

### 9. Edge Cases (`/admin/edge-cases`)
- **TE-9.1**: Page renders "Edge Cases" heading
- **TE-9.2**: Shows cases unmatched for >4h with patient name and hours open
- **TE-9.3**: Alert button opens modal with message prefilled
- **TE-9.4**: Assign button links to `/admin/cases`
- **TE-9.5**: Empty state shows "No pending edge cases" message

### 10. Audit Logs (`/admin/audit-logs`)
- **TAL-10.1**: Page renders "Audit Logs" heading with total count
- **TAL-10.2**: DataTable renders with time, user, action, resource, details columns
- **TAL-10.3**: Search filters by user name or email

### 11. Data Requests (`/admin/data-requests`)
- **TDR-11.1**: Page renders "Data Requests" heading
- **TDR-11.2**: DataTable renders with requested date, patient, status, execute after
- **TDR-11.3**: Search filters by patient name

### 12. Navigation & Routing
- **TNAV-12.1**: All nav links navigate to correct pages
- **TNAV-12.2**: Admin user can access all admin pages without redirect
- **TNAV-12.3**: Sign out redirects to homepage

### 13. Edge Cases & Errors
- **TE2-13.1**: Loading states show skeleton tables
- **TE2-13.2**: Empty states show "No results" message in DataTable
- **TE2-13.3**: API errors surface error messages (if applicable)
