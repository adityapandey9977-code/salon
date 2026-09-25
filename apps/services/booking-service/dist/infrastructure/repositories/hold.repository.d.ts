import type { BookingHoldDto } from '../../domain/entities/booking.dto';
export declare class HoldRepository {
    private toDto;
    findByToken(token: string): Promise<BookingHoldDto | null>;
    createHold(data: {
        tenantId: string;
        branchId: string;
        holdToken: string;
        customerId?: string | null;
        startsAt: Date;
        endsAt: Date;
        ttlMinutes?: number;
    }): Promise<BookingHoldDto>;
    releaseHold(holdToken: string): Promise<void>;
    checkActiveHolds(tenantId: string, branchId: string, startsAt: Date, endsAt: Date): Promise<boolean>;
}
export declare const holdRepository: HoldRepository;
//# sourceMappingURL=hold.repository.d.ts.map