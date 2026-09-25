import { NotFoundError, UnauthorizedError } from '@salon-spa-saas/common-types';
import type { Request, Response } from 'express';
import { customerService } from '../../application/services/customer.service';

export class InternalController {
  public async getCustomerSummary(req: Request, res: Response): Promise<void> {
    const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
    if (!tenantId) throw new UnauthorizedError('Tenant ID header/query parameter required');

    const customer = await customerService.getCustomerDetail(tenantId, req.params.id as string);
    if (!customer) throw new NotFoundError('Customer not found');

    res.json({
      success: true,
      data: {
        id: customer.id,
        tenantId: customer.tenantId,
        customerCode: customer.customerCode,
        displayName: customer.displayName,
        firstName: customer.firstName,
        lastName: customer.lastName,
        mobilePhone: customer.mobilePhone,
        email: customer.email,
        status: customer.status,
        preferredBranchId: customer.preferredBranchId,
        preferredStaffId: customer.preferences?.preferredStaffId,
        cautions: customer.cautions,
      },
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async lookupByMobile(req: Request, res: Response): Promise<void> {
    const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string);
    if (!tenantId) throw new UnauthorizedError('Tenant ID header/query parameter required');

    const mobile = req.query.mobile as string;
    if (!mobile) throw new UnauthorizedError('Mobile query parameter required');

    const customer = await customerService.lookupByMobile(tenantId, mobile);

    res.json({
      success: true,
      data: customer,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async recordVisit(req: Request, res: Response): Promise<void> {
    const tenantId =
      (req.headers['x-tenant-id'] as string) ||
      (req.query.tenantId as string) ||
      (req.body?.tenantId as string);
    if (!tenantId) throw new UnauthorizedError('Tenant ID header/query parameter required');

    const customerId = req.params.id as string;
    const amount = Number(req.body.amount || 0);
    const visitDate = req.body.visitDate ? new Date(req.body.visitDate) : new Date();

    const updated = await customerService.recordVisit(tenantId, customerId, amount, visitDate);

    res.json({
      success: true,
      data: updated,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const internalController = new InternalController();
