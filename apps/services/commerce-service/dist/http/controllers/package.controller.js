import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreatePackageRequestSchema } from '@salon-spa-saas/contracts';
import { packageService } from '../../application/services/package.service';
export class PackageController {
    async listPackages(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await packageService.listPackages(tenantId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getPackageById(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await packageService.getPackageById(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createPackage(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreatePackageRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await packageService.createPackage(tenantId, body, userId, correlationId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
    async updatePackage(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await packageService.updatePackage(tenantId, req.params.id, req.body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async listPackageUsage(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await packageService.listPackageUsage(tenantId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createPackageRedemption(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await packageService.createPackageRedemption(tenantId, req.body);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getPackagesAnalytics(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await packageService.getPackagesAnalytics(tenantId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const packageController = new PackageController();
