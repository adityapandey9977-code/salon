export interface NotificationLogEntity {
  id: string;
  tenantId: string;
  recipient: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';
  message: string;
  status: 'PENDING' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: Date | null;
  createdAt: Date;
}
