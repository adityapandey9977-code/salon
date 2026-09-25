import { MetricsRepository } from '../../infrastructure/repositories/metrics.repository';
import { ExportRepository } from '../../infrastructure/repositories/export.repository';

export class ReportService {
  public static async getExecutiveSummary(tenantId: string, _dateRange = '30d') {
    const tenantMetrics = await MetricsRepository.getTenantMetrics(tenantId);
    const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId);

    const totalRevenue = branchMetrics.reduce((sum, m) => sum + Number(m.grossSales), 0);
    const totalBookings = branchMetrics.reduce((sum, m) => sum + m.appointmentsBooked, 0);
    const completedAppointments = branchMetrics.reduce((sum, m) => sum + m.appointmentsCompleted, 0);
    const totalNewCustomers = tenantMetrics.reduce((sum, m) => sum + m.newCustomers, 0);

    return {
      title: 'Executive Business Summary',
      generatedAt: new Date().toISOString(),
      kpis: {
        totalRevenue,
        totalBookings,
        completedAppointments,
        totalNewCustomers,
        averageTicketValue: completedAppointments > 0 ? (totalRevenue / completedAppointments).toFixed(2) : '0.00',
      },
      topBranches: branchMetrics.slice(0, 5).map((b) => ({
        branchId: b.branchId,
        revenue: Number(b.grossSales),
        appointments: b.appointmentsCompleted,
      })),
    };
  }

  public static async getOperationsReport(tenantId: string, branchId?: string, _dateRange = '30d') {
    const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId, branchId);
    return {
      title: 'Operations Performance Report',
      metrics: branchMetrics.map((m) => ({
        date: m.metricDate.toISOString().split('T')[0],
        branchId: m.branchId,
        booked: m.appointmentsBooked,
        completed: m.appointmentsCompleted,
        cancelled: m.appointmentsCancelled,
        noShows: m.noShows,
      })),
    };
  }

  public static async getRevenueReport(tenantId: string, branchId?: string, _dateRange = '30d') {
    const branchMetrics = await MetricsRepository.getBranchMetrics(tenantId, branchId);
    return {
      title: 'Revenue & Tax Report',
      items: branchMetrics.map((m) => ({
        date: m.metricDate.toISOString().split('T')[0],
        branchId: m.branchId,
        grossSales: Number(m.grossSales),
        netSales: Number(m.netSales),
        taxCollected: Number(m.taxCollected),
        serviceRevenue: Number(m.serviceRevenue),
        retailRevenue: Number(m.retailRevenue),
      })),
    };
  }

  public static async getStaffReport(tenantId: string, branchId?: string, _dateRange = '30d') {
    const staffMetrics = await MetricsRepository.getStaffMetrics(tenantId, branchId);
    return {
      title: 'Staff Productivity & Commission Report',
      staff: staffMetrics.map((s) => ({
        employeeId: s.employeeId,
        branchId: s.branchId,
        date: s.metricDate.toISOString().split('T')[0],
        appointments: s.appointments,
        completedServices: s.completedServices,
        serviceRevenue: Number(s.serviceRevenue),
        retailRevenue: Number(s.retailRevenue),
        commissionEarned: Number(s.commissionEarned),
        utilizationPercentage: Number(s.utilizationPercentage),
      })),
    };
  }

  public static async getBranchEodReport(tenantId: string, branchId: string, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const metrics = await MetricsRepository.getBranchMetrics(tenantId, branchId, targetDate, targetDate);
    const m = metrics[0];

    return {
      branchId,
      date: targetDate.toISOString().split('T')[0],
      totalAppointments: m ? m.appointmentsCompleted : 0,
      grossSales: m ? Number(m.grossSales) : 0,
      netSales: m ? Number(m.netSales) : 0,
      taxCollected: m ? Number(m.taxCollected) : 0,
      serviceRevenue: m ? Number(m.serviceRevenue) : 0,
      retailRevenue: m ? Number(m.retailRevenue) : 0,
      newClients: m ? m.newCustomers : 0,
    };
  }

  public static async getStylistProductivityReport(tenantId: string, branchId?: string, _dateRange = '30d') {
    return this.getStaffReport(tenantId, branchId, _dateRange);
  }

  public static async requestExport(tenantId: string, requestedByUserId?: string, reportType = 'EXECUTIVE_SUMMARY', parameters?: Record<string, unknown>) {
    const job = await ExportRepository.createExportJob({
      tenantId,
      requestedByUserId,
      reportType,
      parameters,
    });

    return {
      jobId: job.id,
      status: job.status,
      reportType: job.reportType,
      fileUrl: job.fileUrl,
      completedAt: job.completedAt,
    };
  }

  public static async requestBranchExport(tenantId: string, branchId: string, requestedByUserId?: string, reportType = 'BRANCH_EOD', parameters?: Record<string, unknown>) {
    return this.requestExport(tenantId, requestedByUserId, reportType, { ...parameters, branchId });
  }
}
