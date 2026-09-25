import {
  Avatar,
  Badge,
  Button,
  CalendarIcon,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useToast,
} from '@salon-spa-saas/ui';
import React from 'react';

export function SchedulePanel() {
  const { toast } = useToast();
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>The next few hours</CardTitle>
          <CardDescription>Front desk schedule · Wednesday</CardDescription>
        </div>
        <Button variant="text-action" onClick={() => toast('Opening full calendar…')}>
          Open calendar
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-3">
        <div className="grid grid-cols-[58px_1fr_auto] min-h-[62px] items-center gap-3 border-b border-line mx-[-24px] px-6">
          <time className="text-[11px] font-semibold text-soft leading-[1.25] tabular-nums">
            10:30
            <br />
            <small className="font-normal text-muted">AM</small>
          </time>
          <div className="flex items-center gap-[10px]">
            <Avatar variant="circle-guest" colorScheme="one" initials="PS" />
            <div>
              <b className="block text-[13px] font-semibold text-ink">Priya Sharma</b>
              <span className="block text-[11px] text-muted mt-[1px]">
                Hair spa · Neha · Chair 03
              </span>
            </div>
          </div>
          <Badge variant="confirmed">Confirmed</Badge>
        </div>

        <div className="grid grid-cols-[58px_1fr_auto] min-h-[62px] items-center gap-3 border-b border-line mx-[-24px] px-6">
          <time className="text-[11px] font-semibold text-soft leading-[1.25] tabular-nums">
            11:00
            <br />
            <small className="font-normal text-muted">AM</small>
          </time>
          <div className="flex items-center gap-[10px]">
            <Avatar variant="circle-guest" colorScheme="two" initials="MR" />
            <div>
              <b className="block text-[13px] font-semibold text-ink">Meera Rao</b>
              <span className="block text-[11px] text-muted mt-[1px]">
                Bridal consultation · Aditi · Room 01
              </span>
            </div>
          </div>
          <Badge variant="confirmed">Confirmed</Badge>
        </div>

        <div className="grid grid-cols-[58px_1fr_auto] min-h-[62px] items-center gap-3 border-b border-line mx-[-24px] px-6">
          <time className="text-[11px] font-semibold text-soft leading-[1.25] tabular-nums">
            11:30
            <br />
            <small className="font-normal text-muted">AM</small>
          </time>
          <div className="flex items-center gap-[10px]">
            <Avatar variant="circle-guest" colorScheme="three" initials="AK" />
            <div>
              <b className="block text-[13px] font-semibold text-ink">Aarav Khanna</b>
              <span className="block text-[11px] text-muted mt-[1px]">
                Haircut &amp; beard · Rohan · Chair 01
              </span>
            </div>
          </div>
          <Badge variant="arrived">Arrived</Badge>
        </div>

        <div className="grid grid-cols-[58px_1fr_auto] min-h-[62px] items-center gap-3 border-b-0 mx-[-24px] px-6">
          <time className="text-[11px] font-semibold text-soft leading-[1.25] tabular-nums">
            12:00
            <br />
            <small className="font-normal text-muted">PM</small>
          </time>
          <div className="flex items-center gap-[10px]">
            <Avatar variant="circle-guest" colorScheme="four" initials="SN" />
            <div>
              <b className="block text-[13px] font-semibold text-ink">Sana Nair</b>
              <span className="block text-[11px] text-muted mt-[1px]">
                Hydra facial · Simran · Room 02
              </span>
            </div>
          </div>
          <Badge variant="in-service">In service</Badge>
        </div>

        <Button
          variant="timeline-footer"
          onClick={() => toast('Showing 28 remaining appointments…')}
        >
          <CalendarIcon className="w-[14px] h-[14px]" />
          See 28 more bookings today
        </Button>
      </CardContent>
    </Card>
  );
}
