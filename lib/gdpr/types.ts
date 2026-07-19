export enum ConsentType {
  AI_PROCESSING = 'AI_PROCESSING',
  DATA_SHARING = 'DATA_SHARING',
}

export interface ConsentStatus {
  consentType: string;
  granted: boolean;
  grantedAt: Date | null;
  revokedAt: Date | null;
}
