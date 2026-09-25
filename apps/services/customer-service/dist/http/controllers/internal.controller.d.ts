import type { Request, Response } from 'express';
export declare class InternalController {
    getCustomerSummary(req: Request, res: Response): Promise<void>;
    lookupByMobile(req: Request, res: Response): Promise<void>;
    recordVisit(req: Request, res: Response): Promise<void>;
}
export declare const internalController: InternalController;
//# sourceMappingURL=internal.controller.d.ts.map