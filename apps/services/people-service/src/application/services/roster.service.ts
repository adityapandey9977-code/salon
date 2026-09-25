import { NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CreateRosterRequest,
  QueryRosterRequest,
  UpdateRosterRequest,
} from '@salon-spa-saas/contracts';
import type { CachedRosterAssignment } from '../../domain/entities/staff.dto';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { rosterRepository } from '../../infrastructure/repositories/roster.repository';

export class RosterService {
  public async queryRoster(
    tenantId: string,
    params: QueryRosterRequest,
  ): Promise<CachedRosterAssignment[]> {
    return rosterRepository.queryRoster({
      tenantId,
      branchId: params.branchId,
      employeeId: params.employeeId,
      date: params.date ? new Date(params.date) : undefined,
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
    });
  }

  public async getEmployeeRosterForDate(
    tenantId: string,
    employeeId: string,
    dateStr: string,
  ): Promise<CachedRosterAssignment | null> {
    return peopleReadStore.getEmployeeRoster(tenantId, employeeId, dateStr, async () => {
      return rosterRepository.findRosterByEmployeeAndDate(tenantId, employeeId, new Date(dateStr));
    });
  }

  public async createRoster(
    tenantId: string,
    data: CreateRosterRequest,
    assignedByUserId?: string | null,
  ): Promise<CachedRosterAssignment> {
    const employee = await employeeRepository.findById(tenantId, data.employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    const roster = await rosterRepository.createRoster({
      tenantId,
      employeeId: data.employeeId,
      branchId: data.branchId,
      shiftId: data.shiftId || null,
      rosterDate: new Date(data.rosterDate),
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
      status: data.status,
    });

    await peopleReadStore.invalidateRoster(tenantId, data.employeeId, data.rosterDate);

    await eventPublisher.publishEvent({
      eventType: 'RosterUpdated',
      aggregateType: 'Roster',
      aggregateId: roster.id,
      tenantId,
      userId: assignedByUserId,
      payload: {
        tenantId,
        employeeId: data.employeeId,
        branchId: data.branchId,
        rosterDate: data.rosterDate,
        status: roster.status,
        updatedAt: new Date().toISOString(),
      },
    });

    return roster;
  }

  public async updateRoster(
    tenantId: string,
    id: string,
    data: UpdateRosterRequest,
    updatedByUserId?: string | null,
  ): Promise<CachedRosterAssignment> {
    const existing = await rosterRepository.findRosterById(tenantId, id);
    if (!existing) {
      throw new NotFoundError('Roster assignment not found');
    }

    const updated = await rosterRepository.updateRoster(tenantId, id, {
      shiftId: data.shiftId,
      startAt: data.startAt ? new Date(data.startAt) : undefined,
      endAt: data.endAt ? new Date(data.endAt) : undefined,
      status: data.status,
    });

    await peopleReadStore.invalidateRoster(tenantId, existing.employeeId, existing.rosterDate);

    await eventPublisher.publishEvent({
      eventType: 'RosterUpdated',
      aggregateType: 'Roster',
      aggregateId: id,
      tenantId,
      userId: updatedByUserId,
      payload: {
        tenantId,
        employeeId: existing.employeeId,
        branchId: existing.branchId,
        rosterDate: existing.rosterDate,
        status: updated.status,
        updatedAt: new Date().toISOString(),
      },
    });

    return updated;
  }

  public async deleteRoster(tenantId: string, id: string): Promise<CachedRosterAssignment> {
    const existing = await rosterRepository.findRosterById(tenantId, id);
    if (!existing) {
      throw new NotFoundError('Roster assignment not found');
    }

    const deleted = await rosterRepository.deleteRoster(tenantId, id);

    await peopleReadStore.invalidateRoster(tenantId, existing.employeeId, existing.rosterDate);

    return deleted;
  }
}

export const rosterService = new RosterService();
