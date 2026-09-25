export interface ChartOfAccountDto {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  parentAccountId?: string | null;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryDto {
  id: string;
  tenantId: string;
  branchId?: string | null;
  journalNumber: string;
  entryDate: string;
  sourceType: string;
  sourceId?: string | null;
  description?: string | null;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
  lines: Array<{
    id: string;
    accountId: string;
    accountCode?: string;
    accountName?: string;
    debit: number;
    credit: number;
    description?: string | null;
  }>;
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  postedAt?: string | null;
}

export interface CommissionRuleDto {
  id: string;
  tenantId: string;
  name: string;
  ruleType: string;
  appliesToBranchId?: string | null;
  appliesToEmployeeId?: string | null;
  appliesToServiceId?: string | null;
  calculationType: 'PERCENTAGE' | 'FIXED' | 'TIERED' | 'HYBRID';
  percentage?: number | null;
  fixedAmount?: number | null;
  thresholdJson?: any;
  effectiveFrom: string;
  effectiveTo?: string | null;
  priority: number;
  version: number;
  isActive: boolean;
}

export interface CommissionTransactionDto {
  id: string;
  tenantId: string;
  branchId: string;
  employeeId: string;
  saleId: string;
  invoiceId: string;
  eligibleAmount: number;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAYABLE' | 'PAID' | 'REVERSED';
  earnedAt: string;
}

export interface PayrollRunDto {
  id: string;
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'CANCELLED';
  grossTotal: number;
  deductionTotal: number;
  netTotal: number;
  employees: Array<{
    id: string;
    employeeId: string;
    baseSalary: number;
    attendanceAdjustment: number;
    overtimeAmount: number;
    commissionAmount: number;
    tipAmount: number;
    bonusAmount: number;
    deductionAmount: number;
    grossPay: number;
    netPay: number;
    status: string;
  }>;
  createdAt: string;
  completedAt?: string | null;
}

export interface RoyaltyRuleDto {
  id: string;
  tenantId: string;
  franchiseId?: string | null;
  name: string;
  calculationType: 'PERCENTAGE' | 'FIXED' | 'TIERED' | 'HYBRID';
  percentage?: number | null;
  fixedAmount?: number | null;
  revenueBasis: 'GROSS_SALES' | 'NET_SALES' | 'SERVICE_REVENUE' | 'SELECTED_CATEGORIES';
  effectiveFrom: string;
  effectiveTo?: string | null;
  priority: number;
  version: number;
  isActive: boolean;
}

export interface FranchiseSettlementDto {
  id: string;
  tenantId: string;
  franchiseId: string;
  periodStart: string;
  periodEnd: string;
  grossEligibleRevenue: number;
  royaltyAmount: number;
  adjustmentAmount: number;
  totalPayable: number;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueAt?: string | null;
  paidAt?: string | null;
  paymentReferenceId?: string | null;
  createdAt: string;
}
