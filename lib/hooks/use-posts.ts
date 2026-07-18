import { useQuery } from '@tanstack/react-query';

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['posts', slug],
    queryFn: async () => {
      const res = await fetch(`/api/news/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!slug,
  });
}
