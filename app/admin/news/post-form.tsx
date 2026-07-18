'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, type PostInput } from '@/lib/schemas/post.schema';
import TiptapEditor from '@/components/tiptap-editor';
import { createPost, updatePost } from './actions';

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImage: string | null;
    category: string | null;
    tags: string[];
    published: boolean;
  };
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      content: post?.content ?? '{}',
      coverImage: post?.coverImage ?? '',
      category: post?.category ?? '',
      tags: post?.tags?.join(', ') ?? '',
      published: post?.published ?? false,
    },
  });

  const titleValue = watch('title');
  const coverImageValue = watch('coverImage');

  useEffect(() => {
    if (!post && titleValue) {
      const slugValue = titleValue
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slugValue, { shouldValidate: false });
    }
  }, [titleValue, post, setValue]);

  async function onSubmit(data: PostInput) {
    const formData = new FormData();
    formData.set('title', data.title);
    formData.set('slug', data.slug);
    formData.set('excerpt', data.excerpt ?? '');
    formData.set('content', data.content);
    formData.set('coverImage', data.coverImage ?? '');
    formData.set('category', data.category ?? '');
    formData.set('tags', data.tags ?? '');
    formData.set('published', String(data.published));

    try {
      if (post) {
        await updatePost(post.id, formData);
      } else {
        await createPost(formData);
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl border border-surface-gray p-6 space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Title *
          </label>
          <input
            id="title"
            {...register('title')}
            className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
            placeholder="Post title"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Slug *
          </label>
          <input
            id="slug"
            {...register('slug')}
            className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy font-mono"
            placeholder="post-url-slug"
          />
          {errors.slug && (
            <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy resize-none"
            placeholder="Short summary shown on cards"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-clinical-navy mb-1.5">
              Category
            </label>
            <input
              id="category"
              {...register('category')}
              className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
              placeholder="e.g. Company News, Medical Research"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-clinical-navy mb-1.5">
              Tags
            </label>
            <input
              id="tags"
              {...register('tags')}
              className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
              placeholder="comma, separated, tags"
            />
          </div>
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-sm font-semibold text-clinical-navy mb-1.5">
            Cover Image URL
          </label>
          <input
            id="coverImage"
            {...register('coverImage')}
            className="w-full h-9 px-3 rounded-lg border border-surface-gray text-sm focus:outline-none focus:border-clinical-navy"
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImage && (
            <p className="text-red-500 text-xs mt-1">{errors.coverImage.message}</p>
          )}
          {coverImageValue && (
            <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-surface-gray bg-surface-gray/30">
              <Image
                src={coverImageValue}
                alt="Cover preview"
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  (e.currentTarget).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-gray p-6 space-y-3">
        <label className="block text-sm font-semibold text-clinical-navy">Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor content={field.value} onChange={field.onChange} placeholder="Write your article content..." />
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl border border-surface-gray p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('published')}
            className="size-4 rounded border-surface-gray text-clinical-navy focus:ring-clinical-navy"
          />
          <span className="text-sm font-medium text-clinical-navy">Publish immediately</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-clinical-navy transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-clinical-navy text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </form>
  );
}