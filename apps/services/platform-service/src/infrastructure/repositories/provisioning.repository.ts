import { prisma } from '../prisma/client';
import { ProvisioningStatus, Prisma } from '../prisma/generated-client';

export class ProvisioningRepository {
  async findById(id: string) {
    return prisma.tenantProvisioningRequest.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });
  }

  async list(filter?: { status?: ProvisioningStatus; skip?: number; take?: number }) {
    const where: Prisma.TenantProvisioningRequestWhereInput = {};
    if (filter?.status) where.status = filter.status;

    const [items, total] = await Promise.all([
      prisma.tenantProvisioningRequest.findMany({
        where,
        include: {
          plan: true,
        },
        skip: filter?.skip || 0,
        take: filter?.take || 50,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tenantProvisioningRequest.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: {
    requestedByUserId?: string;
    planId: string;
    salonName: string;
    loginEmail: string;
    subdomain?: string;
    ownerPhone?: string;
  }) {
    return prisma.tenantProvisioningRequest.create({
      data: {
        requestedByUserId: data.requestedByUserId,
        planId: data.planId,
        salonName: data.salonName,
        loginEmail: data.loginEmail.toLowerCase().trim(),
        subdomain: data.subdomain?.toLowerCase().trim(),
        ownerPhone: data.ownerPhone,
        status: ProvisioningStatus.PENDING,
      },
      include: {
        plan: true,
      },
    });
  }

  async updateStatus(
    id: string,
    data: {
      status: ProvisioningStatus;
      organizationTenantId?: string;
      failureStep?: string;
      failureReason?: string;
      completedAt?: Date;
    }
  ) {
    return prisma.tenantProvisioningRequest.update({
      where: { id },
      data,
      include: {
        plan: true,
      },
    });
  }
}
