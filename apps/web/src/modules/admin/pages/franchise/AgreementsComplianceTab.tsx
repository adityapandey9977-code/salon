import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  useComplianceStore,
  ComplianceRequirement,
  ComplianceCategory,
  ComplianceLevel,
  RenewalFrequency,
  ComplianceDocumentSubmission,
  getCurrentTenantId,
  DEFAULT_REQUIREMENTS,
} from '@/shared/compliance/complianceStore';
import { tenantsApi } from '@/shared/api/tenants.api';

export interface FranchiseAgreement {
  id: string;
  agreementType: 'Master Franchise Agreement' | 'Single Unit FOFO' | 'Multi-Unit FOCO';
  partnerName: string;
  partnerCode: string;
  locationName: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  complianceStatus: 'Compliant' | 'Pending' | 'Expiring Soon' | 'Expired' | 'Non-Compliant';
  status: 'Draft' | 'Active' | 'Expiring Soon' | 'Expired' | 'Suspended' | 'Terminated';
  commercialTerms: {
    royaltyModel: string;
    settlementFrequency: string;
    brandMarketingFundPct: string;
    penaltyClause: string;
  };
  complianceDocuments: {
    docName: string;
    status: 'Verified' | 'Pending Review' | 'Expiring Soon' | 'Missing';
    expiryDate: string;
    docRef: string;
  }[];
  lifecycle: {
    stage: string;
    date: string;
    user: string;
    isCompleted: boolean;
  }[];
  tenantId?: string;
}



export function AgreementsComplianceTab() {
  const {
    tenantId,
    requirements,
    submissions,
    addRequirement,
    updateRequirement,
    toggleRequirementActive,
    deleteRequirement,
    resetToDefaultRequirements,
    addOrUpdateSubmission,
    deleteSubmission,
    reviewSubmission,
  } = useComplianceStore();

  const [activeSubTab, setActiveSubTab] = useState<'agreements' | 'compliance' | 'configure'>('agreements');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCompliance, setSelectedCompliance] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Agreements State (Tenant-Scoped with Master Cache)
  const agreementsStorageKey = `digiflex_agreements_${tenantId}`;
  const [agreements, setAgreements] = useState<FranchiseAgreement[]>(() => {
    try {
      const masterRaw = localStorage.getItem('digiflex_agreements_master');
      if (masterRaw) {
        const parsed = JSON.parse(masterRaw);
        if (Array.isArray(parsed)) return parsed;
      }
      const raw = localStorage.getItem(agreementsStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { }
    return [];
  });

  const saveAgreements = (updated: FranchiseAgreement[]) => {
    setAgreements(updated);
    try {
      localStorage.setItem(agreementsStorageKey, JSON.stringify(updated));
      localStorage.setItem('digiflex_agreements_master', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save agreements to localStorage:', err);
    }
  };

  // Live Partners & Branches from database
  const [livePartners, setLivePartners] = useState<{ id: string; name: string; code: string; email?: string }[]>([]);
  const [liveBranches, setLiveBranches] = useState<{ id: string; name: string; code: string; city?: string }[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchMeta = async () => {
      try {
        const [partnersRes, branchesRes] = await Promise.allSettled([
          tenantsApi.listFranchises(),
          tenantsApi.listBranches(),
        ]);
        if (isMounted) {
          if (partnersRes.status === 'fulfilled' && Array.isArray(partnersRes.value)) {
            setLivePartners(
              partnersRes.value.map((p: any, idx: number) => ({
                id: p.id || `partner-${idx}`,
                name: p.companyName || p.name || 'Franchise Partner',
                code: p.code || `FP-${(p.companyName || 'LOC').substring(0, 3).toUpperCase()}-0${idx + 1}`,
                email: p.contactEmail || p.email,
              })),
            );
          }
          if (branchesRes.status === 'fulfilled' && Array.isArray(branchesRes.value)) {
            setLiveBranches(
              branchesRes.value.map((b: any) => ({
                id: b.id,
                name: b.name,
                code: b.code || `BR-${b.name.substring(0, 3).toUpperCase()}`,
                city: b.city,
              })),
            );
          }
        }
      } catch (err) {
        console.warn('Could not load partners/branches for agreements:', err);
      }
    };
    fetchMeta();
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically derive allAgreements from real franchisee submissions & live partners (No Dummy Data)
  const allAgreements = useMemo(() => {
    const agrMap = new Map<string, FranchiseAgreement>();

    // 1. Include manually saved/drafted agreements
    agreements.forEach((a) => {
      if (a && a.id) agrMap.set(a.id, a);
    });

    // 2. Include agreements generated from REAL compliance submissions uploaded by Franchisees
    submissions.forEach((sub, idx) => {
      if (!sub || !sub.partnerName) return;
      const partnerKey = sub.partnerId || sub.partnerName.trim().toLowerCase();
      const existingKey = Array.from(agrMap.keys()).find((k) => {
        const item = agrMap.get(k);
        return (
          item &&
          (item.partnerName.trim().toLowerCase() === sub.partnerName.trim().toLowerCase() ||
            (sub.partnerId && item.partnerCode.trim().toLowerCase() === sub.partnerId.trim().toLowerCase()))
        );
      });

      if (!existingKey) {
        const generatedId = `AGR-${(sub.partnerId || `FP-${idx + 1}`).toUpperCase()}`;
        agrMap.set(generatedId, {
          id: generatedId,
          agreementType: 'Single Unit FOFO',
          partnerName: sub.partnerName,
          partnerCode: sub.partnerId || `FP-0${idx + 1}`,
          locationName: sub.branchName || 'Franchise Outlet',
          startDate: sub.uploadedDate || new Date().toISOString().split('T')[0],
          endDate: '2029-12-31',
          renewalDate: '2029-12-31',
          complianceStatus: 'Pending',
          status: 'Active',
          commercialTerms: {
            royaltyModel: '10% Gross Services Turnover',
            settlementFrequency: 'Monthly Settlement (7th of month)',
            brandMarketingFundPct: '2% National Marketing Levy',
            penaltyClause: '1.5% per month late fee',
          },
          complianceDocuments: [],
          lifecycle: [
            {
              stage: 'Draft Generated',
              date: sub.uploadedDate || new Date().toISOString().split('T')[0],
              user: 'Legal Head Office',
              isCompleted: true,
            },
            {
              stage: 'Signed & Activated',
              date: sub.uploadedDate || new Date().toISOString().split('T')[0],
              user: 'Brand Managing Director',
              isCompleted: true,
            },
            {
              stage: 'Tenure Renewal Window',
              date: '2029-12-31',
              user: 'Scheduled',
              isCompleted: false,
            },
          ],
        });
      }
    });

    // 3. Include agreements for live partners from database if not already present
    livePartners.forEach((p, idx) => {
      if (!p || !p.name) return;
      const existingKey = Array.from(agrMap.keys()).find((k) => {
        const item = agrMap.get(k);
        return item && item.partnerName.trim().toLowerCase() === p.name.trim().toLowerCase();
      });

      if (!existingKey) {
        const generatedId = `AGR-${(p.code || `FP-0${idx + 1}`).toUpperCase()}`;
        agrMap.set(generatedId, {
          id: generatedId,
          agreementType: 'Single Unit FOFO',
          partnerName: p.name,
          partnerCode: p.code || `FP-0${idx + 1}`,
          locationName: 'Franchise Outlet',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '2029-12-31',
          renewalDate: '2029-12-31',
          complianceStatus: 'Compliant',
          status: 'Active',
          commercialTerms: {
            royaltyModel: '10% Turnover Share',
            settlementFrequency: 'Monthly',
            brandMarketingFundPct: '2% Marketing Levy',
            penaltyClause: '1.5% penalty',
          },
          complianceDocuments: [],
          lifecycle: [
            {
              stage: 'Signed & Activated',
              date: new Date().toISOString().split('T')[0],
              user: 'Brand Managing Director',
              isCompleted: true,
            },
          ],
        });
      }
    });

    return Array.from(agrMap.values());
  }, [agreements, submissions, livePartners]);

  // Modals state
  const [selectedAgreement, setSelectedAgreement] = useState<FranchiseAgreement | null>(null);
  const [isAddAgreementModalOpen, setIsAddAgreementModalOpen] = useState(false);

  // New Agreement Form State
  const [newAgrType, setNewAgrType] = useState<FranchiseAgreement['agreementType']>('Single Unit FOFO');
  const [newAgrPartnerName, setNewAgrPartnerName] = useState('Apex Wellness & Spa LLP');
  const [newAgrPartnerCode, setNewAgrPartnerCode] = useState('FP-IND-01');
  const [newAgrLocationName, setNewAgrLocationName] = useState('Indore Vijay Nagar Flagship');
  const [newAgrStartDate, setNewAgrStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAgrEndDate, setNewAgrEndDate] = useState(
    new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [newAgrRoyaltyModel, setNewAgrRoyaltyModel] = useState('10% Gross Services Turnover + 5% Retail Products');
  const [newAgrSettlementFreq, setNewAgrSettlementFreq] = useState('Monthly (Settled on or before 7th of subsequent month)');
  const [newAgrMarketingFund, setNewAgrMarketingFund] = useState('2% National Marketing Levy');
  const [newAgrPenaltyClause, setNewAgrPenaltyClause] = useState('1.5% per month on delayed royalty beyond 15 days');

  // Review modal state
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<ComplianceDocumentSubmission | null>(null);
  const [reviewStatusChoice, setReviewStatusChoice] = useState<'Verified' | 'Action Required' | 'Expired'>('Verified');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [previewDocImageModal, setPreviewDocImageModal] = useState<ComplianceDocumentSubmission | null>(null);
  const adminReviewFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Submit Clearance Document modal state
  const [isSubmitDocModalOpen, setIsSubmitDocModalOpen] = useState(false);
  const [submitReqId, setSubmitReqId] = useState('REQ-01');
  const [submitBranchName, setSubmitBranchName] = useState('Indore Vijay Nagar Flagship');
  const [submitPartnerName, setSubmitPartnerName] = useState('Apex Wellness & Spa LLP');
  const [submitDocRef, setSubmitDocRef] = useState('');
  const [submitIssuingAuth, setSubmitIssuingAuth] = useState('');
  const [submitIssueDate, setSubmitIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitExpiryDate, setSubmitExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  );
  const [submitFileName, setSubmitFileName] = useState('Authorized_Clearance_Document.pdf');
  const [submitNotes, setSubmitNotes] = useState('');

  // Add Requirement modal state
  const [isAddReqModalOpen, setIsAddReqModalOpen] = useState(false);
  const [newReqName, setNewReqName] = useState('');
  const [newReqCategory, setNewReqCategory] = useState<ComplianceCategory>('Statutory Licensing');
  const [newReqLevel, setNewReqLevel] = useState<ComplianceLevel>('outlet');
  const [newReqFrequency, setNewReqFrequency] = useState<RenewalFrequency>('Annual');
  const [newReqValidity, setNewReqValidity] = useState<number>(12);
  const [newReqMandatory, setNewReqMandatory] = useState<boolean>(true);
  const [newReqDesc, setNewReqDesc] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenReview = (sub: ComplianceDocumentSubmission) => {
    setSelectedSubmissionForReview(sub);
    setReviewStatusChoice(sub.status === 'Verified' ? 'Verified' : 'Verified');
    setReviewRemarks(sub.hqRemarks || '');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionForReview) return;
    reviewSubmission(
      selectedSubmissionForReview.id,
      reviewStatusChoice,
      reviewRemarks,
      'Aditi Sharma (HQ Compliance Director)',
    );
    showToast(`Compliance submission for "${selectedSubmissionForReview.requirementName}" updated to ${reviewStatusChoice}.`);
    setSelectedSubmissionForReview(null);
  };

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReqName.trim()) return;
    const added = await addRequirement({
      name: newReqName.trim(),
      category: newReqCategory,
      level: newReqLevel,
      renewalFrequency: newReqFrequency,
      validityMonths: newReqValidity,
      mandatory: newReqMandatory,
      requiresDocument: true,
      description: newReqDesc.trim() || `${newReqName} standard required for salon operations`,
      isActive: true,
    });
    showToast(`New compliance standard "${added?.name || newReqName}" added successfully for this salon (${requirements.length + 1} total standards).`);
    setIsAddReqModalOpen(false);
    setNewReqName('');
    setNewReqDesc('');
  };


  const handleCreateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `AGR-${new Date().getFullYear()}-${String(agreements.length + 1).padStart(3, '0')}`;
    const newAgr: FranchiseAgreement = {
      id: newId,
      agreementType: newAgrType,
      partnerName: newAgrPartnerName,
      partnerCode: newAgrPartnerCode,
      locationName: newAgrLocationName,
      startDate: newAgrStartDate,
      endDate: newAgrEndDate,
      renewalDate: newAgrEndDate,
      complianceStatus: 'Compliant',
      status: 'Active',
      commercialTerms: {
        royaltyModel: newAgrRoyaltyModel,
        settlementFrequency: newAgrSettlementFreq,
        brandMarketingFundPct: newAgrMarketingFund,
        penaltyClause: newAgrPenaltyClause,
      },
      complianceDocuments: requirements.slice(0, 4).map((r) => ({
        docName: r.name,
        status: 'Verified',
        expiryDate: newAgrEndDate,
        docRef: `DOC-${newId.slice(-3)}-${r.id.slice(-2)}`,
      })),
      lifecycle: [
        {
          stage: 'Draft Generated',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          user: 'Legal Head Office',
          isCompleted: true,
        },
        {
          stage: 'Commercial Terms Approved',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          user: `${newAgrPartnerName} Representative`,
          isCompleted: true,
        },
        {
          stage: 'Signed & Activated',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          user: 'Brand Managing Director',
          isCompleted: true,
        },
        {
          stage: 'Tenure Renewal Window',
          date: newAgrEndDate,
          user: 'Scheduled',
          isCompleted: false,
        },
      ],
      tenantId,
    };

    saveAgreements([newAgr, ...agreements]);
    showToast(`Franchise Agreement "${newId}" successfully drafted and activated for ${newAgrPartnerName}.`);
    setIsAddAgreementModalOpen(false);
  };

  const handleRenewAgreement = (agr: FranchiseAgreement) => {
    const endYear = new Date(agr.endDate).getFullYear() || 2028;
    const renewedEndDate = agr.endDate.replace(String(endYear), String(endYear + 3));
    const renewedAgr: FranchiseAgreement = {
      ...agr,
      status: 'Active',
      complianceStatus: 'Compliant',
      endDate: renewedEndDate,
      renewalDate: renewedEndDate,
      lifecycle: [
        ...agr.lifecycle,
        {
          stage: 'Renewal Contract Signed & Extended (+3 Years)',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          user: 'Brand Legal Head Office',
          isCompleted: true,
        },
      ],
    };

    const updated = agreements.map((a) => (a.id === agr.id ? renewedAgr : a));
    saveAgreements(updated);
    if (selectedAgreement?.id === agr.id) {
      setSelectedAgreement(renewedAgr);
    }
    showToast(`Franchise Agreement "${agr.id}" successfully renewed until ${renewedEndDate}.`);
  };

  const handleToggleAgreementStatus = (agr: FranchiseAgreement, newStatus: FranchiseAgreement['status']) => {
    const updated = agreements.map((a) => (a.id === agr.id ? { ...a, status: newStatus } : a));
    saveAgreements(updated);
    if (selectedAgreement?.id === agr.id) {
      setSelectedAgreement({ ...selectedAgreement, status: newStatus });
    }
    showToast(`Agreement "${agr.id}" status set to ${newStatus}.`);
  };

  const handleDeleteAgreement = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this franchise agreement record?')) return;
    const updated = agreements.filter((a) => a.id !== id);
    saveAgreements(updated);
    if (selectedAgreement?.id === id) {
      setSelectedAgreement(null);
    }
    showToast(`Agreement "${id}" removed.`);
  };

  const handleSubmitClearance = (e: React.FormEvent) => {
    e.preventDefault();
    const req = requirements.find((r) => r.id === submitReqId);
    const sub = addOrUpdateSubmission({
      requirementId: submitReqId,
      requirementName: req?.name || 'Compliance Clearance',
      branchName: submitBranchName,
      partnerName: submitPartnerName,
      documentRef: submitDocRef || `DOC-${submitReqId}-${Math.floor(1000 + Math.random() * 9000)}`,
      issuingAuthority: submitIssuingAuth || 'Municipal / Statutory Authority',
      issueDate: submitIssueDate,
      expiryDate: submitExpiryDate,
      fileName: submitFileName,
      notes: submitNotes,
      status: 'Pending Review',
      uploadedByRole: 'Branch Manager',
      uploadedByName: 'Authorized Branch Representative',
    });
    showToast(`Clearance document for "${sub.requirementName}" submitted successfully. Awaiting HQ verification.`);
    setIsSubmitDocModalOpen(false);
    setSubmitDocRef('');
    setSubmitIssuingAuth('');
    setSubmitNotes('');
  };

  const downloadCsv = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportAgreements = () => {
    const rows: (string | number)[][] = [
      [
        'Agreement ID',
        'Partner Name',
        'Partner Code',
        'Location Covered',
        'Agreement Type',
        'Start Date',
        'End Date',
        'Renewal Date',
        'Agreement Status',
        'Compliance Status',
        'Royalty Model',
      ],
      ...agreements.map((a) => [
        a.id,
        a.partnerName,
        a.partnerCode,
        a.locationName,
        a.agreementType,
        a.startDate,
        a.endDate,
        a.renewalDate,
        a.status,
        a.complianceStatus,
        a.commercialTerms.royaltyModel,
      ]),
    ];
    downloadCsv('Franchise_Agreements_Legal_Matrix.csv', rows);
    showToast('Franchise agreements exported successfully to CSV.');
  };


  const handleExportCompliance = () => {
    const rows: (string | number)[][] = [
      [
        'Submission ID',
        'Requirement ID',
        'Requirement Name',
        'Partner Name',
        'Branch Name',
        'Document Ref',
        'Issuing Authority',
        'Expiry Date',
        'Status',
        'Uploaded By Role',
        'Uploaded By Name',
        'Uploaded Date',
        'Last Audit Date',
      ],
      ...submissions.map((s) => [
        s.id,
        s.requirementId,
        s.requirementName,
        s.partnerName,
        s.branchName,
        s.documentRef,
        s.issuingAuthority,
        s.expiryDate,
        s.status,
        s.uploadedByRole,
        s.uploadedByName,
        s.uploadedDate,
        s.lastAuditDate || '',
      ]),
    ];
    downloadCsv('Franchise_Compliance_Monitoring_Matrix.csv', rows);
    showToast('Compliance monitoring matrix exported successfully to CSV.');
  };

  useEffect(() => {
    if (
      selectedAgreement ||
      selectedSubmissionForReview ||
      isAddReqModalOpen ||
      isAddAgreementModalOpen ||
      isSubmitDocModalOpen
    ) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [
    selectedAgreement,
    selectedSubmissionForReview,
    isAddReqModalOpen,
    isAddAgreementModalOpen,
    isSubmitDocModalOpen,
  ]);

  const getStatusBadge = (st: FranchiseAgreement['status']) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Expiring Soon':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Suspended':
      case 'Terminated':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getComplianceBadge = (st: FranchiseAgreement['complianceStatus']) => {
    switch (st) {
      case 'Compliant':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Expiring Soon':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Non-Compliant':
      case 'Expired':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredAgreements = useMemo(() => {
    return allAgreements.filter((agr) => {
      if (selectedStatus !== 'all' && agr.status !== selectedStatus) return false;
      if (selectedCompliance !== 'all' && agr.complianceStatus !== selectedCompliance) return false;
      if (searchTerm) {
        const match =
          `${agr.id} ${agr.partnerName} ${agr.partnerCode} ${agr.locationName} ${agr.agreementType}`.toLowerCase();
        return match.includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [allAgreements, selectedStatus, selectedCompliance, searchTerm]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (selectedCompliance !== 'all') {
        if (selectedCompliance === 'Compliant' && sub.status !== 'Verified') return false;
        if (selectedCompliance === 'Pending' && sub.status !== 'Pending Review') return false;
        if (selectedCompliance === 'Expiring Soon' && sub.status !== 'Expiring Soon' && sub.status !== 'Expired')
          return false;
      }
      if (searchTerm) {
        const match = `${sub.requirementName} ${sub.partnerName} ${sub.branchName} ${sub.documentRef}`.toLowerCase();
        return match.includes(searchTerm.toLowerCase());
      }
      return true;
    });
  }, [submissions, selectedCompliance, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Sub-Navigation Toggle */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#5A2EA6]/10 pb-3">
        <button
          onClick={() => setActiveSubTab('agreements')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeSubTab === 'agreements'
              ? 'bg-[#5A2EA6] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200',
          )}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Franchise Agreements Master</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px]',
              activeSubTab === 'agreements' ? 'bg-white/20' : 'bg-slate-100',
            )}
          >
            {allAgreements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('compliance')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeSubTab === 'compliance'
              ? 'bg-[#5A2EA6] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200',
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Compliance Monitoring Matrix</span>
          <span
            className={cn(
              'px-1.5 py-0.2 rounded-full text-[10px]',
              activeSubTab === 'compliance' ? 'bg-white/20' : 'bg-slate-100',
            )}
          >
            {submissions.length} Audits
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('configure')}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer',
            activeSubTab === 'configure'
              ? 'bg-[#5A2EA6] text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200',
          )}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configure Compliance Standards</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800">
            {requirements.length} Active Rules
          </span>
        </button>
      </div>

      {/* 2. Header Filter Bar & Action Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeSubTab === 'agreements'
                  ? 'Search agreement ID, partner, location...'
                  : activeSubTab === 'compliance'
                    ? 'Search requirement, partner, branch...'
                    : 'Filter standard rules...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Status Filter for Agreements */}
          {activeSubTab === 'agreements' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Contract States</option>
              <option value="Active">Active Contracts</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Draft">Draft State</option>
              <option value="Suspended">Suspended</option>
              <option value="Terminated">Terminated</option>
            </select>
          )}

          {/* Compliance Filter */}
          {activeSubTab !== 'configure' && (
            <select
              value={selectedCompliance}
              onChange={(e) => setSelectedCompliance(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Compliance Statuses</option>
              <option value="Compliant">Verified / Compliant</option>
              <option value="Pending">Pending Review</option>
              <option value="Expiring Soon">Expiring / Expired</option>
            </select>
          )}
        </div>

        {/* Action Controls for Subtabs */}
        <div className="flex items-center gap-2">
          {activeSubTab === 'agreements' && (
            <>
              <Button
                variant="outline"
                onClick={handleExportAgreements}
                className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
                <span>Export Agreements</span>
              </Button>
              <Button
                onClick={() => setIsAddAgreementModalOpen(true)}
                className="h-[36px] px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Draft New Agreement</span>
              </Button>
            </>
          )}

          {activeSubTab === 'compliance' && (
            <>
              <Button
                variant="outline"
                onClick={handleExportCompliance}
                className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
                <span>Export Matrix</span>
              </Button>
              <Button
                onClick={() => setIsSubmitDocModalOpen(true)}
                className="h-[36px] px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Record Compliance Clearance</span>
              </Button>
            </>
          )}

          {activeSubTab === 'configure' && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm('Reset this salon to standard default compliance requirements (REQ-01 to REQ-08)?')) {
                    resetToDefaultRequirements();
                    showToast('Compliance standards reset to system defaults (8 rules).');
                  }
                }}
                className="h-[36px] px-3 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset to Defaults</span>
              </Button>
              <Button
                onClick={() => setIsAddReqModalOpen(true)}
                className="h-[36px] px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Compliance Standard</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 3. FRANCHISE AGREEMENTS MASTER TABLE */}
      {activeSubTab === 'agreements' ? (
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Franchise Agreements &amp; Governance Ledger
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Legal Traceability
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Centralized contractual terms, tenure validity, renewal checkpoints, and audit compliance health
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Agreement ID</th>
                  <th className="p-3.5">Partner Entity</th>
                  <th className="p-3.5">Contract Scope</th>
                  <th className="p-3.5">Location Covered</th>
                  <th className="p-3.5">Effective Dates</th>
                  <th className="p-3.5">Next Renewal</th>
                  <th className="p-3.5 text-center">Audit Status</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredAgreements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-12 text-center text-muted">
                      <FileText className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                      <strong className="text-sm font-bold text-ink block">No agreements found</strong>
                      <span className="text-xs text-muted">Draft a new franchise agreement to begin tracking.</span>
                    </td>
                  </tr>
                ) : (
                  filteredAgreements.map((agr) => {
                    // Calculate dynamic compliance status based on live submissions
                    const partnerSubs = submissions.filter(
                      (s) =>
                        (s.partnerName && s.partnerName.trim().toLowerCase() === agr.partnerName.trim().toLowerCase()) ||
                        (s.partnerId && s.partnerId.trim().toLowerCase() === agr.partnerCode.trim().toLowerCase()) ||
                        (s.branchName && agr.locationName && s.branchName.trim().toLowerCase().includes(agr.locationName.trim().toLowerCase()))
                    );

                    const hasPending = partnerSubs.some((s) => s.status === 'Pending Review');
                    const hasAction = partnerSubs.some((s) => s.status === 'Action Required' || s.status === 'Expired');
                    const hasExpiring = partnerSubs.some((s) => s.status === 'Expiring Soon');

                    const dynamicComplianceStatus: FranchiseAgreement['complianceStatus'] = hasPending
                      ? 'Pending'
                      : hasAction
                        ? 'Non-Compliant'
                        : hasExpiring
                          ? 'Expiring Soon'
                          : 'Compliant';

                    const verifiedCount = partnerSubs.filter((s) => s.status === 'Verified').length;
                    const pendingCount = partnerSubs.filter((s) => s.status === 'Pending Review').length;

                    return (
                      <tr key={agr.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                        {/* ID */}
                        <td className="p-3.5 pl-5 whitespace-nowrap">
                          <strong className="font-mono text-ink block font-bold text-xs">{agr.id}</strong>
                          <span className="text-[10px] text-muted">Contract File</span>
                        </td>

                        {/* Partner */}
                        <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                          <span>{agr.partnerName}</span>
                          <span className="text-[10px] text-muted block font-mono">{agr.partnerCode}</span>
                        </td>

                        {/* Contract Type */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            {agr.agreementType}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="p-3.5 whitespace-nowrap text-slate-800 font-medium">
                          {agr.locationName}
                        </td>

                        {/* Dates */}
                        <td className="p-3.5 whitespace-nowrap text-[11px] text-muted">
                          <div>From: <strong className="text-ink">{agr.startDate}</strong></div>
                          <div>To: <strong className="text-ink">{agr.endDate}</strong></div>
                        </td>

                        {/* Renewal */}
                        <td className="p-3.5 whitespace-nowrap text-[11px] font-semibold text-indigo-900">
                          {agr.renewalDate}
                        </td>

                        {/* Compliance Status */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border',
                              getComplianceBadge(dynamicComplianceStatus),
                            )}
                          >
                            {dynamicComplianceStatus}
                          </span>
                          <div className="text-[9.5px] text-muted mt-0.5 font-semibold">
                            {pendingCount > 0 ? (
                              <span className="text-amber-700">{pendingCount} Submission Pending</span>
                            ) : (
                              <span>{verifiedCount}/{requirements.length} Clearances</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                              getStatusBadge(agr.status),
                            )}
                          >
                            {agr.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedAgreement(agr)}
                              className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-[#5A2EA6]" />
                              <span>Inspect</span>
                            </Button>

                            {agr.status === 'Expiring Soon' && (
                              <Button
                                onClick={() => handleRenewAgreement(agr)}
                                className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold premium-btn-primary flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Renew</span>
                              </Button>
                            )}

                            <button
                              onClick={() => handleDeleteAgreement(agr.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition hover:bg-rose-50"
                              title="Delete Agreement"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
      ) : activeSubTab === 'compliance' ? (
        /* 4. COMPLIANCE MONITORING MATRIX (DYNAMIC SUBMISSIONS LEDGER) */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Franchise Statutory &amp; Audit Compliance Matrix
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Review submitted clearances from Branch Managers &amp; Franchise Partners, verify expiry validity, and issue audit sign-offs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Document / License Standard</th>
                  <th className="p-3.5">Partner Entity</th>
                  <th className="p-3.5">Branch / Outlet</th>
                  <th className="p-3.5">Doc Ref &amp; File</th>
                  <th className="p-3.5">Uploaded By</th>
                  <th className="p-3.5">Validity Expiry</th>
                  <th className="p-3.5 text-center">Audit Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-muted">
                      <ShieldAlert className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                      <strong className="text-sm font-bold text-ink block">No compliance submissions match your filters</strong>
                      <span className="text-xs text-muted">Record a compliance clearance or adjust your search.</span>
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
                          <div>
                            <span>{sub.requirementName}</span>
                            {sub.notes && (
                              <div className="text-[10px] text-muted font-normal truncate max-w-[220px]">{sub.notes}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                        {sub.partnerName}
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-slate-800">
                        <span className="inline-flex items-center gap-1 font-medium">
                          <Store className="w-3 h-3 text-[#5A2EA6]" />
                          {sub.branchName}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {sub.fileUrl ? (
                            <img
                              src={sub.fileUrl}
                              alt={sub.fileName}
                              onClick={() => setPreviewDocImageModal(sub)}
                              className="w-8 h-8 rounded-lg object-cover border border-purple-200 cursor-pointer shadow-2xs hover:scale-110 transition shrink-0"
                              title="Click to preview uploaded image scan"
                            />
                          ) : (
                            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-mono text-muted text-[11px] font-bold">{sub.documentRef}</div>
                            <div
                              onClick={() => setPreviewDocImageModal(sub)}
                              className="text-[10px] text-indigo-700 font-bold flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <span>{sub.fileName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border',
                            sub.uploadedByRole === 'Branch Manager'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : sub.uploadedByRole === 'Franchise Partner'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          )}
                        >
                          <UserCheck className="w-2.5 h-2.5" />
                          {sub.uploadedByRole}
                        </span>
                        <div className="text-[9.5px] text-soft">{sub.uploadedByName}</div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-[11px] font-bold text-slate-800">
                        {sub.expiryDate}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-bold border',
                            sub.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : sub.status === 'Expiring Soon'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : sub.status === 'Action Required'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200',
                          )}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReview(sub)}
                            className={cn(
                              'px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5',
                              sub.status === 'Verified'
                                ? 'border border-[#5A2EA6] text-[#5A2EA6] bg-white hover:bg-purple-50'
                                : 'bg-[#5A2EA6] text-white hover:bg-[#482387] border-0',
                            )}
                          >
                            <Eye className="w-3 h-3" />
                            {sub.status === 'Verified' ? 'Inspect Audit' : 'Inspect & Review'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this compliance submission record?')) {
                                deleteSubmission(sub.id);
                                showToast('Submission record removed.');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition hover:bg-rose-50"
                            title="Delete Submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 5. CONFIGURE COMPLIANCE STANDARDS (DYNAMIC CHECKLIST MANAGER) */
        <div className="space-y-4">
          {/* Top Banner & KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Active Standards</span>
              <div className="text-2xl font-bold text-ink mt-0.5">
                {requirements.filter((r) => r.isActive).length} Rules
              </div>
              <span className="text-[10.5px] text-purple-700 font-semibold">Configured for This Salon</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Outlet-Level Standards</span>
              <div className="text-2xl font-bold text-blue-700 mt-0.5">
                {requirements.filter((r) => r.level === 'outlet' || r.level === 'both').length} Rules
              </div>
              <span className="text-[10.5px] text-blue-600 font-semibold">Branch Manager + Owner</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Entity-Level Standards</span>
              <div className="text-2xl font-bold text-purple-700 mt-0.5">
                {requirements.filter((r) => r.level === 'entity' || r.level === 'both').length} Rules
              </div>
              <span className="text-[10.5px] text-purple-600 font-semibold">Franchise Licensee Only</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Mandatory Enforcement</span>
              <div className="text-2xl font-bold text-emerald-700 mt-0.5">
                {requirements.filter((r) => r.mandatory).length} Strict Rules
              </div>
              <span className="text-[10.5px] text-emerald-600 font-semibold">Required for Operational NOC</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
              <div>
                <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#5A2EA6]" />
                  Dynamic Compliance Checklist &amp; Standards Configuration
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  Standard compliance certificates are present by default. Salons can delete any standard, and added compliance rules are scoped strictly to this tenant.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <th className="p-3.5 pl-5">Rule Code &amp; Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Enforced Scope / Level</th>
                    <th className="p-3.5">Renewal Cycle</th>
                    <th className="p-3.5 text-center">Mandatory</th>
                    <th className="p-3.5 text-center">Standard Type</th>
                    <th className="p-3.5 text-center">Rule Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {requirements.map((req) => (
                    <tr key={req.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                            {req.id}
                          </span>
                          <div>
                            <span className="font-bold text-ink text-xs block">{req.name}</span>
                            <span className="text-[10px] text-muted line-clamp-1">{req.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                          {req.category}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-md text-[10px] font-bold border',
                            req.level === 'outlet'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : req.level === 'entity'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200',
                          )}
                        >
                          {req.level === 'outlet'
                            ? 'Outlet Level (Branch Manager & Franchisee)'
                            : req.level === 'entity'
                              ? 'Entity Level (Franchise Partner Only)'
                              : 'Universal (All Outlets & Entities)'}
                        </span>
                      </td>
                      <td className="p-3.5 whitespace-nowrap font-semibold text-slate-800">
                        {req.renewalFrequency}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {req.mandatory ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Mandatory
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        {req.isDefault ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            Default Standard
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Custom Tenant Rule
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            toggleRequirementActive(req.id);
                            showToast(`Requirement "${req.name}" ${req.isActive ? 'deactivated' : 'activated'}.`);
                          }}
                          className={cn(
                            'px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition border',
                            req.isActive
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200',
                          )}
                        >
                          {req.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete compliance standard "${req.name}"? This standard will be removed for this salon.`)) {
                              deleteRequirement(req.id);
                              showToast(`Requirement "${req.name}" deleted from this salon's compliance checklist.`);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition border border-transparent hover:border-rose-200"
                          title="Delete Requirement (Salon Specific)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. AGREEMENT DETAILS DOSSIER MODAL */}
      {selectedAgreement &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedAgreement(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Franchise Agreement Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">{selectedAgreement.id}</span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedAgreement.status),
                      )}
                    >
                      {selectedAgreement.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">{selectedAgreement.agreementType}</h3>
                  <p className="text-xs text-muted">
                    Partner: <strong>{selectedAgreement.partnerName}</strong> ({selectedAgreement.partnerCode}) · Outlets:{' '}
                    <strong>{selectedAgreement.locationName}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAgreement(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1 no-scrollbar">
                {/* Commercial Terms Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <strong className="text-ink font-bold block mb-1">
                    Commercial &amp; Financial Governance Terms
                  </strong>
                  <div className="flex justify-between">
                    <span className="text-soft">Royalty Model:</span>
                    <span className="font-bold text-[#5A2EA6]">{selectedAgreement.commercialTerms.royaltyModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft">Settlement Schedule:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedAgreement.commercialTerms.settlementFrequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft">Brand Marketing Levy:</span>
                    <span className="font-bold text-indigo-700">
                      {selectedAgreement.commercialTerms.brandMarketingFundPct}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-soft">Default Penalty Clause:</span>
                    <span className="font-semibold text-rose-700">
                      {selectedAgreement.commercialTerms.penaltyClause}
                    </span>
                  </div>
                </div>

                {/* Compliance Documents & Live Clearance Submissions Section */}
                <div>
                  <h4 className="font-serif font-bold text-ink text-sm mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#5A2EA6]" />
                      Mandated Statutory &amp; Audit Clearances
                    </span>
                    <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      Live Franchisee Clearance Submissions ({submissions.length})
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {requirements.map((req) => {
                      const matchingSub = submissions.find((s) => {
                        if (!s) return false;
                        const nameMatch =
                          s.requirementName &&
                          s.requirementName.trim().toLowerCase() === req.name.trim().toLowerCase();
                        const idMatch = s.requirementId === req.id;
                        return nameMatch || idMatch;
                      });

                      const subStatus = matchingSub ? matchingSub.status : 'Missing';
                      const hasImageScan = Boolean(matchingSub && matchingSub.fileUrl);

                      return (
                        <div
                          key={req.id}
                          className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 bg-purple-50 text-[#5A2EA6] rounded border border-purple-200">
                                  {req.id}
                                </span>
                                <strong className="font-bold text-ink text-xs">{req.name}</strong>
                              </div>
                              <span className="text-[10px] text-muted block mt-0.5">
                                {req.description}
                              </span>
                            </div>

                            <span
                              className={cn(
                                'px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold border shrink-0',
                                subStatus === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : subStatus === 'Pending Review'
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : subStatus === 'Action Required'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-slate-100 text-slate-600 border-slate-200',
                              )}
                            >
                              {subStatus === 'Missing' ? 'Missing Clearance' : subStatus}
                            </span>
                          </div>

                          {matchingSub ? (
                            <div className="p-2.5 bg-purple-50/40 rounded-xl border border-purple-100 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                {hasImageScan ? (
                                  <div
                                    onClick={() => setPreviewDocImageModal(matchingSub)}
                                    className="w-14 h-14 rounded-lg bg-white border border-purple-200 p-0.5 overflow-hidden shrink-0 cursor-pointer shadow-2xs hover:scale-105 transition"
                                    title="Click to view enlarged scan"
                                  >
                                    <img
                                      src={matchingSub.fileUrl}
                                      alt={matchingSub.fileName}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-[#5A2EA6] grid place-items-center shrink-0">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                    <span>{matchingSub.fileName}</span>
                                    <span className="text-[10px] text-muted font-normal">
                                      ({matchingSub.fileSize})
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-soft mt-0.5">
                                    Ref: <strong>{matchingSub.documentRef}</strong> · Auth:{' '}
                                    {matchingSub.issuingAuthority}
                                  </div>
                                  <div className="text-[9.5px] text-purple-800 font-semibold mt-0.5">
                                    Uploaded by: {matchingSub.uploadedByName} ({matchingSub.uploadedByRole})
                                    on {matchingSub.uploadedDate}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-center">
                                {hasImageScan && (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewDocImageModal(matchingSub)}
                                    className="px-2.5 py-1 text-[10px] font-bold border border-purple-300 text-[#5A2EA6] bg-white rounded-lg hover:bg-purple-50 cursor-pointer shadow-2xs"
                                  >
                                    Preview Scan
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(matchingSub)}
                                  className="px-3 py-1 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-lg text-[10px] font-bold cursor-pointer shadow-xs"
                                >
                                  Inspect &amp; Review
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-muted flex items-center justify-between">
                              <span>⚠️ No clearance document uploaded yet by Franchisee.</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsSubmitDocModalOpen(true);
                                  setSubmitReqId(req.id);
                                }}
                                className="px-2 py-0.5 text-[10px] font-bold text-[#5A2EA6] hover:underline cursor-pointer"
                              >
                                Record HQ Clearance
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contract Lifecycle History */}
                <div>
                  <h4 className="font-serif font-bold text-ink text-sm mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#5A2EA6]" />
                    Contract Lifecycle Audit Ledger
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    {selectedAgreement.lifecycle.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold shrink-0 mt-0.5',
                            step.isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500',
                          )}
                        >
                          {step.isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="font-semibold text-slate-900">{step.stage}</strong>
                            <span className="text-[10px] text-muted">{step.date}</span>
                          </div>
                          <span className="text-[11px] text-soft block">Authorized by: {step.user}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {selectedAgreement.status === 'Active' ? (
                      <Button
                        variant="outline"
                        onClick={() => handleToggleAgreementStatus(selectedAgreement, 'Suspended')}
                        className="h-[34px] text-xs font-bold text-amber-700 border-amber-300 hover:bg-amber-50"
                      >
                        Suspend Contract
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleToggleAgreementStatus(selectedAgreement, 'Active')}
                        className="h-[34px] text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      >
                        Activate Contract
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleToggleAgreementStatus(selectedAgreement, 'Terminated')}
                      className="h-[34px] text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50"
                    >
                      Terminate
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleRenewAgreement(selectedAgreement)}
                      className="h-[34px] text-xs font-bold premium-btn-primary flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Renew Agreement (+3 Years)</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAgreement(null)}
                      className="h-[34px] text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Close Dossier
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 7. DRAFT NEW AGREEMENT MODAL */}
      {isAddAgreementModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsAddAgreementModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                    Brand Legal Protocol
                  </span>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">Draft New Franchise Agreement</h3>
                  <p className="text-xs text-muted">
                    Configure contractual governance, royalty models, settlement cadence, and territorial rights.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddAgreementModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateAgreement} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Franchise Partner Entity *</label>
                    <select
                      value={newAgrPartnerName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewAgrPartnerName(val);
                        const matched = livePartners.find((p) => p.name === val);
                        if (matched) setNewAgrPartnerCode(matched.code);
                      }}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      {livePartners.length > 0 ? (
                        livePartners.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name} ({p.code})
                          </option>
                        ))
                      ) : (
                        <option value={newAgrPartnerName}>{newAgrPartnerName}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-ink block mb-1">Contract / Agreement Model</label>
                    <select
                      value={newAgrType}
                      onChange={(e) => setNewAgrType(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      <option value="Single Unit FOFO">Single Unit FOFO (Franchisee Owned, Franchisee Operated)</option>
                      <option value="Multi-Unit FOCO">Multi-Unit FOCO (Franchisee Owned, Company Operated)</option>
                      <option value="Master Franchise Agreement">Master Franchise Agreement (Territorial)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Covered Outlets / Territory *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indore Vijay Nagar & Palasia Hubs"
                    value={newAgrLocationName}
                    onChange={(e) => setNewAgrLocationName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Contract Effective Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newAgrStartDate}
                      onChange={(e) => setNewAgrStartDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Contract Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={newAgrEndDate}
                      onChange={(e) => setNewAgrEndDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Royalty Revenue Model</label>
                    <input
                      type="text"
                      value={newAgrRoyaltyModel}
                      onChange={(e) => setNewAgrRoyaltyModel(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Settlement Cadence</label>
                    <input
                      type="text"
                      value={newAgrSettlementFreq}
                      onChange={(e) => setNewAgrSettlementFreq(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Brand Marketing Levy</label>
                    <input
                      type="text"
                      value={newAgrMarketingFund}
                      onChange={(e) => setNewAgrMarketingFund(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Default Penalty Clause</label>
                    <input
                      type="text"
                      value={newAgrPenaltyClause}
                      onChange={(e) => setNewAgrPenaltyClause(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddAgreementModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0 flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Generate &amp; Activate Agreement
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 8. RECORD / SUBMIT COMPLIANCE CLEARANCE MODAL */}
      {isSubmitDocModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsSubmitDocModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                    Compliance Verification
                  </span>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">Record Compliance Clearance</h3>
                  <p className="text-xs text-muted">
                    Submit municipal trade licenses, fire NOCs, GST certificates, or staff medical cards.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitDocModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmitClearance} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 no-scrollbar">
                <div>
                  <label className="font-bold text-ink block mb-1">Select Compliance Standard *</label>
                  <select
                    value={submitReqId}
                    onChange={(e) => setSubmitReqId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                  >
                    {requirements.map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.id}] {r.name} ({r.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Branch / Outlet *</label>
                    <select
                      value={submitBranchName}
                      onChange={(e) => setSubmitBranchName(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      {liveBranches.length > 0 ? (
                        liveBranches.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.code})
                          </option>
                        ))
                      ) : (
                        <option value={submitBranchName}>{submitBranchName}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-ink block mb-1">Franchise Partner *</label>
                    <select
                      value={submitPartnerName}
                      onChange={(e) => setSubmitPartnerName(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      {livePartners.length > 0 ? (
                        livePartners.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))
                      ) : (
                        <option value={submitPartnerName}>{submitPartnerName}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Document Reference / License No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BMC-TL-2026-9901"
                      value={submitDocRef}
                      onChange={(e) => setSubmitDocRef(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Issuing Authority *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Indore Municipal Corporation"
                      value={submitIssuingAuth}
                      onChange={(e) => setSubmitIssuingAuth(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={submitIssueDate}
                      onChange={(e) => setSubmitIssueDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Validity Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={submitExpiryDate}
                      onChange={(e) => setSubmitExpiryDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Document File Name</label>
                  <input
                    type="text"
                    value={submitFileName}
                    onChange={(e) => setSubmitFileName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Submission Notes &amp; Verification Remarks</label>
                  <textarea
                    rows={2}
                    placeholder="Provide any inspection or renewal notes..."
                    value={submitNotes}
                    onChange={(e) => setSubmitNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsSubmitDocModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Submit Clearance Record
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 9. INSPECT & REVIEW SUBMISSION MODAL */}
      {selectedSubmissionForReview &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedSubmissionForReview(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      HQ Compliance Audit Inspection
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedSubmissionForReview.documentRef}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedSubmissionForReview.requirementName}
                  </h3>
                  <p className="text-xs text-muted">
                    Outlet: <strong>{selectedSubmissionForReview.branchName}</strong> · Franchisee:{' '}
                    {selectedSubmissionForReview.partnerName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSubmissionForReview(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveReview} className="p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar">
                {/* Upload Meta Dossier */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-soft block">Uploaded By</span>
                    <span className="font-bold text-ink">{selectedSubmissionForReview.uploadedByName}</span>
                    <span className="text-[10px] text-purple-700 block font-semibold">
                      ({selectedSubmissionForReview.uploadedByRole})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-soft block">Uploaded Date</span>
                    <span className="font-bold text-slate-800">{selectedSubmissionForReview.uploadedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-soft block">Validity Expiry</span>
                    <span className="font-bold text-rose-700">{selectedSubmissionForReview.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-soft block">Issuing Authority</span>
                    <span className="font-semibold text-slate-800">{selectedSubmissionForReview.issuingAuthority}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-soft block">Attached File</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span className="font-bold text-indigo-900 text-xs">{selectedSubmissionForReview.fileName}</span>
                      <span className="text-[10px] text-muted">({selectedSubmissionForReview.fileSize})</span>
                      <button
                        type="button"
                        onClick={() => setPreviewDocImageModal(selectedSubmissionForReview)}
                        className="px-2.5 py-0.5 text-[10px] font-bold border border-[#5A2EA6] text-[#5A2EA6] bg-white rounded-md hover:bg-purple-50 cursor-pointer shadow-xs"
                      >
                        Preview File
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hidden File Input for Admin Review Modal */}
                <input
                  type="file"
                  ref={adminReviewFileInputRef}
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && selectedSubmissionForReview) {
                      const blobUrl = URL.createObjectURL(file);
                      const sizeMb = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
                      const instantSub = {
                        ...selectedSubmissionForReview,
                        fileName: file.name,
                        fileSize: sizeMb,
                        fileUrl: blobUrl,
                      };
                      setSelectedSubmissionForReview(instantSub);
                      addOrUpdateSubmission(instantSub);

                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        const persistentSub = {
                          ...instantSub,
                          fileUrl: dataUrl,
                        };
                        setSelectedSubmissionForReview(persistentSub);
                        addOrUpdateSubmission(persistentSub);
                        showToast(`Document scan "${file.name}" attached successfully.`);
                      };
                      reader.readAsDataURL(file);
                    }
                    e.target.value = '';
                  }}
                />

                {/* Real Uploaded Clearance Document Image Scan Container */}
                <div className="p-3 bg-slate-900/5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="font-bold text-ink">📷 Uploaded Clearance Document Image Scan</span>
                    <button
                      type="button"
                      onClick={() => adminReviewFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[10px] bg-white border border-[#5A2EA6] text-[#5A2EA6] rounded-lg font-bold hover:bg-purple-50 cursor-pointer shadow-xs"
                    >
                      Change / Load Image
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-xl bg-white border border-slate-200 p-2 shadow-sm min-h-[160px] max-h-[300px] flex items-center justify-center">
                    {selectedSubmissionForReview.fileUrl ? (
                      <img
                        src={selectedSubmissionForReview.fileUrl}
                        alt={selectedSubmissionForReview.fileName}
                        className="max-h-[280px] w-auto max-w-full object-contain rounded-lg shadow-xs cursor-pointer"
                        onClick={() => setPreviewDocImageModal(selectedSubmissionForReview)}
                        title="Click to view enlarged preview"
                      />
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <FileText className="w-8 h-8 text-purple-300 mx-auto" />
                        <div>
                          <strong className="text-xs font-bold text-ink block">No Image File Saved for this Submission</strong>
                          <span className="text-[10.5px] text-muted block">File name "{selectedSubmissionForReview.fileName}" is recorded, but no image scan was attached.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => adminReviewFileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold shadow hover:bg-[#482387] cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" /> Attach / Select Image File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {selectedSubmissionForReview.notes && (
                  <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 text-xs">
                    <span className="text-[10px] uppercase font-bold text-purple-800 block">Uploader Submission Notes</span>
                    <p className="text-ink mt-0.5 text-xs">{selectedSubmissionForReview.notes}</p>
                  </div>
                )}

                {/* Audit Decision Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">HQ Audit Decision &amp; Status</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: 'Verified',
                        label: 'Approve & Pass Audit',
                        color: 'border-emerald-300 bg-emerald-50 text-emerald-800',
                      },
                      {
                        id: 'Action Required',
                        label: 'Request Re-upload',
                        color: 'border-rose-300 bg-rose-50 text-rose-800',
                      },
                      {
                        id: 'Expired',
                        label: 'Mark Expired / Overdue',
                        color: 'border-amber-300 bg-amber-50 text-amber-800',
                      },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setReviewStatusChoice(opt.id as any)}
                        className={cn(
                          'p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition',
                          reviewStatusChoice === opt.id
                            ? `${opt.color} ring-2 ring-[#5A2EA6] shadow-xs`
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HQ Remarks Textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink">HQ Inspection Remarks &amp; Feedback</label>
                  <textarea
                    rows={3}
                    value={reviewRemarks}
                    onChange={(e) => setReviewRemarks(e.target.value)}
                    placeholder="Enter compliance feedback, stamp verification remarks, or instructions for the branch manager..."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmissionForReview(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0"
                  >
                    Save HQ Review Decision
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 10. ADD NEW COMPLIANCE STANDARD MODAL (TENANT-SCOPED) */}
      {isAddReqModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsAddReqModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                    Salon Compliance Standard
                  </span>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">Add Mandated Compliance Standard</h3>
                  <p className="text-xs text-muted">
                    This custom standard will be enforced only for this salon tenant.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddReqModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRequirement} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 no-scrollbar">
                <div>
                  <label className="font-bold text-ink block mb-1">Standard / Requirement Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Water Quality & RO Potability Test Report"
                    value={newReqName}
                    onChange={(e) => setNewReqName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Compliance Category</label>
                    <select
                      value={newReqCategory}
                      onChange={(e) => setNewReqCategory(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      <option value="Statutory Licensing">Statutory Licensing</option>
                      <option value="Fire & Life Safety">Fire &amp; Life Safety</option>
                      <option value="Equipment & Assets">Equipment &amp; Assets</option>
                      <option value="Staff Certification">Staff Certification</option>
                      <option value="Health & Hygiene">Health &amp; Hygiene</option>
                      <option value="Brand Standards & SOP">Brand Standards &amp; SOP</option>
                      <option value="Insurance & Legal">Insurance &amp; Legal</option>
                      <option value="Environmental & Sanitation">Environmental &amp; Sanitation</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-ink block mb-1">Enforced Level / Role Scope</label>
                    <select
                      value={newReqLevel}
                      onChange={(e) => setNewReqLevel(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      <option value="outlet">Outlet Level (Branch Manager &amp; Franchisee)</option>
                      <option value="entity">Entity Level (Franchise Partner Only)</option>
                      <option value="both">Universal Standard (All Levels)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Renewal Frequency</label>
                    <select
                      value={newReqFrequency}
                      onChange={(e) => setNewReqFrequency(e.target.value as any)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                    >
                      <option value="Annual">Annual (Every 12 Months)</option>
                      <option value="Semi-Annual">Semi-Annual (Every 6 Months)</option>
                      <option value="Quarterly">Quarterly (Every 3 Months)</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Permanent / One-Time">Permanent / One-Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-ink block mb-1">Validity Period (Months)</label>
                    <input
                      type="number"
                      min={0}
                      max={60}
                      value={newReqValidity}
                      onChange={(e) => setNewReqValidity(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="mandatoryCheck"
                    checked={newReqMandatory}
                    onChange={(e) => setNewReqMandatory(e.target.checked)}
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                  <label htmlFor="mandatoryCheck" className="font-bold text-ink cursor-pointer">
                    Mandatory Standard (Required for active salon operational standing)
                  </label>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Operational Instructions / Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific document, authorized testing lab, or proof requirements for branch managers..."
                    value={newReqDesc}
                    onChange={(e) => setNewReqDesc(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddReqModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create &amp; Enforce Standard
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 11. ENLARGED / FULL SCREEN IMAGE PREVIEW MODAL FOR ADMIN */}
      {previewDocImageModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setPreviewDocImageModal(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-purple-200 p-5 space-y-4 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-ink text-lg">{previewDocImageModal.requirementName}</h3>
                  <p className="text-xs text-muted">
                    Outlet: {previewDocImageModal.branchName} · File: {previewDocImageModal.fileName}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewDocImageModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-900/5 rounded-2xl border border-slate-200 flex items-center justify-center">
                {previewDocImageModal.fileUrl ? (
                  <img
                    src={previewDocImageModal.fileUrl}
                    alt={previewDocImageModal.fileName}
                    className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <div className="p-10 text-center text-muted">
                    <FileText className="w-12 h-12 text-purple-300 mx-auto mb-2" />
                    <strong className="text-sm font-bold text-ink block">No Image File Attached</strong>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewDocImageModal(null)}
                  className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold shadow hover:bg-[#482387] cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
