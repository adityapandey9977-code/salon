import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../../src/app';
import { config } from '../../src/config';
import { appointmentRepository } from '../../src/infrastructure/repositories/appointment.repository';
import { externalServicesClient } from '../../src/infrastructure/clients/external-services.client';
import { SlotLockManager } from '../../src/infrastructure/redis/client';
import { bookingReadStore } from '../../src/infrastructure/redis/booking-read.store';

describe('Booking Service Integration Tests', () => {
  const app = createApp();

  beforeEach(() => {
    vi.spyOn(SlotLockManager, 'acquireLock').mockResolvedValue(true);
    vi.spyOn(SlotLockManager, 'releaseLock').mockResolvedValue(undefined);
    vi.spyOn(bookingReadStore, 'setAppointment').mockResolvedValue(undefined);
    vi.spyOn(bookingReadStore, 'invalidateAppointment').mockResolvedValue(undefined);
  });
  const tenantId = '00000000-0000-0000-0000-000000000001';
  const token = jwt.sign(
    {
      sub: '00000000-0000-0000-0000-000000000099',
      tenantId,
      principalType: 'USER',
      permissions: [
        'appointment.read',
        'appointment.create',
        'appointment.update',
        'appointment.cancel',
        'appointment.confirm',
        'appointment.complete',
        'walkin.read',
        'walkin.manage',
      ],
    },
    config.JWT_SECRET,
  );

  const mockAppointment = {
    id: '00000000-0000-0000-0000-000000000010',
    tenantId,
    branchId: '00000000-0000-0000-0000-000000000002',
    customerId: '00000000-0000-0000-0000-000000000003',
    bookingNumber: 'BK-123456-7890',
    source: 'ADMIN',
    status: 'CONFIRMED',
    scheduledStartAt: '2026-10-15T10:00:00.000Z',
    scheduledEndAt: '2026-10-15T11:00:00.000Z',
    timezone: 'Asia/Kolkata',
    subtotalEstimate: 1200,
    depositRequired: false,
    depositAmount: 0,
    items: [],
    resources: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('should list appointments with auth', async () => {
    vi.spyOn(appointmentRepository, 'list').mockResolvedValue({
      data: [mockAppointment as any],
      total: 1,
    });

    const res = await request(app)
      .get('/api/v1/appointments')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].bookingNumber).toBe('BK-123456-7890');
  });

  it('should create an appointment successfully', async () => {
    vi.spyOn(externalServicesClient, 'getCustomerSummary').mockResolvedValue({
      id: '00000000-0000-0000-0000-000000000003',
      tenantId,
      firstName: 'Jane',
      mobilePhone: '+919876543210',
      status: 'ACTIVE',
    });
    vi.spyOn(externalServicesClient, 'getServiceBookingContext').mockResolvedValue({
      id: '00000000-0000-0000-0000-000000000004',
      tenantId,
      name: 'Haircut',
      durationMinutes: 45,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 5,
      basePrice: 500,
      requiresConsultation: false,
      requiresPatchTest: false,
      isActive: true,
      isBookableOnline: true,
    });
    vi.spyOn(appointmentRepository, 'checkConflicts').mockResolvedValue(false);
    vi.spyOn(appointmentRepository, 'create').mockResolvedValue(mockAppointment as any);

    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        branchId: '00000000-0000-0000-0000-000000000002',
        customerId: '00000000-0000-0000-0000-000000000003',
        scheduledStartAt: '2026-10-15T10:00:00.000Z',
        scheduledEndAt: '2026-10-15T10:45:00.000Z',
        items: [
          {
            serviceId: '00000000-0000-0000-0000-000000000004',
            scheduledStartAt: '2026-10-15T10:00:00.000Z',
            scheduledEndAt: '2026-10-15T10:45:00.000Z',
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(mockAppointment.id);
  });

  it('should transition status to COMPLETED', async () => {
    vi.spyOn(appointmentRepository, 'updateStatus').mockResolvedValue({
      ...mockAppointment,
      status: 'COMPLETED',
    } as any);

    const res = await request(app)
      .patch(`/api/v1/appointments/${mockAppointment.id}/complete`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('COMPLETED');
  });
});
