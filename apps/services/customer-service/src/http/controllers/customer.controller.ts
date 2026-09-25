import { UnauthorizedError } from '@salon-spa-saas/common-types';
import {
  CreateCustomerRequestSchema,
  QueryCustomersRequestSchema,
  UpdateCustomerRequestSchema,
} from '@salon-spa-saas/contracts';
import type { Request, Response } from 'express';
import { customerService } from '../../application/services/customer.service';

const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';

export class CustomerController {
  private getTenantId(req: Request): string {
    const id =
      req.auth?.tenantId ||
      (req.headers['x-tenant-id'] as string) ||
      (req.query?.tenantId as string) ||
      (req.body?.tenantId as string);
    return id || DEFAULT_TENANT_ID;
  }

  public async listCustomers(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const query = QueryCustomersRequestSchema.parse(req.query);

    // Scoping resolution:
    // If franchiseId is in token/auth, strictly enforce it, otherwise allow query param
    const effectiveFranchiseId = req.auth?.franchiseId || query.franchiseId;
    const effectiveBranchId =
      req.auth?.branchIds && req.auth.branchIds.length > 0 ? req.auth.branchIds[0] : query.branchId;

    const result = await customerService.listCustomers(tenantId, {
      ...query,
      ...(effectiveFranchiseId ? { franchiseId: effectiveFranchiseId } : {}),
      ...(effectiveBranchId ? { branchId: effectiveBranchId } : {}),
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

  public async getCustomerById(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const result = await customerService.getCustomerDetail(tenantId, req.params.id as string);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async createCustomer(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const body = CreateCustomerRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    // Scoping enforcement: if franchise is in auth context or header, apply it
    const effectiveFranchiseId = req.auth?.franchiseId || body.franchiseId || (req.headers['x-franchise-id'] as string) || null;

    // Branch scoping enforcement: if preferredBranchId is provided, use it; otherwise fallback to auth context branchIds or x-branch-id header
    const effectiveBranchId =
      body.preferredBranchId ||
      (req.auth?.branchIds && req.auth.branchIds.length > 0 ? req.auth.branchIds[0] : null) ||
      (req.headers['x-branch-id'] as string) ||
      null;

    const result = await customerService.createCustomer(
      tenantId,
      {
        ...body,
        preferredBranchId: effectiveBranchId,
        franchiseId: effectiveFranchiseId,
      },
      userId,
      correlationId,
    );

    res.status(201).json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async updateCustomer(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const body = UpdateCustomerRequestSchema.parse(req.body);
    const userId = req.auth?.userId || null;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    const result = await customerService.updateCustomer(
      tenantId,
      req.params.id as string,
      body,
      userId,
      correlationId,
    );

    res.json({
      success: true,
      data: result,
      meta: { correlationId },
    });
  }

  public async deleteCustomer(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const userId = req.auth?.userId || null;
    const deleteReason = req.body?.reason as string | undefined;
    const correlationId = req.headers['x-correlation-id'] as string | undefined;

    await customerService.softDeleteCustomer(
      tenantId,
      req.params.id as string,
      userId,
      deleteReason,
      correlationId,
    );

    res.json({
      success: true,
      data: { message: 'Customer archived successfully' },
      meta: { correlationId },
    });
  }

  public async getDormant(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const result = await customerService.getDormantCustomers(tenantId);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }

  public async recordVisit(req: Request, res: Response): Promise<void> {
    const tenantId = this.getTenantId(req);
    const customerId = req.params.id as string;
    const amount = Number(req.body.amount || 0);
    const visitDate = req.body.visitDate ? new Date(req.body.visitDate) : new Date();

    const result = await customerService.recordVisit(tenantId, customerId, amount, visitDate);

    res.json({
      success: true,
      data: result,
      meta: { correlationId: req.headers['x-correlation-id'] },
    });
  }
}

export const customerController = new CustomerController();
