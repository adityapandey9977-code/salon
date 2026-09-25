import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@salon-spa-saas/ui';
import {
  PhoneCall,
  Search,
  Download,
  Play,
  Pause,
  Clock,
  UserCheck,
  Building2,
  Globe,
  MapPin,
  Calendar,
  Volume2,
  FileText,
  Tag,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function CallLogsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches
  } = useCallCenterBranch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDispositionFilter, setSelectedDispositionFilter] = useState('All Dispositions');
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);
  const [selectedLogModal, setSelectedLogModal] = useState<any>(null);

  const dispositionCategories = [
    'Appointment Booked',
    'Reschedule Request',
    'Price & Service Inquiry',
    'Membership & Wallet',
    'Cancellation Request',
    'Complaint / Grievance'
  ];

  const [callLogs, setCallLogs] = useState([
    {
      id: 'CALL-20260902-081',
      gatewaySessionId: 'EXO-SID-9948102381',
      agent: 'Rohan Arora',
      customerName: 'Ananya Roy',
      customerPhone: '+91 98765 43210',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      direction: 'Inbound',
      duration: '3m 45s',
      durationSecs: 225,
      timestamp: '2026-09-02 10:15 AM',
      disposition: 'Appointment Booked',
      resultingBookingId: 'APT-2026-901',
      notes: 'Customer booked Hydra Facial Glow & Spa for Saturday 3:00 PM with Senior Colorist Vikram Kulkarni. ₹1,000 advance link sent.',
      audioUrl: 'https://s3.amazonaws.com/salon-calls/2026/09/CALL-20260902-081.mp3'
    },
    {
      id: 'CALL-20260902-080',
      gatewaySessionId: 'EXO-SID-9948102340',
      agent: 'Neha Sharma',
      customerName: 'Vikram Sethi',
      customerPhone: '+91 98123 45678',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      direction: 'Outbound',
      duration: '2m 18s',
      durationSecs: 138,
      timestamp: '2026-09-02 09:45 AM',
      disposition: 'Price & Service Inquiry',
      resultingBookingId: null,
      notes: 'Followed up on Google Search lead for Keratin Treatment. Shared festive brochure on WhatsApp. Expected booking tomorrow.',
      audioUrl: 'https://s3.amazonaws.com/salon-calls/2026/09/CALL-20260902-080.mp3'
    },
    {
      id: 'CALL-20260902-079',
      gatewaySessionId: 'EXO-SID-9948102290',
      agent: 'Aditi Nair',
      customerName: 'Pooja Verma',
      customerPhone: '+91 97111 22334',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      direction: 'Inbound',
      duration: '4m 30s',
      durationSecs: 270,
      timestamp: '2026-09-02 09:20 AM',
      disposition: 'Appointment Booked',
      resultingBookingId: 'APT-2026-884',
      notes: 'Bridal consultation scheduled with Master Aesthetician Kavita Sundaram. Prepaid ₹2,500 deposit via UPI QR.',
      audioUrl: 'https://s3.amazonaws.com/salon-calls/2026/09/CALL-20260902-079.mp3'
    },
    {
      id: 'CALL-20260902-078',
      gatewaySessionId: 'EXO-SID-9948102188',
      agent: 'Priya Varma',
      customerName: 'Siddharth Nair',
      customerPhone: '+91 99887 66554',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      direction: 'Inbound',
      duration: '1m 50s',
      durationSecs: 110,
      timestamp: '2026-09-02 08:50 AM',
      disposition: 'Reschedule Request',
      resultingBookingId: 'APT-2026-760',
      notes: 'Rescheduled deep tissue spa from Thursday to Friday 6:00 PM due to client travel plans.',
      audioUrl: 'https://s3.amazonaws.com/salon-calls/2026/09/CALL-20260902-078.mp3'
    }
  ]);

  const handleTogglePlay = (callId: string) => {
    if (playingCallId === callId) {
      setPlayingCallId(null);
      toast('Audio Paused: Playback halted.');
    } else {
      setPlayingCallId(callId);
      toast(`Playing Call Recording: Listening to secure audio recording [${callId}].`);
    }
  };

  const filteredLogs = callLogs.filter((log) => {
    const matchesBranch = isAllBranches || log.branchId === selectedBranchId;
    const matchesDisposition = selectedDispositionFilter === 'All Dispositions' || log.disposition === selectedDispositionFilter;
    const matchesSearch =
      log.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.customerPhone.includes(searchQuery) ||
      log.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesDisposition && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Telephony Call Recordings &amp; Audit Logs
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Telephony Logs' : `${selectedBranch.shortName} Calls`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Complete cloud telephony audit trail: Inbound & outbound calls, S3 audio recordings, call duration, and intent dispositions across all salon outlets.'
              : `Telephony call recordings and intent dispositions strictly recorded for ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={() => toast(`Export Call Logs: Downloaded telephony audit report for ${selectedBranch.shortName} as CSV.`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Call Logs
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by caller name, mobile phone (+91), agent, or Call ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={selectedDispositionFilter}
          onChange={(e) => setSelectedDispositionFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Dispositions">All Call Intent Dispositions</option>
          {dispositionCategories.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* CALL LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Call ID &amp; Time</th>
                <th className="p-3">Guest &amp; Phone #</th>
                <th className="p-3">Target Outlet</th>
                <th className="p-3">Concierge Agent</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Call Intent Disposition</th>
                <th className="p-3">Audio Playback</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredLogs.map((log) => {
                const isPlaying = playingCallId === log.id;
                return (
                  <tr key={log.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-3 font-bold text-purple-700">
                      <div>{log.id}</div>
                      <div className="text-[10px] text-muted font-mono">{log.timestamp}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-ink">{log.customerName}</div>
                      <div className="text-[10.5px] font-mono text-soft">{log.customerPhone}</div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-ink flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                        {log.branch}
                      </div>
                    </td>

                    <td className="p-3 text-ink font-medium">{log.agent}</td>
                    <td className="p-3 font-mono font-bold text-ink">{log.duration}</td>

                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.disposition === 'Appointment Booked' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        log.disposition === 'Reschedule Request' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        log.disposition === 'Price & Service Inquiry' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {log.disposition}
                      </span>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleTogglePlay(log.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-0 ${
                          isPlaying
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
                      </button>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLogModal(log)}
                        className="px-2.5 py-1 bg-white border border-line hover:bg-paper rounded-lg text-[11px] font-semibold text-ink cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DOSSIER MODAL */}
      {selectedLogModal && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Telephony Call Transcript &amp; Audit</h3>
                <p className="text-xs text-soft font-mono">{selectedLogModal.id} • Gateway SID: {selectedLogModal.gatewaySessionId}</p>
              </div>
              <button onClick={() => setSelectedLogModal(null)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-pine/5 rounded-2xl border border-line">
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase">Customer Info</span>
                  <div className="font-bold text-ink text-sm">{selectedLogModal.customerName}</div>
                  <div className="text-[10px] text-muted font-mono">{selectedLogModal.customerPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase">Agent &amp; Branch</span>
                  <div className="font-bold text-purple-900">{selectedLogModal.agent}</div>
                  <div className="text-[10px] text-muted">{selectedLogModal.branch}</div>
                </div>
              </div>

              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/60 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">Agent Conversation Notes</span>
                <p className="text-[11px] text-ink leading-relaxed">{selectedLogModal.notes}</p>
              </div>

              {selectedLogModal.resultingBookingId && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Linked Booking Dispatched</span>
                    <div className="text-sm font-bold text-emerald-900">{selectedLogModal.resultingBookingId}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                    Confirmed
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedLogModal(null)}
                className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-xs"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
