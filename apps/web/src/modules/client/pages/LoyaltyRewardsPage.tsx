import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Crown,
  Gift,
  History,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

export function LoyaltyRewardsPage() {
  const { toast } = useToast();
  const [availablePoints, setAvailablePoints] = useState(1250);

  // Loyalty Dashboard Overview Data (4 Fields)
  const dashboardOverview = {
    availablePoints: `${availablePoints.toLocaleString()} Pts`,
    pointsEarned: '1,850 Pts Lifetime',
    pointsRedeemed: '600 Pts Redeemed',
    membershipTier: 'Gold Tier',
  };

  // Master Points History State (4 Columns: Date, Activity, Points, Balance)
  const [history, setHistory] = useState([
    {
      id: 'HIS-901',
      date: '2026-08-01',
      activity: 'Earned: Balayage Hair Color & Gloss Treatment (APT-882)',
      points: '+250 Pts',
      balance: '1,250 Pts',
    },
    {
      id: 'HIS-882',
      date: '2026-07-25',
      activity: 'Redeemed: ₹250 Salon Voucher (RWD-01)',
      points: '-1,000 Pts',
      balance: '1,000 Pts',
    },
    {
      id: 'HIS-870',
      date: '2026-07-15',
      activity: 'Earned: 5-Star Feedback Review Incentive Bonus',
      points: '+50 Pts',
      balance: '2,000 Pts',
    },
    {
      id: 'HIS-840',
      date: '2026-06-12',
      activity: 'Earned: Keratin Hair Spa & Scalp Detox Session',
      points: '+480 Pts',
      balance: '1,950 Pts',
    },
  ]);

  const rewardsCatalog = [
    {
      id: 'RWD-01',
      title: '₹250 Salon Voucher',
      pointsCost: 1000,
      desc: 'Flat ₹250 discount voucher redeemable on any facial or hair spa treatment.',
    },
    {
      id: 'RWD-02',
      title: 'Free Scalp Detox Treatment',
      pointsCost: 1500,
      desc: 'Complimentary tea-tree scalp detoxification treatment during your next visit.',
    },
    {
      id: 'RWD-03',
      title: '₹500 Premium Spa Voucher',
      pointsCost: 2000,
      desc: 'Flat ₹500 discount voucher redeemable on full body massages & spa packages.',
    },
  ];

  const handleRedeemReward = (rwd: any) => {
    if (availablePoints < rwd.pointsCost) {
      toast(
        `Insufficient Points: You need ${rwd.pointsCost} points to redeem ${rwd.title}. You have ${availablePoints} points.`,
      );
      return;
    }

    const newPts = availablePoints - rwd.pointsCost;
    setAvailablePoints(newPts);

    const newHistItem = {
      id: `HIS-${Math.floor(900 + Math.random() * 90)}`,
      date: new Date().toISOString().split('T')[0],
      activity: `Redeemed: ${rwd.title} (${rwd.id})`,
      points: `-${rwd.pointsCost.toLocaleString()} Pts`,
      balance: `${newPts.toLocaleString()} Pts`,
    };

    setHistory([newHistItem, ...history]);
    toast(
      `Reward Redeemed: Successfully converted ${rwd.pointsCost} points to [${rwd.title}]. Voucher added to your account.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Loyalty Rewards &amp; Tier Progress
          </h1>
          <p className="text-xs text-soft mt-1">
            Earn 1 point for every ₹10 spent. Convert earned points into digital pamper vouchers and
            complimentary spa sessions.
          </p>
        </div>
      </div>

      {/* LOYALTY DASHBOARD OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Points */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-2 relative overflow-hidden">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Available Points
          </span>
          <div className="text-3xl font-bold text-white tracking-tight">
            {dashboardOverview.availablePoints}
          </div>
          <div className="text-[11px] text-purple-200">Ready for Instant Redemption</div>
        </div>

        {/* Card 2: Points Earned */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
            Points Earned
          </span>
          <div className="text-base font-bold text-emerald-700">
            {dashboardOverview.pointsEarned}
          </div>
          <div className="text-[11px] text-soft">Accumulated Across All Visits</div>
        </div>

        {/* Card 3: Points Redeemed */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
            Points Redeemed
          </span>
          <div className="text-base font-bold text-purple-700">
            {dashboardOverview.pointsRedeemed}
          </div>
          <div className="text-[11px] text-soft">Converted to Salon Vouchers</div>
        </div>

        {/* Card 4: Membership Tier */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
            Membership Tier
          </span>
          <div className="text-base font-bold text-amber-800 flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-amber-600" /> {dashboardOverview.membershipTier}
          </div>
          <div className="text-[11px] text-soft">750 Pts to Platinum Tier</div>
        </div>
      </div>

      {/* REWARDS REDEMPTION CATALOG */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-ink">Points Redemption Catalog</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewardsCatalog.map((rwd) => (
            <div
              key={rwd.id}
              className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-line pb-2">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {rwd.id}
                  </span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-600 text-amber-600" /> {rwd.pointsCost} Pts
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-ink">{rwd.title}</h4>
                  <p className="text-xs text-soft mt-1 leading-relaxed">{rwd.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleRedeemReward(rwd)}
                disabled={availablePoints < rwd.pointsCost}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border-0 ${
                  availablePoints >= rwd.pointsCost
                    ? 'bg-[#5A2EA6] hover:bg-[#482387] text-white'
                    : 'bg-pine/10 text-soft cursor-not-allowed'
                }`}
              >
                {availablePoints >= rwd.pointsCost
                  ? 'Redeem Voucher'
                  : `Need ${rwd.pointsCost - availablePoints} More Pts`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* POINTS HISTORY TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-line flex justify-between items-center">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" /> Points Activity History Ledger
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Date</th>
                <th className="p-3">Activity</th>
                <th className="p-3">Points</th>
                <th className="p-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* 1. Date */}
                  <td className="p-3 font-medium text-soft">{h.date}</td>

                  {/* 2. Activity */}
                  <td className="p-3 font-semibold text-ink">{h.activity}</td>

                  {/* 3. Points */}
                  <td className="p-3 font-bold">
                    <span
                      className={h.points.startsWith('+') ? 'text-emerald-700' : 'text-purple-700'}
                    >
                      {h.points}
                    </span>
                  </td>

                  {/* 4. Balance */}
                  <td className="p-3 text-right font-bold text-ink">{h.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
