import type { CachedShift } from '../../domain/entities/staff.dto';
export declare class ShiftRepository {
    private toDto;
    findShiftsByBranch(tenantId: string, branchId?: string): Promise<CachedShift[]>;
    findShiftById(tenantId: string, id: string): Promise<CachedShift | null>;
    createShift(data: {
        tenantId: string;
        branchId: string;
        name: string;
        startTime: string;
        endTime: string;
        breakMinutes?: number;
        graceMinutes?: number;
        isActive?: boolean;
    }): Promise<CachedShift>;
    updateShift(tenantId: string, id: string, data: {
        name?: string;
        startTime?: string;
        endTime?: string;
        breakMinutes?: number;
        graceMinutes?: number;
        isActive?: boolean;
    }): Promise<CachedShift>;
    deleteShift(tenantId: string, id: string): Promise<CachedShift>;
}
export declare const shiftRepository: ShiftRepository;
//# sourceMappingURL=shift.repository.d.ts.map