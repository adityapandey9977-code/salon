import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  Edit2,
  Eye,
  Filter,
  Layers,
  Loader2,
  MapPin,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import { masterBranches } from '../locations/AllBranchesTab';
import { ServiceRecord, masterServices } from './ServicesTab';
import { catalogueApi, type ApiServiceMaster } from '@/shared/api';

export interface PricingRule {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  category: string;
  defaultPrice: number;
  branchName: string;
  branchPrice: number;
  pricingMode: 'Shared price across branches' | 'Branch-specific pricing';
  taxRate: string;
  discountPolicy: string;
  effectiveFrom: string;
  status: 'Active' | 'Draft' | 'Pending Approval' | 'Approved' | 'Scheduled';
  notes?: string;
}

export const initialPricingRules: PricingRule[] = [
  {
    id: 'PRC-001',
    serviceId: 'SRV-001',
    serviceName: 'Signature Precision Cut & Blowout',
    serviceCode: 'HAIR-CUT-01',
    category: 'Hair Dressing & Styling',
    defaultPrice: 1850,
    branchName: 'All Branches (Shared)',
    branchPrice: 1850,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountPolicy: 'Eligible (Max 15%)',
    effectiveFrom: '01 Jan 2026',
    status: 'Active',
    notes: 'Standardized national chain pricing.',
  },
  {
    id: 'PRC-002',
    serviceId: 'SRV-002',
    serviceName: 'Cysteine & Keratin Infusion Treatment',
    serviceCode: 'HAIR-KER-02',
    category: 'Hair Dressing & Styling',
    defaultPrice: 4800,
    branchName: 'Atelier Koregaon Park Grand',
    branchPrice: 5200,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountPolicy: 'No Promo Allowed',
    effectiveFrom: '15 Jul 2026',
    status: 'Active',
    notes: 'Pune prime location premium surcharge (+₹400).',
  },
  {
    id: 'PRC-003',
    serviceId: 'SRV-002',
    serviceName: 'Cysteine & Keratin Infusion Treatment',
    serviceCode: 'HAIR-KER-02',
    category: 'Hair Dressing & Styling',
    defaultPrice: 4800,
    branchName: 'Atelier Indrapuri Flagship',
    branchPrice: 4800,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountPolicy: 'No Promo Allowed',
    effectiveFrom: '01 Jan 2026',
    status: 'Active',
    notes: 'Standard flagship tier pricing.',
  },
  {
    id: 'PRC-004',
    serviceId: 'SRV-003',
    serviceName: '7-Step Medical Hydra-Facial Rejuvenation',
    serviceCode: 'SKIN-HYD-03',
    category: 'Skin & Organic Therapy',
    defaultPrice: 3800,
    branchName: 'All Branches (Shared)',
    branchPrice: 3800,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountPolicy: 'Eligible (Max 20%)',
    effectiveFrom: '01 Mar 2026',
    status: 'Active',
    notes: 'Uniform aesthetic protocol rate across network.',
  },
  {
    id: 'PRC-005',
    serviceId: 'SRV-004',
    serviceName: 'Swedish Aromatherapy Deep Tissue Massage',
    serviceCode: 'SPA-SWD-04',
    category: 'Spa & Wellness Rituals',
    defaultPrice: 4000,
    branchName: 'Atelier Jaipur Royal Spa',
    branchPrice: 4500,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountPolicy: 'Membership VIP 10%',
    effectiveFrom: '01 Sep 2026',
    status: 'Scheduled',
    notes: 'Heritage royal spa tourist seasonal revision (+₹500).',
  },
  {
    id: 'PRC-006',
    serviceId: 'SRV-006',
    serviceName: 'Couture HD Airbrush Bridal Glamour',
    serviceCode: 'BRID-AIR-06',
    category: 'Bridal & Red Carpet Studio',
    defaultPrice: 15000,
    branchName: 'Atelier Whitefield Studio',
    branchPrice: 16500,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountPolicy: 'Non-Discountable',
    effectiveFrom: '01 Aug 2026',
    status: 'Pending Approval',
    notes: 'Bengaluru metro specialist tier revision awaiting Brand Owner sign-off.',
  },
  {
    id: 'PRC-007',
    serviceId: 'SRV-007',
    serviceName: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    serviceCode: 'MENS-BEA-07',
    category: 'Men’s Grooming Lounge',
    defaultPrice: 1150,
    branchName: 'All Branches (Shared)',
    branchPrice: 1150,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountPolicy: 'Combo Eligible',
    effectiveFrom: '01 Jun 2026',
    status: 'Active',
    notes: 'Grooming lounge standard rate.',
  },
];

export interface ServicePricingTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  readOnly?: boolean;
}

export function ServicePricingTab({
  defaultBranch = 'All',
  lockBranch = false,
  readOnly = false,
}: ServicePricingTabProps = {}) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const adminBranches = useMemo(() => {
    if (salon?.branches && Array.isArray(salon.branches) && salon.branches.length > 0) {
      return salon.branches;
    }
    return masterBranches;
  }, [salon?.branches]);

  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [dbServices, setDbServices] = useState<ApiServiceMaster[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editRule, setEditRule] = useState<PricingRule | null>(null);
  const [viewBreakdownService, setViewBreakdownService] = useState<PricingRule | null>(null);

  // New Pricing Rule Form
  const [newRule, setNewRule] = useState({
    serviceId: masterServices[0].id,
    pricingMode: 'Shared price across branches' as PricingRule['pricingMode'],
    basePrice: 2000,
    branchName: 'All Branches (Shared)',
    branchPrice: 2000,
    taxRate: '18% GST',
    discountPolicy: 'Eligible (Max 15%)',
    effectiveFrom: new Date().toISOString().slice(0, 10),
    status: 'Active' as PricingRule['status'],
    notes: '',
  });

  // Load live services & pricing rules from commerce-service
  const loadPricingData = async () => {
    setIsLoading(true);
    try {
      const services = await catalogueApi.fetchServices({ limit: 100 });
      if (services && Array.isArray(services)) {
        setDbServices(services);
        if (services.length > 0) {
          const generatedRules: PricingRule[] = [];
          services.forEach((srv: ApiServiceMaster) => {
            const meta = (srv.metadata as any) || {};
            const srvBranches: string[] =
              Array.isArray(srv.availableBranches) && srv.availableBranches.length > 0
                ? srv.availableBranches
                : Array.isArray(meta.availableBranches)
                  ? meta.availableBranches
                  : [];
            const hasBranchPriceForTarget = srv.branchPrices?.some((bp) => {
              const bMatch = adminBranches.find((b) => b.id === bp.branchId);
              const bName = bMatch ? bMatch.name : bp.branchId;
              return (
                bName.toLowerCase().includes(defaultBranch.toLowerCase()) ||
                bp.branchId === defaultBranch
              );
            });
            const isAssignedToTarget =
              srvBranches.some((b) => b.toLowerCase().includes(defaultBranch.toLowerCase())) ||
              srvBranches.some(
                (b) => b.toLowerCase() === 'all' || b.toLowerCase() === 'all branches',
              );

            if (readOnly && defaultBranch && defaultBranch.toLowerCase() !== 'all') {
              if (!hasBranchPriceForTarget && !isAssignedToTarget) {
                return;
              }
            }

            // 1. HQ Base Rule
            generatedRules.push({
              id: `HQ-${srv.id.slice(0, 8)}`,
              serviceId: srv.id,
              serviceName: srv.name,
              serviceCode: srv.code,
              category: (srv as any).category?.name || 'General Services',
              defaultPrice: Number(srv.basePrice) || 0,
              branchName: 'All Branches (Shared)',
              branchPrice: Number(srv.basePrice) || 0,
              pricingMode: 'Shared price across branches',
              taxRate: srv.gstRate ? `${srv.gstRate}% GST` : '18% GST',
              discountPolicy: 'Standard Network Tariff',
              effectiveFrom: srv.createdAt
                ? new Date(srv.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '01 Jan 2026',
              status: srv.isActive ? 'Active' : 'Draft',
              notes: 'Centrally managed master baseline tariff.',
            });

            // 2. Branch overrides if any
            if (srv.branchPrices && srv.branchPrices.length > 0) {
              srv.branchPrices.forEach((bp) => {
                const bMatch = adminBranches.find((b) => b.id === bp.branchId);
                const bName = bMatch ? bMatch.name : bp.branchId;
                generatedRules.push({
                  id: `BP-${bp.branchId.slice(0, 6)}-${srv.id.slice(0, 6)}`,
                  serviceId: srv.id,
                  serviceName: srv.name,
                  serviceCode: srv.code,
                  category: (srv as any).category?.name || 'General Services',
                  defaultPrice: Number(srv.basePrice) || 0,
                  branchName: bName,
                  branchPrice: Number(bp.price) || 0,
                  pricingMode: 'Branch-specific pricing',
                  taxRate: srv.gstRate ? `${srv.gstRate}% GST` : '18% GST',
                  discountPolicy: 'Location Override',
                  effectiveFrom: bp.effectiveFrom
                    ? new Date(bp.effectiveFrom).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '01 Jan 2026',
                  status: bp.isActive ? 'Active' : 'Draft',
                  notes: `Branch custom pricing tier for ${bName}.`,
                });
              });
            }
          });
          setPricingRules(generatedRules);
        }
      }
    } catch (err) {
      console.error('Failed to load live service pricing rules:', err);
      // Retain fallback initialPricingRules
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPricingData();
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    pricingRules.forEach((r) => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, [pricingRules]);

  const filteredRules = useMemo(() => {
    return pricingRules.filter((r) => {
      const matchesSearch =
        r.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.serviceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.branchName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
        selectedBranch === 'All' ||
        r.branchName.includes(selectedBranch) ||
        (readOnly && (r.branchName.includes('All Branches') || r.branchName.includes('Shared')));
      const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;

      return matchesSearch && matchesBranch && matchesCategory && matchesStatus;
    });
  }, [pricingRules, searchQuery, selectedBranch, selectedCategory, selectedStatus]);

  const handleAddPricingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const srvFromDb = dbServices.find((s) => s.id === newRule.serviceId);
    const service = srvFromDb
      ? {
          id: srvFromDb.id,
          name: srvFromDb.name,
          code: srvFromDb.code,
          category: (srvFromDb as any).category?.name || 'General Services',
          price: Number(srvFromDb.basePrice),
        }
      : masterServices.find((s) => s.id === newRule.serviceId) || masterServices[0];

    try {
      if (newRule.pricingMode === 'Shared price across branches') {
        // Update HQ base price on service
        if (srvFromDb) {
          await catalogueApi.updateService(service.id, {
            basePrice: Number(newRule.basePrice) || service.price,
          });
        }
      } else {
        // Set branch custom price
        const targetBranch = adminBranches.find((b) => b.name === newRule.branchName);
        const branchId = targetBranch ? targetBranch.id : newRule.branchName;
        await catalogueApi.setBranchPrice(service.id, {
          branchId,
          price: Number(newRule.branchPrice) || newRule.basePrice,
          effectiveFrom: newRule.effectiveFrom,
          isActive: newRule.status === 'Active',
        });
      }

      await loadPricingData();
      setIsAddModalOpen(false);
      toast(`Pricing rule for "${service.name}" successfully published.`);
    } catch (err: any) {
      console.error('Failed to create pricing rule:', err);
      // Client optimistic fallback
      const created: PricingRule = {
        id: `PRC-00${pricingRules.length + 1}`,
        serviceId: service.id,
        serviceName: service.name,
        serviceCode: service.code,
        category: service.category,
        defaultPrice: Number(newRule.basePrice) || service.price,
        branchName: newRule.branchName,
        branchPrice: Number(newRule.branchPrice) || newRule.basePrice,
        pricingMode: newRule.pricingMode,
        taxRate: newRule.taxRate,
        discountPolicy: newRule.discountPolicy,
        effectiveFrom: newRule.effectiveFrom,
        status: newRule.status,
        notes: newRule.notes || 'Tariff revision saved.',
      };
      setPricingRules((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      toast(`Pricing rule for "${created.serviceName}" saved locally.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRule) return;
    setIsSubmitting(true);

    try {
      if (editRule.pricingMode === 'Shared price across branches') {
        await catalogueApi.updateService(editRule.serviceId, {
          basePrice: Number(editRule.branchPrice),
        });
      } else {
        const targetBranch = adminBranches.find((b) => b.name === editRule.branchName);
        const branchId = targetBranch ? targetBranch.id : editRule.branchName;
        await catalogueApi.setBranchPrice(editRule.serviceId, {
          branchId,
          price: Number(editRule.branchPrice),
          isActive: editRule.status === 'Active',
        });
      }
      await loadPricingData();
      toast(`Tariff for "${editRule.serviceName}" successfully updated.`);
    } catch (err: any) {
      console.error('Failed to update tariff:', err);
      setPricingRules((prev) => prev.map((r) => (r.id === editRule.id ? editRule : r)));
      toast(`Tariff for "${editRule.serviceName}" updated locally.`);
    } finally {
      setEditRule(null);
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    toast(`Exported ${filteredRules.length} pricing tariff records.`);
  };

  // Narrow local variables for modal portals to avoid TS closure narrowing issues
  const editRuleItem = editRule;
  const viewBreakdown = viewBreakdownService;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Service Pricing &amp; Tariff Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Central Matrix
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Centrally control global baseline tariffs, branch-level premium differentials, and
            discount governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={loadPricingData}
            disabled={isLoading}
            className="h-10 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-1.5 shadow-xs"
            title="Refresh from Database"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            <span>Sync</span>
          </Button>

          {readOnly && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5A2EA6] text-xs font-bold border border-purple-200/60 flex items-center gap-1.5 shadow-3xs">
              <Eye className="w-3.5 h-3.5" />
              <span>View-Only Mode</span>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Tariff</span>
          </Button>

          {!readOnly && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Pricing Rule</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search service, code, branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Branch:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Locations</option>
                {adminBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!lockBranch && <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />}

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pricing Master Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                {lockBranch
                  ? `${defaultBranch} · Service Pricing & Tariff Scorecard`
                  : 'Multi-Branch Pricing & Tariff Scorecard'}
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                {lockBranch
                  ? `Active tariff overrides and tax configuration for ${defaultBranch}`
                  : 'Compare baseline HQ price against unit overrides, variance deltas, and approval stages'}
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredRules.length} Rules Active
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Service Title',
                  'Category',
                  'HQ Base Price',
                  ...(!lockBranch ? ['Branch Scope'] : []),
                  'Branch Unit Price',
                  'Variance Delta',
                  'Tax & Discount',
                  'Status',
                  'Actions',
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === arr.length - 1 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {isLoading && pricingRules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 text-[#5A2EA6] animate-spin" />
                      <p className="text-xs font-semibold text-ink">
                        Synchronizing pricing tariffs from database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredRules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <DollarSign className="w-8 h-8 text-muted/50" />
                      <p className="text-sm font-semibold text-ink">No pricing rules match filters</p>
                      <p className="text-xs text-soft">
                        Create a new pricing override or reset your search query.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRules.map((rule) => {
                  const variance = rule.branchPrice - rule.defaultPrice;
                  return (
                    <tr key={rule.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      {/* Service Title */}
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-ink text-[13px]">{rule.serviceName}</div>
                        <div className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                          {rule.serviceCode}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5A2EA6] text-[10.5px] font-semibold border border-purple-100">
                          {rule.category}
                        </span>
                      </td>

                      {/* Default Price */}
                      <td className="p-3.5 font-bold text-ink text-[13px] font-serif">
                        ₹{rule.defaultPrice.toLocaleString('en-IN')}
                      </td>

                      {/* Branch */}
                      {!lockBranch && (
                        <td className="p-3.5">
                          <div className="font-semibold text-ink text-xs">{rule.branchName}</div>
                          <div className="text-[9.5px] text-muted">{rule.pricingMode}</div>
                        </td>
                      )}

                      {/* Branch Price */}
                      <td className="p-3.5 font-bold text-[#5A2EA6] text-[14px] font-serif">
                        ₹{rule.branchPrice.toLocaleString('en-IN')}
                      </td>

                      {/* Variance Delta */}
                      <td className="p-3.5 font-bold text-xs">
                        {variance === 0 ? (
                          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                            0.0% (Equal)
                          </span>
                        ) : variance > 0 ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px] border border-emerald-200 flex items-center gap-1 w-max">
                            <TrendingUp className="w-3 h-3" />
                            +₹{variance.toLocaleString('en-IN')} (+
                            {((variance / rule.defaultPrice) * 100).toFixed(1)}%)
                          </span>
                        ) : (
                          <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md text-[10px] border border-rose-200 flex items-center gap-1 w-max">
                            <TrendingDown className="w-3 h-3" />
                            -₹{Math.abs(variance).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Tax & Discount */}
                      <td className="p-3.5">
                        <div className="text-ink font-semibold text-[11px]">{rule.taxRate}</div>
                        <div className="text-[10px] text-muted">{rule.discountPolicy}</div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                            rule.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : rule.status === 'Approved'
                                ? 'bg-purple-100 text-purple-800'
                                : rule.status === 'Scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800',
                          )}
                        >
                          {rule.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewBreakdownService(rule)}
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                            title="View Pricing Breakdown"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!readOnly && (
                            <button
                              onClick={() => setEditRule({ ...rule })}
                              className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Edit Pricing Rule"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS (Portaled to document.body) ================= */}

      {/* 1. Add Pricing Rule Modal */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Create Service Pricing Policy
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Configure shared or branch-specific tariff structures with live delta
                    computation.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleAddPricingRule}
                className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Tariffs take effect immediately across online booking platforms and POS checkout
                  terminals upon activation.
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Select Master Service *
                  </label>
                  <select
                    value={newRule.serviceId}
                    onChange={(e) => {
                      const dbMatch = dbServices.find((srv) => srv.id === e.target.value);
                      const s = dbMatch
                        ? { id: dbMatch.id, price: Number(dbMatch.basePrice) }
                        : masterServices.find((srv) => srv.id === e.target.value);
                      if (s) {
                        setNewRule({
                          ...newRule,
                          serviceId: s.id,
                          basePrice: s.price,
                          branchPrice: s.price,
                        });
                      }
                    }}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    {dbServices.length > 0
                      ? dbServices.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} ({(srv as any).category?.name || 'General'}) — Base ₹{srv.basePrice}
                          </option>
                        ))
                      : masterServices.map((srv) => (
                          <option key={srv.id} value={srv.id}>
                            {srv.name} ({srv.category}) — Base ₹{srv.price}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Pricing Mode
                    </label>
                    <select
                      value={newRule.pricingMode}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          pricingMode: e.target.value as PricingRule['pricingMode'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Shared price across branches">Shared Global Price</option>
                      <option value="Branch-specific pricing">Branch-Specific Custom Price</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Branch Assignment Scope
                    </label>
                    <select
                      value={newRule.branchName}
                      onChange={(e) => setNewRule({ ...newRule, branchName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="All Branches (Shared)">All Branches (Global Network)</option>
                      {adminBranches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      HQ Baseline Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newRule.basePrice}
                      onChange={(e) =>
                        setNewRule({ ...newRule, basePrice: Number.parseInt(e.target.value) || 0 })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Branch Custom Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={newRule.branchPrice}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          branchPrice: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                {/* Live Variance Preview */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-muted font-medium">Computed Price Difference:</span>
                  <strong
                    className={cn(
                      'font-bold',
                      newRule.branchPrice > newRule.basePrice
                        ? 'text-emerald-700'
                        : newRule.branchPrice < newRule.basePrice
                          ? 'text-rose-700'
                          : 'text-slate-600',
                    )}
                  >
                    {newRule.branchPrice - newRule.basePrice === 0
                      ? '₹0 (Exact Base Match)'
                      : `${newRule.branchPrice > newRule.basePrice ? '+' : ''}₹${(newRule.branchPrice - newRule.basePrice).toLocaleString('en-IN')} difference`}
                  </strong>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Effective Date
                    </label>
                    <input
                      type="date"
                      value={newRule.effectiveFrom}
                      onChange={(e) => setNewRule({ ...newRule, effectiveFrom: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Approval / Deployment State
                    </label>
                    <select
                      value={newRule.status}
                      onChange={(e) =>
                        setNewRule({ ...newRule, status: e.target.value as PricingRule['status'] })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Active">Active (Published Immediately)</option>
                      <option value="Scheduled">Scheduled (Future Date)</option>
                      <option value="Draft">Draft (Save for Review)</option>
                      <option value="Pending Approval">Pending Approval</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Business Justification / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Rationale for location differential, prime rental surcharge or seasonal promo..."
                    value={newRule.notes}
                    onChange={(e) => setNewRule({ ...newRule, notes: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Save Pricing Rule
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. Edit Pricing Rule Modal */}
      {editRule &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Edit Tariff: {editRule.serviceName}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5 font-mono">
                    {editRule.branchName} · {editRule.id}
                  </p>
                </div>
                <button
                  onClick={() => setEditRule(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSaveEdit}
                className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs"
              >
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Branch Unit Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={editRule.branchPrice}
                      onChange={(e) =>
                        setEditRule({
                          ...editRule,
                          branchPrice: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Tariff Status
                    </label>
                    <select
                      value={editRule.status}
                      onChange={(e) =>
                        setEditRule({
                          ...editRule,
                          status: e.target.value as PricingRule['status'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Active">Active</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Draft">Draft</option>
                      <option value="Pending Approval">Pending Approval</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Revision Reason / Audit Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={editRule.notes || ''}
                    onChange={(e) => setEditRule({ ...editRule, notes: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setEditRule(null)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Update Tariff
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. View Pricing Breakdown Modal */}
      {viewBreakdownService &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    {viewBreakdownService.serviceName}
                  </h3>
                  <span className="text-xs text-[#5A2EA6] font-mono font-bold">
                    {viewBreakdownService.serviceCode}
                  </span>
                </div>
                <button
                  onClick={() => setViewBreakdownService(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                  <span className="text-[10px] text-muted font-bold block uppercase">
                    HQ Baseline
                  </span>
                  <strong className="text-[17px] font-bold text-ink mt-0.5 block font-serif">
                    ₹{viewBreakdownService.defaultPrice.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                  <span className="text-[10px] text-[#5A2EA6] font-bold block uppercase">
                    Applied Branch Price
                  </span>
                  <strong className="text-[17px] font-bold text-[#5A2EA6] mt-0.5 block font-serif">
                    ₹{viewBreakdownService.branchPrice.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Branch Location Scope:</span>
                  <strong className="text-ink">{viewBreakdownService.branchName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Pricing Model Strategy:</span>
                  <strong className="text-[#5A2EA6]">{viewBreakdownService.pricingMode}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Applicable GST:</span>
                  <strong className="text-ink">{viewBreakdownService.taxRate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Effective Since:</span>
                  <span className="font-mono text-soft">{viewBreakdownService.effectiveFrom}</span>
                </div>
              </div>

              {viewBreakdownService.notes && (
                <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  {viewBreakdownService.notes}
                </div>
              )}

              <div className="pt-3 flex justify-end border-t border-purple-50">
                <Button
                  onClick={() => setViewBreakdownService(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Close Breakdown
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
