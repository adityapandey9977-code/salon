export interface NotificationTemplateDto {
  id: string;
  tenantId?: string | null;
  code: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';
  name: string;
  subjectTemplate?: string | null;
  bodyTemplate: string;
  language: string;
  isActive: boolean;
  version: number;
}

export interface NotificationDto {
  id: string;
  tenantId: string;
  recipientType: string;
  recipientId: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';
  templateId?: string | null;
  subject?: string | null;
  bodyRendered: string;
  status: 'PENDING' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'RESOLVED';
  scheduledAt?: string | null;
  sentAt?: string | null;
  deliveredAt?: string | null;
  failedAt?: string | null;
  createdAt: string;
}

export interface CampaignDto {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  segmentReferenceId?: string | null;
  messageContent?: string | null;
  scheduledAt?: string | null;
  recipientsCount?: number;
  createdAt: string;
}

export interface TelephonyCallLogDto {
  id: string;
  tenantId: string;
  provider: string;
  providerCallId?: string | null;
  direction: string;
  fromNumber: string;
  toNumber: string;
  customerId?: string | null;
  leadId?: string | null;
  appointmentId?: string | null;
  agentIdentityUserId?: string | null;
  startedAt: string;
  answeredAt?: string | null;
  endedAt?: string | null;
  durationSeconds?: number | null;
  disposition?: string | null;
  recordingObjectKey?: string | null;
  status: string;
}
