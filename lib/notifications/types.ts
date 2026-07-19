export interface NotifyAdminParams {
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface NotifyPatientParams {
  patientId: string;
  type: string;
  message: string;
  metadata?: Record<string, unknown>;
}
