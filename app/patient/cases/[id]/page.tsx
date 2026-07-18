"use client";

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle, User, Calendar, Loader2 } from 'lucide-react';
import { useCase } from '@/lib/hooks/use-cases';
import { CaseStatusTracker } from '@/components/case-status-tracker';
import { FileUpload } from '@/components/file-upload';

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
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseOpinionSections(content: string): { title: string; body: string }[] {
  const lines = content.split('\n');
  const sections: { title: string; body: string }[] = [];
  let currentTitle = '';
  let currentBody: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,3}\s+.+|[A-Z][A-Za-z\s]+:)\s*$/);
    if (headerMatch) {
      if (currentTitle || currentBody.length > 0) {
        sections.push({
          title: currentTitle.replace(/^#+\s*/, '').replace(/:$/, ''),
          body: currentBody.join('\n').trim(),
        });
      }
      currentTitle = headerMatch[1];
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentTitle || currentBody.length > 0) {
    sections.push({
      title: currentTitle.replace(/^#+\s*/, '').replace(/:$/, ''),
      body: currentBody.join('\n').trim(),
    });
  }

  if (sections.length === 0 && content.trim()) {
    sections.push({ title: '', body: content.trim() });
  }

  return sections;
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: caseData, isLoading } = useCase(id);

  if (isLoading) {
    return (
      <div className="p-4 md:p-margin-desktop max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-healing-teal" size={32} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-4 md:p-margin-desktop max-w-4xl mx-auto text-center py-20">
        <p className="text-on-surface-variant">Case not found</p>
        <Link href="/patient/cases" className="text-clinical-navy text-sm mt-2 inline-block hover:text-healing-teal">
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.OPEN;

  return (
    <div className="p-4 md:p-margin-desktop max-w-4xl mx-auto pb-24 md:pb-8 space-y-stack-xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/patient/cases"
          className="inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-clinical-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-headline-lg text-clinical-navy font-bold text-2xl md:text-3xl">
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Created {formatDate(caseData.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* Status Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <CaseStatusTracker currentStatus={caseData.status} />
      </motion.div>

      {/* Specialist Info */}
      {caseData.specialist && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-3 flex items-center gap-2">
            <User className="size-4 text-clinical-navy" />
            Assigned Specialist
          </h2>
          <p className="text-text-medical-black font-medium">{caseData.specialist.name}</p>
          <p className="text-on-surface-variant text-sm">{caseData.specialist.email}</p>
        </motion.div>
      )}

      {/* Uploaded Records */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
      >
        <h2 className="font-semibold text-text-medical-black mb-3 flex items-center gap-2">
          <FileText className="size-4 text-clinical-navy" />
          Uploaded Records ({caseData.records?.length || 0})
        </h2>
        {caseData.records && caseData.records.length > 0 ? (
          <ul className="space-y-2">
            {caseData.records.map((record: any) => (
              <li key={record.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <FileText className="size-4 text-on-surface-variant" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-medical-black truncate">{record.fileName}</p>
                  <p className="text-xs text-on-surface-variant">{record.fileType} • {formatDate(record.uploadedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4">
          <FileUpload caseId={id} onUploadComplete={() => window.location.reload()} />
        </div>
      </motion.div>

      {/* AI Pre-screen */}
      {caseData.aiPrescreens && caseData.aiPrescreens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-evidence-blue-light/30 to-surface border border-evidence-blue-light/60 rounded-2xl shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-2 flex items-center gap-2">
            <span className="size-2 bg-clinical-navy rounded-full" />
            AI Pre-screen
          </h2>
          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
            {caseData.aiPrescreens[0].findings}
          </p>
          {caseData.aiPrescreens[0].urgentFlags && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700 text-sm font-medium">Urgent Flags</p>
              <p className="text-amber-600 text-sm mt-1">{caseData.aiPrescreens[0].urgentFlags}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Specialist Opinion */}
      {caseData.opinions && caseData.opinions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-healing-teal" />
            Specialist Opinion
          </h2>
          <div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
            <User className="size-3" />
            {caseData.opinions[0].specialist.name}
            <span className="text-on-surface-variant/50">&middot;</span>
            <Calendar className="size-3" />
            {formatDate(caseData.opinions[0].signedAt || caseData.opinions[0].createdAt)}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(caseData.opinions[0].content).map((section, i) => (
              <div key={i}>
                {section.title && <h3 className="text-sm font-semibold text-clinical-navy mb-1">{section.title}</h3>}
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
