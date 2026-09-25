import { Request, Response, NextFunction } from 'express';
export declare class InventoryController {
    private static getTenantId;
    static getDashboardKpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listSkus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSkuById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createSku(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateSku(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteSku(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listStock(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchStock(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchAlerts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCriticalAlerts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listTransfers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createTransfer(req: Request, res: Response, next: NextFunction): Promise<void>;
    static dispatchTransfer(req: Request, res: Response, next: NextFunction): Promise<void>;
    static receiveTransfer(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getConsumption(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=inventory.controller.d.ts.map