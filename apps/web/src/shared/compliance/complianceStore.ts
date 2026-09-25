import { useEffect, useState } from 'react';
import { tokenStorage } from '@/shared/api/client';
import { tenantsApi } from '@/shared/api/tenants.api';

export type ComplianceCategory =
  | 'Statutory Licensing'
  | 'Fire & Life Safety'
  | 'Equipment & Assets'
  | 'Staff Certification'
  | 'Health & Hygiene'
  | 'Brand Standards & SOP'
  | 'Insurance & Legal'
  | 'Environmental & Sanitation';

export type ComplianceLevel = 'outlet' | 'entity' | 'both';

export type RenewalFrequency =
  | 'Annual'
  | 'Semi-Annual'
  | 'Quarterly'
  | 'Monthly'
  | 'Permanent / One-Time';

export interface ComplianceRequirement {
  id: string;
  dbId?: string;
  name: string;
  category: ComplianceCategory;
  level: ComplianceLevel; // 'outlet' (Branch Manager & Franchisee), 'entity' (Franchise Partner Only), 'both' (Universal)
  renewalFrequency: RenewalFrequency;
  validityMonths: number;
  mandatory: boolean;
  requiresDocument: boolean;
  description: string;
  isActive: boolean;
  createdAt: string;
  tenantId?: string; // Scoped to tenant if custom or cloned
  isDefault?: boolean; // True for system default REQ-01..REQ-08
}

export type SubmissionStatus =
  | 'Verified'
  | 'Pending Review'
  | 'Action Required'
  | 'Expiring Soon'
  | 'Expired'
  | 'Missing';

export interface ComplianceDocumentSubmission {
  id: string;
  requirementId: string;
  requirementName: string;
  partnerId: string;
  partnerName: string;
  branchId: string;
  branchName: string;
  documentRef: string;
  fileName: string;
  fileSize: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  uploadedByRole: 'Branch Manager' | 'Franchise Partner' | 'Brand Admin';
  uploadedByName: string;
  uploadedDate: string;
  status: SubmissionStatus;
  notes?: string;
  hqRemarks?: string;
  reviewedByName?: string;
  reviewedDate?: string;
  lastAuditDate?: string;
  tenantId?: string;
  fileUrl?: string;
}

// 8 BASELINE STANDARD REQUIREMENTS (Default in all salons)
export const DEFAULT_REQUIREMENTS: ComplianceRequirement[] = [
  {
    id: 'REQ-01',
    name: 'Business Trade License',
    category: 'Statutory Licensing',
    level: 'outlet',
    renewalFrequency: 'Annual',
    validityMonths: 12,
    mandatory: true,
    requiresDocument: true,
    description: 'Municipal Corporation Trade & Business License for salon premises',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-02',
    name: 'GST Registration Certificate',
    category: 'Statutory Licensing',
    level: 'both',
    renewalFrequency: 'Permanent / One-Time',
    validityMonths: 0,
    mandatory: true,
    requiresDocument: true,
    description: '15-digit State GSTIN tax registration certificate and filings',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-03',
    name: 'Fire Safety NOC & Evacuation Plan',
    category: 'Fire & Life Safety',
    level: 'outlet',
    renewalFrequency: 'Annual',
    validityMonths: 12,
    mandatory: true,
    requiresDocument: true,
    description: 'Fire Department NOC clearance & fire extinguisher annual refilling proof',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-04',
    name: 'Staff Training & Protocol Certification',
    category: 'Staff Certification',
    level: 'both',
    renewalFrequency: 'Semi-Annual',
    validityMonths: 6,
    mandatory: true,
    requiresDocument: true,
    description: 'Brand HQ master stylist, hygiene protocols, and service technical certification',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-05',
    name: 'Equipment Maintenance & Autoclave Log',
    category: 'Equipment & Assets',
    level: 'outlet',
    renewalFrequency: 'Annual',
    validityMonths: 12,
    mandatory: true,
    requiresDocument: true,
    description: 'Autoclave sterilization calibration, hydraulic chair servicing & electrical audit',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-06',
    name: 'Brand Standards & Ambience SOP Audit',
    category: 'Brand Standards & SOP',
    level: 'both',
    renewalFrequency: 'Quarterly',
    validityMonths: 3,
    mandatory: true,
    requiresDocument: true,
    description: 'Storefront signage, uniform etiquette, aroma, interior aesthetics & mystery audit',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-07',
    name: 'Commercial General Liability Insurance',
    category: 'Insurance & Legal',
    level: 'both',
    renewalFrequency: 'Annual',
    validityMonths: 12,
    mandatory: true,
    requiresDocument: true,
    description: 'Commercial Public Liability & Property damage active policy on file',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'REQ-08',
    name: 'Staff Medical Fitness & Health Card',
    category: 'Health & Hygiene',
    level: 'outlet',
    renewalFrequency: 'Annual',
    validityMonths: 12,
    mandatory: true,
    requiresDocument: true,
    description: 'Annual staff health examination, communicable disease test & sanitary certificate',
    isActive: true,
    createdAt: '2024-01-01',
    isDefault: true,
  },
];

// INITIAL BASELINE SUBMISSIONS (Empty - no dummy submissions)
export const DEFAULT_SUBMISSIONS: ComplianceDocumentSubmission[] = [];

const STORAGE_KEYS = {
  REQUIREMENTS_PREFIX: 'digiflex_compliance_requirements_',
  SUBMISSIONS_PREFIX: 'digiflex_compliance_submissions_',
  LEGACY_REQUIREMENTS: 'digiflex_compliance_requirements_v1',
  LEGACY_SUBMISSIONS: 'digiflex_compliance_submissions_v1',
  EVENT: 'digiflex_compliance_store_change',
};

export function getCurrentTenantId(): string {
  try {
    const fromToken = tokenStorage.getTenantId();
    if (
      fromToken &&
      fromToken !== 'undefined' &&
      fromToken !== 'null' &&
      fromToken.trim() &&
      fromToken !== 'default'
    ) {
      return fromToken.trim();
    }
  } catch { }

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        k.startsWith(STORAGE_KEYS.REQUIREMENTS_PREFIX) &&
        k !== `${STORAGE_KEYS.REQUIREMENTS_PREFIX}default`
      ) {
        const tid = k.replace(STORAGE_KEYS.REQUIREMENTS_PREFIX, '');
        if (tid && tid !== 'undefined' && tid !== 'null') {
          return tid;
        }
      }
    }
  } catch { }

  return 'f77a407a-45c1-4b8a-a08d-703bf7eeaea5';
}

export function getTenantRequirementsKey(tenantId?: string): string {
  const tid = tenantId || getCurrentTenantId();
  return `${STORAGE_KEYS.REQUIREMENTS_PREFIX}${tid}`;
}

export function getTenantSubmissionsKey(tenantId?: string): string {
  const tid = tenantId || getCurrentTenantId();
  return `${STORAGE_KEYS.SUBMISSIONS_PREFIX}${tid}`;
}

const BROADCAST_CHANNEL_NAME = 'digiflex_compliance_sync_channel';

let syncBroadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    syncBroadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch { }

export function notifyStoreChanged(tenantId?: string) {
  const tid = tenantId || getCurrentTenantId();
  window.dispatchEvent(
    new CustomEvent(STORAGE_KEYS.EVENT, { detail: { type: 'requirements', tenantId: tid } }),
  );
  try {
    syncBroadcastChannel?.postMessage({ type: 'compliance_updated', tenantId: tid });
  } catch { }
}

export function resequenceRequirements(reqs: ComplianceRequirement[]): ComplianceRequirement[] {
  const uniqueReqs: ComplianceRequirement[] = [];
  const seenKeys = new Set<string>();

  for (const r of reqs) {
    if (!r || !r.name) continue;
    const nameLower = r.name.trim().toLowerCase();
    // Exclude stale dummy rules
    if (nameLower === 'fvgsdgf' || nameLower.includes('fvgsdgf') || (nameLower === 'zzzgfdfd' && reqs.length === 8)) {
      continue;
    }
    const key = `${nameLower}_${r.category}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueReqs.push(r);
    }
  }

  return uniqueReqs.map((req, idx) => ({
    ...req,
    id: `REQ-${String(idx + 1).padStart(2, '0')}`,
  }));
}

// LocalStorage Persistence Helpers (Tenant Scoped with Unified Master Sync)
export function getStoredRequirements(tenantId?: string): ComplianceRequirement[] {
  const tid = tenantId || getCurrentTenantId();
  try {
    const masterRaw = localStorage.getItem('digiflex_compliance_requirements_master');
    if (masterRaw) {
      try {
        const parsed = JSON.parse(masterRaw);
        if (Array.isArray(parsed)) {
          return resequenceRequirements(
            parsed.map((r) => ({
              ...r,
              isActive: r.isActive !== false,
              isDefault: r.isDefault ?? (r.id.startsWith('REQ-0') && parseInt(r.id.slice(4)) <= 8),
            })),
          );
        }
      } catch { }
    }

    const tenantRaw = localStorage.getItem(getTenantRequirementsKey(tid));
    if (tenantRaw) {
      try {
        const parsed = JSON.parse(tenantRaw);
        if (Array.isArray(parsed)) {
          const sequenced = resequenceRequirements(
            parsed.map((r) => ({
              ...r,
              isActive: r.isActive !== false,
              isDefault: r.isDefault ?? (r.id.startsWith('REQ-0') && parseInt(r.id.slice(4)) <= 8),
            })),
          );
          localStorage.setItem('digiflex_compliance_requirements_master', JSON.stringify(sequenced));
          return sequenced;
        }
      } catch { }
    }

    const initial = resequenceRequirements(
      DEFAULT_REQUIREMENTS.map((r) => ({
        ...r,
        tenantId: tid,
        isDefault: true,
      })),
    );
    saveStoredRequirements(initial, tid);
    return initial;
  } catch (err) {
    console.error('Error reading compliance requirements from localStorage:', err);
    return DEFAULT_REQUIREMENTS;
  }
}

export function saveStoredRequirements(reqs: ComplianceRequirement[], tenantId?: string): void {
  const tid = tenantId || getCurrentTenantId();
  try {
    const sequenced = resequenceRequirements(reqs);
    const jsonStr = JSON.stringify(sequenced);

    localStorage.setItem('digiflex_compliance_requirements_master', jsonStr);
    localStorage.setItem(getTenantRequirementsKey(tid), jsonStr);
    localStorage.setItem(`${STORAGE_KEYS.REQUIREMENTS_PREFIX}default`, jsonStr);

    const keysToUpdate: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_KEYS.REQUIREMENTS_PREFIX)) {
        keysToUpdate.push(k);
      }
    }
    keysToUpdate.forEach((k) => localStorage.setItem(k, jsonStr));

    notifyStoreChanged(tid);
  } catch (err) {
    console.error('Error saving compliance requirements to localStorage:', err);
  }
}

// Fetch live requirements from backend API (organization-service) and sync
export async function fetchRequirementsFromApi(tenantId?: string): Promise<ComplianceRequirement[]> {
  const tid = tenantId || getCurrentTenantId();
  try {
    const apiData = await tenantsApi.listComplianceRequirements(tid);
    if (Array.isArray(apiData)) {
      const mapped: ComplianceRequirement[] = apiData.map((r: any) => ({
        id: r.code || r.id,
        dbId: r.dbId || r.id,
        name: r.name,
        category: (r.category || 'Statutory Licensing') as ComplianceCategory,
        level: (r.level || 'outlet') as ComplianceLevel,
        renewalFrequency: (r.renewalFrequency || 'Annual') as RenewalFrequency,
        validityMonths: r.validityMonths ?? 12,
        mandatory: r.mandatory !== false,
        requiresDocument: r.requiresDocument !== false,
        description: r.description || '',
        isActive: r.isActive !== false,
        createdAt: r.createdAt || new Date().toISOString().split('T')[0],
        tenantId: r.tenantId || tid,
        isDefault: r.isDefault ?? false,
      }));
      const sequenced = resequenceRequirements(mapped);
      saveStoredRequirements(sequenced, tid);
      return sequenced;
    }
  } catch (err) {
    console.warn('Network call to fetch compliance requirements failed, using local cache:', err);
  }
  return getStoredRequirements(tid);
}

export function resetToDefaultRequirements(tenantId?: string): ComplianceRequirement[] {
  const tid = tenantId || getCurrentTenantId();
  const initial: ComplianceRequirement[] = DEFAULT_REQUIREMENTS.map((r) => ({
    ...r,
    tenantId: tid,
    isDefault: true,
  }));
  saveStoredRequirements(initial, tid);
  return initial;
}

export function getStoredSubmissions(tenantId?: string): ComplianceDocumentSubmission[] {
  const tid = tenantId || getCurrentTenantId();
  const key = getTenantSubmissionsKey(tid);
  try {
    const subMap = new Map<string, ComplianceDocumentSubmission>();

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.startsWith(STORAGE_KEYS.SUBMISSIONS_PREFIX) ||
          k === STORAGE_KEYS.LEGACY_SUBMISSIONS ||
          k === 'digiflex_compliance_submissions_master')
      ) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach((sub: ComplianceDocumentSubmission) => {
                if (sub && sub.id) {
                  subMap.set(sub.id, sub);
                }
              });
            }
          } catch { }
        }
      }
    }

    const mergedSubs = Array.from(subMap.values());
    const jsonStr = JSON.stringify(mergedSubs);
    localStorage.setItem(key, jsonStr);
    localStorage.setItem('digiflex_compliance_submissions_master', jsonStr);
    localStorage.setItem(`${STORAGE_KEYS.SUBMISSIONS_PREFIX}default`, jsonStr);

    return mergedSubs;
  } catch (err) {
    console.error('Error reading compliance submissions from localStorage:', err);
    return [];
  }
}

export function saveStoredSubmissions(subs: ComplianceDocumentSubmission[], tenantId?: string): void {
  const tid = tenantId || getCurrentTenantId();
  const key = getTenantSubmissionsKey(tid);
  try {
    const jsonStr = JSON.stringify(subs);
    localStorage.setItem(key, jsonStr);
    localStorage.setItem('digiflex_compliance_submissions_master', jsonStr);
    localStorage.setItem(`${STORAGE_KEYS.SUBMISSIONS_PREFIX}default`, jsonStr);

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_KEYS.SUBMISSIONS_PREFIX)) {
        localStorage.setItem(k, jsonStr);
      }
    }

    notifyStoreChanged(tid);
  } catch (err) {
    console.error('Error saving compliance submissions to localStorage:', err);
  }
}

// Store Actions with HTTP API Integration
export async function addRequirement(
  req: Omit<ComplianceRequirement, 'id' | 'createdAt'>,
  tenantId?: string,
): Promise<ComplianceRequirement> {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredRequirements(tid);

  const tempReq: ComplianceRequirement = {
    ...req,
    id: `REQ-TEMP`,
    createdAt: new Date().toISOString().split('T')[0],
    tenantId: tid,
    isDefault: false,
  };
  const sequenced = resequenceRequirements([...current, tempReq]);
  saveStoredRequirements(sequenced, tid);

  // Send HTTP POST request to API endpoint (/api/v1/compliance/requirements)
  try {
    await tenantsApi.createComplianceRequirement({
      ...req,
      tenantId: tid,
    });
    // Fetch fresh synchronized state from API database
    const fresh = await fetchRequirementsFromApi(tid);
    return fresh[fresh.length - 1];
  } catch (err) {
    console.warn('Could not persist requirement to backend API, saved locally:', err);
  }

  return sequenced[sequenced.length - 1];
}

export function updateRequirement(
  id: string,
  updates: Partial<ComplianceRequirement>,
  tenantId?: string,
): void {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredRequirements(tid);
  const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
  saveStoredRequirements(updated, tid);
}

export function toggleRequirementActive(id: string, tenantId?: string): void {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredRequirements(tid);
  const updated = current.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r));
  saveStoredRequirements(updated, tid);
}

export async function deleteRequirement(id: string, tenantId?: string): Promise<void> {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredRequirements(tid);
  const targetItem = current.find((r) => r.id === id || r.dbId === id);
  const deleteIdOrCode = targetItem?.dbId || targetItem?.id || id;

  // Purge any submissions attached to this deleted requirement
  const currentSubs = getStoredSubmissions(tid);
  const remainingSubs = currentSubs.filter(
    (s) =>
      s.requirementId !== id &&
      s.requirementId !== deleteIdOrCode &&
      (!targetItem || s.requirementName.trim().toLowerCase() !== targetItem.name.trim().toLowerCase()),
  );
  saveStoredSubmissions(remainingSubs, tid);

  // Optimistic local delete & resequence
  const updated = resequenceRequirements(current.filter((r) => r.id !== id && r.dbId !== id));
  saveStoredRequirements(updated, tid);

  // Send HTTP DELETE request to API endpoint (/api/v1/compliance/requirements/:id)
  try {
    await tenantsApi.deleteComplianceRequirement(deleteIdOrCode);
    await fetchRequirementsFromApi(tid);
  } catch (err) {
    console.warn('Could not delete requirement from backend API, deleted locally:', err);
  }
}

export function addOrUpdateSubmission(
  subData: Partial<ComplianceDocumentSubmission> & { requirementId: string },
  tenantId?: string,
): ComplianceDocumentSubmission {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredSubmissions(tid);
  const reqs = getStoredRequirements(tid);
  const req = reqs.find((r) => r.id === subData.requirementId);

  const existingIdx = current.findIndex(
    (s) =>
      s.id === subData.id ||
      (s.requirementId === subData.requirementId &&
        (subData.branchId ? s.branchId === subData.branchId : true)),
  );

  const newSub: ComplianceDocumentSubmission = {
    id: subData.id || `SUB-${Date.now().toString().slice(-4)}`,
    requirementId: subData.requirementId,
    requirementName: subData.requirementName || req?.name || 'Compliance Clearance',
    partnerId: subData.partnerId || 'FP-IND-01',
    partnerName: subData.partnerName || 'Apex Wellness & Spa LLP',
    branchId: subData.branchId || 'BR-IND-01',
    branchName: subData.branchName || 'Indore Vijay Nagar Flagship',
    documentRef: subData.documentRef || `DOC-REF-${Math.floor(1000 + Math.random() * 9000)}`,
    fileName: subData.fileName || 'Uploaded_Clearance_Document.pdf',
    fileSize: subData.fileSize || '1.5 MB',
    issuingAuthority: subData.issuingAuthority || 'Authorized Testing / Municipal Agency',
    issueDate: subData.issueDate || new Date().toISOString().split('T')[0],
    expiryDate: subData.expiryDate || '2026-12-31',
    uploadedByRole: subData.uploadedByRole || 'Branch Manager',
    uploadedByName: subData.uploadedByName || 'Authorized Representative',
    uploadedDate: subData.uploadedDate || new Date().toISOString().split('T')[0],
    status: subData.status || 'Pending Review',
    notes: subData.notes,
    hqRemarks: subData.hqRemarks,
    lastAuditDate: subData.lastAuditDate || new Date().toISOString().split('T')[0],
    tenantId: tid,
    fileUrl: subData.fileUrl || (existingIdx >= 0 ? current[existingIdx].fileUrl : undefined),
  };

  if (existingIdx >= 0) {
    current[existingIdx] = {
      ...current[existingIdx],
      ...newSub,
      fileUrl: subData.fileUrl || current[existingIdx].fileUrl,
    };
  } else {
    current.unshift(newSub);
  }

  saveStoredSubmissions([...current], tid);
  return newSub;
}

export function deleteSubmission(id: string, tenantId?: string): void {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredSubmissions(tid);
  const updated = current.filter((s) => s.id !== id);
  saveStoredSubmissions(updated, tid);
}

export function reviewSubmission(
  id: string,
  newStatus: 'Verified' | 'Action Required' | 'Expired',
  remarks: string,
  reviewerName: string = 'HQ Compliance Director',
  tenantId?: string,
): void {
  const tid = tenantId || getCurrentTenantId();
  const current = getStoredSubmissions(tid);
  const updated = current.map((s) =>
    s.id === id
      ? {
        ...s,
        status: newStatus,
        hqRemarks: remarks,
        reviewedByName: reviewerName,
        reviewedDate: new Date().toISOString().split('T')[0],
        lastAuditDate:
          newStatus === 'Verified' ? new Date().toISOString().split('T')[0] : s.lastAuditDate,
      }
      : s,
  );
  saveStoredSubmissions(updated, tid);
}

// React Custom Hook for components across Admin, Franchise, and Branch Manager
export function useComplianceStore(tenantId?: string) {
  const effectiveTenantId = tenantId || getCurrentTenantId();
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>(() =>
    getStoredRequirements(effectiveTenantId),
  );
  const [submissions, setSubmissions] = useState<ComplianceDocumentSubmission[]>(() =>
    getStoredSubmissions(effectiveTenantId),
  );

  const handleStoreChange = () => {
    setRequirements(getStoredRequirements(effectiveTenantId));
    setSubmissions(getStoredSubmissions(effectiveTenantId));
  };

  useEffect(() => {
    // Initial fetch from backend API
    fetchRequirementsFromApi(effectiveTenantId).then((res) => {
      setRequirements(res);
    });

    window.addEventListener(STORAGE_KEYS.EVENT, handleStoreChange);
    window.addEventListener('storage', handleStoreChange);
    window.addEventListener('focus', handleStoreChange);

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = () => {
          handleStoreChange();
        };
      }
    } catch { }

    return () => {
      window.removeEventListener(STORAGE_KEYS.EVENT, handleStoreChange);
      window.removeEventListener('storage', handleStoreChange);
      window.removeEventListener('focus', handleStoreChange);
      try {
        bc?.close();
      } catch { }
    };
  }, [effectiveTenantId]);

  return {
    tenantId: effectiveTenantId,
    requirements,
    activeRequirements: requirements.filter((r) => r.isActive !== false),
    submissions,
    refreshStore: () => {
      handleStoreChange();
      fetchRequirementsFromApi(effectiveTenantId).then(setRequirements);
    },
    addRequirement: (req: Omit<ComplianceRequirement, 'id' | 'createdAt'>) =>
      addRequirement(req, effectiveTenantId),
    updateRequirement: (id: string, updates: Partial<ComplianceRequirement>) =>
      updateRequirement(id, updates, effectiveTenantId),
    toggleRequirementActive: (id: string) => toggleRequirementActive(id, effectiveTenantId),
    deleteRequirement: (id: string) => deleteRequirement(id, effectiveTenantId),
    resetToDefaultRequirements: () => resetToDefaultRequirements(effectiveTenantId),
    addOrUpdateSubmission: (subData: Partial<ComplianceDocumentSubmission> & { requirementId: string }) =>
      addOrUpdateSubmission(subData, effectiveTenantId),
    deleteSubmission: (id: string) => deleteSubmission(id, effectiveTenantId),
    reviewSubmission: (
      id: string,
      newStatus: 'Verified' | 'Action Required' | 'Expired',
      remarks: string,
      reviewerName?: string,
    ) => reviewSubmission(id, newStatus, remarks, reviewerName, effectiveTenantId),
  };
}



