import { CreateCustomerRequestSchema, QueryCustomersRequestSchema, UpdateCustomerRequestSchema, } from '@salon-spa-saas/contracts';
import { customerService } from '../../application/services/customer.service';
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
export class CustomerController {
    getTenantId(req) {
        const id = req.auth?.tenantId ||
            req.headers['x-tenant-id'] ||
            req.query?.tenantId ||
            req.body?.tenantId;
        return id || DEFAULT_TENANT_ID;
    }
    async listCustomers(req, res) {
        const tenantId = this.getTenantId(req);
        const query = QueryCustomersRequestSchema.parse(req.query);
        // Scoping resolution:
        // If franchiseId is in token/auth, strictly enforce it, otherwise allow query param
        const effectiveFranchiseId = req.auth?.franchiseId || query.franchiseId;
        const effectiveBranchId = req.auth?.branchIds && req.auth.branchIds.length > 0 ? req.auth.branchIds[0] : query.branchId;
        const result = await customerService.listCustomers(tenantId, {
            ...query,
            ...(effectiveFranchiseId ? { franchiseId: effectiveFranchiseId } : {}),
            ...(effectiveBranchId ? { branchId: effectiveBranchId } : {}),
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
    async getCustomerById(req, res) {
        const tenantId = this.getTenantId(req);
        const result = await customerService.getCustomerDetail(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createCustomer(req, res) {
        const tenantId = this.getTenantId(req);
        const body = CreateCustomerRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        // Scoping enforcement: if franchise is in auth context or header, apply it
        const effectiveFranchiseId = req.auth?.franchiseId || body.franchiseId || req.headers['x-franchise-id'] || null;
        // Branch scoping enforcement: if preferredBranchId is provided, use it; otherwise fallback to auth context branchIds or x-branch-id header
        const effectiveBranchId = body.preferredBranchId ||
            (req.auth?.branchIds && req.auth.branchIds.length > 0 ? req.auth.branchIds[0] : null) ||
            req.headers['x-branch-id'] ||
            null;
        const result = await customerService.createCustomer(tenantId, {
            ...body,
            preferredBranchId: effectiveBranchId,
            franchiseId: effectiveFranchiseId,
        }, userId, correlationId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
    async updateCustomer(req, res) {
        const tenantId = this.getTenantId(req);
        const body = UpdateCustomerRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const correlationId = req.headers['x-correlation-id'];
        const result = await customerService.updateCustomer(tenantId, req.params.id, body, userId, correlationId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId },
        });
    }
    async deleteCustomer(req, res) {
        const tenantId = this.getTenantId(req);
        const userId = req.auth?.userId || null;
        const deleteReason = req.body?.reason;
        const correlationId = req.headers['x-correlation-id'];
        await customerService.softDeleteCustomer(tenantId, req.params.id, userId, deleteReason, correlationId);
        res.json({
            success: true,
            data: { message: 'Customer archived successfully' },
            meta: { correlationId },
        });
    }
    async getDormant(req, res) {
        const tenantId = this.getTenantId(req);
        const result = await customerService.getDormantCustomers(tenantId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async recordVisit(req, res) {
        const tenantId = this.getTenantId(req);
        const customerId = req.params.id;
        const amount = Number(req.body.amount || 0);
        const visitDate = req.body.visitDate ? new Date(req.body.visitDate) : new Date();
        const result = await customerService.recordVisit(tenantId, customerId, amount, visitDate);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const customerController = new CustomerController();
