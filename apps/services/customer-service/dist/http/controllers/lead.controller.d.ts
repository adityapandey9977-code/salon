import type { Request, Response } from 'express';
export declare class LeadController {
    listLeads(req: Request, res: Response): Promise<void>;
    getLeadById(req: Request, res: Response): Promise<void>;
    createLead(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
    convertLead(req: Request, res: Response): Promise<void>;
}
export declare const leadController: LeadController;
//# sourceMappingURL=lead.controller.d.ts.map