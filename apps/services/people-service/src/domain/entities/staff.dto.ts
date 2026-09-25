import type {
  AttendanceMethod,
  AttendanceStatus,
  DocumentType,
  EmploymentStatus,
  EmploymentType,
  LeaveStatus,
  LeaveType,
  RosterStatus,
  SkillLevel,
} from '../../infrastructure/prisma/generated-client';

export interface CachedStaffProfile {
  id: string;
  tenantId: string;
  employeeCode: string;
  identityUserId: string | null;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string | null;
  mobilePhone: string;
  dateOfBirth: string | null;
  gender: string | null;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  joiningDate: string;
  exitDate: string | null;
  primaryBranchId: string | null;
  franchiseId: string | null;
  jobTitle: string;
  department: string | null;
  managerEmployeeId: string | null;
  profilePhotoObjectKey: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    bio: string | null;
    yearsOfExperience: number | null;
    specialization: string | null;
    designation: string | null;
    commissionEligible: boolean;
    acceptsOnlineBooking: boolean;
    isBookable: boolean;
    serviceCapacity: number;
    profileVisibility: string;
  } | null;
  branchAssignments?: Array<{
    id: string;
    branchId: string;
    isPrimary: boolean;
    effectiveFrom: string;
    effectiveTo: string | null;
    status: string;
  }>;

  // Rich Frontend Admin Staff Page Extensions
  fullName?: string;
  role?: string;
  branch?: string;
  status?: string;
  mobile?: string;
  avatarInitials?: string;
  avatarUrl?: string;
  reportingManager?: string;
  dob?: string;
  address?: string;
  emergencyContact?: string;
  currentShift?: string;
  level?: string;
  skills?: string[];
  assignedServices?: string[];
  weeklyOffs?: string[];
  metrics?: {
    revenueGenerated: number;
    servicesCompleted: number;
    retailSales: number;
    rebookingRate: number;
    utilisation: number;
    commissionEarned: number;
    targetAchievement: number;
    csatRating: number;
    serviceEfficiency?: {
      score: number;
      avgDurationMinutes: number;
      standardDurationMinutes: number;
      varianceMinutes: number;
      onTimeDeliveryRate: number;
    };
  };
  skillsList?: Array<{
    skill: string;
    level: string;
    qualification: string;
    assignedServices: string[];
    status: string;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    refNumber: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    uploadedBy: string;
    lastUpdated: string;
  }>;
  roster?: Array<{
    day: string;
    date: string;
    shift?: string;
    hours?: string;
    status: string;
  }>;
  attendance?: Array<{
    date: string;
    shift: string;
    checkIn: string;
    checkOut: string;
    totalHours?: string;
    overtime?: string;
    status: string;
  }>;
  targets?: Array<{
    period: string;
    serviceTarget: number;
    serviceAchieved: number;
    retailTarget: number;
    retailAchieved: number;
    achievementRate: number;
    status: string;
  }>;
  commissions?: Array<{
    payPeriod?: string;
    period?: string;
    servicesRevenue?: number;
    serviceCommission: number;
    retailRevenue?: number;
    retailCommission: number;
    tipsReceived?: number;
    totalPayout?: number;
    finalCommission?: number;
    status: string;
  }>;
  performanceHistory?: Array<{
    month: string;
    revenue: number;
    servicesCount: number;
    rebookingRate: number;
    utilisation: number;
    rating: number;
  }>;
  leaves?: Array<{
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    appliedOn: string;
    status: string;
    approvedBy: string;
  }>;
  leaveBalance?: {
    totalAnnual: number;
    taken: number;
    pending: number;
    available: number;
  };
  compensation?: {
    hourlyRate?: number;
    fixedSalary?: number;
    workingHoursPerDay?: number;
    holidays?: number;
    payrollSettings?: {
      fixed: boolean;
      hourly: boolean;
      commission: boolean;
    };
    serviceCommissionRate?: number;
    retailCommissionRate?: number;
  };
}

export interface CachedBranchStaffAssignment {
  id: string;
  employeeId: string;
  tenantId: string;
  branchId: string;
  isPrimary: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: string;
}

export interface CachedStaffSkill {
  id: string;
  employeeId: string;
  tenantId: string;
  serviceId: string;
  skillLevel: SkillLevel;
  yearsExperience: number | null;
  isPrimary: boolean;
  isActive: boolean;
}

export interface CachedShift {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  breakMinutes: number;
  graceMinutes: number;
  isActive: boolean;
}

export interface CachedRosterAssignment {
  id: string;
  tenantId: string;
  employeeId: string;
  branchId: string;
  shiftId: string | null;
  rosterDate: string; // YYYY-MM-DD
  startAt: string;
  endAt: string;
  status: RosterStatus;
}

export interface LeaveBalanceSummary {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  year: number;
  openingBalance: number;
  accrued: number;
  used: number;
  adjusted: number;
  currentBalance: number;
}
