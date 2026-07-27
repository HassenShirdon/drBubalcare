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
          ? 'bg-[#DCFCE7]/80 text-[#15803D] hover:bg-[#DCFCE7]'
          : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#F1F5F9]/80'
      } disabled:opacity-50`}
    >
      {isPending ? '...' : published ? 'Published' : 'Draft'}
    </button>
  );
}
