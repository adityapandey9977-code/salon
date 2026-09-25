import { cn } from '@salon-spa-saas/ui';
import { Box, Crown, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { MembershipsPage } from './MembershipsPage';
import { PackagesPage } from './PackagesPage';

export function PackagesMembershipsPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'memberships'>('packages');

  return (
    <div className="space-y-6">
      {/* Top Tab Switcher */}
      <div className="flex items-center justify-between border-b border-[#5A2EA6]/10 pb-4">
        <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <button
            onClick={() => setActiveTab('packages')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0',
              activeTab === 'packages'
                ? 'bg-[#5A2EA6] text-white shadow-sm'
                : 'bg-transparent text-soft hover:text-ink hover:bg-slate-100',
            )}
          >
            <Box className="w-4 h-4" />
            <span>Service Packages</span>
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0',
              activeTab === 'memberships'
                ? 'bg-[#5A2EA6] text-white shadow-sm'
                : 'bg-transparent text-soft hover:text-ink hover:bg-slate-100',
            )}
          >
            <Crown className="w-4 h-4" />
            <span>Membership Tiers</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {activeTab === 'packages' ? <PackagesPage /> : <MembershipsPage />}
    </div>
  );
}
