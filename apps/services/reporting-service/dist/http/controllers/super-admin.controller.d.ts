import type { Request, Response, NextFunction } from 'express';
export declare class SuperAdminController {
    static getKpis(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMrrTelemetry(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getTenantHealth(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getSystemMetrics(_req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAudit(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createAuditLog(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportAudit(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=super-admin.controller.d.ts.map