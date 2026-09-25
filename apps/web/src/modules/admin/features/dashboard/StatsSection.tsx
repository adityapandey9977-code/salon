import { ArrowUpRightIcon } from '@salon-spa-saas/ui';
import React from 'react';

export function StatsSection() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-4 bg-transparent border-0 overflow-visible">
      {/* Revenue */}
      <article className="p-[22px_24px] rounded-[18px] shadow-xs relative bg-pine text-[#e4eeea] overflow-hidden col-span-2 md:col-span-1 border-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(232,184,75,.13) 0%, transparent 60%)',
          }}
        />
        <div className="absolute w-[160px] h-[160px] rounded-full border border-white/5 -right-[60px] -bottom-[80px] pointer-events-none" />

        <div className="absolute right-5 top-5 w-7 h-7 border border-white/20 rounded-md grid place-items-center text-white/50">
          <ArrowUpRightIcon className="w-[13px] h-[13px]" />
        </div>

        <div className="text-[10px] font-semibold tracking-[1px] uppercase text-white/45">
          Collected today
        </div>
        <div className="font-serif font-normal text-[33px] leading-none mt-[14px] tracking-[-0.5px] text-white">
          ₹48,650
        </div>
        <div className="text-[11px] text-white/45 mt-1.5">
          <span className="text-[#a8dfc5] font-semibold">↑ 12.5%</span> from Tuesday
        </div>
      </article>

      {/* Appointments */}
      <article className="p-[22px_24px] border border-line rounded-[18px] bg-white shadow-xs relative">
        <div className="text-[10px] font-semibold tracking-[1px] uppercase text-muted">
          Appointments
        </div>
        <div className="font-serif font-normal text-[30px] leading-none mt-[14px] tracking-[-0.5px]">
          32 <span className="font-sans font-medium text-[14px] text-[#b0bdb7]">/ 41</span>
        </div>
        <div className="text-[11px] text-muted mt-1.5">9 slots still open</div>
      </article>

      {/* Walk-ins */}
      <article className="p-[22px_24px] border border-line rounded-[18px] bg-white shadow-xs relative">
        <div className="text-[10px] font-semibold tracking-[1px] uppercase text-muted">
          Walk-ins
        </div>
        <div className="font-serif font-normal text-[30px] leading-none mt-[14px] tracking-[-0.5px]">
          06
        </div>
        <div className="text-[11px] text-muted mt-1.5">
          <span className="text-[#2e7d5e] font-semibold">↑ 2</span> more than usual
        </div>
      </article>

      {/* Outstanding */}
      <article className="p-[22px_24px] border border-line rounded-[18px] bg-white shadow-xs relative">
        <div className="text-[10px] font-semibold tracking-[1px] uppercase text-muted">
          Outstanding
        </div>
        <div className="font-serif font-normal text-[30px] leading-none mt-[14px] tracking-[-0.5px]">
          ₹6,240
        </div>
        <div className="text-[11px] text-muted mt-1.5">Across 4 open invoices</div>
      </article>
    </section>
  );
}
