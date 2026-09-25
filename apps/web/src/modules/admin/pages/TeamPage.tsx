import { Button } from '@salon-spa-saas/ui';
import React from 'react';

export function TeamPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="flex justify-between items-end pt-9 pb-7">
        <div>
          <div className="uppercase text-[10px] font-semibold text-muted tracking-[1.4px]">
            Staff Management
          </div>
          <h1 className="font-serif font-normal text-[34px] leading-[1.05] tracking-[-0.4px] text-ink my-1.5">
            Team
          </h1>
          <p className="m-0 text-soft text-[13px]">Loading staff data...</p>
        </div>
        <Button variant="primary" onClick={() => {}}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden md:inline">Add team member</span>
        </Button>
      </section>

      <div className="bg-white border border-line rounded-[18px] p-8 flex items-center justify-center text-center">
        <p className="text-muted text-sm">No staff members found. Start by adding a new team member.</p>
      </div>
    </div>
  );
}
