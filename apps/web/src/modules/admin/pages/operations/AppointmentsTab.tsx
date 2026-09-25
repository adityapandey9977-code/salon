import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Layers,
  Loader2,
  Phone,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Scissors,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { tokenStorage } from '@/shared/api/client';
import {
  appointmentsApi,
  catalogueApi,
  customersApi,
  staffApi,
  type ApiAppointmentSummary,
  type ApiCustomerSummary,
  type ApiServiceMaster,
  type FullStaffRecord,
} from '@/shared/api';
import { useAdminContext, type AdminBranch } from '../../context/AdminContext';
import { AppointmentDetailsDrawer, type FullAppointmentRecord } from './AppointmentDetailsDrawer';
import { isStylistOrTherapist } from './AvailabilityTab';
import { type NewAppointmentData, type ServiceItem, NewAppointmentModal } from './NewAppointmentModal';

function InServiceRowTimer({ durationMinutes }: { durationMinutes: number }) {
  const totalSeconds = (durationMinutes || 45) * 60;
  const [remaining, setRemaining] = React.useState<number>(totalSeconds);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#5A2EA6] border border-purple-200 font-bold text-[10px] shadow-3xs">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-mono font-extrabold text-[#5A2EA6]">{formatted}</span>
      <span className="text-[9px] text-[#5A2EA6]/75 font-semibold">left ({durationMinutes}m)</span>
    </div>
  );
}

const mapApiToFullAppointment = (
  raw: ApiAppointmentSummary,
  branches: AdminBranch[] | any[],
  staffList: FullStaffRecord[],
  servicesList: ApiServiceMaster[],
  customersList: ApiCustomerSummary[],
  resourcesList: any[] = [],
  fallbackBranchName?: string,
): FullAppointmentRecord => {
  const branchObj = branches.find(
    (b: any) => b.id && raw.branchId && b.id.toLowerCase() === raw.branchId.toLowerCase(),
  );
  const branchName = branchObj ? branchObj.name : (fallbackBranchName || 'Main Branch');

  const customerObj = customersList.find((c) => c.id === raw.customerId);
  const clientName = customerObj
    ? customerObj.displayName || `${customerObj.firstName} ${customerObj.lastName || ''}`.trim()
    : 'Valued Client';
  const clientMobile = customerObj?.mobilePhone || '+91 9876543210';
  const clientEmail = customerObj?.email || '';

  const startDate = new Date(raw.scheduledStartAt);
  const dateStr = !isNaN(startDate.getTime())
    ? startDate.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const timeStr = !isNaN(startDate.getTime())
    ? startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '11:00 AM';

  const mappedServices: ServiceItem[] = (raw.items || []).map((it) => {
    const srvMaster = servicesList.find((s) => s.id === it.serviceId);
    return {
      id: it.serviceId,
      name: srvMaster?.name || 'Salon Treatment Protocol',
      category: 'Specialized Service',
      duration: it.durationMinutesSnapshot || 45,
      price: Number(it.priceSnapshot) || 500,
    };
  });

  const primaryService = mappedServices[0] || {
    id: 'srv-1',
    name: 'Salon Protocol Service',
    category: 'Hair & Styling',
    duration: 45,
    price: Number(raw.subtotalEstimate) || 1500,
  };

  const firstStaffId = raw.items?.[0]?.staffId;
  const staffObj = staffList.find((st) => st.id === firstStaffId);
  const staffName = staffObj?.fullName || 'Assigned Specialist';

  const totalDurationMins =
    mappedServices.length > 0
      ? mappedServices.reduce((sum, s) => sum + s.duration, 0)
      : 45;

  const normalizedStatus: FullAppointmentRecord['status'] =
    raw.status === 'IN_SERVICE'
      ? 'In Service'
      : raw.status === 'COMPLETED'
        ? 'Completed'
        : raw.status === 'CANCELLED'
          ? 'Cancelled'
          : raw.status === 'NO_SHOW'
            ? 'No-show'
            : raw.status === 'CHECKED_IN'
              ? 'Checked-in'
              : raw.status === 'CONFIRMED'
                ? 'Confirmed'
                : 'Booked';

  const subtotal = Number(raw.subtotalEstimate) || 0;
  const deposit = Number(raw.depositAmount) || 0;

  return {
    id: raw.bookingNumber || raw.id,
    clientName,
    clientMobile,
    clientEmail,
    isNewClient: false,
    customerId: raw.customerId,
    customerCode: customerObj?.customerCode,
    serviceMode: raw.notes?.includes('Home Service') ? 'Home Service' : 'In-Salon',
    travelSurcharge: raw.notes?.includes('Home Service') ? 350 : 0,
    branch: branchName,
    branchId: raw.branchId,
    services: mappedServices.length > 0 ? mappedServices : [primaryService],
    staffId: firstStaffId || 'unassigned',
    staffName,
    staffAssignments: mappedServices.map((srv) => ({
      serviceName: srv.name,
      staffId: firstStaffId || 'unassigned',
      staffName,
      role: staffObj?.role || 'Specialist',
      avatarInitials: staffName.slice(0, 2).toUpperCase(),
    })),
    resourceAllocations: [
      {
        serviceName: primaryService.name,
        room: 'Clinical Suite #1',
        chair: 'Aesthetic Station',
        equipment: 'Standard Kit',
      },
    ],
    date: dateStr,
    time: timeStr,
    durationMinutes: totalDurationMins,
    totalDuration: totalDurationMins,
    room: 'Clinical Suite #1',
    chair: 'Aesthetic Station',
    equipment: 'Standard Kit',
    totalAmount: subtotal,
    estimatedAmount: subtotal,
    depositRequired: raw.depositRequired,
    depositAmount: deposit,
    paymentStatus: deposit > 0 ? 'Pending Deposit' : 'Pay at Salon',
    bookingSource:
      raw.source === 'WALK_IN'
        ? 'Walk-in'
        : raw.source === 'ONLINE'
          ? 'Online'
          : raw.source === 'CALL_CENTER'
            ? 'Call Centre'
            : 'Online',
    notes: raw.notes || '',
    status: normalizedStatus,
    timeline: [
      {
        title: 'Appointment Registered in Database',
        time: new Date(raw.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: 'Enterprise Gateway',
        status: normalizedStatus,
      },
    ],
    clientVisits: customerObj?.totalVisits || 1,
    lastVisit: customerObj?.lastVisitAt ? new Date(customerObj.lastVisitAt).toLocaleDateString() : 'New Guest',
    membershipStatus: 'Active Member',
    depositPaid: deposit,
    balanceDue: Math.max(0, subtotal - deposit),
  };
};

import type { OperationsData } from './useOperationsData';

export interface AppointmentsTabProps {
  defaultBranch?: string;
  branchId?: string;
  lockBranch?: boolean;
  operationsData?: OperationsData;
}

export function AppointmentsTab({
  defaultBranch = 'All',
  branchId,
  lockBranch = false,
  operationsData,
}: AppointmentsTabProps = {}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const branchesList = salon?.branches || [];

  const [internalAppointments, setInternalAppointments] = useState<FullAppointmentRecord[]>([]);
  const [internalIsLoading, setInternalIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Relational reference lists fallback
  const [internalStaffRoster, setInternalStaffRoster] = useState<FullStaffRecord[]>([]);
  const [internalServicesCatalog, setInternalServicesCatalog] = useState<ApiServiceMaster[]>([]);
  const [internalCustomersRoster, setInternalCustomersRoster] = useState<ApiCustomerSummary[]>([]);

  const appointments = operationsData ? operationsData.appointments : internalAppointments;
  const isLoading = operationsData ? operationsData.isLoading : internalIsLoading;
  const staffRoster = operationsData ? operationsData.staffRoster : internalStaffRoster;
  const servicesCatalog = operationsData ? operationsData.servicesCatalog : internalServicesCatalog;
  const customersRoster = operationsData ? operationsData.customersRoster : internalCustomersRoster;

  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [staffFilter, setStaffFilter] = useState('All');
  const [serviceFilter, setServiceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  useEffect(() => {
    if (defaultBranch && defaultBranch !== 'All') {
      setBranchFilter(defaultBranch);
    }
  }, [defaultBranch]);

  // Modals & Drawer state
  const [selectedAppointment, setSelectedAppointment] = useState<FullAppointmentRecord | null>(
    null,
  );
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  // Derive current selected appointment to ensure live updates in drawer
  const currentSelectedAppointment = useMemo(() => {
    if (!selectedAppointment) return null;
    return (
      appointments.find(
        (a) =>
          a.id === selectedAppointment.id ||
          (a.appointmentId && a.appointmentId === selectedAppointment.appointmentId),
      ) || selectedAppointment
    );
  }, [selectedAppointment, appointments]);

  // Fetch live appointments from booking-service
  const loadLiveAppointments = useCallback(async () => {
    if (operationsData) {
      operationsData.refetch();
      return;
    }
    setInternalIsLoading(true);
    setLoadError(null);
    try {
      let branchIdParam = branchId;
      if (!branchIdParam && branchFilter !== 'All') {
        const matchedBranch = branchesList.find(
          (b) => b.name === branchFilter || `${b.name} (${b.city})` === branchFilter,
        );
        branchIdParam = matchedBranch ? matchedBranch.id : undefined;
      }
      if (!branchIdParam && typeof window !== 'undefined' && window.location.pathname.startsWith('/branch-manager')) {
        branchIdParam = tokenStorage.getBranchId() || localStorage.getItem('digiflex_branch_id') || undefined;
      }

      const [rawList, staffData, servicesData, customersData] = await Promise.all([
        appointmentsApi.list({ branchId: branchIdParam, limit: 100 }).catch((err) => {
          console.warn('appointmentsApi.list failed:', err);
          return [] as ApiAppointmentSummary[];
        }),
        staffApi.list().catch(() => [] as FullStaffRecord[]),
        catalogueApi.fetchServices().catch(() => [] as ApiServiceMaster[]),
        customersApi.list().catch(() => [] as ApiCustomerSummary[]),
      ]);

      setInternalStaffRoster(staffData || []);
      setInternalServicesCatalog(servicesData || []);
      setInternalCustomersRoster(customersData || []);

      const mapped = rawList.map((raw) =>
        mapApiToFullAppointment(
          raw,
          branchesList,
          staffData || [],
          servicesData || [],
          customersData || [],
          [],
          defaultBranch !== 'All' ? defaultBranch : undefined,
        ),
      );

      setInternalAppointments(mapped);
    } catch (err: any) {
      console.error('Failed to load appointments from database:', err);
      setLoadError(err.message || 'Failed to fetch appointments from database.');
    } finally {
      setInternalIsLoading(false);
    }
  }, [branchFilter, branchId, branchesList, operationsData, defaultBranch]);

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (operationsData) {
        operationsData.refetch();
      } else {
        loadLiveAppointments();
      }
    }
  }, [operationsData, loadLiveAppointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        apt.id.toLowerCase().includes(q) ||
        apt.clientName.toLowerCase().includes(q) ||
        apt.clientMobile.includes(q) ||
        apt.staffName.toLowerCase().includes(q) ||
        apt.services.some((s) => s.name.toLowerCase().includes(q));

      const matchesBranch =
        lockBranch ||
        branchFilter === 'All' ||
        apt.branch === branchFilter ||
        (branchId && apt.branchId === branchId) ||
        (defaultBranch !== 'All' && apt.branch === defaultBranch);
      const matchesStaff = staffFilter === 'All' || apt.staffName === staffFilter;
      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || apt.bookingSource === sourceFilter;

      return matchesSearch && matchesBranch && matchesStaff && matchesStatus && matchesSource;
    });
  }, [appointments, searchQuery, branchFilter, staffFilter, statusFilter, sourceFilter, lockBranch, branchId, defaultBranch]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: FullAppointmentRecord['status'],
    updatedFields?: Partial<FullAppointmentRecord>,
  ) => {
    if (operationsData) {
      await operationsData.handleUpdateStatus(id, newStatus, updatedFields);
      return;
    }

    const statusMap: Record<FullAppointmentRecord['status'], string> = {
      Booked: 'PENDING_CONFIRMATION',
      Confirmed: 'CONFIRMED',
      'Checked-in': 'CHECKED_IN',
      'In Service': 'IN_SERVICE',
      Completed: 'COMPLETED',
      Cancelled: 'CANCELLED',
      'No-show': 'NO_SHOW',
      Rescheduled: 'CONFIRMED',
    };

    try {
      if (newStatus === 'In Service') {
        await appointmentsApi.startService(id);
      } else if (newStatus === 'Completed') {
        const completedRes = await appointmentsApi.completeService(id);
        const targetApt = internalAppointments.find((a) => a.id === id || a.appointmentId === id);
        const custId = targetApt?.customerId || completedRes?.customerId;
        if (custId) {
          const amt = Number((targetApt as any)?.totalAmount || (targetApt as any)?.estimatedAmount || completedRes?.subtotalEstimate || 0);
          customersApi.recordVisit(custId, amt).catch(() => {});
        }
      } else if (newStatus === 'Cancelled') {
        await appointmentsApi.cancel(id, updatedFields?.notes || 'Cancelled by staff');
      } else if (newStatus === 'Confirmed') {
        await appointmentsApi.confirm(id);
      } else {
        await appointmentsApi.updateStatus(id, statusMap[newStatus] || newStatus);
      }
      toast(`Status updated to ${newStatus} in database.`);
    } catch (err: any) {
      console.warn('Could not persist status to backend, updating local state:', err);
      toast(`Failed to update status: ${err.message || 'Error'}`);
    }

    setInternalAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id || a.appointmentId === id) {
          const updated: FullAppointmentRecord = {
            ...a,
            status: newStatus,
            ...updatedFields,
            timeline: [
              {
                title:
                  newStatus === 'In Service'
                    ? 'Treatment Protocol Started'
                    : newStatus === 'Checked-in'
                      ? 'Checked-in at Floor Reception'
                      : newStatus === 'Completed'
                        ? 'Service Completed & Sent to Billing'
                        : newStatus === 'Confirmed'
                          ? 'Booking Confirmed with Client'
                          : newStatus === 'Cancelled'
                            ? 'Appointment Cancelled'
                            : newStatus === 'Rescheduled'
                              ? `Rescheduled to ${updatedFields?.date || a.date} ${updatedFields?.time || a.time}`
                              : `Status updated to ${newStatus}`,
                time: 'Just Now',
                user: 'Floor Operations',
                status: newStatus,
              },
              ...a.timeline,
            ],
          };
          if (selectedAppointment?.id === id || selectedAppointment?.appointmentId === id) {
            setSelectedAppointment(updated);
          }
          return updated;
        }
        return a;
      }),
    );
  };

  const handleNewBookingSuccess = (_newApt: NewAppointmentData) => {
    if (operationsData) {
      operationsData.refetch();
    } else {
      loadLiveAppointments();
    }
    setIsNewBookingOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Centralized Appointments Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {appointments.length} Total Bookings
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Omni-channel booking queue (Online, WhatsApp, Call-Center, Walk-in), multi-service
            allocations, deposits, and status lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() =>
              toast(`Exported ${filteredAppointments.length} appointment records to CSV.`)
            }
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => setIsNewBookingOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            placeholder="Search by ID, Client, Mobile, Service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
              >
                <option value="All">All Branches</option>
                {branchesList.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!lockBranch && <div className="h-4 w-px bg-slate-200 hidden sm:block" />}

          {/* Specialist Filter */}
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Specialists</option>
              {staffRoster.filter(isStylistOrTherapist).map((s) => (
                <option key={s.id} value={s.fullName}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Booking Channel Filter */}
          <div className="flex items-center gap-1">
            <span>Channel:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Channels</option>
              <option value="Online">Online Widget</option>
              <option value="Website">Website</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Call Centre">Call Centre</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Marketplace">Marketplace</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-in">Checked-in</option>
              <option value="In Service">In Service</option>
              <option value="Completed">Completed</option>
              <option value="Booked">Booked</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-show">No-show</option>
            </select>
          </div>

          {/* Refresh / Sync Button */}
          <Button
            variant="outline"
            onClick={() => loadLiveAppointments()}
            disabled={isLoading}
            className="h-[34px] px-3 rounded-lg text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-1.5 shadow-xs"
            title="Refresh database records"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            <span>Sync</span>
          </Button>
        </div>
      </div>

      {/* Central Appointments Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Master Booking Directory &amp; Status Ledger
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Centralized telemetry across flagship salons, studios, and luxury lounges
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredAppointments.length} Filtered Records
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Apt ID & Schedule',
                  'Client & Contact',
                  ...(!lockBranch ? ['Branch Location'] : []),
                  'Treatment Protocol',
                  'Assigned Specialist',
                  'Room / Chair',
                  'Duration',
                  'Amount & Deposit',
                  'Channel',
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
                  <td colSpan={lockBranch ? 10 : 11} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted">
                      <Loader2 className="w-8 h-8 text-[#5A2EA6] animate-spin" />
                      <p className="text-xs font-semibold text-ink">Loading live database appointments...</p>
                      <span className="text-[11px] text-muted">Fetching tenant bookings from booking_db</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={lockBranch ? 10 : 11} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-[#5A2EA6]/10 flex items-center justify-center text-[#5A2EA6]">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">No Booked Appointments Found</p>
                        <p className="text-xs text-muted mt-1">
                          {searchQuery || branchFilter !== 'All' || statusFilter !== 'All' || staffFilter !== 'All' || sourceFilter !== 'All'
                            ? 'No bookings match your current filter criteria. Try resetting filters.'
                            : 'There are no appointments registered in the database for this tenant yet.'}
                        </p>
                      </div>
                      <Button
                        onClick={() => setIsNewBookingOpen(true)}
                        className="mt-2 h-9 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Book First Appointment</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Apt ID & Schedule */}
                    <td className="p-3.5 pl-5">
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      >
                        <span className="font-mono font-bold text-xs text-[#5A2EA6] block group-hover:underline">
                          {apt.id}
                        </span>
                        <span className="text-[10px] text-muted">
                          {apt.date} · {apt.time}
                        </span>
                      </button>
                    </td>

                    {/* Client */}
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          const matched = customersRoster.find(
                            (c) =>
                              c.id === apt.customerId ||
                              c.displayName?.toLowerCase() === apt.clientName.toLowerCase() ||
                              c.mobilePhone?.replace(/\s+/g, '') === apt.clientMobile.replace(/\s+/g, ''),
                          );

                          navigate(matched ? `/admin/customers` : '/admin/customers');
                        }}
                        className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none block"
                        title={`Open client dossier for ${apt.clientName}`}
                      >
                        <strong className="text-ink text-xs block group-hover:text-[#5A2EA6] group-hover:underline transition-colors flex items-center gap-1 font-bold">
                          <span>{apt.clientName}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-[#5A2EA6] transition-opacity shrink-0" />
                        </strong>
                        <span className="text-[10px] text-muted group-hover:text-purple-600 transition-colors">
                          {apt.clientMobile}
                        </span>
                      </button>
                    </td>

                    {/* Branch */}
                    {!lockBranch && <td className="p-3.5 text-soft">{apt.branch}</td>}

                    {/* Service */}
                    <td className="p-3.5">
                      <div className="font-semibold text-ink text-xs truncate max-w-[170px]">
                        {apt.services[0]?.name}
                      </div>
                      {apt.services.length > 1 && (
                        <span className="text-[9.5px] text-[#5A2EA6] font-bold">
                          +{apt.services.length - 1} more service
                        </span>
                      )}
                    </td>

                    {/* Staff */}
                    <td className="p-3.5">
                      <div className="font-semibold text-ink text-xs">{apt.staffName}</div>
                      <span className="text-[10px] text-[#5A2EA6] font-semibold">{apt.staffId}</span>
                    </td>

                    {/* Room / Chair Assigned */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-ink text-xs flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-[#5A2EA6]" />
                        <span className="truncate max-w-[130px]" title={apt.room}>
                          {apt.room}
                        </span>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-purple-50 text-[#5A2EA6] text-[9.5px] font-mono font-bold mt-0.5 border border-purple-100">
                        {apt.chair}
                      </span>
                    </td>

                    {/* Duration & Live Timer */}
                    <td className="p-3.5 whitespace-nowrap">
                      {apt.status === 'In Service' ? (
                        <InServiceRowTimer
                          durationMinutes={apt.durationMinutes || apt.totalDuration || 45}
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                          <Clock className="w-3 h-3 text-[#5A2EA6]" />
                          <span>{apt.durationMinutes || apt.totalDuration || 45} mins</span>
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-3.5">
                      <strong className="text-ink font-serif text-xs block">
                        ₹{apt.estimatedAmount.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        Dep: ₹{apt.depositPaid || apt.depositAmount}
                      </span>
                    </td>

                    {/* Booking Source */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-[#5A2EA6] text-[9.5px] font-bold border border-purple-100">
                        {apt.bookingSource}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          apt.status === 'Confirmed' || apt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'In Service'
                              ? 'bg-purple-100 text-[#5A2EA6]'
                              : apt.status === 'Checked-in'
                                ? 'bg-blue-100 text-blue-800'
                                : apt.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800',
                        )}
                      >
                        {apt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Action Buttons based on Status */}
                        {apt.status === 'Confirmed' && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(apt.id, 'Checked-in');
                              }}
                              className="h-7 px-2 text-[11px] font-bold border border-blue-200 text-blue-700 bg-blue-50/70 hover:bg-blue-100 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs"
                              title="Check-in client at reception"
                            >
                              <User className="w-3 h-3 text-blue-600" />
                              <span>Check In</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(apt.id, 'In Service');
                              }}
                              className="h-7 px-2.5 text-[11px] font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs"
                              title="Start service protocol"
                            >
                              <Play className="w-3 h-3 text-white" />
                              <span>Start</span>
                            </button>
                          </>
                        )}

                        {apt.status === 'Booked' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Confirmed');
                            }}
                            className="h-7 px-2.5 text-[11px] font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs"
                            title="Confirm booking"
                          >
                            <Check className="w-3 h-3 text-white" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {apt.status === 'Checked-in' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'In Service');
                            }}
                            className="h-7 px-2.5 text-[11px] font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs"
                            title="Start service protocol"
                          >
                            <Play className="w-3 h-3 text-white" />
                            <span>Start Service</span>
                          </button>
                        )}

                        {apt.status === 'In Service' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Completed');
                            }}
                            className="h-7 px-2.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs animate-pulse"
                            title="Complete service and ready invoice"
                          >
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>Complete</span>
                          </button>
                        )}

                        {apt.status === 'Completed' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(apt);
                            }}
                            className="h-7 px-2 text-[11px] font-bold border border-emerald-300 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs"
                            title="View tax invoice and receipt"
                          >
                            <FileText className="w-3 h-3 text-emerald-600" />
                            <span>Bill</span>
                          </button>
                        )}

                        {apt.status === 'Cancelled' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Confirmed');
                            }}
                            className="h-7 px-2 text-[11px] font-bold border border-rose-200 text-rose-700 bg-rose-50/70 hover:bg-rose-100 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shadow-3xs"
                            title="Reopen booking"
                          >
                            <RotateCcw className="w-3 h-3 text-rose-600" />
                            <span>Reopen</span>
                          </button>
                        )}

                        {/* Inspect / Dossier Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(apt)}
                          className="h-7 px-2 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] inline-flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer border-0"
                          title="Open appointment dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialogs */}
      <NewAppointmentModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onSuccess={handleNewBookingSuccess}
        existingAppointments={appointments}
        branchId={branchId}
        branchName={defaultBranch !== 'All' ? defaultBranch : undefined}
        lockBranch={lockBranch}
      />

      <AppointmentDetailsDrawer
        appointment={currentSelectedAppointment}
        isOpen={Boolean(currentSelectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default AppointmentsTab;
