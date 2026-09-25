import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  Layers,
  Phone,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Tag,
  User,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';
import { masterStaffRecords, type FullStaffRecord } from '../staff/StaffProfilePage';
import { AppointmentDetailsDrawer, type FullAppointmentRecord } from './AppointmentDetailsDrawer';
import { isStylistOrTherapist } from './AvailabilityTab';
import { type NewAppointmentData, NewAppointmentModal } from './NewAppointmentModal';
import { useOperationsData, type OperationsData } from './useOperationsData';
import { tokenStorage } from '@/shared/api/client';

export const initialAppointmentsList: FullAppointmentRecord[] = [
  {
    id: 'APT-1091',
    clientName: 'Akanksha Sharma',
    clientMobile: '+91 98200 44551',
    clientEmail: 'akanksha.sharma@gmail.com',
    isNewClient: false,
    serviceMode: 'In-Salon',
    travelSurcharge: 0,
    branch: 'Atelier Indrapuri Flagship',
    services: [
      {
        name: '7-Step Medical Hydra-Facial',
        category: 'Facial & Aesthetics',
        duration: 60,
        price: 4500,
      },
    ],
    staffId: 'EMP-1082',
    staffName: 'Ananya Deshmukh',
    date: '2026-08-18',
    time: '10:00 AM',
    durationMinutes: 60,
    totalDuration: 60,
    room: 'Clinical Suite #1',
    chair: 'Aesthetic Bed #1',
    equipment: 'Hydra-Facial MD Tower',
    totalAmount: 4500,
    estimatedAmount: 4500,
    depositRequired: true,
    depositAmount: 1125,
    depositPaid: 1125,
    balanceDue: 3375,
    paymentStatus: 'Paid',
    bookingSource: 'Online',
    notes: 'Client has mild rosacea, use gentle calming ampoule.',
    status: 'In Service',
    timeline: [
      { title: 'Booked via Website', time: '17 Aug, 08:00 PM', user: 'Client', status: 'Booked' },
      {
        title: 'Checked-in at Floor',
        time: '18 Aug, 09:55 AM',
        user: 'Front Desk',
        status: 'Checked-in',
      },
      {
        title: 'Treatment Protocol Started',
        time: '18 Aug, 10:02 AM',
        user: 'Ananya Deshmukh',
        status: 'In Service',
      },
    ],
    clientVisits: 14,
    lastVisit: '22 Jul 2026',
    membershipStatus: 'Royal Black Tier',
  },
  {
    id: 'APT-1092',
    clientName: 'Devendra Singhania',
    clientMobile: '+91 98110 33440',
    clientEmail: 'devendra.singhania@corp.in',
    isNewClient: false,
    serviceMode: 'In-Salon',
    travelSurcharge: 0,
    branch: 'Atelier Indrapuri Flagship',
    services: [
      {
        name: 'Executive Hot Towel Beard Sculpt',
        category: 'Barbering & Grooming',
        duration: 45,
        price: 1800,
      },
    ],
    staffId: 'EMP-1084',
    staffName: 'Sameer Sheikh',
    date: '2026-08-18',
    time: '11:30 AM',
    durationMinutes: 45,
    totalDuration: 45,
    room: 'Gentlemen’s Grooming Lounge',
    chair: 'Barber Chair #2',
    equipment: 'Standard Kit',
    totalAmount: 1800,
    estimatedAmount: 1800,
    depositRequired: false,
    depositAmount: 0,
    depositPaid: 0,
    balanceDue: 1800,
    paymentStatus: 'Pay at Salon',
    bookingSource: 'WhatsApp',
    notes: 'Straight razor finish requested.',
    status: 'Confirmed',
    timeline: [
      {
        title: 'Booked via WhatsApp concierge',
        time: '18 Aug, 08:30 AM',
        user: 'Concierge Bot',
        status: 'Confirmed',
      },
    ],
    clientVisits: 8,
    lastVisit: '04 Aug 2026',
    membershipStatus: 'Executive Member',
  },
  {
    id: 'APT-1093',
    clientName: 'Meera Nambiar',
    clientMobile: '+91 98450 77881',
    clientEmail: 'meera.nambiar@gmail.com',
    isNewClient: true,
    serviceMode: 'In-Salon',
    travelSurcharge: 0,
    branch: 'Atelier Koregaon Park Grand',
    services: [
      {
        name: 'Full Head Balayage & Keratin Infusion',
        category: 'Hair Art & Color',
        duration: 120,
        price: 7500,
      },
    ],
    staffId: 'EMP-1083',
    staffName: 'Rohit Verma',
    date: '2026-08-18',
    time: '02:00 PM',
    durationMinutes: 120,
    totalDuration: 120,
    room: 'Hair Art Studio',
    chair: 'Styling Chair #1',
    equipment: 'Infra-Red Processor',
    totalAmount: 7500,
    estimatedAmount: 7500,
    depositRequired: true,
    depositAmount: 2000,
    depositPaid: 2000,
    balanceDue: 5500,
    paymentStatus: 'Paid',
    bookingSource: 'Website',
    notes: 'First time balayage, consultation required.',
    status: 'Booked',
    timeline: [
      {
        title: 'Online Booking Confirmed',
        time: '18 Aug, 09:00 AM',
        user: 'Client',
        status: 'Booked',
      },
    ],
    clientVisits: 1,
    lastVisit: 'Never (New Guest)',
    membershipStatus: 'Non-Member',
  },
  {
    id: 'APT-1094',
    clientName: 'Pooja Kashyap',
    clientMobile: '+91 98980 22110',
    clientEmail: 'pooja.kashyap@outlook.com',
    isNewClient: false,
    serviceMode: 'In-Salon',
    travelSurcharge: 0,
    branch: 'Atelier Whitefield Studio',
    services: [
      {
        name: 'Sculpted Gel Extensions & French Ombre',
        category: 'Nails & Lashes',
        duration: 90,
        price: 3200,
      },
    ],
    staffId: 'EMP-1085',
    staffName: 'Kavita Iyer',
    date: '2026-08-18',
    time: '03:30 PM',
    durationMinutes: 90,
    totalDuration: 90,
    room: 'Nail Lounge Suite',
    chair: 'Nail Station #3',
    equipment: 'LED UV Gel System',
    totalAmount: 3200,
    estimatedAmount: 3200,
    depositRequired: true,
    depositAmount: 800,
    depositPaid: 800,
    balanceDue: 2400,
    paymentStatus: 'Paid',
    bookingSource: 'Call Centre',
    notes: 'French Ombre with Swarovski crystals.',
    status: 'Confirmed',
    timeline: [
      {
        title: 'Booked by Call Centre Agent',
        time: '17 Aug, 04:00 PM',
        user: 'Agent Priya',
        status: 'Confirmed',
      },
    ],
    clientVisits: 6,
    lastVisit: '18 Jul 2026',
    membershipStatus: 'Gold Member',
  },
  {
    id: 'APT-1095',
    clientName: 'Sanjay Malhotra',
    clientMobile: '+91 97840 55660',
    clientEmail: 'sanjay.m@malhotragroup.in',
    isNewClient: false,
    serviceMode: 'In-Salon',
    travelSurcharge: 0,
    branch: 'Atelier Jaipur Royal Spa',
    services: [
      {
        name: 'Royal Balinese Aromatherapy Massage',
        category: 'Spa & Wellness',
        duration: 75,
        price: 4200,
      },
    ],
    staffId: 'EMP-1086',
    staffName: 'Manish Rawat',
    date: '2026-08-18',
    time: '05:00 PM',
    durationMinutes: 75,
    totalDuration: 75,
    room: 'Royal Sanctuary Room',
    chair: 'Therapy Bed #1',
    equipment: 'Aroma Diffuser Tower',
    totalAmount: 4200,
    estimatedAmount: 4200,
    depositRequired: true,
    depositAmount: 1000,
    depositPaid: 1000,
    balanceDue: 3200,
    paymentStatus: 'Paid',
    bookingSource: 'Marketplace',
    notes: 'Extra shoulder pressure.',
    status: 'Checked-in',
    timeline: [
      {
        title: 'Marketplace Integration',
        time: '18 Aug, 10:00 AM',
        user: 'Nearbuy API',
        status: 'Booked',
      },
      {
        title: 'Checked-in at Concierge',
        time: '18 Aug, 04:45 PM',
        user: 'Front Desk',
        status: 'Checked-in',
      },
    ],
    clientVisits: 11,
    lastVisit: '10 Jul 2026',
    membershipStatus: 'Royal Black Tier',
  },
];

export interface AppointmentCalendarTabProps {
  defaultBranch?: string;
  branchId?: string;
  lockBranch?: boolean;
  operationsData?: OperationsData;
  franchiseId?: string;
}

export function AppointmentCalendarTab({
  defaultBranch = 'All',
  branchId,
  lockBranch = false,
  operationsData,
  franchiseId,
}: AppointmentCalendarTabProps = {}) {
  const fallbackOps = useOperationsData({ defaultBranch, lockBranch, franchiseId });
  const ops = operationsData || fallbackOps;
  const { toast } = useToast();
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [staffFilter, setStaffFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');

  // Appointments State from dynamic operations
  const appointments = ops.appointments;
  const branchesList = ops.branchesList.length > 0 ? ops.branchesList : masterBranches;
  const rawStaffList = ops.staffRoster.length > 0
    ? ops.staffRoster
    : masterStaffRecords;

  const currentFranchiseId =
    franchiseId ||
    tokenStorage.getFranchiseId() ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('digiflex_franchise_id') : null) ||
    undefined;

  const isFranchisePanel =
    typeof window !== 'undefined' && window.location.pathname.startsWith('/franchise');

  // Strictly filter staff to ONLY stylists and therapists (excluding branch managers, admins, receptionists, etc.)
  const staffList = useMemo(() => {
    return rawStaffList.filter((st) => {
      // Must be a Stylist / Therapist
      if (!isStylistOrTherapist(st)) return false;

      // In franchise panel: only show staff belonging to franchise
      if (isFranchisePanel) {
        if (!st.franchiseId) return false;
        if (
          currentFranchiseId &&
          st.franchiseId.toLowerCase().trim() !== currentFranchiseId.toLowerCase().trim()
        ) {
          return false;
        }
      }

      // Branch-level scoping
      if (lockBranch && defaultBranch && defaultBranch !== 'All') {
        const matchedBranch = branchesList.find(
          (b) => b.name === defaultBranch || b.id === defaultBranch,
        );
        const normLockBranch = defaultBranch.toLowerCase().trim();
        const matchesBranch =
          (st.branch && st.branch.toLowerCase().trim() === normLockBranch) ||
          (matchedBranch &&
            st.primaryBranchId &&
            st.primaryBranchId.toLowerCase().trim() === matchedBranch.id.toLowerCase().trim());
        if (!matchesBranch && (st.primaryBranchId || (st.branch && st.branch !== 'Assigned Branch'))) {
          return false;
        }
      } else if (branchFilter && branchFilter !== 'All') {
        const matchedB = branchesList.find(
          (b) => b.name === branchFilter || b.id === branchFilter,
        );
        const normFilter = branchFilter.toLowerCase().trim();
        const matchesB =
          (st.branch && st.branch.toLowerCase().trim() === normFilter) ||
          (matchedB &&
            st.primaryBranchId &&
            st.primaryBranchId.toLowerCase().trim() === matchedB.id.toLowerCase().trim());
        if (!matchesB && (st.primaryBranchId || (st.branch && st.branch !== 'All'))) {
          return false;
        }
      }

      return true;
    });
  }, [rawStaffList, isFranchisePanel, currentFranchiseId, lockBranch, defaultBranch, branchFilter, branchesList]);

  const displayedStaff = useMemo(() => {
    if (staffFilter === 'All') return staffList;
    return staffList.filter((st) => st.fullName === staffFilter || st.id === staffFilter);
  }, [staffList, staffFilter]);

  const [selectedAppointment, setSelectedAppointment] = useState<FullAppointmentRecord | null>(
    null,
  );
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);

  const timeHours = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const matchesBranch = branchFilter === 'All' || apt.branch === branchFilter;
      const matchesStaff = staffFilter === 'All' || apt.staffName === staffFilter;
      const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
      const matchesSearch =
        apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.services.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesBranch && matchesStaff && matchesStatus && matchesSearch;
    });
  }, [appointments, branchFilter, staffFilter, statusFilter, searchQuery]);

  const handleUpdateStatus = (
    id: string,
    newStatus: FullAppointmentRecord['status'],
    updatedFields?: Partial<FullAppointmentRecord>,
  ) => {
    ops.handleUpdateStatus(id, newStatus, updatedFields);
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({
        ...selectedAppointment,
        status: newStatus,
        ...updatedFields,
      });
    }
  };

  const handleNewBookingSuccess = (_newApt: NewAppointmentData) => {
    ops.refetch();
    toast('New appointment booked and saved to database successfully.');
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Appointment Master Calendar
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {filteredAppointments.length} Active Slots
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            {lockBranch
              ? `${defaultBranch} booking matrix, live chair occupancy, and specialist floor allocation schedule.`
              : 'Multi-branch booking matrix, live chair occupancy, and specialist floor allocation schedule.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Day / Week / Month Switcher */}
          <div className="flex items-center gap-1 bg-[#FCFAFF] p-1 rounded-xl border border-purple-100">
            {(['day', 'week', 'month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border-0',
                  calendarView === view
                    ? 'bg-[#5A2EA6] text-white shadow-xs'
                    : 'text-soft hover:text-ink',
                )}
              >
                {view} View
              </button>
            ))}
          </div>

          <Button
            onClick={() => setIsNewBookingOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-purple-100/70 shadow-3xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-full sm:w-48">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[34px] px-3 pl-8 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-2.5" />
          </div>

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
            </select>
          </div>

          {/* Specialist Filter */}
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Specialists ({staffList.length})</option>
              {staffList.map((s: FullStaffRecord) => (
                <option key={s.id} value={s.fullName}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-[#FCFAFF] border border-purple-100 hover:bg-purple-50 grid place-items-center cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-soft" />
          </button>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF7FF] border border-purple-100/80 text-xs font-bold text-ink flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#5A2EA6]" />
            <span>{selectedDate}</span>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#FCFAFF] border border-purple-100 hover:bg-purple-50 grid place-items-center cursor-pointer">
            <ChevronRight className="w-4 h-4 text-soft" />
          </button>
        </div>
      </div>

      {/* 1. DAY VIEW: Multi-Staff Resource Columns Grid */}
      {calendarView === 'day' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-white border border-[#5A2EA6]/15 shadow-xs">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[60px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Floor Roster &amp; Chair Scheduling Schedule ({new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {ops.occupancyRate}% Floor Occupancy Monitored
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  <th className="p-3 pl-4 w-24 font-bold text-[10px] uppercase border-r border-purple-100">
                    Time
                  </th>
                  {displayedStaff.length === 0 ? (
                    <th className="p-3 font-bold text-xs border-r border-purple-100 min-w-[200px] text-muted text-left">
                      No Stylist / Therapist Available
                    </th>
                  ) : (
                    displayedStaff.map((st: FullStaffRecord) => (
                      <th
                        key={st.id}
                        className="p-3 font-bold text-xs border-r border-purple-100 min-w-[200px]"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            initials={st.fullName?.slice(0, 2).toUpperCase() || 'SP'}
                            className="w-7 h-7 rounded-lg bg-purple-100 text-[#5A2EA6] text-xs font-bold"
                          />
                          <div className="text-left">
                            <strong className="text-ink text-xs block truncate">{st.fullName}</strong>
                            <span className="text-[9.5px] text-muted block truncate font-normal">
                              {st.role || st.jobTitle || 'Stylist / Therapist'}
                            </span>
                          </div>
                        </div>
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {displayedStaff.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="p-10 text-center text-xs text-muted font-medium bg-[#FCFAFF]"
                    >
                      No specialists with stylist or therapist job titles found for the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  timeHours.map((hour) => (
                    <tr key={hour} className="h-20 hover:bg-[#5A2EA6]/2">
                      {/* Time Column */}
                      <td className="p-3 pl-4 font-mono font-bold text-soft border-r border-purple-100 align-top text-[11px]">
                        {hour}
                      </td>

                      {/* Staff Columns */}
                      {displayedStaff.map((st: FullStaffRecord) => {
                        const matchedApt = filteredAppointments.find(
                          (a: FullAppointmentRecord) =>
                            (a.staffName === st.fullName || a.staffId === st.id) &&
                            (a.time.startsWith(hour.slice(0, 2)) || a.time.includes(hour.slice(0, 5))),
                        );

                        return (
                          <td
                            key={st.id}
                            className="p-2 border-r border-purple-100 align-top relative"
                          >
                            {matchedApt ? (
                              <div
                                onClick={() => setSelectedAppointment(matchedApt)}
                                className={cn(
                                  'p-2.5 rounded-xl border shadow-3xs cursor-pointer transition-all hover:scale-[1.02] space-y-1',
                                  matchedApt.status === 'In Service'
                                    ? 'bg-purple-100/90 border-[#5A2EA6] text-[#5A2EA6]'
                                    : matchedApt.status === 'Checked-in'
                                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                                      : matchedApt.status === 'Confirmed'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                        : 'bg-white border-purple-100 text-ink',
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <strong className="text-xs font-bold truncate block">
                                    {matchedApt.clientName}
                                  </strong>
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white/70">
                                    {matchedApt.durationMinutes}m
                                  </span>
                                </div>
                                <div className="text-[10px] truncate font-medium">
                                  {matchedApt.services[0]?.name}
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-muted pt-1 border-t border-black/5">
                                  <span>{matchedApt.room?.split('#')[0] || 'Main Station'}</span>
                                  <span className="font-bold text-[#5A2EA6]">
                                    {matchedApt.status}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full rounded-lg border border-dashed border-purple-100/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setIsNewBookingOpen(true)}
                                  className="text-[10px] text-[#5A2EA6] font-bold bg-purple-50 px-2 py-1 rounded cursor-pointer border-0"
                                >
                                  + Book Slot
                                </button>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. WEEK VIEW */}
      {calendarView === 'week' && (
        <div className="p-6 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-purple-50">
            <div>
              <h3 className="font-bold text-ink text-base">
                Weekly Appointment Volume Distribution
              </h3>
              <p className="text-xs text-muted">
                {lockBranch
                  ? `Weekly booking telemetry for ${defaultBranch}`
                  : 'Current weekly booking distribution across all active branch locations'}
              </p>
            </div>
            <span className="text-xs text-[#5A2EA6] font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              {filteredAppointments.length} Total Bookings Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const countForDay = filteredAppointments.filter((a) => {
                const d = new Date(a.date);
                // 1 = Mon, 7 = Sun
                const dayNum = d.getDay() === 0 ? 7 : d.getDay();
                return dayNum === idx + 1;
              }).length;

              return (
                <div
                  key={day}
                  className="p-4 rounded-2xl bg-[#FAF7FF] border border-purple-100 space-y-2 text-center"
                >
                  <strong className="text-xs font-bold text-ink block">{day}</strong>
                  <span className="text-2xl font-serif font-bold text-[#5A2EA6] block">
                    {countForDay}
                  </span>
                  <span className="text-[10px] text-muted block font-medium">
                    {countForDay > 0 ? `${countForDay} Bookings` : 'Open Capacity'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MONTH VIEW */}
      {calendarView === 'month' && (
        <div className="p-6 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-purple-50">
            <div>
              <h3 className="font-bold text-ink text-base">
                Monthly Occupancy &amp; Booking Telemetry
              </h3>
              <p className="text-xs text-muted">
                {filteredAppointments.length} Total Appointments · {ops.occupancyRate}% Chair Occupancy
              </p>
            </div>
          </div>
          <div className="p-4 bg-purple-50/60 rounded-xl text-xs text-purple-900 font-medium">
            Dynamic monthly floor performance computed in real-time from active tenant bookings.
          </div>
        </div>
      )}

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
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default AppointmentCalendarTab;
