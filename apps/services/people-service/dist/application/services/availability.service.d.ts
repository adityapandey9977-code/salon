import type { StaffAvailabilityContextResponse } from '@salon-spa-saas/contracts';
export declare class AvailabilityService {
    getStaffAvailabilityContext(tenantId: string, employeeId: string, queryDate?: string): Promise<StaffAvailabilityContextResponse>;
    getBookableStaffForBranch(tenantId: string, branchId: string, _date?: string, serviceId?: string): Promise<Array<{
        employeeId: string;
        displayName: string;
        jobTitle: string;
        isBookable: boolean;
        skills: string[];
    }>>;
}
export declare const availabilityService: AvailabilityService;
//# sourceMappingURL=availability.service.d.ts.map