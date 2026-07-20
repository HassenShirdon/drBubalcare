# Patient API

Patient endpoints handle case management, file uploads, records, follow-up Q&A, and lab results. All endpoints require an authenticated `PATIENT` session.

---

## Cases

### GET `/api/cases`

List all cases for the authenticated patient.

**Response (200):**

```json
[
  {
    "id": "clxyz...",
    "patientId": "clabc...",
    "serviceType": "SPECIALIST_OPINION",
    "description": "Need review of MRI scan",
    "status": "UNDER_REVIEW",
    "createdAt": "2026-07-15T10:00:00.000Z",
    "updatedAt": "2026-07-15T10:00:00.000Z",
    "records": [ ... ],
    "opinions": [
      {
        "id": "op1...",
        "content": "...",
        "status": "SIGNED",
        "specialist": { "name": "Dr. Smith" }
      }
    ],
    "aiPrescreens": [ ... ]
  }
]
```

### POST `/api/cases`

Create a new case.

**Request Body:**

```json
{
  "serviceType": "SPECIALIST_OPINION",
  "description": "Need review of MRI scan from July 2026"
}
```

**Service types:** `SPECIALIST_OPINION`, `RESULT_INTERPRETATION`, `FOLLOW_UP`, `TREND_ANALYSIS`

**Response (201):**

```json
{
  "id": "clxyz...",
  "patientId": "clabc...",
  "serviceType": "SPECIALIST_OPINION",
  "description": "Need review of MRI scan",
  "status": "OPEN",
  "createdAt": "2026-07-15T10:00:00.000Z"
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 400 | Validation errors (field-level) |
| 403 | `"Only patients can create cases"` |

### GET `/api/cases/[id]`

Get a single case with full details including patient info, specialist info, records, opinions, and AI prescreens.

**Access:** Patient must own the case.

**Response (200):** Full case object with related records, opinions, and AI prescreens.

---

## File Upload

### POST `/api/cases/[id]/records`

Upload files to a case. Triggers AI pre-screening after the first file upload.

**Request:** `multipart/form-data` with field `files` (one or more files).

**Allowed file types:**

| MIME Type | Description |
|-----------|-------------|
| `application/pdf` | PDF documents |
| `image/jpeg` | JPEG images |
| `image/png` | PNG images |
| `image/webp` | WebP images |
| `application/dicom` | DICOM medical scans |
| `text/plain` | Text files |

**Constraints:**

- Maximum file size: 50 MB per file
- Multiple files supported in a single request

**Response (201):**

```json
[
  {
    "id": "rec1...",
    "caseId": "clxyz...",
    "fileUrl": "/uploads/1721049600000_scan.pdf",
    "fileType": "application/pdf",
    "fileName": "mri-scan.pdf",
    "uploadedAt": "2026-07-15T10:00:00.000Z"
  }
]
```

**Errors:**

| Status | Error |
|--------|-------|
| 400 | `"No files provided"` |
| 400 | `"File type X is not allowed"` |
| 400 | `"File X exceeds 50MB limit"` |

### GET `/api/cases/[id]/records`

List all records for a case.

**Access:** Patient must own the case (doctors must be assigned).

**Response (200):**

```json
[
  {
    "id": "rec1...",
    "caseId": "clxyz...",
    "fileUrl": "/uploads/1721049600000_scan.pdf",
    "fileType": "application/pdf",
    "fileName": "mri-scan.pdf",
    "uploadedAt": "2026-07-15T10:00:00.000Z"
  }
]
```

---

## Disputes

### POST `/api/cases/[id]/disputes`

File a dispute against an opinion in a case.

**Request Body:**

```json
{
  "opinionId": "op1...",
  "reason": "The opinion did not address my symptoms"
}
```

**Response (201):** Created dispute object.

---

## Reports and Opinions

Opinions are accessible via the case detail endpoint (`GET /api/cases/[id]`). Signed opinions include their plain-language summaries.

Patient-visible opinion statuses: `SIGNED`, `DELIVERED`

---

## Follow-up Q&A

### POST `/api/ai/followup`

Ask a follow-up question about a delivered opinion.

**Request Body:**

```json
{
  "opinionId": "op1...",
  "question": "What does 'mildly elevated' mean for my condition?"
}
```

**Response (200):** AI-generated answer within the scope of the written opinion.

---

## Lab Results

### GET `/api/lab-results`

List all lab results for the authenticated patient.

**Response (200):**

```json
[
  {
    "id": "lr1...",
    "patientId": "clabc...",
    "name": "Complete Blood Count",
    "date": "2026-07-10T00:00:00.000Z",
    "doctor": "Dr. Johnson",
    "status": "NORMAL",
    "metrics": [
      {
        "id": "m1...",
        "name": "Hemoglobin",
        "value": 14.2,
        "unit": "g/dL",
        "referenceRange": "12.0-16.0",
        "status": "NORMAL"
      }
    ]
  }
]
```

### POST `/api/lab-results`

Add a new lab result. Triggers trend analysis automatically.

**Request Body:**

```json
{
  "name": "Complete Blood Count",
  "date": "2026-07-10",
  "doctor": "Dr. Johnson",
  "metrics": [
    {
      "name": "Hemoglobin",
      "value": 14.2,
      "unit": "g/dL",
      "referenceRange": "12.0-16.0",
      "status": "NORMAL"
    }
  ]
}
```

**Metric statuses:** `NORMAL`, `HIGH`, `LOW`

**Response (201):** Created lab result with metrics.

### GET `/api/lab-results/[id]`

Get a single lab result with metrics and trend data.

**Access:** Patient must own the lab result.

**Response (200):** Lab result with `metrics` and `trends` arrays.

---

## Data Requests (GDPR)

### POST `/api/patient/data-export`

Request a full export of the patient's data (GDPR Article 20).

**Response (200):**

```json
{
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "...",
    "cases": [ ... ],
    "labResults": [ ... ],
    "consentRecords": [ ... ]
  },
  "format": "json"
}
```

### POST `/api/patient/data-deletion`

Request deletion of all patient data (GDPR Article 17).

**Response (200):** Deletion request object.

### POST `/api/patient/data-deletion/confirm`

Confirm a pending data deletion request.

**Response (200):** `{ "success": true }`

### POST `/api/patient/data-deletion/cancel`

Cancel a pending data deletion request.

**Response (200):** `{ "success": true }`

### GET `/api/patient/consent`

Get current consent records for the patient.

**Response (200):** Consent record object.

### POST `/api/patient/consent`

Update consent for a specific consent type.

**Request Body:**

```json
{
  "consentType": "AI_PROCESSING",
  "granted": true
}
```

**Response (200):** `{ "success": true }`
