import type { Request, Response, NextFunction } from 'express';
export declare class ReportingController {
    private static reportingService;
    static getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=reporting.controller.d.ts.map