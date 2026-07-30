import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { PostForm } from '../../post-form';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">Edit Post</h1>
        <p className="text-sm text-admin-text-muted mt-1">Edit &quot;{post.title}&quot;</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
