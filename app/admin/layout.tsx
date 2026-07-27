import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, Shield, Briefcase, AlertTriangle, MessageSquareWarning, ClipboardList } from 'lucide-react';
import { AdminUserButton } from '@/components/admin-user-button';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const name = (session.user as { name?: string | null })?.name ?? null;
  const email = (session.user as { email?: string | null })?.email ?? null;

  return (
    <div className="pulsepoint min-h-screen" style={{ background: '#F8FAFC', color: '#0F172A' }}>
      <nav className="px-6 py-3 flex items-center justify-between border-b"
        style={{ background: '#FFFFFF', borderColor: '#E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-lg font-bold" style={{ color: '#1E3A5F' }}>
            Dr Bubal Care — Admin
          </Link>
          <Link
            href="/admin/cases"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#64748B' }}
          >
            <Briefcase className="size-4" aria-hidden="true" />
            Cases
          </Link>
          <Link
            href="/admin/specialists"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#64748B' }}
          >
            <Shield className="size-4" aria-hidden="true" />
            Specialists
          </Link>
          <Link
            href="/admin/news"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#64748B' }}
          >
            <Newspaper className="size-4" aria-hidden="true" />
            News
          </Link>
          <Link
            href="/admin/disputes"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#64748B' }}
          >
            <MessageSquareWarning className="size-4" aria-hidden="true" />
            Disputes
          </Link>
          <Link
            href="/admin/edge-cases"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#64748B' }}
          >
            <AlertTriangle className="size-4" aria-hidden="true" />
            Edge Cases
          </Link>
          <Link
            href="/admin/audit-logs"
            className="text-sm flex items-center gap-1.5 transition-colors"
            style={{ color: '#64748B' }}
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            Audit
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: '#8D99AE' }}
          >
            View Site
          </Link>
          <div className="w-px h-5" style={{ background: '#E2E8F0' }} />
          <AdminUserButton name={name} email={email} />
        </div>
      </nav>
      <main id="main-content" className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}