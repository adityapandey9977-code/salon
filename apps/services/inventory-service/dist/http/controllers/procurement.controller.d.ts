import { Request, Response, NextFunction } from 'express';
export declare class ProcurementController {
    private static getTenantId;
    static listSuppliers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createSupplier(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listPurchaseOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPoById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPurchaseOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    static approvePurchaseOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createGoodsReceipt(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=procurement.controller.d.ts.map