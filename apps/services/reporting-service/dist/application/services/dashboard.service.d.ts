export declare class DashboardService {
    static getDashboardMetrics(tenantId: string, branchId?: string, dateRange?: string): Promise<{}>;
    static getDashboardCharts(tenantId: string, branchId?: string, period?: string): Promise<{}>;
    static getOccupancy(tenantId: string, branchId?: string, _date?: string): Promise<{
        date: string;
        occupancyPercentage: number;
        bookedSlots: number;
        totalCapacity: number;
    }>;
    static getRecentActivity(tenantId: string, _branchId?: string, _limit?: number): Promise<{
        activities: {
            type: string;
            metricDate: Date;
            bookings: number;
            grossRevenue: number;
        }[];
    }>;
    static getBranchKpis(tenantId: string, branchId: string): Promise<{}>;
    static getCallCenterKpis(tenantId: string, dateRange?: string): Promise<{
        totalCalls: number;
        answered: number;
        missed: number;
        appointmentsBooked: number;
        leadsCreated: number;
        conversionRate: string;
    }>;
    static getBranchComparison(tenantId: string, dateRange?: string): Promise<{
        period: string;
        branches: {
            branchId: string;
            totalRevenue: number;
            totalAppointments: number;
        }[];
    }>;
    static getSuperAdminKpis(): Promise<{}>;
    static getSuperAdminMrrTelemetry(): Promise<{
        currentMrr: number;
        currency: string;
        growthPercentage: number;
        churnRate: number;
    }>;
    static getSuperAdminTenantHealth(): Promise<{
        healthyTenants: number;
        atRiskTenants: number;
        suspendedTenants: number;
    }>;
    static getSuperAdminSystemMetrics(): Promise<{
        databaseStatus: string;
        redisLatencyMs: number;
        rabbitmqQueueDepth: number;
        uptimeSeconds: number;
    }>;
    static getInventoryDashboardKpis(tenantId: string, branchId?: string): Promise<{
        inventoryValue: number;
        lowStockCount: number;
        outOfStockCount: number;
        purchaseValue: number;
        consumptionValue: number;
    }>;
    static getFranchiseDashboardKpis(tenantId: string, franchiseId: string): Promise<{
        franchiseId: string;
        grossSales: number;
        netSales: number;
        royaltyAccrued: number;
        royaltyPaid: number;
    }>;
    static getFranchiseSalesTrend(tenantId: string, franchiseId: string): Promise<{
        franchiseId: string;
        trend: {
            date: string;
            grossSales: number;
            netSales: number;
            royaltyAccrued: number;
        }[];
    }>;
    static getFranchiseSalesSummary(tenantId: string, franchiseId: string): Promise<{
        franchiseId: string;
        totalGrossSales: number;
        totalRoyaltyAccrued: number;
        settlementsCount: number;
    }>;
    static getFranchiseStaffSummary(tenantId: string, _franchiseId: string): Promise<{
        activeStaffCount: number;
        totalServices: number;
    }>;
    static getFranchiseInventorySummary(tenantId: string, _franchiseId: string): Promise<{
        totalValuation: number;
        lowStockAlerts: number;
    }>;
    private static calculateStartDate;
}
//# sourceMappingURL=dashboard.service.d.ts.map