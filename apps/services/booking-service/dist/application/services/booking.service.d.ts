import type { AppointmentDto } from '../../domain/entities/booking.dto';
import type { AppointmentStatus, BookingSource } from '../../infrastructure/prisma/generated-client';
export declare class BookingService {
    private generateBookingNumber;
    getById(tenantId: string, id: string): Promise<AppointmentDto>;
    list(tenantId: string, filter: {
        branchId?: string;
        customerId?: string;
        staffId?: string;
        status?: AppointmentStatus;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        data: AppointmentDto[];
        total: number;
    }>;
    create(tenantId: string, data: {
        branchId: string;
        customerId: string;
        source?: BookingSource;
        status?: AppointmentStatus;
        scheduledStartAt: string;
        scheduledEndAt?: string;
        timezone?: string;
        notes?: string | null;
        depositRequired?: boolean;
        depositAmount?: number;
        items: Array<{
            serviceId: string;
            staffId?: string | null;
            scheduledStartAt?: string;
            scheduledEndAt?: string;
            price?: number;
        }>;
        resources?: Array<{
            resourceId: string;
            resourceType?: string;
        }>;
    }, actor: {
        principalType: string;
        userId?: string | null;
    }): Promise<AppointmentDto>;
    updateStatus(tenantId: string, id: string, status: AppointmentStatus, actor: {
        principalType: string;
        userId?: string | null;
    }, reason?: string): Promise<AppointmentDto>;
    reassignStaff(tenantId: string, appointmentId: string, itemId: string, newStaffId: string): Promise<AppointmentDto>;
    getCalendar(tenantId: string, branchId: string, date: string): Promise<AppointmentDto[]>;
    getTodayQueue(tenantId: string, branchId: string): Promise<AppointmentDto[]>;
    getWalkins(tenantId: string, branchId: string): Promise<AppointmentDto[]>;
    createWalkin(tenantId: string, data: {
        branchId: string;
        customerId: string;
        items: Array<{
            serviceId: string;
            staffId?: string | null;
            price?: number;
        }>;
        notes?: string | null;
    }, actor: {
        principalType: string;
        userId?: string | null;
    }): Promise<AppointmentDto>;
    seatWalkin(tenantId: string, appointmentId: string, staffId: string, actor: {
        principalType: string;
        userId?: string | null;
    }): Promise<AppointmentDto>;
    getStylistSchedule(tenantId: string, staffId: string, date: string): Promise<AppointmentDto[]>;
    getMyBookings(tenantId: string, customerId: string): Promise<AppointmentDto[]>;
    getPendingConfirmations(tenantId: string, branchId?: string): Promise<AppointmentDto[]>;
    getCrossBranch(tenantId: string, customerId: string): Promise<AppointmentDto[]>;
}
export declare const bookingService: BookingService;
//# sourceMappingURL=booking.service.d.ts.map