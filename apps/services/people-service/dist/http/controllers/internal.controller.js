import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { availabilityService } from '../../application/services/availability.service';
export class InternalController {
    async getStaffAvailabilityContext(req, res) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId) {
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        }
        const date = req.query.date;
        const result = await availabilityService.getStaffAvailabilityContext(tenantId, req.params.id, date);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getBookableStaffForBranch(req, res) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId) {
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        }
        const date = req.query.date;
        const serviceId = req.query.serviceId;
        const result = await availabilityService.getBookableStaffForBranch(tenantId, req.params.branchId, date, serviceId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const internalController = new InternalController();
