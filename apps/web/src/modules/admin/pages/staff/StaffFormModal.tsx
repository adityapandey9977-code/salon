import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Layers,
  Mail,
  MapPin,
  Percent,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  UploadCloud,
  User,
  X,
  Lock,
  Eye,
  EyeOff,
  Shield,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import type { FullStaffRecord } from './StaffProfilePage';
import { rolesApi } from '@/shared/api/roles.api';
import { tenantsApi } from '@/shared/api/tenants.api';
import { useAdminContext } from '../../context/AdminContext';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (savedStaff: FullStaffRecord) => void;
  initialData?: FullStaffRecord | null;
  mode: 'add' | 'edit';
  defaultBranch?: string;
  defaultBranchId?: string;
  defaultFranchiseId?: string;
}

const AVAILABLE_ROLES = [
  'Senior Master Aesthetician',
  'Creative Hair Art Director',
  'Lead Master Barber & Stylist',
  'Senior Nail Artist & Extensionist',
  'Senior Spa & Holistic Therapist',
  'Junior Hair Stylist',
  'Skin & Laser Specialist',
  'Front Desk & Client Relations Manager',
];

const PRESET_SKILLS = [
  'Medical Hydra-Facial',
  'Laser Skin Resurfacing',
  'Chemical Peels',
  'Micro-Needling RF',
  'Balayage & Color Formulation',
  'Precision Styling',
  'Brazilian Keratin Complex',
  'Gel Extensions & French Ombre',
  '3D Nail Artistry',
  'Russian Manicure Care',
  'Deep Tissue Sculpting',
  'Ayurvedic Abhyanga Ritual',
  'Aromatherapy Reflexology',
  'Executive Beard Sculpt',
];

const PRESET_SERVICES = [
  'Medical Hydra-Facial Protocol',
  'Chemical Skin Peels',
  'Micro-Needling RF Lift',
  'Balayage Highlight & Tone',
  'Signature Precision Cut & Blowout',
  'Brazilian Keratin Complex',
  'Sculpted Acrylic Nail Extension',
  'Russian E-File Dry Manicure',
  'Royal Balinese Full Body Massage',
  'Deep Tissue Recovery Therapy',
];

const MANAGERS = [
  'Rahul Sharma (General Manager)',
  'Priya Patel (Branch Manager)',
  'Deepak Rathore (Branch Manager)',
  'Ananya Shah (Super Director HQ)',
];

const SHIFT_OPTIONS = ['Custom Flex Shift'];

// Full 24-Hour Universal Time Slots (48 intervals across all global timezones & 24/7 operations)
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const formattedHours = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${formattedHours}:${formattedMinutes} ${period}`;
});

// Helper to convert arbitrary date string (e.g. "14 May 1994" or "1994-05-14") to "YYYY-MM-DD" for input[type="date"]
function toDateInputValue(dateStr?: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return '';
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper to convert "YYYY-MM-DD" back to friendly display format "DD MMM YYYY" (e.g. "14 May 1994")
function toFriendlyDate(isoStr?: string): string {
  if (!isoStr) return '';
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

export function StaffFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  defaultBranch,
  defaultBranchId,
  defaultFranchiseId,
}: StaffFormModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { salon } = useAdminContext();
  const [liveBranches, setLiveBranches] = useState<any[]>(
    salon?.branches && salon.branches.length > 0 ? salon.branches : [],
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveBranches() {
      try {
        const list = await tenantsApi.listBranches();
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setLiveBranches(list);
        }
      } catch (err) {
        console.warn('StaffFormModal live branch notice:', err);
      }
    }
    if (!salon?.branches || salon.branches.length === 0) {
      fetchLiveBranches();
    }
    return () => {
      isMounted = false;
    };
  }, [salon?.branches]);

  const availableBranches = useMemo(() => {
    const list =
      salon?.branches && salon.branches.length > 0
        ? salon.branches
        : liveBranches.length > 0
          ? liveBranches
          : masterBranches;

    if (
      defaultBranchId &&
      defaultBranch &&
      defaultBranch !== 'All' &&
      !list.some((b: any) => b.id === defaultBranchId)
    ) {
      return [{ id: defaultBranchId, name: defaultBranch, code: 'BRANCH' }, ...list];
    }
    return list;
  }, [salon?.branches, liveBranches, defaultBranchId, defaultBranch]);

  const initialBranchObj =
    availableBranches.find(
      (b: any) =>
        (defaultBranchId && b.id === defaultBranchId) ||
        (defaultBranch && (b.name === defaultBranch || b.id === defaultBranch)),
    ) || (defaultBranchId ? { id: defaultBranchId, name: defaultBranch || 'Assigned Branch' } : availableBranches[0]);

  const [roleOptions, setRoleOptions] = useState<
    Array<{ id: string; name: string; code: string; isSystem: boolean }>
  >([
    { id: 'BRANCH_MANAGER', name: 'Branch Manager', code: 'BRANCH_MANAGER', isSystem: true },
    { id: 'STYLIST', name: 'Lead Master Stylist', code: 'STYLIST', isSystem: true },
    { id: 'AESTHETICIAN', name: 'Senior Master Aesthetician', code: 'AESTHETICIAN', isSystem: true },
    { id: 'THERAPIST', name: 'Senior Spa Therapist', code: 'THERAPIST', isSystem: true },
    { id: 'FRONT_DESK', name: 'Front Desk & Client Relations', code: 'FRONT_DESK', isSystem: true },
    { id: 'INVENTORY_MANAGER', name: 'Inventory Specialist', code: 'INVENTORY_MANAGER', isSystem: true },
  ]);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    rolesApi
      .list({ scope: 'TENANT', showOnFrontend: true, panel: 'ADMIN' })
      .then((roles) => {
        if (roles && roles.length > 0) {
          const excludedCodes = [
            'SUPER_ADMIN',
            'SUPPORT_OPERATOR',
            'BILLING_SPECIALIST',
            'SECURITY_AUDITOR',
          ];
          const tenantRoles = roles.filter((r) => !excludedCodes.includes(r.code));
          setRoleOptions(
            tenantRoles.map((r) => ({
              id: r.id,
              name: r.name,
              code: r.code,
              isSystem: Boolean(r.isSystem),
            })),
          );
        }
      })
      .catch((err) => {
        console.warn('Failed to load roles from API in StaffFormModal:', err);
      });
  }, []);

  const [activeSection, setActiveSection] = useState<
    'personal' | 'employment' | 'skills' | 'targets' | 'documents'
  >('personal');

  // Form State covering all fields of the staff details page
  const [formData, setFormData] = useState({
    id: '',
    avatarUrl: '',
    firstName: '',
    lastName: '',
    gender: 'Female' as 'Female' | 'Male' | 'Other',
    dob: '14 May 1994',
    mobile: '',
    email: '',
    address: '',
    emergencyContactName: 'Suresh Deshmukh',
    emergencyContactRelation: 'Father',
    emergencyContactPhone: '+91 98260 99881',

    // Employment & RBAC
    role: 'Branch Manager',
    roleCode: 'BRANCH_MANAGER',
    branch: initialBranchObj?.name || 'Default Branch',
    primaryBranchId: initialBranchObj?.id || '',
    loginEnabled: true,
    password: 'Password@123',
    employmentType: 'Full Time' as FullStaffRecord['employmentType'],
    joiningDate: '15 Jan 2024',
    reportingManager: MANAGERS[0],
    status: 'Active' as FullStaffRecord['status'],
    currentShift: SHIFT_OPTIONS[0],
    customShiftStartTime: '09:00 AM',
    customShiftEndTime: '07:00 PM',
    customBreakStartTime: '01:00 PM',
    customBreakEndTime: '02:00 PM',
    weeklyOffs: ['Wednesday', 'Sunday'] as string[],

    // Skills & Services
    level: 'Senior' as FullStaffRecord['level'],
    qualification: 'CIDESCO International Diploma',
    skills: ['Medical Hydra-Facial', 'Chemical Peels'],
    assignedServices: ['Medical Hydra-Facial Protocol', 'Chemical Skin Peels'],
    newSkillInput: '',
    newServiceInput: '',

    // Targets, Compensation & Payroll
    hourlyRate: 500,
    fixedSalary: 55000,
    workingHoursPerDay: 9,
    holidays: 24,
    payrollSettings: {
      fixed: true,
      hourly: false,
      commission: true,
    },
    monthlyServiceTarget: 250000,
    monthlyRetailTarget: 50000,
    serviceCommissionRate: 12,
    retailCommissionRate: 15,

    // Documents & Compliance
    idProofType: 'Aadhaar Identity Card',
    idProofRef: 'XXXX-XXXX-8921',
    certificationName: 'CIDESCO International Diploma',
    certificationRef: 'CID-2021-4402',
    certificationExpiry: 'Permanent',
    contractRef: 'AGR-2024-1082',
    contractExpiry: '15 Jan 2029',
  });

  // Populate data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData && mode === 'edit') {
        const emergencyParts = (initialData.emergencyContact || '').split(' - ');
        const nameRel = emergencyParts[0] || '';
        const phone = emergencyParts[1] || '';
        const nameParts = nameRel.split(' (');
        const contactName = nameParts[0] || '';
        const contactRel = nameParts[1]?.replace(')', '') || 'Family';

        const matchedBranch =
          availableBranches.find(
            (b) =>
              (initialData.primaryBranchId && b.id === initialData.primaryBranchId) ||
              (initialData.branch && (b.name === initialData.branch || b.id === initialData.branch)),
          );
        const resolvedBranchName =
          matchedBranch?.name || initialData.branch || availableBranches[0]?.name || 'Default Branch';
        const resolvedBranchId =
          matchedBranch?.id || initialData.primaryBranchId || availableBranches[0]?.id || '';

        setFormData({
          id: initialData.id,
          avatarUrl: initialData.avatarUrl || '',
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          gender: initialData.gender || 'Female',
          dob: initialData.dob || '14 May 1994',
          mobile: initialData.mobile,
          email: initialData.email,
          address: initialData.address || '',
          emergencyContactName: contactName || 'Family Contact',
          emergencyContactRelation: contactRel || 'Spouse / Parent',
          emergencyContactPhone: phone || initialData.mobile,

          role: initialData.role,
          roleCode: initialData.roleCode || initialData.role,
          branch: resolvedBranchName,
          primaryBranchId: resolvedBranchId,
          loginEnabled: initialData.loginEnabled !== undefined ? initialData.loginEnabled : true,
          password: initialData.password || '',
          employmentType: initialData.employmentType,
          joiningDate: initialData.joiningDate,
          reportingManager: initialData.reportingManager || MANAGERS[0],
          status: initialData.status,
          currentShift: initialData.currentShift?.includes('Custom')
            ? 'Custom Flex Shift'
            : initialData.currentShift || SHIFT_OPTIONS[0],
          customShiftStartTime:
            initialData.currentShift?.match(/\(([\d:]+\s*(?:AM|PM))/i)?.[1] || '09:00 AM',
          customShiftEndTime:
            initialData.currentShift?.match(/–\s*([\d:]+\s*(?:AM|PM))\)/i)?.[1] || '07:00 PM',
          customBreakStartTime: '01:00 PM',
          customBreakEndTime: '02:00 PM',
          weeklyOffs: initialData.weeklyOffs || ['Wednesday', 'Sunday'],

          level: initialData.level,
          qualification:
            initialData.skillsList?.[0]?.qualification || 'CIDESCO Diploma / Vocational Cert',
          skills: initialData.skills || [],
          assignedServices: initialData.assignedServices || [],
          newSkillInput: '',
          newServiceInput: '',

          hourlyRate: initialData.compensation?.hourlyRate || 500,
          fixedSalary: initialData.compensation?.fixedSalary || 55000,
          workingHoursPerDay: initialData.compensation?.workingHoursPerDay || 9,
          holidays: initialData.compensation?.holidays || 24,
          payrollSettings: initialData.compensation?.payrollSettings || {
            fixed: true,
            hourly: false,
            commission: true,
          },
          monthlyServiceTarget: initialData.targets?.[0]?.serviceTarget || 250000,
          monthlyRetailTarget: initialData.targets?.[0]?.retailTarget || 50000,
          serviceCommissionRate: initialData.compensation?.serviceCommissionRate || 12,
          retailCommissionRate: initialData.compensation?.retailCommissionRate || 15,

          idProofType: initialData.documents?.[1]?.name || 'Aadhaar Identity Card',
          idProofRef: initialData.documents?.[1]?.refNumber || 'XXXX-XXXX-8921',
          certificationName: initialData.documents?.[0]?.name || 'Professional Certification',
          certificationRef: initialData.documents?.[0]?.refNumber || 'CERT-2023-8821',
          certificationExpiry: initialData.documents?.[0]?.expiryDate || 'Permanent',
          contractRef: initialData.documents?.[2]?.refNumber || 'AGR-2023-1082',
          contractExpiry: initialData.documents?.[2]?.expiryDate || '15 Jan 2028',
        });
      } else {
        // Reset to default for Add Mode
        const newEmpId = `EMP-${1080 + Math.floor(Math.random() * 900 + 10)}`;
        const defaultBranchObj =
          availableBranches.find(
            (b: any) =>
              (defaultBranchId && b.id === defaultBranchId) ||
              (defaultBranch && (b.name === defaultBranch || b.id === defaultBranch)),
          ) || (defaultBranchId ? { id: defaultBranchId, name: defaultBranch || 'Assigned Branch' } : availableBranches[0]);

        setFormData({
          id: newEmpId,
          avatarUrl: '',
          firstName: '',
          lastName: '',
          gender: 'Female',
          dob: '18 Aug 1995',
          mobile: '',
          email: '',
          address: 'Flat 402, Royal Palms, Arera Colony',
          emergencyContactName: 'Family Guardian',
          emergencyContactRelation: 'Spouse',
          emergencyContactPhone: '+91 98260 00000',

          role: roleOptions[0]?.name || 'Branch Manager',
          roleCode: roleOptions[0]?.code || 'BRANCH_MANAGER',
          branch: defaultBranchObj?.name || defaultBranch || 'Default Branch',
          primaryBranchId: defaultBranchId || defaultBranchObj?.id || '',
          loginEnabled: true,
          password: 'Password@123',
          employmentType: 'Full Time',
          joiningDate: '18 Aug 2026',
          reportingManager: MANAGERS[0],
          status: 'Active',
          currentShift: SHIFT_OPTIONS[0],
          customShiftStartTime: '09:00 AM',
          customShiftEndTime: '07:00 PM',
          customBreakStartTime: '01:00 PM',
          customBreakEndTime: '02:00 PM',
          weeklyOffs: ['Wednesday', 'Sunday'],

          level: 'Senior',
          qualification: 'CIDESCO International Diploma',
          skills: ['Medical Hydra-Facial', 'Laser Skin Resurfacing'],
          assignedServices: ['Medical Hydra-Facial Protocol', 'Chemical Skin Peels'],
          newSkillInput: '',
          newServiceInput: '',

          hourlyRate: 500,
          fixedSalary: 55000,
          workingHoursPerDay: 9,
          holidays: 24,
          payrollSettings: {
            fixed: true,
            hourly: false,
            commission: true,
          },
          monthlyServiceTarget: 250000,
          monthlyRetailTarget: 50000,
          serviceCommissionRate: 12,
          retailCommissionRate: 15,

          idProofType: 'Aadhaar Identity Card',
          idProofRef: 'XXXX-XXXX-9901',
          certificationName: 'CIDESCO Gold Diploma',
          certificationRef: 'CID-2024-5510',
          certificationExpiry: 'Permanent',
          contractRef: 'AGR-2026-9901',
          contractExpiry: '18 Aug 2031',
        });
      }
      setActiveSection('personal');
    }
  }, [isOpen, initialData, mode]);

  if (!isOpen) return null;

  const initials =
    `${formData.firstName?.[0] || 'S'}${formData.lastName?.[0] || 'P'}`.toUpperCase();

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({ ...prev, avatarUrl: result }));
        toast('Profile picture uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleAddCustomSkill = () => {
    const trimmed = formData.newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
        newSkillInput: '',
      });
    }
  };

  const handleToggleService = (service: string) => {
    if (formData.assignedServices.includes(service)) {
      setFormData({
        ...formData,
        assignedServices: formData.assignedServices.filter((s) => s !== service),
      });
    } else {
      setFormData({ ...formData, assignedServices: [...formData.assignedServices, service] });
    }
  };

  const handleAddCustomService = () => {
    const trimmed = formData.newServiceInput.trim();
    if (trimmed && !formData.assignedServices.includes(trimmed)) {
      setFormData({
        ...formData,
        assignedServices: [...formData.assignedServices, trimmed],
        newServiceInput: '',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      toast('Please provide staff first name');
      setActiveSection('personal');
      return;
    }
    if (!formData.mobile.trim()) {
      toast('Please provide a valid contact mobile number');
      setActiveSection('personal');
      return;
    }

    if (formData.roleCode === 'BRANCH_MANAGER' && !formData.branch) {
      toast('Branch selection is mandatory for Branch Manager role.');
      setActiveSection('employment');
      return;
    }

    if (formData.loginEnabled) {
      if (!formData.email || !formData.email.includes('@')) {
        toast('A valid email address is required when portal login is enabled.');
        setActiveSection('personal');
        return;
      }
      if (mode === 'add' && (!formData.password || formData.password.length < 8)) {
        toast('Login password must be at least 8 characters long.');
        setActiveSection('employment');
        return;
      }
      if (mode === 'edit' && formData.password && formData.password.length < 8) {
        toast('Login password must be at least 8 characters long.');
        setActiveSection('employment');
        return;
      }
    }

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const initials =
      `${formData.firstName[0] || 'S'}${formData.lastName ? formData.lastName[0] : ''}`.toUpperCase();
    const emergencyString = `${formData.emergencyContactName} (${formData.emergencyContactRelation}) - ${formData.emergencyContactPhone}`;
    const isUuid = (str?: any) =>
      typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    let finalPrimaryBranchId = formData.primaryBranchId;
    if (finalPrimaryBranchId && !isUuid(finalPrimaryBranchId)) {
      const matched = availableBranches.find(
        (b) => isUuid(b.id) && (b.id === finalPrimaryBranchId || b.name === formData.branch),
      );
      finalPrimaryBranchId = matched?.id || '';
    }
    if (!finalPrimaryBranchId && formData.branch) {
      const matched = availableBranches.find(
        (b) => isUuid(b.id) && (b.name === formData.branch || b.id === formData.branch),
      );
      finalPrimaryBranchId = matched?.id || '';
    }
    const resolvedShift = `Shift (${formData.customShiftStartTime} – ${formData.customShiftEndTime})`;

    const completeStaffRecord: FullStaffRecord = {
      id: formData.id || `EMP-${1080 + Math.floor(Math.random() * 900 + 10)}`,
      avatarUrl: formData.avatarUrl,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: fullName,
      role: formData.role,
      roleCode: formData.roleCode,
      branch: formData.branch,
      primaryBranchId: finalPrimaryBranchId,
      franchiseId: initialData?.franchiseId || defaultFranchiseId || undefined,
      loginEnabled: formData.loginEnabled,
      password: formData.password,
      status: formData.status,
      avatarInitials: initials,
      joiningDate: formData.joiningDate,
      employmentType: formData.employmentType,
      reportingManager: formData.reportingManager,
      mobile: formData.mobile,
      email: formData.email,
      gender: formData.gender,
      dob: formData.dob,
      address: formData.address,
      emergencyContact: emergencyString,
      currentShift: resolvedShift,
      weeklyOffs: formData.weeklyOffs,
      level: formData.level,
      skills: formData.skills.length > 0 ? formData.skills : ['General Specialist'],
      assignedServices:
        formData.assignedServices.length > 0
          ? formData.assignedServices
          : ['Catalogue Standard Care'],
      metrics: initialData?.metrics || {
        revenueGenerated: 0,
        servicesCompleted: 0,
        retailSales: 0,
        rebookingRate: 90,
        utilisation: 80,
        commissionEarned: 0,
        targetAchievement: 95,
        csatRating: 4.8,
        serviceEfficiency: {
          score: 100,
          avgDurationMinutes: 45,
          standardDurationMinutes: 45,
          varianceMinutes: 0,
          onTimeDeliveryRate: 98,
        },
      },
      skillsList: formData.skills.map((sk) => ({
        skill: sk,
        level: formData.level,
        qualification: formData.qualification,
        assignedServices: formData.assignedServices.slice(0, 2),
        status: 'Certified',
      })),
      documents: [
        {
          id: 'DOC-01',
          name: formData.certificationName,
          type: 'Professional Certification',
          refNumber: formData.certificationRef,
          issueDate: formData.joiningDate,
          expiryDate: formData.certificationExpiry,
          status: 'Valid',
          uploadedBy: 'HR Admin',
          lastUpdated: 'Today',
        },
        {
          id: 'DOC-02',
          name: formData.idProofType,
          type: 'Government ID',
          refNumber: formData.idProofRef,
          issueDate: '01 Jan 2020',
          expiryDate: 'Permanent',
          status: 'Valid',
          uploadedBy: 'HR Admin',
          lastUpdated: 'Today',
        },
        {
          id: 'DOC-03',
          name: 'Employment Agreement',
          type: 'Legal Contract',
          refNumber: formData.contractRef,
          issueDate: formData.joiningDate,
          expiryDate: formData.contractExpiry,
          status: 'Valid',
          uploadedBy: 'HR Admin',
          lastUpdated: 'Today',
        },
      ],
      roster: initialData?.roster || [
        {
          day: 'Mon',
          date: '18 Aug',
          shift: formData.currentShift,
          hours: '9h (1h Break)',
          status: 'Scheduled',
        },
        {
          day: 'Tue',
          date: '19 Aug',
          shift: formData.currentShift,
          hours: '9h (1h Break)',
          status: 'Scheduled',
        },
        { day: 'Wed', date: '20 Aug', shift: 'Weekly Off', hours: '0h', status: 'Weekly Off' },
        {
          day: 'Thu',
          date: '21 Aug',
          shift: formData.currentShift,
          hours: '9h (1h Break)',
          status: 'Scheduled',
        },
        {
          day: 'Fri',
          date: '22 Aug',
          shift: formData.currentShift,
          hours: '9h (1h Break)',
          status: 'Scheduled',
        },
        {
          day: 'Sat',
          date: '23 Aug',
          shift: formData.currentShift,
          hours: '9h (1h Break)',
          status: 'Scheduled',
        },
        { day: 'Sun', date: '24 Aug', shift: 'Weekly Off', hours: '0h', status: 'Weekly Off' },
      ],
      attendance: initialData?.attendance || [
        {
          date: '18 Aug 2026',
          shift: `Shift (${formData.customShiftStartTime} – ${formData.customShiftEndTime})`,
          checkIn: '08:55 AM',
          checkOut: '—',
          totalHours: 'Active',
          overtime: '0h',
          status: 'Present',
        },
      ],
      targets: [
        {
          period: 'August 2026 (Current)',
          serviceTarget: Number(formData.monthlyServiceTarget),
          serviceAchieved: initialData?.targets?.[0]?.serviceAchieved || 0,
          retailTarget: Number(formData.monthlyRetailTarget),
          retailAchieved: initialData?.targets?.[0]?.retailAchieved || 0,
          achievementRate: 98,
          status: 'On Track',
        },
      ],
      commissions: initialData?.commissions || [
        {
          payPeriod: 'July 2026',
          servicesRevenue: 240000,
          serviceCommission: Math.round((240000 * formData.serviceCommissionRate) / 100),
          retailRevenue: 40000,
          retailCommission: Math.round((40000 * formData.retailCommissionRate) / 100),
          tipsReceived: 3500,
          totalPayout: Math.round(
            (240000 * formData.serviceCommissionRate) / 100 +
            (40000 * formData.retailCommissionRate) / 100 +
            3500,
          ),
          status: 'Paid',
        },
      ],
      performanceHistory: initialData?.performanceHistory || [
        {
          month: 'Aug 2026 (MTD)',
          revenue: 245000,
          servicesCount: 54,
          rebookingRate: 90,
          utilisation: 84,
          rating: 4.8,
        },
      ],
      compensation: {
        hourlyRate: Number(formData.hourlyRate),
        fixedSalary: Number(formData.fixedSalary),
        workingHoursPerDay: Number(formData.workingHoursPerDay),
        holidays: Number(formData.holidays),
        payrollSettings: formData.payrollSettings,
        serviceCommissionRate: Number(formData.serviceCommissionRate),
        retailCommissionRate: Number(formData.retailCommissionRate),
      },
    };

    onSave(completeStaffRecord);
    toast(
      mode === 'add'
        ? `Staff member ${fullName} (${completeStaffRecord.id}) onboarded successfully!`
        : `Staff profile for ${fullName} updated successfully!`,
    );
    onClose();
  };

  const sections = [
    { id: 'personal', label: 'Personal & Contact', icon: User, badge: 'Required' },
    { id: 'employment', label: 'Employment & Branch', icon: Building2, badge: 'Roster' },
    {
      id: 'skills',
      label: 'Skills & Services',
      icon: Award,
      badge: `${formData.skills.length} Skills`,
    },
    { id: 'targets', label: 'Targets & Commission', icon: Target, badge: 'Payroll' },
    { id: 'documents', label: 'Compliance & Documents', icon: FileText, badge: 'Verified' },
  ];

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] shadow-[0_30px_90px_rgba(90,46,166,0.28)] border border-purple-100/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 text-xs">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-purple-100/80 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <Avatar
              initials={initials}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-sm font-bold shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                  {mode === 'add'
                    ? 'Onboard New Staff Member'
                    : `Edit Staff Profile · ${formData.firstName || 'Staff'} ${formData.lastName}`}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold font-mono">
                  {formData.id}
                </span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-bold',
                    formData.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800',
                  )}
                >
                  {formData.status}
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                {mode === 'add'
                  ? 'Complete 360° staff profile creation: branch mapping, skills matrix, shift roster, target quotas, and compensation.'
                  : 'Update master credentials, service authorizations, employment hierarchy, and commission tiers.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 bg-[#FCFAFF] border-b border-purple-100/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as typeof activeSection)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap shrink-0',
                  isActive
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'bg-white text-soft hover:text-ink border border-purple-100/70 hover:bg-purple-50/50',
                )}
              >
                <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-white' : 'text-[#5A2EA6]')} />
                <span>{sec.label}</span>
                <span
                  className={cn(
                    'text-[9.5px] px-1.5 py-0.2 rounded-full font-medium',
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-100/60 text-[#5A2EA6]',
                  )}
                >
                  {sec.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto custom-scroll p-6 space-y-6"
        >
          {/* SECTION 1: PERSONAL & CONTACT */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Profile Photo Uploader & Employee Identity Card */}
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to upload/change photo"
                  >
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Staff Profile"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#5A2EA6] shadow-sm"
                      />
                    ) : (
                      <Avatar
                        initials={initials}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B4DFF] to-[#A970FF] text-white font-serif text-lg font-bold shadow-xs shrink-0"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-ink text-xs">Profile Picture &amp; Identity</h4>
                    <p className="text-[11px] text-muted">
                      Upload a high-resolution staff headshot for client booking apps, calendars,
                      and badges.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-8.5 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{formData.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                  </Button>
                  {formData.avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                      className="h-8.5 px-2.5 rounded-xl text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer bg-white shadow-2xs"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deshmukh"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as typeof formData.gender })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98260 12345"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Work Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="ananya.deshmukh@atelierluxury.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    <span>Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={toDateInputValue(formData.dob)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dob: toFriendlyDate(e.target.value) || e.target.value,
                      })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Residential Street Address
                </label>
                <input
                  type="text"
                  placeholder="B-402, Riviera Palms, Arera Colony, Bhopal, MP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* Emergency Contact Sub-card */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                    Emergency Contact Dossier
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[10.5px] font-bold text-amber-800 uppercase block mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Suresh Deshmukh"
                      value={formData.emergencyContactName}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyContactName: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-lg border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-amber-800 uppercase block mb-1">
                      Relationship
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Father / Spouse"
                      value={formData.emergencyContactRelation}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyContactRelation: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-lg border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-amber-800 uppercase block mb-1">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98260 99881"
                      value={formData.emergencyContactPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyContactPhone: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-lg border border-amber-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: EMPLOYMENT & BRANCH */}
          {activeSection === 'employment' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Employee Code / ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-mono font-bold text-[#5A2EA6] focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                    <span>Primary Branch Location</span>
                    {formData.roleCode === 'BRANCH_MANAGER' && (
                      <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </label>
                  <select
                    value={
                      formData.primaryBranchId ||
                      (availableBranches.find((b) => b.name === formData.branch)?.id || formData.branch)
                    }
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const brObj = availableBranches.find(
                        (b) => b.id === selectedVal || b.name === selectedVal,
                      );
                      setFormData({
                        ...formData,
                        branch: brObj?.name || selectedVal,
                        primaryBranchId: brObj?.id || selectedVal,
                      });
                    }}
                    className={cn(
                      'w-full h-10 px-3 rounded-xl border bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]',
                      formData.roleCode === 'BRANCH_MANAGER' && !formData.branch
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-purple-100',
                    )}
                  >
                    {availableBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.code ? `(${b.code})` : b.city ? `(${b.city})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Employment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as FullStaffRecord['status'],
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Active">Active (On Floor)</option>
                    <option value="On Leave">On Leave (Approved)</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive / Resigned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Assigned Role &amp; Access Level
                  </label>
                  <select
                    value={formData.roleCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const selected = roleOptions.find((r) => r.code === code);
                      setFormData({
                        ...formData,
                        roleCode: code,
                        role: selected?.name || code,
                      });
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <optgroup label="System Roles (Platform Predefined)">
                      {roleOptions
                        .filter((r) => r.isSystem)
                        .map((r) => (
                          <option key={r.code} value={r.code}>
                            {r.name} ({r.code})
                          </option>
                        ))}
                    </optgroup>
                    {roleOptions.some((r) => !r.isSystem) && (
                      <optgroup label="Custom Tenant Roles">
                        {roleOptions
                          .filter((r) => !r.isSystem)
                          .map((r) => (
                            <option key={r.code} value={r.code}>
                              {r.name} ({r.code})
                            </option>
                          ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Employment Contract Type
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentType: e.target.value as FullStaffRecord['employmentType'],
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Consultant">Consultant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    <span>Date of Joining</span>
                  </label>
                  <input
                    type="date"
                    value={toDateInputValue(formData.joiningDate)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        joiningDate: toFriendlyDate(e.target.value) || e.target.value,
                      })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Reporting Manager
                  </label>
                  <select
                    value={formData.reportingManager}
                    onChange={(e) => setFormData({ ...formData, reportingManager: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    {MANAGERS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch Manager Scoping Notice */}
              {formData.roleCode === 'BRANCH_MANAGER' && (
                <div className="p-3.5 rounded-2xl bg-[#FBF8FF] border border-[#5A2EA6]/25 text-xs text-ink flex items-start gap-2.5 animate-in fade-in duration-200">
                  <ShieldCheck className="w-5 h-5 text-[#5A2EA6] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#5A2EA6] font-bold block mb-0.5">
                      Branch Manager Authority &amp; Scoping
                    </strong>
                    <span className="text-muted text-[11px] leading-relaxed">
                      Assigning this role provisions a branch manager account scoped strictly to{' '}
                      <b>{formData.branch || 'the selected branch'}</b>. They will log in using their
                      work email and password to manage bookings, staff, cashier shifts, and local reports.
                    </span>
                  </div>
                </div>
              )}

              {/* Portal Login Credentials Sub-Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-white border border-purple-200/80 space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#5A2EA6]" />
                    <div>
                      <h4 className="font-bold text-[#5A2EA6] text-xs uppercase tracking-wider">
                        Portal Login &amp; Security Credentials
                      </h4>
                      <p className="text-[10px] text-muted">
                        Staff logs into the   portal using their Staff Email ID and Password
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.loginEnabled}
                      onChange={(e) => setFormData({ ...formData, loginEnabled: e.target.checked })}
                      className="rounded text-[#5A2EA6] focus:ring-[#5A2EA6] w-4 h-4"
                    />
                    <span className="text-xs font-bold text-ink">Enable Login</span>
                  </label>
                </div>

                {formData.loginEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-purple-100">
                    <div>
                      <label className="text-[10.5px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Staff Login Email
                      </label>
                      <input
                        type="email"
                        placeholder="staff@salon.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                      <span className="text-[9.5px] text-muted block mt-1">
                        Must match the staff work email. Used as primary login ID.
                      </span>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Initial Login Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 8 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5A2EA6] cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <span className="text-[9.5px] text-muted block mt-1">
                        Minimum 8 characters. Staff can change upon initial login.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Flex Shift Duration & Timing Selector */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#5A2EA6]" />
                    <h4 className="font-bold text-[#5A2EA6] text-xs uppercase tracking-wider">
                      Assigned Custom Flex Shift Roster
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-white px-2.5 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                    Custom Floor Roster
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Shift Start Time
                    </label>
                    <select
                      value={formData.customShiftStartTime}
                      onChange={(e) =>
                        setFormData({ ...formData, customShiftStartTime: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Shift End Time
                    </label>
                    <select
                      value={formData.customShiftEndTime}
                      onChange={(e) =>
                        setFormData({ ...formData, customShiftEndTime: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Break Start Time
                    </label>
                    <select
                      value={formData.customBreakStartTime}
                      onChange={(e) =>
                        setFormData({ ...formData, customBreakStartTime: e.target.value })
                      }
                      className="w-full h-9.5 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="None">No Break</option>
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Break End Time
                    </label>
                    <select
                      value={formData.customBreakEndTime}
                      onChange={(e) =>
                        setFormData({ ...formData, customBreakEndTime: e.target.value })
                      }
                      disabled={formData.customBreakStartTime === 'None'}
                      className={cn(
                        'w-full h-9.5 px-3 rounded-xl border border-purple-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]',
                        formData.customBreakStartTime === 'None' &&
                        'opacity-50 cursor-not-allowed bg-slate-50',
                      )}
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Summary bar */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-purple-900 bg-white/90 p-2.5 rounded-xl border border-purple-100">
                  <span className="font-semibold">
                    Effective Shift:{' '}
                    <strong className="text-[#5A2EA6]">
                      Shift ({formData.customShiftStartTime} – {formData.customShiftEndTime})
                    </strong>
                  </span>
                  <span className="text-[10px] font-medium text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-md">
                    Break Slot:{' '}
                    {formData.customBreakStartTime !== 'None'
                      ? `${formData.customBreakStartTime} – ${formData.customBreakEndTime}`
                      : 'No Break'}
                  </span>
                </div>
              </div>

              {/* Weekly Off Days Selection */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-700" />
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Weekly Off Days Configuration
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                    {formData.weeklyOffs.length} Off Days / Week
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].map((day) => {
                    const isSelected = formData.weeklyOffs.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              weeklyOffs: formData.weeklyOffs.filter((d) => d !== day),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              weeklyOffs: [...formData.weeklyOffs, day],
                            });
                          }
                        }}
                        className={cn(
                          'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                          isSelected
                            ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50',
                        )}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {day}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10.5px] text-muted">
                  Selected days will automatically be marked as "Weekly Off" in the monthly calendar
                  and roster.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: SKILLS & SERVICES */}
          {activeSection === 'skills' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Competency / Experience Tier
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as FullStaffRecord['level'],
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Junior">Junior Specialist</option>
                    <option value="Intermediate">Intermediate Stylist</option>
                    <option value="Senior">Senior Master Specialist</option>
                    <option value="Expert">Expert / Creative Director</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Primary Certification / Degree
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CIDESCO Gold Diploma, Dermalogica Pro"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              {/* Certified Skills Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Certified Technical Skills ({formData.skills.length} Selected)
                  </label>
                  <span className="text-[10.5px] text-muted">
                    Click tags to toggle skill mapping
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7FF] border border-purple-100 flex flex-wrap gap-1.5">
                  {PRESET_SKILLS.map((sk) => {
                    const isSelected = formData.skills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
                          isSelected
                            ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                            : 'bg-white text-soft border-purple-200/80 hover:border-[#5A2EA6] hover:text-[#5A2EA6]',
                        )}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sk}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom specialized skill..."
                    value={formData.newSkillInput}
                    onChange={(e) => setFormData({ ...formData, newSkillInput: e.target.value })}
                    className="flex-1 h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomSkill}
                    className="h-9 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
                  </Button>
                </div>
              </div>

              {/* Assigned Services */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                    Authorized Catalogue Services ({formData.assignedServices.length} Selected)
                  </label>
                  <span className="text-[10.5px] text-muted">
                    Services staff is permitted to execute
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAF7FF] border border-purple-100 flex flex-wrap gap-1.5">
                  {PRESET_SERVICES.map((srv) => {
                    const isSelected = formData.assignedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => handleToggleService(srv)}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-soft border-purple-200/80 hover:border-emerald-600 hover:text-emerald-700',
                        )}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {srv}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom treatment protocol..."
                    value={formData.newServiceInput}
                    onChange={(e) => setFormData({ ...formData, newServiceInput: e.target.value })}
                    className="flex-1 h-9 px-3 rounded-xl border border-purple-100 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomService}
                    className="h-9 px-3 rounded-xl text-xs font-bold border-emerald-600/30 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Service
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TARGETS, COMPENSATION & PAYROLL */}
          {activeSection === 'targets' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900 text-xs">
                    Salary, Compensation &amp; Payroll Settings
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Configure fixed salary, hourly rate, shift hours, holiday allowance, targets
                    &amp; commission rules.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-200 shadow-2xs">
                  Automated Payroll Engine
                </span>
              </div>

              {/* 4 Core Compensation & Attendance Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Hourly Rate"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Fixed Salary (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Fixed Salary"
                    value={formData.fixedSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, fixedSalary: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Working Hours/Day
                  </label>
                  <input
                    type="number"
                    placeholder="Working Hours/Day"
                    value={formData.workingHoursPerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, workingHoursPerDay: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Holidays (Days/Yr)
                  </label>
                  <input
                    type="number"
                    placeholder="Holidays"
                    value={formData.holidays}
                    onChange={(e) => setFormData({ ...formData, holidays: Number(e.target.value) })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              {/* Payroll Calculation Setting Box */}
              <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-3">
                <h4 className="font-serif text-[14px] font-bold text-ink tracking-tight">
                  Payroll Calculation Setting
                </h4>
                <div className="flex items-center gap-8 flex-wrap">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.payrollSettings.fixed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payrollSettings: { ...formData.payrollSettings, fixed: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-ink">Fixed</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.payrollSettings.hourly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payrollSettings: {
                            ...formData.payrollSettings,
                            hourly: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-ink">Hourly</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.payrollSettings.commission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payrollSettings: {
                            ...formData.payrollSettings,
                            commission: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded border-purple-300 text-[#5A2EA6] focus:ring-[#5A2EA6] cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-ink">Commission</span>
                  </label>
                </div>
              </div>

              {/* Revenue Targets & Commission Quotas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Monthly Service Quota Target (₹)
                  </span>
                  <input
                    type="number"
                    value={formData.monthlyServiceTarget}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyServiceTarget: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold font-serif text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <span className="text-[10px] text-soft block">
                    Benchmark: ₹2,50,000 / month across treatment suites
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Monthly Retail Sales Quota (₹)
                  </span>
                  <input
                    type="number"
                    value={formData.monthlyRetailTarget}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyRetailTarget: Number(e.target.value) })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold font-serif text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                  <span className="text-[10px] text-soft block">
                    Benchmark: ₹50,000 / month in retail product attach
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Service Revenue Commission Rate (%)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.serviceCommissionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceCommissionRate: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                    <span className="text-xs font-bold text-[#5A2EA6] shrink-0">% Rate</span>
                  </div>
                  <span className="text-[10px] text-soft block">
                    Standard tier for treatments: 10% – 15%
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100 space-y-2">
                  <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Retail Products Commission Rate (%)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.retailCommissionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, retailCommissionRate: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                    <span className="text-xs font-bold text-[#5A2EA6] shrink-0">% Rate</span>
                  </div>
                  <span className="text-[10px] text-soft block">
                    Standard tier for retail attach: 15% – 20%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: COMPLIANCE & DOCUMENTS */}
          {activeSection === 'documents' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Government ID Document Type
                  </label>
                  <select
                    value={formData.idProofType}
                    onChange={(e) => setFormData({ ...formData, idProofType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Aadhaar Identity Card">Aadhaar Identity Card</option>
                    <option value="Passport">International Passport</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Voter ID Card">Voter ID Card</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    ID Reference / Document Number
                  </label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-8921"
                    value={formData.idProofRef}
                    onChange={(e) => setFormData({ ...formData, idProofRef: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Professional Certification Name
                  </label>
                  <input
                    type="text"
                    placeholder="CIDESCO Gold Diploma"
                    value={formData.certificationName}
                    onChange={(e) =>
                      setFormData({ ...formData, certificationName: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Certificate Ref Number
                  </label>
                  <input
                    type="text"
                    placeholder="CID-2024-5510"
                    value={formData.certificationRef}
                    onChange={(e) => setFormData({ ...formData, certificationRef: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Certification Validity
                  </label>
                  <input
                    type="text"
                    placeholder="Permanent / 2028"
                    value={formData.certificationExpiry}
                    onChange={(e) =>
                      setFormData({ ...formData, certificationExpiry: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Employment Contract Agreement Ref
                  </label>
                  <input
                    type="text"
                    placeholder="AGR-2024-1082"
                    value={formData.contractRef}
                    onChange={(e) => setFormData({ ...formData, contractRef: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-mono font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#5A2EA6]" />
                    <span>Contract Renewal / Expiry Date</span>
                  </label>
                  <input
                    type="date"
                    value={toDateInputValue(formData.contractExpiry)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contractExpiry: toFriendlyDate(e.target.value) || e.target.value,
                      })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Summary Pill Bar */}
          <div className="p-3.5 rounded-2xl bg-[#FCFAFF] border border-purple-100/70 flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#5A2EA6]">{formData.role}</span>
              <span className="text-muted">·</span>
              <span className="text-soft">{formData.branch}</span>
              <span className="text-muted">·</span>
              <span className="text-emerald-700 font-bold">{formData.level}</span>
            </div>
            <div className="text-muted font-medium">
              {formData.skills.length} skills · ₹
              {formData.monthlyServiceTarget.toLocaleString('en-IN')} target
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-3 border-t border-purple-100/70 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeSection !== 'personal' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = sections.findIndex((s) => s.id === activeSection);
                    if (idx > 0) setActiveSection(sections[idx - 1].id as typeof activeSection);
                  }}
                  className="h-10 px-4 rounded-xl text-xs font-semibold text-[#5A2EA6] hover:bg-purple-50 transition-colors border border-purple-200 bg-white cursor-pointer"
                >
                  Previous Step
                </button>
              )}

              {activeSection !== 'documents' ? (
                <button
                  type="button"
                  onClick={() => {
                    const idx = sections.findIndex((s) => s.id === activeSection);
                    if (idx < sections.length - 1)
                      setActiveSection(sections[idx + 1].id as typeof activeSection);
                  }}
                  className="h-10 px-5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-xs transition-all cursor-pointer border-0"
                >
                  Next Step:{' '}
                  {sections[sections.findIndex((s) => s.id === activeSection) + 1]?.label}
                </button>
              ) : null}

              <Button
                type="submit"
                className="h-10 px-6 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all"
              >
                {mode === 'add' ? 'Onboard Staff Specialist' : 'Save Profile Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default StaffFormModal;
