### Task 3: Admin Verification Page

**Files:**
- Create: `app/admin/specialists/page.tsx`
- Create: `app/admin/specialists/verify-button.tsx`
- Modify: `app/admin/layout.tsx`

**Interfaces:**
- Consumes: GET /api/admin/specialists, PATCH /api/admin/specialists/[id]/verify (Task 2)
- Produces: /admin/specialists page

- [ ] **Step 1: Create verify-button client component**

Create `app/admin/specialists/verify-button.tsx`:

```tsx
"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export function VerifyButton({ doctorId, verified }: { doctorId: string; verified: boolean }) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newVerified: boolean) => {
      const res = await fetch(`/api/admin/specialists/${doctorId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: newVerified }),
      });
      if (!res.ok) throw new Error('Failed to update');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-specialists'] });
      setConfirmOpen(false);
    },
  });

  if (confirmOpen) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-on-surface-variant">
          {verified ? 'Unverify?' : 'Verify?'}
        </span>
        <button
          onClick={() => mutation.mutate(!verified)}
          disabled={mutation.isPending}
          className="text-xs px-2 py-1 rounded bg-clinical-navy text-white hover:bg-clinical-navy/90 disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
          className="text-xs px-2 py-1 rounded bg-surface-gray text-on-surface-variant hover:bg-surface-gray/80"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirmOpen(true)}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
        verified
          ? 'bg-healing-teal/10 text-healing-teal hover:bg-healing-teal/20'
          : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
      }`}
    >
      {verified ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {verified ? 'Verified' : 'Unverified'}
    </button>
  );
}
```

- [ ] **Step 2: Create admin specialists page**

Create `app/admin/specialists/page.tsx`:

```tsx
"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Loader2, Search } from 'lucide-react';
import { VerifyButton } from './verify-button';

type DoctorWithUser = {
  id: string;
  specialty: string;
  experience: string;
  verified: boolean;
  user: { id: string; name: string | null; email: string; createdAt: string };
};

export default function AdminSpecialistsPage() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [search, setSearch] = useState('');

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['admin-specialists'],
    queryFn: async () => {
      const res = await fetch('/api/admin/specialists');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const filtered = (doctors ?? [])
    .filter((d: DoctorWithUser) => {
      if (filter === 'verified') return d.verified;
      if (filter === 'unverified') return !d.verified;
      return true;
    })
    .filter((d: DoctorWithUser) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        d.user.name?.toLowerCase().includes(q) ||
        d.user.email.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">Specialist Verification</h1>
        <p className="text-on-surface-variant text-sm mt-1">Review and verify specialist credentials.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search specialists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-surface-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy"
          />
        </div>
        <div className="flex gap-1 bg-surface rounded-lg p-1">
          {(['all', 'verified', 'unverified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f
                  ? 'bg-clinical-navy text-white'
                  : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-surface-gray overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-gray bg-surface-container-low">
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Specialty</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Joined</th>
                <th className="text-right px-4 py-3 font-semibold text-clinical-navy">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant">
                    No specialists found.
                  </td>
                </tr>
              ) : (
                filtered.map((doctor: DoctorWithUser) => (
                  <tr key={doctor.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-medium text-clinical-navy">
                      {doctor.user.name ?? 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{doctor.specialty}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{doctor.user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                        doctor.verified
                          ? 'bg-healing-teal/10 text-healing-teal'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        <Shield className="size-3" />
                        {doctor.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {new Date(doctor.user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <VerifyButton doctorId={doctor.id} verified={doctor.verified} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Add Specialists nav item to admin layout**

In `app/admin/layout.tsx`, add the Specialists link after the News link. Import `Shield` from lucide-react:

```tsx
import { LogOut, Newspaper, Shield, Briefcase } from 'lucide-react';
```

Add after the News link:

```tsx
<Link
  href="/admin/specialists"
  className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
>
  <Shield className="size-4" />
  Specialists
</Link>
<Link
  href="/admin/cases"
  className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
>
  <Briefcase className="size-4" />
  Cases
</Link>
```

- [ ] **Step 4: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/admin/specialists` — should show table of doctors with verify buttons
Test: Click verify button → confirmation → status toggles

- [ ] **Step 5: Commit**

```bash
git add app/admin/specialists/ app/admin/layout.tsx
git commit -m "feat: add admin specialist verification page with toggle"
```
