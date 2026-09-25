import { Request, Response, NextFunction } from 'express';
export declare class PayrollController {
    private static getTenantId;
    static listRuns(req: Request, res: Response, next: NextFunction): Promise<void>;
    static executePayroll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static approvePayroll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportBank(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAttendanceSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=payroll.controller.d.ts.map