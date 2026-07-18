### Task 1: Schema Migration — Add Verified to Doctor

**Files:**
- Modify: `prisma/schema.prisma:97-113`

**Interfaces:**
- Consumes: existing Doctor model
- Produces: Doctor model with `verified` field

- [ ] **Step 1: Add verified field to Doctor model**

In `prisma/schema.prisma`, add `verified` field to the Doctor model after `imageUrl`:

```prisma
model Doctor {
  id            String   @id @default(cuid())
  userId        String   @unique
  specialty     String
  experience    String
  rating        Float    @default(0)
  reviewCount   Int      @default(0)
  locationType  String   @default("Telehealth & In-person")
  bio           String?
  imageUrl      String?
  verified      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  services      DoctorService[]
  appointments  Appointment[]     @relation("DoctorAppointments")
}
```

- [ ] **Step 2: Run Prisma migration**

Run: `npx prisma migrate dev --name add_doctor_verified`
Expected: Migration created successfully, Prisma client regenerated

- [ ] **Step 3: Verify generated client includes verified**

Run: `npx prisma studio` — check Doctor model has `verified` field
Or: `grep -r "verified" lib/generated/prisma/` — should find the field

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add verified field to Doctor model for specialist verification"
```
