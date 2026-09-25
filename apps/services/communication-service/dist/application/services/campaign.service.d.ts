import { CampaignRepository } from '../../infrastructure/repositories/campaign.repository';
import { NotificationService } from './notification.service';
import { CampaignStatus, Channel } from '../../infrastructure/prisma/generated-client';
export declare class CampaignService {
    private campaignRepo;
    private notifService;
    constructor(campaignRepo?: CampaignRepository, notifService?: NotificationService);
    listCampaigns(tenantId: string, status?: CampaignStatus): Promise<({
        recipients: {
            tenantId: string;
            status: string;
            id: string;
            campaignId: string;
            customerId: string;
            lastAttemptAt: Date | null;
            convertedAt: Date | null;
        }[];
    } & {
        tenantId: string;
        type: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.CampaignStatus;
        id: string;
        name: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date | null;
        segmentReferenceId: string | null;
        messageContent: string | null;
        createdByUserId: string | null;
    })[]>;
    createCampaign(tenantId: string, data: {
        name: string;
        type?: string;
        channel?: Channel;
        segmentReferenceId?: string;
        messageContent?: string;
        scheduledAt?: Date;
        createdByUserId?: string;
        customerIds?: string[];
    }): Promise<{
        recipients: {
            tenantId: string;
            status: string;
            id: string;
            campaignId: string;
            customerId: string;
            lastAttemptAt: Date | null;
            convertedAt: Date | null;
        }[];
    } & {
        tenantId: string;
        type: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.CampaignStatus;
        id: string;
        name: string;
        channel: import("../../infrastructure/prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date | null;
        segmentReferenceId: string | null;
        messageContent: string | null;
        createdByUserId: string | null;
    }>;
    sendWinbackOffer(tenantId: string, data: {
        targetInactiveDays: number;
        discountPercent: number;
        offerCode: string;
        customerPhoneNumbers?: string[];
    }): Promise<{
        success: boolean;
        offerCode: string;
        dispatchedCount: number;
    }>;
}
//# sourceMappingURL=campaign.service.d.ts.map