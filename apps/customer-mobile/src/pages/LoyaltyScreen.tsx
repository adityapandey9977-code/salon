import { ChevronLeft, Crown, Share2, Sparkles } from 'lucide-react-native';
import type React from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, H3, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const LoyaltyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, redeemPoints, showToast } = useApp();

  const pointsActivity = [
    { id: 'pa1', title: 'Balayage Hair Color', pts: '+350', date: '15 Jul 2026', type: 'earn' },
    {
      id: 'pa2',
      title: 'Redeemed ₹250 Voucher',
      pts: '-1,000',
      date: '25 Jul 2026',
      type: 'spend',
    },
    { id: 'pa3', title: 'Feedback Bonus', pts: '+50', date: '15 Jul 2026', type: 'earn' },
  ];

  const handleShareReferral = () => {
    showToast('Referral code DIGIFLEX-ADITYA copied!', 'success');
  };

  const handleRedeemPoints = () => {
    redeemPoints(1000);
  };

  return (
    <Div className="p-4 px-5 space-y-6 pb-28">
      {/* Header with Clean Spacing */}
      <Div className="flex flex-row items-center justify-between pt-2 pb-1">
        <Button
          type="button"
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
        >
          <ChevronLeft size={24} color="#374151" />
        </Button>
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">
          Loyalty Rewards
        </H1>
        <Div className="w-12" />
      </Div>

      {/* Tier Status Banner - Circle Logo Background Matched to Screenshot */}
      <Div className="bg-amber-100/90 rounded-3xl p-5 border border-amber-300 flex flex-row items-center justify-between shadow-xs">
        <Div className="flex flex-row items-center gap-3.5">
          <Div className="w-12 h-12 rounded-full bg-amber-200 flex flex-row items-center justify-center">
            <Crown size={24} color="#d97706" fill="#d97706" />
          </Div>
          <Div className="space-y-0.5">
            <H2 className="text-xs font-extrabold text-amber-950">Gold Tier Member</H2>
            <P className="text-[11px] text-amber-800 font-bold">750 Pts to Platinum Tier</P>
          </Div>
        </Div>
        <Span className="text-[10px] font-extrabold text-amber-900 bg-white px-3.5 py-1.5 rounded-full border border-amber-300">
          Tier Perks
        </Span>
      </Div>

      {/* Available Points Hero Card - PTS Bottom Baseline Aligned */}
      <Div className="bg-[#7C3AED] rounded-3xl p-6 text-white space-y-3 shadow-md relative overflow-hidden">
        <Div className="flex flex-row items-center justify-between">
          <Span className="text-xs font-extrabold text-white uppercase tracking-wider block">
            AVAILABLE POINTS
          </Span>
          <Sparkles size={22} color="#fbbf24" fill="#fbbf24" />
        </Div>

        {/* Bottom Baseline Aligned Points & PTS label */}
        <Div className="flex flex-row items-end gap-2">
          <Span className="text-4xl font-black text-white">{user.points.toLocaleString()}</Span>
          <Span className="text-sm font-extrabold text-white uppercase tracking-wider mb-1">
            Pts
          </Span>
        </Div>

        <P className="text-[11px] font-medium text-white leading-relaxed pt-1">
          Redeem 1,000 Pts for instant ₹100 cashback voucher on services.
        </P>
      </Div>

      {/* Referral Banner - REFER & EARN Capital Title */}
      <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs flex flex-row items-center justify-between">
        <Div className="space-y-1 flex-1 pr-2">
          <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
            REFER & EARN
          </Span>
          <H3 className="text-xs font-bold text-gray-900">Invite Friends, Get 500 Pts</H3>
          <P className="text-[10px] font-semibold text-gray-500">Your code: DIGIFLEX-ADITYA</P>
        </Div>
        <Button
          type="button"
          onClick={handleShareReferral}
          className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 px-4 py-2.5 rounded-2xl text-xs font-extrabold flex flex-row items-center justify-center gap-1.5"
        >
          <Share2 size={16} color="#7c3aed" />
          <Span className="text-purple-800 font-extrabold text-xs text-center">Share</Span>
        </Button>
      </Div>

      {/* Points Activity Section */}
      <Div className="space-y-3 pt-1">
        <H2 className="text-sm font-extrabold text-gray-900">Points Activity</H2>
        <Div className="space-y-3">
          {pointsActivity.map((item) => (
            <Div
              key={item.id}
              className="bg-white rounded-3xl p-4.5 px-5 border border-purple-100 shadow-xs flex flex-row items-center justify-between"
            >
              <Div className="space-y-0.5">
                <H3 className="text-xs font-bold text-gray-900">{item.title}</H3>
                <P className="text-[10px] font-semibold text-gray-400">{item.date}</P>
              </Div>
              <Span
                className={`text-xs font-black ${
                  item.type === 'earn' ? 'text-emerald-600' : 'text-purple-700'
                }`}
              >
                {item.pts} Pts
              </Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Fixed Bottom Centered Redeem Points CTA */}
      <Div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 px-5 pb-6 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleRedeemPoints}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm transition text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">
            Redeem 1,000 Points (₹100 Off)
          </Span>
        </Button>
      </Div>
    </Div>
  );
};
