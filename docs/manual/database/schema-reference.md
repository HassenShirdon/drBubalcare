# Schema Reference

Complete Prisma schema reference for the Dr. Bubal Care database.

## Core Models

### User

The base user model supporting three roles: Patient, Doctor, and Admin.

```prisma
model User {
  id         String    @id @default(cuid())
  name       String?
  email      String    @unique
  emailVerified DateTime?
  image      String?
  passwordHash String?
  role       Role      @default(PATIENT)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  doctorProfile      Doctor?
  patientAppointments Appointment[] @relation("PatientAppointments")
  labResults         LabResult[]
  posts              Post[]
  cases              Case[]         @relation("PatientCases")
  specialistCases    Case[]         @relation("SpecialistCases")
  specialistOpinions SpecialistOpinion[]
  auditLogs          AuditLog[]
  trendAnalyses      TrendAnalysis[]
  disputes           Dispute[]
  consentRecords     ConsentRecord[]
  deletionRequests   DataDeletionRequest[]
}
```

### Doctor

Specialist profile extending User with medical credentials and availability.

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

  user         User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  services     DoctorService[]
  appointments Appointment[]     @relation("DoctorAppointments")
}
```

### Case

A patient's diagnostic case — the central entity in the platform workflow.

```prisma
model Case {
  id           String             @id @default(cuid())
  patientId    String
  specialistId String?
  serviceType  ServiceType
  status       CaseStatus         @default(OPEN)
  description  String?            @db.Text
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  patient      User               @relation("PatientCases", fields: [patientId], references: [id], onDelete: Cascade)
  specialist   User?              @relation("SpecialistCases", fields: [specialistId], references: [id], onDelete: SetNull)
  records      CaseRecord[]
  opinions     SpecialistOpinion[]
  aiPrescreens AIPrescreen[]
  synthesis    OpinionSynthesis?
  disputes     Dispute[]
}
```

### SpecialistOpinion

Written opinion from a board-certified specialist — must be human-signed.

```prisma
model SpecialistOpinion {
  id           String               @id @default(cuid())
  caseId       String
  specialistId String
  content      String
  status       OpinionStatus        @default(DRAFT)
  signedAt     DateTime?
  createdAt    DateTime             @default(now())

  case         Case                 @relation(fields: [caseId], references: [id], onDelete: Cascade)
  specialist   User                 @relation(fields: [specialistId], references: [id], onDelete: Cascade)
  plainSummary PlainLanguageSummary?
  followUps    FollowUpQuestion[]
  dispute          Dispute?           @relation("DisputeOpinion")
  peerReviewFor    Dispute?           @relation("PeerReviewOpinion")
}
```

---

## AI Models

### AIPrescreen

AI pre-screening output generated before specialist review.

```prisma
model AIPrescreen {
  id           String   @id @default(cuid())
  caseId       String
  findings     String
  differentials String?
  urgentFlags  String?
  generatedAt  DateTime @default(now())

  case         Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

### PlainLanguageSummary

Patient-friendly translation of specialist opinions.

```prisma
model PlainLanguageSummary {
  id          String   @id @default(cuid())
  opinionId   String   @unique
  content     String
  generatedAt DateTime @default(now())

  opinion     SpecialistOpinion @relation(fields: [opinionId], references: [id], onDelete: Cascade)
}
```

### OpinionSynthesis

Multi-opinion synthesis when multiple specialists review the same case.

```prisma
model OpinionSynthesis {
  id            String           @id @default(cuid())
  caseId        String           @unique
  content       String           @db.Text
  agreements    String[]
  disagreements String[]
  status        SynthesisStatus  @default(PENDING)
  generatedAt   DateTime         @default(now())

  case          Case             @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

### FollowUpQuestion

Patient follow-up questions answered within opinion scope.

```prisma
model FollowUpQuestion {
  id        String   @id @default(cuid())
  opinionId String
  question  String
  answer    String
  scopeNote String?
  createdAt DateTime @default(now())

  opinion   SpecialistOpinion @relation(fields: [opinionId], references: [id], onDelete: Cascade)
}
```

### TrendAnalysis

Longitudinal lab test trend analysis with significance detection.

```prisma
model TrendAnalysis {
  id          String   @id @default(cuid())
  patientId   String
  metricName  String
  dataPoints  Json
  trend       String
  significant Boolean  @default(false)
  summary     String
  generatedAt DateTime @default(now())

  patient     User     @relation(fields: [patientId], references: [id], onDelete: Cascade)

  @@unique([patientId, metricName])
}
```

---

## Compliance Models

### AuditLog

HIPAA/GDPR compliance logging for all data access and modifications.

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

### Dispute

Patient dispute resolution tracking with peer review support.

```prisma
model Dispute {
  id              String   @id @default(cuid())
  caseId          String
  patientId       String
  opinionId       String?  @unique
  reason          String   @db.Text
  status          DisputeStatus @default(PENDING)
  adminNotes      String?  @db.Text
  resolution      String?  @db.Text
  peerReviewOpinionId String? @unique
  createdAt       DateTime @default(now())
  resolvedAt      DateTime?

  case            Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  patient         User     @relation(fields: [patientId], references: [id], onDelete: Cascade)
  opinion         SpecialistOpinion? @relation("DisputeOpinion", fields: [opinionId], references: [id], onDelete: Cascade)
  peerReviewOpinion SpecialistOpinion? @relation("PeerReviewOpinion", fields: [peerReviewOpinionId], references: [id], onDelete: SetNull)
}
```

### ConsentRecord

GDPR consent management for AI processing.

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

### DataDeletionRequest

GDPR Article 17 right to erasure request tracking.

```prisma
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

---

## Data Models

### CaseRecord

Uploaded files (slides, scans, reports) attached to cases.

```prisma
model CaseRecord {
  id         String   @id @default(cuid())
  caseId     String
  fileUrl    String
  fileType   String
  fileName   String
  uploadedAt DateTime @default(now())

  case       Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
}
```

### LabResult

Patient lab results with metrics and AI interpretation.

```prisma
model LabResult {
  id        String   @id @default(cuid())
  patientId String
  name      String
  date      DateTime
  doctor    String
  status    LabStatus @default(NORMAL)
  icon      String
  aiInterpretation String?
  createdAt DateTime @default(now())

  patient User        @relation(fields: [patientId], references: [id], onDelete: Cascade)
  metrics LabMetric[]
  trends  LabTrendPoint[]
}
```

### LabMetric

Individual lab test values with reference ranges.

```prisma
model LabMetric {
  id             String       @id @default(cuid())
  labResultId    String
  name           String
  referenceRange String
  value          Float
  unit           String
  status         MetricStatus @default(NORMAL)

  labResult LabResult @relation(fields: [labResultId], references: [id], onDelete: Cascade)
}
```

### LabTrendPoint

Longitudinal lab data points for trend analysis.

```prisma
model LabTrendPoint {
  id          String @id @default(cuid())
  labResultId String
  date        String
  value       Float

  labResult LabResult @relation(fields: [labResultId], references: [id], onDelete: Cascade)
}
```

### Appointment

Patient-doctor appointment scheduling.

```prisma
model Appointment {
  id         String             @id @default(cuid())
  patientId  String
  doctorId   String
  date       DateTime
  time       String
  status     AppointmentStatus  @default(SCHEDULED)
  createdAt  DateTime           @default(now())
  updatedAt  DateTime           @updatedAt

  patient User   @relation("PatientAppointments", fields: [patientId], references: [id], onDelete: Cascade)
  doctor  Doctor @relation("DoctorAppointments", fields: [doctorId], references: [id], onDelete: Cascade)
}
```

---

## Supporting Models

### DoctorService

Services offered by a doctor with pricing.

```prisma
model DoctorService {
  id          String   @id @default(cuid())
  doctorId    String
  title       String
  description String?
  price       Float
  createdAt   DateTime @default(now())

  doctor      Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade)
}
```

### Service

Platform service definitions.

```prisma
model Service {
  id          String @id @default(cuid())
  title       String
  description String
  icon        String
  category    String
}
```

### Post

Blog/news posts authored by users.

```prisma
model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  excerpt     String?
  content     String
  coverImage  String?
  category    String?
  tags        String[]
  authorId    String
  published   Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```
