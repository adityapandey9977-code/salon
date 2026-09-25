import type { AssignStaffBranchRequest, UpdateStaffBranchAssignmentRequest } from '@salon-spa-saas/contracts';
import type { CachedBranchStaffAssignment } from '../../domain/entities/staff.dto';
export declare class StaffBranchService {
    getStaffBranches(tenantId: string, employeeId: string): Promise<CachedBranchStaffAssignment[]>;
    assignBranch(tenantId: string, employeeId: string, data: AssignStaffBranchRequest, assignedByUserId?: string | null): Promise<CachedBranchStaffAssignment>;
    updateAssignment(tenantId: string, employeeId: string, assignmentId: string, data: UpdateStaffBranchAssignmentRequest): Promise<CachedBranchStaffAssignment>;
    removeAssignment(tenantId: string, employeeId: string, assignmentId: string, removedByUserId?: string | null): Promise<CachedBranchStaffAssignment>;
}
export declare const staffBranchService: StaffBranchService;
//# sourceMappingURL=staff-branch.service.d.ts.map