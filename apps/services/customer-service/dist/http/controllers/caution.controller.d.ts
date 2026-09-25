import type { Request, Response } from 'express';
export declare class CautionController {
    getCautions(req: Request, res: Response): Promise<void>;
    addCaution(req: Request, res: Response): Promise<void>;
    updateCaution(req: Request, res: Response): Promise<void>;
}
export declare const cautionController: CautionController;
//# sourceMappingURL=caution.controller.d.ts.map