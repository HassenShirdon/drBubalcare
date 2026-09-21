"use client";

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle, User, Calendar, Loader2, ClipboardList } from 'lucide-react';
import { useCase } from '@/lib/hooks/use-cases';
import { CaseStatusTracker } from '@/components/case-status-tracker';
import { FileUpload } from '@/components/file-upload';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OPEN: { label: 'Open', color: 'bg-pulse-info-light text-pulse-navy', icon: <Clock className="size-3.5" /> },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-pulse-info-light text-pulse-navy', icon: <Clock className="size-3.5" /> },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-pulse-warning-light text-pulse-warning', icon: <Clock className="size-3.5" /> },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-pulse-success-light/80 text-pulse-success', icon: <CheckCircle2 className="size-3.5" /> },
  CLOSED: { label: 'Closed', color: 'bg-pulse-surface-elevated text-pulse-text-secondary', icon: <CheckCircle2 className="size-3.5" /> },
  DISPUTED: { label: 'Disputed', color: 'bg-pulse-red-light text-pulse-red', icon: <AlertCircle className="size-3.5" /> },
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

const reviewTypeLabels: Record<string, string> = {
  BASIC_CASE_REVIEW: 'Basic case review',
  COMPREHENSIVE_SECOND_OPINION: 'Comprehensive second opinion',
  SPECIALIST_GLOBAL_EXPERT: 'Specialist / global expert review',
  MULTIDISCIPLINARY_REVIEW: 'Multidisciplinary review',
};

function intakeLabel(value?: string | null) {
  if (!value) return 'Not specified';
  return reviewTypeLabels[value] || value;
}

const sexLabels: Record<string, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
  PREFER_NOT_TO_SAY: 'Prefer not to say',
};

function sexLabel(value?: string | null) {
  if (!value) return 'Not specified';
  return sexLabels[value] || value;
}

function IntakeRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-pulse-text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-pulse-text-primary whitespace-pre-wrap">{value}</dd>
    </div>
  );
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
      <div className="p-4 md:p-8 flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-pulse-success" size={32} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-4 md:p-8 text-center py-20">
        <p className="text-pulse-text-secondary">Case not found</p>
        <Link href="/patient/cases" className="text-pulse-navy text-sm mt-2 inline-block hover:text-pulse-success">
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.OPEN;

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/patient/cases"
          className="inline-flex items-center gap-1 text-pulse-text-secondary text-sm hover:text-pulse-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-pulse-navy font-bold text-2xl md:text-3xl">
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="text-pulse-text-secondary text-sm mt-1">
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
          className="bg-white rounded-2xl border border-pulse-border shadow-sm p-6"
        >
          <h2 className="font-semibold text-pulse-text-primary mb-3 flex items-center gap-2">
            <User className="size-4 text-pulse-navy" />
            Assigned Specialist
          </h2>
          <p className="text-pulse-text-primary font-medium">{caseData.specialist.name}</p>
          <p className="text-pulse-text-secondary text-sm">{caseData.specialist.email}</p>
        </motion.div>
      )}

      {/* Uploaded Records */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-pulse-border shadow-sm p-6"
      >
        <h2 className="font-semibold text-pulse-text-primary mb-3 flex items-center gap-2">
          <FileText className="size-4 text-pulse-navy" />
          Uploaded Records ({caseData.records?.length || 0})
        </h2>
        {caseData.records && caseData.records.length > 0 ? (
          <ul className="space-y-2">
            {caseData.records.map((record: any) => (
              <li key={record.id} className="flex items-center gap-3 p-3 rounded-xl bg-pulse-bg">
                <FileText className="size-4 text-pulse-text-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pulse-text-primary truncate">{record.fileName}</p>
                  <p className="text-xs text-pulse-text-secondary">{record.fileType} • {formatDate(record.uploadedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4">
          <FileUpload caseId={id} onUploadComplete={() => window.location.reload()} />
        </div>
      </motion.div>

      {/* Case Intake Summary */}
      {caseData.intake && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-white rounded-2xl border border-pulse-border shadow-sm p-6"
        >
          <h2 className="font-semibold text-pulse-text-primary mb-4 flex items-center gap-2">
            <ClipboardList className="size-4 text-pulse-navy" />
            Patient Case Review Summary
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {caseData.intake.age != null && (
              <IntakeRow label="Age" value={String(caseData.intake.age)} />
            )}
            <IntakeRow label="Sex" value={sexLabel(caseData.intake.sex)} />
            <IntakeRow label="Review type" value={intakeLabel(caseData.intake.reviewType)} />
            <IntakeRow
              label="Reasons"
              value={
                caseData.intake.reasonForRequest?.length
                  ? caseData.intake.reasonForRequest.join(', ')
                  : 'Not specified'
              }
            />
            <div className="sm:col-span-2">
              <IntakeRow label="Main concern" value={caseData.intake.mainConcern} />
            </div>
            {caseData.intake.diagnosis && (
              <IntakeRow label="Diagnosis" value={caseData.intake.diagnosis} />
            )}
            {caseData.intake.mainSymptoms && (
              <div className="sm:col-span-2">
                <IntakeRow label="Main symptoms" value={caseData.intake.mainSymptoms} />
              </div>
            )}
            {caseData.intake.medicalHistory?.length > 0 && (
              <IntakeRow label="Medical history" value={caseData.intake.medicalHistory.join(', ')} />
            )}
            {caseData.intake.familyHistory?.length > 0 && (
              <IntakeRow label="Family history" value={caseData.intake.familyHistory.join(', ')} />
            )}
            {caseData.intake.patientGoals && (
              <div className="sm:col-span-2">
                <IntakeRow label="Patient goals" value={caseData.intake.patientGoals} />
              </div>
            )}
            {caseData.intake.requestedSpecialty && (
              <IntakeRow label="Specialty requested" value={caseData.intake.requestedSpecialty} />
            )}
          </dl>
        </motion.div>
      )}

      {/* AI Pre-screen */}
      {caseData.aiPrescreens && caseData.aiPrescreens.length > 0 && (        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-pulse-info/30 bg-pulse-info-light p-6 shadow-soft"
        >
          <h2 className="mb-2 flex items-center gap-2 font-semibold text-pulse-navy">
            <span className="size-2 rounded-full bg-pulse-info" aria-hidden="true" />
            AI-generated draft
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-pulse-text-secondary">
            {caseData.aiPrescreens[0].findings}
          </p>
          {caseData.aiPrescreens[0].urgentFlags && (
            <div className="mt-3 rounded-lg border border-pulse-red/30 bg-pulse-red-light p-3">
              <p className="text-sm font-medium text-pulse-red">Urgent flags</p>
              <p className="mt-1 text-sm text-pulse-red">{caseData.aiPrescreens[0].urgentFlags}</p>
            </div>
          )}
          <p className="mt-3 text-xs text-pulse-text-muted">
            This is an AI draft, not a diagnosis. A board-certified physician reviews all findings
            before they are final.
          </p>
        </motion.div>
      )}

      {/* Specialist Opinion */}
      {caseData.opinions && caseData.opinions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-pulse-border shadow-sm p-6"
        >
          <h2 className="font-semibold text-pulse-text-primary mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-pulse-success" />
            Specialist Opinion
          </h2>
          <div className="flex items-center gap-2 mb-4 text-xs text-pulse-text-secondary">
            <User className="size-3" />
            {caseData.opinions[0].specialist.name}
            <span className="text-pulse-text-secondary/50">&middot;</span>
            <Calendar className="size-3" />
            {formatDate(caseData.opinions[0].signedAt || caseData.opinions[0].createdAt)}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(caseData.opinions[0].content).map((section, i) => (
              <div key={i}>
                {section.title && <h3 className="text-sm font-semibold text-pulse-navy mb-1">{section.title}</h3>}
                <p className="text-sm text-pulse-text-primary leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plain-Language Summary */}
      {caseData.opinions?.[0]?.plainSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-pulse-border bg-pulse-bg p-6"
        >
          <h3 className="mb-3 text-sm font-semibold text-pulse-navy">Your results in plain language</h3>
          <div className="mb-4 rounded-lg border border-pulse-info/30 bg-pulse-info-light p-3">
            <p className="text-xs font-medium text-pulse-navy">
              AI-generated summary — based on your specialist&apos;s written opinion. Your specialist has reviewed and approved this.
            </p>
          </div>
          <div className="prose prose-sm max-w-none text-pulse-text-secondary">
            {caseData.opinions[0].plainSummary.content.split('\n').map((paragraph: string, i: number) => (
              paragraph.trim() && <p key={i}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
