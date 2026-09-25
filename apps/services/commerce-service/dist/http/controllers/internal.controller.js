import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { catalogueService } from '../../application/services/catalogue.service';
export class InternalController {
    async getServiceBookingContext(req, res) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId)
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        const service = await catalogueService.getServiceDetail(tenantId, req.params.id);
        res.json({
            success: true,
            data: {
                id: service.id,
                tenantId: service.tenantId,
                code: service.code,
                name: service.name,
                durationMinutes: service.durationMinutes,
                bufferBeforeMinutes: service.bufferBeforeMinutes,
                bufferAfterMinutes: service.bufferAfterMinutes,
                basePrice: service.basePrice,
                gstRate: service.gstRate,
                requiresConsultation: service.requiresConsultation,
                requiresPatchTest: service.requiresPatchTest,
                isActive: service.isActive,
                isBookableOnline: service.isBookableOnline,
            },
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getBranchServicePrice(req, res) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId)
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        const result = await catalogueService.getBranchServicePrice(tenantId, req.params.serviceId, req.params.branchId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const internalController = new InternalController();
