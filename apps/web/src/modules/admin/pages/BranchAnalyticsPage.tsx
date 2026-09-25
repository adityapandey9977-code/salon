import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  DollarSign,
  Download,
  Gift,
  MapPin,
  Phone,
  RefreshCw,
  Scissors,
  TrendingUp,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { initialBranches } from './BranchesPage';

export function BranchAnalyticsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const branchName = searchParams.get('name') || 'Indore Flagship';
  const branchId = searchParams.get('id');

  // Look up the active branch information
  const branch =
    initialBranches.find((b) => b.id === branchId || b.name === branchName) || initialBranches[0];

  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* FIXED HEADER SECTION - Clean Transparent Look with Bottom Line Only */}
      <div className="shrink-0 pb-4 border-b border-[#5A2EA6]/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/branches')}
              className="h-9 w-9 flex items-center justify-center hover:bg-[#5A2EA6]/10 rounded-xl border border-line transition cursor-pointer text-soft hover:text-[#5A2EA6] hover:border-[#5A2EA6]/30 bg-white shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-[22px] text-ink font-bold tracking-tight">
                  {branch.name} Analytics
                </h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                  Live Data
                </span>
              </div>

              {/* Manager & Branch Meta Information */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-soft mt-1.5 font-medium">
                <div className="flex items-center gap-1.5 bg-[#5A2EA6]/5 px-2.5 py-0.5 rounded-lg border border-[#5A2EA6]/10">
                  <User className="w-3 h-3 text-[#5A2EA6]" />
                  <span className="text-soft text-[11px]">Manager:</span>
                  <span className="text-ink font-bold text-[11px]">{branch.manager}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#5A2EA6]/5 px-2.5 py-0.5 rounded-lg border border-[#5A2EA6]/10">
                  <Phone className="w-3 h-3 text-[#5A2EA6]" />
                  <span className="text-soft text-[11px]">Phone:</span>
                  <span className="text-ink font-bold text-[11px]">
                    {(branch as any).phone || (branch as any).contactNumber}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#5A2EA6]/5 px-2.5 py-0.5 rounded-lg border border-[#5A2EA6]/10">
                  <MapPin className="w-3 h-3 text-[#5A2EA6]" />
                  <span className="text-soft text-[11px]">Address:</span>
                  <span
                    className="text-ink font-bold text-[11px] truncate max-w-[150px]"
                    title={branch.address}
                  >
                    {branch.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-line rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-[#5A2EA6] outline-none shadow-2xs cursor-pointer hover:border-[#5A2EA6]/30 transition appearance-none"
              >
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-[#5A2EA6] pointer-events-none" />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] text-white rounded-xl text-xs font-bold shadow-md hover:from-[#6B3DE6] hover:to-[#9560EE] transition cursor-pointer hover:-translate-y-0.5 duration-200 border-0">
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLABLE INNER BODY AREA */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6 pt-4 pb-6 no-scrollbar">
        {/* KPI CARDS - All matching the 1st Card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Today's Revenue */}
          <div className="bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] p-4 rounded-[22px] border border-[#E9E1FF] hover:border-[#7B4DFF]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[135px] group">
            <div className="w-9 h-9 rounded-2xl bg-white/90 border border-[#E2D8FF] flex items-center justify-center text-[#6A3BC8] shadow-2xs group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A79A5] block">
                Today's Revenue
              </span>
              <strong className="text-[20px] font-sans font-black text-[#2D1B36] block mt-0.5">
                {branch.revenue}
              </strong>
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +18% vs yesterday
              </span>
            </div>
          </div>

          {/* Appointments Today */}
          <div className="bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] p-4 rounded-[22px] border border-[#E9E1FF] hover:border-[#7B4DFF]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[135px] group">
            <div className="w-9 h-9 rounded-2xl bg-white/90 border border-[#E2D8FF] flex items-center justify-center text-[#6A3BC8] shadow-2xs group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A79A5] block">
                Appointments Today
              </span>
              <strong className="text-[20px] font-sans font-black text-[#2D1B36] block mt-0.5">
                42
              </strong>
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +12% vs yesterday
              </span>
            </div>
          </div>

          {/* New Clients */}
          <div className="bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] p-4 rounded-[22px] border border-[#E9E1FF] hover:border-[#7B4DFF]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[135px] group">
            <div className="w-9 h-9 rounded-2xl bg-white/90 border border-[#E2D8FF] flex items-center justify-center text-[#6A3BC8] shadow-2xs group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A79A5] block">
                New Clients
              </span>
              <strong className="text-[20px] font-sans font-black text-[#2D1B36] block mt-0.5">
                7
              </strong>
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +16% vs yesterday
              </span>
            </div>
          </div>

          {/* Staff Utilisation */}
          <div className="bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] p-4 rounded-[22px] border border-[#E9E1FF] hover:border-[#7B4DFF]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[135px] group">
            <div className="w-9 h-9 rounded-2xl bg-white/90 border border-[#E2D8FF] flex items-center justify-center text-[#6A3BC8] shadow-2xs group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A79A5] block">
                Staff Utilisation
              </span>
              <strong className="text-[20px] font-sans font-black text-[#2D1B36] block mt-0.5">
                78%
              </strong>
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +9% vs yesterday
              </span>
            </div>
          </div>

          {/* Rebooking Rate */}
          <div className="bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] p-4 rounded-[22px] border border-[#E9E1FF] hover:border-[#7B4DFF]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[135px] group">
            <div className="w-9 h-9 rounded-2xl bg-white/90 border border-[#E2D8FF] flex items-center justify-center text-[#6A3BC8] shadow-2xs group-hover:scale-105 transition-transform">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A79A5] block">
                Rebooking Rate
              </span>
              <strong className="text-[20px] font-sans font-black text-[#2D1B36] block mt-0.5">
                62%
              </strong>
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +8% vs last week
              </span>
            </div>
          </div>

          {/* Package Renewals */}
          <div className="bg-gradient-to-b from-[#FBF9FF] to-[#F3EEFF] p-4 rounded-[22px] border border-[#E9E1FF] hover:border-[#7B4DFF]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[135px] group">
            <div className="w-9 h-9 rounded-2xl bg-white/90 border border-[#E2D8FF] flex items-center justify-center text-[#6A3BC8] shadow-2xs group-hover:scale-105 transition-transform">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A79A5] block">
                Package Renewals
              </span>
              <strong className="text-[20px] font-sans font-black text-[#2D1B36] block mt-0.5">
                5
              </strong>
              <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +25% vs last week
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT LAYOUT WITH LIGHT THEMED GRAPH AND TOP SERVICES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Growth Chart Card */}
          <div className="lg:col-span-2 rounded-[24px] overflow-hidden bg-white border border-[#E9E1FF] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="px-5 py-3.5 border-b border-line bg-gradient-to-r from-[#FAF8FF] to-[#F3EDFF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#5A2EA6]/10 text-[#5A2EA6]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-bold text-ink tracking-tight">
                    Monthly Revenue Overview
                  </h3>
                  <p className="text-[10px] text-soft">
                    Revenue flow indicators for current semester
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
              <div className="h-56 flex items-end justify-between gap-3 pt-6 border-b border-line/60 pb-2">
                {[
                  { month: 'Jan', val: '60%', raw: '₹7.5L' },
                  { month: 'Feb', val: '75%', raw: '₹9.3L' },
                  { month: 'Mar', val: '50%', raw: '₹6.2L' },
                  { month: 'Apr', val: '85%', raw: '₹10.6L' },
                  { month: 'May', val: '90%', raw: '₹11.2L' },
                  { month: 'Jun', val: '100%', raw: '₹12.5L' },
                ].map((bar, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 bg-[#3B2647] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-opacity duration-200 -mb-1">
                      {bar.raw}
                    </div>
                    {/* Light Theme Pastel Purple Bar Gradient */}
                    <div
                      style={{ height: bar.val }}
                      className="w-full bg-gradient-to-t from-[#C4B5FD] via-[#A78BFA] to-[#8B5CF6] group-hover:from-[#A78BFA] group-hover:to-[#7C3AED] rounded-t-xl transition-all shadow-2xs group-hover:shadow-sm"
                    />
                    <span className="text-[11px] font-bold text-soft group-hover:text-[#5A2EA6] transition-colors">
                      {bar.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Services Card */}
          <div className="rounded-[24px] overflow-hidden bg-white border border-[#E9E1FF] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div className="px-5 py-3.5 border-b border-line bg-gradient-to-r from-[#FAF8FF] to-[#F3EDFF] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#5A2EA6]/10 text-[#5A2EA6]">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-bold text-ink tracking-tight">
                    Top Services
                  </h3>
                  <p className="text-[10px] text-soft">Most in-demand treatments this month</p>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between bg-white space-y-3">
              {[
                { name: 'Hair Spa & Treatment', revenue: '₹3,40,000', count: '320 booked' },
                { name: 'Bridal Makeup Package', revenue: '₹2,80,000', count: '45 booked' },
                { name: 'Facial & Skincare', revenue: '₹2,10,000', count: '190 booked' },
                { name: 'Manicure & Pedicure', revenue: '₹1,50,000', count: '210 booked' },
              ].map((service, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FBF9FF] border border-[#E9E1FF] hover:border-[#7B4DFF]/30 hover:shadow-2xs transition duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E2D8FF] flex items-center justify-center text-[#5A2EA6] shadow-2xs">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-ink leading-tight">
                        {service.name}
                      </div>
                      <div className="text-[10px] text-soft mt-0.5">{service.count}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-black text-[#5A2EA6]">{service.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
