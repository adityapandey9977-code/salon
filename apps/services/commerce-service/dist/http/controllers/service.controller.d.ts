import type { NextFunction, Request, Response } from 'express';
export declare class ServiceController {
    listCategories(req: Request, res: Response, next: NextFunction): Promise<void>;
    createCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void>;
    listServices(req: Request, res: Response, next: NextFunction): Promise<void>;
    getServiceById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createService(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateService(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
    setBranchPrice(req: Request, res: Response, next: NextFunction): Promise<void>;
    setRecipe(req: Request, res: Response, next: NextFunction): Promise<void>;
    listSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
    seedSkills(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSkill(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateSkill(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const serviceController: ServiceController;
//# sourceMappingURL=service.controller.d.ts.map