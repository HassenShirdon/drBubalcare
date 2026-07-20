# AI API

Internal AI endpoints power the platform's six AI features. Most endpoints are internal-only (service-to-service) and require the `x-internal-secret` header. The follow-up Q&A endpoint is user-facing.

---

## Internal Authentication

Internal AI endpoints use a shared secret for service-to-service authentication:

```
x-internal-secret: <INTERNAL_API_SECRET>
```

This secret is stored in `process.env.INTERNAL_API_SECRET` and must be included in the `x-internal-secret` header for all internal calls. Requests without this header receive a `401 Unauthorized` response.

Internal calls are triggered automatically by the application (fire-and-forget) and should not be called directly by client code.

---

## Pre-screening

### POST `/api/ai/prescreen/[caseId]`

Generates an AI pre-screening report for a case before a specialist opens it. Triggered automatically after the first file is uploaded to a case.

**Authentication:** `x-internal-secret` header required.

**Request Body:** None.

**Response (200):**

```json
{
  "id": "ps1...",
  "caseId": "clxyz...",
  "findings": "Patient presents with lower back pain radiating to left leg. MRI shows L4-L5 disc herniation with nerve root compression.",
  "differentials": ["Disc herniation", "Spinal stenosis", "Muscular strain"],
  "urgentFlags": [],
  "generatedAt": "2026-07-15T10:05:00.000Z"
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 401 | `"Unauthorized"` (missing/invalid secret) |
| 500 | `"Pre-screening failed"` |

**Trigger:** Automatically called by `POST /api/cases/[id]/records` after the first record is uploaded.

---

## Case Routing

### POST `/api/ai/route/[caseId]`

Matches a case to the most appropriate specialist by subspecialty and availability.

**Authentication:** `x-internal-secret` header required.

**Request Body:** None.

**Response (200):**

```json
{
  "matchedSpecialistId": "doc1...",
  "confidence": 0.92,
  "reasoning": "Case involves radiology review; specialist has matching subspecialty and availability."
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 401 | `"Unauthorized"` |
| 500 | `"Routing failed"` |

---

## Plain-Language Summary

### POST `/api/ai/summary/[opinionId]`

Generates a patient-friendly summary of a specialist opinion. Triggered automatically when an opinion is signed.

**Authentication:** `x-internal-secret` header required.

**Request Body:** None.

**Response (200):**

```json
{
  "id": "summ1...",
  "opinionId": "op1...",
  "content": "Your MRI scan shows a small disc bulge in your lower back. This is a common finding and may explain your back pain. Dr. Smith recommends starting with physical therapy...",
  "generatedAt": "2026-07-15T10:10:00.000Z"
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 401 | `"Unauthorized"` |
| 500 | `"Summary generation failed"` |

**Trigger:** Automatically called by `POST /api/doctor/cases/[id]/opinion` when `sign: true`.

---

## Multi-Opinion Synthesis

### POST `/api/ai/synthesis/[caseId]`

Synthesizes multiple specialist opinions into a consensus summary. Triggered automatically when a case receives 2+ signed opinions.

**Authentication:** `x-internal-secret` header required.

**Request Body:** None.

**Response (200):**

```json
{
  "caseId": "clxyz...",
  "content": "Both specialists agree on the diagnosis of L4-L5 disc herniation. Dr. Smith recommends conservative management while Dr. Jones suggests considering surgical consultation if symptoms persist beyond 6 weeks.",
  "areasOfAgreement": ["Diagnosis", "Initial treatment approach"],
  "areasOfDisagreement": ["Timeline for surgical consultation"],
  "generatedAt": "2026-07-15T11:00:00.000Z"
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 401 | `"Unauthorized"` |
| 500 | `"Synthesis generation failed"` |

**Trigger:** Automatically called by `POST /api/doctor/cases/[id]/opinion` when the case reaches 2+ signed opinions and no synthesis exists yet.

---

## Follow-up Q&A

### POST `/api/ai/followup`

Answer patient questions within the scope of a delivered opinion. This endpoint is user-facing (requires patient session).

**Authentication:** Patient session required.

**Request Body:**

```json
{
  "opinionId": "op1...",
  "question": "What does 'mildly elevated' mean for my cholesterol level?"
}
```

**Response (200):** AI-generated answer scoped to the written opinion content.

**Errors:**

| Status | Error |
|--------|-------|
| 400 | `"opinionId and question are required"` |
| 401 | `"Unauthorized"` |
| 500 | `"Follow-up Q&A failed"` |

---

## Trend Analysis

### POST `/api/ai/trends/[patientId]/analyze`

Generates trend analyses for a patient's lab results. Triggered automatically when new lab results are added.

**Authentication:** `x-internal-secret` header required.

**Request Body:** None.

**Response (200):**

```json
{
  "analyzed": 3
}
```

**Errors:**

| Status | Error |
|--------|-------|
| 401 | `"Unauthorized"` |
| 500 | `"Trend analysis failed"` |

**Trigger:** Automatically called by `POST /api/lab-results` after creating a new lab result.

### GET `/api/ai/trends/[patientId]`

Retrieve existing trend analyses for a patient. User-facing (requires patient session, must own the patient ID).

**Authentication:** Patient session required.

**Response (200):**

```json
[
  {
    "id": "ta1...",
    "patientId": "clabc...",
    "metricName": "Hemoglobin",
    "trend": "decreasing",
    "significance": "statistically_significant",
    "analysis": "Hemoglobin has decreased from 15.2 to 13.8 g/dL over 6 months...",
    "generatedAt": "2026-07-15T10:05:00.000Z"
  }
]
```

---

## Rate Limiting

All AI endpoints are subject to rate limiting via Redis:

| Endpoint Category | Limit |
|-------------------|-------|
| Pre-screening | 10 requests/minute per case |
| Routing | 5 requests/minute |
| Summary generation | 10 requests/minute per opinion |
| Synthesis | 5 requests/minute per case |
| Follow-up Q&A | 20 requests/minute per patient |
| Trend analysis | 10 requests/minute per patient |

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1721049660
```

Exceeding the rate limit returns `429 Too Many Requests`.

---

## AI Safety

All AI endpoints follow these safety principles:

- **PHI Stripping:** Identifiable data (names, DOB, MRN) is removed before any LLM call
- **Audit Logging:** All AI outputs are logged with case/opinion ID, prompt hash, and output hash
- **Watermarking:** All AI outputs are marked as "AI-Generated Draft" in metadata
- **No Diagnosis:** AI never provides definitive clinical diagnoses
- **Human Sign-off:** Every case closes with a human-signed written opinion
