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
        <h1 className="text-xl md:text-2xl font-semibold text-[#0F172A]">
          Admin Dashboard
        </h1>
        <p className="text-[#64748B] mt-0.5 text-xs">
          Overview of platform activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#3B82F6]">
              <Briefcase className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A]">{stats.totalCases}</p>
              <p className="text-[11px] text-[#64748B]">Total Cases</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
              <Shield className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A]">{stats.pendingSpecialists}</p>
              <p className="text-[11px] text-[#64748B]">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] flex items-center justify-center text-[#22C55E]">
              <Newspaper className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A]">{stats.totalPosts}</p>
              <p className="text-[11px] text-[#64748B]">News Posts</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#3B82F6]">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0F172A]">{stats.totalPatients}</p>
              <p className="text-[11px] text-[#64748B]">Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow p-5">
          <h2 className="font-semibold text-sm text-[#0F172A] mb-4">
            Case Breakdown
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC]">
              <span className="text-xs text-[#64748B]">Open (awaiting specialist)</span>
              <span className="text-xs font-bold text-[#1E40AF] bg-[#DBEAFE] px-2 py-0.5 rounded-full">{stats.openCases}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC]">
              <span className="text-xs text-[#64748B]">Under Review</span>
              <span className="text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded-full">{stats.underReview}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC]">
              <span className="text-xs text-[#64748B]">Opinion Ready</span>
              <span className="text-xs font-bold text-[#22C55E] bg-[#DCFCE7] px-2 py-0.5 rounded-full">{stats.opinionReady}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow p-5">
          <h2 className="font-semibold text-sm text-[#0F172A] mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link href="/admin/cases" className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
              <span className="text-xs text-[#0F172A] font-medium">Manage Cases</span>
              <ArrowRight className="size-3.5 text-[#64748B]" />
            </Link>
            <Link href="/admin/specialists" className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
              <span className="text-xs text-[#0F172A] font-medium">Verify Specialists</span>
              <ArrowRight className="size-3.5 text-[#64748B]" />
            </Link>
            <Link href="/admin/news" className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
              <span className="text-xs text-[#0F172A] font-medium">Manage News</span>
              <ArrowRight className="size-3.5 text-[#64748B]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
