import React, { useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Filter,
  Globe,
  Headphones,
  MapPin,
  PhoneCall,
  PhoneOutgoing,
  Search,
  Sparkles,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function DashboardPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    startInboundCall
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');
  const [leadSearch, setLeadSearch] = useState('');
  const [callActive, setCallActive] = useState(false);
  const [currentCallNumber, setCurrentCallNumber] = useState('');

  // Sample dynamic leads in queue with branch tagging
  const [leadsQueue, setLeadsQueue] = useState([
    {
      id: '1',
      name: 'Ananya Roy',
      phone: '+91 98765 43210',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      source: 'Meta Lead Ads',
      service: 'Hydra Facial & Spa',
      status: 'In Queue',
      time: '2 mins ago',
      agent: 'Unassigned',
      vipTier: 'Black Diamond VIP',
      walletBalance: '₹8,450.00',
      allergies: 'Severe Ammonia sensitivity; requires sulfate-free botanical toners only.',
      preferredStylist: 'Vikram Kulkarni (Master Colorist)'
    },
    {
      id: '2',
      name: 'Vikram Sethi',
      phone: '+91 98123 45678',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      source: 'Google Ads',
      service: 'Keratin Hair Treatment',
      status: 'Follow-up',
      time: '15 mins ago',
      agent: 'Rohan A.',
      vipTier: 'Gold VIP',
      walletBalance: '₹3,200.00',
      allergies: 'None reported',
      preferredStylist: 'Neha Sharma'
    },
    {
      id: '3',
      name: 'Pooja Verma',
      phone: '+91 97111 22334',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      source: 'WhatsApp Direct',
      service: 'Bridal Package Consultation',
      status: 'Urgent',
      time: '28 mins ago',
      agent: 'Rohan A.',
      vipTier: 'Platinum VIP',
      walletBalance: '₹12,000.00',
      allergies: 'Nut oil allergy for body massages',
      preferredStylist: 'Kavita Sundaram'
    },
    {
      id: '4',
      name: 'Siddharth Nair',
      phone: '+91 99887 66554',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      source: 'Website Inquiry',
      service: 'Deep Tissue Massage',
      status: 'In Queue',
      time: '40 mins ago',
      agent: 'Unassigned',
      vipTier: 'Silver Member',
      walletBalance: '₹1,500.00',
      allergies: 'None',
      preferredStylist: 'Aditi Nair'
    }
  ]);

  const [urgentReminders, setUrgentReminders] = useState([
    {
      id: 'R1',
      name: 'Sunita Kapoor',
      phone: '+91 98222 11009',
      branchId: 'mumbai',
      service: 'Keratin Hair Consultation',
      due: 'Overdue by 15m',
      status: 'Overdue'
    },
    {
      id: 'R2',
      name: 'Meera Deshmukh',
      phone: '+91 98333 44556',
      branchId: 'mumbai',
      service: 'Bridal Trial Package Quotation',
      due: 'Due at 02:30 PM',
      status: 'Pending'
    },
    {
      id: 'R3',
      name: 'Rahul Khanna',
      phone: '+91 98444 77889',
      branchId: 'delhi',
      service: 'Hair Transplant & Scalp Follow-up',
      due: 'Due at 03:15 PM',
      status: 'Pending'
    }
  ]);

  const handleStartCall = (lead: any) => {
    startInboundCall({
      callerName: lead.name,
      callerPhone: lead.phone,
      vipTier: lead.vipTier || 'Gold VIP',
      walletBalance: lead.walletBalance || '₹2,500.00',
      allergies: lead.allergies || 'None reported',
      preferredBranch: lead.branch,
      preferredStylist: lead.preferredStylist || 'Vikram Kulkarni'
    });
    toast(`CTI Outbound Connected: Dialing ${lead.name} (${lead.phone})... Screen-pop CRM opened.`);
  };

  const handleExportData = () => {
    toast(`Export Call Desk Report: Daily performance report for ${selectedBranch.shortName} exported as CSV.`);
  };

  const filteredLeads = leadsQueue.filter((l) => {
    const matchesBranch = isAllBranches || l.branchId === selectedBranchId;
    const matchesSearch =
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.service.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const filteredReminders = urgentReminders.filter((r) => isAllBranches || r.branchId === selectedBranchId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Call Centre &amp; Central Concierge Desk
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Concierge View' : `${selectedBranch.shortName}`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'National multi-branch command center: Inbound CTI call distribution, cross-branch appointment booking, follow-up tracking, and lost-client revival.'
              : `Call concierge and appointment dispatch operations specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-pine/10 p-1 rounded-xl">
            {(['today', 'week', 'month'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer border-0 ${activeTab === t ? 'bg-white text-ink shadow-xs' : 'bg-transparent text-soft hover:text-ink'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Desk Metrics
          </button>
        </div>
      </div>

      {/* METRIC CARDS GRID (5 PRD CARDS DYNAMICALLY BOUND) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-soft">Total Inquiries</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-ink">{selectedBranch.inquiriesToday}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            +18.4% vs last week
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-soft">Active Call Queue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">{filteredLeads.length}</div>
          <div className="text-[11px] text-soft mt-1">Avg wait time: 1.8 mins</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-soft">Lead Conversion</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{selectedBranch.leadConversionRate}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">+4.2% desk conversion target</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-soft">Follow-ups Due</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-900">{selectedBranch.followUpsDue}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">{filteredReminders.length} urgent due now</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-soft">Win-Back Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#5A2EA6] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#5A2EA6]">{selectedBranch.winBackRevenue}</div>
          <div className="text-[11px] text-soft mt-1">Inactive clients recovered</div>
        </div>
      </div>

      {/* MAIN 2-COLUMN SECTION: INCOMING LEADS QUEUE & AGENT TARGET METERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: LIVE INCOMING LEAD QUEUE */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-line shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-1.5">
                <span>Live Incoming Lead Queue</span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                  {filteredLeads.length} Available
                </span>
              </h3>
              <p className="text-[11px] text-soft">Leads captured from Meta Ads, Google, WhatsApp, and Webforms</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Filter lead by name or phone..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                  <th className="p-2.5">Customer / Phone</th>
                  <th className="p-2.5">Target Outlet</th>
                  <th className="p-2.5">Source Channel</th>
                  <th className="p-2.5">Inquired Service</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-2.5">
                      <div className="font-bold text-ink">{lead.name}</div>
                      <div className="text-[10px] font-mono text-soft">{lead.phone} • {lead.time}</div>
                    </td>

                    <td className="p-2.5">
                      <div className="text-ink font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                        {lead.branch}
                      </div>
                    </td>

                    <td className="p-2.5">
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        {lead.source}
                      </span>
                    </td>

                    <td className="p-2.5 text-ink font-medium">{lead.service}</td>

                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${lead.status === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                          lead.status === 'Follow-up' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                        {lead.status}
                      </span>
                    </td>

                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleStartCall(lead)}
                        className="px-3 py-1.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto shadow-xs cursor-pointer border-0 transition-all"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call Lead</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 1 COLUMN: AGENT TARGET & URGENT REMINDERS */}
        <div className="space-y-4">
          {/* AGENT TARGET CARD */}
          <div className="bg-[#3B2647] text-white p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm">Agent Daily Target</h4>
                <div className="text-[10px] text-purple-200">Calls Completed</div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                On Track
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>28 / 40 Target</span>
                <span>70%</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: '70%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
              <div className="p-2 bg-white/10 rounded-xl">
                <span className="text-[10px] text-purple-200 block uppercase">Bookings Made</span>
                <strong className="text-base font-bold text-white">19</strong>
              </div>
              <div className="p-2 bg-white/10 rounded-xl">
                <span className="text-[10px] text-purple-200 block uppercase">Package Sold</span>
                <strong className="text-base font-bold text-emerald-300">₹42,500</strong>
              </div>
            </div>
          </div>

          {/* URGENT CALL REMINDERS */}
          <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-line pb-2">
              <h4 className="font-bold text-xs text-ink flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Urgent Call Reminders</span>
              </h4>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.2 rounded-full">
                {filteredReminders.length} Overdue
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredReminders.map((r) => (
                <div key={r.id} className="p-3 bg-rose-50/40 rounded-xl border border-rose-200/60 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-xs text-ink block font-bold">{r.name}</strong>
                      <p className="text-[10.5px] text-soft">{r.service}</p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 font-mono">{r.due}</span>
                  </div>

                  <button
                    onClick={() => handleStartCall({ name: r.name, phone: r.phone, branch: selectedBranch.name, branchId: r.branchId })}
                    className="w-full py-1.5 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CHANNEL PERFORMANCE ATTRIBUTION */}
      <div className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-3">
        <h4 className="font-bold text-sm text-ink">Channel Performance &amp; Lead Attribution</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200/60">
            <span className="text-[10.5px] font-bold text-purple-900 uppercase">Meta Lead Ads</span>
            <div className="text-2xl font-bold text-purple-950 mt-1">184 Leads</div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">74.2% Conversion Rate</span>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200/60">
            <span className="text-[10.5px] font-bold text-blue-900 uppercase">Google Search Ads</span>
            <div className="text-2xl font-bold text-blue-950 mt-1">112 Leads</div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">68.5% Conversion Rate</span>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60">
            <span className="text-[10.5px] font-bold text-emerald-900 uppercase">WhatsApp Business Bot</span>
            <div className="text-2xl font-bold text-emerald-950 mt-1">96 Leads</div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">82.1% High Intent</span>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
            <span className="text-[10.5px] font-bold text-amber-900 uppercase">Direct Website Inquiries</span>
            <div className="text-2xl font-bold text-amber-950 mt-1">36 Leads</div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">62.0% Conversion Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
