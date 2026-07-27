import { PostForm } from '../post-form';

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#0F172A]">New Post</h1>
        <p className="text-[#64748B] text-sm mt-1">Create a new news article or blog post.</p>
      </div>
      <PostForm />
    </div>
  );
}
