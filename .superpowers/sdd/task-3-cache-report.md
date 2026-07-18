# Task 3: Cache News Server Component

**Status:** DONE
**Commit:** `7735f06` — `feat: add use cache to news server component with cacheTag`

## Changes

### `app/news/page.tsx`
- Extracted Prisma query into `getLatestPosts()` async function
- Added `'use cache'` directive inside `getLatestPosts`
- Added `unstable_cacheTag as cacheTag` (aliased) with tag `'news'` for targeted invalidation
- Imported `cacheTag` from `next/cache`
- Updated query to use `select` for only needed fields and `orderBy: createdAt`

### `app/admin/news/actions.ts`
- Added `revalidateTag` to the import from `next/cache`
- Added `revalidateTag('news')` after existing `revalidatePath` calls in:
  - `createPost`
  - `updatePost`
  - `togglePublishPost`

## Note
In Next.js 15.5.20, `cacheTag` is exported as `unstable_cacheTag`. The import uses the alias: `import { unstable_cacheTag as cacheTag } from 'next/cache'`. This will become `cacheTag` in a future stable release.
