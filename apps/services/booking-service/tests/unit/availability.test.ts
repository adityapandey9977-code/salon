import { describe, expect, it, vi } from 'vitest';
import { availabilityService } from '../../src/application/services/availability.service';
import { appointmentRepository } from '../../src/infrastructure/repositories/appointment.repository';
import { holdRepository } from '../../src/infrastructure/repositories/hold.repository';

describe('Availability Engine Unit Tests', () => {
  it('should generate available time slots correctly without conflicts', async () => {
    vi.spyOn(appointmentRepository, 'checkConflicts').mockResolvedValue(false);
    vi.spyOn(holdRepository, 'checkActiveHolds').mockResolvedValue(false);

    const slots = await availabilityService.getAvailableSlots({
      tenantId: '00000000-0000-0000-0000-000000000001',
      branchId: '00000000-0000-0000-0000-000000000002',
      serviceId: '00000000-0000-0000-0000-000000000003',
      date: '2026-10-15',
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots[0].available).toBe(true);
  });

  it('should mark slots as unavailable if there is an appointment conflict', async () => {
    vi.spyOn(appointmentRepository, 'checkConflicts').mockResolvedValue(true);
    vi.spyOn(holdRepository, 'checkActiveHolds').mockResolvedValue(false);

    const slots = await availabilityService.getAvailableSlots({
      tenantId: '00000000-0000-0000-0000-000000000001',
      branchId: '00000000-0000-0000-0000-000000000002',
      serviceId: '00000000-0000-0000-0000-000000000003',
      date: '2026-10-15',
      staffId: '00000000-0000-0000-0000-000000000004',
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((s) => s.available === false)).toBe(true);
    expect(slots[0].reason).toBe('Booked');
  });
});
