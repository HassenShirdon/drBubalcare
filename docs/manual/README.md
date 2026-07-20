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
