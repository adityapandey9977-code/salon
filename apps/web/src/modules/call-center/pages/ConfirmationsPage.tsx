import React, { useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,

  CheckCircle2,
  Clock,
  Download,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  Search,
  Building2,
  Globe,
  MapPin,
  Sparkles,
  PhoneOutgoing
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';

export function ConfirmationsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    startInboundCall
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'reminders' | 'noresponse'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const [confirmations, setConfirmations] = useState([
    {
      id: 'CNF-101',
      name: 'Ananya Roy',
      phone: '+91 98765 43210',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      appointmentTime: 'Tomorrow 10:30 AM',
      service: 'Hydra Facial & Spa',
      reminderSent: '2 hrs ago',
      status: 'pending',
      channel: 'WhatsApp'
    },
    {
      id: 'CNF-102',
      name: 'Vikram Sethi',
      phone: '+91 98123 45678',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      appointmentTime: 'Tomorrow 02:00 PM',
      service: 'Keratin Hair Spa',
      reminderSent: '1 hr ago',
      status: 'confirmed',
      channel: 'SMS'
    },
    {
      id: 'CNF-103',
      name: 'Pooja Verma',
      phone: '+91 97111 22334',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      appointmentTime: 'Tomorrow 04:30 PM',
      service: 'Bridal Package Trial',
      reminderSent: '5 hrs ago',
      status: 'noresponse',
      channel: 'WhatsApp'
    },
    {
      id: 'CNF-104',
      name: 'Siddharth Nair',
      phone: '+91 99887 66554',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      appointmentTime: '2 Days Later 11:00 AM',
      service: 'Deep Tissue Massage',
      reminderSent: 'Pending Queue',
      status: 'pending',
      channel: 'WhatsApp'
    }
  ]);

  const handleSendReminder = (name: string, phone: string, channel: string) => {
    toast(`${channel} Reminder Sent: Automated confirmation interactive button sent to ${name} (${phone}).`);
  };

  const handleMarkStatus = (id: string, newStatus: string) => {
    setConfirmations(confirmations.map(c => c.id === id ? { ...c, status: newStatus } : c));
    toast(`Confirmation Status Updated: Booking [${id}] marked as ${newStatus.toUpperCase()}.`);
  };

  const handleCallClient = (item: any) => {
    startInboundCall({
      callerName: item.name,
      callerPhone: item.phone,
      vipTier: 'Gold VIP',
      walletBalance: '₹3,500.00',
      allergies: 'None reported',
      preferredBranch: item.branch,
      preferredStylist: 'Vikram Kulkarni'
    });
    toast(`Dialing Client: Initiated confirmation call to ${item.name} (${item.phone}).`);
  };

  const filtered = confirmations.filter((c) => {
    const matchesBranch = isAllBranches || c.branchId === selectedBranchId;
    const matchesTab = activeTab === 'reminders' || c.status === activeTab;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Appointment Confirmations &amp; No-Show Prevention
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Confirmation Queue' : `${selectedBranch.shortName} Confirmations`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Automated WhatsApp & SMS reminder queues, manual confirmation calls, and no-show reduction across all salon outlets.'
              : `Appointment verification queue specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={() => toast(`Export Confirmations: Downloaded reminder log for ${selectedBranch.shortName} as CSV.`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Reminders Log
        </button>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'pending', label: 'Pending Confirmations', count: confirmations.filter(c => c.status === 'pending' && (isAllBranches || c.branchId === selectedBranchId)).length },
          { id: 'confirmed', label: 'Confirmed Appointments', count: confirmations.filter(c => c.status === 'confirmed' && (isAllBranches || c.branchId === selectedBranchId)).length },
          { id: 'reminders', label: 'All Reminders Queue', count: confirmations.filter(c => isAllBranches || c.branchId === selectedBranchId).length },
          { id: 'noresponse', label: 'No Response Required', count: confirmations.filter(c => c.status === 'noresponse' && (isAllBranches || c.branchId === selectedBranchId)).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-soft hover:text-ink border border-line'
              }`}
          >
            {tab.label}{' '}
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Filter confirmation list by client name, mobile (+91), or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent border-0 outline-none text-ink"
        />
      </div>

      {/* CONFIRMATION LIST TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Client &amp; Contact</th>
                <th className="p-3">Target Outlet</th>
                <th className="p-3">Appointment Slot</th>
                <th className="p-3">Service Booked</th>
                <th className="p-3">Last Reminder</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Desk Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{item.name}</div>
                    <div className="text-[10.5px] font-mono text-soft">{item.phone}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {item.branch}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-purple-700">{item.appointmentTime}</td>
                  <td className="p-3 text-ink font-medium">{item.service}</td>

                  <td className="p-3">
                    <span className="text-soft font-mono text-[11px]">{item.reminderSent} ({item.channel})</span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        item.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCallClient(item)}
                        className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 cursor-pointer"
                        title="Voice Call"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSendReminder(item.name, item.phone, item.channel)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 cursor-pointer"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {item.status !== 'confirmed' && (
                        <button
                          onClick={() => handleMarkStatus(item.id, 'confirmed')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold cursor-pointer border-0"
                        >
                          Confirm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
