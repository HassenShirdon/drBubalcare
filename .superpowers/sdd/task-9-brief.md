### Task 9: Doctor Case Review Page

**Files:**
- Create: `app/doctor/cases/[id]/page.tsx`

**Interfaces:**
- Consumes: useDoctorCase, useSubmitOpinion hooks (Task 7), GET/POST /api/doctor/cases/[id]/opinion (Task 8)
- Produces: /doctor/cases/[id] page

- [ ] **Step 1: Create case review page**

Create `app/doctor/cases/[id]/page.tsx`:

```tsx
"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, FileText, Clock, CheckCircle2, AlertCircle, User, Calendar, Loader2, Save, Send } from 'lucide-react';
import { useDoctorCase, useSubmitOpinion } from '@/lib/hooks/use-doctor-cases';

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
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
  const isDraft = existingOpinion?.status === 'DRAFT';

  // Load existing draft into form
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
      <div className="p-4 md:p-6 max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-healing-teal" size={32} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto text-center py-20">
        <p className="text-on-surface-variant">Case not found</p>
        <Link href="/doctor/cases" className="text-clinical-navy text-sm mt-2 inline-block hover:text-healing-teal">
          Back to cases
        </Link>
      </div>
    );
  }

  const status = statusConfig[caseData.status] || statusConfig.OPEN;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto pb-24 md:pb-8 space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/doctor/cases"
          className="inline-flex items-center gap-1 text-on-surface-variant text-sm hover:text-clinical-navy transition-colors mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to cases
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-headline-md text-xl md:text-2xl font-semibold text-text-medical-black">
              {serviceTypeLabels[caseData.serviceType] || caseData.serviceType}
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Patient: {caseData.patient.name ?? 'Unknown'} &middot; Created {formatDate(caseData.createdAt)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
            {status.label}
          </span>
        </div>
      </motion.div>

      {/* Uploaded Records */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                  <p className="text-xs text-on-surface-variant">{record.fileType} &middot; {formatDate(record.uploadedAt)}</p>
                </div>
                <a
                  href={record.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-clinical-navy hover:text-healing-teal font-medium"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-on-surface-variant text-sm">No records uploaded yet.</p>
        )}
      </motion.div>

      {/* AI Pre-screen */}
      {caseData.aiPrescreens && caseData.aiPrescreens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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

      {/* Opinion Form or Signed Opinion Display */}
      {isSigned ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6"
        >
          <h2 className="font-semibold text-text-medical-black mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-4 text-healing-teal" />
            Signed Opinion
          </h2>
          <div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
            <Calendar className="size-3" />
            Signed {existingOpinion.signedAt ? formatDate(existingOpinion.signedAt) : 'Unknown date'}
          </div>
          <div className="space-y-4">
            {parseOpinionSections(existingOpinion.content).map((section, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold text-clinical-navy mb-1">{section.title}</h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6 space-y-5"
        >
          <h2 className="font-semibold text-text-medical-black flex items-center gap-2">
            <FileText className="size-4 text-clinical-navy" />
            Write Your Opinion
          </h2>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Clinical Findings <span className="text-red-500">*</span>
            </label>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Describe your clinical findings from the reviewed materials..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Impression <span className="text-red-500">*</span>
            </label>
            <textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Your clinical impression and assessment..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-medical-black mb-1.5">
              Recommended Next Steps <span className="text-red-500">*</span>
            </label>
            <textarea
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-surface-gray rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-navy/20 focus:border-clinical-navy resize-none"
              placeholder="Recommended next steps for the patient..."
            />
          </div>

          {submitOpinion.isError && (
            <p className="text-red-500 text-sm">{submitOpinion.error.message}</p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveDraft}
              disabled={submitOpinion.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-50"
            >
              {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Save as Draft
            </button>

            {showSignConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant">Confirm signature?</span>
                <button
                  onClick={handleSign}
                  disabled={submitOpinion.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-clinical-navy rounded-lg hover:bg-clinical-navy/90 transition-colors disabled:opacity-50"
                >
                  {submitOpinion.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Sign & Submit
                </button>
                <button
                  onClick={() => setShowSignConfirm(false)}
                  className="text-sm text-on-surface-variant hover:text-error"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSignConfirm(true)}
                disabled={!findings.trim() || !impression.trim() || !nextSteps.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-healing-teal rounded-lg hover:bg-healing-teal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
```

- [ ] **Step 2: Test the page**

Run: `npx next dev --turbopack`
Navigate: `/doctor/cases/[id]` — should show case detail with records, AI prescreen, opinion form
Test: Fill in all three fields → "Sign & Submit" → confirmation → opinion signed, case status changes to OPINION_READY
Test: "Save as Draft" → opinion saved as draft
Test: Reload page → draft loads into form fields

- [ ] **Step 3: Commit**

```bash
git add app/doctor/cases/[id]/page.tsx
git commit -m "feat: add doctor case review page with structured opinion form"
```
