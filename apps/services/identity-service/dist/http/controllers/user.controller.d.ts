import type { NextFunction, Request, Response } from 'express';
export declare class UserController {
    listUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    suspendUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    activateUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    assignRoles(req: Request, res: Response, next: NextFunction): Promise<void>;
    removeRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    getEffectiveAccess(req: Request, res: Response, next: NextFunction): Promise<void>;
    getScopes(req: Request, res: Response, next: NextFunction): Promise<void>;
    createScope(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteScope(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const userController: UserController;
//# sourceMappingURL=user.controller.d.ts.map