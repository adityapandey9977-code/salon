import { BellIcon, Button, CalendarIcon, SearchIcon } from '@salon-spa-saas/ui';
import React from 'react';

export function TopBar() {
  return (
    <header className="h-[60px] md:h-[68px] px-4 md:px-6 lg:px-8 border-b border-line flex items-center justify-between shrink-0 sticky top-0 z-40 backdrop-blur-[16px] bg-paper/85">
      <div className="text-[12px] text-soft">
        <b className="text-sage font-bold">Blush &amp; Bloom</b> &nbsp;/&nbsp; Indrapuri branch
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-[11px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients, bookings, invoices…"
            className="bg-white border border-line rounded-[12px] py-[6px] pr-[13px] pl-[34px] w-[340px] text-[13px] text-ink outline-none transition-all focus:border-sage focus:ring-3 focus:ring-sage/10 placeholder:text-muted"
          />
        </div>
        <Button variant="icon" aria-label="Notifications" className="text-sage">
          <BellIcon />
          <span className="absolute right-[7px] top-[7px] bg-clay w-1.5 h-1.5 rounded-full border-[1.5px] border-white" />
        </Button>
        <Button
          variant="outline"
          className="border-line hover:bg-white text-ink rounded-xl text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <CalendarIcon className="w-[13px] h-[13px] text-muted" />
          Friday, 24 Jul
        </Button>
      </div>
    </header>
  );
}
