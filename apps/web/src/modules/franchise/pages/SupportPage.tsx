import { useToast } from '@salon-spa-saas/ui';
import {
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Headphones,
  MessageSquare,
  Paperclip,
  Plus,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { supportApi, type SupportTicket, type TicketCategory, type TicketPriority } from '../../../shared/api/support.api';

export function SupportPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await supportApi.listTickets({
        status: statusFilter !== 'all' ? (statusFilter as any) : undefined,
      });
      setTickets(data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      toast('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user, statusFilter]);

  // ALL 5 TICKET FORM FIELDS REQUESTED BY USER: Subject, Category, Priority, Description, Attachment
  const [form, setForm] = useState({
    subject: '',
    category: 'Royalty Billing' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    description: '',
    attachmentName: '',
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject || !form.description) return;

    try {
      const newTicket = await supportApi.createTicket({
        tenantId: user?.tenantId || '',
        submittedBy: user?.fullName || '',
        submittedByEmail: user?.email || '',
        subject: form.subject,
        category: form.category,
        priority: form.priority,
        description: form.description,
        attachmentName: form.attachmentName,
      });

      setTickets([newTicket, ...tickets]);
      setIsModalOpen(false);
      setForm({
        subject: '',
        category: 'Royalty Billing',
        priority: 'Medium',
        description: '',
        attachmentName: '',
      });
      toast(`Ticket Created: [${newTicket.id}] logged with Head Office support desk.`);
    } catch (err) {
      console.error('Failed to create ticket:', err);
      toast('Failed to create ticket');
    }
  };

  const filteredTickets = tickets;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Communication with Head Office
          </h1>
          <p className="text-xs text-soft mt-1">
            Direct franchise partner helpdesk for royalty billing, compliance audits, inventory
            supply, technical support, and marketing assets.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      {/* STATUS FILTER BUTTONS (Open, In Progress, Resolved) */}
      <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Headphones className="w-4 h-4 text-purple-600" /> Head Office Support Ticket Ledger
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'Open', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-xs font-bold rounded-xl cursor-pointer transition-all border ${
                  statusFilter === st
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                    : 'bg-white text-soft hover:text-ink border-line'
                }`}
              >
                {st === 'all' ? 'All Tickets' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TICKETS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Ticket Ref &amp; Date</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Attachment</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* Ticket Ref & Date */}
                  <td className="p-3 font-bold text-purple-700">
                    <div>{t.id}</div>
                    <div className="text-[10px] text-soft font-medium">{t.createdAt.split('T')[0]}</div>
                  </td>

                  {/* Subject */}
                  <td className="p-3 font-bold text-ink">
                    <div>{t.subject}</div>
                    <div className="text-[10px] text-soft line-clamp-1">{t.description}</div>
                  </td>

                  {/* Category */}
                  <td className="p-3 font-semibold text-purple-900">{t.category}</td>

                  {/* Priority */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.priority === 'High' || t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : t.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>

                  {/* Attachment */}
                  <td className="p-3 font-medium text-soft flex items-center gap-1 pt-4">
                    <Paperclip className="w-3 h-3 text-purple-600" /> {t.attachmentName || 'No Attachment'}
                  </td>

                  {/* Status (Open, In Progress, Resolved) */}
                  <td className="p-3 text-right whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap inline-block ${
                        t.status === 'Open'
                          ? 'bg-amber-100 text-amber-800'
                          : t.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TICKET MODAL WITH ALL 5 FORM FIELDS (createPortal) */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Create Head Office Support Ticket
                  </h3>
                  <p className="text-xs text-soft">Log ticket directly with HQ helpdesk</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                {/* Field 1: Subject */}
                <div className="space-y-1">
                  <label className="block font-bold text-ink">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter support ticket subject..."
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                {/* Field 2 & 3: Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-ink">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}
                      className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink cursor-pointer"
                    >
                      <option value="Royalty Billing">Royalty Billing</option>
                      <option value="Compliance Audit">Compliance Audit</option>
                      <option value="Inventory Supply">Inventory Supply</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Marketing Assets">Marketing Assets</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-ink">Priority</label>
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}
                      className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Field 4: Description */}
                <div className="space-y-1">
                  <label className="block font-bold text-ink">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide detailed description of the support request..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                {/* Field 5: Attachment */}
                <div className="space-y-1">
                  <label className="block font-bold text-ink">Attachment (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter attachment file name (e.g. Audit_Document.pdf)..."
                    value={form.attachmentName}
                    onChange={(e) => setForm({ ...form, attachmentName: e.target.value })}
                    className="w-full p-2.5 bg-paper/40 border border-line rounded-xl outline-none focus:border-[#5A2EA6] font-semibold text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-soft font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Submit Ticket
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
