import type { Request, Response } from 'express';
export declare class BillingController {
    calculateTax(req: Request, res: Response): Promise<void>;
    checkout(req: Request, res: Response): Promise<void>;
    listInvoices(req: Request, res: Response): Promise<void>;
    getInvoiceById(req: Request, res: Response): Promise<void>;
    requestRefund(req: Request, res: Response): Promise<void>;
}
export declare const billingController: BillingController;
//# sourceMappingURL=billing.controller.d.ts.map