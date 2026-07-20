# Migrations

Common migration commands, migration history, best practices, and troubleshooting guide for the Dr. Bubal Care database.

## Common Migration Commands

### Development Workflow

```bash
# Create a new migration
npx prisma migrate dev --name <migration_name>

# Reset database (development only)
npx prisma migrate reset

# Push schema changes without migration (prototyping)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual database browser)
npx prisma studio
```

### Production Workflow

```bash
# Apply pending migrations
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Create migration SQL without applying
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
```

### Database Introspection

```bash
# Introspect existing database
npx prisma introspect

# Generate schema from database
npx prisma db pull
```

---

## Migration History by Phase

### Phase 1: Foundation

| Migration | Description | Models Added |
|-----------|-------------|--------------|
| `001_init` | Initial schema with core models | `User`, `Doctor`, `DoctorService`, `Service`, `Post` |
| `002_lab_results` | Lab result tracking | `LabResult`, `LabMetric`, `LabTrendPoint` |
| `003_appointments` | Appointment scheduling | `Appointment` |

### Phase 2: Case Management

| Migration | Description | Models Added |
|-----------|-------------|--------------|
| `004_cases` | Case management system | `Case`, `CaseRecord` |
| `005_opinions` | Specialist opinions | `SpecialistOpinion` |
| `006_ai_prescreens` | AI pre-screening | `AIPrescreen` |

### Phase 3: AI Features

| Migration | Description | Models Added |
|-----------|-------------|--------------|
| `007_plain_language` | Plain-language summaries | `PlainLanguageSummary` |
| `008_follow_ups` | Follow-up Q&A | `FollowUpQuestion` |
| `009_synthesis` | Multi-opinion synthesis | `OpinionSynthesis` |
| `010_trends` | Trend analysis | `TrendAnalysis` |

### Phase 4: Compliance

| Migration | Description | Models Added |
|-----------|-------------|--------------|
| `011_audit` | Audit logging | `AuditLog` |
| `012_disputes` | Dispute resolution | `Dispute` |
| `013_consent` | GDPR consent management | `ConsentRecord` |
| `014_deletion` | Data deletion requests | `DataDeletionRequest` |

---

## Best Practices

### Migration Naming

Use descriptive, kebab-case names:

```bash
# Good
npx prisma migrate dev --name add-case-model
npx prisma migrate dev --name add-audit-logging
npx prisma migrate dev --name add-dispute-resolution

# Bad
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
npx prisma migrate dev --name stuff
```

### Schema Changes

1. **Add fields as optional first**
   ```prisma
   model User {
     newField String?  // Optional initially
   }
   ```

2. **Backfill data if needed**
   ```bash
   # Run data migration script
   npx ts-node scripts/backfill-new-field.ts
   ```

3. **Make required after backfill**
   ```prisma
   model User {
     newField String  // Now required
   }
   ```

### Index Creation

1. **Add indexes in separate migrations**
   ```bash
   npx prisma migrate dev --name add-case-indexes
   ```

2. **Use concurrent index creation for large tables**
   ```sql
   CREATE INDEX CONCURRENTLY idx_case_patient ON "Case"("patientId");
   ```

3. **Test index performance before production**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "Case" WHERE "patientId" = '...';
   ```

### Data Migrations

1. **Always backup before data migrations**
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **Use transactions for data migrations**
   ```sql
   BEGIN;
   -- Migration logic
   COMMIT;
   ```

3. **Test migrations on staging first**
   ```bash
   # Apply to staging
   npx prisma migrate deploy --schema prisma/schema.prisma
   ```

---

## Troubleshooting Guide

### Common Issues

#### Migration Already Applied

**Error:** `Migration already applied`

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# If migration exists in database but not in files, mark as applied
npx prisma migrate resolve --applied <migration_name>
```

#### Migration File Not Found

**Error:** `Migration not found`

**Solution:**
```bash
# Check migrations directory
ls prisma/migrations/

# If migration exists in database but not locally
npx prisma migrate resolve --rolled-back <migration_name>
```

#### Schema Drift

**Error:** `The database schema is not in sync with your schema`

**Solution:**
```bash
# Option 1: Reset database (development only)
npx prisma migrate reset

# Option 2: Create new migration to sync
npx prisma migrate dev --name sync-schema
```

#### Foreign Key Constraint violation

**Error:** `Foreign key constraint failed`

**Solution:**
1. Check for orphaned records
2. Verify cascade behaviors
3. Ensure related records exist before creating dependent records

```sql
-- Find orphaned records
SELECT * FROM "Case" WHERE "patientId" NOT IN (SELECT id FROM "User");
```

#### Unique constraint violation

**Error:** `Unique constraint failed`

**Solution:**
1. Check for duplicate data
2. Verify unique constraints match business rules
3. Clean up duplicates before applying migration

```sql
-- Find duplicates
SELECT email, COUNT(*) FROM "User" GROUP BY email HAVING COUNT(*) > 1;
```

### Performance Issues

#### Slow Migrations

**Symptoms:** Migration takes too long on large tables

**Solutions:**
1. Add indexes in batches
2. Use `CONCURRENTLY` for index creation
3. Schedule migrations during low-traffic periods
4. Consider partitioning for very large tables

```sql
-- Batch index creation
DO $$
BEGIN
  FOR i IN 0..9 LOOP
    EXECUTE format('
      CREATE INDEX CONCURRENTLY idx_case_patient_%s 
      ON "Case"("patientId") 
      WHERE id::text LIKE ''%%'' || %s::text || ''%%''
    ', i, i);
  END LOOP;
END $$;
```

#### Lock Timeouts

**Symptoms:** Migration blocks other queries

**Solutions:**
1. Use `NOWAIT` for lock attempts
2. Break migrations into smaller steps
3. Schedule during maintenance windows

```sql
-- Try to acquire lock without waiting
BEGIN;
SET lock_timeout = '5s';
-- Migration logic
COMMIT;
```

### Recovery Procedures

#### Failed Migration Recovery

1. **Check migration status**
   ```bash
   npx prisma migrate status
   ```

2. **If partially applied, manually fix**
   ```sql
   -- Check what was applied
   SELECT * FROM "_prisma_migrations" ORDER BY applied_at DESC;
   ```

3. **Mark migration as failed if needed**
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

4. **Re-run migration**
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```

#### Database Corruption Recovery

1. **Restore from backup**
   ```bash
   pg_restore -d $DATABASE_URL backup_20240101.sql
   ```

2. **Re-apply migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify data integrity**
   ```sql
   -- Check critical tables
   SELECT COUNT(*) FROM "User";
   SELECT COUNT(*) FROM "Case";
   SELECT COUNT(*) FROM "SpecialistOpinion";
   ```

---

## Migration Checklist

Before applying migrations to production:

- [ ] Migration tested on staging
- [ ] Backup created
- [ ] Migration is idempotent (safe to re-run)
- [ ] No breaking changes to API
- [ ] Indexes created efficiently
- [ ] Data backfill script tested
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Maintenance window scheduled (if needed)
- [ ] Team notified of changes
