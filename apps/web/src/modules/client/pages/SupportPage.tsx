import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Headphones,
  HelpCircle,
  MessageCircle,
  Paperclip,
  PhoneCall,
  Plus,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function SupportPage() {
  const { toast } = useToast();

  // 4 SUPPORT OPTIONS / TABS: Create Ticket, View Tickets, FAQs, Contact Salon
  const [activeTab, setActiveTab] = useState<'view' | 'create' | 'faqs' | 'contact'>('view');

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // All 6 Ticket Fields State
  const [ticketForm, setTicketForm] = useState({
    subject: 'Refund inquiry for rescheduled appointment deposit',
    category: 'Billing & Refunds',
    priority: 'Medium',
    description:
      'I rescheduled my appointment APT-901 to next week. Please verify deposit credit to digital wallet balance.',
    attachment: 'receipt_APT-901.pdf',
    status: 'Open',
  });

  // Master Tickets State (Status: Open, In Progress, Resolved, Closed)
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-401',
      subject: 'Refund inquiry for rescheduled appointment deposit',
      category: 'Billing & Refunds',
      priority: 'Medium',
      description:
        'I rescheduled my appointment APT-901 to next week. Please verify deposit credit to digital wallet balance.',
      attachment: 'receipt_APT-901.pdf',
      status: 'Open',
      createdDate: '2026-08-07',
    },
    {
      id: 'TCK-388',
      subject: 'Gold Member Birthday Voucher Not Appearing',
      category: 'Package & Membership',
      priority: 'High',
      description:
        'My Gold tier birthday pamper voucher has not credited to my digital vouchers tab.',
      attachment: null,
      status: 'In Progress',
      createdDate: '2026-08-02',
    },
    {
      id: 'TCK-350',
      subject: 'Home Service Specialist Arrival Time Confirmation',
      category: 'Appointment Scheduling',
      priority: 'Low',
      description: 'Need confirmation on exact arrival window for At-Home Balayage service.',
      attachment: null,
      status: 'Resolved',
      createdDate: '2026-07-28',
    },
    {
      id: 'TCK-290',
      subject: 'Ammonia-free Hair Color Allergy Consultation',
      category: 'Service Experience',
      priority: 'Low',
      description: 'Inquiry about patch test requirements before appointment.',
      attachment: 'skin_test_note.pdf',
      status: 'Closed',
      createdDate: '2026-06-15',
    },
  ]);

  const faqs = [
    {
      q: 'How do I cancel or reschedule my appointment?',
      a: 'You can reschedule or cancel your appointment up to 4 hours before the scheduled time directly from your Appointments desk. Deposits are automatically credited back to your digital wallet balance.',
    },
    {
      q: 'What are the benefits of the Gold Membership Tier?',
      a: 'Gold Tier members receive a flat 15% discount on all hair & spa services, priority weekend slot reservations, 2x loyalty rewards points, and an annual ₹1,000 birthday pamper gift voucher.',
    },
    {
      q: 'How do I redeem my earned Loyalty Rewards Points?',
      a: 'Navigate to the Loyalty Rewards page, choose your preferred salon discount voucher (e.g. ₹250 or ₹500 voucher), and click "Redeem Voucher". The code will be added to your account for 1-click checkout.',
    },
    {
      q: 'Can I request At-Home salon spa services in Bhopal?',
      a: 'Yes! Select "At-Home Service" during booking. Our senior specialists arrive with sterile single-use kits and professional equipment.',
    },
  ];

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tRef = `TCK-${Math.floor(400 + Math.random() * 90)}`;
    const newTck = {
      id: tRef,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      description: ticketForm.description,
      attachment: ticketForm.attachment || null,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0],
    };

    setTickets([newTck, ...tickets]);
    setIsTicketModalOpen(false);
    setActiveTab('view');
    toast(
      `Support Ticket Created: [${tRef}] opened with status 'Open'. Client care desk will respond within 2 hours.`,
    );
  };

  const filteredTickets = tickets.filter(
    (t) => statusFilter === 'all' || t.status === statusFilter,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Customer Help Center &amp; Support Desk
          </h1>
          <p className="text-xs text-soft mt-1">
            Submit support tickets, view active ticket statuses, browse frequently asked questions,
            or connect with concierge.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('create');
            setIsTicketModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {/* 4 SUPPORT OPTIONS / TABS REQUESTED BY USER */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'view', label: 'View Tickets', count: tickets.length },
          { id: 'create', label: 'Create Ticket' },
          { id: 'faqs', label: 'FAQs' },
          { id: 'contact', label: 'Contact Salon' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'create') {
                setIsTicketModalOpen(true);
              }
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}{' '}
            {tab.count !== undefined && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OPTION 1: VIEW TICKETS LOG TABLE (STATUSES: Open, In Progress, Resolved, Closed) */}
      {activeTab === 'view' && (
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-ink">My Support Tickets Log</h3>

            {/* Status Filter Bar */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-bold text-soft mr-1">Status Filter:</span>
              {['all', 'Open', 'In Progress', 'Resolved', 'Closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#5A2EA6] text-white'
                      : 'bg-pine/10 text-soft hover:text-ink'
                  }`}
                >
                  {st === 'all' ? 'All Tickets' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-3">Ticket ID &amp; Date</th>
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
                    {/* ID & Date */}
                    <td className="p-3 font-bold text-purple-700">
                      <div>{t.id}</div>
                      <div className="text-[10px] text-soft font-medium">{t.createdDate}</div>
                    </td>

                    {/* Subject */}
                    <td className="p-3 font-bold text-ink">{t.subject}</td>

                    {/* Category */}
                    <td className="p-3 font-semibold text-soft">{t.category}</td>

                    {/* Priority */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === 'High' || t.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    {/* Attachment */}
                    <td className="p-3 font-medium text-soft">
                      {t.attachment ? (
                        <span className="flex items-center gap-1 text-purple-700 font-bold">
                          <Paperclip className="w-3 h-3 text-purple-600" /> {t.attachment}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* Status (4 STATUSES: Open, In Progress, Resolved, Closed) */}
                    <td className="p-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'Open'
                            ? 'bg-blue-100 text-blue-800'
                            : t.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-900'
                              : t.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
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
      )}

      {/* OPTION 2: CREATE TICKET INLINE FORM (ALL 6 SPECIFIED FIELDS) */}
      {activeTab === 'create' && (
        <div className="bg-white p-6 rounded-3xl border border-line shadow-sm space-y-4 max-w-3xl mx-auto">
          <h3 className="text-base font-bold text-ink border-b border-line pb-3">
            Create New Support Ticket
          </h3>

          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Subject */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your issue..."
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                />
              </div>

              {/* 2. Category */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Billing & Refunds">Billing &amp; Refunds</option>
                  <option value="Appointment Scheduling">Appointment Scheduling</option>
                  <option value="Package & Membership">Package &amp; Membership</option>
                  <option value="Service Experience">Service Experience</option>
                </select>
              </div>

              {/* 3. Priority */}
              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                  Priority *
                </label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* 4. Description */}
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Provide detailed information regarding your inquiry or issue..."
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                className="w-full p-3 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
              />
            </div>

            {/* 5. Attachment */}
            <div>
              <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                Attachment (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Attach receipt or photo file name..."
                  value={ticketForm.attachment}
                  onChange={(e) => setTicketForm({ ...ticketForm, attachment: e.target.value })}
                  className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                />
                <button
                  type="button"
                  onClick={() => toast('Attachment: Selected PDF/Image attachment file.')}
                  className="px-3.5 py-2.5 bg-paper/40 hover:bg-purple-50 text-purple-700 font-bold text-xs rounded-xl border border-purple-300 cursor-pointer shrink-0"
                >
                  <Paperclip className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>

            {/* 6. Status (Auto-initialized to Open) */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-xs font-semibold">
              Initial Status: <strong className="font-bold text-blue-800">Open</strong> (Response
              window within 2 hours)
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
              >
                Submit Support Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* OPTION 3: FAQS ACCORDION */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 rounded-3xl border border-line shadow-sm space-y-4">
          <h3 className="text-base font-bold text-ink flex items-center gap-2 border-b border-line pb-3">
            <HelpCircle className="w-4 h-4 text-purple-600" /> Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-line rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 bg-paper/20 hover:bg-purple-50/50 flex justify-between items-center text-left font-bold text-xs text-ink cursor-pointer border-0 transition-colors"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-purple-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 pt-2 text-xs text-soft leading-relaxed border-t border-line/40 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OPTION 4: CONTACT SALON CHANNELS */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Channel */}
          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-md flex items-center justify-between gap-4 relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-emerald-100 px-3 py-1 rounded-full">
                Instant Live Chat
              </span>
              <h3 className="text-xl font-bold">WhatsApp Concierge Desk</h3>
              <p className="text-xs text-emerald-100">
                Chat directly with our salon manager for instant booking support.
              </p>
            </div>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toast('Opening WhatsApp Chat: Redirecting to Atelier Support Desk...')}
              className="z-10 px-4 py-2.5 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer border-0 flex items-center gap-1.5 no-underline shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Phone Channel */}
          <div className="bg-purple-950 text-white p-6 rounded-3xl shadow-md flex items-center justify-between gap-4 relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-purple-200 px-3 py-1 rounded-full">
                Phone Helpline
              </span>
              <h3 className="text-xl font-bold">+91 1800-ATELIER</h3>
              <p className="text-xs text-purple-200">Available 9:00 AM – 8:00 PM (Mon-Sun)</p>
            </div>

            <button
              onClick={() => toast('Calling Helpdesk: Dialing Atelier Concierge Desk...')}
              className="z-10 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-2xl shadow-md transition-all cursor-pointer border-0 flex items-center gap-1.5 shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              Call Concierge
            </button>
          </div>
        </div>
      )}

      {/* CREATE TICKET MODAL (createPortal) */}
      {isTicketModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-lg shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Create Support Ticket
                  </h3>
                  <p className="text-xs text-soft">
                    Our client support desk will respond within 2 hours
                  </p>
                </div>
                <button
                  onClick={() => setIsTicketModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Summarize your issue..."
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Billing & Refunds">Billing &amp; Refunds</option>
                      <option value="Appointment Scheduling">Appointment Scheduling</option>
                      <option value="Package & Membership">Package &amp; Membership</option>
                      <option value="Service Experience">Service Experience</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Priority *
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Attachment (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="File attachment name..."
                    value={ticketForm.attachment}
                    onChange={(e) => setTicketForm({ ...ticketForm, attachment: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
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
