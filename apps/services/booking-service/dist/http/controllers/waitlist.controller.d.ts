import type { NextFunction, Request, Response } from 'express';
export declare class WaitlistController {
    static list(req: Request, res: Response, next: NextFunction): Promise<void>;
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=waitlist.controller.d.ts.map