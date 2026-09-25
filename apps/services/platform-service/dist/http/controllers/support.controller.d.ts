import type { Request, Response, NextFunction } from 'express';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory = 'Royalty Billing' | 'Compliance Audit' | 'Inventory Supply' | 'Technical Support' | 'Marketing Assets' | 'General';
export interface SupportTicket {
    id: string;
    tenantId: string;
    submittedBy: string;
    submittedByEmail: string;
    subject: string;
    category: TicketCategory;
    priority: TicketPriority;
    description: string;
    attachmentName?: string | null;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
}
export declare class SupportController {
    /** GET /api/v1/support/tickets */
    static listTickets(req: Request, res: Response, next: NextFunction): void;
    /** GET /api/v1/support/tickets/:id */
    static getTicket(req: Request, res: Response, next: NextFunction): void;
    /** POST /api/v1/support/tickets */
    static createTicket(req: Request, res: Response, next: NextFunction): void;
    /** PATCH /api/v1/support/tickets/:id/status */
    static updateTicketStatus(req: Request, res: Response, next: NextFunction): void;
    /** DELETE /api/v1/support/tickets/:id */
    static deleteTicket(req: Request, res: Response, next: NextFunction): void;
}
//# sourceMappingURL=support.controller.d.ts.map