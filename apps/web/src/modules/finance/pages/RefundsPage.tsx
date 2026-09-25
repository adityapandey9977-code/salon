import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Globe,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function RefundsPage() {
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
  const [selectedReasonFilter, setSelectedReasonFilter] = useState('All Reasons');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedRefundDetail, setSelectedRefundDetail] = useState<any>(null);

  const refundReasonsList = [
    'Duplicate Payment',
    'Cancelled Service',
    'Service Complaint',
    'Wrong Billing',
    'Package Cancellation',
  ];

  const [refunds, setRefunds] = useState([
    {
      id: 'REF-401',
      date: '2026-08-07',
      invoice: 'INV-2026-9750',
      customer: 'Ananya Roy',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      reason: 'Cancelled Service',
      amount: '₹1,500.00',
      requestedBy: 'Vikram Kulkarni (Cashier)',
      approvedBy: 'Awaiting CFO Signoff',
      status: 'Review',
      refundMethod: 'Digital Salon Wallet Credit',
      workflowStep: 2,
    },
    {
      id: 'REF-390',
      date: '2026-08-04',
      invoice: 'INV-2026-9690',
      customer: 'Pooja Verma',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      reason: 'Duplicate Payment',
      amount: '₹2,400.00',
      requestedBy: 'Pooja Kashyap (Cashier)',
      approvedBy: 'Vikramaditya S. (Finance Mgr)',
      status: 'Completed',
      refundMethod: 'Bank Direct Deposit',
      workflowStep: 5,
    },
    {
      id: 'REF-350',
      date: '2026-07-28',
      invoice: 'INV-2026-9510',
      customer: 'Karan Malhotra',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      reason: 'Service Complaint',
      amount: '₹1,200.00',
      requestedBy: 'Kavita Sundaram (Front Desk)',
      approvedBy: 'Vikramaditya S. (Finance Mgr)',
      status: 'Refund',
      refundMethod: 'Digital Salon Wallet Credit',
      workflowStep: 4,
    },
    {
      id: 'REF-320',
      date: '2026-07-20',
      invoice: 'INV-2026-9400',
      customer: 'Siddharth Rao',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      reason: 'Wrong Billing',
      amount: '₹850.00',
      requestedBy: 'Suresh Varma (Cashier)',
      approvedBy: 'Vikramaditya S. (Finance Mgr)',
      status: 'Completed',
      refundMethod: 'Cash Credit',
      workflowStep: 5,
    },
  ]);

  const [form, setForm] = useState({
    customer: '',
    invoice: '',
    branch: 'Bandra West Flagship (Mumbai)',
    reason: 'Duplicate Payment',
    refundMethod: 'Digital Salon Wallet Credit',
    amount: '',
    notes: '',
  });

  const handleApprove = (id: string) => {
    setRefunds(
      refunds.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Completed',
              approvedBy: 'Vikramaditya S. (Finance Mgr)',
              workflowStep: 5,
            }
          : r,
      ),
    );
    toast(`Refund Approved: Refund ${id} approved & funds credited to client.`);
  };

  const handleReject = (id: string) => {
    setRefunds(
      refunds.map((r) =>
        r.id === id
          ? { ...r, status: 'Rejected', approvedBy: 'Rejected by Finance', workflowStep: 0 }
          : r,
      ),
    );
    toast(`Refund Rejected: Refund ${id} request rejected.`);
  };

  const handleCreateRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer || !form.amount) return;

    const newId = `REF-${Math.floor(410 + Math.random() * 50)}`;
    const newRefund = {
      id: newId,
      date: new Date().toISOString().split('T')[0],
      invoice: form.invoice || `INV-2026-${Math.floor(9000 + Math.random() * 900)}`,
      customer: form.customer,
      branch: form.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      reason: form.reason,
      amount: `₹${Number(form.amount).toLocaleString('en-IN')}.00`,
      requestedBy: 'Executive Finance Officer',
      approvedBy: 'Awaiting CFO Signoff',
      status: 'Request',
      refundMethod: form.refundMethod,
      workflowStep: 1,
    };

    setRefunds([newRefund, ...refunds]);
    setIsRequestModalOpen(false);
    setForm({
      customer: '',
      invoice: '',
      branch: 'Bandra West Flagship (Mumbai)',
      reason: 'Duplicate Payment',
      refundMethod: 'Digital Salon Wallet Credit',
      amount: '',
      notes: '',
    });
    toast(`Refund Logged: Refund request [${newId}] logged into approval workflow.`);
  };

  const filteredRefunds = refunds.filter((r) => {
    const matchesBranch = isAllBranches || r.branchId === selectedBranchId;
    const matchesSearch =
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesReason =
      selectedReasonFilter === 'All Reasons' || r.reason === selectedReasonFilter;
    return matchesBranch && matchesSearch && matchesReason;
  });

  const workflowStages = [
    { step: 1, name: 'Request', desc: 'Logged by Branch' },
    { step: 2, name: 'Review', desc: 'Audit Verification' },
    { step: 3, name: 'Approval', desc: 'Finance Manager Signoff' },
    { step: 4, name: 'Refund', desc: 'Payment Gateway Processing' },
    { step: 5, name: 'Completed', desc: 'Funds Credited to Client' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Customer Refunds &amp; Void Authorizations
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-rose-700" />
              ) : (
                <Building2 className="w-3 h-3 text-rose-700" />
              )}
              {isAllBranches ? 'Chain Refund Desk' : `${selectedBranch.shortName} Refunds`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            5-Stage refund authorization workflow: request, audit review, manager signoff, gateway
            payment reversal, and credit notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Request New Refund
          </button>

          <button
            onClick={() =>
              toast(
                `Export Refunds: Refund audit log for ${selectedBranch.shortName} exported to CSV.`,
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Refund Log
          </button>
        </div>
      </div>

      {/* 5-STAGE WORKFLOW VISUAL BAR */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-purple-200">
          <span>5-Stage Refund Authorization Pipeline</span>
          <span className="text-emerald-400">Strict Maker-Checker Separation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {workflowStages.map((s) => (
            <div
              key={s.step}
              className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-center space-y-0.5"
            >
              <div className="text-xs font-bold text-white">
                {s.step}. {s.name}
              </div>
              <div className="text-[10px] text-purple-200">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by customer name, refund ID, or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={selectedReasonFilter}
          onChange={(e) => setSelectedReasonFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Reasons">All Refund Reasons</option>
          {refundReasonsList.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* REFUNDS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Refund ID &amp; Date</th>
                <th className="p-3">Client &amp; Invoice #</th>
                <th className="p-3">Salon Branch</th>
                <th className="p-3">Refund Reason</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Requested By</th>
                <th className="p-3">Approval Signoff</th>
                <th className="p-3">Workflow Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredRefunds.map((ref) => (
                <tr key={ref.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="p-3 font-bold text-rose-700">
                    <div>{ref.id}</div>
                    <div className="text-[10px] text-muted font-mono">{ref.date}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-ink">{ref.customer}</div>
                    <div className="text-[10px] text-muted font-mono">{ref.invoice}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {ref.branch}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-ink">{ref.reason}</td>
                  <td className="p-3 font-bold text-rose-700 text-sm">{ref.amount}</td>
                  <td className="p-3 text-soft font-medium">{ref.requestedBy}</td>
                  <td className="p-3 text-soft font-medium">{ref.approvedBy}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ref.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : ref.status === 'Review'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : ref.status === 'Refund'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {ref.status} (Stage {ref.workflowStep}/5)
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-1">
                    {ref.status !== 'Completed' && (
                      <button
                        onClick={() => handleApprove(ref.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedRefundDetail(ref)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE REFUND MODAL */}
      {isRequestModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Request Customer Refund / Void
                  </h3>
                  <p className="text-xs text-soft">
                    Log refund request with justification and tender reversal channel
                  </p>
                </div>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRefund} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.customer}
                      onChange={(e) => setForm({ ...form, customer: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Branch Location *
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Invoice Reference #
                    </label>
                    <input
                      type="text"
                      placeholder="INV-2026-9901"
                      value={form.invoice}
                      onChange={(e) => setForm({ ...form, invoice: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-mono font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-1">
                      Refund Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="1500"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      className="w-full p-2.5 bg-white border border-rose-300 rounded-xl font-bold text-rose-800 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Refund Reason *
                    </label>
                    <select
                      value={form.reason}
                      onChange={(e) => setForm({ ...form, reason: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      {refundReasonsList.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Disbursal Channel *
                    </label>
                    <select
                      value={form.refundMethod}
                      onChange={(e) => setForm({ ...form, refundMethod: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      <option value="Digital Salon Wallet Credit">
                        Digital Salon Wallet Credit (Instant)
                      </option>
                      <option value="Original Payment Gateway Reversal">
                        Original Gateway (Razorpay / POS)
                      </option>
                      <option value="Bank Direct Deposit">Bank Account Transfer (NEFT)</option>
                      <option value="Cash Return Voucher">Cash Drawer Payout</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Submit Refund for Approval
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
