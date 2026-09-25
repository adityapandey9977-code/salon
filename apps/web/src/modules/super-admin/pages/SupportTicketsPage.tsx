import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  LifeBuoy,
  Search,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { InspectTicketModal } from '../components/InspectTicketModal';
import { supportApi, type SupportTicket } from '../../../shared/api/support.api';

export function SupportTicketsPage() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [inspectingTicket, setInspectingTicket] = useState<SupportTicket | null>(null);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const data = await supportApi.listTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load support tickets', err);
      toast('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateTicket = async (updated: SupportTicket) => {
    try {
      // Optimistic update
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      if (inspectingTicket?.id === updated.id) {
        setInspectingTicket(updated);
      }
      
      // Update backend status
      await supportApi.updateStatus(updated.id, updated.status);
      toast(`Ticket ${updated.id} status updated to ${updated.status}`);
    } catch (err) {
      console.error('Failed to update ticket status', err);
      toast('Failed to update ticket status');
      fetchTickets(); // Revert on failure
    }
  };

  const filteredAndSortedTickets = useMemo(() => {
    return tickets
      .filter((tck) => {
        const matchesSearch =
          tck.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tck.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tck.subject.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPriority = priorityFilter === 'All' || tck.priority === priorityFilter;
        const matchesStatus = statusFilter === 'All' || tck.status === statusFilter;

        return matchesSearch && matchesPriority && matchesStatus;
      })
      .sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        
        if (sortBy === 'newest') return bTime - aTime;
        if (sortBy === 'oldest') return aTime - bTime;
        if (sortBy === 'priority') {
          const priorityWeight = { Critical: 4, High: 3, Medium: 2, Low: 1 } as any;
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return 0;
      });
  }, [tickets, searchQuery, priorityFilter, statusFilter, sortBy]);

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header (Top "Inspect Critical Alerts" button removed as requested) */}
      <div className="mb-6">
        <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
          Support Tickets
        </h1>
        <p className="text-[13px] text-muted mt-1">
          Global platform customer support tickets backlog tracker according to PRD SALO-PR-098 and
          SLA rules.
        </p>
      </div>

      {/* Search, Filter & Sort Toolbar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/10 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search tickets by ID, tenant or issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Received Timing Sort */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="newest">Newest Received First</option>
              <option value="oldest">Oldest Received First</option>
              <option value="priority">Highest Priority First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Care Inbox Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Customer Care Inbox
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Manage customer inquiries and technical support ticket queues
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredAndSortedTickets.length} Tickets Found
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Ticket ID',
                    'Requester Tenant',
                    'Issue / Description',
                    'Priority',
                    'Status',
                    'Received',
                    'Actions',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-4 font-bold text-[10px] tracking-wider uppercase',
                        i === 0 ? 'pl-6' : i === 6 ? 'pr-6 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {filteredAndSortedTickets.map((tck) => (
                  <tr key={tck.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-4 pl-6 font-mono text-[11.5px] font-bold text-ink">
                      {tck.id}
                    </td>
                    <td className="p-4 font-bold text-ink">{tck.submittedBy}</td>
                    <td className="p-4 font-semibold text-soft max-w-xs truncate">{tck.subject}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold',
                          tck.priority === 'Urgent'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : tck.priority === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : tck.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        {tck.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold',
                          tck.status === 'Open'
                            ? 'bg-blue-100 text-blue-800'
                            : tck.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800',
                        )}
                      >
                        {tck.status}
                      </span>
                    </td>
                    <td className="p-4 text-soft font-medium">{tck.createdAt.split('T')[0]}</td>

                    {/* Relatable Icon Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Inspect & Respond Ticket Modal Button */}
                        <button
                          onClick={() => setInspectingTicket(tck)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Inspect Ticket & Post Response"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Toggle Status */}
                        <button
                          onClick={() =>
                            handleUpdateTicket({
                              ...tck,
                              status: tck.status === 'Resolved' ? 'Open' : 'Resolved',
                            })
                          }
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="Quick Mark Resolved / Open"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inspect Ticket Modal */}
      <InspectTicketModal
        isOpen={!!inspectingTicket}
        onClose={() => setInspectingTicket(null)}
        ticket={inspectingTicket}
        onUpdateTicket={handleUpdateTicket}
      />
    </div>
  );
}
