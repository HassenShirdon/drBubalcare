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
        <span className="text-xs text-[#64748B]">
          {verified ? 'Unverify?' : 'Verify?'}
        </span>
        <button
          onClick={() => mutation.mutate(!verified)}
          disabled={mutation.isPending}
          className="text-xs px-2 py-1 rounded bg-[#1E3A5F] text-white hover:bg-[#1E3A5F]/90 disabled:opacity-50"
        >
          {mutation.isPending ? <Loader2 className="size-3 animate-spin" /> : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirmOpen(false)}
          className="text-xs px-2 py-1 rounded bg-[#F1F5F9] text-[#64748B] hover:bg-[#F1F5F9]/80"
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
          ? 'bg-[#DCFCE7]/80 text-[#15803D] hover:bg-[#DCFCE7]'
          : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
      }`}
    >
      {verified ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {verified ? 'Verified' : 'Unverified'}
    </button>
  );
}