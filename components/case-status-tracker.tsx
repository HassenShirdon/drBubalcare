"use client";

import { CheckCircle2, Clock, FileText } from 'lucide-react';

const steps = [
  { key: 'OPEN', label: 'Case opened', icon: <FileText className="size-4" aria-hidden="true" /> },
  { key: 'AI_PRE_SCREENED', label: 'AI pre-screened', icon: <Clock className="size-4" aria-hidden="true" /> },
  { key: 'UNDER_REVIEW', label: 'Under review', icon: <Clock className="size-4" aria-hidden="true" /> },
  { key: 'OPINION_READY', label: 'Opinion ready', icon: <CheckCircle2 className="size-4" aria-hidden="true" /> },
  { key: 'CLOSED', label: 'Closed', icon: <CheckCircle2 className="size-4" aria-hidden="true" /> },
];

const statusOrder: Record<string, number> = {
  OPEN: 0,
  AI_PRE_SCREENED: 1,
  UNDER_REVIEW: 2,
  OPINION_READY: 3,
  CLOSED: 4,
  DISPUTED: -1,
};

interface CaseStatusTrackerProps {
  currentStatus: string;
}

export function CaseStatusTracker({ currentStatus }: CaseStatusTrackerProps) {
  const currentStep = statusOrder[currentStatus] ?? 0;
  const isDisputed = currentStatus === 'DISPUTED';

  return (
    <div className="rounded-xl border border-pulse-border bg-pulse-surface p-6 shadow-soft">
      {isDisputed ? (
        <div className="py-4 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-pulse-red-light">
            <Clock className="size-6 text-pulse-red" aria-hidden="true" />
          </div>
          <p className="font-medium text-pulse-red">Case disputed</p>
          <p className="mt-1 text-sm text-pulse-text-secondary">
            This case is under review by our team.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="flex flex-1 items-center last:flex-initial">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                      isCompleted
                        ? 'bg-pulse-success text-white'
                        : isCurrent
                          ? 'bg-pulse-navy text-white ring-4 ring-pulse-navy/15'
                          : 'bg-pulse-surface-elevated text-pulse-text-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="size-4" aria-hidden="true" /> : step.icon}
                  </div>
                  <p
                    className={`mt-2 hidden text-center text-xs sm:block ${
                      isCurrent
                        ? 'font-semibold text-pulse-navy'
                        : isCompleted
                          ? 'text-pulse-success'
                          : 'text-pulse-text-muted'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      index < currentStep ? 'bg-pulse-success' : 'bg-pulse-surface-elevated'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
