import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { AlertCircle, Check, CheckCircle2, Clock, Play, Scissors } from 'lucide-react';
import React, { useState } from 'react';

export function ServicesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const activeServices = [
    {
      client: 'Priya Sharma',
      service: 'Balayage Color & Gloss Treatment',
      chair: 'Chair 01',
      timeElapsed: '1h 15m / 2h 00m',
      processingTimer: '18m 45s remaining',
      step: 'Step 3: Color Processing ⏳',
      formula: 'Shade 7.1 Ash Blonde + 20Vol Bleach',
    },
  ];

  const completedServices = [
    {
      client: 'Aarav Khanna',
      service: 'Precision Haircut & Beard',
      duration: '45m',
      price: '₹1,200',
      completedAt: '09:45 AM',
    },
    {
      client: 'Sonia Nair',
      service: 'Organic Hydrating Facial',
      duration: '60m',
      price: '₹2,500',
      completedAt: '11:15 AM',
    },
  ];

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
            Service Management &amp; Timer
          </h1>
          <p className="text-[13px] text-soft mt-1">
            Live in-chair service tracking, processing alarms, step checklists, and completed
            session logs
          </p>
        </div>

        <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'active'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Active Services ({activeServices.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
              activeTab === 'completed'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
            )}
          >
            Completed Services Today
          </button>
        </div>
      </div>

      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeServices.map((srv, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-6 shadow-xs space-y-4"
            >
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    In-Chair Active Session
                  </span>
                  <h3 className="font-serif text-lg font-bold text-ink mt-0.5">
                    {srv.client} · {srv.chair}
                  </h3>
                </div>
                <span className="bg-[#5A2EA6] text-white font-mono font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5" /> {srv.processingTimer}
                </span>
              </div>

              <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-2xl p-4 space-y-2">
                <b className="text-sm font-bold text-ink block">{srv.service}</b>
                <p className="text-xs text-soft font-medium">
                  Session Progress: {srv.timeElapsed} · Current Stage:{' '}
                  <strong className="text-[#5A2EA6]">{srv.step}</strong>
                </p>
                <div className="p-2.5 bg-white border border-line rounded-xl text-xs font-mono font-bold text-[#5A2EA6]">
                  🧪 Active Formula: {srv.formula}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={() =>
                    toast(
                      `Completed service for ${srv.client}. Handing over invoice to front desk!`,
                    )
                  }
                  className="h-10 px-5 rounded-xl text-xs font-bold premium-btn-primary"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Complete Service &amp; Send to POS
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-ink border-b border-line pb-3">
            Completed Sessions Log
          </h3>
          <div className="space-y-3">
            {completedServices.map((c, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl flex justify-between items-center text-xs"
              >
                <div>
                  <b className="text-ink font-bold block">{c.client}</b>
                  <span className="text-soft">
                    {c.service} ({c.duration}) · Completed at {c.completedAt}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#5A2EA6] text-sm">{c.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
