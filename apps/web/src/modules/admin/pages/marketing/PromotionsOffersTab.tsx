import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  Copy,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Layers,
  Percent,
  Plus,
  Power,
  Scissors,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PromotionOffer {
  id: string;
  name: string;
  code: string;
  type:
    | 'Percentage Discount'
    | 'Flat Cash Voucher'
    | 'Complimentary Upgrade'
    | 'BOGO / Festive Bundle';
  discountBenefit: string;
  description: string;
  applicableServices: string[];
  applicableProducts: string[];
  applicableBranches: string[];
  startDate: string;
  endDate: string;
  usageLimit: number;
  currentUsage: number;
  revenueGenerated: string;
  status: 'Draft' | 'Scheduled' | 'Active' | 'Expired' | 'Disabled';
  approvalState: 'Approved' | 'Pending Review';
  approvedBy?: string;
  branchBreakdown: {
    branchName: string;
    uses: number;
    revenue: string;
  }[];
}

const mockOffers: PromotionOffer[] = [
  {
    id: 'OFF-2026-01',
    name: 'Monsoon Glow Keratin Special',
    code: 'GLOW20',
    type: 'Percentage Discount',
    discountBenefit: '20% OFF (Min Spend ₹3,500)',
    description: 'Seasonal 20% discount on premium keratin smoothing and luxury hair spa rituals.',
    applicableServices: ['Keratin Hair Smoothing', 'Luxury Moroccan Oil Hair Spa'],
    applicableProducts: ['Retail Hair Serums'],
    applicableBranches: ['Indore Central Flagship', 'Vijay Nagar Boutique', 'Bhopal Arera Colony'],
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    usageLimit: 2000,
    currentUsage: 1420,
    revenueGenerated: '₹9,20,000',
    status: 'Active',
    approvalState: 'Approved',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    branchBreakdown: [
      { branchName: 'Indore Central Flagship', uses: 640, revenue: '₹4,16,000' },
      { branchName: 'Vijay Nagar Boutique', uses: 480, revenue: '₹3,12,000' },
      { branchName: 'Bhopal Arera Colony', uses: 300, revenue: '₹1,92,000' },
    ],
  },
  {
    id: 'OFF-2026-02',
    name: 'First-Visit Welcome Voucher',
    code: 'WELCOME500',
    type: 'Flat Cash Voucher',
    discountBenefit: '₹500 OFF (Min Bill ₹1,500)',
    description:
      'New client acquisition incentive applicable on all hair and aesthetic beauty bookings.',
    applicableServices: ['All Hair & Skin Services'],
    applicableProducts: ['All Retail Catalogue'],
    applicableBranches: ['All 5 Salon Branches'],
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    usageLimit: 5000,
    currentUsage: 2840,
    revenueGenerated: '₹14,20,000',
    status: 'Active',
    approvalState: 'Approved',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    branchBreakdown: [
      { branchName: 'Indore Central Flagship', uses: 1100, revenue: '₹5,50,000' },
      { branchName: 'Vijay Nagar Boutique', uses: 820, revenue: '₹4,10,000' },
      { branchName: 'Bhopal Arera Colony', uses: 450, revenue: '₹2,25,000' },
      { branchName: 'Ujjain Mahakal Road', uses: 270, revenue: '₹1,35,000' },
      { branchName: 'Gwalior City Centre', uses: 200, revenue: '₹1,00,000' },
    ],
  },
  {
    id: 'OFF-2026-03',
    name: 'Bridal Party Radiance Upgrade',
    code: 'BRIDALSPA',
    type: 'Complimentary Upgrade',
    discountBenefit: 'Complimentary Backwash Spa (Worth ₹1,200)',
    description:
      'Free deep conditioning hair mask and head massage with any Global Hair Colour or Highlights.',
    applicableServices: ['Global Hair Colouring', 'Highlights & Balayage'],
    applicableProducts: [],
    applicableBranches: ['Indore Central Flagship', 'Vijay Nagar Boutique', 'Bhopal Arera Colony'],
    startDate: '10 Aug 2026',
    endDate: '20 Sep 2026',
    usageLimit: 800,
    currentUsage: 380,
    revenueGenerated: '₹3,42,000',
    status: 'Active',
    approvalState: 'Approved',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    branchBreakdown: [
      { branchName: 'Indore Central Flagship', uses: 210, revenue: '₹1,89,000' },
      { branchName: 'Vijay Nagar Boutique', uses: 170, revenue: '₹1,53,000' },
    ],
  },
  {
    id: 'OFF-2026-04',
    name: 'Independence Day Festive Duo',
    code: 'FREEDOM26',
    type: 'BOGO / Festive Bundle',
    discountBenefit: 'Buy 1 Facial, Get Express Mani 50% Off',
    description: 'Long weekend festive bundle pairing O3+ Seaweed Facial with nail care services.',
    applicableServices: ['O3+ Seaweed Facial', 'Luxury Manicure'],
    applicableProducts: [],
    applicableBranches: ['All 5 Salon Branches'],
    startDate: '12 Aug 2026',
    endDate: '18 Aug 2026',
    usageLimit: 1000,
    currentUsage: 620,
    revenueGenerated: '₹2,79,000',
    status: 'Expired',
    approvalState: 'Approved',
    approvedBy: 'Aditya Pandey (Brand Owner)',
    branchBreakdown: [
      { branchName: 'Indore Central Flagship', uses: 280, revenue: '₹1,26,000' },
      { branchName: 'Vijay Nagar Boutique', uses: 200, revenue: '₹90,000' },
      { branchName: 'Bhopal Arera Colony', uses: 140, revenue: '₹63,000' },
    ],
  },
  {
    id: 'OFF-2026-05',
    name: 'Weekend Men Grooming Pass',
    code: 'MENPRO30',
    type: 'Percentage Discount',
    discountBenefit: '30% OFF Beard & Haircut Combo',
    description: 'High-frequency weekend grooming promo for male clientele.',
    startDate: '25 Aug 2026',
    endDate: '25 Sep 2026',
    applicableServices: ['Men Classic Haircut', 'Beard Sculpt & Spa'],
    applicableProducts: ['Beard Oil & Wax'],
    applicableBranches: ['Vijay Nagar Boutique', 'Indore Central Flagship'],
    usageLimit: 600,
    currentUsage: 0,
    revenueGenerated: '₹0',
    status: 'Scheduled',
    approvalState: 'Pending Review',
    branchBreakdown: [],
  },
];

export function PromotionsOffersTab() {
  const [offersList, setOffersList] = useState<PromotionOffer[]>(mockOffers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [selectedOffer, setSelectedOffer] = useState<PromotionOffer | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<PromotionOffer | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formType, setFormType] = useState<PromotionOffer['type']>('Percentage Discount');
  const [formDiscount, setFormDiscount] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formLimit, setFormLimit] = useState(1000);
  const [formBranches, setFormBranches] = useState<string[]>([
    'Indore Central Flagship',
    'Vijay Nagar Boutique',
  ]);
  const [formServices, setFormServices] = useState<string[]>([
    'Global Hair Colouring',
    'Keratin Hair Smoothing',
  ]);
  const [formStatus, setFormStatus] = useState<PromotionOffer['status']>('Active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isCreateModalOpen || selectedOffer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateModalOpen, selectedOffer]);

  const getStatusBadge = (st: PromotionOffer['status']) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Expired':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Disabled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Draft':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormName('');
    setFormCode('');
    setFormType('Percentage Discount');
    setFormDiscount('20% OFF');
    setFormDesc('');
    setFormStartDate('2026-08-20');
    setFormEndDate('2026-09-20');
    setFormLimit(1000);
    setFormBranches(['Indore Central Flagship', 'Vijay Nagar Boutique']);
    setFormServices(['Global Hair Colouring', 'Luxury Moroccan Oil Hair Spa']);
    setFormStatus('Active');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (off: PromotionOffer) => {
    setEditingOffer(off);
    setFormName(off.name);
    setFormCode(off.code);
    setFormType(off.type);
    setFormDiscount(off.discountBenefit);
    setFormDesc(off.description);
    setFormStartDate('2026-08-01');
    setFormEndDate('2026-08-31');
    setFormLimit(off.usageLimit);
    setFormBranches(off.applicableBranches);
    setFormServices(off.applicableServices);
    setFormStatus(off.status);
    setIsCreateModalOpen(true);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      showToast('Please specify offer name and coupon promo code.');
      return;
    }

    if (editingOffer) {
      setOffersList((prev) =>
        prev.map((o) =>
          o.id === editingOffer.id
            ? {
                ...o,
                name: formName,
                code: formCode.toUpperCase(),
                type: formType,
                discountBenefit: formDiscount,
                description: formDesc,
                startDate: formStartDate,
                endDate: formEndDate,
                usageLimit: Number(formLimit),
                applicableBranches: formBranches,
                applicableServices: formServices,
                status: formStatus,
              }
            : o,
        ),
      );
      showToast(`Promotion "${formName}" updated.`);
    } else {
      const newOff: PromotionOffer = {
        id: `OFF-2026-0${offersList.length + 1}`,
        name: formName,
        code: formCode.toUpperCase(),
        type: formType,
        discountBenefit: formDiscount,
        description: formDesc || 'Brand owner approved promotion offer.',
        startDate: formStartDate || '20 Aug 2026',
        endDate: formEndDate || '20 Sep 2026',
        usageLimit: Number(formLimit),
        currentUsage: 0,
        revenueGenerated: '₹0',
        applicableBranches: formBranches,
        applicableServices: formServices,
        applicableProducts: [],
        status: formStatus,
        approvalState: 'Approved',
        approvedBy: 'Aditya Pandey (Brand Owner)',
        branchBreakdown: [],
      };
      setOffersList([newOff, ...offersList]);
      showToast(`Offer "${formName}" created and active.`);
    }
    setIsCreateModalOpen(false);
  };

  const handleToggleStatus = (off: PromotionOffer) => {
    const nextStatus = off.status === 'Active' ? 'Disabled' : 'Active';
    setOffersList((prev) => prev.map((o) => (o.id === off.id ? { ...o, status: nextStatus } : o)));
    showToast(`Promotion "${off.name}" is now ${nextStatus}.`);
  };

  const handleDuplicate = (off: PromotionOffer) => {
    const dup: PromotionOffer = {
      ...off,
      id: `OFF-2026-0${offersList.length + 1}`,
      name: `${off.name} (Copy)`,
      code: `${off.code}_COPY`,
      status: 'Draft',
      currentUsage: 0,
      revenueGenerated: '₹0',
      branchBreakdown: [],
    };
    setOffersList([dup, ...offersList]);
    showToast(`Duplicated "${off.name}" as draft.`);
  };

  const filteredOffers = offersList.filter((o) => {
    if (selectedType !== 'all' && o.type !== selectedType) return false;
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (
      selectedBranch !== 'all' &&
      !o.applicableBranches.some((b) => b.includes(selectedBranch) || b.includes('All'))
    ) {
      return false;
    }
    if (searchTerm) {
      const match = `${o.name} ${o.code} ${o.type} ${o.discountBenefit}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search offer name, promo code, discount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Applicable Outlets</option>
            <option value="Indore Central">Indore Central Flagship</option>
            <option value="Vijay Nagar">Vijay Nagar Boutique</option>
            <option value="Bhopal">Bhopal Arera Colony</option>
          </select>

          {/* Offer Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Offer Formats</option>
            <option value="Percentage Discount">Percentage Discount</option>
            <option value="Flat Cash Voucher">Flat Cash Voucher</option>
            <option value="Complimentary Upgrade">Complimentary Upgrade</option>
            <option value="BOGO / Festive Bundle">BOGO / Festive Bundle</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Offer Statuses</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting promotion offers catalog (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Offers</span>
          </Button>

          <Button
            onClick={handleOpenCreate}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Promotion Offer</span>
          </Button>
        </div>
      </div>

      {/* 2. Section 5 PRD: PROMOTIONS & OFFERS TABLE */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Promotions &amp; Special Offers Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                {filteredOffers.length} Offers
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Authorized discount coupons, cash vouchers, complimentary service upgrades, and
              redemption thresholds
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">POS Validated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Offer Name &amp; Promo Code</th>
                <th className="p-3.5">Offer Type</th>
                <th className="p-3.5">Discount / Benefit</th>
                <th className="p-3.5">Validity Dates</th>
                <th className="p-3.5 text-center">Usage Pacing</th>
                <th className="p-3.5 text-right">Revenue Generated</th>
                <th className="p-3.5 text-center">Approval State</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredOffers.map((off) => (
                <tr key={off.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Name & Code */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{off.name}</strong>
                    <span className="text-[10px] font-mono font-bold text-[#5A2EA6] bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 inline-block mt-0.5">
                      {off.code}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">{off.type}</td>

                  {/* Benefit */}
                  <td className="p-3.5 whitespace-nowrap font-bold text-indigo-900">
                    {off.discountBenefit}
                  </td>

                  {/* Dates */}
                  <td className="p-3.5 whitespace-nowrap text-slate-700">
                    <span>{off.startDate}</span>
                    <span className="text-[10px] text-muted block">to {off.endDate}</span>
                  </td>

                  {/* Usage */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <strong className="font-bold text-ink block">
                      {off.currentUsage.toLocaleString()} / {off.usageLimit.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-soft">
                      {Math.round((off.currentUsage / (off.usageLimit || 1)) * 100)}% utilized
                    </span>
                  </td>

                  {/* Revenue */}
                  <td className="p-3.5 text-right font-extrabold font-serif text-[#5A2EA6] text-sm whitespace-nowrap">
                    {off.revenueGenerated}
                  </td>

                  {/* Approval */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        off.approvalState === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200',
                      )}
                    >
                      {off.approvalState}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(off.status),
                      )}
                    >
                      {off.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedOffer(off)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Inspect</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(off)}
                        className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                        title="Edit Offer"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleDuplicate(off)}
                        className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                        title="Duplicate Offer"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleToggleStatus(off)}
                        className={cn(
                          'h-[30px] px-2 rounded-lg text-[11px] font-bold border',
                          off.status === 'Active'
                            ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
                        )}
                        title={off.status === 'Active' ? 'Disable Offer' : 'Activate Offer'}
                      >
                        <Power className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section 6 PRD: CREATE / EDIT OFFER MODAL */}
      {isCreateModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      {editingOffer ? 'Edit Promotion Offer' : 'Configure Promotion & Coupon'}
                    </span>
                    <span className="text-xs font-semibold text-soft">Head Office Authority</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {editingOffer ? editingOffer.name : 'Define Special Promotion Rule'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="p-6 space-y-5">
                {/* Basic Information */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    1. Offer Identity &amp; Voucher Code
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-soft font-bold block mb-1">Offer Display Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Summer Keratin Revival"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Promo / Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., SUMMER20"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-mono uppercase font-bold text-[#5A2EA6] outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Offer Type</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as PromotionOffer['type'])}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      >
                        <option value="Percentage Discount">Percentage Discount</option>
                        <option value="Flat Cash Voucher">Flat Cash Voucher</option>
                        <option value="Complimentary Upgrade">Complimentary Upgrade</option>
                        <option value="BOGO / Festive Bundle">BOGO / Festive Bundle</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Discount / Value Benefit *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 20% OFF (Min ₹3,500)"
                        value={formDiscount}
                        onChange={(e) => setFormDiscount(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">End Date *</label>
                      <input
                        type="date"
                        required
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-soft font-bold block mb-1">
                        Offer Terms &amp; Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Customer-facing terms, minimum booking thresholds, and exclusions..."
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Usage & Branches */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    2. Applicability &amp; Redemption Caps
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Total Redemption Cap (Uses)
                      </label>
                      <input
                        type="number"
                        required
                        value={formLimit}
                        onChange={(e) => setFormLimit(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Offer Initial State</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as PromotionOffer['status'])}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      >
                        <option value="Active">Active</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-1">
                  <strong className="text-[#5A2EA6] font-bold block">
                    Promotion Rule Summary:
                  </strong>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Coupon <strong>{formCode || 'PROMO'}</strong> grants{' '}
                    <strong>{formDiscount || 'Discount'}</strong> under <strong>{formType}</strong>{' '}
                    across {formBranches.length} branch(es) capped at {formLimit.toLocaleString()}{' '}
                    redemptions.
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-[36px] px-5 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    {editingOffer ? 'Update Promotion Offer' : 'Save & Publish Offer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Section 7 PRD: OFFER DETAILS MODAL */}
      {selectedOffer &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedOffer(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Promotion Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-[#5A2EA6] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {selectedOffer.code}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedOffer.status),
                      )}
                    >
                      {selectedOffer.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedOffer.name}
                  </h3>
                  <p className="text-xs text-muted">
                    {selectedOffer.discountBenefit} · Valid: {selectedOffer.startDate} to{' '}
                    {selectedOffer.endDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Performance Cards */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Total Redemptions
                    </span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {selectedOffer.currentUsage.toLocaleString()} /{' '}
                      {selectedOffer.usageLimit.toLocaleString()}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Attributed Revenue
                    </span>
                    <strong className="text-base font-serif font-bold text-emerald-700">
                      {selectedOffer.revenueGenerated}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Approval Governance
                    </span>
                    <strong className="text-xs font-bold text-blue-900 block mt-1">
                      {selectedOffer.approvalState}
                    </strong>
                  </div>
                </div>

                {/* Branch-wise Usage Breakdown */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Branch-Wise Redemption Breakdown
                  </span>
                  {selectedOffer.branchBreakdown.length > 0 ? (
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                          <tr>
                            <th className="p-2.5 pl-3">Salon Outlet</th>
                            <th className="p-2.5 text-center">Redemptions</th>
                            <th className="p-2.5 pr-3 text-right">Attributed Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {selectedOffer.branchBreakdown.map((b, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 pl-3 font-bold text-ink">{b.branchName}</td>
                              <td className="p-2.5 text-center font-bold text-slate-800">
                                {b.uses} uses
                              </td>
                              <td className="p-2.5 pr-3 text-right font-extrabold font-serif text-[#5A2EA6]">
                                {b.revenue}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 text-xs text-muted text-center font-medium">
                      No redemption records logged for this promotion yet.
                    </div>
                  )}
                </div>

                {/* Terms & Applicability */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <strong className="text-ink font-bold block mb-1">
                    Offer Terms &amp; Conditions
                  </strong>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {selectedOffer.description}
                  </p>
                  {selectedOffer.approvedBy && (
                    <span className="text-[10px] text-soft block pt-1 border-t border-slate-200/60">
                      Governance Sign-Off: <strong>{selectedOffer.approvedBy}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleOpenEdit(selectedOffer);
                      setSelectedOffer(null);
                    }}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3 text-[#5A2EA6]" />
                    <span>Edit Offer</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDuplicate(selectedOffer);
                      setSelectedOffer(null);
                    }}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplicate</span>
                  </Button>
                </div>

                <Button
                  onClick={() => setSelectedOffer(null)}
                  className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                >
                  Close Dossier
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
