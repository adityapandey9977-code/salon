import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Archive,
  Building2,
  CheckCircle2,
  Copy,
  Crown,
  Download,
  Edit2,
  Eye,
  Filter,
  Gift,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';
import { CreateMembershipModal, type FullMembershipRecord } from './CreateMembershipModal';
import { MembershipDetailsDrawer } from './MembershipDetailsDrawer';

export const initialMasterMemberships: FullMembershipRecord[] = [
  {
    id: 'MEM-001',
    name: 'Royal Black VIP Circle',
    code: 'MEM-ROYAL-01',
    tier: 'Royal Black Tier',
    description:
      'Ultra-luxury tier with priority booking, dedicated aesthetic suites, and 2 complimentary Balinese massages.',
    price: 29999,
    durationMonths: 12,
    renewalRule: 'Grace Period (15 Days)',
    branchAvailability: ['All'],
    benefits: [
      {
        name: '20% Service Discount',
        type: 'Percentage Discount',
        value: '20% Off',
        applicableScope: 'All Hair, Skin & Spa Treatments',
        usageLimit: 'Unlimited',
      },
      {
        name: '15% Retail Product Discount',
        type: 'Percentage Discount',
        value: '15% Off',
        applicableScope: 'All Luxury Retail Care Brands',
        usageLimit: 'Unlimited',
      },
      {
        name: '2 Complimentary Spa Rituals',
        type: 'Complimentary Service',
        value: '2 Sessions (₹8,400 Val)',
        applicableScope: 'Royal Balinese Massage',
        usageLimit: '2 Per Year',
      },
      {
        name: 'VIP Suite & Priority Booking',
        type: 'Priority Access',
        value: 'Instant Access',
        applicableScope: 'All Flagship Lounges',
        usageLimit: 'Unlimited',
      },
    ],
    activeMembers: 74,
    expiringMembers: 8,
    renewedCount: 42,
    status: 'Active',
  },
  {
    id: 'MEM-002',
    name: 'Atelier Platinum Privilege',
    code: 'MEM-PLAT-02',
    tier: 'Platinum Tier',
    description:
      'Premier tier offering 15% service concessions, birthday spa perks, and express hair styling.',
    price: 19999,
    durationMonths: 12,
    renewalRule: 'Grace Period (15 Days)',
    branchAvailability: ['All'],
    benefits: [
      {
        name: '15% Service Discount',
        type: 'Percentage Discount',
        value: '15% Off',
        applicableScope: 'All Services',
        usageLimit: 'Unlimited',
      },
      {
        name: '10% Retail Product Discount',
        type: 'Percentage Discount',
        value: '10% Off',
        applicableScope: 'All Retail Brands',
        usageLimit: 'Unlimited',
      },
      {
        name: '1 Birthday Complimentary Glow Facial',
        type: 'Complimentary Service',
        value: '1 Session (₹4,500 Val)',
        applicableScope: 'Hydra-Facial',
        usageLimit: 'Birthday Month',
      },
    ],
    activeMembers: 112,
    expiringMembers: 14,
    renewedCount: 68,
    status: 'Active',
  },
  {
    id: 'MEM-003',
    name: 'Atelier Gold Elite',
    code: 'MEM-GOLD-03',
    tier: 'Gold Tier',
    description:
      'Core guest tier offering 10% concessions and complimentary hair blowouts quarterly.',
    price: 11999,
    durationMonths: 12,
    renewalRule: 'Auto-Renew with Discount',
    branchAvailability: ['All'],
    benefits: [
      {
        name: '10% Service Discount',
        type: 'Percentage Discount',
        value: '10% Off',
        applicableScope: 'All Services',
        usageLimit: 'Unlimited',
      },
      {
        name: 'Complimentary Hair Blowout',
        type: 'Complimentary Service',
        value: '1 Session / Quarter',
        applicableScope: 'Blowdry & Style',
        usageLimit: '4 Per Year',
      },
    ],
    activeMembers: 184,
    expiringMembers: 22,
    renewedCount: 104,
    status: 'Active',
  },
  {
    id: 'MEM-004',
    name: 'Silver Starter Pass',
    code: 'MEM-SILVER-04',
    tier: 'Silver Tier',
    description: 'Introductory 6-month membership with 5% baseline savings across treatments.',
    price: 5999,
    durationMonths: 6,
    renewalRule: 'Manual Renewal Required',
    branchAvailability: ['All'],
    benefits: [
      {
        name: '5% Service Discount',
        type: 'Percentage Discount',
        value: '5% Off',
        applicableScope: 'All Services',
        usageLimit: 'Unlimited',
      },
    ],
    activeMembers: 96,
    expiringMembers: 19,
    renewedCount: 38,
    status: 'Active',
  },
];

export function MembershipsTab() {
  const { toast } = useToast();
  const [memberships, setMemberships] = useState<FullMembershipRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawer
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<FullMembershipRecord | null>(null);
  const [selectedMembershipForDrawer, setSelectedMembershipForDrawer] =
    useState<FullMembershipRecord | null>(null);

  const fetchMembershipsFromApi = async () => {
    try {
      setLoading(true);
      const { membershipsApi } = await import('@/shared/api/memberships.api');
      const liveList = await membershipsApi.listMemberships();
      if (liveList && liveList.length > 0) {
        const mapped: FullMembershipRecord[] = liveList.map((m, idx) => ({
          id: m.id || `MEM-${idx + 1}`,
          name: m.name,
          code: `MEM-VIP-0${idx + 1}`,
          tier: m.name.includes('Royal')
            ? 'Royal Black Tier'
            : m.name.includes('Platinum')
            ? 'Platinum Tier'
            : 'Gold Tier',
          description: m.description || 'Configured VIP membership plan and privileges.',
          price: m.price,
          durationMonths: m.billingPeriod === 'MONTHLY' ? 1 : 12,
          renewalRule: 'Grace Period (15 Days)',
          branchAvailability: ['All'],
          benefits: [
            {
              name: `${m.discountPercentage}% Service Discount`,
              type: 'Percentage Discount',
              value: `${m.discountPercentage}% Off`,
              applicableScope: m.perksText || 'All Services',
              usageLimit: 'Unlimited',
            },
          ],
          activeMembers: m.membersCount || 0,
          expiringMembers: Math.round((m.membersCount || 0) * 0.1),
          renewedCount: Math.round((m.membersCount || 0) * 0.4),
          status: m.isActive ? 'Active' : 'Inactive',
        }));
        setMemberships(mapped);
      } else {
        setMemberships([]);
      }
    } catch (err) {
      console.error('Failed to load memberships from API', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMembershipsFromApi();
  }, []);

  const handleSaveMembership = async (saved: FullMembershipRecord) => {
    await fetchMembershipsFromApi();
    setEditingMembership(null);
  };



  const tiers = ['All', 'Silver Tier', 'Gold Tier', 'Platinum Tier', 'Royal Black Tier'];

  const filteredMemberships = useMemo(() => {
    return memberships.filter((mem) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        mem.name.toLowerCase().includes(q) ||
        mem.code.toLowerCase().includes(q) ||
        mem.tier.toLowerCase().includes(q);

      const matchesTier = tierFilter === 'All' || mem.tier === tierFilter;
      const matchesBranch =
        branchFilter === 'All' ||
        mem.branchAvailability.includes('All') ||
        mem.branchAvailability.includes(branchFilter);
      const matchesStatus = statusFilter === 'All' || mem.status === statusFilter;

      return matchesSearch && matchesTier && matchesBranch && matchesStatus;
    });
  }, [memberships, searchQuery, tierFilter, branchFilter, statusFilter]);



  const handleToggleStatus = (mem: FullMembershipRecord) => {
    const nextStatus = mem.status === 'Active' ? 'Inactive' : 'Active';
    setMemberships((prev) => prev.map((m) => (m.id === mem.id ? { ...m, status: nextStatus } : m)));
    if (selectedMembershipForDrawer?.id === mem.id) {
      setSelectedMembershipForDrawer({ ...mem, status: nextStatus });
    }
    toast(`Membership "${mem.name}" status updated to ${nextStatus}.`);
  };

  const handleDuplicate = async (mem: FullMembershipRecord) => {
    try {
      const { membershipsApi } = await import('@/shared/api/memberships.api');
      await membershipsApi.createMembership({
        name: `${mem.name} (Copy)`,
        description: mem.description,
        price: Number(mem.price),
        billingPeriod: mem.durationMonths === 1 ? 'MONTHLY' : 'ANNUAL',
        discountPercentage: 15,
        perksText: mem.benefits?.map((b) => `${b.name} (${b.value})`).join(', ') || '',
        isActive: false,
      });
      await fetchMembershipsFromApi();
      toast(`Membership tier "${mem.name}" duplicated as draft successfully.`);
    } catch (err) {
      console.error('Failed to duplicate membership via API', err);
      toast('Failed to duplicate membership tier.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Central Membership Tiers &amp; Plans
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {memberships.length} Active Tier Programs
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Configure annual recurring subscription plans, tiered treatment concessions, retail
            perks, and VIP privileges across branches.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast(`Exported ${filteredMemberships.length} membership plans to CSV.`)}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => {
              setEditingMembership(null);
              setIsCreateModalOpen(true);
            }}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Membership</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by membership name, tier, code..."
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
              {tiers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Branch Filter */}
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Branch:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Branches</option>
              {masterBranches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Membership Master Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Membership Tier Directory &amp; Subscription Tariffs
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Annual recurring fee, concession rules, and active enrolled VIPs
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredMemberships.length} Active Plans
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Membership Name & Code',
                  'Tier Level',
                  'Annual Fee & Duration',
                  'Included Privileges & Perks',
                  'Branch Scope',
                  'Enrolled VIP Members',
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
              {filteredMemberships.map((mem) => {
                const benefitsList = mem.benefits || [];
                const branchesList = mem.branchAvailability || ['All'];
                const priceVal = Number(mem.price || 0);

                return (
                  <tr key={mem.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Name & Code */}
                    <td className="p-3.5 pl-5">
                      <button
                        onClick={() => setSelectedMembershipForDrawer(mem)}
                        className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      >
                        <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                          {mem.name || 'Unnamed Plan'}
                        </strong>
                        <span className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                          {mem.code || 'MEM-000'}
                        </span>
                      </button>
                    </td>

                    {/* Tier */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                          mem.tier === 'Royal Black Tier'
                            ? 'bg-[#3B2647] text-white border-black'
                            : mem.tier === 'Platinum Tier'
                              ? 'bg-purple-100 text-[#5A2EA6] border-purple-200'
                              : mem.tier === 'Gold Tier'
                                ? 'bg-amber-100 text-amber-900 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200',
                        )}
                      >
                        {mem.tier || 'Gold Tier'}
                      </span>
                    </td>

                    {/* Price & Duration */}
                    <td className="p-3.5">
                      <strong className="text-ink font-serif text-[13.5px] block">
                        ₹{priceVal.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-muted font-medium">
                        per {mem.durationMonths || 12} Months
                      </span>
                    </td>

                    {/* Benefits */}
                    <td className="p-3.5 max-w-xs">
                      <div className="space-y-0.5">
                        <span className="text-ink font-semibold text-xs block">
                          {benefitsList.length} Privilege Rules
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {benefitsList.slice(0, 2).map((b, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 bg-purple-50 text-[#5A2EA6] rounded text-[9px] font-semibold truncate"
                            >
                              {b.value} ({(b.name || 'Perk').split(' ')[0]})
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Branch Scope */}
                    <td className="p-3.5 text-soft text-xs">
                      {branchesList.includes('All') ? (
                        <span className="text-emerald-700 font-bold">All Branches</span>
                      ) : (
                        <span>{branchesList.length} Branches</span>
                      )}
                    </td>

                    {/* Active Members */}
                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{mem.activeMembers || 0} VIPs</strong>
                      <span className="text-[10px] text-amber-700 font-bold">
                        {mem.expiringMembers || 0} Expiring Soon
                      </span>
                    </td>


                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        mem.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mem.status === 'Draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {mem.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedMembershipForDrawer(mem)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0"
                        title="View Membership Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => setEditingMembership(mem)}
                        className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-purple-50 text-soft hover:text-[#5A2EA6] grid place-items-center transition-colors cursor-pointer border-0"
                        title="Edit Membership"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(mem)}
                        className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-purple-50 text-soft hover:text-[#5A2EA6] grid place-items-center transition-colors cursor-pointer border-0"
                        title="Duplicate Membership"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals & Drawers */}
      <CreateMembershipModal
        isOpen={isCreateModalOpen || Boolean(editingMembership)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMembership(null);
        }}
        onSuccess={handleSaveMembership}
        editData={editingMembership}
      />

      <MembershipDetailsDrawer
        membership={selectedMembershipForDrawer}
        isOpen={Boolean(selectedMembershipForDrawer)}
        onClose={() => setSelectedMembershipForDrawer(null)}
        onEdit={(mem) => {
          setSelectedMembershipForDrawer(null);
          setEditingMembership(mem);
        }}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}

export default MembershipsTab;
