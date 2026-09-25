import { Button } from '@salon-spa-saas/ui';
import React from 'react';

export function ServicesPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <section className="flex justify-between items-end pt-9 pb-7">
        <div>
          <div className="uppercase text-[10px] font-semibold text-muted tracking-[1.4px]">
            Service Catalogue
          </div>
          <h1 className="font-serif font-normal text-[34px] leading-[1.05] tracking-[-0.4px] text-ink my-1.5">
            Services
          </h1>
          <p className="m-0 text-soft text-[13px]">42 active services • 8 categories</p>
        </div>
        <Button variant="primary" onClick={() => {}}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="hidden md:inline">Add service</span>
        </Button>
      </section>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">Hair Spa</h4>
          <div className="text-[13px] text-soft mb-4">Deep conditioning • 90 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹2,400</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Hair
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">Balayage</h4>
          <div className="text-[13px] text-soft mb-4">Hand-painted highlights • 180 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹6,800</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Hair
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">Hydra Facial</h4>
          <div className="text-[13px] text-soft mb-4">Deep hydration • 60 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹3,200</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Skin
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">Bridal Makeup</h4>
          <div className="text-[13px] text-soft mb-4">Full bridal package • 120 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹9,500</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Bridal
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">
            Manicure + Pedicure
          </h4>
          <div className="text-[13px] text-soft mb-4">Classic polish • 75 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹1,850</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Nails
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">
            Haircut + Beard
          </h4>
          <div className="text-[13px] text-soft mb-4">Men's grooming • 45 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹1,400</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Men
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">
            Keratin Treatment
          </h4>
          <div className="text-[13px] text-soft mb-4">Smoothing • 150 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹8,900</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Hair
          </div>
        </div>
        <div className="bg-white border border-line rounded-[18px] p-6 shadow-xs relative">
          <h4 className="m-0 mb-1.5 font-serif font-normal text-[20px] text-ink">Express Facial</h4>
          <div className="text-[13px] text-soft mb-4">Glow treatment • 30 min</div>
          <div className="text-[16px] font-semibold text-pine-2">₹1,650</div>
          <div className="absolute right-5 top-5 bg-sage text-[#2c6652] text-[9px] font-bold uppercase tracking-[0.6px] py-[3px] px-2 rounded-[4px]">
            Skin
          </div>
        </div>
      </div>
    </div>
  );
}
