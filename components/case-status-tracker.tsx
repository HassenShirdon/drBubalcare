"use client";

import { CheckCircle2, Clock, FileText } from 'lucide-react';

const steps = [
  { key: 'OPEN', label: 'Case Opened', icon: <FileText className="size-4" /> },
  { key: 'AI_PRE_SCREENED', label: 'AI Pre-screened', icon: <Clock className="size-4" /> },
  { key: 'UNDER_REVIEW', label: 'Under Review', icon: <Clock className="size-4" /> },
  { key: 'OPINION_READY', label: 'Opinion Ready', icon: <CheckCircle2 className="size-4" /> },
  { key: 'CLOSED', label: 'Closed', icon: <CheckCircle2 className="size-4" /> },
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
    <div className="bg-white rounded-2xl border border-surface-gray/60 shadow-sm p-6">
      {isDisputed ? (
        <div className="text-center py-4">
          <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <Clock className="size-6 text-red-500" />
          </div>
          <p className="font-medium text-red-600">Case Disputed</p>
          <p className="text-sm text-on-surface-variant mt-1">This case is under review by our team.</p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-8 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-healing-teal text-white'
                        : isCurrent
                        ? 'bg-clinical-navy text-white ring-4 ring-clinical-navy/20'
                        : 'bg-surface-gray text-on-surface-variant'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="size-4" /> : step.icon}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center hidden sm:block ${
                      isCurrent ? 'font-bold text-clinical-navy' : isCompleted ? 'text-healing-teal' : 'text-on-surface-variant'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-healing-teal' : 'bg-surface-gray'
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
