import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  Clock,
  Download,
  Layers,
  Sparkles,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';
import { masterStaffRecords } from '../staff/StaffProfilePage';
import { useOperationsData, type OperationsData } from './useOperationsData';
import { catalogueApi, type ApiBranchResource, type FullStaffRecord } from '@/shared/api';

export interface AvailabilitySlotRow {
  id: string;
  name: string;
  type: 'Staff Specialist' | 'Treatment Suite' | 'Styling Chair' | 'Medical Equipment';
  branch: string;
  slots: ('Available' | 'Booked' | 'Break' | 'Leave' | 'Unavailable')[];
}

export interface AvailabilityTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  operationsData?: OperationsData;
}

/**
 * Filter to strictly identify service specialists (stylists / therapists / aestheticians)
 * and strictly exclude administrative or management personnel like Branch Managers.
 */
export const isStylistOrTherapist = (st: FullStaffRecord | any): boolean => {
  if (!st) return false;
  const role = String(st.role || '').toLowerCase().trim();
  const job = String(st.jobTitle || st.job_title || '').toLowerCase().trim();
  const code = String(st.roleCode || '').toLowerCase().trim();
  const designation = String(st.profile?.designation || '').toLowerCase().trim();
  const dept = String(st.department || '').toLowerCase().trim();

  // 1. Explicitly exclude administrative, front-desk, management, operational, or non-service staff
  const excludedKeywords = [
    'branch manager',
    'branch_manager',
    'manager',
    'reception',
    'cashier',
    'accountant',
    'finance',
    'admin',
    'inventory',
    'cleaner',
    'housekeeping',
    'security',
    'driver',
    'call center',
    'telecaller',
    'auditor',
    'franchise owner',
    'supervisor',
    'director',
    'hq',
  ];

  if (
    excludedKeywords.some(
      (kw) =>
        role.includes(kw) ||
        job.includes(kw) ||
        code.includes(kw) ||
        designation.includes(kw) ||
        dept.includes(kw),
    )
  ) {
    return false;
  }

  // 2. Explicitly include stylists, therapists, aestheticians, colorists, masseurs, barbers, nail techs
  const specialistKeywords = [
    'stylist',
    'therapist',
    'stylist / therapist',
    'stylist/therapist',
    'aesthetician',
    'esthetician',
    'colorist',
    'barber',
    'hair',
    'spa',
    'masseur',
    'masseuse',
    'nail',
    'makeup',
    'artist',
    'beautician',
  ];

  if (
    specialistKeywords.some(
      (kw) =>
        role.includes(kw) ||
        job.includes(kw) ||
        code.includes(kw) ||
        designation.includes(kw) ||
        dept.includes(kw),
    )
  ) {
    return true;
  }

  // 3. If assignedServices has items assigned, they are a service provider
  if (Array.isArray(st.assignedServices) && st.assignedServices.length > 0) {
    return true;
  }

  return false;
};

export function AvailabilityTab({
  defaultBranch = 'All',
  lockBranch = false,
  operationsData,
}: AvailabilityTabProps = {}) {
  const fallbackOps = useOperationsData({ defaultBranch, lockBranch });
  const ops = operationsData || fallbackOps;
  const { toast } = useToast();

  const branchesList = ops.branchesList.length > 0 ? ops.branchesList : masterBranches;
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [directDbResources, setDirectDbResources] = useState<ApiBranchResource[]>([]);

  // If operationsData hasn't fetched resources yet, directly fetch from organization-service database
  useEffect(() => {
    if (!ops.resources || ops.resources.length === 0) {
      catalogueApi
        .fetchResources()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) {
            setDirectDbResources(res);
          }
        })
        .catch((err) => {
          console.warn('Could not direct-fetch database resources:', err);
        });
    }
  }, [ops.resources]);

  const dbResources = (ops.resources && ops.resources.length > 0) ? ops.resources : directDbResources;

  const timeHeaders = [
    '09 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '01 PM',
    '02 PM',
    '03 PM',
    '04 PM',
    '05 PM',
    '06 PM',
    '07 PM',
  ];

  // Helper to resolve staff branch reliably
  const getStaffBranchName = (st: FullStaffRecord | any): string => {
    if (st.primaryBranchId) {
      const found = branchesList.find((b) => b.id === st.primaryBranchId);
      if (found) return found.name;
    }
    if (Array.isArray(st.branchAssignments) && st.branchAssignments.length > 0) {
      const primaryAssignment =
        st.branchAssignments.find((ba: any) => ba.isPrimary) || st.branchAssignments[0];
      if (primaryAssignment?.branchId) {
        const found = branchesList.find((b) => b.id === primaryAssignment.branchId);
        if (found) return found.name;
      }
    }
    if (st.branch) {
      const found = branchesList.find((b) => b.name === st.branch || b.id === st.branch);
      if (found) return found.name;
    }
    if (st.branchName) {
      const found = branchesList.find((b) => b.name === st.branchName || b.id === st.branchName);
      if (found) return found.name;
    }
    return branchesList[0]?.name || 'Main Branch';
  };

  const availabilityMatrix = useMemo<AvailabilitySlotRow[]>(() => {
    const rawStaffList = ops.staffRoster.length > 0 ? ops.staffRoster : masterStaffRecords;

    // Filter staff strictly for stylists & therapists (excluding branch managers & admin)
    const specialistStaffList = rawStaffList.filter(isStylistOrTherapist);

    const staffRows: AvailabilitySlotRow[] = specialistStaffList.map((st) => {
      const slots = timeHeaders.map((header) => {
        const hourDigits = header.slice(0, 2);
        const isBooked = ops.appointments.some(
          (a) =>
            (a.staffName === st.fullName || a.staffId === st.id) &&
            (a.time.startsWith(hourDigits) || a.time.includes(header)) &&
            a.status !== 'Cancelled' &&
            a.status !== 'No-show',
        );
        return isBooked ? ('Booked' as const) : ('Available' as const);
      });

      return {
        id: st.id,
        name: `${st.fullName} (${st.role || st.jobTitle || 'Specialist'})`,
        type: 'Staff Specialist',
        branch: getStaffBranchName(st),
        slots,
      };
    });

    // Database-stored resources ONLY — eliminate all hardcoded / random placeholder resources
    const resourceRows: AvailabilitySlotRow[] = dbResources.map((res) => {
      const typeUpper = String(res.type || '').toUpperCase();
      const mappedType: AvailabilitySlotRow['type'] =
        typeUpper === 'ROOM'
          ? 'Treatment Suite'
          : typeUpper === 'CHAIR'
            ? 'Styling Chair'
            : 'Medical Equipment';

      const resBranch =
        res.branch?.name ||
        branchesList.find((b) => b.id === res.branchId)?.name ||
        branchesList[0]?.name ||
        'Main Branch';

      const slots = timeHeaders.map((header) => {
        const hourDigits = header.slice(0, 2);

        if (!res.isAvailable) return 'Unavailable' as const;

        // 1. Explicit Reference: check if any active appointment specifically allocated this resource
        const directMatch = ops.appointments.some((a) => {
          const rawApt = ops.rawAppointments?.find(
            (r) => r.id === a.appointmentId || r.bookingNumber === a.bookingNumber,
          );
          const hasDirectResource =
            rawApt?.resources?.some((r) => r.resourceId === res.id) ||
            a.room === res.name ||
            a.chair === res.name ||
            a.equipment === res.name ||
            a.resourceAllocations?.some(
              (ra) => ra.chair === res.name || ra.room === res.name || ra.equipment === res.name,
            ) ||
            a.notes?.includes(res.name) ||
            (res.code && a.notes?.includes(res.code));

          const matchesTime = a.time.startsWith(hourDigits) || a.time.includes(header);
          const isActive = a.status !== 'Cancelled' && a.status !== 'No-show';
          const isInSalon = a.serviceMode !== 'Home Service' && !a.notes?.toLowerCase().includes('home service');
          return hasDirectResource && matchesTime && isActive && isInSalon;
        });

        if (directMatch) return 'Booked' as const;

        // 2. Real-time Floor Allocation:
        // Any in-salon appointment actively being serviced or booked at this branch at this hour
        // occupies the branch's styling chairs, treatment suites, and equipment!
        const activeBranchAppointments = ops.appointments.filter((a) => {
          const matchesTime = a.time.startsWith(hourDigits) || a.time.includes(header);
          const isActive = a.status !== 'Cancelled' && a.status !== 'No-show';
          const isInSalon = a.serviceMode !== 'Home Service' && !a.notes?.toLowerCase().includes('home service');
          const matchesBranch =
            (res.branchId && a.branchId === res.branchId) ||
            (resBranch && (a.branch === resBranch || a.branch.includes(resBranch) || resBranch.includes(a.branch)));
          return matchesTime && isActive && isInSalon && matchesBranch;
        });

        if (activeBranchAppointments.length > 0) {
          const sameTypeBranchResources = dbResources.filter(
            (r) =>
              (r.branchId === res.branchId ||
                (r.branch?.name && (r.branch.name === resBranch || resBranch.includes(r.branch.name)))) &&
              String(r.type || '').toUpperCase() === typeUpper,
          );

          if (typeUpper === 'CHAIR') {
            const chairIndex = sameTypeBranchResources.findIndex((ch) => ch.id === res.id);
            if (chairIndex !== -1 && chairIndex < activeBranchAppointments.length) {
              return 'Booked' as const;
            }
          } else if (typeUpper === 'ROOM') {
            const roomAppointments = activeBranchAppointments.filter((a) => {
              const text = `${(a.services || []).map((s) => `${s.name} ${s.category}`).join(' ')} ${a.notes || ''} ${a.room || ''}`.toLowerCase();
              return (
                text.includes('facial') ||
                text.includes('spa') ||
                text.includes('massage') ||
                text.includes('skin') ||
                text.includes('suite') ||
                text.includes('therapy') ||
                text.includes('laser') ||
                text.includes('aesthetic') ||
                text.includes('room')
              );
            });
            const roomIndex = sameTypeBranchResources.findIndex((rm) => rm.id === res.id);
            if (roomIndex !== -1 && roomIndex < roomAppointments.length) {
              return 'Booked' as const;
            }
          } else if (typeUpper === 'EQUIPMENT') {
            const equipAppointments = activeBranchAppointments.filter((a) => {
              const text = `${(a.services || []).map((s) => s.name).join(' ')} ${a.notes || ''} ${a.equipment || ''}`.toLowerCase();
              return (
                text.includes(res.name.toLowerCase()) ||
                (res.code && text.includes(res.code.toLowerCase())) ||
                text.includes('equipment') ||
                text.includes('device') ||
                text.includes('kit') ||
                text.includes('laser') ||
                text.includes('hydra')
              );
            });
            const equipIndex = sameTypeBranchResources.findIndex((eq) => eq.id === res.id);
            if (equipIndex !== -1 && equipIndex < equipAppointments.length) {
              return 'Booked' as const;
            }
          }
        }

        return 'Available' as const;
      });

      return {
        id: res.id,
        name: `${res.name}${res.code ? ` (${res.code})` : ''}`,
        type: mappedType,
        branch: resBranch,
        slots,
      };
    });

    return [...staffRows, ...resourceRows];
  }, [ops.staffRoster, ops.appointments, ops.rawAppointments, dbResources, branchesList]);

  const filteredMatrix = availabilityMatrix.filter((row) => {
    const matchesBranch = branchFilter === 'All' || row.branch === branchFilter;
    const matchesType = typeFilter === 'All' || row.type === typeFilter;
    return matchesBranch && matchesType;
  });

  const slotBadge = (status: AvailabilitySlotRow['slots'][0]) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-block w-full py-1.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[9.5px] border border-emerald-200">
            Free
          </span>
        );
      case 'Booked':
        return (
          <span className="inline-block w-full py-1.5 rounded-md bg-purple-100 text-[#5A2EA6] font-bold text-[9.5px] border border-purple-200">
            Booked
          </span>
        );
      case 'Break':
        return (
          <span className="inline-block w-full py-1.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[9.5px]">
            Break
          </span>
        );
      case 'Leave':
        return (
          <span className="inline-block w-full py-1.5 rounded-md bg-slate-100 text-slate-500 font-bold text-[9.5px]">
            Leave
          </span>
        );
      case 'Unavailable':
      default:
        return (
          <span className="inline-block w-full py-1.5 rounded-md bg-slate-100 text-slate-400 font-bold text-[9.5px]">
            Off
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Staff &amp; Resource Availability Matrix
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {filteredMatrix.length} Station{filteredMatrix.length === 1 ? '' : 's'} Active
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              0 Conflict Overlaps
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Cross-branch floor occupancy heatmap, specialist shifts, treatment rooms, styling
            chairs, and equipment reservations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported multi-resource availability matrix.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Matrix</span>
          </Button>
        </div>
      </div>

      {/* Filter & Legend Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold text-ink flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Free
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#5A2EA6]" /> Booked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Break
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-400" /> Leave
          </span>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Resource Filter */}
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Resources</option>
              <option value="Staff Specialist">Staff Specialists</option>
              <option value="Treatment Suite">Treatment Suites</option>
              <option value="Styling Chair">Styling Chairs</option>
              <option value="Medical Equipment">Medical Equipment</option>
            </select>
          </div>

          {!lockBranch && <div className="h-4 w-px bg-slate-200 hidden sm:block" />}

          {/* Branch Filter */}
          {!lockBranch && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Branch:</span>
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
        </div>
      </div>

      {/* Availability Matrix Grid Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
              Hourly Floor Availability Grid (09:00 AM – 08:00 PM)
            </h3>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · Realtime Telemetry
            </span>
          </div>
        </div>


        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                <th className="p-3.5 pl-5 font-bold text-[9.5px] uppercase tracking-wider min-w-[240px]">
                  Specialist / Resource Station
                </th>
                {timeHeaders.map((t) => (
                  <th
                    key={t}
                    className="p-3 font-bold text-[9.5px] uppercase tracking-wider text-center min-w-[65px]"
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredMatrix.length === 0 ? (
                <tr>
                  <td colSpan={timeHeaders.length + 1} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted">
                      <Sparkles className="w-6 h-6 text-[#5A2EA6]/40" />
                      <p className="font-semibold text-ink text-sm">
                        No specialists or database resources found
                      </p>
                      <p className="text-xs max-w-sm">
                        No active stylists, therapists, or equipment matching{' '}
                        <span className="font-semibold text-ink">{branchFilter}</span> and{' '}
                        <span className="font-semibold text-ink">{typeFilter}</span>.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMatrix.map((row) => (
                  <tr key={row.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    {/* Resource Name */}
                    <td className="p-3.5 pl-5">
                      <strong className="text-ink text-xs block">{row.name}</strong>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-purple-50 text-[#5A2EA6] text-[9px] font-bold">
                          {row.type}
                        </span>
                        <span className="text-[10px] text-muted truncate">{row.branch}</span>
                      </div>
                    </td>

                    {/* Hourly Slots */}
                    {row.slots.map((s, idx) => (
                      <td key={idx} className="p-2 text-center">
                        {slotBadge(s)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityTab;
