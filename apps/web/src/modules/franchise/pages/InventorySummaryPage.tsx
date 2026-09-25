import { cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileSpreadsheet,
  Layers,
  Package,
  Scissors,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';
import type React from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { ConsumptionWastageTab } from '../../admin/pages/inventory/ConsumptionWastageTab';
import { InventoryOverviewTab } from '../../admin/pages/inventory/InventoryOverviewTab';
import { InventoryReportsTab } from '../../admin/pages/inventory/InventoryReportsTab';
import { ProcurementTab } from '../../admin/pages/inventory/ProcurementTab';
import { ProductsConsumablesTab } from '../../admin/pages/inventory/ProductsConsumablesTab';
import { StockTab } from '../../admin/pages/inventory/StockTab';
import { StocktakeTab } from '../../admin/pages/inventory/StocktakeTab';
import { TransfersTab } from '../../admin/pages/inventory/TransfersTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type InventoryTabType =
  | 'overview'
  | 'products'
  | 'stock'
  | 'procurement'
  | 'transfers'
  | 'consumption'
  | 'stocktake'
  | 'reports';

interface TabItem {
  id: InventoryTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function InventorySummaryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTabParam = (searchParams.get('tab') as InventoryTabType) || 'overview';

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Inventory Overview',
      icon: Package,
      description: 'Multi-branch inventory health, KPIs, and shelf-life distribution',
    },
    {
      id: 'products',
      label: 'Products & Consumables',
      count: '342 SKUs',
      icon: Layers,
      description: 'Master product catalog, professional consumables, and service recipe BOMs',
    },
    {
      id: 'stock',
      label: 'Stock',
      count: '14.8K Units',
      icon: Package,
      description: 'Central stock ledger, movement timeline, and batch & expiry monitoring',
    },
    {
      id: 'procurement',
      label: 'Procurement',
      count: '12 POs',
      icon: Truck,
      description: 'Purchase orders, receipts (GRN), purchase returns, and supplier spend',
    },
    {
      id: 'transfers',
      label: 'Transfers',
      count: '6 Active',
      icon: ArrowRightLeft,
      description: 'Multi-branch stock transfers and chain-of-custody tracking',
    },
    {
      id: 'consumption',
      label: 'Consumption & Wastage',
      count: '₹34.5K',
      icon: Scissors,
      description: 'Service consumption, recipe variance analytics, and wastage approvals',
    },
    {
      id: 'stocktake',
      label: 'Stocktake',
      count: '5 Audits',
      icon: ClipboardCheck,
      description: 'Physical cycle counts and book discrepancy reconciliation',
    },
    {
      id: 'reports',
      label: 'Inventory Reports',
      icon: FileSpreadsheet,
      description: 'Valuation reports, inventory alerts, and immutable audit trails',
    },
  ];

  const handleTabChange = (tabId: InventoryTabType, filter?: string) => {
    const params: Record<string, string> = { tab: tabId };
    if (filter) {
      params.filter = filter;
    }
    setSearchParams(params);
  };

  const renderActiveTabContent = () => {
    switch (activeTabParam) {
      case 'overview':
        return (
          <InventoryOverviewTab
            onNavigateTab={(t, f) => handleTabChange(t as InventoryTabType, f)}
          />
        );
      case 'products':
        return <ProductsConsumablesTab />;
      case 'stock':
        return <StockTab />;
      case 'procurement':
        return <ProcurementTab />;
      case 'transfers':
        return <TransfersTab />;
      case 'consumption':
        return <ConsumptionWastageTab />;
      case 'stocktake':
        return <StocktakeTab />;
      case 'reports':
        return <InventoryReportsTab />;
      default:
        return (
          <InventoryOverviewTab
            onNavigateTab={(t, f) => handleTabChange(t as InventoryTabType, f)}
          />
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner & Quick Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2D1552] via-[#401C74] to-[#5A2EA6] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-extrabold tracking-wider uppercase text-purple-100 flex items-center gap-1 border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Franchise Network Control
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-purple-200 text-xs font-medium">
                Multi-Outlet Inventory Visibility
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
              Inventory &amp; Procurement Master Desk
            </h1>
            <p className="text-purple-100/80 text-xs md:text-sm mt-1 font-light leading-relaxed">
              Real-time multi-outlet stock valuation, service recipe BOMs, purchase order
              governance, inter-branch transfers, consumption variance, and physical stocktake
              reconciliation.
            </p>
          </div>

          {/* Quick Header Stat Pills */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap justify-start lg:justify-end">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 min-w-[130px]">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 block font-bold">
                Total Stock Value
              </span>
              <strong className="text-lg font-serif font-bold text-white block mt-0.5">
                ₹28,50,000
              </strong>
              <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> 14,850 Pcs Across 4 Outlets
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 block font-bold">
                Low Stock Threshold
              </span>
              <strong className="text-lg font-serif font-bold text-amber-300 block mt-0.5">
                42 SKUs
              </strong>
              <span className="text-[10px] text-purple-200 font-semibold block mt-0.5">
                8 Critical Out of Stock
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 block font-bold">
                Pending Procurement
              </span>
              <strong className="text-lg font-serif font-bold text-white block mt-0.5">
                12 Orders
              </strong>
              <span className="text-[10px] text-purple-200 font-semibold block mt-0.5">
                ₹4.85L In-Flight Value
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Sub-Navigation Tabs Strip with Scroller */}
      <TabScroller>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTabParam === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap group shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-md'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-[#F8F5FF]',
              )}
            >
              <IconComponent
                className={cn(
                  'w-3.5 h-3.5 transition',
                  isActive ? 'text-white' : 'text-[#5A2EA6] group-hover:scale-110',
                )}
              />
              <span>{tab.label}</span>
              {tab.count && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full ml-0.5 whitespace-nowrap inline-flex items-center',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-50 text-[#5A2EA6] border border-purple-100',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </TabScroller>

      {/* 3. Active Tab Content Canvas */}
      <div>{renderActiveTabContent()}</div>
    </div>
  );
}

export default InventorySummaryPage;
