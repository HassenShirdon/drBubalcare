import type { QueryKey } from '@tanstack/react-query';

/**
 * Central query-key factory for TanStack Query.
 *
 * Convention:
 * - `all`   — the resource root key; invalidating it matches every list and detail below it.
 * - `list`  — collection queries; accepts a filters object so different filter
 *             combinations cache separately.
 * - `detail`— single-entity queries, keyed by id (or slug for public content).
 *
 * Never hand-write a queryKey string — always derive from this factory so
 * cache invalidation stays consistent.
 */
export const queryKeys = {
  cases: {
    all: ['cases'] as const,
    list: (filters?: { take?: number; skip?: number }): QueryKey => ['cases', 'list', filters ?? null],
    detail: (id: string): QueryKey => ['cases', 'detail', id],
  },
  labResults: {
    all: ['lab-results'] as const,
    list: (filters?: { take?: number; skip?: number }): QueryKey => ['lab-results', 'list', filters ?? null],
    detail: (id: string): QueryKey => ['lab-results', 'detail', id],
  },
  posts: {
    all: ['posts'] as const,
    list: ['posts', 'list'] as const,
    latest: ['posts', 'latest'] as const,
    detail: (slug: string): QueryKey => ['posts', 'detail', slug],
  },
  doctors: {
    all: ['doctors'] as const,
    detail: (id: string): QueryKey => ['doctors', 'detail', id],
  },
  doctor: {
    cases: {
      all: ['doctor-cases'] as const,
      detail: (id: string): QueryKey => ['doctor-cases', 'detail', id],
    },
    patients: ['doctor-patients'] as const,
    labReviews: ['doctor-lab-reviews'] as const,
  },
  admin: {
    cases: {
      list: ['admin-cases'] as const,
    },
    specialists: ['admin-specialists'] as const,
    disputes: {
      list: ['admin-disputes'] as const,
      detail: (id: string): QueryKey => ['admin-disputes', 'detail', id],
    },
    auditLogs: ['admin-audit-logs'] as const,
    dataRequests: ['admin-data-requests'] as const,
    edgeCases: ['admin-edge-cases'] as const,
  },
  patient: {
    consent: ['patient-consent'] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
