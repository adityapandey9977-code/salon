import type { Request, Response } from 'express';
export declare class LeaveController {
    queryLeave(req: Request, res: Response): Promise<void>;
    getLeaveById(req: Request, res: Response): Promise<void>;
    createLeaveRequest(req: Request, res: Response): Promise<void>;
    updateLeaveRequest(req: Request, res: Response): Promise<void>;
    approveLeave(req: Request, res: Response): Promise<void>;
    rejectLeave(req: Request, res: Response): Promise<void>;
    cancelLeave(req: Request, res: Response): Promise<void>;
    getLeaveBalances(req: Request, res: Response): Promise<void>;
    adjustLeaveBalance(req: Request, res: Response): Promise<void>;
}
export declare const leaveController: LeaveController;
//# sourceMappingURL=leave.controller.d.ts.map