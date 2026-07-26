import type { InputJsonValue } from '@prisma/client/runtime/client';

export interface LogAuditEventParams {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: InputJsonValue;
  after?: InputJsonValue;
  metadata?: InputJsonValue;
}
