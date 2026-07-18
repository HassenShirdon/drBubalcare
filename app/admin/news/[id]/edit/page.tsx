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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">Edit Post</h1>
        <p className="text-on-surface-variant text-sm mt-1">Edit &quot;{post.title}&quot;</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
