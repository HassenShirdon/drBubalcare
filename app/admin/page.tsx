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

function StatCard({ icon: Icon, label, value, iconBg, iconColor }: {
  icon: typeof Briefcase;
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-admin-surface rounded-xl border border-admin-border p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div
          className="size-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-admin-text tracking-tight">{value}</p>
          <p className="text-xs text-admin-text-faint font-medium mt-0.5">{label}</p>
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
          Dashboard
        </h1>
        <p className="text-sm text-admin-text-muted mt-1">
          Overview of platform activity and key metrics
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Briefcase}
          label="Total Cases"
          value={stats.totalCases}
          iconBg="var(--admin-brand-light)"
          iconColor="var(--admin-accent-blue)"
        />
        <StatCard
          icon={Shield}
          label="Pending Verification"
          value={stats.pendingSpecialists}
          iconBg="var(--admin-warning-light)"
          iconColor="var(--admin-warning)"
        />
        <StatCard
          icon={Newspaper}
          label="News Posts"
          value={stats.totalPosts}
          iconBg="var(--admin-success-light)"
          iconColor="var(--admin-success)"
        />
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients}
          iconBg="var(--admin-brand-light)"
          iconColor="var(--admin-accent-blue)"
        />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Breakdown */}
        <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
          <h2 className="text-sm font-semibold text-admin-text mb-5">
            Case Breakdown
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg">
              <span className="text-sm text-admin-text-muted">Open (awaiting specialist)</span>
              <span className="text-xs font-semibold text-admin-accent-blue bg-admin-brand-light px-2.5 py-0.5 rounded-full">{stats.openCases}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg">
              <span className="text-sm text-admin-text-muted">Under Review</span>
              <span className="text-xs font-semibold text-admin-warning bg-admin-warning-light px-2.5 py-0.5 rounded-full">{stats.underReview}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg">
              <span className="text-sm text-admin-text-muted">Opinion Ready</span>
              <span className="text-xs font-semibold text-admin-success bg-admin-success-light px-2.5 py-0.5 rounded-full">{stats.opinionReady}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-admin-surface rounded-xl border border-admin-border p-6">
          <h2 className="text-sm font-semibold text-admin-text mb-5">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/cases"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg hover:bg-admin-surface-elevated transition-colors"
            >
              <span className="text-sm font-medium text-admin-text">Manage Cases</span>
              <ArrowRight className="size-3.5 text-admin-text-faint" />
            </Link>
            <Link
              href="/admin/specialists"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg hover:bg-admin-surface-elevated transition-colors"
            >
              <span className="text-sm font-medium text-admin-text">Verify Specialists</span>
              <ArrowRight className="size-3.5 text-admin-text-faint" />
            </Link>
            <Link
              href="/admin/news"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-admin-bg hover:bg-admin-surface-elevated transition-colors"
            >
              <span className="text-sm font-medium text-admin-text">Manage News</span>
              <ArrowRight className="size-3.5 text-admin-text-faint" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
