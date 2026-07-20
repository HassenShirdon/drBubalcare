# Development Setup

Everything you need to get the Dr. Bubal Care platform running locally.

## Prerequisites

- **Node.js** v18+ (v20 recommended)
- **pnpm** (preferred package manager)
- **PostgreSQL** database (Supabase or local)
- **Git**
- An editor (VS Code recommended)

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd DrBubalCare

# Install dependencies
pnpm install
```

## Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `APP_URL` | Base URL where the app is hosted (`http://localhost:3000` for local dev). Used for self-referential links, OAuth callbacks, and API endpoints |
| `DATABASE_URL` | PostgreSQL connection string (Supabase or local) |
| `NEXTAUTH_SECRET` | Random string for NextAuth JWT signing. Generate with `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Base URL for auth callbacks (`http://localhost:3000` for local dev) |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `INTERNAL_API_SECRET` | Shared secret for server-to-server API calls (AI routes) |
| `GEMINI_API_KEY` | Gemini AI API key (optional, for alternative AI provider) |

## Database Setup

The project uses Prisma with PostgreSQL (Neon adapter via Supabase).

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to set up the database schema
npx prisma migrate dev

# Seed the database (if a seed script exists)
npx prisma db seed
```

To view and edit the database visually:

```bash
npx prisma studio
```

The Prisma schema is located at `prisma/schema.prisma`. The generated client output is at `lib/generated/prisma`.

## Project Structure

```
DrBubalCare/
├── app/                    # Next.js App Router pages and API routes
│   ├── admin/              # Admin portal pages
│   ├── api/                # API route handlers
│   │   ├── admin/          # Admin-specific endpoints (audit-logs, cases, disputes, edge-cases, specialists)
│   │   ├── ai/             # AI feature endpoints (prescreen, routing, summary, synthesis, trends, followup)
│   │   ├── appointments/   # Appointment management endpoints
│   │   ├── auth/           # Authentication endpoints (login, NextAuth catch-all)
│   │   ├── cases/          # Case CRUD endpoints (records, disputes, flag-incomplete)
│   │   ├── cron/           # Scheduled job endpoints (no-specialist check)
│   │   ├── doctor/         # Doctor-specific endpoints (cases, patients)
│   │   ├── doctors/        # Doctor profile endpoints
│   │   ├── lab-results/    # Lab result endpoints (pending-review)
│   │   ├── news/           # Blog/news endpoints
│   │   └── patient/        # Patient-specific endpoints (consent, data-deletion, data-export)
│   ├── auth/               # Authentication pages (sign-in)
│   ├── doctor/             # Specialist portal pages
│   ├── patient/            # Patient portal pages
│   ├── layout.tsx          # Root layout with fonts and providers
│   ├── Providers.tsx       # Client-side providers (SessionProvider, QueryClientProvider)
│   └── page.tsx            # Landing page
├── assets/                 # Project assets
│   └── uploads/            # Uploaded file storage
├── components/             # Shared React components
│   ├── ui/                 # Base UI primitives (shadcn/ui)
│   └── *.tsx               # Feature components (layouts, forms, etc.)
├── hooks/                  # Shared React hooks
├── lib/                    # Core business logic and utilities
│   ├── actions/            # Server actions
│   ├── ai/                 # AI feature implementations
│   │   ├── client.ts       # AI SDK client configuration
│   │   ├── phi-stripper.ts # PHI removal before AI calls
│   │   ├── prescreen.ts    # Pre-screening logic
│   │   ├── routing.ts      # Specialist matching
│   │   ├── summary.ts      # Plain-language summary
│   │   ├── synthesis.ts    # Multi-opinion synthesis
│   │   ├── followup.ts     # Follow-up Q&A
│   │   ├── trends.ts       # Trend analysis
│   │   └── prompts/        # LLM prompt templates
│   ├── audit/              # Audit logging
│   ├── auth.ts             # NextAuth configuration
│   ├── db.ts               # Prisma client singleton
│   ├── disputes/           # Dispute resolution
│   ├── edge-cases/         # Edge case handling
│   ├── gdpr/               # GDPR data handling
│   ├── hooks/              # Custom React Query hooks
│   ├── notifications/      # Notification service
│   ├── schemas/            # Zod validation schemas
│   ├── stores/             # Zustand state stores
│   └── utils.ts            # Utility functions (cn, etc.)
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets served by Next.js (SVGs, favicons)
├── types/                  # TypeScript type declarations
├── __tests__/              # Test suites
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end workflow tests
├── middleware.ts            # NextAuth middleware (role-based route protection)
├── vitest.config.ts        # Vitest test configuration
└── tsconfig.json           # TypeScript configuration
```

## Development Workflow

Start the development server with Turbopack:

```bash
pnpm dev
```

The app runs at `http://localhost:3000` by default.

Useful commands:

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm start        # Start production server
npx vitest        # Run tests
npx prisma studio # Database GUI
```

## IDE Setup (VS Code)

Recommended extensions:

- **ESLint** — linting integration
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **Prisma** — syntax highlighting and intellisense for `schema.prisma`
- **Pretty TypeScript Errors** — more readable type errors

The project uses the path alias `@/*` mapped to the project root. The VS Code TypeScript server should pick this up from `tsconfig.json` automatically.

## Troubleshooting

**Prisma client not found**
Run `npx prisma generate`. The client output is configured to `lib/generated/prisma` in `schema.prisma`.

**Port 3000 already in use**
Kill the process occupying the port, or start with a different port:
```bash
pnpm dev -- -p 3001
```

**Environment variables not loading**
Ensure you are using `.env.local` (not `.env`). Next.js loads `.env.local` in development automatically. The `dotenv` package is included but Next.js handles env loading for the app layer.

**Build fails with type errors**
Run `npx tsc --noEmit` to isolate type errors. Check that `next-env.d.ts` exists (generated by `next dev`).

**Tests fail with module resolution errors**
The vitest config aliases `@` to the project root. Ensure imports use `@/` prefix for project modules.
