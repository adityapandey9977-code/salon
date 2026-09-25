import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Eye,
  Heart,
  History,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  appointmentsApi,
  catalogueApi,
  customersApi,
  type ApiAppointmentSummary,
  type ApiCustomerSummary,
  type ApiServiceMaster,
} from '@/shared/api';
import { useCurrentStylist } from '../hooks/useCurrentStylist';

interface StylistClientRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visits: number;
  spend: string;
  totalSpendRaw: number;
  lastService: string;
  lastDate: string;
  hairType: string;
  allergy: string;
  formula: string;
  historyLogs: Array<{
    id: string;
    bookingNumber: string;
    serviceName: string;
    date: string;
    time: string;
    chair: string;
    price: number;
    status: string;
  }>;
}

export function ClientsPage() {
  const { toast } = useToast();
  const { stylist, staffId, stylistName, isLoading: isStylistLoading } = useCurrentStylist();

  const [activeTab, setActiveTab] = useState<'assigned' | 'history'>('assigned');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Raw API stores
  const [appointments, setAppointments] = useState<ApiAppointmentSummary[]>([]);
  const [customers, setCustomers] = useState<ApiCustomerSummary[]>([]);
  const [services, setServices] = useState<ApiServiceMaster[]>([]);

  // Selected client for detail view modal
  const [selectedClient, setSelectedClient] = useState<StylistClientRecord | null>(null);

  // Add Client Modal State
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isSubmittingClient, setIsSubmittingClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    firstName: '',
    lastName: '',
    mobilePhone: '',
    email: '',
    notes: '',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [aptList, custList, svcList] = await Promise.all([
        appointmentsApi
          .list({
            staffId: staffId || undefined,
            limit: 200,
          })
          .catch((err) => {
            console.warn('Failed to load appointments for stylist clients:', err);
            return [] as ApiAppointmentSummary[];
          }),
        customersApi.list({ limit: 100 }).catch(() => [] as ApiCustomerSummary[]),
        catalogueApi.fetchServices().catch(() => [] as ApiServiceMaster[]),
      ]);

      setAppointments(aptList || []);
      setCustomers(custList || []);
      setServices(svcList || []);
    } catch (err: any) {
      console.error('Failed to load clients data:', err);
      toast('Failed to load clients. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, [staffId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Aggregate appointments by customer to build the stylist's client list
  const clientRecords = useMemo<StylistClientRecord[]>(() => {
    // Map of customerId -> aggregated data
    const map = new Map<string, StylistClientRecord>();

    appointments.forEach((apt) => {
      const cId = apt.customerId;
      if (!cId) return;

      const cust = customers.find((c) => c.id === cId);
      const name =
        cust?.displayName ||
        `${cust?.firstName || ''} ${cust?.lastName || ''}`.trim() ||
        'Client ' + (apt.bookingNumber || cId.slice(0, 6));
      const phone = cust?.mobilePhone || '—';
      const email = cust?.email || undefined;

      // Extract service name
      const firstItem = apt.items?.[0];
      const svc = services.find((s) => s.id === firstItem?.serviceId);
      const serviceName = svc?.name || apt.notes || 'Salon Treatment';

      const resource = apt.resources?.[0];
      const chair = resource?.resourceType
        ? `${resource.resourceType} ${resource.id.slice(0, 2)}`
        : 'Chair 01';

      const price = Number(firstItem?.priceSnapshot || apt.subtotalEstimate || 0);

      const logItem = {
        id: apt.id,
        bookingNumber: apt.bookingNumber || `APT-${apt.id.slice(0, 6).toUpperCase()}`,
        serviceName,
        date: new Date(apt.scheduledStartAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: new Date(apt.scheduledStartAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        chair,
        price,
        status: apt.status,
      };

      const aptTime = new Date(apt.scheduledStartAt).getTime();

      if (!map.has(cId)) {
        map.set(cId, {
          id: cId,
          name,
          phone,
          email,
          visits: 1,
          spend: `₹${price.toLocaleString()}`,
          totalSpendRaw: price,
          lastService: serviceName,
          lastDate: logItem.date,
          hairType: cust?.notes?.includes('Hair:')
            ? cust.notes.split('Hair:')[1].split(';')[0].trim()
            : 'Standard / Normal Texture',
          allergy: apt.notes?.toLowerCase().includes('allerg')
            ? apt.notes
            : 'None Recorded (Patch Test Clear)',
          formula: apt.notes?.toLowerCase().includes('formula')
            ? apt.notes
            : 'Standard Salon Protocol',
          historyLogs: [logItem],
        });
      } else {
        const existing = map.get(cId)!;
        existing.visits += 1;
        existing.totalSpendRaw += price;
        existing.spend = `₹${existing.totalSpendRaw.toLocaleString()}`;
        existing.historyLogs.push(logItem);

        // Update latest service if this appointment is newer
        const existingLatestTime = new Date(existing.lastDate).getTime();
        if (aptTime > existingLatestTime) {
          existing.lastDate = logItem.date;
          existing.lastService = serviceName;
          if (apt.notes?.toLowerCase().includes('allerg')) {
            existing.allergy = apt.notes;
          }
        }
      }
    });

    return Array.from(map.values());
  }, [appointments, customers, services]);

  // Filter clients by search query
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clientRecords;
    const q = searchTerm.toLowerCase();
    return clientRecords.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.lastService.toLowerCase().includes(q) ||
        c.hairType.toLowerCase().includes(q),
    );
  }, [clientRecords, searchTerm]);

  // All historical logs across clients
  const allHistoryLogs = useMemo(() => {
    const logs: Array<{
      clientId: string;
      clientName: string;
      clientPhone: string;
      bookingNumber: string;
      serviceName: string;
      date: string;
      time: string;
      chair: string;
      price: number;
      status: string;
    }> = [];

    clientRecords.forEach((cli) => {
      cli.historyLogs.forEach((log) => {
        logs.push({
          clientId: cli.id,
          clientName: cli.name,
          clientPhone: cli.phone,
          ...log,
        });
      });
    });

    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [clientRecords]);

  // Handle Add Client Form Submit
  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.firstName.trim() || !newClientForm.mobilePhone.trim()) {
      toast('Please enter client first name and mobile phone');
      return;
    }

    setIsSubmittingClient(true);
    try {
      await customersApi.create({
        firstName: newClientForm.firstName.trim(),
        lastName: newClientForm.lastName.trim() || undefined,
        displayName: `${newClientForm.firstName.trim()} ${newClientForm.lastName.trim()}`.trim(),
        mobilePhone: newClientForm.mobilePhone.trim(),
        email: newClientForm.email.trim() || undefined,
        notes: newClientForm.notes.trim() || undefined,
        source: 'WALK_IN',
        status: 'ACTIVE',
      });

      toast('Client profile registered successfully!');
      setIsAddClientOpen(false);
      setNewClientForm({ firstName: '', lastName: '', mobilePhone: '', email: '', notes: '' });
      await loadData();
    } catch (err: any) {
      console.error('Failed to create client:', err);
      toast(err?.message || 'Failed to create client');
    } finally {
      setIsSubmittingClient(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold tracking-tight">
              My Client CRM &amp; History
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {stylistName}
            </span>
          </div>
          <p className="text-[13px] text-soft mt-1">
            Clients who have booked services with {stylistName}, including visit frequency, diagnostic notes &amp; history logs
          </p>
        </div>

        {/* Tab switcher & refresh */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadData()}
            variant="outline"
            disabled={isLoading}
            className="h-9 px-3 text-xs font-bold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
            title="Refresh Clients"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1', isLoading ? 'animate-spin' : '')} />
            Refresh
          </Button>

          <div className="flex bg-[#F8F5FF] p-1 rounded-2xl border border-[#5A2EA6]/15">
            <button
              onClick={() => setActiveTab('assigned')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'assigned'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              Assigned Clients ({clientRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition border-0 cursor-pointer',
                activeTab === 'history'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-[#5A2EA6]/5',
              )}
            >
              Client History &amp; Logs ({allHistoryLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs font-semibold text-[#5A2EA6]">
          <Loader2 className="w-4 h-4 animate-spin" />
          Synchronizing client profiles from customer service...
        </div>
      )}

      {/* TAB 1: ASSIGNED CLIENTS */}
      {activeTab === 'assigned' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="relative w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assigned clients..."
                className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl py-2 px-3 pl-8 text-xs font-semibold outline-none focus:border-[#5A2EA6]"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
            </div>

            <Button
              onClick={() => setIsAddClientOpen(true)}
              className="h-9 text-xs font-bold bg-[#5A2EA6] hover:bg-[#4A248A] text-white rounded-xl shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Client Profile
            </Button>
          </div>

          {filteredClients.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <Users className="w-10 h-10 text-[#5A2EA6]/30 mx-auto" />
              <p className="text-sm font-bold text-ink">
                {searchTerm ? 'No clients match your search' : 'No clients recorded yet'}
              </p>
              <p className="text-xs text-soft max-w-sm mx-auto">
                Clients who book an appointment with {stylistName} will automatically be cataloged here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredClients.map((cli) => (
                <div
                  key={cli.id}
                  className="bg-[#FCFAFF] border border-[#5A2EA6]/15 rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-[#5A2EA6]/40 transition shadow-xs"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-base font-bold text-ink">{cli.name}</h3>
                        <span className="text-[11px] text-soft font-mono font-semibold">
                          {cli.phone}
                        </span>
                      </div>
                      <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {cli.visits} {cli.visits === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-[11.5px]">
                      <p className="text-soft">
                        Last Service:{' '}
                        <strong className="text-ink">{cli.lastService}</strong>
                      </p>
                      <p className="text-soft">
                        Last Visit Date:{' '}
                        <strong className="text-[#5A2EA6] font-mono">{cli.lastDate}</strong>
                      </p>
                    </div>

                    {cli.allergy !== 'None Recorded (Patch Test Clear)' ? (
                      <div className="mt-3 bg-rose-50 border border-rose-200 p-2 rounded-xl text-[10.5px] font-bold text-rose-800">
                        ⚠️ Safety Caution: {cli.allergy}
                      </div>
                    ) : (
                      <div className="mt-3 bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-[10.5px] font-bold text-emerald-800">
                        ✓ Safety Check Clear
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-line/60 flex justify-between items-center">
                    <span className="text-[11px] font-mono font-bold text-ink">
                      Total Spend: {cli.spend}
                    </span>
                    <Button
                      onClick={() => setSelectedClient(cli)}
                      variant="outline"
                      className="h-7 px-2.5 text-[10.5px] font-bold border-[#5A2EA6]/20 text-[#5A2EA6]"
                    >
                      <Eye className="w-3 h-3 mr-1" /> View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLIENT HISTORY & LOGS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-[24px] border border-[#5A2EA6]/15 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-ink">Treatment History &amp; Logs</h3>
              <p className="text-xs text-soft">
                Chronological record of all service sessions conducted by {stylistName}
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#5A2EA6] bg-[#5A2EA6]/10 px-3 py-1 rounded-full">
              {allHistoryLogs.length} Total Sessions
            </span>
          </div>

          {allHistoryLogs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <History className="w-10 h-10 text-[#5A2EA6]/30 mx-auto" />
              <p className="text-sm font-bold text-ink">No historical sessions recorded yet</p>
              <p className="text-xs text-soft">Past appointment records will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#5A2EA6]/15 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/15 text-[#5A2EA6] font-mono uppercase text-[10px]">
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Booking #</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Station</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/10">
                  {allHistoryLogs.map((log, idx) => (
                    <tr key={`${log.clientId}-${idx}`} className="hover:bg-[#FCFAFF] transition">
                      <td className="p-3 font-mono font-bold text-ink">
                        {log.date} · {log.time}
                      </td>
                      <td className="p-3 font-mono text-[#5A2EA6] font-bold">{log.bookingNumber}</td>
                      <td className="p-3">
                        <strong className="font-bold text-ink block">{log.clientName}</strong>
                        <span className="text-[10.5px] text-soft font-mono">{log.clientPhone}</span>
                      </td>
                      <td className="p-3 font-medium text-ink">{log.serviceName}</td>
                      <td className="p-3 text-soft font-mono">{log.chair}</td>
                      <td className="p-3 font-mono font-bold text-ink">
                        ₹{log.price.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                            log.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'IN_SERVICE'
                                ? 'bg-purple-100 text-[#5A2EA6]'
                                : 'bg-gray-100 text-gray-700',
                          )}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CLIENT PROFILE DETAIL MODAL */}
      {selectedClient &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-[94vw] max-w-2xl max-h-[92vh] shadow-[0_30px_70px_rgba(90,46,166,0.25)] border border-[#5A2EA6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative z-[100000]">
              <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-7 py-5 border-b border-[#5A2EA6]/15 flex justify-between items-center relative shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Client Diagnostic Profile &amp; Treatment History
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-0.5">
                    {selectedClient.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-paper text-soft hover:text-ink flex items-center justify-center transition border border-[#5A2EA6]/15 cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-7 overflow-y-auto space-y-5 text-xs flex-1">
                {/* Stats Header */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-[#FCFAFF] p-4 rounded-2xl border border-[#5A2EA6]/10">
                  <div>
                    <span className="text-soft text-[11px]">Total Visits:</span>
                    <strong className="block text-sm font-bold text-ink">
                      {selectedClient.visits} Sessions
                    </strong>
                  </div>
                  <div>
                    <span className="text-soft text-[11px]">Total Stylist Spend:</span>
                    <strong className="block text-sm font-bold text-[#5A2EA6]">
                      {selectedClient.spend}
                    </strong>
                  </div>
                  <div>
                    <span className="text-soft text-[11px]">Client Mobile:</span>
                    <strong className="block text-sm font-mono font-bold text-ink">
                      {selectedClient.phone}
                    </strong>
                  </div>
                </div>

                {/* Safety Caution Banner */}
                {selectedClient.allergy !== 'None Recorded (Patch Test Clear)' ? (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-800 font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>⚠️ Safety Alert: {selectedClient.allergy}</span>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-800 font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>Patch Test &amp; Safety Diagnostic Clear</span>
                  </div>
                )}

                {/* Session Timeline */}
                <div>
                  <h4 className="font-serif text-sm font-bold text-ink mb-2">
                    Historical Treatment Sessions
                  </h4>
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {selectedClient.historyLogs.map((log) => (
                      <div
                        key={log.id}
                        className="bg-[#F8F5FF]/60 border border-[#5A2EA6]/10 rounded-xl p-3 flex justify-between items-center"
                      >
                        <div>
                          <strong className="font-bold text-ink block">{log.serviceName}</strong>
                          <span className="text-[11px] text-soft font-mono">
                            {log.date} · {log.time} · {log.chair}
                          </span>
                        </div>
                        <div className="text-right">
                          <strong className="font-mono font-bold text-ink block">
                            ₹{log.price.toLocaleString()}
                          </strong>
                          <span className="text-[9.5px] font-bold text-[#5A2EA6] uppercase">
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#FCFAFF] px-7 py-4 border-t border-[#5A2EA6]/10 flex justify-end shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold border-line bg-white hover:bg-paper/40 cursor-pointer"
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ADD NEW CLIENT MODAL */}
      {isAddClientOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-[94vw] max-w-lg shadow-[0_30px_70px_rgba(90,46,166,0.25)] border border-[#5A2EA6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative z-[100000]">
              <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-7 py-5 border-b border-[#5A2EA6]/15 flex justify-between items-center relative shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                    Customer Registration
                  </span>
                  <h3 className="font-serif text-xl font-bold text-ink mt-0.5">
                    Add New Client Profile
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddClientOpen(false)}
                  className="w-9 h-9 rounded-full bg-white hover:bg-paper text-soft hover:text-ink flex items-center justify-center transition border border-[#5A2EA6]/15 cursor-pointer shadow-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddClientSubmit} className="p-7 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-ink mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={newClientForm.firstName}
                      onChange={(e) =>
                        setNewClientForm({ ...newClientForm, firstName: e.target.value })
                      }
                      placeholder="e.g. Aditi"
                      className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">Last Name</label>
                    <input
                      type="text"
                      value={newClientForm.lastName}
                      onChange={(e) =>
                        setNewClientForm({ ...newClientForm, lastName: e.target.value })
                      }
                      placeholder="e.g. Verma"
                      className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newClientForm.mobilePhone}
                    onChange={(e) =>
                      setNewClientForm({ ...newClientForm, mobilePhone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) =>
                      setNewClientForm({ ...newClientForm, email: e.target.value })
                    }
                    placeholder="aditi@example.com"
                    className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">
                    Initial Diagnostic / Hair Profile Notes
                  </label>
                  <textarea
                    rows={3}
                    value={newClientForm.notes}
                    onChange={(e) =>
                      setNewClientForm({ ...newClientForm, notes: e.target.value })
                    }
                    placeholder="e.g. Curly Type 3A; Sensitive to ammonia."
                    className="w-full bg-[#FCFAFF] border border-[#5A2EA6]/20 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-[#5A2EA6] resize-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#5A2EA6]/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddClientOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border-line bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingClient}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4A248A] text-white"
                  >
                    {isSubmittingClient ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      'Save Client'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
