import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

vi.mock('@/lib/db', () => ({
  prisma: {
    post: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { GET as listNews } from '@/app/api/news/route';
import { GET as latestNews } from '@/app/api/news/latest/route';
import { GET as getNewsBySlug } from '@/app/api/news/[slug]/route';
import { prisma } from '@/lib/db';
import { slugParamsRequest } from '../helpers';

describe('News API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/news', () => {
    it('returns published posts with author info ordered by publishedAt desc', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1', slug: 'post-1', published: true, publishedAt: new Date('2024-06-01'), author: { name: 'Author A' } },
        { id: '2', title: 'Post 2', slug: 'post-2', published: true, publishedAt: new Date('2024-05-01'), author: { name: 'Author B' } },
      ];
      vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts as any);

      const res = await listNews();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].title).toBe('Post 1');
      expect(data[0].author.name).toBe('Author A');
      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { published: true },
        include: { author: { select: { name: true } } },
        orderBy: { publishedAt: 'desc' },
      });
    });

    it('returns empty array when no published posts', async () => {
      vi.mocked(prisma.post.findMany).mockResolvedValue([]);

      const res = await listNews();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('GET /api/news/latest', () => {
    it('returns latest 3 published posts with selected fields', async () => {
      const mockPosts = [
        { id: '1', title: 'Latest 1', slug: 'latest-1', excerpt: 'Excerpt 1', coverImage: null, category: 'News', publishedAt: new Date('2024-06-01') },
        { id: '2', title: 'Latest 2', slug: 'latest-2', excerpt: 'Excerpt 2', coverImage: 'img.jpg', category: 'Blog', publishedAt: new Date('2024-05-01') },
        { id: '3', title: 'Latest 3', slug: 'latest-3', excerpt: 'Excerpt 3', coverImage: null, category: 'News', publishedAt: new Date('2024-04-01') },
      ];
      vi.mocked(prisma.post.findMany).mockResolvedValue(mockPosts as any);

      const res = await latestNews();
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toHaveLength(3);
      expect(prisma.post.findMany).toHaveBeenCalledWith({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          publishedAt: true,
        },
      });
    });
  });

  describe('GET /api/news/[slug]', () => {
    it('returns post by slug with author info', async () => {
      const mockPost = { id: '1', title: 'Test Post', slug: 'test-post', content: 'Content', published: true, author: { name: 'Author A', image: null } };
      vi.mocked(prisma.post.findUnique).mockResolvedValue(mockPost as any);

      const res = await getNewsBySlug({} as Request, slugParamsRequest('test-post'));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockPost);
    });

    it('returns 404 when post slug not found', async () => {
      vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

      const res = await getNewsBySlug({} as Request, slugParamsRequest('nonexistent'));
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data.error).toBe('Not found');
    });
  });
});
