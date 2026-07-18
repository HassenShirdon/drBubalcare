import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Plus, Edit, ExternalLink } from 'lucide-react';
import { TogglePublishButton } from './toggle-publish';

export default async function AdminNewsPage() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">News Posts</h1>
          <p className="text-on-surface-variant text-sm mt-1">Manage your blog posts and news articles.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-clinical-navy text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary-container transition-colors inline-flex items-center gap-2"
        >
          <Plus className="size-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-surface-gray overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-gray bg-surface-container-low">
              <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Author</th>
              <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-clinical-navy">Date</th>
              <th className="text-right px-4 py-3 font-semibold text-clinical-navy">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant">
                  No posts yet. Create your first one!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-surface-gray/50 hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-medium text-clinical-navy">{post.title}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{post.author.name ?? 'Unknown'}</td>
                  <td className="px-4 py-3">
                    {post.category ? (
                      <span className="bg-evidence-blue-light text-clinical-navy text-xs px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    ) : (
                      <span className="text-on-surface-variant/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <TogglePublishButton postId={post.id} published={post.published} />
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant text-xs">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.published && (
                        <Link
                          href={`/news/${post.slug}`}
                          className="p-1.5 text-on-surface-variant hover:text-clinical-navy transition-colors"
                        >
                          <ExternalLink className="size-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/news/${post.id}/edit`}
                        className="p-1.5 text-on-surface-variant hover:text-clinical-navy transition-colors"
                      >
                        <Edit className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
