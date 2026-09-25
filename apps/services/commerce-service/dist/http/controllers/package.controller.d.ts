import type { Request, Response } from 'express';
export declare class PackageController {
    listPackages(req: Request, res: Response): Promise<void>;
    getPackageById(req: Request, res: Response): Promise<void>;
    createPackage(req: Request, res: Response): Promise<void>;
    updatePackage(req: Request, res: Response): Promise<void>;
    listPackageUsage(req: Request, res: Response): Promise<void>;
    createPackageRedemption(req: Request, res: Response): Promise<void>;
    getPackagesAnalytics(req: Request, res: Response): Promise<void>;
}
export declare const packageController: PackageController;
//# sourceMappingURL=package.controller.d.ts.map