import { Button } from '@salon-spa-saas/ui';
import React from 'react';

export function WalkinsPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="flex justify-between items-end pt-9 pb-7">
        <div>
          <div className="uppercase text-[10px] font-semibold text-muted tracking-[1.4px]">
            Today • Walk-in Queue
          </div>
          <h1 className="font-serif font-normal text-[34px] leading-[1.05] tracking-[-0.4px] text-ink my-1.5">
            Walk-ins
          </h1>
          <p className="m-0 text-soft text-[13px]">6 waiting • Average wait: 14 min</p>
        </div>
        <Button variant="primary" onClick={() => {}}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor">
            <path d="M4 12h14M14 6l6 6-6 6" />
          </svg>
          <span className="hidden md:inline">Register walk-in</span>
        </Button>
      </section>

      <div className="bg-white border border-line rounded-[18px] shadow-xs overflow-hidden">
        <header className="px-6 py-5 border-b border-line flex justify-between items-start">
          <div>
            <div className="font-serif font-normal text-[20px] text-ink">Current queue</div>
            <div className="text-[11px] text-muted mt-[3px]">First come, first served</div>
          </div>
          <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px] mt-[2px]">
            Clear queue
          </button>
        </header>

        <div className="pt-2 pb-[18px]">
          <div className="grid grid-cols-[1fr_auto_auto] items-center min-h-[62px] border-b border-line gap-3 px-6 py-3.5">
            <div>
              <b className="text-[13px] block">Aanya Mehra</b>
              <span className="text-[12px] text-muted mt-0.5 block">Haircut</span>
            </div>
            <div className="text-right text-[12px] mr-4">
              <div>
                <b>Waiting:</b> 8 min
              </div>
              <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#fef3d4] text-[#8a6012] mt-1">
                In queue
              </span>
            </div>
            <div>
              <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                Assign
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] items-center min-h-[62px] border-b border-line gap-3 px-6 py-3.5">
            <div>
              <b className="text-[13px] block">Kabir Singh</b>
              <span className="text-[12px] text-muted mt-0.5 block">Haircut + Beard</span>
            </div>
            <div className="text-right text-[12px] mr-4">
              <div>
                <b>Waiting:</b> 21 min
              </div>
              <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#fef3d4] text-[#8a6012] mt-1">
                In queue
              </span>
            </div>
            <div>
              <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                Assign
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] items-center min-h-[62px] border-b border-line gap-3 px-6 py-3.5">
            <div>
              <b className="text-[13px] block">Ishita Verma</b>
              <span className="text-[12px] text-muted mt-0.5 block">Express Facial</span>
            </div>
            <div className="text-right text-[12px] mr-4">
              <div>
                <b>Waiting:</b> 27 min
              </div>
              <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#fef3d4] text-[#8a6012] mt-1">
                In queue
              </span>
            </div>
            <div>
              <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
