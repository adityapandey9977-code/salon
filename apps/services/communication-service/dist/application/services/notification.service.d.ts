import { NotificationRepository } from '../../infrastructure/repositories/notification.repository';
import { TemplateService } from './template.service';
import { Channel } from '../../infrastructure/prisma/generated-client';
export declare class NotificationService {
    private notifRepo;
    private templateService;
    constructor(notifRepo?: NotificationRepository, templateService?: TemplateService);
    listNotifications(tenantId: string, filter?: any): Promise<({
        template: {
            tenantId: string | null;
            code: string;
            id: string;
            name: string;
            channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
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
            status: import("../../infrastructure/prisma/generated-client").$Enums.DeliveryAttemptStatus;
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
        status: import("../../infrastructure/prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
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
        metadataJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
    })[]>;
    listAllLogs(filter?: any): Promise<({
        template: {
            tenantId: string | null;
            code: string;
            id: string;
            name: string;
            channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
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
            status: import("../../infrastructure/prisma/generated-client").$Enums.DeliveryAttemptStatus;
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
        status: import("../../infrastructure/prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
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
        metadataJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
    })[]>;
    resolveNotification(tenantId: string, id: string): Promise<{
        tenantId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.NotificationStatus;
        id: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
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
        metadataJson: import("../../infrastructure/prisma/generated-client/runtime/library").JsonValue | null;
    }>;
    /**
     * Dispatch single notification with template rendering and provider dispatch
     */
    sendNotification(data: {
        tenantId: string;
        recipientType?: string;
        recipientId: string;
        channel: Channel;
        templateCode?: string;
        subject?: string;
        body?: string;
        variables?: Record<string, any>;
        scheduledAt?: Date;
    }): Promise<{
        notificationId: string;
        status: "DELIVERED" | "FAILED";
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
        recipientId: string;
        providerMessageId: string | undefined;
    }>;
}
//# sourceMappingURL=notification.service.d.ts.map