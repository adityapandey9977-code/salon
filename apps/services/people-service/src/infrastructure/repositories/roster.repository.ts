import type { CachedRosterAssignment } from '../../domain/entities/staff.dto';
import { prisma } from '../prisma/client';
import type { Prisma, RosterAssignment, RosterStatus } from '../prisma/generated-client';

export class RosterRepository {
  private toDto(item: RosterAssignment): CachedRosterAssignment {
    return {
      id: item.id,
      tenantId: item.tenantId,
      employeeId: item.employeeId,
      branchId: item.branchId,
      shiftId: item.shiftId,
      rosterDate: item.rosterDate.toISOString().split('T')[0],
      startAt: item.startAt.toISOString(),
      endAt: item.endAt.toISOString(),
      status: item.status,
    };
  }

  public async findRosterByEmployeeAndDate(
    tenantId: string,
    employeeId: string,
    date: Date,
  ): Promise<CachedRosterAssignment | null> {
    const record = await prisma.rosterAssignment.findUnique({
      where: {
        tenantId_employeeId_rosterDate: {
          tenantId,
          employeeId,
          rosterDate: date,
        },
      },
    });
    return record ? this.toDto(record) : null;
  }

  public async findRosterById(tenantId: string, id: string): Promise<CachedRosterAssignment | null> {
    const record = await prisma.rosterAssignment.findFirst({
      where: { id, tenantId },
    });
    return record ? this.toDto(record) : null;
  }

  public async queryRoster(params: {
    tenantId: string;
    branchId?: string;
    employeeId?: string;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
  }): Promise<CachedRosterAssignment[]> {
    const where: Prisma.RosterAssignmentWhereInput = {
      tenantId: params.tenantId,
    };

    if (params.branchId) where.branchId = params.branchId;
    if (params.employeeId) where.employeeId = params.employeeId;
    if (params.date) where.rosterDate = params.date;
    else if (params.startDate && params.endDate) {
      where.rosterDate = {
        gte: params.startDate,
        lte: params.endDate,
      };
    } else if (params.startDate) {
      where.rosterDate = { gte: params.startDate };
    }

    const records = await prisma.rosterAssignment.findMany({
      where,
      orderBy: [{ rosterDate: 'asc' }, { startAt: 'asc' }],
    });

    return records.map((r) => this.toDto(r));
  }

  public async createRoster(data: {
    tenantId: string;
    employeeId: string;
    branchId: string;
    shiftId?: string | null;
    rosterDate: Date;
    startAt: Date;
    endAt: Date;
    status?: RosterStatus;
  }): Promise<CachedRosterAssignment> {
    const record = await prisma.rosterAssignment.upsert({
      where: {
        tenantId_employeeId_rosterDate: {
          tenantId: data.tenantId,
          employeeId: data.employeeId,
          rosterDate: data.rosterDate,
        },
      },
      create: {
        tenantId: data.tenantId,
        employeeId: data.employeeId,
        branchId: data.branchId,
        shiftId: data.shiftId || null,
        rosterDate: data.rosterDate,
        startAt: data.startAt,
        endAt: data.endAt,
        status: data.status || 'SCHEDULED',
      },
      update: {
        branchId: data.branchId,
        shiftId: data.shiftId || null,
        startAt: data.startAt,
        endAt: data.endAt,
        status: data.status || 'SCHEDULED',
      },
    });

    return this.toDto(record);
  }

  public async updateRoster(
    tenantId: string,
    id: string,
    data: {
      shiftId?: string | null;
      startAt?: Date;
      endAt?: Date;
      status?: RosterStatus;
    },
  ): Promise<CachedRosterAssignment> {
    const updated = await prisma.rosterAssignment.update({
      where: { id, tenantId },
      data: {
        ...(data.shiftId !== undefined ? { shiftId: data.shiftId } : {}),
        ...(data.startAt !== undefined ? { startAt: data.startAt } : {}),
        ...(data.endAt !== undefined ? { endAt: data.endAt } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
      },
    });
    return this.toDto(updated);
  }

  public async deleteRoster(tenantId: string, id: string): Promise<CachedRosterAssignment> {
    const deleted = await prisma.rosterAssignment.delete({
      where: { id, tenantId },
    });
    return this.toDto(deleted);
  }
}

export const rosterRepository = new RosterRepository();
