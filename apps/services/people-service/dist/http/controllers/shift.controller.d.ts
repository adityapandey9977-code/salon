import type { Request, Response } from 'express';
export declare class ShiftController {
    getShifts(req: Request, res: Response): Promise<void>;
    createShift(req: Request, res: Response): Promise<void>;
    updateShift(req: Request, res: Response): Promise<void>;
    deleteShift(req: Request, res: Response): Promise<void>;
}
export declare const shiftController: ShiftController;
//# sourceMappingURL=shift.controller.d.ts.map