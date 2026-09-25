import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Crown,
  Download,
  FileText,
  MapPin,
  Percent,
  ShieldCheck,
  Sparkles,
  Tag,
} from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';
import { useComplianceStore } from '@/shared/compliance/complianceStore';

export function MyFranchisePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeRequirements, submissions } = useComplianceStore();

  const complianceStats = useMemo(() => {
    const total = activeRequirements.length;
    let approved = 0;
    let pending = 0;

    const list = activeRequirements.map((req) => {
      const match = submissions.find((s) => s.requirementId === req.id);
      let status: 'Approved' | 'Pending' | 'Action Required' = 'Action Required';
      if (match) {
        if (match.status === 'Verified') {
          status = 'Approved';
          approved++;
        } else if (match.status === 'Pending Review') {
          status = 'Pending';
          pending++;
        }
      }
      return {
        req,
        submission: match,
        status,
        dueDate: match ? match.expiryDate : 'Action Required',
      };
    });

    const defaultCount = activeRequirements.filter((r) => r.isDefault).length;
    const customCount = activeRequirements.filter((r) => !r.isDefault).length;
    const actionReq = total - approved - pending;
    const percentage = total > 0 ? Math.round((approved / total) * 100) : 100;
    const grade =
      percentage >= 90
        ? 'A+ Grade (Exemplary)'
        : percentage >= 60
          ? 'Grade B (Acceptable)'
          : 'Grade C (Action Due)';

    return { total, defaultCount, customCount, approved, pending, actionReq, percentage, grade, list };
  }, [activeRequirements, submissions]);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'agreement' | 'locations' | 'fees' | 'compliance'
  >('overview');

  const [franchise, setFranchise] = useState(() => {
    const partnerName =
      localStorage.getItem('digiflex_franchise_partner_name') || 'Grow Franchise';
    const contactPerson =
      localStorage.getItem('digiflex_franchise_contact_person') ||
      localStorage.getItem('digiflex_franchise_owner_name') ||
      'Authorized Representative';
    const parentSalonName =
      localStorage.getItem('digiflex_franchise_parent_salon') ||
      localStorage.getItem('digiflex_franchise_brand_name') ||
      'Grow Salon';
    const parentSalonLegal =
      localStorage.getItem('digiflex_franchise_parent_salon_legal') ||
      'Grow Wellness Pvt Ltd';
    const franchiseCode =
      localStorage.getItem('digiflex_franchise_code') || 'FRN-NEW-01';
    const assignedTerritory =
      localStorage.getItem('digiflex_franchise_region') || 'Indore & Malwa Region';
    const authorizedOutletsCount =
      Number(localStorage.getItem('digiflex_franchise_max_outlets') || 1);
    const royaltyModel =
      localStorage.getItem('digiflex_franchise_royalty') || '10% Gross Services + 5% Retail';
    const agreementDate =
      localStorage.getItem('digiflex_franchise_start_date') || '15 Jan 2024';
    const renewalDate =
      localStorage.getItem('digiflex_franchise_end_date') || '14 Jan 2029 (5-Year Term)';

    return {
      partnerName,
      contactPerson,
      parentSalonName,
      parentSalonLegal,
      franchiseCode,
      agreementNumber: 'AGR-2024-9901',
      agreementDate,
      renewalDate,
      status: 'Active · Verified',
      assignedTerritory,
      authorizedOutletsCount,
      royaltyModel,
      businessType: `Multi-Unit Master Franchise (${authorizedOutletsCount} Authorized Outlets)`,
    };
  });

  const [partnerOptions, setPartnerOptions] = useState<any[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(() => {
    return localStorage.getItem('digiflex_franchise_id') || '';
  });

  const defaultLocationsList: any[] = [];

  const [outlets, setOutlets] = useState<any[]>(defaultLocationsList);

  const applyPartner = (matched: any) => {
    if (!matched) return;
    const parentSalon =
      matched.tenant?.salonName ||
      matched.tenant?.tradeName ||
      matched.tenant?.name ||
      localStorage.getItem('digiflex_franchise_parent_salon') ||
      'Glamour Salon & Spa';
    const parentLegal =
      matched.tenant?.legalName ||
      localStorage.getItem('digiflex_franchise_parent_salon_legal') ||
      'Glamour Luxury Wellness Pvt Ltd';

    const partnerEntity =
      matched.companyName ||
      matched.entityName ||
      matched.name ||
      localStorage.getItem('digiflex_franchise_partner_name') ||
      'Grow Franchise';
    const contact =
      matched.contactPerson ||
      localStorage.getItem('digiflex_franchise_contact_person') ||
      'Authorized Representative';
    const code =
      matched.code ||
      localStorage.getItem('digiflex_franchise_code') ||
      'FRN-NEW-01';
    const territory =
      matched.territoryRegion ||
      matched.region ||
      matched.state ||
      localStorage.getItem('digiflex_franchise_region') ||
      'Indore & Malwa Region';
    const authLimit =
      matched.authorizedOutletsCount ||
      matched.maxOutlets ||
      Number(localStorage.getItem('digiflex_franchise_max_outlets') || 1);
    const royalty =
      matched.royaltyModel ||
      matched.royaltyStructure ||
      localStorage.getItem('digiflex_franchise_royalty') ||
      '10% Gross Services + 5% Retail';

    const agreementDate = matched.agreementStart
      ? new Date(matched.agreementStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : localStorage.getItem('digiflex_franchise_start_date') || '15 Jan 2024';

    const renewalDate = matched.agreementEnd
      ? new Date(matched.agreementEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : localStorage.getItem('digiflex_franchise_end_date') || '14 Jan 2029 (5-Year Term)';

    setFranchise((prev) => ({
      ...prev,
      partnerName: partnerEntity,
      contactPerson: contact,
      parentSalonName: parentSalon,
      parentSalonLegal: parentLegal,
      franchiseCode: code,
      assignedTerritory: territory,
      agreementDate,
      renewalDate,
      royaltyModel: royalty,
      authorizedOutletsCount: authLimit,
      businessType: `Multi-Unit Master Franchise (${authLimit} Authorized Outlets)`,
      status: matched.status === 'ACTIVE' || !matched.status ? 'Active · Verified' : matched.status,
    }));

    setSelectedPartnerId(matched.id);
    localStorage.setItem('digiflex_franchise_id', matched.id);
    localStorage.setItem('digiflex_franchise_partner_name', partnerEntity);
    localStorage.setItem('digiflex_franchise_contact_person', contact);
    localStorage.setItem('digiflex_franchise_owner_name', contact);
    localStorage.setItem('digiflex_franchise_parent_salon', parentSalon);
    localStorage.setItem('digiflex_franchise_parent_salon_legal', parentLegal);
    localStorage.setItem('digiflex_franchise_code', code);
    localStorage.setItem('digiflex_franchise_region', territory);
    localStorage.setItem('digiflex_franchise_max_outlets', String(authLimit));
    localStorage.setItem('digiflex_franchise_royalty', royalty);
    localStorage.setItem('digiflex_franchise_start_date', agreementDate);
    localStorage.setItem('digiflex_franchise_end_date', renewalDate);
    if (matched.tenantId) {
      tokenStorage.setTenantId(matched.tenantId);
      localStorage.setItem('digiflex_franchise_tenant_id', matched.tenantId);
    }

    tenantsApi.getFranchiseBranches(matched.id).then((fBranches) => {
      if (Array.isArray(fBranches) && fBranches.length > 0) {
        const mapped = fBranches.map((b: any, idx: number) => ({
          id: b.code || `LOC-0${idx + 1}`,
          name: b.name,
          seats: b.staffCount || 10,
          rev: b.revenue ? `₹${Number(b.revenue).toLocaleString('en-IN')}` : '₹14,20,000',
          manager: b.manager || 'Branch Lead',
          status: b.status === 'ACTIVE' || b.status === 'Active' ? 'Active' : 'Pending',
        }));
        setOutlets(mapped);
      }
    }).catch(() => { });
  };

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      try {
        const franchises = await tenantsApi.listFranchises();
        if (Array.isArray(franchises) && franchises.length > 0) {
          setPartnerOptions(franchises);
          const currentEmail = localStorage.getItem('digiflex_franchise_email');
          const currentFranchiseId = localStorage.getItem('digiflex_franchise_id');
          const currentPartnerName = localStorage.getItem('digiflex_franchise_partner_name');

          let matched = franchises.find(
            (f: any) =>
              (currentFranchiseId && f.id === currentFranchiseId) ||
              (currentEmail &&
                (f.contactEmail?.toLowerCase() === currentEmail?.toLowerCase() ||
                  f.email?.toLowerCase() === currentEmail?.toLowerCase())) ||
              (currentPartnerName &&
                (f.companyName?.toLowerCase() === currentPartnerName?.toLowerCase() ||
                  f.name?.toLowerCase() === currentPartnerName?.toLowerCase())),
          );

          if (!matched) {
            matched = franchises[0];
          }

          if (matched) {
            applyPartner(matched);
          }
        }
      } catch (err) {
        console.warn('Backend API fetch error in MyFranchisePage, using session state:', err);
      }
    };

    fetchPartnerInfo();
  }, []);

  const handlePartnerChange = (partnerId: string) => {
    const matched = partnerOptions.find((p) => p.id === partnerId);
    if (matched) {
      applyPartner(matched);
      toast(`Switched franchise view to ${matched.companyName || matched.name}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              {franchise.partnerName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {franchise.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-soft mt-1.5">
            <span className="inline-flex items-center gap-1.5 font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
              <Building className="w-3.5 h-3.5 text-purple-600" />
              Franchised Salon: <strong className="text-purple-900 font-bold">{franchise.parentSalonName}</strong>
            </span>
            <span className="hidden sm:inline text-soft/50">•</span>
            <span>
              Partner Code: <strong className="font-mono text-ink">{franchise.franchiseCode}</strong>
            </span>
            <span className="hidden sm:inline text-soft/50">•</span>
            <span>
              Territory: <strong className="text-ink">{franchise.assignedTerritory}</strong>
            </span>
          </div>
          <p className="text-[11px] text-soft mt-1">
            Master Franchise Agreement Terms, Legal Compliance, Fee Schedules, and Active Outlets.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {partnerOptions.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-soft">Partner:</span>
              <select
                value={selectedPartnerId}
                onChange={(e) => handlePartnerChange(e.target.value)}
                className="h-9 px-3 rounded-xl border border-[#5A2EA6]/25 bg-white text-xs font-bold text-[#5A2EA6] focus:outline-none focus:border-[#5A2EA6] shadow-2xs cursor-pointer"
              >
                {partnerOptions.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.companyName || po.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => toast('Download Agreement: Downloading Master Franchise Agreement PDF...')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Download Agreement PDF
          </button>
        </div>
      </div>

      {/* 5 TABS REQUESTED BY USER: Overview, Agreement, Locations, Fees, Compliance */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'agreement', label: 'Agreement' },
          { id: 'locations', label: `Locations (${outlets.length} / ${franchise.authorizedOutletsCount || 1})` },
          { id: 'fees', label: 'Fees & Royalty' },
          { id: 'compliance', label: `Compliance (${complianceStats.percentage}%)` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW (ALL 10 MASTER FIELDS + DEDICATED PARENT SALON SECTION) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* HERO MASTER CARD */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-lg space-y-5 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-purple-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-300" /> Master Franchise Partner
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-300" /> Franchise Taken From: {franchise.parentSalonName}
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white">{franchise.partnerName}</h2>
                <p className="text-xs text-purple-200">
                  Franchise Partner: <strong className="text-white">{franchise.partnerName}</strong> • Authorized Representative:{' '}
                  <strong className="text-white">{franchise.contactPerson}</strong> • Code:{' '}
                  <strong className="text-amber-300 font-mono">{franchise.franchiseCode}</strong>
                </p>
              </div>

              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-purple-200 block">
                  Assigned Territory
                </span>
                <span className="text-sm font-bold text-amber-300 block mt-0.5">
                  {franchise.assignedTerritory}
                </span>
              </div>
            </div>

            {/* 10 MASTER FIELDS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Franchise Partner Name
                </span>
                <strong className="text-white">{franchise.partnerName}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Franchised Salon Name
                </span>
                <strong className="text-amber-300 font-semibold">{franchise.parentSalonName}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Authorized Representative
                </span>
                <strong className="text-white">{franchise.contactPerson}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Franchise Code
                </span>
                <strong className="text-amber-300 font-mono">{franchise.franchiseCode}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Agreement Number
                </span>
                <strong className="text-white font-mono">{franchise.agreementNumber}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Agreement Date
                </span>
                <strong className="text-white">{franchise.agreementDate}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Renewal Date
                </span>
                <strong className="text-amber-300">{franchise.renewalDate}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  License Status
                </span>
                <strong className="text-emerald-400">{franchise.status}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Assigned Territory
                </span>
                <strong className="text-white">{franchise.assignedTerritory}</strong>
              </div>
              <div>
                <span className="text-purple-200 block text-[10px] uppercase font-bold">
                  Business Type
                </span>
                <strong className="text-white">{franchise.businessType}</strong>
              </div>
            </div>
          </div>

          {/* DEDICATED CALLOUT: SALON WHICH FRANCHISE IS TAKEN FROM */}
          <div className="bg-white rounded-2xl border border-purple-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 font-bold shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    Franchised Salon Network &amp; Parent Brand Details
                  </h3>
                  <p className="text-[11px] text-soft">
                    Corporate franchisor information and licensed brand credentials.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-lg font-semibold text-[11px]">
                Authorized Franchisee
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-paper/40 rounded-xl border border-line space-y-1">
                <span className="text-[10px] font-bold uppercase text-soft block">
                  Salon Brand Franchised
                </span>
                <div className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-purple-600" />
                  {franchise.parentSalonName}
                </div>
                <div className="text-[10px] text-soft">Primary Licensed Brand</div>
              </div>

              <div className="p-3.5 bg-paper/40 rounded-xl border border-line space-y-1">
                <span className="text-[10px] font-bold uppercase text-soft block">
                  Parent Franchisor Entity
                </span>
                <div className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  {franchise.parentSalonLegal}
                </div>
                <div className="text-[10px] text-soft">Corporate Franchisor HQ</div>
              </div>

              <div className="p-3.5 bg-paper/40 rounded-xl border border-line space-y-1">
                <span className="text-[10px] font-bold uppercase text-soft block">
                  Franchise Partner Entity
                </span>
                <div className="text-sm font-bold text-ink flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  {franchise.partnerName}
                </div>
                <div className="text-[10px] text-soft">
                  Authorized Lead: {franchise.contactPerson}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AGREEMENT */}
      {activeTab === 'agreement' && (
        <div className="bg-white p-6 rounded-2xl border border-line shadow-sm space-y-4">
          <h3 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" /> Master Agreement Terms &amp; Legal
            Clauses
          </h3>
          <div className="space-y-3 text-xs text-soft leading-relaxed">
            <div className="p-3.5 bg-paper/40 rounded-xl border border-line">
              <strong className="text-ink block font-bold mb-1">
                Clause 4.1 — Master Royalty Rate (8%)
              </strong>
              The Franchisee agrees to pay corporate HQ a monthly Master Royalty Fee equal to 8.0%
              of total gross sales generated across all active Bhopal outlets.
            </div>
            <div className="p-3.5 bg-paper/40 rounded-xl border border-line">
              <strong className="text-ink block font-bold mb-1">
                Clause 4.2 — National Marketing Fund (2%)
              </strong>
              The Franchisee contributes 2.0% of monthly gross revenue to the National Marketing
              Fund for national TV, PR, and digital brand marketing.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATIONS */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="p-4 border-b border-line">
            <h3 className="text-base font-bold text-ink flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" /> Active Franchise Outlets ({outlets.length} {outlets.length === 1 ? 'Outlet' : 'Outlets'})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase font-semibold border-b border-line">
                  <th className="p-3">Outlet Ref &amp; Name</th>
                  <th className="p-3">Branch Manager</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Monthly Revenue</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {outlets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-soft italic">
                      No active franchise outlets found.
                    </td>
                  </tr>
                ) : (
                  outlets.map((loc) => (
                    <tr key={loc.id} className="hover:bg-purple-50/30">
                      <td className="p-3 font-bold text-purple-700">
                        {loc.name} <div className="text-[10px] text-soft">{loc.id}</div>
                      </td>
                      <td className="p-3 font-semibold text-ink">{loc.manager}</td>
                      <td className="p-3 font-bold text-purple-900">{loc.seats} Seats</td>
                      <td className="p-3 font-bold text-emerald-700">{loc.rev}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                          {loc.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEES */}
      {activeTab === 'fees' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
          <h3 className="text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-2">
            <CreditCard className="w-4 h-4 text-purple-600" /> Franchise Royalty Fee Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-[10px] font-bold uppercase text-purple-800 block">
                Agreed Royalty &amp; Commission Model
              </span>
              <div className="text-base font-bold text-purple-950 mt-1">
                {franchise.royaltyModel}
              </div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                Authorized Branch Capacity
              </span>
              <div className="text-base font-bold text-emerald-950 mt-1">
                {outlets.length} / {franchise.authorizedOutletsCount} Outlets Registered
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPLIANCE */}
      {activeTab === 'compliance' && (
        <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
            <div>
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" /> HQ Brand Compliance Score &amp; Audits
              </h3>
              <p className="text-xs text-soft mt-0.5">
                Real-time compliance ledger, statutory clearance certificates, and network audit tracking.
              </p>
            </div>
            <button
              onClick={() => navigate('/compliance')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#5A2EA6] text-white hover:bg-[#482387] cursor-pointer transition shadow-2xs self-start sm:self-auto"
            >
              Open Full Compliance Desk →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/80">
              <span className="text-[10px] font-bold text-purple-800 uppercase block">Compliance Score</span>
              <div className="text-2xl font-bold text-[#5A2EA6] mt-0.5">{complianceStats.percentage}% Rating</div>
              <span className="text-[10px] font-semibold text-purple-700">
                {complianceStats.defaultCount} Default · {complianceStats.customCount} Custom Admin
              </span>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Verified &amp; Cleared</span>
              <div className="text-2xl font-bold text-emerald-950 mt-0.5">{complianceStats.approved} Standards</div>
              <span className="text-[10px] font-semibold text-emerald-700">Audit Passed</span>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">In Review by HQ</span>
              <div className="text-2xl font-bold text-amber-950 mt-0.5">{complianceStats.pending} Submissions</div>
              <span className="text-[10px] font-semibold text-amber-700">Awaiting Approval</span>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/80">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">Action Due / Missing</span>
              <div className="text-2xl font-bold text-rose-950 mt-0.5">{complianceStats.actionReq} Items</div>
              <span className="text-[10px] font-semibold text-rose-700">Upload Required</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-line rounded-xl mt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft font-semibold border-b border-line">
                  <th className="p-2.5">Requirement Standard</th>
                  <th className="p-2.5 text-center">Origin</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Scope</th>
                  <th className="p-2.5">Due / Expiry Date</th>
                  <th className="p-2.5">Audit Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {complianceStats.list.map(({ req, submission, status, dueDate }) => (
                  <tr key={req.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-2.5 font-bold text-[#5A2EA6]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] px-1 py-0.2 bg-purple-50 text-purple-900 rounded border border-purple-200">
                          {req.id}
                        </span>
                        <span>{req.name}</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-center whitespace-nowrap">
                      {req.isDefault ? (
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-purple-100 text-[#5A2EA6] border border-purple-200">
                          Default Standard
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1 shadow-2xs">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Custom (Admin Added)
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-soft">{req.category}</td>
                    <td className="p-2.5 text-soft">
                      {req.level === 'outlet' ? 'Outlet Specific' : req.level === 'entity' ? 'Entity Licensee' : 'Universal'}
                    </td>
                    <td className="p-2.5 font-medium text-ink">{dueDate}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => navigate('/compliance')}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer"
                      >
                        {status === 'Approved' ? 'Manage' : 'Upload Clearance'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
