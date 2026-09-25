import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Filter,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Paperclip,
  Phone,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useComplianceStore } from '@/shared/compliance/complianceStore';

export function DashboardPage() {
  const { toast } = useToast();
  const { activeRequirements, submissions } = useComplianceStore();

  const complianceMetrics = useMemo(() => {
    const total = activeRequirements.length;
    const approved = activeRequirements.filter((req) =>
      submissions.some((s) => s.requirementId === req.id && s.status === 'Verified'),
    ).length;
    const pending = total - approved;
    const percentage = total > 0 ? Math.round((approved / total) * 100) : 100;
    return { total, approved, pending, percentage };
  }, [activeRequirements, submissions]);

  // Date filter state: 'weekly' | 'monthly' | 'custom'
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'custom'>('monthly');
  const [customStartDate, setCustomStartDate] = useState('2026-08-01');
  const [customEndDate, setCustomEndDate] = useState('2026-08-26');

  // Contact Head Office Modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactActiveTab, setContactActiveTab] = useState<'directory' | 'raise_ticket'>(
    'directory',
  );

  // Support ticket form state
  const [ticketForm, setTicketForm] = useState({
    branch: 'Indrapuri Central Outlet',
    recipient: 'Franchise Operations & Audits Team',
    category: 'Royalty & Billing Clarification',
    priority: 'High',
    subject: '',
    description: '',
    attachmentName: '',
  });
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  // Dynamic KPI Cards based on chosen timeframe
  const getKpiCards = () => {
    if (timeframe === 'weekly') {
      return [
        {
          label: "This Week's Revenue",
          value: '₹12,48,500',
          pct: '↑ 9.4% vs last week',
          stroke: '#10b981',
          sparkPath: 'M0 18 Q 15 10, 30 14 T 60 4',
        },
        {
          label: 'Weekly Appointments',
          value: '264 Visits',
          pct: '↑ 12% vs last week',
          stroke: '#5A2EA6',
          sparkPath: 'M0 20 Q 15 22, 30 14 T 60 5',
        },
        {
          label: 'Avg Daily Run-rate',
          value: '₹1,78,350/day',
          pct: 'On target pace',
          stroke: '#10b981',
          sparkPath: 'M0 22 Q 15 18, 30 20 T 60 12',
        },
        {
          label: 'Customer Satisfaction',
          value: '4.9 / 5.0 ⭐',
          pct: '99.1% Positive Feedback',
          stroke: '#f59e0b',
          sparkPath: 'M0 12 Q 15 10, 30 12 T 60 12',
        },
        {
          label: 'Compliance Status',
          value: complianceMetrics.pending === 0 ? '100% Compliant' : `${complianceMetrics.pending} Audits Due`,
          pct: complianceMetrics.pending === 0 ? 'All Standards Verified' : `${complianceMetrics.percentage}% Compliance Rating`,
          stroke: complianceMetrics.pending === 0 ? '#10b981' : '#f97316',
          sparkPath: 'M0 20 Q 15 15, 30 10 T 60 3',
        },
        {
          label: 'Accrued Weekly Fees',
          value: '₹99,880',
          pct: 'Settlement cycle',
          stroke: '#5A2EA6',
          sparkPath: 'M0 18 Q 15 12, 30 8 T 60 2',
        },
        {
          label: 'Low Stock Alerts',
          value: '3 SKUs Low',
          pct: 'Reorder Needed',
          stroke: '#ef4444',
          sparkPath: 'M0 10 Q 15 18, 30 12 T 60 22',
        },
      ];
    }

    if (timeframe === 'custom') {
      return [
        {
          label: 'Custom Range Revenue',
          value: '₹34,80,000',
          pct: `Selected: ${customStartDate} to ${customEndDate}`,
          stroke: '#10b981',
          sparkPath: 'M0 18 Q 15 10, 30 12 T 60 3',
        },
        {
          label: 'Appointments in Range',
          value: '742 Visits',
          pct: 'Custom Date Selection',
          stroke: '#5A2EA6',
          sparkPath: 'M0 20 Q 15 22, 30 14 T 60 5',
        },
        {
          label: 'Period Gross GMV',
          value: '₹34,80,000',
          pct: 'Net of discounts',
          stroke: '#10b981',
          sparkPath: 'M0 22 Q 15 18, 30 20 T 60 12',
        },
        {
          label: 'Customer Satisfaction',
          value: '4.9 / 5.0 ⭐',
          pct: '98.7% Positive Score',
          stroke: '#f59e0b',
          sparkPath: 'M0 12 Q 15 10, 30 12 T 60 12',
        },
        {
          label: 'Audit Log Records',
          value: '18 Events',
          pct: 'Within range',
          stroke: '#f97316',
          sparkPath: 'M0 20 Q 15 15, 30 10 T 60 3',
        },
        {
          label: 'Period Royalty Base',
          value: '₹2,78,400',
          pct: '8% Franchise Model',
          stroke: '#5A2EA6',
          sparkPath: 'M0 18 Q 15 12, 30 8 T 60 2',
        },
        {
          label: 'Low Stock Alerts',
          value: '3 SKUs Low',
          pct: 'Action Required',
          stroke: '#ef4444',
          sparkPath: 'M0 10 Q 15 18, 30 12 T 60 22',
        },
      ];
    }

    // Default 'monthly'
    return [
      {
        label: "Today's Revenue",
        value: '₹1,84,500',
        pct: '↑ 14% vs yesterday',
        stroke: '#10b981',
        sparkPath: 'M0 18 Q 15 12, 30 15 T 60 4',
      },
      {
        label: "Today's Appointments",
        value: '38 Visits',
        pct: '↑ 8% vs yesterday',
        stroke: '#5A2EA6',
        sparkPath: 'M0 20 Q 15 22, 30 14 T 60 5',
      },
      {
        label: 'Monthly Revenue',
        value: '₹48,50,000',
        pct: '↑ 14.2% vs last month',
        stroke: '#10b981',
        sparkPath: 'M0 22 Q 15 18, 30 20 T 60 12',
      },
      {
        label: 'Customer Satisfaction',
        value: '4.9 / 5.0 ⭐',
        pct: '98.4% Positive Feedback',
        stroke: '#f59e0b',
        sparkPath: 'M0 12 Q 15 10, 30 12 T 60 12',
      },
      {
        label: 'Compliance Status',
        value: complianceMetrics.pending === 0 ? '100% Compliant' : `${complianceMetrics.pending} Audits Due`,
        pct: complianceMetrics.pending === 0 ? 'All Standards Verified' : `${complianceMetrics.percentage}% Compliance Rating`,
        stroke: complianceMetrics.pending === 0 ? '#10b981' : '#f97316',
        sparkPath: 'M0 20 Q 15 15, 30 10 T 60 3',
      },
      {
        label: 'Outstanding Fees',
        value: '₹3,88,000',
        pct: 'Due Aug 10, 2026',
        stroke: '#ef4444',
        sparkPath: 'M0 18 Q 15 12, 30 8 T 60 2',
      },
      {
        label: 'Low Stock Alerts',
        value: '3 SKUs Low',
        pct: 'Reorder Needed',
        stroke: '#ef4444',
        sparkPath: 'M0 10 Q 15 18, 30 12 T 60 22',
      },
    ];
  };

  // Branch Performance Table Data dynamically adjusted for selected timeframe
  const getBranchPerformance = () => {
    if (timeframe === 'weekly') {
      return [
        {
          id: 'LOC-01',
          name: 'Indrapuri Central Outlet',
          manager: 'Ananya Deshmukh',
          seats: 12,
          periodRev: '₹4,12,000',
          secondaryRev: '₹62,400 / day',
          appts: 92,
          compliance: '99.1%',
          status: 'Active',
        },
        {
          id: 'LOC-02',
          name: 'Arera Colony Outlet',
          manager: 'Rohan Varma',
          seats: 10,
          periodRev: '₹3,65,000',
          secondaryRev: '₹54,200 / day',
          appts: 76,
          compliance: '98.5%',
          status: 'Active',
        },
        {
          id: 'LOC-03',
          name: 'Kolar Road Outlet',
          manager: 'Siddharth Rao',
          seats: 8,
          periodRev: '₹2,78,000',
          secondaryRev: '₹40,800 / day',
          appts: 58,
          compliance: '97.4%',
          status: 'Active',
        },
        {
          id: 'LOC-04',
          name: 'MP Nagar Flagship Branch',
          manager: 'Kavita Sen',
          seats: 14,
          periodRev: '₹1,93,500',
          secondaryRev: '₹27,100 / day',
          appts: 38,
          compliance: '97.8%',
          status: 'Active',
        },
      ];
    }
    if (timeframe === 'custom') {
      return [
        {
          id: 'LOC-01',
          name: 'Indrapuri Central Outlet',
          manager: 'Ananya Deshmukh',
          seats: 12,
          periodRev: '₹11,48,000',
          secondaryRev: '260 Visits',
          appts: 260,
          compliance: '99.1%',
          status: 'Active',
        },
        {
          id: 'LOC-02',
          name: 'Arera Colony Outlet',
          manager: 'Rohan Varma',
          seats: 10,
          periodRev: '₹10,15,000',
          secondaryRev: '215 Visits',
          appts: 215,
          compliance: '98.5%',
          status: 'Active',
        },
        {
          id: 'LOC-03',
          name: 'Kolar Road Outlet',
          manager: 'Siddharth Rao',
          seats: 8,
          periodRev: '₹7,65,000',
          secondaryRev: '155 Visits',
          appts: 155,
          compliance: '97.4%',
          status: 'Active',
        },
        {
          id: 'LOC-04',
          name: 'MP Nagar Flagship Branch',
          manager: 'Kavita Sen',
          seats: 14,
          periodRev: '₹5,52,000',
          secondaryRev: '112 Visits',
          appts: 112,
          compliance: '97.8%',
          status: 'Active',
        },
      ];
    }
    // Monthly
    return [
      {
        id: 'LOC-01',
        name: 'Indrapuri Central Outlet',
        manager: 'Ananya Deshmukh',
        seats: 12,
        periodRev: '₹16,40,000',
        secondaryRev: '₹62,400 today',
        appts: 374,
        compliance: '99.1%',
        status: 'Active',
      },
      {
        id: 'LOC-02',
        name: 'Arera Colony Outlet',
        manager: 'Rohan Varma',
        seats: 10,
        periodRev: '₹14,20,000',
        secondaryRev: '₹54,200 today',
        appts: 312,
        compliance: '98.5%',
        status: 'Active',
      },
      {
        id: 'LOC-03',
        name: 'Kolar Road Outlet',
        manager: 'Siddharth Rao',
        seats: 8,
        periodRev: '₹10,80,000',
        secondaryRev: '₹40,800 today',
        appts: 254,
        compliance: '97.4%',
        status: 'Active',
      },
      {
        id: 'LOC-04',
        name: 'MP Nagar Flagship Branch',
        manager: 'Kavita Sen',
        seats: 14,
        periodRev: '₹7,10,000',
        secondaryRev: '₹27,100 today',
        appts: 202,
        compliance: '97.8%',
        status: 'Active',
      },
    ];
  };

  // Trajectory series based on timeframe
  const getTrajectoryData = () => {
    if (timeframe === 'weekly') {
      return [
        { label: 'Mon', rev: '₹1.62L', growth: '+8%' },
        { label: 'Tue', rev: '₹1.58L', growth: '+6%' },
        { label: 'Wed', rev: '₹1.74L', growth: '+11%' },
        { label: 'Thu', rev: '₹1.81L', growth: '+14%' },
        { label: 'Fri', rev: '₹2.15L', growth: '+19%' },
        { label: 'Sat', rev: '₹2.42L', growth: '+24%' },
        { label: 'Sun', rev: '₹1.84L', growth: '+14%' },
      ];
    }
    if (timeframe === 'custom') {
      return [
        { label: 'Week 1', rev: '₹8.4L', growth: '+10%' },
        { label: 'Week 2', rev: '₹8.9L', growth: '+12%' },
        { label: 'Week 3', rev: '₹9.2L', growth: '+15%' },
        { label: 'Week 4', rev: '₹8.3L', growth: '+14%' },
      ];
    }
    // Monthly default
    return [
      { label: 'Apr', rev: '₹38.2L', growth: '+3%' },
      { label: 'May', rev: '₹41.5L', growth: '+6%' },
      { label: 'Jun', rev: '₹43.8L', growth: '+9%' },
      { label: 'Jul', rev: '₹45.2L', growth: '+12%' },
      { label: 'Aug', rev: '₹48.5L', growth: '+15%' },
    ];
  };

  const packageSales = [
    { name: 'Bridal Pamper & Radiance Glow', sales: '142 Packages', rev: '₹8,52,000' },
    { name: 'Keratin Hair Smooth Therapy', sales: '98 Packages', rev: '₹5,88,000' },
    { name: 'Gold Membership Annual Pass', sales: '64 Passes', rev: '₹3,84,000' },
  ];

  const topServices = [
    { name: 'Hydra Facial Detox & Glow Spa', count: '284 Bookings', rev: '₹11,92,800' },
    { name: 'Balayage Hair Color & Gloss', count: '210 Bookings', rev: '₹13,65,000' },
    { name: 'Deep Tissue Muscle Relief Massage', count: '175 Bookings', rev: '₹7,87,500' },
    { name: 'Aroma Therapy Pedicure & Manicure', count: '160 Bookings', rev: '₹4,00,000' },
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      toast('Please enter both Subject and Description to raise a ticket.');
      return;
    }

    const newTicketId = `TCK-HQ-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketSubmittedId(newTicketId);
    toast(`Support Ticket [${newTicketId}] submitted successfully to ${ticketForm.recipient}.`);
  };

  const resetTicketForm = () => {
    setTicketSubmittedId(null);
    setTicketForm({
      branch: 'Indrapuri Central Outlet',
      recipient: 'Franchise Operations & Audits Team',
      category: 'Royalty & Billing Clarification',
      priority: 'High',
      subject: '',
      description: '',
      attachmentName: '',
    });
  };

  return (
    <div className="animate-in fade-in duration-300 pb-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink tracking-tight">
              Franchise Executive Dashboard
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-500" /> Overall Health
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Comprehensive multi-outlet health monitoring, real-time KPI metrics, revenue trajectory,
            and direct Head Office escalation.
          </p>
        </div>

        {/* Action Toolbar: Date Range Filter + Contact Head Office Dialog Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          {/* Timeframe Filter Controls */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-line shadow-xs">
            <button
              onClick={() => {
                setTimeframe('weekly');
                toast('Filtered: Displaying Weekly franchise performance records.');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${timeframe === 'weekly'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'bg-transparent text-soft hover:text-ink'
                }`}
            >
              Weekly
            </button>
            <button
              onClick={() => {
                setTimeframe('monthly');
                toast('Filtered: Displaying Monthly franchise performance records.');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${timeframe === 'monthly'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'bg-transparent text-soft hover:text-ink'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                setTimeframe('custom');
                toast('Filtered: Custom Date mode active. Set custom start and end date.');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 flex items-center gap-1 ${timeframe === 'custom'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'bg-transparent text-soft hover:text-ink'
                }`}
            >
              <Calendar className="w-3 h-3" /> Custom Date
            </button>
          </div>

          {/* Contact Head Office Button -> Opens Executive & Ticket Dialog */}
          <button
            onClick={() => {
              setIsContactModalOpen(true);
              setContactActiveTab('directory');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0 whitespace-nowrap"
          >
            <Headphones className="w-3.5 h-3.5" /> Contact Head Office
          </button>
        </div>
      </div>

      {/* Custom Date Selector Bar (Visible when 'custom' timeframe is selected) */}
      {timeframe === 'custom' && (
        <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-xs text-purple-950 font-bold">
            <Filter className="w-4 h-4 text-[#5A2EA6]" />
            <span>Select Custom Date Span:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
              <span className="text-[11px] font-semibold text-soft">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="text-xs font-bold text-ink bg-transparent border-0 outline-none cursor-pointer"
              />
            </div>

            <span className="text-soft font-semibold">to</span>

            <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-purple-200">
              <span className="text-[11px] font-semibold text-soft">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="text-xs font-bold text-ink bg-transparent border-0 outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => toast(`Applied Date Range: ${customStartDate} to ${customEndDate}`)}
              className="px-3 py-1 bg-[#5A2EA6] text-white font-bold rounded-lg text-xs hover:bg-[#482387] cursor-pointer border-0 transition"
            >
              Apply Span
            </button>
          </div>
        </div>
      )}

      {/* 7 KPI Cards */}
      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {getKpiCards().map((stat, i) => (
          <div
            key={i}
            className="min-w-[170px] flex-1 bg-white p-3.5 rounded-2xl border border-line shadow-xs space-y-1 shrink-0 hover:shadow-md transition-all"
          >
            <span className="text-[9.5px] font-bold text-soft tracking-wider block uppercase">
              {stat.label}
            </span>

            <div className="text-xl font-bold text-ink tracking-tight leading-none pt-0.5">
              {stat.value}
            </div>

            <div className="pt-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-emerald-700">{stat.pct}</span>
              <svg className="w-12 h-5 overflow-visible" viewBox="0 0 60 24">
                <path
                  d={stat.sparkPath}
                  fill="none"
                  stroke={stat.stroke}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1 & 2: Revenue & Appointments Trajectory */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#5A2EA6]" /> Revenue &amp; Appointment Volume (
                {timeframe.toUpperCase()})
              </h3>
              <p className="text-xs text-soft">
                {timeframe === 'weekly'
                  ? '7-Day daily breakdown across all licensed franchise outlets'
                  : timeframe === 'custom'
                    ? `Periodic aggregation for ${customStartDate} through ${customEndDate}`
                    : '5-Month financial revenue growth across all 4 franchise branches'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {timeframe === 'weekly'
                ? '+9.4% WoW'
                : timeframe === 'custom'
                  ? 'Selected Span'
                  : '+14.2% Growth'}
            </span>
          </div>

          <div
            className={`grid gap-3 pt-2 text-center ${timeframe === 'weekly' ? 'grid-cols-7' : timeframe === 'custom' ? 'grid-cols-4' : 'grid-cols-5'}`}
          >
            {getTrajectoryData().map((d, idx) => (
              <div key={idx} className="p-3 bg-paper/40 rounded-xl border border-line space-y-1">
                <span className="text-[10px] font-bold text-soft uppercase">{d.label}</span>
                <div className="text-sm font-bold text-[#5A2EA6]">{d.rev}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">{d.growth}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3 & 4: Customer Growth & Package Sales */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-3">
            <Package className="w-4 h-4 text-[#5A2EA6]" /> Package &amp; Membership Sales
          </h3>

          <div className="space-y-3">
            {packageSales.map((pkg, idx) => (
              <div key={idx} className="p-3 bg-pine/5 rounded-xl border border-line space-y-0.5">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>{pkg.name}</span>
                  <span className="text-emerald-700">{pkg.rev}</span>
                </div>
                <div className="text-[10.5px] text-soft">
                  {pkg.sales} ({timeframe})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 5: Top Services Leaderboard */}
      <div className="bg-white p-5 rounded-2xl border border-line shadow-xs space-y-3">
        <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-3">
          <Scissors className="w-4 h-4 text-[#5A2EA6]" /> Top Services Leaderboard Across Outlets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {topServices.map((srv, idx) => (
            <div key={idx} className="p-3.5 bg-paper/30 rounded-xl border border-line space-y-1">
              <span className="text-[10px] font-bold text-[#5A2EA6] uppercase bg-purple-50 px-2 py-0.5 rounded-md">
                Rank #{idx + 1}
              </span>
              <div className="font-bold text-ink text-xs pt-1">{srv.name}</div>
              <div className="text-soft text-[11px]">{srv.count}</div>
              <div className="text-emerald-700 font-bold">{srv.rev}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BRANCH PERFORMANCE TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-[#5A2EA6] to-[#7B42D1] text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="font-serif text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-300" /> Branch Performance Matrix (
              {timeframe.toUpperCase()})
            </h3>
            <p className="text-xs text-purple-100 mt-0.5">
              Comparative turnover, customer footfall, and compliance scores
            </p>
          </div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white">
            4 Active Branches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Branch Ref &amp; Name</th>
                <th className="p-3">Branch Manager</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">
                  {timeframe === 'weekly'
                    ? 'Weekly Revenue'
                    : timeframe === 'custom'
                      ? 'Span Revenue'
                      : 'Monthly Revenue'}
                </th>
                <th className="p-3">
                  {timeframe === 'weekly'
                    ? 'Daily Average'
                    : timeframe === 'custom'
                      ? 'Appointments'
                      : "Today's Target"}
                </th>
                <th className="p-3">Compliance Score</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {getBranchPerformance().map((b) => (
                <tr key={b.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-[#5A2EA6]">
                    <div>{b.name}</div>
                    <div className="text-[10px] text-soft font-medium">{b.id}</div>
                  </td>
                  <td className="p-3 font-semibold text-ink">{b.manager}</td>
                  <td className="p-3 font-bold text-purple-900">{b.seats} Seats</td>
                  <td className="p-3 font-bold text-purple-900 text-sm">{b.periodRev}</td>
                  <td className="p-3 font-bold text-emerald-700">{b.secondaryRev}</td>
                  <td className="p-3 font-bold text-emerald-700">{b.compliance}</td>
                  <td className="p-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONTACT HEAD OFFICE / BRAND OWNER / ADMIN DIALOG WITH TICKET RAISING       */}
      {/* ========================================================================= */}
      {isContactModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.22)] border border-[#5A2EA6]/15 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#5A2EA6] to-[#7B42D1] text-white p-5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      Head Office &amp; Executive Helpdesk
                    </h3>
                    <p className="text-xs text-purple-100">
                      Direct contacts with Brand Owners, Platform Admins &amp; Ticket Escalation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsContactModalOpen(false);
                    resetTicketForm();
                  }}
                  className="text-white/80 hover:text-white transition bg-white/10 hover:bg-white/20 p-2 rounded-xl border-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex border-b border-line bg-paper/30 p-2 gap-2 shrink-0">
                <button
                  onClick={() => setContactActiveTab('directory')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border-0 ${contactActiveTab === 'directory'
                      ? 'bg-white text-[#5A2EA6] shadow-xs border border-line'
                      : 'text-soft hover:text-ink bg-transparent'
                    }`}
                >
                  <Building2 className="w-4 h-4" /> HQ Contacts &amp; Leadership Directory
                </button>
                <button
                  onClick={() => setContactActiveTab('raise_ticket')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border-0 ${contactActiveTab === 'raise_ticket'
                      ? 'bg-white text-[#5A2EA6] shadow-xs border border-line'
                      : 'text-soft hover:text-ink bg-transparent'
                    }`}
                >
                  <Send className="w-4 h-4 text-emerald-600" /> Raise Support Ticket to HQ
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                {contactActiveTab === 'directory' ? (
                  /* TAB 1: EXECUTIVE CONTACT DIRECTORY */
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Contact 1: Brand Owner / Managing Director */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center font-bold">
                            👑
                          </div>
                          <div>
                            <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                              Vikramaditya Rathore
                              <span className="text-[9.5px] bg-amber-200 text-amber-900 px-2 py-0.2 rounded-md font-bold uppercase">
                                Brand Founder &amp; MD
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-800">
                              Executive Brand Governance, Joint Ventures &amp; Strategic Decisions
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <a
                          href="mailto:md.rathore@digiflexsalon.com"
                          className="flex items-center gap-1.5 text-amber-900 font-semibold hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-700" />{' '}
                          md.rathore@digiflexsalon.com
                        </a>
                        <a
                          href="tel:+919826011223"
                          className="flex items-center gap-1.5 text-amber-900 font-semibold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-700" /> +91 98260 11223 (Direct
                          Line)
                        </a>
                      </div>
                    </div>

                    {/* Contact 2: Platform Admin & Franchise Operations Head */}
                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center justify-center font-bold">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                              Meera Kulkarni
                              <span className="text-[9.5px] bg-purple-200 text-purple-900 px-2 py-0.2 rounded-md font-bold uppercase">
                                Head of Franchise Operations &amp; Admin
                              </span>
                            </div>
                            <p className="text-[11px] text-purple-800">
                              Daily Branch SOPs, Franchise Onboarding, Audits &amp; Escalations
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <a
                          href="mailto:franchise.ops@digiflexsalon.com"
                          className="flex items-center gap-1.5 text-purple-950 font-semibold hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#5A2EA6]" />{' '}
                          franchise.ops@digiflexsalon.com
                        </a>
                        <a
                          href="tel:+919826044556"
                          className="flex items-center gap-1.5 text-purple-950 font-semibold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" /> +91 98260 44556 (Ext
                          #402)
                        </a>
                      </div>
                    </div>

                    {/* Contact 3: Accounts & Royalty Billing Desk */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-900 flex items-center justify-center font-bold">
                            💼
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                              Franchise Accounts &amp; Royalty Settlement Desk
                              <span className="text-[9.5px] bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-md font-bold uppercase">
                                Finance HQ
                              </span>
                            </div>
                            <p className="text-[11px] text-emerald-800">
                              GST Invoices, Royalty Computations, Reconciliation &amp; Payments
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <a
                          href="mailto:billing.franchise@digiflexsalon.com"
                          className="flex items-center gap-1.5 text-emerald-950 font-semibold hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 text-emerald-700" />{' '}
                          billing.franchise@digiflexsalon.com
                        </a>
                        <div className="flex items-center gap-1.5 text-emerald-950 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" /> Mon - Sat, 09:30 AM -
                          06:30 PM IST
                        </div>
                      </div>
                    </div>

                    {/* Corporate HQ Address & Quick Action Footer */}
                    <div className="p-3.5 rounded-xl bg-paper/60 border border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-2 text-soft">
                        <MapPin className="w-4 h-4 text-[#5A2EA6] shrink-0" />
                        <span className="text-[11px]">
                          Corporate HQ:   Luxury Towers, Level 4, Business Central Avenue,
                          Mumbai
                        </span>
                      </div>
                      <button
                        onClick={() => setContactActiveTab('raise_ticket')}
                        className="px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer border-0 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" /> Raise Ticket to HQ
                      </button>
                    </div>
                  </div>
                ) : (
                  /* TAB 2: RAISE SUPPORT TICKET FORM */
                  <div className="animate-in fade-in duration-200">
                    {ticketSubmittedId ? (
                      <div className="p-8 text-center space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-base font-serif font-bold text-emerald-950">
                            Ticket Successfully Logged with Head Office
                          </h4>
                          <p className="text-xs text-emerald-800 mt-1">
                            Tracking Reference:{' '}
                            <span className="font-bold font-mono bg-white px-2 py-0.5 rounded border border-emerald-300">
                              {ticketSubmittedId}
                            </span>
                          </p>
                          <p className="text-[11px] text-soft mt-2">
                            Our Head Office Executive will review your request and get back within
                            the SLA window.
                          </p>
                        </div>

                        <div className="pt-2 flex justify-center gap-3">
                          <button
                            onClick={resetTicketForm}
                            className="px-4 py-2 bg-white text-emerald-900 border border-emerald-300 rounded-xl font-bold text-xs cursor-pointer hover:bg-emerald-50"
                          >
                            Raise Another Ticket
                          </button>
                          <button
                            onClick={() => {
                              setIsContactModalOpen(false);
                              resetTicketForm();
                            }}
                            className="px-6 py-2 bg-[#5A2EA6] text-white rounded-xl font-bold text-xs cursor-pointer border-0 hover:bg-[#482387]"
                          >
                            Close Helpdesk
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleTicketSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Branch Selection */}
                          <div className="space-y-1">
                            <label className="block font-bold text-ink">Franchise Branch</label>
                            <select
                              value={ticketForm.branch}
                              onChange={(e) =>
                                setTicketForm({ ...ticketForm, branch: e.target.value })
                              }
                              className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink cursor-pointer"
                            >
                              <option value="Indrapuri Central Outlet">
                                Indrapuri Central Outlet (LOC-01)
                              </option>
                              <option value="Arera Colony Outlet">
                                Arera Colony Outlet (LOC-02)
                              </option>
                              <option value="Kolar Road Outlet">Kolar Road Outlet (LOC-03)</option>
                              <option value="MP Nagar Flagship Branch">
                                MP Nagar Flagship Branch (LOC-04)
                              </option>
                              <option value="All Licensed Outlets">
                                All Licensed Franchise Outlets
                              </option>
                            </select>
                          </div>

                          {/* Recipient / Department */}
                          <div className="space-y-1">
                            <label className="block font-bold text-ink">
                              Department / Recipient
                            </label>
                            <select
                              value={ticketForm.recipient}
                              onChange={(e) =>
                                setTicketForm({ ...ticketForm, recipient: e.target.value })
                              }
                              className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink cursor-pointer"
                            >
                              <option value="Franchise Operations & Audits Team">
                                Franchise Operations &amp; Audits
                              </option>
                              <option value="Brand Founder & Managing Director">
                                Brand Managing Director (Direct Escalation)
                              </option>
                              <option value="Royalty & Billing Accounts Desk">
                                Royalty &amp; Billing Accounts Desk
                              </option>
                              <option value="Product & Consumable Inventory Supply">
                                Inventory Supply Chain &amp; Kits
                              </option>
                              <option value="Marketing & Promotional Assets Team">
                                Marketing &amp; Social Assets
                              </option>
                              <option value="Platform Technical Support">
                                Platform SaaS &amp; Technical Support
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Priority */}
                          <div className="space-y-1">
                            <label className="block font-bold text-ink">Priority SLA</label>
                            <select
                              value={ticketForm.priority}
                              onChange={(e) =>
                                setTicketForm({ ...ticketForm, priority: e.target.value })
                              }
                              className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink cursor-pointer"
                            >
                              <option value="Urgent">Urgent (4-Hour SLA Response)</option>
                              <option value="High">High (12-Hour SLA Response)</option>
                              <option value="Medium">Medium (24-Hour SLA Response)</option>
                              <option value="Low">Low (48-Hour SLA Response)</option>
                            </select>
                          </div>

                          {/* Attachment */}
                          <div className="space-y-1">
                            <label className="block font-bold text-ink">
                              Attachment Reference (Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Audit_Report_Indrapuri.pdf"
                              value={ticketForm.attachmentName}
                              onChange={(e) =>
                                setTicketForm({ ...ticketForm, attachmentName: e.target.value })
                              }
                              className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-1">
                          <label className="block font-bold text-ink">Ticket Subject *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Clarification on August monthly royalty fee calculation"
                            value={ticketForm.subject}
                            onChange={(e) =>
                              setTicketForm({ ...ticketForm, subject: e.target.value })
                            }
                            className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <label className="block font-bold text-ink">Detailed Description *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Provide all context, branch outlet IDs, invoice references, or questions for Head Office..."
                            value={ticketForm.description}
                            onChange={(e) =>
                              setTicketForm({ ...ticketForm, description: e.target.value })
                            }
                            className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-line">
                          <button
                            type="button"
                            onClick={() => setContactActiveTab('directory')}
                            className="px-4 py-2 border border-line rounded-xl text-soft font-semibold cursor-pointer hover:bg-paper/40"
                          >
                            Back to Directory
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer border-0 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" /> Submit Ticket to HQ
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
