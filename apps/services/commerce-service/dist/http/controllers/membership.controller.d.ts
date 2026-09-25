import type { Request, Response } from 'express';
export declare class MembershipController {
    listMemberships(req: Request, res: Response): Promise<void>;
    getMembershipById(req: Request, res: Response): Promise<void>;
    createMembership(req: Request, res: Response): Promise<void>;
    updateMembership(req: Request, res: Response): Promise<void>;
    listBenefits(req: Request, res: Response): Promise<void>;
    createBenefit(req: Request, res: Response): Promise<void>;
    listRenewals(req: Request, res: Response): Promise<void>;
    renewMembership(req: Request, res: Response): Promise<void>;
}
export declare const membershipController: MembershipController;
//# sourceMappingURL=membership.controller.d.ts.map