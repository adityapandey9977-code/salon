import type { AppointmentDto } from '../../domain/entities/booking.dto';
import { redis } from './client';

export class BookingReadStore {
  private readonly DEFAULT_TTL = 300; // 5 minutes

  private appointmentKey(tenantId: string, id: string): string {
    return `tenant:${tenantId}:appointment:${id}`;
  }

  private branchCalendarKey(tenantId: string, branchId: string, date: string): string {
    return `tenant:${tenantId}:branch:${branchId}:calendar:${date}`;
  }

  private staffScheduleKey(tenantId: string, staffId: string, date: string): string {
    return `tenant:${tenantId}:staff:${staffId}:schedule:${date}`;
  }

  public async getAppointment(tenantId: string, id: string): Promise<AppointmentDto | null> {
    try {
      const data = await redis.get(this.appointmentKey(tenantId, id));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public async setAppointment(
    tenantId: string,
    id: string,
    appointment: AppointmentDto,
    ttlSeconds = this.DEFAULT_TTL,
  ): Promise<void> {
    try {
      await redis.set(
        this.appointmentKey(tenantId, id),
        JSON.stringify(appointment),
        'EX',
        ttlSeconds,
      );
    } catch {
      // Safe fallback if Redis is unavailable
    }
  }

  public async invalidateAppointment(
    tenantId: string,
    id: string,
    branchId?: string,
    date?: string,
  ): Promise<void> {
    try {
      const keys = [this.appointmentKey(tenantId, id)];
      if (branchId && date) {
        keys.push(this.branchCalendarKey(tenantId, branchId, date));
      }
      await redis.del(...keys);
    } catch {
      // Safe fallback
    }
  }

  public async getBranchCalendar(
    tenantId: string,
    branchId: string,
    date: string,
  ): Promise<AppointmentDto[] | null> {
    try {
      const data = await redis.get(this.branchCalendarKey(tenantId, branchId, date));
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public async setBranchCalendar(
    tenantId: string,
    branchId: string,
    date: string,
    appointments: AppointmentDto[],
    ttlSeconds = 60, // Short TTL for calendar
  ): Promise<void> {
    try {
      await redis.set(
        this.branchCalendarKey(tenantId, branchId, date),
        JSON.stringify(appointments),
        'EX',
        ttlSeconds,
      );
    } catch {
      // Safe fallback
    }
  }
}

export const bookingReadStore = new BookingReadStore();
