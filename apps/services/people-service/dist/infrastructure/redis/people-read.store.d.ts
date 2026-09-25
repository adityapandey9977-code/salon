import type { CachedBranchStaffAssignment, CachedRosterAssignment, CachedShift, CachedStaffProfile, CachedStaffSkill } from '../../domain/entities/staff.dto';
export declare class PeopleReadStore {
    private static instance;
    private constructor();
    static getInstance(): PeopleReadStore;
    private get redis();
    private safeParse;
    getEmployeeDetailKey(tenantId: string, employeeId: string): string;
    getBranchTeamKey(tenantId: string, branchId: string): string;
    getEmployeeBranchesKey(tenantId: string, employeeId: string): string;
    getEmployeeSkillsKey(tenantId: string, employeeId: string): string;
    getBranchShiftsKey(tenantId: string, branchId: string): string;
    getEmployeeRosterKey(tenantId: string, employeeId: string, date: string): string;
    getEmployeeDetail(tenantId: string, employeeId: string, fallback: () => Promise<CachedStaffProfile | null>): Promise<CachedStaffProfile | null>;
    getBranchTeam(tenantId: string, branchId: string, fallback: () => Promise<CachedStaffProfile[]>): Promise<CachedStaffProfile[]>;
    getEmployeeBranches(tenantId: string, employeeId: string, fallback: () => Promise<CachedBranchStaffAssignment[]>): Promise<CachedBranchStaffAssignment[]>;
    getEmployeeSkills(tenantId: string, employeeId: string, fallback: () => Promise<CachedStaffSkill[]>): Promise<CachedStaffSkill[]>;
    getBranchShifts(tenantId: string, branchId: string, fallback: () => Promise<CachedShift[]>): Promise<CachedShift[]>;
    getEmployeeRoster(tenantId: string, employeeId: string, date: string, fallback: () => Promise<CachedRosterAssignment | null>): Promise<CachedRosterAssignment | null>;
    invalidateEmployee(tenantId: string, employeeId: string, primaryBranchId?: string | null): Promise<void>;
    invalidateBranchAssignments(tenantId: string, employeeId: string, branchId: string, oldBranchId?: string): Promise<void>;
    invalidateEmployeeSkills(tenantId: string, employeeId: string): Promise<void>;
    invalidateBranchShifts(tenantId: string, branchId: string): Promise<void>;
    invalidateRoster(tenantId: string, employeeId: string, date: string): Promise<void>;
    private delKeys;
}
export declare const peopleReadStore: PeopleReadStore;
//# sourceMappingURL=people-read.store.d.ts.map