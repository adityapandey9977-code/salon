import { cn, useToast } from '@salon-spa-saas/ui';
import { ArrowLeft, Check, ScissorsIcon, Upload } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function AddServicePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<
    'Hair Dressing & Styling' | 'Skin & Organic Therapy' | 'Nails Art & Spa'
  >('Hair Dressing & Styling');
  const [price, setPrice] = useState('₹1,500');
  const [duration, setDuration] = useState('45 mins');
  const [gender, setGender] = useState<'Mens' | 'Womens' | 'Both'>('Both');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle mock file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast('Image selected successfully!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Please enter a valid service name.');
      return;
    }

    toast(`Successfully created service: ${name}!`);
    navigate('/services-pricing');
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto flex flex-col h-full justify-between overflow-hidden pt-0 pb-1">
      {/* ── Tight Header ── */}
      <div className="shrink-0 border-b border-[#5A2EA6]/10 pb-2 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/services-pricing')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white shadow-xs transition-all duration-200 hover:border-[#5A2EA6]/30 hover:bg-[#5A2EA6]/5 group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-soft transition-colors group-hover:text-[#5A2EA6]" />
          </button>
          <div>
            <h1 className="font-serif text-[18px] font-semibold leading-tight text-ink">
              Add New Service
            </h1>
            <p className="text-[10.5px] text-soft">
              Add a new treatment category or spa service to catalog.
            </p>
          </div>
        </div>
      </div>

      {/* ── Compact Form Body (No Scroll Needed) ── */}
      <form
        onSubmit={handleSubmit}
        id="add-service-form"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-2"
      >
        {/* Left Column: Image Upload Area */}
        <div className="md:col-span-1 space-y-1.5">
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#5A2EA6]">
            Service Cover Image
          </label>
          <div className="relative group border-2 border-dashed border-[#5A2EA6]/20 hover:border-[#5A2EA6]/50 rounded-xl p-3 bg-white transition-all flex flex-col items-center justify-center text-center h-[145px]">
            {imagePreview ? (
              <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-md backdrop-blur-xs">
                    Change Image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#5A2EA6]/5 flex items-center justify-center mb-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#5A2EA6]" />
                </div>
                <span className="text-[10.5px] font-semibold text-ink">Upload Service Image</span>
                <span className="text-[9px] text-soft mt-0.5">PNG, JPG up to 5MB</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>

        {/* Right Column: Service Details Fields */}
        <div className="md:col-span-2 space-y-2.5">
          {/* Service Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-ink">Service Treatment Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Balayage & Organic Styling"
              className="bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] outline-none focus:border-[#5A2EA6] shadow-2xs transition"
              required
            />
          </div>

          {/* Category selection */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-ink">Category Group</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] outline-none focus:border-[#5A2EA6] shadow-2xs transition"
            >
              <option value="Hair Dressing & Styling">Hair Dressing & Styling</option>
              <option value="Skin & Organic Therapy">Skin & Organic Therapy</option>
              <option value="Nails Art & Spa">Nails Art & Spa</option>
            </select>
          </div>

          {/* Pricing and Duration Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-ink">Base Price (INR)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. ₹2,500"
                className="bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-ink">Duration Description</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 60 mins"
                className="bg-white border border-line rounded-lg px-2.5 py-1.5 text-[11.5px] outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                required
              />
            </div>
          </div>

          {/* Gender Radio Card Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-ink">Target Audience (Service For)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mens', 'Womens', 'Both'] as const).map((g) => (
                <div
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn(
                    'py-1.5 px-2 rounded-lg border cursor-pointer transition-all duration-200 text-center flex items-center justify-center gap-1.5 text-[11px] font-semibold',
                    gender === g
                      ? 'bg-[#FAF8FF] border-[#5A2EA6] text-[#5A2EA6] shadow-2xs ring-1 ring-[#5A2EA6]/20'
                      : 'bg-white border-line text-muted hover:border-[#5A2EA6]/40',
                  )}
                >
                  <span>{g === 'Both' ? 'Unisex' : g}</span>
                  {gender === g && <Check className="w-3 h-3 text-[#5A2EA6]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>

      {/* ── Fixed Bottom Footer Bar ── */}
      <div className="shrink-0 border-t border-[#ECE6F8] pt-2.5 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => navigate('/services-pricing')}
          className="px-6 py-1.5 rounded-lg text-[11.5px] font-bold text-soft border border-line bg-white hover:bg-paper/20 hover:text-ink transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="add-service-form"
          className="px-6 py-1.5 rounded-lg text-[11.5px] font-bold text-white bg-[#5A2EA6] hover:bg-[#461D8A] transition cursor-pointer flex items-center gap-1.5 border-0 shadow-xs"
        >
          <ScissorsIcon className="w-3 h-3" />
          Create Service
        </button>
      </div>
    </div>
  );
}
