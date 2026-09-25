import { CampaignRepository } from '../../infrastructure/repositories/campaign.repository';
import { NotificationService } from './notification.service';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { Channel } from '../../infrastructure/prisma/generated-client';
export class CampaignService {
    campaignRepo;
    notifService;
    constructor(campaignRepo = new CampaignRepository(), notifService = new NotificationService()) {
        this.campaignRepo = campaignRepo;
        this.notifService = notifService;
    }
    async listCampaigns(tenantId, status) {
        return this.campaignRepo.listCampaigns(tenantId, status);
    }
    async createCampaign(tenantId, data) {
        const campaign = await this.campaignRepo.createCampaign({
            tenantId,
            ...data,
        });
        await eventBus.publish({
            eventType: 'CAMPAIGN_STARTED.v1',
            aggregateType: 'Campaign',
            aggregateId: campaign.id,
            tenantId,
            payload: {
                campaignId: campaign.id,
                tenantId,
                name: campaign.name,
                channel: campaign.channel,
                recipientsCount: campaign.recipients.length,
            },
        });
        return campaign;
    }
    async sendWinbackOffer(tenantId, data) {
        const numbers = data.customerPhoneNumbers || ['+919876543210', '+919876543211'];
        const message = `We miss you at   Salon! Enjoy ${data.discountPercent}% OFF on your next visit using code ${data.offerCode}. Book today!`;
        const dispatched = [];
        for (const phone of numbers) {
            const res = await this.notifService.sendNotification({
                tenantId,
                recipientType: 'CUSTOMER',
                recipientId: phone,
                channel: Channel.WHATSAPP,
                body: message,
            });
            dispatched.push(res);
        }
        return {
            success: true,
            offerCode: data.offerCode,
            dispatchedCount: dispatched.length,
        };
    }
}
