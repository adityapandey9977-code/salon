import { Button, PlusIcon, useToast } from '@salon-spa-saas/ui';
import React from 'react';

export function WelcomeSection() {
  const { toast } = useToast();
  return (
    <section className="flex justify-between md:items-end pt-6 pb-5 md:pt-9 md:pb-7 flex-row">
      <div>
        <div className="uppercase text-[10px] font-semibold text-muted tracking-[1.4px]">
          Wednesday, 22 July 2026
        </div>
        <h1 className="font-serif font-normal text-[26px] md:text-[34px] leading-[1.05] tracking-[-0.4px] my-1.5 bg-gradient-to-br from-[#1d3f39] to-[#c85f3c] bg-clip-text text-transparent">
          The desk is looking good.
        </h1>
        <p className="m-0 text-soft text-[13px]">
          32 appointments scheduled &nbsp;·&nbsp; 11 team members on the floor
        </p>
      </div>
      <Button variant="primary" onClick={() => toast('Starting a new appointment…')}>
        <PlusIcon className="w-4 h-4" />
        <span className="hidden md:inline">New appointment</span>
      </Button>
    </section>
  );
}
