import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  FlaskConical,
  Play,
  Plus,
  Scissors,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

interface RosterItem {
  id: string;
  time: string;
  clientName: string;
  service: string;
  duration: string;
  chair: string;
  status: 'In Service' | 'Confirmed' | 'Completed' | 'Waiting';
  hasAllergy: boolean;
  allergyText?: string;
  hasFormula: boolean;
  formulaText?: string;
}

const todayRoster: RosterItem[] = [
  {
    id: 'sty-01',
    time: '10:00 AM',
    clientName: 'Priya Sharma',
    service: 'Balayage Color & Gloss',
    duration: '120 mins',
    chair: 'Chair 01',
    status: 'In Service',
    hasAllergy: true,
    allergyText: 'Severe Ammonia Allergy Caution',
    hasFormula: true,
    formulaText: 'Shade 7.1 Ash Blonde + 20Vol Developer + 10g Olaplex No.1',
  },
  {
    id: 'sty-02',
    time: '12:30 PM',
    clientName: 'Ava Rose',
    service: 'Kérastase Caviar Hair Spa',
    duration: '60 mins',
    chair: 'Chair 01',
    status: 'Waiting',
    hasAllergy: true,
    allergyText: 'Latex Skin Sensitivity',
    hasFormula: false,
  },
  {
    id: 'sty-03',
    time: '02:00 PM',
    clientName: 'Sonia Gupta',
    service: 'Atelier Signature Blowdry',
    duration: '45 mins',
    chair: 'Chair 01',
    status: 'Confirmed',
    hasAllergy: false,
    hasFormula: true,
    formulaText: 'Argan Serum + Volume Lift Mousse',
  },
  {
    id: 'sty-04',
    time: '04:15 PM',
    clientName: 'Meera Kapoor',
    service: 'Organic Scalp Detox',
    duration: '90 mins',
    chair: 'Cabin 01 Spa Suite',
    status: 'Confirmed',
    hasAllergy: false,
    hasFormula: false,
  },
];

const stylistStats = [
  {
    label: 'TODAY BOOKED',
    value: '6 Clients',
    pct: '✓ 2 Completed',
    color: 'text-emerald-600',
    sparkPath: 'M0 20 Q 15 12, 30 8 T 60 2',
    stroke: '#10b981',
  },
  {
    label: 'IN-CHAIR STATUS',
    value: 'Balayage',
    pct: '⏳ Processing 18m',
    color: 'text-purple-600',
    sparkPath: 'M0 12 Q 15 10, 30 12 T 60 12',
    stroke: '#5A2EA6',
  },
  {
    label: 'MONTHLY TARGET',
    value: '₹1,85,000',
    pct: '92.5% of ₹2.0L',
    color: 'text-[#5A2EA6]',
    sparkPath: 'M0 20 Q 15 15, 30 10 T 60 3',
    stroke: '#5A2EA6',
  },
  {
    label: 'TIPS EARNED TODAY',
    value: '₹1,450',
    pct: 'Direct Payout',
    color: 'text-emerald-600',
    sparkPath: 'M0 18 Q 15 12, 30 8 T 60 2',
    stroke: '#10b981',
  },
  {
    label: 'CLIENT RATING',
    value: '4.9 ⭐',
    pct: '128 Reviews',
    color: 'text-amber-600',
    sparkPath: 'M0 5 Q 15 8, 30 18 T 60 22',
    stroke: '#f59e0b',
  },
  {
    label: 'CHAIR OCCUPANCY',
    value: '85%',
    pct: 'High Productivity',
    color: 'text-[#5A2EA6]',
    sparkPath: 'M0 15 Q 15 10, 30 5 T 60 2',
    stroke: '#5A2EA6',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartTimer = () => {
    toast('Balayage processing timer started (20 minutes). Alarm scheduled. ⏱️');
  };

  const handleCompleteService = (name: string) => {
    toast(`Completed service for ${name}. Formula saved to client history & invoice generated! ✂️`);
  };

  return (
    <div className="animate-in fade-in duration-300 flex flex-col gap-6 pb-8">
      {/* Welcome & Operations Header Card */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Good morning, Emma 👋
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20">
              Chair 01 Active
            </span>
          </div>
          <p className="text-[13px] text-soft mt-1">
            Indrapuri Flagship Branch · Senior Master Stylist &amp; Colorist Roster
          </p>
          <div className="text-[10.5px] text-muted font-medium mt-0.5 flex items-center gap-2">
            <span>Friday, 24 July 2026</span>
            <span>•</span>
            <span className="text-[#5A2EA6] font-bold">Shift #01 Active (09:00 AM - 06:00 PM)</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => navigate('/consultation')}
            className="h-[38px] px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Consultation</span>
          </Button>

          <Button
            onClick={() => navigate('/formulas')}
            variant="outline"
            className="h-[38px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/20 text-[#5A2EA6] bg-white hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Formula Logbook</span>
          </Button>
        </div>
      </section>

      {/* Safety Alert Caution Banner */}
      <section className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-4 rounded-[20px] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-amber-900 font-bold">
                Client Safety &amp; Allergy Caution Alert
              </strong>
              <span className="bg-amber-500/20 text-amber-900 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                Priya Sharma (10:00 AM)
              </span>
            </div>
            <p className="text-amber-800 text-[11.5px] mt-0.5">
              Client has severe Ammonia sensitivity. Use ammonia-free organic bleach &amp; non-latex
              gloves. Patch test verified.
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/clients')}
          variant="outline"
          className="h-[32px] px-3 rounded-lg text-[11px] font-bold border-amber-500/30 text-amber-900 bg-white hover:bg-amber-50 shrink-0 cursor-pointer"
        >
          View Client Health Card
        </Button>
      </section>

      {/* 6 Performance Stat Cards with Sparklines */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stylistStats.map((stat, i) => (
          <div
            key={i}
            className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[18px] p-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative group"
          >
            <div>
              <span className="text-[9px] text-soft leading-tight tracking-tight uppercase truncate font-bold block">
                {stat.label}
              </span>
              <strong className="text-[17px] font-serif font-bold text-ink mt-1.5 block">
                {stat.value}
              </strong>
            </div>

            <div className="flex items-end justify-between mt-3 gap-1">
              <span className={cn('text-[8.5px] font-bold shrink-0 truncate', stat.color)}>
                {stat.pct}
              </span>

              {/* Sparkline */}
              <div className="w-12 h-6 overflow-hidden shrink-0">
                <svg className="w-full h-full" viewBox="0 0 60 25" preserveAspectRatio="none">
                  <path
                    d={stat.sparkPath}
                    fill="none"
                    stroke={stat.stroke}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Split View with Purple Header Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column: Active In-Chair Session Tracker (60% - 6 cols) */}
        <div className="lg:col-span-6 premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between shadow-xs">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#e6c594]" /> Active In-Chair Service
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Priya Sharma · Chair 01 · Processing 18m 45s remaining
                </p>
              </div>
              <span className="bg-white/20 text-white border border-white/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                ⏱️ Processing 18m 45s
              </span>
            </div>
          </div>

          <div className="p-5 space-y-4 bg-white flex-1">
            <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <b className="text-ink text-[13px] font-bold block">
                    Balayage Color &amp; Gloss Treatment
                  </b>
                  <span className="text-[11px] text-soft font-medium">
                    Stylist: Emma Burke · Duration: 120 mins
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-[#5A2EA6]">₹4,800</span>
              </div>

              <div className="bg-white border border-line rounded-xl p-3 text-[11.5px] space-y-1">
                <span className="font-mono text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                  🧪 Active Color Formula Logged
                </span>
                <p className="font-mono font-bold text-ink">
                  Shade 7.1 Ash Blonde + 20Vol Developer + 10g Olaplex No.1
                </p>
                <p className="text-[10.5px] text-muted">
                  Processing Time: 25 mins · Foil Highlights Section 04
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-bold text-soft uppercase tracking-wider block">
                  Service Step Checklist
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11.5px] font-semibold">
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1. Allergy Patch Test ✓</span>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2. Formula Application ✓</span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-900 p-2 rounded-xl border border-amber-200">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>3. Color Processing ⏳</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 text-gray-500 p-2 rounded-xl border border-line">
                    <Scissors className="w-4 h-4 shrink-0" />
                    <span>4. Gloss &amp; Blowdry</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                onClick={handleStartTimer}
                variant="outline"
                className="h-[38px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] bg-white hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Reset 20m Timer</span>
              </Button>

              <Button
                onClick={() => handleCompleteService('Priya Sharma')}
                className="h-[38px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Finish &amp; Send to POS</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Appointments Schedule (40% - 4 cols) */}
        <div className="lg:col-span-4 premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between shadow-xs">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex items-center justify-between">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#e6c594]" /> Today's Shift Roster
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  6 total appointments allocated for Chair 01
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/schedule')}
                className="rounded-xl border-white/20 text-[10px] py-1 px-3 bg-white/10 text-white hover:bg-white/20 cursor-pointer font-bold"
              >
                Full Schedule ›
              </Button>
            </div>
          </div>

          <div className="p-4 bg-white flex-1 flex flex-col justify-between">
            <div className="divide-y divide-[#5A2EA6]/5 overflow-y-auto no-scrollbar max-h-[360px]">
              {todayRoster.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between hover:bg-[#5A2EA6]/3 px-2 rounded-xl transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-[#5A2EA6]">
                        {item.time}
                      </span>
                      <strong className="text-ink text-[12.5px] font-bold">
                        {item.clientName}
                      </strong>
                    </div>
                    <p className="text-[11px] text-soft mt-0.5 font-medium">
                      {item.service} ({item.duration})
                    </p>
                    {item.hasAllergy && (
                      <span className="text-[9.5px] font-bold text-rose-700 block mt-1">
                        ⚠️ {item.allergyText}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border',
                        item.status === 'In Service'
                          ? 'bg-purple-100 text-[#5A2EA6] border-purple-200'
                          : item.status === 'Waiting'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : item.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200',
                      )}
                    >
                      {item.status}
                    </span>
                    <span className="block text-[9.5px] text-muted font-mono mt-1 font-bold">
                      {item.chair}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/photos')}
              variant="outline"
              className="w-full h-[36px] rounded-xl text-xs font-bold border-[#5A2EA6]/20 text-[#5A2EA6] bg-[#FCFAFF] hover:bg-[#5A2EA6]/5 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Upload Before / After Photo</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
