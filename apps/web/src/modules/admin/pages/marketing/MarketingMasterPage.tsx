import { cn } from '@salon-spa-saas/ui';
import {
  Award,
  ChevronRight,
  FileSpreadsheet,
  Megaphone,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { CampaignsTab } from './CampaignsTab';
import { LoyaltyTab } from './LoyaltyTab';
import { MarketingOverviewTab } from './MarketingOverviewTab';
import { MarketingReportsTab } from './MarketingReportsTab';
import { PromotionsOffersTab } from './PromotionsOffersTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';

export type MarketingTabType = 'overview' | 'campaigns' | 'promotions' | 'loyalty' | 'reports';

interface TabItem {
  id: MarketingTabType;
  label: string;
  count?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function MarketingMasterPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = (searchParams.get('tab') as MarketingTabType) || 'overview';

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Marketing Overview',
      icon: Megaphone,
      description: 'Multi-branch marketing KPIs, campaign conversion, and footfall acquisition',
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      count: '4 Active',
      icon: Megaphone,
      description:
        'Multi-channel promotional campaigns, target audience segmentation, and ROI tracking',
    },
    {
      id: 'promotions',
      label: 'Promotions & Offers',
      count: '8 Offers',
      icon: Tag,
      description:
        'Discount coupons, cash vouchers, complimentary upgrades, and redemption thresholds',
    },
    {
      id: 'loyalty',
      label: 'Loyalty',
      count: '5.1K Members',
      icon: Award,
      description: 'Brand-level customer rewards, tier privileges, and points issuance/burn',
    },
    {
      id: 'reports',
      label: 'Marketing Reports',
      icon: FileSpreadsheet,
      description: 'Campaign attribution, promotion usage, client retention, and loyalty audits',
    },
  ];

  const handleTabChange = (tabId: MarketingTabType, filter?: string) => {
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
          <MarketingOverviewTab
            onNavigateTab={(t, f) => handleTabChange(t as MarketingTabType, f)}
          />
        );
      case 'campaigns':
        return <CampaignsTab />;
      case 'promotions':
        return <PromotionsOffersTab />;
      case 'loyalty':
        return <LoyaltyTab />;
      case 'reports':
        return <MarketingReportsTab />;
      default:
        return (
          <MarketingOverviewTab
            onNavigateTab={(t, f) => handleTabChange(t as MarketingTabType, f)}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2D1552] via-[#401C74] to-[#5A2EA6] p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-extrabold tracking-wider uppercase text-purple-100 flex items-center gap-1 border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Salon SaaS · Brand Growth Desk
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-purple-200 text-xs font-medium">
                Multi-Branch Campaign &amp; Loyalty Governance
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
              Marketing &amp; Growth Master Cockpit
            </h1>
            <p className="text-purple-100/80 text-xs md:text-sm mt-1 max-w-2xl font-light leading-relaxed">
              Centralized brand-level management for promotional campaigns, voucher discounts,
              customer acquisition, tiered loyalty programs, and cross-branch attribution reporting.
            </p>
          </div>

          {/* Quick Header Stat Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 min-w-[130px]">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 block font-bold">
                Attributed Revenue
              </span>
              <strong className="text-lg font-serif font-bold text-white block mt-0.5">
                ₹23,50,000
              </strong>
              <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> 3,420 Redemptions
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 block font-bold">
                Active Audience
              </span>
              <strong className="text-lg font-serif font-bold text-amber-300 block mt-0.5">
                48,500
              </strong>
              <span className="text-[10px] text-purple-200 font-semibold block mt-0.5">
                Across 5 Branches
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 min-w-[120px]">
              <span className="text-[10px] uppercase tracking-wider text-purple-200 block font-bold">
                Loyalty Base
              </span>
              <strong className="text-lg font-serif font-bold text-white block mt-0.5">
                5,120
              </strong>
              <span className="text-[10px] text-purple-200 font-semibold block mt-0.5">
                ₹18.4L Member Spend
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

export default MarketingMasterPage;
