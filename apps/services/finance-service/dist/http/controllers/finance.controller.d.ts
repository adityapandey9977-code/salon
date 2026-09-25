import { Request, Response, NextFunction } from 'express';
export declare class FinanceController {
    private static getTenantId;
    static getOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCorporateKpis(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCashflowTrend(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getProfitabilityMatrix(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getGstReturn(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listAccounts(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listJournals(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createJournal(req: Request, res: Response, next: NextFunction): Promise<void>;
    static postJournal(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getCommissionTiers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateCommissionTiers(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getStaffCommissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=finance.controller.d.ts.map