import { BookAppointmentModal } from '@/shared/components/BookAppointmentModal';
import {
  Avatar,
  Button,
  MetricCard,
  PageHeader,
  StatusBadge,
  cn,
  useToast,
} from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Lock,
  Package,
  Printer,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/shared/context/AuthContext';
import { useBranch } from '../context/BranchContext';

const statsData = [
  {
    label: 'Appointments Today',
    value: '28',
    pct: '+12%',
    isPositive: true,
    comparison: 'vs yesterday',
    icon: <Calendar className="w-4 h-4" />,
    variant: 'purple' as const,
    route: '/appointments',
  },
  {
    label: 'Clients Checked In',
    value: '31',
    pct: '+8%',
    isPositive: true,
    comparison: 'vs yesterday',
    icon: <Users className="w-4 h-4" />,
    variant: 'emerald' as const,
    route: '/walk-ins',
  },
  {
    label: 'Waiting Queue',
    value: '7',
    pct: '+3%',
    isPositive: true,
    comparison: 'active tokens',
    icon: <Clock className="w-4 h-4" />,
    variant: 'amber' as const,
    route: '/walk-ins',
  },
  {
    label: 'Avg Wait Time',
    value: '18 min',
    pct: '-6%',
    isPositive: true,
    comparison: 'improved speed',
    icon: <Clock className="w-4 h-4" />,
    variant: 'default' as const,
    route: '/walk-ins',
  },
  {
    label: 'Stylists On Duty',
    value: '8 / 10',
    pct: '80%',
    isPositive: true,
    comparison: 'Occupancy',
    icon: <Users className="w-4 h-4" />,
    variant: 'purple' as const,
    route: '/team',
  },
  {
    label: 'Confirmed Slot Value',
    value: '₹34,500',
    pct: '+15%',
    isPositive: true,
    comparison: 'vs target',
    icon: <DollarSign className="w-4 h-4" />,
    variant: 'emerald' as const,
    route: '/appointments',
  },
  {
    label: 'Cashier Collection',
    value: '₹42,800',
    pct: '+18%',
    isPositive: true,
    comparison: 'Shift #01 total',
    icon: <Receipt className="w-4 h-4" />,
    variant: 'purple' as const,
    route: '/payments',
  },
  {
    label: 'Low-Stock SKUs',
    value: '4 Alerts',
    pct: 'Reorder',
    isPositive: false,
    comparison: 'Critical stock',
    icon: <Package className="w-4 h-4" />,
    variant: 'rose' as const,
    route: '/retail',
  },
];

const queueItems = [
  {
    id: 'apt-101',
    name: 'Rohan Sharma',
    time: '09:30 AM',
    provider: 'Emma Burke · Signature Haircut',
    status: 'Waiting',
    initials: 'RS',
    hasAllergy: false,
    hasFormulaNote: false,
  },
  {
    id: 'apt-102',
    name: 'Ava Rose',
    time: '10:15 AM',
    provider: 'Kassia Sophia · Balayage Tone',
    status: 'In-Service',
    initials: 'AR',
    hasAllergy: true,
    allergyText: 'Severe Ammonia Allergy',
    hasFormulaNote: true,
    formulaText: 'Formula 6.1 + 20Vol Developer',
  },
  {
    id: 'apt-103',
    name: 'Sonia Gandhi',
    time: '11:00 AM',
    provider: 'Mia Chen · Hydrating Facial',
    status: 'In-Service',
    initials: 'SG',
    hasAllergy: false,
    hasFormulaNote: false,
  },
  {
    id: 'apt-104',
    name: 'Mia Chen',
    time: '11:30 AM',
    provider: 'Mia Chen · Pedicure Gel',
    status: 'Completed',
    initials: 'MC',
    hasAllergy: false,
    hasFormulaNote: false,
  },
  {
    id: 'apt-105',
    name: 'Olivia Carlson',
    time: '12:15 PM',
    provider: 'Emma Burke · Trim Touchup',
    status: 'Waiting',
    initials: 'OC',
    hasAllergy: true,
    allergyText: 'Latex Skin Sensitivity',
    hasFormulaNote: false,
  },
];

const stylistRoster = [
  {
    name: 'Emma Burke',
    dept: 'Hair Dressing & Styles',
    status: 'In-Service',
    detail: 'With Olivia C. · Chair 01',
    initials: 'EB',
    avail: false,
  },
  {
    name: 'Kassia Sophia',
    dept: 'Hair Coloring & Tone',
    status: 'Confirmed',
    detail: 'Cabin 3 (Nail Suite)',
    initials: 'KS',
    avail: true,
  },
  {
    name: 'Mia Chen',
    dept: 'Nails Art & Spas',
    status: 'In-Service',
    detail: 'With Sonia G. · Station 02',
    initials: 'MC',
    avail: false,
  },
  {
    name: 'Sophia Loren',
    dept: 'Therapeutic Body Spa',
    status: 'Confirmed',
    detail: 'Cabin 1 (Spa Bed)',
    initials: 'SL',
    avail: true,
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { assignedBranch, currentStaff } = useBranch();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCashierShiftOpen, setIsCashierShiftOpen] = useState(true);

  const currentHour = new Date().getHours();
  const greetingTime = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';
  const rawManagerName = user?.fullName || currentStaff?.fullName || 'Manager';
  const managerFirstName = rawManagerName.split(' ')[0] || 'Manager';
  const branchDisplayName = assignedBranch?.name || 'Assigned Branch';
  const branchDisplayCode = assignedBranch?.code || 'BRANCH';

  const handleExport = () => {
    toast(`Generating ${branchDisplayName} Daily Operational Summary report (PDF)... 📥`);
  };

  const handleCloseCashierShift = () => {
    if (
      confirm(
        `Execute Daily Cashier Closure for Shift #01 at ${branchDisplayName}? Cash drawer balance will be locked and reconciled.`,
      )
    ) {
      setIsCashierShiftOpen(false);
      toast(`Shift Cashier Closure completed for ${branchDisplayName}. Settlement report sent to Finance.`);
    }
  };

  // Filter queue items by tab and search
  const filteredQueue = queueItems.filter((item) => {
    const matchesTab =
      activeTab === 'All' ||
      item.status.toLowerCase().replace('-', ' ').includes(activeTab.toLowerCase());
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-300 pb-8 flex flex-col gap-6">
      {/* ─── 1. PAGE HEADER (MATCHING ADMIN STANDARD) ─── */}
      <PageHeader
        pillBadge={{
          icon: <Store className="w-3.5 h-3.5" />,
          text: `BRANCH OPERATIONS · ${branchDisplayName.toUpperCase()} (${branchDisplayCode})`,
        }}
        title={`Good ${greetingTime}, ${managerFirstName} 👋`}
        description={`${branchDisplayName} (${assignedBranch?.city || 'Local Outlet'}) · Real-time Diary, Walk-in Queue & POS Control · Operating Hours: ${assignedBranch?.workingHours || '09:00 AM - 09:00 PM'}`}
        actions={
          <>
            <Button
              variant="primary"
              onClick={() => setIsBookModalOpen(true)}
              className="h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>New Appointment</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/walk-ins')}
              className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Walk-In</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/payments/new-invoice')}
              className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>POS Checkout</span>
            </Button>

            <button
              type="button"
              onClick={handleCloseCashierShift}
              disabled={!isCashierShiftOpen}
              className={cn(
                'h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer',
                isCashierShiftOpen
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                  : 'bg-emerald-600 text-white opacity-80 cursor-not-allowed',
              )}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isCashierShiftOpen ? 'Close Cashier Shift' : 'Shift Closed'}</span>
            </button>

            <Button
              variant="outline"
              onClick={handleExport}
              className="h-10 px-3 rounded-xl text-xs font-semibold border-line bg-white text-ink flex items-center justify-center cursor-pointer hover:bg-paper"
              title="Export Daily Summary"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </>
        }
      />

      {/* ─── ASSIGNED BRANCH LIVE IDENTITY CARD ─── */}
      <div className="bg-gradient-to-r from-[#FAF8FC] via-white to-[#F6F0FF] border border-[#5A2EA6]/20 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm shrink-0">
            {(branchDisplayName || 'B')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-ink truncate">
                {branchDisplayName}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-mono font-bold tracking-wider uppercase">
                {branchDisplayCode}
              </span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Assigned Primary Branch
              </span>
            </div>
            <p className="text-xs text-soft mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>📍 {assignedBranch?.address || `${assignedBranch?.city || 'Local'}, West India`}</span>
              <span>•</span>
              <span>🕒 Hours: <b className="text-ink font-semibold">{assignedBranch?.workingHours || '09:00 AM - 09:00 PM'}</b></span>
              {assignedBranch?.phone && (
                <>
                  <span>•</span>
                  <span>📞 {assignedBranch.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 border-line/40 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left md:text-right leading-tight">
            <span className="text-[10px] uppercase font-bold text-soft/80 tracking-wider block">
              Active Manager
            </span>
            <span className="text-xs font-bold text-ink">
              {user?.fullName || currentStaff?.fullName || 'Branch Lead'}
            </span>
            <span className="text-[10px] text-muted block truncate max-w-[150px]">
              {user?.email}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
            className="h-8 px-3 rounded-lg text-xs font-semibold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 shrink-0"
          >
            Branch Settings →
          </Button>
        </div>
      </div>

      {/* ─── 2. CLIENT-SAFE ALLERGY CAUTIONS & FORMULA HANDOVER ─── */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-4 rounded-[20px] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-amber-900 font-bold">
                Client Safety &amp; Allergy Caution Alerts
              </strong>
              <span className="bg-amber-500/20 text-amber-900 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                2 Cautions Active Today
              </span>
            </div>
            <p className="text-amber-800 text-[11.5px] mt-0.5 font-medium">
              Ava Rose (10:15 AM) has a severe Ammonia allergy. Olivia Carlson (12:15 PM) has Latex
              skin sensitivity. Ensure patch tests &amp; non-latex gloves are used.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/customers')}
          variant="outline"
          className="h-8 px-3 rounded-xl text-[11px] font-bold border-amber-500/30 text-amber-900 bg-white hover:bg-amber-50 shrink-0"
        >
          View Client Health Cards
        </Button>
      </section>

      {/* ─── 3. 8 OPERATIONAL METRIC CARDS (USING @packages/ui MetricCard) ─── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2.5">
        {statsData.map((stat, i) => (
          <MetricCard
            key={i}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            variant={stat.variant}
            trend={{
              value: stat.pct,
              isPositive: stat.isPositive,
            }}
            comparison={stat.comparison}
            onClick={() => navigate(stat.route)}
            className="p-3.5 rounded-2xl"
          />
        ))}
      </section>

      {/* ─── 4. MAIN OPERATIONAL SPLIT VIEW (QUEUES & RESOURCE ROSTER) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column: Today's Operations Queue (60% - 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 bg-gradient-to-r from-[#FAF8FC] to-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-[16px] text-slate-900 font-bold tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5A2EA6]" /> Today's Operations Queue
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                48 total appointments scheduled · 7 in waiting queue · 24 completed
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/appointments')}
              className="rounded-xl border-[#5A2EA6]/20 text-[11px] py-1 px-3 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 cursor-pointer font-bold"
            >
              Full Diary View ›
            </Button>
          </div>

          <div className="p-4 pt-3 flex flex-col gap-4 bg-white flex-1">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center text-[11px]">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search client or service..."
                  className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl py-2 px-3 pl-8 outline-none text-xs font-medium placeholder:text-muted focus:border-[#5A2EA6] shadow-xs"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar border border-slate-200/60">
                {['All (48)', 'Waiting', 'In-Service', 'Completed'].map((tab) => {
                  const key = tab.split(' ')[0];
                  const isAct = activeTab === key;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(key)}
                      className={cn(
                        'px-3 py-1 rounded-lg font-bold border-0 text-[10.5px] cursor-pointer transition select-none shrink-0 whitespace-nowrap',
                        isAct
                          ? 'bg-white text-[#5A2EA6] shadow-xs'
                          : 'bg-transparent text-slate-600 hover:text-slate-900',
                      )}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Queue List Table */}
            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200/70 text-slate-700">
                  <tr>
                    {[
                      'Time',
                      'Client',
                      'Stylist & Treatment',
                      'Safety Cautions',
                      'Status',
                      'Action',
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-3.5 font-bold text-[10px] tracking-wider uppercase text-slate-600',
                          i === 0 ? 'pl-4' : i === 5 ? 'pr-4 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#5A2EA6]/3 transition-colors duration-150"
                      >
                        <td className="p-3.5 pl-4 font-mono font-bold text-slate-900">
                          {item.time}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <Avatar
                              variant="circle-profile"
                              initials={item.initials}
                              className="w-7 h-7 bg-[#5A2EA6]/15 text-[#5A2EA6] text-[10.5px] shrink-0 font-bold border border-[#5A2EA6]/20"
                            />
                            <div>
                              <b className="text-slate-900 font-semibold block">{item.name}</b>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800">
                          {item.provider}
                          {item.hasFormulaNote && (
                            <span className="block text-[10px] text-[#5A2EA6] font-mono mt-0.5">
                              🧪 {item.formulaText}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {item.hasAllergy ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                              ⚠️ {item.allergyText}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">✓ Clear</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <StatusBadge status={item.status} size="sm" />
                        </td>
                        <td className="p-3.5 pr-4 text-right">
                          <Button
                            variant="outline"
                            onClick={() => navigate('/appointments')}
                            className="h-7 px-2.5 rounded-lg text-[10.5px] font-bold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                          >
                            Manage ›
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                        No appointments match current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Resource Availability & Stylist Roster (40% - 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 bg-gradient-to-r from-[#FAF8FC] to-white border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-[16px] text-slate-900 font-bold tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#5A2EA6]" /> Resource &amp; Chair Roster
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Real-time occupancy: 2 of 4 stations active (80% utilization)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/team')}
              className="rounded-xl border-[#5A2EA6]/20 text-[11px] py-1 px-3 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 cursor-pointer font-bold"
            >
              Manage Staff
            </Button>
          </div>

          <div className="p-0 bg-white flex-1 flex flex-col divide-y divide-slate-100 text-xs">
            {stylistRoster.map((roster, idx) => (
              <div
                key={idx}
                className="p-3.5 px-4 flex items-center justify-between hover:bg-[#5A2EA6]/3 transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    variant="circle-profile"
                    initials={roster.initials}
                    className="w-8.5 h-8.5 bg-slate-100 border border-[#5A2EA6]/20 text-[#5A2EA6] text-xs shrink-0 font-bold shadow-2xs"
                  />
                  <div>
                    <strong className="block text-slate-900 text-xs font-bold">
                      {roster.name}
                    </strong>
                    <span className="block text-slate-500 text-[10.5px] mt-0.5 font-medium">
                      {roster.dept}
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-0.5">
                  <StatusBadge
                    status={roster.avail ? 'Active' : 'In-Service'}
                    label={roster.status}
                    size="sm"
                  />
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {roster.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cashier Closure Status Footer Banner */}
          <div className="p-4 bg-gradient-to-b from-[#FCFAFF] to-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Cashier Shift Balance
              </span>
              <strong className="text-slate-900 font-bold text-sm">
                ₹42,500 Cash / ₹42,000 Digital
              </strong>
            </div>
            <button
              type="button"
              onClick={handleCloseCashierShift}
              disabled={!isCashierShiftOpen}
              className={cn(
                'h-8 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs',
                isCashierShiftOpen
                  ? 'bg-[#5A2EA6] hover:bg-purple-800 text-white'
                  : 'bg-emerald-600 text-white opacity-80 cursor-not-allowed',
              )}
            >
              <Lock className="w-3 h-3" />
              <span>{isCashierShiftOpen ? 'Close Shift' : 'Closed'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5. BOOKING MODAL INTEGRATION ─── */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onConfirm={(data) => {
          toast(
            `Appointment for ${data.client} (${data.service}) booked successfully for ${data.time}!`,
          );
          setIsBookModalOpen(false);
        }}
      />
    </div>
  );
}

export default DashboardPage;
