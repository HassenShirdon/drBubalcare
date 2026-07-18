import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Shield, Briefcase } from 'lucide-react';
import { AdminUserButton } from '@/components/admin-user-button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const name = (session.user as { name?: string | null })?.name ?? null;
  const email = (session.user as { email?: string | null })?.email ?? null;

  return (
    <div className="min-h-screen bg-surface">
      <nav className="bg-clinical-navy text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-headline-md text-lg font-bold">
            Dr Bubal Care — Admin
          </Link>
          <Link
            href="/admin/cases"
            className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
          >
            <Briefcase className="size-4" />
            Cases
          </Link>
          <Link
            href="/admin/specialists"
            className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
          >
            <Shield className="size-4" />
            Specialists
          </Link>
          <Link
            href="/admin/news"
            className="text-white/80 hover:text-white text-sm flex items-center gap-1.5"
          >
            <Newspaper className="size-4" />
            News
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-white/60 hover:text-white text-sm"
          >
            View Site
          </Link>
          <div className="w-px h-5 bg-white/20" />
          <AdminUserButton name={name} email={email} />
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
