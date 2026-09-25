import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CallCenterRole = 'supervisor' | 'agent' | 'outbound' | 'qa';

export interface CallCenterBranch {
  id: string;
  name: string;
  shortName: string;
  code: string;
  city: string;
  state: string;
  phone: string;
  inquiriesToday: number;
  activeQueue: number;
  leadConversionRate: string;
  followUpsDue: number;
  winBackRevenue: string;
  confirmedBookingsToday: number;
  openGrievanceTickets: number;
  leadConcierge: string;
}

const CALL_CENTER_BRANCHES: CallCenterBranch[] = [
  {
    id: 'all',
    name: 'All Outlets (Chain Concierge)',
    shortName: 'All Branches',
    code: 'HQ-ALL',
    city: 'Pan-India',
    state: 'National Network',
    phone: '+91 1800 209 8800',
    inquiriesToday: 428,
    activeQueue: 4,
    leadConversionRate: '68.4%',
    followUpsDue: 12,
    winBackRevenue: '₹1,45,800',
    confirmedBookingsToday: 84,
    openGrievanceTickets: 3,
    leadConcierge: 'Rohan Arora (Head Concierge)'
  },
  {
    id: 'mumbai',
    name: 'Bandra West Flagship, Mumbai',
    shortName: 'Mumbai - Bandra West',
    code: 'BOM-BD01',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91 22 6842 1100',
    inquiriesToday: 142,
    activeQueue: 2,
    leadConversionRate: '72.1%',
    followUpsDue: 5,
    winBackRevenue: '₹58,400',
    confirmedBookingsToday: 32,
    openGrievanceTickets: 1,
    leadConcierge: 'Rohan Arora'
  },
  {
    id: 'delhi',
    name: 'South Extension II Atelier, Delhi NCR',
    shortName: 'Delhi - South Ext II',
    code: 'DEL-SX02',
    city: 'New Delhi',
    state: 'Delhi NCR',
    phone: '+91 11 4982 2200',
    inquiriesToday: 118,
    activeQueue: 1,
    leadConversionRate: '67.8%',
    followUpsDue: 3,
    winBackRevenue: '₹42,000',
    confirmedBookingsToday: 24,
    openGrievanceTickets: 1,
    leadConcierge: 'Neha Sharma'
  },
  {
    id: 'bangalore',
    name: 'Indiranagar Atelier, Bangalore',
    shortName: 'Bangalore - Indiranagar',
    code: 'BLR-IN03',
    city: 'Bengaluru',
    state: 'Karnataka',
    phone: '+91 80 4120 3300',
    inquiriesToday: 96,
    activeQueue: 1,
    leadConversionRate: '65.2%',
    followUpsDue: 2,
    winBackRevenue: '₹28,500',
    confirmedBookingsToday: 18,
    openGrievanceTickets: 1,
    leadConcierge: 'Aditi Nair'
  },
  {
    id: 'hyderabad',
    name: 'Jubilee Hills Wellness Suite, Hyderabad',
    shortName: 'Hyderabad - Jubilee Hills',
    code: 'HYD-JH04',
    city: 'Hyderabad',
    state: 'Telangana',
    phone: '+91 40 6710 4400',
    inquiriesToday: 72,
    activeQueue: 0,
    leadConversionRate: '64.0%',
    followUpsDue: 2,
    winBackRevenue: '₹16,900',
    confirmedBookingsToday: 10,
    openGrievanceTickets: 0,
    leadConcierge: 'Priya Varma'
  }
];

interface CallCenterBranchContextType {
  branches: CallCenterBranch[];
  selectedBranchId: string;
  setSelectedBranchId: (id: string) => void;
  selectedBranch: CallCenterBranch;
  isAllBranches: boolean;
  agentStatus: 'Available' | 'On Call' | 'Wrap-Up' | 'On Break' | 'Offline';
  setAgentStatus: (status: 'Available' | 'On Call' | 'Wrap-Up' | 'On Break' | 'Offline') => void;
  activeCall: {
    inProgress: boolean;
    callerName: string;
    callerPhone: string;
    durationSeconds: number;
    vipTier: string;
    walletBalance: string;
    allergies: string;
    preferredBranch: string;
    preferredStylist: string;
  } | null;
  startInboundCall: (caller: {
    callerName: string;
    callerPhone: string;
    vipTier: string;
    walletBalance: string;
    allergies: string;
    preferredBranch: string;
    preferredStylist: string;
  }) => void;
  endActiveCall: () => void;
}

const CallCenterBranchContext = createContext<CallCenterBranchContextType | undefined>(undefined);

export function CallCenterBranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [agentStatus, setAgentStatus] = useState<'Available' | 'On Call' | 'Wrap-Up' | 'On Break' | 'Offline'>('Available');
  const [activeCall, setActiveCall] = useState<{
    inProgress: boolean;
    callerName: string;
    callerPhone: string;
    durationSeconds: number;
    vipTier: string;
    walletBalance: string;
    allergies: string;
    preferredBranch: string;
    preferredStylist: string;
  } | null>(null);

  const selectedBranch = CALL_CENTER_BRANCHES.find(b => b.id === selectedBranchId) || CALL_CENTER_BRANCHES[0];
  const isAllBranches = selectedBranchId === 'all';

  const startInboundCall = (caller: {
    callerName: string;
    callerPhone: string;
    vipTier: string;
    walletBalance: string;
    allergies: string;
    preferredBranch: string;
    preferredStylist: string;
  }) => {
    setAgentStatus('On Call');
    setActiveCall({
      inProgress: true,
      callerName: caller.callerName,
      callerPhone: caller.callerPhone,
      durationSeconds: 0,
      vipTier: caller.vipTier,
      walletBalance: caller.walletBalance,
      allergies: caller.allergies,
      preferredBranch: caller.preferredBranch,
      preferredStylist: caller.preferredStylist
    });
  };

  const endActiveCall = () => {
    setAgentStatus('Wrap-Up');
    setActiveCall(null);
  };

  return (
    <CallCenterBranchContext.Provider
      value={{
        branches: CALL_CENTER_BRANCHES,
        selectedBranchId,
        setSelectedBranchId,
        selectedBranch,
        isAllBranches,
        agentStatus,
        setAgentStatus,
        activeCall,
        startInboundCall,
        endActiveCall
      }}
    >
      {children}
    </CallCenterBranchContext.Provider>
  );
}

export function useCallCenterBranch() {
  const context = useContext(CallCenterBranchContext);
  if (!context) {
    throw new Error('useCallCenterBranch must be used within a CallCenterBranchProvider');
  }
  return context;
}
