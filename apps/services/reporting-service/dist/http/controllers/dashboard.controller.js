import { DashboardService } from '../../application/services/dashboard.service';
export class DashboardController {
    static async getMetrics(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const dateRange = req.query.range || req.query.dateRange || '30d';
            const data = await DashboardService.getDashboardMetrics(tenantId, branchId, dateRange);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCharts(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const period = req.query.period || 'month';
            const data = await DashboardService.getDashboardCharts(tenantId, branchId, period);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getOccupancy(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const date = req.query.date || undefined;
            const data = await DashboardService.getOccupancy(tenantId, branchId, date);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getRecentActivity(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const data = await DashboardService.getRecentActivity(tenantId, branchId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getBranchKpis(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || 'default-branch';
            const data = await DashboardService.getBranchKpis(tenantId, branchId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getCallCenterKpis(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const dateRange = req.query.range || '30d';
            const data = await DashboardService.getCallCenterKpis(tenantId, dateRange);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getBranchComparison(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const dateRange = req.query.range || '30d';
            const data = await DashboardService.getBranchComparison(tenantId, dateRange);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getInventoryDashboardKpis(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const branchId = req.headers['x-branch-id'] || req.query.branchId || undefined;
            const data = await DashboardService.getInventoryDashboardKpis(tenantId, branchId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseDashboardKpis(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const franchiseId = req.query.franchiseId || req.headers['x-franchise-id'] || 'default-franchise';
            const data = await DashboardService.getFranchiseDashboardKpis(tenantId, franchiseId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseSalesTrend(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const franchiseId = req.query.franchiseId || req.headers['x-franchise-id'] || 'default-franchise';
            const data = await DashboardService.getFranchiseSalesTrend(tenantId, franchiseId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseSalesSummary(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const franchiseId = req.query.franchiseId || req.headers['x-franchise-id'] || 'default-franchise';
            const data = await DashboardService.getFranchiseSalesSummary(tenantId, franchiseId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseStaffSummary(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const franchiseId = req.query.franchiseId || req.headers['x-franchise-id'] || 'default-franchise';
            const data = await DashboardService.getFranchiseStaffSummary(tenantId, franchiseId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseInventorySummary(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || 'default-tenant';
            const franchiseId = req.query.franchiseId || req.headers['x-franchise-id'] || 'default-franchise';
            const data = await DashboardService.getFranchiseInventorySummary(tenantId, franchiseId);
            res.json({ success: true, data });
        }
        catch (err) {
            next(err);
        }
    }
}
