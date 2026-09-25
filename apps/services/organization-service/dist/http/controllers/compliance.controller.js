import { OrganizationService } from '../../application/services/organization.service';
const organizationService = new OrganizationService();
export class ComplianceController {
    static async listRequirements(req, res, next) {
        try {
            const tenantId = req.query.tenantId || req.headers['x-tenant-id'];
            const reqs = await organizationService.getComplianceRequirements(tenantId);
            res.status(200).json({
                success: true,
                data: reqs,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async createRequirement(req, res, next) {
        try {
            const tenantId = req.query.tenantId || req.headers['x-tenant-id'] || req.body.tenantId;
            const reqItem = await organizationService.createComplianceRequirement({
                ...req.body,
                tenantId,
            });
            res.status(201).json({
                success: true,
                data: reqItem,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteRequirement(req, res, next) {
        try {
            const { id } = req.params;
            const result = await organizationService.deleteComplianceRequirement(id);
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
}
