export interface FileDisputeParams {
  caseId: string;
  patientId: string;
  opinionId: string;
  reason: string;
}

export interface PeerReviewCandidate {
  userId: string;
  name: string | null;
  email: string;
  specialty: string;
}

export enum DisputeStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PEER_REVIEW_ASSIGNED = 'PEER_REVIEW_ASSIGNED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}
