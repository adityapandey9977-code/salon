import type { Request, Response } from 'express';
export declare class RosterController {
    getRoster(req: Request, res: Response): Promise<void>;
    createRoster(req: Request, res: Response): Promise<void>;
    updateRoster(req: Request, res: Response): Promise<void>;
    deleteRoster(req: Request, res: Response): Promise<void>;
}
export declare const rosterController: RosterController;
//# sourceMappingURL=roster.controller.d.ts.map