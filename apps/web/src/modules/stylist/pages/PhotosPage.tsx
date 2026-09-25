import { Button, cn, useToast } from '@salon-spa-saas/ui';
import { Camera, Eye, Image as ImageIcon, Plus, Sparkles, Upload, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

import mensFacialImg from '@/assets/images/Mens-Facial.jpg';
import mensHaircutImg from '@/assets/images/Mens-haircut.jpg';
import womenFacialImg from '@/assets/images/Women-Facial.jpg';
import womenHaircutImg from '@/assets/images/Women-haircut.jpg';
import womenMakeUpImg from '@/assets/images/women-MakeUp.jpg';

interface PhotoItem {
  id: string;
  client: string;
  service: string;
  date: string;
  beforeImg: string;
  afterImg: string;
  notes: string;
  isVerified?: boolean;
}

const initialGallery: PhotoItem[] = [
  {
    id: 'photo-1',
    client: 'Priya Sharma',
    service: 'Balayage Color & Gloss',
    date: 'Jul 24, 2026',
    beforeImg: womenHaircutImg,
    afterImg: womenHaircutImg,
    notes: 'Dark brassy ends transformed to luminous 7.1 Ash Blonde balayage.',
    isVerified: true,
  },
  {
    id: 'photo-2',
    client: 'Ananya Deshmukh',
    service: 'Atelier Bridal Glow',
    date: 'Jul 15, 2026',
    beforeImg: womenFacialImg,
    afterImg: womenMakeUpImg,
    notes: 'Pre-wedding facial glow & radiant bridal makeup transformation.',
    isVerified: true,
  },
];

export function PhotosPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  const [gallery, setGallery] = useState<PhotoItem[]>(initialGallery);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [client, setClient] = useState('Priya Sharma');
  const [service, setService] = useState('Balayage Color & Gloss');
  const [beforeImg, setBeforeImg] = useState(womenFacialImg);
  const [afterImg, setAfterImg] = useState(womenMakeUpImg);
  const [notes, setNotes] = useState('Post-treatment hair shine & color tone transformation.');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPhoto: PhotoItem = {
      id: `photo-${Date.now()}`,
      client,
      service,
      date: 'Jul 24, 2026',
      beforeImg,
      afterImg,
      notes,
      isVerified: true,
    };

    setGallery([newPhoto, ...gallery]);
    setIsModalOpen(false);
    toast(`Uploaded service transformation photo for ${client} (${service})! 📸`);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
            Transformation Photo Gallery
          </h1>
          <p className="text-[13px] text-soft mt-1">
            Capture, compare, and showcase client pre-treatment and post-service transformation
            photographs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
            <button
              onClick={() => setActiveTab('before')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'before'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              Before Photos
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'after'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              After Photos &amp; Comparisons
            </button>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 text-xs font-bold premium-btn-primary cursor-pointer shadow-xs"
          >
            <Camera className="w-4 h-4 mr-1.5" /> Upload Photo
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4 hover:border-[#5A2EA6]/30 transition"
          >
            <div className="flex justify-between items-center border-b border-line pb-2">
              <div>
                <h3 className="font-serif text-base font-bold text-ink">{item.client}</h3>
                <span className="text-[11px] text-[#5A2EA6] font-semibold">
                  {item.service} · {item.date}
                </span>
              </div>
              <span className="bg-amber-400 text-black text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-md">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Before Treatment
                </span>
                <div className="aspect-square rounded-2xl overflow-hidden border border-[#5A2EA6]/15 relative bg-gray-100">
                  <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    Before
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                  After Transformation
                </span>
                <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#5A2EA6] relative shadow-md bg-gray-100">
                  <img src={item.afterImg} alt="After" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-[#5A2EA6] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    After
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11.5px] text-soft italic bg-[#FCFAFF] p-3 rounded-xl border border-line">
              {item.notes}
            </p>
          </div>
        ))}
      </div>

      {/* LARGE DIALOG MODAL COVERING SCREEN */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <form
              onSubmit={handleUploadSubmit}
              className="bg-white rounded-[32px] w-[94vw] max-w-3xl lg:max-w-4xl max-h-[92vh] shadow-[0_30px_70px_rgba(90,46,166,0.25)] border border-[#5A2EA6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative z-[100000]"
            >
              {/* Header */}
              <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-7 py-5 border-b border-[#5A2EA6]/15 flex justify-between items-center relative shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Client Photo Gallery Uploader
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-0.5">
                    Upload Customer Service Photo
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
                      Target Customer
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
                      Service Delivered
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Balayage Color &amp; Gloss">Balayage Color &amp; Gloss</option>
                      <option value="Kérastase Caviar Hair Spa">Kérastase Caviar Hair Spa</option>
                      <option value="Atelier Bridal Glow">Atelier Bridal Glow</option>
                      <option value="Hydra Facial Detox">Hydra Facial Detox</option>
                      <option value="Precision Haircut &amp; Beard">
                        Precision Haircut &amp; Beard
                      </option>
                    </select>
                  </div>
                </div>

                {/* Photo Asset Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                      Before Treatment Photo
                    </label>
                    <select
                      value={beforeImg}
                      onChange={(e) => setBeforeImg(e.target.value)}
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value={womenFacialImg}>Pre-Service Facial Sheet</option>
                      <option value={womenHaircutImg}>Pre-Service Haircut Sheet</option>
                      <option value={mensHaircutImg}>Gentlemen Pre-Cut Sheet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      After Transformation Photo
                    </label>
                    <select
                      value={afterImg}
                      onChange={(e) => setAfterImg(e.target.value)}
                      className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value={womenMakeUpImg}>Post-Service Makeup Glow</option>
                      <option value={womenHaircutImg}>Post-Service Balayage Finish</option>
                      <option value={mensFacialImg}>Post-Service Facial Finish</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-soft uppercase tracking-wider block mb-1.5">
                    Transformation Notes &amp; Shade Details
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record hair shine, shade result, or skin hydration notes..."
                    className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-xs outline-none focus:border-[#5A2EA6] text-ink font-semibold h-28"
                    required
                  />
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
                  Save &amp; Upload Photo Pair
                </Button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  );
}
