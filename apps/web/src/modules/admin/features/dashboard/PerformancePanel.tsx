import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useToast,
} from '@salon-spa-saas/ui';
import React from 'react';

export function PerformancePanel() {
  const { toast } = useToast();
  return (
    <Card className="pb-5">
      <CardHeader>
        <div>
          <CardTitle>This week's pace</CardTitle>
          <CardDescription>Gross collection, Mon – Sun</CardDescription>
        </div>
        <Button variant="text-action" onClick={() => toast('Revenue report opened')}>
          Report
        </Button>
      </CardHeader>
      <CardContent className="pt-4 px-6 pb-0">
        <div className="flex items-baseline gap-[10px]">
          <b className="font-serif font-normal text-[30px] tracking-[-0.5px]">₹2,84,400</b>
          <span className="text-[11px] font-semibold text-[#2e7d5e] bg-[#e4f0e9] px-[7px] py-[3px] rounded-[4px]">
            ↑ 18.2%
          </span>
        </div>

        <div className="h-[120px] mt-[14px] relative border-b border-line">
          <svg
            viewBox="0 0 460 120"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#295049" stopOpacity=".18" />
                <stop offset="100%" stopColor="#295049" stopOpacity=".02" />
              </linearGradient>
            </defs>
            <path
              className="fill-[url(#chartGrad)] stroke-none"
              d="M0,91 L76,70 L153,56 L230,76 L307,42 L384,25 L460,59 L460,120 L0,120Z"
            />
            <path
              className="stroke-pine-2 stroke-2 fill-none"
              d="M0,91 L76,70 L153,56 L230,76 L307,42 L384,25 L460,59"
            />
            <circle className="fill-clay stroke-white stroke-[3px]" cx="384" cy="25" r="4.5" />
          </svg>
        </div>

        <div className="flex justify-between text-muted text-[10px] font-medium mt-2 px-0.5">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN</span>
        </div>

        <div className="flex gap-4 mt-4 text-[11px] text-soft">
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-2 h-2 rounded-[2px] bg-pine-2 shrink-0"></i> Collected
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-2 h-2 rounded-[2px] bg-line shrink-0"></i> Target: ₹2.4L
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
