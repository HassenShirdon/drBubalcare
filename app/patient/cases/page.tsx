"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCases } from '@/lib/hooks/use-cases';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN: { label: 'Open', color: 'bg-[#DBEAFE] text-[#1E40AF]', icon: <Clock className="size-3.5" /> },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-[#DBEAFE] text-[#1E40AF]', icon: <Clock className="size-3.5" /> },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-[#FEF3C7] text-[#B45309]', icon: <Clock className="size-3.5" /> },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-[#DCFCE7]/80 text-[#15803D]', icon: <CheckCircle2 className="size-3.5" /> },
  CLOSED: { label: 'Closed', color: 'bg-[#F1F5F9] text-[#64748B]', icon: <CheckCircle2 className="size-3.5" /> },
  DISPUTED: { label: 'Disputed', color: 'bg-[#FEF2F2] text-[#B91C1C]', icon: <AlertCircle className="size-3.5" /> },
};

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PatientCasesPage() {
  const { data: cases, isLoading } = useCases();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-24 md:pb-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[#64748B] text-sm mb-1">Patient Portal</p>
          <h1 className="text-[#1E3A5F] font-bold text-2xl md:text-3xl">My Cases</h1>
        </div>
        <Link
          href="/patient/cases/new"
          className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#1E3A5F]/90 transition-colors"
        >
          <Plus className="size-4" />
          Start Case
        </Link>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="rounded-lg border border-[#E2E8F0] shadow-sm bg-white overflow-hidden">
          <div className="divide-y divide-[#E2E8F0]">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#15803D]" size={24} />
              </div>
            ) : cases && cases.length > 0 ? (
              cases.map((c: any) => {
                const status = statusConfig[c.status] || statusConfig.OPEN;
                return (
                  <Link
                    href={`/patient/cases/${c.id}`}
                    key={c.id}
                    className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors group block"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#DBEAFE] flex items-center justify-center text-[#1E3A5F] group-hover:bg-[#1E3A5F] group-hover:text-white transition-colors shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1E3A5F] text-base">
                          {serviceTypeLabels[c.serviceType] || c.serviceType}
                        </h3>
                        <p className="text-[#64748B] text-sm mt-0.5">
                          {formatDate(c.createdAt)} • {c.records?.length || 0} file{(c.records?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <FileText className="size-10 text-[#64748B]/30 mx-auto mb-2" />
                <p className="text-[#64748B] text-sm mb-3">No cases yet</p>
                <Link
                  href="/patient/cases/new"
                  className="inline-flex items-center gap-1 text-[#1E3A5F] font-medium text-sm hover:text-[#15803D] transition-colors"
                >
                  Start your first case <Plus className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
