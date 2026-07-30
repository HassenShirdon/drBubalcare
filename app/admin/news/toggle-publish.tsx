'use client';

import { useState, useTransition } from 'react';
import { togglePublishPost } from './actions';

export function TogglePublishButton({ postId, published }: { postId: string; published: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null)
          startTransition(async () => {
            try {
              await togglePublishPost(postId, !published)
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Failed to update')
            }
          })
        }}
        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
          published
            ? 'bg-admin-success-light text-admin-success hover:bg-admin-success'
            : 'bg-admin-surface-elevated text-admin-text-faint hover:bg-admin-border'
        } disabled:opacity-50`}
      >
        {isPending ? '...' : published ? 'Published' : 'Draft'}
      </button>
      {error && (
        <span className="text-[10px] text-admin-danger max-w-[120px] truncate" title={error}>
          {error}
        </span>
      )}
    </div>
  );
}
