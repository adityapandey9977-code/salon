import {
  ArrowRightIcon,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CreditCardIcon,
  PinIcon,
  UserIcon,
  useToast,
} from '@salon-spa-saas/ui';
import React from 'react';

export function ActionsPanel() {
  const { toast } = useToast();
  return (
    <Card className="p-5 md:p-6 border-none shadow-none bg-transparent">
      <CardTitle>Make something happen</CardTitle>
      <CardDescription className="mt-1">Common front-desk actions</CardDescription>
      <CardContent className="mt-4 grid grid-cols-2 gap-2.5 px-0">
        <button
          onClick={() => toast('New walk-in started')}
          className="bg-paper border border-line rounded-[16px] p-3.5 text-left text-ink font-medium text-[12px] min-h-[90px] flex flex-col justify-between cursor-pointer"
        >
          <ArrowRightIcon className="text-clay w-[22px] h-[22px]" />
          <span>Register walk-in</span>
        </button>

        <button
          onClick={() => toast('Customer profile form opened')}
          className="bg-paper border border-line rounded-[16px] p-3.5 text-left text-ink font-medium text-[12px] min-h-[90px] flex flex-col justify-between cursor-pointer"
        >
          <UserIcon className="text-clay w-[22px] h-[22px]" />
          <span>Add new client</span>
        </button>

        <button
          onClick={() => toast('Point of sale opened')}
          className="bg-paper border border-line rounded-[16px] p-3.5 text-left text-ink font-medium text-[12px] min-h-[90px] flex flex-col justify-between cursor-pointer"
        >
          <CreditCardIcon className="text-clay w-[22px] h-[22px]" />
          <span>Create invoice</span>
        </button>

        <button
          onClick={() => toast('Staff availability opened')}
          className="bg-paper border border-line rounded-[16px] p-3.5 text-left text-ink font-medium text-[12px] min-h-[90px] flex flex-col justify-between cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[22px] h-[22px] text-clay"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span>Check availability</span>
        </button>
      </CardContent>
    </Card>
  );
}
