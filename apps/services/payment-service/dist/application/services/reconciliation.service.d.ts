import type { SettlementReconciliationDto } from '../../domain/entities/payment.dto';
export declare class ReconciliationService {
    reconcile(tenantId: string, data: {
        provider: string;
        settlementDate: string;
        totalAmount: number;
        feeAmount?: number;
        taxAmount?: number;
        netAmount: number;
    }, userId?: string | null): Promise<SettlementReconciliationDto>;
    listSettlements(tenantId: string): Promise<SettlementReconciliationDto[]>;
}
export declare const reconciliationService: ReconciliationService;
//# sourceMappingURL=reconciliation.service.d.ts.map