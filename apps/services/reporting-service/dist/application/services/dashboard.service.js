import { MetricsRepository } from '../../infrastructure/repositories/metrics.repository';
import { ReportingReadStore } from '../../infrastructure/redis/reporting-read.store';
export class DashboardService {
    static async getDashboardMetrics(tenantId, branchId, dateRange = '30d') {
        const cacheKey = `tenant:${tenantId}:dashboard:metrics:${branchId || 'all'}:${dateRange}`;
        const cached = await ReportingReadStore.get(cacheKey);
        if (cached)
            return cached;
        const startDate = this.calculateStartDate(dateRange);
        const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId, branchId, startDate);
        const tenantMetrics = await MetricsRepository.getTenantMetrics(tenantId, startDate);
        const totalSales = branchMetrics.reduce((sum, m) => sum + Number(m.grossSales), 0);
        const totalAppointments = branchMetrics.reduce((sum, m) => sum + m.appointmentsCompleted, 0);
        const totalBookings = branchMetrics.reduce((sum, m) => sum + m.appointmentsBooked, 0);
        const totalCustomers = tenantMetrics.reduce((sum, m) => sum + m.newCustomers, 0);
        const serviceRevenue = branchMetrics.reduce((sum, m) => sum + Number(m.serviceRevenue), 0);
        const retailRevenue = branchMetrics.reduce((sum, m) => sum + Number(m.retailRevenue), 0);
        const response = {
            summary: {
                totalRevenue: totalSales,
                serviceRevenue,
                retailRevenue,
                totalBookings,
                completedAppointments: totalAppointments,
                newCustomers: totalCustomers,
                averageTicketValue: totalAppointments > 0 ? (totalSales / totalAppointments).toFixed(2) : '0.00',
            },
            timeSeries: branchMetrics.slice(0, 30),
            period: dateRange,
        };
        await ReportingReadStore.set(cacheKey, response, 120);
        return response;
    }
    static async getDashboardCharts(tenantId, branchId, period = 'month') {
        const cacheKey = `tenant:${tenantId}:dashboard:charts:${branchId || 'all'}:${period}`;
        const cached = await ReportingReadStore.get(cacheKey);
        if (cached)
            return cached;
        const startDate = this.calculateStartDate(period === 'year' ? '365d' : period === 'week' ? '7d' : '30d');
        const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId, branchId, startDate);
        const chartData = branchMetrics.map((m) => ({
            date: m.metricDate.toISOString().split('T')[0],
            grossSales: Number(m.grossSales),
            serviceRevenue: Number(m.serviceRevenue),
            retailRevenue: Number(m.retailRevenue),
            appointments: m.appointmentsCompleted,
        }));
        const response = { period, chartData };
        await ReportingReadStore.set(cacheKey, response, 120);
        return response;
    }
    static async getOccupancy(tenantId, branchId, _date) {
        const today = new Date();
        const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId, branchId, today);
        const totalAppointments = branchMetrics.reduce((sum, m) => sum + m.appointmentsBooked, 0);
        // Assume capacity based on typical branch capacity
        const estimatedCapacity = 40;
        const occupancyRate = Math.min(100, (totalAppointments / estimatedCapacity) * 100);
        return {
            date: today.toISOString().split('T')[0],
            occupancyPercentage: Number(occupancyRate.toFixed(2)),
            bookedSlots: totalAppointments,
            totalCapacity: estimatedCapacity,
        };
    }
    static async getRecentActivity(tenantId, _branchId, _limit = 10) {
        const tenantMetrics = await MetricsRepository.getTenantMetrics(tenantId);
        return {
            activities: tenantMetrics.slice(0, 5).map((m) => ({
                type: 'DAILY_SUMMARY',
                metricDate: m.metricDate,
                bookings: m.bookings,
                grossRevenue: Number(m.grossRevenue),
            })),
        };
    }
    static async getBranchKpis(tenantId, branchId) {
        const cacheKey = `tenant:${tenantId}:branch:${branchId}:kpis`;
        const cached = await ReportingReadStore.get(cacheKey);
        if (cached)
            return cached;
        const metrics = await MetricsRepository.getBranchMetrics(tenantId, branchId);
        const latest = metrics[0];
        const response = {
            branchId,
            todayRevenue: latest ? Number(latest.grossSales) : 0,
            todayAppointments: latest ? latest.appointmentsCompleted : 0,
            todayBookings: latest ? latest.appointmentsBooked : 0,
            newClients: latest ? latest.newCustomers : 0,
            averageTicketValue: latest ? Number(latest.averageTicketValue) : 0,
        };
        await ReportingReadStore.set(cacheKey, response, 60);
        return response;
    }
    static async getCallCenterKpis(tenantId, dateRange = '30d') {
        const startDate = this.calculateStartDate(dateRange);
        const metrics = await MetricsRepository.getCallCenterMetrics(tenantId, startDate);
        const totalCalls = metrics.reduce((sum, m) => sum + m.calls, 0);
        const totalAnswered = metrics.reduce((sum, m) => sum + m.answered, 0);
        const totalMissed = metrics.reduce((sum, m) => sum + m.missed, 0);
        const appointmentsBooked = metrics.reduce((sum, m) => sum + m.appointmentsBooked, 0);
        const leadsCreated = metrics.reduce((sum, m) => sum + m.leadsCreated, 0);
        return {
            totalCalls,
            answered: totalAnswered,
            missed: totalMissed,
            appointmentsBooked,
            leadsCreated,
            conversionRate: totalCalls > 0 ? ((appointmentsBooked / totalCalls) * 100).toFixed(2) : '0.00',
        };
    }
    static async getBranchComparison(tenantId, dateRange = '30d') {
        const startDate = this.calculateStartDate(dateRange);
        const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId, undefined, startDate);
        const grouped = {};
        for (const bm of branchMetrics) {
            if (!grouped[bm.branchId]) {
                grouped[bm.branchId] = { branchId: bm.branchId, totalRevenue: 0, totalAppointments: 0 };
            }
            grouped[bm.branchId].totalRevenue += Number(bm.grossSales);
            grouped[bm.branchId].totalAppointments += bm.appointmentsCompleted;
        }
        return {
            period: dateRange,
            branches: Object.values(grouped),
        };
    }
    static async getSuperAdminKpis() {
        const cached = await ReportingReadStore.get('platform:dashboard:kpis');
        if (cached)
            return cached;
        const data = await MetricsRepository.getSuperAdminPlatformMetrics();
        await ReportingReadStore.set('platform:dashboard:kpis', data, 60);
        return data;
    }
    static async getSuperAdminMrrTelemetry() {
        return {
            currentMrr: 125000.0,
            currency: 'USD',
            growthPercentage: 12.5,
            churnRate: 0.8,
        };
    }
    static async getSuperAdminTenantHealth() {
        return {
            healthyTenants: 48,
            atRiskTenants: 2,
            suspendedTenants: 0,
        };
    }
    static async getSuperAdminSystemMetrics() {
        return {
            databaseStatus: 'HEALTHY',
            redisLatencyMs: 1.2,
            rabbitmqQueueDepth: 0,
            uptimeSeconds: process.uptime(),
        };
    }
    static async getInventoryDashboardKpis(tenantId, branchId) {
        const metrics = await MetricsRepository.getInventoryMetrics(tenantId, branchId);
        const latest = metrics[0];
        return {
            inventoryValue: latest ? Number(latest.inventoryValue) : 0,
            lowStockCount: latest ? latest.lowStockCount : 0,
            outOfStockCount: latest ? latest.outOfStockCount : 0,
            purchaseValue: latest ? Number(latest.purchaseValue) : 0,
            consumptionValue: latest ? Number(latest.consumptionValue) : 0,
        };
    }
    static async getFranchiseDashboardKpis(tenantId, franchiseId) {
        const metrics = await MetricsRepository.getFranchiseMetrics(tenantId, franchiseId);
        const latest = metrics[0];
        return {
            franchiseId,
            grossSales: latest ? Number(latest.grossSales) : 0,
            netSales: latest ? Number(latest.netSales) : 0,
            royaltyAccrued: latest ? Number(latest.royaltyAccrued) : 0,
            royaltyPaid: latest ? Number(latest.royaltyPaid) : 0,
        };
    }
    static async getFranchiseSalesTrend(tenantId, franchiseId) {
        const metrics = await MetricsRepository.getFranchiseMetrics(tenantId, franchiseId);
        return {
            franchiseId,
            trend: metrics.map((m) => ({
                date: m.metricDate.toISOString().split('T')[0],
                grossSales: Number(m.grossSales),
                netSales: Number(m.netSales),
                royaltyAccrued: Number(m.royaltyAccrued),
            })),
        };
    }
    static async getFranchiseSalesSummary(tenantId, franchiseId) {
        const metrics = await MetricsRepository.getFranchiseMetrics(tenantId, franchiseId);
        const totalGross = metrics.reduce((sum, m) => sum + Number(m.grossSales), 0);
        const totalRoyalty = metrics.reduce((sum, m) => sum + Number(m.royaltyAccrued), 0);
        return {
            franchiseId,
            totalGrossSales: totalGross,
            totalRoyaltyAccrued: totalRoyalty,
            settlementsCount: metrics.length,
        };
    }
    static async getFranchiseStaffSummary(tenantId, _franchiseId) {
        const staffMetrics = await MetricsRepository.getStaffMetrics(tenantId);
        return {
            activeStaffCount: staffMetrics.length,
            totalServices: staffMetrics.reduce((sum, m) => sum + m.completedServices, 0),
        };
    }
    static async getFranchiseInventorySummary(tenantId, _franchiseId) {
        const inventory = await MetricsRepository.getInventoryMetrics(tenantId);
        return {
            totalValuation: inventory.reduce((sum, m) => sum + Number(m.inventoryValue), 0),
            lowStockAlerts: inventory.reduce((sum, m) => sum + m.lowStockCount, 0),
        };
    }
    static calculateStartDate(range) {
        const now = new Date();
        if (range === '7d' || range === 'week') {
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        if (range === '90d' || range === 'quarter') {
            return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        }
        if (range === '365d' || range === 'year') {
            return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        }
        // Default 30 days
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
}
