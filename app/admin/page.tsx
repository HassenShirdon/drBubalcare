import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Briefcase, Shield, Newspaper, Users, ArrowRight } from 'lucide-react';

async function getStats() {
  const [totalCases, pendingSpecialists, totalPosts, totalPatients] = await Promise.all([
    prisma.case.count(),
    prisma.doctor.count({ where: { verified: false } }),
    prisma.post.count(),
    prisma.user.count({ where: { role: 'PATIENT' } }),
  ]);

  const openCases = await prisma.case.count({ where: { status: 'OPEN' } });
  const underReview = await prisma.case.count({ where: { status: 'UNDER_REVIEW' } });
  const opinionReady = await prisma.case.count({ where: { status: 'OPINION_READY' } });

  return { totalCases, pendingSpecialists, totalPosts, totalPatients, openCases, underReview, opinionReady };
}

function StatCard({ icon: Icon, label, value, tone }: {
  icon: typeof Briefcase;
  label: string;
  value: number;
  tone: 'info' | 'warning' | 'success' | 'brand';
}) {
  const toneClasses = {
    info: 'bg-admin-brand-light text-admin-accent-blue',
    warning: 'bg-admin-warning-light text-admin-warning',
    success: 'bg-admin-success-light text-admin-success',
    brand: 'bg-admin-brand-light text-admin-brand',
  } as const;

  return (
    <div className="rounded-xl border border-admin-border bg-admin-surface p-5 shadow-soft transition-colors hover:border-admin-border-strong">
      <div className="flex items-center gap-4">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-admin-text">
            {value}
          </p>
          <p className="mt-0.5 text-xs font-medium text-admin-text-faint">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const stats = await getStats();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-admin-text tracking-tight">
          Platform overview
        </h1>
        <p className="text-sm text-admin-text-muted mt-1">
          A live snapshot of cases, specialists, and content.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Total cases"
          value={stats.totalCases}
          tone="info"
        />
        <StatCard
          icon={Shield}
          label="Pending verification"
          value={stats.pendingSpecialists}
          tone="warning"
        />
        <StatCard
          icon={Newspaper}
          label="News posts"
          value={stats.totalPosts}
          tone="success"
        />
        <StatCard
          icon={Users}
          label="Total patients"
          value={stats.totalPatients}
          tone="brand"
        />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Breakdown */}
        <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
          <h2 className="text-sm font-semibold text-admin-text mb-5">
            Case breakdown
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg">
              <span className="text-sm text-admin-text-muted">Open, awaiting specialist</span>
              <span className="text-xs font-semibold tabular-nums text-admin-accent-blue bg-admin-brand-light px-2.5 py-0.5 rounded-md">{stats.openCases}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg">
              <span className="text-sm text-admin-text-muted">Under review</span>
              <span className="text-xs font-semibold tabular-nums text-admin-warning bg-admin-warning-light px-2.5 py-0.5 rounded-md">{stats.underReview}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg">
              <span className="text-sm text-admin-text-muted">Opinion ready</span>
              <span className="text-xs font-semibold tabular-nums text-admin-success bg-admin-success-light px-2.5 py-0.5 rounded-md">{stats.opinionReady}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
          <h2 className="text-sm font-semibold text-admin-text mb-5">
            Quick actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/cases"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg hover:bg-admin-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
            >
              <span className="text-sm font-medium text-admin-text">Manage cases</span>
              <ArrowRight className="size-3.5 text-admin-text-faint" aria-hidden="true" />
            </Link>
            <Link
              href="/admin/specialists"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg hover:bg-admin-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
            >
              <span className="text-sm font-medium text-admin-text">Verify specialists</span>
              <ArrowRight className="size-3.5 text-admin-text-faint" aria-hidden="true" />
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg hover:bg-admin-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
            >
              <span className="text-sm font-medium text-admin-text">Manage news</span>
              <ArrowRight className="size-3.5 text-admin-text-faint" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
