import type { Request, Response, NextFunction } from 'express';
import { ReportService } from '../../application/services/report.service';

export class ReportController {
  public static async getExecutiveSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const range = (req.query.range as string) || '30d';

      const data = await ReportService.getExecutiveSummary(tenantId, range);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getOperations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const range = (req.query.range as string) || '30d';

      const data = await ReportService.getOperationsReport(tenantId, branchId, range);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const range = (req.query.range as string) || '30d';

      const data = await ReportService.getRevenueReport(tenantId, branchId, range);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const range = (req.query.range as string) || '30d';

      const data = await ReportService.getStaffReport(tenantId, branchId, range);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getBranchEod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || 'default-branch';
      const date = (req.query.date as string) || undefined;

      const data = await ReportService.getBranchEodReport(tenantId, branchId, date);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async getStylistProductivity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.query.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.query.branchId as string) || undefined;
      const range = (req.query.range as string) || '30d';

      const data = await ReportService.getStylistProductivityReport(tenantId, branchId, range);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async exportReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.body.tenantId as string) || 'default-tenant';
      const userId = (req.headers['x-user-id'] as string) || undefined;
      const reportType = req.body.reportType || 'EXECUTIVE_SUMMARY';
      const parameters = req.body.parameters;

      const data = await ReportService.requestExport(tenantId, userId, reportType, parameters);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  public static async exportBranchReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req.body.tenantId as string) || 'default-tenant';
      const branchId = (req.headers['x-branch-id'] as string) || (req.body.branchId as string) || 'default-branch';
      const userId = (req.headers['x-user-id'] as string) || undefined;
      const reportType = req.body.reportType || 'BRANCH_EOD';
      const parameters = req.body.parameters;

      const data = await ReportService.requestBranchExport(tenantId, branchId, userId, reportType, parameters);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
