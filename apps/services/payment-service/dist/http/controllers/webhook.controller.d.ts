import type { NextFunction, Request, Response } from 'express';
export declare class WebhookController {
    static handleRazorpay(req: Request, res: Response, next: NextFunction): Promise<void>;
    static handleStripe(req: Request, res: Response, next: NextFunction): Promise<void>;
    static handleMock(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=webhook.controller.d.ts.map