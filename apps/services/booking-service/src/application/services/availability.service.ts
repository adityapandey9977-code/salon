import { externalServicesClient } from '../../infrastructure/clients/external-services.client';
import { appointmentRepository } from '../../infrastructure/repositories/appointment.repository';
import { holdRepository } from '../../infrastructure/repositories/hold.repository';
import type { TimeSlotDto } from '../../domain/entities/booking.dto';

export class AvailabilityService {
  /**
   * Calculates slot availability for a given service and date at a branch
   */
  public async getAvailableSlots(params: {
    tenantId: string;
    branchId: string;
    serviceId?: string;
    date: string; // YYYY-MM-DD
    staffId?: string;
    durationMinutes?: number;
  }): Promise<TimeSlotDto[]> {
    const { tenantId, branchId, serviceId, date, staffId, durationMinutes } = params;

    // 1. Fetch service details (duration & buffers)
    let duration = durationMinutes || 45;
    let bufferBefore = 0;
    let bufferAfter = 5;

    if (serviceId) {
      const serviceContext = await externalServicesClient.getServiceBookingContext(
        tenantId,
        serviceId,
        branchId,
      );
      if (serviceContext) {
        duration = serviceContext.durationMinutes || duration;
        bufferBefore = serviceContext.bufferBeforeMinutes || bufferBefore;
        bufferAfter = serviceContext.bufferAfterMinutes || bufferAfter;
      }
    }

    const totalSlotMinutes = duration + bufferBefore + bufferAfter;

    // 2. Determine operating hours (Default: 09:00 to 20:00)
    const openHour = 9;
    const closeHour = 20;

    const slots: TimeSlotDto[] = [];
    const baseDate = new Date(`${date}T00:00:00.000Z`);

    // 3. Generate 30-min interval potential slots
    for (let hour = openHour; hour < closeHour; hour++) {
      for (const minute of [0, 30]) {
        const slotStart = new Date(baseDate);
        slotStart.setUTCHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart.getTime() + totalSlotMinutes * 60 * 1000);
        if (slotEnd.getUTCHours() > closeHour || (slotEnd.getUTCHours() === closeHour && slotEnd.getUTCMinutes() > 0)) {
          continue;
        }

        // Check conflicts in PostgreSQL
        const hasConflict = await appointmentRepository.checkConflicts(
          tenantId,
          branchId,
          staffId,
          slotStart,
          slotEnd,
        );

        // Check active booking holds
        const hasHold = await holdRepository.checkActiveHolds(
          tenantId,
          branchId,
          slotStart,
          slotEnd,
        );

        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          staffId,
          available: !hasConflict && !hasHold,
          reason: hasConflict ? 'Booked' : hasHold ? 'On Hold' : undefined,
        });
      }
    }

    return slots;
  }
}

export const availabilityService = new AvailabilityService();
