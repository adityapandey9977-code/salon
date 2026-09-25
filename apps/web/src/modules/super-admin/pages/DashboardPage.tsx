import { Button, cn } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import {
  RegionalMetricsBarChart,
  RevenueAreaChart,
  SubscriptionDonutChart,
} from '../components/DashboardCharts';
import { ProvisionTenantModal } from '../components/ProvisionTenantModal';
import { Tenant, useSuperAdminStore } from '../context/SuperAdminContext';

export function DashboardPage() {
  const { tenants, subscriptionPlans } = useSuperAdminStore();
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Active' | 'Suspended' | 'Pending Setup'
  >('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '6M' | 'YTD'>('30D');

  const totalBranchesCount = tenants.reduce((acc, t) => acc + (t.branchesCount ?? 0), 0) + 130;

  // Filtered Tenants List
  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || tenant.status === statusFilter;
      const matchesTier = tierFilter === 'All' || tenant.activePlans === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [tenants, searchQuery, statusFilter, tierFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || tierFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTierFilter('All');
  };

  // Mock Live Activity Feed Data
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Blush & Bloom Group',
      desc: 'Provisioned 2 new branch locations in Arera Colony, Bhopal',
      time: '12 mins ago',
      type: 'success',
      icon: CheckCircle2,
    },
    {
      id: 'act-2',
      title: 'Subscription Auto-Renewed',
      desc: 'Elegance Spa renewed Enterprise Plan (₹24,500/mo)',
      time: '1 hour ago',
      type: 'info',
      icon: DollarSign,
    },
    {
      id: 'act-3',
      title: 'Support Ticket Escalation',
      desc: 'Royal Grooming Lounge requested POS GST tax invoice override',
      time: '3 hours ago',
      type: 'warning',
      icon: AlertTriangle,
    },
    {
      id: 'act-4',
      title: 'Custom CNAME SSL Verified',
      desc: 'app.blushbloom.in SSL certificate auto-provisioned by Cloudflare',
      time: '5 hours ago',
      type: 'info',
      icon: Globe,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Super Admin Dashboard
            </h1>
            <span className="bg-[#7C3AED]/10 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#7C3AED]/20">
              Live Operations Telemetry
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Real-time analytics across all salon tenants, custom CNAME instances, and revenue
            channels.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Range Filter Pills */}
          <div className="bg-[#F8F5FF] border border-[#5A2EA6]/10 p-1 rounded-xl flex items-center gap-1">
            {(['7D', '30D', '6M', 'YTD'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'text-muted hover:text-ink hover:bg-white/60'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => alert('Exporting platform telemetry report...')}
            className="h-[38px] px-3.5 rounded-xl text-xs font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </Button>

          <Button
            onClick={() => setIsProvisionModalOpen(true)}
            className="h-[38px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Provision New Tenant</span>
          </Button>
        </div>
      </div>

      {/* Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: 'Total Salons & Branches',
            value: `${totalBranchesCount} Branches`,
            sub: '+12 locations added this month',
            icon: Building2,
            accent: '#7C3AED',
            chartMini: [20, 25, 30, 38, 42, 50],
          },
          {
            label: 'Active Subscriptions',
            value: `${subscriptionPlans.reduce((acc, p) => acc + p.subscriberCount, 0)} Plans`,
            sub: '68 Enterprise • 48 Premium',
            icon: ShieldCheck,
            accent: '#EC4899',
            chartMini: [15, 18, 22, 28, 31, 35],
          },
          {
            label: 'Monthly Recurring Revenue',
            value: '₹45.2 Lakhs',
            sub: '+14.2% MoM platform growth',
            icon: DollarSign,
            accent: '#10B981',
            chartMini: [31, 34, 37, 40, 43, 45],
          },
          {
            label: 'Platform Uptime & CNAMEs',
            value: '99.98%',
            sub: '42 Custom CNAMEs • 18ms Latency',
            icon: Globe,
            accent: '#3B82F6',
            chartMini: [99, 99.8, 99.9, 99.95, 99.98, 99.98],
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[22px] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
                  {stat.label}
                </span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.accent}15`, color: stat.accent }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <strong className="text-2xl font-serif font-bold text-ink block">
                    {stat.value}
                  </strong>
                  <span className="text-[10.5px] font-semibold text-[#5A2EA6] mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 inline" /> {stat.sub}
                  </span>
                </div>

                {/* Mini Sparkline SVG */}
                <div className="w-16 h-8 opacity-70">
                  <svg viewBox="0 0 60 25" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke={stat.accent}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={stat.chartMini
                        .map((v, idx) => {
                          const x = (idx / (stat.chartMini.length - 1)) * 55 + 2;
                          const min = Math.min(...stat.chartMini);
                          const max = Math.max(...stat.chartMini);
                          const y = 22 - ((v - min) / (max - min || 1)) * 18;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueAreaChart />
        </div>
        <div>
          <SubscriptionDonutChart />
        </div>
      </div>

      {/* Regional Metrics & Live Activity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RegionalMetricsBarChart />
        </div>

        {/* Live System Activity Feed */}
        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-ink">Live Activity Feed</h3>
                  <p className="text-[11px] text-muted">Real-time platform operations</p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex gap-3 items-start text-xs border-b border-[#5A2EA6]/5 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="w-7 h-7 rounded-xl bg-[#5A2EA6]/10 flex items-center justify-center text-[#5A2EA6] shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-ink font-semibold truncate text-[12px]">
                          {act.title}
                        </strong>
                        <span className="text-[10px] text-muted shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">{act.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = '/super-admin/audit-logs';
            }}
            className="w-full mt-4 h-8 text-[11px] font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 rounded-xl flex items-center justify-center gap-1"
          >
            <span>View Full Audit Logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Salon Registry Roster with Search & Filters */}
      <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] shadow-xs overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-5 border-b border-[#5A2EA6]/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">
                Tenant Salon Registry Telemetry
              </h3>
              <p className="text-[12px] text-muted mt-0.5">
                Active tenant roster, subscription tiers, revenue tracking, and account statuses
              </p>
            </div>
            <div className="text-xs text-muted flex items-center gap-2">
              <span className="font-semibold text-[#5A2EA6]">
                Showing {filteredTenants.length} of {tenants.length} Tenants
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Filter Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search by salon name, owner, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending Setup">Pending Setup</option>
              </select>
            </div>

            {/* Tier Filter */}
            <div className="relative">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Subscription Tiers</option>
                <option value="Enterprise Plan">Enterprise Plan</option>
                <option value="Premium Plan">Premium Plan</option>
                <option value="Standard Plan">Standard Plan</option>
              </select>
            </div>

            {/* Quick Action Button */}
            <Button
              onClick={() => {
                window.location.href = '/super-admin/salons';
              }}
              variant="outline"
              className="w-full h-full rounded-xl text-xs font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-1.5"
            >
              <span>Manage All Salons</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                <th className="p-4 pl-6 font-bold text-[10px] tracking-wider uppercase">
                  Salon / Tenant Name
                </th>
                <th className="p-4 font-bold text-[10px] tracking-wider uppercase">Tenant Owner</th>
                <th className="p-4 font-bold text-[10px] tracking-wider uppercase">
                  Subscription Tier
                </th>
                <th className="p-4 font-bold text-[10px] tracking-wider uppercase">Branches</th>
                <th className="p-4 font-bold text-[10px] tracking-wider uppercase">
                  Monthly Revenue
                </th>
                <th className="p-4 pr-6 text-right font-bold text-[10px] tracking-wider uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((salon) => (
                  <tr
                    key={salon.id}
                    className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                  >
                    <td className="p-4 pl-6">
                      <strong className="block text-ink font-semibold">{salon.name}</strong>
                      <span className="text-[10px] text-muted block mt-0.5">
                        {salon.city} HQ • {salon.customDomain || `${salon.slug}.digiflex.in`}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="block text-ink">{salon.ownerName}</strong>
                      <span className="text-[10px] text-muted block">{salon.ownerEmail}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-[#5A2EA6]/10 text-[#5A2EA6] font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                        {salon.activePlans}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#5A2EA6]">
                      <span className="inline-flex items-center gap-1 bg-[#F8F5FF] border border-[#5A2EA6]/10 px-2.5 py-0.5 rounded-full text-[10.5px]">
                        <Layers className="w-3 h-3 text-[#7C3AED]" /> {salon.branchesCount ?? 0}{' '}
                        Branches
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#5A2EA6] text-[13px]">{salon.revenue}</td>
                    <td className="p-4 pr-6 text-right">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-full text-[9.5px] font-bold',
                          salon.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200',
                        )}
                      >
                        {salon.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted text-xs">
                    No salon tenants found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ProvisionTenantModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
      />
    </div>
  );
}
