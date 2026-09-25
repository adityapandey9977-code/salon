import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Layers,
  Plus,
  RotateCcw,
  Scissors,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

// Mock Consumption Record
interface ConsumptionRecord {
  id: string;
  date: string;
  branch: string;
  branchId: string;
  serviceName: string;
  consumableName: string;
  standardQty: string;
  actualQty: string;
  varianceQty: string;
  variancePct: string;
  varianceValue: string;
  staffName: string;
  status: 'Recorded' | 'Variance Flagged' | 'Approved' | 'Rejected';
  lifecycleStep:
    | 'Recipe suggested'
    | 'Actual confirmed'
    | 'Stock reduced'
    | 'Variance flagged'
    | 'Wastage approved';
}

// Mock Wastage Record
interface WastageRecord {
  id: string;
  branch: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  value: string;
  reason: 'Expired' | 'Damaged' | 'Spillage' | 'Service Variance' | 'Stocktake Difference';
  requestedBy: string;
  approvedBy?: string;
  date: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Posted';
}

// Mock Retail Return
interface RetailReturn {
  id: string;
  productName: string;
  clientName: string;
  clientPhone: string;
  branch: string;
  originalSaleRef: string;
  quantity: number;
  unit: string;
  returnReason:
    | 'Wrong Product Purchased'
    | 'Skin Allergic Reaction'
    | 'Unopened Return'
    | 'Packaging Defect';
  amount: string;
  date: string;
  status: 'Requested' | 'Approved' | 'Processed' | 'Rejected';
}

const mockConsumptions: ConsumptionRecord[] = [
  {
    id: 'CSM-901',
    date: '18 Aug 2026, 03:30 PM',
    branch: 'Indore Central Flagship',
    branchId: 'BR-01',
    serviceName: 'Global Hair Colouring',
    consumableName: "L'Oréal Majirel Colour Tube - 6.13",
    standardQty: '50 ml',
    actualQty: '54 ml',
    varianceQty: '+4 ml',
    variancePct: '+8.0%',
    varianceValue: '₹27.20',
    staffName: 'Rohan Sharma (Master Stylist)',
    status: 'Recorded',
    lifecycleStep: 'Stock reduced',
  },
  {
    id: 'CSM-902',
    date: '18 Aug 2026, 01:15 PM',
    branch: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    serviceName: 'O3+ Seaweed Brightening Facial',
    consumableName: 'O3+ Seaweed Facial Single-Use Kit',
    standardQty: '1 Kit',
    actualQty: '1 Kit',
    varianceQty: '0',
    variancePct: '0.0%',
    varianceValue: '₹0.00',
    staffName: 'Ananya Roy (Head Esthetician)',
    status: 'Approved',
    lifecycleStep: 'Actual confirmed',
  },
  {
    id: 'CSM-903',
    date: '17 Aug 2026, 05:45 PM',
    branch: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    serviceName: 'Keratin Hair Smoothing Treatment',
    consumableName: 'Keratin Complex Smoothing Infusion',
    standardQty: '60 ml',
    actualQty: '75 ml',
    varianceQty: '+15 ml',
    variancePct: '+25.0%',
    varianceValue: '₹300.00',
    staffName: 'Sameer Khan (Senior Stylist)',
    status: 'Variance Flagged',
    lifecycleStep: 'Variance flagged',
  },
  {
    id: 'CSM-904',
    date: '17 Aug 2026, 02:00 PM',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    serviceName: 'Root Touch-Up & Ammonia-Free Gloss',
    consumableName: "L'Oréal Inoa Ammonia-Free Tube",
    standardQty: '30 ml',
    actualQty: '38 ml',
    varianceQty: '+8 ml',
    variancePct: '+26.6%',
    varianceValue: '₹72.00',
    staffName: 'Pooja Verma (Stylist)',
    status: 'Variance Flagged',
    lifecycleStep: 'Variance flagged',
  },
  {
    id: 'CSM-905',
    date: '16 Aug 2026, 06:10 PM',
    branch: 'Indore Central Flagship',
    branchId: 'BR-01',
    serviceName: 'Luxury Moroccan Oil Hair Spa',
    consumableName: 'Moroccanoil Treatment Oil (100ml)',
    standardQty: '15 ml',
    actualQty: '15 ml',
    varianceQty: '0',
    variancePct: '0.0%',
    varianceValue: '₹0.00',
    staffName: 'Rohan Sharma (Master Stylist)',
    status: 'Approved',
    lifecycleStep: 'Actual confirmed',
  },
];

const mockWastages: WastageRecord[] = [
  {
    id: 'ADJ-2026-019',
    branch: 'Vijay Nagar Boutique',
    productName: 'Moroccanoil Treatment Original (100ml)',
    batchNumber: 'LOT-MOR-552',
    quantity: 1,
    unit: 'Bottle',
    value: '₹2,200',
    reason: 'Damaged',
    requestedBy: 'Kunal Sen (Floor Mgr)',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    date: '16 Aug 2026',
    status: 'Approved',
  },
  {
    id: 'ADJ-2026-020',
    branch: 'Ujjain Mahakal Road',
    productName: "L'Oréal Oxydant Developer 20 Vol (6%)",
    batchNumber: 'LOT-DEV-190',
    quantity: 2,
    unit: 'Bottles',
    value: '₹840',
    reason: 'Expired',
    requestedBy: 'Pooja Verma (Storekeeper)',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    date: '15 Aug 2026',
    status: 'Posted',
  },
  {
    id: 'ADJ-2026-021',
    branch: 'Bhopal Arera Colony',
    productName: 'Keratin Complex Smoothing Infusion',
    batchNumber: 'LOT-KER-441',
    quantity: 3,
    unit: 'Bowls (Spillage)',
    value: '₹1,450',
    reason: 'Spillage',
    requestedBy: 'Sameer Khan (Senior Stylist)',
    date: '18 Aug 2026',
    status: 'Pending Approval',
  },
];

const mockRetailReturns: RetailReturn[] = [
  {
    id: 'RET-RET-001',
    productName: "L'Oréal Professionnel Serie Expert Absolut Repair Shampoo",
    clientName: 'Priya Mehta',
    clientPhone: '+91 98260 44102',
    branch: 'Indore Central Flagship',
    originalSaleRef: 'INV-2026-0792',
    quantity: 1,
    unit: 'Bottle',
    returnReason: 'Unopened Return',
    amount: '₹1,450',
    date: '16 Aug 2026',
    status: 'Approved',
  },
  {
    id: 'RET-RET-002',
    productName: 'Kérastase Elixir Ultime Hair Oil (100ml)',
    clientName: 'Siddharth Dave',
    clientPhone: '+91 98930 11984',
    branch: 'Vijay Nagar Boutique',
    originalSaleRef: 'INV-2026-0814',
    quantity: 1,
    unit: 'Bottle',
    returnReason: 'Packaging Defect',
    amount: '₹3,950',
    date: '14 Aug 2026',
    status: 'Processed',
  },
];

export interface ConsumptionWastageTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function ConsumptionWastageTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: ConsumptionWastageTabProps = {}) {
  const [activeSubTab, setActiveSubTab] = useState<
    'consumption' | 'variance' | 'wastage' | 'retail-returns'
  >('consumption');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedWastage, setSelectedWastage] = useState<WastageRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 6 KPI Cards
  const kpis = [
    {
      title: 'Total Consumption',
      value: lockBranch ? '1,120 Servings' : '4,280 Servings',
      sub: lockBranch ? `At ${defaultBranch}` : 'Across 5 branches',
      isPositive: true,
      change: '+6.4%',
    },
    {
      title: 'Consumption Value',
      value: lockBranch ? '₹1,84,000' : '₹6,40,000',
      sub: 'Cost of Consumables Used',
      isPositive: true,
      change: '13.2% of Rev',
    },
    {
      title: 'Wastage Items',
      value: lockBranch ? '3 Recorded' : '14 Recorded',
      sub: 'Damages & Spillage',
      isPositive: true,
      change: '-4 vs last wk',
    },
    {
      title: 'Wastage Value',
      value: lockBranch ? '₹8,200' : '₹34,500',
      sub: '1.21% of consumption',
      isPositive: true,
      change: 'Within 2.5% SLA',
    },
    {
      title: 'Service Variance',
      value: '+3.8%',
      sub: 'Avg Recipe Overuse',
      isPositive: false,
      change: '+0.8% flag',
    },
    {
      title: 'High Variance Alerts',
      value: lockBranch ? '1 Service' : '6 Services',
      sub: 'Over 20% threshold',
      isPositive: false,
      change: 'Action required',
    },
  ];

  const filteredConsumptions = mockConsumptions.filter((c) => {
    if (!lockBranch && selectedBranch !== 'all' && c.branchId !== selectedBranch) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (searchTerm) {
      const match = `${c.serviceName} ${c.consumableName} ${c.staffName} ${c.branch}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Sub-Tab Controller */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#F8F5FF] p-1 rounded-xl border border-[#5A2EA6]/20">
          <button
            onClick={() => setActiveSubTab('consumption')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'consumption'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Daily Consumption Ledger</span>
          </button>

          <button
            onClick={() => setActiveSubTab('variance')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'variance'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Recipe vs Actual Variance</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wastage')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'wastage'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Wastage &amp; Adjustments</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {mockWastages.filter((w) => w.status === 'Pending Approval').length} Pending
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('retail-returns')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'retail-returns'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retail Returns</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast(`Exporting ${activeSubTab} consumption journal (CSV)...`)}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Journal</span>
          </Button>
        </div>
      </div>

      {/* 2. 6 Consumption KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/10 shadow-xs flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                {kpi.title}
              </span>
              <strong className="text-base font-serif font-bold text-ink mt-1 block">
                {kpi.value}
              </strong>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span
                className={cn('font-bold', kpi.isPositive ? 'text-emerald-600' : 'text-rose-600')}
              >
                {kpi.change}
              </span>
              <span className="text-muted truncate max-w-[80px]">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search service, consumable, staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {!lockBranch && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Salon Branches</option>
              <option value="BR-01">Indore Central Flagship</option>
              <option value="BR-02">Vijay Nagar Boutique</option>
              <option value="BR-03">Bhopal Arera Colony</option>
              <option value="BR-04">Ujjain Mahakal Road</option>
            </select>
          )}
        </div>

        <span className="text-xs text-soft font-semibold">
          PRD Workflow: Recipe Suggested &rarr; Actual Confirmed &rarr; Stock Reduced &rarr;
          Variance Flagged &rarr; Wastage Approved
        </span>
      </div>

      {/* 4. SUB-VIEW TABLES */}
      {activeSubTab === 'consumption' && (
        /* SECTION 18: CONSUMPTION TABLE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  {lockBranch
                    ? `${defaultBranch} · Daily Service Consumption Ledger`
                    : 'Daily Service Consumption Ledger'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Backwash Stock Draws
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Chairside consumable usage automatically deducted upon checkout or staff
                confirmation
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">Live POS Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Date &amp; Service</th>
                  {!lockBranch && <th className="p-3.5">Branch Location</th>}
                  <th className="p-3.5">Consumable Used</th>
                  <th className="p-3.5 text-center">Standard BOM</th>
                  <th className="p-3.5 text-center">Actual Used</th>
                  <th className="p-3.5 text-center">Variance</th>
                  <th className="p-3.5 text-right">Variance Cost</th>
                  <th className="p-3.5">Executing Stylist</th>
                  <th className="p-3.5 text-center">Lifecycle State</th>
                  <th className="p-3.5 pr-5 text-right">Oversight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredConsumptions.map((c) => (
                  <tr key={c.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{c.serviceName}</strong>
                      <span className="text-[10px] text-muted">{c.date}</span>
                    </td>

                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                        {c.branch}
                      </td>
                    )}

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">{c.consumableName}</span>
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap text-soft">
                      {c.standardQty}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {c.actualQty}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      {c.varianceQty === '0' ? (
                        <span className="text-emerald-700 font-bold">0% (Exact)</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {c.varianceQty} ({c.variancePct})
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-ink whitespace-nowrap">
                      {c.varianceValue}
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-slate-700">{c.staffName}</td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap">
                        {c.lifecycleStep}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => showToast(`Audit details for ${c.serviceName} (${c.id})...`)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'variance' && (
        /* SECTION 19: RECIPE VS ACTUAL VARIANCE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Recipe vs. Actual Consumption Variance Analytics
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold whitespace-nowrap border border-amber-200">
                  Leakage Detection
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Highlights stylist-level over-dispensing to recalibrate training and avoid unbilled
                salon product waste
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">
              Variance Threshold: &gt;15% Flagged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Salon Service</th>
                  <th className="p-3.5">Consumable Material</th>
                  <th className="p-3.5 text-center">Standard Recipe BOM</th>
                  <th className="p-3.5 text-center">Actual Dispensed</th>
                  <th className="p-3.5 text-center">Variance (ml/gm)</th>
                  <th className="p-3.5 text-center">Variance %</th>
                  {!lockBranch && <th className="p-3.5">Branch Location</th>}
                  <th className="p-3.5 pr-5 text-right">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredConsumptions.map((c) => (
                  <tr key={c.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink">
                      {c.serviceName}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                      {c.consumableName}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap text-soft font-bold">
                      {c.standardQty}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {c.actualQty}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold">
                      <span
                        className={c.varianceQty !== '0' ? 'text-amber-800' : 'text-emerald-700'}
                      >
                        {c.varianceQty}
                      </span>
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-extrabold">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          c.variancePct === '0.0%'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : c.variancePct.includes('25') || c.variancePct.includes('26')
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200',
                        )}
                      >
                        {c.variancePct}
                      </span>
                    </td>

                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap text-slate-800">{c.branch}</td>
                    )}

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => showToast(`Sent calibration reminder to ${c.staffName}...`)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                      >
                        Flag Stylist
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'wastage' && (
        /* SECTION 20: WASTAGE & ADJUSTMENTS */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Wastage, Spillage &amp; Inventory Adjustments
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Loss Prevention
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                {lockBranch
                  ? `Branch Manager authorization ledger for damaged bottles, expiration write-offs, and salon spillages at ${defaultBranch}`
                  : 'Head Office sign-off ledger for damaged bottles, expiration write-offs, and salon spillages'}
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">Maker-Checker Authorization</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Adjustment ID &amp; Date</th>
                  {!lockBranch && <th className="p-3.5">Branch</th>}
                  <th className="p-3.5">Product &amp; Batch</th>
                  <th className="p-3.5 text-center">Wasted Quantity</th>
                  <th className="p-3.5 text-right">Cost Valuation</th>
                  <th className="p-3.5">Reason Code</th>
                  <th className="p-3.5">Requested / Approved By</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {mockWastages.map((w) => (
                  <tr key={w.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{w.id}</strong>
                      <span className="text-[10px] text-muted">{w.date}</span>
                    </td>

                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                        {w.branch}
                      </td>
                    )}

                    <td className="p-3.5 whitespace-nowrap">
                      <strong className="font-bold text-ink block">{w.productName}</strong>
                      <span className="text-[10px] text-soft font-mono">{w.batchNumber}</span>
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                      {w.quantity} {w.unit}
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-red-700 whitespace-nowrap">
                      {w.value}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {w.reason}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-[11px]">
                      <span className="text-soft block">Req: {w.requestedBy}</span>
                      {w.approvedBy && (
                        <span className="text-[#5A2EA6] font-bold block">Appr: {w.approvedBy}</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                          w.status === 'Approved' || w.status === 'Posted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : w.status === 'Pending Approval'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        {w.status}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      {w.status === 'Pending Approval' ? (
                        <Button
                          variant="outline"
                          onClick={() => {
                            w.status = 'Approved';
                            w.approvedBy = `${defaultBranch} Manager`;
                            showToast(`Wastage record ${w.id} officially authorized.`);
                          }}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                        >
                          Authorize Loss
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => showToast(`Wastage audit line # ${w.id}`)}
                          className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700"
                        >
                          Audited
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'retail-returns' && (
        /* SECTION 21: RETAIL RETURNS */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Client Retail Product Returns &amp; Restocking
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Client POS Returns
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Return authorizations with automated stock reintegration and finance credit note
                settlement hooks
              </p>
            </div>
            <span className="text-xs text-soft font-semibold">Finance Integrated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Return ID &amp; Date</th>
                  <th className="p-3.5">Client &amp; Phone</th>
                  {!lockBranch && <th className="p-3.5">Branch Location</th>}
                  <th className="p-3.5">Original Sale Bill</th>
                  <th className="p-3.5">Returned Product</th>
                  <th className="p-3.5">Reason for Return</th>
                  <th className="p-3.5 text-right">Refund Amount</th>
                  <th className="p-3.5 text-center">Restock Status</th>
                  <th className="p-3.5 pr-5 text-right">Finance Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {mockRetailReturns.map((r) => (
                  <tr key={r.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{r.id}</strong>
                      <span className="text-[10px] text-muted">{r.date}</span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <strong className="font-bold text-slate-900 block">{r.clientName}</strong>
                      <span className="text-[10px] text-soft">{r.clientPhone}</span>
                    </td>

                    {!lockBranch && (
                      <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                        {r.branch}
                      </td>
                    )}

                    <td className="p-3.5 whitespace-nowrap font-mono text-[#5A2EA6] font-bold">
                      {r.originalSaleRef}
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">{r.productName}</span>
                      <span className="text-[10px] text-soft">
                        {r.quantity} {r.unit}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap text-amber-800 font-medium">
                      {r.returnReason}
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-red-700 whitespace-nowrap">
                      {r.amount}
                    </td>

                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                        {r.status}
                      </span>
                    </td>

                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => {
                          window.location.href = '/finance?tab=refunds';
                        }}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                      >
                        <span>Finance Reversal</span>
                        <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
