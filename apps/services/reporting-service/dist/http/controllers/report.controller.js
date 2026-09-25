import { ReportService } from '../../application/services/report.service';
export class ReportController {
    static async getExecutiveSummary(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const range = req.query.range || '30d';
            const data = await ReportService.getExecutiveSummary(tenantId, range);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getOperations(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const range = req.query.range || '30d';
            const data = await ReportService.getOperationsReport(tenantId, branchId, range);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getRevenue(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const range = req.query.range || '30d';
            const data = await ReportService.getRevenueReport(tenantId, branchId, range);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getStaff(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const range = req.query.range || '30d';
            const data = await ReportService.getStaffReport(tenantId, branchId, range);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getBranchEod(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || 'default-branch';
            const date = req.query.date || undefined;
            const data = await ReportService.getBranchEodReport(tenantId, branchId, date);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getStylistProductivity(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const range = req.query.range || '30d';
            const data = await ReportService.getStylistProductivityReport(tenantId, branchId, range);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async exportReport(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.body.tenantId || 'default-tenant';
            const userId = req.headers['x-user-id'] || undefined;
            const reportType = req.body.reportType || 'EXECUTIVE_SUMMARY';
            const parameters = req.body.parameters;
            const data = await ReportService.requestExport(tenantId, userId, reportType, parameters);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async exportBranchReport(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.body.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.body.branchId || 'default-branch';
            const userId = req.headers['x-user-id'] || undefined;
            const reportType = req.body.reportType || 'BRANCH_EOD';
            const parameters = req.body.parameters;
            const data = await ReportService.requestBranchExport(tenantId, branchId, userId, reportType, parameters);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
}
