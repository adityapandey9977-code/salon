import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreatePackageRequestSchema } from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { packageService } from '../../application/services/package.service';

export class PackageController {
  public async listPackages(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await packageService.listPackages(tenantId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getPackageById(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await packageService.getPackageById(tenantId, req.params.id as string);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createPackage(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CreatePackageRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await packageService.createPackage(tenantId, body, userId, correlationId);
    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async updatePackage(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await packageService.updatePackage(
      tenantId,
      req.params.id as string,
      req.body,
    );
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }


  public async listPackageUsage(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await packageService.listPackageUsage(tenantId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createPackageRedemption(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await packageService.createPackageRedemption(tenantId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async getPackagesAnalytics(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await packageService.getPackagesAnalytics(tenantId);
    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const packageController = new PackageController();
