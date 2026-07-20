# Error Handling

Standardized error handling across all Dr. Bubal Care API endpoints.

---

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "error": "Error message or validation error object"
}
```

The `error` field can be:

- A **string** for simple errors: `{ "error": "Unauthorized" }`
- An **object** for validation errors: `{ "error": { "email": ["Invalid email"], "password": ["Too short"] } }`

---

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, PATCH, POST (when returning data) |
| `201` | Created | Successful POST that creates a resource |
| `400` | Bad Request | Validation failure, missing required fields, invalid file type/size |
| `401` | Unauthorized | No session, expired session, or missing `x-internal-secret` for internal endpoints |
| `403` | Forbidden | Authenticated but not authorized (wrong role, wrong ownership) |
| `404` | Not Found | Resource does not exist |
| `429` | Too Many Requests | Rate limit exceeded (AI endpoints) |
| `500` | Internal Server Error | Unexpected server failure |

---

## Error Codes by Category

### Authentication Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 401 | `"Unauthorized"` | No valid session or missing internal secret |
| 403 | `"Forbidden"` | User lacks required role for this endpoint |
| 401 | `"Invalid credentials"` | Wrong email or password (login) |

### Case Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 404 | `"Case not found"` | Case ID does not exist |
| 403 | `"Forbidden"` | Patient doesn't own this case or doctor isn't assigned |
| 403 | `"Only patients can create cases"` | Non-patient trying to create a case |
| 400 | Validation errors | Invalid `serviceType` or missing `description` |

### File Upload Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 400 | `"No files provided"` | Empty file upload |
| 400 | `"File type X is not allowed"` | Unsupported MIME type |
| 400 | `"File X exceeds 50MB limit"` | File too large |

### Opinion Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 400 | `"Opinion already signed and cannot be edited"` | Attempting to modify a signed opinion |
| 404 | `"Case not found"` | Case doesn't exist or isn't assigned to this doctor |

### Dispute Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 400 | Validation errors | Missing `opinionId` or `reason` |
| 400 | Resolution validation errors | Missing `resolution` or `adminNotes` |

### Specialist Management Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 404 | `"Doctor not found"` | Specialist ID does not exist |
| 400 | `"Specialist not found or not verified"` | Specialist not verified for case assignment |

### Edge Case Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 400 | `"caseId and message are required"` | Missing fields for urgent alert |
| 404 | `"Case not found"` | Case doesn't exist |

### Data Request Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 400 | Error message string | GDPR service error (e.g., active case prevents deletion) |

### AI Errors

| HTTP | Error | Description |
|------|-------|-------------|
| 400 | `"opinionId and question are required"` | Missing follow-up fields |
| 401 | `"Unauthorized"` | Missing `x-internal-secret` header |
| 500 | `"Pre-screening failed"` | LLM call failed |
| 500 | `"Routing failed"` | Specialist matching failed |
| 500 | `"Summary generation failed"` | LLM summary call failed |
| 500 | `"Synthesis generation failed"` | LLM synthesis call failed |
| 500 | `"Follow-up Q&A failed"` | LLM Q&A call failed |
| 500 | `"Trend analysis failed"` | Trend analysis computation failed |
| 429 | Rate limit exceeded | Too many AI requests |

---

## Client-Side Error Handling

Handle API errors consistently in client code:

```typescript
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle validation errors (field-level)
    if (typeof data.error === 'object') {
      const fieldErrors = data.error as Record<string, string[]>;
      const message = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('\n');
      throw new Error(message);
    }

    // Handle simple errors
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data as T;
}
```

### Handling File Upload Errors

```typescript
async function uploadFiles(caseId: string, files: File[]) {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await fetch(`/api/cases/${caseId}/records`, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type — browser sets it with boundary
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  return response.json();
}
```

---

## Server-Side Error Handling

All API routes follow this pattern:

```typescript
export async function GET(request: Request) {
  // 1. Auth check
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Role check
  const role = (session.user as { role: string }).role;
  if (role !== 'DOCTOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Input validation
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // 4. Resource existence check
  const resource = await prisma.model.findUnique({ where: { id } });
  if (!resource) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 5. Business logic (try/catch)
  try {
    const result = await doWork();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Operation failed:', error);
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
}
```

---

## Logging Strategy

### Client-Side

- Log failed requests with correlation ID (if provided)
- Do not log PHI or sensitive data
- Report errors to monitoring service (e.g., Sentry)

### Server-Side

All API errors are logged with:

```typescript
console.error('Context description:', error);
```

For audit-critical operations (case creation, opinion signing, dispute resolution), errors are also written to the `AuditLog` table:

```typescript
await logAuditEvent({
  userId,
  action: 'OPERATION_FAILED',
  resourceType: 'Case',
  resourceId: caseId,
  metadata: { error: error.message },
});
```

### Log Levels

| Level | Use |
|-------|-----|
| `console.error` | API failures, LLM call failures, database errors |
| `console.warn` | Rate limit approaching, non-critical edge cases |
| `console.log` | Successful operations (development only) |

### PHI Protection in Logs

- Never log patient names, emails, or medical record numbers
- Never log full file contents or opinion text
- Log only IDs, action types, and timestamps
- LLM prompts/responses are logged without identifiable data
