import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateServiceCategoryRequestSchema, CreateServiceRecipeRequestSchema, CreateServiceRequestSchema, QueryServicesRequestSchema, SetBranchPriceRequestSchema, UpdateServiceCategoryRequestSchema, UpdateServiceRequestSchema, } from '@salon-spa-saas/contracts';
import { catalogueService } from '../../application/services/catalogue.service';
export class ServiceController {
    // Categories
    async listCategories(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const result = await catalogueService.listCategories(tenantId);
            res.json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createCategory(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const body = CreateServiceCategoryRequestSchema.parse(req.body);
            const result = await catalogueService.createCategory(tenantId, body);
            res.status(201).json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updateCategory(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const body = UpdateServiceCategoryRequestSchema.parse(req.body);
            const result = await catalogueService.updateCategory(tenantId, req.params.id, body);
            res.json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            await catalogueService.deleteCategory(tenantId, req.params.id);
            res.json({
                success: true,
                data: { message: 'Category deleted successfully' },
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Services
    async listServices(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
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
        }
        catch (err) {
            next(err);
        }
    }
    async getServiceById(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const result = await catalogueService.getServiceDetail(tenantId, req.params.id);
            res.json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createService(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const body = CreateServiceRequestSchema.parse(req.body);
            const userId = req.auth?.userId || null;
            const correlationId = req.headers['x-correlation-id'];
            const result = await catalogueService.createService(tenantId, body, userId, correlationId);
            res.status(201).json({
                success: true,
                data: result,
                meta: { correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updateService(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const body = UpdateServiceRequestSchema.parse(req.body);
            const userId = req.auth?.userId || null;
            const correlationId = req.headers['x-correlation-id'];
            const result = await catalogueService.updateService(tenantId, req.params.id, body, userId, correlationId);
            res.json({
                success: true,
                data: result,
                meta: { correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteService(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const userId = req.auth?.userId || null;
            const correlationId = req.headers['x-correlation-id'];
            await catalogueService.deleteService(tenantId, req.params.id, userId, correlationId);
            res.json({
                success: true,
                data: { message: 'Service deleted successfully' },
                meta: { correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async setBranchPrice(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const body = SetBranchPriceRequestSchema.parse(req.body);
            const userId = req.auth?.userId || null;
            const correlationId = req.headers['x-correlation-id'];
            await catalogueService.setBranchPrice(tenantId, req.params.id, body, userId, correlationId);
            res.json({
                success: true,
                data: { message: 'Branch pricing updated successfully' },
                meta: { correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async setRecipe(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const body = CreateServiceRecipeRequestSchema.parse(req.body);
            const userId = req.auth?.userId || null;
            const correlationId = req.headers['x-correlation-id'];
            await catalogueService.setRecipe(tenantId, req.params.id, body, userId, correlationId);
            res.json({
                success: true,
                data: { message: 'Service recipe/BOM updated successfully' },
                meta: { correlationId },
            });
        }
        catch (err) {
            next(err);
        }
    }
    // Skills
    async listSkills(req, res, next) {
        try {
            const tenantId = req.query.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const result = await catalogueService.listSkills(tenantId);
            res.json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async seedSkills(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const result = await catalogueService.seedSkills(tenantId);
            res.status(201).json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createSkill(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
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
        }
        catch (err) {
            next(err);
        }
    }
    async updateSkill(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            const result = await catalogueService.updateSkill(tenantId, req.params.id, req.body);
            res.json({
                success: true,
                data: result,
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteSkill(req, res, next) {
        try {
            const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
            if (!tenantId)
                throw new UnauthorizedError('Tenant context required');
            await catalogueService.deleteSkill(tenantId, req.params.id);
            res.json({
                success: true,
                data: { message: 'Skill deleted successfully' },
                meta: { correlationId: req.headers['x-correlation-id'] },
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export const serviceController = new ServiceController();
