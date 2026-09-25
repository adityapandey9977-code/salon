import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowUpRight,
  Banknote,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Filter,
  Gift,
  Layers,
  QrCode,
  Search,
  Smartphone,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import React, { useState } from 'react';

export function RevenueCollectionsTab() {
  const { toast } = useToast();
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [revenueType, setRevenueType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // 7 Revenue & Collection KPI Cards
  const kpis = [
    {
      title: 'Gross Revenue',
      value: '₹48,50,000',
      change: '+14.2%',
      isPositive: true,
      desc: 'Billed invoices total',
    },
    {
      title: 'Net Revenue',
      value: '₹43,90,000',
      change: '+15.6%',
      isPositive: true,
      desc: 'Gross - Discounts - Refunds',
    },
    {
      title: 'Total Collections',
      value: '₹46,80,000',
      change: '+13.5%',
      isPositive: true,
      desc: 'Cash + Digital received',
    },
    {
      title: 'Outstanding Amount',
      value: '₹1,70,000',
      change: '-8.5%',
      isPositive: true,
      desc: 'Corporate / In-transit',
    },
    {
      title: 'Total Refunds',
      value: '₹1,20,000',
      change: '-4.2%',
      isPositive: true,
      desc: 'Reversals & chargebacks',
    },
    {
      title: 'Total Discounts',
      value: '₹3,40,000',
      change: '+5.0%',
      isPositive: false,
      desc: 'Coupons & member perks',
    },
    {
      title: 'Taxes Accrued',
      value: '₹7,40,000',
      change: '+14.1%',
      isPositive: true,
      desc: '18% GST liability',
    },
  ];

  // Payment Method Breakdown
  const paymentMethods = [
    {
      name: 'UPI / QR Code',
      icon: QrCode,
      transactions: 1420,
      grossAmount: '₹22,46,400',
      rawGross: 2246400,
      refunds: '₹42,000',
      netCollection: '₹22,04,400',
      percentage: 48.0,
      color: 'bg-emerald-600',
      textColor: 'text-emerald-700',
      badge: 'Primary Indian Rail',
    },
    {
      name: 'Credit / Debit Cards',
      icon: CreditCard,
      transactions: 680,
      grossAmount: '₹12,63,600',
      rawGross: 1263600,
      refunds: '₹48,000',
      netCollection: '₹12,15,600',
      percentage: 27.0,
      color: 'bg-[#5A2EA6]',
      textColor: 'text-[#5A2EA6]',
      badge: 'POS Terminal',
    },
    {
      name: 'Cash Register',
      icon: Banknote,
      transactions: 410,
      grossAmount: '₹6,08,400',
      rawGross: 608400,
      refunds: '₹15,000',
      netCollection: '₹5,93,400',
      percentage: 13.0,
      color: 'bg-amber-600',
      textColor: 'text-amber-700',
      badge: 'Cashier Drawer',
    },
    {
      name: 'Payment Links (WhatsApp/SMS)',
      icon: Smartphone,
      transactions: 155,
      grossAmount: '₹2,80,800',
      rawGross: 280800,
      refunds: '₹8,000',
      netCollection: '₹2,72,800',
      percentage: 6.0,
      color: 'bg-blue-600',
      textColor: 'text-blue-700',
      badge: 'Remote Booking',
    },
    {
      name: 'Digital Wallet Credits',
      icon: Wallet,
      transactions: 95,
      grossAmount: '₹1,87,200',
      rawGross: 187200,
      refunds: '₹5,000',
      netCollection: '₹1,82,200',
      percentage: 4.0,
      color: 'bg-rose-600',
      textColor: 'text-rose-700',
      badge: 'Prepaid Wallet',
    },
    {
      name: 'Gift Cards & Vouchers',
      icon: Gift,
      transactions: 52,
      grossAmount: '₹93,600',
      rawGross: 93600,
      refunds: '₹2,000',
      netCollection: '₹91,600',
      percentage: 2.0,
      color: 'bg-teal-600',
      textColor: 'text-teal-700',
      badge: 'Redeemed Cards',
    },
  ];

  // Detailed Ledger Records
  const collectionLedger = [
    {
      id: 'REC-10491',
      date: '18 Aug 2026, 17:45',
      branch: 'Indore Central',
      branchId: 'BR-01',
      source: 'Hair Color & Keratin Spa',
      category: 'Services',
      gross: '₹8,500',
      discount: '₹850',
      tax: '₹1,377',
      refund: '₹0',
      net: '₹9,027',
      collected: '₹9,027',
      outstanding: '₹0',
      method: 'UPI / QR Code',
      status: 'Collected',
    },
    {
      id: 'REC-10490',
      date: '18 Aug 2026, 16:30',
      branch: 'Vijay Nagar Boutique',
      branchId: 'BR-02',
      source: 'Kérastase Chronologiste Mask + Elixir',
      category: 'Retail',
      gross: '₹7,200',
      discount: '₹360',
      tax: '₹1,231',
      refund: '₹0',
      net: '₹8,071',
      collected: '₹8,071',
      outstanding: '₹0',
      method: 'Credit / Debit Cards',
      status: 'Collected',
    },
    {
      id: 'REC-10489',
      date: '18 Aug 2026, 15:10',
      branch: 'Bhopal Arera Colony',
      branchId: 'BR-03',
      source: 'Bridal Radiance 6-Session Package',
      category: 'Packages',
      gross: '₹24,000',
      discount: '₹2,400',
      tax: '₹3,888',
      refund: '₹0',
      net: '₹25,488',
      collected: '₹15,000',
      outstanding: '₹10,488',
      method: 'Split (Card + Link)',
      status: 'Partially Collected',
    },
    {
      id: 'REC-10488',
      date: '18 Aug 2026, 14:05',
      branch: 'Ujjain Mahakal Road',
      branchId: 'BR-04',
      source: 'Corporate Executive Wellness Tier',
      category: 'Memberships',
      gross: '₹18,000',
      discount: '₹1,000',
      tax: '₹3,060',
      refund: '₹0',
      net: '₹20,060',
      collected: '₹0',
      outstanding: '₹20,060',
      method: 'Corporate Invoice (30 Days)',
      status: 'Pending',
    },
    {
      id: 'REC-10487',
      date: '18 Aug 2026, 12:40',
      branch: 'Gwalior City Centre',
      branchId: 'BR-05',
      source: 'Swedish Deep Tissue Massage',
      category: 'Services',
      gross: '₹3,500',
      discount: '₹350',
      tax: '₹567',
      refund: '₹3,717',
      net: '₹0',
      collected: '₹0',
      outstanding: '₹0',
      method: 'UPI Reversal',
      status: 'Refunded',
    },
    {
      id: 'REC-10486',
      date: '17 Aug 2026, 19:20',
      branch: 'Indore Central',
      branchId: 'BR-01',
      source: 'HydraFacial Deluxe + LED',
      category: 'Services',
      gross: '₹6,000',
      discount: '₹600',
      tax: '₹972',
      refund: '₹0',
      net: '₹6,372',
      collected: '₹6,372',
      outstanding: '₹0',
      method: 'Cash Register',
      status: 'Collected',
    },
    {
      id: 'REC-10485',
      date: '17 Aug 2026, 18:00',
      branch: 'Vijay Nagar Boutique',
      branchId: 'BR-02',
      source: 'Gift Voucher Card ₹5000',
      category: 'Gift Cards',
      gross: '₹5,000',
      discount: '₹0',
      tax: '₹0',
      refund: '₹0',
      net: '₹5,000',
      collected: '₹5,000',
      outstanding: '₹0',
      method: 'Payment Links',
      status: 'Collected',
    },
    {
      id: 'REC-10484',
      date: '17 Aug 2026, 16:15',
      branch: 'Bhopal Arera Colony',
      branchId: 'BR-03',
      source: 'Advance Slot Hold Deposit',
      category: 'Services',
      gross: '₹1,500',
      discount: '₹0',
      tax: '₹0',
      refund: '₹0',
      net: '₹1,500',
      collected: '₹0',
      outstanding: '₹0',
      method: 'Card Gateway',
      status: 'Cancelled',
    },
  ];

  // Filtering
  const filteredLedger = collectionLedger.filter((item) => {
    const matchesBranch = selectedBranch === 'all' || item.branchId === selectedBranch;
    const matchesType =
      revenueType === 'all' || item.category.toLowerCase() === revenueType.toLowerCase();
    const matchesStatus =
      statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Collected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Partially Collected':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Refunded':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Cancelled':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search receipt, service, branch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 pl-8 text-xs text-ink outline-none focus:border-[#5A2EA6]"
            />
            <Search className="w-3.5 h-3.5 text-soft absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Branches</option>
            <option value="BR-01">Indore Central</option>
            <option value="BR-02">Vijay Nagar Boutique</option>
            <option value="BR-03">Bhopal Arera Colony</option>
            <option value="BR-04">Ujjain Mahakal Road</option>
            <option value="BR-05">Gwalior City Centre</option>
          </select>

          {/* Revenue Type */}
          <select
            value={revenueType}
            onChange={(e) => setRevenueType(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Revenue Types</option>
            <option value="services">Services</option>
            <option value="retail">Retail Products</option>
            <option value="packages">Packages</option>
            <option value="memberships">Memberships</option>
            <option value="gift cards">Gift Cards</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="collected">Collected</option>
            <option value="partially collected">Partially Collected</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toast('Exporting Revenue & Collections Ledger (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Ledger</span>
          </Button>
        </div>
      </div>

      {/* 2. 7 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-3.5 border border-[#5A2EA6]/10 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <span className="text-[9.5px] font-bold text-soft uppercase tracking-wider block">
                {kpi.title}
              </span>
              <strong className="text-base font-serif font-bold text-ink mt-1 block">
                {kpi.value}
              </strong>
            </div>

            <div className="mt-2 pt-1.5 border-t border-line/30 flex items-center justify-between text-[9px]">
              <span
                className={cn('font-bold', kpi.isPositive ? 'text-emerald-600' : 'text-rose-600')}
              >
                {kpi.change}
              </span>
              <span className="text-muted truncate max-w-[80px]">{kpi.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Payment Method Breakdown (Section 6) */}
      <div className="bg-white rounded-2xl p-5 border border-[#5A2EA6]/15 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-ink text-base">
                Collections by Payment Method
              </h3>
              <p className="text-[11px] text-muted">
                Channel volume, realized gross revenue, and net collections
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-soft font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Gateway Sync</span>
          </div>
        </div>

        {/* Visual Channel Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {paymentMethods.map((pm, idx) => {
            const Icon = pm.icon;
            return (
              <div
                key={idx}
                onClick={() => setSelectedMethod(selectedMethod === pm.name ? null : pm.name)}
                className={cn(
                  'p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between',
                  selectedMethod === pm.name
                    ? 'border-[#5A2EA6] bg-[#FAF8FF] shadow-sm'
                    : 'border-slate-100 hover:border-[#5A2EA6]/30 bg-white hover:bg-slate-50/50',
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-xl grid place-items-center bg-purple-50 text-[#5A2EA6]',
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-ink block">{pm.name}</strong>
                      <span className="text-[10px] text-muted">
                        {pm.transactions} transactions ({pm.percentage}%)
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#5A2EA6] whitespace-nowrap inline-flex items-center">
                    {pm.badge}
                  </span>
                </div>

                <div className="my-2.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[10px] text-soft">Net Collection:</span>
                    <strong className="text-sm font-serif font-bold text-ink">
                      {pm.netCollection}
                    </strong>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pm.percentage * 2}%` }}
                      className={cn('h-full rounded-full', pm.color)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100 text-soft">
                  <span>
                    Gross: <strong>{pm.grossAmount}</strong>
                  </span>
                  <span className="text-rose-600 font-semibold">Refunds: -{pm.refunds}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Dedicated Revenue & Collections Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">Collections Ledger</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                {filteredLedger.length} Records Found
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Line-item breakdown of service gross, deductions, tax accrual, collected receipts, and
              balance outstanding
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-soft">Showing page 1 of 1</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Receipt ID & Date</th>
                <th className="p-3.5">Branch</th>
                <th className="p-3.5">Revenue Source</th>
                <th className="p-3.5 text-right">Gross</th>
                <th className="p-3.5 text-right">Discount</th>
                <th className="p-3.5 text-right">Tax (18%)</th>
                <th className="p-3.5 text-right">Refund</th>
                <th className="p-3.5 text-right">Net Amount</th>
                <th className="p-3.5 text-right">Collected</th>
                <th className="p-3.5 text-right">Outstanding</th>
                <th className="p-3.5 pr-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredLedger.map((row) => (
                <tr key={row.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  {/* ID & Date */}
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{row.id}</strong>
                    <span className="text-[10px] text-muted">{row.date}</span>
                  </td>

                  {/* Branch */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block text-xs">{row.branch}</span>
                    <span className="text-[10px] text-soft">{row.branchId}</span>
                  </td>

                  {/* Source */}
                  <td className="p-3.5">
                    <span
                      className="font-semibold text-slate-900 block truncate max-w-[200px]"
                      title={row.source}
                    >
                      {row.source}
                    </span>
                    <span className="text-[10px] text-[#5A2EA6] font-bold">
                      {row.category} · {row.method}
                    </span>
                  </td>

                  {/* Financials */}
                  <td className="p-3.5 text-right font-bold text-ink whitespace-nowrap">
                    {row.gross}
                  </td>
                  <td className="p-3.5 text-right text-rose-600 whitespace-nowrap">
                    -{row.discount}
                  </td>
                  <td className="p-3.5 text-right text-indigo-700 whitespace-nowrap">{row.tax}</td>
                  <td className="p-3.5 text-right text-red-700 whitespace-nowrap">
                    {row.refund !== '₹0' ? `-${row.refund}` : '—'}
                  </td>

                  {/* Net */}
                  <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                    {row.net}
                  </td>

                  {/* Collected & Outstanding */}
                  <td className="p-3.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                    {row.collected}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    {row.outstanding !== '₹0' ? (
                      <span className="font-bold text-amber-700">{row.outstanding}</span>
                    ) : (
                      <span className="text-slate-400">₹0</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="p-3.5 pr-5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(row.status),
                      )}
                    >
                      {row.status}
                    </span>
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
