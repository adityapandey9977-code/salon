import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  ExternalLink,
  Eye,
  FileText,
  History,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export interface HouseholdMember {
  name: string;
  relation: string;
  mobile: string;
  isPrimary?: boolean;
}

export interface ClientServiceHistoryItem {
  id: string;
  date: string;
  branch: string;
  service: string;
  staff: string;
  amount: number;
  packageOrMembership: string;
  rating: number;
  status: 'Completed' | 'Cancelled' | 'No-show';
}

export interface ClientAppointmentItem {
  id: string;
  date: string;
  time: string;
  branch: string;
  service: string;
  staff: string;
  status:
    | 'Booked'
    | 'Confirmed'
    | 'Checked-in'
    | 'In Service'
    | 'Completed'
    | 'Cancelled'
    | 'No-show';
  amount: number;
  source: 'Online Mobile App' | 'POS Walk-in' | 'Front Desk Phone' | 'WhatsApp Booking';
}

export interface ClientPackageItem {
  id: string;
  name: string;
  purchaseDate: string;
  expiryDate: string;
  sessionsPurchased: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  packageValue: number;
  remainingValue: number;
  status: 'Active' | 'Expired' | 'Fully Redeemed';
}

export interface ClientLoyaltyTx {
  id: string;
  date: string;
  type: 'Earned' | 'Redeemed' | 'Wallet Topup' | 'Service Debit';
  description: string;
  amountOrPoints: string;
  balance: string;
}

export interface ClientFeedbackItem {
  id: string;
  date: string;
  service: string;
  branch: string;
  rating: number;
  npsType: 'Promoter' | 'Passive' | 'Detractor';
  feedback: string;
}

export interface ClientNoteItem {
  id: string;
  date: string;
  author: string;
  type: 'Styling Preference' | 'Medical / Allergy' | 'Consultation' | 'Billing Note';
  content: string;
  isConfidential?: boolean;
}

export interface ClientPhotoItem {
  id: string;
  date: string;
  service: string;
  staff: string;
  type: 'Before' | 'After';
  caption: string;
  consentGranted: boolean;
}

export interface ClientSafetyAllergies {
  allergies: string[];
  patchTestRequired: boolean;
  patchTestCompleted: boolean;
  cautionNote: string;
}

export interface ClientConsentReferral {
  acquisitionSource: string;
  whatsappOptIn: boolean;
  smsOptIn: boolean;
  emailOptIn: boolean;
  tags: string[];
}

export interface ClientConsentPreferences {
  whatsappConsent: boolean;
  smsConsent: boolean;
  emailConsent: boolean;
  phoneConsent: boolean;
  pushConsent: boolean;
  marketingConsent: boolean;
  photoConsent: boolean;
  consultationConsent: boolean;
  dateGranted: string;
  lastUpdated: string;
}

export interface FullClientRecord {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  email: string;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  anniversary?: string;
  anniversaryOccasion?: string;
  avatarInitials: string;
  avatarUrl?: string;
  accentColor: string;
  primaryBranch: string;
  primaryBranchId?: string;
  franchiseId?: string | null;
  clientSince: string;
  status: 'Active' | 'Inactive' | 'Blocked' | 'Archived';
  segment:
    | 'VIP High Value'
    | 'Frequent Visitor'
    | 'Membership Client'
    | 'New Client'
    | 'At Risk'
    | 'Inactive';
  membershipTier: string;
  activePackage: string;
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  noShows: number;
  lastVisit: string;
  lifetimeValue: number;
  averageVisitValue: number;
  walletBalance: number;
  loyaltyPoints: number;
  safetyAllergies?: ClientSafetyAllergies;
  consentReferral?: ClientConsentReferral;
  rebookingRate: number;
  preferredStaff: string;
  preferredServices: string;
  preferredChannel: string;
  language: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  household: {
    name: string;
    members: HouseholdMember[];
  };
  appointments: ClientAppointmentItem[];
  serviceHistory: ClientServiceHistoryItem[];
  packages: ClientPackageItem[];
  loyaltyTransactions: ClientLoyaltyTx[];
  feedbacks: ClientFeedbackItem[];
  notes: ClientNoteItem[];
  photos: ClientPhotoItem[];
  consent: ClientConsentPreferences;
  autoCelebrationSettings?: {
    birthdayAutoSend: boolean;
    birthdayLeadDays: number;
    birthdayChannel: 'whatsapp' | 'sms' | 'email';
    anniversaryAutoSend: boolean;
    anniversaryLeadDays: number;
    anniversaryChannel: 'whatsapp' | 'sms' | 'email';
  };
}

interface ClientProfileDossierModalProps {
  client: FullClientRecord | null;
  onClose: () => void;
}

export function ClientProfileDossierModal({ client, onClose }: ClientProfileDossierModalProps) {
  const { toast } = useToast();
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

  if (!client) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'personal' as const, label: 'Personal Info' },
    { id: 'safety' as const, label: 'Safety & Allergies' },
    { id: 'household' as const, label: 'Household' },
    { id: 'appointments' as const, label: 'Appointments' },
    { id: 'history' as const, label: 'Service History' },
    { id: 'packages' as const, label: 'Packages' },
    { id: 'membership' as const, label: 'Membership' },
    { id: 'wallet' as const, label: 'Wallet & Loyalty' },
    { id: 'feedback' as const, label: 'Feedback & NPS' },
    { id: 'notes' as const, label: 'Notes' },
    { id: 'photos' as const, label: 'Photos' },
    { id: 'consent' as const, label: 'Consent & Referral' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-5xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header with Client Identity & Quick Stats */}
        <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            {client.avatarUrl ? (
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-purple-100">
                <img
                  src={client.avatarUrl}
                  alt={client.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <Avatar
                initials={client.avatarInitials}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-base font-bold shadow-sm"
              />
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-serif text-[19px] text-ink font-bold tracking-tight">
                  {client.fullName}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold font-mono">
                  {client.id}
                </span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                    client.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : client.status === 'Blocked'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700',
                  )}
                >
                  {client.status}
                </span>
              </div>
              <p className="text-[11.5px] text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                <span>{client.mobile}</span>
                <span>•</span>
                <span>{client.email}</span>
                <span>•</span>
                <span className="font-semibold text-soft">{client.primaryBranch}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#FCFAFF] px-3.5 py-1.5 rounded-xl border border-purple-100">
              <div className="text-right">
                <span className="text-[9.5px] text-muted uppercase font-bold block">
                  Lifetime Spend
                </span>
                <strong className="text-xs font-bold text-ink font-serif">
                  ₹{client.lifetimeValue.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="px-6 py-2 bg-[#FCFAFF] border-b border-purple-50/80 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap shrink-0',
                activeTab === tab.id
                  ? 'bg-[#5A2EA6] text-white shadow-2xs'
                  : 'bg-transparent text-soft hover:text-ink hover:bg-purple-100/50',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1 text-xs space-y-5">
          {/* ================= 1. OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Executive Summary Mini Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100/70">
                  <span className="text-[10px] text-muted uppercase font-bold block">
                    Visits Completed
                  </span>
                  <strong className="text-[17px] font-bold text-ink mt-0.5 block font-serif">
                    {client.completedVisits} of {client.totalVisits}
                  </strong>
                  <span className="text-[9.5px] text-soft">
                    {client.cancelledVisits} Cancels · {client.noShows} No-Shows
                  </span>
                </div>

                <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100/70">
                  <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
                    Avg Visit Value
                  </span>
                  <strong className="text-[17px] font-bold text-[#5A2EA6] mt-0.5 block font-serif">
                    ₹{client.averageVisitValue.toLocaleString('en-IN')}
                  </strong>
                  <span className="text-[9.5px] text-emerald-700 font-bold">
                    High Ticket Customer
                  </span>
                </div>

                <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100/70">
                  <span className="text-[10px] text-muted uppercase font-bold block">
                    Wallet &amp; Points
                  </span>
                  <strong className="text-[17px] font-bold text-ink mt-0.5 block font-serif">
                    ₹{client.walletBalance}
                  </strong>
                  <span className="text-[9.5px] text-purple-700 font-bold">
                    {client.loyaltyPoints} Loyalty Pts
                  </span>
                </div>

                <div className="p-4 bg-[#FAF7FF] rounded-2xl border border-purple-100/70">
                  <span className="text-[10px] text-muted uppercase font-bold block">
                    Rebooking Frequency
                  </span>
                  <strong className="text-[17px] font-bold text-emerald-700 mt-0.5 block font-serif">
                    {client.rebookingRate}%
                  </strong>
                  <span className="text-[9.5px] text-soft">Last Visit: {client.lastVisit}</span>
                </div>
              </div>

              {/* Memberships & Active Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5A2EA6]/10 to-[#8B6FD8]/5 border border-[#5A2EA6]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                      <Crown className="w-4 h-4 text-[#5A2EA6]" /> Active Membership
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Valid
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-ink font-serif">
                    {client.membershipTier}
                  </h4>
                  <p className="text-[11px] text-soft mt-1">
                    Entitles client to 15% discount on skin &amp; hair treatments, free styling
                    consultations, and priority holiday booking.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/80 to-pink-50/50 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                      <Package className="w-4 h-4 text-[#5A2EA6]" /> Prepaid Treatment Bundle
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[9px] font-bold">
                      {client.packages[0]?.sessionsRemaining || 2} Sessions Left
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-ink font-serif">
                    {client.activePackage}
                  </h4>
                  <p className="text-[11px] text-soft mt-1">
                    4 of 6 hydra-facial infusions redeemed across Indrapuri and Koregaon Park
                    branches.
                  </p>
                </div>
              </div>

              {/* Preferences & Service Habits */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider mb-2">
                  Service Preferences &amp; Stylist Affiliation
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted font-medium">
                      Preferred Stylist / Practitioner:
                    </span>
                    <strong className="text-ink block mt-0.5">{client.preferredStaff}</strong>
                  </div>
                  <div>
                    <span className="text-muted font-medium">Favorite Treatments:</span>
                    <strong className="text-ink block mt-0.5">{client.preferredServices}</strong>
                  </div>
                  <div>
                    <span className="text-muted font-medium">Preferred Communication:</span>
                    <strong className="text-[#5A2EA6] block mt-0.5">
                      {client.preferredChannel}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted font-medium">Household Grouping:</span>
                    <strong className="text-ink block mt-0.5">
                      {client.household.name} ({client.household.members.length} Members)
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. PERSONAL INFORMATION ================= */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                Personal demographics are protected by role-based privacy policies and encrypted
                data redaction.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5 p-4 bg-[#FCFAFF] rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-[11px]">
                    Client Identity
                  </h4>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">Full Name:</span>
                    <strong className="text-ink">{client.fullName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">Gender:</span>
                    <strong className="text-ink">{client.gender}</strong>
                  </div>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">Date of Birth:</span>
                    <strong className="text-[#5A2EA6] font-bold">🎂 {client.dob}</strong>
                  </div>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">
                      {client.anniversaryOccasion || 'Anniversary'}:
                    </span>
                    <strong className="text-[#E11D48] font-bold">
                      💍 {client.anniversary || '18 Nov 2018'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Client Since:</span>
                    <strong className="text-ink">{client.clientSince}</strong>
                  </div>
                </div>

                <div className="space-y-2.5 p-4 bg-[#FCFAFF] rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-[11px]">
                    Address &amp; Location
                  </h4>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">Address Line:</span>
                    <strong className="text-ink">{client.address.line1}</strong>
                  </div>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">City / State:</span>
                    <strong className="text-ink">
                      {client.address.city}, {client.address.state}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-purple-50 pb-1.5">
                    <span className="text-muted">Pincode:</span>
                    <strong className="text-ink font-mono">{client.address.pincode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Home Branch:</span>
                    <strong className="text-[#5A2EA6]">{client.primaryBranch}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2B. SAFETY & ALLERGIES ================= */}
          {activeTab === 'safety' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FDE047] text-xs text-[#92400E] font-medium flex items-center gap-2.5 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-amber-200/80 text-[#B45309] grid place-items-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold">
                  Record chemical sensitivities to prevent adverse salon events.
                </span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-purple-100 shadow-2xs space-y-4">
                <div>
                  <h4 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-[11px] mb-2">
                    Chemical Sensitivities &amp; Allergies
                  </h4>
                  {client.safetyAllergies?.allergies &&
                  client.safetyAllergies.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {client.safetyAllergies.allergies.map((allergy, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#FFF1F2] border border-[#FECDD3] text-[#BE123C] rounded-full text-xs font-bold"
                        >
                          ⚠️ {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-xs italic">
                      No known chemical sensitivities or product allergies recorded.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-purple-50">
                  <div className="p-3.5 rounded-xl bg-[#FCFAFF] border border-purple-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Patch-Test Requirement</span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                        client.safetyAllergies?.patchTestRequired
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {client.safetyAllergies?.patchTestRequired
                        ? 'Mandatory Before Chemical Treatment'
                        : 'Standard Protocol'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FCFAFF] border border-purple-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Patch-Test Status</span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1',
                        client.safetyAllergies?.patchTestCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800',
                      )}
                    >
                      {client.safetyAllergies?.patchTestCompleted ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      {client.safetyAllergies?.patchTestCompleted
                        ? 'Test Completed & Verified'
                        : 'Pending Verification'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-50">
                  <h4 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-[11px] mb-1.5">
                    Safety Caution Note
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#FCFAFF] border border-purple-100 text-xs font-medium text-ink">
                    {client.safetyAllergies?.cautionNote ||
                      'Perform 24h patch test before any high-lift bleach process.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. HOUSEHOLD ================= */}
          {activeTab === 'household' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                Household accounts allow shared family bookings and points consolidation while
                keeping individual medical/consultation records private.
              </div>

              <div className="p-4 bg-white rounded-2xl border border-purple-100 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-50">
                  <div>
                    <h4 className="font-serif text-[16px] font-bold text-ink">
                      {client.household.name}
                    </h4>
                    <p className="text-[11px] text-muted">
                      Primary Billing Account: {client.fullName}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px]">
                    Family Grouping
                  </span>
                </div>

                <div className="space-y-2">
                  {client.household.members.map((member, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#FCFAFF] border border-purple-100/70 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                          className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs"
                        />
                        <div>
                          <div className="font-bold text-ink">{member.name}</div>
                          <div className="text-[10px] text-muted">
                            {member.relation} · {member.mobile}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {member.isPrimary ? 'Primary Account' : 'Shared Booking Permitted'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. APPOINTMENTS ================= */}
          {activeTab === 'appointments' && (
            <div className="space-y-3">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                  <tr>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Treatment</th>
                    <th className="p-3">Stylist</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5">
                  {client.appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#5A2EA6]/3">
                      <td className="p-3 font-semibold text-ink">
                        <div>{apt.date}</div>
                        <div className="text-[10px] text-muted font-normal">
                          {apt.time} · {apt.source}
                        </div>
                      </td>
                      <td className="p-3 text-soft">{apt.branch}</td>
                      <td className="p-3 font-bold text-ink">{apt.service}</td>
                      <td className="p-3 text-soft">{apt.staff}</td>
                      <td className="p-3 font-serif font-bold text-ink">₹{apt.amount}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= 5. SERVICE HISTORY ================= */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                  <tr>
                    <th className="p-3">Service Date</th>
                    <th className="p-3">Treatment Protocol</th>
                    <th className="p-3">Specialist</th>
                    <th className="p-3">Branch</th>
                    <th className="p-3">Billed (₹)</th>
                    <th className="p-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5">
                  {client.serviceHistory.map((hist) => (
                    <tr key={hist.id} className="hover:bg-[#5A2EA6]/3">
                      <td className="p-3 font-semibold text-ink">{hist.date}</td>
                      <td className="p-3 font-bold text-ink">
                        {hist.service}
                        <div className="text-[10px] text-muted font-normal">
                          {hist.packageOrMembership}
                        </div>
                      </td>
                      <td className="p-3 text-soft">{hist.staff}</td>
                      <td className="p-3 text-soft">{hist.branch}</td>
                      <td className="p-3 font-serif font-bold text-ink">₹{hist.amount}</td>
                      <td className="p-3">
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          ★ {hist.rating}.0
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= 6. PACKAGES ================= */}
          {activeTab === 'packages' && (
            <div className="space-y-3">
              {client.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 bg-[#FCFAFF] rounded-2xl border border-purple-100 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-ink text-sm">{pkg.name}</h4>
                    <p className="text-[11px] text-muted mt-0.5">
                      Purchased: {pkg.purchaseDate} · Valid till {pkg.expiryDate}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#5A2EA6]">
                        {pkg.sessionsUsed} of {pkg.sessionsPurchased} Sessions Used
                      </span>
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#5A2EA6]"
                          style={{ width: `${(pkg.sessionsUsed / pkg.sessionsPurchased) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Package Value
                    </span>
                    <strong className="text-base font-bold text-ink font-serif">
                      ₹{pkg.packageValue}
                    </strong>
                    <span className="block text-[10px] text-emerald-700 font-bold mt-1">
                      {pkg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= 7. MEMBERSHIP ================= */}
          {activeTab === 'membership' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#5A2EA6]/10 to-[#8B6FD8]/5 border border-[#5A2EA6]/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Tier Standing
                  </span>
                  <h3 className="font-serif text-[20px] font-bold text-ink">
                    {client.membershipTier}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Active Subscription
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs bg-white p-3.5 rounded-xl border border-purple-100/60">
                <div>
                  <span className="text-muted block font-medium">Valid Until:</span>
                  <strong className="text-ink">31 Dec 2026</strong>
                </div>
                <div>
                  <span className="text-muted block font-medium">Tier Discount:</span>
                  <strong className="text-emerald-700">15% on All Services</strong>
                </div>
                <div>
                  <span className="text-muted block font-medium">Guest Passes Left:</span>
                  <strong className="text-[#5A2EA6]">2 Complimentary</strong>
                </div>
              </div>
            </div>
          )}

          {/* ================= 8. WALLET & LOYALTY ================= */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-purple-100">
                  <span className="text-[10px] font-bold text-muted uppercase">
                    Digital Prepaid Wallet
                  </span>
                  <h4 className="text-2xl font-bold text-ink font-serif mt-1">
                    ₹{client.walletBalance}
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    Auto-debit active on checkout
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-purple-100">
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase">
                    Loyalty Reward Points
                  </span>
                  <h4 className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1">
                    {client.loyaltyPoints} Pts
                  </h4>
                  <span className="text-[10px] text-soft">
                    Redeemable for ₹1,250 worth of treatments
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-ink text-xs uppercase tracking-wider mb-2">
                  Transaction Audit Trail
                </h4>
                <div className="space-y-1.5">
                  {client.loyaltyTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-ink block">{tx.description}</strong>
                        <span className="text-[10px] text-muted">
                          {tx.date} · {tx.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <strong
                          className={cn(
                            'font-bold',
                            tx.amountOrPoints.startsWith('+')
                              ? 'text-emerald-700'
                              : 'text-slate-700',
                          )}
                        >
                          {tx.amountOrPoints}
                        </strong>
                        <span className="block text-[10px] text-muted">Bal: {tx.balance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 9. FEEDBACK & NPS ================= */}
          {activeTab === 'feedback' && (
            <div className="space-y-3">
              {client.feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold text-sm">★ {fb.rating}.0</span>
                      <strong className="text-ink">{fb.service}</strong>
                      <span className="text-muted">({fb.branch})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {fb.npsType}
                    </span>
                  </div>
                  <p className="text-soft italic text-[11.5px]">"{fb.feedback}"</p>
                  <span className="text-[10px] text-muted block font-mono">{fb.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* ================= 10. NOTES ================= */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              {client.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-[#5A2EA6] font-bold text-[9.5px]">
                      {note.type}
                    </span>
                    <span className="text-[10px] text-muted">
                      {note.date} by {note.author}
                    </span>
                  </div>
                  <p className="text-ink font-medium leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* ================= 11. PHOTOS ================= */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                Before/after clinical aesthetics and styling documentation is restricted to
                authorized specialists with photo consent verification.
              </div>

              <div className="grid grid-cols-2 gap-4">
                {client.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="p-3.5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-2"
                  >
                    <div className="h-32 bg-purple-100/50 rounded-xl grid place-items-center text-soft">
                      <Camera className="w-6 h-6 text-[#5A2EA6]" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#5A2EA6] text-white text-[9px] font-bold">
                        {photo.type} Session
                      </span>
                      <span className="text-[10px] text-muted">{photo.date}</span>
                    </div>
                    <p className="text-ink font-medium text-[11px]">{photo.caption}</p>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      Client Photo Consent Verified ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 12. CONSENT & PREFERENCES ================= */}
          {activeTab === 'consent' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                Client privacy consents and marketing communication opt-out statuses comply with
                SaaS DPDP guidelines.
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: 'WhatsApp Appointment & Reminder Alerts',
                    granted: client.consent.whatsappConsent,
                  },
                  {
                    label: 'Promotional & Seasonal Offer SMS',
                    granted: client.consent.marketingConsent,
                  },
                  {
                    label: 'Email Newsletters & Style Lookbooks',
                    granted: client.consent.emailConsent,
                  },
                  {
                    label: 'Before/After Portfolio Photography Consent',
                    granted: client.consent.photoConsent,
                  },
                  {
                    label: 'Clinical Aesthetic Treatment Consultation Consent',
                    granted: client.consent.consultationConsent,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-100 flex items-center justify-between"
                  >
                    <span className="font-semibold text-ink">{item.label}</span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1',
                        item.granted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800',
                      )}
                    >
                      {item.granted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {item.granted ? 'Consent Granted' : 'Opted Out'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-muted text-[10.5px]">
                Consent record verified on {client.consent.dateGranted}. Last modified on{' '}
                {client.consent.lastUpdated}.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-50 flex items-center justify-end gap-3 bg-white shrink-0">
          <Button
            onClick={onClose}
            className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
          >
            Close Client Dossier
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
