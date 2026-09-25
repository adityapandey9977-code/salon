import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { ConvertLeadRequestSchema, CreateLeadRequestSchema, UpdateLeadStatusRequestSchema, } from '@salon-spa-saas/contracts';
import { leadService } from '../../application/services/lead.service';
export class LeadController {
    async listLeads(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const status = req.query.status;
        const branchId = req.query.branchId;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const result = await leadService.listLeads(tenantId, { status, branchId, page, limit });
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
    async getLeadById(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await leadService.getLeadById(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createLead(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateLeadRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await leadService.createLead(tenantId, body, userId, correlationId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
    async updateStatus(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateLeadStatusRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await leadService.updateLeadStatus(tenantId, req.params.id, body, userId, correlationId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
    async convertLead(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = ConvertLeadRequestSchema.parse(req.body || {});
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await leadService.convertLead(tenantId, req.params.id, body, userId, correlationId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
}
export const leadController = new LeadController();
