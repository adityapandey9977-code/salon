import type { CreateRosterRequest, QueryRosterRequest, UpdateRosterRequest } from '@salon-spa-saas/contracts';
import type { CachedRosterAssignment } from '../../domain/entities/staff.dto';
export declare class RosterService {
    queryRoster(tenantId: string, params: QueryRosterRequest): Promise<CachedRosterAssignment[]>;
    getEmployeeRosterForDate(tenantId: string, employeeId: string, dateStr: string): Promise<CachedRosterAssignment | null>;
    createRoster(tenantId: string, data: CreateRosterRequest, assignedByUserId?: string | null): Promise<CachedRosterAssignment>;
    updateRoster(tenantId: string, id: string, data: UpdateRosterRequest, updatedByUserId?: string | null): Promise<CachedRosterAssignment>;
    deleteRoster(tenantId: string, id: string): Promise<CachedRosterAssignment>;
}
export declare const rosterService: RosterService;
//# sourceMappingURL=roster.service.d.ts.map