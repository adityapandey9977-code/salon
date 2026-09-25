import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  appointmentsApi,
  catalogueApi,
  customersApi,
  staffApi,
  type ApiAppointmentSummary,
  type ApiBranchResource,
  type ApiCustomerSummary,
  type ApiServiceMaster,
  type FullStaffRecord,
} from '@/shared/api';
import { useAdminContext, type AdminBranch } from '../../context/AdminContext';
import { masterBranches } from '../locations/AllBranchesTab';
import type { FullAppointmentRecord } from './AppointmentDetailsDrawer';
import type { ServiceItem } from './NewAppointmentModal';

export const mapApiToFullAppointment = (
  raw: ApiAppointmentSummary,
  branches: AdminBranch[] | any[],
  staffList: FullStaffRecord[],
  servicesList: ApiServiceMaster[],
  customersList: ApiCustomerSummary[],
  resourcesList: ApiBranchResource[] = [],
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

  // Resolve actual branch resources
  const branchResources = resourcesList.filter((r) => r.branchId === raw.branchId);
  const branchChairs = branchResources.filter((r) => String(r.type).toUpperCase() === 'CHAIR');
  const branchRooms = branchResources.filter((r) => String(r.type).toUpperCase() === 'ROOM');
  const branchEquipment = branchResources.filter((r) => String(r.type).toUpperCase() === 'EQUIPMENT');

  const matchedChair = branchChairs.find(
    (ch) =>
      raw.resources?.some((r) => r.resourceId === ch.id) ||
      raw.notes?.includes(ch.name) ||
      (ch.code && raw.notes?.includes(ch.code)),
  ) || branchChairs[0];

  const matchedRoom = branchRooms.find(
    (rm) =>
      raw.resources?.some((r) => r.resourceId === rm.id) ||
      raw.notes?.includes(rm.name) ||
      (rm.code && raw.notes?.includes(rm.code)),
  ) || branchRooms[0];

  const matchedEquip = branchEquipment.find(
    (eq) =>
      raw.resources?.some((r) => r.resourceId === eq.id) ||
      raw.notes?.includes(eq.name) ||
      (eq.code && raw.notes?.includes(eq.code)),
  ) || branchEquipment[0];

  const chairName = matchedChair?.name || 'Styling Station';
  const roomName = matchedRoom?.name || 'Treatment Suite';
  const equipName = matchedEquip?.name || 'Standard Equipment Kit';

  return {
    id: raw.bookingNumber || raw.id,
    appointmentId: raw.id,
    bookingNumber: raw.bookingNumber,
    rawStatus: raw.status,
    confirmedAt: raw.confirmedAt,
    completedAt: raw.completedAt,
    cancelledAt: raw.cancelledAt,
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
        room: roomName,
        chair: chairName,
        equipment: equipName,
      },
    ],
    date: dateStr,
    time: timeStr,
    durationMinutes: totalDurationMins,
    totalDuration: totalDurationMins,
    room: roomName,
    chair: chairName,
    equipment: equipName,
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

import { tokenStorage } from '@/shared/api/client';

export interface UseOperationsDataOptions {
  defaultBranch?: string;
  branchId?: string;
  branchesList?: any[];
  lockBranch?: boolean;
  franchiseId?: string;
}

export function useOperationsData({
  defaultBranch = 'All',
  branchId,
  branchesList: customBranches,
  lockBranch: _lockBranch = false,
  franchiseId,
}: UseOperationsDataOptions = {}) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const adminBranches = salon?.branches || [];
  const branchesList = customBranches && customBranches.length > 0 ? customBranches : adminBranches;

  const [rawAppointments, setRawAppointments] = useState<ApiAppointmentSummary[]>([]);
  const [staffRoster, setStaffRoster] = useState<FullStaffRecord[]>([]);
  const [servicesCatalog, setServicesCatalog] = useState<ApiServiceMaster[]>([]);
  const [customersRoster, setCustomersRoster] = useState<ApiCustomerSummary[]>([]);
  const [resources, setResources] = useState<ApiBranchResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      let branchIdParam = branchId;
      if (!branchIdParam && defaultBranch !== 'All') {
        const matchedBranch = branchesList.find(
          (b: any) => b.name === defaultBranch || `${b.name} (${b.city})` === defaultBranch,
        );
        branchIdParam = matchedBranch?.id;
      }
      if (!branchIdParam && typeof window !== 'undefined' && window.location.pathname.startsWith('/branch-manager')) {
        branchIdParam = tokenStorage.getBranchId() || localStorage.getItem('digiflex_branch_id') || undefined;
        if (!branchIdParam) {
          try {
            const cached = localStorage.getItem('digiflex_assigned_branch');
            if (cached) {
              const parsed = JSON.parse(cached);
              branchIdParam = parsed?.id;
            }
          } catch {}
        }
      }

      const currentFranchiseId =
        franchiseId ||
        (typeof window !== 'undefined' && window.location.pathname.startsWith('/franchise')
          ? tokenStorage.getFranchiseId() || localStorage.getItem('digiflex_franchise_id') || undefined
          : undefined);

      const [aptList, staffList, servicesList, customersList, branchResources] = await Promise.all([
        appointmentsApi.list({ branchId: branchIdParam, limit: 100 }).catch((err) => {
          console.warn('appointmentsApi.list failed:', err);
          return [] as ApiAppointmentSummary[];
        }),
        staffApi
          .list(
            currentFranchiseId
              ? { franchiseId: currentFranchiseId, hasFranchise: true }
              : undefined,
          )
          .catch(() => [] as FullStaffRecord[]),
        catalogueApi.fetchServices().catch(() => [] as ApiServiceMaster[]),
        customersApi.list().catch(() => [] as ApiCustomerSummary[]),
        catalogueApi.fetchResources(branchIdParam).catch((err) => {
          console.warn('catalogueApi.fetchResources failed:', err);
          return [] as ApiBranchResource[];
        }),
      ]);

      const resolvedBranches = branchesList.length > 0 ? branchesList : masterBranches;
      const mappedStaff = (staffList || []).map((s) => {
        const rawBranchId = (s.primaryBranchId || (s as any).primary_branch_id || '').trim();
        const rawFranchiseId = (s.franchiseId || (s as any).franchise_id || '').trim();
        const br = resolvedBranches.find(
          (b: any) => b.id && rawBranchId && b.id.toLowerCase() === rawBranchId.toLowerCase(),
        );
        return {
          ...s,
          branch: br?.name || s.branch || 'Assigned Branch',
          primaryBranchId: rawBranchId,
          franchiseId: rawFranchiseId || null,
        };
      });

      setRawAppointments(aptList || []);
      setStaffRoster(mappedStaff);
      setServicesCatalog(servicesList || []);
      setCustomersRoster(customersList || []);
      setResources(branchResources || []);
    } catch (err: any) {
      console.error('Failed to load operations data from database:', err);
      setLoadError(err.message || 'Failed to load operations data.');
    } finally {
      setIsLoading(false);
    }
  }, [defaultBranch, branchId, branchesList, franchiseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Map to FullAppointmentRecord
  const appointments = useMemo(() => {
    const resolvedBranches = branchesList.length > 0 ? branchesList : masterBranches;
    return rawAppointments.map((raw) =>
      mapApiToFullAppointment(
        raw,
        resolvedBranches,
        staffRoster,
        servicesCatalog,
        customersRoster,
        resources,
        defaultBranch !== 'All' ? defaultBranch : undefined,
      ),
    );
  }, [rawAppointments, branchesList, staffRoster, servicesCatalog, customersRoster, resources, defaultBranch]);

  // Subsets
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(() => {
    return appointments.filter((apt) => apt.date === todayStr);
  }, [appointments, todayStr]);

  const walkins = useMemo(() => {
    return appointments.filter((apt) => apt.bookingSource === 'Walk-in' || apt.notes?.toLowerCase().includes('walk-in'));
  }, [appointments]);

  const homeServices = useMemo(() => {
    return appointments.filter(
      (apt) => apt.serviceMode === 'Home Service' || apt.notes?.toLowerCase().includes('home service'),
    );
  }, [appointments]);

  const inServiceSessions = useMemo(() => {
    return appointments.filter(
      (apt) => apt.status === 'In Service' || apt.status === 'Checked-in' || apt.status === 'Confirmed',
    );
  }, [appointments]);

  // Dynamic Occupancy calculation
  const occupancyRate = useMemo(() => {
    if (appointments.length === 0) return 0;
    const activeChairs = Math.max(1, (branchesList.length || 1) * 6);
    const activeSlots = appointments.filter((a) => a.status !== 'Cancelled' && a.status !== 'No-show').length;
    return Math.min(100, Math.round((activeSlots / (activeChairs * 4)) * 100)) || 25;
  }, [appointments, branchesList.length]);

  // Counts object
  const counts = useMemo(
    () => ({
      appointments: appointments.length,
      walkins: walkins.length,
      homeServices: homeServices.length,
      inService: inServiceSessions.length,
      todayBookings: todayAppointments.length > 0 ? todayAppointments.length : appointments.length,
      occupancy: occupancyRate,
    }),
    [appointments.length, walkins.length, homeServices.length, inServiceSessions.length, todayAppointments.length, occupancyRate],
  );

  // Status update with persistence
  const handleUpdateStatus = useCallback(
    async (
      id: string,
      newStatus: FullAppointmentRecord['status'],
      updatedFields?: Partial<FullAppointmentRecord>,
    ) => {
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
        const rawTarget = rawAppointments.find((a) => a.id === id || a.bookingNumber === id);
        const targetId = rawTarget ? rawTarget.id : id;

        let serverUpdated: ApiAppointmentSummary | null = null;
        if (newStatus === 'In Service') {
          serverUpdated = await appointmentsApi.startService(targetId);
        } else if (newStatus === 'Completed') {
          serverUpdated = await appointmentsApi.completeService(targetId);
          const custId = rawTarget?.customerId || serverUpdated?.customerId;
          if (custId) {
            const amount = Number(rawTarget?.subtotalEstimate || serverUpdated?.subtotalEstimate || 0);
            customersApi.recordVisit(custId, amount).catch(() => {});
          }
        } else if (newStatus === 'Cancelled') {
          serverUpdated = await appointmentsApi.cancel(
            targetId,
            updatedFields?.notes || 'Cancelled by staff',
          );
        } else if (newStatus === 'Confirmed' && rawTarget?.status === 'CANCELLED') {
          serverUpdated = await appointmentsApi.confirm(targetId);
        } else {
          serverUpdated = await appointmentsApi.updateStatus(
            targetId,
            statusMap[newStatus] || newStatus,
          );
        }

        const resolvedStatus = serverUpdated?.status || statusMap[newStatus] || newStatus;
        const nowIso = new Date().toISOString();

        setRawAppointments((prev) =>
          prev.map((a) => {
            if (a.id === targetId || a.bookingNumber === id) {
              return {
                ...a,
                ...(serverUpdated || {}),
                status: resolvedStatus,
                ...(newStatus === 'Confirmed' ? { confirmedAt: nowIso } : {}),
                ...(newStatus === 'In Service' ? { confirmedAt: a.confirmedAt || nowIso } : {}),
                ...(newStatus === 'Completed' ? { completedAt: nowIso } : {}),
                ...(newStatus === 'Cancelled' ? { cancelledAt: nowIso } : {}),
              };
            }
            return a;
          }),
        );

        toast(`Appointment status changed to ${newStatus}.`);
      } catch (err: any) {
        console.error('Failed to update status on server:', err);
        toast(`Failed to update status: ${err.message || 'Server error'}`);
      }
    },
    [rawAppointments, toast],
  );

  return {
    appointments,
    rawAppointments,
    walkins,
    homeServices,
    inServiceSessions,
    todayAppointments,
    occupancyRate,
    counts,
    staffRoster,
    servicesCatalog,
    customersRoster,
    resources,
    branchesList,
    isLoading,
    loadError,
    refetch: loadData,
    handleUpdateStatus,
  };
}

export type OperationsData = ReturnType<typeof useOperationsData>;
