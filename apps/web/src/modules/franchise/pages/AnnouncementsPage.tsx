import { useToast } from '@salon-spa-saas/ui';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Gift,
  Megaphone,
  Package,
  Scissors,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export function AnnouncementsPage() {
  const { toast } = useToast();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  // ALL 5 EXACT HEAD OFFICE ANNOUNCEMENT EXAMPLES REQUESTED BY USER
  const [announcements] = useState([
    {
      id: 'ANC-501',
      type: 'New Pricing Policy',
      title: 'Updated FY26 Service & Retail Price List Revisions',
      date: '2026-08-05',
      priority: 'High Priority',
      summary:
        'Standardized pricing structure revision across all franchise outlets taking effect Sept 1, 2026.',
      fullDetails:
        'Corporate HQ has issued the revised FY26 Service & Retail Price List. All 4 franchise outlets must align POS service prices. High-margin services such as Hydra Facials and Keratin Smooth Therapy have been updated with standardized regional pricing.',
      icon: <Tag className="w-4 h-4 text-purple-600" />,
    },
    {
      id: 'ANC-490',
      type: 'Holiday Offer',
      title: 'Festive Season & Independence Week Pamper Campaign',
      date: '2026-08-03',
      priority: 'Marketing Promo',
      summary:
        'Exclusive 20% discount package on couples spa & bridal pamper packages during August festive week.',
      fullDetails:
        'Head Office is launching the nationwide Festive Season Pamper Campaign. Marketing collateral, digital social media banners, and SMS promo templates have been uploaded to the document vault for immediate deployment.',
      icon: <Gift className="w-4 h-4 text-emerald-600" />,
    },
    {
      id: 'ANC-482',
      type: 'Marketing Campaign',
      title: 'National Digital & Social Media Ad Campaign Toolkit',
      date: '2026-07-28',
      priority: 'National Campaign',
      summary:
        'HQ-sponsored Google Ads & Instagram campaign targeting high-intent salon clients in Bhopal Metro.',
      fullDetails:
        'National Marketing Fund allocation has activated localized geo-targeted digital ads across Bhopal. All online booking leads will route directly to your outlet scheduling calendar.',
      icon: <Megaphone className="w-4 h-4 text-purple-600" />,
    },
    {
      id: 'ANC-465',
      type: 'Training Schedule',
      title: 'Q3 Master Stylist & Aesthetician Certification Workshop',
      date: '2026-07-20',
      priority: 'Mandatory Training',
      summary:
        'Interactive technical training session on advanced hair coloring & balayage techniques.',
      fullDetails:
        'Mandatory technical certification workshop for all Senior Colorists and Aestheticians. Venue: Bhopal Regional Training Suite (or Online Live Stream). Dates: Aug 18–19, 2026.',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: 'ANC-450',
      type: 'Product Launch',
      title: 'Exclusive Launch: L’Oréal Professional Metal Detox Range',
      date: '2026-07-12',
      priority: 'Product Release',
      summary: 'New wholesale supply release of L’Oréal Metal Detox pre-treatment & shampoo range.',
      fullDetails:
        'Head Office central warehouse has stocked the new L’Oréal Metal Detox treatment range. Franchisees can request purchase orders with an introductory 15% wholesale discount.',
      icon: <Package className="w-4 h-4 text-amber-600" />,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            HQ Corporate Announcements &amp; Broadcasts
          </h1>
          <p className="text-xs text-soft mt-1">
            Official communications from Head Office across 5 key categories: New Pricing Policy,
            Holiday Offer, Marketing Campaign, Training Schedule, and Product Launch.
          </p>
        </div>
      </div>

      {/* 5 ANNOUNCEMENT CARDS REQUESTED BY USER */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-paper rounded-lg border border-line">{a.icon}</span>
                <span className="text-[10.5px] font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {a.type}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {a.priority}
                </span>
              </div>
              <span className="text-xs text-soft font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-soft" /> {a.date}
              </span>
            </div>

            <h3 className="text-base font-bold text-ink">{a.title}</h3>
            <p className="text-xs text-soft leading-relaxed">{a.summary}</p>

            <div className="pt-2 flex justify-between items-center border-t border-line/50">
              <span className="text-[10px] text-soft font-mono">{a.id}</span>
              <button
                onClick={() => setSelectedAnnouncement(a)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-transparent border-0 cursor-pointer inline-flex items-center gap-1"
              >
                Read Full Broadcast <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL BROADCAST MODAL (createPortal) */}
      {selectedAnnouncement &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-purple-50 rounded-xl border border-purple-200">
                    {selectedAnnouncement.icon}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">
                      {selectedAnnouncement.type}
                    </span>
                    <h3 className="font-serif text-[16px] text-[#3B2647] font-bold tracking-tight">
                      {selectedAnnouncement.id}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="text-sm font-bold text-ink">{selectedAnnouncement.title}</h4>
                <div className="p-3 bg-pine/5 rounded-xl border border-line text-soft leading-relaxed">
                  {selectedAnnouncement.fullDetails}
                </div>
                <div className="text-[11px] text-soft">
                  Broadcast Date: <strong className="text-ink">{selectedAnnouncement.date}</strong>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-line">
                <button
                  onClick={() => {
                    toast(
                      `Download Toolkit: Downloaded attachments for ${selectedAnnouncement.id}`,
                    );
                    setSelectedAnnouncement(null);
                  }}
                  className="px-4 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Download Attachments
                </button>

                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Close Broadcast
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
