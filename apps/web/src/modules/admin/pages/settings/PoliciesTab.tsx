import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  FileText,
  Filter,
  History,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface PolicyVersion {
  version: string;
  effectiveDate: string;
  changedBy: string;
  changeSummary: string;
  status: 'Active' | 'Superceded' | 'Archived';
}

export interface BrandPolicy {
  id: string;
  name: string;
  category: string;
  description: string;
  scope: 'Brand-wide' | 'Selected Branches';
  applicableBranches: string;
  effectiveDate: string;
  status: 'Active' | 'Draft' | 'Archived';
  lastUpdated: string;
  updatedBy: string;
  versions: PolicyVersion[];
}

const initialPolicies: BrandPolicy[] = [
  {
    id: 'POL-001',
    name: 'Salon Service & Retail Pricing Governance Policy',
    category: 'Pricing Policy',
    description:
      'Governs base catalog rates, multi-branch tier deviations (+15% Flagship max), and mandatory GST inclusive/exclusive displays.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '01 Apr 2026',
    status: 'Active',
    lastUpdated: '12 Aug 2026',
    updatedBy: 'Rahul Sharma (CFO)',
    versions: [
      {
        version: 'v2.1',
        effectiveDate: '01 Apr 2026',
        changedBy: 'Rahul Sharma',
        changeSummary: 'Updated Flagship tier surcharge limit to 15%',
        status: 'Active',
      },
      {
        version: 'v2.0',
        effectiveDate: '01 Jan 2026',
        changedBy: 'Ananya Shah',
        changeSummary: 'Initial unified multi-branch pricing matrix',
        status: 'Superceded',
      },
    ],
  },
  {
    id: 'POL-002',
    name: 'Discretionary Cashier & Manager Discount Policy',
    category: 'Discount Policy',
    description:
      'Restricts cashier self-authorized discount to max 10%. Any discount between 10%-20% requires Manager PIN; >20% requires HO sanction.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '15 May 2026',
    status: 'Active',
    lastUpdated: '15 May 2026',
    updatedBy: 'Ananya Shah (Super Director)',
    versions: [
      {
        version: 'v1.4',
        effectiveDate: '15 May 2026',
        changedBy: 'Ananya Shah',
        changeSummary: 'Added OTP authorization for manager discounts >15%',
        status: 'Active',
      },
    ],
  },
  {
    id: 'POL-003',
    name: 'Customer Service & Product Refund Protocol',
    category: 'Refund Policy',
    description:
      'Completed salon services are strictly non-refundable in cash; dissatisfied clients receive complimentary touch-up or store credit note within 7 days.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '01 Jun 2026',
    status: 'Active',
    lastUpdated: '01 Jun 2026',
    updatedBy: 'Priya Patel (Legal / HR)',
    versions: [
      {
        version: 'v3.0',
        effectiveDate: '01 Jun 2026',
        changedBy: 'Priya Patel',
        changeSummary: 'Aligned credit note validity to 90 rolling days',
        status: 'Active',
      },
    ],
  },
  {
    id: 'POL-004',
    name: 'Prepaid Treatment Package Validity & Breakage Policy',
    category: 'Package Validity Policy',
    description:
      'Prepaid session bundles carry 90-day expiration (180 days for Bridal combo). Sessions are transferable to immediate family upon written request.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '10 Feb 2026',
    status: 'Active',
    lastUpdated: '20 Jul 2026',
    updatedBy: 'Amit Deshmukh (Operations)',
    versions: [
      {
        version: 'v1.2',
        effectiveDate: '10 Feb 2026',
        changedBy: 'Amit Deshmukh',
        changeSummary: 'Extended bridal package expiration from 120d to 180d',
        status: 'Active',
      },
    ],
  },
  {
    id: 'POL-005',
    name: '  Elite Club Membership Terms & Points Expiry',
    category: 'Membership Policy',
    description:
      'Annual membership fee provides 20% flat discount on services and 10% on retail. Accrued loyalty points expire annually on 31st March.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '01 Apr 2026',
    status: 'Active',
    lastUpdated: '01 Apr 2026',
    updatedBy: 'Ananya Shah (Super Director)',
    versions: [
      {
        version: 'v2.0',
        effectiveDate: '01 Apr 2026',
        changedBy: 'Ananya Shah',
        changeSummary: 'Introduced Tier-1 VIP Black Card status',
        status: 'Active',
      },
    ],
  },
  {
    id: 'POL-006',
    name: 'Chemical Treatment & Skin Therapy Digital Consent Policy',
    category: 'Consent Policy',
    description:
      'Mandatory digital patch test sign-off on POS tablet prior to Hair Rebonding, Balayage Bleach, Hydra Dermabrasion, or Chemical Peels.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '01 Mar 2026',
    status: 'Active',
    lastUpdated: '18 Jun 2026',
    updatedBy: 'Pooja Sharma (Senior Aesthetician)',
    versions: [
      {
        version: 'v1.1',
        effectiveDate: '01 Mar 2026',
        changedBy: 'Pooja Sharma',
        changeSummary: 'Integrated tablet stylus signature storage',
        status: 'Active',
      },
    ],
  },
  {
    id: 'POL-007',
    name: 'Client Slot No-Show & Habitual Lapsed Policy',
    category: 'No-show Policy',
    description:
      'Clients with 2 consecutive unexcused no-shows require 50% non-refundable advance booking deposit for all weekend slots.',
    scope: 'Selected Branches',
    applicableBranches: 'Vijay Nagar Flagship, Palasia Studio',
    effectiveDate: '15 Jul 2026',
    status: 'Active',
    lastUpdated: '15 Jul 2026',
    updatedBy: 'Amit Deshmukh (Operations)',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '15 Jul 2026',
        changedBy: 'Amit Deshmukh',
        changeSummary: 'Introduced deposit requirement for peak weekend hours',
        status: 'Active',
      },
    ],
  },
  {
    id: 'POL-008',
    name: 'Appointment Cancellation & Rescheduling Window',
    category: 'Cancellation Policy',
    description:
      'Free cancellation or slot reschedule permitted up to 2 hours prior to scheduled appointment start time without penalty.',
    scope: 'Brand-wide',
    applicableBranches: 'All 6 Network Salons',
    effectiveDate: '01 Jan 2026',
    status: 'Active',
    lastUpdated: '01 Jan 2026',
    updatedBy: 'Ananya Shah (Super Director)',
    versions: [
      {
        version: 'v1.0',
        effectiveDate: '01 Jan 2026',
        changedBy: 'Ananya Shah',
        changeSummary: 'Standard 2-hour cancellation notice window',
        status: 'Active',
      },
    ],
  },
];

export function PoliciesTab() {
  const [policies, setPolicies] = useState<BrandPolicy[]>(initialPolicies);
  const [selectedPolicyForDossier, setSelectedPolicyForDossier] = useState<BrandPolicy | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (selectedPolicyForDossier) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPolicyForDossier]);

  const togglePolicyStatus = (id: string) => {
    setPolicies(
      policies.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Draft' : 'Active';
          showToast(`Policy "${p.name}" status updated to ${nextStatus}.`);
          return { ...p, status: nextStatus };
        }
        return p;
      }),
    );
  };

  const filteredPolicies = policies.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchTerm) {
      const match = `${p.name} ${p.category} ${p.description}`.toLowerCase();
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

      {/* Header & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif font-bold text-ink text-lg">
            Brand Operational Policies Register
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Standard operating procedures governing pricing, refunds, memberships, digital consent,
            and client no-shows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink outline-none placeholder:text-muted w-48"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Policy Statuses</option>
            <option value="Active">Active Operational</option>
            <option value="Draft">Draft Review</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Master Policies Table (Section 4 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Configurable Policies &amp; Governance Matrix
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {filteredPolicies.length} Policies
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Strictly aligned with PRD categories: Pricing, Discounts, Refunds, Packages,
              Memberships, Consent, No-shows, Cancellations
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Policy Name &amp; Category</th>
                <th className="p-3.5">Scope &amp; Applicability</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Effective Date</th>
                <th className="p-3.5">Last Revised By</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredPolicies.map((p) => (
                <tr key={p.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap max-w-sm">
                    <strong className="font-bold text-ink block text-xs truncate">{p.name}</strong>
                    <span className="text-[10px] text-[#5A2EA6] font-semibold">{p.category}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold border block w-fit mb-0.5',
                        p.scope === 'Brand-wide'
                          ? 'bg-purple-50 text-[#5A2EA6] border-purple-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200',
                      )}
                    >
                      {p.scope}
                    </span>
                    <span className="text-[10px] text-muted">{p.applicableBranches}</span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        p.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200',
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-mono text-slate-800 text-[11px]">
                    {p.effectiveDate}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 text-[11px]">
                    <span className="font-semibold block">{p.updatedBy}</span>
                    <span className="text-[9px] text-muted">{p.lastUpdated}</span>
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPolicyForDossier(p)}
                        className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => togglePolicyStatus(p.id)}
                        className="h-[28px] px-2 rounded-lg text-[10px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                        title={p.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {p.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 5 PRD: POLICY DETAILS & VERSION HISTORY DOSSIER MODAL */}
      {selectedPolicyForDossier &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedPolicyForDossier(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Policy Dossier
                    </span>
                    <span className="text-xs font-semibold text-soft">
                      {selectedPolicyForDossier.category}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">
                    {selectedPolicyForDossier.name}
                  </h3>
                  <p className="text-xs text-muted">
                    Complete policy provisions, scope of applicability, and full audit version
                    history
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPolicyForDossier(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs">
                {/* 1. Policy Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
                    <span className="text-[9px] text-soft block uppercase font-bold">Scope</span>
                    <strong className="text-ink text-xs font-bold mt-0.5 block">
                      {selectedPolicyForDossier.scope}
                    </strong>
                    <span className="text-[9px] text-muted">
                      {selectedPolicyForDossier.applicableBranches}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
                    <span className="text-[9px] text-soft block uppercase font-bold">
                      Effective Date
                    </span>
                    <strong className="text-ink text-xs font-mono font-bold mt-0.5 block">
                      {selectedPolicyForDossier.effectiveDate}
                    </strong>
                    <span className="text-[9px] text-emerald-700 font-semibold">
                      ● Active Enforcement
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15">
                    <span className="text-[9px] text-soft block uppercase font-bold">
                      Last Revised
                    </span>
                    <strong className="text-ink text-xs font-bold mt-0.5 block">
                      {selectedPolicyForDossier.updatedBy}
                    </strong>
                    <span className="text-[9px] text-muted">
                      {selectedPolicyForDossier.lastUpdated}
                    </span>
                  </div>
                </div>

                {/* 2. Policy Provisions Text */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Standard Operating Provision
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {selectedPolicyForDossier.description}
                  </p>
                </div>

                {/* 3. Section 5 PRD: Complete Version History Timeline */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#5A2EA6]" />
                    <h4 className="font-serif font-bold text-ink text-sm">
                      Policy Version &amp; Revision History
                    </h4>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-soft font-bold text-[9px] tracking-wider uppercase">
                          <th className="p-2.5 pl-3">Version</th>
                          <th className="p-2.5">Effective Date</th>
                          <th className="p-2.5">Revised By</th>
                          <th className="p-2.5">Change Summary</th>
                          <th className="p-2.5 pr-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {selectedPolicyForDossier.versions.map((v, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 pl-3 font-mono font-bold text-[#5A2EA6]">
                              {v.version}
                            </td>
                            <td className="p-2.5 font-mono text-slate-800">{v.effectiveDate}</td>
                            <td className="p-2.5 text-slate-900 font-semibold">{v.changedBy}</td>
                            <td className="p-2.5 text-slate-700">{v.changeSummary}</td>
                            <td className="p-2.5 pr-3 text-right">
                              <span
                                className={cn(
                                  'px-2 py-0.2 rounded-full text-[9px] font-bold border',
                                  v.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-slate-100 text-slate-600',
                                )}
                              >
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPolicyForDossier(null)}
                  className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
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
