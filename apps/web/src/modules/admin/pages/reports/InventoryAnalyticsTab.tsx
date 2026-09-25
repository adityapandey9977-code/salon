import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  Filter,
  Layers,
  Package,
  Percent,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export interface InventoryAnalyticsTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function InventoryAnalyticsTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: InventoryAnalyticsTabProps = {}) {
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedDateRange, setSelectedDateRange] = useState('Current Quarter');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 6 Inventory KPIs (Section 6 PRD)
  const invKpis = [
    {
      title: 'Total Stock Valuation',
      value: lockBranch ? '₹8,40,000' : '₹28,40,000',
      sub: lockBranch ? `Assigned to ${defaultBranch}` : 'Across 6 Branches',
      isPos: true,
      icon: Package,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Consumable Usage',
      value: lockBranch ? '₹3,60,000' : '₹12,20,000',
      sub: 'Quarterly Dispense',
      isPos: true,
      icon: Layers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Wastage Discrepancy',
      value: lockBranch ? '₹14,000' : '₹48,000',
      sub: '0.39% of Usage',
      isPos: false,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      title: 'Expiring Stock (<30d)',
      value: lockBranch ? '₹8,000' : '₹32,000',
      sub: '4 SKUs Requiring Use',
      isPos: false,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Stock Ageing Cycle',
      value: '42 Days',
      sub: 'Velocity Turnrate',
      isPos: true,
      icon: Clock,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Shrinkage Variance',
      value: lockBranch ? '₹3,200' : '₹12,000',
      sub: '0.10% Audit Loss',
      isPos: true,
      icon: Percent,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  // Recipe vs Actual Variance Table (Section 6 PRD)
  const recipeVariances = [
    {
      product: 'L’Oréal Majirel Cool Inforced (6.1)',
      sku: 'SKU-LOR-61',
      standardRecipe: '60 ml / treatment',
      actualDispensed: '64 ml / treatment',
      variancePct: '+6.6%',
      costImpact: '-₹4,200',
      reason: 'Extra thick hair application',
      status: 'Acceptable',
    },
    {
      product: 'O3+ Seaweed Facial Serum Unit',
      sku: 'SKU-O3-SEA01',
      standardRecipe: '1.0 Single-Use Kit',
      actualDispensed: '1.0 Single-Use Kit',
      variancePct: '0.0%',
      costImpact: '₹0',
      reason: 'Standardized sealed kit protocol',
      status: 'Perfect Match',
    },
    {
      product: 'Schwarzkopf Professional Developer 20 Vol',
      sku: 'SKU-SCH-DEV20',
      standardRecipe: '90 ml / balayage',
      actualDispensed: '98 ml / balayage',
      variancePct: '+8.8%',
      costImpact: '-₹2,800',
      reason: 'Over-dispensing during rush',
      status: 'Review Training',
    },
    {
      product: 'Keratin Complex Smoothing Infusion',
      sku: 'SKU-KER-SMOOTH',
      standardRecipe: '40 ml / ritual',
      actualDispensed: '41 ml / ritual',
      variancePct: '+2.5%',
      costImpact: '-₹1,600',
      reason: 'Minor measurement variance',
      status: 'Acceptable',
    },
  ];

  // Branch Inventory Table
  const branchInventory = [
    {
      branch: 'Indore - Vijay Nagar Flagship',
      stockVal: '₹8,40,000',
      consumption: '₹3,60,000',
      wastage: '₹14,000',
      expiring: '₹8,000',
      shrinkage: '₹3,200',
    },
    {
      branch: 'Bhopal - Arera Colony Lounge',
      stockVal: '₹5,80,000',
      consumption: '₹2,50,000',
      wastage: '₹10,000',
      expiring: '₹7,000',
      shrinkage: '₹2,400',
    },
    {
      branch: 'Indore - Palasia Premium Studio',
      stockVal: '₹5,20,000',
      consumption: '₹2,30,000',
      wastage: '₹9,000',
      expiring: '₹6,000',
      shrinkage: '₹2,100',
    },
    {
      branch: 'Ujjain - Freeganj Main Studio',
      stockVal: '₹4,10,000',
      consumption: '₹1,80,000',
      wastage: '₹8,000',
      expiring: '₹5,000',
      shrinkage: '₹2,000',
    },
    {
      branch: 'Gwalior - City Centre Hub',
      stockVal: '₹3,20,000',
      consumption: '₹1,40,000',
      wastage: '₹5,000',
      expiring: '₹4,000',
      shrinkage: '₹1,500',
    },
    {
      branch: 'Jabalpur - Civil Lines Lounge',
      stockVal: '₹1,70,000',
      consumption: '₹60,000',
      wastage: '₹2,000',
      expiring: '₹2,000',
      shrinkage: '₹800',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Export Modal */}
      <UniversalExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportTitle="Inventory Consumption & Recipe Variance Report"
        defaultCategory="Inventory"
        availableColumns={[
          'Branch Location',
          'Current Stock Valuation (₹)',
          'Quarterly Consumption (₹)',
          'Wastage Discrepancy (₹)',
          'Expiring Stock Value (₹)',
          'Shrinkage Variance (₹)',
        ]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {!lockBranch && (
            <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
              >
                <option value="all">All Salon Outlets (6 Branches)</option>
                <option value="indore-vn">Indore - Vijay Nagar Flagship</option>
                <option value="indore-pal">Indore - Palasia Premium</option>
                <option value="bhopal-arera">Bhopal - Arera Colony</option>
                <option value="ujjain-free">Ujjain - Freeganj Studio</option>
                <option value="gwalior-cc">Gwalior - City Centre</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="Current Quarter">Current Quarter (Q2 FY26-27)</option>
              <option value="Current Month">Current Month (Aug 2026)</option>
              <option value="Financial YTD">Financial YTD (FY26-27)</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExportOpen(true)}
          className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Export Inventory Analytics</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {invKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3.5 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-soft line-clamp-1">
                  {kpi.title}
                </span>
                <div className={cn('w-6 h-6 rounded-lg grid place-items-center shrink-0', kpi.bg)}>
                  <Icon className={cn('w-3.5 h-3.5', kpi.color)} />
                </div>
              </div>
              <div>
                <strong className="text-lg font-serif font-bold text-ink block">{kpi.value}</strong>
                <span className="text-[10px] text-muted block mt-0.5">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Recipe vs Actual Consumption Audit
              </h3>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Automated telemetry comparing predefined formula doses against physical dispenser
              logging
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            {recipeVariances.length} Monitored Formulations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Formulation / SKU</th>
                <th className="p-3.5">Standard Dose</th>
                <th className="p-3.5">Actual Dispensed</th>
                <th className="p-3.5 text-center">Variance %</th>
                <th className="p-3.5 text-right">Cost Impact</th>
                <th className="p-3.5">Root Cause Telemetry</th>
                <th className="p-3.5 pr-5 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {recipeVariances.map((rv, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink text-xs">
                    <div>{rv.product}</div>
                    <div className="text-[10px] text-soft font-mono font-normal">{rv.sku}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-600">{rv.standardRecipe}</td>
                  <td className="p-3.5 whitespace-nowrap text-slate-900 font-bold">
                    {rv.actualDispensed}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                        rv.variancePct === '0.0%'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200',
                      )}
                    >
                      {rv.variancePct}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-mono font-bold text-slate-900">
                    {rv.costImpact}
                  </td>
                  <td className="p-3.5 text-slate-700 text-[11px]">{rv.reason}</td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap font-bold text-[#5A2EA6]">
                    {rv.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                {lockBranch
                  ? `${defaultBranch} · Storage Zones & Dispensary Valuation`
                  : 'Multi-Branch Stock Valuation & Wastage Audit'}
              </h3>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {lockBranch
                ? `Location-by-location stockholding value, consumption, wastage write-offs, and shrinkage loss for ${defaultBranch}`
                : 'Branch-by-branch stockholding value, quarterly consumption, wastage write-offs, and shrinkage loss'}
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            {lockBranch ? '5 Storage Areas' : '6 Warehouses'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">
                  {lockBranch ? 'Storage Zone / Vault' : 'Salon Outlet'}
                </th>
                <th className="p-3.5 text-right font-bold text-ink">Stock Valuation</th>
                <th className="p-3.5 text-right">Quarterly Usage</th>
                <th className="p-3.5 text-right text-rose-700">Wastage Discard</th>
                <th className="p-3.5 text-right text-amber-700">Expiring Stock</th>
                <th className="p-3.5 pr-5 text-right font-bold text-slate-900">Shrinkage Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {(lockBranch
                ? [
                    {
                      branch: 'Central Backbar & Dispensary Room',
                      stockVal: '₹4,20,000',
                      consumption: '₹1,80,000',
                      wastage: '₹6,800',
                      expiring: '₹4,200',
                      shrinkage: '₹1,500',
                    },
                    {
                      branch: 'Main Storage Room & Reserve Vault',
                      stockVal: '₹2,60,000',
                      consumption: '₹95,000',
                      wastage: '₹3,200',
                      expiring: '₹2,100',
                      shrinkage: '₹800',
                    },
                    {
                      branch: 'Hair Care & Color Bar Floor Stations',
                      stockVal: '₹85,000',
                      consumption: '₹52,000',
                      wastage: '₹2,400',
                      expiring: '₹1,100',
                      shrinkage: '₹600',
                    },
                    {
                      branch: 'Clinical Aesthetics Treatment Cabinet',
                      stockVal: '₹55,000',
                      consumption: '₹22,000',
                      wastage: '₹1,100',
                      expiring: '₹600',
                      shrinkage: '₹300',
                    },
                    {
                      branch: 'Retail Product Display Gondolas',
                      stockVal: '₹20,000',
                      consumption: '₹11,000',
                      wastage: '₹500',
                      expiring: '₹0',
                      shrinkage: '₹0',
                    },
                  ]
                : branchInventory
              ).map((bi, idx) => (
                <tr key={idx} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink text-xs">
                    {bi.branch}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-serif font-extrabold text-[#5A2EA6]">
                    {bi.stockVal}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-mono text-slate-800">
                    {bi.consumption}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-mono text-rose-700 font-semibold">
                    {bi.wastage}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-mono text-amber-700">
                    {bi.expiring}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap font-mono text-slate-900 font-bold">
                    {bi.shrinkage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
