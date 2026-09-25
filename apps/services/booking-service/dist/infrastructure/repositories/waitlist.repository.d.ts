import type { WaitlistEntryDto } from '../../domain/entities/booking.dto';
export declare class WaitlistRepository {
    private toDto;
    list(tenantId: string, filter: {
        branchId?: string;
        preferredDate?: string;
        status?: string;
    }): Promise<WaitlistEntryDto[]>;
    create(data: {
        tenantId: string;
        branchId: string;
        customerId: string;
        serviceId: string;
        preferredStaffId?: string | null;
        preferredDate: string;
        preferredStartTime?: string | null;
        preferredEndTime?: string | null;
    }): Promise<WaitlistEntryDto>;
    updateStatus(tenantId: string, id: string, status: string): Promise<WaitlistEntryDto>;
}
export declare const waitlistRepository: WaitlistRepository;
//# sourceMappingURL=waitlist.repository.d.ts.map