import type { NextFunction, Request, Response } from 'express';
export declare class BranchController {
    static listBranches(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseBranches(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getBranchById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteBranch(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getOperatingHours(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateOperatingHours(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getHolidays(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createHoliday(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteHoliday(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchises(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getFranchiseById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createFranchise(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateFranchise(req: Request, res: Response, next: NextFunction): Promise<void>;
    static listResources(req: Request, res: Response, next: NextFunction): Promise<void>;
    static createResource(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateResource(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deleteResource(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=branch.controller.d.ts.map