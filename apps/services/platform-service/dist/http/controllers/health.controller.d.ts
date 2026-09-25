import type { Request, Response } from 'express';
export declare class HealthController {
    static health(_req: Request, res: Response): Promise<void>;
    static ready(_req: Request, res: Response): Promise<void>;
    static metrics(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=health.controller.d.ts.map