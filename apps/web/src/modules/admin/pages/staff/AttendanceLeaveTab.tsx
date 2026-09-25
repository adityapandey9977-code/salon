import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  ShieldCheck,
  Tag,
  X,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { staffApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { type FullStaffRecord, masterStaffRecords } from './StaffProfilePage';

export interface LeaveRequestRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  branch: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Annual Vacation' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  submittedDate: string;
}

export const initialLeaveRequests: LeaveRequestRecord[] = [];

export interface DailyAttendanceRecord {
  id: string;
  staffName: string;
  staffId: string;
  branch: string;
  date: string;
  shift: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Weekly Off' | 'Absent';
}

export const initialAttendanceRecords: DailyAttendanceRecord[] = [];

export interface AttendanceLeaveTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function AttendanceLeaveTab({
  defaultBranch = 'All',
  lockBranch = false,
}: AttendanceLeaveTabProps = {}) {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'leave'>('attendance');
  const [attendanceRecords, setAttendanceRecords] =
    useState<DailyAttendanceRecord[]>(initialAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>(initialLeaveRequests);
  const [liveStaff, setLiveStaff] = useState<FullStaffRecord[]>([]);
  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch live staff & leaves
  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const staff = await staffApi.list();
        if (isMounted && Array.isArray(staff)) {
          setLiveStaff(staff);
          if (attendanceRecords.length === 0 && staff.length > 0) {
            const attList: DailyAttendanceRecord[] = staff.map((s, idx) => ({
              id: `ATT-0${idx + 1}`,
              staffName: s.fullName,
              staffId: s.id,
              branch: s.branch || 'Main Branch',
              date: 'Today',
              shift: s.currentShift || 'Morning (09-06)',
              checkIn: s.status === 'Active' ? '09:00 AM' : '—',
              checkOut: '—',
              workingHours: s.status === 'Active' ? 'Ongoing' : '0h 00m',
              status: s.status === 'Active' ? 'Present' : s.status === 'On Leave' ? 'On Leave' : 'Absent',
            }));
            setAttendanceRecords(attList);
          }
        }

        const leaves = await staffApi.getLeaves();
        if (isMounted && Array.isArray(leaves) && leaves.length > 0) {
          setLeaveRequests(leaves);
        }
      } catch (err) {
        console.warn('Live attendance / leave fetch notice:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Apply Leave Modal
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    staffId: '',
    leaveType: 'Casual Leave' as LeaveRequestRecord['leaveType'],
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    reason: '',
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const st = masterStaffRecords.find((s) => s.id === newLeave.staffId) || masterStaffRecords[0];
    if (!st) {
      toast('Please ensure staff records are available');
      return;
    }

    const created: LeaveRequestRecord = {
      id: `LV-880${leaveRequests.length + 3}`,
      staffId: st.id,
      staffName: st.fullName,
      role: st.role,
      branch: st.branch,
      leaveType: newLeave.leaveType,
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      daysCount: 2,
      reason: newLeave.reason || 'Personal leave request',
      status: 'Pending',
      submittedDate: 'Today',
    };

    setLeaveRequests([created, ...leaveRequests]);
    setIsApplyLeaveOpen(false);
    toast(`Leave application submitted for ${created.staffName}.`);
  };

  const handleLeaveAction = (id: string, nextStatus: LeaveRequestRecord['status']) => {
    setLeaveRequests((prev) => prev.map((l) => (l.id === id ? { ...l, status: nextStatus } : l)));
    toast(`Leave request #${id} marked as ${nextStatus}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Attendance &amp; Leave Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              98.2% Brand Attendance Rate
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Biometric check-in/out logs, shift punch telemetry, overtime tracking, and leave
            entitlement workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={() => toast('Exported attendance and leave logs to CSV.')}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </Button>

          <Button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </Button>
        </div>
      </div>

      {/* Sub-Switch & Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-[#FCFAFF] p-1 rounded-xl border border-purple-100">
          <button
            onClick={() => setActiveSubTab('attendance')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
              activeSubTab === 'attendance'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            Daily Attendance Logs ({attendanceRecords.length})
          </button>
          <button
            onClick={() => setActiveSubTab('leave')}
            className={cn(
              'px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0',
              activeSubTab === 'leave'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            Leave Requests ({leaveRequests.length})
          </button>
        </div>

        {!lockBranch && (
          <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
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
          </div>
        )}
      </div>

      {/* 1. Daily Attendance Table */}
      {activeSubTab === 'attendance' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Live Biometric Attendance &amp; Shift Punch Records
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                18 Aug 2026 · Realtime Floor Check-Ins
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Staff & ID',
                    ...(!lockBranch ? ['Branch Location'] : []),
                    'Scheduled Shift',
                    'Check-In',
                    'Check-Out',
                    'Working Hours',
                    'Status',
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
                {attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={lockBranch ? 6 : 7} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                          <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-ink font-serif mb-1">
                          No attendance records logged today
                        </h4>
                        <p className="text-xs text-muted max-w-xs">
                          Biometric check-ins and shift punches will display here in real time.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((att) => (
                    <tr key={att.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      <td className="p-3.5 pl-5">
                        <strong className="text-ink text-[13px] block">{att.staffName}</strong>
                        <span className="text-[10px] text-muted font-mono">{att.staffId}</span>
                      </td>
                      {!lockBranch && <td className="p-3.5 text-soft">{att.branch}</td>}
                      <td className="p-3.5 font-semibold text-ink">{att.shift}</td>
                      <td className="p-3.5 font-mono text-ink font-bold">{att.checkIn}</td>
                      <td className="p-3.5 font-mono text-muted">{att.checkOut}</td>
                      <td className="p-3.5 font-bold text-ink">{att.workingHours}</td>
                      <td className="p-3.5 pr-5 text-right">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Leave Management Table */}
      {activeSubTab === 'leave' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Staff Leave Applications &amp; Vacation Requests
              </h3>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {leaveRequests.length} Requests Pending
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    lockBranch ? 'Staff Member' : 'Staff & Branch',
                    'Leave Type',
                    'Duration Dates',
                    'Days',
                    'Reason',
                    'Status',
                    'Actions',
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
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center">
                      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center mb-3 shadow-2xs">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-ink font-serif mb-1">
                          No pending leave requests
                        </h4>
                        <p className="text-xs text-muted mb-4 text-center max-w-xs">
                          All staff leave applications and vacation approvals will appear here.
                        </p>
                        <Button
                          onClick={() => setIsApplyLeaveOpen(true)}
                          className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a248c] text-white flex items-center gap-2 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Apply Leave Request</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((leave) => (
                    <tr
                      key={leave.id}
                      className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                    >
                      <td className="p-3.5 pl-5">
                        <strong className="text-ink text-[13px] block">{leave.staffName}</strong>
                        {!lockBranch && (
                          <span className="text-[10px] text-muted">{leave.branch}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-[#5A2EA6] font-bold text-[10px] border border-purple-100">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="p-3.5 text-soft text-xs">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="p-3.5 font-bold text-ink">{leave.daysCount} Days</td>
                      <td className="p-3.5 text-muted text-xs italic max-w-xs truncate">
                        {leave.reason}
                      </td>
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
                              onClick={() => handleLeaveAction(leave.id, 'Approved')}
                              className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer border-0"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => handleLeaveAction(leave.id, 'Rejected')}
                              className="h-7 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1 cursor-pointer border-0"
                            >
                              <X className="w-3 h-3" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* 1. Apply Leave Modal */}
      {isApplyLeaveOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold">Apply Staff Leave</h3>
                  <p className="text-[11px] text-muted">
                    Submit authorized leave request with date verification
                  </p>
                </div>
                <button
                  onClick={() => setIsApplyLeaveOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Select Staff Member *
                  </label>
                  <select
                    value={newLeave.staffId}
                    onChange={(e) => setNewLeave({ ...newLeave, staffId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    {masterStaffRecords.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.role}) — {s.branch}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Leave Type
                    </label>
                    <select
                      value={newLeave.leaveType}
                      onChange={(e) =>
                        setNewLeave({
                          ...newLeave,
                          leaveType: e.target.value as LeaveRequestRecord['leaveType'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Annual Vacation">Annual Vacation</option>
                      <option value="Unpaid Leave">Unpaid Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Reason for Leave
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="State reason for absence..."
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsApplyLeaveOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Submit Application
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

export default AttendanceLeaveTab;
