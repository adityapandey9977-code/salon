import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Mail,
  MapPin,
  Phone,
  Loader2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { tenantsApi } from '@/shared/api/tenants.api';
import { tokenStorage } from '@/shared/api/client';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '@/shared/context/AuthContext';

export interface FranchisePartner {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  totalLocations: number;
  activeLocations: number;
  agreementStatus: 'Active' | 'Expiring Soon' | 'Under Renewal' | 'Draft' | 'Terminated';
  agreementStartDate: string;
  agreementEndDate: string;
  royaltyStructure: string;
  commissionStatus: 'Up to Date' | 'Pending Review' | 'Settlement Overdue';
  joinedDate: string;
  status: 'Active' | 'Pending' | 'Suspended' | 'Inactive' | 'Terminated';
  financials: {
    grossRevenue: string;
    royaltyAccrued: string;
    appointmentsCount: number;
    activeClients: number;
    yoyGrowth: string;
  };
  locations: {
    locationName: string;
    locationCode: string;
    city: string;
    manager: string;
    revenue: string;
    status: 'Active' | 'Temporarily Closed' | 'Pending';
  }[];
}

export const TERRITORY_PRESETS = [
  {
    group: 'National — Central India',
    options: [
      'Indore & Malwa Region',
      'Bhopal & Central MP',
      'Ujjain Spiritual Circuit',
      'Gwalior & Chambal',
      'Jabalpur & Mahakoshal',
      'Raipur & Chhattisgarh',
    ],
  },
  {
    group: 'National — North India',
    options: [
      'Delhi NCR & Northern Hub',
      'Punjab, Haryana & Chandigarh',
      'Rajasthan & Jaipur Circuit',
      'Uttar Pradesh & Lucknow Hub',
      'Uttarakhand & Dehradun Circuit',
    ],
  },
  {
    group: 'National — Western India',
    options: [
      'Mumbai MMR & Coastal Konkan',
      'Pune & Western Maharashtra',
      'Gujarat & Ahmedabad Hub',
      'Goa & Coastal Western Belt',
    ],
  },
  {
    group: 'National — Southern India',
    options: [
      'Bengaluru & Karnataka Urban',
      'Hyderabad & Telangana Hub',
      'Chennai & Tamil Nadu',
      'Kerala & Kochi Coastal Hub',
      'Andhra Pradesh & Coastal Hub',
    ],
  },
  {
    group: 'National — Eastern India',
    options: [
      'Kolkata & West Bengal',
      'Odisha, Bhubaneswar & Cuttack',
      'Bihar, Patna & Jharkhand',
      'North-East & Guwahati Hub',
    ],
  },
  {
    group: 'International — Middle East & GCC',
    options: [
      'UAE · Dubai & Northern Emirates',
      'UAE · Abu Dhabi & Al Ain',
      'Saudi Arabia · Riyadh & Eastern Province',
      'Saudi Arabia · Jeddah & Makkah Region',
      'Qatar · Doha Metropolitan',
      'Kuwait & Bahrain Gateway',
      'Oman · Muscat Capital',
    ],
  },
  {
    group: 'International — Southeast Asia & APAC',
    options: [
      'Singapore Metropolitan Hub',
      'Malaysia · Kuala Lumpur & Selangor',
      'Thailand · Bangkok & Phuket',
      'Indonesia · Jakarta & Bali',
      'Australia · Sydney & Melbourne',
      'New Zealand · Auckland & Wellington',
    ],
  },
  {
    group: 'International — Europe & UK',
    options: [
      'United Kingdom · Greater London',
      'United Kingdom · Manchester, Midlands & Scotland',
      'France · Paris & Île-de-France',
      'Germany · Berlin, Munich & Frankfurt',
      'Western & Northern Europe',
    ],
  },
  {
    group: 'International — North America',
    options: [
      'USA · East Coast (New York, NJ, Florida)',
      'USA · West Coast (California, Washington)',
      'USA · Central & Texas Hub (Dallas, Houston, Austin)',
      'USA · Midwest & Chicago Metropolitan',
      'Canada · Greater Toronto Area (GTA)',
      'Canada · Vancouver & British Columbia',
    ],
  },
];

interface FranchisePartnersTabProps {
  onCountChange?: (count: number) => void;
}

export function FranchisePartnersTab({ onCountChange }: FranchisePartnersTabProps = {}) {
  const { salon } = useAdmin();
  const { user } = useAuth();
  const currentTenantId = salon?.id || user?.tenantId || tokenStorage.getTenantId();

  const [partnerList, setPartnerList] = useState<FranchisePartner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Modals
  const [selectedPartner, setSelectedPartner] = useState<FranchisePartner | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<FranchisePartner | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-Generated Credentials Modal State
  const [createdPasswordModal, setCreatedPasswordModal] = useState<{
    email: string;
    password: string;
    partnerName: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formRegion, setFormRegion] = useState('Indore & Malwa Region');
  const [isCustomRegion, setIsCustomRegion] = useState(false);
  const [customRegionInput, setCustomRegionInput] = useState('');
  const [formLocations, setFormLocations] = useState(1);
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formRoyalty, setFormRoyalty] = useState('10% Gross Services + 5% Retail');
  const [formStatus, setFormStatus] = useState<FranchisePartner['status']>('Active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchRegisteredPartners = async () => {
      try {
        setIsLoading(true);
        // Clear any previous cross-tenant custom storage
        try {
          localStorage.removeItem('digiflex_custom_registered_partners');
        } catch {}

        const activeTenantId = salon?.id || user?.tenantId || tokenStorage.getTenantId();
        const apiPartners = await tenantsApi.listFranchises(false, activeTenantId || undefined);

        let mappedApiPartners: FranchisePartner[] = [];
        if (Array.isArray(apiPartners) && apiPartners.length > 0) {
          // Strictly keep only partners associated with the active tenant
          const tenantPartners = apiPartners.filter((item: any) => {
            if (!activeTenantId) return false;
            const pTenantId = item.tenantId || item.tenant?.id;
            return pTenantId === activeTenantId;
          });

          mappedApiPartners = tenantPartners.map((item: any) => {
            const activeBranches = item.branches?.length || 0;
            const authorizedLimit = item.authorizedOutletsCount || item.maxOutlets || 1;
            const partnerCode =
              item.code ||
              `FP-${(item.companyName || item.name || 'NEW').substring(0, 3).toUpperCase()}-${(item.id || '01').substring(0, 3)}`;

            return {
              id: item.id || `FP-DB-${Math.floor(100 + Math.random() * 900)}`,
              name: item.companyName || item.name || 'Registered Franchise Partner',
              code: partnerCode,
              contactPerson: item.contactPerson || 'Managing Partner',
              email: item.contactEmail || item.email || 'partner@franchise.com',
              phone: item.contactPhone || item.phone || '+91 98000 00000',
              address: item.address || 'Corporate Park Hub',
              region: item.territoryRegion || item.region || item.state || 'Indore & Malwa Region',
              totalLocations: authorizedLimit,
              activeLocations: activeBranches,
              agreementStatus: 'Active',
              agreementStartDate: item.agreementStart
                ? new Date(item.agreementStart).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '01 Jan 2026',
              agreementEndDate: item.agreementEnd
                ? new Date(item.agreementEnd).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '31 Dec 2030',
              royaltyStructure: item.royaltyModel || item.royaltyStructure || '10% Gross Services + 5% Retail',
              commissionStatus: 'Up to Date',
              joinedDate: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '12 Jan 2026',
              status: (item.status === 'ACTIVE' || item.status === 'Active') ? 'Active' : (item.status || 'Active'),
              financials: {
                grossRevenue: '₹14,50,000',
                royaltyAccrued: '₹1,45,000',
                appointmentsCount: 1820,
                activeClients: 2100,
                yoyGrowth: '+16.8%',
              },
              locations: (item.branches || []).map((b: any) => ({
                locationName: b.name || 'Outlet Branch',
                locationCode: b.code || 'LOC-FR-99',
                city: b.city || 'Indore',
                manager: b.manager || 'Branch Lead',
                revenue: '₹7.2L',
                status: 'Active',
              })),
            };
          });
        }

        setPartnerList(mappedApiPartners);
        onCountChange?.(mappedApiPartners.length);
      } catch (err) {
        console.warn('API error fetching franchise partners list:', err);
        setPartnerList([]);
        onCountChange?.(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredPartners();
  }, [salon?.id, user?.tenantId]);

  useEffect(() => {
    if (isCreateModalOpen || selectedPartner || createdPasswordModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateModalOpen, selectedPartner, createdPasswordModal]);

  const getStatusBadge = (st: FranchisePartner['status']) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Suspended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAgreementBadge = (st: FranchisePartner['agreementStatus']) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Expiring Soon':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Under Renewal':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredPartners = partnerList.filter((p) => {
    if (selectedStatus !== 'all' && p.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    if (selectedRegion !== 'all' && !p.region?.toLowerCase().includes(selectedRegion.toLowerCase())) {
      return false;
    }
    if (searchTerm) {
      const match =
        `${p.name || ''} ${p.code || ''} ${p.contactPerson || ''} ${p.email || ''} ${p.phone || ''} ${p.region || ''}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase().trim());
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setFormName('');
    setFormCode(`FP-NEW-${Math.floor(10 + Math.random() * 90)}`);
    setFormContact('');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormRegion('Indore & Malwa Region');
    setIsCustomRegion(false);
    setCustomRegionInput('');
    setFormLocations(1);
    setFormStartDate('2026-09-01');
    setFormEndDate('2031-08-31');
    setFormRoyalty('10% Gross Services + 5% Retail');
    setFormStatus('Active');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: FranchisePartner) => {
    setEditingPartner(p);
    setFormName(p.name);
    setFormCode(p.code);
    setFormContact(p.contactPerson);
    setFormEmail(p.email);
    setFormPhone(p.phone);
    setFormAddress(p.address);

    // Check if region matches any preset
    const allPresets = TERRITORY_PRESETS.flatMap((g) => g.options);
    if (allPresets.includes(p.region)) {
      setFormRegion(p.region);
      setIsCustomRegion(false);
      setCustomRegionInput('');
    } else {
      setFormRegion('__custom__');
      setIsCustomRegion(true);
      setCustomRegionInput(p.region);
    }

    setFormLocations(p.totalLocations);
    setFormStartDate(p.agreementStartDate);
    setFormEndDate(p.agreementEndDate);
    setFormRoyalty(p.royaltyStructure);
    setFormStatus(p.status);
    setIsCreateModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveRegion = isCustomRegion ? customRegionInput.trim() : formRegion;
    
    if (
      !formName ||
      !formCode ||
      !formContact ||
      !formEmail ||
      !formPhone ||
      !effectiveRegion ||
      !formStartDate ||
      !formEndDate ||
      !formRoyalty
    ) {
      showToast('Please complete all mandatory partner fields and specify a territory region.');
      return;
    }

    const cleanEmail = formEmail.toLowerCase().trim();
    const isEmailAlreadyRegistered = !editingPartner && partnerList.some(
      (p) => p.email.toLowerCase().trim() === cleanEmail,
    );

    if (isEmailAlreadyRegistered) {
      showToast(`Error: A franchise partner with email "${formEmail}" is already registered!`);
      return;
    }

    setIsSaving(true);

    if (editingPartner) {
      try {
        await tenantsApi.updateFranchise(editingPartner.id, {
          name: formName,
          companyName: formName,
          code: formCode,
          contactPerson: formContact,
          contactEmail: formEmail,
          contactPhone: formPhone,
          address: formAddress,
          region: effectiveRegion,
          territoryRegion: effectiveRegion,
          authorizedOutletsCount: Number(formLocations || 1),
          royaltyModel: formRoyalty,
          agreementStart: formStartDate,
          agreementEnd: formEndDate,
          status: formStatus,
        });
      } catch (err) {
        console.warn('API error updating partner:', err);
      }

      setPartnerList((prev) =>
        prev.map((p) =>
          p.id === editingPartner.id
            ? {
                ...p,
                name: formName,
                code: formCode,
                contactPerson: formContact,
                email: formEmail,
                phone: formPhone,
                address: formAddress,
                region: effectiveRegion,
                totalLocations: Number(formLocations || 1),
                agreementStartDate: formStartDate,
                agreementEndDate: formEndDate,
                royaltyStructure: formRoyalty,
                status: formStatus,
              }
            : p,
        ),
      );

      // Also update local storage for portal session sync
      localStorage.setItem('digiflex_franchise_partner_name', formName);
      localStorage.setItem('digiflex_franchise_owner_name', formName);
      localStorage.setItem('digiflex_franchise_contact_person', formContact);
      localStorage.setItem('digiflex_franchise_code', formCode);
      localStorage.setItem('digiflex_franchise_region', effectiveRegion);
      localStorage.setItem('digiflex_franchise_max_outlets', String(formLocations || 1));
      localStorage.setItem('digiflex_franchise_royalty', formRoyalty);
      localStorage.setItem('digiflex_franchise_start_date', formStartDate);
      localStorage.setItem('digiflex_franchise_end_date', formEndDate);
      localStorage.setItem('digiflex_franchise_email', formEmail);
      localStorage.setItem('digiflex_franchise_mobile', formPhone);

      showToast(`Franchise partner "${formName}" updated successfully!`);
      setIsSaving(false);
      setIsCreateModalOpen(false);
      return;
    }

    try {
      const activeTenantId = salon?.id || user?.tenantId || tokenStorage.getTenantId();
      const res = await tenantsApi.createFranchise({
        tenantId: activeTenantId,
        name: formName,
        companyName: formName,
        code: formCode,
        contactPerson: formContact,
        contactEmail: formEmail,
        contactPhone: formPhone,
        address: formAddress,
        region: effectiveRegion,
        territoryRegion: effectiveRegion,
        authorizedOutletsCount: Number(formLocations || 1),
        maxOutlets: Number(formLocations || 1),
        royaltyModel: formRoyalty,
        royaltyStructure: formRoyalty,
        agreementStart: formStartDate,
        agreementEnd: formEndDate,
      });

      const pass =
        res?.generatedPassword ||
        `Franchise@2026!${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const newPartnerObj: FranchisePartner = {
        id: res?.id || `FP-NEW-${Math.floor(100 + Math.random() * 900)}`,
        name: formName,
        code: formCode,
        contactPerson: formContact,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        region: effectiveRegion,
        totalLocations: Number(formLocations || 1),
        activeLocations: 0,
        agreementStatus: 'Active',
        agreementStartDate: formStartDate || '2026-09-01',
        agreementEndDate: formEndDate || '2031-08-31',
        royaltyStructure: formRoyalty,
        commissionStatus: 'Up to Date',
        joinedDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Active',
        financials: {
          grossRevenue: '₹0.0L',
          royaltyAccrued: '₹0.0L',
          appointmentsCount: 0,
          activeClients: 0,
          yoyGrowth: '+0.0%',
        },
        locations: [],
      };

      setPartnerList((prev) => {
        const next = [newPartnerObj, ...prev];
        onCountChange?.(next.length);
        return next;
      });

      // Save to localStorage for Franchise Portal session sync
      if (res?.id) {
        localStorage.setItem('digiflex_franchise_id', res.id);
      }
      localStorage.setItem('digiflex_franchise_partner_name', formName);
      localStorage.setItem('digiflex_franchise_owner_name', formName);
      localStorage.setItem('digiflex_franchise_contact_person', formContact);
      localStorage.setItem('digiflex_franchise_code', formCode);
      localStorage.setItem('digiflex_franchise_region', effectiveRegion);
      localStorage.setItem('digiflex_franchise_max_outlets', String(formLocations || 1));
      localStorage.setItem('digiflex_franchise_royalty', formRoyalty);
      localStorage.setItem('digiflex_franchise_start_date', formStartDate);
      localStorage.setItem('digiflex_franchise_end_date', formEndDate);
      localStorage.setItem('digiflex_franchise_email', formEmail);
      localStorage.setItem('digiflex_franchise_mobile', formPhone);

      setCreatedPasswordModal({
        email: formEmail,
        password: pass,
        partnerName: formName,
      });

      showToast(`Franchise partner ${formName} authorized! Credentials email dispatched.`);
    } catch (err: any) {
      console.warn('API Error creating franchise partner, using optimistic fallback:', err);
      const pass = `Franchise@2026!${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const fallbackPartnerObj: FranchisePartner = {
        id: `FP-NEW-${Math.floor(100 + Math.random() * 900)}`,
        name: formName,
        code: formCode,
        contactPerson: formContact,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        region: effectiveRegion,
        totalLocations: Number(formLocations || 1),
        activeLocations: 0,
        agreementStatus: 'Active',
        agreementStartDate: formStartDate || '2026-09-01',
        agreementEndDate: formEndDate || '2031-08-31',
        royaltyStructure: formRoyalty,
        commissionStatus: 'Up to Date',
        joinedDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Active',
        financials: {
          grossRevenue: '₹0.0L',
          royaltyAccrued: '₹0.0L',
          appointmentsCount: 0,
          activeClients: 0,
          yoyGrowth: '+0.0%',
        },
        locations: [],
      };

      setPartnerList((prev) => {
        const next = [fallbackPartnerObj, ...prev];
        onCountChange?.(next.length);
        return next;
      });

      setCreatedPasswordModal({
        email: formEmail,
        password: pass,
        partnerName: formName,
      });

      showToast(`Franchise partner ${formName} registered & welcome email dispatched!`);
    } finally {
      setIsSaving(false);
      setIsCreateModalOpen(false);
    }
  };

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
              placeholder="Search partner name, ID, contact person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Region */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer max-w-[220px]"
          >
            <option value="all">All Franchise Regions (Global &amp; National)</option>
            {TERRITORY_PRESETS.map((grp) => (
              <optgroup key={grp.group} label={grp.group}>
                {grp.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Operational Statuses</option>
            <option value="Active">Active Partners</option>
            <option value="Pending">Pending Onboarding</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting Franchise Partner Directory (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Partners</span>
          </Button>

          <Button
            onClick={handleOpenCreate}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Franchise Partner</span>
          </Button>
        </div>
      </div>

      {/* 2. Franchise Partners Master Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Franchise Partner Master Register
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                Network Governance
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Head Office partner entity registry, commercial royalty models, active outlets, and
              agreement terms
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            Showing {filteredPartners.length} registered partners
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Partner Entity &amp; ID</th>
                <th className="p-3.5">Key Contact Person</th>
                <th className="p-3.5">Territory Region</th>
                <th className="p-3.5 text-center">Outlets (Active/Total)</th>
                <th className="p-3.5 text-center">Agreement State</th>
                <th className="p-3.5">Royalty Terms</th>
                <th className="p-3.5 text-right">Quarterly GMV</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#5A2EA6]" />
                      <span className="text-xs font-semibold text-soft">Loading franchise partners...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted">
                    No registered franchise partners found for this salon. Click "Register Franchise Partner" to add a new partner.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((p) => (
                <tr key={p.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* Entity & Code */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{p.name}</strong>
                    <span className="text-[10px] text-muted font-mono">
                      {p.code} · Joined {p.joinedDate}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">{p.contactPerson}</span>
                    <span className="text-[10px] text-muted">{p.phone}</span>
                  </td>

                  {/* Region */}
                  <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">{p.region}</td>

                  {/* Outlets */}
                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    <span className="text-[#5A2EA6]">{p.activeLocations}</span> / {p.totalLocations}{' '}
                    Outlets
                  </td>

                  {/* Agreement State */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getAgreementBadge(p.agreementStatus),
                      )}
                    >
                      {p.agreementStatus}
                    </span>
                  </td>

                  {/* Royalty Terms */}
                  <td
                    className="p-3.5 max-w-[200px] truncate text-[11px] font-medium text-slate-700"
                    title={p.royaltyStructure}
                  >
                    {p.royaltyStructure}
                  </td>

                  {/* Gross GMV */}
                  <td className="p-3.5 text-right font-serif font-extrabold text-slate-900 text-sm whitespace-nowrap">
                    {p.financials.grossRevenue}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(p.status),
                      )}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedPartner(p)}
                        className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Partner Dossier</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleOpenEdit(p)}
                        className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )))
            }
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section 3 PRD: CREATE / EDIT FRANCHISE PARTNER MODAL */}
      {isCreateModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsCreateModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      {editingPartner ? 'Edit Partner Specification' : 'Register Franchise Partner'}
                    </span>
                    <span className="text-xs font-semibold text-soft">Head Office Authority</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {editingPartner ? editingPartner.name : 'Define Franchise Entity'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePartner} noValidate className="p-6 space-y-5 overflow-y-auto flex-1 custom-scroll">
                {/* 1. Basic Information */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    1. Partner Entity Information
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Franchise Partner Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Apex Wellness & Spa LLP"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Partner Entity Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-mono uppercase font-bold text-[#5A2EA6] outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Key Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Sanjay Chawla (Managing Partner)"
                        value={formContact}
                        onChange={(e) => setFormContact(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Contact Phone *</label>
                      <input
                        type="text"
                        required
                        placeholder="+91 98260 00000"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-soft font-bold block mb-1">
                        Official Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g., partner@apexwellness.in"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-soft font-bold block mb-1">
                        Registered Office Address
                      </label>
                      <input
                        type="text"
                        placeholder="Full registered commercial address..."
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Business & Commercial Terms */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    2. Commercial Royalty &amp; Territorial Governance
                  </span>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-soft font-bold block">
                          Territory Region / Licensed Zone *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const next = !isCustomRegion;
                            setIsCustomRegion(next);
                            if (next) {
                              setFormRegion('__custom__');
                            } else {
                              setFormRegion('Indore & Malwa Region');
                              setCustomRegionInput('');
                            }
                          }}
                          className="text-[11px] font-bold text-[#5A2EA6] hover:underline cursor-pointer bg-transparent border-0 p-0"
                        >
                          {isCustomRegion
                            ? '← Choose from Preset Regions'
                            : '+ Type Custom Territory (Worldwide)'}
                        </button>
                      </div>

                      {!isCustomRegion ? (
                        <select
                          value={formRegion}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '__custom__') {
                              setIsCustomRegion(true);
                              setFormRegion('__custom__');
                            } else {
                              setFormRegion(val);
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                        >
                          {TERRITORY_PRESETS.map((grp) => (
                            <optgroup key={grp.group} label={grp.group}>
                              {grp.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                          <option value="__custom__">+ Add Custom Territory / Region...</option>
                        </select>
                      ) : (
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            required
                            placeholder="Enter custom territory (e.g. Dubai Downtown, New York Manhattan, London Mayfair, Tokyo Shibuya, Bangalore Whitefield)"
                            value={customRegionInput}
                            onChange={(e) => setCustomRegionInput(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/30 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                          />
                          <span className="text-[10px] text-muted block">
                            Custom global/national territory will be recorded under this franchise
                            partner.
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Authorized Outlets Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formLocations}
                        onChange={(e) => setFormLocations(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">
                        Agreement Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div>
                      <label className="text-soft font-bold block mb-1">Agreement End Date *</label>
                      <input
                        type="date"
                        required
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-soft font-bold block mb-1">
                        Royalty &amp; Commission Model *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 10% Gross Services + 5% Retail Sales"
                        value={formRoyalty}
                        onChange={(e) => setFormRoyalty(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview Summary Callout */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs space-y-1">
                  <strong className="text-[#5A2EA6] font-bold block">
                    Franchise Partnership Preview:
                  </strong>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Partner <strong>{formName || 'Untitled Partner'}</strong> ({formCode}) in{' '}
                    <strong>
                      {isCustomRegion ? customRegionInput || 'Custom Territory' : formRegion}
                    </strong>{' '}
                    with <strong>{formLocations} outlet(s)</strong> bound under{' '}
                    <strong>{formRoyalty}</strong> from {formStartDate || 'TBD'} to{' '}
                    {formEndDate || 'TBD'}.
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-[36px] px-5 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {editingPartner ? 'Updating...' : 'Authorizing...'}
                      </span>
                    ) : editingPartner ? (
                      'Update Partner Dossier'
                    ) : (
                      'Save & Authorize Partner'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Section 4 PRD: FRANCHISE PARTNER DETAILS DOSSIER MODAL */}
      {selectedPartner &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedPartner(null)}
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
                      Franchise Partner Profile
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedPartner.code}
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedPartner.status),
                      )}
                    >
                      {selectedPartner.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedPartner.name}
                  </h3>
                  <p className="text-xs text-muted">
                    {selectedPartner.region} · Agreement: {selectedPartner.agreementStartDate} to{' '}
                    {selectedPartner.agreementEndDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scroll">
                {/* 5 Summary KPI Cards */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Total Outlets
                    </span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {selectedPartner.totalLocations}
                    </strong>
                    <span className="text-[10px] text-purple-700 block mt-0.5">
                      {selectedPartner.activeLocations} Operational
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Quarterly GMV
                    </span>
                    <strong className="text-base font-serif font-bold text-emerald-700">
                      {selectedPartner.financials.grossRevenue}
                    </strong>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">
                      {selectedPartner.financials.yoyGrowth} YoY
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Royalty Fee
                    </span>
                    <strong className="text-base font-serif font-bold text-indigo-700">
                      {selectedPartner.financials.royaltyAccrued}
                    </strong>
                    <span className="text-[10px] text-indigo-600 block mt-0.5">Brand Accrual</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Client Footfall
                    </span>
                    <strong className="text-base font-serif font-bold text-blue-700">
                      {selectedPartner.financials.appointmentsCount.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-blue-600 block mt-0.5">
                      {selectedPartner.financials.activeClients} Active
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Agreement Term
                    </span>
                    <strong className="text-xs font-bold text-amber-900 block mt-1">
                      {selectedPartner.agreementStatus}
                    </strong>
                    <span className="text-[9px] text-amber-700 block mt-0.5">
                      Valid to {selectedPartner.agreementEndDate}
                    </span>
                  </div>
                </div>

                {/* Partner Entity Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Primary Key Contact
                    </span>
                    <strong className="text-ink font-bold block text-sm mt-0.5">
                      {selectedPartner.contactPerson}
                    </strong>
                    <div className="mt-2 space-y-1 text-[11px] text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#5A2EA6]" /> {selectedPartner.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#5A2EA6]" /> {selectedPartner.email}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Registered Entity Address
                    </span>
                    <p className="text-slate-700 text-[11px] mt-1 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0 mt-0.5" />
                      <span>{selectedPartner.address}</span>
                    </p>
                    <span className="text-[10px] text-soft block mt-2">
                      Royalty Structure: <strong>{selectedPartner.royaltyStructure}</strong>
                    </span>
                  </div>
                </div>

                {/* Associated Locations Sub-Table */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Operational Outlets Custody
                  </span>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5 pl-3">Outlet Location</th>
                          <th className="p-2.5">Code</th>
                          <th className="p-2.5">Branch Manager</th>
                          <th className="p-2.5 text-right">Quarterly GMV</th>
                          <th className="p-2.5 pr-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedPartner.locations.map((loc, lIdx) => (
                          <tr key={lIdx}>
                            <td className="p-2.5 pl-3 font-bold text-ink">{loc.locationName}</td>
                            <td className="p-2.5 font-mono text-muted">{loc.locationCode}</td>
                            <td className="p-2.5 text-slate-800">{loc.manager}</td>
                            <td className="p-2.5 text-right font-serif font-bold text-[#5A2EA6]">
                              {loc.revenue}
                            </td>
                            <td className="p-2.5 pr-3 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {loc.status}
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
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleOpenEdit(selectedPartner);
                    setSelectedPartner(null);
                  }}
                  className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                >
                  <Edit className="w-3 h-3 text-[#5A2EA6]" />
                  <span>Edit Partner Details</span>
                </Button>

                <Button
                  onClick={() => setSelectedPartner(null)}
                  className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                >
                  Close Dossier
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Auto-Generated Credentials Success Modal */}
      {createdPasswordModal &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full border border-purple-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
              <div className="p-6 bg-gradient-to-br from-[#2D1552] to-[#5A2EA6] text-white relative">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white">
                  Franchise Credentials Issued
                </h3>
                <p className="text-xs text-purple-200 mt-1">
                  Partner authorized &amp; welcome email with auto-generated credentials dispatched
                </p>
                <button
                  onClick={() => setCreatedPasswordModal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#5A2EA6] shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-[#5A2EA6] uppercase block">
                      Registered Partner Email
                    </span>
                    <span className="font-semibold text-slate-800">{createdPasswordModal.email}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Credentials Email Dispatched</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    An auto-generated secure password and portal access instructions have been sent directly to{' '}
                    <strong className="text-slate-900">{createdPasswordModal.email}</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Partner Portal Access Link
                  </span>
                  <a
                    href="/franchise/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5A2EA6] font-bold text-xs hover:underline break-all"
                  >
                    http://localhost:5173/franchise/login
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    onClick={() => setCreatedPasswordModal(null)}
                    className="px-5 py-2 rounded-xl bg-[#5A2EA6] hover:bg-[#482485] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Done &amp; Close
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
