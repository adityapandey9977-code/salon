import { NotFoundError, UnauthorizedError } from '@salon-spa-saas/common-types';
import { customerService } from '../../application/services/customer.service';
export class InternalController {
    async getCustomerSummary(req, res) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId)
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        const customer = await customerService.getCustomerDetail(tenantId, req.params.id);
        if (!customer)
            throw new NotFoundError('Customer not found');
        res.json({
            success: true,
            data: {
                id: customer.id,
                tenantId: customer.tenantId,
                customerCode: customer.customerCode,
                displayName: customer.displayName,
                firstName: customer.firstName,
                lastName: customer.lastName,
                mobilePhone: customer.mobilePhone,
                email: customer.email,
                status: customer.status,
                preferredBranchId: customer.preferredBranchId,
                preferredStaffId: customer.preferences?.preferredStaffId,
                cautions: customer.cautions,
            },
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async lookupByMobile(req, res) {
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        if (!tenantId)
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        const mobile = req.query.mobile;
        if (!mobile)
            throw new UnauthorizedError('Mobile query parameter required');
        const customer = await customerService.lookupByMobile(tenantId, mobile);
        res.json({
            success: true,
            data: customer,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async recordVisit(req, res) {
        const tenantId = req.headers['x-tenant-id'] ||
            req.query.tenantId ||
            req.body?.tenantId;
        if (!tenantId)
            throw new UnauthorizedError('Tenant ID header/query parameter required');
        const customerId = req.params.id;
        const amount = Number(req.body.amount || 0);
        const visitDate = req.body.visitDate ? new Date(req.body.visitDate) : new Date();
        const updated = await customerService.recordVisit(tenantId, customerId, amount, visitDate);
        res.json({
            success: true,
            data: updated,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const internalController = new InternalController();
