import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { useToast } from '@salon-spa-saas/ui';
import {
  PhoneCall,
  PhoneOff,
  User,
  Wallet,
  Award,
  AlertTriangle,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  CheckCircle2,
  X,
  Scissors
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function InboundCallerScreenPopModal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeCall, endActiveCall } = useCallCenterBranch();

  if (!activeCall) return null;

  const handleBookAppointment = () => {
    endActiveCall();
    navigate('/appointments');
    toast(`Opening Appointment Scheduler: Dispatched booking for ${activeCall.callerName}.`);
  };

  const handleOpenGrievance = () => {
    endActiveCall();
    navigate('/tickets');
    toast(`Opening Grievance Desk: Logging customer ticket for ${activeCall.callerName}.`);
  };

  return createPortal(
    <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.22)] border border-purple-200 overflow-hidden">
        {/* TOP CALLING BANNER */}
        <div className="bg-gradient-to-r from-[#3B2647] via-purple-900 to-[#5A2EA6] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                  CTI Live Inbound Call
                </span>
                <span className="text-xs text-purple-200 font-mono">00:48</span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white tracking-tight mt-0.5">
                {activeCall.callerName}
              </h2>
            </div>
          </div>

          <button
            onClick={endActiveCall}
            className="flex items-center gap-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer border-0"
          >
            <PhoneOff className="w-3.5 h-3.5" /> End Call
          </button>
        </div>

        {/* CALLER 360 DOSSIER BODY */}
        <div className="p-6 space-y-4 text-xs">
          {/* VIP & WALLET METRICS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-200/60">
              <span className="text-[9.5px] font-bold text-soft uppercase block">VIP Tier Status</span>
              <div className="text-sm font-bold text-purple-950 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#5A2EA6]" />
                {activeCall.vipTier}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/60">
              <span className="text-[9.5px] font-bold text-soft uppercase block">Wallet Balance</span>
              <div className="text-sm font-bold text-emerald-900 mt-0.5 flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                {activeCall.walletBalance}
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/60">
              <span className="text-[9.5px] font-bold text-soft uppercase block">Home Branch</span>
              <div className="text-sm font-bold text-amber-900 mt-0.5 truncate">
                {activeCall.preferredBranch}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200/60">
              <span className="text-[9.5px] font-bold text-soft uppercase block">Preferred Stylist</span>
              <div className="text-sm font-bold text-indigo-950 mt-0.5 truncate flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-indigo-600" />
                {activeCall.preferredStylist}
              </div>
            </div>
          </div>

          {/* CRITICAL CONTRAINDICATION ALERT */}
          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-900 text-xs font-bold block uppercase tracking-wider">
                Critical Chemical Allergy &amp; Scalp Contraindication
              </strong>
              <p className="text-rose-800 text-xs mt-0.5 leading-relaxed">
                {activeCall.allergies}
              </p>
            </div>
          </div>

          {/* VISIT HISTORY & RELIABILITY */}
          <div className="p-3.5 bg-pine/5 rounded-2xl border border-line space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-ink">
              <span>Recent Visit Ledger &amp; Reliability</span>
              <span className="text-emerald-700 font-semibold">0 No-Shows • 100% Attended</span>
            </div>
            <div className="text-soft text-[11.5px] leading-relaxed">
              Last visited <strong>Bandra West Flagship</strong> on Aug 18, 2026 for <em>Hydra Facial &amp; Scalp Spa</em> with Vikram Kulkarni. Total lifetime spend ₹48,500 across 12 visits.
            </div>
          </div>

          {/* DISPATCH ACTIONS */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={handleBookAppointment}
              className="p-3 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1 shadow-xs cursor-pointer border-0 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            <button
              onClick={() => {
                toast(`WhatsApp Sent: Digital service menu & price card sent to ${activeCall.callerPhone}.`);
              }}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1 shadow-xs cursor-pointer border-0 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Send WhatsApp Catalog</span>
            </button>

            <button
              onClick={handleOpenGrievance}
              className="p-3 bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Log Grievance Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
