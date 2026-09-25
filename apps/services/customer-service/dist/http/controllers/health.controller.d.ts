import type { Request, Response } from 'express';
export declare class HealthController {
    health(_req: Request, res: Response): Promise<void>;
    ready(_req: Request, res: Response): Promise<void>;
    metrics(_req: Request, res: Response): Promise<void>;
}
export declare const healthController: HealthController;
//# sourceMappingURL=health.controller.d.ts.map