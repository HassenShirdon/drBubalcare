export const CASE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
}

export const LAB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-healing-teal/10 text-healing-teal' },
  REVIEW_NEEDED: { label: 'Review Needed', color: 'bg-error/10 text-error' },
}

export const OPINION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-amber-50 text-amber-600' },
  SIGNED: { label: 'Signed', color: 'bg-healing-teal/10 text-healing-teal' },
  DELIVERED: { label: 'Delivered', color: 'bg-blue-50 text-blue-600' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
}

export const METRIC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'text-clinical-navy' },
  HIGH: { label: 'High', color: 'text-error' },
  LOW: { label: 'Low', color: 'text-error' },
}
