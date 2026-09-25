import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  useComplianceStore,
  ComplianceRequirement,
  ComplianceDocumentSubmission,
} from '@/shared/compliance/complianceStore';
import { tenantsApi } from '@/shared/api/tenants.api';

export interface FranchiseOutletOption {
  id: string;
  name: string;
  isEntity?: boolean;
}

function getSubImageSrc(sub?: ComplianceDocumentSubmission | null): string {
  if (!sub) return '';
  return sub.fileUrl || '';
}

export function CompliancePage() {
  const { toast } = useToast();
  const { activeRequirements, submissions, addOrUpdateSubmission, refreshStore } =
    useComplianceStore();

  // Sub-navigation tab: Active Compliance Standards vs Compliance Monitoring Matrix
  const [activeTab, setActiveTab] = useState<'standards' | 'matrix'>('standards');

  const [outlets, setOutlets] = useState<FranchiseOutletOption[]>([
    { id: 'all', name: 'All Outlets (Network Summary)' },
    { id: 'entity', name: 'Franchise Corporate Entity Level', isEntity: true },
  ]);
  const [isLoadingOutlets, setIsLoadingOutlets] = useState<boolean>(true);

  // Filters for Standards Tab
  const [selectedOutlet, setSelectedOutlet] = useState('all');
  const [selectedOrigin, setSelectedOrigin] = useState<'all' | 'default' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScopeLevel, setSelectedScopeLevel] = useState<'all' | 'outlet' | 'entity' | 'both'>('all');

  // Filters for Matrix Tab
  const [matrixSearchQuery, setMatrixSearchQuery] = useState('');
  const [matrixStatusFilter, setMatrixStatusFilter] = useState('all');
  const [matrixBranchFilter, setMatrixBranchFilter] = useState('all');

  // Modals state
  const [uploadModalReq, setUploadModalReq] = useState<ComplianceRequirement | null>(null);
  const [uploadModalSub, setUploadModalSub] = useState<ComplianceDocumentSubmission | null>(null);
  const [viewDocModalSub, setViewDocModalSub] = useState<ComplianceDocumentSubmission | null>(null);

  // Upload Form state
  const [uploadBranchId, setUploadBranchId] = useState('entity');
  const [uploadDocRef, setUploadDocRef] = useState('');
  const [uploadIssuingAuth, setUploadIssuingAuth] = useState('');
  const [uploadIssueDate, setUploadIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadExpiryDate, setUploadExpiryDate] = useState('2027-03-31');
  const [uploadFileName, setUploadFileName] = useState('Certificate_Clearance_Scan.pdf');
  const [uploadFileSize, setUploadFileSize] = useState('2.4 MB');
  const [uploadFileUrl, setUploadFileUrl] = useState<string | undefined>(undefined);
  const [uploadNotes, setUploadNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch live branches and franchise info
  const fetchLiveOutlets = async () => {
    try {
      setIsLoadingOutlets(true);
      const [rawBranchesRes, rawPartnersRes] = await Promise.allSettled([
        tenantsApi.listBranches(),
        tenantsApi.listFranchises(),
      ]);

      const branches =
        rawBranchesRes.status === 'fulfilled' && Array.isArray(rawBranchesRes.value)
          ? rawBranchesRes.value
          : [];
      const partners =
        rawPartnersRes.status === 'fulfilled' && Array.isArray(rawPartnersRes.value)
          ? rawPartnersRes.value
          : [];

      const franchiseId = localStorage.getItem('digiflex_franchise_id');
      const partnerName = localStorage.getItem('digiflex_franchise_partner_name');

      let matchedBranches = branches;
      if (franchiseId) {
        const matchedPartner = partners.find((p: any) => p.id === franchiseId);
        if (
          matchedPartner &&
          Array.isArray(matchedPartner.branches) &&
          matchedPartner.branches.length > 0
        ) {
          matchedBranches = matchedPartner.branches;
        } else {
          const filtered = branches.filter((b: any) => b.franchiseId === franchiseId);
          if (filtered.length > 0) matchedBranches = filtered;
        }
      } else if (partnerName) {
        const matchedPartner = partners.find(
          (p: any) =>
            (p.companyName && p.companyName.toLowerCase() === partnerName.toLowerCase()) ||
            (p.name && p.name.toLowerCase() === partnerName.toLowerCase()),
        );
        if (
          matchedPartner &&
          Array.isArray(matchedPartner.branches) &&
          matchedPartner.branches.length > 0
        ) {
          matchedBranches = matchedPartner.branches;
        }
      }

      const branchOptions: FranchiseOutletOption[] = matchedBranches.map((b: any) => ({
        id: b.id,
        name: `${b.name} (${b.code || (b.id ? b.id.slice(0, 6).toUpperCase() : 'OUTLET')})`,
      }));

      setOutlets([
        { id: 'all', name: 'All Outlets (Network Summary)' },
        ...branchOptions,
        { id: 'entity', name: 'Franchise Corporate Entity Level', isEntity: true },
      ]);

      if (branchOptions.length > 0 && uploadBranchId === 'entity') {
        setUploadBranchId(branchOptions[0].id);
      }
    } catch (err) {
      console.warn('Error fetching outlets for franchise compliance:', err);
    } finally {
      setIsLoadingOutlets(false);
    }
  };

  useEffect(() => {
    fetchLiveOutlets();
  }, []);

  // Map each active requirement to its current submission status for the selected outlet
  const enrichedRequirements = useMemo(() => {
    return activeRequirements.map((req) => {
      // Find matching submission by requirement name (or exact ID if name matches) with an actual uploaded file scan
      const matchingSub = submissions.find((s) => {
        if (!s || !s.fileUrl) return false;
        const nameMatch = s.requirementName && s.requirementName.trim().toLowerCase() === req.name.trim().toLowerCase();
        const idMatch = s.requirementId === req.id && (!s.requirementName || s.requirementName.trim().toLowerCase() === req.name.trim().toLowerCase());
        if (!nameMatch && !idMatch) return false;

        if (selectedOutlet !== 'all' && selectedOutlet !== 'entity') {
          return s.branchId === selectedOutlet;
        }
        if (selectedOutlet === 'entity') {
          return s.branchId === 'entity' || req.level === 'entity';
        }
        return true;
      });

      let status: 'Approved' | 'Pending' | 'Action Required' | 'Expired' = 'Action Required';
      if (matchingSub && matchingSub.fileUrl) {
        if (matchingSub.status === 'Verified') status = 'Approved';
        else if (matchingSub.status === 'Pending Review') status = 'Pending';
        else if (matchingSub.status === 'Action Required') status = 'Action Required';
        else if (matchingSub.status === 'Expired') status = 'Expired';
        else status = 'Pending';
      }

      const isValidSub = Boolean(matchingSub && matchingSub.fileUrl);

      return {
        req,
        submission: isValidSub ? matchingSub : undefined,
        status,
        dueDate: isValidSub && matchingSub ? matchingSub.expiryDate : 'Action Required',
        lastAudit: isValidSub && matchingSub ? matchingSub.lastAuditDate || 'Clearance Submitted' : 'Pending Initial Audit',
      };
    });
  }, [activeRequirements, submissions, selectedOutlet]);

  const filteredList = useMemo(() => {
    return enrichedRequirements.filter(({ req }) => {
      if (selectedOrigin === 'default' && !req.isDefault) return false;
      if (selectedOrigin === 'custom' && req.isDefault) return false;
      if (selectedCategory !== 'all' && req.category !== selectedCategory) return false;
      if (selectedScopeLevel !== 'all') {
        if (selectedScopeLevel === 'outlet' && req.level !== 'outlet' && req.level !== 'both') return false;
        if (selectedScopeLevel === 'entity' && req.level !== 'entity' && req.level !== 'both') return false;
        if (selectedScopeLevel === 'both' && req.level !== 'both') return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          req.id.toLowerCase().includes(q) ||
          req.name.toLowerCase().includes(q) ||
          req.description.toLowerCase().includes(q) ||
          req.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enrichedRequirements, selectedOrigin, selectedCategory, selectedScopeLevel, searchQuery]);

  // Dynamic KPI calculations for Standards Tab (matching Admin's 4 summary cards)
  const totalActiveStandards = activeRequirements.length;
  const outletLevelCount = activeRequirements.filter((r) => r.level === 'outlet' || r.level === 'both').length;
  const entityLevelCount = activeRequirements.filter((r) => r.level === 'entity' || r.level === 'both').length;
  const mandatoryCount = activeRequirements.filter((r) => r.mandatory).length;

  // Filtered Matrix Submissions for Tab 2
  const filteredMatrixSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (matrixStatusFilter !== 'all') {
        if (matrixStatusFilter === 'Compliant' && sub.status !== 'Verified') return false;
        if (matrixStatusFilter === 'Pending' && sub.status !== 'Pending Review') return false;
        if (matrixStatusFilter === 'Action Required' && sub.status !== 'Action Required') return false;
        if (matrixStatusFilter === 'Expiring' && sub.status !== 'Expiring Soon' && sub.status !== 'Expired')
          return false;
      }
      if (matrixBranchFilter !== 'all' && sub.branchId !== matrixBranchFilter) {
        return false;
      }
      if (matrixSearchQuery) {
        const q = matrixSearchQuery.toLowerCase();
        return (
          sub.requirementName.toLowerCase().includes(q) ||
          sub.branchName.toLowerCase().includes(q) ||
          sub.documentRef.toLowerCase().includes(q) ||
          sub.issuingAuthority.toLowerCase().includes(q) ||
          sub.uploadedByName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [submissions, matrixStatusFilter, matrixBranchFilter, matrixSearchQuery]);

  // Matrix KPIs
  const matrixTotalCount = submissions.length;
  const matrixVerifiedCount = submissions.filter((s) => s.status === 'Verified').length;
  const matrixPendingCount = submissions.filter((s) => s.status === 'Pending Review').length;
  const matrixActionCount = submissions.filter(
    (s) => s.status === 'Action Required' || s.status === 'Expired' || s.status === 'Expiring Soon',
  ).length;

  const handleOpenUpload = (req: ComplianceRequirement, sub?: ComplianceDocumentSubmission) => {
    setUploadModalReq(req);
    setUploadModalSub(sub || null);

    // Determine initial target branch
    let defaultBranch = 'entity';
    if (req.level === 'entity') {
      defaultBranch = 'entity';
    } else if (selectedOutlet !== 'all' && selectedOutlet !== 'entity') {
      defaultBranch = selectedOutlet;
    } else {
      const firstRealOutlet = outlets.find((o) => o.id !== 'all' && o.id !== 'entity');
      defaultBranch = firstRealOutlet ? firstRealOutlet.id : 'entity';
    }

    setUploadBranchId(sub?.branchId || defaultBranch);
    setUploadDocRef(sub?.documentRef || `REF-${req.id}-${Math.floor(1000 + Math.random() * 9000)}`);
    setUploadIssuingAuth(sub?.issuingAuthority || 'State Statutory Authority / Municipal Body');
    setUploadIssueDate(sub?.issueDate || new Date().toISOString().split('T')[0]);

    const validityMonths = req.validityMonths > 0 ? req.validityMonths : 12;
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + validityMonths);
    setUploadExpiryDate(sub?.expiryDate || futureDate.toISOString().split('T')[0]);
    setUploadFileName(sub?.fileName || `${req.name.replace(/[^a-zA-Z0-9]/g, '_')}_Clearance.pdf`);
    setUploadFileSize(sub?.fileSize || '2.4 MB');

    const prevImg = sub?.fileUrl ? sub.fileUrl : undefined;
    setUploadFileUrl(prevImg);
    uploadFileUrlRef.current = prevImg;
    setUploadNotes(sub?.notes || '');
  };

  const dossierFileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadFileUrlRef = useRef<string | undefined>(undefined);

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = `${sizeMb} MB`;
      setUploadFileSize(formattedSize);

      // Instant blob preview URL
      const blobUrl = URL.createObjectURL(file);
      setUploadFileUrl(blobUrl);
      uploadFileUrlRef.current = blobUrl;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setUploadFileUrl(dataUrl);
        uploadFileUrlRef.current = dataUrl;

        if (uploadModalSub && uploadModalReq) {
          addOrUpdateSubmission({
            id: uploadModalSub.id,
            requirementId: uploadModalReq.id,
            requirementName: uploadModalReq.name,
            partnerId: uploadModalSub.partnerId,
            partnerName: uploadModalSub.partnerName,
            branchId: uploadModalSub.branchId,
            branchName: uploadModalSub.branchName,
            documentRef: uploadDocRef || uploadModalSub.documentRef,
            fileName: file.name,
            fileSize: formattedSize,
            issuingAuthority: uploadIssuingAuth || uploadModalSub.issuingAuthority,
            issueDate: uploadIssueDate,
            expiryDate: uploadExpiryDate,
            uploadedByRole: uploadModalSub.uploadedByRole,
            uploadedByName: uploadModalSub.uploadedByName,
            status: uploadModalSub.status,
            notes: uploadNotes,
            fileUrl: dataUrl,
          });
        }
      };
      reader.readAsDataURL(file);
      toast(`Document Selected: "${file.name}" (${formattedSize}) loaded.`);
    }
    e.target.value = '';
  };

  const handleConfirmUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalReq) return;

    const targetBranch = outlets.find((o) => o.id === uploadBranchId);
    const branchDisplayName =
      uploadBranchId === 'entity'
        ? 'Franchise Corporate Entity Level'
        : targetBranch
          ? targetBranch.name.split(' (')[0]
          : 'Franchise Outlet';

    const partnerName =
      localStorage.getItem('digiflex_franchise_partner_name') || 'Franchise Partner';
    const partnerId = localStorage.getItem('digiflex_franchise_id') || 'FP-IND-01';
    const contactPerson =
      localStorage.getItem('digiflex_franchise_contact_person') ||
      localStorage.getItem('digiflex_franchise_owner_name') ||
      'Authorized Representative';

    addOrUpdateSubmission({
      id: uploadModalSub?.id,
      requirementId: uploadModalReq.id,
      requirementName: uploadModalReq.name,
      partnerId,
      partnerName,
      branchId: uploadBranchId,
      branchName: branchDisplayName,
      documentRef: uploadDocRef || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      fileName: uploadFileName,
      fileSize: uploadFileSize,
      issuingAuthority: uploadIssuingAuth,
      issueDate: uploadIssueDate,
      expiryDate: uploadExpiryDate,
      uploadedByRole: 'Franchise Partner',
      uploadedByName: contactPerson,
      status: 'Pending Review',
      notes: uploadNotes,
      fileUrl: uploadFileUrlRef.current || uploadFileUrl || uploadModalSub?.fileUrl,
    });

    toast(`Clearance Submitted: Document for "${uploadModalReq.name}" uploaded. Transferred to Brand HQ for verification.`);
    setUploadModalReq(null);
    setUploadModalSub(null);
  };

  const handleExportStandardsCsv = () => {
    const headers = [
      'Standard ID',
      'Checklist Standard Name',
      'Category',
      'Enforced Scope / Level',
      'Renewal Frequency',
      'Mandatory Status',
      'Standard Type',
      'Audit Status',
      'Validity Expiry Date',
      'Document Reference',
      'Issuing Authority',
      'Target Outlet / Entity',
      'Uploaded By',
      'Last Verified Audit Date',
    ];

    const rows = enrichedRequirements.map(({ req, submission, status, dueDate, lastAudit }) => [
      req.id,
      req.name,
      req.category,
      req.level === 'outlet'
        ? 'Outlet Level (Branch Manager & Franchisee)'
        : req.level === 'entity'
          ? 'Entity Level (Franchise Partner Only)'
          : 'Universal (All Outlets & Entities)',
      req.renewalFrequency,
      req.mandatory ? 'Mandatory' : 'Optional',
      req.isDefault ? 'Default Standard' : 'Custom (Added by Brand Admin)',
      status,
      dueDate,
      submission?.documentRef || 'Pending Submission',
      submission?.issuingAuthority || 'N/A',
      submission?.branchName || (req.level === 'entity' ? 'Corporate Entity Level' : 'Universal Outlets'),
      submission ? `${submission.uploadedByName} (${submission.uploadedByRole})` : 'Not Uploaded',
      lastAudit,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Franchise_Active_Compliance_Standards_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Export Completed: Active compliance standards ledger downloaded successfully.');
  };

  const handleExportMatrixCsv = () => {
    const headers = [
      'Submission ID',
      'Requirement ID',
      'Requirement Name',
      'Target Outlet',
      'Document Reference',
      'File Name',
      'Issuing Authority',
      'Issue Date',
      'Expiry Date',
      'HQ Audit Status',
      'Uploaded By Role',
      'Uploaded By Name',
      'Last Audit Date',
    ];

    const rows = submissions.map((sub) => [
      sub.id,
      sub.requirementId,
      sub.requirementName,
      sub.branchName,
      sub.documentRef,
      sub.fileName,
      sub.issuingAuthority,
      sub.issueDate,
      sub.expiryDate,
      sub.status,
      sub.uploadedByRole,
      sub.uploadedByName,
      sub.lastAuditDate || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Franchise_Compliance_Monitoring_Matrix_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Export Completed: Compliance monitoring matrix downloaded successfully.');
  };

  const handleDownloadDossier = (sub: ComplianceDocumentSubmission) => {
    const matchingReq = activeRequirements.find((r) => r.id === sub.requirementId);
    const content = `=======================================================
DIGIFLEX SALON SAAS - COMPLIANCE CLEARANCE DOSSIER
=======================================================
Document Ref:        ${sub.documentRef}
Standard:            ${sub.requirementName} (${sub.requirementId})
Standard Origin:     ${matchingReq?.isDefault ? 'HQ Default Baseline Standard' : 'Custom Standard (Added by Brand Admin)'}
Target Outlet:       ${sub.branchName} (${sub.branchId})
Franchise Partner:   ${sub.partnerName} (${sub.partnerId})
Issuing Authority:   ${sub.issuingAuthority}
Date of Issue:       ${sub.issueDate}
Valid Until:         ${sub.expiryDate}
Current Status:      ${sub.status}
Uploaded By:         ${sub.uploadedByName} (${sub.uploadedByRole}) on ${sub.uploadedDate}
HQ Feedback:         ${sub.hqRemarks || 'Verification under review by Brand HQ'}
Verified By:         ${sub.reviewedByName || 'HQ Audit Team'} on ${sub.reviewedDate || sub.lastAuditDate || sub.uploadedDate}
File Name:           ${sub.fileName} (${sub.fileSize})
Notes / Remarks:     ${sub.notes || 'None'}
=======================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sub.fileName.replace(/\.[^/.]+$/, '')}_Clearance_Dossier.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast(`Dossier Downloaded: "${sub.fileName}" saved.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#5A2EA6]/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              HQ Brand Standard &amp; Health Compliance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-[#5A2EA6] border border-purple-200">
              {totalActiveStandards} Active Rules
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Centralized statutory governance, brand operating standards, safety audits, and clearance dossiers across your franchise network.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => {
              refreshStore();
              fetchLiveOutlets();
              toast('Refreshed: Franchise compliance records synchronized with Brand HQ.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-line text-soft hover:text-ink bg-white hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            title="Reload outlets and sync compliance status"
          >
            <RefreshCw className="w-3.5 h-3.5 text-soft" /> Sync with Brand HQ
          </button>
          <button
            onClick={activeTab === 'standards' ? handleExportStandardsCsv : handleExportMatrixCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            {activeTab === 'standards' ? 'Export Compliance Report' : 'Export Matrix'}
          </button>
        </div>
      </div>

      {/* 2. Top Sub-Navigation Toggle (Active Standards vs Monitoring Matrix) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#5A2EA6]/10 pb-3">
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === 'standards'
            ? 'bg-[#5A2EA6] text-white shadow-sm'
            : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200'
            }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Active Compliance Standards</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'standards' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'
              }`}
          >
            {totalActiveStandards} Active Rules
          </span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${activeTab === 'matrix'
            ? 'bg-[#5A2EA6] text-white shadow-sm'
            : 'bg-white text-slate-700 hover:bg-[#5A2EA6]/5 border border-slate-200'
            }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Compliance Monitoring Matrix</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${activeTab === 'matrix' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
          >
            {submissions.length} Audits
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACTIVE COMPLIANCE STANDARDS (MATCHING ADMIN STANDARDS CONFIGURATION) */}
      {/* ========================================================================= */}
      {activeTab === 'standards' && (
        <div className="space-y-5">
          {/* Top 4 KPI Cards Matching Admin Standards Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Active Standards</span>
              <div className="text-2xl font-bold text-ink mt-0.5">
                {totalActiveStandards} Rules
              </div>
              <span className="text-[10.5px] text-purple-700 font-semibold">
                Active for Franchise Network
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Outlet-Level Standards</span>
              <div className="text-2xl font-bold text-blue-700 mt-0.5">
                {outletLevelCount} Rules
              </div>
              <span className="text-[10.5px] text-blue-600 font-semibold">
                Branch Manager + Owner
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Entity-Level Standards</span>
              <div className="text-2xl font-bold text-purple-700 mt-0.5">
                {entityLevelCount} Rules
              </div>
              <span className="text-[10.5px] text-purple-600 font-semibold">
                Franchise Licensee Only
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Mandatory Enforcement</span>
              <div className="text-2xl font-bold text-emerald-700 mt-0.5">
                {mandatoryCount} Strict Rules
              </div>
              <span className="text-[10.5px] text-emerald-600 font-semibold">
                Required for Operational Clearance
              </span>
            </div>
          </div>

          {/* Operational Scope & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-line shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Store className="w-4 h-4 text-[#5A2EA6]" />
              <span className="text-xs font-bold text-ink">Selected Operational Scope:</span>
              <select
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="p-2 bg-purple-50/50 border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-[#5A2EA6] cursor-pointer outline-none focus:border-[#5A2EA6]"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              {isLoadingOutlets && (
                <span className="text-[11px] text-muted animate-pulse">Syncing outlets...</span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter standard rules or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-pine/10 border border-line rounded-xl text-xs font-semibold text-ink outline-none focus:border-purple-600"
                />
              </div>

              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value as any)}
                className="p-1.5 bg-paper/40 border border-line rounded-xl text-xs font-semibold text-ink cursor-pointer outline-none"
              >
                <option value="all">All Origins (Default &amp; Custom)</option>
                <option value="default">Default Standards Only</option>
                <option value="custom">Custom (Admin Added) Only</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 bg-paper/40 border border-line rounded-xl text-xs font-semibold text-ink cursor-pointer outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Statutory Licensing">Statutory Licensing</option>
                <option value="Fire & Life Safety">Fire &amp; Life Safety</option>
                <option value="Equipment & Assets">Equipment &amp; Assets</option>
                <option value="Staff Certification">Staff Certification</option>
                <option value="Health & Hygiene">Health &amp; Hygiene</option>
                <option value="Brand Standards & SOP">Brand Standards &amp; SOP</option>
                <option value="Insurance & Legal">Insurance &amp; Legal</option>
                <option value="Environmental & Sanitation">Environmental &amp; Sanitation</option>
              </select>

              <select
                value={selectedScopeLevel}
                onChange={(e) => setSelectedScopeLevel(e.target.value as any)}
                className="p-1.5 bg-paper/40 border border-line rounded-xl text-xs font-semibold text-ink cursor-pointer outline-none"
              >
                <option value="all">All Scope Levels</option>
                <option value="outlet">Outlet Level</option>
                <option value="entity">Entity Level</option>
                <option value="both">Universal Level</option>
              </select>
            </div>
          </div>

          {/* Active Standards Table (Matching Admin Ledger) */}
          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
              <div>
                <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5A2EA6]" />
                  Active Compliance Standards &amp; Brand Protocol Ledger
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  Full list of active compliance requirements configured for this brand network. Upload clearance documents or review compliance statuses.
                </p>
              </div>
              <span className="text-xs text-soft font-semibold">
                Showing {filteredList.length} of {totalActiveStandards} active rules
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <th className="p-3.5 pl-5">Rule Code &amp; Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Enforced Scope / Level</th>
                    <th className="p-3.5">Renewal Cycle</th>
                    <th className="p-3.5 text-center">Mandatory</th>
                    <th className="p-3.5 text-center">Standard Type</th>
                    <th className="p-3.5 text-center">Compliance Status</th>
                    <th className="p-3.5 pr-5 text-right w-[230px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-muted">
                        <ShieldAlert className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <strong className="text-sm font-bold text-ink block">No active compliance rules found</strong>
                        <span className="text-xs text-muted">Adjust your filter criteria or search query.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map(({ req, submission, status, dueDate, lastAudit }) => (
                      <tr key={req.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                        {/* 1. Rule Code & Title */}
                        <td className="p-3.5 pl-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 bg-purple-50 text-[#5A2EA6] rounded border border-purple-200 shrink-0">
                              {req.id}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-ink text-xs">{req.name}</span>
                                {!req.isDefault && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-0.5">
                                    <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Custom
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted line-clamp-1">{req.description}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Category */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            {req.category}
                          </span>
                        </td>

                        {/* 3. Enforced Scope / Level */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${req.level === 'outlet'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : req.level === 'entity'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                          >
                            {req.level === 'outlet'
                              ? 'Outlet Level (Branch Manager & Franchisee)'
                              : req.level === 'entity'
                                ? 'Entity Level (Franchise Partner Only)'
                                : 'Universal (All Outlets & Entities)'}
                          </span>
                        </td>

                        {/* 4. Renewal Cycle */}
                        <td className="p-3.5 whitespace-nowrap font-semibold text-slate-800">
                          {req.renewalFrequency}
                        </td>

                        {/* 5. Mandatory */}
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

                        {/* 6. Standard Type */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          {req.isDefault ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-200">
                              Default Standard
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              Custom (Added by Brand Admin)
                            </span>
                          )}
                        </td>

                        {/* 7. Compliance Status */}
                        <td className="p-3.5 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                          >
                            {status}
                          </span>
                          {submission && (
                            <div className="text-[9px] text-muted mt-0.5">
                              Due: {submission.expiryDate}
                            </div>
                          )}
                        </td>

                        {/* 8. Actions */}
                        <td className="p-3.5 pr-5 text-right whitespace-nowrap w-[230px]">
                          <div className="flex items-center justify-end gap-2">
                            {submission ? (
                              <button
                                onClick={() => setViewDocModalSub(submission)}
                                className="w-[84px] h-[30px] rounded-lg text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 cursor-pointer transition shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
                              >
                                <Eye className="w-3.5 h-3.5" /> <span>View</span>
                              </button>
                            ) : (
                              <div className="w-[84px] h-[30px] shrink-0" aria-hidden="true" />
                            )}

                            <button
                              onClick={() => handleOpenUpload(req, submission)}
                              className={`w-[130px] h-[30px] rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 border ${status === 'Approved'
                                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                                : status === 'Pending'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                                  : 'bg-[#5A2EA6] text-white hover:bg-[#482387] border-[#5A2EA6]'
                                }`}
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>
                                {status === 'Approved'
                                  ? 'Replace / Renew'
                                  : status === 'Pending'
                                    ? 'Update Scan'
                                    : 'Upload Clearance'}
                              </span>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COMPLIANCE MONITORING MATRIX (SUBMISSIONS LEDGER) */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-5">
          {/* Matrix Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Total Clearances</span>
              <div className="text-2xl font-bold text-ink mt-0.5">
                {matrixTotalCount} Submissions
              </div>
              <span className="text-[10.5px] text-purple-700 font-semibold">Across Franchise Outlets</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Verified &amp; Compliant</span>
              <div className="text-2xl font-bold text-emerald-700 mt-0.5">
                {matrixVerifiedCount} Clearances
              </div>
              <span className="text-[10.5px] text-emerald-600 font-semibold">Audit Passed</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Under HQ Review</span>
              <div className="text-2xl font-bold text-amber-700 mt-0.5">
                {matrixPendingCount} Pending
              </div>
              <span className="text-[10.5px] text-amber-600 font-semibold">Verification in Progress</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-soft block">Attention Required</span>
              <div className="text-2xl font-bold text-rose-700 mt-0.5">
                {matrixActionCount} Overdue / Due
              </div>
              <span className="text-[10.5px] text-rose-600 font-semibold">Renewal Needed</span>
            </div>
          </div>

          {/* Matrix Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search requirement, branch, ref number..."
                  value={matrixSearchQuery}
                  onChange={(e) => setMatrixSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <select
                value={matrixStatusFilter}
                onChange={(e) => setMatrixStatusFilter(e.target.value)}
                className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
              >
                <option value="all">All Audit Statuses</option>
                <option value="Compliant">Verified / Compliant</option>
                <option value="Pending">Pending Review</option>
                <option value="Action Required">Action Required</option>
                <option value="Expiring">Expiring Soon / Expired</option>
              </select>

              <select
                value={matrixBranchFilter}
                onChange={(e) => setMatrixBranchFilter(e.target.value)}
                className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
              >
                <option value="all">All Outlets / Scopes</option>
                {outlets
                  .filter((o) => o.id !== 'all')
                  .map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportMatrixCsv}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" /> Export Matrix
              </button>
            </div>
          </div>

          {/* Matrix Submissions Table */}
          <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
              <div>
                <h3 className="font-serif font-bold text-ink text-base flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#5A2EA6]" />
                  Franchise Statutory &amp; Audit Compliance Matrix
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  Clearance document dossiers, certificate references, and brand HQ inspection verifications.
                </p>
              </div>
              <span className="text-xs text-soft font-semibold">
                Showing {filteredMatrixSubmissions.length} of {submissions.length} dossiers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                    <th className="p-3.5 pl-5">Document / License Standard</th>
                    <th className="p-3.5">Branch / Outlet</th>
                    <th className="p-3.5">Doc Ref &amp; File</th>
                    <th className="p-3.5">Issuing Authority</th>
                    <th className="p-3.5">Uploaded By</th>
                    <th className="p-3.5">Validity Expiry</th>
                    <th className="p-3.5 text-center">Audit Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                  {filteredMatrixSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-muted">
                        <ShieldAlert className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <strong className="text-sm font-bold text-ink block">No clearance submissions match your filters</strong>
                        <span className="text-xs text-muted">Upload a compliance clearance from the Active Standards tab.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredMatrixSubmissions.map((sub) => {
                      const matchingReq = activeRequirements.find((r) => r.id === sub.requirementId);
                      return (
                        <tr key={sub.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                          {/* Standard */}
                          <td className="p-3.5 pl-5 whitespace-nowrap font-bold text-ink">
                            <div className="flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span>{sub.requirementName}</span>
                                  {matchingReq && !matchingReq.isDefault && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-0.5">
                                      <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Custom
                                    </span>
                                  )}
                                </div>
                                {sub.notes && (
                                  <div className="text-[10px] text-muted font-normal truncate max-w-[220px]">
                                    {sub.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Branch */}
                          <td className="p-3.5 whitespace-nowrap text-slate-800">
                            <span className="inline-flex items-center gap-1 font-medium">
                              <Store className="w-3 h-3 text-[#5A2EA6]" />
                              {sub.branchName}
                            </span>
                          </td>

                          {/* Doc Ref & File */}
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-mono text-muted text-[11px] font-bold">{sub.documentRef}</div>
                            <div className="text-[10px] text-purple-700 flex items-center gap-1 mt-0.5 font-medium">
                              <Download className="w-2.5 h-2.5" /> {sub.fileName} ({sub.fileSize})
                            </div>
                          </td>

                          {/* Authority */}
                          <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                            {sub.issuingAuthority}
                          </td>

                          {/* Uploaded By */}
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${sub.uploadedByRole === 'Branch Manager'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : sub.uploadedByRole === 'Franchise Partner'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                            >
                              <UserCheck className="w-2.5 h-2.5" />
                              {sub.uploadedByRole}
                            </span>
                            <div className="text-[9.5px] text-soft">{sub.uploadedByName}</div>
                          </td>

                          {/* Validity Expiry */}
                          <td className="p-3.5 whitespace-nowrap text-[11px] font-bold text-slate-800">
                            {sub.expiryDate}
                          </td>

                          {/* HQ Audit Status */}
                          <td className="p-3.5 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-bold border ${sub.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : sub.status === 'Expiring Soon'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : sub.status === 'Action Required'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                            >
                              {sub.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewDocModalSub(sub)}
                                className="px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-xs flex items-center gap-1.5 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50"
                              >
                                <Eye className="w-3 h-3 text-purple-600" />
                                <span>Inspect Dossier</span>
                              </button>

                              {matchingReq && (
                                <button
                                  onClick={() => handleOpenUpload(matchingReq, sub)}
                                  className="p-1.5 text-[#5A2EA6] hover:bg-purple-50 rounded-lg cursor-pointer transition border border-purple-200"
                                  title="Replace Scan / Renew Clearance"
                                >
                                  <Upload className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: UPLOAD / RENEW CLEARANCE */}
      {/* ========================================================================= */}
      {uploadModalReq &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => {
              setUploadModalReq(null);
              setUploadModalSub(null);
            }}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Franchise Partner Upload Desk
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">{uploadModalReq.id}</span>
                    {uploadModalReq.isDefault ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#5A2EA6] border border-purple-200">
                        Default Standard
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1 shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Custom Standard (Added by Brand Admin)
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">{uploadModalReq.name}</h3>
                  <p className="text-xs text-muted">{uploadModalReq.description}</p>
                </div>
                <button
                  onClick={() => {
                    setUploadModalReq(null);
                    setUploadModalSub(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmUpload} className="p-6 space-y-4 text-xs overflow-y-auto flex-1 no-scrollbar">
                <div>
                  <label className="font-bold text-ink block mb-1">Target Operational Outlet *</label>
                  <select
                    value={uploadBranchId}
                    onChange={(e) => setUploadBranchId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink bg-white cursor-pointer"
                  >
                    {outlets
                      .filter((o) => o.id !== 'all')
                      .map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Certificate / License Reference *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BMC-TL-2026-9901"
                      value={uploadDocRef}
                      onChange={(e) => setUploadDocRef(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Issuing Authority / Agency *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Municipal Corporation / Fire Dept"
                      value={uploadIssuingAuth}
                      onChange={(e) => setUploadIssuingAuth(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Inspection / Issue Date *</label>
                    <input
                      type="date"
                      required
                      value={uploadIssueDate}
                      onChange={(e) => setUploadIssueDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Validity Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={uploadExpiryDate}
                      onChange={(e) => setUploadExpiryDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Attach Scanned Clearance PDF / Stamp Proof *</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFilePicked}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*"
                    className="hidden"
                  />
                  {uploadFileUrl ? (
                    <div className="border-2 border-[#5A2EA6]/30 bg-purple-50/20 p-4 rounded-2xl text-center space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-[#5A2EA6] px-1">
                        <span>📷 Previous / Current Uploaded Document Image:</span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 text-[10px] bg-white border border-[#5A2EA6] text-[#5A2EA6] rounded-lg hover:bg-purple-50 cursor-pointer font-bold shadow-xs"
                        >
                          Change / Upload New Image
                        </button>
                      </div>
                      <div className="overflow-hidden rounded-xl bg-white border border-slate-200 p-2 shadow-xs max-h-[220px] flex items-center justify-center">
                        <img
                          src={uploadFileUrl}
                          alt={uploadFileName}
                          className="max-h-[200px] w-auto max-w-full object-contain rounded-lg"
                        />
                      </div>
                      <div className="text-[11px] text-slate-600 font-semibold">
                        File: <strong className="text-slate-900">{uploadFileName}</strong> ({uploadFileSize})
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#5A2EA6]/30 bg-purple-50/20 p-5 rounded-2xl text-center space-y-2 cursor-pointer hover:bg-purple-50/40 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-[#5A2EA6] mx-auto" />
                      <div>
                        <span className="font-bold text-ink text-xs block">{uploadFileName}</span>
                        <span className="text-[10px] text-muted">
                          Size: {uploadFileSize} · Click or drag to attach PDF, JPG, PNG
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-3 py-1 bg-white border border-[#5A2EA6] text-[#5A2EA6] rounded-lg font-bold text-[11px] cursor-pointer hover:bg-purple-50"
                      >
                        Choose Document File
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Compliance Remarks / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Provide additional details regarding testing, municipal ref, or engineer report..."
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadModalReq(null);
                      setUploadModalSub(null);
                    }}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Submit to Brand HQ for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* ========================================================================= */}
      {/* MODAL 2: VIEW DOCUMENT DOSSIER */}
      {/* ========================================================================= */}
      {viewDocModalSub &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setViewDocModalSub(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Document Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">{viewDocModalSub.documentRef}</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">{viewDocModalSub.requirementName}</h3>
                  <p className="text-xs text-muted">Scope Outlet: {viewDocModalSub.branchName}</p>
                </div>
                <button
                  onClick={() => setViewDocModalSub(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1 no-scrollbar">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Current Status</span>
                    <span
                      className={`font-bold text-sm block mt-0.5 ${viewDocModalSub.status === 'Verified'
                        ? 'text-emerald-700'
                        : viewDocModalSub.status === 'Pending Review'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                        }`}
                    >
                      {viewDocModalSub.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Validity Expiry</span>
                    <span className="font-bold text-ink text-sm block mt-0.5">{viewDocModalSub.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Issuing Authority</span>
                    <span className="font-semibold text-slate-800">{viewDocModalSub.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Standard Type / Origin</span>
                    <span className="font-semibold text-slate-800">
                      {activeRequirements.find((r) => r.id === viewDocModalSub.requirementId)?.isDefault ? (
                        <span className="text-[#5A2EA6] font-bold">Default Standard</span>
                      ) : (
                        <span className="text-amber-800 font-bold inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" /> Custom (Added by Admin)
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Uploaded By</span>
                    <span className="font-semibold text-purple-900">{viewDocModalSub.uploadedByName} ({viewDocModalSub.uploadedByRole})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Issue Date</span>
                    <span className="font-semibold text-slate-800">{viewDocModalSub.issueDate}</span>
                  </div>
                </div>

                {viewDocModalSub.hqRemarks && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">HQ Compliance Inspection Feedback</span>
                    <p className="text-emerald-950 font-medium mt-0.5">{viewDocModalSub.hqRemarks}</p>
                    {viewDocModalSub.reviewedByName && (
                      <span className="text-[9.5px] text-emerald-700 mt-1 block">Signed off by: {viewDocModalSub.reviewedByName}</span>
                    )}
                  </div>
                )}

                {/* Hidden file input for loading real image in View modal if missing */}
                <input
                  type="file"
                  ref={dossierFileInputRef}
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && viewDocModalSub) {
                      const blobUrl = URL.createObjectURL(file);
                      const sizeMb = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
                      const instantSub = {
                        ...viewDocModalSub,
                        fileName: file.name,
                        fileSize: sizeMb,
                        fileUrl: blobUrl,
                      };
                      setViewDocModalSub(instantSub);
                      addOrUpdateSubmission(instantSub);

                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        const persistentSub = {
                          ...instantSub,
                          fileUrl: dataUrl,
                        };
                        setViewDocModalSub(persistentSub);
                        addOrUpdateSubmission(persistentSub);
                        toast(`Loaded real image file "${file.name}".`);
                      };
                      reader.readAsDataURL(file);
                    }
                    e.target.value = '';
                  }}
                />

                {/* Real Image Preview Container */}
                <div className="p-3 bg-slate-900/5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="font-bold text-ink">{viewDocModalSub.fileName} ({viewDocModalSub.fileSize})</span>
                    <button
                      type="button"
                      onClick={() => dossierFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[10px] bg-white border border-[#5A2EA6] text-[#5A2EA6] rounded-lg font-bold hover:bg-purple-50 cursor-pointer shadow-xs"
                    >
                      Change / Load Image
                    </button>
                  </div>
                  <div className="overflow-hidden rounded-xl bg-white border border-slate-200 p-2 shadow-sm min-h-[160px] max-h-[380px] flex items-center justify-center">
                    {viewDocModalSub.fileUrl ? (
                      <img
                        src={viewDocModalSub.fileUrl}
                        alt={viewDocModalSub.fileName}
                        className="max-h-[360px] w-auto max-w-full object-contain rounded-lg shadow-xs"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-2.5">
                        <FileText className="w-10 h-10 text-purple-300 mx-auto" />
                        <div>
                          <strong className="text-xs font-bold text-ink block">No Image File Saved for this Submission</strong>
                          <span className="text-[11px] text-muted block mt-0.5">
                            File name "{viewDocModalSub.fileName}" is recorded, but no image was attached.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => dossierFileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold shadow hover:bg-[#482387] cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" /> Attach / Select Image File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setViewDocModalSub(null)}
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default CompliancePage;
