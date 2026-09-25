import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';
export class MetricsRepository {
    static async upsertDailyBranchMetrics(data) {
        const dateOnly = new Date(data.metricDate.toISOString().split('T')[0]);
        return prisma.dailyBranchMetrics.upsert({
            where: {
                branchId_metricDate: {
                    branchId: data.branchId,
                    metricDate: dateOnly,
                },
            },
            create: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                metricDate: dateOnly,
                appointmentsBooked: data.appointmentsBookedInc || 0,
                appointmentsCompleted: data.appointmentsCompletedInc || 0,
                appointmentsCancelled: data.appointmentsCancelledInc || 0,
                noShows: data.noShowsInc || 0,
                grossSales: new Prisma.Decimal(data.grossSalesInc || 0),
                netSales: new Prisma.Decimal(data.netSalesInc || 0),
                taxCollected: new Prisma.Decimal(data.taxCollectedInc || 0),
                serviceRevenue: new Prisma.Decimal(data.serviceRevenueInc || 0),
                retailRevenue: new Prisma.Decimal(data.retailRevenueInc || 0),
                customerCount: data.customerCountInc || 0,
                newCustomers: data.newCustomersInc || 0,
                averageTicketValue: data.appointmentsCompletedInc && data.grossSalesInc
                    ? new Prisma.Decimal(data.grossSalesInc / data.appointmentsCompletedInc)
                    : new Prisma.Decimal(0),
            },
            update: {
                appointmentsBooked: { increment: data.appointmentsBookedInc || 0 },
                appointmentsCompleted: { increment: data.appointmentsCompletedInc || 0 },
                appointmentsCancelled: { increment: data.appointmentsCancelledInc || 0 },
                noShows: { increment: data.noShowsInc || 0 },
                grossSales: { increment: data.grossSalesInc || 0 },
                netSales: { increment: data.netSalesInc || 0 },
                taxCollected: { increment: data.taxCollectedInc || 0 },
                serviceRevenue: { increment: data.serviceRevenueInc || 0 },
                retailRevenue: { increment: data.retailRevenueInc || 0 },
                customerCount: { increment: data.customerCountInc || 0 },
                newCustomers: { increment: data.newCustomersInc || 0 },
            },
        });
    }
    static async upsertTenantDailyMetrics(data) {
        const dateOnly = new Date(data.metricDate.toISOString().split('T')[0]);
        return prisma.tenantDailyMetrics.upsert({
            where: {
                tenantId_metricDate: {
                    tenantId: data.tenantId,
                    metricDate: dateOnly,
                },
            },
            create: {
                tenantId: data.tenantId,
                metricDate: dateOnly,
                branchCount: data.branchCount || 1,
                activeStaffCount: data.activeStaffCount || 0,
                bookings: data.bookingsInc || 0,
                completedServices: data.completedServicesInc || 0,
                grossRevenue: new Prisma.Decimal(data.grossRevenueInc || 0),
                netRevenue: new Prisma.Decimal(data.netRevenueInc || 0),
                newCustomers: data.newCustomersInc || 0,
                inventoryAlerts: data.inventoryAlertsInc || 0,
            },
            update: {
                bookings: { increment: data.bookingsInc || 0 },
                completedServices: { increment: data.completedServicesInc || 0 },
                grossRevenue: { increment: data.grossRevenueInc || 0 },
                netRevenue: { increment: data.netRevenueInc || 0 },
                newCustomers: { increment: data.newCustomersInc || 0 },
                inventoryAlerts: { increment: data.inventoryAlertsInc || 0 },
            },
        });
    }
    static async upsertStaffPerformanceDaily(data) {
        const dateOnly = new Date(data.metricDate.toISOString().split('T')[0]);
        return prisma.staffPerformanceDaily.upsert({
            where: {
                employeeId_metricDate: {
                    employeeId: data.employeeId,
                    metricDate: dateOnly,
                },
            },
            create: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                employeeId: data.employeeId,
                metricDate: dateOnly,
                appointments: data.appointmentsInc || 0,
                completedServices: data.completedServicesInc || 0,
                serviceRevenue: new Prisma.Decimal(data.serviceRevenueInc || 0),
                retailRevenue: new Prisma.Decimal(data.retailRevenueInc || 0),
                commissionEarned: new Prisma.Decimal(data.commissionEarnedInc || 0),
                utilizationPercentage: new Prisma.Decimal(data.utilizationPercentage || 0),
            },
            update: {
                appointments: { increment: data.appointmentsInc || 0 },
                completedServices: { increment: data.completedServicesInc || 0 },
                serviceRevenue: { increment: data.serviceRevenueInc || 0 },
                retailRevenue: { increment: data.retailRevenueInc || 0 },
                commissionEarned: { increment: data.commissionEarnedInc || 0 },
                utilizationPercentage: data.utilizationPercentage !== undefined ? new Prisma.Decimal(data.utilizationPercentage) : undefined,
            },
        });
    }
    static async upsertFranchiseDailyMetrics(data) {
        const dateOnly = new Date(data.metricDate.toISOString().split('T')[0]);
        return prisma.franchiseDailyMetrics.upsert({
            where: {
                franchiseId_metricDate: {
                    franchiseId: data.franchiseId,
                    metricDate: dateOnly,
                },
            },
            create: {
                tenantId: data.tenantId,
                franchiseId: data.franchiseId,
                metricDate: dateOnly,
                grossSales: new Prisma.Decimal(data.grossSalesInc || 0),
                netSales: new Prisma.Decimal(data.netSalesInc || 0),
                royaltyAccrued: new Prisma.Decimal(data.royaltyAccruedInc || 0),
                royaltyPaid: new Prisma.Decimal(data.royaltyPaidInc || 0),
            },
            update: {
                grossSales: { increment: data.grossSalesInc || 0 },
                netSales: { increment: data.netSalesInc || 0 },
                royaltyAccrued: { increment: data.royaltyAccruedInc || 0 },
                royaltyPaid: { increment: data.royaltyPaidInc || 0 },
            },
        });
    }
    static async upsertInventoryDailyMetrics(data) {
        const dateOnly = new Date(data.metricDate.toISOString().split('T')[0]);
        return prisma.inventoryDailyMetrics.upsert({
            where: {
                branchId_metricDate: {
                    branchId: data.branchId,
                    metricDate: dateOnly,
                },
            },
            create: {
                tenantId: data.tenantId,
                branchId: data.branchId,
                metricDate: dateOnly,
                inventoryValue: new Prisma.Decimal(data.inventoryValue || 0),
                lowStockCount: data.lowStockCountInc || 0,
                outOfStockCount: data.outOfStockCountInc || 0,
                purchaseValue: new Prisma.Decimal(data.purchaseValueInc || 0),
                consumptionValue: new Prisma.Decimal(data.consumptionValueInc || 0),
            },
            update: {
                inventoryValue: data.inventoryValue !== undefined ? new Prisma.Decimal(data.inventoryValue) : undefined,
                lowStockCount: { increment: data.lowStockCountInc || 0 },
                outOfStockCount: { increment: data.outOfStockCountInc || 0 },
                purchaseValue: { increment: data.purchaseValueInc || 0 },
                consumptionValue: { increment: data.consumptionValueInc || 0 },
            },
        });
    }
    static async upsertCallCenterDailyMetrics(data) {
        const dateOnly = new Date(data.metricDate.toISOString().split('T')[0]);
        return prisma.callCenterDailyMetrics.upsert({
            where: {
                tenantId_agentUserId_metricDate: {
                    tenantId: data.tenantId,
                    agentUserId: data.agentUserId || '00000000-0000-0000-0000-000000000000',
                    metricDate: dateOnly,
                },
            },
            create: {
                tenantId: data.tenantId,
                agentUserId: data.agentUserId || '00000000-0000-0000-0000-000000000000',
                metricDate: dateOnly,
                calls: data.callsInc || 0,
                answered: data.answeredInc || 0,
                missed: data.missedInc || 0,
                appointmentsBooked: data.appointmentsBookedInc || 0,
                leadsCreated: data.leadsCreatedInc || 0,
                conversionRate: data.callsInc && data.appointmentsBookedInc
                    ? new Prisma.Decimal((data.appointmentsBookedInc / data.callsInc) * 100)
                    : new Prisma.Decimal(0),
            },
            update: {
                calls: { increment: data.callsInc || 0 },
                answered: { increment: data.answeredInc || 0 },
                missed: { increment: data.missedInc || 0 },
                appointmentsBooked: { increment: data.appointmentsBookedInc || 0 },
                leadsCreated: { increment: data.leadsCreatedInc || 0 },
            },
        });
    }
    static async getBranchMetrics(tenantId, branchId, startDate, endDate) {
        const where = { tenantId };
        if (branchId)
            where.branchId = branchId;
        if (startDate || endDate) {
            where.metricDate = {};
            if (startDate)
                where.metricDate.gte = startDate;
            if (endDate)
                where.metricDate.lte = endDate;
        }
        return prisma.dailyBranchMetrics.findMany({
            where,
            orderBy: { metricDate: 'desc' },
        });
    }
    static async getTenantMetrics(tenantId, startDate, endDate) {
        const where = { tenantId };
        if (startDate || endDate) {
            where.metricDate = {};
            if (startDate)
                where.metricDate.gte = startDate;
            if (endDate)
                where.metricDate.lte = endDate;
        }
        return prisma.tenantDailyMetrics.findMany({
            where,
            orderBy: { metricDate: 'desc' },
        });
    }
    static async getStaffMetrics(tenantId, branchId, startDate, endDate) {
        const where = { tenantId };
        if (branchId)
            where.branchId = branchId;
        if (startDate || endDate) {
            where.metricDate = {};
            if (startDate)
                where.metricDate.gte = startDate;
            if (endDate)
                where.metricDate.lte = endDate;
        }
        return prisma.staffPerformanceDaily.findMany({
            where,
            orderBy: { metricDate: 'desc' },
        });
    }
    static async getFranchiseMetrics(tenantId, franchiseId, startDate, endDate) {
        const where = { tenantId, franchiseId };
        if (startDate || endDate) {
            where.metricDate = {};
            if (startDate)
                where.metricDate.gte = startDate;
            if (endDate)
                where.metricDate.lte = endDate;
        }
        return prisma.franchiseDailyMetrics.findMany({
            where,
            orderBy: { metricDate: 'desc' },
        });
    }
    static async getInventoryMetrics(tenantId, branchId, startDate, endDate) {
        const where = { tenantId };
        if (branchId)
            where.branchId = branchId;
        if (startDate || endDate) {
            where.metricDate = {};
            if (startDate)
                where.metricDate.gte = startDate;
            if (endDate)
                where.metricDate.lte = endDate;
        }
        return prisma.inventoryDailyMetrics.findMany({
            where,
            orderBy: { metricDate: 'desc' },
        });
    }
    static async getCallCenterMetrics(tenantId, startDate, endDate) {
        const where = { tenantId };
        if (startDate || endDate) {
            where.metricDate = {};
            if (startDate)
                where.metricDate.gte = startDate;
            if (endDate)
                where.metricDate.lte = endDate;
        }
        return prisma.callCenterDailyMetrics.findMany({
            where,
            orderBy: { metricDate: 'desc' },
        });
    }
    static async getSuperAdminPlatformMetrics() {
        const [allTenantDaily, allBranchDaily] = await Promise.all([
            prisma.tenantDailyMetrics.findMany({
                orderBy: { metricDate: 'desc' },
                take: 30,
            }),
            prisma.dailyBranchMetrics.findMany({
                orderBy: { metricDate: 'desc' },
                take: 100,
            }),
        ]);
        const totalTenants = new Set(allTenantDaily.map((m) => m.tenantId)).size || 1;
        const totalRevenue = allTenantDaily.reduce((acc, curr) => acc + Number(curr.grossRevenue), 0);
        const totalBookings = allTenantDaily.reduce((acc, curr) => acc + curr.bookings, 0);
        return {
            activeTenantsCount: totalTenants,
            mrr: totalRevenue,
            platformBookings: totalBookings,
            systemHealth: '100% OPERATIONAL',
            recentMetrics: allTenantDaily.slice(0, 10),
        };
    }
}
