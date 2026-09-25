import { cn } from '@salon-spa-saas/ui';
import {
  Armchair,
  Award,
  BookOpen,
  ChevronRight,
  DollarSign,
  Layers,
  Scissors,
  Sparkles,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import { ResourcesTab, initialResources } from './ResourcesTab';
import { ServiceCategoriesTab, initialCategories } from './ServiceCategoriesTab';
import { ServicePricingTab, initialPricingRules } from './ServicePricingTab';
import { ServicesTab, masterServices } from './ServicesTab';
import { StaffSkillsLevelsTab, initialSkills } from './StaffSkillsLevelsTab';
import { TabScroller } from '@/shared/components/TabScroller/TabScroller';
import { catalogueApi } from '@/shared/api';

export type CatalogueTabType = 'categories' | 'services' | 'pricing' | 'skills' | 'resources';

interface TabItem {
  id: CatalogueTabType;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export interface CatalogueMasterPageProps {
  roleTitle?: string;
  parentSection?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
  readOnly?: boolean;
  initialTab?: CatalogueTabType;
}

export function CatalogueMasterPage({
  roleTitle = 'Brand Owner',
  parentSection = 'Catalogue',
  defaultBranch = 'All',
  lockBranch = false,
  readOnly = false,
  initialTab = 'categories',
}: CatalogueMasterPageProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const pathSegment = location.pathname.split('/').filter(Boolean).pop();
  const tabFromPath = (['categories', 'services', 'pricing', 'skills', 'resources'] as const).find(
    (t) => t === pathSegment,
  );
  const activeTabParam = (searchParams.get('tab') as CatalogueTabType) || tabFromPath || initialTab;

  const [counts, setCounts] = useState({
    categories: 0,
    services: 0,
    pricing: 0,
    skills: 0,
    resources: 0,
  });

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const [catsRes, srvsRes, resList, skillsRes] = await Promise.allSettled([
          catalogueApi.fetchCategories(),
          catalogueApi.fetchServices({ limit: 100 }),
          catalogueApi.fetchResources(),
          catalogueApi.fetchSkills(),
        ]);

        setCounts({
          categories:
            catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)
              ? catsRes.value.length
              : 0,
          services:
            srvsRes.status === 'fulfilled' && Array.isArray(srvsRes.value)
              ? srvsRes.value.length
              : 0,
          pricing:
            srvsRes.status === 'fulfilled' && Array.isArray(srvsRes.value)
              ? srvsRes.value.length
              : 0,
          resources:
            resList.status === 'fulfilled' && Array.isArray(resList.value)
              ? resList.value.length
              : 0,
          skills:
            skillsRes.status === 'fulfilled' && Array.isArray(skillsRes.value)
              ? skillsRes.value.length
              : 0,
        });
      } catch (err) {
        console.error('Failed to sync master catalogue counters:', err);
      }
    };

    fetchCounters();
  }, [activeTabParam]);

  const tabs: TabItem[] = [
    {
      id: 'categories',
      label: 'Service Categories',
      count: counts.categories,
      icon: Layers,
      description: 'Department groupings & display order',
    },
    {
      id: 'services',
      label: 'Services',
      count: counts.services,
      icon: Scissors,
      description: 'Master service catalogue & timings',
    },
    /* {
      id: 'pricing',
      label: 'Service Pricing',
      count: counts.pricing,
      icon: DollarSign,
      description: 'Multi-branch tariff matrix & deltas',
    }, */
    {
      id: 'skills',
      label: 'Staff Skills & Levels',
      count: counts.skills,
      icon: Award,
      description: 'Staff certifications & tier mapping',
    },
    {
      id: 'resources',
      label: 'Resources',
      count: counts.resources,
      icon: Armchair,
      description: 'Treatment rooms, chairs & equipment',
    },
  ];

  const handleTabChange = (tabId: CatalogueTabType) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Breadcrumb & Page Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-soft mb-1 font-medium">
            <span className="text-[#5A2EA6] font-bold">{roleTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-semibold">{parentSection}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-[#5A2EA6] capitalize font-bold">
              {tabs.find((t) => t.id === activeTabParam)?.label}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-serif text-[26px] font-bold text-ink tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-[#5A2EA6]" />
              <span>Central Catalogue Management</span>
            </h1>
            {readOnly && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold border border-[#5A2EA6]/20">
                {roleTitle.includes('Franchise')
                  ? 'Franchise View (Read-Only)'
                  : 'Branch View (Read-Only)'}
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5 max-w-2xl">
            {readOnly
              ? roleTitle.includes('Franchise')
                ? 'Brand-wide master service catalogue, category hierarchy, timing envelopes, tariff structures, stylist competency levels, and physical station assets published for the franchise network.'
                : `Operational service menu and catalogue for ${defaultBranch !== 'All' ? defaultBranch : 'All Branches'}, timing envelopes, pricing, competency prerequisites, and room/chair resource assets published by Brand Admin.`
              : lockBranch
              ? `Operational service menu for ${defaultBranch}, timing envelopes, branch custom pricing, stylist competency prerequisites, and room/chair resource assets.`
              : 'Brand-wide authority for defining salon service menus, timing envelopes, multi-branch custom pricing, stylist competency prerequisites, and room/chair resource assets.'}
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center font-bold text-xs">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Total Services
              </span>
              <strong className="text-xs font-bold text-ink">{counts.services} Active</strong>
            </div>
          </div>

          <div className="px-3 py-2 bg-white rounded-2xl border border-purple-100/80 shadow-3xs flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center font-bold text-xs">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Resource Assets
              </span>
              <strong className="text-xs font-bold text-ink">
                {counts.resources} Tracked
              </strong>
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
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap group shrink-0',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-purple-50/50',
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-lg grid place-items-center transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-50 text-[#5A2EA6] group-hover:bg-purple-100',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded-md ml-1',
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
        {activeTabParam === 'categories' && (
          <ServiceCategoriesTab
            readOnly={readOnly}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'services' && (
          <ServicesTab
            readOnly={readOnly}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'pricing' && (
          <ServicePricingTab
            readOnly={readOnly}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
          />
        )}
        {activeTabParam === 'skills' && (
          <StaffSkillsLevelsTab
            readOnly={readOnly}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
            onSkillsCountChange={(newCount) =>
              setCounts((prev) => ({ ...prev, skills: newCount }))
            }
          />
        )}
        {activeTabParam === 'resources' && (
          <ResourcesTab
            readOnly={readOnly}
            defaultBranch={defaultBranch}
            lockBranch={lockBranch}
            onResourceCountChange={(newCount) =>
              setCounts((prev) => ({ ...prev, resources: newCount }))
            }
          />
        )}
      </div>
    </div>
  );
}

export default CatalogueMasterPage;
