import type { Request, Response, NextFunction } from 'express';
export declare class DashboardController {
    static getMetrics(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCharts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOccupancy(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchKpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCallCenterKpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchComparison(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getInventoryDashboardKpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseDashboardKpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseSalesTrend(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseSalesSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseStaffSummary(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseInventorySummary(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map