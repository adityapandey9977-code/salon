import type { Request, Response } from 'express';
export declare class GatewayHealthController {
    getHealth(_req: Request, res: Response): void;
    getReady(_req: Request, res: Response): Promise<void>;
    getMetrics(_req: Request, res: Response): Promise<void>;
}
export declare const gatewayHealthController: GatewayHealthController;
//# sourceMappingURL=health.controller.d.ts.map