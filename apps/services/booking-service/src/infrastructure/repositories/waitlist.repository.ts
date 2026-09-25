import type { WaitlistEntryDto } from '../../domain/entities/booking.dto';
import { prisma } from '../prisma/client';
import type { WaitlistEntry } from '../prisma/generated-client';

export class WaitlistRepository {
  private toDto(record: WaitlistEntry): WaitlistEntryDto {
    return {
      id: record.id,
      tenantId: record.tenantId,
      branchId: record.branchId,
      customerId: record.customerId,
      serviceId: record.serviceId,
      preferredStaffId: record.preferredStaffId,
      preferredDate: record.preferredDate.toISOString().split('T')[0],
      preferredStartTime: record.preferredStartTime,
      preferredEndTime: record.preferredEndTime,
      status: record.status,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  public async list(
    tenantId: string,
    filter: {
      branchId?: string;
      preferredDate?: string;
      status?: string;
    },
  ): Promise<WaitlistEntryDto[]> {
    const records = await prisma.waitlistEntry.findMany({
      where: {
        tenantId,
        ...(filter.branchId ? { branchId: filter.branchId } : {}),
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.preferredDate
          ? {
              preferredDate: new Date(filter.preferredDate),
            }
          : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((r) => this.toDto(r));
  }

  public async create(data: {
    tenantId: string;
    branchId: string;
    customerId: string;
    serviceId: string;
    preferredStaffId?: string | null;
    preferredDate: string;
    preferredStartTime?: string | null;
    preferredEndTime?: string | null;
  }): Promise<WaitlistEntryDto> {
    const record = await prisma.waitlistEntry.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        customerId: data.customerId,
        serviceId: data.serviceId,
        preferredStaffId: data.preferredStaffId,
        preferredDate: new Date(data.preferredDate),
        preferredStartTime: data.preferredStartTime,
        preferredEndTime: data.preferredEndTime,
        status: 'WAITING',
      },
    });
    return this.toDto(record);
  }

  public async updateStatus(
    tenantId: string,
    id: string,
    status: string,
  ): Promise<WaitlistEntryDto> {
    const record = await prisma.waitlistEntry.update({
      where: { id },
      data: { status },
    });
    return this.toDto(record);
  }
}

export const waitlistRepository = new WaitlistRepository();
