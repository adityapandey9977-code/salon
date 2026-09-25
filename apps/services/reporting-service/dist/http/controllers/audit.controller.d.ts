import type { Request, Response, NextFunction } from 'express';
export declare class AuditController {
    static getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createAuditLog(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=audit.controller.d.ts.map