import { redis } from './client';
export class BookingReadStore {
    DEFAULT_TTL = 300; // 5 minutes
    appointmentKey(tenantId, id) {
        return `tenant:${tenantId}:appointment:${id}`;
    }
    branchCalendarKey(tenantId, branchId, date) {
        return `tenant:${tenantId}:branch:${branchId}:calendar:${date}`;
    }
    staffScheduleKey(tenantId, staffId, date) {
        return `tenant:${tenantId}:staff:${staffId}:schedule:${date}`;
    }
    async getAppointment(tenantId, id) {
        try {
            const data = await redis.get(this.appointmentKey(tenantId, id));
            return data ? JSON.parse(data) : null;
        }
        catch {
            return null;
        }
    }
    async setAppointment(tenantId, id, appointment, ttlSeconds = this.DEFAULT_TTL) {
        try {
            await redis.set(this.appointmentKey(tenantId, id), JSON.stringify(appointment), 'EX', ttlSeconds);
        }
        catch {
            // Safe fallback if Redis is unavailable
        }
    }
    async invalidateAppointment(tenantId, id, branchId, date) {
        try {
            const keys = [this.appointmentKey(tenantId, id)];
            if (branchId && date) {
                keys.push(this.branchCalendarKey(tenantId, branchId, date));
            }
            await redis.del(...keys);
        }
        catch {
            // Safe fallback
        }
    }
    async getBranchCalendar(tenantId, branchId, date) {
        try {
            const data = await redis.get(this.branchCalendarKey(tenantId, branchId, date));
            return data ? JSON.parse(data) : null;
        }
        catch {
            return null;
        }
    }
    async setBranchCalendar(tenantId, branchId, date, appointments, ttlSeconds = 60) {
        try {
            await redis.set(this.branchCalendarKey(tenantId, branchId, date), JSON.stringify(appointments), 'EX', ttlSeconds);
        }
        catch {
            // Safe fallback
        }
    }
}
export const bookingReadStore = new BookingReadStore();
