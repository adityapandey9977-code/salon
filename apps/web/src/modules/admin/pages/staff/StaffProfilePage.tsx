import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  CalendarClock,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Crown,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Gift,
  History,
  Layers,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Percent,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { staffApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { StaffFormModal } from './StaffFormModal';
import { useAdminContext } from '../../context/AdminContext';

export interface StaffSkillItem {
  skill: string;
  level: 'Junior' | 'Intermediate' | 'Senior' | 'Expert';
  qualification: string;
  assignedServices: string[];
  status: 'Certified' | 'In Training' | 'Pending Assessment';
}

export interface StaffDocumentItem {
  id: string;
  name: string;
  type: string;
  refNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  uploadedBy: string;
  lastUpdated: string;
}

export interface StaffLeaveItem {
  id: string;
  type: 'Casual Leave' | 'Sick Leave' | 'Paid Privilege Leave' | 'Emergency Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedOn: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  approvedBy: string;
}

export interface StaffLeaveBalance {
  totalAnnual: number;
  taken: number;
  pending: number;
  available: number;
}

export interface StaffRosterShiftItem {
  day: string;
  date: string;
  shift?: string;
  shiftType?: 'Morning' | 'General' | 'Evening' | 'Custom' | 'Off';
  time?: string;
  branch?: string;
  hours?: string;
  status: 'Scheduled' | 'Completed' | 'Weekly Off' | 'On Leave' | 'Off';
}

export interface StaffAttendanceItem {
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  workingHours?: string;
  totalHours?: string;
  overtime?: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Weekly Off' | 'Absent';
}

export interface StaffTargetItem {
  period: string;
  serviceTarget: number;
  serviceAchieved: number;
  retailTarget: number;
  retailAchieved: number;
  achievementRate: number;
  status: 'Exceeded' | 'On Track' | 'Below Target';
}

export interface StaffCommissionItem {
  payPeriod?: string;
  period?: string;
  grossSales?: number;
  servicesRevenue?: number;
  serviceCommission: number;
  retailRevenue?: number;
  retailCommission: number;
  tipsReceived?: number;
  totalPayout?: number;
  finalCommission?: number;
  status: 'Paid' | 'Approved' | 'Pending Review' | 'Pending Approval' | 'Draft';
}

export interface StaffPerformanceMonth {
  month: string;
  revenue: number;
  servicesCount: number;
  rebookingRate: number;
  utilisation: number;
  rating: number;
}

export interface FullStaffRecord {
  id: string;
  employeeCode?: string;
  jobTitle?: string;
  avatarUrl?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName?: string;
  tenantId?: string;
  role: string;
  roleCode?: string;
  branch: string;
  primaryBranchId?: string;
  franchiseId?: string | null;
  loginEnabled?: boolean;
  password?: string;
  identityUserId?: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Suspended';
  employmentStatus?: string;
  avatarInitials: string;
  joiningDate: string;
  employmentType: 'Full Time' | 'Part Time' | 'Contract' | 'Consultant';
  reportingManager: string;
  mobile: string;
  mobilePhone?: string;
  email: string;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  address: string;
  emergencyContact: string;
  currentShift: string;
  level: 'Junior' | 'Intermediate' | 'Senior' | 'Expert';
  skills: string[];
  assignedServices: string[];
  metrics: {
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
  skillsList: StaffSkillItem[];
  documents: StaffDocumentItem[];
  roster: StaffRosterShiftItem[];
  attendance: StaffAttendanceItem[];
  targets: StaffTargetItem[];
  commissions: StaffCommissionItem[];
  performanceHistory: StaffPerformanceMonth[];
  leaves?: StaffLeaveItem[];
  leaveBalance?: StaffLeaveBalance;
  weeklyOffs?: string[];
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
  profile?: {
    bio?: string | null;
    yearsOfExperience?: number | null;
    specialization?: string | null;
    designation?: string | null;
    commissionEligible?: boolean;
    acceptsOnlineBooking?: boolean;
    isBookable?: boolean;
    serviceCapacity?: number;
    profileVisibility?: string;
  } | null;
  specialization?: string;
}

export const masterStaffRecords: FullStaffRecord[] = [];



interface StaffProfilePageProps {
  staffData?: FullStaffRecord;
  onBack?: () => void;
}

export function StaffProfilePage({ staffData, onBack }: StaffProfilePageProps) {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const { salon } = useAdminContext();
  const availableBranches =
    salon?.branches && salon.branches.length > 0 ? salon.branches : masterBranches;

  const staffIdFromQuery = searchParams.get('staffId');
  const staffId = params.id || staffIdFromQuery;

  // Resolve initial staff record
  const initialStaff: FullStaffRecord =
    staffData || masterStaffRecords.find((s) => s.id === staffId) || masterStaffRecords[0];

  const [staff, setStaff] = useState<FullStaffRecord>(initialStaff);

  // Fetch live staff record from API when opened
  React.useEffect(() => {
    let isMounted = true;
    if (staffId) {
      staffApi
        .getById(staffId)
        .then((liveRecord) => {
          if (isMounted && liveRecord && liveRecord.fullName) {
            const brObj = availableBranches.find(
              (b) => b.id === liveRecord.primaryBranchId || b.name === liveRecord.branch,
            );
            setStaff((prev) => ({
              ...prev,
              ...liveRecord,
              branch: brObj?.name || liveRecord.branch || prev.branch,
              primaryBranchId: brObj?.id || liveRecord.primaryBranchId || prev.primaryBranchId,
            }));
          }
        })
        .catch((err) => {
          console.warn('Live staff detail fetch notice (using cache):', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [staffId, availableBranches]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isWeekOffModalOpen, setIsWeekOffModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [profileCommissionForm, setProfileCommissionForm] = useState({
    period: 'August 2026',
    grossSales: 280000,
    serviceCommissionRate: 12,
    retailSales: 45000,
    retailCommissionRate: 15,
    adjustments: 1500,
    status: 'Approved' as StaffCommissionItem['status'],
  });
  const [tempWeeklyOffs, setTempWeeklyOffs] = useState<string[]>(['Wednesday', 'Sunday']);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week'>('month');
  const [leaveFormData, setLeaveFormData] = useState({
    type: 'Casual Leave' as StaffLeaveItem['type'],
    startDate: '25 Aug 2026',
    endDate: '26 Aug 2026',
    days: 2,
    reason: '',
    status: 'Approved' as StaffLeaveItem['status'],
  });

  const handleOpenLeaveModal = () => {
    setLeaveFormData({
      type: 'Casual Leave',
      startDate: '25 Aug 2026',
      endDate: '26 Aug 2026',
      days: 2,
      reason: '',
      status: 'Approved',
    });
    setIsLeaveModalOpen(true);
  };

  const handleOpenWeekOffModal = () => {
    setTempWeeklyOffs(staff.weeklyOffs || ['Wednesday', 'Sunday']);
    setIsWeekOffModalOpen(true);
  };

  const handleSaveWeeklyOffs = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStaff: FullStaffRecord = {
      ...staff,
      weeklyOffs: tempWeeklyOffs,
    };
    setStaff(updatedStaff);
    const masterIdx = masterStaffRecords.findIndex((s) => s.id === updatedStaff.id);
    if (masterIdx >= 0) masterStaffRecords[masterIdx] = updatedStaff;
    setIsWeekOffModalOpen(false);
    toast(
      `Weekly off days updated for ${staff.fullName} (${tempWeeklyOffs.join(', ') || 'No off days scheduled'})`,
    );
  };

  const handleRecordLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveFormData.reason.trim()) {
      toast('Please provide a reason for the leave application');
      return;
    }

    const newLeave: StaffLeaveItem = {
      id: `LEV-${Math.floor(Math.random() * 900 + 10)}`,
      type: leaveFormData.type,
      startDate: leaveFormData.startDate,
      endDate: leaveFormData.endDate,
      days: Number(leaveFormData.days) || 1,
      reason: leaveFormData.reason.trim(),
      appliedOn: 'Today (19 Aug)',
      status: leaveFormData.status,
      approvedBy: leaveFormData.status === 'Approved' ? 'Branch Manager' : 'Pending Review',
    };

    const currentLeaves = staff.leaves || [];
    const updatedLeaves = [newLeave, ...currentLeaves];
    const currentBalance = staff.leaveBalance || {
      totalAnnual: staff.compensation?.holidays || 24,
      taken: 0,
      pending: 0,
      available: staff.compensation?.holidays || 24,
    };

    const newTaken =
      leaveFormData.status === 'Approved'
        ? currentBalance.taken + newLeave.days
        : currentBalance.taken;
    const newPending =
      leaveFormData.status === 'Pending'
        ? currentBalance.pending + newLeave.days
        : currentBalance.pending;
    const newAvailable = Math.max(0, currentBalance.totalAnnual - newTaken);

    const updatedStaff: FullStaffRecord = {
      ...staff,
      leaves: updatedLeaves,
      leaveBalance: {
        totalAnnual: currentBalance.totalAnnual,
        taken: newTaken,
        pending: newPending,
        available: newAvailable,
      },
    };

    setStaff(updatedStaff);
    const masterIdx = masterStaffRecords.findIndex((s) => s.id === updatedStaff.id);
    if (masterIdx >= 0) masterStaffRecords[masterIdx] = updatedStaff;

    setIsLeaveModalOpen(false);
    toast(`Leave record for ${staff.fullName} recorded (${newLeave.type} · ${newLeave.days} Days)`);
  };

  const handleRecordProfileCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const sComm = Math.round(
      (Number(profileCommissionForm.grossSales) *
        Number(profileCommissionForm.serviceCommissionRate)) /
        100,
    );
    const rComm = Math.round(
      (Number(profileCommissionForm.retailSales) *
        Number(profileCommissionForm.retailCommissionRate)) /
        100,
    );
    const totalPayout = sComm + rComm + Number(profileCommissionForm.adjustments || 0);

    const newCommissionEntry: StaffCommissionItem = {
      period: profileCommissionForm.period,
      payPeriod: profileCommissionForm.period,
      grossSales: Number(profileCommissionForm.grossSales),
      servicesRevenue: Number(profileCommissionForm.grossSales),
      retailRevenue: Number(profileCommissionForm.retailSales),
      serviceCommission: sComm,
      retailCommission: rComm,
      finalCommission: totalPayout,
      totalPayout: totalPayout,
      status: profileCommissionForm.status,
    };

    const updatedCommissions = [newCommissionEntry, ...(staff.commissions || [])];
    const updatedStaff: FullStaffRecord = {
      ...staff,
      commissions: updatedCommissions,
    };
    setStaff(updatedStaff);
    const masterIdx = masterStaffRecords.findIndex((s) => s.id === updatedStaff.id);
    if (masterIdx >= 0) masterStaffRecords[masterIdx] = updatedStaff;

    setIsCommissionModalOpen(false);
    toast(
      `Commission of ₹${totalPayout.toLocaleString('en-IN')} recorded for ${staff.fullName} (${profileCommissionForm.period})!`,
    );
  };

  const handleUpdateLeaveStatus = (leaveId: string, newStatus: 'Approved' | 'Rejected') => {
    const currentLeaves = staff.leaves || [];
    const targetLeave = currentLeaves.find((l) => l.id === leaveId);
    if (!targetLeave) return;

    const updatedLeaves = currentLeaves.map((l) =>
      l.id === leaveId
        ? {
            ...l,
            status: newStatus,
            approvedBy: newStatus === 'Approved' ? 'Branch Manager' : 'Rejected by Manager',
          }
        : l,
    );

    const currentBalance = staff.leaveBalance || {
      totalAnnual: 24,
      taken: 0,
      pending: 0,
      available: 24,
    };
    let newTaken = currentBalance.taken;
    let newPending = currentBalance.pending;

    if (targetLeave.status === 'Pending' && newStatus === 'Approved') {
      newTaken += targetLeave.days;
      newPending = Math.max(0, newPending - targetLeave.days);
    } else if (targetLeave.status === 'Pending' && newStatus === 'Rejected') {
      newPending = Math.max(0, newPending - targetLeave.days);
    }

    const newAvailable = Math.max(0, currentBalance.totalAnnual - newTaken);

    const updatedStaff: FullStaffRecord = {
      ...staff,
      leaves: updatedLeaves,
      leaveBalance: {
        totalAnnual: currentBalance.totalAnnual,
        taken: newTaken,
        pending: newPending,
        available: newAvailable,
      },
    };

    setStaff(updatedStaff);
    const masterIdx = masterStaffRecords.findIndex((s) => s.id === updatedStaff.id);
    if (masterIdx >= 0) masterStaffRecords[masterIdx] = updatedStaff;

    toast(`Leave ${leaveId} marked as ${newStatus}`);
  };

  const handleSaveStaffChanges = async (updatedStaff: FullStaffRecord) => {
    const matchedBranch = availableBranches.find(
      (b) => b.id === updatedStaff.primaryBranchId || b.name === updatedStaff.branch,
    );
    const enrichedRecord: FullStaffRecord = {
      ...updatedStaff,
      branch: matchedBranch?.name || updatedStaff.branch || availableBranches[0]?.name || 'Default Branch',
      primaryBranchId: matchedBranch?.id || updatedStaff.primaryBranchId || availableBranches[0]?.id || '',
    };

    setStaff(enrichedRecord);
    setIsEditModalOpen(false);

    // Sync to global master list
    const masterIdx = masterStaffRecords.findIndex((s) => s.id === enrichedRecord.id);
    if (masterIdx >= 0) {
      masterStaffRecords[masterIdx] = enrichedRecord;
    }

    try {
      await staffApi.update(enrichedRecord.id, enrichedRecord);
    } catch (err) {
      console.warn('Staff profile API update notice:', err);
    }
  };

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'personal'
    | 'employment'
    | 'skills'
    | 'documents'
    | 'roster'
    | 'attendance'
    | 'targets'
    | 'commission'
    | 'productivity'
    | 'performance'
  >('overview');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/staff');
    }
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Sparkles },
    { id: 'personal' as const, label: 'Personal Information', icon: User },
    { id: 'employment' as const, label: 'Employment', icon: Building2 },
    { id: 'skills' as const, label: 'Skills & Levels', icon: Award },
    { id: 'documents' as const, label: 'Documents', icon: FileCheck },
    { id: 'roster' as const, label: 'Roster & Shifts', icon: CalendarClock },
    { id: 'attendance' as const, label: 'Attendance & Leave', icon: Clock },
    { id: 'targets' as const, label: 'Targets', icon: Target },
    { id: 'commission' as const, label: 'Commission & Pay', icon: Percent },
    { id: 'productivity' as const, label: 'Productivity', icon: Activity },
    { id: 'performance' as const, label: 'Performance History', icon: History },
  ];

  if (!staff || !staff.id) {
    return (
      <div className="bg-white p-12 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs text-center max-w-md mx-auto my-12 animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs mx-auto">
          <Users className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-lg font-bold text-ink mb-1">Staff Profile Not Found</h3>
        <p className="text-xs text-muted mb-5">
          The requested staff record does not exist or has been removed from the directory.
        </p>
        <Button
          onClick={handleBack}
          className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a248c] text-white shadow-xs"
        >
          Return to Staff Directory
        </Button>
      </div>
    );
  }

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
            <span>Back to All Staff</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-soft font-medium">
            <span className="text-[#5A2EA6] font-bold">Brand Owner</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-soft font-semibold">Staff</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-ink font-bold">{staff.fullName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Edit2 className="w-4 h-4 text-[#5A2EA6]" />
            <span>Edit Profile</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => toast(`Performance review draft generated for ${staff.fullName}`)}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-[#5A2EA6]" />
            <span>Export Profile PDF</span>
          </Button>
        </div>
      </div>

      {/* Staff Hero Card */}
      <div className="bg-white rounded-[26px] border border-[#5A2EA6]/15 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar & Core Identity */}
          <div className="flex items-center gap-5">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={staff.fullName}
                className="w-18 h-18 rounded-3xl object-cover shadow-md border-2 border-[#5A2EA6] shrink-0"
              />
            ) : (
              <Avatar
                initials={staff.avatarInitials}
                className="w-18 h-18 rounded-3xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-2xl font-bold shadow-md shrink-0"
              />
            )}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-serif text-[24px] text-ink font-bold tracking-tight">
                  {staff.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-xs font-bold font-mono">
                  {staff.employeeCode || staff.id}
                </span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                    staff.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : staff.status === 'On Leave'
                        ? 'bg-amber-100 text-amber-800'
                        : staff.status === 'Suspended'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700',
                  )}
                >
                  {staff.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
                  Level: {staff.level}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted flex-wrap pt-1">
                <span className="font-semibold text-ink">{staff.role}</span>
                <span className="flex items-center gap-1.5 text-soft">
                  <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  {staff.branch}
                </span>
                <span className="flex items-center gap-1.5 text-soft">
                  <Phone className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  {staff.mobile}
                </span>
                <span className="text-muted">Joined {staff.joiningDate}</span>
              </div>
            </div>
          </div>

          {/* KPI Highlights */}
          <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
            <div className="p-3.5 bg-[#FAF7FF] rounded-2xl border border-purple-100/80 text-center min-w-[120px]">
              <span className="text-[10px] text-muted uppercase font-bold block">MTD Revenue</span>
              <strong className="text-[18px] font-bold text-ink font-serif mt-0.5 block">
                ₹{staff.metrics.revenueGenerated.toLocaleString('en-IN')}
              </strong>
              <span className="text-[9.5px] text-emerald-700 font-bold">
                {staff.metrics.targetAchievement}% Target
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF7FF] rounded-2xl border border-purple-100/80 text-center min-w-[120px]">
              <span className="text-[10px] text-muted uppercase font-bold block">Utilisation</span>
              <strong className="text-[18px] font-bold text-[#5A2EA6] font-serif mt-0.5 block">
                {staff.metrics.utilisation}%
              </strong>
              <span className="text-[9.5px] text-soft">
                {staff.metrics.servicesCompleted} Services
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 11 In-Page Navigation Tabs Bar */}
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
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Services Completed
              </span>
              <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
                {staff.metrics.servicesCompleted}{' '}
                <span className="text-xs text-soft font-normal">Clients</span>
              </strong>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                ★ {staff.metrics.csatRating} CSAT Rating
              </span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                Service Efficiency
              </span>
              <strong className="text-2xl font-bold text-emerald-700 font-serif mt-1 block">
                {staff.metrics.serviceEfficiency?.score || 98}%
              </strong>
              <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                {staff.metrics.serviceEfficiency?.avgDurationMinutes || 45}m avg delivery
              </span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
                Retail Sales
              </span>
              <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
                ₹{staff.metrics.retailSales.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-soft mt-1 block">18 Units Sold</span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Rebooking Rate
              </span>
              <strong className="text-2xl font-bold text-emerald-700 font-serif mt-1 block">
                {staff.metrics.rebookingRate}%
              </strong>
              <span className="text-[10px] text-soft mt-1 block">Top 5% across brand</span>
            </div>

            <div className="p-4.5 bg-white rounded-[22px] border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Earned Commission
              </span>
              <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
                ₹{staff.metrics.commissionEarned.toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-purple-700 font-bold mt-1 block">
                Ready for Payroll
              </span>
            </div>
          </div>

          {/* Current Shift & Skills Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-[22px] bg-gradient-to-br from-[#5A2EA6]/10 to-[#8B6FD8]/5 border border-[#5A2EA6]/20 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#5A2EA6]" /> Current Shift &amp; Attendance
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  On Floor
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink font-serif">{staff.currentShift}</h3>
              <p className="text-xs text-soft mt-1 leading-relaxed">
                Checked in at 08:52 AM at {staff.branch}. 4 appointments scheduled for today across
                Hydra-Facial and Resurfacing suites.
              </p>
            </div>

            <div className="p-5 rounded-[22px] bg-gradient-to-br from-purple-50/80 to-pink-50/50 border border-purple-100 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#5A2EA6]" /> Certified Competencies
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
                  {staff.skills.length} Specialisations
                </span>
              </div>
              <h3 className="text-lg font-bold text-ink font-serif">{staff.level} Specialist</h3>
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {staff.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-md bg-white border border-purple-200 text-ink text-[11px] font-semibold"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
            Staff identity and contact information is protected under employee privacy and HR access
            boundaries.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50">
                Personal Demographics
              </h3>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Full Name:</span>
                <strong className="text-ink">{staff.fullName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Gender:</span>
                <strong className="text-ink">{staff.gender}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Date of Birth:</span>
                <strong className="text-ink">{staff.dob}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Mobile Number:</span>
                <strong className="text-ink">{staff.mobile}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted font-medium">Work Email:</span>
                <strong className="text-ink">{staff.email}</strong>
              </div>
            </div>

            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50">
                Emergency &amp; Address
              </h3>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Residential Address:</span>
                <strong className="text-ink text-right max-w-xs">{staff.address}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Emergency Contact:</span>
                <strong className="text-ink">{staff.emergencyContact}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted font-medium">Home Branch Assignment:</span>
                <strong className="text-[#5A2EA6]">{staff.branch}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EMPLOYMENT */}
      {activeTab === 'employment' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50">
                Employment Terms
              </h3>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Employee ID:</span>
                <strong className="text-ink font-mono">{staff.employeeCode || staff.id}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Designation / Role:</span>
                <strong className="text-ink">{staff.role}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Employment Type:</span>
                <strong className="text-ink">{staff.employmentType}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Date of Joining:</span>
                <strong className="text-ink">{staff.joiningDate}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted font-medium">Reporting Manager:</span>
                <strong className="text-[#5A2EA6]">{staff.reportingManager}</strong>
              </div>
            </div>

            <div className="p-5 bg-[#FCFAFF] rounded-2xl border border-purple-100 space-y-3">
              <h3 className="font-bold text-[#5A2EA6] uppercase tracking-wider text-xs pb-1 border-b border-purple-50">
                Branch &amp; Scheduling Policy
              </h3>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Assigned Branch:</span>
                <strong className="text-ink">{staff.branch}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-50/80">
                <span className="text-muted font-medium">Employment Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {staff.status}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted font-medium">Overtime Eligibility:</span>
                <strong className="text-emerald-700">Approved (Standard 1.5x)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SKILLS & LEVELS */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[16px] font-bold text-ink">
                Skills Matrix &amp; Service Mapping
              </h3>
              <p className="text-xs text-muted">
                Configured competency levels and authorized catalogue services
              </p>
            </div>
            <span className="text-xs font-bold text-[#5A2EA6] bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Level: {staff.level}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                <tr>
                  <th className="p-3.5 pl-5">Skill Specialisation</th>
                  <th className="p-3.5">Proficiency Level</th>
                  <th className="p-3.5">Certification / Degree</th>
                  <th className="p-3.5">Assigned Catalogue Services</th>
                  <th className="p-3.5 pr-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {staff.skillsList.map((sk, idx) => (
                  <tr key={idx} className="hover:bg-[#5A2EA6]/3">
                    <td className="p-3.5 pl-5 font-bold text-ink">{sk.skill}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] font-bold text-[10px]">
                        {sk.level}
                      </span>
                    </td>
                    <td className="p-3.5 text-soft">{sk.qualification}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {sk.assignedServices.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 pr-5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                        {sk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[16px] font-bold text-ink">Employee Document Vault</h3>
              <p className="text-xs text-muted">
                Legal contracts, government IDs, and aesthetic certifications
              </p>
            </div>
            <Button
              onClick={() => toast('Document upload dialog opened')}
              className="h-8 px-3 rounded-lg text-xs font-bold bg-[#5A2EA6] text-white"
            >
              Upload Document
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                <tr>
                  <th className="p-3.5 pl-5">Document Name</th>
                  <th className="p-3.5">Document Type</th>
                  <th className="p-3.5">Ref / ID Number</th>
                  <th className="p-3.5">Validity Dates</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {staff.documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#5A2EA6]/3">
                    <td className="p-3.5 pl-5 font-bold text-ink">{doc.name}</td>
                    <td className="p-3.5 text-soft">{doc.type}</td>
                    <td className="p-3.5 font-mono text-[11px] text-ink">{doc.refNumber}</td>
                    <td className="p-3.5 text-muted">
                      <div>Issued: {doc.issueDate}</div>
                      <div>Expires: {doc.expiryDate}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                        {doc.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toast(`Downloaded ${doc.name}`)}
                          className="w-7 h-7 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] grid place-items-center cursor-pointer border-0"
                          title="Download Document"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. ROSTER & SHIFTS CALENDAR */}
      {activeTab === 'roster' &&
        (() => {
          const calYear = currentCalendarDate.getFullYear();
          const calMonth = currentCalendarDate.getMonth();
          const calMonthTitle = currentCalendarDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          });

          // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
          const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
          const calStartOffset = (firstDayOfMonth + 6) % 7; // Monday = 0
          const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
          const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

          const fullMonthCalendarDays = [];

          // Previous month padding
          for (let i = calStartOffset - 1; i >= 0; i--) {
            fullMonthCalendarDays.push({
              dayNumber: prevMonthDays - i,
              isCurrentMonth: false,
              isOff: false,
              isOnLeave: false,
              isToday: false,
              dateFormatted: '',
            });
          }

          // Current month days
          for (let d = 1; d <= daysInMonth; d++) {
            const dayName = new Date(calYear, calMonth, d).toLocaleString('en-US', {
              weekday: 'long',
            });
            const staffWeeklyOffs = staff.weeklyOffs || ['Wednesday', 'Sunday'];
            const isOffDay = staffWeeklyOffs.includes(dayName);

            // Check if staff has approved leave on this date
            const dStr = `${d < 10 ? '0' + d : d} ${currentCalendarDate.toLocaleString('en-US', { month: 'short' })}`;
            const isOnLeave =
              !isOffDay &&
              (staff.status === 'On Leave' ||
                (staff.leaves || []).some((l) => {
                  if (l.status !== 'Approved') return false;
                  const startD = Number.parseInt(l.startDate.match(/\d+/)?.[0] || '0', 10);
                  const endD = Number.parseInt(l.endDate.match(/\d+/)?.[0] || '0', 10);
                  return d >= startD && d <= endD;
                }));

            const isToday = d === 19 && calMonth === 7 && calYear === 2026;

            fullMonthCalendarDays.push({
              dayNumber: d,
              isCurrentMonth: true,
              isToday,
              isOff: isOffDay,
              isOnLeave,
              dateFormatted: dStr,
              shiftLabel: isOffDay
                ? 'Weekly Off'
                : isOnLeave
                  ? 'Approved Leave'
                  : staff.currentShift.replace(
                      /Morning\s*Shift|Evening\s*Shift|General\s*Shift|Custom\s*Flex\s*Shift/gi,
                      'Shift',
                    ),
              shiftHours: isOffDay
                ? '0h (Rest Day)'
                : isOnLeave
                  ? 'Leave Taken'
                  : `${staff.compensation?.workingHoursPerDay || 9}h Floor Time`,
            });
          }

          // Trailing next month padding
          const calRemaining = (7 - (fullMonthCalendarDays.length % 7)) % 7;
          for (let i = 1; i <= calRemaining; i++) {
            fullMonthCalendarDays.push({
              dayNumber: i,
              isCurrentMonth: false,
              isOff: false,
              isOnLeave: false,
              isToday: false,
              dateFormatted: '',
            });
          }

          const totalWorkingShiftsCount = fullMonthCalendarDays.filter(
            (c) => c.isCurrentMonth && !c.isOff && !c.isOnLeave,
          ).length;
          const totalWeeklyOffsCount = fullMonthCalendarDays.filter(
            (c) => c.isCurrentMonth && c.isOff,
          ).length;
          const totalLeavesCount = fullMonthCalendarDays.filter(
            (c) => c.isCurrentMonth && c.isOnLeave,
          ).length;
          const totalScheduledHours =
            totalWorkingShiftsCount * (staff.compensation?.workingHoursPerDay || 9);

          const weekDayNames = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ];
          const weekDays = [
            { day: 'Mon', date: '18 Aug', dayNum: 18, dayName: 'Monday' },
            { day: 'Tue', date: '19 Aug', dayNum: 19, dayName: 'Tuesday' },
            { day: 'Wed', date: '20 Aug', dayNum: 20, dayName: 'Wednesday' },
            { day: 'Thu', date: '21 Aug', dayNum: 21, dayName: 'Thursday' },
            { day: 'Fri', date: '22 Aug', dayNum: 22, dayName: 'Friday' },
            { day: 'Sat', date: '23 Aug', dayNum: 23, dayName: 'Saturday' },
            { day: 'Sun', date: '24 Aug', dayNum: 24, dayName: 'Sunday' },
          ];

          return (
            <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
              {/* Header & Calendar Navigation */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-50">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif text-[18px] font-bold text-ink tracking-tight">
                      Roster &amp; Shift Calendar
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-xs font-bold font-mono">
                      {calMonthTitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Complete interactive monthly schedule grid, shift hours, weekly rest days, and
                    approved leave tracking.
                  </p>
                </div>

                {/* Controls: Navigator, Manage Week Offs & View Modes */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Manage Week Offs Button */}
                  <Button
                    onClick={handleOpenWeekOffModal}
                    variant="outline"
                    className="h-9 px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Manage Week Offs</span>
                  </Button>

                  {/* Month Navigator */}
                  <div className="flex items-center bg-[#FAF7FF] border border-purple-100 rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={() => setCurrentCalendarDate(new Date(calYear, calMonth - 1, 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5A2EA6] hover:bg-white hover:shadow-2xs transition-all border-0 bg-transparent cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-xs font-bold text-ink min-w-[110px] text-center">
                      {calMonthTitle}
                    </span>
                    <button
                      onClick={() => setCurrentCalendarDate(new Date(calYear, calMonth + 1, 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5A2EA6] hover:bg-white hover:shadow-2xs transition-all border-0 bg-transparent cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentCalendarDate(new Date(2026, 7, 1))}
                    className="h-9 px-3 rounded-xl bg-white border border-purple-200 text-xs font-bold text-[#5A2EA6] hover:bg-purple-50 transition-all shadow-2xs cursor-pointer"
                  >
                    Today
                  </button>

                  {/* View Switcher */}
                  <div className="flex items-center bg-[#FAF7FF] border border-purple-100 rounded-xl p-1 shadow-2xs">
                    <button
                      onClick={() => setCalendarViewMode('month')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer',
                        calendarViewMode === 'month'
                          ? 'bg-[#5A2EA6] text-white shadow-2xs'
                          : 'bg-transparent text-soft hover:text-ink',
                      )}
                    >
                      Full Month
                    </button>
                    <button
                      onClick={() => setCalendarViewMode('week')}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer',
                        calendarViewMode === 'week'
                          ? 'bg-[#5A2EA6] text-white shadow-2xs'
                          : 'bg-transparent text-soft hover:text-ink',
                      )}
                    >
                      Week View
                    </button>
                  </div>
                </div>
              </div>

              {/* Monthly Metrics & Color Legend Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#FAF7FF] rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-900 block">
                      Scheduled Shifts
                    </span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {totalWorkingShiftsCount} Shifts
                    </strong>
                  </div>
                  <span className="text-[10.5px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                    {totalScheduledHours} Hours
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-700 block">
                      Weekly Offs ({staff.weeklyOffs?.length || 2}/wk)
                    </span>
                    <strong className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                      {staff.weeklyOffs?.join(', ') || 'None Configured'}
                    </strong>
                  </div>
                  <button
                    onClick={handleOpenWeekOffModal}
                    className="text-[10.5px] font-bold text-slate-700 bg-slate-200/80 hover:bg-slate-300 px-2 py-1 rounded-md border-0 cursor-pointer transition-colors"
                  >
                    Edit Offs
                  </button>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 block">
                      Approved Leaves
                    </span>
                    <strong className="text-base font-serif font-bold text-amber-900">
                      {totalLeavesCount} Days
                    </strong>
                  </div>
                  <span className="text-[10.5px] font-semibold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                    Paid Time Off
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                      Assigned Profile Shift
                    </span>
                    <strong className="text-xs font-bold text-emerald-900 truncate block mt-0.5">
                      {staff.currentShift.replace(
                        /Morning\s*Shift|Evening\s*Shift|General\s*Shift|Custom\s*Flex\s*Shift/gi,
                        'Shift',
                      )}
                    </strong>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {staff.branch}
                  </span>
                </div>
              </div>

              {/* FULL MONTH CALENDAR VIEW */}
              {calendarViewMode === 'month' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  {/* 7 Column Header Days */}
                  <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider bg-[#F8F5FF] py-2.5 rounded-xl border border-purple-100">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>

                  {/* Calendar Days 7x5 or 7x6 Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {fullMonthCalendarDays.map((cell, idx) => {
                      if (!cell.isCurrentMonth) {
                        return (
                          <div
                            key={idx}
                            className="min-h-[92px] p-2.5 rounded-2xl bg-slate-50/40 border border-slate-100 text-slate-300 flex flex-col justify-between opacity-40 select-none"
                          >
                            <span className="text-[11px] font-bold">{cell.dayNumber}</span>
                            <span className="text-[9px] text-slate-300">—</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          className={cn(
                            'min-h-[105px] p-2.5 rounded-2xl border flex flex-col justify-between transition-all relative group',
                            cell.isToday && 'ring-2 ring-[#5A2EA6] ring-offset-1',
                            cell.isOff
                              ? 'bg-slate-100/90 border-slate-300 shadow-3xs'
                              : cell.isOnLeave
                                ? 'bg-amber-50/95 border-amber-300 shadow-2xs'
                                : 'bg-[#FCFAFF] border-purple-200 shadow-3xs hover:border-[#5A2EA6] hover:shadow-sm',
                          )}
                        >
                          {/* Day Number and Status Tag */}
                          <div className="flex items-center justify-between pb-1 border-b border-purple-50">
                            <span
                              className={cn(
                                'text-xs font-bold font-mono',
                                cell.isToday
                                  ? 'w-5 h-5 rounded-full bg-[#5A2EA6] text-white grid place-items-center'
                                  : cell.isOff
                                    ? 'text-slate-700'
                                    : cell.isOnLeave
                                      ? 'text-amber-900'
                                      : 'text-ink',
                              )}
                            >
                              {cell.dayNumber}
                            </span>

                            <span
                              className={cn(
                                'px-1.5 py-0.2 rounded-md text-[8.5px] font-bold tracking-tight',
                                cell.isOff
                                  ? 'bg-slate-200 text-slate-700'
                                  : cell.isOnLeave
                                    ? 'bg-amber-500 text-white shadow-2xs'
                                    : 'bg-[#5A2EA6] text-white shadow-2xs',
                              )}
                            >
                              {cell.isOff ? 'Off' : cell.isOnLeave ? 'Leave' : 'Shift'}
                            </span>
                          </div>

                          {/* Shift Information */}
                          <div className="py-1">
                            <div
                              className={cn(
                                'text-[10px] font-bold leading-snug',
                                cell.isOff
                                  ? 'text-slate-700'
                                  : cell.isOnLeave
                                    ? 'text-amber-950'
                                    : 'text-ink',
                              )}
                            >
                              {cell.shiftLabel}
                            </div>
                          </div>

                          {/* Bottom Hours & Location */}
                          <div className="flex items-center justify-between text-[9px] pt-1 border-t border-purple-50/60">
                            <span
                              className={cn(
                                'font-medium',
                                cell.isOff
                                  ? 'text-slate-500'
                                  : cell.isOnLeave
                                    ? 'text-amber-800 font-semibold'
                                    : 'text-[#5A2EA6] font-semibold',
                              )}
                            >
                              {cell.shiftHours}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* WEEK VIEW */}
              {calendarViewMode === 'week' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 animate-in fade-in duration-200">
                  {weekDays.map((d, idx) => {
                    const staffWeeklyOffs = staff.weeklyOffs || ['Wednesday', 'Sunday'];
                    const isOffDay = staffWeeklyOffs.includes(d.dayName);
                    const isOnLeave =
                      !isOffDay &&
                      (staff.status === 'On Leave' ||
                        (staff.leaves || []).some((l) => {
                          if (l.status !== 'Approved') return false;
                          const startD = Number.parseInt(l.startDate.match(/\d+/)?.[0] || '0', 10);
                          const endD = Number.parseInt(l.endDate.match(/\d+/)?.[0] || '0', 10);
                          return d.dayNum >= startD && d.dayNum <= endD;
                        }));

                    const shiftLabel = isOffDay
                      ? 'Weekly Off'
                      : isOnLeave
                        ? 'Approved Leave'
                        : staff.currentShift.replace(
                            /Morning\s*Shift|Evening\s*Shift|General\s*Shift|Custom\s*Flex\s*Shift/gi,
                            'Shift',
                          );

                    const shiftHours = isOffDay
                      ? '0h (Rest Day)'
                      : isOnLeave
                        ? 'Paid Leave Availed'
                        : `${staff.compensation?.workingHoursPerDay || 9}h Floor Time`;

                    return (
                      <div
                        key={idx}
                        className={cn(
                          'p-3.5 rounded-2xl border text-center space-y-2 transition-all',
                          isOffDay
                            ? 'bg-slate-100/90 border-slate-300 shadow-3xs'
                            : isOnLeave
                              ? 'bg-amber-50/90 border-amber-300 shadow-2xs'
                              : 'bg-[#FCFAFF] border-purple-200 shadow-3xs hover:border-[#5A2EA6]',
                        )}
                      >
                        <div
                          className={cn(
                            'flex items-center justify-between pb-1 border-b',
                            isOffDay
                              ? 'border-slate-200'
                              : isOnLeave
                                ? 'border-amber-200'
                                : 'border-purple-100',
                          )}
                        >
                          <span
                            className={cn(
                              'text-[10.5px] font-bold uppercase',
                              isOffDay
                                ? 'text-slate-800'
                                : isOnLeave
                                  ? 'text-amber-900'
                                  : 'text-ink',
                            )}
                          >
                            {d.day}
                          </span>
                          <span
                            className={cn(
                              'text-[10px]',
                              isOffDay
                                ? 'text-slate-500'
                                : isOnLeave
                                  ? 'text-amber-700 font-semibold'
                                  : 'text-muted',
                            )}
                          >
                            {d.date}
                          </span>
                        </div>

                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold tracking-tight',
                            isOffDay
                              ? 'bg-slate-300 text-slate-800 font-bold border border-slate-400/30'
                              : isOnLeave
                                ? 'bg-amber-500 text-white font-bold shadow-2xs'
                                : 'bg-[#5A2EA6] text-white shadow-2xs',
                          )}
                        >
                          {isOffDay ? 'Weekly Off' : isOnLeave ? 'On Leave' : 'Scheduled'}
                        </span>

                        <div
                          className={cn(
                            'text-[11px] font-bold leading-tight min-h-[28px] flex items-center justify-center',
                            isOffDay ? 'text-slate-700' : isOnLeave ? 'text-amber-950' : 'text-ink',
                          )}
                        >
                          {shiftLabel}
                        </div>

                        <div
                          className={cn(
                            'text-[9.5px] font-medium',
                            isOffDay
                              ? 'text-slate-500'
                              : isOnLeave
                                ? 'text-amber-800'
                                : 'text-purple-800',
                          )}
                        >
                          {shiftHours}
                        </div>

                        <div
                          className={cn(
                            'text-[9.5px] font-semibold truncate',
                            isOffDay
                              ? 'text-slate-500'
                              : isOnLeave
                                ? 'text-amber-700'
                                : 'text-soft',
                          )}
                        >
                          {isOffDay ? 'Rest Day' : isOnLeave ? 'Paid Time Off' : staff.branch}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Roster Policy Footer & Edit Trigger */}
              <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 text-[#5A2EA6] grid place-items-center shrink-0">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-ink font-bold block">
                      Weekly Off Schedule ({staff.weeklyOffs?.join(', ') || 'None'})
                    </strong>
                    <span className="text-[11px] text-muted">
                      Off days are synced directly across staff scheduling matrices and client
                      booking slots.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleOpenWeekOffModal}
                    className="h-8 px-3 rounded-xl text-xs font-bold border-purple-200 text-ink hover:bg-white shrink-0 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Manage Off Days
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                    className="h-8 px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 shrink-0 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Shift Timings
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* 7. ATTENDANCE & LEAVE MANAGEMENT */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Leave Quota & Balance Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Annual Paid Leave Quota
              </span>
              <strong className="text-xl font-bold text-ink font-serif mt-0.5 block">
                {staff.leaveBalance?.totalAnnual || staff.compensation?.holidays || 24} Days
              </strong>
              <span className="text-[10px] text-soft">Entitled Annual Leave</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-purple-700 uppercase font-bold block">
                Leaves Taken / Availed
              </span>
              <strong className="text-xl font-bold text-purple-800 font-serif mt-0.5 block">
                {staff.leaveBalance?.taken ?? 5} Days
              </strong>
              <span className="text-[10px] text-soft">Approved &amp; Availed Leaves</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-amber-700 uppercase font-bold block">
                Pending Requests
              </span>
              <strong className="text-xl font-bold text-amber-800 font-serif mt-0.5 block">
                {staff.leaveBalance?.pending ?? 1} Days
              </strong>
              <span className="text-[10px] text-amber-700">Awaiting Manager Review</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                Available Balance
              </span>
              <strong className="text-xl font-bold text-emerald-800 font-serif mt-0.5 block">
                {staff.leaveBalance?.available ?? 18} Days
              </strong>
              <span className="text-[10px] text-emerald-700">Remaining Leave Quota</span>
            </div>
          </div>

          {/* Leave Management & Requests Ledger */}
          <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink">
                  Leave Management &amp; Requests
                </h3>
                <p className="text-xs text-muted">
                  Apply, review, and manage casual, sick, and privilege leaves
                </p>
              </div>
              <Button
                onClick={handleOpenLeaveModal}
                className="h-9 px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>+ Apply / Record Leave</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                  <tr>
                    <th className="p-3.5 pl-5">Leave Type</th>
                    <th className="p-3.5">Date Range</th>
                    <th className="p-3.5">Duration</th>
                    <th className="p-3.5">Reason / Notes</th>
                    <th className="p-3.5">Applied On</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                  {(staff.leaves || []).length > 0 ? (
                    (staff.leaves || []).map((leave) => (
                      <tr key={leave.id} className="hover:bg-[#5A2EA6]/3">
                        <td className="p-3.5 pl-5 font-bold text-ink">{leave.type}</td>
                        <td className="p-3.5 font-medium text-ink">
                          {leave.startDate}{' '}
                          {leave.startDate !== leave.endDate ? `– ${leave.endDate}` : ''}
                        </td>
                        <td className="p-3.5 font-semibold text-[#5A2EA6]">
                          {leave.days} {leave.days === 1 ? 'Day' : 'Days'}
                        </td>
                        <td className="p-3.5 text-soft max-w-[200px] truncate">{leave.reason}</td>
                        <td className="p-3.5 text-muted">{leave.appliedOn}</td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                              leave.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : leave.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800',
                            )}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          {leave.status === 'Pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdateLeaveStatus(leave.id, 'Approved')}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10.5px] border border-emerald-200 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateLeaveStatus(leave.id, 'Rejected')}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10.5px] border border-rose-200 cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10.5px] text-muted">{leave.approvedBy}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-5 text-center text-muted">
                        No leave records logged. Click "+ Apply / Record Leave" to record scheduled
                        time off.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Biometric Daily Attendance Logs */}
          <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink">
                  Recent Biometric Attendance Logs
                </h3>
                <p className="text-xs text-muted">
                  Real-time terminal punches and on-floor working duration
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                98.2% On-Time Ratio
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                  <tr>
                    <th className="p-3.5 pl-5">Date</th>
                    <th className="p-3.5">Shift</th>
                    <th className="p-3.5">Check-In</th>
                    <th className="p-3.5">Check-Out</th>
                    <th className="p-3.5">Working Hours</th>
                    <th className="p-3.5 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                  {staff.attendance.map((att, idx) => (
                    <tr key={idx} className="hover:bg-[#5A2EA6]/3">
                      <td className="p-3.5 pl-5 font-semibold text-ink">{att.date}</td>
                      <td className="p-3.5 font-medium text-[#5A2EA6]">
                        {att.shift.replace(/Morning\s*\(09-06\)/gi, 'Shift (09:00 AM – 06:00 PM)')}
                      </td>
                      <td className="p-3.5 font-mono text-ink">{att.checkIn}</td>
                      <td className="p-3.5 font-mono text-ink">{att.checkOut}</td>
                      <td className="p-3.5 font-bold text-ink">
                        {att.workingHours || att.totalHours}
                      </td>
                      <td className="p-3.5 pr-5">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                            att.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : att.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700',
                          )}
                        >
                          {att.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TARGETS */}
      {activeTab === 'targets' && (
        <div className="space-y-4">
          {staff.targets.map((tgt, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-[22px] border border-purple-100/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-ink text-base">{tgt.period}</h3>
                  <span className="text-xs text-muted">
                    Service &amp; Retail Performance Benchmarks
                  </span>
                </div>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-bold',
                    tgt.status === 'Exceeded'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-[#5A2EA6]',
                  )}
                >
                  {tgt.status} ({tgt.achievementRate}%)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-50">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted font-medium">Service Revenue:</span>
                    <strong className="text-ink">
                      ₹{tgt.serviceAchieved.toLocaleString('en-IN')} / ₹
                      {tgt.serviceTarget.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5A2EA6]"
                      style={{
                        width: `${Math.min(100, (tgt.serviceAchieved / tgt.serviceTarget) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-50">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted font-medium">Retail Sales:</span>
                    <strong className="text-ink">
                      ₹{tgt.retailAchieved.toLocaleString('en-IN')} / ₹
                      {tgt.retailTarget.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{
                        width: `${Math.min(100, (tgt.retailAchieved / tgt.retailTarget) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 9. COMMISSION & PAYROLL */}
      {activeTab === 'commission' && (
        <div className="space-y-5">
          {/* Compensation & Payroll Structure Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Fixed Monthly Salary
              </span>
              <strong className="text-xl font-bold text-ink font-serif mt-0.5 block">
                ₹{(staff.compensation?.fixedSalary || 55000).toLocaleString('en-IN')}
              </strong>
              <span className="text-[10px] text-soft">Base Pay Cycle (Monthly)</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
                Hourly Rate
              </span>
              <strong className="text-xl font-bold text-[#5A2EA6] font-serif mt-0.5 block">
                ₹{staff.compensation?.hourlyRate || 500}{' '}
                <span className="text-xs text-soft font-normal">/ hr</span>
              </strong>
              <span className="text-[10px] text-soft">Overtime / Flex Billable</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-muted uppercase font-bold block">
                Working Hours / Day
              </span>
              <strong className="text-xl font-bold text-ink font-serif mt-0.5 block">
                {staff.compensation?.workingHoursPerDay || 9} Hours
              </strong>
              <span className="text-[10px] text-soft">Standard Shift Duration</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                Annual Paid Holidays
              </span>
              <strong className="text-xl font-bold text-emerald-700 font-serif mt-0.5 block">
                {staff.compensation?.holidays || 24} Days
              </strong>
              <span className="text-[10px] text-emerald-700">Entitled Leave Quota</span>
            </div>
          </div>

          {/* Active Payroll Calculation Setting Banner */}
          <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-purple-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-serif text-sm font-bold text-ink tracking-tight">
                Active Payroll Calculation Setting
              </h4>
              <p className="text-[11px] text-muted mt-0.5">
                Rules determining how base salary, hourly overtime, and commissions are aggregated.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'px-3 py-1 rounded-xl text-xs font-bold border',
                  (staff.compensation?.payrollSettings?.fixed ?? true)
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-2xs'
                    : 'bg-white text-muted border-slate-200',
                )}
              >
                {(staff.compensation?.payrollSettings?.fixed ?? true) ? '✓ ' : ''}Fixed Base
              </span>
              <span
                className={cn(
                  'px-3 py-1 rounded-xl text-xs font-bold border',
                  (staff.compensation?.payrollSettings?.hourly ?? false)
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-2xs'
                    : 'bg-white text-muted border-slate-200',
                )}
              >
                {(staff.compensation?.payrollSettings?.hourly ?? false) ? '✓ ' : ''}Hourly Overtime
              </span>
              <span
                className={cn(
                  'px-3 py-1 rounded-xl text-xs font-bold border',
                  (staff.compensation?.payrollSettings?.commission ?? true)
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-2xs'
                    : 'bg-white text-muted border-slate-200',
                )}
              >
                {(staff.compensation?.payrollSettings?.commission ?? true) ? '✓ ' : ''}Commission
                Tier
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-purple-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-[16px] font-bold text-ink">
                  Commission Calculation Ledger
                </h3>
                <p className="text-xs text-muted">
                  Billed revenue commission, product incentives, and approval trail
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast(`Opening Finance & Payroll Module for ${staff.fullName}...`);
                    navigate('/admin/finance/commissions');
                  }}
                  className="h-8 px-3 rounded-lg text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-purple-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#5A2EA6]" />
                  <span>Process Payroll in Finance</span>
                </Button>

                <button
                  type="button"
                  onClick={() => setIsCommissionModalOpen(true)}
                  className="h-8 px-3.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white flex items-center gap-1.5 shadow-xs cursor-pointer border-0 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Commission</span>
                </button>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Auto-Calculated by Tier
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                  <tr>
                    <th className="p-3.5 pl-5">Pay Period</th>
                    <th className="p-3.5">Gross Sales Billed</th>
                    <th className="p-3.5">Service Commission</th>
                    <th className="p-3.5">Retail Incentive</th>
                    <th className="p-3.5">Final Approved Payout</th>
                    <th className="p-3.5 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                  {staff.commissions.map((comm, idx) => (
                    <tr key={idx} className="hover:bg-[#5A2EA6]/3">
                      <td className="p-3.5 pl-5 font-bold text-ink">
                        {comm.period || comm.payPeriod}
                      </td>
                      <td className="p-3.5 font-serif text-ink">
                        ₹{(comm.grossSales || comm.servicesRevenue || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-serif text-ink">
                        ₹{comm.serviceCommission.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-serif text-ink">
                        ₹{comm.retailCommission.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-serif font-bold text-[#5A2EA6] text-sm">
                        ₹{(comm.finalCommission || comm.totalPayout || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 pr-5">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                          {comm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 10. PRODUCTIVITY */}
      {activeTab === 'productivity' && (
        <div className="bg-white p-6 rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <h3 className="font-serif text-[16px] font-bold text-ink">
            Floor Productivity &amp; Chair Utilisation
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FCFAFF] border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-ink text-sm">Daily Chair Booking Utilisation</span>
                <p className="text-xs text-muted">
                  Percent of scheduled shift hours spent rendering revenue treatments
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-serif text-[#5A2EA6]">91%</span>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  Excellent Standing
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FCFAFF] border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-ink text-sm">
                  Average Treatment Turnover Buffer
                </span>
                <p className="text-xs text-muted">
                  Preparation, sanitation &amp; room reset interval between clients
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-serif text-ink">52 Mins</span>
                <span className="text-[10px] text-soft font-medium block">Within 60m Standard</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. PERFORMANCE HISTORY */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-purple-50 flex items-center justify-between">
            <h3 className="font-serif text-[16px] font-bold text-ink">
              Historical Monthly Performance
            </h3>
            <span className="text-xs text-muted font-medium">Last 6 Months Trend</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8F5FF] text-[#5A2EA6] border-b border-[#5A2EA6]/10 font-bold uppercase text-[9.5px]">
                <tr>
                  <th className="p-3.5 pl-5">Month</th>
                  <th className="p-3.5">Revenue Delivered</th>
                  <th className="p-3.5">Services Count</th>
                  <th className="p-3.5">Rebooking Rate</th>
                  <th className="p-3.5">Utilisation</th>
                  <th className="p-3.5 pr-5">CSAT Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {staff.performanceHistory.map((perf, idx) => (
                  <tr key={idx} className="hover:bg-[#5A2EA6]/3">
                    <td className="p-3.5 pl-5 font-bold text-ink">{perf.month}</td>
                    <td className="p-3.5 font-serif font-bold text-ink">
                      ₹{perf.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-soft">{perf.servicesCount} Sessions</td>
                    <td className="p-3.5 text-emerald-700 font-bold">{perf.rebookingRate}%</td>
                    <td className="p-3.5 font-bold text-[#5A2EA6]">{perf.utilisation}%</td>
                    <td className="p-3.5 pr-5">
                      <span className="text-amber-500 font-bold">★ {perf.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= EDIT STAFF PROFILE MODAL ================= */}
      <StaffFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={staff}
        defaultBranch={staff.branch}
        defaultBranchId={staff.primaryBranchId}
        onSave={handleSaveStaffChanges}
      />

      {/* ================= APPLY / RECORD LEAVE MODAL ================= */}
      {isLeaveModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl border border-purple-100 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] grid place-items-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink">Record Staff Leave</h3>
                    <p className="text-[11px] text-muted">
                      {staff.fullName} · {staff.employeeCode || staff.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordLeaveSubmit} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Leave Type
                  </label>
                  <select
                    value={leaveFormData.type}
                    onChange={(e) =>
                      setLeaveFormData({
                        ...leaveFormData,
                        type: e.target.value as StaffLeaveItem['type'],
                      })
                    }
                    className="w-full h-9.5 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Casual Leave">Casual Leave (Personal / Urgent)</option>
                    <option value="Sick Leave">Sick Leave (Medical / Health)</option>
                    <option value="Paid Privilege Leave">Paid Privilege Leave (Vacation)</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={leaveFormData.startDate}
                      onChange={(e) =>
                        setLeaveFormData({ ...leaveFormData, startDate: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={leaveFormData.endDate}
                      onChange={(e) =>
                        setLeaveFormData({ ...leaveFormData, endDate: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Total Duration (Days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={leaveFormData.days}
                      onChange={(e) =>
                        setLeaveFormData({ ...leaveFormData, days: Number(e.target.value) })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Approval Status
                    </label>
                    <select
                      value={leaveFormData.status}
                      onChange={(e) =>
                        setLeaveFormData({
                          ...leaveFormData,
                          status: e.target.value as StaffLeaveItem['status'],
                        })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Approved">Approved (Immediate)</option>
                      <option value="Pending">Pending (Manager Review)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Reason for Leave *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Attending family wedding, medical checkup, or personal vacation..."
                    value={leaveFormData.reason}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                    className="w-full p-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLeaveModalOpen(false)}
                    className="h-9 px-4 rounded-xl text-xs font-bold border-purple-200 text-soft hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-9 px-5 rounded-xl text-xs font-bold premium-btn-primary shadow-xs"
                  >
                    Confirm &amp; Record Leave
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* ================= MANAGE WEEKLY OFFS MODAL ================= */}
      {isWeekOffModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl border border-purple-100 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 grid place-items-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink">
                      Manage Weekly Off Days
                    </h3>
                    <p className="text-[11px] text-muted">
                      {staff.fullName} · {staff.employeeCode || staff.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWeekOffModalOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveWeeklyOffs} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-2">
                    Select Weekly Rest Days ({tempWeeklyOffs.length} Selected)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ].map((day) => {
                      const isSelected = tempWeeklyOffs.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setTempWeeklyOffs(tempWeeklyOffs.filter((d) => d !== day));
                            } else {
                              setTempWeeklyOffs([...tempWeeklyOffs, day]);
                            }
                          }}
                          className={cn(
                            'p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center',
                            isSelected
                              ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                              : 'bg-[#FCFAFF] text-slate-700 border-purple-100 hover:border-[#5A2EA6] hover:bg-purple-50',
                          )}
                        >
                          {isSelected ? '✓ ' : '+ '} {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-[11px] text-purple-900">
                  <span className="font-semibold block">Roster Synchronization:</span>
                  Changes saved here automatically update all 31 days in the monthly shift calendar,
                  active floor assignments, and client booking appointment availability.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsWeekOffModalOpen(false)}
                    className="h-9 px-4 rounded-xl text-xs font-bold border-purple-200 text-soft hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-9 px-5 rounded-xl text-xs font-bold premium-btn-primary shadow-xs"
                  >
                    Save Weekly Off Schedule
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
      {/* Record Commission Modal for Staff Profile */}
      {isCommissionModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">
                    Record Staff Commission Payout
                  </h3>
                  <p className="text-[11px] text-muted">
                    Credit monthly treatment revenue and retail product bonuses to {staff.fullName}
                  </p>
                </div>
                <button
                  onClick={() => setIsCommissionModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRecordProfileCommission} className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Settlement Period *
                    </label>
                    <select
                      value={profileCommissionForm.period}
                      onChange={(e) =>
                        setProfileCommissionForm({
                          ...profileCommissionForm,
                          period: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="August 2026">August 2026 (Current Cycle)</option>
                      <option value="July 2026">July 2026 (Prior Cycle)</option>
                      <option value="September 2026">September 2026 (Upcoming)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Payout Status
                    </label>
                    <select
                      value={profileCommissionForm.status}
                      onChange={(e) =>
                        setProfileCommissionForm({
                          ...profileCommissionForm,
                          status: e.target.value as StaffCommissionItem['status'],
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Approved">Approved (Payroll Ready)</option>
                      <option value="Pending Approval">Pending Approval</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2.5">
                  <div className="flex justify-between text-[11px] font-bold text-[#5A2EA6] uppercase">
                    <span>Service Revenue</span>
                    <span>
                      Calculated: ₹
                      {Math.round(
                        (profileCommissionForm.grossSales *
                          profileCommissionForm.serviceCommissionRate) /
                          100,
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Gross Service Sales (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={profileCommissionForm.grossSales}
                        onChange={(e) =>
                          setProfileCommissionForm({
                            ...profileCommissionForm,
                            grossSales: Number(e.target.value),
                          })
                        }
                        className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={profileCommissionForm.serviceCommissionRate}
                        onChange={(e) =>
                          setProfileCommissionForm({
                            ...profileCommissionForm,
                            serviceCommissionRate: Number(e.target.value),
                          })
                        }
                        className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2.5">
                  <div className="flex justify-between text-[11px] font-bold text-emerald-700 uppercase">
                    <span>Retail Attach &amp; Bonuses</span>
                    <span>
                      Calculated: ₹
                      {Math.round(
                        (profileCommissionForm.retailSales *
                          profileCommissionForm.retailCommissionRate) /
                          100,
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Retail Sales (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={profileCommissionForm.retailSales}
                        onChange={(e) =>
                          setProfileCommissionForm({
                            ...profileCommissionForm,
                            retailSales: Number(e.target.value),
                          })
                        }
                        className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Rate (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={profileCommissionForm.retailCommissionRate}
                        onChange={(e) =>
                          setProfileCommissionForm({
                            ...profileCommissionForm,
                            retailCommissionRate: Number(e.target.value),
                          })
                        }
                        className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-muted uppercase block mb-1">
                        Bonus (₹)
                      </label>
                      <input
                        type="number"
                        value={profileCommissionForm.adjustments}
                        onChange={(e) =>
                          setProfileCommissionForm({
                            ...profileCommissionForm,
                            adjustments: Number(e.target.value),
                          })
                        }
                        className="w-full h-9 px-3 rounded-lg border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Payout Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] text-white flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Net Commission Payout:
                  </span>
                  <strong className="text-xl font-bold font-serif">
                    ₹
                    {(
                      Math.round(
                        (profileCommissionForm.grossSales *
                          profileCommissionForm.serviceCommissionRate) /
                          100,
                      ) +
                      Math.round(
                        (profileCommissionForm.retailSales *
                          profileCommissionForm.retailCommissionRate) /
                          100,
                      ) +
                      Number(profileCommissionForm.adjustments || 0)
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsCommissionModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-gradient-to-r from-[#5A2EA6] to-[#7B4DFF] hover:opacity-95 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Commission Payout</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default StaffProfilePage;
