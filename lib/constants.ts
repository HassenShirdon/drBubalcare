export const CASE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-admin-brand-light text-admin-accent-blue px-2.5 py-0.5 rounded-full text-xs font-medium' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-admin-brand-light text-admin-accent-blue px-2.5 py-0.5 rounded-full text-xs font-medium' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-admin-warning-light text-admin-warning px-2.5 py-0.5 rounded-full text-xs font-medium' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CLOSED: { label: 'Closed', color: 'bg-admin-surface-elevated text-admin-text-faint px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISPUTED: { label: 'Disputed', color: 'bg-admin-danger-light text-admin-danger px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
  EUROPEAN_REFERRAL: 'European Specialist Referral',
}

export const LAB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  REVIEW_NEEDED: { label: 'Review Needed', color: 'bg-admin-danger-light text-admin-danger px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const OPINION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-admin-warning-light text-admin-warning px-2.5 py-0.5 rounded-full text-xs font-medium' },
  SIGNED: { label: 'Signed', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DELIVERED: { label: 'Delivered', color: 'bg-admin-brand-light text-admin-accent-blue px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISPUTED: { label: 'Disputed', color: 'bg-admin-danger-light text-admin-danger px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const METRIC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'text-admin-success' },
  HIGH: { label: 'High', color: 'text-admin-danger' },
  LOW: { label: 'Low', color: 'text-admin-danger' },
}

export const DISPUTE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-admin-warning-light text-admin-warning px-2.5 py-0.5 rounded-full text-xs font-medium' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-admin-brand-light text-admin-accent-blue px-2.5 py-0.5 rounded-full text-xs font-medium' },
  PEER_REVIEW_ASSIGNED: { label: 'Peer Review', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-medium' },
  RESOLVED: { label: 'Resolved', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISMISSED: { label: 'Dismissed', color: 'bg-admin-surface-elevated text-admin-text-faint px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const REFERRAL_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SEARCHING: { label: 'Searching', color: 'bg-admin-brand-light text-admin-accent-blue px-2.5 py-0.5 rounded-full text-xs font-medium' },
  MATCHED: { label: 'Matched', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  SCHEDULED: { label: 'Scheduled', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-medium' },
  COMPLETED: { label: 'Completed', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CLOSED: { label: 'Closed', color: 'bg-admin-surface-elevated text-admin-text-faint px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const DELETION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-admin-warning-light text-admin-warning px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-admin-brand-light text-admin-accent-blue px-2.5 py-0.5 rounded-full text-xs font-medium' },
  COMPLETED: { label: 'Completed', color: 'bg-admin-success-light text-admin-success px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CANCELLED: { label: 'Cancelled', color: 'bg-admin-surface-elevated text-admin-text-faint px-2.5 py-0.5 rounded-full text-xs font-medium' },
}
