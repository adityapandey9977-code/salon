import { Request, Response, NextFunction } from 'express';
export declare class NotificationController {
    private static getTenantId;
    static listNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    static resolveNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAllLogs(req: Request, res: Response, next: NextFunction): Promise<void>;
    static simulateNotification(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=notification.controller.d.ts.map