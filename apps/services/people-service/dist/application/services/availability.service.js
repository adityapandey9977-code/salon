import { NotFoundError } from '@salon-spa-saas/common-types';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { leaveRepository } from '../../infrastructure/repositories/leave.repository';
import { rosterRepository } from '../../infrastructure/repositories/roster.repository';
import { staffBranchRepository } from '../../infrastructure/repositories/staff-branch.repository';
import { staffSkillRepository } from '../../infrastructure/repositories/staff-skill.repository';
export class AvailabilityService {
    async getStaffAvailabilityContext(tenantId, employeeId, queryDate) {
        const employee = await employeeRepository.findById(tenantId, employeeId);
        if (!employee) {
            throw new NotFoundError('Employee not found');
        }
        const [branchAssignments, skills, rosterEntries, leaveEntries] = await Promise.all([
            staffBranchRepository.findAssignmentsByEmployee(tenantId, employeeId),
            staffSkillRepository.findSkillsByEmployee(tenantId, employeeId),
            rosterRepository.queryRoster({
                tenantId,
                employeeId,
                date: queryDate ? new Date(queryDate) : undefined,
            }),
            leaveRepository.queryLeaveRequests({
                tenantId,
                employeeId,
                status: 'APPROVED',
            }),
        ]);
        const isBookable = employee.employmentStatus === 'ACTIVE' &&
            (employee.profile?.isBookable ?? true) &&
            (employee.profile?.acceptsOnlineBooking ?? true);
        return {
            employeeId: employee.id,
            tenantId: employee.tenantId,
            displayName: employee.displayName,
            isBookable,
            employmentStatus: employee.employmentStatus,
            assignedBranchIds: branchAssignments
                .filter((b) => b.status === 'ACTIVE')
                .map((b) => b.branchId),
            roster: rosterEntries.map((r) => ({
                date: r.rosterDate,
                startAt: r.startAt,
                endAt: r.endAt,
                branchId: r.branchId,
                status: r.status,
            })),
            leaves: leaveEntries.items.map((l) => ({
                startDate: l.startDate,
                endDate: l.endDate,
                leaveType: l.leaveType,
                status: l.status,
            })),
            skills: skills.filter((s) => s.isActive).map((s) => s.serviceId),
        };
    }
    async getBookableStaffForBranch(tenantId, branchId, _date, serviceId) {
        const employeeIds = await staffBranchRepository.findEmployeesByBranch(tenantId, branchId);
        const result = [];
        for (const id of employeeIds) {
            const emp = await employeeRepository.findById(tenantId, id);
            if (emp && emp.employmentStatus === 'ACTIVE') {
                const skills = await staffSkillRepository.findSkillsByEmployee(tenantId, id);
                const activeSkillServiceIds = skills.filter((s) => s.isActive).map((s) => s.serviceId);
                if (serviceId && !activeSkillServiceIds.includes(serviceId)) {
                    continue;
                }
                const isBookable = (emp.profile?.isBookable ?? true) && (emp.profile?.acceptsOnlineBooking ?? true);
                result.push({
                    employeeId: emp.id,
                    displayName: emp.displayName,
                    jobTitle: emp.jobTitle,
                    isBookable,
                    skills: activeSkillServiceIds,
                });
            }
        }
        return result;
    }
}
export const availabilityService = new AvailabilityService();
