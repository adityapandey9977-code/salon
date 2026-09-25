import type { CachedShift } from '../../domain/entities/staff.dto';
import { prisma } from '../prisma/client';
import type { Shift } from '../prisma/generated-client';

export class ShiftRepository {
  private toDto(item: Shift): CachedShift {
    return {
      id: item.id,
      tenantId: item.tenantId,
      branchId: item.branchId,
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime,
      breakMinutes: item.breakMinutes,
      graceMinutes: item.graceMinutes,
      isActive: item.isActive,
    };
  }

  public async findShiftsByBranch(tenantId: string, branchId?: string): Promise<CachedShift[]> {
    const shifts = await prisma.shift.findMany({
      where: {
        tenantId,
        ...(branchId ? { branchId } : {}),
      },
      orderBy: { startTime: 'asc' },
    });
    return shifts.map((s) => this.toDto(s));
  }

  public async findShiftById(tenantId: string, id: string): Promise<CachedShift | null> {
    const shift = await prisma.shift.findFirst({
      where: { id, tenantId },
    });
    return shift ? this.toDto(shift) : null;
  }

  public async createShift(data: {
    tenantId: string;
    branchId: string;
    name: string;
    startTime: string;
    endTime: string;
    breakMinutes?: number;
    graceMinutes?: number;
    isActive?: boolean;
  }): Promise<CachedShift> {
    const shift = await prisma.shift.create({
      data: {
        tenantId: data.tenantId,
        branchId: data.branchId,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        breakMinutes: data.breakMinutes ?? 0,
        graceMinutes: data.graceMinutes ?? 15,
        isActive: data.isActive ?? true,
      },
    });
    return this.toDto(shift);
  }

  public async updateShift(
    tenantId: string,
    id: string,
    data: {
      name?: string;
      startTime?: string;
      endTime?: string;
      breakMinutes?: number;
      graceMinutes?: number;
      isActive?: boolean;
    },
  ): Promise<CachedShift> {
    const updated = await prisma.shift.update({
      where: { id, tenantId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.startTime !== undefined ? { startTime: data.startTime } : {}),
        ...(data.endTime !== undefined ? { endTime: data.endTime } : {}),
        ...(data.breakMinutes !== undefined ? { breakMinutes: data.breakMinutes } : {}),
        ...(data.graceMinutes !== undefined ? { graceMinutes: data.graceMinutes } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });
    return this.toDto(updated);
  }

  public async deleteShift(tenantId: string, id: string): Promise<CachedShift> {
    const deleted = await prisma.shift.delete({
      where: { id, tenantId },
    });
    return this.toDto(deleted);
  }
}

export const shiftRepository = new ShiftRepository();
