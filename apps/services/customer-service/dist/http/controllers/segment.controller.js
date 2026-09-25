import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateCustomerSegmentRequestSchema } from '@salon-spa-saas/contracts';
import { segmentService } from '../../application/services/segment.service';
export class SegmentController {
    async listSegments(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await segmentService.getSegments(tenantId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async getSegmentById(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await segmentService.getSegmentById(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createSegment(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateCustomerSegmentRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await segmentService.createSegment(tenantId, body, userId, correlationId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
    async addMember(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const customerId = req.body.customerId;
        await segmentService.addMember(tenantId, req.params.id, customerId);
        res.json({
            success: true,
            data: { message: 'Member added to segment' },
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async removeMember(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        await segmentService.removeMember(tenantId, req.params.id, req.params.customerId);
        res.json({
            success: true,
            data: { message: 'Member removed from segment' },
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const segmentController = new SegmentController();
