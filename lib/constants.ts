export const CASE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CLOSED: { label: 'Closed', color: 'bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISPUTED: { label: 'Disputed', color: 'bg-[#FEF2F2] text-[#B91C1C] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
  EUROPEAN_REFERRAL: 'European Specialist Referral',
}

export const LAB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  REVIEW_NEEDED: { label: 'Review Needed', color: 'bg-[#FEF2F2] text-[#B91C1C] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const OPINION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  SIGNED: { label: 'Signed', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DELIVERED: { label: 'Delivered', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISPUTED: { label: 'Disputed', color: 'bg-[#FEF2F2] text-[#B91C1C] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const METRIC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'text-[#22C55E]' },
  HIGH: { label: 'High', color: 'text-[#E63946]' },
  LOW: { label: 'Low', color: 'text-[#E63946]' },
}

export const DISPUTE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  PEER_REVIEW_ASSIGNED: { label: 'Peer Review', color: 'bg-[#F3E8FF] text-[#7C3AED] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  RESOLVED: { label: 'Resolved', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  DISMISSED: { label: 'Dismissed', color: 'bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const REFERRAL_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  SEARCHING: { label: 'Searching', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  MATCHED: { label: 'Matched', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  SCHEDULED: { label: 'Scheduled', color: 'bg-[#F3E8FF] text-[#7C3AED] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  COMPLETED: { label: 'Completed', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CLOSED: { label: 'Closed', color: 'bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const DELETION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  COMPLETED: { label: 'Completed', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CANCELLED: { label: 'Cancelled', color: 'bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}
