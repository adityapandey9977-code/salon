import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '@salon-spa-saas/common-types';
import { CreateTenantRequestSchema } from '@salon-spa-saas/contracts';
import { OrganizationService } from '../../application/services/organization.service';

const organizationService = new OrganizationService();

export class TenantController {
  public static async getDnsInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await organizationService.getDnsInfo(req);
      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async listTenants(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenants = await organizationService.getTenants();
      res.status(200).json({
        success: true,
        data: tenants,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getTenantById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const tenant = await organizationService.getTenantById(id);
      if (!tenant) {
        throw new NotFoundError(`Tenant with ID ${id} not found`);
      }
      res.status(200).json({
        success: true,
        data: tenant,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = CreateTenantRequestSchema.parse(req.body);
      const tenant = await organizationService.createTenant(body);
      res.status(201).json({
        success: true,
        data: tenant,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const tenant = await organizationService.updateTenant(id, req.body as any);
      res.status(200).json({
        success: true,
        data: tenant,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async deleteTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      await organizationService.deleteTenant(id);
      res.status(200).json({
        success: true,
        data: { message: 'Tenant deleted successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async reprovisionCredentials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const result = await organizationService.reprovisionCredentials(id);
      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getInternalTenant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const tenant = await organizationService.getTenantById(id);
      if (!tenant) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: `Tenant with ID ${id} not found` },
          timestamp: new Date().toISOString(),
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: {
          id: tenant.id,
          code: tenant.code,
          slug: tenant.slug,
          salonName: tenant.salonName || tenant.tradeName,
          legalName: tenant.legalName,
          tradeName: tenant.tradeName,
          businessEmail: tenant.businessEmail,
          status: tenant.status,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
