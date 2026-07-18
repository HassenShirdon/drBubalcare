import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Newspaper } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-clinical-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin/news" className="font-headline-md text-lg font-bold">
            Dr Bubal Care — Admin
          </Link>
          <Link
            href="/admin/news"
            className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
          >
            <Newspaper className="size-4" />
            News
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm">
            {(session.user as { email?: string })?.email}
          </span>
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm flex items-center gap-1.5"
          >
            View Site
          </Link>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
