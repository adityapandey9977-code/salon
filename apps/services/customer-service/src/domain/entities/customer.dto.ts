import type {
  CautionSeverity,
  CustomerSource,
  CustomerStatus,
  Gender,
  LeadStatus,
} from '../../infrastructure/prisma/generated-client';

export interface CachedCustomer {
  id: string;
  tenantId: string;
  customerCode: string;
  firstName: string;
  lastName: string | null;
  displayName: string;
  email: string | null;
  mobilePhone: string;
  alternatePhone: string | null;
  gender: Gender;
  dateOfBirth: string | null;
  status: CustomerStatus;
  preferredBranchId: string | null;
  franchiseId: string | null;
  source: CustomerSource;
  notes: string | null;
  avatarUrl: string | null;
  segment: string | null;
  totalVisits: number;
  totalSpent: number;
  lastVisitAt: string | null;
  firstVisitAt: string | null;
  createdAt: string;
  updatedAt: string;
  addresses?: Array<{
    id: string;
    type: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
  preferences?: {
    preferredBranchId: string | null;
    preferredStaffId: string | null;
    preferredCommunicationChannel: string;
    language: string;
    appointmentReminderEnabled: boolean;
    marketingConsent: boolean;
  } | null;
  cautions?: Array<{
    id: string;
    type: string;
    title: string;
    description: string | null;
    severity: CautionSeverity;
    active: boolean;
  }>;
  tags?: string[];
}

export interface CustomerSummaryDto {
  id: string;
  tenantId: string;
  customerCode: string;
  firstName: string;
  lastName: string | null;
  displayName: string;
  mobilePhone: string;
  email: string | null;
  dateOfBirth?: string | null;
  gender: Gender;
  status: CustomerStatus;
  preferredBranchId: string | null;
  franchiseId: string | null;
  avatarUrl: string | null;
  segment: string | null;
  totalVisits: number;
  totalSpent: number;
  lastVisitAt: string | null;
  firstVisitAt: string | null;
  createdAt: string;
}

export interface CustomerNoteDto {
  id: string;
  tenantId: string;
  customerId: string;
  noteType: string;
  content: string;
  isPinned: boolean;
  createdByPrincipalType: string;
  createdByUserId: string | null;
  createdAt: string;
}

export interface CustomerCautionDto {
  id: string;
  tenantId: string;
  customerId: string;
  type: string;
  title: string;
  description: string | null;
  severity: CautionSeverity;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDto {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string | null;
  mobilePhone: string;
  email: string | null;
  source: CustomerSource;
  status: LeadStatus;
  preferredBranchId: string | null;
  interestedServiceId: string | null;
  assignedIdentityUserId: string | null;
  inquiryNotes: string | null;
  convertedCustomerId: string | null;
  convertedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
