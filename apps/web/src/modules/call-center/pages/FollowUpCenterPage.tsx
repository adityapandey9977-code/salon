import React, { useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Globe,
  MapPin,
  PhoneCall,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function FollowUpCenterPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    startInboundCall
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'today' | 'missed' | 'history' | 'csat'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const [followups, setFollowups] = useState([
    {
      id: 'FL-01',
      clientName: 'Sunita Kapoor',
      phone: '+91 98112 33445',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      time: '11:30 AM',
      reason: 'Keratin treatment inquiry callback & slot check',
      status: 'today',
      priority: 'High',
      csat: 5
    },
    {
      id: 'FL-02',
      clientName: 'Meera Deshmukh',
      phone: '+91 98334 55667',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      time: '02:00 PM',
      reason: 'Bridal package quotation discussion',
      status: 'today',
      priority: 'Medium',
      csat: 4
    },
    {
      id: 'FL-03',
      clientName: 'Rajesh Khanna',
      phone: '+91 98123 99887',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      time: 'Yesterday 04:00 PM',
      reason: 'Post-service satisfaction check (Hydra Facial)',
      status: 'missed',
      priority: 'High',
      csat: 5
    },
    {
      id: 'FL-04',
      clientName: 'Siddharth Rao',
      phone: '+91 99887 66554',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      time: '10:00 AM',
      reason: 'Scalp spa treatment satisfaction check',
      status: 'today',
      priority: 'Medium',
      csat: 5
    }
  ]);

  const handleCall = (item: any) => {
    startInboundCall({
      callerName: item.clientName,
      callerPhone: item.phone,
      vipTier: 'Gold VIP',
      walletBalance: '₹4,200.00',
      allergies: 'None',
      preferredBranch: item.branch,
      preferredStylist: 'Vikram Kulkarni'
    });
    toast(`Outbound Follow-up Connected: Dialing ${item.clientName} (${item.phone})...`);
  };

  const handleCompleteFollowup = (id: string) => {
    setFollowups(followups.map(f => f.id === id ? { ...f, status: 'history' } : f));
    toast('Follow-up Resolved: Marked as completed and logged in guest communication history.');
  };

  const filtered = followups.filter((f) => {
    const matchesBranch = isAllBranches || f.branchId === selectedBranchId;
    const matchesTab = activeTab === 'history' || activeTab === 'csat' || f.status === activeTab;
    const matchesSearch =
      f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.phone.includes(searchQuery) ||
      f.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Follow-up Center &amp; Post-Service CSAT Queue
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Follow-up Desk' : `${selectedBranch.shortName} Follow-ups`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Scheduled callbacks, missed follow-up queue, outbound call notes, and post-service satisfaction feedback across all salon branches.'
              : `Follow-up queue and client satisfaction reviews strictly for ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={() => toast(`Export Call History: Downloaded follow-up records for ${selectedBranch.shortName} as CSV.`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Call History
        </button>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'today', label: "Today's Follow-ups", count: followups.filter(f => f.status === 'today' && (isAllBranches || f.branchId === selectedBranchId)).length },
          { id: 'missed', label: 'Missed Follow-ups', count: followups.filter(f => f.status === 'missed' && (isAllBranches || f.branchId === selectedBranchId)).length },
          { id: 'history', label: 'Complete Call History', count: followups.filter(f => isAllBranches || f.branchId === selectedBranchId).length },
          { id: 'csat', label: 'CSAT Reviews (5-Star)', count: followups.filter(f => f.csat >= 4 && (isAllBranches || f.branchId === selectedBranchId)).length }
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
          placeholder="Search follow-up by guest name, mobile (+91), or reason..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent border-0 outline-none text-ink"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Client &amp; Contact</th>
                <th className="p-3">Salon Outlet</th>
                <th className="p-3">Scheduled Time</th>
                <th className="p-3">Follow-up Reason</th>
                <th className="p-3">Priority</th>
                <th className="p-3">CSAT Score</th>
                <th className="p-3 text-right">Desk Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{item.clientName}</div>
                    <div className="text-[10.5px] font-mono text-soft">{item.phone}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {item.branch}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-purple-700">{item.time}</td>
                  <td className="p-3 font-medium text-ink/90">{item.reason}</td>

                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.csat}.0</span>
                    </div>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCall(item)}
                        className="px-2.5 py-1 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer border-0"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </button>

                      {item.status !== 'history' && (
                        <button
                          onClick={() => handleCompleteFollowup(item.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10.5px] font-bold cursor-pointer border-0"
                        >
                          Complete
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
