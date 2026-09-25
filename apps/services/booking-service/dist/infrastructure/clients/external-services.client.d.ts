export interface CustomerSummaryDto {
    id: string;
    tenantId: string;
    firstName: string;
    lastName?: string | null;
    mobilePhone: string;
    email?: string | null;
    status: string;
}
export interface ServiceBookingContextDto {
    id: string;
    tenantId: string;
    name: string;
    durationMinutes: number;
    bufferBeforeMinutes: number;
    bufferAfterMinutes: number;
    basePrice: number;
    branchPrice?: number;
    requiresConsultation: boolean;
    requiresPatchTest: boolean;
    isActive: boolean;
    isBookableOnline: boolean;
}
export interface StaffAvailabilityDto {
    staffId: string;
    isActive: boolean;
    isAssignedToBranch: boolean;
    hasSkill: boolean;
    isOnLeave: boolean;
    shiftStart?: string;
    shiftEnd?: string;
}
export declare class ExternalServicesClient {
    private getHeaders;
    getCustomerSummary(tenantId: string, customerId: string): Promise<CustomerSummaryDto | null>;
    recordCustomerVisit(tenantId: string, customerId: string, amount: number, visitDate?: string): Promise<boolean>;
    getServiceBookingContext(tenantId: string, serviceId: string, branchId?: string): Promise<ServiceBookingContextDto | null>;
    getStaffAvailability(tenantId: string, staffId: string, branchId: string, date: string): Promise<StaffAvailabilityDto>;
}
export declare const externalServicesClient: ExternalServicesClient;
//# sourceMappingURL=external-services.client.d.ts.map