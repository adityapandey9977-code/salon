import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CreateServiceCategoryRequestSchema,
  CreateServiceRecipeRequestSchema,
  CreateServiceRequestSchema,
  QueryServicesRequestSchema,
  SetBranchPriceRequestSchema,
  UpdateServiceCategoryRequestSchema,
  UpdateServiceRequestSchema,
} from '@salon-spa-saas/contracts';
import type { NextFunction, Request, Response } from 'express';
import { catalogueService } from '../../application/services/catalogue.service';

export class ServiceController {
  // Categories
  public async listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const result = await catalogueService.listCategories(tenantId);
      res.json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const body = CreateServiceCategoryRequestSchema.parse(req.body);
      const result = await catalogueService.createCategory(tenantId, body);

      res.status(201).json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const body = UpdateServiceCategoryRequestSchema.parse(req.body);
      const result = await catalogueService.updateCategory(tenantId, req.params.id as string, body);

      res.json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      await catalogueService.deleteCategory(tenantId, req.params.id as string);

      res.json({
        success: true,
        data: { message: 'Category deleted successfully' },
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  // Services
  public async listServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const query = QueryServicesRequestSchema.parse(req.query);
      const result = await catalogueService.listServices(tenantId, query);

      res.json({
        success: true,
        data: result.items,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
          correlationId: req.headers['x-correlation-id'],
        },
      });
    } catch (err) {
      next(err);
    }
  }

  public async getServiceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const result = await catalogueService.getServiceDetail(tenantId, req.params.id as string);

      res.json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async createService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const body = CreateServiceRequestSchema.parse(req.body);
      const userId = req.auth?.userId || null;
      const correlationId = req.headers['x-correlation-id'] as string | undefined;

      const result = await catalogueService.createService(tenantId, body, userId, correlationId);

      res.status(201).json({
        success: true,
        data: result,
        meta: { correlationId },
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const body = UpdateServiceRequestSchema.parse(req.body);
      const userId = req.auth?.userId || null;
      const correlationId = req.headers['x-correlation-id'] as string | undefined;

      const result = await catalogueService.updateService(
        tenantId,
        req.params.id as string,
        body,
        userId,
        correlationId,
      );

      res.json({
        success: true,
        data: result,
        meta: { correlationId },
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteService(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const userId = req.auth?.userId || null;
      const correlationId = req.headers['x-correlation-id'] as string | undefined;

      await catalogueService.deleteService(tenantId, req.params.id as string, userId, correlationId);

      res.json({
        success: true,
        data: { message: 'Service deleted successfully' },
        meta: { correlationId },
      });
    } catch (err) {
      next(err);
    }
  }

  public async setBranchPrice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const body = SetBranchPriceRequestSchema.parse(req.body);
      const userId = req.auth?.userId || null;
      const correlationId = req.headers['x-correlation-id'] as string | undefined;

      await catalogueService.setBranchPrice(
        tenantId,
        req.params.id as string,
        body,
        userId,
        correlationId,
      );

      res.json({
        success: true,
        data: { message: 'Branch pricing updated successfully' },
        meta: { correlationId },
      });
    } catch (err) {
      next(err);
    }
  }

  public async setRecipe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const body = CreateServiceRecipeRequestSchema.parse(req.body);
      const userId = req.auth?.userId || null;
      const correlationId = req.headers['x-correlation-id'] as string | undefined;

      await catalogueService.setRecipe(
        tenantId,
        req.params.id as string,
        body,
        userId,
        correlationId,
      );

      res.json({
        success: true,
        data: { message: 'Service recipe/BOM updated successfully' },
        meta: { correlationId },
      });
    } catch (err) {
      next(err);
    }
  }

  // Skills
  public async listSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId =
        (req.query.tenantId as string) || req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const result = await catalogueService.listSkills(tenantId);
      res.json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async seedSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const result = await catalogueService.seedSkills(tenantId);
      res.status(201).json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const { code, name, categoryId, categoryName, description, status } = req.body;
      if (!name || !code) {
        res.status(400).json({ success: false, error: { message: 'Skill name and code are required' } });
        return;
      }

      const result = await catalogueService.createSkill(tenantId, {
        code,
        name,
        categoryId,
        categoryName,
        description,
        status,
      });

      res.status(201).json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      const result = await catalogueService.updateSkill(tenantId, req.params.id as string, req.body);
      res.json({
        success: true,
        data: result,
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }

  public async deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
      if (!tenantId) throw new UnauthorizedError('Tenant context required');

      await catalogueService.deleteSkill(tenantId, req.params.id as string);
      res.json({
        success: true,
        data: { message: 'Skill deleted successfully' },
        meta: { correlationId: req.headers['x-correlation-id'] },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const serviceController = new ServiceController();
