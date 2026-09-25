import { Request, Response, NextFunction } from 'express';
export declare class StocktakeController {
    private static getTenantId;
    static listStocktakes(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStocktakeById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createStocktake(req: Request, res: Response, next: NextFunction): Promise<void>;
    static completeStocktake(req: Request, res: Response, next: NextFunction): Promise<void>;
    static adjustStock(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=stocktake.controller.d.ts.map