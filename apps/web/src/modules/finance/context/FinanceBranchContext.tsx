import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface FinanceBranchInfo {
  id: string;
  code: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  gstin: string;
  isCentralHub?: boolean;
  todayRevenue: string;
  todayReceiptsCount: number;
  todayRefunds: string;
  cashInDrawer: string;
  grossProfitMargin: string;
  pendingSettlements: string;
  monthlyPayrollTotal: string;
  activeStaffCount: number;
  commissionsEarned: string;
  netGstPayable: string;
  leadAccountant: string;
}

export const FINANCE_BRANCHES_DATA: FinanceBranchInfo[] = [
  {
    id: 'all',
    code: 'HQ-ALL',
    name: 'All Branches (Enterprise Chain Consolidated)',
    shortName: 'All Branches',
    city: 'Pan-India',
    state: 'Multiple States',
    gstin: '27AABCS1429B1Z8 (Multi-GSTIN Network)',
    todayRevenue: '₹2,45,800',
    todayReceiptsCount: 48,
    todayRefunds: '₹1,500',
    cashInDrawer: '₹1,95,000',
    grossProfitMargin: '34.2%',
    pendingSettlements: '₹8,50,000',
    monthlyPayrollTotal: '₹24,80,000',
    activeStaffCount: 64,
    commissionsEarned: '₹4,20,000',
    netGstPayable: '₹3,74,200',
    leadAccountant: 'Vikramaditya S. (CFO / Financial Controller)',
  },
  {
    id: 'mumbai',
    code: 'BOM-BD01',
    name: 'Bandra West Flagship (Mumbai)',
    shortName: 'Mumbai - Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    gstin: '27AABCS1429B1Z8',
    todayRevenue: '₹88,400',
    todayReceiptsCount: 18,
    todayRefunds: '₹500',
    cashInDrawer: '₹62,400',
    grossProfitMargin: '36.8%',
    pendingSettlements: '₹3,20,000',
    monthlyPayrollTotal: '₹8,40,000',
    activeStaffCount: 22,
    commissionsEarned: '₹1,54,000',
    netGstPayable: '₹1,34,800',
    leadAccountant: 'Vikram Kulkarni (Senior Cashier & Store Lead)',
  },
  {
    id: 'delhi',
    code: 'DEL-SX02',
    name: 'South Extension II (Delhi NCR)',
    shortName: 'Delhi - South Ext II',
    city: 'New Delhi',
    state: 'Delhi',
    gstin: '07AABCS1429B1Z4',
    todayRevenue: '₹64,200',
    todayReceiptsCount: 14,
    todayRefunds: '₹1,000',
    cashInDrawer: '₹48,200',
    grossProfitMargin: '33.5%',
    pendingSettlements: '₹2,45,000',
    monthlyPayrollTotal: '₹6,80,000',
    activeStaffCount: 18,
    commissionsEarned: '₹1,12,000',
    netGstPayable: '₹97,800',
    leadAccountant: 'Pooja Kashyap (Branch Accountant)',
  },
  {
    id: 'bangalore',
    code: 'BLR-IN03',
    name: 'Indiranagar Atelier (Bangalore)',
    shortName: 'Bangalore - Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    gstin: '29AABCS1429B1Z0',
    todayRevenue: '₹52,800',
    todayReceiptsCount: 11,
    todayRefunds: '₹0',
    cashInDrawer: '₹44,000',
    grossProfitMargin: '35.1%',
    pendingSettlements: '₹1,85,000',
    monthlyPayrollTotal: '₹5,20,000',
    activeStaffCount: 14,
    commissionsEarned: '₹88,000',
    netGstPayable: '₹80,600',
    leadAccountant: 'Kavita Sundaram (Branch Accountant)',
  },
  {
    id: 'hyderabad',
    code: 'HYD-JH04',
    name: 'Jubilee Hills Wellness (Hyderabad)',
    shortName: 'Hyderabad - Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    gstin: '36AABCS1429B1Z5',
    todayRevenue: '₹40,400',
    todayReceiptsCount: 5,
    todayRefunds: '₹0',
    cashInDrawer: '₹32,400',
    grossProfitMargin: '31.4%',
    pendingSettlements: '₹1,00,000',
    monthlyPayrollTotal: '₹3,90,000',
    activeStaffCount: 10,
    commissionsEarned: '₹66,000',
    netGstPayable: '₹61,000',
    leadAccountant: 'Suresh Varma (Cashier & Admin)',
  },
  {
    id: 'central-hub',
    code: 'HUB-BHW01',
    name: 'Central Logistics & Supply Hub (Bhiwandi)',
    shortName: 'Central Logistics Hub',
    city: 'Bhiwandi',
    state: 'Maharashtra',
    gstin: '27AABCS1429B1Z8',
    isCentralHub: true,
    todayRevenue: '₹0 (Depot / Supply)',
    todayReceiptsCount: 0,
    todayRefunds: '₹0',
    cashInDrawer: '₹8,000',
    grossProfitMargin: 'N/A (Cost Center)',
    pendingSettlements: '₹0',
    monthlyPayrollTotal: '₹50,000',
    activeStaffCount: 4,
    commissionsEarned: '₹0',
    netGstPayable: '₹0 (Inter-Unit Supply)',
    leadAccountant: 'Gaurav Patil (Depot Supervisor)',
  },
];

export type FinanceRole = 'corporate' | 'branch' | 'hr' | 'manager';

interface FinanceBranchContextType {
  branches: FinanceBranchInfo[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  selectedBranch: FinanceBranchInfo;
  isAllBranches: boolean;
  userRole: FinanceRole;
  setUserRole: (role: FinanceRole) => void;
}

const FinanceBranchContext = createContext<FinanceBranchContextType | undefined>(undefined);

export function FinanceBranchProvider({ children }: { children: React.ReactNode }) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    return localStorage.getItem('digiflex_finance_branch_id') || 'all';
  });

  const [userRole, setUserRole] = useState<FinanceRole>(() => {
    return (localStorage.getItem('digiflex_finance_user_role') as FinanceRole) || 'corporate';
  });

  useEffect(() => {
    localStorage.setItem('digiflex_finance_branch_id', selectedBranchId);
  }, [selectedBranchId]);

  useEffect(() => {
    localStorage.setItem('digiflex_finance_user_role', userRole);
  }, [userRole]);

  const selectedBranch =
    FINANCE_BRANCHES_DATA.find((b) => b.id === selectedBranchId) || FINANCE_BRANCHES_DATA[0];

  const isAllBranches = selectedBranchId === 'all';

  return (
    <FinanceBranchContext.Provider
      value={{
        branches: FINANCE_BRANCHES_DATA,
        selectedBranchId,
        setSelectedBranchId,
        selectedBranch,
        isAllBranches,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </FinanceBranchContext.Provider>
  );
}

export function useFinanceBranch() {
  const context = useContext(FinanceBranchContext);
  if (!context) {
    throw new Error('useFinanceBranch must be used within a FinanceBranchProvider');
  }
  return context;
}
