import type { CachedBranchStaffAssignment } from '../../domain/entities/staff.dto';
export declare class StaffBranchRepository {
    private toDto;
    findAssignmentsByEmployee(tenantId: string, employeeId: string): Promise<CachedBranchStaffAssignment[]>;
    findAssignment(tenantId: string, employeeId: string, branchId: string): Promise<CachedBranchStaffAssignment | null>;
    findAssignmentById(tenantId: string, id: string): Promise<CachedBranchStaffAssignment | null>;
    assignBranch(data: {
        tenantId: string;
        employeeId: string;
        branchId: string;
        isPrimary?: boolean;
        effectiveFrom?: Date;
        effectiveTo?: Date | null;
        status?: string;
    }): Promise<CachedBranchStaffAssignment>;
    updateAssignment(tenantId: string, id: string, data: {
        isPrimary?: boolean;
        effectiveTo?: Date | null;
        status?: string;
    }): Promise<CachedBranchStaffAssignment>;
    removeAssignment(tenantId: string, id: string): Promise<CachedBranchStaffAssignment>;
    findEmployeesByBranch(tenantId: string, branchId: string): Promise<string[]>;
}
export declare const staffBranchRepository: StaffBranchRepository;
//# sourceMappingURL=staff-branch.repository.d.ts.map