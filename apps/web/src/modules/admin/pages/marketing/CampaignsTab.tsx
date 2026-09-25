import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
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
  Megaphone,
  Pause,
  Percent,
  Play,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface Campaign {
  id: string;
  name: string;
  type:
    | 'Seasonal & Festive'
    | 'Loyalty Multiplier'
    | 'Lapsed Re-engagement'
    | 'Service Launch'
    | 'Weekend Flash';
  description: string;
  startDate: string;
  endDate: string;
  targetAudience: string;
  targetAudienceCount: number;
  branches: string[];
  services: string[];
  packages?: string[];
  status: 'Draft' | 'Scheduled' | 'Active' | 'Completed' | 'Paused';
  performance: {
    reach: number;
    engagement: string;
    redemptions: number;
    revenueGenerated: string;
    roi: string;
  };
}

const mockCampaigns: Campaign[] = [
  {
    id: 'CMP-2026-01',
    name: 'Monsoon Hair Spa & Keratin Revival',
    type: 'Seasonal & Festive',
    description:
      'Promotional drive targeting frizz control, deep nourishing hair spa, and smoothing therapies for the monsoon humidity season.',
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    targetAudience: 'High-Spend Hair Care Clients',
    targetAudienceCount: 18400,
    branches: ['Indore Central Flagship', 'Vijay Nagar Boutique', 'Bhopal Arera Colony'],
    services: ['Keratin Hair Smoothing', 'Luxury Moroccan Oil Hair Spa', 'Global Hair Colouring'],
    packages: ['Monsoon Spa Bundle Pass'],
    status: 'Active',
    performance: {
      reach: 18400,
      engagement: '24.2%',
      redemptions: 1420,
      revenueGenerated: '₹9,20,000',
      roi: '5.2x',
    },
  },
  {
    id: 'CMP-2026-02',
    name: 'Bridal Glow & Skin Pre-Booking',
    type: 'Service Launch',
    description:
      'Advance consultation drive offering complimentary trial makeup and 20% off aesthetic facial packages.',
    startDate: '10 Aug 2026',
    endDate: '15 Sep 2026',
    targetAudience: 'Prospective Brides & Event Bookings',
    targetAudienceCount: 12000,
    branches: [
      'Indore Central Flagship',
      'Vijay Nagar Boutique',
      'Bhopal Arera Colony',
      'Ujjain Mahakal Road',
      'Gwalior City Centre',
    ],
    services: ['O3+ Seaweed Brightening Facial', 'Bridal Luxury Makeover', 'Hydra-Infusion Glow'],
    packages: ['Royal Bridal Radiance Package'],
    status: 'Active',
    performance: {
      reach: 12000,
      engagement: '31.5%',
      redemptions: 940,
      revenueGenerated: '₹8,50,000',
      roi: '6.1x',
    },
  },
  {
    id: 'CMP-2026-03',
    name: 'VIP Platinum Double Points Blitz',
    type: 'Loyalty Multiplier',
    description:
      '2x loyalty points credit on all retail product purchases and hair colour appointments over ₹3,000.',
    startDate: '12 Aug 2026',
    endDate: '25 Aug 2026',
    targetAudience: 'Platinum & Gold Tier Members',
    targetAudienceCount: 8200,
    branches: ['All Salon Branches (5)'],
    services: ['All Chemical & Colour Services', 'Retail Products'],
    status: 'Active',
    performance: {
      reach: 8200,
      engagement: '44.8%',
      redemptions: 680,
      revenueGenerated: '₹4,10,000',
      roi: '4.4x',
    },
  },
  {
    id: 'CMP-2026-04',
    name: 'We Miss You! Lapsed Client Comeback',
    type: 'Lapsed Re-engagement',
    description:
      'Personalized revival offer offering a flat ₹500 welcome-back credit on visits above ₹1,500.',
    startDate: '20 Aug 2026',
    endDate: '10 Sep 2026',
    targetAudience: 'Inactive Clients (>60 Days)',
    targetAudienceCount: 6500,
    branches: ['Indore Central Flagship', 'Vijay Nagar Boutique'],
    services: ['Haircut & Styling', 'Express Manicure / Pedicure'],
    status: 'Scheduled',
    performance: {
      reach: 6500,
      engagement: '0%',
      redemptions: 0,
      revenueGenerated: '₹0',
      roi: '0x',
    },
  },
  {
    id: 'CMP-2026-05',
    name: 'Summer Refresh Express Glow',
    type: 'Seasonal & Festive',
    description: 'Pre-monsoon de-tan facial and scalp soothing cooling mask bundle.',
    startDate: '01 Jun 2026',
    endDate: '30 Jun 2026',
    targetAudience: 'All Registered Clients',
    targetAudienceCount: 22000,
    branches: ['All Salon Branches (5)'],
    services: ['D-Tan Facial', 'Scalp Cooling Spa'],
    status: 'Completed',
    performance: {
      reach: 22000,
      engagement: '28.0%',
      redemptions: 1890,
      revenueGenerated: '₹11,40,000',
      roi: '5.8x',
    },
  },
];

export function CampaignsTab() {
  const [campaignsList, setCampaignsList] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Create / Edit
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<Campaign['type']>('Seasonal & Festive');
  const [formDesc, setFormDesc] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formAudience, setFormAudience] = useState('All Active Clients');
  const [formBranches, setFormBranches] = useState<string[]>([
    'Indore Central Flagship',
    'Vijay Nagar Boutique',
  ]);
  const [formServices, setFormServices] = useState<string[]>([
    'Global Hair Colouring',
    'Keratin Hair Smoothing',
  ]);
  const [formStatus, setFormStatus] = useState<Campaign['status']>('Active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isCreateModalOpen || selectedCampaign) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateModalOpen, selectedCampaign]);

  const getStatusBadge = (st: Campaign['status']) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Paused':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Draft':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormName('');
    setFormType('Seasonal & Festive');
    setFormDesc('');
    setFormStartDate('2026-08-20');
    setFormEndDate('2026-09-20');
    setFormAudience('All Active Clients');
    setFormBranches(['Indore Central Flagship', 'Vijay Nagar Boutique']);
    setFormServices(['Global Hair Colouring', 'Luxury Moroccan Oil Hair Spa']);
    setFormStatus('Active');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (cmp: Campaign) => {
    setEditingCampaign(cmp);
    setFormName(cmp.name);
    setFormType(cmp.type);
    setFormDesc(cmp.description);
    setFormStartDate('2026-08-01');
    setFormEndDate('2026-08-31');
    setFormAudience(cmp.targetAudience);
    setFormBranches(cmp.branches);
    setFormServices(cmp.services);
    setFormStatus(cmp.status);
    setIsCreateModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a valid campaign title.');
      return;
    }

    if (editingCampaign) {
      setCampaignsList((prev) =>
        prev.map((c) =>
          c.id === editingCampaign.id
            ? {
                ...c,
                name: formName,
                type: formType,
                description: formDesc,
                startDate: formStartDate,
                endDate: formEndDate,
                targetAudience: formAudience,
                branches: formBranches,
                services: formServices,
                status: formStatus,
              }
            : c,
        ),
      );
      showToast(`Campaign "${formName}" updated successfully.`);
    } else {
      const newId = `CMP-2026-0${campaignsList.length + 1}`;
      const newCmp: Campaign = {
        id: newId,
        name: formName,
        type: formType,
        description: formDesc || 'Head office promotional campaign drive.',
        startDate: formStartDate || '20 Aug 2026',
        endDate: formEndDate || '20 Sep 2026',
        targetAudience: formAudience,
        targetAudienceCount: 14500,
        branches: formBranches,
        services: formServices,
        status: formStatus,
        performance: {
          reach: 14500,
          engagement: '0.0%',
          redemptions: 0,
          revenueGenerated: '₹0',
          roi: '0x',
        },
      };
      setCampaignsList([newCmp, ...campaignsList]);
      showToast(`Campaign "${formName}" launched and saved.`);
    }
    setIsCreateModalOpen(false);
  };

  const handleToggleStatus = (cmp: Campaign) => {
    const nextStatus = cmp.status === 'Active' ? 'Paused' : 'Active';
    setCampaignsList((prev) =>
      prev.map((c) => (c.id === cmp.id ? { ...c, status: nextStatus } : c)),
    );
    showToast(`Campaign "${cmp.name}" is now ${nextStatus}.`);
  };

  const handleDuplicate = (cmp: Campaign) => {
    const dup: Campaign = {
      ...cmp,
      id: `CMP-2026-0${campaignsList.length + 1}`,
      name: `${cmp.name} (Copy)`,
      status: 'Draft',
      performance: {
        reach: 0,
        engagement: '0%',
        redemptions: 0,
        revenueGenerated: '₹0',
        roi: '0x',
      },
    };
    setCampaignsList([dup, ...campaignsList]);
    showToast(`Duplicated "${cmp.name}" as draft.`);
  };

  const filteredCampaigns = campaignsList.filter((c) => {
    if (selectedType !== 'all' && c.type !== selectedType) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (
      selectedBranch !== 'all' &&
      !c.branches.some((b) => b.includes(selectedBranch) || b.includes('All'))
    ) {
      return false;
    }
    if (searchTerm) {
      const match = `${c.name} ${c.type} ${c.targetAudience} ${c.description}`.toLowerCase();
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

      {/* 1. Header Filter Bar & Add Button */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaign name, type, target..."
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
            <option value="all">All Delivery Branches</option>
            <option value="Indore Central">Indore Central Flagship</option>
            <option value="Vijay Nagar">Vijay Nagar Boutique</option>
            <option value="Bhopal">Bhopal Arera Colony</option>
          </select>

          {/* Campaign Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Campaign Types</option>
            <option value="Seasonal & Festive">Seasonal &amp; Festive</option>
            <option value="Loyalty Multiplier">Loyalty Multiplier</option>
            <option value="Lapsed Re-engagement">Lapsed Re-engagement</option>
            <option value="Service Launch">Service Launch</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Campaign Statuses</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Paused">Paused</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting active campaigns ledger (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Campaigns</span>
          </Button>

          <Button
            onClick={handleOpenCreate}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Campaign</span>
          </Button>
        </div>
      </div>

      {/* 2. Section 2 PRD: CAMPAIGNS TABLE */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">Campaigns Master Register</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                {filteredCampaigns.length} Campaigns
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Head Office marketing calendar orchestrating multi-branch promotions, audiences, and
              conversions
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">Brand Governance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Campaign Name &amp; Type</th>
                <th className="p-3.5">Active Period (Dates)</th>
                <th className="p-3.5">Target Audience Segment</th>
                <th className="p-3.5">Applicable Branches</th>
                <th className="p-3.5 text-center">Reach &amp; Engagement</th>
                <th className="p-3.5 text-center">Redemptions</th>
                <th className="p-3.5 text-right">Attributed Revenue</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredCampaigns.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Name & Type */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{cmp.name}</strong>
                    <span className="text-[10px] font-bold text-[#5A2EA6]">{cmp.type}</span>
                  </td>

                  {/* Period */}
                  <td className="p-3.5 whitespace-nowrap text-slate-800">
                    <span className="block font-semibold">{cmp.startDate}</span>
                    <span className="text-[10px] text-muted">to {cmp.endDate}</span>
                  </td>

                  {/* Audience */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">{cmp.targetAudience}</span>
                    <span className="text-[10px] text-soft">
                      {cmp.targetAudienceCount.toLocaleString()} clients
                    </span>
                  </td>

                  {/* Branches */}
                  <td className="p-3.5 max-w-[180px]">
                    <span
                      className="text-xs text-slate-800 block truncate"
                      title={cmp.branches.join(', ')}
                    >
                      {cmp.branches.length === 1 && cmp.branches[0].includes('All')
                        ? 'All 5 Salon Outlets'
                        : cmp.branches.join(', ')}
                    </span>
                  </td>

                  {/* Reach & Engagement */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <strong className="font-bold text-ink block">
                      {cmp.performance.reach.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {cmp.performance.engagement} open rate
                    </span>
                  </td>

                  {/* Redemptions */}
                  <td className="p-3.5 text-center whitespace-nowrap font-extrabold text-ink bg-purple-50/20">
                    {cmp.performance.redemptions.toLocaleString()}
                  </td>

                  {/* Revenue */}
                  <td className="p-3.5 text-right font-extrabold font-serif text-[#5A2EA6] text-sm whitespace-nowrap">
                    {cmp.performance.revenueGenerated}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(cmp.status),
                      )}
                    >
                      {cmp.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCampaign(cmp)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Inspect</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(cmp)}
                        className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                        title="Edit Campaign"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleDuplicate(cmp)}
                        className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                        title="Duplicate Campaign"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>

                      {cmp.status === 'Active' ? (
                        <Button
                          variant="outline"
                          onClick={() => handleToggleStatus(cmp)}
                          className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-amber-200 text-amber-800 hover:bg-amber-50"
                          title="Pause Campaign"
                        >
                          <Pause className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleToggleStatus(cmp)}
                          className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          title="Activate Campaign"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section 3 PRD: CREATE / EDIT CAMPAIGN MODAL */}
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
                      {editingCampaign ? 'Edit Marketing Campaign' : 'Create New Campaign'}
                    </span>
                    <span className="text-xs font-semibold text-soft">Head Office Authority</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {editingCampaign ? editingCampaign.name : 'Define Campaign Specification'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCampaign} className="p-6 space-y-5">
                {/* Basic Information */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    1. Basic Information
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="text-soft font-bold block mb-1">Campaign Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Festive Bridal Hair Spa Blitz"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Campaign Classification *
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as Campaign['type'])}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      >
                        <option value="Seasonal & Festive">Seasonal &amp; Festive</option>
                        <option value="Loyalty Multiplier">Loyalty Multiplier</option>
                        <option value="Lapsed Re-engagement">Lapsed Re-engagement</option>
                        <option value="Service Launch">Service Launch</option>
                        <option value="Weekend Flash">Weekend Flash</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as Campaign['status'])}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      >
                        <option value="Active">Active</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Draft">Draft</option>
                      </select>
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
                        Campaign Narrative / Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Brief rationale and customer-facing promotional message..."
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Targeting & Scope */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    2. Audience &amp; Applicability
                  </span>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Target Client Segment
                      </label>
                      <select
                        value={formAudience}
                        onChange={(e) => setFormAudience(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      >
                        <option value="All Active Clients">
                          All Active Clients (48,500 Total)
                        </option>
                        <option value="VIP Platinum & Gold Members">
                          VIP Platinum &amp; Gold Tier (5,120 Clients)
                        </option>
                        <option value="High-Spend Hair Colour Clients">
                          Hair Colour Enthusiasts (8,400 Clients)
                        </option>
                        <option value="Inactive Clients (>60 Days)">
                          Lapsed Clients &gt;60 Days (6,500 Clients)
                        </option>
                        <option value="Prospective Brides & Event Bookings">
                          Bridal Inquiries &amp; Events (12,000 Clients)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1.5">
                        Participating Salon Outlets
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                        {[
                          'Indore Central Flagship',
                          'Vijay Nagar Boutique',
                          'Bhopal Arera Colony',
                          'Ujjain Mahakal Road',
                          'Gwalior City Centre',
                        ].map((b) => (
                          <label
                            key={b}
                            className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-purple-50"
                          >
                            <input
                              type="checkbox"
                              checked={formBranches.includes(b)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormBranches([...formBranches, b]);
                                } else {
                                  setFormBranches(formBranches.filter((x) => x !== b));
                                }
                              }}
                              className="accent-[#5A2EA6]"
                            />
                            <span className="truncate">{b}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Summary Callout */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-1">
                  <strong className="text-[#5A2EA6] font-bold block">
                    Campaign Summary Preview:
                  </strong>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Launching <strong>{formName || 'Untitled'}</strong> under{' '}
                    <strong>{formType}</strong>, targeting <strong>{formAudience}</strong> across{' '}
                    <strong>{formBranches.length} branch(es)</strong> from {formStartDate || 'TBD'}{' '}
                    to {formEndDate || 'TBD'}.
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
                    {editingCampaign
                      ? 'Update Campaign Specification'
                      : 'Save & Authorize Campaign'}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Section 4 PRD: CAMPAIGN DETAILS MODAL */}
      {selectedCampaign &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedCampaign(null)}
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
                      Campaign Dossier
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedCampaign.status),
                      )}
                    >
                      {selectedCampaign.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedCampaign.name}
                  </h3>
                  <p className="text-xs text-muted">
                    Type: {selectedCampaign.type} · Active: {selectedCampaign.startDate} to{' '}
                    {selectedCampaign.endDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Performance Cards */}
                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">Reach</span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {selectedCampaign.performance.reach.toLocaleString()}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Engagement
                    </span>
                    <strong className="text-base font-serif font-bold text-blue-800">
                      {selectedCampaign.performance.engagement}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Redemptions
                    </span>
                    <strong className="text-base font-serif font-bold text-emerald-700">
                      {selectedCampaign.performance.redemptions.toLocaleString()}
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Attributed Rev.
                    </span>
                    <strong className="text-base font-serif font-bold text-amber-800">
                      {selectedCampaign.performance.revenueGenerated}
                    </strong>
                  </div>
                </div>

                {/* Narrative & Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
                  <div>
                    <strong className="text-ink font-bold block mb-1">Campaign Narrative</strong>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {selectedCampaign.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-[11px]">
                    <div>
                      <span className="text-soft block font-bold">Target Audience:</span>
                      <span className="font-semibold text-ink">
                        {selectedCampaign.targetAudience} (
                        {selectedCampaign.targetAudienceCount.toLocaleString()} clients)
                      </span>
                    </div>
                    <div>
                      <span className="text-soft block font-bold">Campaign ROI Multiplier:</span>
                      <span className="font-bold text-emerald-700">
                        {selectedCampaign.performance.roi}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Applicable Branches & Services */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <strong className="text-[#5A2EA6] font-bold block mb-1.5">
                      Participating Branches
                    </strong>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.branches.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#5A2EA6] border border-purple-200"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <strong className="text-ink font-bold block mb-1.5">Promoted Services</strong>
                    <div className="flex flex-wrap gap-1">
                      {selectedCampaign.services.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800 border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleOpenEdit(selectedCampaign);
                      setSelectedCampaign(null);
                    }}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3 text-[#5A2EA6]" />
                    <span>Edit Details</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDuplicate(selectedCampaign);
                      setSelectedCampaign(null);
                    }}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Duplicate</span>
                  </Button>
                </div>

                <Button
                  onClick={() => setSelectedCampaign(null)}
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
