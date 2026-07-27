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
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">Edit Post</h1>
        <p className="text-[#64748B] text-sm mt-1">Edit &quot;{post.title}&quot;</p>
      </div>
      <PostForm post={post} />
    </div>
  );
}
