import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type {
  AppointmentDto,
  AppointmentItemDto,
  AppointmentResourceDto,
} from '../../domain/entities/booking.dto';
import { prisma } from '../prisma/client';
import {
  type Appointment,
  type AppointmentItem,
  type AppointmentResource,
  type AppointmentStatus,
  type BookingSource,
  Prisma,
} from '../prisma/generated-client';

type AppointmentWithDetails = Appointment & {
  items: AppointmentItem[];
  resources: AppointmentResource[];
};

export class AppointmentRepository {
  private toDto(record: AppointmentWithDetails): AppointmentDto {
    return {
      id: record.id,
      tenantId: record.tenantId,
      branchId: record.branchId,
      customerId: record.customerId,
      bookingNumber: record.bookingNumber,
      source: record.source,
      status: record.status,
      scheduledStartAt: record.scheduledStartAt.toISOString(),
      scheduledEndAt: record.scheduledEndAt.toISOString(),
      timezone: record.timezone,
      subtotalEstimate: Number(record.subtotalEstimate),
      depositRequired: record.depositRequired,
      depositAmount: Number(record.depositAmount),
      notes: record.notes,
      confirmedAt: record.confirmedAt ? record.confirmedAt.toISOString() : null,
      cancelledAt: record.cancelledAt ? record.cancelledAt.toISOString() : null,
      completedAt: record.completedAt ? record.completedAt.toISOString() : null,
      items: record.items.map((it) => ({
        id: it.id,
        tenantId: it.tenantId,
        appointmentId: it.appointmentId,
        serviceId: it.serviceId,
        staffId: it.staffId,
        scheduledStartAt: it.scheduledStartAt.toISOString(),
        scheduledEndAt: it.scheduledEndAt.toISOString(),
        priceSnapshot: Number(it.priceSnapshot),
        durationMinutesSnapshot: it.durationMinutesSnapshot,
        status: it.status,
        createdAt: it.createdAt.toISOString(),
        updatedAt: it.updatedAt.toISOString(),
      })),
      resources: record.resources.map((res) => ({
        id: res.id,
        tenantId: res.tenantId,
        appointmentId: res.appointmentId,
        appointmentItemId: res.appointmentItemId,
        resourceId: res.resourceId,
        resourceType: res.resourceType,
        createdAt: res.createdAt.toISOString(),
      })),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  public async findById(tenantId: string, id: string): Promise<AppointmentDto | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    const record = await prisma.appointment.findFirst({
      where: isUuid
        ? { id, tenantId }
        : { bookingNumber: id, tenantId },
      include: {
        items: true,
        resources: true,
      },
    });
    if (!record) return null;
    return this.toDto(record);
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
  ): Promise<{ data: AppointmentDto[]; total: number }> {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      tenantId,
      ...(filter.branchId ? { branchId: filter.branchId } : {}),
      ...(filter.customerId ? { customerId: filter.customerId } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.startDate || filter.endDate
        ? {
            scheduledStartAt: {
              ...(filter.startDate ? { gte: filter.startDate } : {}),
              ...(filter.endDate ? { lte: filter.endDate } : {}),
            },
          }
        : {}),
      ...(filter.staffId
        ? {
            items: {
              some: { staffId: filter.staffId },
            },
          }
        : {}),
    };

    const [total, records] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.findMany({
        where,
        include: {
          items: true,
          resources: true,
        },
        orderBy: { scheduledStartAt: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: records.map((r) => this.toDto(r)),
      total,
    };
  }

  public async checkConflicts(
    tenantId: string,
    branchId: string,
    staffId: string | null | undefined,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    if (!staffId) return false;

    const client = tx || prisma;
    const conflict = await client.appointmentItem.findFirst({
      where: {
        tenantId,
        staffId,
        status: {
          notIn: ['CANCELLED', 'NO_SHOW'],
        },
        appointment: {
          // Staff member cannot have overlapping appointments across ANY branch in the tenant
          ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
          status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        },
        AND: [{ scheduledStartAt: { lt: endTime } }, { scheduledEndAt: { gt: startTime } }],
      },
    });

    return !!conflict;
  }

  public async create(data: {
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
  }): Promise<AppointmentDto> {
    const initialStatus = data.status || 'PENDING_CONFIRMATION';

    const record = await prisma.$transaction(async (tx) => {
      // 1. Transactional advisory lock for each assigned staff member to strictly serialize bookings
      for (const item of data.items) {
        if (item.staffId) {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${data.tenantId} || ':' || ${item.staffId}))`;
          const hasConflict = await this.checkConflicts(
            data.tenantId,
            data.branchId,
            item.staffId,
            item.scheduledStartAt,
            item.scheduledEndAt,
            undefined,
            tx,
          );
          if (hasConflict) {
            throw new ConflictError(
              `Staff member ${item.staffId} has a conflicting appointment at this time`,
            );
          }
        }
      }

      const created = await tx.appointment.create({
        data: {
          tenantId: data.tenantId,
          branchId: data.branchId,
          customerId: data.customerId,
          bookingNumber: data.bookingNumber,
          source: data.source || 'ADMIN',
          status: initialStatus,
          scheduledStartAt: data.scheduledStartAt,
          scheduledEndAt: data.scheduledEndAt,
          timezone: data.timezone || 'Asia/Kolkata',
          subtotalEstimate: new Prisma.Decimal(data.subtotalEstimate || 0),
          depositRequired: data.depositRequired || false,
          depositAmount: new Prisma.Decimal(data.depositAmount || 0),
          notes: data.notes,
          confirmedAt: initialStatus === 'CONFIRMED' ? new Date() : null,
          items: {
            create: data.items.map((it) => ({
              tenantId: data.tenantId,
              serviceId: it.serviceId,
              staffId: it.staffId,
              scheduledStartAt: it.scheduledStartAt,
              scheduledEndAt: it.scheduledEndAt,
              priceSnapshot: new Prisma.Decimal(it.priceSnapshot),
              durationMinutesSnapshot: it.durationMinutesSnapshot,
              status: it.status || initialStatus,
            })),
          },
          resources: data.resources
            ? {
                create: data.resources.map((r) => ({
                  tenantId: data.tenantId,
                  resourceId: r.resourceId,
                  resourceType: r.resourceType || 'ROOM',
                })),
              }
            : undefined,
        },
        include: {
          items: true,
          resources: true,
        },
      });

      await tx.appointmentStatusHistory.create({
        data: {
          tenantId: data.tenantId,
          appointmentId: created.id,
          toStatus: initialStatus,
          changedByPrincipalType: data.actor.principalType,
          changedByUserId: data.actor.userId,
          reason: 'Initial appointment creation',
        },
      });

      return created;
    });

    return this.toDto(record);
  }

  public async updateStatus(
    tenantId: string,
    id: string,
    newStatus: AppointmentStatus,
    actor: { principalType: string; userId?: string | null },
    reason?: string,
  ): Promise<AppointmentDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    const existing = await prisma.appointment.findFirst({
      where: isUuid
        ? { id, tenantId }
        : { bookingNumber: id, tenantId },
      include: { items: true, resources: true },
    });
    if (!existing) throw new NotFoundError('Appointment not found');

    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.appointment.update({
        where: { id: existing.id },
        data: {
          status: newStatus,
          confirmedAt: newStatus === 'CONFIRMED' ? new Date() : existing.confirmedAt,
          cancelledAt: newStatus === 'CANCELLED' ? new Date() : existing.cancelledAt,
          completedAt: newStatus === 'COMPLETED' ? new Date() : existing.completedAt,
          items: {
            updateMany: {
              where: { appointmentId: existing.id },
              data: { status: newStatus },
            },
          },
        },
        include: {
          items: true,
          resources: true,
        },
      });

      await tx.appointmentStatusHistory.create({
        data: {
          tenantId,
          appointmentId: existing.id,
          fromStatus: existing.status,
          toStatus: newStatus,
          changedByPrincipalType: actor.principalType,
          changedByUserId: actor.userId,
          reason,
        },
      });

      return app;
    });

    return this.toDto(updated);
  }

  public async reassignStaff(
    tenantId: string,
    appointmentId: string,
    itemId: string,
    newStaffId: string,
  ): Promise<AppointmentDto> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(appointmentId);
    const targetAppointment = await prisma.appointment.findFirst({
      where: isUuid
        ? { id: appointmentId, tenantId }
        : { bookingNumber: appointmentId, tenantId },
      include: { items: true },
    });
    if (!targetAppointment) throw new NotFoundError('Appointment not found');

    const targetItem = targetAppointment.items.find((it) => it.id === itemId);
    if (!targetItem) throw new NotFoundError('Appointment item not found');

    // Check conflict for new staff member
    const hasConflict = await this.checkConflicts(
      tenantId,
      targetAppointment.branchId,
      newStaffId,
      targetItem.scheduledStartAt,
      targetItem.scheduledEndAt,
      targetAppointment.id,
    );
    if (hasConflict) {
      throw new ConflictError(`Staff member ${newStaffId} has a conflicting appointment during this time window`);
    }

    await prisma.appointmentItem.updateMany({
      where: { id: itemId, appointmentId: targetAppointment.id, tenantId },
      data: { staffId: newStaffId },
    });

    const updated = await this.findById(tenantId, targetAppointment.id);
    if (!updated) throw new NotFoundError('Appointment not found');
    return updated;
  }
}

export const appointmentRepository = new AppointmentRepository();
