import { useToast } from '@salon-spa-saas/ui';
import {
  Award,
  Building2,
  Calculator,
  CheckCircle2,
  Coins,
  DollarSign,
  Download,
  Globe,
  Layers,
  MapPin,
  Percent,
  Plus,
  RefreshCw,
  Scissors,
  Search,
  Sliders,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function CommissionsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useFinanceBranch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);

  // COMMISSION CALCULATOR FORM STATE
  const [calcForm, setCalcForm] = useState({
    stylistName: 'Vikram Kulkarni',
    branch: 'Bandra West Flagship (Mumbai)',
    serviceSales: 450000,
    retailSales: 60000,
    backbarDeduction: 15000,
    tipsAmount: 8500,
  });

  const commissionTypesList = [
    'Service Commission',
    'Retail Sales',
    'Package Sales',
    'Target Bonus',
  ];

  const commissionRulesList = [
    {
      rule: 'Tiered Slabs',
      desc: '5% (0-50k) ➔ 10% (50k-1L) ➔ 15% (>1L)',
      icon: <Layers className="w-4 h-4 text-[#5A2EA6]" />,
    },
    {
      rule: 'Retail Upsell',
      desc: 'Flat 12% on product purchases',
      icon: <Percent className="w-4 h-4 text-emerald-600" />,
    },
    {
      rule: 'Backbar Offset',
      desc: 'Chemical cost subtracted before commission',
      icon: <DollarSign className="w-4 h-4 text-amber-600" />,
    },
    {
      rule: 'Tip Pass-Through',
      desc: '100% direct gratuity payout',
      icon: <Target className="w-4 h-4 text-rose-600" />,
    },
  ];

  const [commissions, setCommissions] = useState([
    {
      id: 'CMS-101',
      employee: 'Vikram Kulkarni',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      designation: 'Senior Colorist',
      revenue: '₹4,50,000.00',
      commissionPct: '10.0% (Tiered)',
      commissionAmount: '₹45,000.00',
      backbarDeduction: '₹15,000.00',
      retailCommission: '₹7,200.00',
      tipsPassed: '₹8,500.00',
      netPayout: '₹60,700.00',
      status: 'Pending',
      type: 'Service Commission',
      rule: 'Tiered Slabs',
    },
    {
      id: 'CMS-102',
      employee: 'Pooja Kashyap',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      designation: 'Master Aesthetician',
      revenue: '₹3,80,000.00',
      commissionPct: '8.5%',
      commissionAmount: '₹32,300.00',
      backbarDeduction: '₹8,000.00',
      retailCommission: '₹4,500.00',
      tipsPassed: '₹5,200.00',
      netPayout: '₹42,000.00',
      status: 'Disbursed',
      type: 'Retail Sales',
      rule: 'Retail Upsell',
    },
    {
      id: 'CMS-103',
      employee: 'Kavita Sundaram',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      designation: 'Hair Spa Specialist',
      revenue: '₹2,90,000.00',
      commissionPct: '8.0%',
      commissionAmount: '₹23,200.00',
      backbarDeduction: '₹5,000.00',
      retailCommission: '₹3,200.00',
      tipsPassed: '₹4,100.00',
      netPayout: '₹30,500.00',
      status: 'Disbursed',
      type: 'Package Sales',
      rule: 'Tiered Slabs',
    },
    {
      id: 'CMS-104',
      employee: 'Suresh Varma',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      designation: 'Top Stylist',
      revenue: '₹3,40,000.00',
      commissionPct: '9.0%',
      commissionAmount: '₹30,600.00',
      backbarDeduction: '₹7,500.00',
      retailCommission: '₹5,100.00',
      tipsPassed: '₹6,000.00',
      netPayout: '₹41,700.00',
      status: 'Pending',
      type: 'Target Bonus',
      rule: 'Target Based',
    },
  ]);

  const handleCalculateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    const netService = Math.max(0, calcForm.serviceSales - calcForm.backbarDeduction);
    const serviceComm = netService * 0.1;
    const retailComm = calcForm.retailSales * 0.12;
    const totalPayout = serviceComm + retailComm + calcForm.tipsAmount;

    const newCommission = {
      id: `CMS-${Math.floor(105 + Math.random() * 90)}`,
      employee: calcForm.stylistName,
      branch: calcForm.branch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      designation: 'Master Stylist',
      revenue: `₹${calcForm.serviceSales.toLocaleString('en-IN')}.00`,
      commissionPct: '10.0% (Tiered)',
      commissionAmount: `₹${serviceComm.toLocaleString('en-IN')}.00`,
      backbarDeduction: `₹${calcForm.backbarDeduction.toLocaleString('en-IN')}.00`,
      retailCommission: `₹${retailComm.toLocaleString('en-IN')}.00`,
      tipsPassed: `₹${calcForm.tipsAmount.toLocaleString('en-IN')}.00`,
      netPayout: `₹${totalPayout.toLocaleString('en-IN')}.00`,
      status: 'Pending',
      type: 'Service Commission',
      rule: 'Tiered Slabs',
    };

    setCommissions([newCommission, ...commissions]);
    setIsCalcModalOpen(false);
    toast(
      `Commission Calculated: ${newCommission.id} (${newCommission.netPayout}) computed for ${newCommission.employee}.`,
    );
  };

  const handleDisburseCommission = (id: string) => {
    setCommissions(commissions.map((c) => (c.id === id ? { ...c, status: 'Disbursed' } : c)));
    toast(`Commission Disbursed: Payout journal posted for ${id}. Merged into monthly payroll.`);
  };

  const filteredCommissions = commissions.filter((c) => {
    const matchesBranch = isAllBranches || c.branchId === selectedBranchId;
    const matchesType = selectedTypeFilter === 'All Types' || c.type === selectedTypeFilter;
    const matchesSearch =
      c.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Stylist Commission &amp; Incentive Engine
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Commission Pool' : `${selectedBranch.shortName} Commissions`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Automate tiered service commission slabs (5-15%), retail product incentives (12%),
            backbar chemical cost deductions, and direct tip disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCalcModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Calculator className="w-4 h-4" />
            Calculate Commission
          </button>

          <button
            onClick={() =>
              toast(
                `Export Commissions: Payout records for ${selectedBranch.shortName} exported to CSV.`,
              )
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Incentive Log
          </button>
        </div>
      </div>

      {/* 4 COMMISSION RULES CALLOUT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {commissionRulesList.map((r, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-white rounded-2xl border border-line shadow-xs space-y-1 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 text-purple-950 font-bold text-xs">
              <div className="p-1.5 bg-purple-50 rounded-lg">{r.icon}</div>
              <span>{r.rule}</span>
            </div>
            <p className="text-[11px] text-soft">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by stylist name, designation, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>

        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="p-1.5 text-xs bg-white border border-line rounded-xl font-semibold text-ink outline-none cursor-pointer"
        >
          <option value="All Types">All Commission Types</option>
          {commissionTypesList.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* COMMISSIONS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Stylist &amp; Designation</th>
                <th className="p-3">Salon Branch</th>
                <th className="p-3">Service Sales</th>
                <th className="p-3">Backbar Deduction</th>
                <th className="p-3">Service Comm %</th>
                <th className="p-3">Retail &amp; Tips</th>
                <th className="p-3">Net Payout (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredCommissions.map((c) => (
                <tr key={c.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-ink">{c.employee}</div>
                    <div className="text-[10px] text-soft">{c.designation}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {c.branch}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-ink">{c.revenue}</td>
                  <td className="p-3 text-rose-600 font-semibold">-{c.backbarDeduction}</td>
                  <td className="p-3 font-bold text-purple-900">
                    {c.commissionAmount}{' '}
                    <span className="text-[10px] text-soft block">{c.commissionPct}</span>
                  </td>
                  <td className="p-3 text-soft font-medium">
                    {c.retailCommission} + {c.tipsPassed} Tips
                  </td>
                  <td className="p-3 font-bold text-emerald-700 text-sm">{c.netPayout}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Disbursed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {c.status === 'Pending' ? (
                      <button
                        onClick={() => handleDisburseCommission(c.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Approve Payout
                      </button>
                    ) : (
                      <span className="text-[11px] text-soft font-semibold">Posted to Payroll</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALCULATOR MODAL */}
      {isCalcModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Stylist Commission Engine Calculator
                  </h3>
                  <p className="text-xs text-soft">
                    Dynamic computation of tiered service sales, retail upsells, and backbar
                    deduction
                  </p>
                </div>
                <button
                  onClick={() => setIsCalcModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCalculateAndSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Stylist Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={calcForm.stylistName}
                      onChange={(e) => setCalcForm({ ...calcForm, stylistName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Branch *
                    </label>
                    <select
                      value={calcForm.branch}
                      onChange={(e) => setCalcForm({ ...calcForm, branch: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      {branches
                        .filter((b) => b.id !== 'all')
                        .map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.city})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Gross Service Sales (₹)
                    </label>
                    <input
                      type="number"
                      value={calcForm.serviceSales}
                      onChange={(e) =>
                        setCalcForm({ ...calcForm, serviceSales: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Backbar Chemical Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={calcForm.backbarDeduction}
                      onChange={(e) =>
                        setCalcForm({ ...calcForm, backbarDeduction: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-white border border-rose-300 rounded-xl font-bold text-rose-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Retail Product Sales (₹)
                    </label>
                    <input
                      type="number"
                      value={calcForm.retailSales}
                      onChange={(e) =>
                        setCalcForm({ ...calcForm, retailSales: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-bold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Direct Client Tips (₹)
                    </label>
                    <input
                      type="number"
                      value={calcForm.tipsAmount}
                      onChange={(e) =>
                        setCalcForm({ ...calcForm, tipsAmount: Number(e.target.value) })
                      }
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl font-bold text-emerald-800"
                    />
                  </div>
                </div>

                {/* COMPUTED PREVIEW */}
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 space-y-1">
                  <div className="flex justify-between font-bold text-sm">
                    <span>Computed Net Incentive:</span>
                    <span className="text-emerald-700 font-extrabold text-base">
                      ₹
                      {(
                        Math.max(0, calcForm.serviceSales - calcForm.backbarDeduction) * 0.1 +
                        calcForm.retailSales * 0.12 +
                        calcForm.tipsAmount
                      ).toLocaleString('en-IN')}
                      .00
                    </span>
                  </div>
                  <p className="text-[10.5px] text-purple-800">
                    Formula: (Service Sales ₹{calcForm.serviceSales} - Backbar ₹
                    {calcForm.backbarDeduction}) × 10% + Retail ₹{calcForm.retailSales} × 12% + Tips
                    ₹{calcForm.tipsAmount}
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsCalcModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Save &amp; Post Incentive Journal
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
