import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Briefcase,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function EmployeeFinancePage() {
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
  const [selectedProfileModal, setSelectedProfileModal] = useState<any>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<
    'payroll' | 'commission' | 'attendance' | 'documents'
  >('payroll');

  const [employeeFinances] = useState([
    {
      id: 'STF-101',
      employee: 'Vikram Kulkarni',
      designation: 'Senior Colorist',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      salary: '₹55,000.00',
      commission: '₹12,000.00',
      advance: '₹10,000.00',
      loan: '₹0.00',
      lastPayment: '2026-08-01 (₹61,100.00)',
      status: 'Active',
      payrollHistory: [
        {
          month: 'August 2026',
          basic: '₹40,000',
          allowance: '₹8,500',
          deduction: '₹4,400',
          net: '₹61,100',
          status: 'Paid',
        },
        {
          month: 'July 2026',
          basic: '₹40,000',
          allowance: '₹8,000',
          deduction: '₹4,000',
          net: '₹59,000',
          status: 'Paid',
        },
      ],
      commissionLedger: [
        {
          service: 'Keratin Smooth & Hair Spa',
          date: '2026-08-05',
          sales: '₹42,000',
          rate: '10%',
          amount: '₹4,200',
        },
        {
          service: 'Schwarzkopf Retail Supply',
          date: '2026-08-03',
          sales: '₹15,000',
          rate: '12%',
          amount: '₹1,800',
        },
      ],
      attendanceLog: {
        totalDays: 26,
        presentDays: 24,
        absentDays: 2,
        overtimeHours: '14.5 Hours',
        lopDeduction: '₹0.00',
      },
      documentsList: [
        { name: 'Official Offer & Appointment Letter', date: '2024-01-15', type: 'PDF' },
        { name: 'PAN & Aadhaar Verification KYC', date: '2024-01-16', type: 'PDF' },
        { name: 'HDFC Corporate Salary Account Passbook', date: '2024-01-16', type: 'PDF' },
        { name: 'Form 16 Tax Deduction Register (FY25)', date: '2025-05-30', type: 'PDF' },
      ],
    },
    {
      id: 'STF-102',
      employee: 'Pooja Kashyap',
      designation: 'Master Aesthetician',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      salary: '₹50,000.00',
      commission: '₹9,500.00',
      advance: '₹0.00',
      loan: '₹25,000.00',
      lastPayment: '2026-08-01 (₹50,700.00)',
      status: 'Active',
      payrollHistory: [
        {
          month: 'August 2026',
          basic: '₹35,000',
          allowance: '₹7,000',
          deduction: '₹3,800',
          net: '₹50,700',
          status: 'Paid',
        },
      ],
      commissionLedger: [
        {
          service: 'Hydra Facial & Skin Rejuvenation',
          date: '2026-08-04',
          sales: '₹38,000',
          rate: '8.5%',
          amount: '₹3,230',
        },
      ],
      attendanceLog: {
        totalDays: 26,
        presentDays: 25,
        absentDays: 1,
        overtimeHours: '8.0 Hours',
        lopDeduction: '₹0.00',
      },
      documentsList: [
        { name: 'Official Offer & Appointment Letter', date: '2024-03-10', type: 'PDF' },
        { name: 'PAN & Aadhaar Verification KYC', date: '2024-03-11', type: 'PDF' },
      ],
    },
    {
      id: 'STF-103',
      employee: 'Kavita Sundaram',
      designation: 'Hair Spa Specialist',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      salary: '₹42,000.00',
      commission: '₹7,200.00',
      advance: '₹5,000.00',
      loan: '₹15,000.00',
      lastPayment: '2026-08-01 (₹40,000.00)',
      status: 'Active',
      payrollHistory: [
        {
          month: 'August 2026',
          basic: '₹30,000',
          allowance: '₹5,500',
          deduction: '₹4,700',
          net: '₹40,000',
          status: 'Approved',
        },
      ],
      commissionLedger: [
        {
          service: 'Olaplex Bond Multiplier Spa',
          date: '2026-08-02',
          sales: '₹29,000',
          rate: '8%',
          amount: '₹2,320',
        },
      ],
      attendanceLog: {
        totalDays: 26,
        presentDays: 23,
        absentDays: 3,
        overtimeHours: '5.0 Hours',
        lopDeduction: '₹1,000.00',
      },
      documentsList: [
        { name: 'Official Offer & Appointment Letter', date: '2024-06-01', type: 'PDF' },
        { name: 'PAN & Aadhaar Verification KYC', date: '2024-06-02', type: 'PDF' },
      ],
    },
    {
      id: 'STF-104',
      employee: 'Suresh Varma',
      designation: 'Top Stylist',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      salary: '₹46,000.00',
      commission: '₹8,000.00',
      advance: '₹0.00',
      loan: '₹0.00',
      lastPayment: '2026-08-01 (₹45,000.00)',
      status: 'Active',
      payrollHistory: [
        {
          month: 'August 2026',
          basic: '₹32,000',
          allowance: '₹6,000',
          deduction: '₹3,500',
          net: '₹45,000',
          status: 'Generated',
        },
      ],
      commissionLedger: [
        {
          service: 'Gentlemen Signature Grooming',
          date: '2026-08-01',
          sales: '₹34,000',
          rate: '9%',
          amount: '₹3,060',
        },
      ],
      attendanceLog: {
        totalDays: 26,
        presentDays: 26,
        absentDays: 0,
        overtimeHours: '12.0 Hours',
        lopDeduction: '₹0.00',
      },
      documentsList: [
        { name: 'Official Offer & Appointment Letter', date: '2024-08-15', type: 'PDF' },
      ],
    },
  ]);

  const filteredStaff = employeeFinances.filter((s) => {
    const matchesBranch = isAllBranches || s.branchId === selectedBranchId;
    const matchesSearch =
      s.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Staff Financial Dossier &amp; KYC Vault
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Employee Profiles' : `${selectedBranch.shortName} Staff`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Individual staff compensation profiles, salary history, loan/advance EMI ledgers,
            commissions earned, and verified KYC compliance documents.
          </p>
        </div>

        <button
          onClick={() =>
            toast(
              `Export Staff Dossiers: Staff records for ${selectedBranch.shortName} exported to CSV.`,
            )
          }
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Staff Dossiers
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by staff code, name, designation, or branch location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* STAFF TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Staff Code &amp; Name</th>
                <th className="p-3">Salon Branch</th>
                <th className="p-3">Base Compensation</th>
                <th className="p-3">Commissions</th>
                <th className="p-3">Salary Advance</th>
                <th className="p-3">Company Loan</th>
                <th className="p-3">Last Disbursal</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredStaff.map((stf) => (
                <tr key={stf.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{stf.employee}</div>
                    <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-bold">
                      {stf.id} • {stf.designation}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {stf.branch}
                    </div>
                  </td>

                  <td className="p-3 font-bold text-ink">{stf.salary}</td>
                  <td className="p-3 font-bold text-purple-900">+{stf.commission}</td>
                  <td className="p-3 text-amber-800 font-semibold">{stf.advance}</td>
                  <td className="p-3 text-rose-700 font-semibold">{stf.loan}</td>
                  <td className="p-3 text-soft font-medium">{stf.lastPayment}</td>

                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {stf.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedProfileModal(stf)}
                      className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED PROFILE MODAL */}
      {selectedProfileModal &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-3xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Staff Financial Dossier: {selectedProfileModal.employee}
                  </h3>
                  <p className="text-xs text-soft font-mono">
                    {selectedProfileModal.id} • {selectedProfileModal.designation} •{' '}
                    {selectedProfileModal.branch}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProfileModal(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* TAB SELECTOR */}
              <div className="flex gap-2 border-b border-line pb-2">
                {[
                  { id: 'payroll', label: 'Payroll History' },
                  { id: 'commission', label: 'Commission Ledger' },
                  { id: 'attendance', label: 'Attendance & Overtime' },
                  { id: 'documents', label: 'KYC & Contracts' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeProfileTab === tab.id
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-pine/10 text-soft hover:text-ink border-0'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 text-xs">
                {activeProfileTab === 'payroll' && (
                  <div className="space-y-2">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-pine/5 text-soft uppercase font-semibold">
                            <th className="p-2">Pay Month</th>
                            <th className="p-2">Basic</th>
                            <th className="p-2">Allowances</th>
                            <th className="p-2">Deductions</th>
                            <th className="p-2">Net Salary</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/40">
                          {selectedProfileModal.payrollHistory.map((h: any, idx: number) => (
                            <tr key={idx}>
                              <td className="p-2 font-bold">{h.month}</td>
                              <td className="p-2">{h.basic}</td>
                              <td className="p-2">{h.allowance}</td>
                              <td className="p-2 text-rose-600">-{h.deduction}</td>
                              <td className="p-2 font-bold text-emerald-700">{h.net}</td>
                              <td className="p-2">
                                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800">
                                  {h.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'commission' && (
                  <div className="space-y-2">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-pine/5 text-soft uppercase font-semibold">
                            <th className="p-2">Service / Product</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Sales Value</th>
                            <th className="p-2">Rate %</th>
                            <th className="p-2">Commission Earned</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line/40">
                          {selectedProfileModal.commissionLedger.map((c: any, idx: number) => (
                            <tr key={idx}>
                              <td className="p-2 font-bold">{c.service}</td>
                              <td className="p-2 text-muted">{c.date}</td>
                              <td className="p-2">{c.sales}</td>
                              <td className="p-2">{c.rate}</td>
                              <td className="p-2 font-bold text-purple-900">+{c.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'attendance' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-pine/5 rounded-2xl border border-line">
                    <div>
                      <span className="text-[10px] font-bold text-soft uppercase">
                        Calendar Working Days
                      </span>
                      <div className="text-sm font-bold text-ink">
                        {selectedProfileModal.attendanceLog.totalDays} Days
                      </div>
                      <div className="text-emerald-700 font-semibold">
                        {selectedProfileModal.attendanceLog.presentDays} Days Present
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-soft uppercase">
                        Overtime &amp; LOP Deductions
                      </span>
                      <div className="text-sm font-bold text-purple-900">
                        {selectedProfileModal.attendanceLog.overtimeHours} Overtime
                      </div>
                      <div className="text-soft">
                        {selectedProfileModal.attendanceLog.lopDeduction} Loss of Pay
                      </div>
                    </div>
                  </div>
                )}

                {activeProfileTab === 'documents' && (
                  <div className="space-y-2">
                    {selectedProfileModal.documentsList.map((d: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-pine/5 rounded-xl border border-line flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-700" />
                          <div>
                            <div className="font-bold text-ink">{d.name}</div>
                            <div className="text-[9.5px] text-muted">Uploaded on {d.date}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toast(`Downloaded verified document: ${d.name}`)}
                          className="px-2.5 py-1 bg-white border border-line rounded-lg text-xs font-semibold text-purple-700 hover:bg-paper cursor-pointer"
                        >
                          Download {d.type}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setSelectedProfileModal(null)}
                  className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-xs"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
