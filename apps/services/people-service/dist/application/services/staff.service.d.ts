import type { CreateEmployeeRequest, ListStaffQuery, UpdateEmployeeRequest } from '@salon-spa-saas/contracts';
import type { CachedStaffProfile } from '../../domain/entities/staff.dto';
export declare class StaffService {
    listStaff(tenantId: string, query: ListStaffQuery): Promise<{
        items: CachedStaffProfile[];
        total: number;
        page: number;
        limit: number;
    }>;
    getStaffDetail(tenantId: string, id: string): Promise<CachedStaffProfile>;
    getStaffMe(identityUserId: string, tenantId?: string | null): Promise<CachedStaffProfile>;
    createStaff(tenantId: string, data: CreateEmployeeRequest, createdByUserId?: string | null): Promise<CachedStaffProfile>;
    updateStaff(tenantId: string, id: string, data: UpdateEmployeeRequest, updatedByUserId?: string | null): Promise<CachedStaffProfile>;
    softDeleteStaff(tenantId: string, id: string, deletedByUserId?: string | null, deleteReason?: string | null): Promise<CachedStaffProfile>;
    getBranchTeam(tenantId: string, branchId: string): Promise<CachedStaffProfile[]>;
}
export declare const staffService: StaffService;
//# sourceMappingURL=staff.service.d.ts.map