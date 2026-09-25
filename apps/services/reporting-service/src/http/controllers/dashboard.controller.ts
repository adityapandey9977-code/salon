import type { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../application/services/dashboard.service';

export class DashboardController {
  public static async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const dateRange = (req.query.range as string) || (req.query.dateRange as string) || '30d';

      const data = await DashboardService.getDashboardMetrics(tenantId, branchId, dateRange);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getCharts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const period = (req.query.period as string) || 'month';

      const data = await DashboardService.getDashboardCharts(tenantId, branchId, period);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getOccupancy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const date = (req.query.date as string) || undefined;

      const data = await DashboardService.getOccupancy(tenantId, branchId, date);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getRecentActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;

      const data = await DashboardService.getRecentActivity(tenantId, branchId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getBranchKpis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || 'default-branch';

      const data = await DashboardService.getBranchKpis(tenantId, branchId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getCallCenterKpis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const dateRange = (req.query.range as string) || '30d';

      const data = await DashboardService.getCallCenterKpis(tenantId, dateRange);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getBranchComparison(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const dateRange = (req.query.range as string) || '30d';

      const data = await DashboardService.getBranchComparison(tenantId, dateRange);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getInventoryDashboardKpis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;

      const data = await DashboardService.getInventoryDashboardKpis(tenantId, branchId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseDashboardKpis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const franchiseId = (req.query.franchiseId as string) || (req.headers['x-franchise-id'] as string) || 'default-franchise';

      const data = await DashboardService.getFranchiseDashboardKpis(tenantId, franchiseId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseSalesTrend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const franchiseId = (req.query.franchiseId as string) || (req.headers['x-franchise-id'] as string) || 'default-franchise';

      const data = await DashboardService.getFranchiseSalesTrend(tenantId, franchiseId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseSalesSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const franchiseId = (req.query.franchiseId as string) || (req.headers['x-franchise-id'] as string) || 'default-franchise';

      const data = await DashboardService.getFranchiseSalesSummary(tenantId, franchiseId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseStaffSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const franchiseId = (req.query.franchiseId as string) || (req.headers['x-franchise-id'] as string) || 'default-franchise';

      const data = await DashboardService.getFranchiseStaffSummary(tenantId, franchiseId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getFranchiseInventorySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const franchiseId = (req.query.franchiseId as string) || (req.headers['x-franchise-id'] as string) || 'default-franchise';

      const data = await DashboardService.getFranchiseInventorySummary(tenantId, franchiseId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
