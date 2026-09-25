import React, { useState } from 'react';
import { useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  CheckCircle2,
  DollarSign,
  Download,
  Gift,
  Globe,
  MapPin,
  PhoneCall,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function LostClientRecoveryPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    startInboundCall
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'inactive' | 'campaigns' | 'calls'>('inactive');
  const [inactivityFilter, setInactivityFilter] = useState<'30' | '60' | '90'>('60');
  const [searchQuery, setSearchQuery] = useState('');

  const [inactiveClients, setInactiveClients] = useState([
    {
      id: 'RC-01',
      name: 'Nisha Singhania',
      phone: '+91 98221 11223',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      lastVisit: '75 Days Ago',
      totalPastSpend: '₹34,000',
      favoriteService: 'Keratin Hair Treatment',
      status: 'Dormant',
      offerSent: 'WINBACK25 (25% off)'
    },
    {
      id: 'RC-02',
      name: 'Rohan Mehta',
      phone: '+91 98443 33445',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      lastVisit: '62 Days Ago',
      totalPastSpend: '₹18,500',
      favoriteService: 'Deep Tissue Massage',
      status: 'Dormant',
      offerSent: 'RECOVER500 (₹500 voucher)'
    },
    {
      id: 'RC-03',
      name: 'Shweta Bajaj',
      phone: '+91 98990 11223',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      lastVisit: '95 Days Ago',
      totalPastSpend: '₹52,000',
      favoriteService: 'Hydra Facial & Hair Color',
      status: 'High Value Lost',
      offerSent: 'VIPRECONNECT (30% off)'
    },
    {
      id: 'RC-04',
      name: 'Varun Grover',
      phone: '+91 99887 22334',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      lastVisit: '50 Days Ago',
      totalPastSpend: '₹14,200',
      favoriteService: 'Beard Sculpting & Scalp Spa',
      status: 'Dormant',
      offerSent: 'REVIVE20 (20% off)'
    }
  ]);

  const handleSendWinbackOffer = (name: string, phone: string, offer: string) => {
    toast(`Win-Back Promo Dispatched: Sent personalized ${offer} offer code to ${name} (${phone}) via WhatsApp.`);
  };

  const handleRebookClient = (item: any) => {
    startInboundCall({
      callerName: item.name,
      callerPhone: item.phone,
      vipTier: 'Lapsed VIP',
      walletBalance: '₹0.00',
      allergies: 'None recorded',
      preferredBranch: item.branch,
      preferredStylist: 'Vikram Kulkarni'
    });
    toast(`Recovery Call Initiated: Dialing ${item.name} (${item.phone})...`);
  };

  const filtered = inactiveClients.filter((c) => {
    const matchesBranch = isAllBranches || c.branchId === selectedBranchId;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.favoriteService.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Lost Client Recovery &amp; Win-Back Desk
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Win-Back Desk' : `${selectedBranch.shortName} Recovery`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Automated churn detection for clients inactive >45 days, personalized WhatsApp re-engagement vouchers, and recovery ROI tracking across all branches.'
              : `Lapsed client revival roster and rebooking campaigns specifically for ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={() => toast(`Export Recovery: Downloaded win-back report for ${selectedBranch.shortName} as CSV.`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Recovery Analytics
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-1">
          <div className="text-xs text-soft font-bold uppercase tracking-wider">Total Dormant Clients</div>
          <div className="text-2xl font-bold text-ink">{isAllBranches ? '142 Clients' : '38 Clients'}</div>
          <div className="text-[11px] text-amber-700 font-semibold">&gt;45 Days Inactive</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-1">
          <div className="text-xs text-soft font-bold uppercase tracking-wider">Win-Back Calls Made</div>
          <div className="text-2xl font-bold text-purple-700">{isAllBranches ? '86 Calls' : '22 Calls'}</div>
          <div className="text-[11px] text-purple-700 font-semibold">Active monthly tele-outreach</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-1">
          <div className="text-xs text-soft font-bold uppercase tracking-wider">Recovered Clients</div>
          <div className="text-2xl font-bold text-emerald-700">{isAllBranches ? '34 Clients' : '9 Clients'}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">39.5% Win-back conversion</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-line shadow-sm space-y-1">
          <div className="text-xs text-soft font-bold uppercase tracking-wider">Recovered Revenue</div>
          <div className="text-2xl font-bold text-[#5A2EA6]">{selectedBranch.winBackRevenue}</div>
          <div className="text-[11px] text-soft font-semibold">+₹42k vs last month</div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'inactive', label: 'Inactive Client Roster', count: filtered.length },
          { id: 'campaigns', label: 'Automated Promo Campaigns', count: 3 },
          { id: 'calls', label: 'Outbound Recovery Calls', count: 12 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-soft hover:text-ink border border-line'
              }`}
          >
            {tab.label} <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Filter inactive clients by name, phone (+91), or favorite service..."
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
                <th className="p-3">Primary Salon</th>
                <th className="p-3">Inactivity Duration</th>
                <th className="p-3">Lifetime Spend</th>
                <th className="p-3">Favorite Treatment</th>
                <th className="p-3">Automated Promo Offer</th>
                <th className="p-3 text-right">Desk Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{client.name}</div>
                    <div className="text-[10.5px] font-mono text-soft">{client.phone}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {client.branch}
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-rose-700">{client.lastVisit}</td>
                  <td className="p-3 font-bold text-ink">{client.totalPastSpend}</td>
                  <td className="p-3 text-ink font-medium">{client.favoriteService}</td>

                  <td className="p-3">
                    <span className="text-[10.5px] font-bold text-[#5A2EA6] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1 w-fit">
                      <Gift className="w-3 h-3 text-[#5A2EA6]" />
                      {client.offerSent}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleSendWinbackOffer(client.name, client.phone, client.offerSent)}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 cursor-pointer transition-all"
                      >
                        Send WhatsApp
                      </button>

                      <button
                        onClick={() => handleRebookClient(client)}
                        className="px-2.5 py-1 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer border-0"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
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
  );
}
