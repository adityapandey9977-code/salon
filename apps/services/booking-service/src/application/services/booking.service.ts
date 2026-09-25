import crypto from 'crypto';
import { BadRequestError, ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type { AppointmentDto } from '../../domain/entities/booking.dto';
import { externalServicesClient } from '../../infrastructure/clients/external-services.client';
import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { bookingEventPublisher } from '../../infrastructure/messaging/publisher';
import { appointmentRepository } from '../../infrastructure/repositories/appointment.repository';
import { bookingReadStore } from '../../infrastructure/redis/booking-read.store';
import { SlotLockManager } from '../../infrastructure/redis/client';
import type { AppointmentStatus, BookingSource } from '../../infrastructure/prisma/generated-client';

export class BookingService {
  private generateBookingNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BK-${timestamp}-${random}`;
  }

  public async getById(tenantId: string, id: string): Promise<AppointmentDto> {
    // 1. Redis Cache Read-Through
    const cached = await bookingReadStore.getAppointment(tenantId, id);
    if (cached) return cached;

    // 2. Database Fetch
    const record = await appointmentRepository.findById(tenantId, id);
    if (!record) throw new NotFoundError('Appointment not found');

    // 3. Cache Fill
    await bookingReadStore.setAppointment(tenantId, id, record);
    return record;
  }

  public async list(
    tenantId: string,
    filter: {
      branchId?: string;
      customerId?: string;
      staffId?: string;
      status?: AppointmentStatus;
      startDate?: Date;
      endDate?: Date;
      page?: number;
      limit?: number;
    },
  ) {
    return appointmentRepository.list(tenantId, filter);
  }

  public async create(
    tenantId: string,
    data: {
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
      resources?: Array<{ resourceId: string; resourceType?: string }>;
    },
    actor: { principalType: string; userId?: string | null },
  ): Promise<AppointmentDto> {
    // 1. Validate customer
    const customer = await externalServicesClient.getCustomerSummary(tenantId, data.customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found in customer-service');
    }

    // 2. Validate services and calculate durations/prices
    let calculatedEndTime: Date | null = null;
    let subtotal = 0;
    const startAt = new Date(data.scheduledStartAt);

    const processedItems: Array<{
      serviceId: string;
      staffId?: string | null;
      scheduledStartAt: Date;
      scheduledEndAt: Date;
      priceSnapshot: number;
      durationMinutesSnapshot: number;
    }> = [];

    let currentItemStart = new Date(startAt);

    for (const item of data.items) {
      const serviceCtx = await externalServicesClient.getServiceBookingContext(
        tenantId,
        item.serviceId,
        data.branchId,
      );

      const duration = serviceCtx?.durationMinutes || 45;
      const price = item.price !== undefined ? item.price : serviceCtx?.branchPrice ?? serviceCtx?.basePrice ?? 500;
      const itemStart = item.scheduledStartAt ? new Date(item.scheduledStartAt) : currentItemStart;
      const itemEnd = item.scheduledEndAt
        ? new Date(item.scheduledEndAt)
        : new Date(itemStart.getTime() + duration * 60 * 1000);

      // Validate staff if assigned
      if (item.staffId) {
        const staffAvailability = await externalServicesClient.getStaffAvailability(
          tenantId,
          item.staffId,
          data.branchId,
          itemStart.toISOString().split('T')[0],
        );
        if (staffAvailability.isOnLeave) {
          throw new BadRequestError(`Staff member ${item.staffId} is on leave on this date`);
        }
      }

      processedItems.push({
        serviceId: item.serviceId,
        staffId: item.staffId,
        scheduledStartAt: itemStart,
        scheduledEndAt: itemEnd,
        priceSnapshot: price,
        durationMinutesSnapshot: duration,
      });

      subtotal += price;
      currentItemStart = new Date(itemEnd);
      calculatedEndTime = itemEnd;
    }

    const finalEndTime = data.scheduledEndAt ? new Date(data.scheduledEndAt) : calculatedEndTime || startAt;

    // 3. Acquire Distributed Redis Slot Lock
    const primaryStaff = processedItems[0]?.staffId || 'unassigned';
    const lockToken = crypto.randomUUID();
    const lockAcquired = await SlotLockManager.acquireLock(
      tenantId,
      data.branchId,
      primaryStaff,
      startAt.toISOString(),
      lockToken,
    );

    if (!lockAcquired) {
      throw new ConflictError('The requested booking slot is currently being locked by another transaction');
    }

    try {
      // 4. PostgreSQL Double-Check Conflict within isolation
      for (const item of processedItems) {
        if (item.staffId) {
          const hasConflict = await appointmentRepository.checkConflicts(
            tenantId,
            data.branchId,
            item.staffId,
            item.scheduledStartAt,
            item.scheduledEndAt,
          );
          if (hasConflict) {
            throw new ConflictError(`Staff member ${item.staffId} has a conflicting appointment at this time`);
          }
        }
      }

      const bookingNumber = this.generateBookingNumber();

      // 5. Create in DB transaction
      const record = await appointmentRepository.create({
        tenantId,
        branchId: data.branchId,
        customerId: data.customerId,
        bookingNumber,
        source: data.source || 'ADMIN',
        status: data.status || 'CONFIRMED',
        scheduledStartAt: startAt,
        scheduledEndAt: finalEndTime,
        timezone: data.timezone || 'Asia/Kolkata',
        subtotalEstimate: subtotal,
        depositRequired: Boolean(data.depositRequired),
        depositAmount: data.depositAmount ?? 0,
        notes: data.notes,
        items: processedItems,
        resources: data.resources,
        actor,
      });

      // 6. Invalidate Cache
      await bookingReadStore.invalidateAppointment(
        tenantId,
        record.id,
        data.branchId,
        startAt.toISOString().split('T')[0],
      );

      // 7. Publish Event
      await bookingEventPublisher.publish({
        eventType: DOMAIN_EVENTS.APPOINTMENT_CREATED,
        aggregateType: 'Appointment',
        aggregateId: record.id,
        tenantId,
        userId: actor.userId,
        payload: {
          appointmentId: record.id,
          bookingNumber: record.bookingNumber,
          branchId: record.branchId,
          customerId: record.customerId,
          scheduledStartAt: record.scheduledStartAt,
          scheduledEndAt: record.scheduledEndAt,
          status: record.status,
          subtotal: record.subtotalEstimate,
        },
      });

      return record;
    } finally {
      // 8. Release Redis Lock
      await SlotLockManager.releaseLock(
        tenantId,
        data.branchId,
        primaryStaff,
        startAt.toISOString(),
        lockToken,
      );
    }
  }

  public async updateStatus(
    tenantId: string,
    id: string,
    status: AppointmentStatus,
    actor: { principalType: string; userId?: string | null },
    reason?: string,
  ): Promise<AppointmentDto> {
    const updated = await appointmentRepository.updateStatus(tenantId, id, status, actor, reason);

    await bookingReadStore.invalidateAppointment(
      tenantId,
      updated.id,
      updated.branchId,
      updated.scheduledStartAt.split('T')[0],
    );

    // Map to corresponding domain event
    const eventMap: Record<string, any> = {
      CONFIRMED: DOMAIN_EVENTS.APPOINTMENT_CONFIRMED,
      CHECKED_IN: DOMAIN_EVENTS.APPOINTMENT_CHECKED_IN,
      IN_SERVICE: DOMAIN_EVENTS.SERVICE_STARTED,
      COMPLETED: DOMAIN_EVENTS.APPOINTMENT_COMPLETED,
      CANCELLED: DOMAIN_EVENTS.APPOINTMENT_CANCELLED,
      NO_SHOW: DOMAIN_EVENTS.APPOINTMENT_NO_SHOW,
    };

    const eventType = eventMap[status] || DOMAIN_EVENTS.APPOINTMENT_CONFIRMED;

    await bookingEventPublisher.publish({
      eventType,
      aggregateType: 'Appointment',
      aggregateId: updated.id,
      tenantId,
      userId: actor.userId,
      payload: {
        appointmentId: updated.id,
        bookingNumber: updated.bookingNumber,
        branchId: updated.branchId,
        customerId: updated.customerId,
        status: updated.status,
        reason,
      },
    });

    if (status === 'COMPLETED') {
      const visitAmount =
        updated.subtotalEstimate ||
        (updated.items || []).reduce((sum, it) => sum + (it.priceSnapshot || 0), 0);
      externalServicesClient
        .recordCustomerVisit(
          tenantId,
          updated.customerId,
          visitAmount,
          updated.completedAt || new Date().toISOString(),
        )
        .catch(() => {});
    }

    return updated;
  }

  public async reassignStaff(
    tenantId: string,
    appointmentId: string,
    itemId: string,
    newStaffId: string,
  ): Promise<AppointmentDto> {
    const record = await appointmentRepository.reassignStaff(
      tenantId,
      appointmentId,
      itemId,
      newStaffId,
    );
    await bookingReadStore.invalidateAppointment(tenantId, appointmentId, record.branchId);
    return record;
  }

  public async getCalendar(
    tenantId: string,
    branchId: string,
    date: string,
  ): Promise<AppointmentDto[]> {
    const cached = await bookingReadStore.getBranchCalendar(tenantId, branchId, date);
    if (cached) return cached;

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const result = await appointmentRepository.list(tenantId, {
      branchId,
      startDate,
      endDate,
      limit: 200,
    });

    await bookingReadStore.setBranchCalendar(tenantId, branchId, date, result.data);
    return result.data;
  }

  public async getTodayQueue(tenantId: string, branchId: string): Promise<AppointmentDto[]> {
    const todayStr = new Date().toISOString().split('T')[0];
    const startDate = new Date(`${todayStr}T00:00:00.000Z`);
    const endDate = new Date(`${todayStr}T23:59:59.999Z`);

    const result = await appointmentRepository.list(tenantId, {
      branchId,
      startDate,
      endDate,
      limit: 100,
    });

    return result.data.filter((a) => ['CONFIRMED', 'CHECKED_IN', 'IN_SERVICE'].includes(a.status));
  }

  public async getWalkins(tenantId: string, branchId: string): Promise<AppointmentDto[]> {
    const todayStr = new Date().toISOString().split('T')[0];
    const startDate = new Date(`${todayStr}T00:00:00.000Z`);
    const endDate = new Date(`${todayStr}T23:59:59.999Z`);

    const result = await appointmentRepository.list(tenantId, {
      branchId,
      startDate,
      endDate,
      limit: 100,
    });

    return result.data.filter((a) => a.source === 'WALK_IN');
  }

  public async createWalkin(
    tenantId: string,
    data: {
      branchId: string;
      customerId: string;
      items: Array<{ serviceId: string; staffId?: string | null; price?: number }>;
      notes?: string | null;
    },
    actor: { principalType: string; userId?: string | null },
  ): Promise<AppointmentDto> {
    const now = new Date();
    return this.create(
      tenantId,
      {
        branchId: data.branchId,
        customerId: data.customerId,
        source: 'WALK_IN',
        status: 'CHECKED_IN',
        scheduledStartAt: now.toISOString(),
        notes: data.notes,
        items: data.items,
      },
      actor,
    );
  }

  public async seatWalkin(
    tenantId: string,
    appointmentId: string,
    staffId: string,
    actor: { principalType: string; userId?: string | null },
  ): Promise<AppointmentDto> {
    const appointment = await this.getById(tenantId, appointmentId);
    if (appointment.items && appointment.items[0]) {
      await appointmentRepository.reassignStaff(
        tenantId,
        appointmentId,
        appointment.items[0].id,
        staffId,
      );
    }
    return this.updateStatus(tenantId, appointmentId, 'IN_SERVICE', actor, 'Walk-in seated and service started');
  }

  public async getStylistSchedule(
    tenantId: string,
    staffId: string,
    date: string,
  ): Promise<AppointmentDto[]> {
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const result = await appointmentRepository.list(tenantId, {
      staffId,
      startDate,
      endDate,
      limit: 50,
    });

    return result.data;
  }

  public async getMyBookings(tenantId: string, customerId: string): Promise<AppointmentDto[]> {
    const result = await appointmentRepository.list(tenantId, {
      customerId,
      limit: 50,
    });
    return result.data;
  }

  public async getPendingConfirmations(tenantId: string, branchId?: string): Promise<AppointmentDto[]> {
    const result = await appointmentRepository.list(tenantId, {
      branchId,
      status: 'PENDING_CONFIRMATION',
      limit: 50,
    });
    return result.data;
  }

  public async getCrossBranch(tenantId: string, customerId: string): Promise<AppointmentDto[]> {
    const result = await appointmentRepository.list(tenantId, {
      customerId,
      limit: 50,
    });
    return result.data;
  }
}

export const bookingService = new BookingService();
