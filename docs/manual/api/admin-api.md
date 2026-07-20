# Admin API

Admin endpoints handle specialist management, case routing, dispute resolution, audit logging, data requests, and edge case management. All endpoints require an authenticated `ADMIN` session.

---

## Specialist Management

### GET `/api/admin/specialists`

List all specialist (doctor) profiles with user info.

**Response (200):**

```json
[
  {
    "id": "doc1...",
    "userId": "usr1...",
    "specialty": "Radiology",
    "experience": 15,
    "rating": 4.8,
    "bio": "Board-certified radiologist...",
    "verified": true,
    "createdAt": "2026-06-01T00:00:00.000Z",
    "user": {
      "id": "usr1...",
      "name": "Dr. Smith",
      "email": "smith@hospital.com",
      "createdAt": "2026-06-01T00:00:00.000Z"
    }
  }
]
```

### PATCH `/api/admin/specialists/[id]/verify`

Verify or unverify a specialist.

**Request Body:**

```json
{
  "verified": true
}
```

**Response (200):** Updated doctor object.

**Errors:**

| Status | Error |
|--------|-------|
| 404 | `"Doctor not found"` |

---

## Case Management

### GET `/api/admin/cases`

List all cases across the platform with patient and specialist info.

**Response (200):**

```json
[
  {
    "id": "clxyz...",
    "patientId": "clabc...",
    "specialistId": "doc1...",
    "serviceType": "SPECIALIST_OPINION",
    "description": "MRI review",
    "status": "UNDER_REVIEW",
    "createdAt": "2026-07-15T10:00:00.000Z",
    "updatedAt": "2026-07-15T10:00:00.000Z",
    "patient": { "name": "John Doe", "email": "john@example.com" },
    "specialist": { "name": "Dr. Smith", "email": "smith@hospital.com" }
  }
]
```

Note: `specialistId` and the `specialist` object are `null` when no specialist is assigned to the case.

### PATCH `/api/admin/cases/[id]/assign`

Assign or reassign a specialist to a case. Setting `specialistId` to `null` unassigns the case.

**Request Body:**

```json
{
  "specialistId": "doc1..."
}
```

**Behavior:**

| `specialistId` | Case Status |
|----------------|-------------|
| Set to a specialist ID | `UNDER_REVIEW` |
| Set to `null` | `OPEN` |

**Response (200):** Updated case object.

**Errors:**

| Status | Error |
|--------|-------|
| 404 | `"Case not found"` |
| 400 | `"Specialist not found or not verified"` |

---

## Dispute Management

### GET `/api/admin/disputes`

List all disputes. Optional status filter.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Filter by dispute status |

**Response (200):**

```json
[
  {
    "id": "disp1...",
    "caseId": "clxyz...",
    "patientId": "clabc...",
    "opinionId": "op1...",
    "reason": "Opinion did not address symptoms",
    "status": "OPEN",
    "createdAt": "2026-07-15T10:00:00.000Z",
    "case": { "id": "clxyz...", "serviceType": "SPECIALIST_OPINION" },
    "patient": { "name": "John Doe", "email": "john@example.com" },
    "opinion": {
      "content": "...",
      "specialist": { "name": "Dr. Smith" }
    }
  }
]
```

### GET `/api/admin/disputes/[id]`

Get full dispute details including case, patient, opinion, specialist, and peer review info.

**Response (200):**

```json
{
  "id": "disp1...",
  "case": { "id": "...", "serviceType": "...", "description": "..." },
  "patient": { "name": "...", "email": "..." },
  "opinion": {
    "content": "...",
    "specialist": { "name": "...", "email": "..." }
  },
  "peerReviewOpinion": null
}
```

### POST `/api/admin/disputes/[id]/triage`

Triage a dispute — mark it as valid or invalid.

**Request Body:**

```json
{
  "valid": true,
  "adminNotes": "Patient concern is valid, proceeding to peer review."
}
```

**Response (200):** Updated dispute object.

### POST `/api/admin/disputes/[id]/resolve`

Resolve a dispute with a resolution and admin notes.

**Request Body:**

```json
{
  "resolution": "Peer review confirms original opinion. No further action.",
  "adminNotes": "Dispute resolved after peer review."
}
```

**Response (200):** Updated dispute object.

### GET `/api/admin/disputes/[id]/peer-review-candidates`

Get a list of specialists eligible to perform a peer review for a dispute.

**Response (200):** Array of candidate specialist objects.

### POST `/api/admin/disputes/[id]/assign-peer-review`

Assign a peer reviewer to a dispute.

**Request Body:**

```json
{
  "specialistId": "doc2..."
}
```

**Response (200):** Created peer review opinion object.

---

## Audit Logs

### GET `/api/admin/audit-logs`

Query audit logs with filtering and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | `number` | `50` | Max results (capped at 100) |
| `offset` | `number` | `0` | Pagination offset |
| `action` | `string` | — | Filter by action type |
| `resourceType` | `string` | — | Filter by resource type |
| `userId` | `string` | — | Filter by user ID |
| `startDate` | `string` | — | ISO 8601 start date |
| `endDate` | `string` | — | ISO 8601 end date |

**Response (200):**

```json
{
  "logs": [
    {
      "id": "log1...",
      "userId": "usr1...",
      "action": "CASE_CREATED",
      "resourceType": "Case",
      "resourceId": "clxyz...",
      "metadata": { "serviceType": "SPECIALIST_OPINION" },
      "timestamp": "2026-07-15T10:00:00.000Z",
      "user": { "name": "John Doe", "email": "john@example.com" }
    }
  ],
  "total": 142
}
```

---

## Data Requests

### GET `/api/admin/data-requests`

List all pending and completed data deletion requests.

**Response (200):**

```json
[
  {
    "id": "del1...",
    "patientId": "clabc...",
    "status": "PENDING",
    "requestedAt": "2026-07-15T10:00:00.000Z",
    "patient": { "name": "John Doe", "email": "john@example.com" }
  }
]
```

---

## Edge Case Management

### GET `/api/admin/edge-cases/pending`

List cases that have been open for more than 4 hours without a specialist assigned.

**Response (200):**

```json
{
  "cases": [
    {
      "id": "clxyz...",
      "serviceType": "SPECIALIST_OPINION",
      "status": "OPEN",
      "createdAt": "2026-07-15T05:00:00.000Z",
      "patient": { "name": "John Doe", "email": "john@example.com" }
    }
  ]
}
```

### POST `/api/admin/edge-cases/urgent-alert`

Send urgent alerts for critical findings to admin and patient.

**Request Body:**

```json
{
  "caseId": "clxyz...",
  "message": "Critical finding: abnormal lab values require immediate attention."
}
```

**Behavior:** Sends notifications to admin team and the patient via WhatsApp/email.

**Response (200):** `{ "success": true }`

**Errors:**

| Status | Error |
|--------|-------|
| 400 | `"caseId and message are required"` |
| 404 | `"Case not found"` |

---

## All Cases (Shared Endpoint)

### GET `/api/cases`

The shared cases endpoint returns data scoped by role. Admins see all cases with patient and specialist details.

**Response (200):** Array of all cases with full details.
