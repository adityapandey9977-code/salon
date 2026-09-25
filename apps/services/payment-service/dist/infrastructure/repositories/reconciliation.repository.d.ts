import type { SettlementReconciliationDto } from '../../domain/entities/payment.dto';
export declare class ReconciliationRepository {
    create(data: {
        tenantId: string;
        provider: string;
        settlementDate: string;
        totalAmount: number;
        feeAmount?: number;
        taxAmount?: number;
        netAmount: number;
    }): Promise<SettlementReconciliationDto>;
    list(tenantId: string): Promise<SettlementReconciliationDto[]>;
}
export declare const reconciliationRepository: ReconciliationRepository;
//# sourceMappingURL=reconciliation.repository.d.ts.map