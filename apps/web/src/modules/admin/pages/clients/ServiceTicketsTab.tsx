import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  LifeBuoy,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router';
import { customersApi, tenantsApi } from '@/shared/api';
import { mapApiCustomerToFullRecord } from './AllClientsTab';
import { masterBranches } from '../locations/AllBranchesTab';
import { initialClients } from './clientsData';
import { ClientProfileDossierModal, type FullClientRecord } from './ClientProfileDossierModal';
import { ClientProfilePage } from './ClientProfilePage';

export interface ServiceTicketRecord {
  id: string;
  clientName: string;
  clientId: string;
  branch: string;
  subject: string;
  category:
    | 'Styling & Treatment Quality'
    | 'Billing / Refund Query'
    | 'Appointment Delay'
    | 'Package / Loyalty Balance'
    | 'Staff Conduct';
  createdDate: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Waiting for Client' | 'Resolved' | 'Closed';
  description: string;
  resolutionNotes?: string;
  lastUpdated: string;
}

const sampleTicketTemplates = [
  {
    subject: 'Haircut length shorter than consultation & hot water at basin',
    category: 'Styling & Treatment Quality' as const,
    priority: 'High' as const,
    status: 'In Progress' as const,
    assignedTo: 'Rahul Sharma (GM)',
    description:
      'Guest expressed dissatisfaction regarding hair trim length and shampoo basin hot water temperature.',
    resolutionNotes:
      'GM contacted client via phone; offered complimentary organic hair spa treatment on next visit.',
    createdDate: '02 Aug 2026',
    lastUpdated: '10 mins ago',
  },
  {
    subject: '15-minute chair delay during Saturday afternoon rush',
    category: 'Appointment Delay' as const,
    priority: 'Medium' as const,
    status: 'Resolved' as const,
    assignedTo: 'Priya Patel (Branch Mgr)',
    description: 'Saturday peak queue caused a slight delay before Balayage session was initiated.',
    resolutionNotes: 'Comped artisan green tea and credited ₹500 loyalty wallet bonus to account.',
    createdDate: '04 Aug 2026',
    lastUpdated: '04 Aug 2026',
  },
  {
    subject: 'Package session redemption discrepancy on mobile booking app',
    category: 'Package / Loyalty Balance' as const,
    priority: 'Low' as const,
    status: 'Closed' as const,
    assignedTo: 'HQ Support Desk',
    description: 'Client inquired why 1 session appeared pending reconciliation in app.',
    resolutionNotes: 'Synchronized server ledger; correct remaining session balance restored.',
    createdDate: '16 Jul 2026',
    lastUpdated: '17 Jul 2026',
  },
];

export const initialTickets: ServiceTicketRecord[] = [
  {
    id: 'TCK-1082',
    clientName: 'Kunal Singhania',
    clientId: 'CL-10488',
    branch: 'Atelier MG Road Express',
    subject: 'Haircut length shorter than consultation & hot water at basin',
    category: 'Styling & Treatment Quality',
    createdDate: '02 Aug 2026',
    assignedTo: 'Rahul Sharma (GM)',
    priority: 'High',
    status: 'In Progress',
    description:
      'Guest expressed dissatisfaction regarding hair trim length and shampoo basin hot water temperature.',
    resolutionNotes:
      'GM contacted client via phone; offered complimentary organic hair spa treatment on next visit.',
    lastUpdated: '10 mins ago',
  },
  {
    id: 'TCK-1081',
    clientName: 'Meera Kulkarni',
    clientId: 'CL-10494',
    branch: 'Atelier Koregaon Park Grand',
    subject: '15-minute chair delay during Saturday afternoon rush',
    category: 'Appointment Delay',
    createdDate: '04 Aug 2026',
    assignedTo: 'Priya Patel (Branch Mgr)',
    priority: 'Medium',
    status: 'Resolved',
    description: 'Saturday peak queue caused a slight delay before Balayage session was initiated.',
    resolutionNotes: 'Comped artisan green tea and credited ₹500 loyalty wallet bonus to account.',
    lastUpdated: '04 Aug 2026',
  },
  {
    id: 'TCK-1080',
    clientName: 'Tanvi Rao',
    clientId: 'CL-10495',
    branch: 'Atelier Whitefield Studio',
    subject: 'Package session redemption discrepancy on mobile booking app',
    category: 'Package / Loyalty Balance',
    createdDate: '16 Jul 2026',
    assignedTo: 'HQ Support Desk',
    priority: 'Low',
    status: 'Closed',
    description: 'Client inquired why 1 session appeared pending reconciliation in app.',
    resolutionNotes: 'Synchronized server ledger; correct remaining session balance restored.',
    lastUpdated: '17 Jul 2026',
  },
];

export interface ServiceTicketsTabProps {
  branchId?: string;
  franchiseId?: string;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function ServiceTicketsTab({
  branchId,
  franchiseId,
  defaultBranch,
  lockBranch,
}: ServiceTicketsTabProps = {}) {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState<FullClientRecord[]>([]);
  const [branches, setBranches] = useState<any[]>(masterBranches);
  const [tickets, setTickets] = useState<ServiceTicketRecord[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals state
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [inspectTicket, setInspectTicket] = useState<ServiceTicketRecord | null>(null);
  const [selectedClientDossier, setSelectedClientDossier] = useState<FullClientRecord | null>(null);

  // New Ticket State
  const [newTicket, setNewTicket] = useState({
    clientId: '',
    branch: defaultBranch || masterBranches[0].name,
    subject: '',
    category: 'Styling & Treatment Quality' as ServiceTicketRecord['category'],
    priority: 'Medium' as ServiceTicketRecord['priority'],
    assignedTo: 'Rahul Sharma (GM)',
    description: '',
  });

  // Load clients and branches dynamically from database
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [apiCustomers, branchRes, franchiseRes] = await Promise.all([
          customersApi.list({
            branchId: branchId || undefined,
            franchiseId: franchiseId || undefined,
            limit: 100,
          }).catch(() => []),
          tenantsApi.listBranches().catch(() => []),
          tenantsApi.listFranchises(true).catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(branchRes) && branchRes.length > 0) {
          setBranches(branchRes);
        }

        let fullRecords: FullClientRecord[] = [];
        if (Array.isArray(apiCustomers) && apiCustomers.length > 0) {
          fullRecords = apiCustomers.map((cust) =>
            mapApiCustomerToFullRecord(cust, branchRes || [], franchiseRes || []),
          );
        } else {
          fullRecords = initialClients;
        }
        setClients(fullRecords);

        if (fullRecords.length > 0) {
          setNewTicket((prev) => ({
            ...prev,
            clientId: prev.clientId || fullRecords[0].id,
            branch: defaultBranch || fullRecords[0].primaryBranch || prev.branch,
          }));

          // Dynamically map tickets with real branch clients
          const dynamicTickets: ServiceTicketRecord[] = fullRecords.slice(0, 5).map((cust, idx) => {
            const tpl = sampleTicketTemplates[idx % sampleTicketTemplates.length];
            return {
              id: `TCK-${1080 + idx}`,
              clientName: cust.fullName,
              clientId: cust.id,
              branch: cust.primaryBranch || defaultBranch || 'Main Branch',
              subject: tpl.subject,
              category: tpl.category,
              createdDate: tpl.createdDate,
              assignedTo: tpl.assignedTo,
              priority: tpl.priority,
              status: tpl.status,
              description: tpl.description,
              resolutionNotes: tpl.resolutionNotes,
              lastUpdated: tpl.lastUpdated,
            };
          });

          if (dynamicTickets.length > 0) {
            setTickets(dynamicTickets);
          }
        }
      } catch (err) {
        console.warn('Error loading dynamic ticket clients:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [branchId, franchiseId, defaultBranch]);

  // Selected client from URL search params
  const selectedClientId = searchParams.get('clientId');
  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const handleUpdateClient = (updated: FullClientRecord) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    setTickets((prev) =>
      prev.map((t) =>
        t.clientId === updated.id
          ? {
              ...t,
              clientName: updated.fullName,
              branch: updated.primaryBranch || t.branch,
            }
          : t,
      ),
    );
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.subject.toLowerCase().includes(q) ||
      t.clientName.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) return;

    const client = clients.find((c) => c.id === newTicket.clientId) || clients[0];

    const created: ServiceTicketRecord = {
      id: `TCK-108${tickets.length + 3}`,
      clientName: client ? client.fullName : 'Guest Client',
      clientId: client ? client.id : newTicket.clientId,
      branch: newTicket.branch,
      subject: newTicket.subject,
      category: newTicket.category,
      createdDate: 'Today',
      assignedTo: newTicket.assignedTo,
      priority: newTicket.priority,
      status: 'Open',
      description: newTicket.description,
      lastUpdated: 'Just Now',
    };

    setTickets([created, ...tickets]);
    setIsAddTicketModalOpen(false);
    toast(`Ticket #${created.id} logged for ${created.clientName}.`);
  };

  const handleUpdateTicketStatus = (
    ticket: ServiceTicketRecord,
    nextStatus: ServiceTicketRecord['status'],
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id ? { ...t, status: nextStatus, lastUpdated: 'Just Now' } : t,
      ),
    );
    if (inspectTicket && inspectTicket.id === ticket.id) {
      setInspectTicket({ ...inspectTicket, status: nextStatus, lastUpdated: 'Just Now' });
    }
    toast(`Ticket #${ticket.id} marked as ${nextStatus}.`);
  };

  const handleExport = () => {
    const rows = [
      ['Ticket ID', 'Client Name', 'Branch', 'Category', 'Priority', 'Assigned To', 'Status', 'Last Updated', 'Subject'],
      ...filteredTickets.map((t) => [
        t.id,
        t.clientName,
        t.branch,
        t.category,
        t.priority,
        t.assignedTo,
        t.status,
        t.lastUpdated,
        `"${t.subject.replace(/"/g, '""')}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `service_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Exported service tickets list to CSV.');
  };

  if (selectedClient) {
    return (
      <ClientProfilePage
        clientData={selectedClient}
        onBack={() => {
          const next = new URLSearchParams(searchParams);
          next.delete('clientId');
          setSearchParams(next);
        }}
        onUpdateClient={handleUpdateClient}
      />
    );
  }

  if (selectedClientDossier) {
    return (
      <ClientProfilePage
        clientData={selectedClientDossier}
        onBack={() => setSelectedClientDossier(null)}
        onUpdateClient={handleUpdateClient}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Client Service Tickets &amp; Escalation Desk
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {tickets.filter((t) => t.status !== 'Closed').length} Active Tickets
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Centralized dispute resolution, quality escalations, refund requests, and front-desk SLA
            tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Tickets</span>
          </Button>

          <Button
            onClick={() => setIsAddTicketModalOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search tickets by Subject, Client, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full lg:w-auto justify-end flex-wrap">
          {/* Priority Filter */}
          <div className="flex items-center gap-1">
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
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Client">Waiting for Client</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Ledger Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Service Tickets Ledger
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Incident logs, active resolution workflows, customer complaint logs
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredTickets.length} Incidents Tracked
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Issue & Ticket ID',
                  'Client & Branch',
                  'Category',
                  'Priority',
                  'Assigned Handler',
                  'Status',
                  'Updated',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 7 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredTickets.map((tck) => (
                <tr key={tck.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  {/* ID & Subject */}
                  <td className="p-3.5 pl-5">
                    <strong className="text-ink text-[13px] block">{tck.subject}</strong>
                    <span className="text-[10px] text-[#5A2EA6] font-mono font-bold">{tck.id}</span>
                  </td>

                  {/* Client & Branch */}
                  <td className="p-3.5">
                    <button
                      onClick={() => {
                        const matched = clients.find((c) => c.id === tck.clientId);
                        if (matched) {
                          setSelectedClientDossier(matched);
                        } else {
                          setSearchParams({ tab: 'tickets', clientId: tck.clientId });
                        }
                      }}
                      className="text-left group bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
                      title="Click to view client profile"
                    >
                      <div className="font-bold text-ink text-xs group-hover:text-[#5A2EA6] transition-colors underline-offset-2 group-hover:underline">
                        {tck.clientName}
                      </div>
                      <div className="text-[10px] text-muted">{tck.branch}</div>
                    </button>
                  </td>

                  {/* Category */}
                  <td className="p-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5A2EA6] text-[10px] font-semibold border border-purple-100">
                      {tck.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-block px-2 py-0.2 rounded-md text-[9.5px] font-bold',
                        tck.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : tck.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : tck.priority === 'Medium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {tck.priority}
                    </span>
                  </td>

                  {/* Assigned Handler */}
                  <td className="p-3.5 text-ink font-medium text-xs">{tck.assignedTo}</td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        tck.status === 'Open'
                          ? 'bg-amber-100 text-amber-800'
                          : tck.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : tck.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {tck.status}
                    </span>
                  </td>

                  {/* Updated */}
                  <td className="p-3.5 text-muted text-[11px]">{tck.lastUpdated}</td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectTicket(tck)}
                        className="h-8 px-2.5 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer border-0"
                        title="View Full Incident File"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Log New Ticket Modal */}
      {isAddTicketModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Log Client Service Ticket
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Record quality dispute, front-desk escalation, or refund inquiry
                  </p>
                </div>
                <button
                  onClick={() => setIsAddTicketModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleCreateTicket}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Select Affected Client *
                  </label>
                  <select
                    value={newTicket.clientId}
                    onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.mobile}) — {c.primaryBranch}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Branch Location
                    </label>
                    <select
                      value={newTicket.branch}
                      onChange={(e) => setNewTicket({ ...newTicket, branch: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Incident Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          category: e.target.value as ServiceTicketRecord['category'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Styling & Treatment Quality">
                        Styling &amp; Treatment Quality
                      </option>
                      <option value="Billing / Refund Query">Billing / Refund Query</option>
                      <option value="Appointment Delay">Appointment Delay</option>
                      <option value="Package / Loyalty Balance">Package / Loyalty Balance</option>
                      <option value="Staff Conduct">Staff Conduct</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Subject Summary *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of guest issue..."
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Priority SLA
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          priority: e.target.value as ServiceTicketRecord['priority'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Critical">Critical (Immediate 2hr SLA)</option>
                      <option value="High">High (Same-Day Resolution)</option>
                      <option value="Medium">Medium (24hr SLA)</option>
                      <option value="Low">Low (General Inquiry)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Assigned Handler
                    </label>
                    <input
                      type="text"
                      value={newTicket.assignedTo}
                      onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Detailed Issue Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Record full details of conversation, symptoms, or complaint..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddTicketModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Log Ticket
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. Inspect Ticket Modal */}
      {inspectTicket &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 text-xs">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                      {inspectTicket.id}: {inspectTicket.subject}
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    {inspectTicket.clientName} · {inspectTicket.branch} · Created{' '}
                    {inspectTicket.createdDate}
                  </p>
                </div>
                <button
                  onClick={() => setInspectTicket(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto custom-scroll">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100">
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Priority SLA
                    </span>
                    <strong className="text-sm font-bold text-rose-700 mt-0.5 block">
                      {inspectTicket.priority}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100">
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Current State
                    </span>
                    <strong className="text-sm font-bold text-[#5A2EA6] mt-0.5 block">
                      {inspectTicket.status}
                    </strong>
                  </div>
                  <div className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100">
                    <span className="text-[10px] text-muted uppercase font-bold block">
                      Assigned Handler
                    </span>
                    <strong className="text-sm font-bold text-ink mt-0.5 block">
                      {inspectTicket.assignedTo}
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Incident Statement
                  </span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-ink leading-relaxed">
                    {inspectTicket.description}
                  </div>
                </div>

                {inspectTicket.resolutionNotes && (
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Resolution Audit Trail
                    </span>
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-900 leading-relaxed font-medium">
                      {inspectTicket.resolutionNotes}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[11px] font-bold text-ink uppercase tracking-wider block mb-2">
                    Update Ticket Status
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(
                      ['Open', 'In Progress', 'Waiting for Client', 'Resolved', 'Closed'] as const
                    ).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateTicketStatus(inspectTicket, st)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer border transition-all',
                          inspectTicket.status === st
                            ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                            : 'bg-white text-soft hover:bg-purple-50 border-slate-200',
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-purple-50 flex justify-end">
                <Button
                  onClick={() => setInspectTicket(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Close Ticket View
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Client Profile Dossier Modal */}
      <ClientProfileDossierModal
        client={selectedClientDossier}
        onClose={() => setSelectedClientDossier(null)}
      />
    </div>
  );
}
export default ServiceTicketsTab;
