import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface BranchInfo {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  type:
    | 'Enterprise Consolidated'
    | 'Direct Flagship'
    | 'Direct Branch'
    | 'Franchise Partner'
    | 'Main Depot';
  valuation: string;
  valuationNum: number;
  lowStockCount: number;
  criticalLowCount: number;
  expiringCount: number;
  transfersCount: number;
  skusCount: number;
  consumptionToday: string;
  purchasesToday: string;
  wastageToday: string;
  wastagePct: string;
  manager: string;
  phone: string;
  address: string;
}

export const BRANCHES_DATA: BranchInfo[] = [
  {
    id: 'all',
    name: 'All Branches (Enterprise Chain Overview)',
    shortName: 'All Branches',
    code: 'HQ-ALL',
    city: 'Pan-India (5 Outlets + Central Hub)',
    type: 'Enterprise Consolidated',
    valuation: '₹48,92,400',
    valuationNum: 4892400,
    lowStockCount: 14,
    criticalLowCount: 6,
    expiringCount: 8,
    transfersCount: 4,
    skusCount: 420,
    consumptionToday: '₹58,400',
    purchasesToday: '₹1,85,000',
    wastageToday: '₹3,420',
    wastagePct: '1.7%',
    manager: 'Vikram Kulkarni (Enterprise Director)',
    phone: '+91 98201 99882',
    address: 'Corporate HQ & Multi-Outlet Network, Mumbai & NCR',
  },
  {
    id: 'mumbai',
    name: 'Bandra West Flagship Salon',
    shortName: 'Mumbai (Bandra)',
    code: 'BOM-BD01',
    city: 'Mumbai, MH',
    type: 'Direct Flagship',
    valuation: '₹12,45,000',
    valuationNum: 1245000,
    lowStockCount: 8,
    criticalLowCount: 3,
    expiringCount: 4,
    transfersCount: 2,
    skusCount: 310,
    consumptionToday: '₹14,200',
    purchasesToday: '₹42,500',
    wastageToday: '₹850',
    wastagePct: '1.8%',
    manager: 'Rohit Verma (Store Lead)',
    phone: '+91 98204 11223',
    address: 'Hill Road, Bandra West, Mumbai 400050',
  },
  {
    id: 'delhi',
    name: 'South Extension II Luxury Salon',
    shortName: 'Delhi (South Ex)',
    code: 'DEL-SX02',
    city: 'New Delhi, DL',
    type: 'Direct Branch',
    valuation: '₹14,20,800',
    valuationNum: 1420800,
    lowStockCount: 2,
    criticalLowCount: 1,
    expiringCount: 1,
    transfersCount: 1,
    skusCount: 340,
    consumptionToday: '₹18,600',
    purchasesToday: '₹65,000',
    wastageToday: '₹980',
    wastagePct: '1.4%',
    manager: 'Pooja Kashyap (Floor Lead)',
    phone: '+91 98112 33445',
    address: 'Block F, South Extension Part II, New Delhi 110049',
  },
  {
    id: 'bangalore',
    name: 'Indiranagar Atelier & Spa',
    shortName: 'Bangalore (Indiranagar)',
    code: 'BLR-IN03',
    city: 'Bengaluru, KA',
    type: 'Franchise Partner',
    valuation: '₹9,84,500',
    valuationNum: 984500,
    lowStockCount: 3,
    criticalLowCount: 1,
    expiringCount: 2,
    transfersCount: 1,
    skusCount: 280,
    consumptionToday: '₹12,800',
    purchasesToday: '₹38,000',
    wastageToday: '₹720',
    wastagePct: '1.6%',
    manager: 'Kavita Menon (Ops Manager)',
    phone: '+91 98450 77889',
    address: '100 Feet Road, Indiranagar, Bengaluru 560038',
  },
  {
    id: 'hyderabad',
    name: 'Jubilee Hills Wellness Suite',
    shortName: 'Hyderabad (Jubilee)',
    code: 'HYD-JH04',
    city: 'Hyderabad, TS',
    type: 'Franchise Partner',
    valuation: '₹7,92,100',
    valuationNum: 792100,
    lowStockCount: 1,
    criticalLowCount: 1,
    expiringCount: 1,
    transfersCount: 0,
    skusCount: 245,
    consumptionToday: '₹9,200',
    purchasesToday: '₹22,000',
    wastageToday: '₹510',
    wastagePct: '1.5%',
    manager: 'Suresh Reddy (Storekeeper)',
    phone: '+91 99490 12345',
    address: 'Road No. 36, Jubilee Hills, Hyderabad 500033',
  },
  {
    id: 'central-hub',
    name: 'Central Logistics & Supply Hub',
    shortName: 'Central Hub (Bhiwandi)',
    code: 'HUB-BHW01',
    city: 'Bhiwandi Logistics Park, MH',
    type: 'Main Depot',
    valuation: '₹4,50,000',
    valuationNum: 450000,
    lowStockCount: 0,
    criticalLowCount: 0,
    expiringCount: 0,
    transfersCount: 3,
    skusCount: 420,
    consumptionToday: '₹3,600',
    purchasesToday: '₹17,500',
    wastageToday: '₹360',
    wastagePct: '0.8%',
    manager: 'Anand Shinde (Warehouse Chief)',
    phone: '+91 98230 45678',
    address: 'Sector 4, Bhiwandi Industrial Warehouse Park, Thane',
  },
];

export type UserInventoryRole = 'Enterprise HQ Controller' | 'Branch Storekeeper / Lead';

interface InventoryBranchContextType {
  branches: BranchInfo[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  selectedBranch: BranchInfo;
  isAllBranches: boolean;
  userRole: UserInventoryRole;
  setUserRole: (role: UserInventoryRole) => void;
}

const InventoryBranchContext = createContext<InventoryBranchContextType | undefined>(undefined);

export function InventoryBranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [userRole, setUserRole] = useState<UserInventoryRole>('Enterprise HQ Controller');

  const selectedBranch = BRANCHES_DATA.find((b) => b.id === selectedBranchId) || BRANCHES_DATA[0];
  const isAllBranches = selectedBranchId === 'all';

  return (
    <InventoryBranchContext.Provider
      value={{
        branches: BRANCHES_DATA,
        selectedBranchId,
        setSelectedBranchId,
        selectedBranch,
        isAllBranches,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </InventoryBranchContext.Provider>
  );
}

export function useInventoryBranch() {
  const context = useContext(InventoryBranchContext);
  if (!context) {
    throw new Error('useInventoryBranch must be used within an InventoryBranchProvider');
  }
  return context;
}
