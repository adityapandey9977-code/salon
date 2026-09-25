import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CalculateTaxRequestSchema,
  CheckoutCartRequestSchema,
  RequestRefundSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { billingService } from '../../application/services/billing.service';

export class BillingController {
  public async calculateTax(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CalculateTaxRequestSchema.parse(req.body);
    const result = await billingService.calculateTax(tenantId, body);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async checkout(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = CheckoutCartRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await billingService.checkout(tenantId, body, userId, correlationId);

    res.status(201).json({
      success: true,
      data: result.invoice,
      meta: { correlationId },
    });
  }

  public async listInvoices(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const branchId = req.query.branchId as string | undefined;
    const customerId = req.query.customerId as string | undefined;
    const status = req.query.status as any;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const result = await billingService.listInvoices(tenantId, {
      branchId,
      customerId,
      status,
      page,
      limit,
    });

    res.json({
      success: true,
      data: result.items,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
        correlationId: req.headers['x-correlation-id'],
      },
    });
  }

  public async getInvoiceById(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const result = await billingService.getInvoiceById(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async requestRefund(req: Request, res: Response): Promise<void> {
    const tenantId = req.auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) throw new UnauthorizedError('Tenant context required');

    const body = RequestRefundSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await billingService.requestRefund(tenantId, body, userId, correlationId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }
}

export const billingController = new BillingController();
