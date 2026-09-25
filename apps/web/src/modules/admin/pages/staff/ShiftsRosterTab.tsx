import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Filter,
  Plus,
  Send,
  ShieldCheck,
  Tag,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { staffApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { type FullStaffRecord, masterStaffRecords } from './StaffProfilePage';

export interface WeeklyRosterRow {
  staffId: string;
  staffName: string;
  role: string;
  branch: string;
  avatarInitials: string;
  mon: 'M' | 'G' | 'E' | 'OFF' | 'C';
  tue: 'M' | 'G' | 'E' | 'OFF' | 'C';
  wed: 'M' | 'G' | 'E' | 'OFF' | 'C';
  thu: 'M' | 'G' | 'E' | 'OFF' | 'C';
  fri: 'M' | 'G' | 'E' | 'OFF' | 'C';
  sat: 'M' | 'G' | 'E' | 'OFF' | 'C';
  sun: 'M' | 'G' | 'E' | 'OFF' | 'C';
  totalHours: number;
}

export const initialRosterData: WeeklyRosterRow[] = [];

export interface ShiftsRosterTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function ShiftsRosterTab({
  defaultBranch = 'All',
  lockBranch = false,
}: ShiftsRosterTabProps = {}) {
  const { toast } = useToast();
  const [rosterRows, setRosterRows] = useState<WeeklyRosterRow[]>(initialRosterData);
  const [liveStaff, setLiveStaff] = useState<FullStaffRecord[]>([]);
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [rosterStatus, setRosterStatus] = useState<'Draft' | 'Published'>('Published');
  const [currentWeek, setCurrentWeek] = useState('Week 34: 18 Aug – 24 Aug 2026');

  // Fetch live staff to build or populate roster
  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const staff = await staffApi.list();
        if (isMounted && Array.isArray(staff)) {
          setLiveStaff(staff);
          if (rosterRows.length === 0 && staff.length > 0) {
            const rows: WeeklyRosterRow[] = staff.map((s) => ({
              staffId: s.id,
              staffName: s.fullName,
              role: s.role,
              branch: s.branch || 'Main Branch',
              avatarInitials: s.avatarInitials,
              mon: 'M',
              tue: 'M',
              wed: 'OFF',
              thu: 'M',
              fri: 'M',
              sat: 'E',
              sun: 'OFF',
              totalHours: 45,
            }));
            setRosterRows(rows);
          }
        }
      } catch (err) {
        console.warn('Live staff roster fetch notice:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Add/Edit Shift Modal
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{
    staffId: string;
    day: keyof WeeklyRosterRow;
  } | null>(null);
  const [newShift, setNewShift] = useState({
    staffId: '',
    branch: masterBranches[0]?.name || '',
    shiftType: 'Morning' as 'Morning' | 'General' | 'Evening' | 'Custom' | 'Off',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    breakMinutes: 60,
  });

  const filteredRoster = rosterRows.filter(
    (r) => branchFilter === 'All' || r.branch === branchFilter,
  );

  const shiftBadge = (code: WeeklyRosterRow['mon']) => {
    switch (code) {
      case 'M':
        return (
          <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
            Morning
          </span>
        );
      case 'G':
        return (
          <span className="px-2 py-1 rounded-md bg-teal-100 text-teal-800 font-bold text-[10px]">
            General
          </span>
        );
      case 'E':
        return (
          <span className="px-2 py-1 rounded-md bg-purple-100 text-[#5A2EA6] font-bold text-[10px]">
            Evening
          </span>
        );
      case 'C':
        return (
          <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
            Custom
          </span>
        );
      case 'OFF':
        return (
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px]">
            OFF
          </span>
        );
      default:
        return null;
    }
  };

  const handleCellClick = (staffId: string, day: keyof WeeklyRosterRow) => {
    const row = rosterRows.find((r) => r.staffId === staffId);
    if (!row) return;

    const currentVal = row[day] as string;
    const cycle: WeeklyRosterRow['mon'][] = ['M', 'G', 'E', 'OFF'];
    const nextIdx = (cycle.indexOf(currentVal as WeeklyRosterRow['mon']) + 1) % cycle.length;
    const nextVal = cycle[nextIdx];

    setRosterRows((prev) =>
      prev.map((r) => (r.staffId === staffId ? { ...r, [day]: nextVal } : r)),
    );
    toast(`Updated shift for ${row.staffName} on ${day.toUpperCase()} to ${nextVal}`);
  };

  const handlePublishRoster = () => {
    setRosterStatus('Published');
    toast('Weekly Roster successfully published and pushed to mobile apps!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Shifts &amp; Weekly Roster Management
            </h2>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                rosterStatus === 'Published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800',
              )}
            >
              {rosterStatus} Roster
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Weekly multi-location staff rotation, conflict detection, shift assignment, and mobile
            push publishing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported weekly shift schedule to PDF & CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Roster</span>
          </Button>

          <Button
            onClick={handlePublishRoster}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Publish Roster</span>
          </Button>
        </div>
      </div>

      {/* Control & Week Switcher Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Week Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeek('Week 33: 11 Aug – 17 Aug 2026')}
            className="w-8 h-8 rounded-lg bg-[#FCFAFF] border border-purple-100 hover:bg-purple-50 grid place-items-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-soft" />
          </button>
          <div className="px-3.5 py-1.5 rounded-xl bg-[#FAF7FF] border border-purple-100/80 text-xs font-bold text-ink flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5A2EA6]" />
            <span>{currentWeek}</span>
          </div>
          <button
            onClick={() => setCurrentWeek('Week 35: 25 Aug – 31 Aug 2026')}
            className="w-8 h-8 rounded-lg bg-[#FCFAFF] border border-purple-100 hover:bg-purple-50 grid place-items-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 text-soft" />
          </button>
        </div>

        {/* Legend & Branch Filter */}
        <div className="flex items-center gap-3 text-xs font-medium text-muted flex-wrap justify-end">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Morning (09-06)
            <span className="w-2 h-2 rounded-full bg-teal-500 ml-2" /> General (10-07)
            <span className="w-2 h-2 rounded-full bg-purple-500 ml-2" /> Evening (12-09)
            <span className="w-2 h-2 rounded-full bg-slate-400 ml-2" /> OFF
          </div>

          {!lockBranch && <div className="h-4 w-px bg-slate-200 hidden sm:block" />}

          {!lockBranch && (
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Branch:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="All">All Branches</option>
                {masterBranches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Roster Calendar Grid Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Floor Roster Matrix &amp; Shift Assignments
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Click any shift pill to toggle through Morning, General, Evening, and Weekly Off
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Zero Scheduling Conflicts
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                <th className="p-3.5 pl-5 font-bold text-[9.5px] uppercase tracking-wider">
                  Specialist &amp; Role
                </th>
                {['Mon 18', 'Tue 19', 'Wed 20', 'Thu 21', 'Fri 22', 'Sat 23', 'Sun 24'].map((d) => (
                  <th
                    key={d}
                    className="p-3.5 font-bold text-[9.5px] uppercase tracking-wider text-center"
                  >
                    {d}
                  </th>
                ))}
                <th className="p-3.5 pr-5 font-bold text-[9.5px] uppercase tracking-wider text-right">
                  Weekly Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                        <CalendarClock className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-ink font-serif mb-1">
                        {branchFilter !== 'All'
                          ? 'No roster schedules for this branch'
                          : 'No staff shift schedules available'}
                      </h4>
                      <p className="text-xs text-muted mb-4 text-center max-w-xs">
                        {branchFilter !== 'All'
                          ? 'Try selecting All Branches or adding a new shift assignment.'
                          : 'Add your staff members first to create and publish weekly rosters.'}
                      </p>
                      <Button
                        onClick={() => setIsAddShiftOpen(true)}
                        className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a248c] text-white flex items-center gap-2 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Assign Shift / Roster</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRoster.map((row) => (
                  <tr
                    key={row.staffId}
                    className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                  >
                    {/* Staff Info */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          initials={row.avatarInitials}
                          className="w-8 h-8 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs"
                        />
                        <div>
                          <strong className="text-ink text-[13px] block">{row.staffName}</strong>
                          <span className="text-[10px] text-muted">{row.role}</span>
                        </div>
                      </div>
                    </td>

                    {/* 7 Days */}
                    {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                      <td
                        key={day}
                        className="p-3.5 text-center cursor-pointer hover:bg-purple-50/70 transition-colors"
                        onClick={() => handleCellClick(row.staffId, day)}
                        title="Click to cycle shift"
                      >
                        {shiftBadge(row[day])}
                      </td>
                    ))}

                    {/* Total Hours */}
                    <td className="p-3.5 pr-5 text-right font-bold text-ink">{row.totalHours} hrs</td>
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

export default ShiftsRosterTab;
