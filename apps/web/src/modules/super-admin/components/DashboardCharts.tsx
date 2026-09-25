import { ArrowUpRight, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

interface RevenuePoint {
  month: string;
  mrr: number; // in Lakhs
  mrrFormatted: string;
  tenantsCount: number;
  branchesCount: number;
}

const REVENUE_DATA: RevenuePoint[] = [
  { month: 'Feb 2026', mrr: 31.2, mrrFormatted: '₹31.2 Lakh', tenantsCount: 8, branchesCount: 92 },
  {
    month: 'Mar 2026',
    mrr: 34.5,
    mrrFormatted: '₹34.5 Lakh',
    tenantsCount: 10,
    branchesCount: 104,
  },
  {
    month: 'Apr 2026',
    mrr: 37.8,
    mrrFormatted: '₹37.8 Lakh',
    tenantsCount: 11,
    branchesCount: 115,
  },
  {
    month: 'May 2026',
    mrr: 40.2,
    mrrFormatted: '₹40.2 Lakh',
    tenantsCount: 13,
    branchesCount: 124,
  },
  {
    month: 'Jun 2026',
    mrr: 43.1,
    mrrFormatted: '₹43.1 Lakh',
    tenantsCount: 14,
    branchesCount: 132,
  },
  {
    month: 'Jul 2026',
    mrr: 45.2,
    mrrFormatted: '₹45.2 Lakh',
    tenantsCount: 15,
    branchesCount: 141,
  },
];

const TIER_DISTRIBUTION = [
  { name: 'Enterprise Plan', count: 68, percentage: 48.2, color: '#7C3AED', price: '₹4,999/mo' },
  { name: 'Premium Plan', count: 48, percentage: 34.0, color: '#EC4899', price: '₹2,499/mo' },
  { name: 'Standard Plan', count: 25, percentage: 17.8, color: '#3B82F6', price: '₹1,299/mo' },
];

const REGION_METRICS = [
  { region: 'Central India (Bhopal & Indore)', count: 64, revenue: '₹21.4L', percent: 85 },
  { region: 'Western India (Mumbai & Pune)', count: 42, revenue: '₹14.8L', percent: 62 },
  { region: 'Northern India (Delhi NCR)', count: 22, revenue: '₹6.2L', percent: 38 },
  { region: 'Southern India (Bengaluru)', count: 13, revenue: '₹2.8L', percent: 24 },
];

export function RevenueAreaChart() {
  const [activePointIndex, setActivePointIndex] = useState<number>(REVENUE_DATA.length - 1);

  const svgWidth = 540;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  const minVal = 25;
  const maxVal = 50;

  const points = REVENUE_DATA.map((item, idx) => {
    const x = paddingX + (idx / (REVENUE_DATA.length - 1)) * (svgWidth - paddingX * 2);
    const y =
      svgHeight - paddingY - ((item.mrr - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2);
    return { x, y, ...item };
  });

  const pathD = points.reduce((acc, point, idx) => {
    if (idx === 0) return `M ${point.x} ${point.y}`;
    const prev = points[idx - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const activePoint = points[activePointIndex];

  return (
    <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] p-5 shadow-xs flex flex-col justify-between h-full min-h-[320px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#5A2EA6]/10 flex items-center justify-center text-[#5A2EA6]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-base font-bold text-ink">MRR Revenue Growth Curve</h3>
          </div>
          <p className="text-[11px] text-muted mt-0.5">
            Monthly recurring platform revenue trajectory (in Lakhs INR)
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% MoM
          </span>
          <div className="text-[10px] text-muted mt-0.5">Last 6 Months</div>
        </div>
      </div>

      {/* Dynamic Hover Card Banner */}
      <div className="bg-white/80 border border-[#5A2EA6]/15 rounded-xl p-2.5 flex items-center justify-between mb-2 text-xs backdrop-blur-xs">
        <div>
          <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
            Selected Period
          </span>
          <strong className="text-ink font-semibold text-xs">{activePoint.month}</strong>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
            Platform Revenue
          </span>
          <strong className="text-[#5A2EA6] font-serif font-bold text-sm">
            {activePoint.mrrFormatted}
          </strong>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
            Network Size
          </span>
          <strong className="text-ink font-semibold text-xs">
            {activePoint.branchesCount} Branches
          </strong>
        </div>
      </div>

      {/* Interactive SVG Curve */}
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          <defs>
            <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.5, 0.8].map((ratio, i) => {
            const gy = paddingY + ratio * (svgHeight - paddingY * 2);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={gy}
                x2={svgWidth - paddingX}
                y2={gy}
                stroke="#5A2EA6"
                strokeOpacity="0.08"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#mrrGradient)" />

          {/* Smooth Path Line */}
          <path d={pathD} fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />

          {/* Interactive Data Points */}
          {points.map((pt, idx) => {
            const isActive = idx === activePointIndex;
            return (
              <g
                key={idx}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => setActivePointIndex(idx)}
                onMouseEnter={() => setActivePointIndex(idx)}
              >
                {isActive && <circle cx={pt.x} cy={pt.y} r="8" fill="#7C3AED" fillOpacity="0.2" />}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? '5' : '3.5'}
                  fill={isActive ? '#7C3AED' : '#ffffff'}
                  stroke="#7C3AED"
                  strokeWidth={isActive ? '2.5' : '2'}
                />
                {/* Month Label */}
                <text
                  x={pt.x}
                  y={svgHeight - 4}
                  textAnchor="middle"
                  className={`text-[9px] font-medium transition-all ${
                    isActive ? 'fill-[#5A2EA6] font-bold' : 'fill-gray-400'
                  }`}
                >
                  {pt.month.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export function SubscriptionDonutChart() {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  const radius = 38;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] p-5 shadow-xs flex flex-col justify-between h-full min-h-[320px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899]">
          <PieChart className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-serif text-base font-bold text-ink">Subscription Tiers</h3>
          <p className="text-[11px] text-muted">Breakdown by active pricing plan</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 my-auto">
        {/* SVG Donut */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
            {TIER_DISTRIBUTION.map((tier, idx) => {
              const strokeDasharray = `${(tier.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += tier.percentage;

              const isHovered = hoveredTier === idx;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={tier.color}
                  strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer origin-center"
                  onMouseEnter={() => setHoveredTier(idx)}
                  onMouseLeave={() => setHoveredTier(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[9px] text-soft uppercase font-bold tracking-wider">Total</span>
            <strong className="text-lg font-serif font-bold text-ink leading-none">139</strong>
            <span className="text-[9px] text-[#5A2EA6] font-semibold">Plans</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2">
          {TIER_DISTRIBUTION.map((tier, idx) => {
            const isHovered = hoveredTier === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredTier(idx)}
                onMouseLeave={() => setHoveredTier(null)}
                className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isHovered
                    ? 'bg-white border-[#5A2EA6]/25 shadow-xs translate-x-0.5'
                    : 'bg-white/50 border-[#5A2EA6]/5 hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-md shrink-0 shadow-xs"
                    style={{ backgroundColor: tier.color }}
                  />
                  <div>
                    <strong className="text-[11.5px] font-semibold text-ink block leading-none">
                      {tier.name}
                    </strong>
                    <span className="text-[9.5px] text-muted">{tier.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="text-[11.5px] font-bold text-ink block leading-none">
                    {tier.count} Salons
                  </strong>
                  <span className="text-[9.5px] text-[#5A2EA6] font-semibold">
                    {tier.percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function RegionalMetricsBarChart() {
  return (
    <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] p-5 shadow-xs flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-ink">Regional Market Share</h3>
            <p className="text-[11px] text-muted">Branch concentration and revenue yield by zone</p>
          </div>
        </div>
        <span className="text-[10px] bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold px-2.5 py-0.5 rounded-full">
          4 Key Regions
        </span>
      </div>

      <div className="space-y-3.5 my-auto">
        {REGION_METRICS.map((reg, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-ink text-[12px]">{reg.region}</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted">{reg.count} Branches</span>
                <strong className="text-[12px] font-bold text-[#5A2EA6]">{reg.revenue}</strong>
              </div>
            </div>
            <div className="w-full bg-[#5A2EA6]/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899] transition-all duration-500"
                style={{ width: `${reg.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
