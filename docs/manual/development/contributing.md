# Contributing Guidelines

How to contribute to the Dr. Bubal Care platform.

## Code of Conduct

- Be respectful and constructive in all interactions
- Focus on the technical problem, not the person
- Accept feedback gracefully and apply it to improve the work
- Ask for help when stuck — escalating is always acceptable

## Getting Started

1. **Set up your environment** — follow the [Setup Guide](setup.md)
2. **Pick an issue** — look for issues labeled `good first issue` or `help wanted`
3. **Create a branch** — branch off `main` with a descriptive name:
   ```bash
   git checkout -b feature/add-lab-export
   git checkout -b fix/case-status-transition
   ```
4. **Make changes** — follow the conventions below
5. **Test your changes** — run the test suite and verify locally
6. **Open a pull request** — describe what you changed and why

## Development Workflow

### Branch Naming

Use descriptive prefixes:

| Prefix | Purpose |
|--------|---------|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `refactor/` | Code restructuring without behavior change |
| `test/` | Adding or updating tests |

### Local Development

```bash
pnpm dev          # Start dev server
npx vitest        # Run tests in watch mode
pnpm lint         # Check for lint errors
```

### Before Committing

1. Run `pnpm lint` — fix any errors
2. Run `npx vitest run` — ensure all tests pass
3. Run `npx tsc --noEmit` — check for type errors
4. Review your diff — make sure only intended changes are included

## Pull Request Guidelines

### PR Title

Use a clear, descriptive title. Follow conventional commit format:

```
feat: add lab result export to PDF
fix: resolve case status not updating after opinion signed
docs: update setup instructions for pnpm
refactor: extract audit logging into shared service
test: add integration tests for GDPR data export
```

### PR Description

Include:

- **What** — a brief description of the change
- **Why** — the problem this solves or the feature this adds
- **How** — approach taken, alternatives considered (if any)
- **Screenshots** — if the change affects the UI
- **Testing** — how you tested the change

### PR Scope

- Keep PRs focused on a single change
- If a feature requires multiple steps, break it into smaller PRs that each leave the codebase in a working state
- Avoid mixing unrelated changes in the same PR

## Code Style

### TypeScript

- Use TypeScript for all new code
- Prefer explicit types over `any`
- Use the `@/*` path alias for imports from the project root
- Import types with `import type` when the import is only used as a type

### React

- Use React Server Components by default — add `"use client"` only when the component needs browser APIs, event handlers, or hooks
- Keep components focused — one component per file
- Co-locate component-specific types and helpers with the component

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `phi-stripper.ts`, `use-cases.ts` |
| Components | PascalCase | `PatientLayout.tsx`, `CaseStatusTracker.tsx` |
| Functions | camelCase | `stripPHI()`, `useCases()` |
| Types/Interfaces | PascalCase | `CaseStatus`, `CreateCaseInput` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| Zod schemas | camelCase with `Schema` suffix | `createCaseSchema` |

### Zod Schemas

- Define schemas in `lib/schemas/` with one schema per domain
- Export both the schema and the inferred TypeScript type
- Use descriptive field names and validation messages

### API Routes

- Validate all inputs with Zod before processing
- Return `{ error: string }` for error responses
- Use `Cache-Control: private, no-store` for any route returning user data
- Check session and role before accessing data

## Review Process

All PRs require at least one review before merging.

### As a Reviewer

- Focus on correctness, security, and maintainability
- Check that tests cover the changed behavior
- Verify no PHI or secrets are exposed
- Confirm the change follows existing patterns

### As an Author

- Respond to all review comments
- Make requested changes in new commits (don't force-push during review)
- Re-request review after addressing feedback

## Issue Guidelines

### Bug Reports

Include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or logs (if applicable)
- Browser and OS information

### Feature Requests

Include:

- Problem the feature solves
- Proposed solution (if you have one)
- User stories or acceptance criteria
- Any constraints or requirements

### Security Issues

Do **not** open a public issue for security vulnerabilities. Report them privately to the maintainers.

## Sensitive Data

- Never commit `.env`, `.env.local`, or any file containing secrets
- Never commit patient data or PHI in test fixtures — use synthetic data
- Use mock data in tests — never call real external services
- Ensure AI test calls use mocked AI modules, not real LLM APIs
