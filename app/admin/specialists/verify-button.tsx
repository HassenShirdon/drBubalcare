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
        <span className="text-xs text-admin-text-faint">
          {verified ? 'Unverify?' : 'Verify?'}
        </span>
        <button
          onClick={() => mutation.mutate(!verified)}
          disabled={mutation.isPending}
          className="text-xs px-2 py-1 rounded bg-admin-brand text-white hover:bg-admin-brand/90 disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
          className="text-xs px-2 py-1 rounded bg-admin-surface-elevated text-admin-text-faint hover:bg-admin-border"
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
          ? 'bg-admin-success-light text-admin-success hover:bg-admin-success'
          : 'bg-admin-warning-light text-admin-warning hover:bg-admin-warning/20'
      }`}
    >
      {verified ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {verified ? 'Verified' : 'Unverified'}
    </button>
  );
}
