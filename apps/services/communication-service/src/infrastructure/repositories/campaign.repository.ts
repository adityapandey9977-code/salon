import { prisma } from '../prisma/client';
import { CampaignStatus, Channel, Prisma } from '../prisma/generated-client';

export class CampaignRepository {
  async listCampaigns(tenantId: string, status?: CampaignStatus) {
    const where: Prisma.CampaignWhereInput = { tenantId };
    if (status) where.status = status;

    return prisma.campaign.findMany({
      where,
      include: {
        recipients: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return prisma.campaign.findFirst({
      where: { id, tenantId },
      include: {
        recipients: true,
      },
    });
  }

  async createCampaign(data: {
    tenantId: string;
    name: string;
    type?: string;
    channel?: Channel;
    segmentReferenceId?: string;
    messageContent?: string;
    scheduledAt?: Date;
    createdByUserId?: string;
    customerIds?: string[];
  }) {
    return prisma.campaign.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        type: data.type || 'PROMOTIONAL',
        channel: data.channel || Channel.WHATSAPP,
        segmentReferenceId: data.segmentReferenceId,
        messageContent: data.messageContent,
        scheduledAt: data.scheduledAt,
        createdByUserId: data.createdByUserId,
        status: data.scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
        recipients: data.customerIds?.length
          ? {
              create: data.customerIds.map((customerId) => ({
                tenantId: data.tenantId,
                customerId,
                status: 'PENDING',
              })),
            }
          : undefined,
      },
      include: {
        recipients: true,
      },
    });
  }

  async updateCampaignStatus(id: string, status: CampaignStatus) {
    return prisma.campaign.update({
      where: { id },
      data: { status },
      include: { recipients: true },
    });
  }
}
