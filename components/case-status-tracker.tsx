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
    <div className="bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-sm p-6">
      {isDisputed ? (
        <div className="text-center py-4">
          <div className="size-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <Clock className="size-6 text-red-500" />
          </div>
          <p className="font-medium text-red-600">Case Disputed</p>
          <p className="text-sm text-[#64748B] mt-1">This case is under review by our team.</p>
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
                        ? 'bg-[#15803D] text-white'
                        : isCurrent
                        ? 'bg-[#1E3A5F] text-white ring-4 ring-[#1E3A5F]/20'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="size-4" /> : step.icon}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center hidden sm:block ${
                      isCurrent ? 'font-bold text-[#1E3A5F]' : isCompleted ? 'text-[#15803D]' : 'text-[#64748B]'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-[#15803D]' : 'bg-[#F1F5F9]'
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
