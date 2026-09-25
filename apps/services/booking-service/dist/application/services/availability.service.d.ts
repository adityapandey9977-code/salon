import type { TimeSlotDto } from '../../domain/entities/booking.dto';
export declare class AvailabilityService {
    /**
     * Calculates slot availability for a given service and date at a branch
     */
    getAvailableSlots(params: {
        tenantId: string;
        branchId: string;
        serviceId?: string;
        date: string;
        staffId?: string;
        durationMinutes?: number;
    }): Promise<TimeSlotDto[]>;
}
export declare const availabilityService: AvailabilityService;
//# sourceMappingURL=availability.service.d.ts.map