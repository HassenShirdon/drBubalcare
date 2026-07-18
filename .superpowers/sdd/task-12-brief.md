### Task 12: E2E Test

**Files:**
- Create: `__tests__/e2e/specialist-opinion-workflow.test.ts`

**Interfaces:**
- Tests the full specialist opinion workflow across all API endpoints

- [ ] **Step 1: Check existing test patterns**

Read any existing test files in `__tests__/` to understand the test pattern.

- [ ] **Step 2: Create E2E test**

Create `__tests__/e2e/specialist-opinion-workflow.test.ts`:

The test should:
1. Admin creates a case for a patient (POST /api/cases)
2. Admin verifies a doctor (PATCH /api/admin/specialists/[id]/verify)
3. Admin assigns case to doctor (PATCH /api/admin/cases/[id]/assign)
4. Doctor saves draft opinion (POST /api/doctor/cases/[id]/opinion)
5. Doctor signs opinion (POST /api/doctor/cases/[id]/opinion with sign: true)
6. Patient can view signed opinion (GET /api/cases/[id])
7. Patient cannot see draft opinions

Use `vi.mock` for auth mocking. Use `describe`, `it`, `expect` from vitest.

- [ ] **Step 3: Run test**

Run: `npx vitest run __tests__/e2e/specialist-opinion-workflow.test.ts`

- [ ] **Step 4: Commit**

```bash
git add __tests__/e2e/specialist-opinion-workflow.test.ts
git commit -m "test: add E2E test for specialist opinion workflow"
```
