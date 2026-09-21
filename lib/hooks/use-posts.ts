import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  publishedAt: string | null;
}

export function usePosts() {
  return useQuery<NewsPost[]>({
    queryKey: queryKeys.posts.list,
    queryFn: async () => {
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useLatestPosts() {
  return useQuery<NewsPost[]>({
    queryKey: queryKeys.posts.latest,
    queryFn: async () => {
      const res = await fetch('/api/news/latest');
      if (!res.ok) throw new Error('Failed to fetch posts');
      return res.json();
    },
    // Matches the endpoint's CDN cache window (s-maxage=300)
    staleTime: 5 * 60 * 1000,
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: queryKeys.posts.detail(slug),
    queryFn: async () => {
      const res = await fetch(`/api/news/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      return res.json();
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
}
