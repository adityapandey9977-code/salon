export declare class ReportService {
    static getExecutiveSummary(tenantId: string, _dateRange?: string): Promise<{
        title: string;
        generatedAt: string;
        kpis: {
            totalRevenue: number;
            totalBookings: number;
            completedAppointments: number;
            totalNewCustomers: number;
            averageTicketValue: string;
        };
        topBranches: {
            branchId: string;
            revenue: number;
            appointments: number;
        }[];
    }>;
    static getOperationsReport(tenantId: string, branchId?: string, _dateRange?: string): Promise<{
        title: string;
        metrics: {
            date: string;
            branchId: string;
            booked: number;
            completed: number;
            cancelled: number;
            noShows: number;
        }[];
    }>;
    static getRevenueReport(tenantId: string, branchId?: string, _dateRange?: string): Promise<{
        title: string;
        items: {
            date: string;
            branchId: string;
            grossSales: number;
            netSales: number;
            taxCollected: number;
            serviceRevenue: number;
            retailRevenue: number;
        }[];
    }>;
    static getStaffReport(tenantId: string, branchId?: string, _dateRange?: string): Promise<{
        title: string;
        staff: {
            employeeId: string;
            branchId: string;
            date: string;
            appointments: number;
            completedServices: number;
            serviceRevenue: number;
            retailRevenue: number;
            commissionEarned: number;
            utilizationPercentage: number;
        }[];
    }>;
    static getBranchEodReport(tenantId: string, branchId: string, date?: string): Promise<{
        branchId: string;
        date: string;
        totalAppointments: number;
        grossSales: number;
        netSales: number;
        taxCollected: number;
        serviceRevenue: number;
        retailRevenue: number;
        newClients: number;
    }>;
    static getStylistProductivityReport(tenantId: string, branchId?: string, _dateRange?: string): Promise<{
        title: string;
        staff: {
            employeeId: string;
            branchId: string;
            date: string;
            appointments: number;
            completedServices: number;
            serviceRevenue: number;
            retailRevenue: number;
            commissionEarned: number;
            utilizationPercentage: number;
        }[];
    }>;
    static requestExport(tenantId: string, requestedByUserId?: string, reportType?: string, parameters?: Record<string, unknown>): Promise<{
        jobId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.JobStatus;
        reportType: string;
        fileUrl: string | null;
        completedAt: Date | null;
    }>;
    static requestBranchExport(tenantId: string, branchId: string, requestedByUserId?: string, reportType?: string, parameters?: Record<string, unknown>): Promise<{
        jobId: string;
        status: import("../../infrastructure/prisma/generated-client").$Enums.JobStatus;
        reportType: string;
        fileUrl: string | null;
        completedAt: Date | null;
    }>;
}
//# sourceMappingURL=report.service.d.ts.map