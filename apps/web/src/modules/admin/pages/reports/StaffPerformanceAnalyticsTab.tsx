import { Button, cn } from '@salon-spa-saas/ui';
import {
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Download,
  Filter,
  Percent,
  Scissors,
  ShoppingBag,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { UniversalExportModal } from './UniversalExportModal';

export interface StaffPerformanceRecord {
  id: string;
  name: string;
  role: string;
  branch: string;
  servicesCount: number;
  serviceRevenue: string;
  retailSales: string;
  rebookingRate: string;
  utilisation: string;
  rating: string;
  targetAchievement: string;
  commission: string;
}

const mockStaffPerformance: StaffPerformanceRecord[] = [
  {
    id: 'STF-001',
    name: 'Pooja Sharma',
    role: 'Senior Hair Stylist',
    branch: 'Indore - Vijay Nagar Flagship',
    servicesCount: 340,
    serviceRevenue: '₹8,20,000',
    retailSales: '₹1,90,000',
    rebookingRate: '84.2%',
    utilisation: '91.0%',
    rating: '4.95',
    targetAchievement: '112.4%',
    commission: '₹94,000',
  },
  {
    id: 'STF-002',
    name: 'Rahul Verma',
    role: 'Creative Hair Director',
    branch: 'Indore - Palasia Premium Studio',
    servicesCount: 290,
    serviceRevenue: '₹7,80,000',
    retailSales: '₹1,60,000',
    rebookingRate: '81.5%',
    utilisation: '88.5%',
    rating: '4.90',
    targetAchievement: '108.0%',
    commission: '₹88,000',
  },
  {
    id: 'STF-003',
    name: 'Ananya Deshmukh',
    role: 'Master Aesthetician & Skincare',
    branch: 'Bhopal - Arera Colony Lounge',
    servicesCount: 310,
    serviceRevenue: '₹6,90,000',
    retailSales: '₹2,10,000',
    rebookingRate: '79.0%',
    utilisation: '86.2%',
    rating: '4.88',
    targetAchievement: '104.5%',
    commission: '₹82,500',
  },
  {
    id: 'STF-004',
    name: 'Vikram Rajput',
    role: 'Lead Barber & Grooming',
    branch: 'Indore - Vijay Nagar Flagship',
    servicesCount: 380,
    serviceRevenue: '₹5,60,000',
    retailSales: '₹1,20,000',
    rebookingRate: '75.4%',
    utilisation: '84.0%',
    rating: '4.82',
    targetAchievement: '101.2%',
    commission: '₹64,000',
  },
  {
    id: 'STF-005',
    name: 'Meera Solanki',
    role: 'Senior Spa Therapist',
    branch: 'Ujjain - Freeganj Main Studio',
    servicesCount: 240,
    serviceRevenue: '₹4,90,000',
    retailSales: '₹95,000',
    rebookingRate: '72.0%',
    utilisation: '80.5%',
    rating: '4.80',
    targetAchievement: '98.0%',
    commission: '₹52,000',
  },
  {
    id: 'STF-006',
    name: 'Akash Tomar',
    role: 'Hair Color Specialist',
    branch: 'Gwalior - City Centre Hub',
    servicesCount: 220,
    serviceRevenue: '₹4,40,000',
    retailSales: '₹85,000',
    rebookingRate: '70.2%',
    utilisation: '78.0%',
    rating: '4.75',
    targetAchievement: '96.5%',
    commission: '₹46,500',
  },
];

export interface StaffPerformanceAnalyticsTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function StaffPerformanceAnalyticsTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: StaffPerformanceAnalyticsTabProps = {}) {
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedRole, setSelectedRole] = useState('all');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 7 Staff Performance KPIs (Section 4 PRD)
  const staffKpis = [
    {
      title: 'Total Services Done',
      value: lockBranch ? '1,840' : '7,240',
      sub: lockBranch ? `By ${defaultBranch} team` : '+14.2% vs Prev Qtr',
      icon: Scissors,
      color: 'text-[#5A2EA6]',
      bg: 'bg-purple-50',
    },
    {
      title: 'Direct Service Sales',
      value: lockBranch ? '₹26,80,000' : '₹98,20,000',
      sub: 'Billed Work',
      icon: DollarSign,
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Retail Product Upsell',
      value: lockBranch ? '₹5,20,000' : '₹18,40,000',
      sub: '18.7% Attach',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Stylist Rebooking Rate',
      value: '78.5%',
      sub: 'Target: >75.0%',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Staff Floor Utilisation',
      value: '86.2%',
      sub: 'Target: >80.0%',
      icon: Percent,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      title: 'Client Feedback CSAT',
      value: '4.88 / 5',
      sub: '98.2% Positive',
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      title: 'Commissions Accrued',
      value: lockBranch ? '₹3,48,000' : '₹11,64,000',
      sub: 'Payroll Tier Ready',
      icon: Award,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  const filteredStaff = mockStaffPerformance.filter((st) => {
    const matchRole =
      selectedRole === 'all' ||
      (selectedRole === 'Hair' && st.role.toLowerCase().includes('hair')) ||
      (selectedRole === 'Skincare' && st.role.toLowerCase().includes('skincare')) ||
      (selectedRole === 'Spa' && st.role.toLowerCase().includes('spa')) ||
      (selectedRole === 'Barber' && st.role.toLowerCase().includes('barber'));

    const matchBranch =
      lockBranch || selectedBranch === 'all' || st.branch.includes(selectedBranch);

    return matchRole && matchBranch;
  });

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
        reportTitle="Staff Productivity & Commission Report"
        defaultCategory="Staff Performance"
        availableColumns={[
          'Staff Name',
          'Stylist Role',
          'Branch Location',
          'Completed Services',
          'Services Revenue (₹)',
          'Retail Sales (₹)',
          'Rebooking Rate (%)',
          'Workstation Utilisation (%)',
          'CSAT Rating',
          'Target Achievement (%)',
          'Commission Accrued (₹)',
        ]}
        onExportComplete={(fmt, title) =>
          showToast(`Successfully exported ${title} in ${fmt} format.`)
        }
      />

      {/* 1. Global Filter Bar & Export Actions */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Branch Scope */}
          {!lockBranch && (
            <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
              >
                <option value="all">All Salon Outlets</option>
                <option value="Vijay Nagar">Indore - Vijay Nagar Flagship</option>
                <option value="Palasia">Indore - Palasia Premium</option>
                <option value="Arera">Bhopal - Arera Colony</option>
                <option value="Freeganj">Ujjain - Freeganj Studio</option>
                <option value="City Centre">Gwalior - City Centre</option>
              </select>
            </div>
          )}

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-[#F8F5FF] px-3 py-1.5 rounded-xl border border-[#5A2EA6]/20 text-xs">
            <Scissors className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent border-0 font-bold text-ink outline-none cursor-pointer pr-1"
            >
              <option value="all">All Staff Roles</option>
              <option value="Hair">Hair Stylists &amp; Colorists</option>
              <option value="Skincare">Aestheticians &amp; Skincare</option>
              <option value="Spa">Spa &amp; Body Therapists</option>
              <option value="Barber">Barbers &amp; Grooming</option>
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExportOpen(true)}
          className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Export Staff Report</span>
        </Button>
      </div>

      {/* 2. 7 KPI Metric Cards Grid (Section 4 PRD) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {staffKpis.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={cn('w-6 h-6 rounded-lg grid place-items-center', kpi.bg, kpi.color)}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-[9px] font-bold text-soft uppercase tracking-wider block">
                  {kpi.title}
                </span>
                <strong className="text-base font-serif font-bold text-ink mt-0.5 block truncate">
                  {kpi.value}
                </strong>
              </div>
              <div className="mt-1.5 pt-1 border-t border-slate-100 text-[9px] text-muted truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Staff Productivity Master Table (Section 4 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Staff Productivity &amp; Commission Scorecard
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                PRD Staff Measures
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Utilisation, services completed, retail sales, rebooking rate, feedback ratings,
              targets, and commission accrued
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            Showing {filteredStaff.length} Stylists
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Staff Member &amp; Role</th>
                {!lockBranch && <th className="p-3.5">Branch Outlet</th>}
                <th className="p-3.5 text-center">Services Done</th>
                <th className="p-3.5 text-right">Services Rev (₹)</th>
                <th className="p-3.5 text-right">Retail Upsell (₹)</th>
                <th className="p-3.5 text-center">Rebooking</th>
                <th className="p-3.5 text-center">Utilisation</th>
                <th className="p-3.5 text-center">CSAT Rating</th>
                <th className="p-3.5 text-center">Target Achieved</th>
                <th className="p-3.5 pr-5 text-right">Commission (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredStaff.map((st) => (
                <tr key={st.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{st.name}</strong>
                    <span className="text-[10px] text-muted">{st.role}</span>
                  </td>
                  {!lockBranch && (
                    <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                      {st.branch}
                    </td>
                  )}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {st.servicesCount}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-mono text-slate-900 font-bold">
                    {st.serviceRevenue}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap font-mono text-[#5A2EA6] font-semibold">
                    {st.retailSales}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-emerald-700">
                    {st.rebookingRate}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-[#5A2EA6]">
                    {st.utilisation}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-amber-700">
                    ★ {st.rating}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {st.targetAchievement}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap font-serif font-extrabold text-[#5A2EA6] text-sm">
                    {st.commission}
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
