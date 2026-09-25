import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  DollarSign,
  Eye,
  Filter,
  Globe,
  Layers,
  Palette,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { ProvisionTenantModal } from '../components/ProvisionTenantModal';
import { SalonDetailsModal } from '../components/SalonDetailsModal';
import { WhiteLabelSettingsModal } from '../components/WhiteLabelSettingsModal';
import { type Tenant, useSuperAdminStore } from '../context/SuperAdminContext';

export function SalonsPage() {
  const { tenants, deleteTenant, updateTenant } = useSuperAdminStore();
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [selectedDetailsSalon, setSelectedDetailsSalon] = useState<Tenant | null>(null);
  const [selectedWhiteLabelSalon, setSelectedWhiteLabelSalon] = useState<Tenant | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Active' | 'Suspended' | 'Pending Setup'
  >('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');

  // Unique Cities List
  const uniqueCities = useMemo(() => {
    const cities = new Set(tenants.map((t) => t.city).filter(Boolean));
    return Array.from(cities);
  }, [tenants]);

  // Filtered Tenants
  const filteredTenants = useMemo(() => {
    return tenants.filter((salon) => {
      const matchesSearch =
        salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        salon.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (salon.customDomain &&
          salon.customDomain.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'All' || salon.status === statusFilter;
      const matchesTier = tierFilter === 'All' || salon.activePlans === tierFilter;
      const matchesCity = cityFilter === 'All' || salon.city === cityFilter;

      return matchesSearch && matchesStatus && matchesTier && matchesCity;
    });
  }, [tenants, searchQuery, statusFilter, tierFilter, cityFilter]);

  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'All' || tierFilter !== 'All' || cityFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTierFilter('All');
    setCityFilter('All');
  };

  const totalBranches = tenants.reduce((acc, t) => acc + (t.branchesCount ?? 0), 0);
  const activeTenantsCount = tenants.filter((t) => t.status === 'Active').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Salons / Tenants Roster
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20">
              {tenants.length} Total Accounts
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Manage global salon tenants directory, contact information, subscription tiers, and
            CNAME custom domains.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTenant(null);
            setIsProvisionModalOpen(true);
          }}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New Tenant</span>
        </Button>
      </div>

      {/* Roster Quick Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Registered Salons
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {tenants.length} Salons
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Active Accounts
            </span>
            <strong className="text-xl font-serif font-bold text-emerald-700">
              {activeTenantsCount} Active
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Network Branches
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {totalBranches} Branches
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Custom CNAMEs
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {tenants.filter((t) => t.customDomain).length} Domains
            </strong>
          </div>
        </div>
      </div>

      {/* Salons Registry Card with Search & Filters */}
      <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] shadow-xs overflow-hidden">
        {/* Search & Filter Header Bar */}
        <div className="p-5 border-b border-[#5A2EA6]/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Tenant Roster & Directory</h3>
              <p className="text-[12px] text-muted mt-0.5">
                Filter by subscription tier, city HQ, account status, or custom domain name
              </p>
            </div>
            <div className="text-xs text-muted flex items-center gap-2">
              <span className="font-semibold text-[#5A2EA6]">
                Showing {filteredTenants.length} of {tenants.length} Tenants
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search salon, owner, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Account Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Pending Setup">Pending Setup</option>
              </select>
            </div>

            {/* Subscription Tier Filter */}
            <div className="relative">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Subscription Tiers</option>
                <option value="Enterprise Plan">Enterprise Plan</option>
                <option value="Premium Plan">Premium Plan</option>
                <option value="Standard Plan">Standard Plan</option>
              </select>
            </div>

            {/* City HQ Filter */}
            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Cities / Regions</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city} HQ
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Salon / Tenant Name',
                  'Tenant Owner Contact',
                  'Active Subscription',
                  'Branches',
                  'Monthly Revenue',
                  'Account Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-4 font-bold text-[10px] tracking-wider uppercase',
                      i === 0 ? 'pl-6' : i === 6 ? 'pr-6 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredTenants.length > 0 ? (
                filteredTenants.map((salon) => (
                  <tr
                    key={salon.id}
                    className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                  >
                    <td className="p-4 pl-6">
                      <strong className="block text-ink font-semibold">{salon.name}</strong>
                      <span className="text-[10px] text-muted block mt-0.5">
                        {salon.city} HQ {salon.customDomain ? `• ${salon.customDomain}` : ''}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
                        <div>
                          <strong className="block text-ink">{salon.ownerName}</strong>
                          <span className="text-[10px] text-muted block">{salon.ownerEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-[#5A2EA6]/10 text-[#5A2EA6] font-semibold px-2.5 py-0.5 rounded-full text-[11px]">
                        {salon.activePlans}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#5A2EA6]">
                      <span className="inline-flex items-center gap-1 bg-[#F8F5FF] border border-[#5A2EA6]/15 px-2.5 py-0.5 rounded-full text-[10.5px]">
                        <Layers className="w-3 h-3 text-[#7C3AED]" /> {salon.branchesCount ?? 0}{' '}
                        Branches
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#5A2EA6] text-[13px]">{salon.revenue}</td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          updateTenant(salon.id, {
                            status: salon.status === 'Active' ? 'Suspended' : 'Active',
                          })
                        }
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-full text-[9.5px] font-bold border-0 cursor-pointer transition-transform hover:scale-105',
                          salon.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200',
                        )}
                        title="Click to toggle account status"
                      >
                        {salon.status}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View Details */}
                        <button
                          onClick={() => setSelectedDetailsSalon(salon)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Drill into Tenant & Branch Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Tenant Details */}
                        <button
                          onClick={() => {
                            setEditingTenant(salon);
                            setIsProvisionModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Edit Tenant & Owner Details"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* White-Label Settings */}
                        <button
                          onClick={() => setSelectedWhiteLabelSalon(salon)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="White-Label & CNAME Settings"
                        >
                          <Palette className="w-4 h-4" />
                        </button>

                        {/* Delete Tenant */}
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${salon.name}?`)) {
                              deleteTenant(salon.id);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Delete Tenant Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted text-xs">
                    No salon tenants found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ProvisionTenantModal
        isOpen={isProvisionModalOpen}
        onClose={() => {
          setIsProvisionModalOpen(false);
          setEditingTenant(null);
        }}
        editTenant={editingTenant}
      />

      <SalonDetailsModal
        isOpen={!!selectedDetailsSalon}
        onClose={() => setSelectedDetailsSalon(null)}
        salon={selectedDetailsSalon}
      />

      <WhiteLabelSettingsModal
        isOpen={!!selectedWhiteLabelSalon}
        onClose={() => setSelectedWhiteLabelSalon(null)}
        salon={selectedWhiteLabelSalon}
      />
    </div>
  );
}
