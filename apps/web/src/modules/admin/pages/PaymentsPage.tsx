import { Button } from '@salon-spa-saas/ui';
import React from 'react';

export function PaymentsPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="flex justify-between items-end pt-9 pb-7">
        <div>
          <div className="uppercase text-[10px] font-semibold text-muted tracking-[1.4px]">
            Financials
          </div>
          <h1 className="font-serif font-normal text-[34px] leading-[1.05] tracking-[-0.4px] text-ink my-1.5">
            Payments
          </h1>
          <p className="m-0 text-soft text-[13px]">₹48,650 collected today • ₹1,24,800 this week</p>
        </div>
        <Button variant="primary" onClick={() => {}}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden md:inline">Create invoice</span>
        </Button>
      </section>

      <div className="bg-white border border-line rounded-[18px] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Time</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Client</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Invoice #</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Amount</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Method</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 whitespace-nowrap">10:42 AM</td>
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">Aarav Khanna</td>
              <td className="px-6 py-4 whitespace-nowrap">#INV-48291</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold">₹1,400</td>
              <td className="px-6 py-4 whitespace-nowrap">UPI</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  Paid
                </span>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 whitespace-nowrap">11:15 AM</td>
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">Priya Sharma</td>
              <td className="px-6 py-4 whitespace-nowrap">#INV-48287</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold">₹2,400</td>
              <td className="px-6 py-4 whitespace-nowrap">Card</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  Paid
                </span>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 whitespace-nowrap">11:50 AM</td>
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">Sana Nair</td>
              <td className="px-6 py-4 whitespace-nowrap">#INV-48283</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold">₹3,200</td>
              <td className="px-6 py-4 whitespace-nowrap">Cash</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  Paid
                </span>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 whitespace-nowrap">12:22 PM</td>
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">Meera Rao</td>
              <td className="px-6 py-4 whitespace-nowrap">#INV-48276</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold">₹9,500</td>
              <td className="px-6 py-4 whitespace-nowrap">Card</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  Paid
                </span>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 whitespace-nowrap">09:55 AM</td>
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">Riya Sen</td>
              <td className="px-6 py-4 whitespace-nowrap">#INV-48271</td>
              <td className="px-6 py-4 whitespace-nowrap font-bold">₹6,800</td>
              <td className="px-6 py-4 whitespace-nowrap">UPI</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  Paid
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
