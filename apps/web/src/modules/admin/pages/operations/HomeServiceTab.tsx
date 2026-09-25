import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Download,
  KeyRound,
  MapPin,
  Navigation,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import { masterStaffRecords } from '../staff/StaffProfilePage';
import { useOperationsData, type OperationsData } from './useOperationsData';

export interface HomeServiceArea {
  id: string;
  name: string;
  region: string;
  branch: string;
  coverageRadiusKm: number;
  travelFee: number;
  minOrderValue: number;
  status: 'Active' | 'Inactive';
}

export const initialHomeAreas: HomeServiceArea[] = [
  {
    id: 'AREA-01',
    name: 'Arera Colony & E-8 Extension',
    region: 'Bhopal South',
    branch: 'Atelier Indrapuri Flagship',
    coverageRadiusKm: 12,
    travelFee: 250,
    minOrderValue: 2000,
    status: 'Active',
  },
  {
    id: 'AREA-02',
    name: 'Koregaon Park & Kalyani Nagar',
    region: 'Pune East',
    branch: 'Atelier Koregaon Park Grand',
    coverageRadiusKm: 15,
    travelFee: 350,
    minOrderValue: 2500,
    status: 'Active',
  },
  {
    id: 'AREA-03',
    name: 'Whitefield & ITPL Corridor',
    region: 'Bengaluru East',
    branch: 'Atelier Whitefield Studio',
    coverageRadiusKm: 18,
    travelFee: 400,
    minOrderValue: 3000,
    status: 'Active',
  },
];

export interface MobileAssignment {
  id: string;
  appointmentId: string;
  clientName: string;
  clientMobile: string;
  address: string;
  service: string;
  assignedStaff: string;
  date: string;
  time: string;
  routeStatus: 'Planned' | 'On the Way' | 'Arrived' | 'In Service' | 'Completed' | 'Delayed';
  geoCheckIn: string;
  geoCheckOut: string;
  otpStatus: 'Verified' | 'Pending OTP' | 'Expired';
}

export interface HomeServiceTabProps {
  operationsData?: OperationsData;
}

export function HomeServiceTab({ operationsData }: HomeServiceTabProps = {}) {
  const fallbackOps = useOperationsData();
  const ops = operationsData || fallbackOps;
  const { toast } = useToast();

  const branchesList = ops.branchesList.length > 0 ? ops.branchesList : masterBranches;

  const [activeSubTab, setActiveSubTab] = useState<'areas' | 'assignments' | 'routes' | 'geo'>(
    'assignments',
  );

  const dynamicAreas: HomeServiceArea[] = React.useMemo(() => {
    return branchesList.map((b, idx) => ({
      id: `AREA-0${idx + 1}`,
      name: `${b.name} Coverage Zone`,
      region: (b as any).city || 'Metropolitan Core',
      branch: b.name,
      coverageRadiusKm: 15,
      travelFee: 350,
      minOrderValue: 2500,
      status: 'Active',
    }));
  }, [branchesList]);

  const [localAreas, setLocalAreas] = useState<HomeServiceArea[]>([]);
  const areas = localAreas.length > 0 ? localAreas : dynamicAreas;

  const dynamicAssignments: MobileAssignment[] = React.useMemo(() => {
    const targetApts = ops.homeServices.length > 0 ? ops.homeServices : ops.appointments.slice(0, 2);
    return targetApts.map((apt, idx) => ({
      id: `MOB-0${idx + 1}`,
      appointmentId: apt.id,
      clientName: apt.clientName,
      clientMobile: apt.clientMobile,
      address: apt.notes?.includes('Address:')
        ? apt.notes.split('Address:')[1]?.trim()
        : `${apt.branch} Service Perimeter`,
      service: apt.services[0]?.name || 'Specialized Doorstep Protocol',
      assignedStaff: apt.staffName || 'Concierge Specialist',
      date: apt.date,
      time: apt.time,
      routeStatus: (apt.status === 'Completed'
        ? 'Completed'
        : apt.status === 'In Service'
          ? 'In Service'
          : 'On the Way') as MobileAssignment['routeStatus'],
      geoCheckIn: apt.status === 'In Service' || apt.status === 'Completed' ? '10:55 AM (Verified ✓)' : '—',
      geoCheckOut: apt.status === 'Completed' ? '12:30 PM (Verified ✓)' : '—',
      otpStatus: (apt.status === 'Completed' ? 'Verified' : 'Pending OTP') as MobileAssignment['otpStatus'],
    }));
  }, [ops.homeServices, ops.appointments]);

  const [localAssignments, setLocalAssignments] = useState<MobileAssignment[]>([]);
  const assignments = localAssignments.length > 0 ? localAssignments : dynamicAssignments;

  // OTP Demo state
  const [otpInput, setOtpInput] = useState('');
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [newArea, setNewArea] = useState({
    name: '',
    region: 'Central Zone',
    branch: branchesList[0]?.name || 'Main Branch',
    coverageRadiusKm: 15,
    travelFee: 300,
    minOrderValue: 2500,
  });

  const handleVerifyOtp = (id: string) => {
    if (otpInput === '8842' || otpInput.length === 4) {
      setLocalAssignments((prev) => {
        const base = prev.length > 0 ? prev : dynamicAssignments;
        return base.map((a) =>
          a.id === id ? { ...a, otpStatus: 'Verified', routeStatus: 'Completed' } : a,
        );
      });
      const target = assignments.find((a) => a.id === id);
      if (target?.appointmentId) {
        ops.handleUpdateStatus(target.appointmentId, 'Completed');
      }
      setOtpInput('');
      toast('Client OTP verified! Service completion authenticated.');
    } else {
      toast('Please enter valid 4-digit client OTP (e.g. 8842)');
    }
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.name) return;

    const created: HomeServiceArea = {
      id: `AREA-0${areas.length + 1}`,
      name: newArea.name,
      region: newArea.region,
      branch: newArea.branch,
      coverageRadiusKm: newArea.coverageRadiusKm,
      travelFee: newArea.travelFee,
      minOrderValue: newArea.minOrderValue,
      status: 'Active',
    };

    setLocalAreas([...areas, created]);
    setIsAddAreaOpen(false);
    toast(`Service zone "${created.name}" registered successfully.`);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Home Service &amp; Mobile Salon Operations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              Multi-City Doorstep Luxury
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Service area radii, mobile stylist dispatch, route tracking, simulated geo-fencing, and
            client OTP completion.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => setIsAddAreaOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service Area</span>
          </Button>
        </div>
      </div>

      {/* Sub-Tabs Switcher Bar */}
      <div className="bg-white p-1.5 rounded-[22px] border border-[#5A2EA6]/15 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'assignments', label: 'Mobile Assignments', icon: Car, count: assignments.length },
          { id: 'routes', label: 'Routes & Live Tracking', icon: Navigation },
          { id: 'geo', label: 'Geo Check-in & Client OTP', icon: KeyRound },
          { id: 'areas', label: 'Service Areas & Travel Fees', icon: MapPin, count: areas.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0 whitespace-nowrap flex items-center gap-2',
                activeSubTab === tab.id
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-soft hover:text-ink hover:bg-purple-50/50',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-md text-[10px] font-bold',
                    activeSubTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-purple-50 text-[#5A2EA6]',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. MOBILE ASSIGNMENTS */}
      {activeSubTab === 'assignments' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Scheduled Doorstep Appointments &amp; Dispatched Staff
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                18 Aug 2026 Mobile Roster
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Apt ID & Slot',
                    'Client & Contact',
                    'Destination Address',
                    'Doorstep Treatment',
                    'Assigned Specialist',
                    'Route Status',
                    'OTP State',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 6 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {assignments.map((m) => (
                  <tr key={m.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink font-mono text-xs block">
                        {m.appointmentId}
                      </strong>
                      <span className="text-[10px] text-muted">
                        {m.date} · {m.time}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <strong className="text-ink text-xs block">{m.clientName}</strong>
                      <span className="text-[10px] text-muted">{m.clientMobile}</span>
                    </td>
                    <td className="p-3.5 text-soft max-w-xs truncate">{m.address}</td>
                    <td className="p-3.5 font-semibold text-ink text-xs">{m.service}</td>
                    <td className="p-3.5 text-ink font-medium">{m.assignedStaff}</td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          m.routeStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.routeStatus === 'On the Way'
                              ? 'bg-purple-100 text-[#5A2EA6]'
                              : 'bg-amber-100 text-amber-800',
                        )}
                      >
                        {m.routeStatus}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          m.otpStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800',
                        )}
                      >
                        {m.otpStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ROUTES & TRACKING */}
      {activeSubTab === 'routes' && (
        <div className="p-6 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
          <h3 className="font-serif text-[17px] text-ink font-bold">
            Doorstep Route Sequence &amp; Travel Pacing
          </h3>
          <div className="space-y-3">
            {assignments.map((m, idx) => (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-[#FAF7FF] border border-purple-100 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6] text-white grid place-items-center font-bold text-xs shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-sm">
                      {m.clientName} ({m.appointmentId})
                    </h4>
                    <p className="text-xs text-muted">{m.address}</p>
                    <span className="text-[10px] text-[#5A2EA6] font-bold">
                      {m.service} · Dispatched: {m.assignedStaff}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink block">{m.time} Slot</span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      ~18 Mins Est. Travel Time
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-[#5A2EA6] font-bold text-xs">
                    {m.routeStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GEO CHECK-IN & CLIENT OTP */}
      {activeSubTab === 'geo' && (
        <div className="p-6 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-5">
          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
            Mobile staff must complete GPS geofence arrival check-in and input client 4-digit
            completion OTP to verify authentic doorstep service delivery.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-[22px] bg-white border border-purple-100 shadow-3xs space-y-3"
              >
                <div className="flex justify-between items-center pb-2 border-b border-purple-50">
                  <div>
                    <strong className="text-ink text-sm block">{m.clientName}</strong>
                    <span className="text-[10px] text-muted font-mono">{m.appointmentId}</span>
                  </div>
                  <span
                    className={cn(
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                      m.otpStatus === 'Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800',
                    )}
                  >
                    {m.otpStatus}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-muted">
                    <span>Assigned Specialist:</span>
                    <strong className="text-ink">{m.assignedStaff}</strong>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Geo Check-in Time:</span>
                    <strong className="text-ink">{m.geoCheckIn || '10:55 AM (Verified ✓)'}</strong>
                  </div>
                </div>

                {m.otpStatus === 'Pending OTP' ? (
                  <div className="pt-2 border-t border-purple-50 space-y-2">
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                      Enter 4-Digit Client OTP (Demo: 8842)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="8842"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="h-10 w-28 px-3 rounded-xl border border-purple-200 text-center font-mono font-bold text-sm tracking-widest text-ink focus:outline-none"
                      />
                      <Button
                        onClick={() => handleVerifyOtp(m.id)}
                        className="h-10 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] text-white"
                      >
                        Verify OTP
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Client OTP Authenticated &amp; Delivery Finalized</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SERVICE AREAS */}
      {activeSubTab === 'areas' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Configured Service Radius &amp; Travel Fee Tariffs
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {areas.length} Active Geofences
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Service Area & Region',
                    'Assigned Hub Branch',
                    'Coverage Radius',
                    'Travel Surcharge Fee',
                    'Min. Order Value',
                    'Status',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === 5 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {areas.map((a) => (
                  <tr key={a.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-xs block">{a.name}</strong>
                      <span className="text-[10px] text-muted">{a.region}</span>
                    </td>
                    <td className="p-3.5 text-soft">{a.branch}</td>
                    <td className="p-3.5 font-bold text-ink">{a.coverageRadiusKm} km Radius</td>
                    <td className="p-3.5 font-serif font-bold text-[#5A2EA6]">₹{a.travelFee}</td>
                    <td className="p-3.5 font-serif text-ink">₹{a.minOrderValue}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Service Area Modal */}
      {isAddAreaOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100 w-full max-w-lg p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <h3 className="font-serif text-[18px] text-ink font-bold">
                  Configure Home Service Area
                </h3>
                <button
                  onClick={() => setIsAddAreaOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddArea} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Area Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newArea.name}
                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    placeholder="e.g. Jubilee Hills & Madhapur"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Hub Branch
                    </label>
                    <select
                      value={newArea.branch}
                      onChange={(e) => setNewArea({ ...newArea, branch: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    >
                      {masterBranches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Radius (KM)
                    </label>
                    <input
                      type="number"
                      value={newArea.coverageRadiusKm}
                      onChange={(e) =>
                        setNewArea({ ...newArea, coverageRadiusKm: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Travel Surcharge (₹)
                    </label>
                    <input
                      type="number"
                      value={newArea.travelFee}
                      onChange={(e) =>
                        setNewArea({ ...newArea, travelFee: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Min Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={newArea.minOrderValue}
                      onChange={(e) =>
                        setNewArea({ ...newArea, minOrderValue: Number(e.target.value) })
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddAreaOpen(false)}
                    className="h-9 px-4 rounded-xl text-soft hover:bg-slate-100 cursor-pointer border border-slate-200 bg-white font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-9 px-5 rounded-xl bg-[#5A2EA6] text-white font-bold"
                  >
                    Save Service Area
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default HomeServiceTab;
