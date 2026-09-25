import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@salon-spa-saas/ui';
import {
  LifeBuoy,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  Globe,
  MapPin,
  Plus,
  X,
  Wallet,
  ShieldAlert,
  UserCheck,
  FileText,
  Sparkles
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function SupportTicketsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [activeTicketForCredit, setActiveTicketForCredit] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState('1000');

  const [newTicketForm, setNewTicketForm] = useState({
    customerName: '',
    customerPhone: '',
    branch: selectedBranch.name,
    category: 'Service Quality Defect',
    priority: 'High',
    description: ''
  });

  const issueCategories = [
    'Service Quality Defect',
    'Billing / Discount Overcharge',
    'Staff Behavior / Conduct',
    'Excessive Wait Time',
    'Allergy / Chemical Reaction'
  ];

  const statusList = ['Open', 'Under Investigation', 'Escalated', 'Resolved', 'Closed'];

  const [tickets, setTickets] = useState([
    {
      id: 'TCK-2026-042',
      customer: 'Ananya Roy',
      phone: '+91 98765 43210',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      category: 'Service Quality Defect',
      priority: 'High',
      status: 'Under Investigation',
      stage: 2,
      assignedTo: 'Vikramaditya S. (Finance & QA)',
      description: 'Customer reported uneven balayage color tone during hair coloring service on Aug 28.',
      compensationIssued: '₹0.00',
      date: '2026-09-01 04:30 PM'
    },
    {
      id: 'TCK-2026-041',
      customer: 'Pooja Verma',
      phone: '+91 97111 22334',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      category: 'Billing / Discount Overcharge',
      priority: 'Medium',
      status: 'Resolved',
      stage: 4,
      assignedTo: 'Pooja Kashyap (Store Lead)',
      description: 'Membership 15% discount was not applied to retail shampoo purchase during invoice billing.',
      compensationIssued: '₹500.00 (Wallet Credit)',
      date: '2026-08-30 02:15 PM'
    },
    {
      id: 'TCK-2026-040',
      customer: 'Karan Malhotra',
      phone: '+91 98111 55443',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      category: 'Staff Behavior / Conduct',
      priority: 'Low',
      status: 'Closed',
      stage: 5,
      assignedTo: 'Kavita Sundaram',
      description: 'Client gave feedback regarding front-desk delay during check-in rush.',
      compensationIssued: '₹0.00',
      date: '2026-08-25 11:00 AM'
    },
    {
      id: 'TCK-2026-039',
      customer: 'Siddharth Rao',
      phone: '+91 99887 66554',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      category: 'Allergy / Chemical Reaction',
      priority: 'Critical',
      status: 'Escalated',
      stage: 3,
      assignedTo: 'HQ Brand QA Director',
      description: 'Mild scalp irritation reported after chemical keratin application. Medical patch test requested.',
      compensationIssued: '₹1,500.00 (Wallet Voucher)',
      date: '2026-08-20 06:20 PM'
    }
  ]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.customerName || !newTicketForm.description) return;

    const newId = `TCK-2026-${Math.floor(50 + Math.random() * 40)}`;
    const newTicket = {
      id: newId,
      customer: newTicketForm.customerName,
      phone: newTicketForm.customerPhone || '+91 98000 00000',
      branch: newTicketForm.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      category: newTicketForm.category,
      priority: newTicketForm.priority,
      status: 'Open',
      stage: 1,
      assignedTo: 'HQ Customer Concierge',
      description: newTicketForm.description,
      compensationIssued: '₹0.00',
      date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })
    };

    setTickets([newTicket, ...tickets]);
    setIsNewTicketModalOpen(false);
    setNewTicketForm({ customerName: '', customerPhone: '', branch: selectedBranch.name, category: 'Service Quality Defect', priority: 'High', description: '' });
    toast(`Support Ticket Created: [${newId}] logged for ${newTicket.customer}. SLA clock started.`);
  };

  const handleIssueWalletCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketForCredit) return;

    const amt = Number(creditAmount);
    setTickets(tickets.map(t => t.id === activeTicketForCredit.id ? { ...t, compensationIssued: `₹${amt.toLocaleString('en-IN')}.00 (Wallet Credit)`, status: 'Resolved', stage: 4 } : t));
    setIsCreditModalOpen(false);
    toast(`Goodwill Wallet Credited: ₹${amt.toLocaleString('en-IN')} deposited into ${activeTicketForCredit.customer}'s Digital Salon Wallet.`);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesBranch = isAllBranches || t.branchId === selectedBranchId;
    const matchesStatus = selectedStatusFilter === 'All Statuses' || t.status === selectedStatusFilter;
    const matchesCategory = selectedCategoryFilter === 'All Categories' || t.category === selectedCategoryFilter;
    const matchesSearch =
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Customer Grievance &amp; SLA Redressal Desk
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-rose-700" /> : <Building2 className="w-3 h-3 text-rose-700" />}
              {isAllBranches ? 'Chain Grievance Pipeline' : `${selectedBranch.shortName} Tickets`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            5-Stage grievance resolution workflow: service quality defect investigations, billing overcharge audits, and goodwill wallet compensations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Log Support Ticket
          </button>

          <button
            onClick={() => toast(`Export Tickets: Downloaded grievance log for ${selectedBranch.shortName} as CSV.`)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Tickets
          </button>
        </div>
      </div>

      {/* 5-STAGE PIPELINE HEADER */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-purple-200">
          <span>Customer Grievance Resolution Stages</span>
          <span className="text-emerald-400">Target SLA: 24h Resolution</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {[
            { step: 1, name: 'Open', desc: 'Call Center Intake' },
            { step: 2, name: 'Investigation', desc: 'Branch Audit Review' },
            { step: 3, name: 'Escalated', desc: 'HQ QA / Brand GM' },
            { step: 4, name: 'Resolved', desc: 'Goodwill Credit' },
            { step: 5, name: 'Closed', desc: 'Client Satisfied' }
          ].map((s) => (
            <div key={s.step} className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-center space-y-0.5">
              <div className="text-xs font-bold text-white">{s.step}. {s.name}</div>
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
            placeholder="Search by ticket ID, customer name, phone #, or complaint text..."
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
          <option value="All Statuses">All Ticket Statuses</option>
          {statusList.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Categories">All Issue Categories</option>
          {issueCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* TICKETS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Ticket ID &amp; Date</th>
                <th className="p-3">Customer &amp; Phone</th>
                <th className="p-3">Salon Outlet</th>
                <th className="p-3">Issue Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned Handler</th>
                <th className="p-3">Compensation</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-rose-50/20 transition-colors">
                  <td className="p-3 font-bold text-rose-700">
                    <div>{t.id}</div>
                    <div className="text-[10px] text-muted font-mono">{t.date}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-ink">{t.customer}</div>
                    <div className="text-[10.5px] font-mono text-soft">{t.phone}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {t.branch}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-ink">{t.category}</td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                      t.priority === 'Critical' ? 'bg-rose-600 text-white' :
                      t.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.priority}
                    </span>
                  </td>

                  <td className="p-3 text-soft font-medium">{t.assignedTo}</td>
                  <td className="p-3 font-bold text-emerald-700">{t.compensationIssued}</td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Resolved' || t.status === 'Closed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      t.status === 'Escalated' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {t.status} (Stage {t.stage}/5)
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-1">
                    {t.status !== 'Resolved' && t.status !== 'Closed' && (
                      <button
                        onClick={() => {
                          setActiveTicketForCredit(t);
                          setIsCreditModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Compensate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isNewTicketModalOpen && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Log Customer Grievance / Ticket</h3>
                <p className="text-xs text-soft">Record guest complaint for investigation and resolution</p>
              </div>
              <button onClick={() => setIsNewTicketModalOpen(false)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={newTicketForm.customerName}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, customerName: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Customer Phone (+91) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newTicketForm.customerPhone}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, customerPhone: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Salon Outlet *</label>
                  <select
                    value={newTicketForm.branch}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, branch: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    {branches.filter(b => b.id !== 'all').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Issue Category *</label>
                  <select
                    value={newTicketForm.category}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    {issueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">SLA Priority *</label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="Critical">Critical (Urgent)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Detailed Incident Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the complaint in detail..."
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-line rounded-xl font-medium text-ink"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ISSUE GOODWILL WALLET CREDIT MODAL */}
      {isCreditModalOpen && activeTicketForCredit && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Issue Goodwill Wallet Compensation</h3>
                <p className="text-xs text-soft font-mono">{activeTicketForCredit.id} • {activeTicketForCredit.customer}</p>
              </div>
              <button onClick={() => setIsCreditModalOpen(false)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueWalletCredit} className="space-y-4 text-xs">
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-900">Complaint Details</span>
                <p className="text-[11px] text-rose-800">{activeTicketForCredit.description}</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1">Goodwill Wallet Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full p-2.5 bg-white border border-emerald-400 rounded-xl font-bold text-emerald-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsCreditModalOpen(false)}
                  className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Credit Digital Wallet &amp; Resolve
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
