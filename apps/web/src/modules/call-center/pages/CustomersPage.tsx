import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  ChevronRight,
  Download,
  Globe,
  History,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Plus,
  Scissors,
  Search,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import { useCallCenterBranch } from '../context/CallCenterBranchContext';


export function CustomersPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    startInboundCall
  } = useCallCenterBranch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const [customers] = useState([
    {
      id: 'CUST-801',
      name: 'Sunita Kapoor',
      phone: '+91 98112 33445',
      email: 'sunita.k@gmail.com',
      homeBranch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      membershipTier: 'Black Diamond VIP',
      walletBalance: '₹8,450.00',
      lifetimeSpend: '₹48,500.00',
      totalVisits: 14,
      lastVisit: '2026-08-18',
      preferredStylist: 'Vikram Kulkarni (Master Colorist)',
      allergies: 'Severe Ammonia sensitivity; requires sulfate-free botanical toners only.',
      tags: ['VIP Guest', 'High Spender', 'Prefers Afternoon'],
      commHistory: [
        {
          date: '2026-08-05',
          type: 'Call',
          agent: 'Rohan A.',
          note: 'Inquired about Keratin offer. Sent WhatsApp brochure.',
        },
        { date: '2026-07-28', type: 'Visit', service: 'Hydra Facial & Spa', bill: '₹6,400' },
        { date: '2026-07-10', type: 'WhatsApp', note: 'Appointment confirmation reply: Yes' }
      ]
    },
    {
      id: 'CUST-802',
      name: 'Vikram Sethi',
      phone: '+91 98123 45678',
      email: 'vikram.s@outlook.com',
      homeBranch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      membershipTier: 'Platinum Elite VIP',
      walletBalance: '₹14,200.00',
      lifetimeSpend: '₹95,000.00',
      totalVisits: 28,
      lastVisit: '2026-08-20',
      preferredStylist: 'Neha Sharma',
      allergies: 'Peanut oil massage oil allergy',
      tags: ['Corporate VIP', 'Frequent Haircut'],
      commHistory: [
        { date: '2026-08-02', type: 'Visit', service: 'Beard Trim & Facial', bill: '₹3,200' }
      ]
    },
    {
      id: 'CUST-803',
      name: 'Meera Deshmukh',
      phone: '+91 98334 55667',
      email: 'meera.d@yahoo.com',
      homeBranch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      membershipTier: 'Gold Member',
      walletBalance: '₹4,500.00',
      lifetimeSpend: '₹22,100.00',
      totalVisits: 6,
      lastVisit: '2026-07-15',
      preferredStylist: 'Kavita Sundaram',
      allergies: 'None recorded',
      tags: ['Bridal Package', 'Weekend Preferred'],
      commHistory: [
        {
          date: '2026-08-06',
          type: 'Call',
          agent: 'Rohan A.',
          note: 'Requested quote for Bridal package for 4 family members.',
        },
      ],
    },
    {
      id: 'CUST-804',
      name: 'Rahul Verma',
      phone: '+91 99887 66554',
      email: 'rahul.v@gmail.com',
      homeBranch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      membershipTier: 'Silver Member',
      walletBalance: '₹1,500.00',
      lifetimeSpend: '₹16,800.00',
      totalVisits: 5,
      lastVisit: '2026-08-10',
      preferredStylist: 'Aditi Nair',
      allergies: 'None',
      tags: ['Spa Enthusiast'],
      commHistory: [
        { date: '2026-08-10', type: 'Visit', service: 'Deep Tissue Massage', bill: '₹4,500' }
      ]
    }
  ]);

  const handleStartCall = (c: any) => {
    startInboundCall({
      callerName: c.name,
      callerPhone: c.phone,
      vipTier: c.membershipTier,
      walletBalance: c.walletBalance,
      allergies: c.allergies,
      preferredBranch: c.homeBranch,
      preferredStylist: c.preferredStylist
    });
    toast(`CTI Call Dialing: Connecting to ${c.name} (${c.phone})... Screen-Pop active.`);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesBranch = isAllBranches || c.branchId === selectedBranchId;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Customer 360° CRM &amp; Guest Dossier
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? <Globe className="w-3 h-3 text-purple-700" /> : <Building2 className="w-3 h-3 text-purple-700" />}
              {isAllBranches ? 'Chain CRM Directory' : `${selectedBranch.shortName} Directory`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            {isAllBranches
              ? 'Consolidated guest directory: VIP tiers, wallet ledgers, stylist affinities, chemical allergy contraindications, and communication audit history.'
              : `Guest directory and client profiles strictly mapped to ${selectedBranch.name}.`}
          </p>
        </div>

        <button
          onClick={() => toast(`Export CRM: Downloaded customer database for ${selectedBranch.shortName} as CSV.`)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export CRM Database
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-muted shrink-0" />
        <input
          type="text"
          placeholder="Search guest by name, mobile phone (+91), email, or Customer ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent border-0 outline-none text-ink"
        />
      </div>

      {/* CUSTOMERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-white p-5 rounded-2xl border border-line shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-sm font-bold text-ink">{cust.name}</strong>
                    <span className="text-[9.5px] font-bold bg-purple-100 text-purple-900 px-2 py-0.2 rounded-full">
                      {cust.membershipTier}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-soft mt-0.5">{cust.phone}</div>
                </div>

                <button
                  onClick={() => handleStartCall(cust)}
                  className="p-2 bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] rounded-xl border border-purple-200 cursor-pointer transition-colors"
                  title="Direct CTI Call"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-soft flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                <span>{cust.homeBranch}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 bg-pine/5 rounded-xl border border-line text-center">
                <div>
                  <span className="text-[9.5px] font-bold text-soft uppercase block">Wallet Balance</span>
                  <strong className="text-xs font-bold text-emerald-700">{cust.walletBalance}</strong>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-soft uppercase block">Lifetime Spend</span>
                  <strong className="text-xs font-bold text-purple-950">{cust.lifetimeSpend}</strong>
                </div>
              </div>

              {cust.allergies !== 'None' && cust.allergies !== 'None recorded' && (
                <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 text-[10.5px] text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="truncate font-semibold">{cust.allergies}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-line flex justify-between items-center">
              <span className="text-[10px] text-soft">Last Visit: {cust.lastVisit}</span>
              <button
                onClick={() => setSelectedCustomer(cust)}
                className="px-3 py-1 bg-white border border-purple-600 text-purple-600 hover:bg-purple-50 rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                View 360° Dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 360° DOSSIER MODAL */}
      {selectedCustomer && createPortal(
        <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div>
                <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">Guest 360° Profile Dossier</h3>
                <p className="text-xs text-soft font-mono">{selectedCustomer.id} • {selectedCustomer.name}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-purple-50/50 rounded-2xl border border-purple-200/60">
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase">VIP Tier</span>
                  <div className="font-bold text-purple-950 mt-0.5">{selectedCustomer.membershipTier}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase">Wallet Balance</span>
                  <div className="font-bold text-emerald-800 mt-0.5">{selectedCustomer.walletBalance}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase">Lifetime Spend</span>
                  <div className="font-bold text-indigo-950 mt-0.5">{selectedCustomer.lifetimeSpend}</div>
                </div>
              </div>

              <div className="p-3 bg-pine/5 rounded-xl border border-line space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-soft">Preferred Master Specialist</span>
                <div className="font-bold text-ink text-xs flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5 text-purple-700" />
                  {selectedCustomer.preferredStylist}
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900">Chemical Allergy &amp; Scalp Warnings</span>
                <p className="text-[11px] text-rose-800 font-semibold">{selectedCustomer.allergies}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-soft">Communication &amp; Visit History</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedCustomer.commHistory.map((h: any, idx: number) => (
                    <div key={idx} className="p-2 bg-pine/5 rounded-lg border border-line text-[11px] flex justify-between items-center">
                      <div>
                        <strong className="text-ink font-semibold">[{h.type}]</strong> {h.note || h.service}
                      </div>
                      <span className="text-[10px] text-muted font-mono">{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
              >
                Close Dossier
              </button>
              <button
                type="button"
                onClick={() => {
                  handleStartCall(selectedCustomer);
                  setSelectedCustomer(null);
                }}
                className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Start CTI Call
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
