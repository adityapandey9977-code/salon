import { NotFoundError, ValidationError } from '@salon-spa-saas/common-types';
import { commerceClient } from '../../infrastructure/clients/commerce.client';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { staffSkillRepository } from '../../infrastructure/repositories/staff-skill.repository';
export class StaffSkillService {
    async getStaffSkills(tenantId, employeeId) {
        return peopleReadStore.getEmployeeSkills(tenantId, employeeId, async () => {
            return staffSkillRepository.findSkillsByEmployee(tenantId, employeeId);
        });
    }
    async addSkill(tenantId, employeeId, data, addedByUserId) {
        const employee = await employeeRepository.findById(tenantId, employeeId);
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }
        const serviceValidation = await commerceClient.validateServiceId(tenantId, data.serviceId);
        if (!serviceValidation.isValid) {
            throw new ValidationError('Invalid service reference for skill');
        }
        const skill = await staffSkillRepository.addSkill({
            tenantId,
            employeeId,
            serviceId: data.serviceId,
            skillLevel: data.skillLevel,
            yearsExperience: data.yearsExperience,
            isPrimary: data.isPrimary,
            isActive: data.isActive,
        });
        await peopleReadStore.invalidateEmployeeSkills(tenantId, employeeId);
        await eventPublisher.publishEvent({
            eventType: 'StaffSkillUpdated',
            aggregateType: 'Employee',
            aggregateId: employeeId,
            tenantId,
            userId: addedByUserId,
            payload: {
                tenantId,
                employeeId,
                serviceId: data.serviceId,
                skillLevel: skill.skillLevel,
                updatedAt: new Date().toISOString(),
            },
        });
        return skill;
    }
    async updateSkill(tenantId, employeeId, skillId, data) {
        const existing = await staffSkillRepository.findSkillById(tenantId, skillId);
        if (!existing || existing.employeeId !== employeeId) {
            throw new NotFoundError('Staff skill not found');
        }
        const updated = await staffSkillRepository.updateSkill(tenantId, skillId, {
            skillLevel: data.skillLevel,
            yearsExperience: data.yearsExperience,
            isPrimary: data.isPrimary,
            isActive: data.isActive,
        });
        await peopleReadStore.invalidateEmployeeSkills(tenantId, employeeId);
        return updated;
    }
    async removeSkill(tenantId, employeeId, skillId) {
        const existing = await staffSkillRepository.findSkillById(tenantId, skillId);
        if (!existing || existing.employeeId !== employeeId) {
            throw new NotFoundError('Staff skill not found');
        }
        const removed = await staffSkillRepository.removeSkill(tenantId, skillId);
        await peopleReadStore.invalidateEmployeeSkills(tenantId, employeeId);
        return removed;
    }
}
export const staffSkillService = new StaffSkillService();
