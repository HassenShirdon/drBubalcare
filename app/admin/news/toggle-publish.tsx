'use client';

import { useTransition } from 'react';
import { togglePublishPost } from './actions';

export function TogglePublishButton({ postId, published }: { postId: string; published: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => togglePublishPost(postId, !published))}
      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
        published
          ? 'bg-healing-teal/10 text-healing-teal hover:bg-healing-teal/20'
          : 'bg-surface-gray text-on-surface-variant hover:bg-surface-gray/80'
      } disabled:opacity-50`}
    >
      {isPending ? '...' : published ? 'Published' : 'Draft'}
    </button>
  );
}
