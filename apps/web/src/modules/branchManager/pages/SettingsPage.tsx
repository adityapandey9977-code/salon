import { DialogModal } from '@/shared/components/DialogModal';
import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Layers,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Printer,
  Receipt,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Store,
  Trash2,
  Upload,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { useBranch } from '../context/BranchContext';
import {
  useComplianceStore,
  ComplianceRequirement,
  ComplianceDocumentSubmission,
} from '@/shared/compliance/complianceStore';


/* -------------------------------------------------------------------------- */
/* Data Interfaces                                                            */
/* -------------------------------------------------------------------------- */

export interface StationItem {
  id: string;
  name: string;
  type: 'Styling Chair' | 'Facial Cabin' | 'Spa Room' | 'Hair Wash Station';
  assignedStylist?: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface BranchAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetModule: 'Discounts' | 'Cashier' | 'Inventory' | 'Staff' | 'Appointments' | 'Security';
  ipAddress: string;
  details: string;
  beforeValue?: string;
  afterValue?: string;
}

export const initialBranchAuditLogs: BranchAuditLog[] = [
  {
    id: 'LOG-88491',
    timestamp: '2026-08-31 14:45:10',
    actor: 'Priya Sharma',
    actorRole: 'Branch Manager',
    action: 'DISCOUNT_OVERRIDE_APPROVED',
    targetModule: 'Discounts',
    ipAddress: '192.168.10.45',
    details: 'Approved 20% promotional discount on Invoice #INV-9902 for VIP regular client.',
    beforeValue: 'Invoice Amount: ₹6,400 (0% discount)',
    afterValue: 'Invoice Amount: ₹5,120 (20% discount approved)',
  },
  {
    id: 'LOG-88490',
    timestamp: '2026-08-31 13:30:15',
    actor: 'Deepak Verma',
    actorRole: 'Cashier / Front Desk',
    action: 'CASHIER_FLOAT_RECONCILED',
    targetModule: 'Cashier',
    ipAddress: '192.168.10.12',
    details:
      'Shift #01 cash drawer physical count ₹16,850 matched expected float with ₹0.00 zero variance.',
    beforeValue: 'Expected: ₹16,850',
    afterValue: 'Counted: ₹16,850 (Zero Discrepancy Match)',
  },
  {
    id: 'LOG-88489',
    timestamp: '2026-08-31 12:15:20',
    actor: 'Priya Sharma',
    actorRole: 'Branch Manager',
    action: 'STAFF_PUNCH_OVERRIDE',
    targetModule: 'Staff',
    ipAddress: '192.168.10.45',
    details:
      'Manual biometric check-in adjusted for Rohit Verma (biometric terminal optical timeout).',
    beforeValue: 'Check-in: Unregistered (09:00 AM)',
    afterValue: 'Check-in: 09:05 AM (Manager Sign-off)',
  },
  {
    id: 'LOG-88488',
    timestamp: '2026-08-31 11:40:00',
    actor: 'Ananya Deshmukh',
    actorRole: 'Senior Aesthetician',
    action: 'CONSUMABLE_DISPENSARY_LOGGED',
    targetModule: 'Inventory',
    ipAddress: '192.168.10.22',
    details:
      '1x Medical Hydra-Facial Pod (LOT-O3-8812) dispensed from dispensary for client treatment #APT-8821.',
    beforeValue: 'Dispensary Stock: 14 units',
    afterValue: 'Dispensary Stock: 13 units',
  },
  {
    id: 'LOG-88487',
    timestamp: '2026-08-31 10:20:18',
    actor: 'Kavita Iyer',
    actorRole: 'Receptionist',
    action: 'APPOINTMENT_CANCELLED_LATE',
    targetModule: 'Appointments',
    ipAddress: '192.168.10.14',
    details:
      'Appointment #APT-8804 for Neha Kapoor cancelled within 2hr window; cancellation penalty waived per VIP policy.',
    beforeValue: 'Status: Confirmed',
    afterValue: 'Status: Cancelled (Penalty Waived)',
  },
  {
    id: 'LOG-88486',
    timestamp: '2026-08-31 09:00:00',
    actor: 'Priya Sharma',
    actorRole: 'Branch Manager',
    action: 'SECURITY_LOGIN_SUCCESS',
    targetModule: 'Security',
    ipAddress: '192.168.10.45',
    details: 'Branch Manager authenticated from Station #01 POS terminal (Indrapuri Flagship).',
    beforeValue: 'Session: Inactive',
    afterValue: 'Session: Active (2FA OTP Verified)',
  },
  {
    id: 'LOG-88485',
    timestamp: '2026-08-30 19:45:00',
    actor: 'Priya Sharma',
    actorRole: 'Branch Manager',
    action: 'EOD_LEDGER_LOCKED',
    targetModule: 'Cashier',
    ipAddress: '192.168.10.45',
    details:
      'Daily operations & cashier day-end ledger closed and cryptographically locked for Aug 30.',
    beforeValue: 'Ledger State: Open / Draft',
    afterValue: 'Ledger State: Audited & Immutable Locked',
  },
  {
    id: 'LOG-88484',
    timestamp: '2026-08-30 16:30:10',
    actor: 'Deepak Verma',
    actorRole: 'Cashier / Front Desk',
    action: 'INVOICE_LINE_ITEM_VOIDED',
    targetModule: 'Discounts',
    ipAddress: '192.168.10.12',
    details:
      'Mistakenly scanned Moroccan Oil 100ml removed from bill draft before checkout completion.',
    beforeValue: 'Bill Items: 3 (₹5,400)',
    afterValue: 'Bill Items: 2 (₹3,550)',
  },
];

export interface SettingsPageProps {
  defaultTab?: 'profile' | 'shifts' | 'layout' | 'notifications' | 'policy' | 'security' | 'audit' | 'compliance';
}

export function SettingsPage({ defaultTab = 'profile' }: SettingsPageProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = searchParams.get('tab') as SettingsPageProps['defaultTab'];

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState<
    'profile' | 'shifts' | 'layout' | 'notifications' | 'policy' | 'security' | 'audit' | 'compliance'
  >(tabFromQuery || defaultTab);

  // Compliance Store Integration for Branch Manager
  const { activeRequirements, submissions, addOrUpdateSubmission } = useComplianceStore();
  const [branchUploadModalReq, setBranchUploadModalReq] = useState<ComplianceRequirement | null>(null);
  const [branchViewModalSub, setBranchViewModalSub] = useState<ComplianceDocumentSubmission | null>(null);
  const [bUploadDocRef, setBUploadDocRef] = useState('');
  const [bUploadAgency, setBUploadAgency] = useState('');
  const [bUploadIssueDate, setBUploadIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [bUploadExpiryDate, setBUploadExpiryDate] = useState('2027-03-31');
  const [bUploadFileName, setBUploadFileName] = useState('Clearance_Certificate.pdf');
  const [bUploadNotes, setBUploadNotes] = useState('');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<BranchAuditLog[]>(initialBranchAuditLogs);
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('All');
  const [selectedAuditLog, setSelectedAuditLog] = useState<BranchAuditLog | null>(null);

  // Security & Reset Password State (SALO-PR-121)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');

  const { assignedBranch } = useBranch();

  // Branch Profile & Timings State
  const [branchName, setBranchName] = useState('Atelier Salon & Spa');
  const [branchCity, setBranchCity] = useState('Atelier Indrapuri · Flagship Branch · Bhopal');
  const [address, setAddress] = useState(
    'Plot 42, Sector B, Main Commercial Belt, Indrapuri, Bhopal, MP - 462022',
  );
  const [contactPhone, setContactPhone] = useState('+91 755 4892011');
  const [contactEmail, setEmail] = useState('bhopal.indrapuri@ateliersalon.com');
  const [gstin, setGstin] = useState('23AAAAA0000A1Z5');
  const [openHour, setOpenHour] = useState('09:00 AM');
  const [closeHour, setCloseHour] = useState('08:00 PM');
  const [weeklyOffDay, setWeeklyOffDay] = useState('Monday');

  useEffect(() => {
    if (assignedBranch) {
      setBranchName(assignedBranch.name);
      setBranchCity(`${assignedBranch.name} · ${assignedBranch.type || 'Flagship Branch'} · ${assignedBranch.city}`);
      setAddress(assignedBranch.address || `${assignedBranch.city} Main Location`);
      setContactPhone(assignedBranch.phone || '+91 98765 43210');
      setEmail(assignedBranch.email || 'manager@salon.com');
      if (assignedBranch.workingHours) {
        const parts = assignedBranch.workingHours.split('-');
        if (parts.length === 2) {
          setOpenHour(parts[0].trim());
          setCloseHour(parts[1].trim());
        }
      }
    }
  }, [assignedBranch]);

  // Shift Configuration State (SALO-PR-066)
  const [morningShiftEnabled, setMorningShiftEnabled] = useState(true);
  const [morningShiftTiming, setMorningShiftTiming] = useState('09:00 AM - 04:00 PM');
  const [eveningShiftEnabled, setEveningShiftEnabled] = useState(true);
  const [eveningShiftTiming, setEveningShiftTiming] = useState('04:00 PM - 08:00 PM');
  const [fullDayShiftEnabled, setFullDayShiftEnabled] = useState(true);
  const [fullDayShiftTiming, setFullDayShiftTiming] = useState('09:00 AM - 08:00 PM');
  const [lunchBufferMins, setLunchBufferMins] = useState(45);
  const [requireManagerShiftSwapApproval, setRequireManagerShiftSwapApproval] = useState(true);

  // Station & Layout State (SALO-PR-006)
  const [stations, setStations] = useState<StationItem[]>([
    { id: 'STN-01', name: 'Chair 01 (Bridal Styling)', type: 'Styling Chair', status: 'Active' },
    {
      id: 'STN-02',
      name: 'Chair 02 (Chemical & Hair Color)',
      type: 'Styling Chair',
      status: 'Active',
    },
    {
      id: 'STN-03',
      name: 'Chair 03 (Men Haircut & Beard)',
      type: 'Styling Chair',
      status: 'Active',
    },
    { id: 'STN-04', name: 'Chair 04 (Blowdry & Express)', type: 'Styling Chair', status: 'Active' },
    {
      id: 'STN-05',
      name: 'Chair 05 (Hair Care & Wash)',
      type: 'Hair Wash Station',
      status: 'Active',
    },
    { id: 'STN-06', name: 'Chair 06 (Nail Art Bar)', type: 'Styling Chair', status: 'Active' },
    {
      id: 'STN-07',
      name: 'Cabin 01 (Facial & Skin Suite)',
      type: 'Facial Cabin',
      status: 'Active',
    },
    { id: 'STN-08', name: 'Cabin 02 (Aromatherapy Spa Bed)', type: 'Spa Room', status: 'Active' },
  ]);
  const [isAddStationOpen, setIsAddStationOpen] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationType, setNewStationType] = useState<StationItem['type']>('Styling Chair');

  // Communication & Notification Preferences State (SALO-PR-088)
  const [whatsappNotify, setWhatsappNotify] = useState(true);
  const [emailInvoices, setEmailInvoices] = useState(true);
  const [dltQuietHours, setDltQuietHours] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  // Policy & POS State (SALO-PR-007, SALO-PR-107)
  const [defaultTaxPolicy, setDefaultTaxPolicy] = useState('18% GST (CGST 9% + SGST 9%)');
  const [maxDiscountLimit, setMaxDiscountLimit] = useState(15);
  const [posPrinterType, setPosPrinterType] = useState('80mm Thermal POS Printer');
  const [lastEditedTimestamp, setLastEditedTimestamp] = useState('Aug 31, 2026 at 09:15 AM');

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = auditSearchQuery.toLowerCase();
      const matchesSearch =
        log.id.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ipAddress.includes(q);

      const matchesModule = auditModuleFilter === 'All' || log.targetModule === auditModuleFilter;
      return matchesSearch && matchesModule;
    });
  }, [auditLogs, auditSearchQuery, auditModuleFilter]);

  const handleExportAuditCsv = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Actor',
      'Role',
      'Target Module',
      'Action Code',
      'IP Address',
      'Details',
    ];
    const rows = filteredAuditLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      l.targetModule,
      l.action,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Branch_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('✅ Branch Audit Trail exported to CSV successfully.');
  };

  // Handlers
  const handleTabSelect = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const nowStr = new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastEditedTimestamp(nowStr);
    toast('✅ Branch configuration settings saved successfully! 💾');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      toast('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('New password and confirmation do not match.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast('🔒 Branch Manager security password updated successfully!');
  };

  const handleToggleStationStatus = (id: string) => {
    setStations((prev) =>
      prev.map((st) => {
        if (st.id === id) {
          const nextStatus = st.status === 'Active' ? 'Maintenance' : 'Active';
          toast(`Updated ${st.name} status to ${nextStatus}.`);
          return { ...st, status: nextStatus };
        }
        return st;
      }),
    );
  };

  const handleDeleteStation = (id: string, name: string) => {
    if (confirm(`Remove station "${name}" from store layout?`)) {
      setStations((prev) => prev.filter((st) => st.id !== id));
      toast(`Deleted station: ${name}.`);
    }
  };

  const handleAddStationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName.trim()) {
      toast('Please enter the station name.');
      return;
    }
    const newSt: StationItem = {
      id: `STN-${Math.floor(10 + Math.random() * 90)}`,
      name: newStationName,
      type: newStationType,
      status: 'Active',
    };
    setStations([...stations, newSt]);
    setIsAddStationOpen(false);
    setNewStationName('');
    toast(`Added new station "${newSt.name}" to store layout!`);
  };

  const moduleColorBadge = (mod: BranchAuditLog['targetModule']) => {
    switch (mod) {
      case 'Discounts':
        return 'bg-amber-100 text-amber-800 border-amber-300/60';
      case 'Cashier':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300/60';
      case 'Staff':
        return 'bg-purple-100 text-[#5A2EA6] border-purple-300/60';
      case 'Inventory':
        return 'bg-blue-100 text-blue-800 border-blue-300/60';
      case 'Appointments':
        return 'bg-teal-100 text-teal-800 border-teal-300/60';
      case 'Security':
        return 'bg-rose-100 text-rose-800 border-rose-300/60';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300/60';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Branch Settings &amp; Store Parameters
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Configure store operating hours, shift calendars, station capacities, communication
            channels, POS tax policies, and inspect local audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'audit' ? (
            <Button
              onClick={handleExportAuditCsv}
              variant="outline"
              className="h-[40px] px-3.5 rounded-xl text-xs font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#5A2EA6]" />
              <span>Export Audit CSV</span>
            </Button>
          ) : (
            <Button
              onClick={() => toast('Printing store configuration dossier... 📋')}
              variant="outline"
              className="h-[40px] px-3.5 rounded-xl text-xs font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#5A2EA6]" />
              <span>Print Audit Summary</span>
            </Button>
          )}

          {activeTab !== 'audit' && (
            <Button
              onClick={handleSaveSettings}
              className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="premium-branch-card rounded-[24px] overflow-hidden bg-white p-3.5 shadow-xs">
            <div className="space-y-1">
              {[
                { id: 'profile', label: 'Branch Profile & Timings', icon: Building2 },
                { id: 'shifts', label: 'Shift Calendars & Roster', icon: Clock },
                { id: 'layout', label: 'Stations & Layout Models', icon: LayoutGrid },
                { id: 'notifications', label: 'Communication Preferences', icon: Bell },
                { id: 'policy', label: 'POS Tax & Discount Policies', icon: Receipt },
                { id: 'compliance', label: 'Outlet Statutory & Compliance', icon: FileCheck },
                { id: 'security', label: 'Security & Reset Password', icon: ShieldCheck },
                { id: 'audit', label: 'Branch Audit Logs', icon: History },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id as any)}
                    className={cn(
                      'w-full text-left border-0 p-3.5 rounded-xl text-[12px] font-bold cursor-pointer transition-all flex items-center gap-2.5',
                      activeTab === item.id
                        ? 'bg-[#5A2EA6] text-white shadow-xs'
                        : 'bg-transparent text-soft hover:bg-[#F8F5FF] hover:text-ink',
                    )}
                  >
                    <IconComponent
                      className={cn(
                        'w-4 h-4',
                        activeTab === item.id ? 'text-white' : 'text-[#5A2EA6]',
                      )}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-3 bg-[#F8F5FF] border border-[#5A2EA6]/10 rounded-xl text-[11px] text-soft">
              <span className="font-bold text-ink block mb-0.5">Last Modification Audit</span>
              <span>
                Updated by <strong className="text-ink">Priya Sharma</strong> on{' '}
                {lastEditedTimestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Right Details Form Panel */}
        <div className="lg:col-span-3">
          <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between shadow-sm">
            <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10 w-full flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                    {activeTab === 'profile' && 'Branch Operations & Timings Profile'}
                    {activeTab === 'shifts' && 'Shift Frameworks & Rotation Policy'}
                    {activeTab === 'layout' && 'Capacity & Station Layout Models'}
                    {activeTab === 'notifications' && 'Client Communication & Alert Preferences'}
                    {activeTab === 'policy' && 'POS Tax Defaults & Discount Approvals'}
                    {activeTab === 'compliance' && 'Outlet Statutory & Compliance Clearances'}
                    {activeTab === 'security' && 'Security Credentials & Reset Password'}
                    {activeTab === 'audit' && 'Branch Activity & Operational Audit Trail'}
                  </h3>
                  <p className="text-[10px] text-white/80 mt-0.5">
                    {activeTab === 'profile' &&
                      'Store address, GSTIN, opening/closing hours, and weekly calendar parameters'}
                    {activeTab === 'shifts' &&
                      'Manage operational shifts, lunch buffers, and shift swap rules'}
                    {activeTab === 'layout' &&
                      'Manage active styling chairs, facial cabins, and spa beds'}
                    {activeTab === 'notifications' &&
                      'WhatsApp confirmations, email receipts, and DLT quiet hours'}
                    {activeTab === 'policy' &&
                      'Configure tax rates, front desk discount limits, and thermal printer'}
                    {activeTab === 'compliance' &&
                      'Upload and track store municipal trade licenses, Fire NOC certificates, autoclave maintenance, and staff health cards'}
                    {activeTab === 'security' &&
                      'Update manager password, configure 2FA authentication, and session timeouts'}
                    {activeTab === 'audit' &&
                      'Immutable operational log of discounts, cashier floats, inventory adjustments, and shift overrides'}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                  {assignedBranch ? `${assignedBranch.name} · ${assignedBranch.city}` : 'Branch Settings'}
                </span>
              </div>
            </div>

            <div className="p-6 bg-white flex-1 text-[12px]">
              {/* ── TAB 7: BRANCH AUDIT LOGS ── */}
              {activeTab === 'audit' ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#FAF8FF] border border-[#5A2EA6]/15 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-muted block">
                         Total Logged Events
                      </span>
                      <strong className="text-lg font-bold text-ink block mt-0.5">
                        {auditLogs.length} Records
                      </strong>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                        100% Immutable
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF8FF] border border-[#5A2EA6]/15 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-amber-700 block">
                        Manager Overrides
                      </span>
                      <strong className="text-lg font-bold text-ink block mt-0.5">3 Actions</strong>
                      <span className="text-[10px] text-muted font-semibold mt-0.5 block">
                        Discounts &amp; Punches
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF8FF] border border-[#5A2EA6]/15 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                        Cashier Verifications
                      </span>
                      <strong className="text-lg font-bold text-emerald-800 block mt-0.5">
                        2 Closures
                      </strong>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                        Zero Discrepancy
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAF8FF] border border-[#5A2EA6]/15 rounded-xl">
                      <span className="text-[10px] uppercase font-bold text-[#5A2EA6] block">
                        Branch Scope
                      </span>
                      <strong className="text-sm font-bold text-ink block mt-0.5">
                        {assignedBranch?.name || 'Assigned Branch'}
                      </strong>
                      <span className="text-[10px] text-muted font-semibold mt-0.5 block">
                        Local Subnet Filtered
                      </span>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#FCFAFF] p-3 rounded-xl border border-purple-100">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search logs by action, actor, IP..."
                        value={auditSearchQuery}
                        onChange={(e) => setAuditSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 bg-white border border-[#5A2EA6]/20 rounded-lg text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                      <div className="flex items-center gap-1 text-xs">
                        <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        <span className="text-muted font-semibold">Module:</span>
                        <select
                          value={auditModuleFilter}
                          onChange={(e) => setAuditModuleFilter(e.target.value)}
                          className="h-8 px-2 rounded-lg bg-white border border-[#5A2EA6]/20 text-xs font-bold text-ink outline-none"
                        >
                          <option value="All">All Modules</option>
                          <option value="Discounts">Discounts &amp; POS</option>
                          <option value="Cashier">Cashier &amp; Float</option>
                          <option value="Staff">Staff &amp; Punches</option>
                          <option value="Inventory">Inventory &amp; Usage</option>
                          <option value="Appointments">Appointments &amp; Queue</option>
                          <option value="Security">Security &amp; Auth</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Audit Logs Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#5A2EA6]/10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                        <tr>
                          <th className="p-3 font-bold text-[9.5px] uppercase tracking-wider pl-4">
                            Timestamp &amp; ID
                          </th>
                          <th className="p-3 font-bold text-[9.5px] uppercase tracking-wider">
                            Actor &amp; Role
                          </th>
                          <th className="p-3 font-bold text-[9.5px] uppercase tracking-wider">
                            Module
                          </th>
                          <th className="p-3 font-bold text-[9.5px] uppercase tracking-wider">
                            Action Event
                          </th>
                          <th className="p-3 font-bold text-[9.5px] uppercase tracking-wider">
                            Summary Details
                          </th>
                          <th className="p-3 font-bold text-[9.5px] uppercase tracking-wider pr-4 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                        {filteredAuditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                            <td className="p-3 pl-4">
                              <strong className="text-ink font-mono text-[11px] block">
                                {log.id}
                              </strong>
                              <span className="text-[10px] text-muted">{log.timestamp}</span>
                            </td>
                            <td className="p-3">
                              <strong className="text-ink text-xs block font-bold">
                                {log.actor}
                              </strong>
                              <span className="text-[10px] text-soft">{log.actorRole}</span>
                            </td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-md text-[10px] font-bold border',
                                  moduleColorBadge(log.targetModule),
                                )}
                              >
                                {log.targetModule}
                              </span>
                            </td>
                            <td className="p-3">
                              <code className="text-[10.5px] font-mono font-bold text-ink bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {log.action}
                              </code>
                              <span className="text-[10px] text-muted block mt-0.5 font-mono">
                                {log.ipAddress}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs">
                              <p
                                className="text-xs text-ink font-medium leading-relaxed truncate"
                                title={log.details}
                              >
                                {log.details}
                              </p>
                            </td>
                            <td className="p-3 pr-4 text-right">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedAuditLog(log)}
                                className="h-7 px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10"
                              >
                                <Eye className="w-3 h-3 mr-1" /> Inspect
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* ── TAB 1: BRANCH PROFILE & TIMINGS ── */}
                  {activeTab === 'profile' && (
                    <div className="space-y-5">
                      {/* Basic Store Info */}
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Building2 className="w-4 h-4" /> Store Information &amp; Tax Identifier
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Store / Salon Name
                            </label>
                            <input
                              type="text"
                              value={branchName}
                              onChange={(e) => setBranchName(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12.5px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Outlet Code &amp; City
                            </label>
                            <input
                              type="text"
                              value={branchCity}
                              disabled
                              className="w-full bg-slate-50 border border-line rounded-xl p-2.5 text-[12.5px] font-bold text-soft outline-none cursor-not-allowed"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Physical Postal Address
                            </label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Official Contact Phone
                            </label>
                            <input
                              type="text"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Branch Notification Email
                            </label>
                            <input
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              GSTIN Number (State Invoicing)
                            </label>
                            <input
                              type="text"
                              value={gstin}
                              onChange={(e) => setGstin(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-mono font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Timings & Calendar */}
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Clock className="w-4 h-4" /> Operational Hours &amp; Weekly Off
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Store Opening Time
                            </label>
                            <input
                              type="text"
                              value={openHour}
                              onChange={(e) => setOpenHour(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Store Closing Time
                            </label>
                            <input
                              type="text"
                              value={closeHour}
                              onChange={(e) => setCloseHour(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Weekly Off / Deep Cleaning Day
                            </label>
                            <select
                              value={weeklyOffDay}
                              onChange={(e) => setWeeklyOffDay(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                            >
                              <option value="Monday">Monday (Standard)</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="None">None (Open 7 Days)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 2: SHIFTS & ROSTER ── */}
                  {activeTab === 'shifts' && (
                    <div className="space-y-5">
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Clock className="w-4 h-4" /> Shift Rotation Frameworks
                        </h4>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                Morning Shift Framework
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Timing: {morningShiftTiming}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={morningShiftEnabled}
                              onChange={(e) => setMorningShiftEnabled(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                Evening Shift Framework
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Timing: {eveningShiftTiming}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={eveningShiftEnabled}
                              onChange={(e) => setEveningShiftEnabled(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                Full Day Shift Framework
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Timing: {fullDayShiftTiming}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={fullDayShiftEnabled}
                              onChange={(e) => setFullDayShiftEnabled(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Sliders className="w-4 h-4" /> Shift Buffer &amp; Swap Policy
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Standard Lunch Break Slot (Minutes)
                            </label>
                            <input
                              type="number"
                              value={lunchBufferMins}
                              onChange={(e) => setLunchBufferMins(Number(e.target.value))}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-4">
                            <input
                              type="checkbox"
                              id="requireSwap"
                              checked={requireManagerShiftSwapApproval}
                              onChange={(e) => setRequireManagerShiftSwapApproval(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                            <label
                              htmlFor="requireSwap"
                              className="text-xs font-bold text-ink cursor-pointer"
                            >
                              Require Branch Manager approval for peer shift swaps
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 3: STATIONS & LAYOUT ── */}
                  {activeTab === 'layout' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5">
                            <LayoutGrid className="w-4 h-4" /> Active Store Stations &amp; Cabins (
                            {stations.length})
                          </h4>
                          <span className="text-soft text-[11px]">
                            Map treatment rooms and chairs for appointment bookings.
                          </span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => setIsAddStationOpen(true)}
                          className="h-8 px-3 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Station</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {stations.map((st) => (
                          <div
                            key={st.id}
                            className="p-3.5 bg-[#FCFAFF] border border-purple-100 rounded-2xl flex flex-col justify-between space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <strong className="block text-ink text-xs font-bold">
                                  {st.name}
                                </strong>
                                <span className="text-[10px] text-muted">
                                  {st.type} · {st.id}
                                </span>
                              </div>
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-[9px] font-bold border',
                                  st.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300',
                                )}
                              >
                                {st.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-purple-50">
                              <button
                                type="button"
                                onClick={() => handleToggleStationStatus(st.id)}
                                className="text-[10px] font-bold text-[#5A2EA6] hover:underline bg-transparent border-0 cursor-pointer p-0"
                              >
                                Toggle Maintenance
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStation(st.id, st.name)}
                                className="text-[10px] font-bold text-rose-600 hover:underline bg-transparent border-0 cursor-pointer p-0"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 4: NOTIFICATIONS ── */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-4">
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-3">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Bell className="w-4 h-4" /> Guest Communication Channels
                        </h4>

                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between p-3 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                WhatsApp Booking Confirmations &amp; Reminders
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Send real-time appointment tokens and 2-hour reminder alerts.
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={whatsappNotify}
                              onChange={(e) => setWhatsappNotify(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                Email Digital Invoices &amp; Receipts
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Auto-dispatch PDF receipts upon cashier invoice checkout.
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={emailInvoices}
                              onChange={(e) => setEmailInvoices(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                TRAI / DLT Quiet Hours (09:00 PM – 09:00 AM)
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Block automated promotional broadcasts during statutory quiet hours.
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={dltQuietHours}
                              onChange={(e) => setDltQuietHours(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 5: POLICY & POS ── */}
                  {activeTab === 'policy' && (
                    <div className="space-y-4">
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Receipt className="w-4 h-4" /> POS Tax &amp; Discount Governance
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Default GST Rate Policy
                            </label>
                            <input
                              type="text"
                              value={defaultTaxPolicy}
                              onChange={(e) => setDefaultTaxPolicy(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Max Front-Desk Discount Cap (%)
                            </label>
                            <input
                              type="number"
                              value={maxDiscountLimit}
                              onChange={(e) => setMaxDiscountLimit(Number(e.target.value))}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              POS Receipt Printer Hardware
                            </label>
                            <select
                              value={posPrinterType}
                              onChange={(e) => setPosPrinterType(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                            >
                              <option value="80mm Thermal POS Printer">
                                80mm Thermal Receipt Printer (ESC/POS)
                              </option>
                              <option value="58mm Thermal Receipt Printer">
                                58mm Thermal Mini Receipt Printer
                              </option>
                              <option value="A4 Laser Full Bill">
                                A4 Laser Full Tax Invoice Printer
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 6: SECURITY & PASSWORD ── */}
                  {activeTab === 'security' && (
                    <div className="space-y-5">
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Lock className="w-4 h-4" /> Reset Branch Manager Password
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Current Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              New Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimum 8 chars"
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Re-enter password"
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center gap-2 text-[11px] font-bold text-soft cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showPassword}
                              onChange={(e) => setShowPassword(e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#5A2EA6] cursor-pointer"
                            />
                            <span>Show Password Characters</span>
                          </label>

                          <button
                            type="button"
                            onClick={handleResetPasswordSubmit}
                            className="px-4 py-2 bg-[#5A2EA6] text-white font-bold rounded-xl border-0 cursor-pointer text-[11px] hover:bg-[#49228a] transition-all shadow-xs"
                          >
                            Update Password Now
                          </button>
                        </div>
                      </div>

                      {/* 2FA & Session Security */}
                      <div className="border border-line rounded-[18px] p-4 bg-white space-y-4">
                        <h4 className="font-bold text-[12.5px] text-[#5A2EA6] uppercase tracking-wider flex items-center gap-1.5 border-b border-line/60 pb-2">
                          <Lock className="w-4 h-4" /> Two-Factor &amp; Active Session Security
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3.5 bg-[#FCFAFF] border border-line rounded-xl">
                            <div>
                              <strong className="block text-ink text-[12.5px]">
                                Two-Factor Authentication (2FA)
                              </strong>
                              <span className="text-soft text-[10.5px]">
                                Require OTP verification code for login sign-ins.
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={twoFactorAuth}
                              onChange={(e) => setTwoFactorAuth(e.target.checked)}
                              className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                            />
                          </div>

                          <div>
                            <label className="text-[10.5px] font-bold text-muted block mb-1">
                              Inactivity Session Timeout
                            </label>
                            <select
                              value={sessionTimeout}
                              onChange={(e) => setSessionTimeout(e.target.value)}
                              className="w-full bg-[#FCFAFF] border border-line rounded-xl p-2.5 text-[12px] font-bold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                            >
                              <option value="15 Minutes">15 Minutes Inactivity</option>
                              <option value="30 Minutes">30 Minutes Inactivity</option>
                              <option value="60 Minutes">60 Minutes Inactivity</option>
                              <option value="120 Minutes">120 Minutes Inactivity</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 8: OUTLET STATUTORY & COMPLIANCE CLEARANCES ── */}
                  {activeTab === 'compliance' && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="bg-[#FCFAFF] p-3.5 rounded-2xl border border-line">
                          <span className="text-[10px] font-bold text-soft uppercase block">Outlet Mandated Rules</span>
                          <div className="text-xl font-bold text-ink mt-0.5">
                            {activeRequirements.filter((r) => r.level === 'outlet' || r.level === 'both').length} Clearances
                          </div>
                          <span className="text-[10px] text-[#5A2EA6] font-semibold">Enforced for this Store</span>
                        </div>
                        <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Verified by HQ</span>
                          <div className="text-xl font-bold text-emerald-700 mt-0.5">
                            {submissions.filter((s) => s.status === 'Verified').length} Clearances
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold">Audit Passed</span>
                        </div>
                        <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200">
                          <span className="text-[10px] font-bold text-amber-800 uppercase block">Pending / Due Action</span>
                          <div className="text-xl font-bold text-amber-700 mt-0.5">
                            {Math.max(
                              0,
                              activeRequirements.filter((r) => r.level === 'outlet' || r.level === 'both').length -
                                submissions.filter((s) => s.status === 'Verified').length
                            )} Pending
                          </div>
                          <span className="text-[10px] text-amber-600 font-semibold">Upload Required</span>
                        </div>
                        <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-200">
                          <span className="text-[10px] font-bold text-purple-800 uppercase block">Store Compliance</span>
                          <div className="text-xl font-bold text-[#5A2EA6] mt-0.5">
                            {Math.round(
                              (submissions.filter((s) => s.status === 'Verified').length /
                                Math.max(1, activeRequirements.filter((r) => r.level === 'outlet' || r.level === 'both').length)) *
                                100
                            )}%
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold">Live Scorecard</span>
                        </div>
                      </div>

                      {/* Clearance Table Ledger */}
                      <div className="border border-line rounded-2xl overflow-hidden bg-white">
                        <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
                          <div>
                            <h4 className="font-bold text-[13px] text-[#5A2EA6] flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-[#5A2EA6]" />
                              Store Statutory Licenses &amp; Equipment Safety Clearances
                            </h4>
                            <p className="text-[11px] text-muted mt-0.5">
                              Store Manager desk to upload municipal licenses, Fire Department NOCs, autoclave sterilizer logs, and employee health fitness certificates for Brand HQ sign-off.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toast('Compliance Report: Store clearances report downloaded.')}
                            className="px-3 py-1.5 rounded-xl border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> Export Clearances
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="bg-slate-50 text-soft uppercase text-[10px] font-bold border-b border-line">
                                <th className="p-3 pl-4">Standard / Clearance</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Renewal Frequency</th>
                                <th className="p-3">Validity Expiry</th>
                                <th className="p-3 text-center w-[150px]">Status</th>
                                <th className="p-3 pr-4 text-right w-[215px]">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-line font-medium text-slate-700">
                              {activeRequirements
                                .filter((r) => r.level === 'outlet' || r.level === 'both')
                                .map((req) => {
                                  const sub = submissions.find((s) => s.requirementId === req.id);
                                  const status = sub
                                    ? sub.status === 'Verified'
                                      ? 'Verified by HQ'
                                      : sub.status === 'Pending Review'
                                        ? 'Pending HQ Review'
                                        : sub.status === 'Action Required'
                                          ? 'Action Required'
                                          : 'Expired'
                                    : 'Missing / Due';

                                  return (
                                    <tr key={req.id} className="hover:bg-purple-50/20 transition-colors">
                                      <td className="p-3 pl-4">
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono text-[9.5px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded border border-slate-200">
                                            {req.id}
                                          </span>
                                          <div>
                                            <span className="font-bold text-ink text-xs block">{req.name}</span>
                                            <span className="text-[10px] text-muted line-clamp-1">{req.description}</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-3 whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                          {req.category}
                                        </span>
                                      </td>
                                      <td className="p-3 whitespace-nowrap text-slate-800 font-semibold text-[11px]">
                                        {req.renewalFrequency}
                                      </td>
                                      <td className="p-3 whitespace-nowrap">
                                        <span className="font-bold text-ink text-[11px] block">{sub ? sub.expiryDate : 'Action Due'}</span>
                                        {sub && <span className="text-[9.5px] font-mono text-muted">{sub.documentRef}</span>}
                                      </td>
                                      <td className="p-3 text-center whitespace-nowrap w-[150px]">
                                        <span
                                          className={cn(
                                            'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[9.5px] font-bold border min-w-[110px]',
                                            status === 'Verified by HQ'
                                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                              : status === 'Pending HQ Review'
                                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                                : status === 'Action Required'
                                                  ? 'bg-red-50 text-red-700 border-red-200'
                                                  : status === 'Expired'
                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                          )}
                                        >
                                          {status}
                                        </span>
                                      </td>
                                      <td className="p-3 pr-4 text-right whitespace-nowrap w-[215px]">
                                        <div className="flex items-center justify-end gap-2">
                                          {sub ? (
                                            <button
                                              type="button"
                                              onClick={() => setBranchViewModalSub(sub)}
                                              className="w-[74px] h-[30px] rounded-lg text-xs font-semibold border border-[#5A2EA6] text-[#5A2EA6] bg-white hover:bg-purple-50 cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                              <span>View</span>
                                            </button>
                                          ) : (
                                            <div className="w-[74px] h-[30px] shrink-0" aria-hidden="true" />
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setBranchUploadModalReq(req);
                                              setBUploadDocRef(sub?.documentRef || `REF-${req.id}-${Math.floor(1000 + Math.random() * 9000)}`);
                                              setBUploadAgency(sub?.issuingAuthority || 'Bhopal Local Municipal / Inspection Authority');
                                              setBUploadIssueDate(sub?.issueDate || new Date().toISOString().split('T')[0]);
                                              setBUploadExpiryDate(sub?.expiryDate || '2027-03-31');
                                              setBUploadFileName(sub?.fileName || `${req.name.replace(/\s+/g, '_')}_Scan.pdf`);
                                              setBUploadNotes(sub?.notes || '');
                                            }}
                                            className={cn(
                                              'w-[114px] h-[30px] rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 border',
                                              status === 'Verified by HQ'
                                                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                                                : 'bg-[#5A2EA6] text-white hover:bg-[#482387] border-[#5A2EA6] shadow-xs'
                                            )}
                                          >
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>{status === 'Verified by HQ' ? 'Replace' : 'Upload Proof'}</span>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Action for Forms */}
                  <div className="border-t border-line/60 pt-4 flex justify-between items-center flex-wrap gap-2">
                    <span className="text-[10.5px] text-soft font-semibold">
                      Last saved by <strong className="text-ink font-mono">Priya Sharma</strong> on{' '}
                      {lastEditedTimestamp}
                    </span>
                    <Button
                      type="submit"
                      className="rounded-xl px-6 py-2.5 text-xs font-bold premium-btn-primary cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Settings</span>
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add New Station Modal ── */}
      {isAddStationOpen && (
        <DialogModal
          isOpen={isAddStationOpen}
          onClose={() => setIsAddStationOpen(false)}
          title="Add New Station to Physical Layout"
          description="Register styling chair, facial cabin, or spa room for branch roster allocation"
        >
          <form onSubmit={handleAddStationSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Station Name / Label
              </label>
              <input
                type="text"
                value={newStationName}
                onChange={(e) => setNewStationName(e.target.value)}
                placeholder="e.g. Chair 07 (Keratin Suite) or Cabin 03"
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-[12.5px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                required
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Station Category Type
              </label>
              <select
                value={newStationType}
                onChange={(e) => setNewStationType(e.target.value as any)}
                className="w-full bg-[#FCFAFF] border border-line rounded-xl p-3 text-[12.5px] font-bold text-ink outline-none cursor-pointer focus:border-[#5A2EA6]"
              >
                <option value="Styling Chair">Styling Chair</option>
                <option value="Facial Cabin">Facial Cabin</option>
                <option value="Spa Room">Spa Room</option>
                <option value="Hair Wash Station">Hair Wash Station</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddStationOpen(false)}
                className="px-5 py-2.5 rounded-xl text-[12.5px] font-bold text-soft border border-line bg-white hover:bg-paper/40 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-[12.5px] font-bold premium-btn-primary flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Station</span>
              </Button>
            </div>
          </form>
        </DialogModal>
      )}

      {/* ── Inspect Audit Diff Modal ── */}
      {selectedAuditLog && (
        <DialogModal
          isOpen={true}
          onClose={() => setSelectedAuditLog(null)}
          title={`Audit Entry Trace · ${selectedAuditLog.id}`}
          description="Cryptographically recorded immutable state transition"
        >
          <div className="space-y-4 pt-2">
            <div className="bg-[#FAF7FF] p-4 rounded-2xl border border-purple-100 space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                    moduleColorBadge(selectedAuditLog.targetModule),
                  )}
                >
                  {selectedAuditLog.targetModule} Module
                </span>
                <code className="text-xs font-mono font-bold text-ink bg-white px-2 py-0.5 rounded border border-purple-100">
                  {selectedAuditLog.action}
                </code>
              </div>
              <p className="text-xs font-semibold text-ink">{selectedAuditLog.details}</p>
              <div className="flex items-center gap-4 text-[11px] text-muted pt-1">
                <span>
                  Actor:{' '}
                  <strong className="text-ink">
                    {selectedAuditLog.actor} ({selectedAuditLog.actorRole})
                  </strong>
                </span>
                <span>
                  IP: <strong className="text-ink font-mono">{selectedAuditLog.ipAddress}</strong>
                </span>
                <span>
                  Timestamp: <strong className="text-ink">{selectedAuditLog.timestamp}</strong>
                </span>
              </div>
            </div>

            {/* Before vs After State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-rose-800 block mb-1">
                  State Before Action
                </span>
                <p className="text-xs font-mono text-rose-950 font-medium whitespace-pre-wrap">
                  {selectedAuditLog.beforeValue || '—'}
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block mb-1">
                  State After Action
                </span>
                <p className="text-xs font-mono text-emerald-950 font-medium whitespace-pre-wrap">
                  {selectedAuditLog.afterValue || '—'}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setSelectedAuditLog(null)}
                className="h-9 px-4 rounded-xl text-xs font-bold"
              >
                Close Audit Inspection
              </Button>
            </div>
          </div>
        </DialogModal>
      )}

      {/* ── Branch Manager Upload Clearance Modal ── */}
      {branchUploadModalReq &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setBranchUploadModalReq(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Store Clearance Upload
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">{branchUploadModalReq.id}</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">{branchUploadModalReq.name}</h3>
                  <p className="text-xs text-muted">{branchUploadModalReq.description}</p>
                </div>
                <button
                  onClick={() => setBranchUploadModalReq(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!branchUploadModalReq) return;

                  addOrUpdateSubmission({
                    requirementId: branchUploadModalReq.id,
                    requirementName: branchUploadModalReq.name,
                    partnerId: 'FP-BPL-889',
                    partnerName: 'Singhania Luxury Salon Outlets LLP',
                    branchId: assignedBranch ? assignedBranch.id : 'BR-001',
                    branchName: assignedBranch ? assignedBranch.name : 'Indrapuri Central Outlet',
                    documentRef: bUploadDocRef || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
                    fileName: bUploadFileName,
                    fileSize: '1.8 MB',
                    issuingAuthority: bUploadAgency || 'Local Statutory Testing Agency',
                    issueDate: bUploadIssueDate,
                    expiryDate: bUploadExpiryDate,
                    uploadedByRole: 'Branch Manager',
                    uploadedByName: 'Priya Sharma (Branch Manager)',
                    status: 'Pending Review',
                    notes: bUploadNotes,
                  });

                  toast(
                    `Outlet Clearance Uploaded: "${branchUploadModalReq.name}" submitted to Brand HQ for verification.`
                  );
                  setBranchUploadModalReq(null);
                }}
                className="p-6 space-y-4 text-xs"
              >
                <div>
                  <label className="font-bold text-ink block mb-1">Clearance / Certificate Reference Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMC-TL-2026-9901 or NOC-FIRE-2026"
                    value={bUploadDocRef}
                    onChange={(e) => setBUploadDocRef(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Testing Agency / Municipal Authority *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bhopal Municipal Health Dept / MP Fire Services"
                    value={bUploadAgency}
                    onChange={(e) => setBUploadAgency(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Inspection / Issue Date *</label>
                    <input
                      type="date"
                      required
                      value={bUploadIssueDate}
                      onChange={(e) => setBUploadIssueDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Next Validity Expiry *</label>
                    <input
                      type="date"
                      required
                      value={bUploadExpiryDate}
                      onChange={(e) => setBUploadExpiryDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Attach Scanned Receipt / Certificate File *</label>
                  <div className="border-2 border-dashed border-[#5A2EA6]/30 bg-purple-50/20 p-4 rounded-2xl text-center space-y-2">
                    <Upload className="w-6 h-6 text-[#5A2EA6] mx-auto" />
                    <div>
                      <span className="font-bold text-ink text-xs block">{bUploadFileName}</span>
                      <span className="text-[10px] text-muted">Max file size: 10 MB (PDF, JPG, PNG)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const randomNum = Math.floor(100 + Math.random() * 900);
                        setBUploadFileName(`${branchUploadModalReq.name.replace(/\s+/g, '_')}_Scan_${randomNum}.pdf`);
                        toast('File Selected: Scanned certificate attached.');
                      }}
                      className="px-3 py-1 bg-white border border-[#5A2EA6] text-[#5A2EA6] rounded-lg font-bold text-[11px] cursor-pointer hover:bg-purple-50"
                    >
                      Choose Scanned File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Store Manager Remarks / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Enter technician report details, equipment serials, or staff roll numbers..."
                    value={bUploadNotes}
                    onChange={(e) => setBUploadNotes(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setBranchUploadModalReq(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Submit to Brand HQ for Approval
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* ── Branch Manager View Clearance Dossier Modal ── */}
      {branchViewModalSub &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setBranchViewModalSub(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Clearance Dossier
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">{branchViewModalSub.documentRef}</span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">{branchViewModalSub.requirementName}</h3>
                  <p className="text-xs text-muted">Store: {branchViewModalSub.branchName}</p>
                </div>
                <button
                  onClick={() => setBranchViewModalSub(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Approval Status</span>
                    <span className="font-bold text-emerald-700 text-sm block mt-0.5">{branchViewModalSub.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Next Expiry Date</span>
                    <span className="font-bold text-ink text-sm block mt-0.5">{branchViewModalSub.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Issuing Authority</span>
                    <span className="font-semibold text-slate-800">{branchViewModalSub.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase block">Uploaded By</span>
                    <span className="font-semibold text-purple-900">{branchViewModalSub.uploadedByName}</span>
                  </div>
                </div>

                {branchViewModalSub.hqRemarks && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">HQ Review Feedback</span>
                    <p className="text-emerald-950 font-medium mt-0.5">{branchViewModalSub.hqRemarks}</p>
                    {branchViewModalSub.reviewedByName && (
                      <span className="text-[9.5px] text-emerald-700 mt-1 block">Verified by: {branchViewModalSub.reviewedByName}</span>
                    )}
                  </div>
                )}

                <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5A2EA6]" />
                    <div>
                      <span className="font-bold text-ink block">{branchViewModalSub.fileName}</span>
                      <span className="text-[10px] text-muted">{branchViewModalSub.fileSize} · Scanned Verification Copy</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast(`Downloading Clearance: ${branchViewModalSub.fileName} downloaded.`)}
                    className="px-3 py-1 bg-white border border-[#5A2EA6] text-[#5A2EA6] rounded-lg font-bold text-[11px] hover:bg-purple-50 cursor-pointer inline-flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-3xl -mx-6 -mb-6 mt-4">
                  <button
                    type="button"
                    onClick={() => setBranchViewModalSub(null)}
                    className="px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all border-0"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default SettingsPage;
