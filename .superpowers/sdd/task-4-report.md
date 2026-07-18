# Task 4: Migrate Admin Specialists to DataTable

## What Was Implemented

Replaced the raw HTML table in the admin specialists page with the shared `DataTable` component from Task 1, gaining:

- **Column sorting** via `DataTableColumnHeader` on Name, Specialty, Status, and Joined columns
- **Column visibility** toggle via the `DataTableViewOptions` dropdown (built into DataTable)
- **Client-side search** by name/email via DataTable's built-in search input
- **Tab filter** for verified/unverified/all verification status (preserved from original)
- **Pagination** via DataTable's built-in pagination controls

### Files Created/Modified

| File | Action |
|------|--------|
| `app/admin/specialists/columns.tsx` | **Created** — Column definitions with custom cells, sort accessors, and filter functions |
| `app/admin/specialists/page.tsx` | **Replaced** — Swapped raw HTML table for `<DataTable>` component |

## Build Verification

`npx tsc --noEmit` — **passed with zero errors**.

## Commit

`6a97f3a` — `feat: migrate admin specialists to DataTable with sorting, filtering, column visibility`

## Self-Review Notes

- Code follows plan spec exactly
- All four columns have `DataTableColumnHeader` for sortable headers
- Name column has custom cell rendering (name + email stacked) and a custom `filterFn` for search
- Verified column has custom badge rendering and a tab-compatible `filterFn`
- Joined column formats dates in US locale
- Tab filter (all/verified/unverified) is preserved and works alongside DataTable search

## Concerns

1. **VerifyButton removed**: The old page had an "Action" column with `<VerifyButton>` for verifying specialists inline. The new DataTable page drops this column. If inline verification is still needed, a new "Actions" column should be added to `columns.tsx` in a follow-up task.
