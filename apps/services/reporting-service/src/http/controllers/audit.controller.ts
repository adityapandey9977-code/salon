import type { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../application/services/audit.service';

export class AuditController {
  public static async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || undefined;
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const entityType = req.query.entityType as string;
      const entityId = req.query.entityId as string;
      const actorUserId = req.query.actorUserId as string;
      const action = req.query.action as string;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const offset = req.query.offset ? Number(req.query.offset) : 0;

      const data = await AuditService.queryAuditLogs({
        tenantId,
        branchId,
        entityType,
        entityId,
        actorUserId,
        action,
        category,
        search,
        startDate,
        endDate,
        limit,
        offset,
      });

      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async createAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
      const userAgent = req.headers['user-agent'];
      const tenantId = (req.headers['x-tenant-id'] as string) || req.body.tenantId;
      const branchId = (req.headers['x-branch-id'] as string) || req.body.branchId;

      const data = await AuditService.createAuditLog({
        ...req.body,
        tenantId,
        branchId,
        ipAddress: req.body.ipAddress || (typeof clientIp === 'string' ? clientIp : Array.isArray(clientIp) ? clientIp[0] : '127.0.0.1'),
        userAgent: req.body.userAgent || userAgent || 'Web Client',
      });
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async exportAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.body.tenantId as string) || undefined;
      const category = req.body.category as string;
      const search = req.body.search as string;
      const startDate = req.body.startDate as string;
      const endDate = req.body.endDate as string;

      const data = await AuditService.exportAuditLogs({ tenantId, category, search, startDate, endDate });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

