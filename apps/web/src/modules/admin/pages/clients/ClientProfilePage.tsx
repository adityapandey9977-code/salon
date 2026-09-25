import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Award,
  Building2,
  Cake,
  Calendar,
  CalendarClock,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  Gift,
  Heart,
  History,
  Link as LinkIcon,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { customersApi } from '@/shared/api';
import { compressImageFile } from '@/shared/utils/imageCompress';
import { masterBranches } from '../locations/AllBranchesTab';
import { type NewAppointmentData, NewAppointmentModal } from '../operations/NewAppointmentModal';
import { initialClients } from './clientsData';
import type {
  ClientAppointmentItem,
  FullClientRecord,
  HouseholdMember,
} from './ClientProfileDossierModal';
import { SendCelebrationPromoModal } from './SendCelebrationPromoModal';

export const CLIENT_AVATAR_PRESETS = [
  {
    label: 'Woman 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Woman 2',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Woman 3',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Man 1',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Man 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Man 3',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Executive',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Senior',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  },
];

export function toDateInputValue(dateStr?: string | null): string {
  if (!dateStr || dateStr === '—' || dateStr.toLowerCase().includes('not')) return '';
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  // Handle DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    const y = dmyMatch[3];
    return `${y}-${m}-${d}`;
  }

  // Handle DD Mon YYYY e.g. "14 Sep 1995" or "14 September 1995"
  const friendlyMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (friendlyMatch) {
    const d = friendlyMatch[1].padStart(2, '0');
    const mName = friendlyMatch[2].substring(0, 3).toLowerCase();
    const months: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const m = months[mName] || '01';
    const y = friendlyMatch[3];
    return `${y}-${m}-${d}`;
  }

  const parsed = new Date(trimmed);
  if (isNaN(parsed.getTime())) return '';
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function toFriendlyDate(isoStr?: string): string {
  if (!isoStr || isoStr === '—' || isoStr.toLowerCase().includes('not')) return '';
  if (/^\d{1,2}\s+[A-Za-z]{3}\s+\d{4}$/.test(isoStr)) return isoStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) {
    const [y, m, d] = isoStr.split('-');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthName = months[Number.parseInt(m, 10) - 1] || m;
    return `${Number.parseInt(d, 10)} ${monthName} ${y}`;
  }
  const parsed = new Date(isoStr);
  if (isNaN(parsed.getTime())) return isoStr;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface ClientProfilePageProps {
  clientData?: FullClientRecord;
  onBack?: () => void;
  onUpdateClient?: (updated: FullClientRecord) => void;
  lockBranch?: boolean;
  defaultBranch?: string;
}

export function getNextOccurrence(dateStr?: string | null): {
  date: string;
  daysLeftText: string;
  year: number;
} {
  if (!dateStr || dateStr === '—' || dateStr.toLowerCase().includes('not') || dateStr.trim() === '') {
    return { date: '—', daysLeftText: '', year: 2026 };
  }

  const months: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const currentYear = 2026;
  const today = new Date(2026, 7, 18); // 18 Aug 2026

  let day = 1;
  let month = 0;

  const parts = dateStr.trim().split(/[\s-]+/);
  if (parts.length >= 2) {
    if (isNaN(Number(parts[0]))) {
      const mKey = parts[0].substring(0, 3).toLowerCase();
      month = months[mKey] ?? 0;
      day = Number.parseInt(parts[1], 10) || 1;
    } else if (parts[0].length === 4) {
      month = Number.parseInt(parts[1], 10) - 1;
      day = Number.parseInt(parts[2], 10) || 1;
    } else {
      day = Number.parseInt(parts[0], 10) || 1;
      const mKey = parts[1].substring(0, 3).toLowerCase();
      month = months[mKey] ?? 0;
    }
  }

  let nextYear = currentYear;
  let targetDate = new Date(nextYear, month, day);

  if (targetDate < today) {
    nextYear += 1;
    targetDate = new Date(nextYear, month, day);
  }

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const formattedDate = `${day < 10 ? '0' : ''}${day} ${monthNames[month]} ${nextYear}`;

  let daysLeftText = '';
  if (diffDays === 0) {
    daysLeftText = 'Today!';
  } else if (diffDays === 1) {
    daysLeftText = 'Tomorrow';
  } else if (diffDays <= 30) {
    daysLeftText = `in ${diffDays}d`;
  } else {
    const monthsAhead = Math.round(diffDays / 30);
    daysLeftText = `in ${monthsAhead} mo`;
  }

  return {
    date: formattedDate,
    daysLeftText,
    year: nextYear,
  };
}

export function ClientProfilePage({
  clientData,
  onBack,
  onUpdateClient,
  lockBranch,
  defaultBranch,
}: ClientProfilePageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const isBranchLocked = Boolean(
    lockBranch ||
    window.location.pathname.startsWith('/branch-manager') ||
    window.location.pathname.includes('branch-manager'),
  );

  const clientIdFromQuery = searchParams.get('clientId');
  const clientId = params.id || clientIdFromQuery;

  // Resolve initial client record
  const initialClient: FullClientRecord =
    clientData || initialClients.find((c) => c.id === clientId) || initialClients[0];

  const [client, setClient] = useState<FullClientRecord>(initialClient);

  useEffect(() => {
    if (clientData) {
      setClient(clientData);
    }
  }, [clientData]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [celebrationModal, setCelebrationModal] = useState<{
    isOpen: boolean;
    occasion: 'birthday' | 'anniversary';
    mode?: 'instant' | 'auto';
  }>({
    isOpen: false,
    occasion: 'birthday',
    mode: 'instant',
  });

  const nextBirthday = getNextOccurrence(client.dob);
  const nextAnniversary = getNextOccurrence(client.anniversary || '18 Nov 2018');

  const bdayAuto = {
    autoSend: client.autoCelebrationSettings?.birthdayAutoSend ?? true,
    leadDays: client.autoCelebrationSettings?.birthdayLeadDays ?? 3,
    channel: client.autoCelebrationSettings?.birthdayChannel ?? 'whatsapp',
  };

  const annivAuto = {
    autoSend: client.autoCelebrationSettings?.anniversaryAutoSend ?? true,
    leadDays: client.autoCelebrationSettings?.anniversaryLeadDays ?? 5,
    channel: client.autoCelebrationSettings?.anniversaryChannel ?? 'whatsapp',
  };

  // File input refs for avatar
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const heroAvatarFileInputRef = useRef<HTMLInputElement>(null);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleHeroAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('Image file size must be less than 10MB.');
      return;
    }
    try {
      const dataUrl = await compressImageFile(file);
      const updatedClient = { ...client, avatarUrl: dataUrl };
      setClient(updatedClient);
      setEditFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
      if (client.id && (client.id.includes('-') || client.id.length > 20)) {
        await customersApi.update(client.id, { avatarUrl: dataUrl });
      }
      if (onUpdateClient) {
        onUpdateClient(updatedClient);
      }
      toast('Profile photo updated successfully!');
    } catch (err) {
      console.warn('Hero avatar upload error:', err);
      toast('Failed to update profile photo.');
    }
  };

  // Edit form state
  const [editModalTab, setEditModalTab] = useState<'basic' | 'household' | 'safety' | 'consent'>(
    'basic',
  );
  const [editAllergyInput, setEditAllergyInput] = useState('');
  const [editTagInput, setEditTagInput] = useState('');

  const [editFormData, setEditFormData] = useState({
    firstName: client.firstName,
    lastName: client.lastName,
    mobile: client.mobile,
    email: client.email,
    gender: client.gender,
    dob: client.dob,
    anniversary: client.anniversary || '18 Nov 2018',
    anniversaryOccasion: client.anniversaryOccasion || 'Wedding Anniversary',
    avatarUrl: client.avatarUrl || '',
    primaryBranch: client.primaryBranch,
    segment: client.segment,
    preferredStaff: client.preferredStaff,
    preferredChannel: client.preferredChannel,
    addressLine1: client.address.line1,
    city: client.address.city,
    state: client.address.state,
    pincode: client.address.pincode,
    householdName: client.household.name,
    householdMembers: [...client.household.members],
    allergies: client.safetyAllergies?.allergies || ['Ammonia Dye', 'Strong Sulphates'],
    patchTestRequired: client.safetyAllergies?.patchTestRequired ?? true,
    patchTestCompleted: client.safetyAllergies?.patchTestCompleted ?? true,
    cautionNote:
      client.safetyAllergies?.cautionNote ||
      'Perform 24h patch test before any high-lift bleach process.',
    acquisitionSource: client.consentReferral?.acquisitionSource || 'Instagram',
    whatsappOptIn: client.consentReferral?.whatsappOptIn ?? true,
    smsOptIn: client.consentReferral?.smsOptIn ?? true,
    emailOptIn: client.consentReferral?.emailOptIn ?? true,
    tags: client.consentReferral?.tags || [
      'VIP',
      'High Spender',
      'Organic Products Only',
      'Family Account',
    ],
  });

  const openEditModal = () => {
    setEditModalTab('basic');
    setEditAllergyInput('');
    setEditTagInput('');
    setEditFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      mobile: client.mobile,
      email: client.email,
      gender: client.gender,
      dob: client.dob,
      anniversary: client.anniversary || '18 Nov 2018',
      anniversaryOccasion: client.anniversaryOccasion || 'Wedding Anniversary',
      avatarUrl: client.avatarUrl || '',
      primaryBranch: client.primaryBranch,
      segment: client.segment,
      preferredStaff: client.preferredStaff,
      preferredChannel: client.preferredChannel,
      addressLine1: client.address.line1,
      city: client.address.city,
      state: client.address.state,
      pincode: client.address.pincode,
      householdName: client.household.name,
      householdMembers: client.household.members.map((m) => ({ ...m })),
      allergies: client.safetyAllergies?.allergies
        ? [...client.safetyAllergies.allergies]
        : ['Ammonia Dye', 'Strong Sulphates'],
      patchTestRequired: client.safetyAllergies?.patchTestRequired ?? true,
      patchTestCompleted: client.safetyAllergies?.patchTestCompleted ?? true,
      cautionNote:
        client.safetyAllergies?.cautionNote ||
        'Perform 24h patch test before any high-lift bleach process.',
      acquisitionSource: client.consentReferral?.acquisitionSource || 'Instagram',
      whatsappOptIn: client.consentReferral?.whatsappOptIn ?? true,
      smsOptIn: client.consentReferral?.smsOptIn ?? true,
      emailOptIn: client.consentReferral?.emailOptIn ?? true,
      tags: client.consentReferral?.tags
        ? [...client.consentReferral.tags]
        : ['VIP', 'High Spender', 'Organic Products Only', 'Family Account'],
    });
    setIsEditModalOpen(true);
  };

  const handleAddAllergy = () => {
    if (editAllergyInput.trim()) {
      setEditFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, editAllergyInput.trim()],
      }));
      setEditAllergyInput('');
    }
  };

  const handleRemoveAllergy = (idx: number) => {
    setEditFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== idx),
    }));
  };

  const handleAddTag = () => {
    if (editTagInput.trim()) {
      setEditFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, editTagInput.trim()],
      }));
      setEditTagInput('');
    }
  };

  const handleRemoveTag = (idx: number) => {
    setEditFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== idx),
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('Image file size must be less than 10MB.');
      return;
    }
    try {
      const result = await compressImageFile(file);
      setEditFormData((prev) => ({ ...prev, avatarUrl: result }));
      toast('Profile photo attached.');
    } catch {
      toast('Failed to process image file.');
    }
  };

  const handleAddHouseholdMember = () => {
    setEditFormData((prev) => ({
      ...prev,
      householdMembers: [...prev.householdMembers, { name: '', relation: 'Spouse', mobile: '' }],
    }));
  };

  const handleUpdateHouseholdMember = (index: number, field: keyof HouseholdMember, value: any) => {
    setEditFormData((prev) => {
      const updated = [...prev.householdMembers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, householdMembers: updated };
    });
  };

  const handleRemoveHouseholdMember = (index: number) => {
    setEditFormData((prev) => {
      const updated = prev.householdMembers.filter((_, i) => i !== index);
      return { ...prev, householdMembers: updated };
    });
  };

  // Appointment booking modal state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const handleNewBookingSuccess = (newApt: NewAppointmentData) => {
    const newAppointmentItem: ClientAppointmentItem = {
      id: newApt.id,
      date: newApt.date,
      time: newApt.time,
      branch: newApt.branch,
      service: newApt.services.map((s) => s.name).join(' + '),
      staff: newApt.staffName,
      status: 'Confirmed',
      amount: newApt.totalAmount || newApt.estimatedAmount,
      source: 'POS Walk-in',
    };
    setClient((prev) => ({
      ...prev,
      appointments: [newAppointmentItem, ...prev.appointments],
      totalVisits: prev.totalVisits + 1,
    }));
    toast(`Appointment #${newApt.id} confirmed for ${client.fullName} at ${newApt.branch}!`);
    setIsNewBookingOpen(false);
  };

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'personal'
    | 'safety'
    | 'household'
    | 'appointments'
    | 'history'
    | 'packages'
    | 'membership'
    | 'wallet'
    | 'feedback'
    | 'notes'
    | 'photos'
    | 'consent'
  >('overview');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/clients');
    }
  };

  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const initials =
      `${editFormData.firstName[0] || ''}${editFormData.lastName ? editFormData.lastName[0] : ''}`.toUpperCase() ||
      'CL';
    const updated: FullClientRecord = {
      ...client,
      firstName: editFormData.firstName.trim(),
      lastName: editFormData.lastName.trim(),
      fullName: `${editFormData.firstName.trim()} ${editFormData.lastName.trim()}`.trim(),
      mobile: editFormData.mobile.trim(),
      email: editFormData.email.trim(),
      gender: editFormData.gender,
      dob: editFormData.dob,
      anniversary: editFormData.anniversary,
      anniversaryOccasion: editFormData.anniversaryOccasion,
      avatarInitials: initials,
      avatarUrl: editFormData.avatarUrl,
      primaryBranch: editFormData.primaryBranch,
      segment: editFormData.segment,
      preferredStaff: editFormData.preferredStaff,
      preferredChannel: editFormData.preferredChannel,
      address: {
        ...client.address,
        line1: editFormData.addressLine1,
        city: editFormData.city,
        state: editFormData.state,
        pincode: editFormData.pincode,
      },
      household: {
        name:
          editFormData.householdName.trim() ||
          `${editFormData.lastName || editFormData.firstName} Household`,
        members: editFormData.householdMembers.filter((m) => m.name.trim() !== ''),
      },
      safetyAllergies: {
        allergies: editFormData.allergies,
        patchTestRequired: editFormData.patchTestRequired,
        patchTestCompleted: editFormData.patchTestCompleted,
        cautionNote: editFormData.cautionNote,
      },
      consentReferral: {
        acquisitionSource: editFormData.acquisitionSource,
        whatsappOptIn: editFormData.whatsappOptIn,
        smsOptIn: editFormData.smsOptIn,
        emailOptIn: editFormData.emailOptIn,
        tags: editFormData.tags,
      },
    };

    if (client.id && (client.id.includes('-') || client.id.length > 20)) {
      try {
        const formattedDob = updated.dob ? toDateInputValue(updated.dob) : null;
        await customersApi.update(client.id, {
          firstName: updated.firstName,
          lastName: updated.lastName,
          displayName: updated.fullName,
          mobilePhone: updated.mobile,
          email: updated.email || undefined,
          avatarUrl: updated.avatarUrl || null,
          gender: (updated.gender === 'Male' ? 'MALE' : updated.gender === 'Other' ? 'OTHER' : 'FEMALE') as any,
          dateOfBirth: formattedDob || null,
          segment: updated.segment || 'New Client',
          notes: updated.safetyAllergies?.cautionNote,
          address: {
            addressLine1: updated.address.line1,
            city: updated.address.city,
            state: updated.address.state,
            postalCode: updated.address.pincode,
            country: 'India',
          },
        });
      } catch (err) {
        console.warn('Backend API profile update error:', err);
      }
    }

    setClient(updated);
    if (onUpdateClient) {
      onUpdateClient(updated);
    }
    setIsEditModalOpen(false);
    toast(`Client profile for "${updated.fullName}" updated successfully.`);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Sparkles },
    { id: 'personal' as const, label: 'Personal Information', icon: User },
    { id: 'safety' as const, label: 'Safety & Allergies', icon: AlertTriangle },
    { id: 'household' as const, label: 'Household & Family', icon: Users },
    { id: 'appointments' as const, label: 'Appointments', icon: CalendarClock },
    { id: 'history' as const, label: 'Service History', icon: History },
    { id: 'packages' as const, label: 'Packages', icon: Package },
    { id: 'membership' as const, label: 'Membership', icon: Crown },
    { id: 'wallet' as const, label: 'Wallet & Loyalty', icon: Wallet },
    { id: 'feedback' as const, label: 'Feedback & NPS', icon: Star },
    { id: 'notes' as const, label: 'Notes & Formulas', icon: FileText },
    { id: 'photos' as const, label: 'Photos & Lookbook', icon: Camera },
    { id: 'consent' as const, label: 'Consent & Referrals', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="h-10 px-4 rounded-xl bg-white border border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center gap-2 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Clients</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-soft font-medium">
            <span className="text-[#5A2EA6] font-bold">Brand Owner</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-soft font-semibold">Clients</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-bold">{client.fullName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={openEditModal}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Edit2 className="w-4 h-4 text-[#5A2EA6]" />
            <span>Edit Profile</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => toast(`WhatsApp consultation reminder queued for ${client.fullName}`)}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-[#5A2EA6]" />
            <span>Send WhatsApp</span>
          </Button>

          <Button
            onClick={() => setIsNewBookingOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </Button>
        </div>
      </div>

      {/* Main Client Hero Card */}
      <div className="bg-white rounded-[26px] border border-[#5A2EA6]/15 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Core Identity */}
          <div className="flex items-center gap-5">
            <input
              ref={heroAvatarFileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleHeroAvatarUpload(file);
              }}
              className="hidden"
            />
            <div
              className="relative group cursor-pointer"
              onClick={() => heroAvatarFileInputRef.current?.click()}
              title="Click to change profile photo"
            >
              {client.avatarUrl ? (
                <div className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-purple-200 shadow-md shrink-0">
                  <img
                    src={client.avatarUrl}
                    alt={client.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar
                  initials={client.avatarInitials}
                  className="w-18 h-18 rounded-3xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-2xl font-bold shadow-md shrink-0"
                />
              )}
              <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-serif text-[24px] text-ink font-bold tracking-tight">
                  {client.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-xs font-bold font-mono">
                  {client.id}
                </span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                    client.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : client.status === 'Blocked'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700',
                  )}
                >
                  {client.status} Account
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
                  {client.segment}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted flex-wrap pt-1">
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  {client.mobile}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-ink">
                  <Mail className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  {client.email}
                </span>
                <span className="flex items-center gap-1.5 font-medium text-soft">
                  <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  {client.primaryBranch}
                </span>
                <span className="text-muted">Client Since {client.clientSince}</span>
              </div>

              {/* Celebrations & Milestones Highlight Bar */}
              <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                {/* Next Birthday Pill & Actions */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#5A2EA6] grid place-items-center shrink-0">
                    <Cake className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted font-bold text-[9px] uppercase tracking-wider">
                        Next Birthday
                      </span>
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[8.5px] font-extrabold',
                          bdayAuto.autoSend
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {bdayAuto.autoSend
                          ? `Auto: ${bdayAuto.leadDays === 0 ? 'On Day' : `${bdayAuto.leadDays}d Prior`}`
                          : 'Auto: Paused'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-ink font-bold text-xs">
                        {client.dob && client.dob !== '—' ? nextBirthday.date : 'Not Set'}
                      </strong>
                      {client.dob && client.dob !== '—' && nextBirthday.daysLeftText ? (
                        <span className="text-[10px] font-bold text-[#5A2EA6]">
                          ({nextBirthday.daysLeftText})
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-1">
                    {client.dob && client.dob !== '—' ? (
                      <>
                        <button
                          onClick={() =>
                            setCelebrationModal({ isOpen: true, occasion: 'birthday', mode: 'instant' })
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#5A2EA6] hover:bg-[#4a2489] text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 border-0"
                          title="Send Instant Birthday Promo"
                        >
                          <Gift className="w-3 h-3" />
                          <span>Send Promo</span>
                        </button>
                        <button
                          onClick={() =>
                            setCelebrationModal({ isOpen: true, occasion: 'birthday', mode: 'auto' })
                          }
                          className="p-1 rounded-lg bg-purple-100/70 hover:bg-purple-200 text-[#5A2EA6] transition-all cursor-pointer border-0"
                          title="Configure Automated Advance Delivery"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={openEditModal}
                        className="px-2.5 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#5A2EA6] text-[10px] font-bold transition-all cursor-pointer border-0"
                        title="Set Date of Birth"
                      >
                        Set DOB
                      </button>
                    )}
                  </div>
                </div>

                {/* Next Anniversary Pill & Actions */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 shadow-2xs">
                  <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 grid place-items-center shrink-0">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-muted font-bold text-[9px] uppercase tracking-wider">
                        Next {client.anniversaryOccasion || 'Anniversary'}
                      </span>
                      <span
                        className={cn(
                          'px-1.5 py-0.2 rounded text-[8.5px] font-extrabold',
                          annivAuto.autoSend
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {annivAuto.autoSend
                          ? `Auto: ${annivAuto.leadDays === 0 ? 'On Day' : `${annivAuto.leadDays}d Prior`}`
                          : 'Auto: Paused'}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-ink font-bold text-xs">{nextAnniversary.date}</strong>
                      {nextAnniversary.daysLeftText && (
                        <span className="text-[10px] font-bold text-[#E11D48]">
                          ({nextAnniversary.daysLeftText})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() =>
                        setCelebrationModal({
                          isOpen: true,
                          occasion: 'anniversary',
                          mode: 'instant',
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#E11D48] hover:bg-[#be123c] text-white text-[10px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 border-0"
                      title="Send Instant Anniversary Promo"
                    >
                      <Gift className="w-3 h-3" />
                      <span>Send Promo</span>
                    </button>
                    <button
                      onClick={() =>
                        setCelebrationModal({ isOpen: true, occasion: 'anniversary', mode: 'auto' })
                      }
                      className="p-1 rounded-lg bg-rose-100/70 hover:bg-rose-200 text-[#E11D48] transition-all cursor-pointer border-0"
                      title="Configure Automated Advance Delivery"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spend & Recency Highlights */}
          <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
            <div className="p-3.5 bg-[#FAF7FF] rounded-2xl border border-purple-100/80 text-center min-w-[120px]">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Lifetime Spend
              </span>
              <strong className="text-[18px] font-bold text-ink font-serif mt-0.5 block">
                ₹{client.lifetimeValue.toLocaleString('en-IN')}
              </strong>
              <span className="text-[9.5px] text-[#5A2EA6] font-bold">LTV</span>
            </div>

            <div className="p-3.5 bg-[#FAF7FF] rounded-2xl border border-purple-100/80 text-center min-w-[120px]">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Visits Completed
              </span>
              <strong className="text-[18px] font-bold text-emerald-800 font-serif mt-0.5 block">
                {client.completedVisits}
              </strong>
              <span className="text-[9.5px] text-soft">{client.totalVisits} Total Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* 12 In-Page Navigation Tabs Bar */}
      <div className="bg-white p-1.5 rounded-[22px] border border-[#5A2EA6]/15 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap group',
                isActive
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-purple-50/50',
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-[#5A2EA6]')} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= IN-PAGE TAB PANELS ================= */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Total Completed Visits
              </span>
              <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
                {client.completedVisits}{' '}
                <span className="text-xs text-soft font-normal">/ {client.totalVisits}</span>
              </strong>
              <span className="text-[10px] text-soft mt-1 block">
                {client.cancelledVisits} Cancelled · {client.noShows} No-Shows
              </span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
                Average Visit Value
              </span>
              <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
                ₹{client.averageVisitValue.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                High Value Patron Tier
              </span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Prepaid Wallet &amp; Points
              </span>
              <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
                ₹{client.walletBalance}
              </strong>
              <span className="text-[10px] text-purple-700 font-bold mt-1 block">
                {client.loyaltyPoints} Loyalty Reward Pts
              </span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Rebooking Recurrence Rate
              </span>
              <strong className="text-2xl font-bold text-emerald-700 font-serif mt-1 block">
                {client.rebookingRate}%
              </strong>
              <span className="text-[10px] text-soft mt-1 block">
                Last Visit: {client.lastVisit}
              </span>
            </div>
          </div>

          {/* Memberships & Active Packages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#5A2EA6]/10 to-[#8B6FD8]/5 border border-[#5A2EA6]/20 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                  <Crown className="w-4 h-4 text-[#5A2EA6]" /> Active Membership
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active Valid
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink font-serif">{client.membershipTier}</h3>
              <p className="text-xs text-soft mt-1 leading-relaxed">
                Entitles client to 15% discount across all styling and clinical aesthetic
                treatments, priority holiday appointment scheduling, and 2 complimentary guest
                passes.
              </p>
            </div>

            <div className="p-5 rounded-[22px] bg-gradient-to-br from-purple-50/80 to-pink-50/50 border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                  <Package className="w-4 h-4 text-[#5A2EA6]" /> Prepaid Treatment Bundle
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
                  {client.packages[0]?.sessionsRemaining || 2} Sessions Left
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink font-serif">{client.activePackage}</h3>
              <p className="text-xs text-soft mt-1 leading-relaxed">
                4 of 6 hydra-facial infusions successfully redeemed across Indrapuri and Koregaon
                Park flagship suites.
              </p>
            </div>
          </div>

          {/* Preferences & Service Habits */}
          <div className="p-5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
              Service Preferences &amp; Stylist Affiliation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100/70">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Preferred Specialist
                </span>
                <strong className="text-ink text-sm block mt-0.5">{client.preferredStaff}</strong>
              </div>
              <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100/70">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Favorite Treatments
                </span>
                <strong className="text-ink text-sm block mt-0.5 truncate">
                  {client.preferredServices}
                </strong>
              </div>
              <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100/70">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Communication Channel
                </span>
                <strong className="text-[#5A2EA6] text-sm block mt-0.5">
                  {client.preferredChannel}
                </strong>
              </div>
              <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100/70">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Household Group
                </span>
                <strong className="text-ink text-sm block mt-0.5">{client.household.name}</strong>
              </div>
            </div>

            {/* Safety & Allergies + Consent & Segmentation Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Safety & Allergies Card */}
              <div className="p-4 rounded-2xl bg-[#FFFBEB]/70 border border-[#FDE047]/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" /> Safety &amp; Chemical
                    Sensitivities
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold',
                      client.safetyAllergies?.patchTestCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800',
                    )}
                  >
                    {client.safetyAllergies?.patchTestCompleted
                      ? 'Patch-Test Passed'
                      : 'Patch-Test Pending'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(client.safetyAllergies?.allergies || ['Ammonia Dye', 'Strong Sulphates']).map(
                    (allergy, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] text-[11px] font-bold"
                      >
                        {allergy}
                      </span>
                    ),
                  )}
                </div>

                <div className="text-[11px] text-[#92400E] bg-white/80 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                  <strong>Caution Note:</strong>{' '}
                  {client.safetyAllergies?.cautionNote ||
                    'Perform 24h patch test before any high-lift bleach process.'}
                </div>
              </div>

              {/* Consent & Segmentation Card */}
              <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5A2EA6]" /> Acquisition &amp; Opt-in
                    Consent
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
                    Source: {client.consentReferral?.acquisitionSource || 'Instagram'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] text-muted font-semibold">Channels:</span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-lg text-[10px] font-bold',
                      client.consentReferral?.whatsappOptIn !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    WhatsApp {client.consentReferral?.whatsappOptIn !== false ? '✓' : '✗'}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-lg text-[10px] font-bold',
                      client.consentReferral?.smsOptIn !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    SMS {client.consentReferral?.smsOptIn !== false ? '✓' : '✗'}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-lg text-[10px] font-bold',
                      client.consentReferral?.emailOptIn !== false
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    Email {client.consentReferral?.emailOptIn !== false ? '✓' : '✗'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(
                    client.consentReferral?.tags || [
                      'VIP',
                      'High Spender',
                      'Organic Products Only',
                      'Family Account',
                    ]
                  ).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-[#5A2EA6] text-[10.5px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SAFETY & ALLERGIES DEDICATED TAB */}
      {activeTab === 'safety' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE047] text-xs text-[#92400E] font-medium flex items-center gap-2.5 shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-amber-200/80 text-[#B45309] grid place-items-center shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold">
              Mandatory chemical sensitivities and patch-testing compliance audit log for clinical
              salon safety.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Chemical Sensitivities Card */}
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-4">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Chemical Sensitivities &amp; Allergies</span>
              </h3>

              <div>
                <span className="text-muted block text-[11px] mb-2 font-medium">
                  Logged Allergen Triggers:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(client.safetyAllergies?.allergies || ['Ammonia Dye', 'Strong Sulphates']).map(
                    (allergy, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] rounded-full text-xs font-bold shadow-2xs"
                      >
                        {allergy}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs space-y-1.5">
                <span className="font-bold text-[#5A2EA6] block">Active Safety Caution Note:</span>
                <p className="text-ink font-medium leading-relaxed">
                  {client.safetyAllergies?.cautionNote ||
                    'Perform 24h patch test before any high-lift bleach process.'}
                </p>
              </div>
            </div>

            {/* Patch-Testing Protocol Status */}
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-4">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Patch-Testing Compliance Protocol</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-purple-100 flex items-center justify-between">
                  <div>
                    <strong className="block text-xs text-ink font-bold">
                      24-Hour Patch-Test Required
                    </strong>
                    <span className="text-[10.5px] text-muted">
                      Required for high-lift color, permanent waving, and chemical relaxers
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full font-bold text-[10.5px]',
                      client.safetyAllergies?.patchTestRequired !== false
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {client.safetyAllergies?.patchTestRequired !== false ? 'Required' : 'Exempt'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-purple-100 flex items-center justify-between">
                  <div>
                    <strong className="block text-xs text-ink font-bold">
                      Skin Reaction Patch-Test Completed
                    </strong>
                    <span className="text-[10.5px] text-muted">
                      Verified by salon technician before chemical service checkout
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full font-bold text-[10.5px]',
                      client.safetyAllergies?.patchTestCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800',
                    )}
                  >
                    {client.safetyAllergies?.patchTestCompleted
                      ? 'Completed & Valid'
                      : 'Pending Verification'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-muted text-[10.5px]">
                  Safety guidelines enforced under ISO-22716 Good Manufacturing &amp; Application
                  Practices.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
            Personal demographic information is protected by role-based privacy policies and DPDP
            encryption.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50">
                Basic Demographic &amp; Celebration Details
              </h3>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Full Name:</span>
                <strong className="text-ink">{client.fullName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Gender:</span>
                <strong className="text-ink">{client.gender}</strong>
              </div>

              {/* Date of Birth & Next Birthday with Highlight & Quick Promo Action */}
              <div className="p-3 rounded-xl border border-purple-100 bg-purple-50/40 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-ink font-semibold">
                      <Cake className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span>Next Upcoming Birthday:</span>
                      <strong className="text-[#5A2EA6] text-xs ml-1">
                        {client.dob && client.dob !== '—' ? nextBirthday.date : '—'}
                      </strong>
                      {client.dob && client.dob !== '—' && nextBirthday.daysLeftText ? (
                        <span className="text-[10px] font-bold text-[#5A2EA6]">
                          ({nextBirthday.daysLeftText})
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[10.5px] text-muted block mt-0.5 ml-5">
                      Original Date of Birth (DOB):{' '}
                      <strong className="text-ink font-medium">
                        {client.dob && client.dob !== '—' ? client.dob : 'Not Provided'}
                      </strong>
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0',
                      bdayAuto.autoSend && client.dob && client.dob !== '—'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {bdayAuto.autoSend && client.dob && client.dob !== '—'
                      ? `Auto: ${bdayAuto.leadDays === 0 ? 'On Day' : `${bdayAuto.leadDays}d Prior`} (${bdayAuto.channel.toUpperCase()})`
                      : 'Auto: Paused'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-0.5 border-t border-purple-100/60">
                  {client.dob && client.dob !== '—' ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setCelebrationModal({ isOpen: true, occasion: 'birthday', mode: 'instant' })
                        }
                        className="px-2.5 py-1 rounded-lg bg-[#5A2EA6] hover:bg-[#4a2489] text-white text-[10px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 border-0"
                      >
                        <Gift className="w-3 h-3" />
                        <span>Send Promo Now</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCelebrationModal({ isOpen: true, occasion: 'birthday', mode: 'auto' })
                        }
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-purple-50 text-[10px] font-bold transition-all shadow-3xs cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3 text-[#5A2EA6]" />
                        <span>Configure Auto-Send</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={openEditModal}
                      className="px-2.5 py-1 rounded-lg bg-[#5A2EA6] hover:bg-[#4a2489] text-white text-[10px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 border-0"
                    >
                      <Cake className="w-3 h-3" />
                      <span>Set Date of Birth</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Next Anniversary with Highlight & Quick Promo Action */}
              <div className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-ink font-semibold">
                      <Heart className="w-3.5 h-3.5 text-[#E11D48]" />
                      <span>Next {client.anniversaryOccasion || 'Anniversary'}:</span>
                      <strong className="text-[#E11D48] text-xs ml-1">
                        {nextAnniversary.date}
                      </strong>
                      {nextAnniversary.daysLeftText && (
                        <span className="text-[10px] font-bold text-[#E11D48]">
                          ({nextAnniversary.daysLeftText})
                        </span>
                      )}
                    </div>
                    <span className="text-[10.5px] text-muted block mt-0.5 ml-5">
                      Milestone Date:{' '}
                      <strong className="text-ink font-medium">
                        {client.anniversary || '18 Nov 2018'}
                      </strong>
                    </span>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0',
                      annivAuto.autoSend
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-600',
                    )}
                  >
                    {annivAuto.autoSend
                      ? `Auto: ${annivAuto.leadDays === 0 ? 'On Day' : `${annivAuto.leadDays}d Prior`} (${annivAuto.channel.toUpperCase()})`
                      : 'Auto: Paused'}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-0.5 border-t border-rose-100/60">
                  <button
                    type="button"
                    onClick={() =>
                      setCelebrationModal({
                        isOpen: true,
                        occasion: 'anniversary',
                        mode: 'instant',
                      })
                    }
                    className="px-2.5 py-1 rounded-lg bg-[#E11D48] hover:bg-[#be123c] text-white text-[10px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 border-0"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Send Promo Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCelebrationModal({ isOpen: true, occasion: 'anniversary', mode: 'auto' })
                    }
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E11D48]/20 text-[#E11D48] hover:bg-rose-50 text-[10px] font-bold transition-all shadow-3xs cursor-pointer flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3 text-[#E11D48]" />
                    <span>Configure Auto-Send</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Mobile Number:</span>
                <strong className="text-ink">{client.mobile}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted font-medium">Email Address:</span>
                <strong className="text-ink">{client.email}</strong>
              </div>
            </div>

            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50">
                Address &amp; Location Profile
              </h3>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Street Address:</span>
                <strong className="text-ink">{client.address.line1}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">City &amp; State:</span>
                <strong className="text-ink">
                  {client.address.city}, {client.address.state}
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Pincode:</span>
                <strong className="text-ink font-mono">{client.address.pincode}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Country:</span>
                <strong className="text-ink">{client.address.country}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted font-medium">Primary Home Branch:</span>
                <strong className="text-[#5A2EA6]">{client.primaryBranch}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HOUSEHOLD */}
      {activeTab === 'household' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
            Household accounts enable shared family bookings and points pooling while keeping
            individual medical/consultation records strictly confidential.
          </div>

          <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div>
                <h3 className="font-serif text-[18px] font-bold text-ink">
                  {client.household.name}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Primary Billing Account: {client.fullName}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-xs">
                {client.household.members.length} Registered Members
              </span>
            </div>

            <div className="space-y-2.5">
              {client.household.members.map((member, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white border border-purple-100/80 flex items-center justify-between shadow-3xs"
                >
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      initials={member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                      className="w-10 h-10 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs"
                    />
                    <div>
                      <div className="font-bold text-ink text-sm">{member.name}</div>
                      <div className="text-xs text-muted">
                        {member.relation} · {member.mobile}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {member.isPrimary ? 'Primary Account Lead' : 'Shared Booking Permitted'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[16px] font-bold text-ink">
                Appointment Booking Ledger
              </h3>
              <p className="text-[11px] text-muted">
                {client.appointments.length} Total Appointments Recorded
              </p>
            </div>
            <Button
              onClick={() => setIsNewBookingOpen(true)}
              className="h-8 px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                <tr>
                  <th className="p-3.5 pl-5">Date &amp; Time</th>
                  <th className="p-3.5">Branch Location</th>
                  <th className="p-3.5">Treatment Protocol</th>
                  <th className="p-3.5">Assigned Specialist</th>
                  <th className="p-3.5">Billed Amount</th>
                  <th className="p-3.5 pr-5">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {client.appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#5A2EA6]/3">
                    <td className="p-3.5 pl-5 font-semibold text-ink">
                      <div>{apt.date}</div>
                      <div className="text-[10px] text-muted font-normal">
                        {apt.time} · {apt.source}
                      </div>
                    </td>
                    <td className="p-3.5 text-soft">{apt.branch}</td>
                    <td className="p-3.5 font-bold text-ink">{apt.service}</td>
                    <td className="p-3.5 text-soft">{apt.staff}</td>
                    <td className="p-3.5 font-serif font-bold text-ink">₹{apt.amount}</td>
                    <td className="p-3.5 pr-5">
                      <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SERVICE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <h3 className="font-serif text-[16px] font-bold text-ink">
              Treatment Service Timeline
            </h3>
            <span className="text-xs font-bold text-[#5A2EA6]">
              {client.serviceHistory.length} Recorded Treatments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                <tr>
                  <th className="p-3.5 pl-5">Service Date</th>
                  <th className="p-3.5">Treatment Protocol</th>
                  <th className="p-3.5">Specialist</th>
                  <th className="p-3.5">Branch</th>
                  <th className="p-3.5">Billed Amount</th>
                  <th className="p-3.5 pr-5">Guest Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {client.serviceHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-[#5A2EA6]/3">
                    <td className="p-3.5 pl-5 font-semibold text-ink">{hist.date}</td>
                    <td className="p-3.5 font-bold text-ink">
                      {hist.service}
                      <div className="text-[10px] text-muted font-normal">
                        {hist.packageOrMembership}
                      </div>
                    </td>
                    <td className="p-3.5 text-soft">{hist.staff}</td>
                    <td className="p-3.5 text-soft">{hist.branch}</td>
                    <td className="p-3.5 font-serif font-bold text-ink">₹{hist.amount}</td>
                    <td className="p-3.5 pr-5">
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        ★ {hist.rating}.0
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. PACKAGES */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          {client.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-5 bg-white rounded-[22px] border border-purple-100/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-bold text-ink text-base">{pkg.name}</h3>
                <p className="text-xs text-muted mt-0.5">
                  Purchased: {pkg.purchaseDate} · Valid till {pkg.expiryDate}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-bold text-[#5A2EA6]">
                    {pkg.sessionsUsed} of {pkg.sessionsPurchased} Sessions Used
                  </span>
                  <div className="w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5A2EA6]"
                      style={{ width: `${(pkg.sessionsUsed / pkg.sessionsPurchased) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Package Value
                </span>
                <strong className="text-lg font-bold text-ink font-serif">
                  ₹{pkg.packageValue}
                </strong>
                <span className="block text-xs text-emerald-700 font-bold mt-1">{pkg.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. MEMBERSHIP */}
      {activeTab === 'membership' && (
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-[#5A2EA6]/10 to-[#8B6FD8]/5 border border-[#5A2EA6]/20 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                Active Subscription Tier
              </span>
              <h2 className="font-serif text-[22px] font-bold text-ink mt-0.5">
                {client.membershipTier}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Active Member Standing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-white p-4 rounded-xl border border-purple-100/60">
            <div>
              <span className="text-muted block font-medium">Valid Until:</span>
              <strong className="text-ink text-sm">31 Dec 2026</strong>
            </div>
            <div>
              <span className="text-muted block font-medium">Tier Discount:</span>
              <strong className="text-emerald-700 text-sm">15% on All Services</strong>
            </div>
            <div>
              <span className="text-muted block font-medium">Guest Passes:</span>
              <strong className="text-[#5A2EA6] text-sm">2 Complimentary Left</strong>
            </div>
          </div>
        </div>
      )}

      {/* 8. WALLET & LOYALTY */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-[22px] bg-white border border-[#5A2EA6]/15 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted uppercase font-bold block">
                  Prepaid Wallet Balance
                </span>
                <strong className="text-3xl font-serif font-bold text-ink mt-1 block">
                  ₹{client.walletBalance.toLocaleString('en-IN')}
                </strong>
                <span className="text-xs text-emerald-700 font-medium block mt-1">
                  Available for checkout redemption
                </span>
              </div>
              <Button
                onClick={() => toast(`Initiated wallet reload top-up for ${client.fullName}`)}
                className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary"
              >
                Top-Up Wallet
              </Button>
            </div>

            <div className="p-5 rounded-[22px] bg-white border border-[#5A2EA6]/15 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-muted uppercase font-bold block">
                  Reward Loyalty Points
                </span>
                <strong className="text-3xl font-serif font-bold text-[#5A2EA6] mt-1 block">
                  {client.loyaltyPoints} Pts
                </strong>
                <span className="text-xs text-purple-700 font-medium block mt-1">
                  Equivalent to ₹{(client.loyaltyPoints * 0.5).toFixed(0)} store credit
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => toast(`Redemption ledger opened for ${client.fullName}`)}
                className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6]"
              >
                Redeem Points
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-50">
              <h3 className="font-serif text-[16px] font-bold text-ink">
                Points &amp; Wallet Ledger
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Date</th>
                    <th className="p-3.5">Activity Type</th>
                    <th className="p-3.5">Transaction Description</th>
                    <th className="p-3.5">Points / Amount</th>
                    <th className="p-3.5 pr-5 text-right">Updated Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 text-slate-600">
                  {client.loyaltyTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="p-3.5 pl-5 font-medium text-ink">{tx.date}</td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-bold',
                            tx.type === 'Earned' || tx.type === 'Wallet Topup'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-purple-100 text-[#5A2EA6]',
                          )}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-3.5">{tx.description}</td>
                      <td className="p-3.5 font-bold font-mono text-ink">{tx.amountOrPoints}</td>
                      <td className="p-3.5 pr-5 text-right font-bold text-[#5A2EA6]">
                        {tx.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. FEEDBACK & NPS */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {client.feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/15 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-500 text-sm">★ {fb.rating}.0</span>
                  <span className="font-bold text-ink text-xs">{fb.service}</span>
                  <span className="text-muted text-[10.5px]">({fb.branch})</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {fb.npsType}
                </span>
              </div>
              <p className="text-xs text-soft italic bg-[#FCFAFF] p-3.5 rounded-xl border border-purple-100/70">
                "{fb.feedback}"
              </p>
              <div className="text-[10.5px] text-muted">Submitted on {fb.date}</div>
            </div>
          ))}
        </div>
      )}

      {/* 10. NOTES & ALLERGIES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {client.notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                'p-5 rounded-[22px] border shadow-xs space-y-2',
                note.type === 'Medical / Allergy'
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-white border-[#5A2EA6]/15',
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full font-bold text-[10px]',
                    note.type === 'Medical / Allergy'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-purple-100 text-[#5A2EA6]',
                  )}
                >
                  {note.type}
                </span>
                <span className="text-[10px] text-muted">
                  {note.date} · by {note.author}
                </span>
              </div>
              <p className="text-xs text-ink leading-relaxed font-medium">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* 11. LOOKBOOK & PHOTOS */}
      {activeTab === 'photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {client.photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white p-4 rounded-[22px] border border-[#5A2EA6]/15 shadow-xs space-y-3"
            >
              <div className="h-44 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center justify-center text-muted">
                <Camera className="w-8 h-8 text-purple-300" />
              </div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] font-bold text-[10px]">
                  {photo.type} Protocol
                </span>
                <div className="text-[10.5px] text-muted">{photo.date}</div>
              </div>
              <p className="text-xs text-ink font-medium">{photo.caption}</p>
              <div className="text-[10px] text-muted">Specialist: {photo.staff}</div>
            </div>
          ))}
        </div>
      )}

      {/* 12. CONSENT & PREFERENCES */}
      {activeTab === 'consent' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
            DPDP Act 2023 &amp; TRAI DLT Compliant: Customer communication consent audit trails with
            granular opt-out records and referral attribution.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Acquisition & Segmentation Card */}
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-4">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#5A2EA6]" />
                <span>Acquisition Source &amp; Client Tags</span>
              </h3>

              <div className="flex justify-between items-center py-1 border-b border-purple-50">
                <span className="text-muted font-medium">Acquisition Channel:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] font-bold text-[11px]">
                  {client.consentReferral?.acquisitionSource || 'Instagram'}
                </span>
              </div>

              <div>
                <span className="text-muted block text-[11px] mb-2 font-medium">
                  Applied Client Tags &amp; Segmentation:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(
                    client.consentReferral?.tags || [
                      'VIP',
                      'High Spender',
                      'Organic Products Only',
                      'Family Account',
                    ]
                  ).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF5FF] border border-[#E9D5FF] text-[#5A2EA6] rounded-full text-xs font-bold shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Granular Channel Consent */}
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-4">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5A2EA6]" />
                <span>Granular Channel Permissions</span>
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    label: 'WhatsApp Transactional & Promo Reminders',
                    granted:
                      client.consentReferral?.whatsappOptIn ?? client.consent.whatsappConsent,
                  },
                  {
                    label: 'SMS Service Booking Alerts',
                    granted: client.consentReferral?.smsOptIn ?? client.consent.smsConsent,
                  },
                  {
                    label: 'Email Marketing & Monthly Dossiers',
                    granted: client.consentReferral?.emailOptIn ?? client.consent.emailConsent,
                  },
                  {
                    label: 'Push App Notifications & Rewards',
                    granted: client.consent.pushConsent,
                  },
                  {
                    label: 'Treatment Photo Portfolio Consent',
                    granted: client.consent.photoConsent,
                  },
                  {
                    label: 'Consultation Health History Retention',
                    granted: client.consent.consultationConsent,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white border border-purple-100 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-ink">{item.label}</span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1',
                        item.granted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600',
                      )}
                    >
                      {item.granted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      {item.granted ? 'Consent Granted' : 'Opted Out'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-muted text-xs">
            Consent record verified on {client.consent.dateGranted}. Last modified on{' '}
            {client.consent.lastUpdated}.
          </div>
        </div>
      )}

      {/* ================= EDIT CLIENT PROFILE MODAL (4-Step Tabbed Workflow) ================= */}
      {isEditModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
              {/* Modal Header */}
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      Edit Client Profile · {client.fullName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold font-mono">
                      {client.id}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Update customer demographics, family relations, safety &amp; allergies, and
                    marketing consent.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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
                    onClick={() => setEditModalTab(tab.id)}
                    className={cn(
                      'px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none whitespace-nowrap',
                      editModalTab === tab.id
                        ? 'bg-[#3B2647] text-white border-[#3B2647] shadow-sm ring-2 ring-purple-600/30'
                        : 'bg-white text-soft hover:text-ink border-slate-200',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSaveEditProfile}
                className="flex-1 overflow-y-auto custom-scroll flex flex-col justify-between"
              >
                {/* TAB 1: BASIC INFO */}
                {editModalTab === 'basic' && (
                  <div className="p-6 space-y-5">
                    {/* Hidden File Input for Avatar */}
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
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

                      {editFormData.avatarUrl ? (
                        <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-[#FAF8FC] group p-3 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-purple-100 shadow-sm relative">
                            <img
                              src={editFormData.avatarUrl}
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
                                onClick={() => avatarFileInputRef.current?.click()}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] transition-colors border-0 cursor-pointer flex items-center gap-1"
                              >
                                <Camera className="w-3 h-3" /> Change
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditFormData((prev) => ({ ...prev, avatarUrl: '' }))
                                }
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border-0 cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => avatarFileInputRef.current?.click()}
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
                    </div>

                    {/* Personal Demographics */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editFormData.firstName}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, firstName: e.target.value })
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
                            value={editFormData.lastName}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, lastName: e.target.value })
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
                            value={editFormData.mobile}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, mobile: e.target.value })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editFormData.email}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, email: e.target.value })
                            }
                            className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3.5">
                        <div>
                          <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                            Gender
                          </label>
                          <select
                            value={editFormData.gender}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
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
                            <div className="w-full h-11 px-3.5 rounded-xl border border-purple-200 bg-purple-50/60 flex items-center gap-2 text-xs font-semibold text-purple-900 shadow-3xs cursor-not-allowed">
                              <MapPin className="w-3.5 h-3.5 text-[#5A2EA6] shrink-0" />
                              <span className="truncate">
                                {editFormData.primaryBranch || client.primaryBranch || defaultBranch || 'Assigned Branch'}
                              </span>
                            </div>
                          ) : (
                            <select
                              value={editFormData.primaryBranch}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, primaryBranch: e.target.value })
                              }
                              className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                            >
                              {masterBranches.map((b) => (
                                <option key={b.id} value={b.name}>
                                  {b.name}
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
                            value={editFormData.segment}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
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
                            value={toDateInputValue(editFormData.dob)}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                dob: e.target.value ? toFriendlyDate(e.target.value) || e.target.value : '',
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
                            value={toDateInputValue(editFormData.anniversary)}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
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
                            value={editFormData.anniversaryOccasion}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                anniversaryOccasion: e.target.value,
                              })
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
                          value={editFormData.addressLine1}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, addressLine1: e.target.value })
                          }
                          className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: HOUSEHOLD & FAMILY */}
                {editModalTab === 'household' && (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        <span>
                          Household &amp; Family Members ({editFormData.householdMembers.length}{' '}
                          Members)
                        </span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddHouseholdMember}
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
                        value={editFormData.householdName}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, householdName: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {editFormData.householdMembers.map((member, idx) => (
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
                                placeholder="Full Name"
                                value={member.name}
                                onChange={(e) =>
                                  handleUpdateHouseholdMember(idx, 'name', e.target.value)
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
                                  handleUpdateHouseholdMember(idx, 'relation', e.target.value)
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
                                value={member.mobile}
                                onChange={(e) =>
                                  handleUpdateHouseholdMember(idx, 'mobile', e.target.value)
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
                                onClick={() => handleRemoveHouseholdMember(idx)}
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
                        onClick={handleAddHouseholdMember}
                        className="w-full py-2.5 rounded-xl border border-dashed border-purple-200 hover:border-[#5A2EA6] text-[#5A2EA6] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors bg-white hover:bg-purple-50/50 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Family Member</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: SAFETY & ALLERGIES */}
                {editModalTab === 'safety' && (
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
                          value={editAllergyInput}
                          onChange={(e) => setEditAllergyInput(e.target.value)}
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
                        {editFormData.allergies.map((allergy, idx) => (
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
                          checked={editFormData.patchTestRequired}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
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
                          checked={editFormData.patchTestCompleted}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
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
                        value={editFormData.cautionNote}
                        onChange={(e) =>
                          setEditFormData((prev) => ({ ...prev, cautionNote: e.target.value }))
                        }
                        className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 4: CONSENT & REFERRAL */}
                {editModalTab === 'consent' && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                        ACQUISITION SOURCE
                      </label>
                      <select
                        value={editFormData.acquisitionSource}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            acquisitionSource: e.target.value,
                          }))
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
                            checked={editFormData.whatsappOptIn}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                whatsappOptIn: e.target.checked,
                              }))
                            }
                            className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                          />
                          <span className="text-xs font-bold text-ink">WhatsApp</span>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                          <input
                            type="checkbox"
                            checked={editFormData.smsOptIn}
                            onChange={(e) =>
                              setEditFormData((prev) => ({ ...prev, smsOptIn: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer accent-[#5A2EA6]"
                          />
                          <span className="text-xs font-bold text-ink">SMS</span>
                        </label>

                        <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-100/90 bg-[#FCFAFF] hover:bg-purple-50/30 cursor-pointer transition-colors shadow-2xs select-none">
                          <input
                            type="checkbox"
                            checked={editFormData.emailOptIn}
                            onChange={(e) =>
                              setEditFormData((prev) => ({ ...prev, emailOptIn: e.target.checked }))
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
                          value={editTagInput}
                          onChange={(e) => setEditTagInput(e.target.value)}
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
                        {editFormData.tags.map((tag, idx) => (
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
                    onClick={() => setIsEditModalOpen(false)}
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

      {/* Send Celebration Promo Modal */}
      <SendCelebrationPromoModal
        isOpen={celebrationModal.isOpen}
        onClose={() => setCelebrationModal({ ...celebrationModal, isOpen: false })}
        client={client}
        occasionType={celebrationModal.occasion}
        initialMode={celebrationModal.mode || 'instant'}
        onUpdateAutoSettings={(settings) => {
          setClient((prev) => {
            const currentAuto = prev.autoCelebrationSettings || {
              birthdayAutoSend: true,
              birthdayLeadDays: 3,
              birthdayChannel: 'whatsapp',
              anniversaryAutoSend: true,
              anniversaryLeadDays: 5,
              anniversaryChannel: 'whatsapp',
            };
            if (settings.occasionType === 'birthday') {
              return {
                ...prev,
                autoCelebrationSettings: {
                  ...currentAuto,
                  birthdayAutoSend: settings.autoSend,
                  birthdayLeadDays: settings.leadDays,
                  birthdayChannel: settings.channel,
                },
              };
            } else {
              return {
                ...prev,
                autoCelebrationSettings: {
                  ...currentAuto,
                  anniversaryAutoSend: settings.autoSend,
                  anniversaryLeadDays: settings.leadDays,
                  anniversaryChannel: settings.channel,
                },
              };
            }
          });
        }}
      />

      {/* Linked New Multi-Service Appointment Booking Modal */}
      <NewAppointmentModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSuccess={handleNewBookingSuccess}
        initialClient={{
          name: client.fullName,
          mobile: client.mobile,
          email: client.email,
          branch: client.primaryBranch,
        }}
      />
    </div>
  );
}

export default ClientProfilePage;
