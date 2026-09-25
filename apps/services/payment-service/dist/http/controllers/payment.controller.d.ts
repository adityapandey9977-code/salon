import type { NextFunction, Request, Response } from 'express';
export declare class PaymentController {
    static createIntent(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getIntentById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPaymentLink(req: Request, res: Response, next: NextFunction): Promise<void>;
    static refund(req: Request, res: Response, next: NextFunction): Promise<void>;
    static reconcile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=payment.controller.d.ts.map