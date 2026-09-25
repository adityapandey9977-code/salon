import {
  BoxIcon,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ClockIcon,
  ShieldCheckIcon,
  useToast,
} from '@salon-spa-saas/ui';
import React from 'react';

export function AttentionPanel() {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>A little attention needed</CardTitle>
          <CardDescription>Things that can affect today's operations</CardDescription>
        </div>
        <Button variant="text-action" onClick={() => toast('All operational alerts opened')}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="px-6 pt-2 pb-4">
        <div className="grid grid-cols-[34px_1fr_auto] gap-3 py-3.5 border-b border-line items-center">
          <div className="w-[34px] h-[34px] rounded-lg bg-sage text-[#2c6652] grid place-items-center shrink-0">
            <BoxIcon className="w-4 h-4" />
          </div>
          <div>
            <b className="text-[13px] font-semibold block">3 retail products running low</b>
            <span className="text-[11px] text-muted mt-0.5 block">
              Hair colour and two consumables need a reorder
            </span>
          </div>
          <Button
            variant="text-action"
            className="px-3"
            onClick={() => toast('Low-stock report opened')}
          >
            Review
          </Button>
        </div>

        <div className="grid grid-cols-[34px_1fr_auto] gap-3 py-3.5 border-b border-line items-center">
          <div className="w-[34px] h-[34px] rounded-lg bg-clay-s text-[#9a3d20] grid place-items-center shrink-0">
            <ShieldCheckIcon className="w-4 h-4" />
          </div>
          <div>
            <b className="text-[13px] font-semibold block">Five memberships expire this week</b>
            <span className="text-[11px] text-muted mt-0.5 block">
              Invite them to renew before their next visit
            </span>
          </div>
          <Button
            variant="text-action"
            className="px-3"
            onClick={() => toast('Membership renewals opened')}
          >
            View
          </Button>
        </div>

        <div className="grid grid-cols-[34px_1fr_auto] gap-3 py-3.5 border-b-0 items-center">
          <div className="w-[34px] h-[34px] rounded-lg bg-[#fef3d4] text-[#7a5a0a] grid place-items-center shrink-0">
            <ClockIcon className="w-4 h-4" />
          </div>
          <div>
            <b className="text-[13px] font-semibold block">Two bookings await confirmation</b>
            <span className="text-[11px] text-muted mt-0.5 block">
              Both clients are scheduled for tomorrow morning
            </span>
          </div>
          <Button
            variant="text-action"
            className="px-3"
            onClick={() => toast('Confirmation queue opened')}
          >
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
