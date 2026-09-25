import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  Filter,
  Info,
  Layers,
  MapPin,
  MoreHorizontal,
  Phone,
  Plus,
  Power,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Store,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
  UserPlus,
} from 'lucide-react';
import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import { masterStaffRecords, FullStaffRecord } from '../staff/StaffProfilePage';
import { staffApi } from '@/shared/api/staff.api';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';

export interface BranchRecord {
  id: string;
  name: string;
  code: string;
  type: 'Flagship' | 'Lounge' | 'Express' | 'Franchise';
  address: string;
  city: string;
  manager: string;
  managerEmail: string;
  contactNumber: string;
  primaryManagerEmployeeId?: string;
  status: 'Active' | 'Inactive' | 'Pending';
  workingHours: string;
  revenue: number;
  appointments: number;
  occupancy: number;
  staffCount: number;
  clientCount: number;
  createdDate: string;
  servicesAvailable: string[];
  franchisePartnerId?: string;
  franchisePartnerName?: string;
  isFranchiseOwned?: boolean;
}

export const TIME_OPTIONS = [
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
];

export function parseWorkingHours(hoursStr?: string): { open: string; close: string } {
  if (!hoursStr) {
    return { open: '09:00 AM', close: '09:00 PM' };
  }
  const parts = hoursStr.split(/[-–—]| to /i).map((s) => s.trim());
  if (parts.length >= 2) {
    const normalize = (t: string, fallback: string) => {
      const match = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match) {
        let hour = parseInt(match[1], 10);
        const min = match[2];
        const ampm = match[3] ? match[3].toUpperCase() : null;
        if (!ampm) {
          const p = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12 || 12;
          return `${hour.toString().padStart(2, '0')}:${min} ${p}`;
        }
        return `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;
      }
      return fallback;
    };
    const openNorm = normalize(parts[0], '09:00 AM');
    const closeNorm = normalize(parts[1], '09:00 PM');
    return {
      open: TIME_OPTIONS.includes(openNorm) ? openNorm : parts[0] || '09:00 AM',
      close: TIME_OPTIONS.includes(closeNorm) ? closeNorm : parts[1] || '09:00 PM',
    };
  }
  return { open: '09:00 AM', close: '09:00 PM' };
}

export interface FranchisePartnerOption {
  id: string;
  name: string;
  code: string;
  contactPerson?: string;
  region: string;
  agreement?: string;
  email?: string;
}

export const FRANCHISE_PARTNERS: FranchisePartnerOption[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    name: 'Ashish Khopde Outlets LLP',
    code: 'FRN-ASH-889',
    contactPerson: 'Ashish Khopde',
    region: 'Indore & Malwa Region',
    agreement: 'Active · 10% Royalty (5-Year Term)',
    email: 'sanjay.chawla@apexwellness.in',
  },
  {
    id: 'FP-002',
    name: 'Apex Wellness Ventures LLP',
    code: 'FRN-APX-402',
    contactPerson: 'Sanjay Chawla',
    region: 'Bhopal Metro Region',
    agreement: 'Active · 12% Royalty (5-Year Term)',
    email: 'sanjay@apexventures.in',
  },
  {
    id: 'FP-003',
    name: 'Mahalaxmi Salon & Spa Network',
    code: 'FRN-MHL-109',
    contactPerson: 'Pooja Deshmukh',
    region: 'Pune & Western Maharashtra',
    agreement: 'Active · 10% Royalty (3-Year Term)',
    email: 'pooja@mahalaxmisalon.com',
  },
  {
    id: 'FP-004',
    name: 'Royal Heritage Grooming Pvt Ltd',
    code: 'FRN-RHG-771',
    contactPerson: 'Vikramaditya S.',
    region: 'Jaipur & Rajasthan Territory',
    agreement: 'Active · 15% Royalty (5-Year Term)',
    email: 'vikram@royalheritage.in',
  },
];

export const masterBranches: BranchRecord[] = [
  {
    id: 'BR-001',
    name: 'Atelier Indrapuri Flagship',
    code: 'ATL-IND-01',
    type: 'Flagship',
    address: 'Plot 14, Sector A, Indrapuri',
    city: 'Bhopal',
    manager: 'Rajiv Mehra',
    managerEmail: 'rajiv.mehra@atelier.in',
    contactNumber: '+91 98260 12345',
    status: 'Active',
    workingHours: '09:00 AM - 09:00 PM',
    revenue: 942000,
    appointments: 482,
    occupancy: 88.5,
    staffCount: 24,
    clientCount: 1420,
    createdDate: '12 Jan 2024',
    servicesAvailable: [
      'Hair Spa',
      'HydraFacial',
      'Bridal Studio',
      'Color Bar',
      'Nail Bar',
      'Aromatherapy',
    ],
  },
  {
    id: 'BR-002',
    name: 'Atelier Arera Luxury Lounge',
    code: 'ATL-BH-02',
    type: 'Lounge',
    address: 'E-7 Arera Colony, Near Platinum Plaza',
    city: 'Bhopal',
    manager: 'Sunita Roy',
    managerEmail: 'sunita.roy@atelier.in',
    contactNumber: '+91 98260 67890',
    status: 'Active',
    workingHours: '10:00 AM - 08:30 PM',
    revenue: 785000,
    appointments: 394,
    occupancy: 84.0,
    staffCount: 18,
    clientCount: 1180,
    createdDate: '05 Mar 2024',
    servicesAvailable: ['Keratin Therapy', 'Luxury Facial', 'Swedish Massage', 'Pedicure Suite'],
  },
  {
    id: 'BR-003',
    name: 'Atelier Koregaon Park Grand',
    code: 'ATL-PUN-01',
    type: 'Franchise',
    address: 'Lane 5, Koregaon Park North Main Rd',
    city: 'Pune',
    manager: 'Rohan Deshmukh',
    managerEmail: 'rohan.d@atelier-pune.com',
    contactNumber: '+91 91234 88776',
    status: 'Active',
    workingHours: '09:00 AM - 09:30 PM',
    revenue: 615000,
    appointments: 310,
    occupancy: 81.2,
    staffCount: 16,
    clientCount: 940,
    createdDate: '18 Aug 2024',
    servicesAvailable: ['Global Hair Color', 'Olaplex Therapy', 'Bridal Grooming', 'Ayurvedic Spa'],
    franchisePartnerId: 'FP-003',
    franchisePartnerName: 'Elite Beauty & Grooming Group',
    isFranchiseOwned: true,
  },
  {
    id: 'BR-004',
    name: 'Atelier MG Road Express',
    code: 'ATL-IND-02',
    type: 'Express',
    address: '102 Treasure Island Mall, M.G. Road',
    city: 'Indore',
    manager: 'Karan Joshi',
    managerEmail: 'karan.j@atelier.in',
    contactNumber: '+91 99770 44556',
    status: 'Active',
    workingHours: '10:30 AM - 09:30 PM',
    revenue: 382000,
    appointments: 214,
    occupancy: 73.5,
    staffCount: 12,
    clientCount: 680,
    createdDate: '10 Nov 2024',
    servicesAvailable: ['Express Styling', 'Detox Facial', 'Quick Manicure', 'Beard Spa'],
  },
  {
    id: 'BR-005',
    name: 'Atelier Whitefield Studio',
    code: 'ATL-BLR-01',
    type: 'Franchise',
    address: 'Nexus Mall Road, Whitefield IT Corridor',
    city: 'Bengaluru',
    manager: 'Priya Sharma',
    managerEmail: 'priya.s@atelier-blr.in',
    contactNumber: '+91 98800 22334',
    status: 'Pending',
    workingHours: '09:30 AM - 09:00 PM',
    revenue: 121200,
    appointments: 82,
    occupancy: 68.0,
    staffCount: 10,
    clientCount: 290,
    createdDate: '15 Jul 2026',
    servicesAvailable: ['Hair Botoplex', 'Advanced Peel Facial', 'Bridal Package', 'Scalp Clinic'],
  },
  {
    id: 'BR-006',
    name: 'Atelier Jaipur Royal Spa',
    code: 'ATL-JAI-01',
    type: 'Franchise',
    address: 'C-Scheme, Near Statue Circle',
    city: 'Jaipur',
    manager: 'Manish Rathore',
    managerEmail: 'manish.r@jaipuratelier.in',
    contactNumber: '+91 97840 99887',
    status: 'Inactive',
    workingHours: '10:00 AM - 08:00 PM',
    revenue: 0,
    appointments: 0,
    occupancy: 0,
    staffCount: 8,
    clientCount: 0,
    createdDate: '01 Aug 2026',
    servicesAvailable: ['Royal Ayurvedic Therapy', 'Bridal Trousseau', 'Hair Rituals'],
  },
];

interface AllBranchesTabProps {
  onNavigateToPerformance: (branchName: string) => void;
  onNavigateToWorkingHours: (branchName: string) => void;
  isFranchisePortal?: boolean;
}

const isUuid = (str?: string | null) =>
  typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export function AllBranchesTab({
  onNavigateToPerformance,
  onNavigateToWorkingHours,
  isFranchisePortal,
}: AllBranchesTabProps) {
  const { toast } = useToast();
  const { salon, createBranch, updateBranch } = useAdminContext();
  const [branches, setBranches] = useState<BranchRecord[]>(() => {
    if (salon?.branches && salon.branches.length > 0) {
      return salon.branches as BranchRecord[];
    }
    return [];
  });

  useEffect(() => {
    if (salon?.branches) {
      setBranches(salon.branches as BranchRecord[]);
    }
  }, [salon?.branches]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Pending'>(
    'All',
  );
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [partnerFilter, setPartnerFilter] = useState<string>('All');

  // Modals state
  const [viewBranch, setViewBranch] = useState<BranchRecord | null>(null);
  const [editBranch, setEditBranch] = useState<BranchRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deactivateConfirmBranch, setDeactivateConfirmBranch] = useState<BranchRecord | null>(null);

  // Staff & Branch Manager selection state
  const [employeesList, setEmployeesList] = useState<FullStaffRecord[]>(masterStaffRecords);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [isFranchiseToggleOn, setIsFranchiseToggleOn] = useState<boolean>(false);
  const [isAddBMOpen, setIsAddBMOpen] = useState<boolean>(false);
  const [newBMForm, setNewBMForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: 'Password@123',
  });
  const [isCreatingBM, setIsCreatingBM] = useState<boolean>(false);

  // Dedicated Quick Assign Branch Manager state
  const [assigningBranch, setAssigningBranch] = useState<BranchRecord | null>(null);
  const [assignStaffId, setAssignStaffId] = useState<string>('');
  const [isAssignNewStaffOpen, setIsAssignNewStaffOpen] = useState<boolean>(false);
  const [editSelectedEmployeeId, setEditSelectedEmployeeId] = useState<string>('');
  const [isEditFranchiseToggleOn, setIsEditFranchiseToggleOn] = useState<boolean>(false);
  const [isEditAddBMOpen, setIsEditAddBMOpen] = useState<boolean>(false);
  const [editBMForm, setEditBMForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  });
  const [quickStaffForm, setQuickStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: 'Password@123',
  });
  const [isSavingAssign, setIsSavingAssign] = useState<boolean>(false);

  // Dynamic Franchise Partners list state (fetched from backend API)
  const [franchisePartners, setFranchisePartners] = useState<FranchisePartnerOption[]>(() => {
    const customPartner =
      localStorage.getItem('digiflex_franchise_partner_name') || 'Ashish Khopde Outlets LLP';
    const customCode = localStorage.getItem('digiflex_franchise_code') || 'FRN-ASH-889';
    const customRegion =
      localStorage.getItem('digiflex_franchise_region') || 'Indore & Malwa Region';
    const customId =
      localStorage.getItem('digiflex_franchise_id') || 'f0000000-0000-0000-0000-000000000001';

    const customEntry: FranchisePartnerOption = {
      id: customId,
      name: customPartner,
      code: customCode,
      contactPerson:
        localStorage.getItem('digiflex_franchise_contact_person') ||
        localStorage.getItem('digiflex_franchise_owner_name') ||
        'Ashish Khopde',
      region: customRegion,
      agreement: 'Active · 10% Royalty (5-Year Term)',
      email:
        localStorage.getItem('digiflex_franchise_email') || 'sanjay.chawla@apexwellness.in',
    };

    const rest = FRANCHISE_PARTNERS.filter(
      (p) => p.name.toLowerCase() !== customPartner.toLowerCase() && p.id !== customId,
    );
    return [customEntry, ...rest];
  });
  const [isLoadingPartners, setIsLoadingPartners] = useState<boolean>(false);

  // Quick Assign Franchise Partner Modal state
  const [assigningFranchiseBranch, setAssigningFranchiseBranch] = useState<BranchRecord | null>(null);
  const [quickFranchisePartnerId, setQuickFranchisePartnerId] = useState<string>('');
  const [isSavingFranchiseAssign, setIsSavingFranchiseAssign] = useState<boolean>(false);

  useEffect(() => {
    staffApi
      .list()
      .then((staff) => {
        if (staff && staff.length > 0) {
          setEmployeesList(staff);
        }
      })
      .catch((err) => {
        console.warn('Failed to load staff list for branch manager selection:', err);
      });

    setIsLoadingPartners(true);
    tenantsApi
      .listFranchises()
      .then((apiPartners) => {
        if (Array.isArray(apiPartners) && apiPartners.length > 0) {
          const mapped: FranchisePartnerOption[] = apiPartners.map((item: any) => {
            const partnerName =
              item.companyName || item.entityName || item.name || 'Ashish Khopde Outlets LLP';
            const contact = item.contactPerson || 'Ashish Khopde';
            const code =
              item.code || `FRN-${partnerName.substring(0, 3).toUpperCase()}-889`;
            const region = item.region || item.state || 'Indore & Malwa Region';
            return {
              id: item.id,
              name: partnerName,
              code,
              contactPerson: contact,
              region,
              agreement: 'Active · 10% Royalty (5-Year Term)',
              email: item.contactEmail || item.email,
            };
          });

          setFranchisePartners((prev) => {
            const existingIds = new Set(mapped.map((m) => m.id));
            const existingNames = new Set(mapped.map((m) => m.name.toLowerCase()));
            const rest = prev.filter(
              (p) => !existingIds.has(p.id) && !existingNames.has(p.name.toLowerCase()),
            );
            return [...mapped, ...rest];
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch franchise partners in AllBranchesTab:', err);
      })
      .finally(() => {
        setIsLoadingPartners(false);
      });

    // Always fetch live branches from database API
    tenantsApi
      .listBranches()
      .then((rawBranches) => {
        if (Array.isArray(rawBranches) && rawBranches.length > 0) {
          const mapped: BranchRecord[] = rawBranches.map((b: any, idx: number) => {
            const isFr = Boolean(
              b.isFranchiseOwned ||
              b.franchisePartnerId ||
              b.franchiseId ||
              b.type === 'Franchise' ||
              b.franchisePartnerName
            );
            return {
              id: b.id,
              name: b.name,
              code: b.code || `BR-${100 + idx}`,
              type: (b.type || (isFr ? 'Franchise' : 'Flagship')) as BranchRecord['type'],
              address: b.address || b.addressLine1 || `${b.name}, ${b.city || 'Central'}`,
              city: b.city || 'Indore',
              manager: b.manager || 'Branch Lead',
              managerEmail: b.email || b.managerEmail || '',
              contactNumber: b.phone || b.contactNumber || '+91 98000 00000',
              primaryManagerEmployeeId: b.primaryManagerEmployeeId || undefined,
              status: (b.status === 'ACTIVE' || b.status === 'Active'
                ? 'Active'
                : b.status === 'Pending' || b.status === 'TEMPORARILY_CLOSED'
                  ? 'Pending'
                  : 'Inactive') as 'Active' | 'Inactive' | 'Pending',
              workingHours: b.workingHours || '09:00 AM - 09:00 PM',
              revenue: Number(b.revenue) || 0,
              appointments: Number(b.appointments) || 0,
              occupancy: Number(b.occupancy) || 0,
              staffCount: Number(b.staffCount) || (b.resources?.length || 6),
              clientCount: Number(b.clientCount) || 0,
              createdDate: b.createdDate || (typeof b.createdAt === 'string' ? b.createdAt.split('T')[0] : '2026-01-15'),
              servicesAvailable: b.servicesAvailable || [
                'Hair Styling & Texture',
                'Bridal & Aesthetics',
                'Therapeutic Spa & Massage',
                'Nail Studio & Care',
                'Skin Glow & Facials',
              ],
              franchisePartnerId: b.franchisePartnerId || b.franchiseId,
              franchisePartnerName: b.franchisePartnerName || b.franchise?.companyName,
              isFranchiseOwned: isFr,
            };
          });

          setBranches((prev) => {
            const mappedIds = new Set(mapped.map((m) => m.id));
            const rest = prev.filter((p) => !mappedIds.has(p.id));
            return [...mapped, ...rest];
          });
        }
      })
      .catch((err) => {
        console.warn('Could not load branches from API in AllBranchesTab:', err);
      });
  }, [isFranchisePortal]);

  const [authorizedLimit, setAuthorizedLimit] = useState<number>(() => {
    return Number(localStorage.getItem('digiflex_franchise_max_outlets') || 1);
  });

  useEffect(() => {
    if (isFranchisePortal) {
      const activeFranchiseId = localStorage.getItem('digiflex_franchise_id');
      if (activeFranchiseId && isUuid(activeFranchiseId)) {
        tenantsApi
          .getFranchise(activeFranchiseId)
          .then((partner) => {
            if (partner) {
              const limit = partner.authorizedOutletsCount || partner.maxOutlets || 1;
              setAuthorizedLimit(limit);
              localStorage.setItem('digiflex_franchise_max_outlets', String(limit));
              if (partner.territoryRegion) {
                localStorage.setItem('digiflex_franchise_region', partner.territoryRegion);
              }
              if (partner.code) {
                localStorage.setItem('digiflex_franchise_code', partner.code);
              }
            }
          })
          .catch(() => { });
      }

      if (activeFranchiseId) {
        tenantsApi
          .getFranchiseBranches(activeFranchiseId)
          .then((fBranches) => {
            if (Array.isArray(fBranches) && fBranches.length > 0) {
              setBranches((prev) => {
                const fetchedIds = new Set(fBranches.map((b: any) => b.id));
                const rest = prev.filter((p) => !fetchedIds.has(p.id));
                return [...fBranches, ...rest];
              });
            }
          })
          .catch((err) => {
            console.warn('Could not fetch franchise branches in AllBranchesTab:', err);
          });
      }
    }
  }, [isFranchisePortal]);

  const currentFranchiseId =
    localStorage.getItem('digiflex_franchise_id') || 'f0000000-0000-0000-0000-000000000001';
  const currentFranchiseName =
    localStorage.getItem('digiflex_franchise_partner_name') || 'Ashish Khopde Outlets LLP';
  const currentFranchiseCode =
    localStorage.getItem('digiflex_franchise_code') || 'FRN-ASH-889';
  const currentFranchiseRegion =
    localStorage.getItem('digiflex_franchise_region') || 'Indore & Malwa Region';

  const currentFranchiseBranchCount = useMemo(() => {
    if (!isFranchisePortal) return 0;
    return branches.filter(
      (b) =>
        b.isFranchiseOwned ||
        b.franchisePartnerId === currentFranchiseId ||
        (b.franchisePartnerName &&
          b.franchisePartnerName.toLowerCase() === currentFranchiseName.toLowerCase()),
    ).length;
  }, [branches, isFranchisePortal, currentFranchiseId, currentFranchiseName]);

  const isQuotaReached = isFranchisePortal && currentFranchiseBranchCount >= authorizedLimit;

  // New branch form state
  const [newBranch, setNewBranch] = useState({
    name: '',
    code: '',
    type: 'Flagship' as BranchRecord['type'],
    address: '',
    city: salon?.city || 'Indore',
    manager: '',
    managerEmail: '',
    primaryManagerEmployeeId: '' as string | undefined,
    contactNumber: salon?.businessPhone || '',
    workingHours: '09:00 AM - 09:00 PM',
    franchisePartnerId: '',
    franchisePartnerName: '',
    isFranchiseOwned: false,
  });

  const filteredBranches = branches.filter((b) => {
    if (isFranchisePortal) {
      const isFranchiseBranch =
        b.isFranchiseOwned ||
        b.type === 'Franchise' ||
        Boolean(b.franchisePartnerId) ||
        Boolean(b.franchisePartnerName);
      if (!isFranchiseBranch) return false;

      if (partnerFilter !== 'All') {
        const matchesPartner =
          b.franchisePartnerId === partnerFilter ||
          (b.franchisePartnerName &&
            b.franchisePartnerName.toLowerCase() === partnerFilter.toLowerCase());
        if (!matchesPartner) return false;
      }
    } else if (partnerFilter !== 'All') {
      const matchesPartner =
        b.franchisePartnerId === partnerFilter ||
        (b.franchisePartnerName &&
          b.franchisePartnerName.toLowerCase() === partnerFilter.toLowerCase());
      if (!matchesPartner) return false;
    }

    const matchesSearch =
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.manager || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(
        b.franchisePartnerName &&
        b.franchisePartnerName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesCity = cityFilter === 'All' || b.city === cityFilter;
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Handle Export (adheres to standard)
  const handleExport = () => {
    const headers = [
      'Branch Name',
      'Code',
      'Type',
      'Franchise Partner',
      'City',
      'Manager',
      'Contact',
      'Status',
      'Working Hours',
      'Revenue',
      'Appointments',
      'Occupancy',
    ];
    const rows = filteredBranches.map((b) => [
      `"${b.name}"`,
      b.code,
      b.type,
      `"${b.franchisePartnerName || 'Company-Owned (COCO)'}"`,
      b.city,
      `"${b.manager}"`,
      b.contactNumber,
      b.status,
      `"${b.workingHours}"`,
      `₹${b.revenue}`,
      b.appointments,
      `${b.occupancy}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `branches_registry_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(`Exported ${filteredBranches.length} branches to CSV.`);
  };

  // Helper to open Add Branch Modal with clean state
  const handleOpenAddModal = () => {
    setIsFranchiseToggleOn(false);
    setSelectedEmployeeId('');
    setIsAddBMOpen(false);
    setNewBMForm({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: 'Password@123',
    });
    setNewBranch({
      name: '',
      code: '',
      type: 'Flagship',
      address: '',
      city: 'Bhopal',
      manager: '',
      managerEmail: '',
      primaryManagerEmployeeId: '',
      contactNumber: '',
      workingHours: '09:00 AM - 09:00 PM',
      franchisePartnerId: '',
      franchisePartnerName: '',
      isFranchiseOwned: false,
    });
    // Refresh employee directory so any newly registered staff are readily available
    staffApi
      .list()
      .then((staff) => {
        if (staff && staff.length > 0) {
          const map = new Map<string, FullStaffRecord>();
          masterStaffRecords.forEach((s) => map.set(s.id, s));
          staff.forEach((s) => map.set(s.id, s));
          setEmployeesList(Array.from(map.values()));
        }
      })
      .catch(() => { });
    if (isFranchisePortal && isQuotaReached) {
      toast(
        `Authorized outlet limit reached (${currentFranchiseBranchCount}/${authorizedLimit} Outlets). Contact Head Office to request additional outlet allocation.`,
      );
      return;
    }
    setIsAddModalOpen(true);
  };

  // Handle Add Branch / Franchise Outlet
  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.code) {
      toast('Please fill in Branch Name and Branch Code.');
      return;
    }
    if (isFranchiseToggleOn && !newBranch.franchisePartnerId) {
      toast('Please select a Franchise Partner or turn off the franchise toggle to make it Company-Owned.');
      return;
    }

    const partner = franchisePartners.find((p) => p.id === newBranch.franchisePartnerId);
    const isFranchise = isFranchisePortal || (isFranchiseToggleOn && Boolean(newBranch.franchisePartnerId));

    if (isFranchisePortal && isQuotaReached) {
      toast(
        `Cannot register outlet: Authorized limit of ${authorizedLimit} outlet(s) reached (${currentFranchiseBranchCount}/${authorizedLimit}).`,
      );
      return;
    }

    // 1. If user typed a new BM into inline form without clicking "Save & Assign Manager", auto-create & assign
    let activeManagerEmpId = selectedEmployeeId;
    let activeManagerName = newBranch.manager;
    let activeManagerEmail = newBranch.managerEmail;
    let activeManagerPhone = newBranch.contactNumber;

    if (!activeManagerEmpId && newBMForm.firstName.trim() && newBMForm.email.trim()) {
      const fullName = `${newBMForm.firstName.trim()} ${newBMForm.lastName.trim()}`.trim();
      try {
        const createdStaff = await staffApi.create({
          firstName: newBMForm.firstName.trim(),
          lastName: newBMForm.lastName.trim() || 'Manager',
          fullName,
          displayName: fullName,
          email: newBMForm.email.trim(),
          mobilePhone: newBMForm.mobile.trim(),
          mobile: newBMForm.mobile.trim(),
          role: 'Branch Manager',
          roleCode: 'BRANCH_MANAGER',
          jobTitle: 'Branch Manager',
          employmentType: 'Full Time',
          status: 'Active',
          loginEnabled: true,
          password: newBMForm.password || 'Password@123',
          branch: newBranch.name || (isFranchisePortal ? 'Franchise Outlet' : 'New Branch Location'),
        });
        activeManagerEmpId = createdStaff.id;
        activeManagerName = createdStaff.fullName || fullName;
        activeManagerEmail = createdStaff.email || newBMForm.email.trim();
        activeManagerPhone = createdStaff.mobilePhone || createdStaff.mobile || newBMForm.mobile.trim();

        setEmployeesList((prev) => [createdStaff, ...prev.filter((e) => e.id !== createdStaff.id)]);
        const mIdx = masterStaffRecords.findIndex((e) => e.id === createdStaff.id);
        if (mIdx >= 0) masterStaffRecords[mIdx] = createdStaff;
        else masterStaffRecords.unshift(createdStaff);
      } catch (err) {
        console.warn('Could not auto-create manager in handleAddBranch:', err);
      }
    }

    const branchManager = activeManagerName || 'Unassigned';
    const branchManagerEmail =
      activeManagerEmail ||
      (activeManagerName
        ? `${activeManagerName.toLowerCase().replace(/\s+/g, '.')}@${salon?.slug || 'salon'}.com`
        : '');

    const branchPayload: Partial<BranchRecord> = {
      name: newBranch.name,
      code: newBranch.code.toUpperCase(),
      type: isFranchisePortal ? 'Franchise' : isFranchise ? 'Franchise' : newBranch.type,
      address: newBranch.address || 'Central High Street',
      city: newBranch.city,
      manager: branchManager,
      primaryManagerEmployeeId: isUuid(activeManagerEmpId) ? activeManagerEmpId : undefined,
      managerEmail: branchManagerEmail,
      contactNumber: activeManagerPhone || newBranch.contactNumber || salon?.businessPhone || '+91 98000 11223',
      status: isFranchisePortal ? 'Pending' : 'Active',
      workingHours: newBranch.workingHours,
      revenue: 0,
      appointments: 0,
      occupancy: 0,
      staffCount: isFranchisePortal ? 0 : 6,
      clientCount: 0,
      servicesAvailable: ['Hair Styling', 'Express Facial', 'Manicure & Pedicure'],
      franchisePartnerId: isFranchisePortal ? currentFranchiseId : isFranchise ? newBranch.franchisePartnerId : undefined,
      franchisePartnerName: isFranchisePortal ? currentFranchiseName : isFranchise && partner ? partner.name : undefined,
      isFranchiseOwned: isFranchisePortal || isFranchise,
    };

    let createdRecord: BranchRecord;
    try {
      let created: any;
      if (createBranch && !isFranchisePortal) {
        created = await createBranch({
          ...branchPayload,
          franchiseId: isFranchise ? newBranch.franchisePartnerId : undefined,
          franchisePartnerId: isFranchise ? newBranch.franchisePartnerId : undefined,
          franchisePartnerName: isFranchise && partner ? partner.name : undefined,
          primaryManagerEmployeeId: isUuid(activeManagerEmpId) ? activeManagerEmpId : undefined,
        } as any);
      } else {
        const fId = isFranchisePortal ? currentFranchiseId : isFranchise ? newBranch.franchisePartnerId : undefined;
        const franchiseTenantId =
          localStorage.getItem('digiflex_franchise_tenant_id') ||
          tokenStorage.getTenantId() ||
          undefined;

        created = await tenantsApi.createBranch({
          tenantId: franchiseTenantId,
          name: branchPayload.name!,
          code: branchPayload.code!,
          addressLine1: branchPayload.address || 'Central High Street',
          city: branchPayload.city || 'Indore',
          state: 'Madhya Pradesh',
          postalCode: '452001',
          phone: branchPayload.contactNumber || '+91 98000 00000',
          email: branchPayload.managerEmail,
          franchiseId: isUuid(fId) ? fId : undefined,
          franchisePartnerId: isUuid(fId) ? fId : undefined,
          franchisePartnerName: isFranchisePortal ? currentFranchiseName : isFranchise && partner ? partner.name : undefined,
          primaryManagerEmployeeId: isUuid(activeManagerEmpId) ? activeManagerEmpId : undefined,
        });
      }
      createdRecord = (created as BranchRecord) || ({
        id: `BR-00${branches.length + 1}`,
        ...branchPayload,
        createdDate: 'Just Now',
      } as BranchRecord);
    } catch (err: any) {
      console.error('Failed to create branch via API:', err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Failed to register outlet. Please check authorized limits and try again.';
      toast(errorMsg);
      return;
    }

    // Bind manager with role BRANCH_MANAGER to newly created branch
    if (activeManagerEmpId) {
      createdRecord.primaryManagerEmployeeId = activeManagerEmpId;
      createdRecord.manager = branchManager;
      createdRecord.managerEmail = branchManagerEmail;

      try {
        await staffApi.update(activeManagerEmpId, {
          primaryBranchId: createdRecord.id,
          branch: createdRecord.name,
          role: 'Branch Manager',
          roleCode: 'BRANCH_MANAGER',
          jobTitle: 'Branch Manager',
          loginEnabled: true,
        });

        // Update local employee directory
        setEmployeesList((prev) =>
          prev.map((e) =>
            e.id === activeManagerEmpId
              ? {
                ...e,
                primaryBranchId: createdRecord.id,
                branch: createdRecord.name,
                role: 'Branch Manager',
                roleCode: 'BRANCH_MANAGER',
                jobTitle: 'Branch Manager',
              }
              : e,
          ),
        );
        const mIdx = masterStaffRecords.findIndex((e) => e.id === activeManagerEmpId);
        if (mIdx >= 0) {
          masterStaffRecords[mIdx] = {
            ...masterStaffRecords[mIdx],
            primaryBranchId: createdRecord.id,
            branch: createdRecord.name,
            role: 'Branch Manager',
            roleCode: 'BRANCH_MANAGER',
            jobTitle: 'Branch Manager',
          };
        }

        // Sync manager references on branch record
        await tenantsApi
          .updateBranch(createdRecord.id, {
            primaryManagerEmployeeId: activeManagerEmpId,
            manager: branchManager,
            managerEmail: branchManagerEmail,
            contactNumber: activeManagerPhone || createdRecord.contactNumber,
          })
          .catch(() => { });
      } catch (staffErr) {
        console.warn('Staff role assignment note:', staffErr);
      }
    }

    setBranches((prev) => [createdRecord, ...prev.filter((b) => b.id !== createdRecord.id)]);

    setIsAddModalOpen(false);
    setIsFranchiseToggleOn(false);
    setSelectedEmployeeId('');
    setIsAddBMOpen(false);
    setNewBMForm({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: 'Password@123',
    });
    setNewBranch({
      name: '',
      code: '',
      type: 'Flagship',
      address: '',
      city: salon?.city || 'Indore',
      manager: '',
      managerEmail: '',
      primaryManagerEmployeeId: '',
      contactNumber: salon?.businessPhone || '',
      workingHours: '09:00 AM - 09:00 PM',
      franchisePartnerId: '',
      franchisePartnerName: '',
      isFranchiseOwned: false,
    });

    if (isFranchisePortal) {
      toast(
        activeManagerName
          ? `Franchise Outlet onboarding request for [${createdRecord.name}] submitted with Branch Manager "${activeManagerName}" (Role: Branch Manager).`
          : `Registration proposal for [${createdRecord.name}] submitted for Admin Approval.`,
      );
    } else {
      toast(
        activeManagerName
          ? `Branch "${createdRecord.name}" created with Branch Manager "${activeManagerName}" (Role: Branch Manager).`
          : `Branch "${createdRecord.name}" created and added to Brand Registry.${createdRecord.franchisePartnerName ? ` Assigned to ${createdRecord.franchisePartnerName}.` : ' Registered as Company-Owned (COCO).'}`,
      );
    }
  };

  // Handle Quick Create New Employee as Branch Manager
  const handleCreateBM = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newBMForm.firstName.trim() || !newBMForm.lastName.trim() || !newBMForm.mobile.trim() || !newBMForm.email.trim()) {
      toast('Please fill in all employee fields (First Name, Last Name, Email, Mobile).');
      return;
    }

    if (!newBMForm.email.includes('@')) {
      toast('Please enter a valid email address for Branch Manager login.');
      return;
    }

    setIsCreatingBM(true);
    const fullName = `${newBMForm.firstName.trim()} ${newBMForm.lastName.trim()}`;
    const initials = `${newBMForm.firstName.trim()[0].toUpperCase()}${newBMForm.lastName.trim()[0].toUpperCase()}`;
    const branchName = newBranch.name || (isFranchisePortal ? 'Franchise Outlet' : 'New Branch Location');

    let createdStaff: FullStaffRecord;
    try {
      createdStaff = await staffApi.create({
        firstName: newBMForm.firstName.trim(),
        lastName: newBMForm.lastName.trim(),
        fullName,
        displayName: fullName,
        email: newBMForm.email.trim(),
        mobilePhone: newBMForm.mobile.trim(),
        mobile: newBMForm.mobile.trim(),
        role: 'Branch Manager',
        roleCode: 'BRANCH_MANAGER',
        jobTitle: 'Branch Manager',
        employmentType: 'Full Time',
        status: 'Active',
        loginEnabled: true,
        password: newBMForm.password || 'Password@123',
        branch: branchName,
        gender: 'Other',
        dob: '15 Jun 1992',
        address: newBranch.city ? `${newBranch.city}, Central Region` : 'Central Operations',
        emergencyContact: '+91 98000 00000',
        currentShift: 'General Shift (09:30 - 18:30)',
        level: 'Senior',
        skills: ['Branch Administration', 'Staff Rostering', 'POS Operations', 'Customer Escalations'],
      });
    } catch (apiErr) {
      console.warn('API staff creation fallback in handleCreateBM:', apiErr);
      const newEmpId = `EMP-${1080 + employeesList.length + 1}`;
      createdStaff = {
        id: newEmpId,
        firstName: newBMForm.firstName.trim(),
        lastName: newBMForm.lastName.trim(),
        fullName,
        role: 'Branch Manager',
        roleCode: 'BRANCH_MANAGER',
        branch: branchName,
        status: 'Active',
        avatarInitials: initials,
        joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        employmentType: 'Full Time',
        reportingManager: 'HQ Operations Director',
        mobile: newBMForm.mobile.trim(),
        mobilePhone: newBMForm.mobile.trim(),
        email: newBMForm.email.trim(),
        gender: 'Other',
        dob: '15 Jun 1992',
        address: newBranch.city ? `${newBranch.city}, Central Region` : 'Central Operations',
        emergencyContact: '+91 98000 00000',
        currentShift: 'General Shift (09:30 - 18:30)',
        level: 'Senior',
        skills: ['Branch Administration', 'Staff Rostering', 'POS Operations', 'Customer Escalations'],
        assignedServices: [],
        metrics: {
          revenueGenerated: 0,
          servicesCompleted: 0,
          retailSales: 0,
          rebookingRate: 0,
          utilisation: 0,
          commissionEarned: 0,
          targetAchievement: 0,
          csatRating: 5.0,
        },
        skillsList: [],
        documents: [],
        roster: [],
        attendance: [],
        targets: [],
        commissions: [],
        performanceHistory: [],
      };
    } finally {
      setIsCreatingBM(false);
    }

    setEmployeesList((prev) => [createdStaff, ...prev.filter((e) => e.id !== createdStaff.id)]);
    const mIdx = masterStaffRecords.findIndex((e) => e.id === createdStaff.id);
    if (mIdx >= 0) {
      masterStaffRecords[mIdx] = createdStaff;
    } else {
      masterStaffRecords.unshift(createdStaff);
    }

    setSelectedEmployeeId(createdStaff.id);
    setNewBranch((prev) => ({
      ...prev,
      manager: createdStaff.fullName,
      managerEmail: createdStaff.email,
      contactNumber: createdStaff.mobilePhone || createdStaff.mobile || prev.contactNumber,
      primaryManagerEmployeeId: createdStaff.id,
    }));
    setIsAddBMOpen(false);
    setNewBMForm({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: 'Password@123',
    });
    toast(`Branch Manager "${fullName}" added with role "Branch Manager" and assigned.`);
  };

  const handleOpenAssignManager = (branch: BranchRecord) => {
    setAssigningBranch(branch);
    const matchedEmp = employeesList.find(
      (e) =>
        (branch.primaryManagerEmployeeId && e.id === branch.primaryManagerEmployeeId) ||
        (branch.managerEmail && e.email?.toLowerCase() === branch.managerEmail?.toLowerCase()) ||
        (e.primaryBranchId === branch.id && (e.roleCode === 'BRANCH_MANAGER' || e.role?.toLowerCase().includes('branch manager'))),
    );
    setAssignStaffId(matchedEmp?.id || branch.primaryManagerEmployeeId || '');
    setIsAssignNewStaffOpen(false);
    setQuickStaffForm({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: 'Password@123',
    });
  };

  const handleSaveAssignManager = async () => {
    if (!assigningBranch) return;
    setIsSavingAssign(true);
    try {
      let managerEmpId = assignStaffId;
      let managerName = '';
      let managerEmail = '';
      let managerPhone = '';

      if (isAssignNewStaffOpen) {
        if (!quickStaffForm.firstName || !quickStaffForm.email) {
          toast('First name and email are required to create a new manager.');
          setIsSavingAssign(false);
          return;
        }
        const fullName = `${quickStaffForm.firstName} ${quickStaffForm.lastName}`.trim();
        const newStaff = await staffApi.create({
          firstName: quickStaffForm.firstName,
          lastName: quickStaffForm.lastName || 'Manager',
          fullName,
          displayName: fullName,
          email: quickStaffForm.email,
          mobilePhone: quickStaffForm.mobile || '+91 99000 00000',
          role: 'Branch Manager',
          roleCode: 'BRANCH_MANAGER',
          primaryBranchId: assigningBranch.id,
          branch: assigningBranch.name,
          loginEnabled: true,
          password: quickStaffForm.password || ' @123!',
        });
        managerEmpId = newStaff.id;
        managerName = newStaff.fullName || fullName;
        managerEmail = newStaff.email || quickStaffForm.email;
        managerPhone = newStaff.mobilePhone || newStaff.mobile || quickStaffForm.mobile;
        setEmployeesList((prev) => [newStaff, ...prev]);
        const mIdx = masterStaffRecords.findIndex((e) => e.id === newStaff.id);
        if (mIdx >= 0) masterStaffRecords[mIdx] = newStaff;
        else masterStaffRecords.unshift(newStaff);
      } else {
        const existingEmp = employeesList.find((e) => e.id === assignStaffId);
        if (!existingEmp) {
          toast('Please select a staff member to assign as Branch Manager.');
          setIsSavingAssign(false);
          return;
        }
        managerEmpId = existingEmp.id;
        managerName = existingEmp.fullName;
        managerEmail = existingEmp.email;
        managerPhone = existingEmp.mobilePhone || existingEmp.mobile || assigningBranch.contactNumber;

        // Promote/update staff to BRANCH_MANAGER with this branch in People API
        await staffApi.update(existingEmp.id, {
          primaryBranchId: assigningBranch.id,
          branch: assigningBranch.name,
          role: 'Branch Manager',
          roleCode: 'BRANCH_MANAGER',
          loginEnabled: true,
        });

        setEmployeesList((prev) =>
          prev.map((e) =>
            e.id === existingEmp.id
              ? {
                ...e,
                primaryBranchId: assigningBranch.id,
                branch: assigningBranch.name,
                role: 'Branch Manager',
                roleCode: 'BRANCH_MANAGER',
              }
              : e,
          ),
        );
      }

      // Update branch in Organization API & Context
      await updateBranch(assigningBranch.id, {
        primaryManagerEmployeeId: managerEmpId,
        manager: managerName,
        managerEmail,
        contactNumber: managerPhone || assigningBranch.contactNumber,
      } as any);

      // Update local branches list
      setBranches((prev) =>
        prev.map((b) =>
          b.id === assigningBranch.id
            ? {
              ...b,
              primaryManagerEmployeeId: managerEmpId,
              manager: managerName,
              managerEmail,
              contactNumber: managerPhone || b.contactNumber,
            }
            : b,
        ),
      );

      toast(`Branch Manager "${managerName}" assigned to "${assigningBranch.name}" successfully!`);
      setAssigningBranch(null);
    } catch (err) {
      console.warn('Failed to assign branch manager:', err);
      toast('Notice: Branch Manager assignment updated.');
      setAssigningBranch(null);
    } finally {
      setIsSavingAssign(false);
    }
  };

  const handleOpenEditBranch = (branch: BranchRecord) => {
    setEditBranch({ ...branch });
    setIsEditFranchiseToggleOn(Boolean(branch.franchisePartnerId || branch.isFranchiseOwned || branch.type === 'Franchise'));
    setIsEditAddBMOpen(false);
    setEditBMForm({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
    });
    const matchedEmp = employeesList.find(
      (e) =>
        (branch.primaryManagerEmployeeId && e.id === branch.primaryManagerEmployeeId) ||
        (branch.managerEmail && e.email?.toLowerCase() === branch.managerEmail?.toLowerCase()) ||
        (e.primaryBranchId === branch.id && (e.roleCode === 'BRANCH_MANAGER' || e.role?.toLowerCase().includes('branch manager'))),
    );
    setEditSelectedEmployeeId(matchedEmp?.id || branch.primaryManagerEmployeeId || '');
  };

  // Handle Quick Create New Employee as Branch Manager inside Edit Branch modal
  const handleCreateEditBM = async (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editBMForm.firstName.trim() || !editBMForm.lastName.trim() || !editBMForm.mobile.trim() || !editBMForm.email.trim()) {
      toast('Please fill in all employee fields (First Name, Last Name, Email, Mobile).');
      return;
    }

    const fullName = `${editBMForm.firstName.trim()} ${editBMForm.lastName.trim()}`;
    const newEmpId = `EMP-${1080 + employeesList.length + 1}`;

    let newRecord: FullStaffRecord;
    try {
      newRecord = await staffApi.create({
        firstName: editBMForm.firstName.trim(),
        lastName: editBMForm.lastName.trim() || 'Manager',
        fullName,
        displayName: fullName,
        email: editBMForm.email.trim(),
        mobilePhone: editBMForm.mobile.trim() || '+91 98260 00000',
        role: 'Branch Manager',
        roleCode: 'BRANCH_MANAGER',
        primaryBranchId: editBranch?.id,
        branch: editBranch?.name || 'Assigned Branch',
        loginEnabled: true,
        password: 'Password@123',
      });
      setEmployeesList((prev) => [newRecord, ...prev]);
      const mIdx = masterStaffRecords.findIndex((e) => e.id === newRecord.id);
      if (mIdx >= 0) masterStaffRecords[mIdx] = newRecord;
      else masterStaffRecords.unshift(newRecord);
    } catch {
      newRecord = {
        id: newEmpId,
        firstName: editBMForm.firstName.trim(),
        lastName: editBMForm.lastName.trim(),
        fullName: fullName,
        role: 'Branch Manager',
        roleCode: 'BRANCH_MANAGER',
        branch: editBranch?.name || 'Assigned Branch',
        primaryBranchId: editBranch?.id,
        status: 'Active',
        avatarInitials: `${editBMForm.firstName.trim()[0].toUpperCase()}${editBMForm.lastName.trim()[0].toUpperCase()}`,
        joiningDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        employmentType: 'Full Time',
        reportingManager: 'HQ Operations Director',
        mobile: editBMForm.mobile.trim(),
        mobilePhone: editBMForm.mobile.trim(),
        email: editBMForm.email.trim(),
        gender: 'Other',
        dob: '15 Jun 1992',
        address: editBranch?.city ? `${editBranch.city}, Central Region` : 'Central Operations',
        emergencyContact: '+91 98000 00000',
        currentShift: 'General Shift (09:30 - 18:30)',
        level: 'Senior',
        skills: ['Branch Administration', 'Staff Rostering', 'POS Operations', 'Customer Escalations'],
        assignedServices: [],
        metrics: {
          revenueGenerated: 0,
          servicesCompleted: 0,
          retailSales: 0,
          rebookingRate: 0,
          utilisation: 0,
          commissionEarned: 0,
          targetAchievement: 0,
          csatRating: 5.0,
        },
        skillsList: [],
        documents: [],
        roster: [],
        attendance: [],
        targets: [],
        commissions: [],
        performanceHistory: [],
      };
      setEmployeesList((prev) => [newRecord, ...prev]);
      const mIdx = masterStaffRecords.findIndex((e) => e.id === newRecord.id);
      if (mIdx >= 0) masterStaffRecords[mIdx] = newRecord;
      else masterStaffRecords.unshift(newRecord);
    }

    setEditSelectedEmployeeId(newRecord.id);
    if (editBranch) {
      setEditBranch((prev) =>
        prev
          ? {
            ...prev,
            primaryManagerEmployeeId: newRecord.id,
            manager: newRecord.fullName,
            managerEmail: newRecord.email,
            contactNumber: newRecord.mobilePhone || newRecord.mobile || prev.contactNumber,
          }
          : null,
      );
    }
    setIsEditAddBMOpen(false);
    setEditBMForm({
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
    });
    toast(`New Branch Manager "${fullName}" added and selected.`);
  };

  // Handle Edit Branch Save
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBranch) return;

    const partner = franchisePartners.find((p) => p.id === editBranch.franchisePartnerId);
    const isFranchise = isEditFranchiseToggleOn && Boolean(editBranch.franchisePartnerId);

    let managerEmpId = editBranch.primaryManagerEmployeeId;
    let managerName = editBranch.manager;
    let managerEmail = editBranch.managerEmail;
    let managerContact = editBranch.contactNumber;

    if (editSelectedEmployeeId) {
      const emp = employeesList.find((e) => e.id === editSelectedEmployeeId);
      if (emp) {
        managerEmpId = emp.id;
        managerName = emp.fullName;
        managerEmail = emp.email;
        managerContact = emp.mobilePhone || emp.mobile || managerContact;

        staffApi
          .update(emp.id, {
            primaryBranchId: editBranch.id,
            branch: editBranch.name,
            role: 'Branch Manager',
            roleCode: 'BRANCH_MANAGER',
            loginEnabled: true,
          })
          .catch((err) => console.warn('Staff branch manager sync notice:', err));
      }
    } else if (!editBranch.manager || editBranch.manager === 'Unassigned') {
      managerEmpId = undefined;
      managerName = 'Unassigned';
      managerEmail = '';
    }

    const updated: BranchRecord = {
      ...editBranch,
      code: editBranch.code.toUpperCase(),
      primaryManagerEmployeeId: managerEmpId,
      manager: managerName,
      managerEmail,
      contactNumber: managerContact,
      franchisePartnerId: isFranchise ? editBranch.franchisePartnerId : undefined,
      franchisePartnerName: isFranchise && partner ? partner.name : undefined,
      isFranchiseOwned: isFranchise,
      type: isFranchise ? 'Franchise' : editBranch.type === 'Franchise' ? 'Flagship' : editBranch.type,
    };

    try {
      await updateBranch(editBranch.id, updated as any);
    } catch {
      // Handled in context
    }

    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setEditBranch(null);
    toast(`Branch "${updated.name}" updated successfully.`);
  };

  // Handle Toggle Active/Inactive Status
  const handleToggleStatus = async (branch: BranchRecord) => {
    const nextStatus = branch.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateBranch(branch.id, { status: nextStatus });
    } catch {
      // Handled in context
    }
    setBranches((prev) => prev.map((b) => (b.id === branch.id ? { ...b, status: nextStatus } : b)));
    setDeactivateConfirmBranch(null);
    toast(`Branch "${branch.name}" status changed to ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-[22px] text-ink font-bold tracking-tight">
            All Brand Branches &amp; Locations
          </h2>
          <p className="text-[12.5px] text-muted mt-0.5">
            Centralized registry of company-owned flagships, boutique lounges, and licensed
            franchise units.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Registry</span>
          </Button>

          <Button
            onClick={handleOpenAddModal}
            disabled={isFranchisePortal && isQuotaReached}
            className={cn(
              'h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all',
              isFranchisePortal && isQuotaReached
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'premium-btn-primary',
            )}
            title={
              isFranchisePortal && isQuotaReached
                ? `Outlet quota full (${currentFranchiseBranchCount}/${authorizedLimit})`
                : undefined
            }
          >
            <Plus className="w-4 h-4" />
            <span>
              {isFranchisePortal
                ? isQuotaReached
                  ? `Outlet Limit Reached (${currentFranchiseBranchCount}/${authorizedLimit})`
                  : `Register New Outlet (${currentFranchiseBranchCount}/${authorizedLimit})`
                : 'Add Branch'}
            </span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by branch name, code, manager or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          {/* City Filter */}
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Cities</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Indore">Indore</option>
              <option value="Pune">Pune</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Jaipur">Jaipur</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Franchise Partner Filter */}
          <div className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Partner:</span>
            <select
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] max-w-[170px] truncate"
            >
              <option value="All">All Partners</option>
              {franchisePartners.map((fp) => (
                <option key={fp.id} value={fp.name}>
                  {fp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Status Filter */}
          <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Status:</span>
          {(['All', 'Active', 'Inactive', 'Pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                statusFilter === st
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Branches Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Branches &amp; Operational Units Registry
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Overview of capacity, manager assignments, and operational status
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredBranches.length} Branches Registered
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Branch & Code',
                  'Address & City',
                  'Branch Manager',
                  'Contact Phone',
                  'Working Hours',
                  'Revenue (MTD)',
                  'Appointments',
                  'Occupancy',
                  'Status',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 9 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#5A2EA6]/10 flex items-center justify-center text-[#5A2EA6]">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base font-semibold text-ink">No Branches Registered Yet</h4>
                      <p className="text-xs text-muted max-w-sm">
                        No salon branches exist in this tenant account yet. Click "Add New Branch" above to create and configure your first physical salon location.
                      </p>
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-2 h-9 px-4 rounded-xl text-xs font-semibold premium-btn-primary"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Create First Branch
                      </Button>
                    </div>
                  </td>
                </tr>
              ) :
                filteredBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <div className="font-bold text-ink text-[13px]">{branch.name}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted font-mono mt-0.5">
                        <span>{branch.code}</span>
                        <span>·</span>
                        <span className="text-[#5A2EA6] font-semibold">{branch.type}</span>
                      </div>
                      {branch.franchisePartnerName && (
                        <div className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-800 bg-amber-50/90 border border-amber-200 px-2 py-0.5 rounded-md mt-1">
                          <Building2 className="w-2.5 h-2.5 text-amber-700" />
                          <span>Franchise: {branch.franchisePartnerName}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 max-w-[160px]">
                      <div
                        className="text-[11.5px] text-ink font-medium truncate"
                        title={branch.address}
                      >
                        {branch.address}
                      </div>
                      <div className="text-[10px] text-muted">{branch.city}</div>
                    </td>
                    <td className="p-3.5">
                      {(() => {
                        const assignedManager = employeesList.find(
                          (e) =>
                            (branch.primaryManagerEmployeeId && e.id === branch.primaryManagerEmployeeId) ||
                            (branch.managerEmail && e.email && e.email.toLowerCase() === branch.managerEmail.toLowerCase()) ||
                            (e.primaryBranchId === branch.id && (e.roleCode === 'BRANCH_MANAGER' || e.role?.toLowerCase().includes('branch manager'))),
                        );
                        const name = assignedManager?.fullName || (branch.manager && branch.manager !== 'Unassigned' && !branch.manager.startsWith('Branch Lead #') ? branch.manager : '');
                        const email = assignedManager?.email || (branch.managerEmail && branch.managerEmail !== 'unassigned@salon.com' ? branch.managerEmail : '');
                        const initials = assignedManager?.avatarInitials || (name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'BM');

                        if (assignedManager || name) {
                          return (
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0 ring-2 ring-purple-100">
                                {initials}
                              </div>
                              <div className="min-w-0 max-w-[150px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-ink text-[12px] truncate" title={name}>
                                    {name}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                                    Manager
                                  </span>
                                </div>
                                <div className="text-[10px] text-muted truncate" title={email || branch.contactNumber}>
                                  {email || branch.contactNumber}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleOpenAssignManager(branch)}
                                className="p-1 hover:bg-[#5A2EA6]/10 rounded-lg text-[#5A2EA6] transition-colors cursor-pointer border-0 bg-transparent shrink-0"
                                title="Change Assigned Manager"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        }

                        return (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignManager(branch)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] text-[11px] font-bold border border-[#5A2EA6]/25 transition-all cursor-pointer shadow-2xs group hover:scale-[1.02]"
                          >
                            <UserPlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-[#5A2EA6]" />
                            <span>Assign Manager</span>
                          </button>
                        );
                      })()}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-soft">{branch.contactNumber}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-soft">
                        <Clock className="w-3 h-3 text-[#5A2EA6]" />
                        {branch.workingHours}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-ink">
                      ₹{(branch.revenue / 100000).toFixed(2)}L
                    </td>
                    <td className="p-3.5 font-semibold text-soft">{branch.appointments}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-ink">{branch.occupancy}%</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold border',
                          branch.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : branch.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200',
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            branch.status === 'Active'
                              ? 'bg-emerald-500'
                              : branch.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500',
                          )}
                        />
                        {branch.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details Action */}
                        <button
                          onClick={() => setViewBranch(branch)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Complete Branch Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Branch Action */}
                        <button
                          onClick={() => handleOpenEditBranch(branch)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Edit Branch Settings"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Assign Branch Manager Action */}
                        <button
                          onClick={() => handleOpenAssignManager(branch)}
                          className="w-8 h-8 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Assign / Reassign Branch Manager"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>

                        {/* View Performance Action */}
                        <button
                          onClick={() => onNavigateToPerformance(branch.name)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Branch Analytics Dashboard"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Configure Hours Action */}
                        <button
                          onClick={() => onNavigateToWorkingHours(branch.name)}
                          className="w-8 h-8 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Configure Working Hours & Schedule"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {/* Activate / Deactivate Action */}
                        <button
                          onClick={() => setDeactivateConfirmBranch(branch)}
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0',
                            branch.status === 'Active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                          )}
                          title={branch.status === 'Active' ? 'Deactivate Branch' : 'Activate Branch'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────────────────────
          MODALS & DRAWERS (Portaled to document.body with full-screen overlay)
          ───────────────────────────────────────────────────────────────────────── */}

      {/* 1. View Branch Details Modal */}
      {viewBranch &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      {viewBranch.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
                      {viewBranch.code}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    {viewBranch.address}, {viewBranch.city} · {viewBranch.type}
                  </p>
                </div>
                <button
                  onClick={() => setViewBranch(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Notice / Callout */}
              <div className="p-6 space-y-4 text-xs overflow-y-auto custom-scroll">
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Branch operational envelope active. Real-time staff scheduling, appointment diary,
                  and POS billing are currently synced across HQ.
                </div>

                {/* Performance Mini Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-muted font-bold block uppercase">
                      Monthly Revenue
                    </span>
                    <strong className="text-[16px] font-bold text-ink mt-0.5 block">
                      ₹{(viewBranch.revenue / 100000).toFixed(2)}L
                    </strong>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                      Chair Occupancy
                    </span>
                    <strong className="text-[16px] font-bold text-emerald-900 mt-0.5 block">
                      {viewBranch.occupancy}%
                    </strong>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-purple-700 font-bold block uppercase">
                      Total Clients
                    </span>
                    <strong className="text-[16px] font-bold text-purple-900 mt-0.5 block">
                      {viewBranch.clientCount}
                    </strong>
                  </div>
                </div>

                {/* Operational Metadata */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2.5">
                  {viewBranch.franchisePartnerName && (
                    <div className="flex justify-between items-center p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
                      <span className="text-amber-900 font-bold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Assigned Franchise Partner:</span>
                      </span>
                      <strong className="text-amber-950 font-bold">
                        {viewBranch.franchisePartnerName}
                      </strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Branch General Manager:</span>
                    <strong className="text-ink">
                      {viewBranch.manager} ({viewBranch.managerEmail})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Contact Phone:</span>
                    <strong className="text-ink font-mono">{viewBranch.contactNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Operating Working Hours:</span>
                    <strong className="text-[#5A2EA6] font-bold">{viewBranch.workingHours}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Active Staff Count:</span>
                    <strong className="text-ink">
                      {viewBranch.staffCount} Stylists &amp; Technicians
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Launch / Created Date:</span>
                    <strong className="text-ink">{viewBranch.createdDate}</strong>
                  </div>
                </div>

                {/* Services Catalog Available */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-2">
                    Enabled Service Lines
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {viewBranch.servicesAvailable.map((srv) => (
                      <span
                        key={srv}
                        className="px-3 py-1 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewBranch(null);
                      onNavigateToPerformance(viewBranch.name);
                    }}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white"
                  >
                    Open Full Analytics
                  </Button>
                  <Button
                    onClick={() => setViewBranch(null)}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. Add Branch Modal */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    {isFranchisePortal
                      ? 'Register New Franchise Outlet'
                      : 'Register New Branch Location'}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    {isFranchisePortal
                      ? 'Submit a new franchise outlet onboarding proposal to Central Brand Admin for review & activation.'
                      : 'Add a new salon branch to the central brand registry and set operational parameters.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleAddBranch}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                {isFranchisePortal ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/80 border border-purple-200/80 text-xs">
                      <div className="flex items-center gap-2 text-purple-900 font-semibold">
                        <Store className="w-4 h-4 text-[#5A2EA6]" />
                        <span>Franchise Outlet Quota:</span>
                      </div>
                      <span className="font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5A2EA6] border border-purple-200">
                        {currentFranchiseBranchCount} / {authorizedLimit} Outlets Active
                      </span>
                    </div>

                    {isQuotaReached && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>
                          You have reached your authorized limit of {authorizedLimit} outlets. You cannot register
                          additional outlets without an allocation upgrade from Head Office.
                        </span>
                      </div>
                    )}

                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 leading-relaxed font-medium flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
                      <div>
                        <strong>Admin Approval Workflow:</strong> Submitting this registration
                        proposal will route it directly to Head Office Brand Admin for formal
                        verification and activation. Once approved, master catalogs, pricing policies,
                        and POS access will be provisioned automatically.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                    New branch will automatically inherit group master catalogs, pricing policy, and
                    tax rules.
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    {isFranchisePortal ? 'Outlet / Branch Name *' : 'Branch Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      isFranchisePortal
                        ? 'e.g. Atelier Habibganj Express Outlet'
                        : 'e.g. Atelier Indrapuri Flagship'
                    }
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      {isFranchisePortal ? 'Outlet Code *' : 'Branch Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isFranchisePortal ? 'e.g. ATL-BHOP-05' : 'e.g. ATL-IND-03'}
                      value={newBranch.code}
                      onChange={(e) => setNewBranch({ ...newBranch, code: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Location Type
                    </label>
                    <select
                      value={newBranch.type}
                      onChange={(e) => {
                        const val = e.target.value as BranchRecord['type'];
                        const isFr = val === 'Franchise';
                        setIsFranchiseToggleOn(isFr);
                        setNewBranch({
                          ...newBranch,
                          type: val,
                          isFranchiseOwned: isFr,
                          franchisePartnerId: isFr ? newBranch.franchisePartnerId : '',
                          franchisePartnerName: isFr ? newBranch.franchisePartnerName : '',
                        });
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Flagship">Flagship Salon</option>
                      <option value="Lounge">Luxury Lounge</option>
                      <option value="Express">Express Studio</option>
                      <option value="Franchise">Franchise Unit (FOFO / FOCO)</option>
                    </select>
                  </div>
                </div>

                {/* Franchise Partner Assignment Card */}
                {isFranchisePortal ? (
                  <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        <span>Franchise Partner Assignment</span>
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        License Verified
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-ink font-bold block">
                          {currentFranchiseName}
                        </strong>
                        <span className="text-[10.5px] text-muted">
                          {currentFranchiseRegion} · Partner Code #{currentFranchiseCode}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-purple-100 text-[#5A2EA6]">
                        Partner Portal Sync
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                          <span>Assign Franchise Partner</span>
                        </label>
                        <p className="text-[11px] text-muted mt-0.5">
                          {isFranchiseToggleOn
                            ? 'Branch is operated under an external licensed franchise partner.'
                            : 'Branch is 100% company-owned and centrally operated.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'text-[11px] font-bold transition-colors',
                            isFranchiseToggleOn ? 'text-slate-400 font-medium' : 'text-[#5A2EA6]'
                          )}
                        >
                          Company Owned
                        </span>

                        {/* Toggle Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isFranchiseToggleOn}
                          onClick={() => {
                            const next = !isFranchiseToggleOn;
                            setIsFranchiseToggleOn(next);
                            if (!next) {
                              setNewBranch((prev) => ({
                                ...prev,
                                franchisePartnerId: '',
                                franchisePartnerName: '',
                                isFranchiseOwned: false,
                                type: prev.type === 'Franchise' ? 'Flagship' : prev.type,
                              }));
                            } else {
                              const defaultP = franchisePartners[0];
                              setNewBranch((prev) => ({
                                ...prev,
                                franchisePartnerId: defaultP ? defaultP.id : '',
                                franchisePartnerName: defaultP ? defaultP.name : '',
                                isFranchiseOwned: true,
                                type: 'Franchise',
                              }));
                            }
                          }}
                          className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                            isFranchiseToggleOn ? 'bg-[#5A2EA6]' : 'bg-slate-300'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                              isFranchiseToggleOn ? 'translate-x-5' : 'translate-x-0'
                            )}
                          />
                        </button>

                        <span
                          className={cn(
                            'text-[11px] font-bold transition-colors',
                            isFranchiseToggleOn ? 'text-[#5A2EA6]' : 'text-slate-400 font-medium'
                          )}
                        >
                          Franchise Partner
                        </span>
                      </div>
                    </div>

                    {/* If Toggle is OFF -> Direct Company-Owned (COCO) */}
                    {!isFranchiseToggleOn ? (
                      <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#5A2EA6] flex items-center justify-center font-bold">
                            <Store className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <strong className="text-ink font-bold block text-xs">Company Owned (COCO)</strong>
                            <span className="text-[10.5px] text-muted">Direct brand ownership · Centralized inventory &amp; POS billing</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#5A2EA6] border border-purple-100">
                          Company Owned Branch
                        </span>
                      </div>
                    ) : (
                      /* If Toggle is ON -> Dropdown to select fetched franchise partner */
                      <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block">
                              Select Franchise Partner *
                            </label>
                            {isLoadingPartners ? (
                              <span className="text-[10px] text-purple-600 animate-pulse font-medium">
                                Fetching partners...
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {franchisePartners.length} Partners Available
                              </span>
                            )}
                          </div>
                          <select
                            required={isFranchiseToggleOn}
                            value={newBranch.franchisePartnerId}
                            onChange={(e) => {
                              const val = e.target.value;
                              const selectedP = franchisePartners.find((p) => p.id === val);
                              setNewBranch({
                                ...newBranch,
                                franchisePartnerId: val,
                                franchisePartnerName: selectedP ? selectedP.name : '',
                                isFranchiseOwned: true,
                                type: 'Franchise',
                              });
                            }}
                            className="w-full h-11 px-4 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          >
                            <option value="">-- Choose Licensed Franchise Partner --</option>
                            {franchisePartners.map((fp) => (
                              <option key={fp.id} value={fp.id}>
                                {fp.name} ({fp.code}) — {fp.region}
                              </option>
                            ))}
                          </select>
                        </div>

                        {newBranch.franchisePartnerId && (() => {
                          const selected = franchisePartners.find((p) => p.id === newBranch.franchisePartnerId);
                          if (!selected) return null;
                          return (
                            <div className="p-3.5 bg-white rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-in fade-in duration-150 shadow-xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                                  <strong className="text-ink font-bold text-xs">{selected.name}</strong>
                                </div>
                                <div className="text-[10.5px] text-muted flex flex-wrap items-center gap-2">
                                  <span>Partner Code: <strong className="font-mono text-ink">{selected.code}</strong></span>
                                  <span>•</span>
                                  <span>Territory: <strong className="text-ink">{selected.region}</strong></span>
                                  {selected.contactPerson && (
                                    <>
                                      <span>•</span>
                                      <span>Representative: <strong className="text-ink">{selected.contactPerson}</strong></span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <span className="self-start sm:self-auto text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                Assigned Franchise Partner
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      City / Region *
                    </label>
                    <select
                      value={newBranch.city}
                      onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Bhopal">Bhopal, MP</option>
                      <option value="Indore">Indore, MP</option>
                      <option value="Pune">Pune, MH</option>
                      <option value="Bengaluru">Bengaluru, KA</option>
                      <option value="Jaipur">Jaipur, RJ</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Working Hours</span>
                      </label>
                      <span className="text-[10px] font-bold font-mono text-[#5A2EA6] bg-[#5A2EA6]/10 px-2 py-0.5 rounded-full border border-[#5A2EA6]/20">
                        {newBranch.workingHours || '09:00 AM - 09:00 PM'}
                      </span>
                    </div>
                    {(() => {
                      const { open, close } = parseWorkingHours(newBranch.workingHours);
                      return (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={open}
                            onChange={(e) => {
                              setNewBranch({
                                ...newBranch,
                                workingHours: `${e.target.value} - ${close}`,
                              });
                            }}
                            className="flex-1 h-11 px-2.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                            title="Opening Time"
                          >
                            {!TIME_OPTIONS.includes(open) && (
                              <option value={open}>{open}</option>
                            )}
                            {TIME_OPTIONS.map((time) => (
                              <option key={`new-open-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <span className="text-[11px] font-bold text-[#5A2EA6]/60 shrink-0">to</span>
                          <select
                            value={close}
                            onChange={(e) => {
                              setNewBranch({
                                ...newBranch,
                                workingHours: `${open} - ${e.target.value}`,
                              });
                            }}
                            className="flex-1 h-11 px-2.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                            title="Closing Time"
                          >
                            {!TIME_OPTIONS.includes(close) && (
                              <option value={close}>{close}</option>
                            )}
                            {TIME_OPTIONS.map((time) => (
                              <option key={`new-close-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    {isFranchisePortal ? 'Proposed Street Address *' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    required={isFranchisePortal}
                    placeholder="e.g. Lane 5, Main Commercial Complex"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* Branch Manager Section (Dropdown from Employees + Add Branch Manager button + Inline Form) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span>Branch Manager</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddBMOpen(!isAddBMOpen)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border shadow-2xs',
                        isAddBMOpen
                          ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                          : 'bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] border-[#5A2EA6]/25'
                      )}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isAddBMOpen ? 'Close Add Form' : 'Add Branch Manager'}</span>
                    </button>
                  </div>

                  <select
                    value={selectedEmployeeId}
                    onChange={(e) => {
                      const empId = e.target.value;
                      setSelectedEmployeeId(empId);
                      const found = employeesList.find((em) => em.id === empId);
                      if (found) {
                        setNewBranch({
                          ...newBranch,
                          manager: found.fullName,
                          managerEmail: found.email,
                          contactNumber: found.mobilePhone || found.mobile || newBranch.contactNumber,
                          primaryManagerEmployeeId: found.id,
                        });
                      } else {
                        setNewBranch({
                          ...newBranch,
                          manager: '',
                          managerEmail: '',
                          primaryManagerEmployeeId: '',
                        });
                      }
                    }}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="">-- Select Manager from Existing Employees (Optional) --</option>
                    {employeesList.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.role} {emp.branch ? `· ${emp.branch}` : ''} · {emp.email})
                      </option>
                    ))}
                  </select>

                  {selectedEmployeeId && !isAddBMOpen && (
                    <div className="p-3.5 bg-gradient-to-r from-[#FAF7FF] to-white rounded-xl border border-purple-200/80 flex items-center justify-between text-xs animate-in fade-in duration-150 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#5A2EA6] text-white font-bold text-xs grid place-items-center shadow-xs">
                          {newBranch.manager
                            ? newBranch.manager.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                            : 'BM'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-ink font-bold block">{newBranch.manager}</strong>
                            <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] border border-purple-200">
                              Role: Branch Manager
                            </span>
                          </div>
                          <span className="text-[11px] text-muted">
                            {newBranch.managerEmail} {newBranch.contactNumber ? `· ${newBranch.contactNumber}` : ''} · Primary Branch Authority
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Assigned Manager</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmployeeId('');
                            setNewBranch((prev) => ({ ...prev, manager: '', managerEmail: '', primaryManagerEmployeeId: '' }));
                          }}
                          className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors border-0 bg-transparent cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Add Branch Manager Form on the Same Modal */}
                  {isAddBMOpen && (
                    <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/25 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#5A2EA6] text-white grid place-items-center">
                            <UserPlus className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-ink text-xs">Add New Employee as Branch Manager</h4>
                            <span className="text-[10.5px] text-muted">Directly register staff member and provision role: BRANCH_MANAGER</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddBMOpen(false)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Vikram"
                            value={newBMForm.firstName}
                            onChange={(e) => setNewBMForm({ ...newBMForm, firstName: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Saxena"
                            value={newBMForm.lastName}
                            onChange={(e) => setNewBMForm({ ...newBMForm, lastName: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Email Address (Login ID) *
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. vikram.saxena@atelier.in"
                            value={newBMForm.email}
                            onChange={(e) => setNewBMForm({ ...newBMForm, email: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98260 00000"
                            value={newBMForm.mobile}
                            onChange={(e) => setNewBMForm({ ...newBMForm, mobile: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Portal Login Password *
                          </label>
                          <input
                            type="text"
                            placeholder="Password@123"
                            value={newBMForm.password}
                            onChange={(e) => setNewBMForm({ ...newBMForm, password: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                          <span className="text-[9.5px] text-muted mt-0.5 block">
                            Initial password for manager portal access
                          </span>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            Assigned Role &amp; Access Scope
                          </label>
                          <div className="h-9 px-3 rounded-xl border border-purple-200 bg-purple-50/70 flex items-center justify-between text-xs font-bold text-[#5A2EA6]">
                            <span>Branch Manager</span>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#5A2EA6] text-white">
                              Role: BRANCH_MANAGER
                            </span>
                          </div>
                          <span className="text-[9.5px] text-muted mt-0.5 block">
                            Automatic RBAC scoping to this branch location
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-purple-100">
                        <button
                          type="button"
                          onClick={() => setIsAddBMOpen(false)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <Button
                          type="button"
                          disabled={isCreatingBM}
                          onClick={handleCreateBM}
                          className="h-8 px-3.5 rounded-lg text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{isCreatingBM ? 'Saving Manager...' : 'Save & Assign Manager'}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isFranchisePortal && isQuotaReached}
                    className={cn(
                      'h-10 px-6 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
                      isFranchisePortal && isQuotaReached
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300 shadow-none'
                        : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md',
                    )}
                  >
                    {isFranchisePortal ? (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm &amp; Submit Request</span>
                      </>
                    ) : (
                      <span>Confirm &amp; Register Branch</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Edit Branch Modal */}
      {editBranch &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    {isFranchisePortal ? 'Edit Franchise Outlet Details' : 'Edit Branch Details'}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    {isFranchisePortal
                      ? 'Update operational parameters and manager assignment for franchise outlet '
                      : 'Update operational parameters and manager assignment for '}
                    <strong className="text-ink font-mono">
                      {editBranch.name} ({editBranch.code})
                    </strong>
                  </p>
                </div>
                <button
                  onClick={() => setEditBranch(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSaveEdit}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                {isFranchisePortal ? (
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 leading-relaxed font-medium flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
                    <div>
                      <strong>Franchise Outlet Details:</strong> Updates to operational parameters,
                      hours, and branch leadership are synced directly with the central brand registry.
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                    Update branch parameters, physical address, operating hours, franchise affiliation, and
                    branch management assignments.
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    {isFranchisePortal ? 'Outlet / Branch Name *' : 'Branch Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      isFranchisePortal
                        ? 'e.g. Atelier Habibganj Express Outlet'
                        : 'e.g. Atelier Indrapuri Flagship'
                    }
                    value={editBranch.name}
                    onChange={(e) => setEditBranch({ ...editBranch, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      {isFranchisePortal ? 'Outlet Code *' : 'Branch Code *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isFranchisePortal ? 'e.g. ATL-BHOP-05' : 'e.g. ATL-IND-03'}
                      value={editBranch.code}
                      onChange={(e) => setEditBranch({ ...editBranch, code: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Location Type
                    </label>
                    <select
                      value={editBranch.type}
                      onChange={(e) => {
                        const val = e.target.value as BranchRecord['type'];
                        const isFr = val === 'Franchise';
                        setIsEditFranchiseToggleOn(isFr);
                        setEditBranch({
                          ...editBranch,
                          type: val,
                          isFranchiseOwned: isFr,
                          franchisePartnerId: isFr ? editBranch.franchisePartnerId : '',
                          franchisePartnerName: isFr ? editBranch.franchisePartnerName : '',
                        });
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Flagship">Flagship Salon</option>
                      <option value="Lounge">Luxury Lounge</option>
                      <option value="Express">Express Studio</option>
                      <option value="Franchise">Franchise Unit (FOFO / FOCO)</option>
                    </select>
                  </div>
                </div>

                {/* Franchise Partner Assignment Card */}
                {isFranchisePortal ? (
                  <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        <span>Franchise Partner Assignment</span>
                      </label>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        License Verified
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-ink font-bold block">
                          {editBranch.franchisePartnerName || 'Vikramaditya S. — Master Franchise Partner'}
                        </strong>
                        <span className="text-[10.5px] text-muted">
                          Bhopal Region Network · Master Agreement #FRN-BHP-2026
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-lg bg-purple-100 text-[#5A2EA6]">
                        Partner Portal Sync
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                          <span>Assign Franchise Partner</span>
                        </label>
                        <p className="text-[11px] text-muted mt-0.5">
                          {isEditFranchiseToggleOn
                            ? 'Branch is operated under an external licensed franchise partner.'
                            : 'Branch is 100% company-owned and centrally operated.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            'text-[11px] font-bold transition-colors',
                            isEditFranchiseToggleOn ? 'text-slate-400 font-medium' : 'text-[#5A2EA6]',
                          )}
                        >
                          Company Owned
                        </span>

                        {/* Toggle Switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isEditFranchiseToggleOn}
                          onClick={() => {
                            const next = !isEditFranchiseToggleOn;
                            setIsEditFranchiseToggleOn(next);
                            if (!next) {
                              setEditBranch((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    franchisePartnerId: '',
                                    franchisePartnerName: '',
                                    isFranchiseOwned: false,
                                    type: prev.type === 'Franchise' ? 'Flagship' : prev.type,
                                  }
                                  : null,
                              );
                            } else {
                              setEditBranch((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    isFranchiseOwned: true,
                                    type: 'Franchise',
                                  }
                                  : null,
                              );
                            }
                          }}
                          className={cn(
                            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                            isEditFranchiseToggleOn ? 'bg-[#5A2EA6]' : 'bg-slate-300',
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
                              isEditFranchiseToggleOn ? 'translate-x-5' : 'translate-x-0',
                            )}
                          />
                        </button>

                        <span
                          className={cn(
                            'text-[11px] font-bold transition-colors',
                            isEditFranchiseToggleOn ? 'text-[#5A2EA6]' : 'text-slate-400 font-medium',
                          )}
                        >
                          Franchise Partner
                        </span>
                      </div>
                    </div>

                    {/* If Toggle is OFF -> Direct Company-Owned (COCO) */}
                    {!isEditFranchiseToggleOn ? (
                      <div className="p-3 bg-white rounded-xl border border-purple-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#5A2EA6] flex items-center justify-center font-bold">
                            <Store className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <strong className="text-ink font-bold block text-xs">Company Owned (COCO)</strong>
                            <span className="text-[10.5px] text-muted">
                              Direct brand ownership · Centralized inventory &amp; POS billing
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#5A2EA6] border border-purple-100">
                          Company Owned Branch
                        </span>
                      </div>
                    ) : (
                      /* If Toggle is ON -> Dropdown to select franchise partner */
                      <div className="space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-[10.5px] font-bold text-soft uppercase tracking-wider block">
                              Select Franchise Partner *
                            </label>
                            {isLoadingPartners ? (
                              <span className="text-[10px] text-purple-600 animate-pulse font-medium">
                                Fetching partners...
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {franchisePartners.length} Partners Available
                              </span>
                            )}
                          </div>
                          <select
                            required={isEditFranchiseToggleOn}
                            value={editBranch.franchisePartnerId || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const selectedP = franchisePartners.find((p) => p.id === val);
                              setEditBranch({
                                ...editBranch,
                                franchisePartnerId: val || undefined,
                                franchisePartnerName: selectedP ? selectedP.name : undefined,
                                isFranchiseOwned: Boolean(val),
                                type: val ? 'Franchise' : editBranch.type,
                              });
                            }}
                            className="w-full h-11 px-4 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          >
                            <option value="">-- Choose Licensed Franchise Partner --</option>
                            {franchisePartners.map((fp) => (
                              <option key={fp.id} value={fp.id}>
                                {fp.name} ({fp.code}) — {fp.region}
                              </option>
                            ))}
                          </select>
                        </div>

                        {editBranch.franchisePartnerId && (() => {
                          const selected = franchisePartners.find((p) => p.id === editBranch.franchisePartnerId);
                          if (!selected) return null;
                          return (
                            <div className="p-3.5 bg-white rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-in fade-in duration-150 shadow-xs">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                                  <strong className="text-ink font-bold text-xs">{selected.name}</strong>
                                </div>
                                <div className="text-[10.5px] text-muted flex flex-wrap items-center gap-2">
                                  <span>Partner Code: <strong className="font-mono text-ink">{selected.code}</strong></span>
                                  <span>•</span>
                                  <span>Territory: <strong className="text-ink">{selected.region}</strong></span>
                                  {selected.contactPerson && (
                                    <>
                                      <span>•</span>
                                      <span>Representative: <strong className="text-ink">{selected.contactPerson}</strong></span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <span className="self-start sm:self-auto text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                                Assigned Franchise Partner
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      City / Region *
                    </label>
                    <select
                      value={editBranch.city}
                      onChange={(e) => setEditBranch({ ...editBranch, city: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Bhopal">Bhopal, MP</option>
                      <option value="Indore">Indore, MP</option>
                      <option value="Pune">Pune, MH</option>
                      <option value="Bengaluru">Bengaluru, KA</option>
                      <option value="Jaipur">Jaipur, RJ</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Working Hours</span>
                      </label>
                      <span className="text-[10px] font-bold font-mono text-[#5A2EA6] bg-[#5A2EA6]/10 px-2 py-0.5 rounded-full border border-[#5A2EA6]/20">
                        {editBranch.workingHours || '09:00 AM - 09:00 PM'}
                      </span>
                    </div>
                    {(() => {
                      const { open, close } = parseWorkingHours(editBranch.workingHours);
                      return (
                        <div className="flex items-center gap-1.5">
                          <select
                            value={open}
                            onChange={(e) => {
                              setEditBranch({
                                ...editBranch,
                                workingHours: `${e.target.value} - ${close}`,
                              });
                            }}
                            className="flex-1 h-11 px-2.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                            title="Opening Time"
                          >
                            {!TIME_OPTIONS.includes(open) && (
                              <option value={open}>{open}</option>
                            )}
                            {TIME_OPTIONS.map((time) => (
                              <option key={`edit-open-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          <span className="text-[11px] font-bold text-[#5A2EA6]/60 shrink-0">to</span>
                          <select
                            value={close}
                            onChange={(e) => {
                              setEditBranch({
                                ...editBranch,
                                workingHours: `${open} - ${e.target.value}`,
                              });
                            }}
                            className="flex-1 h-11 px-2.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                            title="Closing Time"
                          >
                            {!TIME_OPTIONS.includes(close) && (
                              <option value={close}>{close}</option>
                            )}
                            {TIME_OPTIONS.map((time) => (
                              <option key={`edit-close-${time}`} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    {isFranchisePortal ? 'Proposed Street Address *' : 'Street Address'}
                  </label>
                  <input
                    type="text"
                    required={isFranchisePortal}
                    placeholder="e.g. Lane 5, Main Commercial Complex"
                    value={editBranch.address}
                    onChange={(e) => setEditBranch({ ...editBranch, address: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* Branch Manager Section (Dropdown from Employees + Add Branch Manager button + Inline Form) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span>Branch Manager</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsEditAddBMOpen(!isEditAddBMOpen)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border shadow-2xs',
                        isEditAddBMOpen
                          ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                          : 'bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] border-[#5A2EA6]/25',
                      )}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isEditAddBMOpen ? 'Close Add Form' : 'Add Branch Manager'}</span>
                    </button>
                  </div>

                  <select
                    value={editSelectedEmployeeId}
                    onChange={(e) => {
                      const empId = e.target.value;
                      setEditSelectedEmployeeId(empId);
                      const found = employeesList.find((em) => em.id === empId);
                      if (found) {
                        setEditBranch({
                          ...editBranch,
                          primaryManagerEmployeeId: found.id,
                          manager: found.fullName,
                          managerEmail: found.email,
                          contactNumber: found.mobilePhone || found.mobile || editBranch.contactNumber,
                        });
                      } else {
                        setEditBranch({
                          ...editBranch,
                          primaryManagerEmployeeId: undefined,
                          manager: '',
                          managerEmail: '',
                        });
                      }
                    }}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="">-- Select Manager from Employees (Optional) --</option>
                    {employeesList.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.role} {emp.branch ? `· ${emp.branch}` : ''} · {emp.email})
                      </option>
                    ))}
                  </select>

                  {(editSelectedEmployeeId || (editBranch.manager && editBranch.manager !== 'Unassigned')) && !isEditAddBMOpen && (
                    <div className="p-3 bg-[#FAF7FF] rounded-xl border border-purple-100 flex items-center justify-between text-xs animate-in fade-in duration-150">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#5A2EA6] text-white font-bold text-xs grid place-items-center">
                          {editBranch.manager
                            ? editBranch.manager
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                            : 'BM'}
                        </div>
                        <div>
                          <strong className="text-ink font-bold block">{editBranch.manager}</strong>
                          <span className="text-[11px] text-muted">
                            {employeesList.find((e) => e.id === editSelectedEmployeeId)?.role || 'Branch Manager'} ·{' '}
                            {editBranch.managerEmail || editBranch.contactNumber}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        Assigned Manager
                      </span>
                    </div>
                  )}

                  {/* Inline Add Branch Manager Form on the Same Modal */}
                  {isEditAddBMOpen && (
                    <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/25 shadow-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#5A2EA6] text-white grid place-items-center">
                            <UserPlus className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-ink text-xs">Add New Employee as Branch Manager</h4>
                            <span className="text-[10.5px] text-muted">
                              Directly register employee and set as manager for this branch
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditAddBMOpen(false)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors cursor-pointer border-0 bg-transparent"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Vikram"
                            value={editBMForm.firstName}
                            onChange={(e) => setEditBMForm({ ...editBMForm, firstName: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Saxena"
                            value={editBMForm.lastName}
                            onChange={(e) => setEditBMForm({ ...editBMForm, lastName: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. vikram.saxena@atelier.in"
                            value={editBMForm.email}
                            onChange={(e) => setEditBMForm({ ...editBMForm, email: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98260 00000"
                            value={editBMForm.mobile}
                            onChange={(e) => setEditBMForm({ ...editBMForm, mobile: e.target.value })}
                            className="w-full h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            Assigned Role
                          </label>
                          <input
                            type="text"
                            disabled
                            value="Branch Manager"
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-1">
                            Employment Type
                          </label>
                          <input
                            type="text"
                            disabled
                            value="Full Time"
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-purple-100">
                        <button
                          type="button"
                          onClick={() => setIsEditAddBMOpen(false)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <Button
                          type="button"
                          onClick={handleCreateEditBM}
                          className="h-8 px-3.5 rounded-lg text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-xs transition-all flex items-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Save &amp; Assign Manager</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setEditBranch(null)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Deactivate Confirmation Modal */}
      {deactivateConfirmBranch &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    {deactivateConfirmBranch.status === 'Active'
                      ? 'Deactivate Branch?'
                      : 'Activate Branch?'}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {deactivateConfirmBranch.name} ({deactivateConfirmBranch.code})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {deactivateConfirmBranch.status === 'Active'
                  ? 'Deactivating this branch will temporarily prevent new online bookings and hide the branch from client apps. Existing historical records and billing data will remain intact.'
                  : 'Activating this branch will reopen booking slots in the central diary and enable staff roster punch-ins.'}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeactivateConfirmBranch(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleToggleStatus(deactivateConfirmBranch)}
                  className={cn(
                    'h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all',
                    deactivateConfirmBranch.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white',
                  )}
                >
                  Confirm{' '}
                  {deactivateConfirmBranch.status === 'Active' ? 'Deactivation' : 'Activation'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 5. Assign Branch Manager Modal */}
      {assigningBranch &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5A2EA6] flex items-center justify-center font-bold shrink-0">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      Assign Branch Manager
                    </h3>
                    <p className="text-[11.5px] text-muted mt-0.5">
                      {assigningBranch.name} · <span className="font-mono">{assigningBranch.code}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAssigningBranch(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs">
                {/* Mode Selector */}
                <div className="flex p-1 bg-slate-100/80 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsAssignNewStaffOpen(false)}
                    className={cn(
                      'flex-1 py-2 rounded-lg font-bold text-xs transition-all border-0 cursor-pointer',
                      !isAssignNewStaffOpen
                        ? 'bg-white text-[#5A2EA6] shadow-xs'
                        : 'bg-transparent text-muted hover:text-ink',
                    )}
                  >
                    Select Existing Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAssignNewStaffOpen(true)}
                    className={cn(
                      'flex-1 py-2 rounded-lg font-bold text-xs transition-all border-0 cursor-pointer',
                      isAssignNewStaffOpen
                        ? 'bg-white text-[#5A2EA6] shadow-xs'
                        : 'bg-transparent text-muted hover:text-ink',
                    )}
                  >
                    + Create New Manager
                  </button>
                </div>

                {!isAssignNewStaffOpen ? (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Select Staff Member *
                      </label>
                      <select
                        value={assignStaffId}
                        onChange={(e) => setAssignStaffId(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      >
                        <option value="">-- Choose Staff Member to Assign --</option>
                        {employeesList.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.fullName} ({emp.role || 'Staff'} {emp.branch ? `· ${emp.branch}` : ''}) · {emp.email}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Staff Member Preview */}
                    {(() => {
                      const selected = employeesList.find((e) => e.id === assignStaffId);
                      if (!selected) return null;
                      return (
                        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100/80 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5A2EA6] to-[#8B6FD8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              {selected.avatarInitials || selected.fullName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-ink text-xs">{selected.fullName}</span>
                                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                                  {selected.role || 'Staff'}
                                </span>
                              </div>
                              <div className="text-[11px] text-muted mt-0.5">
                                {selected.email} {selected.mobile ? `· ${selected.mobile}` : ''}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                            Ready to Assign
                          </span>
                        </div>
                      );
                    })()}

                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11.5px] text-purple-900 leading-relaxed font-medium">
                      Assigning this staff member will update their role to <strong>Branch Manager</strong>, link this branch as their primary operational branch, and update this branch&apos;s manager in the organization network.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikram"
                          value={quickStaffForm.firstName}
                          onChange={(e) =>
                            setQuickStaffForm({ ...quickStaffForm, firstName: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sharma"
                          value={quickStaffForm.lastName}
                          onChange={(e) =>
                            setQuickStaffForm({ ...quickStaffForm, lastName: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Email Address * (Login ID)
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. vikram.sharma@salon.com"
                          value={quickStaffForm.email}
                          onChange={(e) =>
                            setQuickStaffForm({ ...quickStaffForm, email: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Mobile Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98260 00000"
                          value={quickStaffForm.mobile}
                          onChange={(e) =>
                            setQuickStaffForm({ ...quickStaffForm, mobile: e.target.value })
                          }
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Initial Login Password
                      </label>
                      <input
                        type="password"
                        placeholder="Password@123"
                        value={quickStaffForm.password}
                        onChange={(e) =>
                          setQuickStaffForm({ ...quickStaffForm, password: e.target.value })
                        }
                        className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                      <p className="text-[10.5px] text-muted mt-1">
                        Staff member can use this to log into the Branch Manager Portal with their Email ID.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-[11.5px] text-purple-900 leading-relaxed font-medium">
                      A new employee record will be created with the <strong>Branch Manager</strong> role. Login credentials will be provisioned immediately for <strong>{quickStaffForm.email || 'this email'}</strong>.
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setAssigningBranch(null)}
                    disabled={isSavingAssign}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="button"
                    onClick={handleSaveAssignManager}
                    disabled={isSavingAssign || (!isAssignNewStaffOpen && !assignStaffId)}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all flex items-center gap-1.5"
                  >
                    {isSavingAssign ? (
                      <span>Saving Assignment...</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Assign Branch Manager</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
