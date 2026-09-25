import type { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../application/services/dashboard.service';
import { AuditService } from '../../application/services/audit.service';

export class SuperAdminController {
  public static async getKpis(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DashboardService.getSuperAdminKpis();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getMrrTelemetry(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DashboardService.getSuperAdminMrrTelemetry();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getTenantHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DashboardService.getSuperAdminTenantHealth();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getSystemMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await DashboardService.getSuperAdminSystemMetrics();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AuditService.queryAuditLogs({
        tenantId: req.query.tenantId as string,
        entityType: req.query.entityType as string,
        action: req.query.action as string,
        category: req.query.category as string,
        search: req.query.search as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        limit: req.query.limit ? Number(req.query.limit) : 50,
        offset: req.query.offset ? Number(req.query.offset) : 0,
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

      const data = await AuditService.createAuditLog({
        ...req.body,
        ipAddress: req.body.ipAddress || (typeof clientIp === 'string' ? clientIp : Array.isArray(clientIp) ? clientIp[0] : '127.0.0.1'),
        userAgent: req.body.userAgent || userAgent || 'Platform Web Client',
      });
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async exportAudit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await AuditService.exportAuditLogs({
        tenantId: req.body.tenantId,
        category: req.body.category,
        search: req.body.search,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

