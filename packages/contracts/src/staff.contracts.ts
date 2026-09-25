import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const EmploymentStatusEnum = z.enum([
  'INVITED',
  'ACTIVE',
  'ON_LEAVE',
  'SUSPENDED',
  'RESIGNED',
  'TERMINATED',
  'INACTIVE',
]);
export type EmploymentStatus = z.infer<typeof EmploymentStatusEnum>;

export const EmploymentTypeEnum = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'FREELANCE',
  'INTERN',
]);
export type EmploymentType = z.infer<typeof EmploymentTypeEnum>;

export const SkillLevelEnum = z.enum([
  'TRAINEE',
  'JUNIOR',
  'INTERMEDIATE',
  'SENIOR',
  'EXPERT',
  'MASTER',
]);
export type SkillLevel = z.infer<typeof SkillLevelEnum>;

export const RosterStatusEnum = z.enum([
  'SCHEDULED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'ABSENT',
]);
export type RosterStatus = z.infer<typeof RosterStatusEnum>;

export const AttendanceStatusEnum = z.enum([
  'PRESENT',
  'ABSENT',
  'LATE',
  'HALF_DAY',
  'ON_LEAVE',
  'HOLIDAY',
  'WEEK_OFF',
]);
export type AttendanceStatus = z.infer<typeof AttendanceStatusEnum>;

export const AttendanceMethodEnum = z.enum(['MANUAL', 'MOBILE', 'WEB', 'BIOMETRIC', 'QR']);
export type AttendanceMethod = z.infer<typeof AttendanceMethodEnum>;

export const LeaveTypeEnum = z.enum([
  'CASUAL',
  'SICK',
  'PAID',
  'UNPAID',
  'MATERNITY',
  'PATERNITY',
  'COMP_OFF',
  'OTHER',
]);
export type LeaveType = z.infer<typeof LeaveTypeEnum>;

export const LeaveStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);
export type LeaveStatus = z.infer<typeof LeaveStatusEnum>;

export const DocumentTypeEnum = z.enum([
  'AADHAAR',
  'PAN',
  'BANK_PROOF',
  'CONTRACT',
  'CERTIFICATE',
  'OTHER',
]);
export type DocumentType = z.infer<typeof DocumentTypeEnum>;

// ==========================================
// Employee & Staff Profile Schemas
// ==========================================

export const CreateStaffProfileInputSchema = z.object({
  bio: z.string().optional(),
  yearsOfExperience: z.number().min(0).max(70).optional(),
  specialization: z.string().optional(),
  designation: z.string().optional(),
  commissionEligible: z.boolean().default(true),
  acceptsOnlineBooking: z.boolean().default(true),
  isBookable: z.boolean().default(true),
  serviceCapacity: z.number().int().min(1).default(1),
  profileVisibility: z.enum(['PUBLIC', 'INTERNAL', 'PRIVATE']).default('PUBLIC'),
});

export const EmergencyContactInputSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  mobilePhone: z.string().min(6),
  alternatePhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const CreateEmployeeRequestSchema = z.preprocess((val: any) => {
  if (!val || typeof val !== 'object') return val;
  const raw = { ...val };

  // Full name mapping
  if (raw.fullName && (!raw.firstName || !raw.lastName)) {
    const parts = String(raw.fullName).trim().split(/\s+/);
    raw.firstName = raw.firstName || parts[0] || 'Staff';
    raw.lastName = raw.lastName || parts.slice(1).join(' ') || 'Member';
    raw.displayName = raw.displayName || raw.fullName;
  } else if (raw.firstName && !raw.displayName) {
    raw.displayName = `${raw.firstName} ${raw.lastName || ''}`.trim();
  }

  // Employee Code / ID mapping
  if (!raw.employeeCode) {
    if (raw.id && !raw.id.includes('-') && raw.id.length < 20) {
      raw.employeeCode = raw.id;
    } else {
      raw.employeeCode = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    }
  }

  // Role / Job Title mapping
  if (!raw.jobTitle && (raw.role || raw.designation)) {
    raw.jobTitle = raw.role || raw.designation;
  }

  // Mobile mapping
  if (!raw.mobilePhone && (raw.mobile || raw.phone)) {
    raw.mobilePhone = raw.mobile || raw.phone;
  }

  // DOB mapping
  if (!raw.dateOfBirth && raw.dob) {
    const parsed = new Date(raw.dob);
    raw.dateOfBirth = !isNaN(parsed.getTime()) ? parsed.toISOString() : undefined;
  }

  // Status mapping
  if (raw.status && !raw.employmentStatus) {
    const s = String(raw.status).toUpperCase().replace(/\s+/g, '_');
    if (['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RESIGNED'].includes(s)) {
      raw.employmentStatus = s;
    }
  }

  // Employment Type mapping
  if (raw.employmentType) {
    const et = String(raw.employmentType).toUpperCase().replace(/\s+/g, '_');
    if (['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERN'].includes(et)) {
      raw.employmentType = et;
    } else if (et === 'CONSULTANT') {
      raw.employmentType = 'FREELANCE';
    }
  }

  const isUuid = (str?: any) =>
    typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  if (!isUuid(raw.primaryBranchId)) {
    raw.primaryBranchId = null;
  }
  if (!isUuid(raw.identityUserId)) {
    raw.identityUserId = null;
  }
  if (!isUuid(raw.managerEmployeeId)) {
    raw.managerEmployeeId = null;
  }
  if (raw.email === '' || (typeof raw.email === 'string' && !raw.email.includes('@'))) {
    raw.email = null;
  }

  return raw;
}, z.object({
  employeeCode: z.string().min(1).max(50),
  identityUserId: z.string().uuid().optional().nullable(),
  firstName: z.string().min(1).max(100).default('Staff'),
  lastName: z.string().min(1).max(100).default('Member'),
  displayName: z.string().min(1).max(150).default('Staff Member'),
  email: z.string().email().optional().nullable(),
  mobilePhone: z.string().min(6).max(25).default('+91 99000 00000'),
  dateOfBirth: z.string().or(z.date()).optional().nullable(),
  gender: z.string().optional().nullable(),
  employmentStatus: EmploymentStatusEnum.default('ACTIVE'),
  employmentType: EmploymentTypeEnum.default('FULL_TIME'),
  joiningDate: z.string().or(z.date()).default(() => new Date().toISOString()),
  primaryBranchId: z.string().optional().nullable(),
  franchiseId: z.string().optional().nullable(),
  jobTitle: z.string().min(1).max(100).default('Stylist'),
  department: z.string().optional().nullable(),
  managerEmployeeId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  profile: CreateStaffProfileInputSchema.optional(),
  emergencyContacts: z.array(EmergencyContactInputSchema).optional().default([]),
  // Additional rich frontend fields
  id: z.string().optional(),
  fullName: z.string().optional(),
  role: z.string().optional(),
  branch: z.string().optional(),
  status: z.string().optional(),
  mobile: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarInitials: z.string().optional(),
  reportingManager: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  currentShift: z.string().optional(),
  level: z.string().optional(),
  skills: z.array(z.string()).optional(),
  assignedServices: z.array(z.string()).optional(),
  weeklyOffs: z.array(z.string()).optional(),
  metrics: z.record(z.any()).optional(),
  skillsList: z.array(z.record(z.any())).optional(),
  documents: z.array(z.record(z.any())).optional(),
  roster: z.array(z.record(z.any())).optional(),
  attendance: z.array(z.record(z.any())).optional(),
  targets: z.array(z.record(z.any())).optional(),
  commissions: z.array(z.record(z.any())).optional(),
  performanceHistory: z.array(z.record(z.any())).optional(),
  leaves: z.array(z.record(z.any())).optional(),
  leaveBalance: z.record(z.any()).optional(),
  compensation: z.record(z.any()).optional(),
  roleId: z.string().optional().nullable(),
  roleCode: z.string().optional().nullable(),
  loginEnabled: z.boolean().optional().nullable(),
  password: z.string().optional().nullable(),
}).passthrough());
export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeRequestSchema>;

export const UpdateEmployeeRequestSchema = z.preprocess((val: any) => {
  if (!val || typeof val !== 'object') return val;
  const raw = { ...val };

  if (raw.fullName && (!raw.firstName || !raw.lastName)) {
    const parts = String(raw.fullName).trim().split(/\s+/);
    raw.firstName = raw.firstName || parts[0];
    raw.lastName = raw.lastName || parts.slice(1).join(' ');
    raw.displayName = raw.displayName || raw.fullName;
  }

  if (!raw.jobTitle && (raw.role || raw.designation)) {
    raw.jobTitle = raw.role || raw.designation;
  }

  if (!raw.mobilePhone && (raw.mobile || raw.phone)) {
    raw.mobilePhone = raw.mobile || raw.phone;
  }

  if (!raw.dateOfBirth && raw.dob) {
    const parsed = new Date(raw.dob);
    raw.dateOfBirth = !isNaN(parsed.getTime()) ? parsed.toISOString() : undefined;
  }

  if (raw.status && !raw.employmentStatus) {
    const s = String(raw.status).toUpperCase().replace(/\s+/g, '_');
    if (['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED', 'RESIGNED'].includes(s)) {
      raw.employmentStatus = s;
    }
  }

  const isUuid = (str?: any) =>
    typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  if (raw.primaryBranchId !== undefined && !isUuid(raw.primaryBranchId)) {
    raw.primaryBranchId = null;
  }
  if (raw.identityUserId !== undefined && !isUuid(raw.identityUserId)) {
    raw.identityUserId = null;
  }
  if (raw.managerEmployeeId !== undefined && !isUuid(raw.managerEmployeeId)) {
    raw.managerEmployeeId = null;
  }
  if (raw.email === '' || (typeof raw.email === 'string' && !raw.email.includes('@'))) {
    raw.email = null;
  }

  return raw;
}, z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  displayName: z.string().min(1).max(150).optional(),
  email: z.string().email().optional().nullable(),
  mobilePhone: z.string().min(6).max(25).optional(),
  dateOfBirth: z.string().or(z.date()).optional().nullable(),
  gender: z.string().optional().nullable(),
  employmentStatus: EmploymentStatusEnum.optional(),
  employmentType: EmploymentTypeEnum.optional(),
  exitDate: z.string().or(z.date()).optional().nullable(),
  primaryBranchId: z.string().optional().nullable(),
  franchiseId: z.string().optional().nullable(),
  jobTitle: z.string().min(1).max(100).optional(),
  department: z.string().optional().nullable(),
  managerEmployeeId: z.string().optional().nullable(),
  profilePhotoObjectKey: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  profile: CreateStaffProfileInputSchema.partial().optional(),
  // Additional rich frontend fields
  id: z.string().optional(),
  fullName: z.string().optional(),
  role: z.string().optional(),
  branch: z.string().optional(),
  status: z.string().optional(),
  mobile: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarInitials: z.string().optional(),
  reportingManager: z.string().optional(),
  dob: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  currentShift: z.string().optional(),
  level: z.string().optional(),
  skills: z.array(z.string()).optional(),
  assignedServices: z.array(z.string()).optional(),
  weeklyOffs: z.array(z.string()).optional(),
  metrics: z.record(z.any()).optional(),
  skillsList: z.array(z.record(z.any())).optional(),
  documents: z.array(z.record(z.any())).optional(),
  roster: z.array(z.record(z.any())).optional(),
  attendance: z.array(z.record(z.any())).optional(),
  targets: z.array(z.record(z.any())).optional(),
  commissions: z.array(z.record(z.any())).optional(),
  performanceHistory: z.array(z.record(z.any())).optional(),
  leaves: z.array(z.record(z.any())).optional(),
  leaveBalance: z.record(z.any()).optional(),
  compensation: z.record(z.any()).optional(),
  roleId: z.string().optional().nullable(),
  roleCode: z.string().optional().nullable(),
  loginEnabled: z.boolean().optional().nullable(),
  password: z.string().optional().nullable(),
}).passthrough());
export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeRequestSchema>;

export const ListStaffQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  branchId: z.string().uuid().optional(),
  franchiseId: z.string().optional(),
  hasFranchise: z.union([z.boolean(), z.string()]).optional(),
  status: EmploymentStatusEnum.optional(),
  employmentType: EmploymentTypeEnum.optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'displayName', 'employeeCode', 'joiningDate']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).passthrough();
export type ListStaffQuery = z.infer<typeof ListStaffQuerySchema>;

export const StaffResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  employeeCode: z.string(),
  identityUserId: z.string().uuid().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string(),
  email: z.string().nullable().optional(),
  mobilePhone: z.string(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  employmentStatus: EmploymentStatusEnum,
  employmentType: EmploymentTypeEnum,
  joiningDate: z.string(),
  exitDate: z.string().nullable().optional(),
  primaryBranchId: z.string().uuid().nullable().optional(),
  franchiseId: z.string().uuid().nullable().optional(),
  jobTitle: z.string(),
  department: z.string().nullable().optional(),
  managerEmployeeId: z.string().uuid().nullable().optional(),
  profilePhotoObjectKey: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  profile: z
    .object({
      id: z.string().uuid(),
      bio: z.string().nullable().optional(),
      yearsOfExperience: z.number().nullable().optional(),
      specialization: z.string().nullable().optional(),
      designation: z.string().nullable().optional(),
      commissionEligible: z.boolean(),
      acceptsOnlineBooking: z.boolean(),
      isBookable: z.boolean(),
      serviceCapacity: z.number(),
      profileVisibility: z.string(),
    })
    .optional(),
  branchAssignments: z
    .array(
      z.object({
        id: z.string().uuid(),
        branchId: z.string().uuid(),
        isPrimary: z.boolean(),
        status: z.string(),
        effectiveFrom: z.string(),
        effectiveTo: z.string().nullable().optional(),
      }),
    )
    .optional(),
});
export type StaffResponse = z.infer<typeof StaffResponseSchema>;

// ==========================================
// Branch Assignments
// ==========================================

export const AssignStaffBranchRequestSchema = z.object({
  branchId: z.string().uuid(),
  isPrimary: z.boolean().default(false),
  effectiveFrom: z.string().or(z.date()).default(() => new Date().toISOString()),
  effectiveTo: z.string().or(z.date()).optional().nullable(),
  status: z.string().default('ACTIVE'),
});
export type AssignStaffBranchRequest = z.infer<typeof AssignStaffBranchRequestSchema>;

export const UpdateStaffBranchAssignmentRequestSchema = z.object({
  isPrimary: z.boolean().optional(),
  effectiveTo: z.string().or(z.date()).optional().nullable(),
  status: z.string().optional(),
});
export type UpdateStaffBranchAssignmentRequest = z.infer<
  typeof UpdateStaffBranchAssignmentRequestSchema
>;

// ==========================================
// Skills
// ==========================================

export const AddStaffSkillRequestSchema = z.object({
  serviceId: z.string().uuid(),
  skillLevel: SkillLevelEnum.default('INTERMEDIATE'),
  yearsExperience: z.number().min(0).max(70).optional().nullable(),
  isPrimary: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type AddStaffSkillRequest = z.infer<typeof AddStaffSkillRequestSchema>;

export const UpdateStaffSkillRequestSchema = z.object({
  skillLevel: SkillLevelEnum.optional(),
  yearsExperience: z.number().min(0).max(70).optional().nullable(),
  isPrimary: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateStaffSkillRequest = z.infer<typeof UpdateStaffSkillRequestSchema>;

// ==========================================
// Shifts
// ==========================================

export const CreateShiftRequestSchema = z.object({
  branchId: z.string().uuid(),
  name: z.string().min(1).max(100),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  breakMinutes: z.number().int().min(0).default(0),
  graceMinutes: z.number().int().min(0).default(15),
  isActive: z.boolean().default(true),
});
export type CreateShiftRequest = z.infer<typeof CreateShiftRequestSchema>;

export const UpdateShiftRequestSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)').optional(),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)').optional(),
  breakMinutes: z.number().int().min(0).optional(),
  graceMinutes: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateShiftRequest = z.infer<typeof UpdateShiftRequestSchema>;

// ==========================================
// Roster
// ==========================================

export const CreateRosterRequestSchema = z.object({
  employeeId: z.string().uuid(),
  branchId: z.string().uuid(),
  shiftId: z.string().uuid().optional().nullable(),
  rosterDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  status: RosterStatusEnum.default('SCHEDULED'),
});
export type CreateRosterRequest = z.infer<typeof CreateRosterRequestSchema>;

export const UpdateRosterRequestSchema = z.object({
  shiftId: z.string().uuid().optional().nullable(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  status: RosterStatusEnum.optional(),
});
export type UpdateRosterRequest = z.infer<typeof UpdateRosterRequestSchema>;

export const QueryRosterRequestSchema = z.object({
  branchId: z.string().uuid().optional(),
  employeeId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type QueryRosterRequest = z.infer<typeof QueryRosterRequestSchema>;

// ==========================================
// Attendance
// ==========================================

export const ClockInRequestSchema = z.object({
  employeeId: z.string().uuid().optional(), // Required if manager or TENANT principal, otherwise inferred from auth staff
  branchId: z.string().uuid(),
  method: AttendanceMethodEnum.default('WEB'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type ClockInRequest = z.infer<typeof ClockInRequestSchema>;

export const ClockOutRequestSchema = z.object({
  employeeId: z.string().uuid().optional(),
  branchId: z.string().uuid(),
  method: AttendanceMethodEnum.default('WEB'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  notes: z.string().optional().nullable(),
});
export type ClockOutRequest = z.infer<typeof ClockOutRequestSchema>;

export const ManualAttendanceRequestSchema = z.object({
  employeeId: z.string().uuid(),
  branchId: z.string().uuid(),
  attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  clockInAt: z.string().datetime().optional().nullable(),
  clockOutAt: z.string().datetime().optional().nullable(),
  status: AttendanceStatusEnum.default('PRESENT'),
  lateMinutes: z.number().int().min(0).default(0),
  earlyLeaveMinutes: z.number().int().min(0).default(0),
  overtimeMinutes: z.number().int().min(0).default(0),
  notes: z.string().optional().nullable(),
});
export type ManualAttendanceRequest = z.infer<typeof ManualAttendanceRequestSchema>;

export const QueryAttendanceRequestSchema = z.object({
  branchId: z.string().uuid().optional(),
  employeeId: z.string().uuid().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: AttendanceStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type QueryAttendanceRequest = z.infer<typeof QueryAttendanceRequestSchema>;

// ==========================================
// Leave & Leave Balances
// ==========================================

export const CreateLeaveRequestSchema = z.object({
  employeeId: z.string().uuid().optional(), // Inferred if staff principal
  leaveType: LeaveTypeEnum,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD required'),
  reason: z.string().min(1).max(500).optional(),
});
export type CreateLeaveRequest = z.infer<typeof CreateLeaveRequestSchema>;

export const UpdateLeaveRequestSchema = z.object({
  leaveType: LeaveTypeEnum.optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  reason: z.string().optional(),
});
export type UpdateLeaveRequest = z.infer<typeof UpdateLeaveRequestSchema>;

export const ReviewLeaveDecisionSchema = z.object({
  reviewNote: z.string().max(500).optional(),
});
export type ReviewLeaveDecision = z.infer<typeof ReviewLeaveDecisionSchema>;

export const AdjustLeaveBalanceRequestSchema = z.object({
  leaveType: LeaveTypeEnum,
  year: z.number().int().min(2000).max(2100),
  adjustmentAmount: z.number(), // positive or negative
  reason: z.string().min(2).max(250),
});
export type AdjustLeaveBalanceRequest = z.infer<typeof AdjustLeaveBalanceRequestSchema>;

// ==========================================
// Booking Availability Internal Contract
// ==========================================

export const StaffAvailabilityContextResponseSchema = z.object({
  employeeId: z.string().uuid(),
  tenantId: z.string().uuid(),
  displayName: z.string(),
  isBookable: z.boolean(),
  employmentStatus: EmploymentStatusEnum,
  assignedBranchIds: z.array(z.string().uuid()),
  roster: z
    .array(
      z.object({
        date: z.string(),
        startAt: z.string(),
        endAt: z.string(),
        branchId: z.string().uuid(),
        status: RosterStatusEnum,
      }),
    )
    .default([]),
  leaves: z
    .array(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        leaveType: LeaveTypeEnum,
        status: LeaveStatusEnum,
      }),
    )
    .default([]),
  skills: z.array(z.string().uuid()).default([]),
});
export type StaffAvailabilityContextResponse = z.infer<
  typeof StaffAvailabilityContextResponseSchema
>;
