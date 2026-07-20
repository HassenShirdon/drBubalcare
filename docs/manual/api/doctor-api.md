# Doctor (Specialist) API

Specialist endpoints handle assigned case management, opinion writing, and patient information. All endpoints require an authenticated `DOCTOR` session.

---

## Assigned Cases

### GET `/api/doctor/cases`

List all cases assigned to the authenticated specialist.

**Response (200):**

```json
[
  {
    "id": "clxyz...",
    "patientId": "clabc...",
    "specialistId": "doc1...",
    "serviceType": "SPECIALIST_OPINION",
    "description": "MRI review needed",
    "status": "UNDER_REVIEW",
    "createdAt": "2026-07-15T10:00:00.000Z",
    "patient": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "opinions": [
      {
        "id": "op1...",
        "status": "DRAFT",
        "signedAt": null
      }
    ]
  }
]
```

### GET `/api/doctor/cases/[id]`

Get full details of a single assigned case, including patient info, records, AI prescreens, and the specialist's own opinion.

**Access:** Case must be assigned to the authenticated specialist.

**Response (200):**

```json
{
  "id": "clxyz...",
  "patient": { "name": "John Doe", "email": "john@example.com" },
  "records": [ ... ],
  "aiPrescreens": [
    {
      "id": "ps1...",
      "caseId": "clxyz...",
      "findings": "Key findings from clinical notes...",
      "differentials": ["Condition A", "Condition B"],
      "urgentFlags": [],
      "generatedAt": "2026-07-15T10:05:00.000Z"
    }
  ],
  "opinions": [ ... ]
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 404 | `"Case not found"` |

---

## Opinion Management

### GET `/api/doctor/cases/[id]/opinion`

Get the specialist's opinion for a case.

**Response (200):**

```json
{
  "id": "op1...",
  "caseId": "clxyz...",
  "specialistId": "doc1...",
  "content": "Clinical findings and impression...",
  "status": "DRAFT",
  "signedAt": null,
  "createdAt": "2026-07-15T10:00:00.000Z",
  "specialist": { "name": "Dr. Smith" }
}
```

**Response (200):** `null` if no opinion exists yet.

### POST `/api/doctor/cases/[id]/opinion`

Create or update a specialist opinion for a case. If `sign` is true, the opinion is finalized and cannot be edited.

**Request Body:**

```json
{
  "content": "Clinical findings and impression...",
  "sign": false
}
```

**Content format (TipTap JSON or structured text):**

```json
{
  "content": "## Clinical Findings\n\nThe MRI scan shows...\n\n## Impression\n\nMild disc herniation at L4-L5...\n\n## Recommended Next Steps\n\n1. Conservative management\n2. Follow-up in 6 weeks"
}
```

**Behavior:**

| `sign` | Effect |
|--------|--------|
| `false` | Creates/updates opinion with status `DRAFT` |
| `true` | Finalizes opinion with status `SIGNED`, sets `signedAt`, transitions case to `OPINION_READY`, triggers plain-language summary generation |

When a second opinion is signed on the same case, synthesis generation is triggered automatically.

**Response (200):** Opinion object.

**Errors:**

| Status | Error |
|--------|-------|
| 400 | `"Opinion already signed and cannot be edited"` |
| 404 | `"Case not found"` |

---

## File Access

### GET `/api/cases/[id]/records`

Doctors can view records for cases assigned to them. Uses the same endpoint as the patient records endpoint but with doctor access control.

**Access:** Case must be assigned to the authenticated specialist.

**Response (200):** Array of record objects.

---

## Incomplete Upload Flagging

### POST `/api/cases/[id]/flag-incomplete`

Flag a case as having incomplete or unreadable uploads. Sends instructions to the patient.

**Request Body:**

```json
{
  "instructions": "The uploaded MRI scan is blurry. Please re-upload a higher resolution image."
}
```

**Response (200):** `{ "success": true }`

---

## Patient Information

### GET `/api/doctor/patients`

List all patients the specialist has had appointments with, sorted by most recent.

**Response (200):**

```json
[
  {
    "id": "clabc...",
    "name": "John Doe",
    "email": "john@example.com",
    "image": null,
    "appointmentCount": 3,
    "lastVisit": "2026-07-15T10:00:00.000Z"
  }
]
```

---

## Lab Results (Doctor View)

### GET `/api/lab-results/pending-review`

List lab results flagged as needing specialist review.

**Response (200):**

```json
[
  {
    "id": "lr1...",
    "name": "Complete Blood Count",
    "date": "2026-07-10T00:00:00.000Z",
    "status": "REVIEW_NEEDED",
    "patient": { "name": "John Doe", "email": "john@example.com" },
    "metrics": [ ... ]
  }
]
```

---

## Validation Rules

### POST `/api/doctor/cases/[id]/opinion`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `content` | `string` | Yes | Must be provided. Supports plain text or structured markdown. |
| `sign` | `boolean` | No | Defaults to `false`. When `true`, opinion is finalized. |

**Business rules:**
- Case must be assigned to the authenticated specialist (otherwise 404).
- If an existing opinion for this case+specialist already has status `SIGNED`, further edits are rejected with 400.
- When `sign` is `true`, the case status transitions to `OPINION_READY` and plain-language summary generation is triggered.

### POST `/api/cases/[id]/flag-incomplete`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `instructions` | `string` | Yes | Must be provided. Describes what the patient needs to re-upload. |

**Business rules:**
- Case must be assigned to the authenticated specialist (otherwise 404).
