"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2, Calendar, Loader2, Save, Send, Sparkles, AlertTriangle, AlertCircle } from 'lucide-react';
import { useDoctorCase, useSubmitOpinion } from '@/lib/hooks/use-doctor-cases';

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: { label: 'Open', className: 'bg-pulse-info-light text-pulse-navy' },
  AI_PRE_SCREENED: { label: 'Pre-screened', className: 'bg-pulse-info-light text-pulse-navy' },
  UNDER_REVIEW: { label: 'Under review', className: 'bg-pulse-warning-light text-pulse-warning' },
  OPINION_READY: { label: 'Opinion ready', className: 'bg-pulse-success-light text-pulse-success' },
  CLOSED: { label: 'Closed', className: 'bg-pulse-surface-elevated text-pulse-text-muted' },
  DISPUTED: { label: 'Disputed', className: 'bg-pulse-red-light text-pulse-red' },
};

const serviceTypeLabels: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist opinion',
  RESULT_INTERPRETATION: 'Result interpretation',
  FOLLOW_UP: 'Follow-up consultation',
  TREND_ANALYSIS: 'Lab trend analysis',
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

function parseOpinionSections(content: string) {
  const sections = content.split(/^## /m).filter(Boolean);
  return sections.map((section) => {
    const [title, ...body] = section.split('\n');
    return { title: title.trim(), body: body.join('\n').trim() };
  });
}

export default function DoctorCaseReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: caseData, isLoading } = useDoctorCase(id);
  const submitOpinion = useSubmitOpinion();

  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [showSignConfirm, setShowSignConfirm] = useState(false);

  const existingOpinion = caseData?.opinions?.[0];
  const isSigned = existingOpinion?.status === 'SIGNED' || existingOpinion?.status === 'DELIVERED';

  useEffect(() => {
    if (existingOpinion?.content) {
      const sections = parseOpinionSections(existingOpinion.content);
      for (const section of sections) {
        if (section.title.toLowerCase().includes('finding')) setFindings(section.body);
        else if (section.title.toLowerCase().includes('impression')) setImpression(section.body);
        else if (section.title.toLowerCase().includes('next step')) setNextSteps(section.body);
      }
    }
  }, [existingOpinion]);

  const buildContent = () => {
    return `## Clinical Findings\n${findings}\n\n## Impression\n${impression}\n\n## Recommended Next Steps\n${nextSteps}`;
  };

  const handleSaveDraft = async () => {
    await submitOpinion.mutateAsync({
      caseId: id,
      content: buildContent(),
      sign: false,
    });
  };

  const handleSign = async () => {
    await submitOpinion.mutateAsync({
      caseId: id,
      content: buildContent(),
      sign: true,
    });
    setShowSignConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 py-20">
        <Loader2 className="animate-spin text-pulse-info" size={32} aria-label="Loading case" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6 py-20 text-center">
        <p className="text-pulse-text-secondary">Case not found.</p>
        <Link href="/doctor/cases" className="mt-2 inline-block text-sm font-medium text-pulse-info hover:underline">
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] ?? statusConfig.OPEN;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 pb-24 md:p-6 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/doctor/cases"
          className="mb-4 inline-flex items-center gap-1 text-sm text-pulse-text-secondary transition-colors hover:text-pulse-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-pulse-navy">
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="mt-1 text-sm text-pulse-text-secondary">
              Patient: {caseData.patient.name ?? 'Unknown'} &middot; {caseData.patient.age ?? '—'} yrs &middot; {caseData.patient.gender ?? '—'} &middot; Created {formatDate(caseData.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-pulse-border bg-pulse-surface p-5 shadow-soft"
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-pulse-navy">
          <FileText className="size-4 text-pulse-info" aria-hidden="true" />
          Uploaded records ({caseData.records?.length || 0})
        </h2>
        {caseData.records && caseData.records.length > 0 ? (
          <ul className="space-y-2">
            {caseData.records.map((record: { id: string; fileName: string; fileType: string; fileUrl: string; uploadedAt: string }) => (
              <li key={record.id} className="flex items-center gap-3 rounded-lg bg-pulse-surface-elevated p-3">
                <FileText className="size-4 text-pulse-text-muted" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-pulse-text-primary">{record.fileName}</p>
                  <p className="text-xs text-pulse-text-muted">{record.fileType} &middot; {formatDate(record.uploadedAt)}</p>
                </div>
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded text-xs font-medium text-pulse-info hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-pulse-text-secondary">No records uploaded yet.</p>
        )}
      </motion.div>

      {caseData.aiPrescreens && caseData.aiPrescreens[0] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-pulse-border bg-pulse-surface p-5 shadow-soft"
        >
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-pulse-navy">
            <Sparkles className="size-4 text-pulse-info" aria-hidden="true" />
            AI-generated pre-screen
          </h3>

          <div className="mb-4 rounded-lg border border-pulse-info/30 bg-pulse-info-light p-3">
            <p className="text-xs font-medium text-pulse-navy">
              AI-generated draft — for specialist review only. Verify all findings before use.
            </p>
          </div>

          {caseData.aiPrescreens[0].findings && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-pulse-text-muted">Key findings</h4>
              <ul className="space-y-1">
                {caseData.aiPrescreens[0].findings.split('\n').filter(Boolean).map((finding: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-pulse-text-primary">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pulse-info" aria-hidden="true" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {caseData.aiPrescreens[0].differentials && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-pulse-text-muted">Differentials to consider</h4>
              <ul className="space-y-1">
                {caseData.aiPrescreens[0].differentials.split('\n').filter(Boolean).map((diff: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-pulse-text-primary">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-pulse-warning" aria-hidden="true" />
                    {diff}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {caseData.aiPrescreens[0].urgentFlags && (
            <div className="rounded-lg border border-pulse-red/30 bg-pulse-red-light p-3">
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium text-pulse-red">
                <AlertCircle className="size-3.5" aria-hidden="true" />
                Urgent flags
              </h4>
              <ul className="space-y-1">
                {caseData.aiPrescreens[0].urgentFlags.split('\n').filter(Boolean).map((flag: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-pulse-red">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pulse-red" aria-hidden="true" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {isSigned ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-pulse-border bg-pulse-surface p-6 shadow-soft"
        >
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-pulse-navy">
            <CheckCircle2 className="size-4 text-pulse-success" aria-hidden="true" />
            Signed opinion
          </h2>
          <div className="mb-4 flex items-center gap-2 text-xs text-pulse-text-muted">
            <Calendar className="size-3" aria-hidden="true" />
            Signed {existingOpinion.signedAt ? formatDate(existingOpinion.signedAt) : 'Unknown date'}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(existingOpinion.content).map((section, i) => (
              <div key={i}>
                <h3 className="mb-1 text-sm font-semibold text-pulse-info">{section.title}</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-pulse-text-primary">{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5 rounded-xl border border-pulse-border bg-pulse-surface p-6 shadow-soft"
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold text-pulse-navy">
            <FileText className="size-4 text-pulse-info" aria-hidden="true" />
            Write your opinion
          </h2>

          <div>
            <label htmlFor="findings" className="mb-1.5 block text-sm font-medium text-pulse-text-primary">
              Clinical findings <span className="text-pulse-red">*</span>
            </label>
            <textarea
              id="findings"
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-pulse-border bg-pulse-bg px-3 py-2.5 text-sm text-pulse-text-primary outline-none transition-colors placeholder:text-pulse-text-muted focus:ring-2 focus:ring-pulse-info/30"
              placeholder="Describe your clinical findings from the reviewed materials."
            />
          </div>

          <div>
            <label htmlFor="impression" className="mb-1.5 block text-sm font-medium text-pulse-text-primary">
              Impression <span className="text-pulse-red">*</span>
            </label>
            <textarea
              id="impression"
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-pulse-border bg-pulse-bg px-3 py-2.5 text-sm text-pulse-text-primary outline-none transition-colors placeholder:text-pulse-text-muted focus:ring-2 focus:ring-pulse-info/30"
              placeholder="Your clinical impression and assessment."
            />
          </div>

          <div>
            <label htmlFor="nextSteps" className="mb-1.5 block text-sm font-medium text-pulse-text-primary">
              Recommended next steps <span className="text-pulse-red">*</span>
            </label>
            <textarea
              id="nextSteps"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-pulse-border bg-pulse-bg px-3 py-2.5 text-sm text-pulse-text-primary outline-none transition-colors placeholder:text-pulse-text-muted focus:ring-2 focus:ring-pulse-info/30"
              placeholder="Recommended next steps for the patient."
            />
          </div>

          {submitOpinion.isError && (
            <p className="text-sm text-pulse-red">{submitOpinion.error.message}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={submitOpinion.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-pulse-surface-elevated px-4 py-2 text-sm font-medium text-pulse-text-secondary transition-colors hover:bg-pulse-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40 active:scale-[0.98] disabled:opacity-50"
            >
              {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
              Save draft
            </button>

            {showSignConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-pulse-text-secondary">Confirm signature?</span>
                <button
                  type="button"
                  onClick={handleSign}
                  disabled={submitOpinion.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-pulse-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pulse-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-success/40 active:scale-[0.98] disabled:opacity-50"
                >
                  {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
                  Sign and submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignConfirm(false)}
                  className="rounded text-sm text-pulse-text-secondary hover:text-pulse-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSignConfirm(true)}
                disabled={!findings.trim() || !impression.trim() || !nextSteps.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-pulse-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pulse-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-success/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-4" aria-hidden="true" />
                Sign and submit
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
