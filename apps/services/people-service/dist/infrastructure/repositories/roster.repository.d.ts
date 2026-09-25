import type { CachedRosterAssignment } from '../../domain/entities/staff.dto';
import type { RosterStatus } from '../prisma/generated-client';
export declare class RosterRepository {
    private toDto;
    findRosterByEmployeeAndDate(tenantId: string, employeeId: string, date: Date): Promise<CachedRosterAssignment | null>;
    findRosterById(tenantId: string, id: string): Promise<CachedRosterAssignment | null>;
    queryRoster(params: {
        tenantId: string;
        branchId?: string;
        employeeId?: string;
        date?: Date;
        startDate?: Date;
        endDate?: Date;
    }): Promise<CachedRosterAssignment[]>;
    createRoster(data: {
        tenantId: string;
        employeeId: string;
        branchId: string;
        shiftId?: string | null;
        rosterDate: Date;
        startAt: Date;
        endAt: Date;
        status?: RosterStatus;
    }): Promise<CachedRosterAssignment>;
    updateRoster(tenantId: string, id: string, data: {
        shiftId?: string | null;
        startAt?: Date;
        endAt?: Date;
        status?: RosterStatus;
    }): Promise<CachedRosterAssignment>;
    deleteRoster(tenantId: string, id: string): Promise<CachedRosterAssignment>;
}
export declare const rosterRepository: RosterRepository;
//# sourceMappingURL=roster.repository.d.ts.map