"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, CheckCircle2, Calendar, Loader2, Save, Send } from 'lucide-react';
import { useDoctorCase, useSubmitOpinion } from '@/lib/hooks/use-doctor-cases';

const statusConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  OPEN: { label: 'Open', style: { background: '#DBEAFE', color: '#1E40AF' } },
  AI_PRE_SCREENED: { label: 'Pre-screened', style: { background: '#DBEAFE', color: '#1E40AF' } },
  UNDER_REVIEW: { label: 'Under Review', style: { background: '#FEF3C7', color: '#B45309' } },
  OPINION_READY: { label: 'Opinion Ready', style: { background: '#DCFCE7', color: '#15803D' } },
  CLOSED: { label: 'Closed', style: { background: '#F1F5F9', color: '#64748B' } },
  DISPUTED: { label: 'Disputed', style: { background: '#FEF2F2', color: '#B91C1C' } },
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
      <div className="p-6 flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={32} style={{ color: '#22C55E' }} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6 text-center py-20">
        <p style={{ color: '#64748B' }}>Case not found</p>
        <Link href="/doctor/cases" className="text-sm mt-2 inline-block" style={{ color: '#3B82F6' }}>
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.OPEN;

  return (
    <div className="p-6 pb-24 md:pb-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/doctor/cases"
          className="inline-flex items-center gap-1 text-sm mb-4"
          style={{ color: '#64748B' }}
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#1E3A5F' }}>
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#64748B' }}>
              Patient: {caseData.patient.name ?? 'Unknown'} &middot; {caseData.patient.age ?? "—"} yrs &middot; {caseData.patient.gender ?? "—"} &middot; Created {formatDate(caseData.createdAt)}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
            style={status.style}
          >
            {status.label}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-lg shadow-sm p-5"
        style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
      >
        <h2 className="font-semibold mb-3 flex items-center gap-2 text-sm" style={{ color: '#1E3A5F' }}>
          <FileText className="size-4" style={{ color: '#3B82F6' }} />
          Uploaded Records ({caseData.records?.length || 0})
        </h2>
        {caseData.records && caseData.records.length > 0 ? (
          <ul className="space-y-2">
            {caseData.records.map((record: { id: string; fileName: string; fileType: string; fileUrl: string; uploadedAt: string }) => (
              <li key={record.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#F1F5F9' }}>
                <FileText className="size-4" style={{ color: '#64748B' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{record.fileName}</p>
                  <p className="text-xs" style={{ color: '#64748B' }}>{record.fileType} &middot; {formatDate(record.uploadedAt)}</p>
                </div>
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium"
                  style={{ color: '#3B82F6' }}
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#64748B' }} className="text-sm">No records uploaded yet.</p>
        )}
      </motion.div>

      {caseData.aiPrescreens && caseData.aiPrescreens[0] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-lg p-5"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#1E3A5F' }}>AI Pre-Screen</h3>

          <div className="rounded-lg p-3 mb-4" style={{ background: '#DBEAFE', border: '1px solid #93C5FD' }}>
            <p className="text-xs font-medium" style={{ color: '#1E40AF' }}>
              AI-Generated Pre-Screen — for specialist review only. Verify all findings before use.
            </p>
          </div>

          {caseData.aiPrescreens[0].findings && (
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-2" style={{ color: '#475569' }}>Key Findings</h4>
              <ul className="space-y-1">
                {caseData.aiPrescreens[0].findings.split('\n').filter(Boolean).map((finding: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#0F172A' }}>
                    <span className="mt-1" style={{ color: '#3B82F6' }}>•</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {caseData.aiPrescreens[0].differentials && (
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-2" style={{ color: '#475569' }}>Differentials to Consider</h4>
              <ul className="space-y-1">
                {caseData.aiPrescreens[0].differentials.split('\n').filter(Boolean).map((diff: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#0F172A' }}>
                    <span className="mt-1" style={{ color: '#F59E0B' }}>⚠</span>
                    {diff}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {caseData.aiPrescreens[0].urgentFlags && (
            <div className="rounded-lg p-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h4 className="text-xs font-medium mb-2" style={{ color: '#B91C1C' }}>Urgent Flags</h4>
              <ul className="space-y-1">
                {caseData.aiPrescreens[0].urgentFlags.split('\n').filter(Boolean).map((flag: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#B91C1C' }}>
                    <span className="mt-1">🚨</span>
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
          className="rounded-lg shadow-sm p-6"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-sm" style={{ color: '#1E3A5F' }}>
            <CheckCircle2 className="size-4" style={{ color: '#22C55E' }} />
            Signed Opinion
          </h2>
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: '#64748B' }}>
            <Calendar className="size-3" />
            Signed {existingOpinion.signedAt ? formatDate(existingOpinion.signedAt) : 'Unknown date'}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(existingOpinion.content).map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: '#3B82F6' }}>{section.title}</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#0F172A' }}>{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg shadow-sm p-6 space-y-5"
          style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}
        >
          <h2 className="font-semibold flex items-center gap-2 text-sm" style={{ color: '#1E3A5F' }}>
            <FileText className="size-4" style={{ color: '#3B82F6' }} />
            Write Your Opinion
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#0F172A' }}>
              Clinical Findings <span style={{ color: '#E63946' }}>*</span>
            </label>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 text-sm rounded-lg resize-none focus:outline-none focus:ring-2"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
              placeholder="Describe your clinical findings from the reviewed materials..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#0F172A' }}>
              Impression <span style={{ color: '#E63946' }}>*</span>
            </label>
            <textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-lg resize-none focus:outline-none focus:ring-2"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
              placeholder="Your clinical impression and assessment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#0F172A' }}>
              Recommended Next Steps <span style={{ color: '#E63946' }}>*</span>
            </label>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm rounded-lg resize-none focus:outline-none focus:ring-2"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
              placeholder="Recommended next steps for the patient..."
            />
          </div>

          {submitOpinion.isError && (
            <p className="text-sm" style={{ color: '#E63946' }}>{submitOpinion.error.message}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveDraft}
              disabled={submitOpinion.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              style={{ background: '#F8FAFC', color: '#64748B' }}
            >
              {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save as Draft
            </button>

            {showSignConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#64748B' }}>Confirm signature?</span>
                <button
                  onClick={handleSign}
                  disabled={submitOpinion.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                  style={{ background: '#22C55E' }}
                >
                  {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Sign & Submit
                </button>
                <button
                  onClick={() => setShowSignConfirm(false)}
                  className="text-sm"
                  style={{ color: '#64748B' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignConfirm(true)}
                disabled={!findings.trim() || !impression.trim() || !nextSteps.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: '#22C55E' }}
              >
                <Send className="size-4" />
                Sign & Submit
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
