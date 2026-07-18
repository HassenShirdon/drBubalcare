### Task 7: Doctor Cases List Page

**Files:**
- Create: `app/doctor/cases/page.tsx`
- Create: `lib/hooks/use-doctor-cases.ts`
- Modify: `lib/hooks/index.ts`
- Modify: `components/DoctorLayout.tsx`

**Interfaces:**
- Consumes: GET /api/doctor/cases (Task 6)
- Produces: /doctor/cases page, useDoctorCases hook

- [ ] **Step 1: Create useDoctorCases hook**

Create `lib/hooks/use-doctor-cases.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useDoctorCases() {
  return useQuery({
    queryKey: ['doctor-cases'],
    queryFn: async () => {
      const res = await fetch('/api/doctor/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
  });
}

export function useDoctorCase(id: string) {
  return useQuery({
    queryKey: ['doctor-case', id],
    queryFn: async () => {
      const res = await fetch(`/api/doctor/cases/${id}`);
      if (!res.ok) throw new Error('Failed to fetch case');
      return res.json();
    },
    enabled: !!id,
  });
}

export function useSubmitOpinion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caseId,
      content,
      sign,
    }: {
      caseId: string;
      content: string;
      sign: boolean;
    }) => {
      const res = await fetch(`/api/doctor/cases/${caseId}/opinion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sign }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to submit opinion');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor-cases'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-case'] });
    },
  });
}
```

- [ ] **Step 2: Export new hooks**

In `lib/hooks/index.ts`, add:

```typescript
export * from './use-doctor-cases';
```

- [ ] **Step 3: Create doctor cases page**

Create `app/doctor/cases/page.tsx`:

```tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useDoctorCases } from '@/lib/hooks/use-doctor-cases';
import { Briefcase, Loader2, Search, FileText } from 'lucide-react';

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up',
  TREND_ANALYSIS: 'Trend Analysis',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
};

export default function DoctorCasesPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'opinion_written'>('all');
  const [search, setSearch] = useState('');
  const { data: cases, isLoading } = useDoctorCases();

  const filtered = (cases ?? [])
    .filter((c: any) => {
      if (filter === 'pending') return !c.opinions || c.opinions.length === 0 || c.opinions[0].status === 'DRAFT';
      if (filter === 'opinion_written') return c.opinions && c.opinions.length > 0 && c.opinions[0].status !== 'DRAFT';
      return true;
    })
    .filter((c: any) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.patient.name?.toLowerCase().includes(q) ||
        c.patient.email.toLowerCase().includes(q) ||
        c.serviceType.toLowerCase().includes(q)
      );
    });

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="font-headline-md text-xl md:text-2xl font-semibold text-text-medical-black">
          My Cases
        </h1>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          Cases assigned to you for review.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy"
          />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {([
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'opinion_written', label: 'Opinion Written' },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f.key
                  ? 'bg-clinical-navy text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-surface-gray p-12 text-center">
          <Briefcase className="size-10 text-on-surface-variant/30 mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm">No cases found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any) => {
            const s = statusConfig[c.status] || statusConfig.OPEN;
            const hasOpinion = c.opinions && c.opinions.length > 0 && c.opinions[0].status !== 'DRAFT';
            return (
              <Link
                key={c.id}
                href={`/doctor/cases/${c.id}`}
                className="block bg-white rounded-xl border border-surface-gray/60 shadow-sm p-4 hover:shadow-md hover:border-clinical-navy/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-text-medical-black text-sm">
                        {c.patient.name ?? 'Unknown Patient'}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-xs">
                      {serviceTypeLabels[c.serviceType] || c.serviceType}
                    </p>
                    <p className="text-on-surface-variant/60 text-[11px] mt-1">
                      Created {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasOpinion ? (
                      <span className="inline-flex items-center gap-1 text-healing-teal text-xs font-medium">
                        <FileText className="size-3.5" />
                        Opinion signed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-medium">
                        <FileText className="size-3.5" />
                        Pending review
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Add My Cases nav item to doctor layout**

In `components/DoctorLayout.tsx`, add a new nav item after "Dashboard":

```tsx
<li>
  <Link href="/doctor/cases" className="flex items-center space-x-2.5 px-3 py-2 text-on-surface-variant font-label-md text-sm hover:bg-surface-container-low hover:text-clinical-navy rounded-lg transition-colors">
    <Briefcase className="size-4" />
    <span>My Cases</span>
  </Link>
</li>
```

Import `Briefcase` from lucide-react at the top:

```tsx
import { Stethoscope, LayoutDashboard, Users, Calendar, FlaskConical, Plus, HelpCircle, LogOut, Menu, Bell, Briefcase } from 'lucide-react';
```

- [ ] **Step 5: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/doctor/cases` — should show assigned cases with status and opinion status
Test: Click a case → navigates to `/doctor/cases/[id]`

- [ ] **Step 6: Commit**

```bash
git add app/doctor/cases/ lib/hooks/use-doctor-cases.ts lib/hooks/index.ts components/DoctorLayout.tsx
git commit -m "feat: add doctor My Cases list page with filtering"
```
