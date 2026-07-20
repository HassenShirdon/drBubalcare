# Production Deployment

Step-by-step guide for deploying Dr. Bubal Care to production.

## Prerequisites

- **Node.js** v18+ (v20 recommended)
- **pnpm** installed globally
- **Supabase project** (PostgreSQL + Storage)
- **Vercel account** (or compatible Next.js hosting)
- **OpenAI API key** (for AI features)
- **Domain name** configured with DNS
- **SSL certificate** (handled automatically by Vercel)

## Deployment Steps

### 1. Prepare Environment Variables

Copy `.env.example` to `.env.production` and fill in all required values:

```bash
cp .env.example .env.production
```

See [Environment Variables](environment-vars.md) for the complete reference.

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations against production database
npx prisma migrate deploy

# Verify migration status
npx prisma migrate status
```

> **Warning:** Always run `migrate deploy` (not `migrate dev`) in production. This applies migrations without creating new ones.

### 3. Build the Application

```bash
# Install production dependencies
pnpm install --frozen-lockfile

# Run production build
pnpm build

# Run lint check
pnpm lint
```

### 4. Deploy to Vercel

**Option A: Vercel CLI**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy to production
vercel --prod
```

**Option B: Git Integration**

1. Connect your GitHub repository to Vercel
2. Vercel auto-deploys on push to `main`
3. Configure environment variables in Vercel dashboard
4. Set build command: `pnpm build`
5. Set output directory: `.next`

### 5. Post-Deployment Verification

Run these checks after every deployment:

| Check | Command / Action | Expected Result |
|-------|-----------------|-----------------|
| **Health endpoint** | `curl https://your-domain.com/api/health` | `200 OK` |
| **Landing page** | Visit `https://your-domain.com` | Page loads correctly |
| **Patient login** | Sign in with test patient account | Redirects to dashboard |
| **Specialist login** | Sign in with test specialist account | Redirects to dashboard |
| **Admin login** | Sign in with test admin account | Redirects to dashboard |
| **File upload** | Upload a test file as patient | File stored, case created |
| **AI pre-screening** | Create case and check pre-screen | AI output generated |
| **Database connection** | Check Prisma Studio or query logs | No connection errors |
| **SSL certificate** | Browser lock icon | Valid certificate |
| **DNS resolution** | `dig your-domain.com` | Correct IP address |

### 6. Rollback Procedure

If a deployment causes issues:

**Immediate rollback (Vercel):**

1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

**Database rollback:**

```bash
# Check current migration state
npx prisma migrate status

# If needed, create a rollback migration
npx prisma migrate dev --create-only rollback-description

# Apply rollback
npx prisma migrate deploy
```

> **Warning:** Database rollbacks require careful consideration. Test rollbacks in staging first.

### 7. Backup Strategy

#### Database Backups

| Backup Type | Frequency | Retention | Method |
|------------|-----------|-----------|--------|
| **Automated daily** | Daily | 30 days | Supabase automatic backups |
| **Pre-deploy snapshot** | Every deploy | 7 days | Manual backup before migration |
| **Weekly full export** | Weekly | 90 days | pg_dump to encrypted storage |
| **Audit log archive** | Monthly | 7 years | Compliance requirement |

**Manual backup command:**

```bash
# Export database to SQL file
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Or using Supabase CLI
supabase db dump > backup-$(date +%Y%m%d).sql
```

#### File Storage Backups

| Storage | Method | Frequency |
|---------|--------|-----------|
| **Supabase Storage** | Supabase managed | Automatic |
| **Uploaded files** | Sync to S3/GCS | Daily |
| **Local uploads** | Included in git ignore | N/A (not backed up) |

### 8. Security Checklist

Complete before production launch:

- [ ] All environment variables set in production (not hardcoded)
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
- [ ] `INTERNAL_API_SECRET` is set and matches across all services
- [ ] Database connection uses SSL (`?sslmode=require`)
- [ ] Supabase Row-Level Security (RLS) enabled on all tables
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled on API routes
- [ ] File upload size limits configured
- [ ] CSP headers configured
- [ ] HIPAA/GDPR compliance controls active
- [ ] Audit logging verified working
- [ ] PHI stripping verified on AI endpoints
- [ ] Signed URLs enabled for file access
- [ ] Error pages do not expose sensitive information
- [ ] Logs do not contain PHI or secrets
- [ ] SSL certificate valid and auto-renewing

## Production Configuration

### Recommended Vercel Settings

| Setting | Value |
|---------|-------|
| **Node.js Version** | 20.x |
| **Build Command** | `pnpm build` |
| **Output Directory** | `.next` |
| **Install Command** | `pnpm install --frozen-lockfile` |
| **Region** | Closest to primary user base |

### Supabase Production Settings

| Setting | Recommendation |
|---------|---------------|
| **Plan** | Pro or Team |
| **Database** | At least 2 vCPUs, 1GB RAM |
| **Storage** | Enable encryption at rest |
| **RLS** | Enabled on all tables |
| **Backups** | Daily automatic + point-in-time recovery |
| **Connection pooling** | PgBouncer enabled |

## Post-Deployment Monitoring

After deploying, verify these are working:

1. Application starts without errors
2. Database migrations applied successfully
3. AI features are functional (test pre-screening)
4. File uploads work correctly
5. Authentication flows work for all roles
6. Audit logs are being written
7. Error tracking is active (Sentry or similar)

See [Monitoring](monitoring.md) for ongoing operational procedures.
