import type { Request, Response } from 'express';
export declare class CustomerController {
    private getTenantId;
    listCustomers(req: Request, res: Response): Promise<void>;
    getCustomerById(req: Request, res: Response): Promise<void>;
    createCustomer(req: Request, res: Response): Promise<void>;
    updateCustomer(req: Request, res: Response): Promise<void>;
    deleteCustomer(req: Request, res: Response): Promise<void>;
    getDormant(req: Request, res: Response): Promise<void>;
    recordVisit(req: Request, res: Response): Promise<void>;
}
export declare const customerController: CustomerController;
//# sourceMappingURL=customer.controller.d.ts.map