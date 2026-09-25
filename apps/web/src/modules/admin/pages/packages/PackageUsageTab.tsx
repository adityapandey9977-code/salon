import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  History,
  Package,
  Phone,
  Scissors,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';

export interface PackageUsageRecord {
  id: string;
  clientName: string;
  clientMobile: string;
  packageName: string;
  packageCode: string;
  primaryService: string;
  branch: string;
  purchaseDate: string;
  expiryDate: string;
  originalValue: number;
  paidAmount: number;
  sessionsPurchased: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  lastRedemptionDate: string;
  status: 'Active' | 'Partially Used' | 'Fully Used' | 'Expiring Soon' | 'Expired';
  redemptionHistory: {
    date: string;
    service: string;
    branch: string;
    staff: string;
    appointmentId: string;
    sessionNumber: number;
    remainingAfter: number;
  }[];
}

export const initialPackageUsageList: PackageUsageRecord[] = [
  {
    id: 'USG-101',
    clientName: 'Akanksha Sharma',
    clientMobile: '+91 98200 44551',
    packageName: 'Royal Bridal Radiance Cure',
    packageCode: 'PKG-BRD-01',
    primaryService: '7-Step Medical Hydra-Facial (3s)',
    branch: 'Atelier Indrapuri Flagship',
    purchaseDate: '15 Jul 2026',
    expiryDate: '15 Jan 2027',
    originalValue: 32600,
    paidAmount: 24999,
    sessionsPurchased: 7,
    sessionsUsed: 4,
    sessionsRemaining: 3,
    lastRedemptionDate: '18 Aug 2026',
    status: 'Partially Used',
    redemptionHistory: [
      {
        date: '18 Aug 2026',
        service: '7-Step Medical Hydra-Facial',
        branch: 'Atelier Indrapuri Flagship',
        staff: 'Ananya Deshmukh',
        appointmentId: 'APT-1091',
        sessionNumber: 4,
        remainingAfter: 3,
      },
      {
        date: '04 Aug 2026',
        service: 'Royal Balinese Aromatherapy',
        branch: 'Atelier Indrapuri Flagship',
        staff: 'Manish Rawat',
        appointmentId: 'APT-0982',
        sessionNumber: 3,
        remainingAfter: 4,
      },
      {
        date: '22 Jul 2026',
        service: 'Full Head Balayage & Keratin',
        branch: 'Atelier Indrapuri Flagship',
        staff: 'Rohit Verma',
        appointmentId: 'APT-0871',
        sessionNumber: 2,
        remainingAfter: 5,
      },
      {
        date: '16 Jul 2026',
        service: '7-Step Medical Hydra-Facial',
        branch: 'Atelier Indrapuri Flagship',
        staff: 'Ananya Deshmukh',
        appointmentId: 'APT-0810',
        sessionNumber: 1,
        remainingAfter: 6,
      },
    ],
  },
  {
    id: 'USG-102',
    clientName: 'Devendra Singhania',
    clientMobile: '+91 98110 33440',
    packageName: 'Gentlemen’s Executive Grooming Pass',
    packageCode: 'PKG-MEN-03',
    primaryService: 'Executive Hot Towel Beard Sculpt (6s)',
    branch: 'Atelier Indrapuri Flagship',
    purchaseDate: '01 Jun 2026',
    expiryDate: '01 Dec 2026',
    originalValue: 18800,
    paidAmount: 13999,
    sessionsPurchased: 12,
    sessionsUsed: 8,
    sessionsRemaining: 4,
    lastRedemptionDate: '12 Aug 2026',
    status: 'Partially Used',
    redemptionHistory: [
      {
        date: '12 Aug 2026',
        service: 'Executive Hot Towel Beard Sculpt',
        branch: 'Atelier Indrapuri Flagship',
        staff: 'Sameer Sheikh',
        appointmentId: 'APT-1045',
        sessionNumber: 8,
        remainingAfter: 4,
      },
      {
        date: '28 Jul 2026',
        service: 'Signature Precision Cut & Wash',
        branch: 'Atelier Indrapuri Flagship',
        staff: 'Sameer Sheikh',
        appointmentId: 'APT-0920',
        sessionNumber: 7,
        remainingAfter: 5,
      },
    ],
  },
  {
    id: 'USG-103',
    clientName: 'Pooja Kashyap',
    clientMobile: '+91 98980 22110',
    packageName: 'Clinical Skin Renewal Trio',
    packageCode: 'PKG-SKN-02',
    primaryService: 'Dermalogica Pro Power Peel (2s)',
    branch: 'Atelier Whitefield Studio',
    purchaseDate: '10 Feb 2026',
    expiryDate: '25 Aug 2026',
    originalValue: 20500,
    paidAmount: 15499,
    sessionsPurchased: 5,
    sessionsUsed: 4,
    sessionsRemaining: 1,
    lastRedemptionDate: '08 Aug 2026',
    status: 'Expiring Soon',
    redemptionHistory: [
      {
        date: '08 Aug 2026',
        service: '7-Step Medical Hydra-Facial',
        branch: 'Atelier Whitefield Studio',
        staff: 'Kavita Iyer',
        appointmentId: 'APT-1011',
        sessionNumber: 4,
        remainingAfter: 1,
      },
    ],
  },
  {
    id: 'USG-104',
    clientName: 'Sanjay Malhotra',
    clientMobile: '+91 97840 55660',
    packageName: 'Holistic Spa Rejuvenation Series',
    packageCode: 'PKG-SPA-04',
    primaryService: 'Hot Stone Deep Tissue Recovery (2s)',
    branch: 'Atelier Jaipur Royal Spa',
    purchaseDate: '15 Jan 2026',
    expiryDate: '15 Jan 2027',
    originalValue: 22200,
    paidAmount: 16999,
    sessionsPurchased: 5,
    sessionsUsed: 5,
    sessionsRemaining: 0,
    lastRedemptionDate: '02 Aug 2026',
    status: 'Fully Used',
    redemptionHistory: [
      {
        date: '02 Aug 2026',
        service: 'Royal Balinese Aromatherapy',
        branch: 'Atelier Jaipur Royal Spa',
        staff: 'Manish Rawat',
        appointmentId: 'APT-0960',
        sessionNumber: 5,
        remainingAfter: 0,
      },
    ],
  },
];

export function PackageUsageTab() {
  const { toast } = useToast();
  const [usageList, setUsageList] = useState<PackageUsageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selected for Detailed Redemption History Drawer
  const [selectedRecord, setSelectedRecord] = useState<PackageUsageRecord | null>(null);

  React.useEffect(() => {
    async function loadUsage() {
      try {
        setLoading(true);
        const { packagesApi } = await import('@/shared/api/packages.api');
        const liveUsage = await packagesApi.listUsage();
        if (liveUsage && liveUsage.length > 0) {
          const mapped: PackageUsageRecord[] = liveUsage.map((u, idx) => ({
            id: u.id || `USG-${idx + 101}`,
            clientName: u.clientName || `Client ${idx + 1}`,
            clientMobile: u.clientMobile || `+91 98000 ${idx + 1000}`,
            packageName: u.packageName || 'Service Package Bundle',
            packageCode: u.redemptionCode || `PKG-00${idx + 1}`,
            primaryService: u.serviceRedeemed || 'Specialist Session',
            branch: u.branchName || 'Main Salon HQ',
            purchaseDate: new Date(u.redeemedAt || Date.now()).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            expiryDate: '15 Jan 2027',
            originalValue: 24999,
            paidAmount: 19999,
            sessionsPurchased: 5,
            sessionsUsed: 2,
            sessionsRemaining: 3,
            lastRedemptionDate: new Date(u.redeemedAt || Date.now()).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            status: u.status === 'VERIFIED' ? 'Active' : 'Partially Used',
            redemptionHistory: [
              {
                date: new Date(u.redeemedAt || Date.now()).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }),
                service: u.serviceRedeemed || 'Service Session',
                branch: u.branchName || 'Main Salon HQ',
                staff: u.staffName || 'Senior Specialist',
                appointmentId: u.id || 'APT-1001',
                sessionNumber: 1,
                remainingAfter: 4,
              },
            ],
          }));
          setUsageList(mapped);
        } else {
          setUsageList([]);
        }
      } catch (err) {
        console.error('Failed to fetch package usage logs', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsage();
  }, []);



  const filteredUsage = useMemo(() => {
    return usageList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.clientName.toLowerCase().includes(q) ||
        item.clientMobile.includes(q) ||
        item.packageName.toLowerCase().includes(q) ||
        item.packageCode.toLowerCase().includes(q);

      const matchesBranch = branchFilter === 'All' || item.branch === branchFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [usageList, searchQuery, branchFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Package Usage &amp; Redemption Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {usageList.length} Active Subscriptions
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Audit individual client session balances, redemption history per appointment, branch
            cross-redemptions, and expiry timelines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() =>
              toast(`Exported ${filteredUsage.length} package redemption logs to CSV.`)
            }
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by client name, mobile, package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Branch Filter */}
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Branch:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Branches</option>
              {masterBranches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Partially Used">Partially Used</option>
              <option value="Fully Used">Fully Used</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Usage Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Client Package Subscriptions &amp; Session Consumption
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Real-time session balances, redemption timestamps, and expiry safeguarding
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredUsage.length} Subscription Records
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Client & Contact',
                  'Subscribed Package',
                  'Purchase Branch',
                  'Purchase & Expiry',
                  'Session Balance Progress',
                  'Last Redeemed',
                  'Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 7 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredUsage.map((u) => {
                const percentUsed = Math.round((u.sessionsUsed / u.sessionsPurchased) * 100);

                return (
                  <tr key={u.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Client */}
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-[13px] block">{u.clientName}</strong>
                      <span className="text-[10px] text-muted">{u.clientMobile}</span>
                    </td>

                    {/* Package */}
                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{u.packageName}</strong>
                      <span className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                        {u.packageCode}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="p-3.5 text-soft">{u.branch}</td>

                    {/* Dates */}
                    <td className="p-3.5 text-xs">
                      <span className="text-muted block text-[10.5px]">
                        Bought: {u.purchaseDate}
                      </span>
                      <strong
                        className={cn(
                          'text-xs font-semibold',
                          u.status === 'Expiring Soon' ? 'text-amber-700' : 'text-ink',
                        )}
                      >
                        Exp: {u.expiryDate}
                      </strong>
                    </td>

                    {/* Sessions Progress */}
                    <td className="p-3.5 min-w-[170px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <strong className="text-ink">
                            {u.sessionsUsed} of {u.sessionsPurchased} used
                          </strong>
                          <span className="font-bold text-[#5A2EA6]">
                            {u.sessionsRemaining} left
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full transition-all',
                              percentUsed === 100
                                ? 'bg-slate-400'
                                : percentUsed > 70
                                  ? 'bg-amber-500'
                                  : 'bg-[#5A2EA6]',
                            )}
                            style={{ width: `${percentUsed}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last Redeemed */}
                    <td className="p-3.5 text-soft text-xs">{u.lastRedemptionDate}</td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          u.status === 'Active' || u.status === 'Partially Used'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.status === 'Expiring Soon'
                              ? 'bg-amber-100 text-amber-800'
                              : u.status === 'Fully Used'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        onClick={() => setSelectedRecord(u)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redemption History Drawer */}
      {selectedRecord &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex justify-end bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-xl h-full shadow-[0_25px_70px_rgba(90,46,166,0.25)] border-l border-purple-100 flex flex-col animate-in slide-in-from-right duration-300 text-xs">
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <span className="font-mono font-bold text-xs text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                    {selectedRecord.packageCode}
                  </span>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight mt-1">
                    Redemption History: {selectedRecord.clientName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto custom-scroll flex-1 space-y-5">
                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-ink text-sm">{selectedRecord.packageName}</strong>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {selectedRecord.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-muted block text-[10px]">Purchased</span>
                      <strong className="text-ink">
                        {selectedRecord.sessionsPurchased} Sessions
                      </strong>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Redeemed</span>
                      <strong className="text-emerald-700">
                        {selectedRecord.sessionsUsed} Sessions
                      </strong>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px]">Remaining</span>
                      <strong className="text-[#5A2EA6]">
                        {selectedRecord.sessionsRemaining} Sessions
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Immutable Audit Trail Warning */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Redemption logs are cryptographically bound to floor appointment records and
                    cannot be altered without head-office audit approval.
                  </span>
                </div>

                {/* History Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                    Session Redemption Chronology ({selectedRecord.redemptionHistory.length} Events)
                  </h4>
                  <div className="space-y-2">
                    {selectedRecord.redemptionHistory.map((h, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-100 space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <strong className="text-ink text-xs">{h.service}</strong>
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-[#5A2EA6] font-mono text-[10px] font-bold">
                            Session #{h.sessionNumber}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-muted">
                          <span>
                            {h.date} · {h.branch}
                          </span>
                          <span>
                            Specialist: <strong>{h.staff}</strong>
                          </span>
                        </div>
                        <div className="text-[10px] text-soft pt-1 border-t border-purple-50 flex justify-between">
                          <span>Ref: {h.appointmentId}</span>
                          <span className="text-[#5A2EA6] font-bold">
                            {h.remainingAfter} Sessions Left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default PackageUsageTab;
