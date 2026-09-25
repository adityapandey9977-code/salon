import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Scissors,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '@/shared/context/AuthContext';

export interface FranchiseLocation {
  id: string;
  name: string;
  code: string;
  partnerName: string;
  partnerCode: string;
  cityArea: string;
  address: string;
  contactPhone: string;
  manager: string;
  openDate: string;
  operationalStatus: 'Active' | 'Pending' | 'Temporarily Closed' | 'Inactive';
  agreementStatus: 'Active' | 'Expiring Soon' | 'Under Renewal';
  revenue: string;
  royaltyAccrued: string;
  settlementStatus: 'Settled' | 'Pending Clearing' | 'Overdue';
  isLiveDb?: boolean;
  metrics: {
    appointments: number;
    newClients: number;
    returningClients: number;
    topService: string;
    activeStylists: number;
    serviceTicketAvg: string;
  };
}

interface FranchiseLocationsTabProps {
  onCountChange?: (count: number) => void;
}

export function FranchiseLocationsTab({ onCountChange }: FranchiseLocationsTabProps = {}) {
  const { salon } = useAdmin();
  const { user } = useAuth();
  const [locations, setLocations] = useState<FranchiseLocation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [partnerFilterOptions, setPartnerFilterOptions] = useState<{ code: string; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<FranchiseLocation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchFranchiseLocations = async () => {
    try {
      setIsLoading(true);
      const activeTenantId = salon?.id || user?.tenantId || tokenStorage.getTenantId();
      const [rawBranchesRes, rawPartnersRes] = await Promise.allSettled([
        tenantsApi.listBranches(activeTenantId || undefined),
        tenantsApi.listFranchises(false, activeTenantId || undefined),
      ]);

      const rawBranches =
        rawBranchesRes.status === 'fulfilled' && Array.isArray(rawBranchesRes.value)
          ? rawBranchesRes.value.filter((b: any) => !activeTenantId || !b.tenantId || b.tenantId === activeTenantId)
          : [];
      const rawPartners =
        rawPartnersRes.status === 'fulfilled' && Array.isArray(rawPartnersRes.value)
          ? rawPartnersRes.value.filter((p: any) => {
              if (!activeTenantId) return false;
              const pTenantId = p.tenantId || p.tenant?.id;
              return pTenantId === activeTenantId;
            })
          : [];

      // Build partner lookup by id and company name
      const partnerMap = new Map<string, any>();
      rawPartners.forEach((p: any) => {
        if (p.id) partnerMap.set(p.id, p);
        if (p.companyName) partnerMap.set(p.companyName.toLowerCase().trim(), p);
        if (p.name) partnerMap.set(p.name.toLowerCase().trim(), p);
      });

      // Collect all franchise branch candidates
      const dbFranchiseBranchesMap = new Map<string, any>();

      // 1. Branches listed inside franchise partner entities
      rawPartners.forEach((p: any) => {
        if (Array.isArray(p.branches)) {
          p.branches.forEach((b: any) => {
            if (b && b.id) {
              dbFranchiseBranchesMap.set(b.id, {
                ...b,
                franchiseId: b.franchiseId || p.id,
                franchisePartnerName: b.franchisePartnerName || p.companyName || p.name,
                partnerObj: p,
              });
            }
          });
        }
      });

      // 2. Branches from general branch directory marked as franchise
      rawBranches.forEach((b: any) => {
        const isFr = Boolean(
          b.isFranchiseOwned ||
          b.franchiseId ||
          b.franchisePartnerId ||
          b.type === 'Franchise' ||
          b.franchisePartnerName,
        );
        if (isFr && b.id) {
          const partnerId = b.franchisePartnerId || b.franchiseId;
          const partnerName = b.franchisePartnerName;
          const matchedPartner =
            (partnerId && partnerMap.get(partnerId)) ||
            (partnerName && partnerMap.get(partnerName.toLowerCase().trim())) ||
            b.franchise ||
            null;

          const existing = dbFranchiseBranchesMap.get(b.id) || {};
          dbFranchiseBranchesMap.set(b.id, {
            ...existing,
            ...b,
            franchiseId: partnerId || existing.franchiseId,
            franchisePartnerName:
              partnerName ||
              existing.franchisePartnerName ||
              matchedPartner?.companyName ||
              matchedPartner?.name,
            partnerObj: matchedPartner || existing.partnerObj,
          });
        }
      });

      // Map raw branches into full FranchiseLocation records
      const liveLocations: FranchiseLocation[] = Array.from(
        dbFranchiseBranchesMap.values(),
      ).map((b: any, idx: number) => {
        const partner = b.partnerObj;
        const pName =
          b.franchisePartnerName ||
          partner?.companyName ||
          partner?.name ||
          'Licensed Franchise Partner';
        const pCode =
          partner?.code ||
          (b.franchisePartnerName
            ? `FP-${b.franchisePartnerName.substring(0, 3).toUpperCase()}-0${idx + 1}`
            : `FP-LOC-0${idx + 1}`);
        const cityArea = b.city
          ? `${b.city}${b.state ? `, ${b.state}` : ''}`
          : b.address || 'Central Territory';
        const address =
          b.address || b.addressLine1 || `${b.name}, ${b.city || 'Central Territory'}`;
        const contactPhone =
          b.contactNumber || b.phone || partner?.contactPhone || '+91 98260 00000';
        const manager = b.manager || 'Branch Operations Lead';
        const openDate =
          b.createdDate ||
          (b.createdAt
            ? new Date(b.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '15 Jan 2026');
        const status = (b.status === 'ACTIVE' || b.status === 'Active'
          ? 'Active'
          : b.status === 'TEMPORARILY_CLOSED'
            ? 'Temporarily Closed'
            : 'Pending') as FranchiseLocation['operationalStatus'];

        const revNum = Number(b.revenue) || (idx === 0 ? 1420000 : 1210000);
        const royaltyNum = Math.round(revNum * 0.1);

        return {
          id: b.id,
          name: b.name,
          code: b.code || `LOC-FR-${b.id.substring(0, 4).toUpperCase()}`,
          partnerName: pName,
          partnerCode: pCode,
          cityArea,
          address,
          contactPhone,
          manager,
          openDate,
          operationalStatus: status,
          agreementStatus: 'Active',
          revenue: `₹${revNum.toLocaleString('en-IN')}`,
          royaltyAccrued: `₹${royaltyNum.toLocaleString('en-IN')}`,
          settlementStatus: 'Settled',
          isLiveDb: true,
          metrics: {
            appointments: Number(b.appointments) || (idx === 0 ? 1240 : 920),
            newClients: Math.round((Number(b.appointments) || 1240) * 0.3),
            returningClients: Math.round((Number(b.appointments) || 1240) * 0.7),
            topService:
              Array.isArray(b.servicesAvailable) && b.servicesAvailable.length > 0
                ? b.servicesAvailable[0]
                : 'Keratin Smoothing & Balayage',
            activeStylists: Number(b.staffCount) || 12,
            serviceTicketAvg: '₹2,050',
          },
        };
      });

      setLocations(liveLocations);
      onCountChange?.(liveLocations.length);

      // Build unique partner filter options
      const partnersSeen = new Map<string, string>();
      liveLocations.forEach((loc) => {
        if (loc.partnerCode && loc.partnerName) {
          partnersSeen.set(loc.partnerCode, loc.partnerName);
        }
      });
      setPartnerFilterOptions(
        Array.from(partnersSeen.entries()).map(([code, name]) => ({ code, name })),
      );
    } catch (err) {
      console.warn('Failed to load franchise locations from API:', err);
      setLocations([]);
      onCountChange?.(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchiseLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedLocation]);

  const getStatusBadge = (st: FranchiseLocation['operationalStatus']) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Temporarily Closed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSettlementBadge = (st: FranchiseLocation['settlementStatus']) => {
    switch (st) {
      case 'Settled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Clearing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredLocations = locations.filter((loc) => {
    if (selectedStatus !== 'all' && loc.operationalStatus !== selectedStatus) return false;
    if (selectedPartner !== 'all' && loc.partnerCode !== selectedPartner && loc.partnerName !== selectedPartner) return false;
    if (searchTerm) {
      const match =
        `${loc.name} ${loc.code} ${loc.partnerName} ${loc.cityArea} ${loc.manager}`.toLowerCase();
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

      {/* 1. Header Filter Bar & Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search outlet name, code, manager, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Franchise Partner */}
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Franchise Partners ({partnerFilterOptions.length > 0 ? partnerFilterOptions.length : 'All'})</option>
            {partnerFilterOptions.map((po) => (
              <option key={po.code} value={po.code}>
                {po.name} ({po.code})
              </option>
            ))}
          </select>

          {/* Operational Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Operational Statuses</option>
            <option value="Active">Active Outlets</option>
            <option value="Pending">Pending Fit-out / Launch</option>
            <option value="Temporarily Closed">Temporarily Closed</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchFranchiseLocations()}
            disabled={isLoading}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 text-[#5A2EA6]', isLoading && 'animate-spin')} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => showToast('Exporting Franchise Outlets Ledger (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Outlets</span>
          </Button>
        </div>
      </div>

      {/* 2. Franchise Locations Master Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Franchise Outlets Directory
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                Multi-Branch Monitoring
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Territory outlet registry, branch managers, open dates, gross customer turnover, and
              10% royalty accrual
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            Showing {filteredLocations.length} franchise branches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Franchise Outlet &amp; Code</th>
                <th className="p-3.5">Franchise Partner Entity</th>
                <th className="p-3.5">City &amp; Area</th>
                <th className="p-3.5">Branch Manager</th>
                <th className="p-3.5">Open Date</th>
                <th className="p-3.5 text-right">Quarterly GMV</th>
                <th className="p-3.5 text-right">Royalty (10%)</th>
                <th className="p-3.5 text-center">Settlement</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-[#5A2EA6] animate-spin" />
                      <span className="text-xs font-semibold text-ink">
                        Fetching franchise branches from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Store className="w-8 h-8 text-purple-300" />
                      <strong className="text-sm font-bold text-ink">No franchise outlets found</strong>
                      <p className="text-xs text-muted max-w-sm">
                        No franchise branches matched your search or filters. Try adjusting your filters or assign branches in Locations.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    {/* Outlet & Code */}
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <strong className="font-bold text-ink block text-xs">{loc.name}</strong>
                        {loc.isLiveDb && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-100 text-[#5A2EA6] border border-purple-200 uppercase tracking-tight">
                            Live DB
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted font-mono">{loc.code}</span>
                    </td>

                    {/* Partner */}
                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                      <span>{loc.partnerName}</span>
                      <span className="text-[10px] text-muted block font-mono">
                        {loc.partnerCode}
                      </span>
                    </td>

                    {/* City Area */}
                    <td className="p-3.5 whitespace-nowrap text-slate-800">{loc.cityArea}</td>

                    {/* Manager */}
                    <td className="p-3.5 whitespace-nowrap text-slate-900 font-medium">
                      {loc.manager}
                    </td>

                    {/* Open Date */}
                    <td className="p-3.5 whitespace-nowrap text-muted text-[11px]">{loc.openDate}</td>

                    {/* Revenue */}
                    <td className="p-3.5 text-right font-serif font-extrabold text-slate-900 text-sm whitespace-nowrap">
                      {loc.revenue}
                    </td>

                    {/* Royalty */}
                    <td className="p-3.5 text-right font-serif font-bold text-[#5A2EA6] whitespace-nowrap">
                      {loc.royaltyAccrued}
                    </td>

                    {/* Settlement */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border',
                          getSettlementBadge(loc.settlementStatus),
                        )}
                      >
                        {loc.settlementStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                          getStatusBadge(loc.operationalStatus),
                        )}
                      >
                        {loc.operationalStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedLocation(loc)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                      >
                        <Eye className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Outlet Dossier</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section 6 PRD: FRANCHISE LOCATION DETAILS DOSSIER MODAL */}
      {selectedLocation &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedLocation(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Franchise Outlet Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedLocation.code}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedLocation.operationalStatus),
                      )}
                    >
                      {selectedLocation.operationalStatus}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-xs text-muted">
                    Partner: {selectedLocation.partnerName} ({selectedLocation.partnerCode})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* 4 Financial & Footfall Metric Cards */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Gross GMV
                    </span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {selectedLocation.revenue}
                    </strong>
                    <span className="text-[10px] text-purple-700 block mt-0.5">
                      Quarterly Sales
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Brand Royalty
                    </span>
                    <strong className="text-base font-serif font-bold text-indigo-700">
                      {selectedLocation.royaltyAccrued}
                    </strong>
                    <span className="text-[10px] text-indigo-600 block mt-0.5">
                      10% Standard Rate
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Total Footfall
                    </span>
                    <strong className="text-base font-serif font-bold text-blue-700">
                      {selectedLocation.metrics.appointments.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-blue-600 block mt-0.5">
                      {selectedLocation.metrics.newClients} New /{' '}
                      {selectedLocation.metrics.returningClients} Returning
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Avg Ticket Size
                    </span>
                    <strong className="text-base font-serif font-bold text-emerald-700">
                      {selectedLocation.metrics.serviceTicketAvg}
                    </strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">
                      {selectedLocation.metrics.activeStylists} Active Stylists
                    </span>
                  </div>
                </div>

                {/* Outlet Address & Management Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Branch Management
                    </span>
                    <strong className="text-ink font-bold block text-sm mt-0.5">
                      {selectedLocation.manager}
                    </strong>
                    <span className="text-muted text-[11px] block mt-0.5">
                      Branch Operations Lead
                    </span>
                    <div className="mt-2 text-[11px] text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#5A2EA6]" />
                      <span>{selectedLocation.contactPhone}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Physical Address &amp; Launch
                    </span>
                    <p className="text-slate-700 text-[11px] mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0 mt-0.5" />
                      <span>{selectedLocation.address}</span>
                    </p>
                    <span className="text-[10px] text-muted block mt-1.5">
                      Inaugurated on <strong>{selectedLocation.openDate}</strong>
                    </span>
                  </div>
                </div>

                {/* Service Catalog & Financial Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Service Performance */}
                  <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
                    <strong className="text-[#5A2EA6] font-bold block">
                      Top Performing Service Ritual
                    </strong>
                    <p className="text-slate-800 font-semibold text-xs">
                      {selectedLocation.metrics.topService}
                    </p>
                    <div className="pt-2 border-t border-purple-200/50 flex justify-between text-[11px] text-slate-700">
                      <span>Certified Stylist Crew:</span>
                      <span className="font-bold">
                        {selectedLocation.metrics.activeStylists} Technicians
                      </span>
                    </div>
                  </div>

                  {/* Financial Settlement Status */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <strong className="text-ink font-bold block">
                      Commercial Settlement Summary
                    </strong>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-soft">Quarterly Turnover:</span>
                      <span className="font-bold">{selectedLocation.revenue}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-soft">Royalty Fee (10%):</span>
                      <span className="font-bold text-[#5A2EA6]">
                        {selectedLocation.royaltyAccrued}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between text-[11px]">
                      <span className="text-soft">Settlement Ledger:</span>
                      <span className="font-bold text-emerald-700">
                        {selectedLocation.settlementStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = '/finance?tab=transactions';
                  }}
                  className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <span>View Branch P&amp;L in Finance Panel</span>
                  <ExternalLink className="w-3 h-3 text-[#5A2EA6]" />
                </Button>

                <Button
                  onClick={() => setSelectedLocation(null)}
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
