import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  Plus,
  Search,
  Sparkles,
  Tag,
  Target,
  UserCheck,
  X,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function LeadsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    startInboundCall
  } = useCallCenterBranch();

  const [activeTab, setActiveTab] = useState<'new' | 'assigned' | 'followup' | 'converted' | 'lost' | 'sources'>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    branch: selectedBranch.name,
    source: 'Meta Lead Ads',
    interestedService: 'Hydra Facial Glow & Spa',
    assignedAgent: 'Rohan Arora',
    priority: 'Hot Lead',
    notes: '',
    callbackDate: '2026-09-03'
  });

  const [leads, setLeads] = useState([
    {
      id: 'LD-101',
      name: 'Aakanksha Sharma',
      phone: '+91 98765 11223',
      email: 'aakanksha@gmail.com',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      source: 'Meta Lead Ads',
      interestedService: 'Bridal Makeup & Hair',
      status: 'new',
      assignedAgent: 'Rohan Arora',
      createdAt: '2026-09-02 10:15'
    },
    {
      id: 'LD-102',
      name: 'Rajesh Khanna',
      phone: '+91 98123 99887',
      email: 'rajesh.k@yahoo.com',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      source: 'Google Ads',
      interestedService: 'Hair Spa & Grooming',
      status: 'assigned',
      assignedAgent: 'Neha Sharma',
      createdAt: '2026-09-02 09:30'
    },
    {
      id: 'LD-103',
      name: 'Kavita Patel',
      phone: '+91 97111 88776',
      email: 'kavita.p@outlook.com',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      source: 'WhatsApp Direct',
      interestedService: 'Balayage Hair Color',
      status: 'followup',
      assignedAgent: 'Aditi Nair',
      createdAt: '2026-09-01 16:45'
    },
    {
      id: 'LD-104',
      name: 'Simran Gill',
      phone: '+91 99887 11223',
      email: 'simran.g@gmail.com',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      source: 'Website Inquiry',
      interestedService: 'Manicure & Pedicure Spa',
      status: 'converted',
      assignedAgent: 'Priya Varma',
      createdAt: '2026-09-01 14:10'
    },
    {
      id: 'LD-105',
      name: 'Deepak Saxena',
      phone: '+91 98990 44332',
      email: 'deepak.s@gmail.com',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      source: 'Google Ads',
      interestedService: 'Swedish Massage 60m',
      status: 'lost',
      assignedAgent: 'Unassigned',
      createdAt: '2026-08-31 11:20'
    }
  ]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;

    const created = {
      id: `LD-${Math.floor(110 + Math.random() * 890)}`,
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email || 'lead@guest.com',
      branch: newLead.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      source: newLead.source,
      interestedService: newLead.interestedService,
      status: 'new',
      assignedAgent: newLead.assignedAgent,
      createdAt: new Date().toLocaleString()
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
    setNewLead({
      name: '',
      phone: '',
      email: '',
      branch: selectedBranch.name,
      source: 'Meta Lead Ads',
      interestedService: 'Hydra Facial Glow & Spa',
      assignedAgent: 'Rohan Arora',
      priority: 'Hot Lead',
      notes: '',
      callbackDate: '2026-09-03'
    });
    toast(`Lead Added: ${created.name} assigned to ${created.branch}.`);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    toast(`Lead Status Updated: [${id}] marked as ${newStatus.toUpperCase()}.`);
  };

  const handleCallLead = (lead: any) => {
    startInboundCall({
      callerName: lead.name,
      callerPhone: lead.phone,
      vipTier: 'Prospect / Lead',
      walletBalance: '₹0.00',
      allergies: 'None recorded',
      preferredBranch: lead.branch,
      preferredStylist: 'Vikram Kulkarni'
    });
    toast(`Dialing Inbound Lead: Connecting to ${lead.name} (${lead.phone})...`);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesBranch = isAllBranches || l.branchId === selectedBranchId;
    const matchesTab = activeTab === 'sources' || l.status === activeTab;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.interestedService.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Inbound Leads &amp; Ad Pipeline Inbox
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain Lead Pipeline' : `${selectedBranch.shortName} Leads`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Multi-channel acquisition inbox: Meta Ads, Google Search, WhatsApp bots, and Web inquiries with automatic concierge assignment.'
              : `Inbound leads and marketing inquiries mapped to ${selectedBranch.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" /> Add Manual Lead
          </button>

          <button
            onClick={() => toast(`Export Leads: Downloaded lead database for ${selectedBranch.shortName} as CSV.`)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" /> Export Leads
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'new', label: 'New Leads', count: leads.filter(l => l.status === 'new' && (isAllBranches || l.branchId === selectedBranchId)).length },
          { id: 'assigned', label: 'Assigned / In Progress', count: leads.filter(l => l.status === 'assigned' && (isAllBranches || l.branchId === selectedBranchId)).length },
          { id: 'followup', label: 'Follow-up Needed', count: leads.filter(l => l.status === 'followup' && (isAllBranches || l.branchId === selectedBranchId)).length },
          { id: 'converted', label: 'Converted Bookings', count: leads.filter(l => l.status === 'converted' && (isAllBranches || l.branchId === selectedBranchId)).length },
          { id: 'lost', label: 'Lost / Closed', count: leads.filter(l => l.status === 'lost' && (isAllBranches || l.branchId === selectedBranchId)).length }
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
          placeholder="Filter leads by guest name, mobile (+91), or requested service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent border-0 outline-none text-ink"
        />
      </div>

      {/* LEADS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Lead ID &amp; Date</th>
                <th className="p-3">Guest Contact</th>
                <th className="p-3">Target Outlet</th>
                <th className="p-3">Source Channel</th>
                <th className="p-3">Inquired Service</th>
                <th className="p-3">Assigned Agent</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Desk Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-purple-700">
                    <div>{lead.id}</div>
                    <div className="text-[10px] text-muted font-mono">{lead.createdAt}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-ink">{lead.name}</div>
                    <div className="text-[10.5px] font-mono text-soft">{lead.phone}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {lead.branch}
                    </div>
                  </td>

                  <td className="p-3">
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {lead.source}
                    </span>
                  </td>

                  <td className="p-3 text-ink font-medium">{lead.interestedService}</td>
                  <td className="p-3 text-soft font-semibold">{lead.assignedAgent}</td>

                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${lead.status === 'converted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        lead.status === 'new' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          lead.status === 'followup' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCallLead(lead)}
                        className="px-2.5 py-1 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer border-0"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Call</span>
                      </button>

                      {lead.status !== 'converted' && (
                        <button
                          onClick={() => handleUpdateStatus(lead.id, 'converted')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10.5px] font-bold cursor-pointer border-0"
                        >
                          Convert
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

      {/* CREATE LEAD MODAL */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Add New Marketing Lead</h3>
                <p className="text-xs text-soft">Log inbound inquiry for concierge follow-up</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aakanksha Sharma"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Mobile Phone (+91) *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 11223"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Salon Outlet *</label>
                  <select
                    value={newLead.branch}
                    onChange={(e) => setNewLead({ ...newLead, branch: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    {branches.filter(b => b.id !== 'all').map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Source Channel *</label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="Meta Lead Ads">Meta Lead Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp Direct">WhatsApp Direct</option>
                    <option value="Website Inquiry">Website Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Priority</label>
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="Hot Lead">Hot Lead (Urgent)</option>
                    <option value="Warm Lead">Warm Lead</option>
                    <option value="Cold Lead">Cold Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">Interested Treatment / Service *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Package, Keratin Spa"
                  value={newLead.interestedService}
                  onChange={(e) => setNewLead({ ...newLead, interestedService: e.target.value })}
                  className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
