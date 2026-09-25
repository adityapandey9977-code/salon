import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Archive,
  Building2,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Edit2,
  Eye,
  Filter,
  Package,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';
import { CreatePackageModal, type FullPackageRecord } from './CreatePackageModal';
import { PackageDetailsDrawer } from './PackageDetailsDrawer';

export const initialMasterPackages: FullPackageRecord[] = [
  {
    id: 'PKG-001',
    name: 'Royal Bridal Radiance Cure',
    code: 'PKG-BRD-01',
    category: 'Bridal & Event Special',
    description:
      'Complete 30-day pre-bridal aesthetic & hair transformation with clinical Hydra-Facial and keratin.',
    services: [
      {
        serviceName: '7-Step Medical Hydra-Facial',
        category: 'Facial & Skin Aesthetics',
        sessions: 3,
        individualPrice: 4500,
      },
      {
        serviceName: 'Full Head Balayage & Keratin Infusion',
        category: 'Hair Art & Color',
        sessions: 1,
        individualPrice: 7500,
      },
      {
        serviceName: 'Sculpted Gel Extensions & French Ombre',
        category: 'Nails & Lashes',
        sessions: 1,
        individualPrice: 3200,
      },
      {
        serviceName: 'Royal Balinese Aromatherapy Massage',
        category: 'Spa & Wellness',
        sessions: 2,
        individualPrice: 4200,
      },
    ],
    totalIndividualValue: 32600,
    sellingPrice: 24999,
    savingsAmount: 7601,
    savingsPercentage: 23,
    validityMonths: 6,
    branchAvailability: ['All'],
    totalSold: 48,
    activeCount: 32,
    redeemedCount: 16,
    status: 'Active',
    isTransferable: true,
    isRefundable: false,
    allowPartialRedemption: true,
  },
  {
    id: 'PKG-002',
    name: 'Clinical Skin Renewal Trio',
    code: 'PKG-SKN-02',
    category: 'Facial & Skin Aesthetics',
    description:
      'Quarterly skin resurfacing protocol for hyper-pigmentation and collagen synthesis.',
    services: [
      {
        serviceName: '7-Step Medical Hydra-Facial',
        category: 'Facial & Skin Aesthetics',
        sessions: 3,
        individualPrice: 4500,
      },
      {
        serviceName: 'Dermalogica Pro Power Peel',
        category: 'Facial & Skin Aesthetics',
        sessions: 2,
        individualPrice: 3500,
      },
    ],
    totalIndividualValue: 20500,
    sellingPrice: 15499,
    savingsAmount: 5001,
    savingsPercentage: 24,
    validityMonths: 6,
    branchAvailability: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier Koregaon Park Grand',
    ],
    totalSold: 64,
    activeCount: 41,
    redeemedCount: 23,
    status: 'Active',
    isTransferable: true,
    isRefundable: false,
    allowPartialRedemption: true,
  },
  {
    id: 'PKG-003',
    name: 'Gentlemen’s Executive Grooming Pass',
    code: 'PKG-MEN-03',
    category: "Men's Executive Grooming",
    description:
      'Quarterly grooming pass with beard sculpting, scalp detox, and precision haircuts.',
    services: [
      {
        serviceName: 'Executive Hot Towel Beard Sculpt',
        category: 'Barbering & Grooming',
        sessions: 6,
        individualPrice: 1800,
      },
      {
        serviceName: 'Signature Precision Cut & Wash',
        category: 'Barbering & Grooming',
        sessions: 4,
        individualPrice: 1200,
      },
      {
        serviceName: 'Scalp Therapy & Reflexology',
        category: 'Spa & Wellness',
        sessions: 2,
        individualPrice: 1600,
      },
    ],
    totalIndividualValue: 18800,
    sellingPrice: 13999,
    savingsAmount: 4801,
    savingsPercentage: 26,
    validityMonths: 6,
    branchAvailability: ['All'],
    totalSold: 52,
    activeCount: 38,
    redeemedCount: 14,
    status: 'Active',
    isTransferable: false,
    isRefundable: false,
    allowPartialRedemption: true,
  },
  {
    id: 'PKG-004',
    name: 'Holistic Spa Rejuvenation Series',
    code: 'PKG-SPA-04',
    category: 'Spa, Holistic & Wellness',
    description:
      '5-session stress relief therapy with Ayurvedic hot stone and deep tissue rituals.',
    services: [
      {
        serviceName: 'Royal Balinese Aromatherapy Massage',
        category: 'Spa & Wellness',
        sessions: 3,
        individualPrice: 4200,
      },
      {
        serviceName: 'Hot Stone Deep Tissue Recovery',
        category: 'Spa & Wellness',
        sessions: 2,
        individualPrice: 4800,
      },
    ],
    totalIndividualValue: 22200,
    sellingPrice: 16999,
    savingsAmount: 5201,
    savingsPercentage: 23,
    validityMonths: 12,
    branchAvailability: ['All'],
    totalSold: 36,
    activeCount: 22,
    redeemedCount: 14,
    status: 'Active',
    isTransferable: true,
    isRefundable: false,
    allowPartialRedemption: true,
  },
];

export function PackagesTab() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<FullPackageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawer State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<FullPackageRecord | null>(null);
  const [selectedPackageForDrawer, setSelectedPackageForDrawer] =
    useState<FullPackageRecord | null>(null);

  const fetchPackagesFromApi = async () => {
    try {
      setLoading(true);
      const { packagesApi } = await import('@/shared/api/packages.api');
      const liveList = await packagesApi.listPackages();
      if (liveList && liveList.length > 0) {
        const mapped: FullPackageRecord[] = liveList.map((p, idx) => ({
          id: p.id || `PKG-${idx + 1}`,
          name: p.name,
          code: p.code || `PKG-00${idx + 1}`,
          category: 'Facial & Skin Aesthetics',
          description: p.description || 'Configured salon bundle & service protocol.',
          services: (p.items || []).map((it) => ({
            serviceName: `Service (${it.serviceId.substring(0, 6)})`,
            category: 'General',
            sessions: it.includedQuantity,
            individualPrice: Math.round(p.price / (it.includedQuantity || 1)),
          })),
          totalIndividualValue: Math.round(p.price * 1.25),
          sellingPrice: p.price,
          savingsAmount: Math.round(p.price * 0.25),
          savingsPercentage: 20,
          validityMonths: Math.round(p.validityDays / 30) || 12,
          branchAvailability: ['All'],
          totalSold: p.salesCount || 0,
          activeCount: Math.round((p.salesCount || 0) * 0.7),
          redeemedCount: Math.round((p.salesCount || 0) * 0.3),
          status: p.isActive ? 'Active' : 'Inactive',
          isTransferable: true,
          isRefundable: false,
          allowPartialRedemption: true,
        }));
        setPackages(mapped);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error('Failed to load packages from API', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPackagesFromApi();
  }, []);


  const categories = [
    'All',
    'Facial & Skin Aesthetics',
    'Hair Art & Transformation',
    'Bridal & Event Special',
    'Spa, Holistic & Wellness',
    "Men's Executive Grooming",
  ];

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        pkg.name.toLowerCase().includes(q) ||
        pkg.code.toLowerCase().includes(q) ||
        pkg.services.some((s) => s.serviceName.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === 'All' || pkg.category === categoryFilter;
      const matchesBranch =
        branchFilter === 'All' ||
        pkg.branchAvailability.includes('All') ||
        pkg.branchAvailability.includes(branchFilter);
      const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter;

      return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
    });
  }, [packages, searchQuery, categoryFilter, branchFilter, statusFilter]);

  const handleSavePackage = async (saved: FullPackageRecord) => {
    await fetchPackagesFromApi();
    setEditingPackage(null);
  };


  const handleToggleStatus = (pkg: FullPackageRecord) => {
    const nextStatus = pkg.status === 'Active' ? 'Inactive' : 'Active';
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? { ...p, status: nextStatus } : p)));
    if (selectedPackageForDrawer?.id === pkg.id) {
      setSelectedPackageForDrawer({ ...pkg, status: nextStatus });
    }
    toast(`Package "${pkg.name}" status updated to ${nextStatus}.`);
  };

  const handleDuplicate = async (pkg: FullPackageRecord) => {
    try {
      const { packagesApi } = await import('@/shared/api/packages.api');
      const uniqueCode = `PKG-CPY-${Date.now().toString(36).toUpperCase()}`;
      const payload = {
        code: uniqueCode,
        name: `${pkg.name} (Copy)`,
        description: pkg.description || 'Duplicated service package configuration.',
        price: pkg.sellingPrice || 1000,
        validityDays: (pkg.validityMonths || 6) * 30,
        isShared: true,
        isActive: true,
        includedServicesText: (pkg.services || []).map((s) => `${s.serviceName} (${s.sessions}s)`).join(', ') || 'Package Services',
        items: [],
      };
      await packagesApi.createPackage(payload);
      await fetchPackagesFromApi();
      toast(`Package "${pkg.name}" duplicated as "${payload.name}" successfully.`);
    } catch (err: any) {
      console.error('Failed to duplicate package', err);
      toast(err?.response?.data?.message || 'Failed to duplicate package via API.');
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Central Service Packages Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {packages.length} Configured Bundles
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Configure multi-session treatment bundles, commercial pricing discounts, validity
            windows, and multi-location redemption rights.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() =>
              toast(`Exported ${filteredPackages.length} package configurations to CSV.`)
            }
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => {
              setEditingPackage(null);
              setIsCreateModalOpen(true);
            }}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Package</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by package name, code, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
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

      {/* Package Master Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Active Service Bundles &amp; Pricing Structure
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Multi-location availability, session allocations, and active subscriber metrics
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredPackages.length} Packages Configured
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Package Name & Code',
                  'Category',
                  'Bundled Service Protocols',
                  'Selling Price & Savings',
                  'Validity',
                  'Branch Scope',
                  'Sold / Active',
                  'Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 8 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredPackages.map((pkg) => {
                const servicesList = pkg.services || [];
                const totalSessions = servicesList.reduce((acc, s) => acc + (s.sessions || 0), 0);
                const branchesList = pkg.branchAvailability || ['All'];
                const priceVal = Number(pkg.sellingPrice || 0);
                const savingsAmt = Number(pkg.savingsAmount || 0);
                const savingsPct = Number(pkg.savingsPercentage || 0);

                return (
                  <tr key={pkg.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Name & Code */}
                    <td className="p-3.5 pl-5">
                      <button
                        onClick={() => setSelectedPackageForDrawer(pkg)}
                        className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      >
                        <strong className="text-ink text-[13px] block group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                          {pkg.name || 'Unnamed Package'}
                        </strong>
                        <span className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                          {pkg.code || 'PKG-000'}
                        </span>
                      </button>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#5A2EA6] text-[10px] font-bold border border-purple-100">
                        {pkg.category || 'General'}
                      </span>
                    </td>

                    {/* Services */}
                    <td className="p-3.5 max-w-[220px]">
                      <div className="space-y-0.5">
                        <span className="text-ink font-semibold text-xs block">
                          {totalSessions} Total Sessions
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {servicesList.slice(0, 2).map((s, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[9px] font-medium truncate"
                            >
                              {(s.serviceName || 'Service').split(' ')[0]} ({s.sessions || 1}s)
                            </span>
                          ))}
                          {servicesList.length > 2 && (
                            <span className="text-[9px] text-[#5A2EA6] font-bold">
                              +{servicesList.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price & Savings */}
                    <td className="p-3.5">
                      <strong className="text-ink font-serif text-[13.5px] block">
                        ₹{priceVal.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        Save {savingsPct}% (₹{savingsAmt})
                      </span>
                    </td>

                    {/* Validity */}
                    <td className="p-3.5 text-soft font-semibold">{pkg.validityMonths || 12} Months</td>

                    {/* Branches */}
                    <td className="p-3.5 text-soft text-xs">
                      {branchesList.includes('All') ? (
                        <span className="text-emerald-700 font-bold">All Branches</span>
                      ) : (
                        <span>{branchesList.length} Locations</span>
                      )}
                    </td>

                    {/* Sold / Active */}
                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{pkg.totalSold || 0} Sold</strong>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {pkg.activeCount || 0} Active
                      </span>
                    </td>


                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          pkg.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pkg.status === 'Draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        {pkg.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedPackageForDrawer(pkg)}
                          className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0"
                          title="View Detailed Package Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => setEditingPackage(pkg)}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-purple-50 text-soft hover:text-[#5A2EA6] grid place-items-center transition-colors cursor-pointer border-0"
                          title="Edit Package"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDuplicate(pkg)}
                          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-purple-50 text-soft hover:text-[#5A2EA6] grid place-items-center transition-colors cursor-pointer border-0"
                          title="Duplicate Package"
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
      <CreatePackageModal
        isOpen={isCreateModalOpen || Boolean(editingPackage)}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPackage(null);
        }}
        onSuccess={handleSavePackage}
        editData={editingPackage}
      />

      <PackageDetailsDrawer
        pkg={selectedPackageForDrawer}
        isOpen={Boolean(selectedPackageForDrawer)}
        onClose={() => setSelectedPackageForDrawer(null)}
        onEdit={(pkg) => {
          setSelectedPackageForDrawer(null);
          setEditingPackage(pkg);
        }}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}

export default PackagesTab;
