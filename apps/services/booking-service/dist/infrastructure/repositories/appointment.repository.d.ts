import type { AppointmentDto } from '../../domain/entities/booking.dto';
import { type AppointmentStatus, type BookingSource, Prisma } from '../prisma/generated-client';
export declare class AppointmentRepository {
    private toDto;
    findById(tenantId: string, id: string): Promise<AppointmentDto | null>;
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
    checkConflicts(tenantId: string, branchId: string, staffId: string | null | undefined, startTime: Date, endTime: Date, excludeAppointmentId?: string, tx?: Prisma.TransactionClient): Promise<boolean>;
    create(data: {
        tenantId: string;
        branchId: string;
        customerId: string;
        bookingNumber: string;
        source?: BookingSource;
        status?: AppointmentStatus;
        scheduledStartAt: Date;
        scheduledEndAt: Date;
        timezone?: string;
        subtotalEstimate?: number;
        depositRequired?: boolean;
        depositAmount?: number;
        notes?: string | null;
        items: Array<{
            serviceId: string;
            staffId?: string | null;
            scheduledStartAt: Date;
            scheduledEndAt: Date;
            priceSnapshot: number;
            durationMinutesSnapshot: number;
            status?: AppointmentStatus;
        }>;
        resources?: Array<{
            resourceId: string;
            resourceType?: string;
        }>;
        actor: {
            principalType: string;
            userId?: string | null;
        };
    }): Promise<AppointmentDto>;
    updateStatus(tenantId: string, id: string, newStatus: AppointmentStatus, actor: {
        principalType: string;
        userId?: string | null;
    }, reason?: string): Promise<AppointmentDto>;
    reassignStaff(tenantId: string, appointmentId: string, itemId: string, newStaffId: string): Promise<AppointmentDto>;
}
export declare const appointmentRepository: AppointmentRepository;
//# sourceMappingURL=appointment.repository.d.ts.map