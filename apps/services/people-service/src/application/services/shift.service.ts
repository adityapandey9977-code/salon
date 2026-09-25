import { NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CreateShiftRequest,
  UpdateShiftRequest,
} from '@salon-spa-saas/contracts';
import type { CachedShift } from '../../domain/entities/staff.dto';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { shiftRepository } from '../../infrastructure/repositories/shift.repository';

export class ShiftService {
  public async getShiftsByBranch(tenantId: string, branchId?: string): Promise<CachedShift[]> {
    if (!branchId) {
      return shiftRepository.findShiftsByBranch(tenantId);
    }
    return peopleReadStore.getBranchShifts(tenantId, branchId, async () => {
      return shiftRepository.findShiftsByBranch(tenantId, branchId);
    });
  }

  public async getShiftById(tenantId: string, id: string): Promise<CachedShift> {
    const shift = await shiftRepository.findShiftById(tenantId, id);
    if (!shift) {
      throw new NotFoundError('Shift not found');
    }
    return shift;
  }

  public async createShift(tenantId: string, data: CreateShiftRequest): Promise<CachedShift> {
    const shift = await shiftRepository.createShift({
      tenantId,
      branchId: data.branchId,
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      breakMinutes: data.breakMinutes,
      graceMinutes: data.graceMinutes,
      isActive: data.isActive,
    });

    await peopleReadStore.invalidateBranchShifts(tenantId, data.branchId);

    return shift;
  }

  public async updateShift(
    tenantId: string,
    id: string,
    data: UpdateShiftRequest,
  ): Promise<CachedShift> {
    const existing = await shiftRepository.findShiftById(tenantId, id);
    if (!existing) {
      throw new NotFoundError('Shift not found');
    }

    const updated = await shiftRepository.updateShift(tenantId, id, {
      name: data.name,
      startTime: data.startTime,
      endTime: data.endTime,
      breakMinutes: data.breakMinutes,
      graceMinutes: data.graceMinutes,
      isActive: data.isActive,
    });

    await peopleReadStore.invalidateBranchShifts(tenantId, existing.branchId);

    return updated;
  }

  public async deleteShift(tenantId: string, id: string): Promise<CachedShift> {
    const existing = await shiftRepository.findShiftById(tenantId, id);
    if (!existing) {
      throw new NotFoundError('Shift not found');
    }

    const deleted = await shiftRepository.deleteShift(tenantId, id);

    await peopleReadStore.invalidateBranchShifts(tenantId, existing.branchId);

    return deleted;
  }
}

export const shiftService = new ShiftService();
