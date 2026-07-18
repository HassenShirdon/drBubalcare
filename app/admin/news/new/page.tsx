import { PostForm } from '../post-form';

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline-lg text-2xl font-bold text-clinical-navy">New Post</h1>
        <p className="text-on-surface-variant text-sm mt-1">Create a new news article or blog post.</p>
      </div>
      <PostForm />
    </div>
  );
}
