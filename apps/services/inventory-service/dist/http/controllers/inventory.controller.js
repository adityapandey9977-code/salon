import { SkuService } from '../../application/services/sku.service';
import { StockService } from '../../application/services/stock.service';
import { TransferService } from '../../application/services/transfer.service';
import { ConsumptionService } from '../../application/services/consumption.service';
const skuService = new SkuService();
const stockService = new StockService();
const transferService = new TransferService();
const consumptionService = new ConsumptionService();
export class InventoryController {
    static getTenantId(req) {
        const tenantId = req.user?.tenantId ||
            req.auth?.tenantId ||
            req.headers['x-tenant-id'] ||
            'a0000000-0000-0000-0000-000000000001';
        return tenantId;
    }
    // Dashboard KPIs
    static async getDashboardKpis(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const branchId = req.query.branchId;
            const kpis = await stockService.getDashboardKpis(tenantId, branchId);
            res.json({ success: true, data: kpis });
        }
        catch (err) {
            next(err);
        }
    }
    // SKUs
    static async listSkus(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const categoryId = req.query.categoryId;
            const isRetail = req.query.isRetail !== undefined ? req.query.isRetail === 'true' : undefined;
            const isConsumable = req.query.isConsumable !== undefined ? req.query.isConsumable === 'true' : undefined;
            const search = req.query.search;
            const skus = await skuService.listSkus(tenantId, { categoryId, isRetail, isConsumable, search });
            res.json({ success: true, data: skus });
        }
        catch (err) {
            next(err);
        }
    }
    static async getSkuById(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const sku = await skuService.getSkuById(tenantId, req.params.id);
            res.json({ success: true, data: sku });
        }
        catch (err) {
            next(err);
        }
    }
    static async createSku(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const sku = await skuService.createSku(tenantId, req.body);
            res.status(201).json({ success: true, data: sku });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateSku(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const sku = await skuService.updateSku(tenantId, req.params.id, req.body);
            res.json({ success: true, data: sku });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteSku(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const result = await skuService.deleteSku(tenantId, req.params.id);
            res.json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    // Categories
    static async listCategories(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const categories = await skuService.listCategories(tenantId);
            res.json({ success: true, data: categories });
        }
        catch (err) {
            next(err);
        }
    }
    static async createCategory(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const category = await skuService.createCategory(tenantId, req.body);
            res.status(201).json({ success: true, data: category });
        }
        catch (err) {
            next(err);
        }
    }
    // Stock
    static async listStock(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const branchId = req.query.branchId;
            const stock = await stockService.listStock(tenantId, branchId);
            res.json({ success: true, data: stock });
        }
        catch (err) {
            next(err);
        }
    }
    static async getBranchStock(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const branchId = (req.query.branchId || req.params.branchId);
            const stock = await stockService.listStock(tenantId, branchId);
            res.json({ success: true, data: stock });
        }
        catch (err) {
            next(err);
        }
    }
    static async getBranchAlerts(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const branchId = req.query.branchId;
            const alerts = await stockService.getBranchAlerts(tenantId, branchId);
            res.json({ success: true, data: alerts });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCriticalAlerts(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const alerts = await stockService.getCriticalAlerts(tenantId);
            res.json({ success: true, data: alerts });
        }
        catch (err) {
            next(err);
        }
    }
    // Transfers
    static async listTransfers(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const status = req.query.status;
            const sourceBranchId = req.query.sourceBranchId;
            const destinationBranchId = req.query.destinationBranchId;
            const transfers = await transferService.listTransfers(tenantId, { status, sourceBranchId, destinationBranchId });
            res.json({ success: true, data: transfers });
        }
        catch (err) {
            next(err);
        }
    }
    static async createTransfer(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const transfer = await transferService.createTransfer(tenantId, req.body);
            res.status(201).json({ success: true, data: transfer });
        }
        catch (err) {
            next(err);
        }
    }
    static async dispatchTransfer(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const actorUserId = req.user?.id || req.auth?.userId;
            const updated = await transferService.dispatchTransfer(tenantId, req.params.id, {
                ...req.body,
                actorUserId,
            });
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    static async receiveTransfer(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const actorUserId = req.user?.id || req.auth?.userId;
            const updated = await transferService.receiveTransfer(tenantId, req.params.id, {
                ...req.body,
                actorUserId,
            });
            res.json({ success: true, data: updated });
        }
        catch (err) {
            next(err);
        }
    }
    // Consumption History
    static async getConsumption(req, res, next) {
        try {
            const tenantId = InventoryController.getTenantId(req);
            const branchId = req.query.branchId;
            const skuId = req.query.skuId;
            const history = await consumptionService.listConsumptionHistory(tenantId, { branchId, skuId });
            res.json({ success: true, data: history });
        }
        catch (err) {
            next(err);
        }
    }
}
