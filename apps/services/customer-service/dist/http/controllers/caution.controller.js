import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateCustomerCautionRequestSchema, UpdateCustomerCautionRequestSchema, } from '@salon-spa-saas/contracts';
import { cautionService } from '../../application/services/caution.service';
export class CautionController {
    async getCautions(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await cautionService.getCautions(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async addCaution(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateCustomerCautionRequestSchema.parse(req.body);
        const result = await cautionService.addCaution(tenantId, req.params.id, body);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateCaution(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateCustomerCautionRequestSchema.parse(req.body);
        const result = await cautionService.updateCaution(tenantId, req.params.cautionId, body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const cautionController = new CautionController();
