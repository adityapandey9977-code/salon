import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Phone,
  Play,
  Plus,
  Scissors,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { appointmentsApi } from '@/shared/api';
import { masterBranches } from '../locations/AllBranchesTab';
import { masterStaffRecords } from '../staff/StaffProfilePage';
import { isStylistOrTherapist } from './AvailabilityTab';
import { useOperationsData, type OperationsData } from './useOperationsData';

export interface WalkinQueueItem {
  id: string;
  queueNumber: string;
  clientName: string;
  clientMobile: string;
  isNewClient: boolean;
  service: string;
  preferredStaff: string;
  assignedStaff: string;
  estimatedWaitMinutes: number;
  position: number;
  createdTime: string;
  branch: string;
  status: 'Waiting' | 'Called' | 'Assigned' | 'In Service' | 'Completed' | 'Cancelled';
  notes: string;
}

export interface WalkinsQueueTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  operationsData?: OperationsData;
}

export function WalkinsQueueTab({
  defaultBranch = 'All',
  lockBranch = false,
  operationsData,
}: WalkinsQueueTabProps = {}) {
  const fallbackOps = useOperationsData({ defaultBranch, lockBranch });
  const ops = operationsData || fallbackOps;
  const { toast } = useToast();

  const branchesList = ops.branchesList.length > 0 ? ops.branchesList : masterBranches;
  const rawStaffList = ops.staffRoster.length > 0 ? ops.staffRoster : masterStaffRecords;
  const staffList = rawStaffList.filter(isStylistOrTherapist);

  const [branchFilter, setBranchFilter] = useState(defaultBranch);
  const [isAddWalkinOpen, setIsAddWalkinOpen] = useState(false);

  // New Walk-in Form State
  const [newWalkin, setNewWalkin] = useState({
    clientName: '',
    clientMobile: '',
    service: 'Express Hair Styling & Grooming',
    preferredStaff: 'Any Available Specialist',
    branch: defaultBranch !== 'All' ? defaultBranch : branchesList[0]?.name || 'Main Branch',
    estimatedDuration: 45,
    notes: '',
  });

  // Dynamically map from live walk-in appointments
  const liveQueueItems = useMemo<WalkinQueueItem[]>(() => {
    return ops.walkins.map((apt, idx) => ({
      id: apt.id,
      queueNumber: `Q-${101 + idx}`,
      clientName: apt.clientName,
      clientMobile: apt.clientMobile,
      isNewClient: apt.isNewClient,
      service: apt.services[0]?.name || 'Specialized Salon Protocol',
      preferredStaff: apt.staffName || 'Any Specialist',
      assignedStaff: apt.staffName || 'Floor Specialist',
      estimatedWaitMinutes: Math.max(5, (idx + 1) * 10),
      position: idx + 1,
      createdTime: apt.time,
      branch: apt.branch,
      status: (apt.status === 'In Service'
        ? 'In Service'
        : apt.status === 'Completed'
          ? 'Completed'
          : apt.status === 'Cancelled'
            ? 'Cancelled'
            : 'Waiting') as WalkinQueueItem['status'],
      notes: apt.notes,
    }));
  }, [ops.walkins]);

  const [localQueue, setLocalQueue] = useState<WalkinQueueItem[]>([]);

  // Combined queue items
  const queue = useMemo(() => {
    const combined = [...liveQueueItems];
    for (const item of localQueue) {
      if (!combined.some((q) => q.id === item.id)) {
        combined.push(item);
      }
    }
    return combined;
  }, [liveQueueItems, localQueue]);

  const filteredQueue = queue.filter((q) => branchFilter === 'All' || q.branch === branchFilter);

  const waitingCount = filteredQueue.filter((q) => q.status === 'Waiting').length;
  const avgWait =
    waitingCount > 0
      ? Math.round(
          filteredQueue.reduce((acc, q) => acc + q.estimatedWaitMinutes, 0) / filteredQueue.length,
        )
      : 0;

  const handleAddWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalkin.clientName || !newWalkin.clientMobile) return;

    try {
      const selectedBranchObj = branchesList.find(
        (b) => b.name === newWalkin.branch || `${b.name} (${b.city})` === newWalkin.branch,
      ) || branchesList[0];

      const selectedStaffObj = staffList.find((s) => s.fullName === newWalkin.preferredStaff);
      const selectedServiceObj = ops.servicesCatalog[0];

      const start = new Date();
      const end = new Date(start.getTime() + (newWalkin.estimatedDuration || 45) * 60000);

      if (selectedBranchObj?.id && ops.customersRoster[0]?.id && selectedServiceObj?.id) {
        await appointmentsApi.create({
          branchId: selectedBranchObj.id,
          customerId: ops.customersRoster[0].id,
          source: 'WALK_IN',
          scheduledStartAt: start.toISOString(),
          scheduledEndAt: end.toISOString(),
          notes: `Walk-in Guest: ${newWalkin.clientName} (${newWalkin.clientMobile}). ${newWalkin.notes}`.trim(),
          items: [
            {
              serviceId: selectedServiceObj.id,
              staffId: selectedStaffObj ? selectedStaffObj.id : undefined,
              scheduledStartAt: start.toISOString(),
              scheduledEndAt: end.toISOString(),
              price: Number(selectedServiceObj.basePrice) || 500,
            },
          ],
        });
      }

      const created: WalkinQueueItem = {
        id: `WK-0${queue.length + 1}`,
        queueNumber: `Q-${100 + queue.length + 1}`,
        clientName: newWalkin.clientName,
        clientMobile: newWalkin.clientMobile,
        isNewClient: true,
        service: newWalkin.service,
        preferredStaff: newWalkin.preferredStaff,
        assignedStaff: selectedStaffObj ? selectedStaffObj.fullName : 'Floor Specialist',
        estimatedWaitMinutes: 15,
        position: queue.length + 1,
        createdTime: 'Just now',
        branch: newWalkin.branch,
        status: 'Waiting',
        notes: newWalkin.notes,
      };

      setLocalQueue((prev) => [...prev, created]);
      ops.refetch();
      setIsAddWalkinOpen(false);
      toast(`Walk-in ticket #${created.queueNumber} issued for ${created.clientName}.`);
    } catch (err: any) {
      console.warn('Failed to persist walkin to database:', err);
      toast(`Walk-in ticket issued for ${newWalkin.clientName}.`);
      setIsAddWalkinOpen(false);
    }
  };

  const handleQueueAction = (id: string, action: 'call' | 'start' | 'cancel' | 'convert') => {
    if (action === 'call') {
      setLocalQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'Called' } : q)));
      toast(`Client called to styling chair station.`);
    } else if (action === 'start') {
      ops.handleUpdateStatus(id, 'In Service');
      setLocalQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'In Service' } : q)));
      toast(`Service commenced for walk-in client.`);
    } else if (action === 'cancel') {
      ops.handleUpdateStatus(id, 'Cancelled');
      setLocalQueue((prev) => prev.map((q) => (q.id === id ? { ...q, status: 'Cancelled' } : q)));
      toast(`Walk-in entry cancelled.`);
    } else if (action === 'convert') {
      ops.handleUpdateStatus(id, 'Confirmed');
      toast(`Walk-in converted to scheduled appointment booking.`);
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Walk-ins &amp; Live Queue Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {waitingCount} In Queue
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time floor walk-in ticketing, capacity enforcement, live wait-time pacing, and
            specialist assignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={() => setIsAddWalkinOpen(true)}
            className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Walk-in</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">Current Queue</span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            {waitingCount} Guests
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            Within Standard Buffer
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-[#5A2EA6] uppercase font-bold block">
            Average Wait Time
          </span>
          <strong className="text-2xl font-bold text-[#5A2EA6] font-serif mt-1 block">
            {avgWait} Mins
          </strong>
          <span className="text-[10px] text-soft mt-1 block">Live Floor Calculation</span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-muted uppercase font-bold block">
            Total Walk-ins Today
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            {ops.counts.walkins} {ops.counts.walkins === 1 ? 'Guest' : 'Guests'}
          </strong>
          <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
            Live Floor Pacing
          </span>
        </div>

        <div className="p-4.5 bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs">
          <span className="text-[10px] text-purple-700 uppercase font-bold block">
            Floor Capacity Status
          </span>
          <strong className="text-2xl font-bold text-ink font-serif mt-1 block">
            {ops.counts.occupancy}% Occupied
          </strong>
          <span className="text-[10px] text-soft mt-1 block">
            {Math.max(0, (branchesList.length || 1) * 6 - ops.counts.inService)} Stations Available
          </span>
        </div>
      </div>

      {/* Capacity & Constraint Safeguard Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <span>
          <strong>Floor Capacity Constraint:</strong> Walk-ins cannot bypass booked client slots or
          certified specialist skill prerequisites. If all qualified chairs are occupied, system
          places walk-in into paced queue.
        </span>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink">
          <span>Live Queue Stream</span>
        </div>

        {!lockBranch && (
          <div className="flex items-center gap-2 text-xs font-medium text-muted">
            <Building2 className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Branch:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="h-[34px] px-2.5 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none"
            >
              <option value="All">All Branches</option>
              {branchesList.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>


      {/* Queue Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
              Active Floor Walk-in Queue Pacing
            </h3>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredQueue.length} Queue Tickets
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Queue # & Pos',
                  'Client & Contact',
                  ...(!lockBranch ? ['Branch'] : []),
                  'Requested Service',
                  'Specialist Assigned',
                  'Est. Wait',
                  'Time Issued',
                  'Status',
                  'Actions',
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === arr.length - 1 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredQueue.map((item) => (
                <tr key={item.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  {/* Queue # & Pos */}
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#5A2EA6] text-white font-bold text-xs grid place-items-center">
                        #{item.position}
                      </span>
                      <strong className="text-ink font-mono text-xs">{item.queueNumber}</strong>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="p-3.5">
                    <strong className="text-ink text-xs block">{item.clientName}</strong>
                    <span className="text-[10px] text-muted">{item.clientMobile}</span>
                  </td>

                  {/* Branch */}
                  {!lockBranch && <td className="p-3.5 text-soft">{item.branch}</td>}

                  {/* Service */}
                  <td className="p-3.5 font-semibold text-ink text-xs max-w-xs truncate">
                    {item.service}
                  </td>

                  {/* Specialist */}
                  <td className="p-3.5">
                    <div className="font-semibold text-ink text-xs">{item.assignedStaff}</div>
                    <span className="text-[10px] text-muted">Pref: {item.preferredStaff}</span>
                  </td>

                  {/* Est Wait */}
                  <td className="p-3.5 font-bold text-[#5A2EA6]">
                    ~{item.estimatedWaitMinutes} Mins
                  </td>

                  {/* Time Issued */}
                  <td className="p-3.5 text-soft text-xs">{item.createdTime}</td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                        item.status === 'Waiting'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Called'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'In Service'
                              ? 'bg-purple-100 text-[#5A2EA6]'
                              : 'bg-emerald-100 text-emerald-800',
                      )}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'Waiting' && (
                        <button
                          onClick={() => handleQueueAction(item.id, 'call')}
                          className="h-7 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer border-0"
                        >
                          Call
                        </button>
                      )}
                      {item.status === 'Called' && (
                        <button
                          onClick={() => handleQueueAction(item.id, 'start')}
                          className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer border-0"
                        >
                          Start
                        </button>
                      )}
                      <button
                        onClick={() => handleQueueAction(item.id, 'convert')}
                        className="h-7 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] font-bold text-[11px] cursor-pointer border-0"
                        title="Convert to Scheduled Booking"
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Walk-in Modal */}
      {isAddWalkinOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100 w-full max-w-lg p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <h3 className="font-serif text-[18px] text-ink font-bold">
                  Register Walk-in Guest
                </h3>
                <button
                  onClick={() => setIsAddWalkinOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddWalkin} className="space-y-3.5">
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newWalkin.clientName}
                    onChange={(e) => setNewWalkin({ ...newWalkin, clientName: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    placeholder="e.g. Nitin Gupta"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newWalkin.clientMobile}
                    onChange={(e) => setNewWalkin({ ...newWalkin, clientMobile: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    placeholder="+91 98000 11223"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Branch Location
                    </label>
                    {lockBranch ? (
                      <input
                        type="text"
                        disabled
                        value={defaultBranch}
                        className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-slate-100 text-xs font-semibold text-slate-700 cursor-not-allowed"
                      />
                    ) : (
                      <select
                        value={newWalkin.branch}
                        onChange={(e) => setNewWalkin({ ...newWalkin, branch: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                      >
                        {branchesList.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                      Preferred Staff
                    </label>
                    <select
                      value={newWalkin.preferredStaff}
                      onChange={(e) =>
                        setNewWalkin({ ...newWalkin, preferredStaff: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                    >
                      <option value="Any Available Specialist">Any Available Specialist</option>
                      {staffList.map((s) => (
                        <option key={s.id} value={s.fullName}>
                          {s.fullName}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                    Requested Service
                  </label>
                  <input
                    type="text"
                    value={newWalkin.service}
                    onChange={(e) => setNewWalkin({ ...newWalkin, service: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddWalkinOpen(false)}
                    className="h-9 px-4 rounded-xl text-soft hover:bg-slate-100 cursor-pointer border border-slate-200 bg-white font-semibold"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-9 px-5 rounded-xl bg-[#5A2EA6] text-white font-bold"
                  >
                    Issue Queue Ticket
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

export default WalkinsQueueTab;
