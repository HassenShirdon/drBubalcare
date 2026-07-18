### Task 10: Patient Report Delivery

**Status:** DONE

**Changes Made:**

1. **API (`app/api/cases/[id]/route.ts`):**
   - Added `where: { status: { in: ['SIGNED', 'DELIVERED'] } }` to filter opinions by status
   - Added `take: 1` to return only the most recent opinion
   - Specialist info already included via `include: { specialist: { select: { name: true } } }`

2. **Page (`app/patient/cases/[id]/page.tsx`):**
   - Added `parseOpinionSections()` helper function that parses opinion content into structured sections by detecting markdown headers (`#`, `##`, `###`) and capitalized labels (`Title:`)
   - Updated opinion display section to show:
     - Single most recent opinion with specialist name and date
     - Parsed sections with title and body
     - Consistent styling with healing-teal accent for CheckCircle2 icon

**Verification:**
- Lint: No new errors introduced (pre-existing `any` types in records.map and other files unchanged)
- TypeScript: No new errors (pre-existing errors in labs pages unchanged)

**Commit:** `5a69a77` — feat: display specialist opinion on patient case detail page

**Concerns:** None
