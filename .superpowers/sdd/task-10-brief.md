### Task 10: Patient Report Delivery

**Files:**
- Modify: `app/patient/cases/[id]/page.tsx`

**Interfaces:**
- Consumes: SpecialistOpinion model (via GET /api/cases/[id])
- Produces: Patient case detail page with parsed opinion sections

- [ ] **Step 1: Read existing page and API**

Read: `app/patient/cases/[id]/page.tsx`
Read: `app/api/cases/[id]/route.ts`
Check: Does the GET API include opinions with specialist info?

- [ ] **Step 2: Update GET /api/cases/[id] to include opinions**

If the API doesn't already include opinions, update it to:
```typescript
include: {
  patient: { select: { name: true } },
  specialist: { select: { name: true } },
  records: true,
  opinions: {
    where: { status: { in: ['SIGNED', 'DELIVERED'] } },
    include: { specialist: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 1,
  },
  aiPrescreens: {
    orderBy: { generatedAt: 'desc' },
    take: 1,
  },
}
```

- [ ] **Step 3: Add opinion display section to the patient case page**

After the AI Pre-screen card, add a new section:

```tsx
{/* Specialist Opinion */}
{caseData.opinions && caseData.opinions.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
  >
    <h2 className="font-semibold text-text-medical-black mb-4 flex items-center gap-2">
      <CheckCircle2 className="size-4 text-healing-teal" />
      Specialist Opinion
    </h2>
    <div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
      <User className="size-3" />
      {caseData.opinions[0].specialist.name}
      <span className="text-on-surface-variant/50">&middot;</span>
      <Calendar className="size-3" />
      {formatDate(caseData.opinions[0].signedAt || caseData.opinions[0].createdAt)}
    </div>
    <div className="space-y-4">
      {parseOpinionSections(caseData.opinions[0].content).map((section, i) => (
        <div key={i}>
          <h3 className="text-sm font-semibold text-clinical-navy mb-1">{section.title}</h3>
          <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{section.body}</p>
        </div>
      ))}
    </div>
  </motion.div>
)}
```

Add these imports if missing: `CheckCircle2`, `User`, `Calendar`
Add the `parseOpinionSections` helper function.

- [ ] **Step 4: Test**

Run: `npx next dev --turbopack`
Navigate: `/patient/cases/[id]` where an opinion has been signed
Verify: Opinion displays with specialist name, date, parsed sections

- [ ] **Step 5: Commit**

```bash
git add app/patient/cases/[id]/page.tsx app/api/cases/
git commit -m "feat: display specialist opinion on patient case detail page"
```
