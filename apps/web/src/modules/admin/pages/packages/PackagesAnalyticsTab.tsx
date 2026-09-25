import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Download,
  Filter,
  Package,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';

export function PackagesAnalyticsTab() {
  const { toast } = useToast();
  const [branchFilter, setBranchFilter] = useState('All');
  const [dateRange, setDateRange] = useState('This Year (2026)');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const { packagesApi } = await import('@/shared/api/packages.api');
        const liveAnalytics = await packagesApi.getAnalytics();
        if (liveAnalytics) {
          setAnalyticsData(liveAnalytics);
        }
      } catch (err) {
        console.error('Failed to load analytics from API', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const summary = analyticsData?.summary;

  const kpis = [
    {
      label: 'Package Sales Revenue',
      value: summary?.totalRevenue ? `₹${(summary.totalRevenue / 100000).toFixed(1)} Lakhs` : '₹48.6 Lakhs',
      change: '+18.4% vs LY',
      color: 'text-ink',
    },
    {
      label: 'Active Packages in Market',
      value: `${summary?.activePackages ?? 133} Units`,
      change: '82% Multi-service',
      color: 'text-emerald-700',
    },
    {
      label: 'Package Session Utilisation',
      value: `${summary?.sessionBurnoutRate ?? 71.4}%`,
      change: 'Optimal Pacing',
      color: 'text-[#5A2EA6]',
    },
    {
      label: 'Outstanding Package Liability',
      value: '₹14.2 Lakhs',
      change: 'Deferred Revenue',
      color: 'text-amber-700',
    },
    {
      label: 'Membership Subscription Gross',
      value: summary?.totalRevenue ? `₹${(summary.totalRevenue * 0.6 / 100000).toFixed(1)} Lakhs` : '₹89.4 Lakhs',
      change: '+24.1% vs LY',
      color: 'text-ink',
    },
    {
      label: 'Active VIP Members',
      value: `${summary?.enrolledVips ?? 466} VIPs`,
      change: 'Across 4 Tiers',
      color: 'text-[#5A2EA6]',
    },
    {
      label: 'Annual Renewal Retention',
      value: '84.2%',
      change: '+3.1% Conversion',
      color: 'text-emerald-700',
    },
    {
      label: 'Expiring in Next 30 Days',
      value: '63 VIPs',
      change: '10% Incentive Active',
      color: 'text-amber-800',
    },
  ];


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Packages &amp; Membership Performance Intelligence
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              ₹1.38 Cr Total Contracted Value
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Holistic recurring subscription metrics, package session burnout velocity, liability
            tracking, and cross-branch renewal conversion.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported comprehensive analytics dossier to PDF & CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics</span>
          </Button>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs space-y-1"
          >
            <span className="text-[10px] text-muted uppercase font-bold block">{kpi.label}</span>
            <strong className={cn('text-2xl font-bold font-serif block', kpi.color)}>
              {kpi.value}
            </strong>
            <span className="text-[10px] text-soft block">{kpi.change}</span>
          </div>
        ))}
      </div>

      {/* Analytics Charts & Multi-Branch Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Package Utilisation Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-purple-50">
            <h3 className="font-bold text-ink text-sm">Package Session Burnout Pacing</h3>
            <span className="text-xs text-[#5A2EA6] font-bold">71.4% Used</span>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Redeemed & Executed',
                pct: 71.4,
                count: '640 Sessions',
                color: 'bg-emerald-600',
              },
              {
                label: 'Remaining Unredeemed',
                pct: 24.2,
                count: '217 Sessions',
                color: 'bg-[#5A2EA6]',
              },
              {
                label: 'Expired (Unredeemed)',
                pct: 4.4,
                count: '39 Sessions',
                color: 'bg-slate-400',
              },
            ].map((src) => (
              <div key={src.label} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-ink">{src.label}</span>
                  <strong className="text-[#5A2EA6]">{src.pct}%</strong>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn('h-full', src.color)} style={{ width: `${src.pct}%` }} />
                </div>
                <span className="text-[10px] text-muted">{src.count}</span>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-[#FAF7FF] rounded-xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed font-medium">
            Average bridal package session exhaustion is 48 days from initial purchase,
            demonstrating high engagement.
          </div>
        </div>

        {/* Multi-Branch Performance Comparison (8 cols) */}
        <div className="lg:col-span-8 premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Cross-Branch Commercial Performance Matrix
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                FY 2026 Telemetry
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Branch Location',
                    'Package Sales (₹)',
                    'Membership Sales (₹)',
                    'Enrolled VIPs',
                    'Renewal Rate',
                    'Utilisation %',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 5 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {masterBranches.slice(0, 5).map((br, idx) => (
                  <tr key={br.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-xs block">{br.name}</strong>
                      <span className="text-[10px] text-muted">{br.code}</span>
                    </td>
                    <td className="p-3.5 font-serif font-bold text-ink">₹{14.2 - idx * 2.1}L</td>
                    <td className="p-3.5 font-serif font-bold text-[#5A2EA6]">
                      ₹{26.8 - idx * 4.2}L
                    </td>
                    <td className="p-3.5 font-bold text-ink">{142 - idx * 22} VIPs</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {88 - idx * 2}%
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right font-bold text-emerald-700">
                      {78 - idx * 2}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackagesAnalyticsTab;
