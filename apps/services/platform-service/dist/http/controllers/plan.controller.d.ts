import { Request, Response, NextFunction } from 'express';
export declare class PlanController {
    static listPlans(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPlanById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createPlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updatePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePlan(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listFeatures(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateFeature(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=plan.controller.d.ts.map