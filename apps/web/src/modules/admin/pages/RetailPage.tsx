import { Button } from '@salon-spa-saas/ui';
import React from 'react';

export function RetailPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="flex justify-between items-end pt-9 pb-7">
        <div>
          <div className="uppercase text-[10px] font-semibold text-muted tracking-[1.4px]">
            Inventory
          </div>
          <h1 className="font-serif font-normal text-[34px] leading-[1.05] tracking-[-0.4px] text-ink my-1.5">
            Retail & Stock
          </h1>
          <p className="m-0 text-soft text-[13px]">₹1,84,900 inventory value • 3 items low</p>
        </div>
        <Button variant="primary" onClick={() => {}}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden md:inline">Add product</span>
        </Button>
      </section>

      <div className="bg-white border border-line rounded-[18px] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-line text-muted">
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Product</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Category</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">In Stock</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Price</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap">Status</th>
              <th className="font-semibold px-6 py-4 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">
                L'Oréal Hair Colour (Brown)
              </td>
              <td className="px-6 py-4 whitespace-nowrap">Hair Colour</td>
              <td className="px-6 py-4 whitespace-nowrap">7</td>
              <td className="px-6 py-4 whitespace-nowrap">₹1,290</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  OK
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                  Restock
                </button>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">
                Moroccanoil Treatment
              </td>
              <td className="px-6 py-4 whitespace-nowrap">Hair Care</td>
              <td className="px-6 py-4 whitespace-nowrap">4</td>
              <td className="px-6 py-4 whitespace-nowrap">₹2,950</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  OK
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                  Restock
                </button>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">Olaplex No. 3</td>
              <td className="px-6 py-4 whitespace-nowrap">Hair Care</td>
              <td className="px-6 py-4 whitespace-nowrap">2</td>
              <td className="px-6 py-4 whitespace-nowrap">₹3,450</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#f3e0d8] text-[#a04028]">
                  Low
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                  Restock
                </button>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">
                CeraVe Moisturizer
              </td>
              <td className="px-6 py-4 whitespace-nowrap">Skin</td>
              <td className="px-6 py-4 whitespace-nowrap">19</td>
              <td className="px-6 py-4 whitespace-nowrap">₹1,050</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#e4f0e9] text-[#23694d]">
                  OK
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                  Restock
                </button>
              </td>
            </tr>
            <tr className="border-b border-line last:border-b-0">
              <td className="px-6 py-4 font-semibold text-pine whitespace-nowrap">
                Schwarzkopf Shampoo
              </td>
              <td className="px-6 py-4 whitespace-nowrap">Hair Care</td>
              <td className="px-6 py-4 whitespace-nowrap">1</td>
              <td className="px-6 py-4 whitespace-nowrap">₹890</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center font-bold text-[9px] uppercase tracking-[0.6px] px-[8px] py-[4px] rounded-[4px] bg-[#f3e0d8] text-[#a04028]">
                  Low
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button className="bg-transparent border border-line text-pine-2 text-[11px] font-semibold py-[5px] px-[10px] rounded-[6px] tracking-[0.3px]">
                  Restock
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
