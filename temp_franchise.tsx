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

const mockPartners: FranchisePartner[] = [
  {
    id: 'FP-001',
    name: 'Apex Wellness & Spa LLP',
    code: 'FP-IND-01',
    contactPerson: 'Sanjay Chawla (Managing Partner)',
    email: 'sanjay.chawla@apexwellness.in',
    phone: '+91 98260 11450',
    address: 'Plot 42, Scheme 54, Vijay Nagar, Indore, MP - 452010',
    region: 'Indore & Malwa Region',
    totalLocations: 3,
    activeLocations: 3,
    agreementStatus: 'Active',
    agreementStartDate: '01 Jan 2024',
    agreementEndDate: '31 Dec 2028',
    royaltyStructure: '10% Gross Services + 5% Retail Sales',
    commissionStatus: 'Up to Date',
    joinedDate: '12 Jan 2024',
    status: 'Active',
    financials: {
      grossRevenue: 'â‚¹24,80,000',
      royaltyAccrued: 'â‚¹2,48,000',
      appointmentsCount: 3840,
      activeClients: 4200,
      yoyGrowth: '+18.2%',
    },
    locations: [
      {
        locationName: 'Indore Vijay Nagar Flagship',
        locationCode: 'LOC-FR-01',
        city: 'Indore, MP',
        manager: 'Sunita Rao',
        revenue: 'â‚¹14.2L',
        status: 'Active',
      },
      {
        locationName: 'Indore Palasia Premium Outlet',
        locationCode: 'LOC-FR-02',
        city: 'Indore, MP',
        manager: 'Amit Verma',
        revenue: 'â‚¹6.8L',
        status: 'Active',
      },
      {
        locationName: 'Indore Annapurna Centre',
        locationCode: 'LOC-FR-03',
        city: 'Indore, MP',
        manager: 'Priya Joshi',
        revenue: 'â‚¹3.8L',
        status: 'Active',
      },
    ],
  },
  {
    id: 'FP-002',
    name: 'Radiance Salon Ventures',
    code: 'FP-BHP-02',
    contactPerson: 'Mrs. Neha Kulkarni',
    email: 'neha@radiancesalons.com',
    phone: '+91 98930 22780',
    address: 'E-3/44, Arera Colony, Bhopal, MP - 462016',
    region: 'Bhopal & Central MP',
    totalLocations: 2,
    activeLocations: 2,
    agreementStatus: 'Active',
    agreementStartDate: '15 Mar 2024',
    agreementEndDate: '14 Mar 2029',
    royaltyStructure: '10% Flat Gross Turnover',
    commissionStatus: 'Settlement Overdue',
    joinedDate: '18 Mar 2024',
    status: 'Active',
    financials: {
      grossRevenue: 'â‚¹18,50,000',
      royaltyAccrued: 'â‚¹1,85,000',
      appointmentsCount: 2650,
      activeClients: 2900,
      yoyGrowth: '+14.5%',
    },
    locations: [
      {
        locationName: 'Bhopal Arera Colony Lounge',
        locationCode: 'LOC-FR-04',
        city: 'Bhopal, MP',
        manager: 'Kavita Nair',
        revenue: 'â‚¹12.1L',
        status: 'Active',
      },
      {
        locationName: 'Bhopal MP Nagar Studio',
        locationCode: 'LOC-FR-05',
        city: 'Bhopal, MP',
        manager: 'Rohit Pathak',
        revenue: 'â‚¹6.4L',
        status: 'Active',
      },
    ],
  },
  {
    id: 'FP-003',
    name: 'Mahakal Beauty Partners',
    code: 'FP-UJJ-03',
    contactPerson: 'Pt. Rameshwar Sharma',
    email: 'contact@mahakalbeauty.in',
    phone: '+91 98270 44321',
    address: '14, Freeganj Commercial Market, Ujjain, MP - 456001',
    region: 'Ujjain Spiritual Circuit',
    totalLocations: 2,
    activeLocations: 2,
    agreementStatus: 'Active',
    agreementStartDate: '01 Jun 2024',
    agreementEndDate: '31 May 2029',
    royaltyStructure: '8.5% Gross Services Turnover',
    commissionStatus: 'Up to Date',
    joinedDate: '04 Jun 2024',
    status: 'Active',
    financials: {
      grossRevenue: 'â‚¹14,20,000',
      royaltyAccrued: 'â‚¹1,42,000',
      appointmentsCount: 1980,
      activeClients: 2150,
      yoyGrowth: '+22.0%',
    },
    locations: [
      {
        locationName: 'Ujjain Freeganj Main',
        locationCode: 'LOC-FR-06',
        city: 'Ujjain, MP',
        manager: 'Devendra Vyas',
        revenue: 'â‚¹9.4L',
        status: 'Active',
      },
      {
        locationName: 'Ujjain Nanakheda Express',
        locationCode: 'LOC-FR-07',
        city: 'Ujjain, MP',
        manager: 'Meera Solanki',
        revenue: 'â‚¹4.8L',
        status: 'Active',
      },
    ],
  },
  {
    id: 'FP-004',
    name: 'Gwalior Royal Spa Co.',
    code: 'FP-GWL-04',
    contactPerson: 'Raja Vikramaditya Scindia (Partner)',
    email: 'info@gwaliorroyalspa.com',
    phone: '+91 98110 99820',
    address: 'Palace Road, City Centre, Gwalior, MP - 474011',
    region: 'Gwalior & Chambal',
    totalLocations: 2,
    activeLocations: 2,
    agreementStatus: 'Expiring Soon',
    agreementStartDate: '12 Sep 2021',
    agreementEndDate: '11 Sep 2026',
    royaltyStructure: '10% Flat Turnover Rate',
    commissionStatus: 'Pending Review',
    joinedDate: '12 Sep 2021',
    status: 'Active',
    financials: {
      grossRevenue: 'â‚¹12,40,000',
      royaltyAccrued: 'â‚¹1,24,000',
      appointmentsCount: 1720,
      activeClients: 1890,
      yoyGrowth: '+11.8%',
    },
    locations: [
      {
        locationName: 'Gwalior City Centre Hub',
        locationCode: 'LOC-FR-08',
        city: 'Gwalior, MP',
        manager: 'Akash Tomar',
        revenue: 'â‚¹8.1L',
        status: 'Active',
      },
      {
        locationName: 'Gwalior Lashkar Branch',
        locationCode: 'LOC-FR-09',
        city: 'Gwalior, MP',
        manager: 'Pooja Gupta',
        revenue: 'â‚¹4.3L',
        status: 'Active',
      },
    ],
  },
  {
    id: 'FP-005',
    name: 'Zenith Esthetics Pvt Ltd',
    code: 'FP-RPR-05',
    contactPerson: 'Deepak Agrawal (Director)',
    email: 'deepak@zenithesthetics.com',
    phone: '+91 98261 55660',
    address: 'Shankar Nagar Main Road, Raipur, CG - 492007',
    region: 'Raipur & Chhattisgarh',
    totalLocations: 1,
    activeLocations: 0,
    agreementStatus: 'Draft',
    agreementStartDate: '01 Sep 2026',
    agreementEndDate: '31 Aug 2031',
    royaltyStructure: '10% Gross Services + 5% Retail',
    commissionStatus: 'Pending Review',
    joinedDate: '15 Aug 2026',
    status: 'Pending',
    financials: {
      grossRevenue: 'â‚¹0',
      royaltyAccrued: 'â‚¹0',
      appointmentsCount: 0,
      activeClients: 0,
      yoyGrowth: 'New Entity',
    },
    locations: [
      {
        locationName: 'Raipur Shankar Nagar (Fit-out)',
        locationCode: 'LOC-FR-10',
        city: 'Raipur, CG',
        manager: 'Appointed',
        revenue: 'â‚¹0',
        status: 'Pending',
      },
    ],
  },
];

export const TERRITORY_PRESETS = [
  {
    group: 'National â€” Central India',
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
    group: 'National â€” North India',
    options: [
      'Delhi NCR & Northern Hub',
      'Punjab, Haryana & Chandigarh',
      'Rajasthan & Jaipur Circuit',
      'Uttar Pradesh & Lucknow Hub',
      'Uttarakhand & Dehradun Circuit',
    ],
  },
  {
    group: 'National â€” Western India',
    options: [
      'Mumbai MMR & Coastal Konkan',
      'Pune & Western Maharashtra',
      'Gujarat & Ahmedabad Hub',
      'Goa & Coastal Western Belt',
    ],
  },
  {
    group: 'National â€” Southern India',
    options: [
      'Bengaluru & Karnataka Urban',
      'Hyderabad & Telangana Hub',
      'Chennai & Tamil Nadu',
      'Kerala & Kochi Coastal Hub',
      'Andhra Pradesh & Coastal Hub',
    ],
  },
  {
    group: 'National â€” Eastern India',
    options: [
      'Kolkata & West Bengal',
      'Odisha, Bhubaneswar & Cuttack',
      'Bihar, Patna & Jharkhand',
      'North-East & Guwahati Hub',
    ],
  },
  {
    group: 'International â€” Middle East & GCC',
    options: [
      'UAE Â· Dubai & Northern Emirates',
      'UAE Â· Abu Dhabi & Al Ain',
      'Saudi Arabia Â· Riyadh & Eastern Province',
      'Saudi Arabia Â· Jeddah & Makkah Region',
      'Qatar Â· Doha Metropolitan',
      'Kuwait & Bahrain Gateway',
      'Oman Â· Muscat Capital',
    ],
  },
  {
    group: 'International â€” Southeast Asia & APAC',
    options: [
      'Singapore Metropolitan Hub',
      'Malaysia Â· Kuala Lumpur & Selangor',
      'Thailand Â· Bangkok & Phuket',
      'Indonesia Â· Jakarta & Bali',
      'Australia Â· Sydney & Melbourne',
      'New Zealand Â· Auckland & Wellington',
    ],
  },
  {
    group: 'International â€” Europe & UK',
    options: [
      'United Kingdom Â· Greater London',
      'United Kingdom Â· Manchester, Midlands & Scotland',
      'France Â· Paris & ÃŽle-de-France',
      'Germany Â· Berlin, Munich & Frankfurt',
      'Western & Northern Europe',
    ],
  },
  {
    group: 'International â€” North America',
    options: [
      'USA Â· East Coast (New York, NJ, Florida)',
      'USA Â· West Coast (California, Washington)',
      'USA Â· Central & Texas Hub (Dallas, Houston, Austin)',
      'USA Â· Midwest & Chicago Metropolitan',
      'Canada Â· Greater Toronto Area (GTA)',
      'Canada Â· Vancouver & British Columbia',
    ],
  },
];

interface FranchisePartnersTabProps {
  onCountChange?: (count: number) => void;
}

export function FranchisePartnersTab({ onCountChange }: FranchisePartnersTabProps = {}) {
  const [partnerList, setPartnerList] = useState<FranchisePartner[]>([]);
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
        const apiPartners = await tenantsApi.listFranchises();

        const storedCustomRaw = localStorage.getItem('digiflex_custom_registered_partners');
        let storedCustom: FranchisePartner[] = [];
        if (storedCustomRaw) {
          try {
            storedCustom = JSON.parse(storedCustomRaw);
          } catch (e) {
            console.warn('Failed to parse custom registered partners from localStorage:', e);
          }
        }

        let mappedApiPartners: FranchisePartner[] = [];
        if (Array.isArray(apiPartners) && apiPartners.length > 0) {
          mappedApiPartners = apiPartners.map((item: any) => {
            const locCount = item.branches?.length || 1;
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
              region: item.region || item.state || 'Indore & Malwa Region',
              totalLocations: locCount,
              activeLocations: locCount,
              agreementStatus: 'Active',
              agreementStartDate: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '01 Jan 2026',
              agreementEndDate: '31 Dec 2030',
              royaltyStructure: '10% Gross Services + 5% Retail',
              commissionStatus: 'Up to Date',
              joinedDate: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : '12 Jan 2026',
              status: 'Active',
              financials: {
                grossRevenue: 'â‚¹14,50,000',
                royaltyAccrued: 'â‚¹1,45,000',
                appointmentsCount: 1820,
                activeClients: 2100,
                yoyGrowth: '+16.8%',
              },
              locations: (item.branches || []).map((b: any) => ({
                locationName: b.name || 'Outlet Branch',
                locationCode: b.code || 'LOC-FR-99',
                city: b.city || 'Indore',
                manager: b.manager || 'Branch Lead',
                revenue: 'â‚¹7.2L',
                status: 'Active',
              })),
            };
          });
        }

        setPartnerList(() => {
          const list: FranchisePartner[] = [];
          const addedEmails = new Set<string>();

          // 1. Add DB partners first
          mappedApiPartners.forEach((p) => {
            const key = p.email.toLowerCase().trim();
            if (!addedEmails.has(key)) {
              addedEmails.add(key);
              list.push(p);
            }
          });

          // 2. Add custom partners saved in localStorage
          storedCustom.forEach((p) => {
            const key = p.email.toLowerCase().trim();
            if (!addedEmails.has(key)) {
              addedEmails.add(key);
              list.push(p);
            }
          });

          onCountChange?.(list.length);
          return list;
        });
      } catch (err) {
        console.warn('API error fetching franchise partners list:', err);
      }
    };

    fetchRegisteredPartners();
  }, []);

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
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (selectedRegion !== 'all' && !p.region.toLowerCase().includes(selectedRegion.toLowerCase()))
      return false;
    if (searchTerm) {
      const match =
        `${p.name} ${p.code} ${p.contactPerson} ${p.email} ${p.phone} ${p.region}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
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
    const isEmailAlreadyRegistered = partnerList.some(
      (p) => p.email.toLowerCase().trim() === cleanEmail,
    );

    if (isEmailAlreadyRegistered) {
      showToast(`Error: A franchise partner with email "${formEmail}" is already registered!`);
      return;
    }

    setIsSaving(true);
    try {
      const res = await tenantsApi.createFranchise({
        name: formName,
        code: formCode,
        contactPerson: formContact,
        contactEmail: formEmail,
        contactPhone: formPhone,
        address: formAddress,
        region: effectiveRegion,
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
        totalLocations: 1,
        activeLocations: 1,
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
          grossRevenue: 'â‚¹0.0L',
          royaltyAccrued: 'â‚¹0.0L',
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

      const saveToCustomStorage = (partnerObj: FranchisePartner) => {
        try {
          const existingRaw = localStorage.getItem('digiflex_custom_registered_partners');
          const existing: FranchisePartner[] = existingRaw ? JSON.parse(existingRaw) : [];
          const updated = [
            partnerObj,
            ...existing.filter((p) => p.email.toLowerCase() !== partnerObj.email.toLowerCase()),
          ];
          localStorage.setItem('digiflex_custom_registered_partners', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not save custom partner to localStorage:', e);
        }
      };

      saveToCustomStorage(newPartnerObj);

      // Save to localStorage for Franchise Portal session sync
      localStorage.setItem('digiflex_franchise_partner_name', formName);
      localStorage.setItem('digiflex_franchise_owner_name', formContact);
      localStorage.setItem('digiflex_franchise_code', formCode);
      localStorage.setItem('digiflex_franchise_region', effectiveRegion);
      localStorage.setItem('digiflex_franchise_email', formEmail);
      localStorage.setItem('digiflex_franchise_mobile', formPhone);

      setCreatedPasswordModal({
        email: formEmail,
        password: pass,
        partnerName: formName,
