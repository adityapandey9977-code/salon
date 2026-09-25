import type { NextFunction, Request, Response } from 'express';
export declare class RoleController {
    listRoles(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRoleById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteRole(req: Request, res: Response, next: NextFunction): Promise<void>;
    assignPermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
    listPermissions(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const roleController: RoleController;
//# sourceMappingURL=role.controller.d.ts.map