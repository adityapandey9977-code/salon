import { CampaignStatus, Channel } from '../prisma/generated-client';
export declare class CampaignRepository {
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
        status: import("../prisma/generated-client").$Enums.CampaignStatus;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date | null;
        segmentReferenceId: string | null;
        messageContent: string | null;
        createdByUserId: string | null;
    })[]>;
    findById(tenantId: string, id: string): Promise<({
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
        status: import("../prisma/generated-client").$Enums.CampaignStatus;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date | null;
        segmentReferenceId: string | null;
        messageContent: string | null;
        createdByUserId: string | null;
    }) | null>;
    createCampaign(data: {
        tenantId: string;
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
        status: import("../prisma/generated-client").$Enums.CampaignStatus;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date | null;
        segmentReferenceId: string | null;
        messageContent: string | null;
        createdByUserId: string | null;
    }>;
    updateCampaignStatus(id: string, status: CampaignStatus): Promise<{
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
        status: import("../prisma/generated-client").$Enums.CampaignStatus;
        id: string;
        name: string;
        channel: import("../prisma/generated-client").$Enums.Channel;
        createdAt: Date;
        updatedAt: Date;
        scheduledAt: Date | null;
        segmentReferenceId: string | null;
        messageContent: string | null;
        createdByUserId: string | null;
    }>;
}
//# sourceMappingURL=campaign.repository.d.ts.map