import type { CachedStaffSkill } from '../../domain/entities/staff.dto';
import { type SkillLevel } from '../prisma/generated-client';
export declare class StaffSkillRepository {
    private toDto;
    findSkillsByEmployee(tenantId: string, employeeId: string): Promise<CachedStaffSkill[]>;
    findSkill(tenantId: string, employeeId: string, serviceId: string): Promise<CachedStaffSkill | null>;
    findSkillById(tenantId: string, id: string): Promise<CachedStaffSkill | null>;
    addSkill(data: {
        tenantId: string;
        employeeId: string;
        serviceId: string;
        skillLevel?: SkillLevel;
        yearsExperience?: number | null;
        isPrimary?: boolean;
        isActive?: boolean;
    }): Promise<CachedStaffSkill>;
    updateSkill(tenantId: string, id: string, data: {
        skillLevel?: SkillLevel;
        yearsExperience?: number | null;
        isPrimary?: boolean;
        isActive?: boolean;
    }): Promise<CachedStaffSkill>;
    removeSkill(tenantId: string, id: string): Promise<CachedStaffSkill>;
}
export declare const staffSkillRepository: StaffSkillRepository;
//# sourceMappingURL=staff-skill.repository.d.ts.map