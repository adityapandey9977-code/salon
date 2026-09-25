import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  AddStaffSkillRequestSchema,
  UpdateStaffSkillRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { staffSkillService } from '../../application/services/staff-skill.service';

export class SkillController {
  public async getStaffSkills(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await staffSkillService.getStaffSkills(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async addSkill(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = AddStaffSkillRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const result = await staffSkillService.addSkill(tenantId, req.params.id as string, body, userId);

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async updateSkill(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = UpdateStaffSkillRequestSchema.parse(req.body);
    const result = await staffSkillService.updateSkill(
      tenantId,
      req.params.id as string,
      req.params.skillId as string,
      body,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async removeSkill(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await staffSkillService.removeSkill(
      tenantId,
      req.params.id as string,
      req.params.skillId as string,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const skillController = new SkillController();
