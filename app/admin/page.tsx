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

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline-md text-xl md:text-2xl font-semibold text-text-medical-black">
          Admin Dashboard
        </h1>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          Overview of platform activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-evidence-blue-light flex items-center justify-center text-clinical-navy">
              <Briefcase className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{stats.totalCases}</p>
              <p className="text-[11px] text-on-surface-variant">Total Cases</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Shield className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{stats.pendingSpecialists}</p>
              <p className="text-[11px] text-on-surface-variant">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-healing-teal/10 flex items-center justify-center text-healing-teal">
              <Newspaper className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{stats.totalPosts}</p>
              <p className="text-[11px] text-on-surface-variant">News Posts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-clinical-navy/10 flex items-center justify-center text-clinical-navy">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-text-medical-black">{stats.totalPatients}</p>
              <p className="text-[11px] text-on-surface-variant">Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-5">
          <h2 className="font-headline-md font-semibold text-sm text-text-medical-black mb-4">
            Case Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
              <span className="text-xs text-on-surface-variant">Open (awaiting specialist)</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{stats.openCases}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
              <span className="text-xs text-on-surface-variant">Under Review</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{stats.underReview}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface">
              <span className="text-xs text-on-surface-variant">Opinion Ready</span>
              <span className="text-xs font-bold text-healing-teal bg-healing-teal/10 px-2 py-0.5 rounded-full">{stats.opinionReady}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-gray/60 shadow p-5">
          <h2 className="font-headline-md font-semibold text-sm text-text-medical-black mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/admin/cases" className="flex items-center justify-between p-2.5 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
              <span className="text-xs text-text-medical-black font-medium">Manage Cases</span>
              <ArrowRight className="size-3.5 text-on-surface-variant" />
            </Link>
            <Link href="/admin/specialists" className="flex items-center justify-between p-2.5 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
              <span className="text-xs text-text-medical-black font-medium">Verify Specialists</span>
              <ArrowRight className="size-3.5 text-on-surface-variant" />
            </Link>
            <Link href="/admin/news" className="flex items-center justify-between p-2.5 rounded-lg bg-surface hover:bg-surface-container-low transition-colors">
              <span className="text-xs text-text-medical-black font-medium">Manage News</span>
              <ArrowRight className="size-3.5 text-on-surface-variant" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
