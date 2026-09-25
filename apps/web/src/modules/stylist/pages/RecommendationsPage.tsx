import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { Calendar, Check, Lightbulb, Plus, Send, ShoppingBag, Sparkles, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface RecommendationItem {
  id: string;
  client: string;
  homecareProduct: string;
  price: string;
  rebookingDate: string;
  rebookingService: string;
  status: string;
}

const initialRecommendations: RecommendationItem[] = [
  {
    id: 'rec-1',
    client: 'Priya Sharma',
    homecareProduct: 'Kérastase Bain Chromatique Sulphate-Free Shampoo',
    price: '₹2,800',
    rebookingDate: '4 Weeks (Aug 22, 2026)',
    rebookingService: 'Balayage Color Touch-Up & Gloss',
    status: 'Sent to Client WhatsApp & Invoice',
  },
  {
    id: 'rec-2',
    client: 'Ava Rose',
    homecareProduct: 'Olaplex No.3 Hair Perfector Mask',
    price: '₹3,200',
    rebookingDate: '3 Weeks (Aug 15, 2026)',
    rebookingService: 'Caviar Scalp Booster Session',
    status: 'Sent to Client WhatsApp',
  },
];

export function RecommendationsPage() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] =
    useState<RecommendationItem[]>(initialRecommendations);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [client, setClient] = useState('Priya Sharma');
  const [homecareProduct, setHomecareProduct] = useState(
    'Kérastase Bain Chromatique Sulphate-Free Shampoo',
  );
  const [price, setPrice] = useState('₹2,800');
  const [rebookingService, setRebookingService] = useState('Balayage Color Touch-Up & Gloss');
  const [rebookingDate, setRebookingDate] = useState('4 Weeks (Aug 22, 2026)');
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [sendInvoice, setSendInvoice] = useState(true);

  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const statusChannels = [];
    if (sendWhatsapp) statusChannels.push('Client WhatsApp');
    if (sendInvoice) statusChannels.push('POS Invoice');

    const newRec: RecommendationItem = {
      id: `rec-${Date.now()}`,
      client,
      homecareProduct,
      price: price.startsWith('₹') ? price : `₹${price}`,
      rebookingDate,
      rebookingService,
      status:
        statusChannels.length > 0 ? `Sent to ${statusChannels.join(' & ')}` : 'Logged in Profile',
    };

    setRecommendations([newRec, ...recommendations]);
    setIsModalOpen(false);
    toast(`Prescribed ${homecareProduct} for ${client}! 🧴`);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
          Homecare &amp; Rebooking Recommendations
        </h1>
        <p className="text-[13px] text-soft mt-1">
          Prescribe professional homecare products and schedule recommended next-visit rebookings
        </p>
      </div>

      {/* Top Banner Action */}
      <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Prescribe New Homecare Recommendation
          </h3>
          <p className="text-xs text-soft mt-0.5">
            Recommending homecare products boosts stylist retail commission by 5%!
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-5 text-xs font-bold premium-btn-primary cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Prescription
        </Button>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-3 hover:border-[#5A2EA6]/30 transition"
          >
            <div className="flex justify-between items-start border-b border-line pb-2">
              <div>
                <b className="text-sm font-bold text-ink">{r.client}</b>
                <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                  ✓ {r.status}
                </span>
              </div>
            </div>

            <div className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between items-center font-bold text-[#5A2EA6]">
                <span>🧴 {r.homecareProduct}</span>
                <span className="font-mono">{r.price}</span>
              </div>
              <p className="text-soft text-[11px] pt-1">
                Recommended Rebooking: <strong className="text-ink">{r.rebookingService}</strong> (
                {r.rebookingDate})
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* LARGE DIALOG MODAL COVERING SCREEN */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <form
              onSubmit={handlePrescribeSubmit}
              className="bg-white rounded-[32px] w-[94vw] max-w-3xl lg:max-w-4xl max-h-[92vh] shadow-[0_30px_70px_rgba(90,46,166,0.25)] border border-[#5A2EA6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative z-[100000]"
            >
              {/* Header */}
              <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-7 py-5 border-b border-[#5A2EA6]/15 flex justify-between items-center relative shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Homecare &amp; Retail Prescription
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-0.5">
                    Add New Prescription Recommendation
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-paper text-soft hover:text-ink flex items-center justify-center transition border border-[#5A2EA6]/15 cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-7 overflow-y-auto space-y-5 text-xs flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Target Client
                    </label>
                    <select
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Priya Sharma">Priya Sharma</option>
                      <option value="Ava Rose">Ava Rose</option>
                      <option value="Sonia Gupta">Sonia Gupta</option>
                      <option value="Meera Kapoor">Meera Kapoor</option>
                      <option value="Aarav Khanna">Aarav Khanna</option>
                      <option value="Ananya Deshmukh">Ananya Deshmukh</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Retail Product Price (₹)
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₹2,800"
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink font-mono outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Prescribed Homecare Retail Product
                  </label>
                  <select
                    value={homecareProduct}
                    onChange={(e) => setHomecareProduct(e.target.value)}
                    className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/30 rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Kérastase Bain Chromatique Sulphate-Free Shampoo">
                      Kérastase Bain Chromatique Sulphate-Free Shampoo
                    </option>
                    <option value="Olaplex No.3 Hair Perfector Mask">
                      Olaplex No.3 Hair Perfector Mask
                    </option>
                    <option value="Moroccanoil Treatment Light Hair Oil">
                      Moroccanoil Treatment Light Hair Oil
                    </option>
                    <option value="L'Oréal Serie Expert Absolut Repair Mask">
                      L'Oréal Serie Expert Absolut Repair Mask
                    </option>
                    <option value="Dermalogica Daily Microfoliant Scrub">
                      Dermalogica Daily Microfoliant Scrub
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Rebooking Service
                    </label>
                    <input
                      type="text"
                      value={rebookingService}
                      onChange={(e) => setRebookingService(e.target.value)}
                      placeholder="e.g. Color Touch-Up & Gloss"
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Recommended Interval
                    </label>
                    <select
                      value={rebookingDate}
                      onChange={(e) => setRebookingDate(e.target.value)}
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="3 Weeks (Aug 15, 2026)">3 Weeks (Aug 15, 2026)</option>
                      <option value="4 Weeks (Aug 22, 2026)">4 Weeks (Aug 22, 2026)</option>
                      <option value="6 Weeks (Sep 05, 2026)">6 Weeks (Sep 05, 2026)</option>
                      <option value="8 Weeks (Sep 19, 2026)">8 Weeks (Sep 19, 2026)</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Channels */}
                <div className="space-y-2 pt-2 border-t border-line">
                  <span className="text-[11px] font-bold text-soft uppercase tracking-wider block">
                    Notification &amp; Invoice Integration
                  </span>
                  <div className="flex flex-wrap gap-5 text-xs font-semibold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendWhatsapp}
                        onChange={(e) => setSendWhatsapp(e.target.checked)}
                        className="accent-[#5A2EA6]"
                      />
                      <span>Send to Client WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendInvoice}
                        onChange={(e) => setSendInvoice(e.target.checked)}
                        className="accent-[#5A2EA6]"
                      />
                      <span>Attach to POS Invoice Checkout</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-[#FCFAFF] px-7 py-4 border-t border-[#5A2EA6]/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-line bg-white hover:bg-paper/40 text-soft cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
                >
                  Save &amp; Prescribe
                </Button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  );
}
