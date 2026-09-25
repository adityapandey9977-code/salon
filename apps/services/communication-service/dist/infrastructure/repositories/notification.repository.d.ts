import { NotificationStatus, DeliveryAttemptStatus, Channel, Prisma } from '../prisma/generated-client';
export declare class NotificationRepository {
    listNotifications(tenantId: string, filter?: {
        status?: NotificationStatus;
        channel?: Channel;
        recipientId?: string;
    }): Promise<({
        template: {
            tenantId: string | null;
            code: string;
            id: string;
            name: string;
            channel: import("../prisma/generated-client").$Enums.Channel;
            subjectTemplate: string | null;
            bodyTemplate: string;
            language: string;
            isActive: boolean;
            version: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        deliveryAttempts: {
            tenantId: string;
            status: import("../prisma/generated-client").$Enums.DeliveryAttemptStatus;
            id: string;
            notificationId: string;
            provider: string;
            attemptNumber: number;
            providerMessageId: string | null;
            errorCode: string | null;
            errorMessageSanitized: string | null;
            attemptedAt: Date;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        recipientType: string;
        recipientId: string;
        templateId: string | null;
        subject: string | null;
        bodyRendered: string;
        scheduledAt: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        failedAt: Date | null;
        metadataJson: Prisma.JsonValue | null;
    })[]>;
    listAllLogs(filter?: {
        status?: NotificationStatus;
        channel?: Channel;
    }): Promise<({
        template: {
            tenantId: string | null;
            code: string;
            id: string;
            name: string;
            channel: import("../prisma/generated-client").$Enums.Channel;
            subjectTemplate: string | null;
            bodyTemplate: string;
            language: string;
            isActive: boolean;
            version: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        deliveryAttempts: {
            tenantId: string;
            status: import("../prisma/generated-client").$Enums.DeliveryAttemptStatus;
            id: string;
            notificationId: string;
            provider: string;
            attemptNumber: number;
            providerMessageId: string | null;
            errorCode: string | null;
            errorMessageSanitized: string | null;
            attemptedAt: Date;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        recipientType: string;
        recipientId: string;
        templateId: string | null;
        subject: string | null;
        bodyRendered: string;
        scheduledAt: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        failedAt: Date | null;
        metadataJson: Prisma.JsonValue | null;
    })[]>;
    findById(tenantId: string, id: string): Promise<({
        template: {
            tenantId: string | null;
            code: string;
            id: string;
            name: string;
            channel: import("../prisma/generated-client").$Enums.Channel;
            subjectTemplate: string | null;
            bodyTemplate: string;
            language: string;
            isActive: boolean;
            version: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        deliveryAttempts: {
            tenantId: string;
            status: import("../prisma/generated-client").$Enums.DeliveryAttemptStatus;
            id: string;
            notificationId: string;
            provider: string;
            attemptNumber: number;
            providerMessageId: string | null;
            errorCode: string | null;
            errorMessageSanitized: string | null;
            attemptedAt: Date;
        }[];
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        recipientType: string;
        recipientId: string;
        templateId: string | null;
        subject: string | null;
        bodyRendered: string;
        scheduledAt: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        failedAt: Date | null;
        metadataJson: Prisma.JsonValue | null;
    }) | null>;
    createNotification(data: {
        tenantId: string;
        recipientType?: string;
        recipientId: string;
        channel: Channel;
        templateId?: string;
        subject?: string;
        bodyRendered: string;
        scheduledAt?: Date;
        metadataJson?: any;
    }): Promise<{
        template: {
            tenantId: string | null;
            code: string;
            id: string;
            name: string;
            channel: import("../prisma/generated-client").$Enums.Channel;
            subjectTemplate: string | null;
            bodyTemplate: string;
            language: string;
            isActive: boolean;
            version: number;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        recipientType: string;
        recipientId: string;
        templateId: string | null;
        subject: string | null;
        bodyRendered: string;
        scheduledAt: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        failedAt: Date | null;
        metadataJson: Prisma.JsonValue | null;
    }>;
    updateStatus(id: string, status: NotificationStatus, extra?: {
        sentAt?: Date;
        deliveredAt?: Date;
        failedAt?: Date;
    }): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        recipientType: string;
        recipientId: string;
        templateId: string | null;
        subject: string | null;
        bodyRendered: string;
        scheduledAt: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        failedAt: Date | null;
        metadataJson: Prisma.JsonValue | null;
    }>;
    recordDeliveryAttempt(data: {
        tenantId: string;
        notificationId: string;
        provider: string;
        attemptNumber?: number;
        providerMessageId?: string;
        status: DeliveryAttemptStatus;
        errorCode?: string;
        errorMessageSanitized?: string;
    }): Promise<{
        tenantId: string;
        status: import("../prisma/generated-client").$Enums.DeliveryAttemptStatus;
        id: string;
        notificationId: string;
        provider: string;
        attemptNumber: number;
        providerMessageId: string | null;
        errorCode: string | null;
        errorMessageSanitized: string | null;
        attemptedAt: Date;
    }>;
}
//# sourceMappingURL=notification.repository.d.ts.map