import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowRight,
  Award,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  DollarSign,
  Download,
  Edit2,
  Eye,
  Filter,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Plus,
  Power,
  Scissors,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import {
  catalogueApi,
  tenantsApi,
  type ApiServiceCategory,
  type ApiServiceMaster,
  type ApiSkillMaster,
  type ApiBranchResource,
} from '@/shared/api';
import { STANDARD_CATEGORY_SEEDS, extractErrorMessage } from './ServiceCategoriesTab';

export interface ServiceConsumableItem {
  id?: string;
  productName: string;
  quantity: string;
  quantityValue?: number;
  unit?: string;
  isRequired?: boolean;
}

export interface MeasurementUnitOption {
  label: string;
  value: string;
  category: 'Volume / Liquids' | 'Weight / Mass' | 'Packaging & Units';
}

export const STANDARD_MEASUREMENT_UNITS: MeasurementUnitOption[] = [
  // Volume / Liquids (Oils, Serums, Shampoos, Developers, Toners, Lotions)
  { label: 'ml (Millilitres)', value: 'ml', category: 'Volume / Liquids' },
  { label: 'ltr (Litres)', value: 'ltr', category: 'Volume / Liquids' },
  { label: 'pumps (Dispenser Pumps)', value: 'pumps', category: 'Volume / Liquids' },
  { label: 'drops (Essential Drops)', value: 'drops', category: 'Volume / Liquids' },
  { label: 'fl oz (Fluid Ounces)', value: 'fl oz', category: 'Volume / Liquids' },

  // Weight / Mass (Bleach Powder, Waxes, Creams, Masks, Scrubs, Salts)
  { label: 'gm (Grams)', value: 'gm', category: 'Weight / Mass' },
  { label: 'kg (Kilograms)', value: 'kg', category: 'Weight / Mass' },
  { label: 'mg (Milligrams)', value: 'mg', category: 'Weight / Mass' },
  { label: 'scoop (Powder Scoops)', value: 'scoop', category: 'Weight / Mass' },

  // Unit, Single-Use & Packaging (Doses, Ampoules, Tubes, Strips, Sheets)
  { label: 'pcs (Pieces / Units)', value: 'pcs', category: 'Packaging & Units' },
  { label: 'Tube (Color / Treatment Tube)', value: 'Tube', category: 'Packaging & Units' },
  { label: 'Sachet (Single Sachet)', value: 'Sachet', category: 'Packaging & Units' },
  { label: 'Ampoule (Active Ampoule)', value: 'Ampoule', category: 'Packaging & Units' },
  { label: 'Vial (Concentrate Vial)', value: 'Vial', category: 'Packaging & Units' },
  { label: 'Pod (Facial / Treatment Pod)', value: 'Pod', category: 'Packaging & Units' },
  { label: 'Capsule (Serum Capsule)', value: 'Capsule', category: 'Packaging & Units' },
  { label: 'Sheet (Facial Mask / Foil Sheet)', value: 'Sheet', category: 'Packaging & Units' },
  { label: 'Strip (Wax / Lash Strip)', value: 'Strip', category: 'Packaging & Units' },
  { label: 'Kit (Single-Use Kit)', value: 'Kit', category: 'Packaging & Units' },
  { label: 'Pair (Gloves / Eye Pads)', value: 'Pair', category: 'Packaging & Units' },
];

export interface ServiceRecord {
  id: string;
  code: string;
  name: string;
  categoryId?: string;
  category: string;
  duration: number; // in mins
  bufferTime: number; // in mins
  price: number; // base price in INR
  pricingMode: 'Shared price across branches' | 'Branch-specific pricing';
  taxRate: string;
  discountEligible: boolean;
  requiredSkill: string;
  requiredLevel: 'Junior' | 'Intermediate' | 'Senior' | 'Expert';
  requiredRoomOrChair: string;
  requiredEquipment: string;
  availableBranches: string[]; // branch names
  status: 'Active' | 'Inactive' | 'Draft' | 'Pending Approval';
  lastUpdated: string;
  description: string;
  imageUrl?: string;
  consumables?: ServiceConsumableItem[];
}

export const SERVICE_IMAGE_PRESETS = [
  {
    label: 'Hair Cut & Blowout',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Keratin Infusion',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Hydra-Facial Therapy',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Swedish Spa Massage',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Sculpted Gel Nails',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'HD Airbrush Bridal',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Beard & Men Grooming',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'LED Phototherapy',
    url: 'https://images.unsplash.com/photo-1512290900672-1f02a0a8ffb2?w=600&auto=format&fit=crop&q=80',
  },
];

export const masterServices: ServiceRecord[] = [
  {
    id: 'SRV-001',
    code: 'HAIR-CUT-01',
    name: 'Signature Precision Cut & Blowout',
    category: 'Hair Dressing & Styling',
    duration: 45,
    bufferTime: 15,
    price: 1850,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountEligible: true,
    requiredSkill: 'Precision Hair Styling',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Styling Chair',
    requiredEquipment: 'Ionic Dryer & Shears',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier Koregaon Park Grand',
      'Atelier MG Road Express',
      'Atelier Whitefield Studio',
      'Atelier Jaipur Royal Spa',
    ],
    status: 'Active',
    lastUpdated: '16 Aug 2026',
    description:
      'Bespoke diagnostic consultation followed by precision structural haircut and botanical blowout styling.',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    consumables: [
      { productName: 'Organic Styling Serum', quantity: '10 ml' },
      { productName: 'Nourishing Hair Wash & Conditioner', quantity: '30 ml' },
    ],
  },
  {
    id: 'SRV-002',
    code: 'HAIR-KER-02',
    name: 'Cysteine & Keratin Infusion Treatment',
    category: 'Hair Dressing & Styling',
    duration: 120,
    bufferTime: 20,
    price: 5200,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountEligible: false,
    requiredSkill: 'Chemical Hair Therapy',
    requiredLevel: 'Expert',
    requiredRoomOrChair: 'Chemical Treatment Bay',
    requiredEquipment: 'Nano Titanium Flat Iron',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Koregaon Park Grand',
      'Atelier Whitefield Studio',
      'Atelier Jaipur Royal Spa',
    ],
    status: 'Active',
    lastUpdated: '15 Aug 2026',
    description:
      'Formaldehyde-free protein reconstruction treatment delivering lasting mirror shine and frizz control for 4 months.',
    imageUrl:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    consumables: [
      { productName: 'Keratin Complex Protein Serum', quantity: '45 ml' },
      { productName: 'Clarifying Pre-Treatment Wash', quantity: '35 ml' },
      { productName: 'Thermal Shield Sealer', quantity: '15 ml' },
    ],
  },
  {
    id: 'SRV-003',
    code: 'SKIN-HYD-03',
    name: '7-Step Medical Hydra-Facial Rejuvenation',
    category: 'Skin & Organic Therapy',
    duration: 60,
    bufferTime: 15,
    price: 3800,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountEligible: true,
    requiredSkill: 'Clinical Skin Aesthetics',
    requiredLevel: 'Senior',
    requiredRoomOrChair: 'Aesthetic Treatment Suite 1',
    requiredEquipment: 'Vortex Hydrodermabrasion Unit',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier Koregaon Park Grand',
      'Atelier MG Road Express',
      'Atelier Whitefield Studio',
      'Atelier Jaipur Royal Spa',
    ],
    status: 'Active',
    lastUpdated: '14 Aug 2026',
    description:
      'Deep pore vacuum extraction, glycolic exfoliation, antioxidant infusion, and LED collagen phototherapy.',
    imageUrl:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
    consumables: [
      { productName: 'Glycolic Acid Exfoliating Pod', quantity: '1 Pod (15ml)' },
      { productName: 'Antioxidant Infusion Serum', quantity: '20 ml' },
      { productName: 'Collagen Peptide Hydrogel Mask', quantity: '1 Mask' },
    ],
  },
  {
    id: 'SRV-004',
    code: 'SPA-SWD-04',
    name: 'Swedish Aromatherapy Deep Tissue Massage',
    category: 'Spa & Wellness Rituals',
    duration: 90,
    bufferTime: 20,
    price: 4500,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountEligible: true,
    requiredSkill: 'Spa Bodywork & Acupressure',
    requiredLevel: 'Expert',
    requiredRoomOrChair: 'Private Spa Suite (Couples)',
    requiredEquipment: 'Warm Stone Heater & Diffuser',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Koregaon Park Grand',
      'Atelier Jaipur Royal Spa',
    ],
    status: 'Active',
    lastUpdated: '12 Aug 2026',
    description:
      'Therapeutic muscle tension release using cold-pressed essential oils from Kashmir and heated basalt stones.',
    imageUrl:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'SRV-005',
    code: 'NAIL-GEL-05',
    name: 'Sculpted Gel Extensions & Ombre Art',
    category: 'Nails Art & Spa Lounge',
    duration: 75,
    bufferTime: 10,
    price: 2400,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountEligible: true,
    requiredSkill: 'Nail Architecture & Artistry',
    requiredLevel: 'Intermediate',
    requiredRoomOrChair: 'Nail Bar Station 2',
    requiredEquipment: 'UV/LED Dual Cure Lamp',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier Koregaon Park Grand',
      'Atelier MG Road Express',
      'Atelier Whitefield Studio',
    ],
    status: 'Active',
    lastUpdated: '10 Aug 2026',
    description:
      'Custom monomer sculpture with chrome glitter fade, cuticular hydration, and high-gloss topcoat.',
    imageUrl:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'SRV-006',
    code: 'BRID-AIR-06',
    name: 'Couture HD Airbrush Bridal Glamour',
    category: 'Bridal & Red Carpet Studio',
    duration: 150,
    bufferTime: 30,
    price: 16500,
    pricingMode: 'Branch-specific pricing',
    taxRate: '18% GST',
    discountEligible: false,
    requiredSkill: 'Couture Airbrush Makeup',
    requiredLevel: 'Expert',
    requiredRoomOrChair: 'Bridal VIP Vanity Suite',
    requiredEquipment: 'Temptu Air Compressor & Ring Lights',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier Koregaon Park Grand',
      'Atelier Jaipur Royal Spa',
    ],
    status: 'Active',
    lastUpdated: '08 Aug 2026',
    description:
      'Long-wear waterproof silicon airbrush makeup, mink lash application, saree draping, and hair ornamentation.',
    imageUrl:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'SRV-007',
    code: 'MENS-BEA-07',
    name: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    category: 'Men’s Grooming Lounge',
    duration: 40,
    bufferTime: 10,
    price: 1150,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountEligible: true,
    requiredSkill: 'Barbering & Hot Towel Shave',
    requiredLevel: 'Intermediate',
    requiredRoomOrChair: 'Barber Recliner 1',
    requiredEquipment: 'Steam Towel Cabinet & Straight Razor',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier MG Road Express',
      'Atelier Whitefield Studio',
    ],
    status: 'Active',
    lastUpdated: '05 Aug 2026',
    description:
      'Triple hot towel wrap, eucalyptus pre-shave oil, straight razor edging, and invigorating tea tree head massage.',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'SRV-008',
    code: 'SKIN-COL-08',
    name: 'Collagen Red-Light Phototherapy Mask',
    category: 'Skin & Organic Therapy',
    duration: 30,
    bufferTime: 10,
    price: 1450,
    pricingMode: 'Shared price across branches',
    taxRate: '18% GST',
    discountEligible: true,
    requiredSkill: 'Clinical Skin Aesthetics',
    requiredLevel: 'Junior',
    requiredRoomOrChair: 'Express Facial Pod',
    requiredEquipment: 'Omnilux LED Canopy',
    availableBranches: [
      'Atelier Indrapuri Flagship',
      'Atelier Arera Luxury Lounge',
      'Atelier Koregaon Park Grand',
      'Atelier MG Road Express',
      'Atelier Whitefield Studio',
      'Atelier Jaipur Royal Spa',
    ],
    status: 'Draft',
    lastUpdated: '02 Aug 2026',
    description:
      'Targeted 633nm red light session for cellular rejuvenation, fine line reduction, and post-laser soothing.',
    imageUrl:
      'https://images.unsplash.com/photo-1512290900672-1f02a0a8ffb2?w=600&auto=format&fit=crop&q=80',
  },
];

export const allCategories = [
  'All',
  'Hair Dressing & Styling',
  'Skin & Organic Therapy',
  'Spa & Wellness Rituals',
  'Nails Art & Spa Lounge',
  'Bridal & Red Carpet Studio',
  'Men’s Grooming Lounge',
];

interface ServiceFormData {
  id?: string;
  name: string;
  code: string;
  categoryId?: string;
  category: string;
  duration: number;
  bufferTime: number;
  price: number;
  pricingMode: ServiceRecord['pricingMode'];
  taxRate: string;
  discountEligible: boolean;
  requiredSkill: string;
  requiredLevel: ServiceRecord['requiredLevel'];
  requiredRoomOrChair: string;
  requiredEquipment: string;
  availableBranches: string[];
  status: ServiceRecord['status'];
  description: string;
  imageUrl: string;
  consumables: ServiceConsumableItem[];
}

const defaultNewServiceData: ServiceFormData = {
  name: '',
  code: '',
  categoryId: '',
  category: 'Hair Dressing & Styling',
  duration: 45,
  bufferTime: 15,
  price: 1850,
  pricingMode: 'Shared price across branches',
  taxRate: '18% GST',
  discountEligible: true,
  requiredSkill: 'Precision Hair Styling',
  requiredLevel: 'Senior',
  requiredRoomOrChair: 'Styling Chair',
  requiredEquipment: 'Ionic Dryer & Shears',
  availableBranches: [],
  status: 'Active',
  description: '',
  imageUrl: SERVICE_IMAGE_PRESETS[0].url,
  consumables: [
    { productName: 'Organic Styling Serum', quantity: '10 ml' },
    { productName: 'Nourishing Hair Wash & Conditioner', quantity: '30 ml' },
  ],
};

export interface ServicesTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  readOnly?: boolean;
}

export const STANDARD_SERVICE_SEEDS = [
  {
    code: 'HAIR-CUT-01',
    name: 'Signature Precision Cut & Blowout',
    categoryName: 'Hair Dressing & Styling',
    durationMinutes: 45,
    bufferAfterMinutes: 15,
    basePrice: 1850,
    requiredSkill: 'Precision Hair Styling',
    requiredLevel: 'Senior' as const,
    description:
      'Bespoke diagnostic consultation followed by precision structural haircut and botanical blowout styling.',
  },
  {
    code: 'HAIR-KER-02',
    name: 'Cysteine & Keratin Infusion Treatment',
    categoryName: 'Hair Dressing & Styling',
    durationMinutes: 120,
    bufferAfterMinutes: 20,
    basePrice: 5200,
    requiredSkill: 'Chemical Hair Therapy',
    requiredLevel: 'Expert' as const,
    description:
      'Formaldehyde-free protein reconstruction treatment delivering lasting mirror shine and frizz control for 4 months.',
  },
  {
    code: 'SKIN-HYD-03',
    name: '7-Step Medical Hydra-Facial Rejuvenation',
    categoryName: 'Skin & Organic Therapy',
    durationMinutes: 60,
    bufferAfterMinutes: 15,
    basePrice: 3800,
    requiredSkill: 'Clinical Skin Aesthetics',
    requiredLevel: 'Senior' as const,
    description:
      'Deep pore vacuum extraction, glycolic exfoliation, antioxidant infusion, and LED collagen phototherapy.',
  },
  {
    code: 'SPA-SWD-04',
    name: 'Swedish Aromatherapy Deep Tissue Massage',
    categoryName: 'Spa & Wellness Rituals',
    durationMinutes: 90,
    bufferAfterMinutes: 20,
    basePrice: 4500,
    requiredSkill: 'Spa Bodywork & Acupressure',
    requiredLevel: 'Expert' as const,
    description:
      'Therapeutic muscle tension release using cold-pressed essential oils from Kashmir and heated basalt stones.',
  },
  {
    code: 'NAIL-GEL-05',
    name: 'Sculpted Gel Extensions & Ombre Art',
    categoryName: 'Nails Art & Spa Lounge',
    durationMinutes: 75,
    bufferAfterMinutes: 10,
    basePrice: 2400,
    requiredSkill: 'Nail Architecture & Artistry',
    requiredLevel: 'Intermediate' as const,
    description:
      'Custom monomer sculpture with chrome glitter fade, cuticular hydration, and high-gloss topcoat.',
  },
  {
    code: 'BRID-AIR-06',
    name: 'Couture HD Airbrush Bridal Glamour',
    categoryName: 'Bridal & Red Carpet Studio',
    durationMinutes: 150,
    bufferAfterMinutes: 30,
    basePrice: 16500,
    requiredSkill: 'Couture Airbrush Makeup',
    requiredLevel: 'Expert' as const,
    description:
      'Long-wear waterproof silicon airbrush makeup, mink lash application, saree draping, and hair ornamentation.',
  },
  {
    code: 'MENS-BEA-07',
    name: 'Executive Hot Towel Beard Sculpt & Scalp Polish',
    categoryName: 'Men’s Grooming Lounge',
    durationMinutes: 40,
    bufferAfterMinutes: 10,
    basePrice: 1150,
    requiredSkill: 'Barbering & Hot Towel Shave',
    requiredLevel: 'Intermediate' as const,
    description:
      'Triple hot towel wrap, eucalyptus pre-shave oil, straight razor edging, and invigorating tea tree head massage.',
  },
];

export function ServicesTab({
  defaultBranch = 'All',
  lockBranch = false,
  readOnly = false,
}: ServicesTabProps = {}) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [fetchedBranches, setFetchedBranches] = useState<any[]>([]);

  useEffect(() => {
    if (!salon?.branches || salon.branches.length === 0) {
      tenantsApi
        .listBranches()
        .then((list) => {
          if (Array.isArray(list) && list.length > 0) {
            setFetchedBranches(list);
          }
        })
        .catch((err) => {
          console.warn('[ServicesTab] Could not fetch branches:', err);
        });
    }
  }, [salon?.branches]);

  const adminBranches: any[] = useMemo(() => {
    if (salon?.branches && Array.isArray(salon.branches) && salon.branches.length > 0) {
      return salon.branches;
    }
    if (fetchedBranches.length > 0) {
      return fetchedBranches;
    }
    return [];
  }, [salon?.branches, fetchedBranches]);

  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [categoriesList, setCategoriesList] = useState<ApiServiceCategory[]>([]);
  const [skillsList, setSkillsList] = useState<ApiSkillMaster[]>([]);
  const [resourcesList, setResourcesList] = useState<ApiBranchResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Active' | 'Inactive' | 'Draft' | 'Pending Approval'
  >('All');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);

  useEffect(() => {
    if (defaultBranch && defaultBranch.toLowerCase() !== 'assigned branch') {
      setBranchFilter(defaultBranch);
    }
  }, [defaultBranch]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewService, setViewService] = useState<ServiceRecord | null>(null);
  const [editService, setEditService] = useState<ServiceRecord | null>(null);
  const [deactivateService, setDeactivateService] = useState<ServiceRecord | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceRecord | null>(null);

  // Unified Form State for Add Mode
  const [newSrv, setNewSrv] = useState<ServiceFormData>(defaultNewServiceData);

  // Consumable Recipe Input States
  const [newConsumableName, setNewConsumableName] = useState('');
  const [newConsumableAmount, setNewConsumableAmount] = useState('');
  const [newConsumableUnit, setNewConsumableUnit] = useState('ml');

  // File Input Ref for Image Uploads
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Computed available skills from database
  const availableSkills = useMemo(() => {
    const options: { id: string; name: string; code: string; category?: string }[] = [];
    const seen = new Set<string>();

    skillsList.forEach((s) => {
      const key = s.name.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        options.push({
          id: s.id,
          name: s.name,
          code: s.code,
          category: s.categoryName || undefined,
        });
      }
    });

    return options;
  }, [skillsList]);

  // Computed Room / Chair options from database branch_resources
  const availableRoomsAndChairs = useMemo(() => {
    const options: { id: string; name: string; type: string; code?: string; branchName?: string }[] = [];
    const seen = new Set<string>();

    resourcesList
      .filter((r) => {
        const t = String(r.type || '').toUpperCase();
        return t === 'ROOM' || t === 'CHAIR';
      })
      .forEach((r) => {
        const key = r.name.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          const t = String(r.type || '').toUpperCase();
          options.push({
            id: r.id,
            name: r.name,
            type: t === 'ROOM' ? 'Room' : 'Chair',
            code: r.code || undefined,
            branchName: r.branch?.name,
          });
        }
      });

    return options;
  }, [resourcesList]);

  // Computed Equipment options from database branch_resources
  const availableEquipment = useMemo(() => {
    const options: { id: string; name: string; code?: string; branchName?: string }[] = [];
    const seen = new Set<string>();

    resourcesList
      .filter((r) => String(r.type || '').toUpperCase() === 'EQUIPMENT')
      .forEach((r) => {
        const key = r.name.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          options.push({
            id: r.id,
            name: r.name,
            code: r.code || undefined,
            branchName: r.branch?.name,
          });
        }
      });

    return options;
  }, [resourcesList]);

  // Synchronize default branches when admin branches load
  useEffect(() => {
    if (adminBranches.length > 0 && newSrv.availableBranches.length === 0) {
      setNewSrv((prev) => ({
        ...prev,
        availableBranches: adminBranches.map((b) => b.name),
      }));
    }
  }, [adminBranches]);

  // Synchronize default category when categories load
  useEffect(() => {
    if (categoriesList.length > 0 && !newSrv.categoryId) {
      setNewSrv((prev) => ({
        ...prev,
        categoryId: categoriesList[0].id,
        category: categoriesList[0].name,
      }));
    }
  }, [categoriesList]);

  // Synchronize default skill when availableSkills load
  useEffect(() => {
    if (availableSkills.length > 0 && !newSrv.requiredSkill) {
      setNewSrv((prev) => ({
        ...prev,
        requiredSkill: availableSkills[0].name,
      }));
    }
  }, [availableSkills]);

  // Synchronize default room/chair when availableRoomsAndChairs load
  useEffect(() => {
    if (
      availableRoomsAndChairs.length > 0 &&
      (!newSrv.requiredRoomOrChair ||
        !availableRoomsAndChairs.some(
          (r) => r.name.toLowerCase() === newSrv.requiredRoomOrChair.toLowerCase(),
        ))
    ) {
      setNewSrv((prev) => ({
        ...prev,
        requiredRoomOrChair: availableRoomsAndChairs[0].name,
      }));
    }
  }, [availableRoomsAndChairs]);

  // Synchronize default equipment when availableEquipment load
  useEffect(() => {
    if (
      availableEquipment.length > 0 &&
      (!newSrv.requiredEquipment ||
        !availableEquipment.some(
          (e) => e.name.toLowerCase() === newSrv.requiredEquipment.toLowerCase(),
        ))
    ) {
      setNewSrv((prev) => ({
        ...prev,
        requiredEquipment: availableEquipment[0].name,
      }));
    }
  }, [availableEquipment]);

  const categoryNames = useMemo(() => {
    if (categoriesList.length > 0) {
      return categoriesList.map((c) => c.name);
    }
    return allCategories.filter((c) => c !== 'All');
  }, [categoriesList]);

  const loadServicesAndCategories = async () => {
    try {
      setIsLoading(true);
      const [catsRes, srvsRes, skillsRes, resListRes] = await Promise.allSettled([
        catalogueApi.fetchCategories(),
        catalogueApi.fetchServices({ limit: 100 }),
        catalogueApi.fetchSkills(),
        catalogueApi.fetchResources(),
      ]);

      const fetchedCategories =
        catsRes.status === 'fulfilled' && Array.isArray(catsRes.value) ? catsRes.value : [];
      setCategoriesList(fetchedCategories);

      if (skillsRes.status === 'fulfilled' && Array.isArray(skillsRes.value)) {
        setSkillsList(skillsRes.value);
      }
      if (resListRes.status === 'fulfilled' && Array.isArray(resListRes.value)) {
        setResourcesList(resListRes.value);
      }

      if (srvsRes.status === 'fulfilled' && Array.isArray(srvsRes.value)) {
        const fetchedServices = srvsRes.value;
        const mapped: ServiceRecord[] = fetchedServices.map((srv, idx) => {
          const cat = fetchedCategories.find((c) => c.id === srv.categoryId);
          const meta = (srv.metadata as any) || {};
          const metaConsumables = Array.isArray(meta.consumables) ? meta.consumables : [];
          const assignedBranches =
            Array.isArray(srv.availableBranches) && srv.availableBranches.length > 0
              ? srv.availableBranches
              : Array.isArray(meta.availableBranches) && meta.availableBranches.length > 0
                ? meta.availableBranches
                : Array.isArray(meta.branchNames) && meta.branchNames.length > 0
                  ? meta.branchNames
                  : Array.isArray(meta.branchIds) && meta.branchIds.length > 0
                    ? meta.branchIds
                    : srv.branchPrices && srv.branchPrices.length > 0
                      ? srv.branchPrices.map((bp) => {
                          const match = adminBranches.find((b) => b.id === bp.branchId);
                          return match ? match.name : bp.branchId;
                        })
                      : [];

          return {
            id: srv.id,
            code: srv.code,
            name: srv.name,
            categoryId: srv.categoryId,
            category: cat?.name || 'General Treatments',
            duration: srv.durationMinutes || 45,
            bufferTime: srv.bufferAfterMinutes || srv.bufferBeforeMinutes || 15,
            price: Number(srv.basePrice) || 1000,
            pricingMode:
              (srv.pricingMode as any) ||
              (srv.branchPrices && srv.branchPrices.length > 0
                ? 'Branch-specific pricing'
                : 'Shared price across branches'),
            taxRate: srv.gstRate ? `${srv.gstRate}% GST` : '18% GST',
            discountEligible: srv.discountEligible !== undefined ? srv.discountEligible : true,
            requiredSkill: srv.requiredSkill || 'Precision Hair Styling',
            requiredLevel: (srv.requiredLevel as any) || 'Senior',
            requiredRoomOrChair: srv.requiredRoomOrChair || 'Styling Chair',
            requiredEquipment: srv.requiredEquipment || 'Ionic Dryer & Shears',
            availableBranches: assignedBranches,
            status: srv.isActive ? 'Active' : 'Inactive',
            lastUpdated: srv.updatedAt
              ? new Date(srv.updatedAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recently',
            description: srv.description || '',
            imageUrl: srv.imageUrl || SERVICE_IMAGE_PRESETS[idx % SERVICE_IMAGE_PRESETS.length]?.url,
            consumables: metaConsumables,
          };
        });
        if (mapped.length > 0) {
          setServices(mapped);
        } else {
          setServices([]);
        }
      } else {
        setServices([]);
      }
    } catch (err: any) {
      console.error('Failed to load services:', err);
      setServices([]);
      toast(extractErrorMessage(err, 'Failed to fetch services from server.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServicesAndCategories();
  }, [defaultBranch, adminBranches.length]);

  const handleSeedStandardServices = async () => {
    try {
      setIsSeeding(true);
      toast('Seeding standard salon & spa services...');
      let catList = await catalogueApi.fetchCategories();
      if (!catList || catList.length === 0) {
        for (const catSeed of STANDARD_CATEGORY_SEEDS) {
          await catalogueApi.createCategory({
            name: catSeed.name,
            code: catSeed.code,
            description: catSeed.description,
            sortOrder: catSeed.sortOrder,
            isActive: true,
          });
        }
        catList = await catalogueApi.fetchCategories();
      }
      setCategoriesList(catList);

      let seededCount = 0;
      for (const seed of STANDARD_SERVICE_SEEDS) {
        const matchCat =
          catList.find((c) =>
            c.name.toLowerCase().includes(seed.categoryName.toLowerCase().split(' ')[0]),
          ) || catList[0];
        if (matchCat) {
          try {
            await catalogueApi.createService({
              categoryId: matchCat.id,
              code: seed.code,
              name: seed.name,
              description: seed.description,
              durationMinutes: seed.durationMinutes,
              bufferBeforeMinutes: 0,
              bufferAfterMinutes: seed.bufferAfterMinutes,
              basePrice: seed.basePrice,
              gstRate: 18,
              taxCode: 'GST18',
              sacCode: '999721',
              requiresConsultation: false,
              requiresPatchTest: false,
              isActive: true,
              isBookableOnline: true,
            });
            seededCount++;
          } catch (itemErr: any) {
            // If code already exists (409 conflict), continue with next seed
            console.warn(`Service seed ${seed.code} skipped:`, itemErr?.response?.data?.message || itemErr.message);
          }
        }
      }
      toast(seededCount > 0 ? 'Standard services seeded successfully!' : 'Standard services are up to date.');
      await loadServicesAndCategories();
    } catch (err: any) {
      console.error('Failed to seed services:', err);
      toast(err?.response?.data?.message || 'Failed to seed services.');
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.requiredSkill.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || srv.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || srv.status === statusFilter;

      // Scoped branch visibility rule:
      // Only when explicitly locked to a specific branch (e.g. Branch Manager assigned branch),
      // restrict to services available at that branch or brand-wide.
      const isLockedBranch =
        lockBranch &&
        Boolean(defaultBranch) &&
        defaultBranch.toLowerCase() !== 'all' &&
        defaultBranch.toLowerCase() !== 'assigned branch';

      // Collect all possible identifiers for the locked branch
      const targetIdentifiers = new Set<string>();
      if (isLockedBranch) {
        targetIdentifiers.add(defaultBranch.toLowerCase().trim());
        adminBranches.forEach((ab: any) => {
          const abName = (ab.name || '').toLowerCase().trim();
          const abCode = (ab.code || '').toLowerCase().trim();
          const abId = (ab.id || '').toLowerCase().trim();
          const target = (defaultBranch || '').toLowerCase().trim();

          const isMatchedBranch =
            (target && (abName === target || abCode === target || abId === target)) ||
            (target && target.length >= 3 && (abName.includes(target) || target.includes(abName))) ||
            (target && target.length >= 3 && (abCode.includes(target) || target.includes(abCode)));

          if (isMatchedBranch) {
            if (abName) targetIdentifiers.add(abName);
            if (abCode) targetIdentifiers.add(abCode);
            if (abId) targetIdentifiers.add(abId);
            if (ab.id) targetIdentifiers.add(ab.id);
          }
        });
      }

      const isAllBranches =
        !Array.isArray(srv.availableBranches) ||
        srv.availableBranches.length === 0 ||
        srv.availableBranches.some((b: string) => {
          if (!b) return false;
          const lower = String(b).toLowerCase().trim();
          return (
            lower === 'all' ||
            lower === 'all branches' ||
            lower === 'all locations' ||
            lower.includes('all branches')
          );
        }) ||
        (adminBranches.length > 0 && srv.availableBranches.length >= adminBranches.length);

      const isTargetBranch =
        targetIdentifiers.size > 0 &&
        Array.isArray(srv.availableBranches) &&
        srv.availableBranches.length > 0 &&
        srv.availableBranches.some((b: string) => {
          if (!b) return false;
          const bStr = String(b).toLowerCase().trim();
          if (targetIdentifiers.has(bStr) || targetIdentifiers.has(b)) return true;
          for (const idf of targetIdentifiers) {
            if (idf.length >= 3 && (bStr.includes(idf) || idf.includes(bStr))) {
              return true;
            }
          }
          return false;
        });

      const isSharedOrReadOnly =
        readOnly ||
        srv.pricingMode === 'Shared price across branches' ||
        !srv.availableBranches ||
        srv.availableBranches.length === 0;

      if (isLockedBranch && !isSharedOrReadOnly) {
        if (!isAllBranches && !isTargetBranch) {
          return false;
        }
      }

      const matchesBranch = (isLockedBranch || readOnly)
        ? true
        : branchFilter === 'All' ||
          isAllBranches ||
          srv.availableBranches.some((b: string) => {
            if (!b) return false;
            const lower = String(b).toLowerCase().trim();
            const filterLower = branchFilter.toLowerCase().trim();
            return (
              lower === filterLower ||
              lower.includes(filterLower) ||
              filterLower.includes(lower)
            );
          });

      return matchesSearch && matchesCategory && matchesStatus && matchesBranch;
    });
  }, [
    services,
    searchQuery,
    categoryFilter,
    statusFilter,
    branchFilter,
    lockBranch,
    defaultBranch,
    adminBranches,
  ]);

  // Handle Image File Upload (converts file to base64 Data URL)
  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast('Image file size must be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = (event.target?.result as string) || '';
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          if (editService) {
            setEditService({ ...editService, imageUrl: compressed });
          } else {
            setNewSrv((prev) => ({ ...prev, imageUrl: compressed }));
          }
        } else {
          if (editService) {
            setEditService({ ...editService, imageUrl: result });
          } else {
            setNewSrv((prev) => ({ ...prev, imageUrl: result }));
          }
        }
        toast('Service cover photo uploaded successfully.');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Branch multi-selection helpers
  const handleToggleBranch = (branchName: string, isEdit: boolean) => {
    if (isEdit && editService) {
      const current = editService.availableBranches;
      const updated = current.includes(branchName)
        ? current.filter((b) => b !== branchName)
        : [...current, branchName];
      setEditService({ ...editService, availableBranches: updated });
    } else {
      const current = newSrv.availableBranches;
      const updated = current.includes(branchName)
        ? current.filter((b) => b !== branchName)
        : [...current, branchName];
      setNewSrv((prev) => ({ ...prev, availableBranches: updated }));
    }
  };

  const handleSelectAllBranches = (selectAll: boolean, isEdit: boolean) => {
    const branches = selectAll ? adminBranches.map((b) => b.name) : [];
    if (isEdit && editService) {
      setEditService({ ...editService, availableBranches: branches });
    } else {
      setNewSrv((prev) => ({ ...prev, availableBranches: branches }));
    }
  };

  // Duplicate Code Validation Memos
  const isAddServiceCodeTaken = useMemo(() => {
    const code = newSrv.code.trim().toUpperCase();
    if (!code) return false;
    return services.some((s) => s.code.trim().toUpperCase() === code);
  }, [newSrv.code, services]);

  const isEditServiceCodeTaken = useMemo(() => {
    if (!editService) return false;
    const code = editService.code.trim().toUpperCase();
    if (!code) return false;
    return services.some(
      (s) => s.id !== editService.id && s.code.trim().toUpperCase() === code,
    );
  }, [editService, services]);

  // Consumable Recipe Helpers
  const handleAddConsumable = (isEdit: boolean) => {
    const trimmedName = newConsumableName.trim();
    const trimmedAmount = newConsumableAmount.trim();

    if (!trimmedName || !trimmedAmount) {
      toast('Please provide a consumable product name and quantity value.');
      return;
    }

    const item: ServiceConsumableItem = {
      productName: trimmedName,
      quantity: `${trimmedAmount} ${newConsumableUnit}`,
      quantityValue: Number.parseFloat(trimmedAmount) || 10,
      unit: newConsumableUnit,
    };

    if (isEdit && editService) {
      const currentList = editService.consumables || [];
      setEditService({ ...editService, consumables: [...currentList, item] });
    } else {
      const currentList = newSrv.consumables || [];
      setNewSrv((prev) => ({ ...prev, consumables: [...currentList, item] }));
    }

    setNewConsumableName('');
    setNewConsumableAmount('');
    setNewConsumableUnit('ml');
    toast(`Consumable "${trimmedName}" attached.`);
  };

  const handleRemoveConsumable = (idx: number, isEdit: boolean) => {
    if (isEdit && editService) {
      const currentList = editService.consumables || [];
      setEditService({ ...editService, consumables: currentList.filter((_, i) => i !== idx) });
    } else {
      const currentList = newSrv.consumables || [];
      setNewSrv((prev) => ({ ...prev, consumables: currentList.filter((_, i) => i !== idx) }));
    }
  };

  // Submission for Add Mode
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrv.name || !newSrv.code) {
      toast('Please provide a valid service name and code.');
      return;
    }

    if (isAddServiceCodeTaken) {
      toast(`Service code "${newSrv.code.toUpperCase().trim()}" is already in use. Please choose a unique code.`);
      return;
    }

    let catId = newSrv.categoryId;
    if (!catId && newSrv.category) {
      catId = categoriesList.find(
        (c) => c.name.toLowerCase() === newSrv.category.toLowerCase(),
      )?.id;
    }
    if (!catId && categoriesList.length > 0) {
      catId = categoriesList[0].id;
    }
    if (!catId) {
      toast('Please select or create a service category first.');
      return;
    }

    try {
      const branchesToDeploy =
        newSrv.availableBranches.length > 0
          ? newSrv.availableBranches
          : adminBranches.map((b) => b.name);

      const created = await catalogueApi.createService({
        categoryId: catId,
        code: newSrv.code.toUpperCase().trim(),
        name: newSrv.name.trim(),
        description: newSrv.description.trim() || undefined,
        durationMinutes: Number(newSrv.duration) || 45,
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: Number(newSrv.bufferTime) || 15,
        basePrice: Number(newSrv.price) || 1000,
        gstRate: 18,
        taxCode: 'GST18',
        sacCode: '999721',
        requiresConsultation: false,
        requiresPatchTest: false,
        isActive: newSrv.status === 'Active',
        isBookableOnline: true,
        imageUrl: newSrv.imageUrl || undefined,
        requiredSkill: newSrv.requiredSkill || undefined,
        requiredLevel: newSrv.requiredLevel || undefined,
        requiredRoomOrChair: newSrv.requiredRoomOrChair || undefined,
        requiredEquipment: newSrv.requiredEquipment || undefined,
        pricingMode: newSrv.pricingMode || undefined,
        discountEligible: newSrv.discountEligible,
        availableBranches: branchesToDeploy,
        metadata: {
          consumables: newSrv.consumables || [],
          availableBranches: branchesToDeploy,
        },
      });

      // Synchronize each deployed branch to the PostgreSQL service_branch_prices table
      for (const branchRef of branchesToDeploy) {
        const matchedBranch = adminBranches.find(
          (b) =>
            b.name.toLowerCase().trim() === branchRef.toLowerCase().trim() ||
            b.id === branchRef ||
            (b.code && b.code.toLowerCase().trim() === branchRef.toLowerCase().trim()),
        );
        if (matchedBranch) {
          try {
            await catalogueApi.setBranchPrice(created.id, {
              branchId: matchedBranch.id,
              price: Number(newSrv.price) || 1000,
              isActive: true,
            });
          } catch (bpErr) {
            console.warn(`Branch price record skipped for ${matchedBranch.name}:`, bpErr);
          }
        }
      }

      // If recipe consumables exist, attach recipe
      if (newSrv.consumables && newSrv.consumables.length > 0) {
        try {
          await catalogueApi.setServiceRecipe(created.id, {
            name: `${created.name} Standard Recipe`,
            items: newSrv.consumables.map((c, i) => ({
              skuId:
                c.id &&
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)
                  ? c.id
                  : `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
              quantityRequired: c.quantityValue || 10,
              unit: c.unit || 'ml',
            })),
          });
        } catch (recipeErr) {
          console.warn('Recipe could not be attached:', recipeErr);
        }
      }

      setIsAddModalOpen(false);
      setNewSrv({
        ...defaultNewServiceData,
        categoryId: categoriesList[0]?.id || '',
        category: categoriesList[0]?.name || defaultNewServiceData.category,
        availableBranches: adminBranches.map((b) => b.name),
      });
      toast(`Service "${created.name}" created and published to database.`);
      await loadServicesAndCategories();
    } catch (err: any) {
      console.error('Failed to create service:', err);
      toast(extractErrorMessage(err, 'Failed to create service.'));
    }
  };

  // Submission for Edit Mode
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editService) return;

    if (!editService.name || !editService.code) {
      toast('Please provide a valid service name and code.');
      return;
    }

    if (isEditServiceCodeTaken) {
      toast(`Service code "${editService.code.toUpperCase().trim()}" is already in use. Please choose a unique code.`);
      return;
    }

    let catId = editService.categoryId;
    if (!catId && editService.category) {
      catId = categoriesList.find(
        (c) => c.name.toLowerCase() === editService.category.toLowerCase(),
      )?.id;
    }
    if (!catId && categoriesList.length > 0) {
      catId = categoriesList[0].id;
    }

    try {
      await catalogueApi.updateService(editService.id, {
        categoryId: catId,
        code: editService.code.toUpperCase().trim(),
        name: editService.name.trim(),
        description: editService.description.trim() || undefined,
        durationMinutes: Number(editService.duration) || 45,
        bufferAfterMinutes: Number(editService.bufferTime) || 15,
        basePrice: Number(editService.price) || 1000,
        isActive: editService.status === 'Active',
        imageUrl: editService.imageUrl || undefined,
        requiredSkill: editService.requiredSkill || undefined,
        requiredLevel: editService.requiredLevel || undefined,
        requiredRoomOrChair: editService.requiredRoomOrChair || undefined,
        requiredEquipment: editService.requiredEquipment || undefined,
        pricingMode: editService.pricingMode || undefined,
        discountEligible: editService.discountEligible,
        availableBranches: editService.availableBranches || [],
        metadata: {
          consumables: editService.consumables || [],
          availableBranches: editService.availableBranches || [],
        },
      });

      // Synchronize each deployed branch to the PostgreSQL service_branch_prices table
      for (const branchRef of editService.availableBranches || []) {
        const matchedBranch = adminBranches.find(
          (b) =>
            b.name.toLowerCase().trim() === branchRef.toLowerCase().trim() ||
            b.id === branchRef ||
            (b.code && b.code.toLowerCase().trim() === branchRef.toLowerCase().trim()),
        );
        if (matchedBranch) {
          try {
            await catalogueApi.setBranchPrice(editService.id, {
              branchId: matchedBranch.id,
              price: Number(editService.price) || 1000,
              isActive: true,
            });
          } catch (bpErr) {
            console.warn(`Branch price record skipped for ${matchedBranch.name}:`, bpErr);
          }
        }
      }

      // Also sync recipe consumables if present
      if (editService.consumables && editService.consumables.length > 0) {
        try {
          await catalogueApi.setServiceRecipe(editService.id, {
            name: `${editService.name} Standard Recipe`,
            items: editService.consumables.map((c, i) => ({
              skuId:
                c.id &&
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)
                  ? c.id
                  : `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
              quantityRequired: c.quantityValue || 10,
              unit: c.unit || 'ml',
            })),
          });
        } catch (recipeErr) {
          console.warn('Recipe could not be updated:', recipeErr);
        }
      }

      setEditService(null);
      toast(`Service "${editService.name}" updated successfully.`);
      await loadServicesAndCategories();
    } catch (err: any) {
      console.error('Failed to update service:', err);
      toast(extractErrorMessage(err, 'Failed to update service.'));
    }
  };

  const handleDuplicate = (service: ServiceRecord) => {
    const dup: ServiceRecord = {
      ...service,
      id: `SRV-00${services.length + 1}`,
      code: `${service.code}-COPY`,
      name: `${service.name} (Copy)`,
      status: 'Draft',
      lastUpdated: 'Just Now',
    };
    setServices([dup, ...services]);
    toast(`Duplicated "${service.name}" as Draft.`);
  };

  const handleToggleStatus = async (service: ServiceRecord) => {
    const nextActive = service.status !== 'Active';
    try {
      await catalogueApi.updateService(service.id, {
        isActive: nextActive,
      });
      setDeactivateService(null);
      toast(`Service "${service.name}" is now ${nextActive ? 'Active' : 'Inactive'}.`);
      await loadServicesAndCategories();
    } catch (err: any) {
      console.error('Failed to toggle service status:', err);
      toast(extractErrorMessage(err, 'Failed to update status.'));
    }
  };

  const handleDeleteService = async (service: ServiceRecord) => {
    try {
      await catalogueApi.deleteService(service.id);
      setServiceToDelete(null);
      toast(`Service "${service.name}" removed from catalogue.`);
      await loadServicesAndCategories();
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      toast(extractErrorMessage(err, 'Failed to delete service.'));
    }
  };

  const handleExport = () => {
    toast(`Exported ${filteredServices.length} master services to CSV.`);
  };

  // Determine active modal context (Add or Edit)
  const isFormModalOpen = isAddModalOpen || editService !== null;
  const isEditMode = editService !== null;
  const currentFormData = isEditMode && editService ? editService : newSrv;
  const editSrv = editService;
  const viewSrv = viewService;
  const deactSrv = deactivateService;
  const srvToDelete = serviceToDelete;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Master Services Catalogue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {services.length} Services Configured
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Central repository of treatment timings, buffer envelopes, required skill
            certifications, media assets, and multi-branch availability.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {readOnly && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5A2EA6] text-xs font-bold border border-purple-200/60 flex items-center gap-1.5 shadow-3xs">
              <Eye className="w-3.5 h-3.5" />
              <span>View-Only Mode</span>
            </div>
          )}

          {!readOnly && services.length === 0 && !isLoading && (
            <Button
              variant="outline"
              onClick={handleSeedStandardServices}
              disabled={isSeeding}
              className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
            >
              {isSeeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Seed Standard Services</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Catalogue</span>
          </Button>

          {!readOnly && (
            <Button
              onClick={() => {
                catalogueApi.fetchResources().then((list) => {
                  if (Array.isArray(list) && list.length > 0) setResourcesList(list);
                });
                catalogueApi.fetchSkills().then((skills) => {
                  if (Array.isArray(skills) && skills.length > 0) setSkillsList(skills);
                });
                setNewSrv({
                  ...defaultNewServiceData,
                  categoryId: categoriesList[0]?.id || '',
                  category: categoriesList[0]?.name || defaultNewServiceData.category,
                  availableBranches: adminBranches.map((b) => b.name),
                  requiredSkill: availableSkills[0]?.name || defaultNewServiceData.requiredSkill,
                  requiredRoomOrChair:
                    availableRoomsAndChairs[0]?.name || defaultNewServiceData.requiredRoomOrChair,
                  requiredEquipment:
                    availableEquipment[0]?.name || defaultNewServiceData.requiredEquipment,
                });
                setIsAddModalOpen(true);
              }}
              className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by name, code, skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Categories</option>
              {categoryNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

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
                {adminBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {!lockBranch && <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />}

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Active Service Master Index
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Multi-branch services, cover media, required staff certifications, and duration
                slots
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredServices.length} Services Listed
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Service Title & Image',
                  'Category',
                  'Duration & Buffer',
                  'Base Price',
                  ...(readOnly ? [] : ['Branch Coverage']),
                  'Required Skill & Level',
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
              {isLoading ? (
                <tr>
                  <td colSpan={readOnly ? 7 : 8} className="p-10 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#5A2EA6]" />
                      <span className="text-xs font-medium">
                        Loading master services catalogue from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={readOnly ? 7 : 8} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                        <Scissors className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-ink">
                        No Services Found
                      </h4>
                      <p className="text-xs text-muted max-w-sm">
                        {searchQuery
                          ? 'No services match your active filter criteria.'
                          : readOnly
                          ? 'No services have been published by the brand administrator yet.'
                          : "You haven't defined any salon services yet. Seed standard industry services to populate your catalog immediately."}
                      </p>
                      {!searchQuery && !readOnly && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            onClick={handleSeedStandardServices}
                            disabled={isSeeding}
                            className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-2"
                          >
                            {isSeeding ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                            <span>Seed Standard Services</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              catalogueApi.fetchResources().then((list) => {
                                if (Array.isArray(list) && list.length > 0) setResourcesList(list);
                              });
                              catalogueApi.fetchSkills().then((skills) => {
                                if (Array.isArray(skills) && skills.length > 0) setSkillsList(skills);
                              });
                              setNewSrv({
                                ...defaultNewServiceData,
                                categoryId: categoriesList[0]?.id || '',
                                category: categoriesList[0]?.name || defaultNewServiceData.category,
                                availableBranches: adminBranches.map((b) => b.name),
                                requiredSkill: availableSkills[0]?.name || defaultNewServiceData.requiredSkill,
                                requiredRoomOrChair:
                                  availableRoomsAndChairs[0]?.name || defaultNewServiceData.requiredRoomOrChair,
                                requiredEquipment:
                                  availableEquipment[0]?.name || defaultNewServiceData.requiredEquipment,
                              });
                              setIsAddModalOpen(true);
                            }}
                            className="h-9 px-4 rounded-xl text-xs font-bold border-purple-200 text-[#5A2EA6]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Custom Service</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Service Title & Image */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-purple-100 bg-[#FCFAFF] shadow-xs relative flex items-center justify-center">
                          {srv.imageUrl ? (
                            <img
                              src={srv.imageUrl}
                              alt={srv.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Scissors className="w-4 h-4 text-[#5A2EA6]" />
                          )}
                        </div>
                        <div>
                          <div
                            className="font-bold text-ink text-[13px] hover:text-[#5A2EA6] transition-colors cursor-pointer"
                            onClick={() => setViewService(srv)}
                          >
                            {srv.name}
                          </div>
                          <div className="text-[10px] text-[#5A2EA6] font-mono font-bold mt-0.5">
                            {srv.code} · {srv.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5A2EA6] text-[10.5px] font-semibold border border-purple-100">
                        {srv.category}
                      </span>
                    </td>

                    {/* Duration & Buffer */}
                    <td className="p-3.5">
                      <div className="font-bold text-ink text-xs flex items-center gap-1">
                        <Clock className="w-3 log-3 text-[#5A2EA6]" />
                        <span>{srv.duration} mins</span>
                      </div>
                      <div className="text-[10px] text-muted font-medium">
                        +{srv.bufferTime}m turnover buffer
                      </div>
                    </td>

                    {/* Base Price */}
                    <td className="p-3.5">
                      <div className="font-bold text-ink text-[13.5px] font-serif">
                        ₹{srv.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[9.5px] text-soft">
                        {srv.taxRate} · {srv.discountEligible ? 'Discountable' : 'No Promo'}
                      </div>
                    </td>

                    {/* Branch Coverage */}
                    {!readOnly && (
                      <td className="p-3.5">
                        <span className="font-semibold text-soft text-xs">
                          {adminBranches.length > 0 && srv.availableBranches.length === adminBranches.length
                            ? 'All Branches'
                            : `${srv.availableBranches.length} Branches`}
                        </span>
                        <div className="text-[9.5px] text-muted truncate max-w-[130px]">
                          {srv.pricingMode === 'Shared price across branches'
                            ? 'Shared Rate'
                            : 'Branch Custom'}
                        </div>
                      </td>
                    )}

                    {/* Required Skill & Level */}
                    <td className="p-3.5">
                      <div className="font-semibold text-ink text-xs">{srv.requiredSkill}</div>
                      <span
                        className={cn(
                          'inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded-md mt-0.5',
                          srv.requiredLevel === 'Expert'
                            ? 'bg-rose-100 text-rose-800'
                            : srv.requiredLevel === 'Senior'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800',
                        )}
                      >
                        {srv.requiredLevel} Level
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          srv.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : srv.status === 'Draft'
                              ? 'bg-amber-100 text-amber-800'
                              : srv.status === 'Pending Approval'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            srv.status === 'Active'
                              ? 'bg-emerald-600'
                              : srv.status === 'Draft'
                                ? 'bg-amber-600'
                                : srv.status === 'Pending Approval'
                                  ? 'bg-blue-600'
                                  : 'bg-slate-400',
                          )}
                        />
                        {srv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewService(srv)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Full Specifications"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!readOnly && (
                          <>
                            <button
                              onClick={() => setEditService({ ...srv })}
                              className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Edit Service"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDuplicate(srv)}
                              className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Duplicate Service"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeactivateService(srv)}
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0',
                                srv.status === 'Active'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                              )}
                              title={
                                srv.status === 'Active' ? 'Deactivate Service' : 'Activate Service'
                              }
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setServiceToDelete(srv)}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS (Portaled to document.body) ================= */}

      {/* 1. UNIFIED ADD & EDIT SERVICE MODAL (Exact Same Rich Architecture) */}
      {isFormModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      {isEditMode && editSrv
                        ? `Edit Service: ${editSrv.name}`
                        : 'Add Service to Master Catalogue'}
                    </h3>
                    {isEditMode && editSrv && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold font-mono">
                        {editSrv.code} · {editSrv.id}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    {isEditMode
                      ? 'Update treatment duration, staff skill requirements, resources, media assets, and pricing models.'
                      : 'Configure treatment duration, staff skill requirements, resources, media assets, and pricing models.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isEditMode) setEditService(null);
                    else setIsAddModalOpen(false);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={isEditMode ? handleSaveEdit : handleAddService}
                className="p-6 space-y-5 overflow-y-auto custom-scroll text-xs"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  {isEditMode
                    ? 'Modifications to this master service will synchronize across designated branch appointment books and online booking portals in real-time.'
                    : 'New master service will synchronize across designated branch appointment books and online booking portals.'}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />

                {/* Section 1: Basic Information & Media */}
                <div>
                  <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-2">
                    <span>1. Basic Information &amp; Service Cover Image</span>
                  </h4>

                  {/* SERVICE IMAGE UPLOAD & SELECTOR SECTION */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                        Service Cover Image
                      </label>
                      <span className="text-[10px] text-muted font-medium">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </div>

                    {currentFormData.imageUrl ? (
                      <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-[#FAF8FC] group p-3 flex items-center gap-4">
                        <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-purple-100 shadow-sm relative">
                          <img
                            src={currentFormData.imageUrl}
                            alt="Service Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <strong className="block text-xs font-bold text-ink truncate">
                              Cover Image Attached
                            </strong>
                          </div>
                          <span className="text-[10.5px] text-soft block truncate mt-0.5">
                            Featured on booking calendar, client apps, and customer checkout
                            receipts
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => imageFileInputRef.current?.click()}
                              className="px-3 py-1 rounded-lg text-[10.5px] font-bold bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] transition-colors border-0 cursor-pointer flex items-center gap-1"
                            >
                              <Camera className="w-3 h-3" /> Change Photo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (isEditMode && editService) {
                                  setEditService({ ...editService, imageUrl: '' });
                                } else {
                                  setNewSrv((prev) => ({ ...prev, imageUrl: '' }));
                                }
                              }}
                              className="px-3 py-1 rounded-lg text-[10.5px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border-0 cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => imageFileInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-200 hover:border-[#5A2EA6] bg-[#FCFAFF] hover:bg-purple-50/40 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group select-none"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] group-hover:scale-110 transition-transform grid place-items-center mx-auto mb-1.5">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold text-ink group-hover:text-[#5A2EA6] transition-colors">
                          Click to upload service photo or drag &amp; drop
                        </div>
                        <p className="text-[10.5px] text-muted mt-0.5">
                          High-resolution photo for customer mobile app cards, online booking, &amp;
                          service menu
                        </p>
                      </div>
                    )}

                    {/* Curated Presets Picker */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                          Or select a curated salon preset photo:
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className="text-[10px] text-[#5A2EA6] font-bold hover:underline flex items-center gap-1 border-0 bg-transparent cursor-pointer"
                        >
                          <LinkIcon className="w-2.5 h-2.5" />
                          {showUrlInput ? 'Hide URL input' : 'Enter Image URL'}
                        </button>
                      </div>

                      {showUrlInput && (
                        <div className="flex gap-2 mb-2">
                          <input
                            type="url"
                            placeholder="Paste image URL (https://...)"
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            className="flex-1 h-9 px-3 rounded-lg border border-purple-100 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customUrlInput.trim()) {
                                if (isEditMode && editService) {
                                  setEditService({
                                    ...editService,
                                    imageUrl: customUrlInput.trim(),
                                  });
                                } else {
                                  setNewSrv((prev) => ({
                                    ...prev,
                                    imageUrl: customUrlInput.trim(),
                                  }));
                                }
                                setCustomUrlInput('');
                                setShowUrlInput(false);
                                toast('Custom image URL applied.');
                              }
                            }}
                            className="h-9 px-3 rounded-lg text-xs font-bold bg-[#5A2EA6] text-white border-0 cursor-pointer"
                          >
                            Apply URL
                          </button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {SERVICE_IMAGE_PRESETS.map((preset) => {
                          const isSelected = currentFormData.imageUrl === preset.url;
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                if (isEditMode && editService) {
                                  setEditService({ ...editService, imageUrl: preset.url });
                                } else {
                                  setNewSrv((prev) => ({ ...prev, imageUrl: preset.url }));
                                }
                              }}
                              className={cn(
                                'px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all border cursor-pointer flex items-center gap-1',
                                isSelected
                                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs font-bold'
                                  : 'bg-white text-soft border-purple-100 hover:border-[#5A2EA6]/40 hover:text-ink',
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                              {preset.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Signature Botanical Hydra-Facial"
                        value={currentFormData.name}
                        onChange={(e) => {
                          if (isEditMode && editService) {
                            setEditService({ ...editService, name: e.target.value });
                          } else {
                            setNewSrv((prev) => ({ ...prev, name: e.target.value }));
                          }
                        }}
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Service Code *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SKIN-HYD-09"
                          value={currentFormData.code}
                          onChange={(e) => {
                            if (isEditMode && editService) {
                              setEditService({ ...editService, code: e.target.value });
                            } else {
                              setNewSrv((prev) => ({ ...prev, code: e.target.value }));
                            }
                          }}
                          className={cn(
                            'w-full h-11 px-4 rounded-xl border bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none uppercase font-mono',
                            ((isEditMode && isEditServiceCodeTaken) || (!isEditMode && isAddServiceCodeTaken))
                              ? 'border-rose-400 focus:border-rose-500'
                              : 'border-purple-100 focus:border-[#5A2EA6]',
                          )}
                        />
                        {((isEditMode && isEditServiceCodeTaken) || (!isEditMode && isAddServiceCodeTaken)) && (
                          <span className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            Code &quot;{currentFormData.code.toUpperCase().trim()}&quot; is already in use by another service.
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Category Group *
                        </label>
                        <select
                          value={
                            currentFormData.categoryId ||
                            categoriesList.find(
                              (c) => c.name.toLowerCase() === currentFormData.category.toLowerCase(),
                            )?.id ||
                            (categoriesList[0]?.id ?? '')
                          }
                          onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedCat = categoriesList.find((c) => c.id === selectedId);
                            if (isEditMode && editService) {
                              setEditService({
                                ...editService,
                                categoryId: selectedId,
                                category: selectedCat?.name || editService.category,
                              });
                            } else {
                              setNewSrv((prev) => ({
                                ...prev,
                                categoryId: selectedId,
                                category: selectedCat?.name || prev.category,
                              }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          {categoriesList.length > 0 ? (
                            categoriesList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.code})
                              </option>
                            ))
                          ) : (
                            <option value="">No categories created yet</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        Service Description / Customer Overview
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Detailed explanation of the protocol, ingredients, and expected results..."
                        value={currentFormData.description}
                        onChange={(e) => {
                          if (isEditMode && editService) {
                            setEditService({ ...editService, description: e.target.value });
                          } else {
                            setNewSrv((prev) => ({ ...prev, description: e.target.value }));
                          }
                        }}
                        className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Timing, Skill & Resource Requirements */}
                <div>
                  <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
                    2. Service Configuration &amp; Skill Requirements
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Duration (Minutes) *
                        </label>
                        <input
                          type="number"
                          min={5}
                          step={5}
                          value={currentFormData.duration}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value) || 45;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, duration: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, duration: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Turnover Buffer Time (Minutes)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={5}
                          value={currentFormData.bufferTime}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value) || 0;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, bufferTime: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, bufferTime: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Required Skill Certification *
                        </label>
                        <select
                          value={currentFormData.requiredSkill}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, requiredSkill: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, requiredSkill: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          {currentFormData.requiredSkill &&
                            !availableSkills.some((s) => s.name.toLowerCase() === currentFormData.requiredSkill.toLowerCase()) && (
                              <option value={currentFormData.requiredSkill}>
                                {currentFormData.requiredSkill}
                              </option>
                            )}
                          {availableSkills.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} ({s.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Required Staff Level *
                        </label>
                        <select
                          value={currentFormData.requiredLevel}
                          onChange={(e) => {
                            const val = e.target.value as ServiceRecord['requiredLevel'];
                            if (isEditMode && editService) {
                              setEditService({ ...editService, requiredLevel: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, requiredLevel: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          <option value="Junior">Junior Stylist / Apprentice (0-2 Yrs)</option>
                          <option value="Intermediate">Intermediate Practitioner (2-5 Yrs)</option>
                          <option value="Senior">Senior Specialist (5-8 Yrs)</option>
                          <option value="Expert">Master / Expert Lead (8+ Yrs)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Required Room / Chair Type *
                        </label>
                        <select
                          value={currentFormData.requiredRoomOrChair}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isEditMode && editService) {
                              setEditService({
                                ...editService,
                                requiredRoomOrChair: val,
                              });
                            } else {
                              setNewSrv((prev) => ({
                                ...prev,
                                requiredRoomOrChair: val,
                              }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          {currentFormData.requiredRoomOrChair &&
                            !availableRoomsAndChairs.some(
                              (r) => r.name.toLowerCase() === currentFormData.requiredRoomOrChair.toLowerCase(),
                            ) && (
                              <option value={currentFormData.requiredRoomOrChair}>
                                {currentFormData.requiredRoomOrChair}
                              </option>
                            )}
                          {availableRoomsAndChairs.map((r) => (
                            <option key={r.id} value={r.name}>
                              {r.name} [{r.type}] {r.code ? `· ${r.code}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Required Salon Equipment *
                        </label>
                        <select
                          value={currentFormData.requiredEquipment}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, requiredEquipment: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, requiredEquipment: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          {currentFormData.requiredEquipment &&
                            !availableEquipment.some(
                              (eq) => eq.name.toLowerCase() === currentFormData.requiredEquipment.toLowerCase(),
                            ) && (
                              <option value={currentFormData.requiredEquipment}>
                                {currentFormData.requiredEquipment}
                              </option>
                            )}
                          {availableEquipment.map((eq) => (
                            <option key={eq.id} value={eq.name}>
                              {eq.name} {eq.code ? `· ${eq.code}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Pricing, Tax & Policies */}
                <div>
                  <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider mb-2.5 pb-1 border-b border-slate-100">
                    3. Pricing, Taxes &amp; Commercial Terms
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3.5">
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Default Base Price (₹) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={currentFormData.price}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value) || 0;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, price: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, price: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Pricing Mode
                        </label>
                        <select
                          value={currentFormData.pricingMode}
                          onChange={(e) => {
                            const val = e.target.value as ServiceRecord['pricingMode'];
                            if (isEditMode && editService) {
                              setEditService({ ...editService, pricingMode: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, pricingMode: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          <option value="Shared price across branches">Shared Global Price</option>
                          <option value="Branch-specific pricing">Branch-Specific Pricing</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          GST Tax Rate
                        </label>
                        <select
                          value={currentFormData.taxRate}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, taxRate: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, taxRate: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          <option value="18% GST">18% GST (Standard)</option>
                          <option value="12% GST">12% GST (Spa Rituals)</option>
                          <option value="5% GST">5% GST (Special)</option>
                          <option value="0% Exempt">0% Exempt</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                          Lifecycle Status
                        </label>
                        <select
                          value={currentFormData.status}
                          onChange={(e) => {
                            const val = e.target.value as ServiceRecord['status'];
                            if (isEditMode && editService) {
                              setEditService({ ...editService, status: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, status: val }));
                            }
                          }}
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Draft">Draft</option>
                          <option value="Pending Approval">Pending Approval</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-ink text-xs">
                        <input
                          type="checkbox"
                          checked={currentFormData.discountEligible}
                          onChange={(e) => {
                            const val = e.target.checked;
                            if (isEditMode && editService) {
                              setEditService({ ...editService, discountEligible: val });
                            } else {
                              setNewSrv((prev) => ({ ...prev, discountEligible: val }));
                            }
                          }}
                          className="w-4 h-4 text-[#5A2EA6] rounded focus:ring-[#5A2EA6]"
                        />
                        <span>Eligible for Membership, Package &amp; Promotional Discounts</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 4: Recipe / Consumables Formula (BOM) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-100">
                    <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                      <span>4. Service Recipe &amp; Consumables Formula (Bill of Materials)</span>
                    </h4>
                    <span className="text-[10px] font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {(currentFormData.consumables || []).length} Consumable Items
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[11px] text-muted">
                      Configure standard product and chemical consumption quantities automatically
                      deducted from salon backwash inventory upon appointment completion.
                    </p>

                    {/* Add Consumable Row */}
                    <div className="p-3.5 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                        {/* Product Name with Auto-Suggest Datalist */}
                        <div className="sm:col-span-5">
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Consumable Product Name *
                          </label>
                          <input
                            type="text"
                            list="commonConsumablesList"
                            placeholder="e.g. Organic Styling Serum or Keratin Cream"
                            value={newConsumableName}
                            onChange={(e) => setNewConsumableName(e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                          <datalist id="commonConsumablesList">
                            <option value="Organic Styling Serum" />
                            <option value="Nourishing Hair Wash & Conditioner" />
                            <option value="Keratin Complex Protein Serum" />
                            <option value="Clarifying Pre-Treatment Wash" />
                            <option value="Thermal Shield Sealer" />
                            <option value="Glycolic Acid Exfoliating Pod" />
                            <option value="Antioxidant Infusion Serum" />
                            <option value="Collagen Peptide Hydrogel Mask" />
                            <option value="Cold-Pressed Sweet Almond Oil" />
                            <option value="Kashmir Lavender Essential Oil" />
                            <option value="UV Monomer Sculpture Gel" />
                            <option value="High-Gloss No-Wipe Topcoat" />
                            <option value="HD Silicon Airbrush Foundation" />
                            <option value="Eucalyptus Pre-Shave Oil" />
                            <option value="Tea Tree Scalp Polish & Balm" />
                            <option value="Hyaluronic Acid Booster Ampoule" />
                            <option value="L'Oréal Majirel Permanent Hair Colour" />
                            <option value="L'Oréal Oxydant Crème Developer 20 Vol" />
                          </datalist>
                        </div>

                        {/* Standard Quantity Numeric Input */}
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Standard Qty *
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="any"
                            placeholder="e.g. 30"
                            value={newConsumableAmount}
                            onChange={(e) => setNewConsumableAmount(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>

                        {/* Unit Dropdown Selector */}
                        <div className="sm:col-span-3">
                          <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                            Unit of Measurement *
                          </label>
                          <select
                            value={newConsumableUnit}
                            onChange={(e) => setNewConsumableUnit(e.target.value)}
                            className="w-full h-10 px-2.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                          >
                            <optgroup label="Volume / Liquids">
                              <option value="ml">ml (Millilitres)</option>
                              <option value="ltr">ltr (Litres)</option>
                              <option value="pumps">pumps (Dispenser Pumps)</option>
                              <option value="drops">drops (Essential Drops)</option>
                              <option value="fl oz">fl oz (Fluid Ounces)</option>
                            </optgroup>
                            <optgroup label="Weight / Mass">
                              <option value="gm">gm (Grams)</option>
                              <option value="kg">kg (Kilograms)</option>
                              <option value="mg">mg (Milligrams)</option>
                              <option value="scoop">scoop (Powder Scoops)</option>
                            </optgroup>
                            <optgroup label="Packaging & Single-Use Count">
                              <option value="pcs">pcs (Pieces / Units)</option>
                              <option value="Tube">Tube (Color / Chemical)</option>
                              <option value="Sachet">Sachet (Single Sachet)</option>
                              <option value="Ampoule">Ampoule (Active Ampoule)</option>
                              <option value="Vial">Vial (Concentrate Vial)</option>
                              <option value="Pod">Pod (Single-Use Pod)</option>
                              <option value="Capsule">Capsule (Serum Capsule)</option>
                              <option value="Sheet">Sheet (Mask / Foil)</option>
                              <option value="Strip">Strip (Wax Strip)</option>
                              <option value="Kit">Kit (Treatment Kit)</option>
                              <option value="Pair">Pair (Gloves / Eye Pads)</option>
                            </optgroup>
                          </select>
                        </div>

                        {/* Add Button */}
                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => handleAddConsumable(isEditMode)}
                            className="w-full h-10 px-3 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer border-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Real-Time Deduction Preview */}
                      <div className="flex items-center gap-1.5 text-[10.5px] text-[#5A2EA6]/85 bg-purple-50/70 px-3 py-1.5 rounded-xl border border-purple-100/70">
                        <Zap className="w-3 h-3 text-[#5A2EA6] shrink-0" />
                        <span>
                          Automated Stock Deduction Rule: Upon appointment checkout, exactly{' '}
                          <strong className="text-[#5A2EA6]">
                            {newConsumableAmount || '—'} {newConsumableUnit}
                          </strong>{' '}
                          of <strong>{newConsumableName || 'selected consumable'}</strong> will be
                          subtracted from backwash inventory.
                        </span>
                      </div>
                    </div>

                    {/* Consumables List */}
                    <div className="space-y-2">
                      {(currentFormData.consumables || []).length > 0 ? (
                        (currentFormData.consumables || []).map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-3 bg-white rounded-xl border border-purple-100/90 shadow-2xs flex items-center justify-between gap-3 hover:border-purple-200 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="w-5 h-5 rounded-md bg-purple-50 text-[#5A2EA6] font-bold text-[10px] grid place-items-center">
                                {cIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-ink">{c.productName}</span>
                              <span className="text-slate-400">—</span>
                              <span className="text-xs font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100 flex items-center gap-1">
                                <span>{c.quantity}</span>
                              </span>
                              <span className="text-[10px] text-muted hidden sm:inline">
                                (Auto-deducted from backwash stock)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveConsumable(cIdx, isEditMode)}
                              className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors border-0 bg-transparent cursor-pointer"
                              title="Remove consumable"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 bg-[#FAF8FC] rounded-xl border border-dashed border-purple-200 text-center text-xs text-muted">
                          No recipe consumables configured yet. Add product items with exact
                          quantity and units above to enable automated stock deduction.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 5: Multi-Branch Deployment */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-slate-100">
                    <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider">
                      5. Branch Deployment ({currentFormData.availableBranches.length} of{' '}
                      {adminBranches.length} Selected)
                    </h4>
                    {adminBranches.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllBranches(true, isEditMode)}
                          className="text-[10.5px] font-bold text-[#5A2EA6] hover:underline border-0 bg-transparent cursor-pointer"
                        >
                          Select All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleSelectAllBranches(false, isEditMode)}
                          className="text-[10.5px] font-bold text-soft hover:text-rose-600 hover:underline border-0 bg-transparent cursor-pointer"
                        >
                          Deselect All
                        </button>
                      </div>
                    )}
                  </div>

                  {adminBranches.length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-800 text-xs text-center">
                      No branches found for this salon account. Please configure branches in the Locations settings.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {adminBranches.map((b) => {
                        const isSelected = currentFormData.availableBranches.includes(b.name);
                        return (
                          <div
                            key={b.id || b.name}
                            onClick={() => handleToggleBranch(b.name, isEditMode)}
                            className={cn(
                              'p-3 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-2.5 select-none',
                              isSelected
                                ? 'bg-[#FAF8FF] border-[#5A2EA6]/40 shadow-xs ring-1 ring-[#5A2EA6]/20'
                                : 'bg-white border-slate-200 hover:border-purple-200 opacity-70',
                            )}
                          >
                            <div
                              className={cn(
                                'w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-colors',
                                isSelected
                                  ? 'bg-[#5A2EA6] border-[#5A2EA6] text-white'
                                  : 'bg-white border-slate-300',
                              )}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="min-w-0">
                              <strong className="block text-xs font-bold text-ink truncate leading-tight">
                                {b.name}
                              </strong>
                              <span className="text-[10px] text-muted block truncate mt-0.5">
                                {b.city} {b.type ? `· ${b.type}` : ''}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditMode) setEditService(null);
                      else setIsAddModalOpen(false);
                    }}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditMode ? isEditServiceCodeTaken : isAddServiceCodeTaken}
                    className={cn(
                      'h-10 px-6 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-0',
                      (isEditMode ? isEditServiceCodeTaken : isAddServiceCodeTaken)
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md cursor-pointer',
                    )}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {isEditMode ? 'Save & Synchronize Changes' : 'Publish Service to Catalogue'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. View Service Modal (Detailed Specification Dossier) */}
      {viewSrv &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5">
                  {viewSrv.imageUrl && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-purple-100 shadow-xs">
                      <img
                        src={viewSrv.imageUrl}
                        alt={viewSrv.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                        {viewSrv.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold font-mono">
                        {viewSrv.code}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted mt-0.5">
                      {viewSrv.category} · {viewSrv.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewService(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs">
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  {viewSrv.description}
                </div>

                {/* KPI Mini Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-muted font-bold block uppercase">
                      Base Price
                    </span>
                    <strong className="text-[17px] font-bold text-ink mt-0.5 block font-serif">
                      ₹{viewSrv.price.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[9.5px] text-soft">{viewSrv.taxRate}</span>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-[#5A2EA6] font-bold block uppercase">
                      Duration
                    </span>
                    <strong className="text-[17px] font-bold text-ink mt-0.5 block font-serif">
                      {viewSrv.duration} mins
                    </strong>
                    <span className="text-[9.5px] text-soft">
                      +{viewSrv.bufferTime}m buffer
                    </span>
                  </div>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100/70">
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">
                      Skill Level
                    </span>
                    <strong className="text-[17px] font-bold text-emerald-900 mt-0.5 block font-serif">
                      {viewSrv.requiredLevel}
                    </strong>
                    <span className="text-[9.5px] text-emerald-700">
                      {viewSrv.requiredSkill}
                    </span>
                  </div>
                </div>

                {/* Consumable Recipe Specification (BOM) */}
                {viewSrv.consumables && viewSrv.consumables.length > 0 && (
                  <div className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                        Service Recipe / Consumables Formula (BOM)
                      </span>
                      <span className="text-[10px] font-bold text-purple-800 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                        Auto-Deducted on POS
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {viewSrv.consumables.map((c, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-white p-2 rounded-lg border border-purple-100 text-xs"
                        >
                          <span className="font-semibold text-ink">• {c.productName}</span>
                          <span className="font-bold text-[#5A2EA6] bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                            {c.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resource Requirements */}
                <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Required Room / Station:</span>
                    <strong className="text-ink">{viewSrv.requiredRoomOrChair}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Required Machine / Equipment:</span>
                    <strong className="text-ink">{viewSrv.requiredEquipment}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Pricing Distribution Mode:</span>
                    <strong className="text-[#5A2EA6]">{viewSrv.pricingMode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Discount Policy Eligibility:</span>
                    <span className="font-bold text-emerald-700">
                      {viewSrv.discountEligible
                        ? 'Eligible for Voucher / Membership Rebate'
                        : 'Fixed Standard Rate'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Last Modified Timestamp:</span>
                    <span className="text-soft font-mono">{viewSrv.lastUpdated}</span>
                  </div>
                </div>

                {/* Branch Availability Matrix - Hidden for Branch Manager */}
                {!readOnly && (
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-2">
                      Active Branch Deployment ({viewSrv.availableBranches.length} of {adminBranches.length} Locations)
                    </label>
                    {adminBranches.length === 0 ? (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs">
                        No branches configured for this salon account.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {adminBranches.map((b) => {
                          const isAvailable = viewSrv.availableBranches.includes(b.name);
                          return (
                            <div
                              key={b.id || b.name}
                              className={cn(
                                'p-2.5 rounded-xl border flex items-center justify-between text-xs',
                                isAvailable
                                  ? 'bg-purple-50/50 border-purple-200/60'
                                  : 'bg-slate-50 border-slate-200/60 opacity-60',
                              )}
                            >
                              <div>
                                <strong className="text-ink block text-[11.5px]">{b.name}</strong>
                                <span className="text-[10px] text-muted">
                                  {b.city} {b.type ? `· ${b.type}` : ''}
                                </span>
                              </div>
                              {isAvailable ? (
                                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Active
                                </span>
                              ) : (
                                <span className="text-slate-400 font-bold text-[11px]">Inactive</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    'pt-4 flex items-center border-t border-purple-50',
                    readOnly ? 'justify-end' : 'justify-between',
                  )}
                >
                  {!readOnly && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const srvToEdit = viewSrv;
                        setViewService(null);
                        setEditService({ ...srvToEdit });
                      }}
                      className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit This Service</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => setViewService(null)}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Close Specification Dossier
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Deactivate Confirmation Modal */}
      {deactSrv &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    {deactSrv.status === 'Active'
                      ? 'Deactivate Service?'
                      : 'Activate Service?'}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {deactSrv.name} ({deactSrv.code})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {deactSrv.status === 'Active'
                  ? `Deactivating "${deactSrv.name}" will prevent new bookings across online channels. Pre-existing confirmed appointments and sales invoices will not be altered.`
                  : `Activating "${deactSrv.name}" will make this service immediately available for online and POS appointments.`}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeactivateService(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleToggleStatus(deactSrv)}
                  className={cn(
                    'h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all',
                    deactSrv.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white',
                  )}
                >
                  Confirm {deactSrv.status === 'Active' ? 'Deactivation' : 'Activation'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Delete Service Confirmation Modal */}
      {srvToDelete &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    Permanently Delete Service?
                  </h3>
                  <p className="text-[11px] text-muted">
                    {srvToDelete.name} ({srvToDelete.code})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 leading-relaxed font-medium">
                Are you sure you want to remove &quot;{srvToDelete.name}&quot; from the master catalogue? This service will no longer be available for booking.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setServiceToDelete(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleDeleteService(srvToDelete)}
                  className="h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
