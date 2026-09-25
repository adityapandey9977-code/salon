import bronzeMemberImg from '@/assets/images/Bronze-member.jpg';
import goldMemberImg from '@/assets/images/Gold-member.jpg';
import platinumMemberImg from '@/assets/images/Platinum-membe.jpg';
import { Button, UsersIcon, cn, useToast } from '@salon-spa-saas/ui';
import { Award, ChevronDown, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DialogModal } from '../../../shared/components/DialogModal';
import { membershipsApi } from '../../../shared/api/memberships.api';

const membershipImages: Record<string, string> = {
  'Platinum Tier': platinumMemberImg,
  'Gold Tier': goldMemberImg,
  'Bronze Tier': bronzeMemberImg,
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

type UIMembership = {
  id?: string;
  name: string;
  price: string;
  members: string;
  multiplier: string;
  discount: string;
  perks: string;
  gradientClass: string;
  badgeClass: string;
  textHighlight: string;
  glowClass: string;
};

export function MembershipsPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [memberships, setMemberships] = useState<UIMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemberships = async () => {
    try {
      setIsLoading(true);
      const data = await membershipsApi.listMemberships();
      const formatted = data.map((tier, i): UIMembership => {
        const preset = COLOR_PRESETS[i % COLOR_PRESETS.length];
        let multiplier = '1.0x points';
        let perks = 'Standard rewards catalog access';
        
        if (tier.pointsMultiplier != null) {
          multiplier = `${tier.pointsMultiplier}x points`;
        }
        if (tier.perksText) {
          perks = tier.perksText;
        } else if (tier.benefitsJson) {
          try {
            const parsed = typeof tier.benefitsJson === 'string' ? JSON.parse(tier.benefitsJson) : tier.benefitsJson;
            multiplier = parsed.multiplier || multiplier;
            perks = parsed.perks || perks;
          } catch (e) {
            // fallback
          }
        }

        const members = tier.membersCount ? tier.membersCount.toString() : '0';

        return {
          id: tier.id,
          name: tier.name,
          price: `₹${tier.price.toLocaleString()}/Yr`,
          members,
          multiplier,
          discount: `${tier.discountPercentage}% off services`,
          perks,
          ...preset,
        };
      });
      setMemberships(formatted);
    } catch (err) {
      console.error('Failed to load memberships:', err);
      toast('Failed to load memberships');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<UIMembership | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('₹5,000/Yr');
  const [newMultiplier, setNewMultiplier] = useState('1.2x points');
  const [newDiscount, setNewDiscount] = useState('8% off services');
  const [newPerks, setNewPerks] = useState('');

  // Edit states
  const [editMultiplier, setEditMultiplier] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editPerks, setEditPerks] = useState('');

  // Add new tier handler
  const handleAddTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast('Please enter a valid tier name.');
      return;
    }

    try {
      const numPrice = parseFloat(newPrice.replace(/[^0-9.]/g, '')) || 0;
      const parsedDiscount = parseFloat(newDiscount.replace(/[^0-9.]/g, '')) || 0;
      const parsedMultiplier = parseFloat(newMultiplier.replace(/[^0-9.]/g, '')) || 1;

      await membershipsApi.createMembership({
        name: newName,
        price: numPrice,
        billingPeriod: 'ANNUAL',
        discountPercentage: parsedDiscount,
        benefitsJson: null,
        isActive: true,
        pointsMultiplier: parsedMultiplier,
        membersCount: 0,
        perksText: newPerks || 'Standard rewards catalog access',
      });

      toast(`Successfully created membership tier: ${newName}!`);

      // Reset and close
      setNewName('');
      setNewPrice('');
      setNewMultiplier('');
      setNewDiscount('');
      setNewPerks('');
      setIsAddModalOpen(false);
      fetchMemberships();
    } catch (err) {
      console.error('Failed to create membership:', err);
      toast('Failed to create membership tier.');
    }
  };

  // Edit tier rules
  const openEditRules = (tier: UIMembership) => {
    setSelectedTier(tier);
    setEditMultiplier(tier.multiplier);
    setEditDiscount(tier.discount);
    setEditPerks(tier.perks);
    setIsEditModalOpen(true);
  };

  // Save tier modifications
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier || !selectedTier.id) {
      toast('Cannot edit this tier right now.');
      return;
    }

    try {
      // NOTE: We do not actually have an update API for membership in commerceService proxy right now? 
      // Actually we do not have an updateMembership endpoint in membership.controller.ts out of the box.
      // So we will just show a toast for now.
      toast('Edit functionality is currently locked for existing tiers.');
      setIsEditModalOpen(false);
      setSelectedTier(null);
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
            Memberships Packages
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Configure subscription tiers, discount multipliers, and rewards.
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center"
        >
          <UsersIcon className="w-3.5 h-3.5" />
          <span>Create New Tier</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {memberships.map((tier, i) => {
          const isPlatinum = tier.name.includes('Platinum');
          const isGold = tier.name.includes('Gold');

          const headerTextColor = isPlatinum
            ? 'text-[#3B1A8C]'
            : isGold
              ? 'text-[#805800]'
              : 'text-[#5C3F2B]';

          const headerSubtextColor = isPlatinum
            ? 'text-[#3B1A8C]/80'
            : isGold
              ? 'text-[#805800]/80'
              : 'text-[#5C3F2B]/80';

          const initialsBadgeStyles = isPlatinum
            ? 'bg-[#7B4DFF]/15 border-[#7B4DFF]/35 text-[#7B4DFF]'
            : isGold
              ? 'bg-[#E0A81D]/20 border-[#E0A81D]/35 text-[#B8840B]'
              : 'bg-[#cca080]/25 border-[#cca080]/35 text-[#80583A]';

          const membersBadgeStyles = isPlatinum
            ? 'bg-[#3B1A8C]/10 text-[#3B1A8C] border-[#3B1A8C]/20'
            : isGold
              ? 'bg-[#805800]/10 text-[#805800] border-[#805800]/20'
              : 'bg-[#5C3F2B]/10 text-[#5C3F2B] border-[#5C3F2B]/20';

          return (
            <div
              key={i}
              className="premium-branch-card rounded-[24px] overflow-hidden flex flex-col justify-between relative bg-center bg-no-repeat min-h-[340px] shadow-sm hover:shadow-md transition"
              style={{
                backgroundImage: `url(${membershipImages[tier.name] || bronzeMemberImg})`,
                backgroundSize: '100% 100%',
              }}
            >
              {/* Frosted Glass Overlay across the entire card */}
              <div className="absolute inset-0 bg-white/85 backdrop-blur-[1.5px] z-0" />

              {/* Custom Premium Header for each tier */}
              <div
                className="premium-card-header px-5 py-3.5 relative min-h-[72px] flex items-center justify-between z-10 bg-gradient-to-r"
                style={
                  isPlatinum
                    ? ({
                        '--premium-header-start': '#E8E0FF',
                        '--premium-header-mid': '#C4B5FD',
                        '--premium-header-end': '#A78BFA',
                      } as React.CSSProperties)
                    : isGold
                      ? ({
                          '--premium-header-start': '#FFFBEB',
                          '--premium-header-mid': '#FDE68A',
                          '--premium-header-end': '#FCD34D',
                        } as React.CSSProperties)
                      : ({
                          '--premium-header-start': '#FDF8F5',
                          '--premium-header-mid': '#EAE0D5',
                          '--premium-header-end': '#D6C7B2',
                        } as React.CSSProperties)
                }
              >
                <div className={cn('premium-card-header-glow', tier.glowClass)} />
                <div className="header-shine" />

                <div className="flex justify-between items-center w-full z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'premium-initials-badge w-9 h-9 rounded-xl flex items-center justify-center font-serif text-[13px] font-bold shrink-0 border',
                        initialsBadgeStyles,
                      )}
                    >
                      {tier.name[0]}
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'font-serif text-[15px] font-bold tracking-tight leading-snug',
                          headerTextColor,
                        )}
                      >
                        {tier.name}
                      </h3>
                      <p className={cn('text-[10.5px] mt-0.5 font-semibold', headerSubtextColor)}>
                        {tier.price}
                      </p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-[9.5px] font-bold px-2.5 py-1 rounded-full shadow-xs shrink-0 border',
                      membersBadgeStyles,
                    )}
                  >
                    {tier.members} members
                  </span>
                </div>
              </div>

              <div className="p-5 text-[12px] text-[#52445c] space-y-4 flex-1 flex flex-col justify-between bg-transparent z-10 relative">
                <div className="space-y-2.5">
                  <p className="flex justify-between border-b border-[#5A2EA6]/10 pb-1.5">
                    <b className="text-ink">Points Multiplier:</b>
                    <span className={cn('font-bold', tier.textHighlight)}>{tier.multiplier}</span>
                  </p>
                  <p className="flex justify-between border-b border-[#5A2EA6]/10 pb-1.5">
                    <b className="text-ink">Service Discount:</b>
                    <span className="font-bold text-emerald-700">{tier.discount}</span>
                  </p>
                  <div>
                    <b className="text-ink block mb-1">Perks &amp; Benefits:</b>
                    <p className="text-[11px] bg-white/40 p-2.5 rounded-xl border border-[#5A2EA6]/10 text-ink min-h-[48px] font-medium">
                      {tier.perks}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-4">
                  <button
                    onClick={() => openEditRules(tier)}
                    className="w-1/2 justify-center rounded-xl text-xs font-semibold py-2.5 border border-[#5A2EA6]/15 text-ink bg-white/80 hover:bg-[#5A2EA6]/5 transition cursor-pointer flex items-center shadow-2xs"
                  >
                    Edit Rules
                  </button>
                  <button
                    onClick={() => {
                      const shortName = tier.name.replace(' Tier', ''); // 'Platinum', 'Gold', 'Bronze'
                      navigate('/customers', { state: { tier: shortName } });
                    }}
                    className={cn(
                      'w-1/2 justify-center rounded-xl text-xs font-semibold py-2.5 border border-[#5A2EA6]/15 bg-white/80 hover:bg-[#5A2EA6]/5 transition cursor-pointer flex items-center shadow-2xs',
                      tier.textHighlight,
                    )}
                  >
                    Subscribers
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Slide-Over Drawer for Add Membership Tier */}
      <div
        className={cn(
          'fixed inset-0 z-50 overflow-hidden transition-opacity duration-300',
          isAddModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsAddModalOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div
            className={cn(
              'w-screen max-w-md bg-white shadow-2xl transform transition duration-300 ease-in-out flex flex-col justify-between',
              isAddModalOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            {/* Drawer Header */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="flex items-center gap-2.5 z-10">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-[17px] text-white font-bold tracking-tight">
                    Create Membership Tier
                  </h2>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    Configure subscription options for salon clients
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-0 shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body / Form */}
            <form
              onSubmit={handleAddTier}
              className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FCFAFF]"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Membership Tier Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Silver Elite"
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Subscription Fee (Annual)
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="e.g. ₹5,000/Yr"
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                    Points Multiplier
                  </label>
                  <input
                    type="text"
                    value={newMultiplier}
                    onChange={(e) => setNewMultiplier(e.target.value)}
                    placeholder="e.g. 1.2x points"
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                    Services Discount
                  </label>
                  <input
                    type="text"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    placeholder="e.g. 8% off services"
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Tier Perks & Benefits
                </label>
                <textarea
                  value={newPerks}
                  onChange={(e) => setNewPerks(e.target.value)}
                  placeholder="e.g. 10% retail discounts, priority stylist booking allocations"
                  rows={3}
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition resize-none"
                />
              </div>

              <div className="p-4 bg-white border border-[#EBE3FA] rounded-2xl text-[11px] text-[#5A2EA6] font-medium leading-relaxed shadow-3xs">
                💡 <strong>Dynamic theme assignment:</strong> New tiers will automatically inherit
                custom pastel layouts and glow overlays according to tier grading levels.
              </div>

              {/* Drawer Footer Buttons */}
              <div className="pt-4 border-t border-[#EBE3FA] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-soft border border-line bg-white hover:bg-paper/20 hover:text-ink transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-sm hover:shadow-md cursor-pointer transition border-0"
                >
                  Create Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Tier Configuration Dialog */}
      <DialogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Membership Tier Rules"
        description={`Modify reward multipliers and perks for ${selectedTier?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-ink">Points Multiplier</label>
              <input
                type="text"
                value={editMultiplier}
                onChange={(e) => setEditMultiplier(e.target.value)}
                className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-ink">Services Discount</label>
              <input
                type="text"
                value={editDiscount}
                onChange={(e) => setEditDiscount(e.target.value)}
                className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Tier Perks & Benefits</label>
            <textarea
              value={editPerks}
              onChange={(e) => setEditPerks(e.target.value)}
              rows={2}
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none resize-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
            >
              Save Configuration Rules
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
      </DialogModal>
    </div>
  );
}
