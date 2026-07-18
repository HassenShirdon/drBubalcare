import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { AlertCircle, CheckCircle2, ArrowRight, FlaskConical } from 'lucide-react';

async function getPendingReviews() {
  return prisma.labResult.findMany({
    where: { status: 'REVIEW_NEEDED' },
    include: {
      patient: { select: { name: true, email: true } },
      metrics: true,
    },
    orderBy: { date: 'desc' },
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function LabReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  const reviews = await getPendingReviews();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-medical-black">Lab Reviews</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          {reviews.length} pending review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-12 text-center">
          <CheckCircle2 className="size-12 text-healing-teal/50 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-text-medical-black mb-1">All caught up</h2>
          <p className="text-on-surface-variant text-sm">No lab results pending review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((lab) => {
            const abnormalMetrics = lab.metrics.filter((m) => m.status !== 'NORMAL');
            return (
              <div
                key={lab.id}
                className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    <AlertCircle className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-text-medical-black">{lab.name}</h3>
                      <span className="text-xs text-on-surface-variant">{formatDate(lab.date)}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-3">
                      Patient: {lab.patient.name ?? 'Unknown'} ({lab.patient.email})
                    </p>

                    {abnormalMetrics.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs font-medium text-amber-600">Abnormal markers:</p>
                        {abnormalMetrics.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center gap-2 text-sm bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5"
                          >
                            <span className="font-medium text-text-medical-black">{m.name}</span>
                            <span className="text-on-surface-variant">
                              {m.value} {m.unit}
                            </span>
                            <span className="text-xs text-on-surface-variant">
                              (ref: {m.referenceRange})
                            </span>
                            <span className={`ml-auto text-xs font-medium ${m.status === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`}>
                              {m.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {lab.aiInterpretation && (
                      <div className="bg-evidence-blue-light/30 border border-evidence-blue-light/60 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-clinical-navy mb-1">AI Draft Interpretation</p>
                        <p className="text-sm text-on-surface-variant">{lab.aiInterpretation}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="text-sm px-4 py-1.5 rounded-lg bg-clinical-navy text-white font-medium hover:bg-primary-container transition-colors">
                        Approve & Save
                      </button>
                      <button className="text-sm px-4 py-1.5 rounded-lg border border-surface-gray text-on-surface-variant font-medium hover:bg-surface-container-low transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
