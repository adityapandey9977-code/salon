import type { NextFunction, Request, Response } from 'express';
import { createSuccessResponse } from '@salon-spa-saas/common-types';
import {
  CreateBranchRequestSchema,
  CreateResourceRequestSchema,
  UpdateResourceRequestSchema,
} from '@salon-spa-saas/contracts';
import { OrganizationService } from '../../application/services/organization.service';

const orgService = new OrganizationService();

export class BranchController {
  public static async listBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || null;
      const franchiseId = (req.headers['x-franchise-id'] as string) || (req.query.franchiseId as string) || null;
      const branches = await orgService.getBranches(tenantId, franchiseId);
      res.status(200).json(createSuccessResponse(branches));
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { franchiseId } = req.params as { franchiseId: string };
      const branches = await orgService.getBranches(null, franchiseId);
      res.status(200).json(createSuccessResponse(branches));
    } catch (err) {
      next(err);
    }
  }

  public static async getBranchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId } = req.params as { branchId: string };
      const branch = await orgService.getBranchById(branchId);
      res.status(200).json(createSuccessResponse(branch));
    } catch (err) {
      next(err);
    }
  }

  public static async createBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId =
        (req.headers['x-tenant-id'] as string) ||
        (req.body?.tenantId as string) ||
        (req.query?.tenantId as string) ||
        '';
      const body = CreateBranchRequestSchema.parse(req.body);
      const branch = await orgService.createBranch(tenantId, {
        ...body,
        franchiseId: req.body?.franchiseId || req.body?.franchisePartnerId,
        franchisePartnerId: req.body?.franchisePartnerId || req.body?.franchiseId,
        franchisePartnerName: req.body?.franchisePartnerName,
      });
      res.status(201).json(createSuccessResponse(branch, 'Branch created successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async updateBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId } = req.params as { branchId: string };
      const branch = await orgService.updateBranch(branchId, req.body);
      res.status(200).json(createSuccessResponse(branch, 'Branch updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async deleteBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId } = req.params as { branchId: string };
      await orgService.deleteBranch(branchId);
      res.status(200).json(createSuccessResponse({ success: true }, 'Branch deleted successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async getOperatingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId } = req.params as { branchId: string };
      const hours = await orgService.getOperatingHours(branchId);
      res.status(200).json(createSuccessResponse(hours));
    } catch (err) {
      next(err);
    }
  }

  public static async updateOperatingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId } = req.params as { branchId: string };
      const schedules = req.body.schedules || req.body;
      const hours = await orgService.updateOperatingHours(branchId, schedules);
      res.status(200).json(createSuccessResponse(hours, 'Operating hours updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async getHolidays(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || null;
      const branchId = (req.query.branchId as string) || null;
      const holidays = await orgService.getHolidays(tenantId, branchId);
      res.status(200).json(createSuccessResponse(holidays));
    } catch (err) {
      next(err);
    }
  }

  public static async createHoliday(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { branchId } = req.params as { branchId: string };
      const holiday = await orgService.createHoliday(branchId, req.body);
      res.status(201).json(createSuccessResponse(holiday, 'Holiday created successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async deleteHoliday(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { holidayId } = req.params as { holidayId: string };
      await orgService.deleteHoliday(holidayId);
      res.status(200).json(createSuccessResponse({ success: true }, 'Holiday deleted successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchises(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAll = req.query.all === 'true' || req.query.all === '1';
      const tenantId = isAll
        ? null
        : ((req.query.tenantId as string) || (req.headers['x-tenant-id'] as string) || null);

      if (!isAll && !tenantId) {
        res.status(200).json(createSuccessResponse([]));
        return;
      }

      const franchises = await orgService.getFranchisePartners(tenantId);
      res.status(200).json(createSuccessResponse(franchises));
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { franchiseId } = req.params as { franchiseId: string };
      const franchise = await orgService.getFranchisePartnerById(franchiseId);
      res.status(200).json(createSuccessResponse(franchise));
    } catch (err) {
      next(err);
    }
  }

  public static async createFranchise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId =
        (req.headers['x-tenant-id'] as string) ||
        req.body.tenantId ||
        'f77a407a-45c1-4b8a-a08d-703bf7eeaea5';
      const franchise = await orgService.createFranchisePartner(tenantId, req.body);
      res.status(201).json(createSuccessResponse(franchise, 'Franchise partner created successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async updateFranchise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { franchiseId } = req.params as { franchiseId: string };
      const updated = await orgService.updateFranchisePartner(franchiseId, req.body);
      res.status(200).json(createSuccessResponse(updated, 'Franchise partner updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async listResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || null;
      const branchId = (req.query.branchId as string) || null;
      const resources = await orgService.getResources(tenantId, branchId);
      res.status(200).json(createSuccessResponse(resources));
    } catch (err) {
      next(err);
    }
  }

  public static async createResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = CreateResourceRequestSchema.parse(req.body);
      const resource = await orgService.createResource(body);
      res.status(201).json(createSuccessResponse(resource, 'Resource created successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async updateResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resourceId } = req.params as { resourceId: string };
      const body = UpdateResourceRequestSchema.parse(req.body);
      const resource = await orgService.updateResource(resourceId, body);
      res.status(200).json(createSuccessResponse(resource, 'Resource updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  public static async deleteResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resourceId } = req.params as { resourceId: string };
      await orgService.deleteResource(resourceId);
      res.status(200).json(createSuccessResponse({ success: true }, 'Resource deleted successfully'));
    } catch (err) {
      next(err);
    }
  }
}
