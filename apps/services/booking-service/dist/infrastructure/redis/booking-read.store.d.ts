import type { AppointmentDto } from '../../domain/entities/booking.dto';
export declare class BookingReadStore {
    private readonly DEFAULT_TTL;
    private appointmentKey;
    private branchCalendarKey;
    private staffScheduleKey;
    getAppointment(tenantId: string, id: string): Promise<AppointmentDto | null>;
    setAppointment(tenantId: string, id: string, appointment: AppointmentDto, ttlSeconds?: number): Promise<void>;
    invalidateAppointment(tenantId: string, id: string, branchId?: string, date?: string): Promise<void>;
    getBranchCalendar(tenantId: string, branchId: string, date: string): Promise<AppointmentDto[] | null>;
    setBranchCalendar(tenantId: string, branchId: string, date: string, appointments: AppointmentDto[], ttlSeconds?: number): Promise<void>;
}
export declare const bookingReadStore: BookingReadStore;
//# sourceMappingURL=booking-read.store.d.ts.map