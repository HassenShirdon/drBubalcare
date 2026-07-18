# Task 5 Report: Migrate Doctor Cases to DataTable

## What Was Implemented

Replaced the card-based doctor cases page with a sortable/filterable DataTable.

### New file: `app/doctor/cases/columns.tsx`
- `DoctorCase` type definition matching hook data shape
- 6 columns: Patient (custom filter fn), Service Type, Status (badge), Opinion (badge), Created (formatted date), Actions (link arrow)
- Uses shared constants: `CASE_STATUS_CONFIG`, `SERVICE_TYPE_LABELS`, `OPINION_STATUS_CONFIG`
- Uses `DataTableColumnHeader` for sortable headers

### Modified file: `app/doctor/cases/page.tsx`
- Removed inline card layout, search input, and local config constants
- Added tab filter (All / Pending / Opinion Written) with state management
- Renders `DataTable` component with columns and patient-key search
- Preserved `useDoctorCases()` hook usage
- Added `motion` fade-in animation on header

## Build Verification

`npx tsc --noEmit` — **passed with zero errors**.

## Files Changed

| File | Action |
|------|--------|
| `app/doctor/cases/columns.tsx` | Created |
| `app/doctor/cases/page.tsx` | Replaced |

## Commit

`e73ca26` — feat: migrate doctor cases to DataTable with sorting, filtering, column visibility

## Issues / Concerns

- None. All dependencies (DataTable, column header, constants) were already in place. Build is clean.
