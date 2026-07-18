'use server';

import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const slug = slugify(formData.get('slug') as string || title);
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const coverImage = formData.get('coverImage') as string;
  const category = formData.get('category') as string;
  const tagsRaw = formData.get('tags') as string;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const published = formData.get('published') === 'true';
  const authorId = (session.user as { id: string }).id;

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || '{}',
      coverImage: coverImage || null,
      category: category || null,
      tags,
      authorId,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath('/');
  revalidateTag('news');
  redirect('/admin/news');
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const title = formData.get('title') as string;
  const slug = slugify(formData.get('slug') as string || title);
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;
  const coverImage = formData.get('coverImage') as string;
  const category = formData.get('category') as string;
  const tagsRaw = formData.get('tags') as string;
  const tags = tagsRaw ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const published = formData.get('published') === 'true';

  const existing = await prisma.post.findUnique({ where: { id: postId } });

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || '{}',
      coverImage: coverImage || null,
      category: category || null,
      tags,
      published,
      publishedAt: published && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    },
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath('/');
  revalidateTag('news');
  redirect('/admin/news');
}

export async function togglePublishPost(postId: string, published: boolean) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath('/admin/news');
  revalidatePath('/news');
  revalidatePath('/');
  revalidateTag('news');
}
