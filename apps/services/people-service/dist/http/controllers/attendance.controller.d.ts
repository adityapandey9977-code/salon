import type { Request, Response } from 'express';
export declare class AttendanceController {
    clockIn(req: Request, res: Response): Promise<void>;
    clockOut(req: Request, res: Response): Promise<void>;
    recordManualAttendance(req: Request, res: Response): Promise<void>;
    queryAttendanceLog(req: Request, res: Response): Promise<void>;
    getEmployeeAttendance(req: Request, res: Response): Promise<void>;
    punchAttendance(req: Request, res: Response): Promise<void>;
}
export declare const attendanceController: AttendanceController;
//# sourceMappingURL=attendance.controller.d.ts.map