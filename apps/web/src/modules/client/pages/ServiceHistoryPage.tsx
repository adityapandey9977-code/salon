import { useToast } from '@salon-spa-saas/ui';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  History,
  MapPin,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export function ServiceHistoryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailLog, setSelectedDetailLog] = useState<any>(null);

  // Master Service History State (6 Table Columns + 5 Detail Breakdown Fields)
  const [historyLogs] = useState([
    {
      id: 'INV-88401',
      date: '2026-07-20',
      branch: 'Indrapuri Central Outlet',
      stylist: 'Vikram Kulkarni (Senior Colorist)',
      service: 'Balayage Hair Color & Gloss',
      duration: '120 Mins',
      amount: '₹6,500',
      productsUsed:
        'L’Oréal Blond Studio 9 Lightener, Dia Light 9.11 Ammonia-Free Gloss, Mythic Argan Oil Treatment',
      recommendations:
        'Use sulfate-free color-protecting shampoo every 3 days. Schedule a gloss toner refresh visit in 6 weeks.',
      invoicePdf: 'INV-88401.pdf',
    },
    {
      id: 'INV-82109',
      date: '2026-06-12',
      branch: 'Arera Colony Outlet',
      stylist: 'Aditi Malhotra (Hair Spa Specialist)',
      service: 'Keratin Hair Spa & Scalp Detox',
      duration: '90 Mins',
      amount: '₹4,800',
      productsUsed: 'Schwarzkopf Fibre Clinix Keratin Treatment, Tea-Tree Scalp Purifying Serum',
      recommendations:
        'Avoid washing hair for 48 hours. Apply Keratin leave-in serum after every towel dry.',
      invoicePdf: 'INV-82109.pdf',
    },
    {
      id: 'INV-79012',
      date: '2026-05-04',
      branch: 'Indrapuri Central Outlet',
      stylist: 'Priya Sharma (Master Aesthetician)',
      service: 'Hydra Facial Detox & Glow Spa',
      duration: '60 Mins',
      amount: '₹4,200',
      productsUsed:
        'Hyaluronic Acid Booster Ampoule, Cold Hammer LED Collagen Mask, Dermalogica SPF 50',
      recommendations:
        'Apply hydration moisturizer twice daily. Wear SPF 50 sunscreen when stepping outdoors.',
      invoicePdf: 'INV-79012.pdf',
    },
  ]);

  const filteredHistory = historyLogs.filter(
    (h) =>
      h.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.stylist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Service History &amp; Visit Details
          </h1>
          <p className="text-xs text-soft mt-1">
            Complete visit history, rendered treatments, assigned specialists, products used, and
            post-service care recommendations.
          </p>
        </div>

        <button
          onClick={() => toast('Export History: Service history statement exported to CSV.')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Visit History
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search visit history by service name, stylist, branch, or invoice ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600 text-ink font-semibold"
          />
        </div>
      </div>

      {/* SERVICE HISTORY TABLE - ALL 6 SPECIFIED COLUMNS */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-line flex justify-between items-center">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" /> Past Salon Sessions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Date</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Stylist</th>
                <th className="p-3">Service</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Amount</th>
                <th className="p-3 text-right">Details &amp; Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* 1. Date */}
                  <td className="p-3 font-bold text-ink">{h.date}</td>

                  {/* 2. Branch */}
                  <td className="p-3 font-medium text-soft">{h.branch}</td>

                  {/* 3. Stylist */}
                  <td className="p-3 font-semibold text-purple-900">{h.stylist}</td>

                  {/* 4. Service */}
                  <td className="p-3 font-bold text-purple-700">{h.service}</td>

                  {/* 5. Duration */}
                  <td className="p-3 font-semibold text-soft">{h.duration}</td>

                  {/* 6. Amount */}
                  <td className="p-3 font-bold text-emerald-700 text-sm">{h.amount}</td>

                  {/* Actions: View Detail Modal & Download Invoice */}
                  <td className="p-3 text-right space-x-1.5">
                    <button
                      onClick={() => setSelectedDetailLog(h)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] border border-purple-200 cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-purple-600" /> View Detail
                    </button>

                    <button
                      onClick={() =>
                        toast(`Download Invoice: Downloading ${h.id} GST Tax Invoice PDF...`)
                      }
                      className="px-2 py-1 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-lg font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3 text-purple-600" /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SERVICE DETAIL MODAL (createPortal) - ALL 5 SPECIFIED DETAIL FIELDS */}
      {selectedDetailLog &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                    {selectedDetailLog.id}
                  </span>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight mt-1">
                    Service Breakdown &amp; Care Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDetailLog(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 5 SERVICE DETAIL FIELDS */}
              <div className="space-y-4 text-xs">
                {/* Service Name */}
                <div className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block mb-0.5">
                    Service Name
                  </span>
                  <div className="text-base font-bold text-ink">{selectedDetailLog.service}</div>
                  <div className="text-xs text-soft mt-0.5">
                    {selectedDetailLog.duration} • {selectedDetailLog.amount} •{' '}
                    {selectedDetailLog.branch}
                  </div>
                </div>

                {/* Stylist */}
                <div className="p-3.5 bg-paper/30 rounded-2xl border border-line">
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-0.5">
                    Assigned Stylist / Specialist
                  </span>
                  <div className="text-xs font-bold text-purple-900">
                    {selectedDetailLog.stylist}
                  </div>
                </div>

                {/* Products Used */}
                <div className="p-3.5 bg-paper/30 rounded-2xl border border-line">
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-0.5">
                    Professional Products Used
                  </span>
                  <div className="text-xs font-semibold text-ink leading-relaxed">
                    {selectedDetailLog.productsUsed}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Stylist Post-Care
                    Recommendations
                  </span>
                  <div className="text-xs font-medium text-amber-950 leading-relaxed">
                    {selectedDetailLog.recommendations}
                  </div>
                </div>

                {/* Invoice Download */}
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                      GST Tax Invoice Receipt
                    </span>
                    <div className="text-xs font-bold text-emerald-950">
                      {selectedDetailLog.invoicePdf}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      toast(
                        `Downloading GST Invoice: Downloading ${selectedDetailLog.invoicePdf}...`,
                      )
                    }
                    className="px-4 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-purple-600" /> Download GST Invoice
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-line">
                <button
                  onClick={() => setSelectedDetailLog(null)}
                  className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Close Breakdown
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
