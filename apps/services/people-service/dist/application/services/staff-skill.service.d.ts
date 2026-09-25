import type { AddStaffSkillRequest, UpdateStaffSkillRequest } from '@salon-spa-saas/contracts';
import type { CachedStaffSkill } from '../../domain/entities/staff.dto';
export declare class StaffSkillService {
    getStaffSkills(tenantId: string, employeeId: string): Promise<CachedStaffSkill[]>;
    addSkill(tenantId: string, employeeId: string, data: AddStaffSkillRequest, addedByUserId?: string | null): Promise<CachedStaffSkill>;
    updateSkill(tenantId: string, employeeId: string, skillId: string, data: UpdateStaffSkillRequest): Promise<CachedStaffSkill>;
    removeSkill(tenantId: string, employeeId: string, skillId: string): Promise<CachedStaffSkill>;
}
export declare const staffSkillService: StaffSkillService;
//# sourceMappingURL=staff-skill.service.d.ts.map