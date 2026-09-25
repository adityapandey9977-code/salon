import { cn } from '@salon-spa-saas/ui';
import {
  Building2,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileSpreadsheet,
  History,
  Layers,
  Package,
  PieChart as PieChartIcon,
  Receipt,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import type React from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { BranchSettlementTab } from './BranchSettlementTab';
import { CommissionsTab } from './CommissionsTab';
import { FinancialAlertsAuditTab } from './FinancialAlertsAuditTab';
import { FinancialOverviewTab } from './FinancialOverviewTab';
import { FinancialReportsTab } from './FinancialReportsTab';
import { GstTaxVisibilityTab } from './GstTaxVisibilityTab';
import { ProfitabilityLiabilityTab } from './ProfitabilityLiabilityTab';
import { RefundsCreditsTab } from './RefundsCreditsTab';
import { RevenueCollectionsTab } from './RevenueCollectionsTab';
import { TransactionsTab } from './TransactionsTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type FinanceTabType =
  | 'overview'
  | 'revenue-collections'
  | 'transactions'
  | 'refunds'
  | 'commissions'
  | 'settlements'
  | 'profitability'
  | 'tax'
  | 'alerts'
  | 'reports';

interface TabItem {
  id: FinanceTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function FinanceMasterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as FinanceTabType) || 'overview';

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Financial Overview',
      icon: TrendingUp,
      description: 'Multi-branch executive dashboard & trends',
    },
    {
      id: 'revenue-collections',
      label: 'Revenue & Collections',
      count: '₹46.8L',
      icon: Layers,
      description: 'Collections ledger & payment method channels',
    },
    {
      id: 'transactions',
      label: 'Transactions',
      count: '1.4k',
      icon: CreditCard,
      description: 'Multi-branch transaction monitoring & audit',
    },
    {
      id: 'refunds',
      label: 'Refunds & Credits',
      count: '18',
      icon: RotateCcw,
      description: 'Refund oversight, store credit & risk matrix',
    },
    {
      id: 'commissions',
      label: 'Staff Commissions',
      count: '5',
      icon: UserCheck,
      description: 'Staff commission approval & formula breakdown',
    },
    {
      id: 'settlements',
      label: 'Branch Settlement',
      count: '5',
      icon: Building2,
      description: 'Inter-branch fortnightly settlement & lineage',
    },
    {
      id: 'profitability',
      label: 'Profitability & Liability',
      icon: PieChartIcon,
      description: 'Operating margins & package breakage forecasting',
    },
    {
      id: 'tax',
      label: 'GST / Tax Visibility',
      icon: Receipt,
      description: '18% GST output, CGST/SGST branch accruals',
    },
    {
      id: 'alerts',
      label: 'Alerts & Audit',
      count: '4',
      icon: ShieldAlert,
      description: 'Financial risk alerts & immutable activity logs',
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      count: '6 Sets',
      icon: FileSpreadsheet,
      description: 'Centralized financial reporting & exports',
    },
  ];

  const handleTabChange = (tabId: FinanceTabType) => {
    setSearchParams({ tab: tabId });
  };

  const currentTab = tabs.find((t) => t.id === activeTabParam) || tabs[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-soft mb-1 font-medium">
            <span className="text-[#5A2EA6] font-bold">Brand Owner</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-semibold">Commercial</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-[#5A2EA6] capitalize font-bold">{currentTab.label}</span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-ink tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-[#5A2EA6]" />
            <span>Brand Owner Financial Control &amp; Analytics</span>
          </h1>
          <p className="text-xs text-muted mt-0.5 max-w-3xl">
            Centralized financial oversight for brand directors across all 5 branches—monitoring
            gross revenue, realized collections, transaction auditability, refund controls, staff
            commissions, branch settlements, profitability margins, and package breakage liability.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Gross Revenue
              </span>
              <strong className="text-xs font-bold text-ink">₹48,50,000</strong>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Total Collections
              </span>
              <strong className="text-xs font-bold text-ink">₹46,80,000 (96.5%)</strong>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 grid place-items-center font-bold text-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Network Scope
              </span>
              <strong className="text-xs font-bold text-ink">5 Active Branches</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs Bar with Scroller */}
      <TabScroller>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabParam === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap group shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-purple-50/50',
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-lg grid place-items-center transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-50 text-[#5A2EA6] group-hover:bg-purple-100',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full ml-0.5 whitespace-nowrap inline-flex items-center',
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-50 text-[#5A2EA6]',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </TabScroller>

      {/* Tab Content Panels */}
      <div>
        {activeTabParam === 'overview' && <FinancialOverviewTab />}
        {activeTabParam === 'revenue-collections' && <RevenueCollectionsTab />}
        {activeTabParam === 'transactions' && <TransactionsTab />}
        {activeTabParam === 'refunds' && <RefundsCreditsTab />}
        {activeTabParam === 'commissions' && <CommissionsTab />}
        {activeTabParam === 'settlements' && <BranchSettlementTab />}
        {activeTabParam === 'profitability' && <ProfitabilityLiabilityTab />}
        {activeTabParam === 'tax' && <GstTaxVisibilityTab />}
        {activeTabParam === 'alerts' && <FinancialAlertsAuditTab />}
        {activeTabParam === 'reports' && <FinancialReportsTab />}
      </div>
    </div>
  );
}

export default FinanceMasterPage;
