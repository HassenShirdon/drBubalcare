export enum EdgeCaseType {
  NO_SPECIALIST_MATCHED = 'NO_SPECIALIST_MATCHED',
  URGENT_FINDING = 'URGENT_FINDING',
  INCOMPLETE_UPLOAD = 'INCOMPLETE_UPLOAD',
  SPECIALIST_UNAVAILABLE = 'SPECIALIST_UNAVAILABLE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export interface PendingEdgeCase {
  caseId: string;
  patientId: string;
  type: EdgeCaseType;
  createdAt: Date;
  details: string;
}
