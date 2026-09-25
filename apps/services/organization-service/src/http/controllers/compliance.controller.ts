import type { NextFunction, Request, Response } from 'express';
import { OrganizationService } from '../../application/services/organization.service';

const organizationService = new OrganizationService();

export class ComplianceController {
  public static async listRequirements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string);
      const reqs = await organizationService.getComplianceRequirements(tenantId);
      res.status(200).json({
        success: true,
        data: reqs,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createRequirement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.query.tenantId as string) || (req.headers['x-tenant-id'] as string) || req.body.tenantId;
      const reqItem = await organizationService.createComplianceRequirement({
        ...req.body,
        tenantId,
      });
      res.status(201).json({
        success: true,
        data: reqItem,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteRequirement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const result = await organizationService.deleteComplianceRequirement(id);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
