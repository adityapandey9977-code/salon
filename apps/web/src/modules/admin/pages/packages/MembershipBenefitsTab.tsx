import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  Download,
  Edit2,
  Filter,
  Gift,
  Layers,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { initialMasterMemberships } from './MembershipsTab';

export interface BenefitCatalogItem {
  id: string;
  benefitName: string;
  membershipName: string;
  membershipTier: string;
  type:
    | 'Percentage Discount'
    | 'Fixed Discount'
    | 'Complimentary Service'
    | 'Special Price'
    | 'Priority Access';
  applicableScope: string;
  value: string;
  usageLimit: string;
  status: 'Active' | 'Inactive';
}

export const initialBenefitCatalog: BenefitCatalogItem[] = [
  {
    id: 'BEN-01',
    benefitName: '20% All-Service Discount',
    membershipName: 'Royal Black VIP Circle',
    membershipTier: 'Royal Black Tier',
    type: 'Percentage Discount',
    applicableScope: 'All Hair, Skin & Spa Treatments',
    value: '20% Off',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
  {
    id: 'BEN-02',
    benefitName: '15% Luxury Retail Concession',
    membershipName: 'Royal Black VIP Circle',
    membershipTier: 'Royal Black Tier',
    type: 'Percentage Discount',
    applicableScope: 'All Retail Care Brands',
    value: '15% Off',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
  {
    id: 'BEN-03',
    benefitName: '2 Complimentary Spa Rituals',
    membershipName: 'Royal Black VIP Circle',
    membershipTier: 'Royal Black Tier',
    type: 'Complimentary Service',
    applicableScope: 'Royal Balinese Aromatherapy',
    value: '2 Sessions (₹8,400 Val)',
    usageLimit: '2 Per Year',
    status: 'Active',
  },
  {
    id: 'BEN-04',
    benefitName: 'VIP Suite Priority Reservation',
    membershipName: 'Royal Black VIP Circle',
    membershipTier: 'Royal Black Tier',
    type: 'Priority Access',
    applicableScope: 'Private Suites & Master Barbers',
    value: 'Instant Access',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
  {
    id: 'BEN-05',
    benefitName: '15% All-Service Discount',
    membershipName: 'Atelier Platinum Privilege',
    membershipTier: 'Platinum Tier',
    type: 'Percentage Discount',
    applicableScope: 'All Services',
    value: '15% Off',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
  {
    id: 'BEN-06',
    benefitName: '10% Retail Product Discount',
    membershipName: 'Atelier Platinum Privilege',
    membershipTier: 'Platinum Tier',
    type: 'Percentage Discount',
    applicableScope: 'All Retail Brands',
    value: '10% Off',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
  {
    id: 'BEN-07',
    benefitName: '1 Birthday Complimentary Facial',
    membershipName: 'Atelier Platinum Privilege',
    membershipTier: 'Platinum Tier',
    type: 'Complimentary Service',
    applicableScope: '7-Step Hydra-Facial',
    value: '1 Session (₹4,500 Val)',
    usageLimit: 'Birthday Month',
    status: 'Active',
  },
  {
    id: 'BEN-08',
    benefitName: '10% All-Service Discount',
    membershipName: 'Atelier Gold Elite',
    membershipTier: 'Gold Tier',
    type: 'Percentage Discount',
    applicableScope: 'All Services',
    value: '10% Off',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
  {
    id: 'BEN-09',
    benefitName: 'Complimentary Hair Blowout',
    membershipName: 'Atelier Gold Elite',
    membershipTier: 'Gold Tier',
    type: 'Complimentary Service',
    applicableScope: 'Blowdry & Signature Styling',
    value: '1 Session / Qtr',
    usageLimit: '4 Per Year',
    status: 'Active',
  },
  {
    id: 'BEN-10',
    benefitName: '5% Service Concession',
    membershipName: 'Silver Starter Pass',
    membershipTier: 'Silver Tier',
    type: 'Percentage Discount',
    applicableScope: 'All Services',
    value: '5% Off',
    usageLimit: 'Unlimited',
    status: 'Active',
  },
];

export function MembershipBenefitsTab() {
  const { toast } = useToast();
  const [benefits, setBenefits] = useState<BenefitCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  React.useEffect(() => {
    async function loadBenefits() {
      try {
        setLoading(true);
        const { membershipsApi } = await import('@/shared/api/memberships.api');
        const liveBenefits = await membershipsApi.listBenefits();
        if (liveBenefits && liveBenefits.length > 0) {
          const mapped: BenefitCatalogItem[] = liveBenefits.map((b, idx) => ({
            id: b.id || `BEN-${idx + 1}`,
            benefitName: b.perkName || 'VIP Discount Privilege',
            membershipName: b.tierName || 'Standard Plan',
            membershipTier: b.tierName?.includes('Royal')
              ? 'Royal Black Tier'
              : b.tierName?.includes('Platinum')
              ? 'Platinum Tier'
              : 'Gold Tier',
            type: 'Percentage Discount',
            applicableScope: b.applicableScope || 'All Services',
            value: b.discountValue || '15% Off',
            usageLimit: b.usageLimit || 'Unlimited',
            status: b.status === 'INACTIVE' ? 'Inactive' : 'Active',
          }));
          setBenefits(mapped);
        } else {
          setBenefits([]);
        }
      } catch (err) {
        console.error('Failed to load membership benefits from API', err);
      } finally {
        setLoading(false);
      }
    }
    loadBenefits();
  }, []);



  const filteredBenefits = useMemo(() => {
    return benefits.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.benefitName.toLowerCase().includes(q) ||
        b.membershipName.toLowerCase().includes(q) ||
        b.applicableScope.toLowerCase().includes(q);

      const matchesTier = tierFilter === 'All' || b.membershipTier === tierFilter;
      const matchesType = typeFilter === 'All' || b.type === typeFilter;

      return matchesSearch && matchesTier && matchesType;
    });
  }, [benefits, searchQuery, tierFilter, typeFilter]);

  const handleToggleBenefitStatus = (id: string) => {
    setBenefits((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b,
      ),
    );
    toast('Benefit status updated.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Membership Privilege &amp; Benefit Rules Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {benefits.length} Privilege Rules
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Audit and configure tiered discounts, complimentary treatments, retail perks, and
            priority booking rules.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast(`Exported ${filteredBenefits.length} benefit rules to CSV.`)}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Visual Tier Privileges Hierarchy Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {initialMasterMemberships.map((mem) => (
          <div
            key={mem.id}
            className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center pb-2 border-b border-purple-50">
              <div>
                <strong className="text-ink text-xs block">{mem.name}</strong>
                <span className="text-[10px] text-[#5A2EA6] font-bold">{mem.tier}</span>
              </div>
              <span className="font-serif font-bold text-ink text-xs">
                ₹{mem.price.toLocaleString('en-IN')}/yr
              </span>
            </div>

            <div className="space-y-1.5">
              {mem.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-soft">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A2EA6]" />
                  <span className="font-medium text-ink">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by benefit name, tier, service scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Tier Filter */}
          <div className="flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Silver Tier">Silver Tier</option>
              <option value="Gold Tier">Gold Tier</option>
              <option value="Platinum Tier">Platinum Tier</option>
              <option value="Royal Black Tier">Royal Black Tier</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Benefit Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Percentage Discount">Percentage Discount</option>
              <option value="Fixed Discount">Fixed Discount</option>
              <option value="Complimentary Service">Complimentary Service</option>
              <option value="Special Price">Special Price</option>
              <option value="Priority Access">Priority Access</option>
            </select>
          </div>
        </div>
      </div>

      {/* Benefit Rules Master Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Master Benefit Rules &amp; Application Scope
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Concession percentages, complimentary limits, and usage caps
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredBenefits.length} Rules Active
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Benefit Name & Rule',
                  'Membership Tier',
                  'Benefit Type',
                  'Applicable Service / Product Scope',
                  'Discount / Privilege Value',
                  'Usage Limit',
                  'Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 7 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredBenefits.map((b) => (
                <tr key={b.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  <td className="p-3.5 pl-5">
                    <strong className="text-ink text-xs block">{b.benefitName}</strong>
                    <span className="text-[10px] text-muted">{b.id}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-[#5A2EA6] text-[10px] font-bold border border-purple-100">
                      {b.membershipTier}
                    </span>
                  </td>

                  <td className="p-3.5 text-soft">{b.type}</td>

                  <td className="p-3.5 text-ink font-medium max-w-xs truncate">
                    {b.applicableScope}
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      {b.value}
                    </span>
                  </td>

                  <td className="p-3.5 text-soft font-semibold">{b.usageLimit}</td>

                  <td className="p-3.5">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        b.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3.5 pr-5 text-right">
                    <button
                      onClick={() => handleToggleBenefitStatus(b.id)}
                      className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0"
                    >
                      <span>{b.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MembershipBenefitsTab;
