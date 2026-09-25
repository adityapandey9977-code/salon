import { prisma } from '../prisma/client';
import { NotificationStatus, DeliveryAttemptStatus, Channel, Prisma } from '../prisma/generated-client';

export class NotificationRepository {
  async listNotifications(tenantId: string, filter?: { status?: NotificationStatus; channel?: Channel; recipientId?: string }) {
    const where: Prisma.NotificationWhereInput = { tenantId };
    if (filter?.status) where.status = filter.status;
    if (filter?.channel) where.channel = filter.channel;
    if (filter?.recipientId) where.recipientId = filter.recipientId;

    return prisma.notification.findMany({
      where,
      include: {
        template: true,
        deliveryAttempts: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async listAllLogs(filter?: { status?: NotificationStatus; channel?: Channel }) {
    const where: Prisma.NotificationWhereInput = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.channel) where.channel = filter.channel;

    return prisma.notification.findMany({
      where,
      include: {
        template: true,
        deliveryAttempts: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async findById(tenantId: string, id: string) {
    return prisma.notification.findFirst({
      where: { id, tenantId },
      include: {
        template: true,
        deliveryAttempts: true,
      },
    });
  }

  async createNotification(data: {
    tenantId: string;
    recipientType?: string;
    recipientId: string;
    channel: Channel;
    templateId?: string;
    subject?: string;
    bodyRendered: string;
    scheduledAt?: Date;
    metadataJson?: any;
  }) {
    return prisma.notification.create({
      data: {
        tenantId: data.tenantId,
        recipientType: data.recipientType || 'CUSTOMER',
        recipientId: data.recipientId,
        channel: data.channel,
        templateId: data.templateId,
        subject: data.subject,
        bodyRendered: data.bodyRendered,
        status: NotificationStatus.PENDING,
        scheduledAt: data.scheduledAt,
        metadataJson: data.metadataJson,
      },
      include: {
        template: true,
      },
    });
  }

  async updateStatus(id: string, status: NotificationStatus, extra?: { sentAt?: Date; deliveredAt?: Date; failedAt?: Date }) {
    return prisma.notification.update({
      where: { id },
      data: {
        status,
        ...extra,
      },
    });
  }

  async recordDeliveryAttempt(data: {
    tenantId: string;
    notificationId: string;
    provider: string;
    attemptNumber?: number;
    providerMessageId?: string;
    status: DeliveryAttemptStatus;
    errorCode?: string;
    errorMessageSanitized?: string;
  }) {
    return prisma.notificationDeliveryAttempt.create({
      data: {
        tenantId: data.tenantId,
        notificationId: data.notificationId,
        provider: data.provider,
        attemptNumber: data.attemptNumber || 1,
        providerMessageId: data.providerMessageId,
        status: data.status,
        errorCode: data.errorCode,
        errorMessageSanitized: data.errorMessageSanitized,
      },
    });
  }
}
