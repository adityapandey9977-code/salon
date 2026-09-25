import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Globe,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Timer,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function AttendanceLeavePage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttFilter, setSelectedAttFilter] = useState('All Statuses');
  const [selectedLeaveFilter, setSelectedLeaveFilter] = useState('All Leave Types');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const attendanceStatusesList = ['Present', 'Absent', 'Late', 'Half Day', 'Leave'];
  const leaveTypesList = ['Casual', 'Sick', 'Paid', 'Unpaid'];

  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  const [form, setForm] = useState({
    employee: '',
    branch: 'Bandra West Flagship (Mumbai)',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00 AM',
    checkOut: '07:00 PM',
    attendance: 'Present',
    leaveType: 'None',
    overtime: '0.0 Hours',
  });

  const handleCreateAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employee) return;

    const newId = `ATT-${Math.floor(9900 + Math.random() * 99)}`;
    const newRecord = {
      id: newId,
      employee: form.employee,
      staffId: `STF-${Math.floor(100 + Math.random() * 90)}`,
      branch: form.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      date: form.date,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      attendance: form.attendance,
      leaveType: form.leaveType,
      overtime: form.overtime,
      lop: form.leaveType === 'Unpaid' || form.attendance === 'Absent' ? '₹1,000.00' : '₹0.00',
    };

    setAttendanceRecords([newRecord, ...attendanceRecords]);
    setIsLogModalOpen(false);
    setForm({
      employee: '',
      branch: 'Bandra West Flagship (Mumbai)',
      date: new Date().toISOString().split('T')[0],
      checkIn: '09:00 AM',
      checkOut: '07:00 PM',
      attendance: 'Present',
      leaveType: 'None',
      overtime: '0.0 Hours',
    });
    toast(
      `Attendance Logged: [${newId}] recorded for ${newRecord.employee}. Synced with payroll engine.`,
    );
  };

  const filteredAttendance = attendanceRecords.filter((a) => {
    const matchesBranch = isAllBranches || a.branchId === selectedBranchId;
    const matchesSearch =
      a.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.staffId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAtt = selectedAttFilter === 'All Statuses' || a.attendance === selectedAttFilter;
    const matchesLeave =
      selectedLeaveFilter === 'All Leave Types' || a.leaveType === selectedLeaveFilter;
    return matchesBranch && matchesSearch && matchesAtt && matchesLeave;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Biometric Attendance &amp; Leave Payroll Sync
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Attendance Feeds' : `${selectedBranch.shortName} Attendance`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Synchronize daily biometric check-ins, leave entitlements, overtime hours, and automatic
            Loss of Pay (LOP) payroll deductions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Log Manual Attendance
          </button>

          <button
            onClick={() =>
              toast(`Export Attendance: Logs for ${selectedBranch.shortName} exported to CSV.`)
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Sync Log
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by employee name, staff code, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={selectedAttFilter}
          onChange={(e) => setSelectedAttFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Statuses">All Attendance Statuses</option>
          {attendanceStatusesList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={selectedLeaveFilter}
          onChange={(e) => setSelectedLeaveFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Leave Types">All Leave Types</option>
          {leaveTypesList.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Staff Code &amp; Name</th>
                <th className="p-3">Salon Branch</th>
                <th className="p-3">Date</th>
                <th className="p-3">Check-In</th>
                <th className="p-3">Check-Out</th>
                <th className="p-3">Attendance Status</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Overtime</th>
                <th className="p-3 text-right">LOP Deduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredAttendance.map((a) => (
                <tr key={a.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{a.employee}</div>
                    <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                      {a.staffId}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {a.branch}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-ink">{a.date}</td>
                  <td className="p-3 text-soft font-mono">{a.checkIn}</td>
                  <td className="p-3 text-soft font-mono">{a.checkOut}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        a.attendance === 'Present'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : a.attendance === 'Late'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : a.attendance === 'Half Day'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {a.attendance}
                    </span>
                  </td>

                  <td className="p-3 text-soft font-medium">{a.leaveType}</td>
                  <td className="p-3 font-bold text-purple-900">{a.overtime}</td>
                  <td className="p-3 text-right font-bold text-rose-600">{a.lop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isLogModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Log Manual Attendance / Leave
                  </h3>
                  <p className="text-xs text-soft">
                    Record shift attendance or leave adjustment for payroll sync
                  </p>
                </div>
                <button
                  onClick={() => setIsLogModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAttendance} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Staff Member *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Kulkarni"
                      value={form.employee}
                      onChange={(e) => setForm({ ...form, employee: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Branch *
                    </label>
                    <select
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      {branches
                        .filter((b) => b.id !== 'all')
                        .map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.city})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Attendance Status *
                    </label>
                    <select
                      value={form.attendance}
                      onChange={(e) => setForm({ ...form, attendance: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      {attendanceStatusesList.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Leave Type
                    </label>
                    <select
                      value={form.leaveType}
                      onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      <option value="None">None</option>
                      {leaveTypesList.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Overtime Hours
                    </label>
                    <input
                      type="text"
                      value={form.overtime}
                      onChange={(e) => setForm({ ...form, overtime: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsLogModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Save Attendance Log
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
