import { NotFoundError } from '@salon-spa-saas/common-types';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { shiftRepository } from '../../infrastructure/repositories/shift.repository';
export class ShiftService {
    async getShiftsByBranch(tenantId, branchId) {
        if (!branchId) {
            return shiftRepository.findShiftsByBranch(tenantId);
        }
        return peopleReadStore.getBranchShifts(tenantId, branchId, async () => {
            return shiftRepository.findShiftsByBranch(tenantId, branchId);
        });
    }
    async getShiftById(tenantId, id) {
        const shift = await shiftRepository.findShiftById(tenantId, id);
        if (!shift) {
            throw new NotFoundError('Shift not found');
        }
        return shift;
    }
    async createShift(tenantId, data) {
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
    async updateShift(tenantId, id, data) {
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
    async deleteShift(tenantId, id) {
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
