import { CampaignRepository } from '../../infrastructure/repositories/campaign.repository';
import { NotificationService } from './notification.service';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { CampaignStatus, Channel } from '../../infrastructure/prisma/generated-client';
import { NotFoundError, BadRequestError } from '@salon-spa-saas/common-types';

export class CampaignService {
  constructor(
    private campaignRepo: CampaignRepository = new CampaignRepository(),
    private notifService: NotificationService = new NotificationService()
  ) { }

  async listCampaigns(tenantId: string, status?: CampaignStatus) {
    return this.campaignRepo.listCampaigns(tenantId, status);
  }

  async createCampaign(tenantId: string, data: {
    name: string;
    type?: string;
    channel?: Channel;
    segmentReferenceId?: string;
    messageContent?: string;
    scheduledAt?: Date;
    createdByUserId?: string;
    customerIds?: string[];
  }) {
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

  async sendWinbackOffer(tenantId: string, data: {
    targetInactiveDays: number;
    discountPercent: number;
    offerCode: string;
    customerPhoneNumbers?: string[];
  }) {
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
