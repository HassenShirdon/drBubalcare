# Environment Variables

Complete reference for all environment variables used by Dr. Bubal Care.

## Required Variables

These must be set for the application to function:

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` | Must include SSL for production |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT signing | `a1b2c3d4e5f6...` (64 hex chars) | Generate with `openssl rand -hex 32` |
| `NEXTAUTH_URL` | Base URL for auth callbacks | `https://drbubalcare.com` | Must match production domain |
| `APP_URL` | Application base URL | `https://drbubalcare.com` | Used for self-referential links, OAuth callbacks |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` | Required for pre-screening, summaries, synthesis |
| `INTERNAL_API_SECRET` | Shared secret for server-to-server calls | `your-internal-secret` | Must match across all API routes |

## Optional Variables

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `GEMINI_API_KEY` | Gemini AI API key | — | Alternative AI provider |
| `UPLOAD_DIR` | Local file upload directory | `./assets/uploads` | Only used in local development |
| `EMAIL_API_KEY` | Email service API key | — | For notification emails (future) |
| `SENTRY_DSN` | Sentry error tracking DSN | — | Recommended for production |
| `REDIS_URL` | Redis connection string | — | For rate limiting and caching (future) |

## Development vs Production

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://drbubalcare.com` |
| `APP_URL` | `http://localhost:3000` | `https://drbubalcare.com` |
| `DATABASE_URL` | Local Supabase or Supabase dev project | Supabase production project |
| `NEXTAUTH_SECRET` | Any random string | Strong random string (32+ chars) |
| `OPENAI_API_KEY` | Test/development key | Production key with billing enabled |
| `UPLOAD_DIR` | `./assets/uploads` | Not used (Supabase Storage) |

## Environment File Priority

Next.js loads environment variables in this order (later files override earlier):

1. `.env` — Default values
2. `.env.local` — Local overrides (git-ignored)
3. `.env.development` — Development-only
4. `.env.production` — Production-only

**Always use `.env.local` for secrets.** Never commit secrets to version control.

## Security Notes

### Secrets Management

- **Never commit** `.env`, `.env.local`, or `.env.production` to git
- Store production secrets in your hosting platform's environment variables (Vercel, Supabase)
- Rotate secrets periodically (every 90 days recommended)
- Use different secrets for development and production

### API Key Security

- `OPENAI_API_KEY`: Monitor usage, set billing alerts, rotate quarterly
- `INTERNAL_API_SECRET`: Generate a strong random string, never share externally
- `NEXTAUTH_SECRET`: Use `openssl rand -hex 32` to generate

### Database Connection Security

- Always use `sslmode=require` in production
- Use connection pooling (PgBouncer) for serverless deployments
- Limit database user permissions to minimum required

## Troubleshooting

### Common Issues

**`NEXTAUTH_URL` mismatch**

```
Error: NEXTAUTH_URL does not match the current URL
```

Ensure `NEXTAUTH_URL` exactly matches your production domain (including protocol).

**Database connection failed**

```
Error: Can't reach database server
```

- Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/db?sslmode=require`
- Check Supabase project is not paused
- Verify IP allowlist in Supabase dashboard

**AI features not working**

```
Error: OpenAI API key is invalid
```

- Verify `OPENAI_API_KEY` starts with `sk-`
- Check API key has not been revoked
- Verify billing is enabled on OpenAI account

**Internal API secret mismatch**

```
Error: Unauthorized
```

- Ensure `INTERNAL_API_SECRET` matches across all API routes
- Check for typos or trailing whitespace

### Verifying Environment Variables

```bash
# List all loaded environment variables (development only)
npx next info

# Test database connection
npx prisma db push --accept-data-loss

# Test AI connection
curl -X POST http://localhost:3000/api/ai/prescreen \
  -H "Content-Type: application/json" \
  -d '{"caseId": "test"}'
```

## Variable Reference by Feature

| Feature | Required Variables |
|---------|-------------------|
| **Authentication** | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| **Database** | `DATABASE_URL` |
| **AI Pre-screening** | `OPENAI_API_KEY` or `GEMINI_API_KEY`, `INTERNAL_API_SECRET` |
| **AI Summaries** | `OPENAI_API_KEY` or `GEMINI_API_KEY`, `INTERNAL_API_SECRET` |
| **File Uploads** | `UPLOAD_DIR` (dev only, Supabase Storage in prod) |
| **Error Tracking** | `SENTRY_DSN` |
| **Notifications** | `EMAIL_API_KEY` (future) |
