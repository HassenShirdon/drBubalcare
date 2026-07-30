import { PostForm } from '../post-form';

export default function NewPostPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">New Post</h1>
        <p className="text-sm text-admin-text-muted mt-1">Create a new news article or blog post.</p>
      </div>
      <PostForm />
    </div>
  );
}
