import React from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  PhoneCall,
  Headphones,
  Clock,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function CallCenterCTIBar() {
  const { toast } = useToast();
  const {
    agentStatus,
    setAgentStatus,
    startInboundCall,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const handleSimulateInboundCall = () => {
    startInboundCall({
      callerName: 'Ananya Roy',
      callerPhone: '+91 98765 43210',
      vipTier: 'Black Diamond VIP',
      walletBalance: '₹8,450.00',
      allergies: 'Severe Ammonia sensitivity; requires sulfate-free botanical toners only.',
      preferredBranch: selectedBranch.shortName,
      preferredStylist: 'Vikram Kulkarni (Master Colorist)'
    });
    toast('Incoming CTI Call: Inbound call ringing from Ananya Roy (+91 98765 43210)... Screen-Pop dossier opened.');
  };

  return (
    <div className="bg-white border-b border-line px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-xs sticky top-0 z-40">
      {/* LEFT: AGENT STATUS & CTI EXTENSION */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
            <Headphones className="w-4 h-4 text-purple-800" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <strong className="text-xs text-ink font-bold leading-none">Rohan Arora</strong>
              <span className="text-[9px] font-mono text-soft bg-pine/10 px-1.5 py-0.2 rounded">
                SIP Ext: 8042
              </span>
            </div>
            <span className="text-[10px] text-soft font-semibold">Exotel Cloud Gateway Active</span>
          </div>
        </div>

        {/* STATUS SELECTOR */}
        <div className="flex items-center gap-1 bg-pine/5 p-1 rounded-xl border border-line">
          {(['Available', 'On Call', 'Wrap-Up', 'On Break', 'Offline'] as const).map((st) => {
            const isSelected = agentStatus === st;
            return (
              <button
                key={st}
                onClick={() => {
                  setAgentStatus(st);
                  toast(`Agent State Changed: Concierge presence set to [${st}].`);
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-0 ${
                  isSelected
                    ? st === 'Available' ? 'bg-emerald-600 text-white shadow-xs' :
                      st === 'On Call' ? 'bg-amber-500 text-white shadow-xs' :
                      st === 'Wrap-Up' ? 'bg-indigo-600 text-white shadow-xs' :
                      st === 'On Break' ? 'bg-slate-600 text-white shadow-xs' : 'bg-rose-600 text-white shadow-xs'
                    : 'bg-transparent text-soft hover:text-ink'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE: REAL-TIME CONCIERGE KPI TICKER */}
      <div className="hidden xl:flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-purple-700" />
          <span className="text-soft font-medium">Calls Today:</span>
          <strong className="text-ink font-bold">28 / 40</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-soft font-medium">Avg Handle Time:</span>
          <strong className="text-ink font-bold font-mono">2m 45s</strong>
        </div>

        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-soft font-medium">Booked Revenue:</span>
          <strong className="text-emerald-800 font-bold">₹42,500</strong>
        </div>
      </div>

      {/* RIGHT: SIMULATE INBOUND CALL TRIGGER */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSimulateInboundCall}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#5A2EA6] to-purple-800 hover:from-[#482387] hover:to-purple-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer border-0 transition-all"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span>Simulate Inbound VIP Call</span>
        </button>
      </div>
    </div>
  );
}
