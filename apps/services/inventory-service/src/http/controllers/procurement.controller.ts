import { Request, Response, NextFunction } from 'express';
import { ProcurementService } from '../../application/services/procurement.service';

const procService = new ProcurementService();

export class ProcurementController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  // Suppliers
  static async listSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const branchId = req.query.branchId as string | undefined;
      const status = req.query.status as string | undefined;
      const suppliers = await procService.listSuppliers(tenantId, { branchId, status });
      res.json({ success: true, data: suppliers });
    } catch (err) {
      next(err);
    }
  }

  static async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const supplier = await procService.createSupplier(tenantId, req.body);
      res.status(201).json({ success: true, data: supplier });
    } catch (err) {
      next(err);
    }
  }

  // Purchase Orders
  static async listPurchaseOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const status = req.query.status as any;
      const branchId = req.query.branchId as string | undefined;
      const supplierId = req.query.supplierId as string | undefined;
      const pos = await procService.listPurchaseOrders(tenantId, { status, branchId, supplierId });
      res.json({ success: true, data: pos });
    } catch (err) {
      next(err);
    }
  }

  static async getPoById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const po = await procService.getPoById(tenantId, req.params.id as string);
      res.json({ success: true, data: po });
    } catch (err) {
      next(err);
    }
  }

  static async createPurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const createdByUserId = (req as any).user?.id || (req as any).auth?.userId;
      const createdByPrincipalType = (req as any).auth?.principalType || 'USER';

      const po = await procService.createPurchaseOrder(tenantId, {
        ...req.body,
        createdByUserId,
        createdByPrincipalType,
      });
      res.status(201).json({ success: true, data: po });
    } catch (err) {
      next(err);
    }
  }

  static async approvePurchaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const approvedByUserId = (req as any).user?.id || (req as any).auth?.userId;
      const po = await procService.approvePurchaseOrder(tenantId, req.params.id as string, approvedByUserId);
      res.json({ success: true, data: po });
    } catch (err) {
      next(err);
    }
  }

  // Goods Receipt
  static async createGoodsReceipt(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = ProcurementController.getTenantId(req);
      const receivedByUserId = (req as any).user?.id || (req as any).auth?.userId;
      const grn = await procService.receiveGoods(tenantId, {
        ...req.body,
        receivedByUserId,
      });
      res.status(201).json({ success: true, data: grn });
    } catch (err) {
      next(err);
    }
  }
}
