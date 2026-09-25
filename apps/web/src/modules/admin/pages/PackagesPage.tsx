import bookMassageImg from '@/assets/images/Book-Massage.jpg';
import pedicureImg from '@/assets/images/Pedicure.jpg';
import womenMakeUpImg from '@/assets/images/women-MakeUp.jpg';
import { BoxIcon, Button, cn, useToast } from '@salon-spa-saas/ui';
import { Check, Gift, Upload, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { packagesApi, type PackageDto } from '../../../shared/api/packages.api';

const packageImages: Record<string, string> = {
  'Bridal Glow Deluxe': womenMakeUpImg,
  'Seasonal Rejuvenation': bookMassageImg,
  'Glow & Polish Combo': pedicureImg,
};

const COLOR_PRESETS = [
  {
    gradientClass: 'from-[#2D2833] via-[#3B2647] to-[#5A2EA6]',
    badgeClass: 'bg-amber-400/20 border border-amber-400/30 text-amber-300',
    textHighlight: 'text-amber-500',
    glowClass: 'bg-amber-300/10',
  },
  {
    gradientClass: 'from-[#5A2EA6] via-[#8B6FD8] to-[#cca080]',
    badgeClass: 'bg-[#cca080]/20 border border-[#cca080]/30 text-[#cca080]',
    textHighlight: 'text-[#cca080]',
    glowClass: 'bg-[#cca080]/15',
  },
  {
    gradientClass: 'from-[#8B6FD8] via-[#A784F7] to-[#C7B3FF]',
    badgeClass: 'bg-white/20 border border-white/30 text-white',
    textHighlight: 'text-[#5A2EA6]',
    glowClass: 'bg-white/10',
  },
];

type UIPackage = {
  id?: string;
  name: string;
  price: string;
  items: string[];
  duration: string;
  sales: string;
  gradientClass: string;
  badgeClass: string;
  textHighlight: string;
  glowClass: string;
  originalPriceNum?: number;
};

export function PackagesPage() {
  const { toast } = useToast();
  const location = useLocation();
  const [packages, setPackages] = useState<UIPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const data = await packagesApi.listPackages();
      const formatted = data.map((pkg, i): UIPackage => {
        const preset = COLOR_PRESETS[i % COLOR_PRESETS.length];
        let items: string[] = [];
        if (pkg.includedServicesText) {
          items = pkg.includedServicesText.split(',').map((s) => s.trim()).filter(Boolean);
        } else if (pkg.description) {
          try {
            const desc = JSON.parse(pkg.description);
            items = desc.items || [];
          } catch (e) {
            items = [pkg.description];
          }
        }

        const duration = pkg.durationMins ? `${pkg.durationMins} mins` : '120 mins';
        const sales = pkg.salesCount ? `${pkg.salesCount} Sold` : '0 Sold';

        return {
          id: pkg.id,
          name: pkg.name,
          price: `₹${pkg.price.toLocaleString()}`,
          originalPriceNum: pkg.price,
          items,
          duration,
          sales,
          ...preset,
        };
      });
      setPackages(formatted);
    } catch (err) {
      console.error('Failed to load packages:', err);
      toast('Failed to load packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<UIPackage | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('₹2,500');
  const [newDuration, setNewDuration] = useState('90 mins');
  const [newServicesRaw, setNewServicesRaw] = useState('Hair wash, Blowdry, Hair Mask');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit states
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editServicesRaw, setEditServicesRaw] = useState('');

  // Promo states
  const [isPromoDrawerOpen, setIsPromoDrawerOpen] = useState(false);
  const [selectedPromoPkg, setSelectedPromoPkg] = useState<UIPackage | null>(
    null,
  );
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('15%');
  const [promoExpiry, setPromoExpiry] = useState('2026-08-31');

  // Close invite drawer on route/page change
  useEffect(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsPromoDrawerOpen(false);
  }, [location.pathname]);

  // Handle mock file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast('Image uploaded successfully!');
    }
  };

  // Add new package handler
  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newServicesRaw.trim()) {
      toast('Please enter a valid package name and services.');
      return;
    }

    try {
      const itemsList = newServicesRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const numPrice = parseFloat(newPrice.replace(/[^0-9.]/g, '')) || 0;
      const durationMinsMatch = newDuration.match(/\d+/);
      const durationMins = durationMinsMatch ? parseInt(durationMinsMatch[0], 10) : 120;

      await packagesApi.createPackage({
        code: `PKG-${Date.now().toString(36).toUpperCase()}`,
        name: newName,
        description: '', // Can be omitted or left blank
        price: numPrice,
        validityDays: 365,
        isShared: true,
        isActive: true,
        durationMins,
        salesCount: 0,
        imageUrl: imagePreview,
        includedServicesText: newServicesRaw,
        items: [], // Proper service links omitted for now
      });

      toast(`Successfully created package combo: ${newName}!`);
      
      // Reset and close
      setNewName('');
      setNewServicesRaw('');
      setImagePreview(null);
      setIsAddModalOpen(false);
      fetchPackages();
    } catch (err) {
      console.error('Failed to create package:', err);
      toast('Failed to create package. Please try again.');
    }
  };

  // Promo submit handler
  const handleConfigurePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      toast('Please enter a valid promo code.');
      return;
    }
    toast(
      `Promo code "${promoCode}" (${promoDiscount} off) configured for ${selectedPromoPkg?.name}!`,
    );
    setPromoCode('');
    setIsPromoDrawerOpen(false);
  };

  // Edit action trigger
  const openEditModal = (pkg: UIPackage) => {
    setSelectedPkg(pkg);
    setEditPrice(pkg.price);
    setEditDuration(pkg.duration);
    setEditServicesRaw(pkg.items.join(', '));
    setIsEditModalOpen(true);
  };

  // Save changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg || !selectedPkg.id) {
      toast('Cannot edit this package right now.');
      return;
    }

    try {
      // NOTE: We do not actually have an update API for package in commerceService proxy right now? 
      // Actually we do not have an updatePackage endpoint in package.controller.ts out of the box.
      // So we will just show a toast for now.
      toast('Edit functionality is currently locked for existing packages.');
      setIsEditModalOpen(false);
      setSelectedPkg(null);
    } catch (err) {
      console.error(err);
      toast('Failed to save changes.');
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Voucher &amp; Packages
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Configure service combos, discounted vouchers, and bundles.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center"
        >
          <BoxIcon className="w-3.5 h-3.5" />
          <span>Create New Package</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, i) => (
          <div
            key={i}
            className="premium-branch-card rounded-[24px] overflow-hidden flex flex-col justify-between relative bg-center bg-no-repeat min-h-[350px] shadow-sm hover:shadow-md transition"
            style={{
              backgroundImage: `url(${packageImages[pkg.name] || pedicureImg})`,
              backgroundSize: '100% 100%',
            }}
          >
            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 bg-white/85 backdrop-blur-[1.5px] z-0" />

            {/* Compact Custom Premium Header for each package combo */}
            <div
              className={cn(
                'premium-card-header px-5 py-3.5 relative min-h-[72px] flex items-center justify-between z-10 bg-gradient-to-r opacity-95',
                pkg.gradientClass,
              )}
            >
              <div className={cn('premium-card-header-glow', pkg.glowClass)} />
              <div className="header-shine" />

              <div className="flex justify-between items-center w-full z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'premium-initials-badge w-9 h-9 rounded-xl flex items-center justify-center font-serif text-[13px] font-bold shrink-0',
                      pkg.badgeClass,
                    )}
                  >
                    {pkg.name[0]}
                  </div>
                  <div>
                    <h3 className="font-serif text-[15px] text-white font-bold tracking-tight leading-snug">
                      {pkg.name}
                    </h3>
                    <p className="text-[10.5px] text-white/80 mt-0.5 font-semibold">
                      Duration: {pkg.duration}
                    </p>
                  </div>
                </div>

                <span className="text-[14px] font-bold text-white shrink-0">{pkg.price}</span>
              </div>
            </div>

            <div className="p-5 text-[12px] text-[#52445c] space-y-4 flex-1 flex flex-col justify-between bg-transparent z-10 relative">
              <div className="space-y-3">
                <div>
                  <b className="text-ink block mb-2">Included Services:</b>
                  <ul className="list-disc pl-4 space-y-1.5 text-[11px] text-[#6d5b73]">
                    {pkg.items.map((it, idx) => (
                      <li key={idx} className="marker:text-[#5A2EA6] font-medium">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="flex justify-between border-t border-[#5A2EA6]/10 pt-2">
                  <b className="text-ink">Voucher Sales:</b>
                  <span className={cn('font-bold', pkg.textHighlight)}>{pkg.sales}</span>
                </p>
              </div>

              <div className="flex gap-2.5 pt-4">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="w-1/2 justify-center rounded-xl text-xs font-semibold py-2.5 border border-[#5A2EA6]/15 text-ink bg-white/80 hover:bg-[#5A2EA6]/5 transition cursor-pointer flex items-center shadow-2xs"
                >
                  Edit Combo
                </button>
                <button
                  onClick={() => {
                    setSelectedPromoPkg(pkg);
                    setIsPromoDrawerOpen(true);
                  }}
                  className={cn(
                    'w-1/2 justify-center rounded-xl text-xs font-semibold py-2.5 border border-[#5A2EA6]/15 bg-white/80 hover:bg-[#5A2EA6]/5 transition cursor-pointer flex items-center shadow-2xs',
                    pkg.textHighlight,
                  )}
                >
                  Configure Promo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Package Drawer */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-[420px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden border-l border-[#5A2EA6]/10">
            {/* Header */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10">
                <h3 className="font-serif text-[16px] text-white font-bold tracking-tight">
                  Create New Package
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Configure bundled services with customized pricing
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Form */}
            <form
              onSubmit={handleAddPackage}
              className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-[#FAF8FF] via-[#F6F1FF] to-[#FCFBFF]"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Image Upload Option */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A2EA6]">
                    Package Cover Image
                  </label>
                  <div className="relative group border-2 border-dashed border-[#5A2EA6]/20 hover:border-[#5A2EA6]/50 rounded-xl p-3 bg-white transition-all flex flex-col items-center justify-center text-center h-[140px]">
                    {imagePreview ? (
                      <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
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
                        <span className="text-[10.5px] font-semibold text-ink">
                          Upload Cover Image
                        </span>
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

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">Package Combo Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Wedding Express Makeover"
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-ink text-[12px]">Combo Price (INR)</label>
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. ₹4,500"
                      className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-ink text-[12px]">Total Duration</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="e.g. 120 mins"
                      className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">
                    Included Services (Comma separated)
                  </label>
                  <textarea
                    value={newServicesRaw}
                    onChange={(e) => setNewServicesRaw(e.target.value)}
                    placeholder="Hydrating Skin Facial, Pedicure, Hair Glossing"
                    rows={3}
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none resize-none focus:border-[#5A2EA6]"
                    required
                  />
                </div>
              </div>
              {/* Footer */}
              <div className="shrink-0 p-4 bg-white border-t border-[#5A2EA6]/10 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
                >
                  Create Combo
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Combo Package Drawer */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsEditModalOpen(false)}
          />
          <div className="relative w-full max-w-[420px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden border-l border-[#5A2EA6]/10">
            {/* Header */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10">
                <h3 className="font-serif text-[16px] text-white font-bold tracking-tight">
                  Edit Combo Package
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Modify configuration parameters for {selectedPkg?.name}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Form */}
            <form
              onSubmit={handleSaveEdit}
              className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-[#FAF8FF] via-[#F6F1FF] to-[#FCFBFF]"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-ink text-[12px]">Combo Price (INR)</label>
                    <input
                      type="text"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="bg-white border border-[#5A2EA6]/20 rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-ink text-[12px]">Total Duration</label>
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="bg-white border border-[#5A2EA6]/20 rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">
                    Included Services (Comma separated)
                  </label>
                  <textarea
                    value={editServicesRaw}
                    onChange={(e) => setEditServicesRaw(e.target.value)}
                    rows={4}
                    className="bg-white border border-[#5A2EA6]/20 rounded-xl p-2.5 text-[12px] outline-none resize-none focus:border-[#5A2EA6]"
                    required
                  />
                </div>
              </div>
              {/* Footer */}
              <div className="shrink-0 p-4 bg-white border-t border-[#5A2EA6]/10 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
                >
                  Save Combo
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure Promo Drawer */}
      {isPromoDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsPromoDrawerOpen(false)}
          />
          <div className="relative w-full max-w-[420px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden border-l border-[#5A2EA6]/10">
            {/* Header */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10">
                <h3 className="font-serif text-[16px] text-white font-bold tracking-tight">
                  Configure Promo Code
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Setup operational code values for {selectedPromoPkg?.name}
                </p>
              </div>
              <button
                onClick={() => setIsPromoDrawerOpen(false)}
                className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Form */}
            <form
              onSubmit={handleConfigurePromoSubmit}
              className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-[#FAF8FF] via-[#F6F1FF] to-[#FCFBFF]"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-ink text-[12px]">Promotional Promo Code</label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. WEDDING30"
                    className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-ink text-[12px]">Discount Amount</label>
                    <select
                      value={promoDiscount}
                      onChange={(e) => setPromoDiscount(e.target.value)}
                      className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="10%">10% Off</option>
                      <option value="15%">15% Off</option>
                      <option value="20%">20% Off</option>
                      <option value="25%">25% Off</option>
                      <option value="30%">30% Off</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-ink text-[12px]">Expiry Date</label>
                    <input
                      type="date"
                      value={promoExpiry}
                      onChange={(e) => setPromoExpiry(e.target.value)}
                      className="bg-white border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="shrink-0 p-4 bg-white border-t border-[#5A2EA6]/10 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  Save Promo
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromoDrawerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
