import { createLogger } from '@salon-spa-saas/logger';
import { MetricsRepository } from '../../infrastructure/repositories/metrics.repository';
import { AuditRepository } from '../../infrastructure/repositories/audit.repository';
import { ReportingReadStore } from '../../infrastructure/redis/reporting-read.store';

const logger = createLogger('reporting-service:consumer');

export interface DomainEventEnvelope<T = Record<string, unknown>> {
  eventId: string;
  eventType: string;
  eventVersion: string;
  occurredAt: string;
  tenantId?: string;
  branchId?: string;
  franchiseId?: string;
  actorUserId?: string;
  principalType?: string;
  correlationId: string;
  causationId?: string;
  aggregateType: string;
  aggregateId: string;
  payload: T;
}

export class ReportingConsumerService {
  public static async processEvent(event: DomainEventEnvelope): Promise<void> {
    const occurredDate = event.occurredAt ? new Date(event.occurredAt) : new Date();

    // 1. Record Append-Only Audit Event
    try {
      await AuditRepository.createAuditEvent({
        eventId: event.eventId,
        tenantId: event.tenantId,
        branchId: event.branchId,
        franchiseId: event.franchiseId,
        principalType: event.principalType,
        actorUserId: event.actorUserId,
        action: event.eventType,
        entityType: event.aggregateType,
        entityId: event.aggregateId,
        correlationId: event.correlationId,
        afterJson: event.payload,
        occurredAt: occurredDate,
      });
    } catch (err) {
      logger.warn(`Failed to record audit event for ${event.eventId}: ${(err as Error).message}`);
    }

    // 2. Reduce event into Projections
    try {
      switch (event.eventType) {
        case 'TENANT_PROVISIONED.v1': {
          if (event.tenantId) {
            await MetricsRepository.upsertTenantDailyMetrics({
              tenantId: event.tenantId,
              metricDate: occurredDate,
              branchCount: 1,
            });
            await ReportingReadStore.invalidatePlatformDashboard();
          }
          break;
        }

        case 'CUSTOMER_CREATED.v1': {
          if (event.tenantId) {
            await MetricsRepository.upsertTenantDailyMetrics({
              tenantId: event.tenantId,
              metricDate: occurredDate,
              newCustomersInc: 1,
            });
            if (event.branchId) {
              await MetricsRepository.upsertDailyBranchMetrics({
                tenantId: event.tenantId,
                branchId: event.branchId,
                metricDate: occurredDate,
                newCustomersInc: 1,
                customerCountInc: 1,
              });
            }
            await ReportingReadStore.invalidateTenantDashboard(event.tenantId);
          }
          break;
        }

        case 'APPOINTMENT_CREATED.v1': {
          if (event.tenantId) {
            await MetricsRepository.upsertTenantDailyMetrics({
              tenantId: event.tenantId,
              metricDate: occurredDate,
              bookingsInc: 1,
            });
            if (event.branchId) {
              await MetricsRepository.upsertDailyBranchMetrics({
                tenantId: event.tenantId,
                branchId: event.branchId,
                metricDate: occurredDate,
                appointmentsBookedInc: 1,
              });
            }
            await ReportingReadStore.invalidateTenantDashboard(event.tenantId);
          }
          break;
        }

        case 'APPOINTMENT_COMPLETED.v1': {
          const payload = event.payload as { employeeId?: string; staffId?: string };
          const employeeId = payload.employeeId || payload.staffId;

          if (event.tenantId) {
            await MetricsRepository.upsertTenantDailyMetrics({
              tenantId: event.tenantId,
              metricDate: occurredDate,
              completedServicesInc: 1,
            });
            if (event.branchId) {
              await MetricsRepository.upsertDailyBranchMetrics({
                tenantId: event.tenantId,
                branchId: event.branchId,
                metricDate: occurredDate,
                appointmentsCompletedInc: 1,
              });
            }
            if (event.branchId && employeeId) {
              await MetricsRepository.upsertStaffPerformanceDaily({
                tenantId: event.tenantId,
                branchId: event.branchId,
                employeeId,
                metricDate: occurredDate,
                appointmentsInc: 1,
                completedServicesInc: 1,
              });
            }
            await ReportingReadStore.invalidateTenantDashboard(event.tenantId);
          }
          break;
        }

        case 'APPOINTMENT_CANCELLED.v1': {
          if (event.tenantId && event.branchId) {
            await MetricsRepository.upsertDailyBranchMetrics({
              tenantId: event.tenantId,
              branchId: event.branchId,
              metricDate: occurredDate,
              appointmentsCancelledInc: 1,
            });
            await ReportingReadStore.invalidateTenantDashboard(event.tenantId);
          }
          break;
        }

        case 'SALE_COMPLETED.v1': {
          const payload = event.payload as {
            totalAmount?: number;
            grandTotal?: number;
            netAmount?: number;
            taxAmount?: number;
            serviceAmount?: number;
            productAmount?: number;
            employeeId?: string;
          };

          const gross = Number(payload.grandTotal || payload.totalAmount || 0);
          const net = Number(payload.netAmount || gross);
          const tax = Number(payload.taxAmount || 0);
          const service = Number(payload.serviceAmount || gross);
          const retail = Number(payload.productAmount || 0);

          if (event.tenantId) {
            await MetricsRepository.upsertTenantDailyMetrics({
              tenantId: event.tenantId,
              metricDate: occurredDate,
              grossRevenueInc: gross,
              netRevenueInc: net,
            });

            if (event.branchId) {
              await MetricsRepository.upsertDailyBranchMetrics({
                tenantId: event.tenantId,
                branchId: event.branchId,
                metricDate: occurredDate,
                grossSalesInc: gross,
                netSalesInc: net,
                taxCollectedInc: tax,
                serviceRevenueInc: service,
                retailRevenueInc: retail,
              });
            }

            if (event.branchId && payload.employeeId) {
              await MetricsRepository.upsertStaffPerformanceDaily({
                tenantId: event.tenantId,
                branchId: event.branchId,
                employeeId: payload.employeeId,
                metricDate: occurredDate,
                serviceRevenueInc: service,
                retailRevenueInc: retail,
              });
            }

            if (event.franchiseId) {
              await MetricsRepository.upsertFranchiseDailyMetrics({
                tenantId: event.tenantId,
                franchiseId: event.franchiseId,
                metricDate: occurredDate,
                grossSalesInc: gross,
                netSalesInc: net,
              });
            }

            await ReportingReadStore.invalidateTenantDashboard(event.tenantId);
          }
          break;
        }

        case 'STOCK_LOW.v1': {
          if (event.tenantId && event.branchId) {
            await MetricsRepository.upsertInventoryDailyMetrics({
              tenantId: event.tenantId,
              branchId: event.branchId,
              metricDate: occurredDate,
              lowStockCountInc: 1,
            });
            await MetricsRepository.upsertTenantDailyMetrics({
              tenantId: event.tenantId,
              metricDate: occurredDate,
              inventoryAlertsInc: 1,
            });
            await ReportingReadStore.invalidateTenantDashboard(event.tenantId);
          }
          break;
        }

        case 'STOCK_RECEIVED.v1': {
          const payload = event.payload as { totalCost?: number };
          const purchaseVal = Number(payload.totalCost || 0);
          if (event.tenantId && event.branchId) {
            await MetricsRepository.upsertInventoryDailyMetrics({
              tenantId: event.tenantId,
              branchId: event.branchId,
              metricDate: occurredDate,
              purchaseValueInc: purchaseVal,
            });
          }
          break;
        }

        case 'STOCK_CONSUMED.v1': {
          const payload = event.payload as { totalCost?: number };
          const consumedVal = Number(payload.totalCost || 0);
          if (event.tenantId && event.branchId) {
            await MetricsRepository.upsertInventoryDailyMetrics({
              tenantId: event.tenantId,
              branchId: event.branchId,
              metricDate: occurredDate,
              consumptionValueInc: consumedVal,
            });
          }
          break;
        }

        case 'COMMISSION_CALCULATED.v1': {
          const payload = event.payload as { employeeId: string; commissionAmount: number };
          if (event.tenantId && event.branchId && payload.employeeId) {
            await MetricsRepository.upsertStaffPerformanceDaily({
              tenantId: event.tenantId,
              branchId: event.branchId,
              employeeId: payload.employeeId,
              metricDate: occurredDate,
              commissionEarnedInc: Number(payload.commissionAmount || 0),
            });
          }
          break;
        }

        case 'FRANCHISE_ROYALTY_CALCULATED.v1': {
          const payload = event.payload as { royaltyAmount: number };
          if (event.tenantId && event.franchiseId) {
            await MetricsRepository.upsertFranchiseDailyMetrics({
              tenantId: event.tenantId,
              franchiseId: event.franchiseId,
              metricDate: occurredDate,
              royaltyAccruedInc: Number(payload.royaltyAmount || 0),
            });
          }
          break;
        }

        case 'FRANCHISE_SETTLEMENT_PAID.v1': {
          const payload = event.payload as { totalPayable: number };
          if (event.tenantId && event.franchiseId) {
            await MetricsRepository.upsertFranchiseDailyMetrics({
              tenantId: event.tenantId,
              franchiseId: event.franchiseId,
              metricDate: occurredDate,
              royaltyPaidInc: Number(payload.totalPayable || 0),
            });
          }
          break;
        }

        case 'CALL_COMPLETED.v1': {
          const payload = event.payload as { agentIdentityUserId?: string; durationSeconds?: number; disposition?: string };
          if (event.tenantId) {
            await MetricsRepository.upsertCallCenterDailyMetrics({
              tenantId: event.tenantId,
              agentUserId: payload.agentIdentityUserId || null,
              metricDate: occurredDate,
              callsInc: 1,
              answeredInc: (payload.durationSeconds && payload.durationSeconds > 0) ? 1 : 0,
              missedInc: (!payload.durationSeconds || payload.durationSeconds === 0) ? 1 : 0,
              appointmentsBookedInc: payload.disposition === 'BOOKED' ? 1 : 0,
              leadsCreatedInc: payload.disposition === 'LEAD_CREATED' ? 1 : 0,
            });
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      logger.error(`Error applying event ${event.eventType} to projections: ${(err as Error).message}`);
    }
  }
}
