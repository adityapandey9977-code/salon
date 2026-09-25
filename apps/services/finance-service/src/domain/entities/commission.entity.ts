export interface CommissionLedgerEntity {
  id: string;
  tenantId: string;
  branchId: string;
  staffId: string;
  invoiceId: string;
  itemType: string;
  baseAmount: number;
  commissionRate: number;
  commissionEarned: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  periodMonth: string;
  createdAt: Date;
}
