import type { CreateShiftRequest, UpdateShiftRequest } from '@salon-spa-saas/contracts';
import type { CachedShift } from '../../domain/entities/staff.dto';
export declare class ShiftService {
    getShiftsByBranch(tenantId: string, branchId?: string): Promise<CachedShift[]>;
    getShiftById(tenantId: string, id: string): Promise<CachedShift>;
    createShift(tenantId: string, data: CreateShiftRequest): Promise<CachedShift>;
    updateShift(tenantId: string, id: string, data: UpdateShiftRequest): Promise<CachedShift>;
    deleteShift(tenantId: string, id: string): Promise<CachedShift>;
}
export declare const shiftService: ShiftService;
//# sourceMappingURL=shift.service.d.ts.map