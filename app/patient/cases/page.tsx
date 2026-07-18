"use client";

import Link from 'next/link';
import { motion } from 'motion/react';
import { Plus, FileText, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCases } from '@/lib/hooks/use-cases';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600', icon: <Clock className="size-3.5" /> },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600', icon: <Clock className="size-3.5" /> },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600', icon: <Clock className="size-3.5" /> },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal', icon: <CheckCircle2 className="size-3.5" /> },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500', icon: <CheckCircle2 className="size-3.5" /> },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600', icon: <AlertCircle className="size-3.5" /> },
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
    <div className="p-4 md:p-margin-desktop max-w-5xl mx-auto pb-24 md:pb-8 space-y-stack-xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="font-caption text-on-surface-variant text-sm mb-1">Patient Portal</p>
          <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl">My Cases</h1>
        </div>
        <Link
          href="/patient/cases/new"
          className="inline-flex items-center gap-2 bg-clinical-navy text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-clinical-navy/90 transition-colors"
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
        <div className="card border border-surface-gray shadow-sm bg-surface overflow-hidden">
          <div className="divide-y divide-surface-gray">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-healing-teal" size={24} />
              </div>
            ) : cases && cases.length > 0 ? (
              cases.map((c: any) => {
                const status = statusConfig[c.status] || statusConfig.OPEN;
                return (
                  <Link
                    href={`/patient/cases/${c.id}`}
                    key={c.id}
                    className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group block"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-evidence-blue-light/50 flex items-center justify-center text-clinical-navy group-hover:bg-clinical-navy group-hover:text-white transition-colors shrink-0">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-headline-md font-bold text-clinical-navy text-base">
                          {serviceTypeLabels[c.serviceType] || c.serviceType}
                        </h3>
                        <p className="text-on-surface-variant text-sm mt-0.5">
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
                <FileText className="size-10 text-on-surface-variant/30 mx-auto mb-2" />
                <p className="text-on-surface-variant text-sm mb-3">No cases yet</p>
                <Link
                  href="/patient/cases/new"
                  className="inline-flex items-center gap-1 text-clinical-navy font-medium text-sm hover:text-healing-teal transition-colors"
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
