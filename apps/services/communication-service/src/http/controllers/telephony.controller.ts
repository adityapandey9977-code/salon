import { Request, Response, NextFunction } from 'express';
import { TelephonyService } from '../../application/services/telephony.service';

const telephonyService = new TelephonyService();

export class TelephonyController {
  private static getTenantId(req: Request): string {
    const tenantId = (req as any).user?.tenantId || (req as any).auth?.tenantId || (req.headers['x-tenant-id'] as string);
    if (!tenantId) {
      throw new Error('Tenant ID required');
    }
    return tenantId;
  }

  static async listAgents(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = TelephonyController.getTenantId(req);
      const agents = await telephonyService.listAgents(tenantId);
      res.json({ success: true, data: agents });
    } catch (err) {
      next(err);
    }
  }

  static async listCalls(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = TelephonyController.getTenantId(req);
      const calls = await telephonyService.listCalls(tenantId, req.query);
      res.json({ success: true, data: calls });
    } catch (err) {
      next(err);
    }
  }

  static async getCallById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = TelephonyController.getTenantId(req);
      const call = await telephonyService.getCallById(tenantId, req.params.id as string);
      res.json({ success: true, data: call });
    } catch (err) {
      next(err);
    }
  }

  static async recordDisposition(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = TelephonyController.getTenantId(req);
      const updated = await telephonyService.recordDisposition(tenantId, req.params.id as string, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }

  static async getCustomerContext(req: Request, res: Response, next: NextFunction) {
    try {
      const tenantId = TelephonyController.getTenantId(req);
      const phone = (req.query.phone as string) || '+919876543210';
      const context = await telephonyService.getCustomerContext(tenantId, phone);
      res.json({ success: true, data: context });
    } catch (err) {
      next(err);
    }
  }
}
