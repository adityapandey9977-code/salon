import { Request, Response, NextFunction } from 'express';
export declare class TelephonyController {
    private static getTenantId;
    static listAgents(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listCalls(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCallById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static recordDisposition(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCustomerContext(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=telephony.controller.d.ts.map