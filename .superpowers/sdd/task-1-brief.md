# Task 1: Database Schema Update

**Files:**
- Modify: `prisma/schema.prisma`

**Interfaces:**
- Produces: Updated Prisma schema with `before`/`after` on AuditLog, new Dispute/ConsentRecord/DataDeletionRequest models

- [ ] **Step 1: Add `before` and `after` fields to AuditLog model**

```prisma
model AuditLog {
  id           String   @id @default(cuid())
  userId       String
  action       String
  resourceType String
  resourceId   String
  before       Json?
  after        Json?
  metadata     Json?
  timestamp    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 2: Add DisputeStatus enum and Dispute model**

```prisma
enum DisputeStatus {
  PENDING
  UNDER_REVIEW
  PEER_REVIEW_ASSIGNED
  RESOLVED
  DISMISSED
}

model Dispute {
  id              String   @id @default(cuid())
  caseId          String
  patientId       String
  opinionId       String
  reason          String   @db.Text
  status          DisputeStatus @default(PENDING)
  adminNotes      String?  @db.Text
  resolution      String?  @db.Text
  peerReviewOpinionId String?
  createdAt       DateTime @default(now())
  resolvedAt      DateTime?

  case            Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  patient         User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
  opinion         SpecialistOpinion @relation(fields: [opinionId], references: [id], onDelete: Cascade)
  peerReviewOpinion SpecialistOpinion? @relation(fields: [peerReviewOpinionId], references: [id], onDelete: SetNull)
}
```

- [ ] **Step 3: Add ConsentRecord model**

```prisma
model ConsentRecord {
  id          String   @id @default(cuid())
  patientId   String
  consentType String
  granted     Boolean
  grantedAt   DateTime?
  revokedAt   DateTime?

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@unique([patientId, consentType])
}
```

- [ ] **Step 4: Add DeletionStatus enum and DataDeletionRequest model**

```prisma
enum DeletionStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model DataDeletionRequest {
  id          String   @id @default(cuid())
  patientId   String
  status      DeletionStatus @default(PENDING)
  requestedAt DateTime
  executeAt   DateTime
  completedAt DateTime?

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 5: Add relations to existing models**

Add to `Case` model:
```prisma
  disputes     Dispute[]
```

Add to `User` model:
```prisma
  disputes         Dispute[]
  consentRecords   ConsentRecord[]
  deletionRequests DataDeletionRequest[]
```

Add to `SpecialistOpinion` model:
```prisma
  dispute          Dispute?           @relation("DisputeOpinion")
  peerReviewFor    Dispute?           @relation("PeerReviewOpinion")
```

Update `Dispute` model relations to match:
```prisma
  opinion         SpecialistOpinion @relation("DisputeOpinion", fields: [opinionId], references: [id], onDelete: Cascade)
  peerReviewOpinion SpecialistOpinion? @relation("PeerReviewOpinion", fields: [peerReviewOpinionId], references: [id], onDelete: SetNull)
```

- [ ] **Step 6: Run Prisma generate**

Run: `npx prisma generate`
Expected: Client generated successfully

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add Phase 5 models - AuditLog fields, Dispute, ConsentRecord, DataDeletionRequest"
```
