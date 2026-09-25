import { Button, cn } from '@salon-spa-saas/ui';
import { Building, CheckCircle2, Clock, LifeBuoy, Send, ShieldAlert, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { BaseModal } from './BaseModal';

import type { SupportTicket, TicketPriority, TicketStatus } from '../../../shared/api/support.api';

interface InspectTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onUpdateTicket: (updated: SupportTicket) => void;
}

export const InspectTicketModal: React.FC<InspectTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onUpdateTicket,
}) => {
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [status, setStatus] = useState<TicketStatus>('Open');
  const [replyText, setReplyText] = useState('');
  const [history, setHistory] = useState<{author: string, message: string, date: string, isOperator: boolean}[]>([]);

  useEffect(() => {
    if (ticket) {
      setPriority(ticket.priority);
      setStatus(ticket.status);
      setHistory([
        {
          author: ticket.submittedBy || 'Unknown',
          message: ticket.subject + (ticket.description ? `. ${ticket.description}` : ''),
          date: ticket.createdAt.split('T')[0],
          isOperator: false,
        },
      ]);
    }
  }, [ticket, isOpen]);

  if (!ticket) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      author: 'Super Admin Operator',
      message: replyText.trim(),
      date: 'Just now',
      isOperator: true,
    };

    const updatedHistory = [...history, newReply];
    setHistory(updatedHistory);

    onUpdateTicket({
      ...ticket,
      priority,
      status,
      // history: updatedHistory, // Note: Not persisted to backend yet in this version
    });

    setReplyText('');
  };

  const handleStatusChange = (newStatus: SupportTicket['status']) => {
    setStatus(newStatus);
    onUpdateTicket({
      ...ticket,
      status: newStatus,
      priority,
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Support Ticket Details: ${ticket.id}`}
      subtitle={`Requester: ${ticket.submittedBy} • Received: ${ticket.createdAt.split('T')[0]}`}
      icon={<LifeBuoy className="w-5 h-5" />}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Ticket Header Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Ticket Priority</span>
            <select
              value={priority}
              onChange={(e) => {
                const p = e.target.value as SupportTicket['priority'];
                setPriority(p);
                onUpdateTicket({ ...ticket, priority: p, status });
              }}
              className="mt-1 w-full bg-white text-xs font-bold rounded-lg border border-[#5A2EA6]/20 p-1 text-[#5A2EA6]"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Ticket Status</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="mt-1 w-full bg-white text-xs font-bold rounded-lg border border-[#5A2EA6]/20 p-1 text-[#5A2EA6]"
            >
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">
              Requester Tenant
            </span>
            <strong className="text-xs font-bold text-ink block mt-1 truncate">
              {ticket.submittedBy}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">
              SLA Response Window
            </span>
            <span className="text-xs font-semibold text-emerald-700 block mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Within SLA Target
            </span>
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="border border-line/60 rounded-2xl p-4 bg-slate-50/50 space-y-3 max-h-[300px] overflow-y-auto">
          <h4 className="text-xs font-bold text-soft uppercase tracking-wider mb-2">
            Ticket Conversation & Audit Lineage
          </h4>
          {history.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'p-3.5 rounded-xl text-xs space-y-1 max-w-[85%]',
                item.isOperator
                  ? 'ml-auto bg-[#F3EEFE] border border-[#5A2EA6]/20 text-[#2B1B47]'
                  : 'bg-white border border-line text-ink',
              )}
            >
              <div className="flex justify-between items-center text-[10.5px] font-semibold text-muted mb-1">
                <span className="flex items-center gap-1">
                  {item.isOperator ? (
                    <ShieldAlert className="w-3 h-3 text-[#5A2EA6]" />
                  ) : (
                    <Building className="w-3 h-3 text-muted" />
                  )}
                  {item.author}
                </span>
                <span>{item.date}</span>
              </div>
              <p className="leading-relaxed font-medium">{item.message}</p>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSendReply} className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft">
            Post Official Operator Response / Internal Note
          </label>
          <div className="flex gap-2">
            <textarea
              rows={2}
              required
              placeholder="Type official response or resolution notes for the tenant..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
            <Button
              type="submit"
              className="h-auto px-4 rounded-xl text-xs font-semibold premium-btn-primary flex flex-col items-center justify-center gap-1"
            >
              <Send className="w-4 h-4" />
              <span>Send Response</span>
            </Button>
          </div>
        </form>

        <div className="flex justify-between items-center pt-3 border-t border-[#5A2EA6]/10">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStatusChange('Resolved')}
              className="h-[34px] px-3 rounded-lg text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            >
              Mark Resolved
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStatusChange('Closed')}
              className="h-[34px] px-3 rounded-lg text-xs font-semibold text-slate-700 border-slate-200"
            >
              Close Ticket
            </Button>
          </div>
          <Button
            onClick={onClose}
            className="h-[34px] px-4 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            Done
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
