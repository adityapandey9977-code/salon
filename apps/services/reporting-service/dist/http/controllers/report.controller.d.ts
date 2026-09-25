import type { Request, Response, NextFunction } from 'express';
export declare class ReportController {
    static getExecutiveSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOperations(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRevenue(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStaff(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchEod(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStylistProductivity(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportReport(req: Request, res: Response, next: NextFunction): Promise<void>;
    static exportBranchReport(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=report.controller.d.ts.map