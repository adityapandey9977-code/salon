import { NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import { organizationClient } from '../../infrastructure/clients/organization.client';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { staffBranchRepository } from '../../infrastructure/repositories/staff-branch.repository';
export class StaffBranchService {
    async getStaffBranches(tenantId, employeeId) {
        return peopleReadStore.getEmployeeBranches(tenantId, employeeId, async () => {
            return staffBranchRepository.findAssignmentsByEmployee(tenantId, employeeId);
        });
    }
    async assignBranch(tenantId, employeeId, data, assignedByUserId) {
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
    async updateAssignment(tenantId, employeeId, assignmentId, data) {
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
    async removeAssignment(tenantId, employeeId, assignmentId, removedByUserId) {
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
