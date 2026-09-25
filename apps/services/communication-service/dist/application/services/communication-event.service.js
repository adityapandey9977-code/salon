import { NotificationService } from './notification.service';
import { CommunicationReadStore } from '../../infrastructure/redis/communication-read.store';
import { Channel } from '../../infrastructure/prisma/generated-client';
import { createLogger } from '@salon-spa-saas/logger';
const logger = createLogger('communication-event-service');
export class CommunicationEventService {
    notifService;
    cache;
    constructor(notifService = new NotificationService(), cache = new CommunicationReadStore()) {
        this.notifService = notifService;
        this.cache = cache;
    }
    async handleAppointmentCreated(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`apt-create:${event.eventId}`);
        if (!isFirstTime)
            return;
        const phone = event.payload.customerPhone || '+919876543210';
        await this.notifService.sendNotification({
            tenantId: event.tenantId,
            recipientType: 'CUSTOMER',
            recipientId: phone,
            channel: Channel.WHATSAPP,
            templateCode: 'APPOINTMENT_CONFIRMED',
            variables: {
                clientName: event.payload.clientName || 'Valued Customer',
                serviceName: event.payload.serviceName || 'Salon Service',
                time: event.payload.startTime || 'Scheduled Time',
            },
        });
    }
    async handlePaymentCompleted(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`pay-notif:${event.eventId}`);
        if (!isFirstTime)
            return;
        const phone = event.payload.customerPhone || '+919876543210';
        await this.notifService.sendNotification({
            tenantId: event.tenantId,
            recipientType: 'CUSTOMER',
            recipientId: phone,
            channel: Channel.SMS,
            templateCode: 'PAYMENT_RECEIPT',
            variables: {
                amount: event.payload.amount,
                invoiceId: event.payload.invoiceId,
            },
        });
    }
    async handleStockLow(event) {
        const isFirstTime = await this.cache.checkAndMarkProcessed(`stock-low-notif:${event.eventId}`);
        if (!isFirstTime)
            return;
        await this.notifService.sendNotification({
            tenantId: event.tenantId,
            recipientType: 'STAFF',
            recipientId: 'manager@digiflexsalon.com',
            channel: Channel.EMAIL,
            subject: `[Low Stock Alert] SKU ${event.payload.skuCode} below reorder level`,
            body: `Warning: SKU ${event.payload.skuCode} currently has ${event.payload.quantityOnHand} units remaining (Reorder level is ${event.payload.reorderLevel}). Please reorder promptly.`,
        });
    }
}
