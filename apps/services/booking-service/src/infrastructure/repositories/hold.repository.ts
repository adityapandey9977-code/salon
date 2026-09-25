import type { BookingHoldDto } from '../../domain/entities/booking.dto';
import { prisma } from '../prisma/client';
import type { BookingHold } from '../prisma/generated-client';

export class HoldRepository {
  private toDto(record: BookingHold): BookingHoldDto {
    return {
      id: record.id,
      tenantId: record.tenantId,
      branchId: record.branchId,
      holdToken: record.holdToken,
      customerId: record.customerId,
      startsAt: record.startsAt.toISOString(),
      endsAt: record.endsAt.toISOString(),
      expiresAt: record.expiresAt.toISOString(),
      status: record.status,
      createdAt: record.createdAt.toISOString(),
    };
  }

  public async findByToken(token: string): Promise<BookingHoldDto | null> {
    const record = await prisma.bookingHold.findUnique({
      where: { holdToken: token },
    });
    if (!record) return null;
    return this.toDto(record);
  }

  public async createHold(data: {
    tenantId: string;
    branchId: string;
    holdToken: string;
    customerId?: string | null;
    startsAt: Date;
    endsAt: Date;
    ttlMinutes?: number;
  }): Promise<BookingHoldDto> {
    const ttl = data.ttlMinutes || 10;
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

    const record = await prisma.bookingHold.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        holdToken: data.holdToken,
        customerId: data.customerId,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        expiresAt,
        status: 'ACTIVE',
      },
    });

    return this.toDto(record);
  }

  public async releaseHold(holdToken: string): Promise<void> {
    await prisma.bookingHold.updateMany({
      where: { holdToken },
      data: { status: 'RELEASED' },
    });
  }

  public async checkActiveHolds(
    tenantId: string,
    branchId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<boolean> {
    const now = new Date();
    const count = await prisma.bookingHold.count({
      where: {
        tenantId,
        branchId,
        status: 'ACTIVE',
        expiresAt: { gt: now },
        AND: [{ startsAt: { lt: endsAt } }, { endsAt: { gt: startsAt } }],
      },
    });
    return count > 0;
  }
}

export const holdRepository = new HoldRepository();
