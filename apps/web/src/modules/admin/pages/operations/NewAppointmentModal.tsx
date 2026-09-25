import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Armchair,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  CreditCard,
  DollarSign,
  Filter,
  Home,
  Layers,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Truck,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router';
import {
  type ApiBranchResource,
  type ApiCustomerSummary,
  type ApiServiceCategory,
  type ApiServiceMaster,
  type ApiAppointmentSummary,
  type ApiTimeSlot,
  appointmentsApi,
  catalogueApi,
  customersApi,
  staffApi,
  type FullStaffRecord,
} from '@/shared/api';
import { tokenStorage } from '@/shared/api/client';
import { useAdminContext, type AdminBranch } from '../../context/AdminContext';
import { useBranch } from '../../../branchManager/context/BranchContext';
import { masterServices as masterServicesSeeds } from '../catalogue/ServicesTab';
import type { FullAppointmentRecord } from './AppointmentDetailsDrawer';

export interface ServiceItem {
  id?: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  availableBranches?: string[];
  requiredRoomOrChair?: string | null;
  requiredEquipment?: string | null;
  isCustom?: boolean;
}

const isUuid = (str?: string | null): boolean =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

const DEFAULT_CATALOGUE_SERVICES: ServiceItem[] = (masterServicesSeeds || []).map((s, idx) => ({
  id: isUuid(s.id) ? s.id : `a1000000-0000-4000-a000-${(idx + 1).toString(16).padStart(12, '0')}`,
  name: s.name,
  category: s.category || 'Hair Dressing & Styling',
  duration: s.duration || 45,
  price: s.price || 1500,
  availableBranches: s.availableBranches,
  requiredRoomOrChair: s.requiredRoomOrChair,
  requiredEquipment: s.requiredEquipment,
}));

export interface StaffAssignment {
  serviceName: string;
  staffId: string;
  staffName: string;
  role: string;
  avatarInitials: string;
}

export interface ResourceAllocationItem {
  serviceName: string;
  room: string;
  chair: string;
  equipment: string;
}

export interface NewAppointmentData {
  id: string;
  clientName: string;
  clientMobile: string;
  clientEmail: string;
  isNewClient: boolean;
  customerId?: string;
  customerCode?: string;
  serviceMode: 'In-Salon' | 'Home Service';
  homeAddress?: {
    streetAddress: string;
    apartmentVilla: string;
    landmark: string;
    city: string;
    pincode: string;
    gateEntryNotes: string;
  };
  travelSurcharge: number;
  portableKitId?: string;
  travelBufferWindow?: string;
  branch: string;
  branchId?: string;
  services: ServiceItem[];
  staffId: string;
  staffName: string;
  staffAssignments?: StaffAssignment[];
  resourceAllocations?: ResourceAllocationItem[];
  date: string;
  time: string;
  durationMinutes: number;
  room: string;
  chair: string;
  equipment: string;
  totalDuration: number;
  totalAmount: number;
  estimatedAmount: number;
  depositRequired: boolean;
  depositAmount: number;
  paymentStatus: 'Paid' | 'Pending Deposit' | 'Pay at Salon';
  bookingSource:
    | 'Online'
    | 'Phone'
    | 'Walk-in'
    | 'WhatsApp'
    | 'Website'
    | 'Call Centre'
    | 'Marketplace'
    | 'Home Service Concierge';
  notes: string;
}

export interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: NewAppointmentData) => void;
  initialClient?: {
    name?: string;
    mobile?: string;
    email?: string;
    branch?: string;
  };
  existingAppointments?: FullAppointmentRecord[];
  branchId?: string;
  branchName?: string;
  lockBranch?: boolean;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  initialClient,
  existingAppointments = [],
  branchId,
  branchName,
  lockBranch = false,
}: NewAppointmentModalProps) {
  const { toast } = useToast();
  const location = useLocation();
  const branchContext = useBranch();
  const assignedBranch = branchContext?.assignedBranch;
  const availableBranches = branchContext?.availableBranches || [];
  const { salon } = useAdminContext();
  const branchesList: AdminBranch[] =
    salon?.branches && salon.branches.length > 0
      ? salon.branches
      : availableBranches.length > 0
        ? (availableBranches as AdminBranch[])
        : [];

  // Determine if branch is locked (Branch Manager mode)
  const isBranchLocked = Boolean(
    lockBranch ||
      branchId ||
      assignedBranch?.id ||
      (typeof location !== 'undefined' && location.pathname?.startsWith('/branch-manager')),
  );

  // Stepper keys & step sequence
  type ModalStepKey =
    | 'client'
    | 'branch'
    | 'services'
    | 'specialists'
    | 'schedule'
    | 'allocations'
    | 'billing'
    | 'review';

  const ACTIVE_STEPS: ModalStepKey[] = useMemo(() => {
    if (isBranchLocked) {
      return ['client', 'services', 'specialists', 'schedule', 'allocations', 'billing', 'review'];
    }
    return ['client', 'branch', 'services', 'specialists', 'schedule', 'allocations', 'billing', 'review'];
  }, [isBranchLocked]);

  const totalSteps = ACTIVE_STEPS.length;

  // Stepper state (1 to totalSteps)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const currentStepKey: ModalStepKey = ACTIVE_STEPS[currentStep - 1] || 'client';

  // Delivery Mode
  const [serviceMode, setServiceMode] = useState<'In-Salon' | 'Home Service'>('In-Salon');

  // -------------------------------------------------------------
  // STEP 1: CLIENT SELECTION & CREATION
  // -------------------------------------------------------------
  const [isNewClient, setIsNewClient] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<ApiCustomerSummary | null>(null);

  // Existing customer search
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [customerSearchResults, setCustomerSearchResults] = useState<ApiCustomerSummary[]>([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);

  // Selected client form fields
  const [clientName, setClientName] = useState(initialClient?.name || '');
  const [clientMobile, setClientMobile] = useState(initialClient?.mobile || '');
  const [clientEmail, setClientEmail] = useState(initialClient?.email || '');
  const [customerId, setCustomerId] = useState<string>('');
  const [customerCode, setCustomerCode] = useState<string>('');

  // New Client quick fields (persisted to customer_db)
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newMobilePhone, setNewMobilePhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newClientBranchId, setNewClientBranchId] = useState<string>('');
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  // Home Service Address State
  const [streetAddress, setStreetAddress] = useState('');
  const [apartmentVilla, setApartmentVilla] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [gateEntryNotes, setGateEntryNotes] = useState('');
  const [travelSurcharge, setTravelSurcharge] = useState(350);
  const [portableKitId, setPortableKitId] = useState(
    'Portable Sanitized Hydra/Spa Kit #HK-04 (UV Sterilized)',
  );
  const [travelBufferWindow, setTravelBufferWindow] = useState('30 mins pre-dispatch travel buffer');

  // -------------------------------------------------------------
  // STEP 2: BRANCH HUB
  // -------------------------------------------------------------
  const effectiveInitialBranchId = useMemo(() => {
    return (
      branchId ||
      assignedBranch?.id ||
      tokenStorage.getBranchId() ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('digiflex_branch_id') : '') ||
      (branchesList[0]?.id || '')
    );
  }, [branchId, assignedBranch?.id, branchesList]);

  const effectiveInitialBranchName = useMemo(() => {
    if (branchName && branchName !== 'All') return branchName;
    if (assignedBranch?.name) return assignedBranch.name;
    const match = branchesList.find((b) => b.id === effectiveInitialBranchId);
    return match?.name || branchesList[0]?.name || 'Assigned Branch';
  }, [branchName, assignedBranch?.name, branchesList, effectiveInitialBranchId]);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(effectiveInitialBranchId);
  const [selectedBranchName, setSelectedBranchName] = useState<string>(effectiveInitialBranchName);

  // Resolve active branch
  const selectedBranchObj = useMemo(() => {
    return (
      branchesList.find((b) => b.id === selectedBranchId) ||
      branchesList.find((b) => b.name?.toLowerCase() === selectedBranchName?.toLowerCase()) ||
      (assignedBranch
        ? {
            id: assignedBranch.id,
            name: assignedBranch.name,
            code: assignedBranch.code,
            city: assignedBranch.city,
            workingHours: assignedBranch.workingHours,
            status: assignedBranch.status,
            address: assignedBranch.address || `${assignedBranch.city}, ${assignedBranch.state || ''}`,
          }
        : null) ||
      branchesList[0] ||
      null
    );
  }, [branchesList, selectedBranchId, selectedBranchName, assignedBranch]);

  // Sync initial branch on open
  useEffect(() => {
    if (isOpen) {
      if (effectiveInitialBranchId) {
        setSelectedBranchId(effectiveInitialBranchId);
        setNewClientBranchId(effectiveInitialBranchId);
      }
      if (effectiveInitialBranchName) {
        setSelectedBranchName(effectiveInitialBranchName);
      }
    }
  }, [isOpen, effectiveInitialBranchId, effectiveInitialBranchName]);

  // Handle branch select
  const handleSelectBranch = (b: AdminBranch) => {
    setSelectedBranchId(b.id);
    setSelectedBranchName(b.name);
    setNewClientBranchId(b.id);
  };

  // -------------------------------------------------------------
  // STEP 3: DYNAMIC SERVICES FROM COMMERCE_DB
  // -------------------------------------------------------------
  const [masterServices, setMasterServices] = useState<ServiceItem[]>(DEFAULT_CATALOGUE_SERVICES);
  const [categoriesList, setCategoriesList] = useState<ApiServiceCategory[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('All');
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>('');

  // Custom Ad-Hoc Service state
  const [isCustomServiceOpen, setIsCustomServiceOpen] = useState(false);
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServiceCategory, setCustomServiceCategory] = useState('General Treatment');
  const [customServiceDuration, setCustomServiceDuration] = useState('45');
  const [customServicePrice, setCustomServicePrice] = useState('1500');

  // Fetch services and categories from commerce_db
  const loadServicesAndCategories = useCallback(async () => {
    setIsLoadingServices(true);
    try {
      const bParam = selectedBranchId || effectiveInitialBranchId;
      const [servicesData, catsData] = await Promise.all([
        catalogueApi
          .fetchServices(bParam ? { branchId: bParam } : undefined)
          .catch(() => [] as ApiServiceMaster[]),
        catalogueApi.fetchCategories().catch(() => [] as ApiServiceCategory[]),
      ]);

      const catMap = new Map<string, string>();
      catsData.forEach((c) => catMap.set(c.id, c.name));
      if (catsData.length > 0) {
        setCategoriesList(catsData);
      }

      let mapped: ServiceItem[] = [];
      if (servicesData && servicesData.length > 0) {
        mapped = servicesData.map((s) => {
          const catName = catMap.get(s.categoryId) || 'General Treatment';
          const bpObj = s.branchPrices?.find(
            (bp) => bp.branchId === bParam && bp.isActive !== false,
          );
          const finalPrice = bpObj ? Number(bpObj.price) : (Number(s.basePrice) || 0);

          return {
            id: s.id,
            name: s.name,
            category: catName,
            duration: s.durationMinutes || 45,
            price: finalPrice,
            availableBranches: s.availableBranches,
            requiredRoomOrChair: s.requiredRoomOrChair,
            requiredEquipment: s.requiredEquipment,
          };
        });
      }

      const finalServices = mapped.length > 0 ? mapped : DEFAULT_CATALOGUE_SERVICES;
      setMasterServices(finalServices);
    } catch (err) {
      console.error('Failed to load services from commerce_db:', err);
      setMasterServices((prev) => (prev.length > 0 ? prev : DEFAULT_CATALOGUE_SERVICES));
    } finally {
      setIsLoadingServices(false);
    }
  }, [selectedBranchId, effectiveInitialBranchId]);

  useEffect(() => {
    if (isOpen) {
      loadServicesAndCategories();
    }
  }, [isOpen, loadServicesAndCategories]);

  // Filter services by selected branch & category & search
  const branchFilteredServices = useMemo(() => {
    const sourceServices = masterServices.length > 0 ? masterServices : DEFAULT_CATALOGUE_SERVICES;

    const bId = (selectedBranchId || effectiveInitialBranchId || '').toLowerCase().trim();
    const bName = (selectedBranchName || effectiveInitialBranchName || '').toLowerCase().trim();
    const objName = (selectedBranchObj?.name || '').toLowerCase().trim();

    const filtered = sourceServices.filter((srv) => {
      // If service does not specify branch restrictions, it is available across all branches
      if (!srv.availableBranches || srv.availableBranches.length === 0) {
        return true;
      }
      if (!bId && !bName) {
        return true;
      }

      return srv.availableBranches.some((ab) => {
        const branchToken = (typeof ab === 'string' ? ab : String(ab)).toLowerCase().trim();
        return (
          branchToken === bId ||
          branchToken === bName ||
          (objName && branchToken === objName) ||
          (bName && (branchToken.includes(bName) || bName.includes(branchToken))) ||
          (objName && (branchToken.includes(objName) || objName.includes(branchToken)))
        );
      });
    });

    // If services specifically matched this branch, return them.
    // If no services matched (e.g. initial seeded catalogue without branch tagging),
    // provide the full list so booking flow is never blocked
    return filtered.length > 0 ? filtered : sourceServices;
  }, [masterServices, selectedBranchId, selectedBranchName, selectedBranchObj, effectiveInitialBranchId, effectiveInitialBranchName]);

  // Dynamic categories available from currently loaded services
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    branchFilteredServices.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['All', ...Array.from(cats)];
  }, [branchFilteredServices]);

  const filteredCatalogueServices = useMemo(() => {
    return branchFilteredServices.filter((srv) => {
      const matchesCat = serviceCategoryFilter === 'All' || srv.category === serviceCategoryFilter;
      const q = serviceSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q || srv.name.toLowerCase().includes(q) || srv.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [branchFilteredServices, serviceCategoryFilter, serviceSearchQuery]);

  const handleToggleService = (srv: ServiceItem) => {
    if (selectedServices.some((s) => s.name === srv.name)) {
      setSelectedServices((prev) => prev.filter((s) => s.name !== srv.name));
    } else {
      setSelectedServices((prev) => [...prev, srv]);
    }
  };

  const handleRemoveService = (name: string) => {
    setSelectedServices((prev) => prev.filter((s) => s.name !== name));
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customServiceName.trim()) return;

    const newSrv: ServiceItem = {
      name: customServiceName.trim(),
      category: customServiceCategory,
      duration: Number.parseInt(customServiceDuration, 10) || 45,
      price: Number.parseInt(customServicePrice, 10) || 1000,
      isCustom: true,
    };

    setMasterServices((prev) => [newSrv, ...prev]);
    setSelectedServices((prev) => [...prev, newSrv]);
    setCustomServiceName('');
    setIsCustomServiceOpen(false);
    toast(`Custom service "${newSrv.name}" added to basket!`);
  };

  // -------------------------------------------------------------
  // STEP 4: DYNAMIC SPECIALISTS FROM PEOPLE_DB
  // -------------------------------------------------------------
  // Fallback stylists so the specialist tab is never blank even if the network lags
  const DEFAULT_STYLISTS: FullStaffRecord[] = useMemo(
    () =>
      [
        {
          id: 'e1000000-0000-4000-a000-000000000001',
          firstName: 'Nitin',
          lastName: 'Kumar',
          fullName: 'Nitin Kumar',
          role: 'Stylist / Therapist',
          roleCode: 'STYLIST',
          jobTitle: 'Senior Hair Stylist',
          branch: 'Grow Indore',
          status: 'Active',
          avatarInitials: 'NK',
          joiningDate: '2024-01-15',
          employmentType: 'Full Time',
          reportingManager: 'Vijay Singh',
          mobile: '+91 98765 43210',
          email: 'nitin.kumar@digiflexsalon.com',
          gender: 'Male',
          dob: '1995-06-12',
          address: 'Indore, MP',
          emergencyContact: '+91 98765 00000',
          currentShift: 'Regular',
          level: 'Senior',
          skills: ['Hair Cutting', 'Styling', 'Coloring'],
          assignedServices: ['Haircut', 'Color', 'Blow Dry'],
          metrics: {
            revenueGenerated: 120000,
            servicesCompleted: 45,
            retailSales: 15000,
            rebookingRate: 85,
            utilisation: 90,
            commissionEarned: 12000,
            targetAchievement: 95,
            csatRating: 4.9,
          },
        },
        {
          id: 'e1000000-0000-4000-a000-000000000002',
          firstName: 'Ajay',
          lastName: 'Singh',
          fullName: 'Ajay Singh',
          role: 'Stylist / Therapist',
          roleCode: 'STYLIST',
          jobTitle: 'Master Therapist & Aesthetician',
          branch: 'Grow Indore',
          status: 'Active',
          avatarInitials: 'AS',
          joiningDate: '2024-02-01',
          employmentType: 'Full Time',
          reportingManager: 'Vijay Singh',
          mobile: '+91 98765 43211',
          email: 'ajay.singh@digiflexsalon.com',
          gender: 'Male',
          dob: '1993-08-20',
          address: 'Indore, MP',
          emergencyContact: '+91 98765 00001',
          currentShift: 'Regular',
          level: 'Expert',
          skills: ['Spa Therapy', 'Facial', 'Massage'],
          assignedServices: ['Spa', 'Facial', 'Massage'],
          metrics: {
            revenueGenerated: 140000,
            servicesCompleted: 50,
            retailSales: 18000,
            rebookingRate: 88,
            utilisation: 92,
            commissionEarned: 14000,
            targetAchievement: 98,
            csatRating: 5.0,
          },
        },
      ] as unknown as FullStaffRecord[],
    [],
  );

  const [staffList, setStaffList] = useState<FullStaffRecord[]>(DEFAULT_STYLISTS);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [specialistMode, setSpecialistMode] = useState<'per-service' | 'single-lead'>('per-service');
  const [leadStaffId, setLeadStaffId] = useState<string>('e1000000-0000-4000-a000-000000000001');
  const [serviceStaffMap, setServiceStaffMap] = useState<Record<string, string>>({});

  // Fetch staff from people_db
  const loadStaff = useCallback(async () => {
    setIsLoadingStaff(true);
    try {
      const bParam = selectedBranchId || effectiveInitialBranchId;
      const data = await staffApi.list(bParam ? { branchId: bParam } : undefined);
      if (data && data.length > 0) {
        setStaffList(data);
      }
    } catch (err) {
      console.error('Failed to load staff roster:', err);
    } finally {
      setIsLoadingStaff(false);
    }
  }, [selectedBranchId, effectiveInitialBranchId]);

  useEffect(() => {
    if (isOpen) {
      loadStaff();
    }
  }, [isOpen, loadStaff]);

  // Filter to identify stylist / therapist specialists (excluding branch managers, receptionists, cashiers, admin, etc.)
  const isStylistOrTherapist = (st: FullStaffRecord | any): boolean => {
    if (!st) return false;
    const role = String(st.role || '').toLowerCase().trim();
    const job = String(st.jobTitle || '').toLowerCase().trim();
    const code = String(st.roleCode || '').toLowerCase().trim();
    const designation = String(st.profile?.designation || '').toLowerCase().trim();

    // 1. Explicitly exclude administrative, front-desk, management, operational, or non-service staff
    const excludedKeywords = [
      'branch manager',
      'manager',
      'reception',
      'cashier',
      'accountant',
      'finance',
      'admin',
      'inventory',
      'cleaner',
      'housekeeping',
      'security',
      'driver',
      'call center',
      'telecaller',
      'auditor',
      'franchise owner',
      'supervisor',
    ];

    if (
      excludedKeywords.some(
        (kw) =>
          role.includes(kw) ||
          job.includes(kw) ||
          code.includes(kw) ||
          designation.includes(kw),
      )
    ) {
      return false;
    }

    // 2. Explicitly include stylists, therapists, aestheticians, colorists, masseurs, barbers, nail techs
    const specialistKeywords = [
      'stylist',
      'therapist',
      'aesthetician',
      'esthetician',
      'colorist',
      'barber',
      'hair',
      'spa',
      'masseur',
      'masseuse',
      'nail',
      'makeup',
      'artist',
      'beautician',
    ];

    if (
      specialistKeywords.some(
        (kw) =>
          role.includes(kw) ||
          job.includes(kw) ||
          code.includes(kw) ||
          designation.includes(kw),
      )
    ) {
      return true;
    }

    // 3. If assignedServices has items assigned, they are a service provider
    if (Array.isArray(st.assignedServices) && st.assignedServices.length > 0) {
      return true;
    }

    return false;
  };

  // Filter staff by selected branch and ensure ONLY Stylists / Therapists are shown
  const branchStaff = useMemo(() => {
    if (!staffList.length) return [];

    // Filter staff list to stylists/therapists only
    const specialists = staffList.filter(isStylistOrTherapist);

    const bId = (selectedBranchId || effectiveInitialBranchId || '').toLowerCase().trim();
    const bName = (selectedBranchName || effectiveInitialBranchName || '').toLowerCase().trim();
    const objName = (selectedBranchObj?.name || '').toLowerCase().trim();

    const direct = specialists.filter((st) => {
      const stBranchId = String(st.primaryBranchId || (st as any).branchId || '').toLowerCase().trim();
      const stBranch = String(st.branch || (st as any).branchName || '').toLowerCase().trim();

      const matchesBranchId = Boolean(bId && stBranchId === bId);
      const matchesBranchName = Boolean(
        (bName && (stBranch === bName || stBranch.includes(bName) || bName.includes(stBranch))) ||
          (objName && (stBranch === objName || stBranch.includes(objName) || objName.includes(stBranch))),
      );

      const matchesAssignments = Boolean(
        (st as any).branchAssignments?.some((ba: any) => {
          const assignedId = String(ba.branchId || '').toLowerCase().trim();
          const assignedName = String(ba.branchName || ba.name || '').toLowerCase().trim();
          return (bId && assignedId === bId) || (bName && assignedName === bName);
        }),
      );

      return matchesBranchId || matchesBranchName || matchesAssignments;
    });

    // If specialists found for this branch, show strictly those
    if (direct.length > 0) {
      return direct;
    }

    // In branch-locked mode, if direct matches are found, return them.
    // If none are specifically tagged yet in local dev, allow specialists fallback so booking works
    return specialists;
  }, [staffList, selectedBranchId, selectedBranchName, selectedBranchObj, effectiveInitialBranchId, effectiveInitialBranchName]);

  // Sync leadStaffId and serviceStaffMap when branchStaff or selectedServices change
  useEffect(() => {
    if (branchStaff.length > 0) {
      if (!leadStaffId || !branchStaff.some((st) => st.id === leadStaffId)) {
        setLeadStaffId(branchStaff[0].id);
      }
    }
  }, [branchStaff, leadStaffId]);

  useEffect(() => {
    if (branchStaff.length === 0) return;
    setServiceStaffMap((prev) => {
      const next: Record<string, string> = { ...prev };
      selectedServices.forEach((srv) => {
        if (!next[srv.name] || !branchStaff.some((st) => st.id === next[srv.name])) {
          next[srv.name] = branchStaff[0]?.id || '';
        }
      });
      return next;
    });
  }, [selectedServices, branchStaff]);

  // -------------------------------------------------------------
  // STEP 5: SCHEDULE (DATE & TIME SLOTS)
  // -------------------------------------------------------------
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [timeSlots, setTimeSlots] = useState<string[]>([
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ]);
  const [isCustomTimeMode, setIsCustomTimeMode] = useState(false);
  const [customHour, setCustomHour] = useState('12');
  const [customMinute, setCustomMinute] = useState('15');
  const [customMeridiem, setCustomMeridiem] = useState<'AM' | 'PM'>('PM');

  // Helper to calculate estimated appointment end time
  const calculateEndTime = (startTimeStr: string, durationMinutes: number): string => {
    const match = startTimeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return startTimeStr;
    let hours = Number.parseInt(match[1], 10);
    const minutes = Number.parseInt(match[2], 10);
    const meridiem = (match[3] || 'AM').toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    const totalMins = hours * 60 + minutes + durationMinutes;
    let endHours = Math.floor(totalMins / 60) % 24;
    const endMinutes = totalMins % 60;
    const endMeridiem = endHours >= 12 ? 'PM' : 'AM';
    if (endHours > 12) endHours -= 12;
    if (endHours === 0) endHours = 12;

    return `${endHours < 10 ? '0' : ''}${endHours}:${endMinutes < 10 ? '0' : ''}${endMinutes} ${endMeridiem}`;
  };

  // -------------------------------------------------------------
  // STEP 6: DYNAMIC ALLOCATIONS FROM ORGANIZATION_DB (BRANCH_RESOURCES)
  // -------------------------------------------------------------
  const [branchResources, setBranchResources] = useState<ApiBranchResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [resourceAllocationMode, setResourceAllocationMode] = useState<
    'per-service' | 'single-station'
  >('per-service');

  // Single station selections
  const [singleRoom, setSingleRoom] = useState('');
  const [singleChair, setSingleChair] = useState('');
  const [singleEquipment, setSingleEquipment] = useState('');

  // Per-service allocation map: serviceName -> { room, chair, equipment }
  const [serviceResourceMap, setServiceResourceMap] = useState<
    Record<string, { room: string; chair: string; equipment: string }>
  >({});

  // Fetch branch resources whenever selectedBranchId changes
  const loadBranchResources = useCallback(async (bId: string) => {
    if (!bId) return;
    setIsLoadingResources(true);
    try {
      const data = await catalogueApi.fetchResources(bId);
      setBranchResources(data || []);
    } catch (err) {
      console.error('Failed to load branch resources:', err);
    } finally {
      setIsLoadingResources(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && selectedBranchId) {
      loadBranchResources(selectedBranchId);
    }
  }, [isOpen, selectedBranchId, loadBranchResources]);

  // Partition real resources
  const availableRooms = useMemo(() => {
    const rms = branchResources
      .filter((r) => r.type === 'ROOM' && r.isAvailable !== false)
      .map((r) => r.name);
    return rms.length > 0 ? rms : ['Standard Treatment Room'];
  }, [branchResources]);

  const availableChairs = useMemo(() => {
    const chs = branchResources
      .filter((r) => r.type === 'CHAIR' && r.isAvailable !== false)
      .map((r) => r.name);
    return chs.length > 0 ? chs : ['Standard Styling Station / Bed'];
  }, [branchResources]);

  const availableEquipment = useMemo(() => {
    const eqs = branchResources
      .filter((r) => r.type === 'EQUIPMENT' && r.isAvailable !== false)
      .map((r) => r.name);
    return eqs.length > 0 ? eqs : ['Standard Equipment Kit'];
  }, [branchResources]);

  // Sync single station defaults
  useEffect(() => {
    if (!singleRoom && availableRooms[0]) setSingleRoom(availableRooms[0]);
    if (!singleChair && availableChairs[0]) setSingleChair(availableChairs[0]);
    if (!singleEquipment && availableEquipment[0]) setSingleEquipment(availableEquipment[0]);
  }, [availableRooms, availableChairs, availableEquipment, singleRoom, singleChair, singleEquipment]);

  // Sync per-service resource map
  useEffect(() => {
    setServiceResourceMap((prev) => {
      const next = { ...prev };
      selectedServices.forEach((srv) => {
        if (!next[srv.name]) {
          next[srv.name] = {
            room: srv.requiredRoomOrChair || availableRooms[0] || 'Standard Treatment Room',
            chair: availableChairs[0] || 'Standard Styling Station',
            equipment: srv.requiredEquipment || availableEquipment[0] || 'Standard Equipment Kit',
          };
        }
      });
      return next;
    });
  }, [selectedServices, availableRooms, availableChairs, availableEquipment]);

  // -------------------------------------------------------------
  // STEP 7: BILLING / PAYMENT STATE
  // -------------------------------------------------------------
  type DepositPreset = '0' | '10' | '20' | '25' | '50' | '100' | 'custom';
  const [depositPreset, setDepositPreset] = useState<DepositPreset>('25');
  const [customDepositValue, setCustomDepositValue] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Pending Deposit' | 'Pay at Salon'>(
    'Paid',
  );
  const [bookingSource, setBookingSource] = useState<NewAppointmentData['bookingSource']>('Walk-in');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------------------------------------------
  // COMPUTED TOTALS & ARRAYS
  // -------------------------------------------------------------
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const rawServiceAmount = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const effectiveTravelFee = serviceMode === 'Home Service' ? travelSurcharge : 0;
  const totalAmount = rawServiceAmount + effectiveTravelFee;

  // Dynamically calculate deposit amount based on user selection
  const depositAmount = useMemo(() => {
    if (totalAmount <= 0) return 0;
    if (depositPreset === '0') return 0;
    if (depositPreset === '10') return Math.round(totalAmount * 0.10);
    if (depositPreset === '20') return Math.round(totalAmount * 0.20);
    if (depositPreset === '25') return Math.round(totalAmount * 0.25);
    if (depositPreset === '50') return Math.round(totalAmount * 0.50);
    if (depositPreset === '100') return totalAmount;
    if (depositPreset === 'custom') {
      const parsed = Number.parseInt(customDepositValue, 10);
      if (Number.isNaN(parsed) || parsed <= 0) return 0;
      return Math.min(parsed, totalAmount);
    }
    return Math.round(totalAmount * 0.25);
  }, [totalAmount, depositPreset, customDepositValue]);

  const depositRequired = depositAmount > 0;
  const remainingBalance = Math.max(0, totalAmount - depositAmount);
  const effectiveDepositPercent = totalAmount > 0 ? Math.round((depositAmount / totalAmount) * 100) : 0;

  // Resolve effective branch UUID
  const effectiveBranchId = useMemo(() => {
    return (
      (isUuid(selectedBranchId) && selectedBranchId) ||
      (isUuid(branchId) && branchId) ||
      (assignedBranch?.id && isUuid(assignedBranch.id) && assignedBranch.id) ||
      (selectedBranchObj?.id && isUuid(selectedBranchObj.id) && selectedBranchObj.id) ||
      branchesList.find((b) => isUuid(b.id))?.id ||
      '00000000-0000-0000-0000-000000000001'
    );
  }, [selectedBranchId, branchId, assignedBranch?.id, selectedBranchObj, branchesList]);

  // Derive active specialist ID:
  // In single-lead mode: leadStaffId
  // In per-service mode: specialist assigned to the first service (or leadStaffId)
  const activeSpecialistId = useMemo(() => {
    if (specialistMode === 'single-lead' && leadStaffId) {
      return leadStaffId;
    }
    if (selectedServices.length > 0) {
      const firstServiceName = selectedServices[0]?.name;
      if (firstServiceName && serviceStaffMap[firstServiceName]) {
        return serviceStaffMap[firstServiceName];
      }
    }
    return leadStaffId || branchStaff[0]?.id || '';
  }, [specialistMode, leadStaffId, selectedServices, serviceStaffMap, branchStaff]);

  // Active Lead Specialist Object
  const leadStaffObj = useMemo(() => {
    return (
      branchStaff.find(
        (st) => st.id?.toLowerCase() === activeSpecialistId?.toLowerCase(),
      ) ||
      branchStaff[0] ||
      null
    );
  }, [branchStaff, activeSpecialistId]);

  // Computed staff assignments array
  const computedStaffAssignments: StaffAssignment[] = useMemo(() => {
    return selectedServices.map((srv) => {
      const assignedId =
        specialistMode === 'single-lead'
          ? leadStaffId
          : serviceStaffMap[srv.name] || activeSpecialistId || leadStaffId;
      const staffObj =
        branchStaff.find((st) => st.id?.toLowerCase() === assignedId?.toLowerCase()) ||
        branchStaff[0] || {
          id: assignedId || 'unassigned',
          fullName: 'Assigned Specialist',
          role: 'Stylist / Therapist',
          avatarInitials: 'SP',
        };
      return {
        serviceName: srv.name,
        staffId: staffObj.id,
        staffName: staffObj.fullName,
        role: staffObj.role || staffObj.jobTitle || 'Stylist / Therapist',
        avatarInitials: staffObj.avatarInitials || staffObj.fullName.slice(0, 2).toUpperCase(),
      };
    });
  }, [selectedServices, specialistMode, leadStaffId, serviceStaffMap, activeSpecialistId, branchStaff]);

  // Reset form state back to initial fresh form
  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setServiceMode('In-Salon');
    setIsNewClient(false);
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setCustomerSearchResults([]);
    setClientName(initialClient?.name || '');
    setClientMobile(initialClient?.mobile || '');
    setClientEmail(initialClient?.email || '');
    setCustomerId('');
    setCustomerCode('');
    setNewFirstName('');
    setNewLastName('');
    setNewMobilePhone('');
    setNewEmail('');
    setNewClientBranchId(effectiveInitialBranchId);
    setSelectedBranchId(effectiveInitialBranchId);
    setSelectedBranchName(effectiveInitialBranchName);
    setStreetAddress('');
    setApartmentVilla('');
    setLandmark('');
    setCity('');
    setPincode('');
    setGateEntryNotes('');
    setPortableKitId('Portable Sanitized Hydra/Spa Kit #HK-04 (UV Sterilized)');
    setTravelBufferWindow('30 mins pre-dispatch travel buffer');
    // Fresh empty services basket
    setSelectedServices([]);
    setServiceCategoryFilter('All');
    setServiceSearchQuery('');
    setIsCustomServiceOpen(false);
    // Fresh specialist assignment
    setSpecialistMode('per-service');
    setLeadStaffId(branchStaff[0]?.id || 'e1000000-0000-4000-a000-000000000001');
    setServiceStaffMap({});
    // Fresh schedule
    const today = new Date();
    setAppointmentDate(today.toISOString().split('T')[0]);
    setAppointmentTime('11:00 AM');
    setIsCustomTimeMode(false);
    // Fresh billing & dynamic deposit
    setDepositPreset('25');
    setCustomDepositValue('');
    setPaymentStatus('Paid');
    setBookingSource('Walk-in');
    setNotes('');
    setIsSubmitting(false);
  }, [initialClient, branchStaff, effectiveInitialBranchId, effectiveInitialBranchName]);

  const handleModalClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Reset modal state whenever opened fresh
  const prevIsOpenRef = useRef(false);
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      resetForm();
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, resetForm]);

  // Live availability states
  const [backendSlots, setBackendSlots] = useState<ApiTimeSlot[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [leadSpecialistSchedule, setLeadSpecialistSchedule] = useState<ApiAppointmentSummary[]>([]);

  // Fetch live availability whenever appointmentDate, activeSpecialistId, or effectiveBranchId changes
  const loadStylistAvailability = useCallback(async () => {
    if (!effectiveBranchId || !appointmentDate) return;
    setIsLoadingAvailability(true);
    try {
      const staffUuid = isUuid(activeSpecialistId) ? activeSpecialistId : undefined;
      const slots = await appointmentsApi.getAvailability({
        branchId: effectiveBranchId,
        date: appointmentDate,
        staffId: staffUuid,
        duration: Math.max(15, totalDuration),
      });
      setBackendSlots(slots || []);

      if (staffUuid) {
        const schedule = await appointmentsApi.getStylistSchedule(staffUuid, appointmentDate);
        setLeadSpecialistSchedule(schedule || []);
      } else {
        setLeadSpecialistSchedule([]);
      }
    } catch (err) {
      console.warn('Could not fetch live availability from API:', err);
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [effectiveBranchId, appointmentDate, activeSpecialistId, totalDuration]);

  useEffect(() => {
    if (isOpen) {
      loadStylistAvailability();
    }
  }, [isOpen, loadStylistAvailability]);

  // Helper to parse "09:30 AM" -> total minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return 0;
    let hours = Number.parseInt(match[1], 10);
    const minutes = Number.parseInt(match[2], 10);
    const meridiem = (match[3] || 'AM').toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  // Helper to format minutes from midnight -> "04:00 PM"
  const formatMinutesToTime = (totalMins: number): string => {
    let hours = Math.floor(totalMins / 60) % 24;
    const minutes = totalMins % 60;
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
  };

  // Helper to format ISO timestamp -> "04:00 PM"
  const formatIsoToTime = (isoStr?: string | null): string => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      if (Number.isNaN(d.getTime())) return isoStr;
      let hours = d.getHours();
      const minutes = d.getMinutes();
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;
      return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
    } catch {
      return isoStr;
    }
  };

  // Consolidated busy windows for active specialist on appointmentDate
  const activeSpecialistBusyWindows = useMemo(() => {
    const windows: Array<{
      start: string;
      end: string;
      startMins: number;
      endMins: number;
      duration: number;
      clientName?: string;
      reason?: string;
    }> = [];

    const normalizedApptDate = appointmentDate.trim();
    const activeSpecialists = computedStaffAssignments.map((a) => ({
      id: a.staffId,
      name: a.staffName,
    }));

    // 1. From backendSlots (via booking microservice)
    backendSlots.forEach((bs) => {
      if (!bs.available) {
        const dStart = new Date(bs.startTime);
        const dEnd = new Date(bs.endTime);
        const startMins = dStart.getHours() * 60 + dStart.getMinutes();
        const endMins = dEnd.getHours() * 60 + dEnd.getMinutes();
        const fromTime = formatMinutesToTime(startMins);
        const toTime = formatMinutesToTime(endMins);
        const dur = Math.max(15, endMins - startMins);
        windows.push({
          start: fromTime,
          end: toTime,
          startMins,
          endMins,
          duration: dur,
          reason: bs.reason || 'Booked',
        });
      }
    });

    // 2. From leadSpecialistSchedule (from booking_db)
    leadSpecialistSchedule.forEach((apt) => {
      const aptDate = (apt.scheduledStartAt || '').split('T')[0];
      if (aptDate === normalizedApptDate && apt.status !== 'CANCELLED' && apt.status !== 'NO_SHOW') {
        const aptStart = new Date(apt.scheduledStartAt);
        const aptEnd = new Date(apt.scheduledEndAt);
        const startMins = aptStart.getHours() * 60 + aptStart.getMinutes();
        const endMins = aptEnd.getHours() * 60 + aptEnd.getMinutes();
        const fromTime = formatMinutesToTime(startMins);
        const toTime = formatMinutesToTime(endMins);
        const dur = Math.max(15, endMins - startMins);
        windows.push({
          start: fromTime,
          end: toTime,
          startMins,
          endMins,
          duration: dur,
          clientName: 'Guest',
          reason: apt.bookingNumber,
        });
      }
    });

    // 3. From existingAppointments (from operations store / memory)
    if (existingAppointments && existingAppointments.length > 0) {
      existingAppointments.forEach((apt) => {
        const aptDate = (apt.date || '').trim();
        const dateMatches =
          aptDate === normalizedApptDate ||
          aptDate === normalizedApptDate.split('-').reverse().join('-') ||
          (apt.date && new Date(apt.date).toISOString().split('T')[0] === normalizedApptDate);

        if (!dateMatches) return;
        if (apt.status === 'Cancelled' || apt.status === 'No-show') return;

        const stylistMatches = activeSpecialists.some(
          (sp) =>
            (sp.id && sp.id !== 'unassigned' && apt.staffId === sp.id) ||
            (sp.name && apt.staffName && sp.name.toLowerCase() === apt.staffName.toLowerCase()),
        );
        if (!stylistMatches) return;

        const startMins = parseTimeToMinutes(apt.time);
        const dur = apt.totalDuration || apt.durationMinutes || 45;
        const endMins = startMins + dur;
        const fromTime = formatMinutesToTime(startMins);
        const toTime = formatMinutesToTime(endMins);

        windows.push({
          start: fromTime,
          end: toTime,
          startMins,
          endMins,
          duration: dur,
          clientName: apt.clientName,
          reason: (apt as any).serviceName || apt.services?.map((s) => s.name).join(', ') || 'Appointment',
        });
      });
    }

    // Sort and merge contiguous or overlapping busy windows
    windows.sort((a, b) => a.startMins - b.startMins);
    const merged: typeof windows = [];
    for (const w of windows) {
      if (merged.length === 0) {
        merged.push({ ...w });
      } else {
        const last = merged[merged.length - 1];
        if (w.startMins <= last.endMins) {
          if (w.endMins > last.endMins) {
            last.endMins = w.endMins;
            last.end = w.end;
            last.duration = last.endMins - last.startMins;
          }
          if (w.clientName && !last.clientName) {
            last.clientName = w.clientName;
          }
        } else {
          merged.push({ ...w });
        }
      }
    }
    return merged;
  }, [
    backendSlots,
    leadSpecialistSchedule,
    existingAppointments,
    appointmentDate,
    computedStaffAssignments,
  ]);

  // Check if a time slot has a conflict for the selected stylist(s)
  const getSlotStatus = useCallback(
    (
      slotTime: string,
    ): {
      isBooked: boolean;
      reason?: string;
      conflictingClient?: string;
      bookedFrom?: string;
      bookedUntil?: string;
      bookedDurationMinutes?: number;
      timeRangeLabel?: string;
    } => {
      const slotStartMins = parseTimeToMinutes(slotTime);
      const slotEndMins = slotStartMins + Math.max(15, totalDuration);

      for (const w of activeSpecialistBusyWindows) {
        if (slotStartMins < w.endMins && slotEndMins > w.startMins) {
          return {
            isBooked: true,
            reason: w.reason ? `Booked (${w.reason})` : 'Booked',
            conflictingClient: w.clientName,
            bookedFrom: w.start,
            bookedUntil: w.end,
            bookedDurationMinutes: w.duration,
            timeRangeLabel: `${w.start} – ${w.end}`,
          };
        }
      }

      return { isBooked: false };
    },
    [activeSpecialistBusyWindows, totalDuration],
  );

  const selectedSlotStatus = useMemo(() => {
    return getSlotStatus(appointmentTime);
  }, [getSlotStatus, appointmentTime]);

  const customSlotTime = useMemo(() => {
    return `${customHour.padStart(2, '0')}:${customMinute.padStart(2, '0')} ${customMeridiem}`;
  }, [customHour, customMinute, customMeridiem]);

  const customSlotStatus = useMemo(() => {
    return getSlotStatus(customSlotTime);
  }, [getSlotStatus, customSlotTime]);

  const handleApplyManualSlot = () => {
    const formatted = customSlotTime;
    const status = getSlotStatus(formatted);
    if (status.isBooked) {
      toast(
        `⚠️ Cannot set ${formatted}: ${leadStaffObj?.fullName || 'Stylist'} is booked from ${status.bookedFrom || formatted} till ${status.bookedUntil}. Stylist will be free at ${status.bookedUntil}.`,
      );
      return;
    }
    if (!timeSlots.includes(formatted)) {
      setTimeSlots((prev) => [...prev, formatted]);
    }
    setAppointmentTime(formatted);
    setIsCustomTimeMode(false);
    toast(`Manual time slot "${formatted}" set.`);
  };

  // Computed resource allocations array
  const computedResourceAllocations: ResourceAllocationItem[] = useMemo(() => {
    return selectedServices.map((srv) => {
      if (serviceMode === 'Home Service') {
        return {
          serviceName: srv.name,
          room: `🏡 Doorstep Concierge (${city || selectedBranchObj?.city || 'Local Area'})`,
          chair: `Mobile Kit #${portableKitId.split(' ')[0]}`,
          equipment: portableKitId,
        };
      }
      if (resourceAllocationMode === 'single-station') {
        return {
          serviceName: srv.name,
          room: singleRoom || availableRooms[0],
          chair: singleChair || availableChairs[0],
          equipment: singleEquipment || availableEquipment[0],
        };
      }
      const allocated = serviceResourceMap[srv.name] || {
        room: availableRooms[0],
        chair: availableChairs[0],
        equipment: availableEquipment[0],
      };
      return {
        serviceName: srv.name,
        room: allocated.room,
        chair: allocated.chair,
        equipment: allocated.equipment,
      };
    });
  }, [
    selectedServices,
    serviceMode,
    city,
    selectedBranchObj?.city,
    portableKitId,
    resourceAllocationMode,
    singleRoom,
    singleChair,
    singleEquipment,
    availableRooms,
    availableChairs,
    availableEquipment,
    serviceResourceMap,
  ]);

  const uniqueSpecialists = Array.from(new Set(computedStaffAssignments.map((a) => a.staffName)));
  const primaryLeadStaff =
    branchStaff.find((st) => st.id === leadStaffId) ||
    branchStaff[0] || { id: 'unassigned', fullName: 'Specialist' };
  const summaryStaffName =
    uniqueSpecialists.length === 1
      ? uniqueSpecialists[0]
      : `${uniqueSpecialists[0] || 'Specialist'} (+${uniqueSpecialists.length - 1} specialist${uniqueSpecialists.length > 2 ? 's' : ''})`;

  const uniqueRooms = Array.from(new Set(computedResourceAllocations.map((r) => r.room)));
  const primaryRoom =
    uniqueRooms.length === 1
      ? uniqueRooms[0]
      : `${uniqueRooms[0]} (+${uniqueRooms.length - 1} rooms)`;
  const primaryChair = computedResourceAllocations[0]?.chair || availableChairs[0] || 'Standard Chair';
  const primaryEquipment =
    computedResourceAllocations[0]?.equipment || availableEquipment[0] || 'Standard Equipment';

  // -------------------------------------------------------------
  // CUSTOMER SEARCH & SELECTION LOGIC
  // -------------------------------------------------------------
  const handleSearchCustomers = useCallback(async (query: string) => {
    setCustomerSearchTerm(query);
    if (!query.trim()) {
      setCustomerSearchResults([]);
      return;
    }
    setIsSearchingCustomers(true);
    try {
      const results = await customersApi.list({ search: query.trim(), limit: 8 });
      setCustomerSearchResults(results || []);
    } catch (err) {
      console.error('Customer search error:', err);
      setCustomerSearchResults([]);
    } finally {
      setIsSearchingCustomers(false);
    }
  }, []);

  const handleSelectCustomer = (c: ApiCustomerSummary) => {
    setSelectedCustomer(c);
    setClientName(c.displayName || `${c.firstName} ${c.lastName || ''}`.trim());
    setClientMobile(c.mobilePhone);
    setClientEmail(c.email || '');
    setCustomerId(c.id);
    setCustomerCode(c.customerCode);
    setCustomerSearchTerm('');
    setCustomerSearchResults([]);

    // If customer has a preferred branch, preselect it
    if (c.preferredBranchId) {
      const matched = branchesList.find((b) => b.id === c.preferredBranchId);
      if (matched) {
        setSelectedBranchId(matched.id);
        setSelectedBranchName(matched.name);
      }
    }
    toast(`Client ${c.displayName} selected.`);
  };

  // -------------------------------------------------------------
  // STEP NAVIGATION & VALIDATION
  // -------------------------------------------------------------
  const handleContinue = async () => {
    // Step: Mode & Client Validation & Creation
    if (currentStepKey === 'client') {
      if (isNewClient) {
        if (!newFirstName.trim()) {
          toast('Please provide client first name.');
          return;
        }
        if (!newMobilePhone.trim() || newMobilePhone.trim().length < 8) {
          toast('Please enter a valid mobile phone number (min 8 digits).');
          return;
        }

        setIsCreatingCustomer(true);
        try {
          // Use chosen or locked branch UUID for preferred_branch_id
          const branchForNewCustomer =
            (isBranchLocked
              ? (isUuid(selectedBranchId) && selectedBranchId) ||
                (isUuid(branchId) && branchId) ||
                (assignedBranch?.id && isUuid(assignedBranch.id) && assignedBranch.id) ||
                (isUuid(effectiveInitialBranchId) && effectiveInitialBranchId) ||
                (isUuid(tokenStorage.getBranchId()) && tokenStorage.getBranchId())
              : (isUuid(newClientBranchId) && newClientBranchId) ||
                (isUuid(selectedBranchId) && selectedBranchId)) ||
            (isUuid(effectiveBranchId) && effectiveBranchId) ||
            (isUuid(selectedBranchId) && selectedBranchId) ||
            (isUuid(tokenStorage.getBranchId()) && tokenStorage.getBranchId()) ||
            branchesList.find((b) => isUuid(b.id))?.id;

          const created = await customersApi.create({
            firstName: newFirstName.trim(),
            lastName: newLastName.trim() || undefined,
            mobilePhone: newMobilePhone.trim(),
            email: newEmail.trim() || undefined,
            preferredBranchId: branchForNewCustomer || undefined,
            dateOfBirth: null,
            segment: 'New Client',
          });

          setSelectedCustomer(created);
          setClientName(created.displayName || `${created.firstName} ${created.lastName || ''}`.trim());
          setClientMobile(created.mobilePhone);
          setClientEmail(created.email || '');
          setCustomerId(created.id);
          setCustomerCode(created.customerCode);
          if (created.preferredBranchId && !isBranchLocked) {
            setSelectedBranchId(created.preferredBranchId);
            const bMatch = branchesList.find((b) => b.id === created.preferredBranchId);
            if (bMatch) setSelectedBranchName(bMatch.name);
          }
          toast(`New client ${created.displayName} registered successfully!`);
          setCurrentStep((prev) => prev + 1);
        } catch (err: any) {
          console.error('Failed to create customer:', err);
          const msg =
            err.response?.data?.message ||
            err.message ||
            'Failed to register client. Please check mobile phone number.';
          toast(msg);
          return;
        } finally {
          setIsCreatingCustomer(false);
        }
        return;
      } else {
        if (!clientName.trim() || !clientMobile.trim()) {
          toast('Please search & select an existing client, or click "+ Add New Client".');
          return;
        }
        setCurrentStep((prev) => prev + 1);
        return;
      }
    }

    // Step: Branch Hub Validation (only when branch selection is unlocked)
    if (currentStepKey === 'branch') {
      if (!selectedBranchId) {
        toast('Please select a salon branch location.');
        return;
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Step: Services Validation
    if (currentStepKey === 'services') {
      if (selectedServices.length === 0) {
        toast('Please select at least one service to proceed.');
        return;
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Step: Specialists Validation
    if (currentStepKey === 'specialists') {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Step: Schedule Validation
    if (currentStepKey === 'schedule') {
      if (!appointmentDate) {
        toast('Please select appointment date.');
        return;
      }
      if (!appointmentTime) {
        toast('Please select appointment time slot.');
        return;
      }
      const slotStatus = getSlotStatus(appointmentTime);
      if (slotStatus.isBooked) {
        toast(
          `⚠️ Cannot proceed: ${leadStaffObj?.fullName || 'Stylist'} is already ${slotStatus.reason || 'booked'} at ${appointmentTime}. Please select a slot marked Free.`,
        );
        return;
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Step: Allocations Validation
    if (currentStepKey === 'allocations') {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Step: Billing Validation
    if (currentStepKey === 'billing') {
      setCurrentStep((prev) => prev + 1);
      return;
    }
  };

  // Final Confirmation: Save to PostgreSQL booking_db via API Gateway
  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // 1. Resolve or create customer ID
      let targetCustomerId = customerId;
      if (!targetCustomerId || !isUuid(targetCustomerId)) {
        if (selectedCustomer?.id && isUuid(selectedCustomer.id)) {
          targetCustomerId = selectedCustomer.id;
        } else {
          const branchForNewCustomer =
            (isBranchLocked
              ? (isUuid(selectedBranchId) && selectedBranchId) ||
                (isUuid(branchId) && branchId) ||
                (assignedBranch?.id && isUuid(assignedBranch.id) && assignedBranch.id) ||
                (isUuid(effectiveInitialBranchId) && effectiveInitialBranchId) ||
                (isUuid(tokenStorage.getBranchId()) && tokenStorage.getBranchId())
              : (isUuid(selectedBranchId) && selectedBranchId)) ||
            (isUuid(effectiveBranchId) && effectiveBranchId) ||
            (isUuid(selectedBranchId) && selectedBranchId) ||
            (isUuid(tokenStorage.getBranchId()) && tokenStorage.getBranchId()) ||
            branchesList.find((b) => isUuid(b.id))?.id;

          // Quick create customer in customer_db
          const createdCust = await customersApi.create({
            firstName: newFirstName.trim() || clientName.split(' ')[0] || 'Client',
            lastName: newLastName.trim() || clientName.split(' ').slice(1).join(' ') || undefined,
            mobilePhone: newMobilePhone.trim() || clientMobile.trim() || '9876543210',
            email: newEmail.trim() || clientEmail.trim() || undefined,
            preferredBranchId: branchForNewCustomer || undefined,
            dateOfBirth: null,
            segment: 'New Client',
          });
          targetCustomerId = createdCust.id;
          setCustomerId(createdCust.id);
          setSelectedCustomer(createdCust);
        }
      }

      // 2. Resolve valid branch ID
      const targetBranchId =
        (isUuid(selectedBranchId) && selectedBranchId) ||
        (selectedBranchObj?.id && isUuid(selectedBranchObj.id) && selectedBranchObj.id) ||
        branchesList.find((b) => isUuid(b.id))?.id ||
        '85ce5982-3cf3-4ce7-8f7c-0dff40650869';

      // 3. Parse scheduled start and end timestamps
      const [year, month, day] = appointmentDate.split('-').map(Number);
      const match = appointmentTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      let hours = 11;
      let minutes = 0;
      if (match) {
        hours = Number.parseInt(match[1], 10);
        minutes = Number.parseInt(match[2], 10);
        const meridiem = (match[3] || 'AM').toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
      }
      const startAtDate = new Date(year, (month || 1) - 1, day || 1, hours, minutes, 0);
      const scheduledStartAt = startAtDate.toISOString();
      const scheduledEndAt = new Date(
        startAtDate.getTime() + Math.max(15, totalDuration) * 60 * 1000,
      ).toISOString();

      // 4. Map items
      let curItemTime = new Date(startAtDate);
      const itemsPayload = selectedServices.map((srv) => {
        const assigned = computedStaffAssignments.find((a) => a.serviceName === srv.name);
        let staffUuid = isUuid(assigned?.staffId) ? assigned?.staffId : undefined;
        if (!staffUuid && assigned?.staffName) {
          const matched = staffList.find(
            (st) => isUuid(st.id) && st.fullName.toLowerCase() === assigned.staffName.toLowerCase(),
          );
          if (matched) staffUuid = matched.id;
        }
        const validServiceId =
          (isUuid(srv.id) && srv.id) ||
          masterServices.find((ms) => isUuid(ms.id))?.id ||
          '11111111-1111-1111-1111-111111111111';

        const sStart = new Date(curItemTime);
        const sEnd = new Date(sStart.getTime() + (srv.duration || 45) * 60 * 1000);
        curItemTime = sEnd;

        return {
          serviceId: validServiceId,
          staffId: staffUuid || null,
          scheduledStartAt: sStart.toISOString(),
          scheduledEndAt: sEnd.toISOString(),
          price: Number(srv.price) || 0,
          notes: srv.isCustom ? `Custom service: ${srv.name}` : undefined,
        };
      });

      // 5. Call booking-service API
      const bookingRes = await appointmentsApi.create({
        branchId: targetBranchId,
        customerId: targetCustomerId!,
        source: serviceMode === 'Home Service' ? 'ADMIN' : (bookingSource === 'Walk-in' ? 'WALK_IN' : 'ADMIN'),
        scheduledStartAt,
        scheduledEndAt,
        notes: notes
          ? `${notes} [Allocated Station: ${primaryChair} | Room: ${primaryRoom}]`
          : serviceMode === 'Home Service'
            ? `Home Service Concierge: ${streetAddress || 'Doorstep'}, ${city || selectedBranchObj?.city || 'Local Area'}`
            : `Allocated Station: ${primaryChair} | Room: ${primaryRoom}`,
        depositRequired,
        depositAmount,
        totalAmount,
        items: itemsPayload,
      });

      const confirmedBookingNumber = bookingRes.bookingNumber || bookingRes.id;

      const created: NewAppointmentData = {
        id: confirmedBookingNumber,
        clientName,
        clientMobile,
        clientEmail,
        isNewClient,
        customerId: targetCustomerId,
        customerCode: customerCode || undefined,
        serviceMode,
        homeAddress:
          serviceMode === 'Home Service'
            ? {
                streetAddress,
                apartmentVilla,
                landmark,
                city: city || selectedBranchObj?.city || 'Local Area',
                pincode,
                gateEntryNotes,
              }
            : undefined,
        travelSurcharge: effectiveTravelFee,
        portableKitId: serviceMode === 'Home Service' ? portableKitId : undefined,
        travelBufferWindow: serviceMode === 'Home Service' ? travelBufferWindow : undefined,
        branch: selectedBranchName || selectedBranchObj?.name || 'Main Salon',
        branchId: targetBranchId,
        services: selectedServices,
        staffId: primaryLeadStaff.id,
        staffName: summaryStaffName,
        staffAssignments: computedStaffAssignments,
        resourceAllocations: computedResourceAllocations,
        date: appointmentDate,
        time: appointmentTime,
        totalDuration,
        durationMinutes: totalDuration,
        room: primaryRoom,
        chair: primaryChair,
        equipment: primaryEquipment,
        totalAmount,
        estimatedAmount: totalAmount,
        depositRequired,
        depositAmount,
        paymentStatus,
        bookingSource: serviceMode === 'Home Service' ? 'Home Service Concierge' : bookingSource,
        notes,
      };

      onSuccess(created);
      resetForm();
      onClose();
      toast(
        serviceMode === 'Home Service'
          ? `Home Service Appointment #${confirmedBookingNumber} saved to database for ${created.clientName}!`
          : `Appointment #${confirmedBookingNumber} saved to database for ${created.clientName} at ${created.branch}!`,
      );
    } catch (err: any) {
      console.error('Failed to create appointment in booking_db:', err);
      const apiMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        err.message ||
        'Could not save appointment to database.';
      toast(`Booking Error: ${apiMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = useMemo(() => {
    if (isBranchLocked) {
      return [
        'Mode & Client',
        'Services',
        'Specialists',
        'Schedule',
        serviceMode === 'Home Service' ? 'Logistics Kit' : 'Allocations',
        'Billing',
        'Review',
      ];
    }
    return [
      'Mode & Client',
      'Branch Hub',
      'Services',
      'Specialists',
      'Schedule',
      serviceMode === 'Home Service' ? 'Logistics Kit' : 'Allocations',
      'Billing',
      'Review',
    ];
  }, [isBranchLocked, serviceMode]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/55 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] shadow-[0_25px_80px_rgba(90,46,166,0.28)] border border-purple-100/90 w-full max-w-5xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
        {/* Header Bar */}
        <div className="px-7 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
                Step {currentStep} of {totalSteps}
              </span>
              <h3 className="font-serif text-[19px] text-ink font-bold tracking-tight">
                New Dynamic Appointment Booking
              </h3>
              {isBranchLocked && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] border border-purple-200 text-[10.5px] font-bold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#5A2EA6]" />
                  <span>{selectedBranchName || selectedBranchObj?.name || 'Assigned Branch'}</span>
                </span>
              )}
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border flex items-center gap-1',
                  serviceMode === 'Home Service'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-purple-50 text-[#5A2EA6] border-purple-200',
                )}
              >
                {serviceMode === 'Home Service' ? (
                  <>
                    <Home className="w-3 h-3 text-amber-700" />
                    <span>Home Service Concierge</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-3 h-3 text-[#5A2EA6]" />
                    <span>In-Salon Experience</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-[11.5px] text-muted mt-0.5">
              Live enterprise scheduling engine connected directly to microservices databases.
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="px-7 py-3 bg-[#FCFAFF] border-b border-purple-50 flex items-center justify-between overflow-x-auto no-scrollbar shrink-0">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <button
                type="button"
                key={label}
                onClick={() => {
                  // Only allow jumping backwards to completed steps
                  if (stepNum < currentStep) setCurrentStep(stepNum);
                }}
                className={cn(
                  'flex items-center gap-1.5 border-0 bg-transparent py-1 whitespace-nowrap shrink-0 focus:outline-none',
                  stepNum <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
                )}
              >
                <span
                  className={cn(
                    'w-5 h-5 rounded-full font-bold text-[10px] grid place-items-center transition-all',
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                        ? 'bg-[#5A2EA6] text-white shadow-xs'
                        : 'bg-purple-100/70 text-purple-600',
                  )}
                >
                  {isCompleted ? '✓' : stepNum}
                </span>
                <span
                  className={cn(
                    'text-xs transition-colors',
                    isCurrent ? 'font-bold text-[#5A2EA6]' : 'font-medium text-slate-600',
                  )}
                >
                  {label}
                </span>
                {i < stepLabels.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-purple-200 ml-1.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-7 overflow-y-auto flex-1 custom-scroll space-y-6">
          {/* ------------------------------------------------------------- */}
          {/* STEP: MODE & CLIENT */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'client' && (
            <div className="space-y-5">
              {/* Delivery Mode Selector */}
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-2">
                  1. Choose Service Delivery Mode *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div
                    onClick={() => setServiceMode('In-Salon')}
                    className={cn(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5',
                      serviceMode === 'In-Salon'
                        ? 'bg-purple-50/70 border-[#5A2EA6] shadow-sm'
                        : 'bg-white border-purple-100 hover:border-purple-200',
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#5A2EA6] grid place-items-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-ink font-bold">In-Salon Appointment</strong>
                        {serviceMode === 'In-Salon' && (
                          <span className="w-4 h-4 rounded-full bg-[#5A2EA6] text-white grid place-items-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        Client visits flagship salon branch. Allocated to luxury styling chair, therapy
                        bed, or clinical suite.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setServiceMode('Home Service')}
                    className={cn(
                      'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5',
                      serviceMode === 'Home Service'
                        ? 'bg-amber-50/80 border-amber-500 shadow-sm'
                        : 'bg-white border-purple-100 hover:border-purple-200',
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 grid place-items-center shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-ink font-bold">
                          Home Service (Doorstep Concierge)
                        </strong>
                        {serviceMode === 'Home Service' && (
                          <span className="w-4 h-4 rounded-full bg-amber-600 text-white grid place-items-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted mt-0.5">
                        Specialist dispatched to client residence with sanitized portable kit &amp;
                        UV sterilized equipment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Selection / Registration */}
              <div className="pt-3 border-t border-purple-100/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-ink text-sm">Client Information</h4>
                    <p className="text-[11px] text-muted">
                      Search existing registered clients from database or quickly register a new client.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewClient(!isNewClient);
                      setSelectedCustomer(null);
                    }}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shadow-3xs',
                      isNewClient
                        ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                        : 'bg-white text-[#5A2EA6] border-purple-200 hover:bg-purple-50',
                    )}
                  >
                    {isNewClient ? (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>Search Existing Clients</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>+ Add New Client</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option A: Search Existing Client from customer_db */}
                {!isNewClient ? (
                  <div className="space-y-3">
                    {selectedCustomer ? (
                      /* Selected Customer Pill Card */
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/80 to-pink-50/40 border border-purple-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#5A2EA6] text-white font-bold grid place-items-center text-sm shadow-xs">
                            {selectedCustomer.displayName?.slice(0, 2).toUpperCase() || 'CL'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-xs font-bold text-ink">
                                {selectedCustomer.displayName ||
                                  `${selectedCustomer.firstName} ${selectedCustomer.lastName || ''}`}
                              </strong>
                              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                {selectedCustomer.customerCode}
                              </span>
                              <span className="text-[10px] text-muted font-semibold">
                                {selectedCustomer.totalVisits || 0} visits
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-muted mt-0.5">
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-[#5A2EA6]" />
                                {selectedCustomer.mobilePhone}
                              </span>
                              {selectedCustomer.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-[#5A2EA6]" />
                                  {selectedCustomer.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomer(null);
                            setClientName('');
                            setClientMobile('');
                            setClientEmail('');
                          }}
                          className="px-3 py-1 rounded-xl text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 cursor-pointer transition-colors"
                        >
                          Change Client
                        </button>
                      </div>
                    ) : (
                      /* Search Input & Live Results */
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type client name, mobile (+91), email or customer code..."
                            value={customerSearchTerm}
                            onChange={(e) => handleSearchCustomers(e.target.value)}
                            className="w-full h-11 px-4 pl-10 rounded-2xl border border-purple-200 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] focus:bg-white transition-all shadow-3xs"
                          />
                          <Search className="w-4 h-4 text-[#5A2EA6] absolute left-3.5 top-3.5" />
                          {isSearchingCustomers && (
                            <Loader2 className="w-4 h-4 text-[#5A2EA6] animate-spin absolute right-3.5 top-3.5" />
                          )}
                        </div>

                        {/* Search Results Dropdown / Cards */}
                        {customerSearchResults.length > 0 && (
                          <div className="p-2 bg-white rounded-2xl border border-purple-100 shadow-md max-h-52 overflow-y-auto custom-scroll space-y-1">
                            {customerSearchResults.map((c) => (
                              <div
                                key={c.id}
                                onClick={() => handleSelectCustomer(c)}
                                className="p-2.5 rounded-xl hover:bg-purple-50/80 cursor-pointer flex items-center justify-between transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5A2EA6] font-bold text-xs grid place-items-center">
                                    {c.displayName?.slice(0, 2).toUpperCase() || 'CL'}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <strong className="text-xs text-ink">{c.displayName}</strong>
                                      <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-purple-100 text-[#5A2EA6] font-bold">
                                        {c.customerCode}
                                      </span>
                                    </div>
                                    <span className="text-[10.5px] text-muted block">
                                      {c.mobilePhone} {c.email ? `· ${c.email}` : ''}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-bold text-[#5A2EA6] bg-purple-50 px-2 py-0.5 rounded-lg">
                                  Select Client →
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {customerSearchTerm.trim() &&
                          customerSearchResults.length === 0 &&
                          !isSearchingCustomers && (
                            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 text-center space-y-1.5">
                              <p className="text-xs text-muted">
                                No client found matching "
                                <span className="font-bold text-ink">{customerSearchTerm}</span>"
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsNewClient(true);
                                  setNewMobilePhone(
                                    customerSearchTerm.replace(/\D/g, '').length >= 8
                                      ? customerSearchTerm
                                      : '',
                                  );
                                  setNewFirstName(
                                    customerSearchTerm.replace(/\d/g, '').trim() || '',
                                  );
                                }}
                                className="px-3 py-1 rounded-lg bg-[#5A2EA6] text-white text-xs font-bold hover:bg-[#4a2489] cursor-pointer"
                              >
                                + Register "{customerSearchTerm}" as New Client
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Option B: New Client Form (Saving to customer_db) */
                  <div className="p-4.5 rounded-2xl bg-gradient-to-r from-purple-50/60 to-pink-50/40 border border-purple-200 space-y-3.5 animate-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#5A2EA6]" />
                        <strong className="text-xs text-ink font-bold">
                          Register New Client (Persisted to Database)
                        </strong>
                      </div>
                      <span className="text-[10.5px] text-muted">
                        Automatically assigned to booking branch in database
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newFirstName}
                          onChange={(e) => setNewFirstName(e.target.value)}
                          placeholder="e.g. Aditi"
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={newLastName}
                          onChange={(e) => setNewLastName(e.target.value)}
                          placeholder="e.g. Sharma"
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Mobile Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newMobilePhone}
                          onChange={(e) => setNewMobilePhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                      <div>
                        <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="e.g. aditi@gmail.com"
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>

                    {/* Booking / Preferred Branch Dropdown */}
                    <div>
                      <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Assigned Booking Branch {isBranchLocked ? '(Locked to Current Branch)' : '(Saved in preferred_branch_id) *'}
                      </label>
                      {isBranchLocked ? (
                        <div className="w-full h-10 px-3.5 rounded-xl border border-purple-200 bg-purple-50/60 flex items-center justify-between text-xs font-semibold text-purple-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#5A2EA6]" />
                            <span>{selectedBranchName || selectedBranchObj?.name || 'Assigned Branch'}</span>
                          </div>
                          <span className="text-[10px] bg-purple-200/70 text-[#5A2EA6] px-2 py-0.5 rounded font-bold">
                            Locked
                          </span>
                        </div>
                      ) : (
                        <select
                          value={newClientBranchId}
                          onChange={(e) => {
                            setNewClientBranchId(e.target.value);
                            setSelectedBranchId(e.target.value);
                            const bMatch = branchesList.find((b) => b.id === e.target.value);
                            if (bMatch) setSelectedBranchName(bMatch.name);
                          }}
                          className="w-full h-10 px-3.5 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none cursor-pointer"
                        >
                          {branchesList.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.city}) — {b.code}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Home Service Delivery Address Form */}
              {serviceMode === 'Home Service' && (
                <div className="p-4.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <strong className="text-xs text-ink font-bold">
                        Doorstep Destination Address
                      </strong>
                    </div>
                    <span className="text-[10.5px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      Standard Travel Fee: ₹{travelSurcharge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        Street / Colony / Society *
                      </label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. 14, Whispering Palms Estate, Arera Colony"
                        className="w-full h-9.5 px-3.5 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        Flat / Villa No.
                      </label>
                      <input
                        type="text"
                        value={apartmentVilla}
                        onChange={(e) => setApartmentVilla(e.target.value)}
                        placeholder="e.g. Villa #42"
                        className="w-full h-9.5 px-3.5 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        Prominent Landmark
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Arera Club"
                        className="w-full h-9.5 px-3.5 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        City &amp; Area
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Mumbai / Indore"
                        className="w-full h-9.5 px-3.5 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                        Postal Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 452001"
                        className="w-full h-9.5 px-3.5 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                      Security Gate / Visitor Notes for Specialist
                    </label>
                    <input
                      type="text"
                      value={gateEntryNotes}
                      onChange={(e) => setGateEntryNotes(e.target.value)}
                      placeholder="e.g. Security entry code #5821, lift to 4th floor"
                      className="w-full h-9.5 px-3.5 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP 2: BRANCH HUB (LOCATION & FULFILLMENT BASE) */}
          {/* ------------------------------------------------------------- */}
          {!isBranchLocked && currentStepKey === 'branch' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-ink text-sm">
                    {serviceMode === 'Home Service'
                      ? 'Step 2: Select Fulfilling Base Hub (Branch Dispatched From)'
                      : 'Step 2: Select Salon & Spa Branch Location'}
                  </h4>
                  <p className="text-[11px] text-muted">
                    Services, specialists, and salon physical suites will be dynamically filtered to
                    this selected branch.
                  </p>
                </div>
                {serviceMode === 'Home Service' && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Dispatch Base Station
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {branchesList.map((br) => {
                  const isSelected = selectedBranchId === br.id;
                  return (
                    <div
                      key={br.id}
                      onClick={() => handleSelectBranch(br)}
                      className={cn(
                        'p-4.5 rounded-2xl border-2 transition-all cursor-pointer select-none',
                        isSelected
                          ? 'bg-purple-50/80 border-[#5A2EA6] shadow-sm'
                          : 'bg-white border-purple-100 hover:border-purple-200 hover:shadow-2xs',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#5A2EA6]" />
                          <strong className="text-xs text-ink font-bold">{br.name}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#5A2EA6] text-[10px] font-extrabold">
                            {br.code}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded-full bg-[#5A2EA6] text-white grid place-items-center text-[10px]">
                              ✓
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-muted mt-1.5 truncate">
                        {br.address || `${br.city}, ${br.state}`}
                      </p>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-purple-100/60 text-[10.5px]">
                        <span className="text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5A2EA6]" />
                          {br.workingHours || '09:00 AM - 09:00 PM'}
                        </span>
                        <span className="text-emerald-700 font-bold">● {br.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {branchesList.length === 0 && (
                <div className="p-8 text-center bg-purple-50/50 rounded-2xl border border-purple-100">
                  <Building2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-muted font-medium">
                    No branches configured for this salon yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP: DYNAMIC SERVICES FROM COMMERCE_DB */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'services' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-ink text-sm">
                      Step {currentStep}: Choose Services for {selectedBranchName || selectedBranchObj?.name || 'Salon'}
                    </h4>
                    {isBranchLocked && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#5A2EA6] text-[10px] font-bold border border-purple-200">
                        {selectedBranchName || selectedBranchObj?.name} Catalogue
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted">
                    Dynamic service catalogue loaded live from commerce_db.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomServiceOpen(!isCustomServiceOpen)}
                    className="h-9 px-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] text-xs font-bold transition-all flex items-center gap-1.5 border border-purple-200 cursor-pointer shadow-3xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {isCustomServiceOpen ? 'Close Custom Adder' : '+ Add Custom Service'}
                    </span>
                  </button>
                  <span className="text-xs text-[#5A2EA6] font-bold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
                    {selectedServices.length} Selected · {totalDuration}m · ₹
                    {rawServiceAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Custom Ad-Hoc Service Drawer */}
              {isCustomServiceOpen && (
                <form
                  onSubmit={handleAddCustomService}
                  className="p-4.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50/40 border border-purple-200 space-y-3.5 animate-in zoom-in-95 duration-150 shadow-3xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#5A2EA6]" />
                      <strong className="text-xs text-ink font-bold">
                        Add Custom / Ad-Hoc Treatment
                      </strong>
                    </div>
                    <span className="text-[10.5px] text-muted">
                      Dynamically added to this appointment basket
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={customServiceName}
                        onChange={(e) => setCustomServiceName(e.target.value)}
                        placeholder="e.g. Deluxe Bridal Styling Protocol"
                        className="w-full h-9 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={customServiceCategory}
                        onChange={(e) => setCustomServiceCategory(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          Mins
                        </label>
                        <input
                          type="number"
                          value={customServiceDuration}
                          onChange={(e) => setCustomServiceDuration(e.target.value)}
                          className="w-full h-9 px-2 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink outline-none text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                          ₹ Price
                        </label>
                        <input
                          type="number"
                          value={customServicePrice}
                          onChange={(e) => setCustomServicePrice(e.target.value)}
                          className="w-full h-9 px-2 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink outline-none text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1 border-t border-purple-100">
                    <button
                      type="button"
                      onClick={() => setIsCustomServiceOpen(false)}
                      className="h-8 px-3 rounded-lg text-xs font-semibold text-soft hover:bg-white/80 border border-purple-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      className="h-8 px-4 rounded-lg text-xs font-bold bg-[#5A2EA6] text-white flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Basket</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* Selected Services Active Tray */}
              <div className="p-3 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Current Basket ({selectedServices.length} Treatment
                    {selectedServices.length > 1 ? 's' : ''}):
                  </span>
                  <span className="text-muted font-medium">Click ✕ to remove</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((srv) => (
                    <div
                      key={srv.name}
                      className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-[#5A2EA6] shadow-3xs flex items-center gap-2 text-xs font-semibold"
                    >
                      <span>{srv.name}</span>
                      <span className="text-[10px] text-muted">
                        ({srv.duration}m · ₹{srv.price.toLocaleString('en-IN')})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(srv.name)}
                        className="text-purple-400 hover:text-rose-600 p-0.5 border-0 bg-transparent cursor-pointer"
                        title="Remove service"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {selectedServices.length === 0 && (
                    <span className="text-xs text-rose-500 font-semibold">
                      Please select at least one treatment below.
                    </span>
                  )}
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search catalogue..."
                    value={serviceSearchQuery}
                    onChange={(e) => setServiceSearchQuery(e.target.value)}
                    className="w-full h-9 px-3 pl-8 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-2.5" />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:flex-1 py-1">
                  {dynamicCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setServiceCategoryFilter(cat)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition-all border cursor-pointer',
                        serviceCategoryFilter === cat
                          ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-3xs'
                          : 'bg-white text-soft border-slate-200 hover:bg-slate-50',
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Cards Grid */}
              {isLoadingServices ? (
                <div className="p-12 text-center text-muted flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#5A2EA6] animate-spin" />
                  <span>Loading services from database...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto custom-scroll pr-1">
                  {filteredCatalogueServices.map((srv) => {
                    const isSelected = selectedServices.some((s) => s.name === srv.name);
                    return (
                      <div
                        key={srv.id || srv.name}
                        onClick={() => handleToggleService(srv)}
                        className={cn(
                          'p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 select-none',
                          isSelected
                            ? 'bg-purple-50/80 border-[#5A2EA6] shadow-xs'
                            : 'bg-white border-purple-100 hover:border-purple-200 hover:shadow-2xs',
                        )}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] text-[#5A2EA6] font-extrabold uppercase tracking-wider block">
                              {srv.category}
                            </span>
                            {srv.isCustom && (
                              <span className="text-[8.5px] font-extrabold px-1.5 py-0.2 rounded bg-pink-100 text-pink-700">
                                Custom
                              </span>
                            )}
                          </div>
                          <strong className="text-xs text-ink block leading-snug">{srv.name}</strong>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-purple-100/60">
                          <span className="text-[11px] text-muted font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#5A2EA6]" />
                            {srv.duration} mins
                          </span>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs text-ink font-serif font-bold">
                              ₹{srv.price.toLocaleString('en-IN')}
                            </strong>
                            <div
                              className={cn(
                                'w-4 h-4 rounded-md border flex items-center justify-center transition-all',
                                isSelected
                                  ? 'bg-[#5A2EA6] border-[#5A2EA6] text-white'
                                  : 'border-slate-300 bg-white',
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredCatalogueServices.length === 0 && (
                    <div className="col-span-full p-8 text-center text-muted bg-purple-50/40 rounded-2xl border border-purple-100 space-y-3">
                      <p className="text-xs text-muted font-medium">
                        No treatments match your search filter "{serviceSearchQuery || serviceCategoryFilter}".
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setServiceSearchQuery('');
                            setServiceCategoryFilter('All');
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-[#5A2EA6] bg-purple-100/70 hover:bg-purple-100 rounded-lg cursor-pointer border-0"
                        >
                          Reset Filter
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCustomServiceOpen(true)}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-[#5A2EA6] hover:bg-[#4A248C] rounded-lg cursor-pointer border-0"
                        >
                          + Add Custom Service
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP: DYNAMIC SPECIALISTS FROM PEOPLE_DB */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'specialists' && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-ink text-sm">
                      Step {currentStep}: Assign Stylists &amp; Specialists
                    </h4>
                    {isBranchLocked && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#5A2EA6] text-[10px] font-bold border border-purple-200">
                        {selectedBranchName || selectedBranchObj?.name} Team
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted">
                    Specialists available at{' '}
                    <strong className="text-[#5A2EA6]">
                      {selectedBranchName || selectedBranchObj?.name || 'Selected Branch'}
                    </strong>
                    . Assign dedicated specialists per service or assign a single lead stylist.
                  </p>
                </div>

                {/* Allocation Mode Switch */}
                <div className="flex items-center gap-1 p-1 bg-purple-50/80 rounded-xl border border-purple-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSpecialistMode('per-service')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
                      specialistMode === 'per-service'
                        ? 'bg-[#5A2EA6] text-white shadow-3xs'
                        : 'bg-transparent text-soft hover:text-ink',
                    )}
                  >
                    🎯 Per-Service Specialist
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpecialistMode('single-lead')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
                      specialistMode === 'single-lead'
                        ? 'bg-[#5A2EA6] text-white shadow-3xs'
                        : 'bg-transparent text-soft hover:text-ink',
                    )}
                  >
                    👤 Single Lead Specialist
                  </button>
                </div>
              </div>

              {isLoadingStaff ? (
                <div className="p-12 text-center text-muted flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#5A2EA6] animate-spin" />
                  <span>Loading specialists from people_db...</span>
                </div>
              ) : branchStaff.length === 0 ? (
                <div className="p-8 text-center bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                  <UserCheck className="w-8 h-8 text-purple-400 mx-auto" />
                  <p className="text-xs text-muted font-medium">
                    No active staff records currently assigned to this branch in the database.
                  </p>
                  <span className="text-[11px] text-soft">
                    You may proceed to schedule with auto-allocated specialist.
                  </span>
                </div>
              ) : specialistMode === 'per-service' ? (
                /* Mode A: Per-Service Specialist Assignment */
                <div className="space-y-3.5">
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-[11.5px]">
                    <span className="font-bold text-[#5A2EA6]">
                      {selectedServices.length} Treatment
                      {selectedServices.length > 1 ? 's' : ''} in Basket:
                    </span>
                    <span className="text-muted font-medium">
                      Choose dedicated specialist for each specific treatment
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedServices.map((srv, idx) => {
                      const assignedId = serviceStaffMap[srv.name] || branchStaff[0]?.id;
                      const assignedStaff =
                        branchStaff.find((st) => st.id === assignedId) || branchStaff[0];

                      return (
                        <div
                          key={srv.name}
                          className="p-4 rounded-2xl bg-white border border-purple-100 shadow-3xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 pb-2.5">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold grid place-items-center">
                                  {idx + 1}
                                </span>
                                <strong className="text-xs text-ink font-bold">{srv.name}</strong>
                              </div>
                              <span className="text-[10.5px] text-[#5A2EA6] font-bold ml-7">
                                {srv.category} · {srv.duration} mins · ₹
                                {srv.price.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-muted uppercase font-bold">
                                Assigned:
                              </span>
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-[#5A2EA6] font-bold text-xs border border-purple-200">
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>{assignedStaff?.fullName || 'Specialist'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Staff Grid for this service */}
                          <div>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">
                              Choose Specialist:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {branchStaff.map((st) => {
                                const isSelected = assignedId === st.id;
                                return (
                                  <div
                                    key={st.id}
                                    onClick={() => {
                                      setServiceStaffMap((prev) => ({
                                        ...prev,
                                        [srv.name]: st.id,
                                      }));
                                      setLeadStaffId(st.id);
                                    }}
                                    className={cn(
                                      'p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 select-none',
                                      isSelected
                                        ? 'bg-purple-50/90 border-[#5A2EA6] shadow-3xs'
                                        : 'bg-white border-slate-200 hover:border-purple-200',
                                    )}
                                  >
                                    <Avatar
                                      initials={
                                        st.avatarInitials ||
                                        st.fullName.slice(0, 2).toUpperCase()
                                      }
                                      className="w-7 h-7 rounded-full bg-purple-100 text-[#5A2EA6] text-[9.5px] font-bold shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <strong className="text-[11px] text-ink font-bold block truncate">
                                        {st.fullName}
                                      </strong>
                                      <span className="text-[9.5px] text-muted block truncate">
                                        {st.role || st.jobTitle || 'Specialist'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Mode B: Single Lead Specialist */
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11.5px] text-purple-900">
                    The chosen lead specialist will execute all treatments in the basket.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {branchStaff.map((st) => {
                      const isSelected = leadStaffId === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => {
                            setLeadStaffId(st.id);
                            setServiceStaffMap((prev) => {
                              const next: Record<string, string> = {};
                              selectedServices.forEach((s) => {
                                next[s.name] = st.id;
                              });
                              return next;
                            });
                          }}
                          className={cn(
                            'p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 select-none',
                            isSelected
                              ? 'bg-purple-50/80 border-[#5A2EA6] shadow-xs'
                              : 'bg-white border-purple-100 hover:border-purple-200',
                          )}
                        >
                          <Avatar
                            initials={
                              st.avatarInitials || st.fullName.slice(0, 2).toUpperCase()
                            }
                            className="w-10 h-10 rounded-full bg-purple-100 text-[#5A2EA6] text-xs font-bold shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <strong className="text-xs text-ink font-bold truncate">
                                {st.fullName}
                              </strong>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-[#5A2EA6] text-white grid place-items-center text-[10px]">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted block truncate">
                              {st.role || st.jobTitle || 'Specialist'}
                            </span>
                            <span className="text-[9.5px] text-emerald-700 font-bold block mt-0.5">
                              ● {st.status || 'Active'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP: SCHEDULE */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-ink text-sm">
                    Step {currentStep}: Select Appointment Date &amp; Time Slot
                  </h4>
                  <p className="text-[11px] text-muted">
                    Slots aligned with {selectedBranchName || selectedBranchObj?.name || 'Salon'} operating hours (
                    {selectedBranchObj?.workingHours || '09:00 AM - 09:00 PM'}).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomTimeMode(!isCustomTimeMode)}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] text-xs font-bold transition-all flex items-center gap-1 border border-purple-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCustomTimeMode ? 'Close Manual Slot' : 'Create Custom Slot'}</span>
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Custom Slot Creator */}
              {isCustomTimeMode && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50/40 border border-purple-200 space-y-3 animate-in zoom-in-95 duration-150 shadow-3xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#5A2EA6]" />
                      <strong className="text-xs text-ink font-bold">
                        Create Custom Precision Time Slot
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                    <div>
                      <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Hour
                      </label>
                      <select
                        value={customHour}
                        onChange={(e) => setCustomHour(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink outline-none cursor-pointer"
                      >
                        {[
                          '08',
                          '09',
                          '10',
                          '11',
                          '12',
                          '01',
                          '02',
                          '03',
                          '04',
                          '05',
                          '06',
                          '07',
                          '08',
                          '09',
                        ].map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Minute
                      </label>
                      <select
                        value={customMinute}
                        onChange={(e) => setCustomMinute(e.target.value)}
                        className="w-full h-9 px-2.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink outline-none cursor-pointer"
                      >
                        {['00', '10', '15', '20', '30', '40', '45', '50'].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                        Period
                      </label>
                      <select
                        value={customMeridiem}
                        onChange={(e) => setCustomMeridiem(e.target.value as any)}
                        className="w-full h-9 px-2.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-ink outline-none cursor-pointer"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyManualSlot}
                      disabled={customSlotStatus.isBooked}
                      className={cn(
                        'h-9 px-4 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer border-0',
                        customSlotStatus.isBooked
                          ? 'bg-rose-200 text-rose-700 cursor-not-allowed'
                          : 'bg-[#5A2EA6] text-white hover:bg-[#4a2489]',
                      )}
                    >
                      {customSlotStatus.isBooked
                        ? `Busy till ${customSlotStatus.bookedUntil}`
                        : 'Apply Slot'}
                    </button>
                  </div>

                  {/* Real-time Custom Slot Conflict Feedback */}
                  {customSlotStatus.isBooked ? (
                    <div className="mt-2.5 p-2.5 px-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-medium">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          ⚠️ <strong>{customSlotTime}</strong> overlaps: {leadStaffObj?.fullName || 'Stylist'} is booked from <strong>{customSlotStatus.bookedFrom}</strong> till <strong>{customSlotStatus.bookedUntil}</strong> ({customSlotStatus.bookedDurationMinutes}m).
                        </span>
                      </div>
                      <span className="text-[10.5px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md shrink-0 border border-rose-200">
                        Stylist Free at {customSlotStatus.bookedUntil}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between gap-2 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          ✓ <strong>{customSlotTime}</strong> is Available! Treatment timeline: <strong>{customSlotTime}</strong> → <strong>{calculateEndTime(customSlotTime, totalDuration)}</strong> ({totalDuration}m).
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md shrink-0">
                        Ready to Apply
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Specialist Live Availability Status Header */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7FF] border border-[#5A2EA6]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs flex items-center justify-center border border-purple-200 shrink-0">
                    {leadStaffObj?.fullName ? leadStaffObj.fullName.slice(0, 2).toUpperCase() : 'SP'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-ink">
                        {leadStaffObj?.fullName || 'Assigned Specialist'}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        Live Diary
                      </span>
                    </div>
                    <p className="text-[10.5px] text-muted">
                      Checking conflicts for {appointmentDate} · {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} ({Math.max(15, totalDuration)}m)
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2.5 text-[11px] font-semibold text-soft shrink-0">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Free</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Booked</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#5A2EA6]" />
                    <span>Selected</span>
                  </span>
                </div>
              </div>

              {/* Stylist Booked Windows Duration Strip */}
              {activeSpecialistBusyWindows.length > 0 && (
                <div className="p-2.5 px-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-3xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3 text-rose-600" />
                      Stylist Booked Windows:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activeSpecialistBusyWindows.map((bw, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-white border border-rose-300 text-rose-800 text-[11px] font-bold shadow-3xs flex items-center gap-1"
                        >
                          <span>🔒</span>
                          <span>{bw.start} till {bw.end}</span>
                          <span className="text-rose-500 font-semibold">({bw.duration}m)</span>
                          {bw.clientName && bw.clientName !== 'Guest' && bw.clientName !== 'Booked Guest' ? (
                            <span className="text-rose-600 font-normal">· {bw.clientName}</span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10.5px] text-rose-600 font-medium shrink-0">
                    Available before or after these windows
                  </span>
                </div>
              )}

              {/* Conflict Warning Banner if Selected Slot is Booked */}
              {selectedSlotStatus.isBooked && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <h5 className="font-bold text-rose-900 text-sm">
                      ⚠️ Schedule Conflict: {leadStaffObj?.fullName || 'Stylist'} is Unavailable at {appointmentTime}
                    </h5>
                    <p className="text-[11.5px] text-rose-800">
                      {leadStaffObj?.fullName || 'Stylist'} is booked from{' '}
                      <strong className="font-bold text-rose-950 underline decoration-rose-400">
                        {selectedSlotStatus.bookedFrom || appointmentTime}
                      </strong>{' '}
                      till{' '}
                      <strong className="font-bold text-rose-950 underline decoration-rose-400">
                        {selectedSlotStatus.bookedUntil || 'the end of service'}
                      </strong>{' '}
                      {selectedSlotStatus.bookedDurationMinutes ? `(${selectedSlotStatus.bookedDurationMinutes} mins duration)` : ''}
                      {selectedSlotStatus.conflictingClient ? ` for ${selectedSlotStatus.conflictingClient}` : ''}.
                    </p>
                    <p className="text-[11px] text-rose-700 font-medium">
                      Stylist will be free starting at{' '}
                      <strong className="text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                        {selectedSlotStatus.bookedUntil}
                      </strong>
                      . Please choose a slot at or after {selectedSlotStatus.bookedUntil}, or pick any slot marked Free.
                    </p>
                  </div>
                </div>
              )}

              {/* Time Slots Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Available Starting Slots *
                  </label>
                  {isLoadingAvailability && (
                    <span className="text-[10.5px] text-muted flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-[#5A2EA6]" /> Checking live slots...
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {timeSlots.map((slot) => {
                    const status = getSlotStatus(slot);
                    const isBooked = status.isBooked;
                    const isSelected = appointmentTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          if (isBooked) {
                            toast(
                              `⚠️ ${leadStaffObj?.fullName || 'Stylist'} is booked from ${status.bookedFrom || slot} till ${status.bookedUntil || 'end of service'}${status.bookedDurationMinutes ? ` (${status.bookedDurationMinutes} mins)` : ''}. Stylist is free at ${status.bookedUntil}.`,
                            );
                            return;
                          }
                          setAppointmentTime(slot);
                        }}
                        title={
                          isBooked
                            ? `Unavailable: ${leadStaffObj?.fullName || 'Stylist'} is booked from ${status.bookedFrom || slot} till ${status.bookedUntil || 'end of service'}${status.bookedDurationMinutes ? ` (${status.bookedDurationMinutes}m)` : ''}`
                            : `Select ${slot} (Available)`
                        }
                        className={cn(
                          'min-h-[46px] py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-between px-3 select-none relative',
                          isBooked
                            ? 'bg-rose-50/70 border-rose-200 text-rose-700 cursor-not-allowed opacity-85'
                            : isSelected
                              ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs cursor-pointer'
                              : 'bg-white text-ink border-purple-100 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer',
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Clock
                            className={cn(
                              'w-3.5 h-3.5 shrink-0',
                              isBooked ? 'text-rose-500' : isSelected ? 'text-white' : 'text-[#5A2EA6]',
                            )}
                          />
                          <div className="flex flex-col text-left leading-tight truncate">
                            <span
                              className={cn(
                                'truncate text-xs',
                                isBooked
                                  ? 'line-through decoration-rose-400 font-bold text-rose-800'
                                  : 'font-bold',
                              )}
                            >
                              {slot}
                            </span>
                            {isBooked && status.bookedUntil ? (
                              <span className="text-[9.5px] font-extrabold text-rose-600 truncate">
                                till {status.bookedUntil}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-0.5 shrink-0 ml-1.5">
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase shrink-0',
                              isBooked
                                ? 'bg-rose-100 text-rose-700'
                                : isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                            )}
                          >
                            {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Free'}
                          </span>
                          {isBooked && status.bookedDurationMinutes ? (
                            <span className="text-[8.5px] font-bold text-rose-500/90 leading-none">
                              {status.bookedDurationMinutes}m
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* End Time Estimation Callout */}
              <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-100 flex items-center justify-between text-xs">
                <span className="text-muted font-medium">
                  Estimated Timeline: <strong>{appointmentTime}</strong> →{' '}
                  <strong className="text-[#5A2EA6]">
                    {calculateEndTime(appointmentTime, totalDuration)}
                  </strong>
                </span>
                <span className="text-[#5A2EA6] font-bold bg-white px-2.5 py-0.5 rounded-lg border border-purple-200 text-[10.5px]">
                  Total Treatment Time: {totalDuration} minutes
                </span>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP: DYNAMIC ALLOCATIONS (BRANCH_RESOURCES) */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'allocations' && (
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-ink text-sm">
                    {serviceMode === 'Home Service'
                      ? `Step ${currentStep}: Home Service Logistics & Mobile Fleet Kit`
                      : `Step ${currentStep}: Real Salon Resource & Station Allocation`}
                  </h4>
                  <p className="text-[11px] text-muted">
                    {serviceMode === 'Home Service'
                      ? 'Configure mobile sanitized equipment kit and pre-dispatch buffer windows.'
                      : `Dynamic rooms, styling chairs, and equipment loaded from organization_db for ${selectedBranchName || selectedBranchObj?.name || 'this salon'}.`}
                  </p>
                </div>

                {serviceMode === 'In-Salon' && (
                  <div className="flex items-center gap-1 p-1 bg-purple-50/80 rounded-xl border border-purple-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setResourceAllocationMode('per-service')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
                        resourceAllocationMode === 'per-service'
                          ? 'bg-[#5A2EA6] text-white shadow-3xs'
                          : 'bg-transparent text-soft hover:text-ink',
                      )}
                    >
                      🎯 Per-Service Station
                    </button>
                    <button
                      type="button"
                      onClick={() => setResourceAllocationMode('single-station')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
                        resourceAllocationMode === 'single-station'
                          ? 'bg-[#5A2EA6] text-white shadow-3xs'
                          : 'bg-transparent text-soft hover:text-ink',
                      )}
                    >
                      🏢 Single Station All
                    </button>
                  </div>
                )}
              </div>

              {serviceMode === 'Home Service' ? (
                /* Home Service Mobile Kit Allocation */
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1.5">
                        Sanitized Portable Equipment Kit
                      </label>
                      <select
                        value={portableKitId}
                        onChange={(e) => setPortableKitId(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      >
                        <option value="Portable Sanitized Hydra/Spa Kit #HK-04 (UV Sterilized)">
                          Portable Sanitized Hydra/Spa Kit #HK-04 (UV Sterilized)
                        </option>
                        <option value="Mobile Barbering & Grooming Roll-Case #MB-02">
                          Mobile Barbering & Grooming Roll-Case #MB-02
                        </option>
                        <option value="Doorstep Aromatherapy & Massage Folding Bed #DB-01">
                          Doorstep Aromatherapy & Massage Folding Bed #DB-01
                        </option>
                        <option value="Portable Nail Art & Gel Extensions Kit #NK-03">
                          Portable Nail Art & Gel Extensions Kit #NK-03
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1.5">
                        Travel Logistics &amp; Buffer Window
                      </label>
                      <select
                        value={travelBufferWindow}
                        onChange={(e) => setTravelBufferWindow(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none"
                      >
                        <option value="30 mins pre-dispatch travel buffer">
                          30 mins pre-dispatch travel buffer
                        </option>
                        <option value="45 mins traffic buffer (Peak hours)">
                          45 mins traffic buffer (Peak hours)
                        </option>
                        <option value="15 mins hyper-local radius buffer">
                          15 mins hyper-local radius buffer
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1.5">
                        Conveyance Fee Allocation
                      </label>
                      <div className="w-full h-11 px-3 rounded-xl border border-amber-200 bg-white text-xs font-bold text-ink flex items-center justify-between">
                        <span>Doorstep Travel &amp; Sterilization Surcharge</span>
                        <span className="text-amber-800">₹{travelSurcharge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-amber-700" />
                      <span>
                        Specialist team will be dispatched from {selectedBranchObj?.name} with UV
                        Sterilized Kit.
                      </span>
                    </div>
                    <span className="font-bold text-[10.5px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      ✓ Ready for Dispatch
                    </span>
                  </div>
                </div>
              ) : isLoadingResources ? (
                <div className="p-12 text-center text-muted flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 text-[#5A2EA6] animate-spin" />
                  <span>Loading salon resources from organization_db...</span>
                </div>
              ) : resourceAllocationMode === 'per-service' ? (
                /* Mode A: Per-Service Station Allocation */
                <div className="space-y-3.5">
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between text-[11.5px]">
                    <span className="font-bold text-[#5A2EA6]">
                      Resource Routing for {selectedServices.length} Treatment
                      {selectedServices.length > 1 ? 's' : ''}:
                    </span>
                    <span className="text-muted font-medium">
                      Select room, chair, and device station from {selectedBranchObj?.name}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedServices.map((srv, idx) => {
                      const currentAlloc = serviceResourceMap[srv.name] || {
                        room: availableRooms[0],
                        chair: availableChairs[0],
                        equipment: availableEquipment[0],
                      };

                      return (
                        <div
                          key={srv.name}
                          className="p-4.5 rounded-2xl bg-white border border-purple-100 shadow-3xs space-y-3.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 pb-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold grid place-items-center">
                                {idx + 1}
                              </span>
                              <div>
                                <strong className="text-xs text-ink font-bold">{srv.name}</strong>
                                <span className="text-[10px] text-[#5A2EA6] font-bold ml-2">
                                  ({srv.category} · {srv.duration} mins)
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              ✨ Live Branch Allocations
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            {/* Treatment Room */}
                            <div>
                              <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-[#5A2EA6]" />
                                <span>Treatment Room / Suite</span>
                              </label>
                              <select
                                value={currentAlloc.room}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setServiceResourceMap((prev) => ({
                                    ...prev,
                                    [srv.name]: {
                                      ...prev[srv.name],
                                      room: val,
                                    },
                                  }));
                                }}
                                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                              >
                                {availableRooms.map((rm) => (
                                  <option key={rm} value={rm}>
                                    {rm}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Styling Chair / Bed */}
                            <div>
                              <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                                <Armchair className="w-3 h-3 text-[#5A2EA6]" />
                                <span>Styling / Treatment Chair</span>
                              </label>
                              <select
                                value={currentAlloc.chair}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setServiceResourceMap((prev) => ({
                                    ...prev,
                                    [srv.name]: {
                                      ...prev[srv.name],
                                      chair: val,
                                    },
                                  }));
                                }}
                                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                              >
                                {availableChairs.map((ch) => (
                                  <option key={ch} value={ch}>
                                    {ch}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Equipment */}
                            <div>
                              <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                                <Cpu className="w-3 h-3 text-[#5A2EA6]" />
                                <span>Equipment Device</span>
                              </label>
                              <select
                                value={currentAlloc.equipment}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setServiceResourceMap((prev) => ({
                                    ...prev,
                                    [srv.name]: {
                                      ...prev[srv.name],
                                      equipment: val,
                                    },
                                  }));
                                }}
                                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                              >
                                {availableEquipment.map((eq) => (
                                  <option key={eq} value={eq}>
                                    {eq}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Mode B: Single Station for All */
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-[11.5px] text-purple-900">
                    All {selectedServices.length} booked treatments will be performed at this single
                    station suite.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Treatment Room
                      </label>
                      <select
                        value={singleRoom}
                        onChange={(e) => setSingleRoom(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      >
                        {availableRooms.map((rm) => (
                          <option key={rm} value={rm}>
                            {rm}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Styling / Treatment Chair
                      </label>
                      <select
                        value={singleChair}
                        onChange={(e) => setSingleChair(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      >
                        {availableChairs.map((ch) => (
                          <option key={ch} value={ch}>
                            {ch}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Equipment
                      </label>
                      <select
                        value={singleEquipment}
                        onChange={(e) => setSingleEquipment(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      >
                        {availableEquipment.map((eq) => (
                          <option key={eq} value={eq}>
                            {eq}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP: BILLING & PAYMENT */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'billing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-ink text-sm">
                    Step {currentStep}: Billing Estimate &amp; Deposit Policy
                  </h4>
                  <p className="text-[11px] text-muted">
                    Configure dynamically selective advance tokens, payment collection methods, and notes.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 border border-purple-100 text-[11px] font-bold text-[#5A2EA6]">
                  <span>Total Bill: ₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dynamic Advance Payment Selector */}
              <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-3xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                      Select Advance Payment Policy
                    </label>
                    <span className="text-[11px] text-muted font-medium">
                      Choose dynamic deposit percentage or enter custom token amount
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-purple-50/70 px-2.5 py-1 rounded-lg border border-purple-100">
                    Selected Deposit: {depositAmount === 0 ? 'No Advance (0%)' : `₹${depositAmount.toLocaleString('en-IN')} (${effectiveDepositPercent}%)`}
                  </span>
                </div>

                {/* Percentage / Preset Pills Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {[
                    { key: '0', label: '0%', desc: 'No Advance' },
                    { key: '10', label: '10%', desc: `₹${Math.round(totalAmount * 0.1).toLocaleString('en-IN')}` },
                    { key: '20', label: '20%', desc: `₹${Math.round(totalAmount * 0.2).toLocaleString('en-IN')}` },
                    { key: '25', label: '25%', desc: 'Standard' },
                    { key: '50', label: '50%', desc: 'Half Bill' },
                    { key: '100', label: '100%', desc: 'Full Payment' },
                    { key: 'custom', label: 'Custom', desc: 'Custom ₹' },
                  ].map((preset) => {
                    const isSelected = depositPreset === preset.key;
                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => {
                          setDepositPreset(preset.key as DepositPreset);
                          if (preset.key === 'custom' && !customDepositValue) {
                            setCustomDepositValue(
                              depositAmount > 0
                                ? String(depositAmount)
                                : String(Math.round(totalAmount * 0.25)),
                            );
                          }
                        }}
                        className={cn(
                          'px-2 py-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center select-none',
                          isSelected
                            ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                            : 'bg-purple-50/40 text-slate-700 border-purple-100 hover:border-purple-300 hover:bg-purple-50/80',
                        )}
                      >
                        <span className={cn('text-xs font-bold leading-tight', isSelected ? 'text-white' : 'text-ink')}>
                          {preset.label}
                        </span>
                        <span
                          className={cn(
                            'text-[9.5px] truncate max-w-full block mt-0.5',
                            isSelected ? 'text-purple-100 font-medium' : 'text-muted',
                          )}
                        >
                          {preset.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Token Input */}
                {depositPreset === 'custom' && (
                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-[#5A2EA6] whitespace-nowrap">
                        Custom Deposit Amount:
                      </span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">₹</span>
                        <input
                          type="number"
                          min="0"
                          max={totalAmount}
                          step="50"
                          value={customDepositValue}
                          onChange={(e) => setCustomDepositValue(e.target.value)}
                          placeholder={String(Math.round(totalAmount * 0.25))}
                          className="w-36 h-9 pl-7 pr-3 rounded-lg border border-purple-200 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6] focus:ring-1 focus:ring-[#5A2EA6]"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#5A2EA6]">
                        ({effectiveDepositPercent}% of total bill)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-muted text-[10.5px]">Quick fill:</span>
                      {[250, 500, 1000, 2000].filter((amt) => amt <= totalAmount).map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCustomDepositValue(String(amt))}
                          className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-ink text-[10.5px] font-semibold hover:bg-purple-100 hover:text-[#5A2EA6]"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Billing Summary Box */}
              <div className="p-4.5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-soft">Service Catalogue Total:</span>
                  <strong className="text-ink font-serif text-sm">
                    ₹{rawServiceAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                {serviceMode === 'Home Service' && (
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-900 font-semibold">
                      Home Service Travel &amp; Sanitation Surcharge:
                    </span>
                    <strong className="text-amber-900 font-serif text-sm">
                      +₹{travelSurcharge}
                    </strong>
                  </div>
                )}
                <div className="flex justify-between text-xs pt-1.5 border-t border-purple-200/60">
                  <span className="text-ink font-bold">Total Estimated Bill:</span>
                  <strong className="text-ink font-serif text-base">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-[#5A2EA6] font-bold flex items-center gap-1.5">
                    <span>Advance Token Deposit:</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6]">
                      {depositPreset === '0'
                        ? '0% (No Advance)'
                        : depositPreset === 'custom'
                        ? `Custom ${effectiveDepositPercent}%`
                        : `${depositPreset}%`}
                    </span>
                  </span>
                  <strong className="text-[#5A2EA6] font-serif text-sm">
                    ₹{depositAmount.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-purple-200/60 text-slate-700">
                  <span className="text-soft font-medium">
                    Remaining Balance Due on Completion:
                  </span>
                  <strong className="text-slate-800 font-serif text-sm">
                    ₹{remainingBalance.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Payment State
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Paid">Paid in Advance (Razorpay / UPI / Link)</option>
                    <option value="Pending Deposit">Pending Deposit SMS/WhatsApp Link</option>
                    <option value="Pay at Salon">Pay at Doorstep / Salon on Completion</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Booking Source Channel
                  </label>
                  <select
                    value={bookingSource}
                    onChange={(e) => setBookingSource(e.target.value as any)}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Walk-in">Walk-in Client</option>
                    <option value="Phone">Phone Booking</option>
                    <option value="WhatsApp">WhatsApp Concierge</option>
                    <option value="Website">Salon Website</option>
                    <option value="Online">Online Portal</option>
                    <option value="Call Centre">Call Centre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Special Client Instructions / Appointment Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Client requested quiet ambient treatment, sensitive skin precautions"
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* STEP: REVIEW & CONFIRM */}
          {/* ------------------------------------------------------------- */}
          {currentStepKey === 'review' && (
            <div className="space-y-4">
              <h4 className="font-bold text-ink text-sm">
                Step {currentStep}: Booking Summary &amp; Confirmation
              </h4>
              <div className="p-6 bg-white rounded-2xl border border-purple-100 shadow-sm space-y-4">
                {/* Service Mode Header Pill */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/80 border border-purple-100">
                  <div className="flex items-center gap-2">
                    {serviceMode === 'Home Service' ? (
                      <Home className="w-4 h-4 text-amber-700" />
                    ) : (
                      <Building2 className="w-4 h-4 text-[#5A2EA6]" />
                    )}
                    <span className="font-bold text-xs text-ink">
                      {serviceMode === 'Home Service'
                        ? 'Doorstep Home Service Concierge'
                        : 'Luxury In-Salon Appointment'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#5A2EA6] border border-purple-200">
                    {selectedBranchName || selectedBranchObj?.name} ({selectedBranchObj?.city})
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block">Client</span>
                    <strong className="text-ink text-xs block">{clientName}</strong>
                    <span className="text-[10.5px] text-soft">{clientMobile}</span>
                    {customerCode && (
                      <span className="text-[9.5px] text-[#5A2EA6] font-bold block mt-0.5">
                        {customerCode}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      {serviceMode === 'Home Service' ? 'Destination' : 'Branch Location'}
                    </span>
                    <strong className="text-ink text-xs block truncate">
                      {serviceMode === 'Home Service'
                        ? `${apartmentVilla || ''}, ${city || selectedBranchObj?.city}`
                        : selectedBranchName}
                    </strong>
                    <span className="text-[10.5px] text-soft truncate block">
                      {serviceMode === 'Home Service'
                        ? landmark || streetAddress
                        : selectedBranchObj?.address || primaryRoom}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Specialists ({uniqueSpecialists.length})
                    </span>
                    <strong className="text-ink text-xs block truncate">
                      {summaryStaffName}
                    </strong>
                    <span className="text-[10.5px] text-soft">
                      {specialistMode === 'per-service'
                        ? 'Allocated Per Service'
                        : 'Single Lead Specialist'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Schedule
                    </span>
                    <strong className="text-[#5A2EA6] text-xs block">{appointmentDate}</strong>
                    <span className="text-[10.5px] text-soft font-bold">
                      {appointmentTime} ({totalDuration}m)
                    </span>
                  </div>
                </div>

                {serviceMode === 'Home Service' && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        Full Doorstep Address: {apartmentVilla}, {streetAddress}, {landmark},{' '}
                        {city || selectedBranchObj?.city} - {pincode}
                      </span>
                    </div>
                    <div className="text-amber-800 text-[10.5px]">
                      Gate Notes: {gateEntryNotes || 'Direct Entry'} · Kit: {portableKitId}
                    </div>
                  </div>
                )}

                {/* Per-Service Breakdown Matrix */}
                <div className="pt-3 border-t border-purple-50 space-y-2.5">
                  <span className="text-[10px] text-muted uppercase font-bold block">
                    Treatment Protocols &amp; Live Station Allocations ({selectedServices.length}):
                  </span>
                  <div className="space-y-2">
                    {selectedServices.map((srv, idx) => {
                      const staffAssign = computedStaffAssignments[idx];
                      const resAlloc = computedResourceAllocations[idx];

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-[#5A2EA6] text-white text-[9px] font-bold grid place-items-center shrink-0">
                                {idx + 1}
                              </span>
                              <strong className="text-ink text-[12px]">{srv.name}</strong>
                              <span className="text-[10px] text-[#5A2EA6] font-bold">
                                ({srv.duration}m · ₹{srv.price.toLocaleString('en-IN')})
                              </span>
                            </div>
                            <div className="text-[10.5px] text-muted ml-5.5 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>
                                Suite: <strong>{resAlloc?.room}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Chair: <strong>{resAlloc?.chair}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Device: <strong>{resAlloc?.equipment}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-[#5A2EA6] font-bold text-[10.5px]">
                              <Avatar
                                initials={staffAssign?.avatarInitials || 'SP'}
                                className="w-4 h-4 rounded-full bg-purple-100 text-[#5A2EA6] text-[8px]"
                              />
                              <span>{staffAssign?.staffName || 'Specialist'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <span className="font-bold text-ink text-xs block">
                      Total Bill: ₹{totalAmount.toLocaleString('en-IN')} · Advance Deposit:{' '}
                      {depositAmount > 0 ? (
                        <span className="text-[#5A2EA6]">
                          ₹{depositAmount.toLocaleString('en-IN')} ({effectiveDepositPercent}%)
                        </span>
                      ) : (
                        <span className="text-slate-500 font-semibold">None (0%)</span>
                      )}
                    </span>
                    {depositAmount > 0 && remainingBalance > 0 && (
                      <span className="text-[10.5px] text-muted block mt-0.5">
                        Remaining balance due on completion: ₹{remainingBalance.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] self-start sm:self-auto">
                    Payment Status: {paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-7 py-4 border-t border-purple-50 flex items-center justify-between bg-white shrink-0">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className="h-10 px-4 rounded-xl text-xs font-bold text-soft border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleModalClose}
              className="h-10 px-4 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                disabled={isCreatingCustomer || (currentStepKey === 'schedule' && selectedSlotStatus.isBooked)}
                onClick={handleContinue}
                className={cn(
                  'h-10 px-6 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition-all',
                  currentStepKey === 'schedule' && selectedSlotStatus.isBooked
                    ? 'bg-rose-600 hover:bg-rose-700 cursor-not-allowed opacity-90'
                    : 'bg-[#5A2EA6] hover:bg-[#4a2489]',
                )}
              >
                {isCreatingCustomer ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Client...</span>
                  </>
                ) : currentStepKey === 'schedule' && selectedSlotStatus.isBooked ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                    <span>Stylist Booked till {selectedSlotStatus.bookedUntil || 'Later'}</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="h-10 px-7 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking in Database...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Book Appointment</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default NewAppointmentModal;
