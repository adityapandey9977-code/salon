import type { Request, Response } from 'express';
export declare class BranchAssignmentController {
    getStaffBranches(req: Request, res: Response): Promise<void>;
    assignBranch(req: Request, res: Response): Promise<void>;
    updateAssignment(req: Request, res: Response): Promise<void>;
    removeAssignment(req: Request, res: Response): Promise<void>;
}
export declare const branchAssignmentController: BranchAssignmentController;
//# sourceMappingURL=branch-assignment.controller.d.ts.map