# Data Flow

How data moves through the Dr. Bubal Care platform across key workflows.

## Patient Case Workflow Sequence

```mermaid
sequenceDiagram
    actor Patient
    participant Portal as Patient Portal
    participant API as API Routes
    participant DB as PostgreSQL
    participant Storage as File Storage
    participant AI as AI Orchestrator
    participant LLM as OpenAI
    participant Specialist as Specialist Portal
    participant Email as Email Service

    Patient->>Portal: Register (name, email, country, password)
    Portal->>API: POST /api/auth/register
    API->>DB: Create User (role: PATIENT)
    API-->>Portal: Session created

    Patient->>Portal: Start case, select review type
    Patient->>Portal: Upload clinical records (slides, scans, reports)
    Portal->>API: POST /api/cases (serviceType, description)
    API->>DB: Create Case (status: OPEN)
    API->>Storage: Store encrypted files
    API->>DB: Create CaseRecord entries
    API-->>Portal: Case created

    Patient->>Portal: Select service & pay
    Portal->>API: POST /api/cases/:id/pay
    API->>Stripe: Process payment
    Stripe-->>API: Payment confirmed
    API->>DB: Update case status

    API->>AI: Trigger pre-screening
    AI->>AI: Strip PHI from clinical notes
    AI->>LLM: Prompt with clinical content only
    LLM-->>AI: Pre-screen output
    AI->>DB: Store AIPrescreen
    AI->>DB: Update case status (AI_PRE_SCREENED)

    AI->>AI: Route to specialist (subspecialty match)
    API->>DB: Assign specialist, status: UNDER_REVIEW
    API->>Email: Notify specialist of new case

    Specialist->>Specialist: Review pre-screen + records
    Specialist->>Specialist: Write opinion
    Specialist->>Specialist: Sign and submit

    API->>DB: Store SpecialistOpinion (status: SIGNED)
    API->>AI: Generate plain-language summary
    AI->>LLM: Translate opinion to patient language
    LLM-->>AI: Plain-language content
    AI->>DB: Store PlainLanguageSummary
    API->>DB: Update case status (OPINION_READY)

    API->>Email: Notify patient of report ready
    Patient->>Portal: View report + summary
```

## Specialist Review Flow

```mermaid
sequenceDiagram
    actor Specialist
    participant Portal as Specialist Portal
    participant API as API Routes
    participant DB as PostgreSQL
    participant AI as AI Orchestrator

    Specialist->>Portal: Login
    Portal->>API: Authenticate & verify role
    API-->>Portal: Session + assigned cases list

    Specialist->>Portal: Open assigned case
    Portal->>API: GET /api/cases/:id
    API->>DB: Fetch Case + Records + AIPrescreen
    API-->>Portal: Full case data with AI pre-screen

    Note over Specialist,AI: Specialist reviews AI pre-screen (findings, differentials, urgent flags)
    Note over Specialist,AI: Specialist opens each clinical record

    Specialist->>Portal: Write opinion (findings, impression, next steps)
    Specialist->>Portal: Sign opinion
    Portal->>API: PUT /api/opinions/:id/sign
    API->>DB: Update SpecialistOpinion (status: SIGNED, signedAt: now)

    Note over AI: Plain-language summary generated automatically

    API->>DB: Update Case status (OPINION_READY)
    API-->>Portal: Case closed from specialist perspective
```

## AI Feature Triggers

```mermaid
flowchart TD
    A[Patient Submits Case] --> B{Payment Confirmed?}
    B -->|No| C[Hold Case<br/>Notify Patient]
    B -->|Yes| D[Trigger AI Pre-screening]

    D --> E[PHI Stripper]
    E --> F[LLM Prompt Construction]
    F --> G[OpenAI API Call]
    G --> H[Response Parser]
    H --> I[Store AIPrescreen in DB]
    I --> J[Trigger Case Routing]

    J --> K{Specialist Available?}
    K -->|Yes| L[Match by Subspecialty + Availability]
    K -->|No > 4 hours| M[Alert Admin<br/>Notify Patient with Revised ETA]
    L --> N[Assign Specialist<br/>Update Case Status]

    N --> O[Specialist Writes Opinion]
    O --> P[Specialist Signs Opinion]
    P --> Q[Trigger Plain-language Summary]

    Q --> R[PHI Stripper]
    R --> S[LLM Prompt with Opinion]
    S --> T[OpenAI API Call]
    T --> U[Store PlainLanguageSummary]
    U --> V[Deliver to Patient Portal]

    V --> W{Patient Asks Follow-up?}
    W -->|Yes| X[Trigger Follow-up Q&A]
    W -->|No| Y{Multiple Opinions?}
    X --> Z[Scope Check Against Opinion]
    Z --> AA[LLM Response Within Scope]
    AA --> AB[Store FollowUpQuestion]

    Y -->|2-4 Opinions| AC[Trigger Multi-opinion Synthesis]
    Y -->|1 Opinion| AD[Case Complete]
    AC --> AE[Compare Opinions]
    AE --> AF[Identify Agreements & Disagreements]
    AF --> AG[Store OpinionSynthesis]

    AD --> AH[Close Case]

    subgraph "Trend Analysis - Continuous"
        TI[Patient Lab Results] --> TJ[Track Longitudinal Data]
        TJ --> TK{Statistically Significant Change?}
        TK -->|Yes| TL[Flag in TrendAnalysis]
        TK -->|No| TM[Update Trend Data]
    end
```

## Data Lifecycle

```mermaid
stateDiagram-v2
    [*] --> OPEN: Patient creates case

    OPEN --> AI_PRE_SCREENED: AI pre-screening complete
    AI_PRE_SCREENED --> UNDER_REVIEW: Specialist assigned
    UNDER_REVIEW --> OPINION_READY: Opinion signed
    OPINION_READY --> CLOSED: Patient acknowledges report

    OPEN --> DISPUTED: Patient raises dispute
    AI_PRE_SCREENED --> DISPUTED: Patient raises dispute
    UNDER_REVIEW --> DISPUTED: Patient raises dispute
    OPINION_READY --> DISPUTED: Patient raises dispute
    CLOSED --> DISPUTED: Patient raises dispute

    DISPUTED --> UNDER_REVIEW: Peer review assigned
    DISPUTED --> CLOSED: Dispute resolved/dismissed

    note right of OPEN: Files encrypted at rest\nPHI accessible only to assigned parties
    note right of AI_PRE_SCREENED: AI outputs watermarked\nPHI stripped from LLM calls
    note right of OPINION_READY: Opinion is human-signed\nPlain-language summary generated
    note right of CLOSED: Audit trail complete\nRight to erasure available
```

## File Upload Flow

```mermaid
sequenceDiagram
    actor Patient
    participant Portal
    participant API
    participant Storage as Encrypted Storage

    Patient->>Portal: Select files (slides, DICOM, labs)
    Portal->>Portal: Client-side validation (type, size)
    Portal->>API: POST /api/cases/:id/records (multipart)
    API->>API: Validate file types & size limits
    API->>API: Generate encrypted filename
    API->>Storage: Upload file with encryption
    Storage-->>API: File URL (signed, expiring)
    API->>DB: Create CaseRecord entry
    API-->>Portal: Upload confirmation

    Note over Storage: Files encrypted at rest\nShort-lived signed URLs\nURLs expire after extraction
```

## State Transitions Reference

| Entity | State | Trigger | Next State(s) |
|--------|-------|---------|---------------|
| **Case** | `OPEN` | Payment confirmed | `AI_PRE_SCREENED`, `DISPUTED` |
| **Case** | `AI_PRE_SCREENED` | Specialist assigned | `UNDER_REVIEW`, `DISPUTED` |
| **Case** | `UNDER_REVIEW` | Opinion signed | `OPINION_READY`, `DISPUTED` |
| **Case** | `OPINION_READY` | Patient acknowledges | `CLOSED`, `DISPUTED` |
| **Case** | `DISPUTED` | Admin resolves | `UNDER_REVIEW` (peer review), `CLOSED` |
| **SpecialistOpinion** | `DRAFT` | Specialist saves | `SIGNED` |
| **SpecialistOpinion** | `SIGNED` | Specialist submits | `DELIVERED` |
| **SpecialistOpinion** | `DELIVERED` | Patient disputes | `DISPUTED` |
| **OpinionSynthesis** | `PENDING` | 2+ opinions received | `GENERATED` |
| **OpinionSynthesis** | `GENERATED` | Delivered to patient | `DELIVERED` |
