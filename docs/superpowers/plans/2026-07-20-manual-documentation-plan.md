# Dr. Bubal Care — Manual Documentation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create comprehensive manual documentation for the Dr. Bubal Care platform covering architecture, APIs, database schema, user guides, development, deployment, and security/compliance.

**Architecture:** Documentation will be organized in a `docs/manual/` directory with clear separation of concerns. Each documentation file will be self-contained but cross-referenced. Documentation will be written in Markdown format for easy maintenance and version control.

**Tech Stack:** Markdown, Mermaid (for diagrams), Prisma (for schema docs), Next.js (for API docs)

## Global Constraints

- Documentation must be accurate and up-to-date with the codebase
- All code examples must be tested and working
- Follow existing documentation style and conventions
- Use Mermaid for diagrams where appropriate
- Keep documentation DRY — cross-reference instead of duplicating

---

## Documentation Structure

```
docs/manual/
├── README.md                    # Documentation index and overview
├── architecture/
│   ├── system-overview.md       # High-level system architecture
│   ├── data-flow.md            # Data flow diagrams
│   ├── security-model.md       # Security architecture
│   └── ai-feature-layer.md     # AI feature architecture
├── database/
│   ├── schema-reference.md     # Complete schema documentation
│   ├── enums.md               # Enum definitions and usage
│   ├── relationships.md       # Entity relationships
│   └── migrations.md          # Migration history and procedures
├── api/
│   ├── authentication.md      # Auth flows and endpoints
│   ├── patient-api.md         # Patient-specific endpoints
│   ├── doctor-api.md          # Doctor-specific endpoints
│   ├── admin-api.md           # Admin-specific endpoints
│   ├── ai-api.md              # AI feature endpoints
│   └── error-handling.md      # Error codes and handling
├── guides/
│   ├── patient-guide.md       # Patient user guide
│   ├── specialist-guide.md    # Specialist user guide
│   ├── admin-guide.md         # Admin user guide
│   └── getting-started.md     # Quick start guide
├── development/
│   ├── setup.md               # Development environment setup
│   ├── architecture.md        # Code architecture and patterns
│   ├── testing.md             # Testing strategy and procedures
│   └── contributing.md        # Contribution guidelines
├── deployment/
│   ├── production.md          # Production deployment guide
│   ├── environment-vars.md    # Environment variable reference
│   └── monitoring.md          # Monitoring and alerting
└── compliance/
    ├── gdpr.md                # GDPR compliance procedures
    ├── hipaa.md               # HIPAA compliance procedures
    └── audit-logging.md       # Audit logging procedures
```

---

## Task 1: Documentation Index and Overview

**Files:**
- Create: `docs/manual/README.md`

**Purpose:** Central index linking to all documentation sections with brief descriptions.

- [ ] **Step 1: Create documentation index**

```markdown
# Dr. Bubal Care Documentation

## Overview

This documentation covers the Dr. Bubal Care AI-assisted diagnostic coordination platform. The platform bridges geographical barriers between patients and board-certified specialists by automating the coordination layer while ensuring every clinical decision is made by a human specialist.

**Core Principle:** *"AI surfaces; specialists decide."*

## Documentation Sections

### [Architecture](architecture/)
- [System Overview](architecture/system-overview.md) - High-level architecture and components
- [Data Flow](architecture/data-flow.md) - How data moves through the system
- [Security Model](architecture/security-model.md) - Security architecture and controls
- [AI Feature Layer](architecture/ai-feature-layer.md) - AI features and safety principles

### [Database](database/)
- [Schema Reference](database/schema-reference.md) - Complete database schema
- [Enums](database/enums.md) - Enum definitions and usage
- [Relationships](database/relationships.md) - Entity relationships
- [Migrations](database/migrations.md) - Migration procedures

### [API Reference](api/)
- [Authentication](api/authentication.md) - Auth flows and endpoints
- [Patient API](api/patient-api.md) - Patient-specific endpoints
- [Doctor API](api/doctor-api.md) - Doctor-specific endpoints
- [Admin API](api/admin-api.md) - Admin-specific endpoints
- [AI API](api/ai-api.md) - AI feature endpoints
- [Error Handling](api/error-handling.md) - Error codes and handling

### [User Guides](guides/)
- [Patient Guide](guides/patient-guide.md) - How to use the patient portal
- [Specialist Guide](guides/specialist-guide.md) - How to use the specialist portal
- [Admin Guide](guides/admin-guide.md) - How to use the admin portal
- [Getting Started](guides/getting-started.md) - Quick start guide

### [Development](development/)
- [Setup](development/setup.md) - Development environment setup
- [Architecture](development/architecture.md) - Code architecture and patterns
- [Testing](development/testing.md) - Testing strategy and procedures
- [Contributing](development/contributing.md) - Contribution guidelines

### [Deployment](deployment/)
- [Production](deployment/production.md) - Production deployment guide
- [Environment Variables](deployment/environment-vars.md) - Environment reference
- [Monitoring](deployment/monitoring.md) - Monitoring and alerting

### [Compliance](compliance/)
- [GDPR](compliance/gdpr.md) - GDPR compliance procedures
- [HIPAA](compliance/hipaa.md) - HIPAA compliance procedures
- [Audit Logging](compliance/audit-logging.md) - Audit logging procedures

## Quick Links

- **AGENTS.md** - AI feature layer and diagnostic coordination architecture
- **Prisma Schema** - `prisma/schema.prisma`
- **Package.json** - Dependencies and scripts
- **Environment Variables** - `.env.example`

## Contributing to Documentation

1. Follow the existing Markdown style
2. Use Mermaid for diagrams where appropriate
3. Cross-reference related sections
4. Keep examples up-to-date with code changes
5. Test all code examples before committing
```

- [ ] **Step 2: Commit documentation index**

```bash
git add docs/manual/README.md
git commit -m "docs: add documentation index and structure"
```

---

## Task 2: System Architecture Documentation

**Files:**
- Create: `docs/manual/architecture/system-overview.md`
- Create: `docs/manual/architecture/data-flow.md`
- Create: `docs/manual/architecture/security-model.md`
- Create: `docs/manual/architecture/ai-feature-layer.md`

**Purpose:** Document the high-level system architecture, data flows, security model, and AI features.

- [ ] **Step 1: Create system overview document**

Write `docs/manual/architecture/system-overview.md` containing:
- High-level architecture diagram (Mermaid)
- Component breakdown (Frontend Portals, Backend Services, Core Workflows)
- Technology stack table
- Deployment architecture diagram

- [ ] **Step 2: Create data flow document**

Write `docs/manual/architecture/data-flow.md` containing:
- Patient case workflow sequence diagram
- Specialist review flow diagram
- AI feature triggers flowchart

- [ ] **Step 3: Create security model document**

Write `docs/manual/architecture/security-model.md` containing:
- Authentication flow sequence diagram
- Role-based access control table
- PHI protection methods
- Encryption layers
- Audit logging overview
- AI safety principles
- Compliance controls (GDPR, HIPAA)

- [ ] **Step 4: Create AI feature layer document**

Write `docs/manual/architecture/ai-feature-layer.md` containing:
- Overview of 6 AI features with descriptions
- PHI stripping table
- Watermarking mechanism
- Error handling scenarios
- Integration points and state transitions

- [ ] **Step 5: Commit architecture documentation**

```bash
git add docs/manual/architecture/
git commit -m "docs: add system architecture documentation"
```

---

## Task 3: Database Documentation

**Files:**
- Create: `docs/manual/database/schema-reference.md`
- Create: `docs/manual/database/enums.md`
- Create: `docs/manual/database/relationships.md`
- Create: `docs/manual/database/migrations.md`

**Purpose:** Complete database schema documentation including models, enums, relationships, and migration procedures.

- [ ] **Step 1: Create schema reference document**

Write `docs/manual/database/schema-reference.md` containing:
- Core models (User, Doctor, Case, SpecialistOpinion) with Prisma code
- AI models (AIPrescreen, PlainLanguageSummary, OpinionSynthesis)
- Compliance models (AuditLog, Dispute, ConsentRecord, DataDeletionRequest)
- Data models (LabResult, LabMetric, Appointment)

- [ ] **Step 2: Create enums document**

Write `docs/manual/database/enums.md` containing:
- All enum definitions with Prisma code
- State transition diagrams
- Usage guidelines and best practices

- [ ] **Step 3: Create relationships document**

Write `docs/manual/database/relationships.md` containing:
- Entity relationship diagram (Mermaid ER diagram)
- One-to-one, one-to-many relationship tables
- Cascade behaviors
- Index strategy

- [ ] **Step 4: Create migrations document**

Write `docs/manual/database/migrations.md` containing:
- Common migration commands
- Migration history by phase
- Best practices for migrations
- Troubleshooting guide

- [ ] **Step 5: Commit database documentation**

```bash
git add docs/manual/database/
git commit -m "docs: add database schema documentation"
```

---

## Task 4: API Documentation

**Files:**
- Create: `docs/manual/api/authentication.md`
- Create: `docs/manual/api/patient-api.md`
- Create: `docs/manual/api/doctor-api.md`
- Create: `docs/manual/api/admin-api.md`
- Create: `docs/manual/api/ai-api.md`
- Create: `docs/manual/api/error-handling.md`

**Purpose:** Complete API reference for all endpoints.

- [ ] **Step 1: Create authentication documentation**

Write `docs/manual/api/authentication.md` containing:
- Login, register, logout endpoints
- Session structure
- Middleware protection code
- Security notes

- [ ] **Step 2: Create patient API documentation**

Write `docs/manual/api/patient-api.md` containing:
- Cases CRUD endpoints
- File upload endpoints
- Reports and opinions endpoints
- Follow-up Q&A endpoints
- Lab results and trends endpoints

- [ ] **Step 3: Create doctor API documentation**

Write `docs/manual/api/doctor-api.md` containing:
- Assigned cases endpoints
- Opinion CRUD endpoints
- File access endpoints
- Validation rules

- [ ] **Step 4: Create admin API documentation**

Write `docs/manual/api/admin-api.md` containing:
- Specialist management endpoints
- Case routing endpoints
- Dispute management endpoints
- Audit log endpoints
- Data requests endpoints
- Edge case management endpoints

- [ ] **Step 5: Create AI API documentation**

Write `docs/manual/api/ai-api.md` containing:
- Internal API authentication
- Pre-screening endpoint
- Case routing endpoint
- Summary generation endpoint
- Synthesis endpoint
- Follow-up Q&A endpoint
- Trend analysis endpoint
- Rate limiting

- [ ] **Step 6: Create error handling documentation**

Write `docs/manual/api/error-handling.md` containing:
- Error response format
- HTTP status codes table
- Error codes by category
- Client-side error handling code
- Server-side error handling code
- Logging strategy

- [ ] **Step 7: Commit API documentation**

```bash
git add docs/manual/api/
git commit -m "docs: add API reference documentation"
```

---

## Task 5: User Guides

**Files:**
- Create: `docs/manual/guides/patient-guide.md`
- Create: `docs/manual/guides/specialist-guide.md`
- Create: `docs/manual/guides/admin-guide.md`
- Create: `docs/manual/guides/getting-started.md`

**Purpose:** User-friendly guides for each portal role.

- [ ] **Step 1: Create patient guide**

Write `docs/manual/guides/patient-guide.md` containing:
- Welcome and getting started steps
- Case creation workflow
- File upload instructions
- Report viewing guide
- Follow-up Q&A instructions
- Account management
- FAQ section

- [ ] **Step 2: Create specialist guide**

Write `docs/manual/guides/specialist-guide.md` containing:
- Profile setup and verification
- Case review workflow
- Opinion writing instructions
- AI feature usage
- Best practices
- Common tasks

- [ ] **Step 3: Create admin guide**

Write `docs/manual/guides/admin-guide.md` containing:
- Dashboard overview
- Specialist verification
- Case routing and assignment
- Dispute resolution
- Audit logging
- Edge case management
- Data management
- System monitoring

- [ ] **Step 4: Create getting started guide**

Write `docs/manual/guides/getting-started.md` containing:
- Quick start for each role
- Platform overview
- Key features
- First steps checklist
- Resources and support

- [ ] **Step 5: Commit user guides**

```bash
git add docs/manual/guides/
git commit -m "docs: add user guides for all portals"
```

---

## Task 6: Development Documentation

**Files:**
- Create: `docs/manual/development/setup.md`
- Create: `docs/manual/development/architecture.md`
- Create: `docs/manual/development/testing.md`
- Create: `docs/manual/development/contributing.md`

**Purpose:** Developer documentation for setup, architecture, testing, and contributions.

- [ ] **Step 1: Create setup documentation**

Write `docs/manual/development/setup.md` containing:
- Prerequisites
- Installation steps
- Environment setup
- Database setup
- Project structure
- Development workflow
- IDE setup
- Troubleshooting

- [ ] **Step 2: Create architecture documentation**

Write `docs/manual/development/architecture.md` containing:
- Directory structure
- Design patterns (API routes, React Query hooks, Zod schemas)
- State management
- Security patterns
- Performance patterns

- [ ] **Step 3: Create testing documentation**

Write `docs/manual/development/testing.md` containing:
- Test types (unit, integration, component)
- Test configuration
- Running tests
- Coverage goals
- Critical test areas
- Mocking strategies
- CI/CD integration

- [ ] **Step 4: Create contributing documentation**

Write `docs/manual/development/contributing.md` containing:
- Code of conduct
- Getting started
- Development workflow
- Pull request guidelines
- Code style
- Review process
- Issue guidelines

- [ ] **Step 5: Commit development documentation**

```bash
git add docs/manual/development/
git commit -m "docs: add development documentation"
```

---

## Task 7: Deployment Documentation

**Files:**
- Create: `docs/manual/deployment/production.md`
- Create: `docs/manual/deployment/environment-vars.md`
- Create: `docs/manual/deployment/monitoring.md`

**Purpose:** Production deployment guide, environment variables reference, and monitoring procedures.

- [ ] **Step 1: Create production deployment guide**

Write `docs/manual/deployment/production.md` containing:
- Prerequisites
- Deployment steps
- Database setup
- Post-deployment verification
- Rollback procedure
- Backup strategy
- Security checklist

- [ ] **Step 2: Create environment variables documentation**

Write `docs/manual/deployment/environment-vars.md` containing:
- Required variables (DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY)
- Optional variables (UPLOAD_DIR, EMAIL_API_KEY)
- Development vs production variables
- Security notes
- Troubleshooting

- [ ] **Step 3: Create monitoring documentation**

Write `docs/manual/deployment/monitoring.md` containing:
- Monitoring areas (application, database, AI, security)
- Alert rules (critical, warning, info)
- Logging strategy
- Dashboards
- Incident response
- Compliance monitoring
- Scaling considerations

- [ ] **Step 4: Commit deployment documentation**

```bash
git add docs/manual/deployment/
git commit -m "docs: add deployment and monitoring documentation"
```

---

## Task 8: Compliance Documentation

**Files:**
- Create: `docs/manual/compliance/gdpr.md`
- Create: `docs/manual/compliance/hipaa.md`
- Create: `docs/manual/compliance/audit-logging.md`

**Purpose:** GDPR, HIPAA, and audit logging compliance procedures.

- [ ] **Step 1: Create GDPR documentation**

Write `docs/manual/compliance/gdpr.md` containing:
- Data subject rights (access, erasure, rectification, portability)
- Consent management
- Data processing legal basis
- Data minimization
- Storage limitation
- Breach notification
- DPO contact
- International transfers

- [ ] **Step 2: Create HIPAA documentation**

Write `docs/manual/compliance/hipaa.md` containing:
- PHI definition and handling
- Administrative safeguards
- Physical safeguards
- Technical safeguards
- Business associate agreements
- PHI handling procedures
- Breach response
- Risk assessment
- Minimum necessary rule

- [ ] **Step 3: Create audit logging documentation**

Write `docs/manual/compliance/audit-logging.md` containing:
- Audit log schema
- Logged actions by category
- Logging implementation code
- Retention policy
- Access control
- Alert rules
- Querying audit logs
- Best practices

- [ ] **Step 4: Commit compliance documentation**

```bash
git add docs/manual/compliance/
git commit -m "docs: add compliance documentation"
```

---

## Implementation Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | 1 | Documentation index |
| 2 | 4 | System architecture |
| 3 | 4 | Database schema |
| 4 | 6 | API reference |
| 5 | 4 | User guides |
| 6 | 4 | Development docs |
| 7 | 3 | Deployment docs |
| 8 | 3 | Compliance docs |
| **Total** | **29** | **Complete documentation suite** |

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-20-manual-documentation-plan.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?