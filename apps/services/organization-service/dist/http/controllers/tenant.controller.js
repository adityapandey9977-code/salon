import { NotFoundError } from '@salon-spa-saas/common-types';
import { CreateTenantRequestSchema } from '@salon-spa-saas/contracts';
import { OrganizationService } from '../../application/services/organization.service';
const organizationService = new OrganizationService();
export class TenantController {
    static async getDnsInfo(req, res, next) {
        try {
            const data = await organizationService.getDnsInfo(req);
            res.status(200).json({
                success: true,
                data,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async listTenants(_req, res, next) {
        try {
            const tenants = await organizationService.getTenants();
            res.status(200).json({
                success: true,
                data: tenants,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getTenantById(req, res, next) {
        try {
            const { id } = req.params;
            const tenant = await organizationService.getTenantById(id);
            if (!tenant) {
                throw new NotFoundError(`Tenant with ID ${id} not found`);
            }
            res.status(200).json({
                success: true,
                data: tenant,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async createTenant(req, res, next) {
        try {
            const body = CreateTenantRequestSchema.parse(req.body);
            const tenant = await organizationService.createTenant(body);
            res.status(201).json({
                success: true,
                data: tenant,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateTenant(req, res, next) {
        try {
            const { id } = req.params;
            const tenant = await organizationService.updateTenant(id, req.body);
            res.status(200).json({
                success: true,
                data: tenant,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteTenant(req, res, next) {
        try {
            const { id } = req.params;
            await organizationService.deleteTenant(id);
            res.status(200).json({
                success: true,
                data: { message: 'Tenant deleted successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async reprovisionCredentials(req, res, next) {
        try {
            const { id } = req.params;
            const result = await organizationService.reprovisionCredentials(id);
            res.status(200).json({
                success: true,
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getInternalTenant(req, res, next) {
        try {
            const { id } = req.params;
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
        }
        catch (err) {
            next(err);
        }
    }
}
