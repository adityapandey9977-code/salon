import { NotificationRepository } from '../../infrastructure/repositories/notification.repository';
import { TemplateService } from './template.service';
import { emailProvider, smsProvider, whatsAppProvider, pushProvider, } from '../../infrastructure/adapters/provider.adapters';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { Channel, NotificationStatus, DeliveryAttemptStatus } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';
export class NotificationService {
    notifRepo;
    templateService;
    constructor(notifRepo = new NotificationRepository(), templateService = new TemplateService()) {
        this.notifRepo = notifRepo;
        this.templateService = templateService;
    }
    async listNotifications(tenantId, filter) {
        return this.notifRepo.listNotifications(tenantId, filter);
    }
    async listAllLogs(filter) {
        return this.notifRepo.listAllLogs(filter);
    }
    async resolveNotification(tenantId, id) {
        const notif = await this.notifRepo.findById(tenantId, id);
        if (!notif)
            throw new NotFoundError(`Notification ${id} not found`);
        return this.notifRepo.updateStatus(id, NotificationStatus.RESOLVED);
    }
    /**
     * Dispatch single notification with template rendering and provider dispatch
     */
    async sendNotification(data) {
        let subject = data.subject;
        let bodyRendered = data.body || '';
        let templateId = undefined;
        // If templateCode is provided, resolve and render
        if (data.templateCode) {
            const template = await this.templateService.getTemplate(data.templateCode, data.channel);
            if (template) {
                templateId = template.id;
                bodyRendered = this.templateService.renderTemplate(template.bodyTemplate, data.variables || {});
                if (template.subjectTemplate) {
                    subject = this.templateService.renderTemplate(template.subjectTemplate, data.variables || {});
                }
            }
        }
        if (!bodyRendered) {
            throw new BadRequestError('Notification body cannot be empty');
        }
        // 1. Create Notification in PENDING status
        const notification = await this.notifRepo.createNotification({
            tenantId: data.tenantId,
            recipientType: data.recipientType || 'CUSTOMER',
            recipientId: data.recipientId,
            channel: data.channel,
            templateId,
            subject,
            bodyRendered,
            scheduledAt: data.scheduledAt,
        });
        // 2. Publish NOTIFICATION_QUEUED.v1
        await eventBus.publish({
            eventType: 'NOTIFICATION_QUEUED.v1',
            aggregateType: 'Notification',
            aggregateId: notification.id,
            tenantId: data.tenantId,
            payload: {
                notificationId: notification.id,
                tenantId: data.tenantId,
                channel: data.channel,
                recipientId: data.recipientId,
            },
        });
        // 3. Dispatch to channel provider adapter
        let sendResult;
        try {
            if (data.channel === Channel.EMAIL) {
                sendResult = await emailProvider.sendEmail(data.recipientId, subject || '  Salon Notification', bodyRendered);
            }
            else if (data.channel === Channel.SMS) {
                sendResult = await smsProvider.sendSms(data.recipientId, bodyRendered);
            }
            else if (data.channel === Channel.WHATSAPP) {
                sendResult = await whatsAppProvider.sendWhatsApp(data.recipientId, bodyRendered, data.templateCode);
            }
            else if (data.channel === Channel.PUSH) {
                sendResult = await pushProvider.sendPush(data.recipientId, subject || 'Salon Update', bodyRendered);
            }
            else {
                // IN_APP
                sendResult = { success: true, provider: 'IN_APP', providerMessageId: `inapp-${Date.now()}` };
            }
        }
        catch (err) {
            sendResult = {
                success: false,
                provider: data.channel,
                errorCode: 'PROVIDER_EXCEPTION',
                errorMessage: err.message || 'Unknown delivery failure',
            };
        }
        // 4. Record Delivery Attempt
        await this.notifRepo.recordDeliveryAttempt({
            tenantId: data.tenantId,
            notificationId: notification.id,
            provider: sendResult.provider,
            providerMessageId: sendResult.providerMessageId,
            status: sendResult.success ? DeliveryAttemptStatus.SUCCESS : DeliveryAttemptStatus.FAILED,
            errorCode: sendResult.errorCode,
            errorMessageSanitized: sendResult.errorMessage,
        });
        // 5. Update Notification final status & emit events
        const finalStatus = sendResult.success ? NotificationStatus.DELIVERED : NotificationStatus.FAILED;
        const now = new Date();
        await this.notifRepo.updateStatus(notification.id, finalStatus, {
            sentAt: now,
            deliveredAt: sendResult.success ? now : undefined,
            failedAt: sendResult.success ? undefined : now,
        });
        const eventType = sendResult.success ? 'NOTIFICATION_DELIVERED.v1' : 'NOTIFICATION_FAILED.v1';
        await eventBus.publish({
            eventType,
            aggregateType: 'Notification',
            aggregateId: notification.id,
            tenantId: data.tenantId,
            payload: {
                notificationId: notification.id,
                tenantId: data.tenantId,
                channel: data.channel,
                recipientId: data.recipientId,
                provider: sendResult.provider,
                providerMessageId: sendResult.providerMessageId,
            },
        });
        return {
            notificationId: notification.id,
            status: finalStatus,
            channel: data.channel,
            recipientId: data.recipientId,
            providerMessageId: sendResult.providerMessageId,
        };
    }
}
