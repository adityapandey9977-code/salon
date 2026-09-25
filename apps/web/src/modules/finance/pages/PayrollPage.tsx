import { useToast } from '@salon-spa-saas/ui';
import {
  Briefcase,
  Building2,
  Calculator,
  CheckCircle2,
  DollarSign,
  Download,
  Eye,
  FileText,
  Globe,
  Layers,
  MapPin,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function PayrollPage() {
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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  const payrollStatusList = ['Draft', 'Generated', 'Approved', 'Paid'];

  const [payrollList, setPayrollList] = useState<any[]>([]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setPayrollList(payrollList.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
    toast(`Payroll Status Updated: ${id} marked as [${newStatus}].`);
  };

  const filteredPayroll = payrollList.filter((p) => {
    const matchesBranch = isAllBranches || p.branchId === selectedBranchId;
    const matchesStatus =
      selectedStatusFilter === 'All Statuses' || p.status === selectedStatusFilter;
    const matchesSearch =
      p.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Staff Monthly Payroll &amp; Salary Slips
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches
                ? 'Consolidated Payroll Register'
                : `${selectedBranch.shortName} Payroll`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Execute monthly salary batches with Indian statutory deductions (PF 12%, ESI 0.75%, PT,
            TDS Section 192), stylist commissions, and printable pay slips.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              toast(
                'Execute All Disbursals: Sent batch to corporate banking gateway for approved slips.',
              )
            }
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve All &amp; Disburse
          </button>

          <button
            onClick={() =>
              toast(
                `Export Payroll Register: ${selectedBranch.shortName} pay slips exported to CSV.`,
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Payroll
          </button>
        </div>
      </div>

      {/* SEARCH AND STATUS FILTER */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by staff name, department, or branch location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Statuses">All Statuses</option>
          {payrollStatusList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* PAYROLL REGISTER TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Staff &amp; Dept</th>
                <th className="p-3">Branch Location</th>
                <th className="p-3">Basic Pay</th>
                <th className="p-3">Allowances (HRA+Travel)</th>
                <th className="p-3">Commission Incentive</th>
                <th className="p-3">Statutory Deductions</th>
                <th className="p-3">Net Disbursal (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredPayroll.map((pay) => (
                <tr key={pay.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-ink">
                    <div>{pay.employee}</div>
                    <div className="text-[10px] text-soft">{pay.department}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {pay.branch}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-ink">{pay.basicSalary}</td>
                  <td className="p-3 text-soft font-semibold">{pay.allowance}</td>
                  <td className="p-3 font-bold text-purple-900">+{pay.commission}</td>
                  <td className="p-3 text-rose-600 font-semibold">-{pay.deduction}</td>
                  <td className="p-3 font-bold text-emerald-700 text-sm">{pay.netSalary}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        pay.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : pay.status === 'Approved'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : pay.status === 'Generated'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {pay.status === 'Generated' && (
                      <button
                        onClick={() => handleUpdateStatus(pay.id, 'Approved')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Approve
                      </button>
                    )}
                    {pay.status === 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(pay.id, 'Paid')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Mark Paid
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedPayslip(pay)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer"
                    >
                      Payslip PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED PAYSLIP MODAL */}
      {selectedPayslip &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Official Salary Slip &amp; Tax Deduction Certificate
                  </h3>
                  <p className="text-xs text-soft">
                    Pay Period: August 2026 • Employee Code: {selectedPayslip.id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-pine/5 rounded-2xl border border-line">
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase">
                      Employee Legal Name
                    </span>
                    <div className="font-bold text-ink text-sm">{selectedPayslip.employee}</div>
                    <div className="text-[10px] text-soft">
                      {selectedPayslip.department} • {selectedPayslip.branch}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase">
                      Banking &amp; UAN Statutory
                    </span>
                    <div className="font-semibold text-ink">
                      {selectedPayslip.bankName} ({selectedPayslip.accountNumber})
                    </div>
                    <div className="text-[10px] text-muted font-mono">
                      IFSC: {selectedPayslip.ifsc} • UAN: {selectedPayslip.uan}
                    </div>
                  </div>
                </div>

                {/* EARNINGS VS DEDUCTIONS 2-COLUMN BREAKDOWN */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase block border-b border-emerald-200 pb-1">
                      Gross Earnings
                    </span>
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span className="font-bold">{selectedPayslip.basicSalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA Allowance:</span>
                      <span className="font-bold">{selectedPayslip.hra}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance Allowance:</span>
                      <span className="font-bold">{selectedPayslip.travel}</span>
                    </div>
                    <div className="flex justify-between text-purple-900 font-bold">
                      <span>Stylist Commissions:</span>
                      <span>+{selectedPayslip.incentive}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span>Performance Bonus:</span>
                      <span>+{selectedPayslip.bonus}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 bg-rose-50/50 rounded-2xl border border-rose-200">
                    <span className="text-[11px] font-bold text-rose-900 uppercase block border-b border-rose-200 pb-1">
                      Statutory Deductions
                    </span>
                    <div className="flex justify-between">
                      <span>Provident Fund (PF):</span>
                      <span className="font-bold text-rose-700">-{selectedPayslip.pf}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ESI Insurance:</span>
                      <span className="font-bold text-rose-700">-{selectedPayslip.esi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax (PT):</span>
                      <span className="font-bold text-rose-700">-{selectedPayslip.pt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TDS Income Tax (192):</span>
                      <span className="font-bold text-rose-700">-{selectedPayslip.tds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Loan / Advance EMI:</span>
                      <span className="font-bold text-rose-700">-{selectedPayslip.loan}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                      Net Salary Transferred to Bank Account
                    </span>
                    <div className="text-xl font-extrabold text-emerald-800">
                      {selectedPayslip.netSalary}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold">
                    {selectedPayslip.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() =>
                    toast(`Print Salary Slip: Downloaded PDF for ${selectedPayslip.employee}.`)
                  }
                  className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Download Payslip PDF
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPayslip(null)}
                  className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
