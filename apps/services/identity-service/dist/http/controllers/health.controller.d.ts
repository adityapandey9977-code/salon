import type { Request, Response } from 'express';
export declare class HealthController {
    getHealth(_req: Request, res: Response): Promise<void>;
    getReady(_req: Request, res: Response): Promise<void>;
    getMetrics(_req: Request, res: Response): Promise<void>;
}
export declare const healthController: HealthController;
//# sourceMappingURL=health.controller.d.ts.map