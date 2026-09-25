import { NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import type {
  AssignStaffBranchRequest,
  UpdateStaffBranchAssignmentRequest,
} from '@salon-spa-saas/contracts';
import type { CachedBranchStaffAssignment } from '../../domain/entities/staff.dto';
import { organizationClient } from '../../infrastructure/clients/organization.client';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { staffBranchRepository } from '../../infrastructure/repositories/staff-branch.repository';

export class StaffBranchService {
  public async getStaffBranches(
    tenantId: string,
    employeeId: string,
  ): Promise<CachedBranchStaffAssignment[]> {
    return peopleReadStore.getEmployeeBranches(tenantId, employeeId, async () => {
      return staffBranchRepository.findAssignmentsByEmployee(tenantId, employeeId);
    });
  }

  public async assignBranch(
    tenantId: string,
    employeeId: string,
    data: AssignStaffBranchRequest,
    assignedByUserId?: string | null,
  ): Promise<CachedBranchStaffAssignment> {
    const employee = await employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    // Validate branch exists and belongs to the authenticated tenant
    const branchValidation = await organizationClient.validateBranch(tenantId, data.branchId);
    if (!branchValidation.isValid) {
      throw new ValidationError(branchValidation.reason || 'Invalid branch for this tenant');
    }

    const assignment = await staffBranchRepository.assignBranch({
      tenantId,
      employeeId,
      branchId: data.branchId,
      isPrimary: data.isPrimary,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : new Date(),
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
      status: data.status,
    });

    await peopleReadStore.invalidateBranchAssignments(tenantId, employeeId, data.branchId);

    await eventPublisher.publishEvent({
      eventType: 'StaffBranchAssigned',
      aggregateType: 'Employee',
      aggregateId: employeeId,
      tenantId,
      userId: assignedByUserId,
      payload: {
        tenantId,
        employeeId,
        branchId: data.branchId,
        isPrimary: assignment.isPrimary,
        assignedAt: new Date().toISOString(),
      },
    });

    return assignment;
  }

  public async updateAssignment(
    tenantId: string,
    employeeId: string,
    assignmentId: string,
    data: UpdateStaffBranchAssignmentRequest,
  ): Promise<CachedBranchStaffAssignment> {
    const existing = await staffBranchRepository.findAssignmentById(tenantId, assignmentId);
    if (!existing || existing.employeeId !== employeeId) {
      throw new NotFoundError('Branch assignment not found');
    }

    const updated = await staffBranchRepository.updateAssignment(tenantId, assignmentId, {
      isPrimary: data.isPrimary,
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : undefined,
      status: data.status,
    });

    await peopleReadStore.invalidateBranchAssignments(tenantId, employeeId, existing.branchId);

    return updated;
  }

  public async removeAssignment(
    tenantId: string,
    employeeId: string,
    assignmentId: string,
    removedByUserId?: string | null,
  ): Promise<CachedBranchStaffAssignment> {
    const existing = await staffBranchRepository.findAssignmentById(tenantId, assignmentId);
    if (!existing || existing.employeeId !== employeeId) {
      throw new NotFoundError('Branch assignment not found');
    }

    const removed = await staffBranchRepository.removeAssignment(tenantId, assignmentId);

    await peopleReadStore.invalidateBranchAssignments(tenantId, employeeId, existing.branchId);

    await eventPublisher.publishEvent({
      eventType: 'StaffBranchRemoved',
      aggregateType: 'Employee',
      aggregateId: employeeId,
      tenantId,
      userId: removedByUserId,
      payload: {
        tenantId,
        employeeId,
        branchId: existing.branchId,
        removedAt: new Date().toISOString(),
      },
    });

    return removed;
  }
}

export const staffBranchService = new StaffBranchService();
