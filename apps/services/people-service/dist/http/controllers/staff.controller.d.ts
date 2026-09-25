import type { Request, Response } from 'express';
export declare class StaffController {
    private getTenantId;
    listStaff(req: Request, res: Response): Promise<void>;
    getStaffById(req: Request, res: Response): Promise<void>;
    getStaffMe(req: Request, res: Response): Promise<void>;
    createStaff(req: Request, res: Response): Promise<void>;
    updateStaff(req: Request, res: Response): Promise<void>;
    deleteStaff(req: Request, res: Response): Promise<void>;
    getBranchTeam(req: Request, res: Response): Promise<void>;
}
export declare const staffController: StaffController;
//# sourceMappingURL=staff.controller.d.ts.map