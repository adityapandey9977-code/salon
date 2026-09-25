import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';
import { ProcurementController } from '../controllers/procurement.controller';
import { StocktakeController } from '../controllers/stocktake.controller';

const router: Router = Router();

// Dashboard & KPIs
router.get('/dashboard-kpis', InventoryController.getDashboardKpis);

// SKUs
router.get('/skus', InventoryController.listSkus);
router.post('/skus', InventoryController.createSku);
router.get('/skus/:id', InventoryController.getSkuById);
router.put('/skus/:id', InventoryController.updateSku);
router.patch('/skus/:id', InventoryController.updateSku);
router.delete('/skus/:id', InventoryController.deleteSku);

// Categories
router.get('/categories', InventoryController.listCategories);
router.post('/categories', InventoryController.createCategory);

// Stock & Alerts
router.get('/stock', InventoryController.listStock);
router.get('/branch-stock', InventoryController.getBranchStock);
router.get('/alerts/branch', InventoryController.getBranchAlerts);
router.get('/alerts/critical', InventoryController.getCriticalAlerts);

// Suppliers
router.get('/suppliers', ProcurementController.listSuppliers);
router.post('/suppliers', ProcurementController.createSupplier);

// Purchase Orders & GRN
router.get('/purchase-orders', ProcurementController.listPurchaseOrders);
router.post('/purchase-orders', ProcurementController.createPurchaseOrder);
router.get('/purchase-orders/:id', ProcurementController.getPoById);
router.post('/purchase-orders/:id/approve', ProcurementController.approvePurchaseOrder);
router.post('/goods-receipt', ProcurementController.createGoodsReceipt);

// Inter-branch Transfers
router.get('/transfers', InventoryController.listTransfers);
router.post('/transfers', InventoryController.createTransfer);
router.post('/transfers/:id/dispatch', InventoryController.dispatchTransfer);
router.post('/transfers/:id/receive', InventoryController.receiveTransfer);

// Consumption
router.get('/consumption', InventoryController.getConsumption);

// Stocktake & Adjustments
router.get('/stocktake', StocktakeController.listStocktakes);
router.post('/stocktake', StocktakeController.createStocktake);
router.get('/stocktake/:id', StocktakeController.getStocktakeById);
router.post('/stocktake/:id/complete', StocktakeController.completeStocktake);
router.post('/stocktake/adjust', StocktakeController.adjustStock);
router.post('/stock/adjust', StocktakeController.adjustStock);

export { router as inventoryRoutes };
