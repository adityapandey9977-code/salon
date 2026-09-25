import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CalculateTaxRequestSchema, CheckoutCartRequestSchema, RequestRefundSchema, } from '@salon-spa-saas/contracts';
import { billingService } from '../../application/services/billing.service';
export class BillingController {
    async calculateTax(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CalculateTaxRequestSchema.parse(req.body);
        const result = await billingService.calculateTax(tenantId, body);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async checkout(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CheckoutCartRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await billingService.checkout(tenantId, body, userId, correlationId);
        res.status(201).json({
            success: true,
            data: result.invoice,
            meta: { correlationId },
        });
    }
    async listInvoices(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const branchId = req.query.branchId;
        const customerId = req.query.customerId;
        const status = req.query.status;
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const result = await billingService.listInvoices(tenantId, {
            branchId,
            customerId,
            status,
            page,
            limit,
        });
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
    async getInvoiceById(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await billingService.getInvoiceById(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async requestRefund(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = RequestRefundSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await billingService.requestRefund(tenantId, body, userId, correlationId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
}
export const billingController = new BillingController();
