import { ProcurementService } from '../../application/services/procurement.service';
const procService = new ProcurementService();
export class ProcurementController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId || req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new Error('Tenant ID required');
        }
        return tenantId;
    }
    // Suppliers
    static async listSuppliers(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const branchId = req.query.branchId;
            const status = req.query.status;
            const suppliers = await procService.listSuppliers(tenantId, { branchId, status });
            res.json({ success: true, data: suppliers });
        }
        catch (err) {
            next(err);
        }
    }
    static async createSupplier(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const supplier = await procService.createSupplier(tenantId, req.body);
            res.status(201).json({ success: true, data: supplier });
        }
        catch (err) {
            next(err);
        }
    }
    // Purchase Orders
    static async listPurchaseOrders(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const status = req.query.status;
            const branchId = req.query.branchId;
            const supplierId = req.query.supplierId;
            const pos = await procService.listPurchaseOrders(tenantId, { status, branchId, supplierId });
            res.json({ success: true, data: pos });
        }
        catch (err) {
            next(err);
        }
    }
    static async getPoById(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const po = await procService.getPoById(tenantId, req.params.id);
            res.json({ success: true, data: po });
        }
        catch (err) {
            next(err);
        }
    }
    static async createPurchaseOrder(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const createdByUserId = req.user?.id || req.auth?.userId;
            const createdByPrincipalType = req.auth?.principalType || 'USER';
            const po = await procService.createPurchaseOrder(tenantId, {
                ...req.body,
                createdByUserId,
                createdByPrincipalType,
            });
            res.status(201).json({ success: true, data: po });
        }
        catch (err) {
            next(err);
        }
    }
    static async approvePurchaseOrder(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const approvedByUserId = req.user?.id || req.auth?.userId;
            const po = await procService.approvePurchaseOrder(tenantId, req.params.id, approvedByUserId);
            res.json({ success: true, data: po });
        }
        catch (err) {
            next(err);
        }
    }
    // Goods Receipt
    static async createGoodsReceipt(req, res, next) {
        try {
            const tenantId = ProcurementController.getTenantId(req);
            const receivedByUserId = req.user?.id || req.auth?.userId;
            const grn = await procService.receiveGoods(tenantId, {
                ...req.body,
                receivedByUserId,
            });
            res.status(201).json({ success: true, data: grn });
        }
        catch (err) {
            next(err);
        }
    }
}
