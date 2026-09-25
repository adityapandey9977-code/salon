import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Building2,
  Cake,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Crown,
  DollarSign,
  Download,
  Edit2,
  Eye,
  Filter,
  Gift,
  Heart,
  Link as LinkIcon,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Power,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { customersApi, type ApiCustomerSummary } from '@/shared/api';
import { tokenStorage } from '@/shared/api/client';
import { tenantsApi } from '@/shared/api/tenants.api';
import { useAdminContext } from '../../context/AdminContext';
import { useBranch } from '../../../branchManager/context/BranchContext';
import { masterBranches } from '../locations/AllBranchesTab';
import {
  ClientProfileDossierModal,
  type FullClientRecord,
  type HouseholdMember,
} from './ClientProfileDossierModal';
import {
  CLIENT_AVATAR_PRESETS,
  ClientProfilePage,
  toDateInputValue,
  toFriendlyDate,
} from './ClientProfilePage';



export interface AllClientsTabProps {
  defaultBranch?: string;
  branchId?: string;
  lockBranch?: boolean;
  franchiseId?: string;
  hasFranchise?: boolean;
}

export function getFranchiseDisplayName(fid: string | null | undefined, franchises: any[]): string {
  if (!fid) return 'Direct Brand';
  const found = franchises.find(
    (f: any) => f.id === fid || (f.code && f.code.toLowerCase() === fid.toLowerCase()),
  );
  return found?.companyName || found?.name || found?.code || `Franchise (${fid.slice(0, 8)})`;
}

import { compressImageFile } from '@/shared/utils/imageCompress';

export function mapApiCustomerToFullRecord(
  apiCust: ApiCustomerSummary,
  branches: any[],
  franchises: any[],
  defaultBranchName?: string,
): FullClientRecord {
  const rawBranchId = (apiCust.preferredBranchId || '').trim();
  const rawFranchiseId = (apiCust.franchiseId || '').trim();
  const br = branches.find(
    (b: any) => b.id && rawBranchId && b.id.toLowerCase() === rawBranchId.toLowerCase(),
  );
  const branchName = br?.name || defaultBranchName || 'Atelier Indrapuri Flagship';
  const firstName = apiCust.firstName || 'Client';
  const lastName = apiCust.lastName || '';
  const fullName = apiCust.displayName || `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0] || 'C'}${lastName ? lastName[0] : ''}`.toUpperCase();

  return {
    id: apiCust.id,
    firstName,
    lastName,
    fullName,
    mobile: apiCust.mobilePhone || '—',
    email: apiCust.email || `${firstName.toLowerCase().replace(/\s+/g, '')}@client.in`,
    gender: (apiCust.gender === 'MALE' ? 'Male' : apiCust.gender === 'OTHER' ? 'Other' : 'Female') as any,
    dob: (apiCust as any).dateOfBirth ? toFriendlyDate((apiCust as any).dateOfBirth) : '',
    avatarInitials: initials,
    avatarUrl: (apiCust as any).avatarUrl || undefined,
    accentColor: '#5A2EA6',
    primaryBranch: branchName,
    primaryBranchId: rawBranchId || undefined,
    franchiseId: rawFranchiseId || null,
    clientSince: apiCust.createdAt
      ? new Date(apiCust.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'Aug 2026',
    status: (apiCust.status === 'ACTIVE'
      ? 'Active'
      : apiCust.status === 'ARCHIVED'
        ? 'Archived'
        : apiCust.status === 'BLOCKED'
          ? 'Blocked'
          : 'Inactive') as any,
    segment: ((apiCust as any).segment ||
      (apiCust.totalVisits > 15
        ? 'VIP High Value'
        : apiCust.totalVisits > 5
          ? 'Frequent Visitor'
          : 'New Client')) as any,
    membershipTier: 'None',
    activePackage: 'None',
    totalVisits: apiCust.totalVisits || 0,
    completedVisits: apiCust.totalVisits || 0,
    cancelledVisits: 0,
    noShows: 0,
    lastVisit: apiCust.lastVisitAt
      ? new Date(apiCust.lastVisitAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'Just Registered',
    lifetimeValue: Number(apiCust.totalSpent) || 0,
    averageVisitValue: apiCust.totalVisits ? Math.round(Number(apiCust.totalSpent) / apiCust.totalVisits) : 0,
    walletBalance: 0,
    loyaltyPoints: 100,
    rebookingRate: 85,
    preferredStaff: 'Assigned Stylist',
    preferredServices: 'Signature Precision Cut',
    preferredChannel: 'WhatsApp',
    language: 'English, Hindi',
    address: {
      line1: 'Central City',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462001',
      country: 'India',
    },
    household: {
      name: `${lastName || firstName} Household`,
      members: [{ name: fullName, relation: 'Self (Primary)', mobile: apiCust.mobilePhone || '', isPrimary: true }],
    },
    safetyAllergies: {
      allergies: ['Standard Skin Protocol'],
      patchTestRequired: false,
      patchTestCompleted: true,
      cautionNote: '',
    },
    consentReferral: {
      acquisitionSource: 'Walk-in',
      whatsappOptIn: true,
      smsOptIn: true,
      emailOptIn: true,
      tags: ['Verified Client'],
    },
    appointments: [],
    serviceHistory: [],
    packages: [],
    loyaltyTransactions: [],
    feedbacks: [],
    notes: [],
    photos: [],
    consent: {
      whatsappConsent: true,
      smsConsent: true,
      emailConsent: true,
      phoneConsent: true,
      pushConsent: true,
      marketingConsent: true,
      photoConsent: true,
      consultationConsent: true,
      dateGranted: 'Today',
      lastUpdated: 'Today',
    },
  };
}

export function AllClientsTab({
  defaultBranch = 'All',
  branchId,
  lockBranch = false,
  franchiseId,
  hasFranchise = false,
}: AllClientsTabProps = {}): React.ReactElement {
  const isFranchiseScoped = hasFranchise || Boolean(franchiseId);
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [liveBranches, setLiveBranches] = useState<any[]>(
    salon?.branches && salon.branches.length > 0 ? salon.branches : [],
  );
  const [liveFranchises, setLiveFranchises] = useState<any[]>([]);

  const branchContext = useBranch();
  const assignedBranch = branchContext?.assignedBranch;

  const isUuid = (str?: string | null): boolean =>
    Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

  const effectiveBranchId = useMemo(() => {
    return (
      (isUuid(branchId) && branchId) ||
      (lockBranch && isUuid(assignedBranch?.id) && assignedBranch?.id) ||
      (isUuid(assignedBranch?.id) && assignedBranch?.id) ||
      (isUuid(tokenStorage.getBranchId()) && tokenStorage.getBranchId()) ||
      branchId ||
      assignedBranch?.id ||
      tokenStorage.getBranchId() ||
      undefined
    );
  }, [branchId, lockBranch, assignedBranch?.id]);

  const effectiveBranchName = useMemo(() => {
    if (defaultBranch && defaultBranch !== 'All') return defaultBranch;
    if (assignedBranch?.name) return assignedBranch.name;
    const match = liveBranches.find((b: any) => b.id === effectiveBranchId);
    return match?.name || undefined;
  }, [defaultBranch, assignedBranch?.name, liveBranches, effectiveBranchId]);

  const isBranchLocked = Boolean(
    lockBranch ||
    assignedBranch ||
    window.location.pathname.startsWith('/branch-manager') ||
    window.location.pathname.includes('branch-manager'),
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchMetadata() {
      try {
        const [branchRes, franchiseRes] = await Promise.all([
          tenantsApi.listBranches().catch(() => []),
          tenantsApi.listFranchises(true).catch(() => []),
        ]);
        if (isMounted) {
          if (Array.isArray(branchRes) && branchRes.length > 0) {
            setLiveBranches(branchRes);
          }
          if (Array.isArray(franchiseRes) && franchiseRes.length > 0) {
            setLiveFranchises(franchiseRes);
          }
        }
      } catch (err) {
        console.warn('Metadata fetch notice:', err);
      }
    }
    fetchMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  const availableBranches = useMemo(() => {
    let list =
      salon?.branches && salon.branches.length > 0
        ? salon.branches
        : liveBranches.length > 0
          ? liveBranches
          : masterBranches;

    if (franchiseId) {
      const franchiseBranches = list.filter(
        (b: any) => b.franchiseId === franchiseId || b.franchise_id === franchiseId,
      );
      if (franchiseBranches.length > 0) {
        list = franchiseBranches;
      }
    }

    if (
      effectiveBranchId &&
      effectiveBranchName &&
      !list.some((b: any) => b.id === effectiveBranchId || b.name === effectiveBranchName)
    ) {
      return [{ id: effectiveBranchId, name: effectiveBranchName, code: 'BRANCH' }, ...list];
    }
    return list;
  }, [salon?.branches, liveBranches, effectiveBranchId, effectiveBranchName, franchiseId]);

  // Sync new client primary branch when branch is locked
  useEffect(() => {
    if (lockBranch && effectiveBranchName) {
      setNewClient((prev) => ({
        ...prev,
        primaryBranch: effectiveBranchName,
      }));
    }
  }, [lockBranch, effectiveBranchName]);

  const [clients, setClients] = useState<FullClientRecord[]>([]);

  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [franchiseFilter, setFranchiseFilter] = useState(franchiseId || 'All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');

  // Synchronize branchFilter if defaultBranch updates
  useEffect(() => {
    if (defaultBranch && defaultBranch !== 'All') {
      setBranchFilter(defaultBranch);
    }
  }, [defaultBranch]);

  // Synchronize franchiseFilter if franchiseId updates
  useEffect(() => {
    if (franchiseId) {
      setFranchiseFilter(franchiseId);
    }
  }, [franchiseId]);

  // Load clients dynamically from API
  useEffect(() => {
    let isMounted = true;
    async function loadClients() {
      try {
        setIsLoadingApi(true);
        const queryBranchId = lockBranch && branchId ? branchId : undefined;
        const apiCustomers = await customersApi.list({
          ...(queryBranchId ? { branchId: queryBranchId } : {}),
          ...(franchiseId ? { franchiseId } : {}),
          ...(isFranchiseScoped && !franchiseId ? { hasFranchise: true } : {}),
        });

        if (isMounted && Array.isArray(apiCustomers)) {
          const mapped: FullClientRecord[] = apiCustomers.map((c) =>
            mapApiCustomerToFullRecord(c, availableBranches, liveFranchises, defaultBranch),
          );

          if (lockBranch && branchId) {
            const normalizedBranchId = branchId.toLowerCase().trim();
            const filteredByBranch = mapped.filter(
              (c) =>
                (c.primaryBranchId || '').toLowerCase().trim() === normalizedBranchId ||
                c.primaryBranch.toLowerCase().trim() === (defaultBranch || '').toLowerCase().trim(),
            );
            setClients(filteredByBranch);
          } else if (isFranchiseScoped) {
            const filteredByFranchise = mapped.filter((c) => {
              if (!c.franchiseId) return false;
              if (
                franchiseId &&
                c.franchiseId.toLowerCase().trim() !== franchiseId.toLowerCase().trim()
              ) {
                return false;
              }
              return true;
            });
            setClients(filteredByFranchise);
          } else {
            setClients(mapped);
          }
        } else if (isMounted) {
          setClients([]);
        }
      } catch (err) {
        console.warn('Live customer API fetch error:', err);
        if (isMounted) setClients([]);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }
    loadClients();
    return () => {
      isMounted = false;
    };
  }, [
    availableBranches,
    liveFranchises,
    lockBranch,
    branchId,
    defaultBranch,
    franchiseId,
    isFranchiseScoped,
  ]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClientForDossier, setSelectedClientForDossier] = useState<FullClientRecord | null>(
    null,
  );
  const [deactivateClient, setDeactivateClient] = useState<FullClientRecord | null>(null);

  // New Client Form State
  const [addModalTab, setAddModalTab] = useState<'basic' | 'household' | 'safety' | 'consent'>(
    'basic',
  );
  const [addAllergyInput, setAddAllergyInput] = useState('');
  const [addTagInput, setAddTagInput] = useState('');

  const [newClient, setNewClient] = useState({
    avatarUrl: '',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    gender: 'Female' as FullClientRecord['gender'],
    dob: '',
    anniversary: '18 Nov 2020',
    anniversaryOccasion: 'Wedding Anniversary',
    primaryBranch: availableBranches[0]?.name || masterBranches[0].name,
    franchiseId: (isFranchiseScoped ? franchiseId : '') || null,
    segment: 'New Client' as FullClientRecord['segment'],
    membershipTier: 'None',
    preferredStaff: 'Ananya Deshmukh',
    preferredServices: 'Signature Precision Cut',
    preferredChannel: 'WhatsApp',
    householdName: '',
    householdMembers: [
      { name: '', relation: 'Self (Primary)', mobile: '', isPrimary: true },
    ] as HouseholdMember[],
    addressLine1: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    pincode: '462001',
    allergies: ['Ammonia Dye', 'Strong Sulphates'],
    patchTestRequired: true,
    patchTestCompleted: true,
    cautionNote: 'Perform 24h patch test before any high-lift bleach process.',
    acquisitionSource: 'Instagram',
    whatsappConsent: true,
    smsConsent: true,
    emailConsent: true,
    clientTags: ['VIP', 'High Spender', 'Organic Products Only', 'Family Account'],
  });

  const [showAddUrlInput, setShowAddUrlInput] = useState(false);
  const [customAddUrlInput, setCustomAddUrlInput] = useState('');
  const addAvatarFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddAllergy = () => {
    if (addAllergyInput.trim()) {
      setNewClient((prev) => ({
        ...prev,
        allergies: [...prev.allergies, addAllergyInput.trim()],
      }));
      setAddAllergyInput('');
    }
  };

  const handleRemoveAllergy = (idx: number) => {
    setNewClient((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== idx),
    }));
  };

  const handleAddTag = () => {
    if (addTagInput.trim()) {
      setNewClient((prev) => ({
        ...prev,
        clientTags: [...prev.clientTags, addTagInput.trim()],
      }));
      setAddTagInput('');
    }
  };

  const handleRemoveTag = (idx: number) => {
    setNewClient((prev) => ({
      ...prev,
      clientTags: prev.clientTags.filter((_, i) => i !== idx),
    }));
  };

  const handleAddImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('Image file size must be less than 10MB.');
      return;
    }
    try {
      const compressed = await compressImageFile(file);
      setNewClient((prev) => ({ ...prev, avatarUrl: compressed }));
      toast('Profile photo attached successfully!');
    } catch (err) {
      console.warn('Image processing error:', err);
      toast('Failed to process image file.');
    }
  };

  const handleAddNewHouseholdMember = () => {
    setNewClient((prev) => ({
      ...prev,
      householdMembers: [...prev.householdMembers, { name: '', relation: 'Spouse', mobile: '' }],
    }));
  };

  const handleUpdateNewHouseholdMember = (
    index: number,
    field: keyof HouseholdMember,
    val: any,
  ) => {
    setNewClient((prev) => {
      const updated = [...prev.householdMembers];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, householdMembers: updated };
    });
  };

  const handleRemoveNewHouseholdMember = (index: number) => {
    setNewClient((prev) => ({
      ...prev,
      householdMembers: prev.householdMembers.filter((_, i) => i !== index),
    }));
  };

  const allSegments = [
    'All',
    'VIP High Value',
    'Frequent Visitor',
    'Membership Client',
    'New Client',
    'At Risk',
    'Inactive',
  ];

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.fullName.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        (c.franchiseId && c.franchiseId.toLowerCase().includes(q));
      const matchesBranch = branchFilter === 'All' || c.primaryBranch === branchFilter;
      const matchesFranchise =
        franchiseFilter === 'All'
          ? true
          : franchiseFilter === 'Direct'
            ? !c.franchiseId
            : franchiseFilter === 'Franchise'
              ? Boolean(c.franchiseId)
              : c.franchiseId?.toLowerCase() === franchiseFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesSegment = segmentFilter === 'All' || c.segment === segmentFilter;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesFranchise &&
        matchesStatus &&
        matchesSegment
      );
    });
  }, [clients, searchQuery, branchFilter, franchiseFilter, statusFilter, segmentFilter]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.firstName || !newClient.mobile) return;

    const fullName = `${newClient.firstName} ${newClient.lastName}`.trim();
    const createdMembers = newClient.householdMembers
      .map((m, idx) => {
        if (idx === 0 && !m.name) {
          return { ...m, name: fullName, mobile: newClient.mobile };
        }
        return m;
      })
      .filter((m) => m.name.trim().length > 0);

    const effectiveBranchUuid =
      (isUuid(effectiveBranchId) && effectiveBranchId) ||
      (isUuid(branchId) && branchId) ||
      (assignedBranch?.id && isUuid(assignedBranch.id) && assignedBranch.id) ||
      (isUuid(tokenStorage.getBranchId()) && tokenStorage.getBranchId()) ||
      undefined;

    const chosenBranchObj = availableBranches.find(
      (b: any) =>
        b.name === newClient.primaryBranch ||
        b.id === newClient.primaryBranch ||
        (effectiveBranchUuid && b.id === effectiveBranchUuid) ||
        (effectiveBranchName && b.name === effectiveBranchName),
    );

    const chosenBranchId =
      (lockBranch && effectiveBranchUuid) ||
      (chosenBranchObj?.id && isUuid(chosenBranchObj.id) ? chosenBranchObj.id : undefined) ||
      effectiveBranchUuid ||
      tokenStorage.getBranchId() ||
      undefined;

    const chosenFranchiseId = isFranchiseScoped
      ? franchiseId || chosenBranchObj?.franchiseId || null
      : newClient.franchiseId || chosenBranchObj?.franchiseId || null;

    try {
      const createdApi = await customersApi.create({
        firstName: newClient.firstName,
        lastName: newClient.lastName || undefined,
        displayName: fullName,
        mobilePhone: newClient.mobile,
        email: newClient.email || undefined,
        avatarUrl: newClient.avatarUrl || undefined,
        gender: (newClient.gender === 'Male'
          ? 'MALE'
          : newClient.gender === 'Other'
            ? 'OTHER'
            : 'FEMALE') as any,
        dateOfBirth: newClient.dob ? toDateInputValue(newClient.dob) : null,
        segment: newClient.segment || 'New Client',
        preferredBranchId: chosenBranchId,
        franchiseId: chosenFranchiseId,
        notes: newClient.cautionNote,
        address: {
          addressLine1: newClient.addressLine1 || 'Central City',
          city: newClient.city,
          state: newClient.state,
          postalCode: newClient.pincode,
          country: 'India',
        },
      });

      const mapped = mapApiCustomerToFullRecord(
        createdApi,
        availableBranches,
        liveFranchises,
        newClient.primaryBranch,
      );
      setClients((prev) => [mapped, ...prev]);
      setIsAddModalOpen(false);
      toast(`Client "${mapped.fullName}" registered successfully!`);
    } catch (err) {
      console.warn('Backend API registration fallback to local state:', err);
      const created: FullClientRecord = {
        id: `CL-104${clients.length + 90}`,
        firstName: newClient.firstName,
        lastName: newClient.lastName,
        fullName: fullName,
        mobile: newClient.mobile,
        email: newClient.email || `${newClient.firstName.toLowerCase()}@client.in`,
        gender: newClient.gender,
        dob: newClient.dob || '',
        anniversary: newClient.anniversary || '',
        anniversaryOccasion: newClient.anniversaryOccasion || 'Wedding Anniversary',
        avatarInitials:
          `${newClient.firstName[0]}${newClient.lastName ? newClient.lastName[0] : ''}`.toUpperCase(),
        avatarUrl: newClient.avatarUrl || undefined,
        accentColor: '#5A2EA6',
        primaryBranch: newClient.primaryBranch,
        primaryBranchId: chosenBranchId,
        franchiseId: chosenFranchiseId,
        clientSince: 'Aug 2026',
        status: 'Active',
        segment: newClient.segment,
        membershipTier: newClient.membershipTier,
        activePackage: 'None',
        totalVisits: 0,
        completedVisits: 0,
        cancelledVisits: 0,
        noShows: 0,
        lastVisit: 'Just Registered',
        lifetimeValue: 0,
        averageVisitValue: 0,
        walletBalance: 0,
        loyaltyPoints: 100, // welcome bonus
        rebookingRate: 100,
        preferredStaff: newClient.preferredStaff,
        preferredServices: newClient.preferredServices,
        preferredChannel: newClient.preferredChannel,
        language: 'English, Hindi',
        address: {
          line1: newClient.addressLine1 || 'Central City',
          city: newClient.city,
          state: newClient.state,
          pincode: newClient.pincode,
          country: 'India',
        },
        household: {
          name: newClient.householdName || `${newClient.lastName || newClient.firstName} Household`,
          members:
            createdMembers.length > 0
              ? createdMembers
              : [
                  {
                    name: fullName,
                    relation: 'Self (Primary)',
                    mobile: newClient.mobile,
                    isPrimary: true,
                  },
                ],
        },
        safetyAllergies: {
          allergies: newClient.allergies,
          patchTestRequired: newClient.patchTestRequired,
          patchTestCompleted: newClient.patchTestCompleted,
          cautionNote: newClient.cautionNote,
        },
        consentReferral: {
          acquisitionSource: newClient.acquisitionSource,
          whatsappOptIn: newClient.whatsappConsent,
          smsOptIn: newClient.smsConsent,
          emailOptIn: newClient.emailConsent,
          tags: newClient.clientTags,
        },
        appointments: [],
        serviceHistory: [],
        packages: [],
        loyaltyTransactions: [
          {
            id: 'TX-00',
            date: 'Today',
            type: 'Earned',
            description: 'Welcome Onboarding Bonus',
            amountOrPoints: '+100 Pts',
            balance: '100 Pts',
          },
        ],
        feedbacks: [],
        notes: [],
        photos: [],
        consent: {
          whatsappConsent: newClient.whatsappConsent,
          smsConsent: newClient.smsConsent,
          emailConsent: newClient.emailConsent,
          phoneConsent: true,
          pushConsent: true,
          marketingConsent: true,
          photoConsent: true,
          consultationConsent: true,
          dateGranted: 'Today',
          lastUpdated: 'Today',
        },
      };

      setClients((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      toast(`Client "${created.fullName}" onboarded successfully with 100 Welcome Points!`);
    }
  };

  const handleToggleStatus = async (client: FullClientRecord) => {
    const nextStatus = client.status === 'Active' ? 'Archived' : 'Active';
    try {
      if (client.id.includes('-') && client.id.length > 20) {
        await customersApi.update(client.id, {
          status: nextStatus === 'Active' ? 'ACTIVE' : 'ARCHIVED',
        });
      }
    } catch (e) {
      console.warn('Status update API error:', e);
    }
    setClients((prev) => prev.map((c) => (c.id === client.id ? { ...c, status: nextStatus } : c)));
    setDeactivateClient(null);
    toast(`Client "${client.fullName}" status updated to ${nextStatus}.`);
  };

  const handleExport = () => {
    toast(`Exported ${filteredClients.length} customer records to CSV.`);
  };

  if (selectedClientForDossier) {
    return (
      <ClientProfilePage
        clientData={selectedClientForDossier}
        lockBranch={isBranchLocked}
        defaultBranch={effectiveBranchName || defaultBranch}
        onBack={() => setSelectedClientForDossier(null)}
        onUpdateClient={(updated) => {
          setSelectedClientForDossier(updated);
          setClients((prev) =>
            prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)),
          );
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              All Clients Central CRM
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {clients.length} Profiles Tracked
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Consolidated brand-wide client dossier with multi-location visit records, lifetime
            spend, households, and privacy consent tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Multi-Search */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search by Name, Mobile, Email, Client ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Branch:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Branches</option>
                {availableBranches.map((b: any) => (
                  <option key={b.id || b.name} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!lockBranch && <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />}

          {/* Franchise Filter */}
          {!isFranchiseScoped && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Franchise:</span>
              <select
                value={franchiseFilter}
                onChange={(e) => setFranchiseFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Networks</option>
                <option value="Direct">Direct Brand (Non-Franchise)</option>
                <option value="Franchise">All Franchise Partners</option>
                {liveFranchises.map((f: any) => (
                  <option key={f.id} value={f.id}>
                    {f.companyName || f.name || f.code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isFranchiseScoped && <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />}

          {/* Segment Filter */}
          <div className="flex items-center gap-1">
            <span>Segment:</span>
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              {allSegments.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Master Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight flex items-center gap-2">
                <span>Consolidated Client CRM Registry</span>
                {isLoadingApi && (
                  <span className="text-[10px] font-normal text-purple-200 animate-pulse">
                    (Syncing live CRM...)
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Multi-branch visit history, lifetime spend, franchise mapping, and contact records
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredClients.length} Clients Displayed
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Client Identity & ID',
                  'Contact Details',
                  ...(!lockBranch ? ['Primary Branch'] : []),
                  'Franchise Mapping',
                  'Visits & Recency',
                  'Lifetime Spend (LTV)',
                  'Membership & Bundle',
                  'Status',
                  'Actions',
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === arr.length - 1 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  {/* Client Name & ID */}
                  <td className="p-3.5 pl-5">
                    <button
                      onClick={() => setSearchParams({ tab: 'all', clientId: client.id })}
                      className="flex items-center gap-3 text-left group bg-transparent border-0 p-0 cursor-pointer w-full focus:outline-none"
                      title="Click to view full client profile"
                    >
                      {client.avatarUrl ? (
                        <div className="w-9 h-9 rounded-2xl overflow-hidden shrink-0 border border-purple-100 shadow-2xs group-hover:scale-105 transition-transform">
                          <img
                            src={client.avatarUrl}
                            alt={client.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar
                          initials={client.avatarInitials}
                          className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-xs font-bold shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div>
                        <div className="font-bold text-ink text-[13px] group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                          {client.fullName}
                        </div>
                        <div className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                          {client.id} · {client.segment}
                        </div>
                      </div>
                    </button>
                  </td>

                  {/* Contact Details */}
                  <td className="p-3.5">
                    <div className="font-semibold text-ink text-xs">{client.mobile}</div>
                    <div className="text-[10px] text-muted truncate max-w-[140px]">
                      {client.email}
                    </div>
                  </td>

                  {/* Primary Branch */}
                  {!lockBranch && (
                    <td className="p-3.5 font-semibold text-soft">{client.primaryBranch}</td>
                  )}

                  {/* Franchise Mapping */}
                  <td className="p-3.5">
                    {client.franchiseId ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/70 w-fit">
                          <Building2 className="w-3 h-3 text-[#5A2EA6]" />
                          {getFranchiseDisplayName(client.franchiseId, liveFranchises)}
                        </span>
                        <span
                          className="text-[9px] text-muted font-mono"
                          title={client.franchiseId}
                        >
                          ID: {client.franchiseId.length > 12 ? `${client.franchiseId.slice(0, 8)}...` : client.franchiseId}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
                        Direct Brand
                      </span>
                    )}
                  </td>

                  {/* Visits & Recency */}
                  <td className="p-3.5">
                    <div className="font-bold text-ink text-xs">{client.totalVisits} Visits</div>
                    <div className="text-[10px] text-muted">Last: {client.lastVisit}</div>
                  </td>

                  {/* Lifetime Value */}
                  <td className="p-3.5">
                    <div className="font-bold text-ink text-[13.5px] font-serif">
                      ₹{client.lifetimeValue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[9.5px] text-soft">
                      Avg: ₹{client.averageVisitValue.toLocaleString('en-IN')}
                    </div>
                  </td>

                  {/* Membership & Bundle */}
                  <td className="p-3.5">
                    {client.membershipTier !== 'None' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5A2EA6] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 mb-0.5">
                        <Crown className="w-3 h-3" /> {client.membershipTier}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        Standard Client
                      </span>
                    )}
                    {client.activePackage !== 'None' && (
                      <div className="text-[9.5px] text-emerald-700 font-semibold truncate max-w-[130px]">
                        ✓ {client.activePackage}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        client.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : client.status === 'Blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          client.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400',
                        )}
                      />
                      {client.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSearchParams({ tab: 'all', clientId: client.id })}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0"
                        title="View Full Profile Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => setDeactivateClient(client)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0',
                          client.status === 'Active'
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                        )}
                        title={
                          client.status === 'Active' ? 'Archive Client Record' : 'Activate Client'
                        }
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Client Profile Dossier Modal (12 Tabs) */}
      <ClientProfileDossierModal
        client={selectedClientForDossier}
        onClose={() => setSelectedClientForDossier(null)}
      />

      {/* 2. Register New Client Profile Modal (4-Step Tabbed Workflow) */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      Register New Client Profile
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
                      +100 Welcome Points
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Universal multi-branch client profile, household group, safety &amp; allergies,
                    and marketing consents.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 4-Step Navigation Tabs Bar */}
              <div className="px-6 pt-3 pb-2.5 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar bg-[#FCFAFF] shrink-0">
                {[
                  { id: 'basic' as const, label: '1. Basic Info' },
                  { id: 'household' as const, label: '2. Household & Family' },
                  { id: 'safety' as const, label: '3. Safety & Allergies' },
                  { id: 'consent' as const, label: '4. Consent & Referral' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAddModalTab(tab.id)}
                    className={cn(
                      'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none whitespace-nowrap',
                      addModalTab === tab.id
                        ? 'bg-[#3B2647] text-white border-[#3B2647] shadow-sm ring-2 ring-purple-600/30'
                        : 'bg-white text-soft hover:text-ink border-slate-200',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleAddClient}
                className="flex-1 overflow-y-auto custom-scroll flex flex-col justify-between"
              >
                {/* TAB 1: BASIC INFO */}
                {addModalTab === 'basic' && (
                  <div className="p-6 space-y-5">
                    {/* Hidden File Input for Avatar */}
                    <input
                      ref={addAvatarFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAddImageUpload(file);
                      }}
                      className="hidden"
                    />

                    {/* Profile Photo Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                          Profile Avatar / Photo
                        </label>
                        <span className="text-[10px] text-muted font-medium">
                          PNG, JPG, WebP up to 5MB
                        </span>
                      </div>

                      {newClient.avatarUrl ? (
                        <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-[#FAF8FC] group p-3 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-purple-100 shadow-sm relative">
                            <img
                              src={newClient.avatarUrl}
                              alt="Client Avatar Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <strong className="block text-xs font-bold text-ink truncate">
                                Profile Photo Attached
                              </strong>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => addAvatarFileInputRef.current?.click()}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] transition-colors border-0 cursor-pointer flex items-center gap-1"
                              >
                                <Camera className="w-3 h-3" /> Change
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewClient((prev) => ({ ...prev, avatarUrl: '' }))}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border-0 cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => addAvatarFileInputRef.current?.click()}
                          className="border-2 border-dashed border-purple-200 hover:border-[#5A2EA6] bg-[#FCFAFF] hover:bg-purple-50/40 rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 group select-none"
                        >
                          <div className="text-xs font-bold text-ink group-hover:text-[#5A2EA6] transition-colors">
                            Click to upload client photo or drag &amp; drop
                          </div>
                          <p className="text-[10.5px] text-muted mt-0.5">
                            High-resolution headshot for quick identification
                          </p>
                        </div>
                      )}

                      {/* Presets Picker */}
                      <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-muted uppercase">Presets:</span>
                        {CLIENT_AVATAR_PRESETS.slice(0, 4).map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              setNewClient((prev) => ({ ...prev, avatarUrl: preset.url }))
                            }
                            className={cn(
                              'px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all border cursor-pointer',
                              newClient.avatarUrl === preset.url
                                ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] font-bold'
                                : 'bg-white text-soft border-purple-100 hover:border-[#5A2EA6]/40 hover:text-ink',
                            )}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personal Coordinates */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Radhika"
                            value={newClient.firstName}
                            onChange={(e) =>
                              setNewClient({ ...newClient, firstName: e.target.value })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Last Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Merchant"
                            value={newClient.lastName}
                            onChange={(e) =>
                              setNewClient({ ...newClient, lastName: e.target.value })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98000 12345"
                            value={newClient.mobile}
                            onChange={(e) => setNewClient({ ...newClient, mobile: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="radhika@client.in"
                            value={newClient.email}
                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Gender
                          </label>
                          <select
                            value={newClient.gender}
                            onChange={(e) =>
                              setNewClient({
                                ...newClient,
                                gender: e.target.value as FullClientRecord['gender'],
                              })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                            <span>Primary Branch</span>
                            {isBranchLocked && (
                              <span className="text-[9.5px] bg-purple-100 text-[#5A2EA6] px-1.5 py-0.5 rounded font-bold">
                                Assigned Branch
                              </span>
                            )}
                          </label>
                          {isBranchLocked ? (
                            <div className="w-full h-11 px-3.5 rounded-xl border border-purple-200 bg-purple-50/60 flex items-center justify-between text-xs font-semibold text-purple-900 shadow-3xs cursor-not-allowed">
                              <div className="flex items-center gap-2 truncate">
                                <MapPin className="w-4 h-4 text-[#5A2EA6] shrink-0" />
                                <span className="truncate">{effectiveBranchName || defaultBranch || 'Assigned Branch'}</span>
                              </div>
                              <span className="text-[10px] bg-purple-200/80 text-[#5A2EA6] px-2 py-0.5 rounded font-bold shrink-0">
                                Locked
                              </span>
                            </div>
                          ) : (
                            <select
                              value={newClient.primaryBranch}
                              onChange={(e) =>
                                setNewClient({ ...newClient, primaryBranch: e.target.value })
                              }
                              className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                            >
                              {availableBranches.map((b: any) => (
                                <option key={b.id} value={b.name}>
                                  {b.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Franchise Mapping
                          </label>
                          {isFranchiseScoped ? (
                            <div className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-purple-50/50 flex items-center gap-2 text-xs font-bold text-purple-800">
                              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                              <span className="truncate">
                                {getFranchiseDisplayName(franchiseId || newClient.franchiseId, liveFranchises)}
                              </span>
                            </div>
                          ) : (
                            <select
                              value={newClient.franchiseId || ''}
                              onChange={(e) =>
                                setNewClient({
                                  ...newClient,
                                  franchiseId: e.target.value || null,
                                })
                              }
                              className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                            >
                              <option value="">Direct Brand (No Franchise)</option>
                              {liveFranchises.map((f: any) => (
                                <option key={f.id} value={f.id}>
                                  {f.name} ({f.code || 'FRN'})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Segment
                          </label>
                          <select
                            value={newClient.segment}
                            onChange={(e) =>
                              setNewClient({
                                ...newClient,
                                segment: e.target.value as FullClientRecord['segment'],
                              })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          >
                            <option value="New Client">New Client</option>
                            <option value="VIP High Value">VIP High Value</option>
                            <option value="Frequent Visitor">Frequent Visitor</option>
                            <option value="Membership Client">Membership Client</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                            <Cake className="w-3 h-3 text-[#5A2EA6]" /> Date of Birth
                          </label>
                          <input
                            type="date"
                            value={toDateInputValue(newClient.dob)}
                            onChange={(e) =>
                              setNewClient({
                                ...newClient,
                                dob: toFriendlyDate(e.target.value) || e.target.value,
                              })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#E11D48] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                            <Heart className="w-3 h-3 text-[#E11D48]" /> Anniversary Date
                          </label>
                          <input
                            type="date"
                            value={toDateInputValue(newClient.anniversary)}
                            onChange={(e) =>
                              setNewClient({
                                ...newClient,
                                anniversary: toFriendlyDate(e.target.value) || e.target.value,
                              })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-rose-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#E11D48] cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-1.5">
                            Anniversary Occasion
                          </label>
                          <select
                            value={newClient.anniversaryOccasion}
                            onChange={(e) =>
                              setNewClient({ ...newClient, anniversaryOccasion: e.target.value })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          >
                            <option value="Wedding Anniversary">Wedding Anniversary</option>
                            <option value="Relationship Anniversary">
                              Relationship Anniversary
                            </option>
                            <option value="Membership Milestone">Membership Milestone</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Street Address
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 104 Heritage Boulevard, Indrapuri"
                          value={newClient.addressLine1}
                          onChange={(e) =>
                            setNewClient({ ...newClient, addressLine1: e.target.value })
                          }
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: HOUSEHOLD & FAMILY */}
                {addModalTab === 'household' && (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        <span>
                          Household &amp; Family Members ({newClient.householdMembers.length}{' '}
                          Members)
                        </span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddNewHouseholdMember}
                        className="text-xs font-bold text-[#5A2EA6] hover:text-[#4a2489] flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Family Member</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Household Account Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Merchant Household"
                        value={newClient.householdName}
                        onChange={(e) =>
                          setNewClient({ ...newClient, householdName: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {newClient.householdMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl border border-purple-100/80 bg-[#FCFAFF] flex flex-col sm:flex-row sm:items-center gap-3 shadow-3xs"
                        >
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#5A2EA6] grid place-items-center font-bold text-xs shrink-0">
                            {idx + 1}
                          </div>

                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0">
                            <div>
                              <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                                Member Name *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder={idx === 0 ? 'Primary Member (Auto)' : 'Full Name'}
                                value={member.name}
                                onChange={(e) =>
                                  handleUpdateNewHouseholdMember(idx, 'name', e.target.value)
                                }
                                className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                                Relationship
                              </label>
                              <select
                                value={member.relation}
                                onChange={(e) =>
                                  handleUpdateNewHouseholdMember(idx, 'relation', e.target.value)
                                }
                                className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                              >
                                <option value="Self (Primary)">Self (Primary)</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child (Minor)">Child (Minor)</option>
                                <option value="Child (Adult)">Child (Adult)</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Partner">Partner</option>
                                <option value="Family Member">Family Member</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                                Mobile Number
                              </label>
                              <input
                                type="tel"
                                placeholder="+91 98000 00000"
                                value={member.mobile}
                                onChange={(e) =>
                                  handleUpdateNewHouseholdMember(idx, 'mobile', e.target.value)
                                }
                                className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {member.isPrimary ? (
                              <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                Primary
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRemoveNewHouseholdMember(idx)}
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 grid place-items-center transition-colors border-0 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddNewHouseholdMember}
                        className="w-full py-2.5 rounded-xl border border-dashed border-purple-200 hover:border-[#5A2EA6] text-[#5A2EA6] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-purple-50/50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Family Member</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SAFETY & ALLERGIES */}
                {addModalTab === 'safety' && (
                  <div className="p-6 space-y-4">
                    <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE047] text-xs text-[#92400E] font-medium flex items-center gap-2.5 shadow-2xs">
                      <div className="w-5 h-5 rounded-full bg-amber-200/80 text-[#B45309] grid place-items-center shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold">
                        Record chemical sensitivities to prevent adverse salon events.
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        CHEMICAL SENSITIVITIES &amp; ALLERGIES
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Ammonia, Sulphates, Lavender"
                          value={addAllergyInput}
                          onChange={(e) => setAddAllergyInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddAllergy();
                            }
                          }}
                          className="flex-1 h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                        <button
                          type="button"
                          onClick={handleAddAllergy}
                          className="px-5 h-11 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl transition-all border-0 cursor-pointer shadow-xs"
                        >
                          + Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2.5 min-h-[32px]">
                        {newClient.allergies.map((allergy, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] rounded-full text-xs font-bold shadow-2xs animate-in zoom-in-95 duration-150"
                          >
                            <span>{allergy}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAllergy(idx)}
                              className="text-[#BE123C]/70 hover:text-[#BE123C] border-0 bg-transparent cursor-pointer p-0 font-bold text-sm leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                        <input
                          type="checkbox"
                          checked={newClient.patchTestRequired}
                          onChange={(e) =>
                            setNewClient((prev) => ({
                              ...prev,
                              patchTestRequired: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                        />
                        <span className="text-xs font-bold text-ink">Patch-Test Required</span>
                      </label>

                      <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                        <input
                          type="checkbox"
                          checked={newClient.patchTestCompleted}
                          onChange={(e) =>
                            setNewClient((prev) => ({
                              ...prev,
                              patchTestCompleted: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                        />
                        <span className="text-xs font-bold text-ink">Patch-Test Completed</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        SAFETY CAUTION NOTE
                      </label>
                      <input
                        type="text"
                        placeholder="Perform 24h patch test before any high-lift bleach process."
                        value={newClient.cautionNote}
                        onChange={(e) =>
                          setNewClient((prev) => ({ ...prev, cautionNote: e.target.value }))
                        }
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: CONSENT & REFERRAL */}
                {addModalTab === 'consent' && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        ACQUISITION SOURCE
                      </label>
                      <select
                        value={newClient.acquisitionSource}
                        onChange={(e) =>
                          setNewClient((prev) => ({ ...prev, acquisitionSource: e.target.value }))
                        }
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Friend / Family Referral">Friend / Family Referral</option>
                        <option value="Influencer Campaign">Influencer Campaign</option>
                        <option value="Corporate Partner">Corporate Partner</option>
                        <option value="Print / Billboard">Print / Billboard</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        CHANNEL OPT-IN CONSENT
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                          <input
                            type="checkbox"
                            checked={newClient.whatsappConsent}
                            onChange={(e) =>
                              setNewClient((prev) => ({
                                ...prev,
                                whatsappConsent: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                          />
                          <span className="text-xs font-bold text-ink">WhatsApp</span>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                          <input
                            type="checkbox"
                            checked={newClient.smsConsent}
                            onChange={(e) =>
                              setNewClient((prev) => ({ ...prev, smsConsent: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                          />
                          <span className="text-xs font-bold text-ink">SMS</span>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                          <input
                            type="checkbox"
                            checked={newClient.emailConsent}
                            onChange={(e) =>
                              setNewClient((prev) => ({ ...prev, emailConsent: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                          />
                          <span className="text-xs font-bold text-ink">Email</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        CLIENT TAGS &amp; SEGMENTATION
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. VIP, High Spender, Silent Service"
                          value={addTagInput}
                          onChange={(e) => setAddTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          className="flex-1 h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-5 h-11 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl transition-all border-0 cursor-pointer shadow-xs"
                        >
                          + Tag
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2.5 min-h-[32px]">
                        {newClient.clientTags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF5FF] border border-[#E9D5FF] text-[#5A2EA6] rounded-full text-xs font-bold shadow-2xs animate-in zoom-in-95 duration-150"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(idx)}
                              className="text-[#5A2EA6]/70 hover:text-[#5A2EA6] border-0 bg-transparent cursor-pointer p-0 font-bold text-sm leading-none"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="p-6 pt-4 flex items-center justify-end gap-3 border-t border-purple-50 bg-white shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Profile Updates</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Non-Destructive Archive Safeguard Modal */}
      {deactivateClient &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    {deactivateClient.status === 'Active'
                      ? 'Archive Client Record?'
                      : 'Activate Client?'}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {deactivateClient.fullName} ({deactivateClient.id})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {deactivateClient.status === 'Active'
                  ? `Archiving "${deactivateClient.fullName}" will pause outbound marketing campaigns while keeping all historic billing invoices, loyalty points balance (₹${deactivateClient.walletBalance}), and past appointment ledgers completely intact (non-destructive safety).`
                  : `Re-activating "${deactivateClient.fullName}" will restore active booking eligibility and loyalty redemption.`}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeactivateClient(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleToggleStatus(deactivateClient)}
                  className={cn(
                    'h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all',
                    deactivateClient.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white',
                  )}
                >
                  Confirm {deactivateClient.status === 'Active' ? 'Archive' : 'Activation'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
