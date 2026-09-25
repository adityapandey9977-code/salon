import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { AddStaffSkillRequestSchema, UpdateStaffSkillRequestSchema, } from '@salon-spa-saas/contracts';
import { staffSkillService } from '../../application/services/staff-skill.service';
export class SkillController {
    async getStaffSkills(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await staffSkillService.getStaffSkills(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async addSkill(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = AddStaffSkillRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await staffSkillService.addSkill(tenantId, req.params.id, body, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateSkill(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateStaffSkillRequestSchema.parse(req.body);
        const result = await staffSkillService.updateSkill(tenantId, req.params.id, req.params.skillId, body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async removeSkill(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await staffSkillService.removeSkill(tenantId, req.params.id, req.params.skillId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const skillController = new SkillController();
