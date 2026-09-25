import { InvoicePdfPreviewModal } from '@/shared/components/InvoicePdfPreviewModal';
import {
  type InvoiceFullData,
  type InvoiceItemDetail,
  downloadInvoiceDocument,
  printInvoice,
  sendInvoiceToWhatsApp,
} from '@/shared/utils/invoicePdfGenerator';
import { Button, useToast } from '@salon-spa-saas/ui';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Hash,
  Info,
  MessageSquare,
  Percent,
  Phone,
  Plus,
  Printer,
  Receipt,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  User,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useBranch } from '../context/BranchContext';

export interface InvoiceItem {
  id: string;
  name: string;
  category: string;
  sacCode: string;
  price: number;
  qty: number;
}

const presetCatalog = [
  { name: 'Haircut & Blowdry Combo', category: 'Services', sacCode: '999711', price: 1500 },
  { name: 'Radiance Glow Facial', category: 'Services', sacCode: '999712', price: 2200 },
  { name: 'Keratin Hair Treatment', category: 'Services', sacCode: '999711', price: 4500 },
  { name: 'Gel Manicure & Art', category: 'Services', sacCode: '999713', price: 1200 },
  { name: 'Aromatherapy Massage 60m', category: 'Services', sacCode: '999714', price: 3800 },
  {
    name: 'Organic Hydration Serum 100ml',
    category: 'Retail Haircare',
    sacCode: '330590',
    price: 1850,
  },
  {
    name: 'Premium Keratin Mask 500g',
    category: 'Retail Haircare',
    sacCode: '330590',
    price: 4200,
  },
  {
    name: 'Prepaid Package Session Redemption',
    category: 'Package Session',
    sacCode: '999711',
    price: 0,
  },
  {
    name: 'Gift Voucher Redemption (₹1,000)',
    category: 'Voucher Coupon',
    sacCode: '999711',
    price: -1000,
  },
];

const stylistList = [
  'Emma Burke (Master Stylist)',
  'Kassia Sophia (Color Specialist)',
  'Mia Chen (Nail & Spa Expert)',
  'Priyanjali Rao (Senior Aesthetician)',
];

export function CreateInvoicePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { assignedBranch } = useBranch();

  // Client & Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('Central Commercial Belt, Bhopal');
  const [clientGstin, setClientGstin] = useState('');

  useEffect(() => {
    if (assignedBranch) {
      setClientAddress(assignedBranch.address || `${assignedBranch.city} Commercial Area`);
    }
  }, [assignedBranch]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stylist, setStylist] = useState(stylistList[0]);
  const [paymentMethod, setPaymentMethod] = useState('Scanner UPI');
  const [status, setStatus] = useState('Received');
  const [discountAmount, setDiscountAmount] = useState('0');

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      name: 'Haircut & Blowdry Combo',
      category: 'Services',
      sacCode: '999711',
      price: 1500,
      qty: 1,
    },
  ]);

  const [selectedPreset, setSelectedPreset] = useState('');
  const [tempName, setTempName] = useState('');
  const [tempCategory, setTempCategory] = useState('Services');
  const [tempSacCode, setTempSacCode] = useState('999711');
  const [tempPrice, setTempPrice] = useState('');
  const [tempQty, setTempQty] = useState('1');

  // PDF Preview & Dispatch Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState<Partial<InvoiceFullData> | null>(
    null,
  );

  /* -------------------------------------------------------------------------- */
  /* Calculations                                                               */
  /* -------------------------------------------------------------------------- */

  const grandTotalRaw = items.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
  const discountVal = Number.parseFloat(discountAmount) || 0;
  const taxableAmount = Math.max(0, grandTotalRaw - discountVal);

  // 18% GST (9% CGST + 9% SGST)
  const subtotal = Math.round(taxableAmount / 1.18);
  const totalGst = taxableAmount - subtotal;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;
  const grandTotal = taxableAmount;

  /* -------------------------------------------------------------------------- */
  /* Handlers                                                                   */
  /* -------------------------------------------------------------------------- */

  const handleSelectPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const found = presetCatalog.find((p) => p.name === presetName);
    if (found) {
      setTempName(found.name);
      setTempCategory(found.category);
      setTempSacCode(found.sacCode);
      setTempPrice(found.price.toString());
    }
  };

  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tempName.trim() || tempPrice === '' || !tempQty) {
      toast('Please enter item name, unit price, and quantity.');
      return;
    }

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: tempName,
      category: tempCategory,
      sacCode: tempSacCode || '999711',
      price: Number.parseFloat(tempPrice) || 0,
      qty: Number.parseInt(tempQty, 10) || 1,
    };

    setItems([...items, newItem]);
    setTempName('');
    setSelectedPreset('');
    setTempPrice('');
    setTempQty('1');
    toast(`Added "${newItem.name}" to invoice.`);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const buildCurrentInvoiceData = (): Partial<InvoiceFullData> => {
    const invNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const lineItems: InvoiceItemDetail[] = items.map((it) => {
      const lineSub = Math.round((it.price * it.qty) / 1.18);
      return {
        name: it.name,
        description: `${it.category} provided by ${stylist}`,
        sacCode: it.sacCode || '999711',
        qty: it.qty,
        rate: it.price,
        cgstRate: 9,
        sgstRate: 9,
        amount: it.price * it.qty,
      };
    });

    return {
      invoiceNumber: invNumber,
      invoiceDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      dueDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      terms: 'Due on Receipt',
      placeOfSupply: 'Madhya Pradesh (23)',
      clientName: clientName.trim() || 'Valued Guest',
      clientPhone: clientPhone.trim() || '+91 98260 00000',
      clientAddress: clientAddress || 'Indrapuri Commercial Belt',
      clientCity: 'Bhopal',
      clientStatePin: '462022 Madhya Pradesh',
      clientCountry: 'India',
      clientGstin: clientGstin.trim() || undefined,
      items: lineItems,
      subTotal: subtotal,
      cgstAmount: cgst,
      sgstAmount: sgst,
      rounding: 0.0,
      totalAmount: grandTotal,
      paymentMade: grandTotal,
      balanceDue: 0.0,
      paymentMethod: paymentMethod,
      referenceNumber: `pay_${Math.random().toString(36).substring(2, 12)}`,
      stylistAssigned: stylist,
      notes:
        'Thank you for your visit. You just made our day.\nLooking forward to your next salon & spa appointment.',
    };
  };

  const handlePreviewPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || items.length === 0) {
      toast('Please provide client details and at least one line item to preview PDF.');
      return;
    }
    const invData = buildCurrentInvoiceData();
    setGeneratedInvoiceData(invData);
    setIsPreviewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || items.length === 0) {
      toast('Please provide client details and at least one line item.');
      return;
    }
    const invData = buildCurrentInvoiceData();
    setGeneratedInvoiceData(invData);
    setIsPreviewModalOpen(true);
    toast(`✅ Successfully generated GST invoice for ${clientName}!`);
  };

  return (
    <div className="animate-in fade-in duration-300 min-h-screen pb-24 max-w-6xl mx-auto space-y-6">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/payments')}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#5A2EA6]/20 bg-white shadow-xs transition-all duration-200 hover:bg-[#5A2EA6] hover:text-white group cursor-pointer text-[#5A2EA6]"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-soft">
              <span>Payments</span>
              <span>/</span>
              <span className="text-[#5A2EA6] font-bold">New Invoice</span>
            </div>
            <h1 className="font-serif text-[26px] font-bold text-ink tracking-tight">
              Create New Invoice
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#5A2EA6]/15 bg-white px-4 py-1.5 shadow-xs">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[12px] font-bold text-[#5A2EA6]">
            Counter Sales Register Active
          </span>
        </div>
      </div>

      {/* ── Royal Purple Hero Card ── */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#5A2EA6] via-[#482289] to-[#391873] p-7 text-white shadow-lg border border-white/10">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#A970FF]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md shadow-inner shrink-0">
              <Receipt className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/70 block">
                GST Tax Invoicing Engine
              </span>
              <h2 className="font-serif text-[22px] font-bold text-white mt-0.5">
                Counter Billing &amp; Payment Settlement
              </h2>
              <p className="text-[12px] text-white/80 max-w-xl mt-1 leading-relaxed">
                Issue tax-compliant B2C/B2B invoices with automatic 18% GST calculation (CGST/SGST
                split), multi-mode register payment options, and instant WhatsApp &amp; Print PDF
                dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">
                Compliant Ledger
              </span>
              <strong className="text-[13px] font-bold text-white block">
                SAC 999711 / 18% GST
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Body ── */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Section 1: Client & Stylist Details Card ── */}
        <div className="bg-white border border-[#5A2EA6]/10 rounded-[28px] p-6 md:p-7 shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#5A2EA6]/10">
            <div className="w-9 h-9 rounded-2xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-ink tracking-tight">
                Client &amp; Stylist Profile
              </h3>
              <p className="text-[11.5px] text-soft">
                Primary customer records, optional B2B GSTIN, and staff mapping
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div>
              <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                Client Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyanjali Sen"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#FCFAFF] border border-line rounded-2xl py-3 pl-11 pr-4 text-[13px] text-ink font-semibold outline-none focus:border-[#5A2EA6] transition-all"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 90000 12345"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#FCFAFF] border border-line rounded-2xl py-3 pl-11 pr-4 text-[13px] text-ink font-semibold outline-none focus:border-[#5A2EA6] transition-all"
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
              </div>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                Billing Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#FCFAFF] border border-line rounded-2xl py-3 pl-11 pr-4 text-[13px] text-ink font-semibold outline-none focus:border-[#5A2EA6] transition-all"
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                Stylist Assigned For Commission Mapping
              </label>
              <select
                value={stylist}
                onChange={(e) => setStylist(e.target.value)}
                className="w-full bg-[#FCFAFF] border border-line rounded-2xl py-3 px-4 text-[13px] text-ink font-semibold outline-none cursor-pointer focus:border-[#5A2EA6] transition-all"
              >
                {stylistList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                Customer GSTIN (Optional B2B Billing)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 23AAAAA0000A1Z5"
                  value={clientGstin}
                  onChange={(e) => setClientGstin(e.target.value)}
                  className="w-full bg-[#FCFAFF] border border-line rounded-2xl py-3 pl-11 pr-4 text-[13px] font-mono text-ink font-semibold outline-none focus:border-[#5A2EA6] transition-all uppercase"
                />
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Items & Services Builder ── */}
        <div className="bg-white border border-[#5A2EA6]/10 rounded-[28px] p-6 md:p-7 shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#5A2EA6]/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center font-bold">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-[18px] font-bold text-ink tracking-tight">
                  Invoice Items &amp; Services
                </h3>
                <p className="text-[11.5px] text-soft">
                  Select catalogue services or retail products with automatic SAC/HSN codes
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold bg-[#F8F5FF] text-[#5A2EA6] border border-[#5A2EA6]/20 px-3 py-1 rounded-full">
              {items.length} Line {items.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {/* Quick Preset Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-soft uppercase tracking-wider">
              Quick Preset from Branch Catalogue:
            </label>
            <div className="flex flex-wrap gap-2">
              {presetCatalog.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset.name)}
                  className={`text-[11px] px-3.5 py-1.5 rounded-xl font-bold transition-all duration-200 border cursor-pointer ${
                    selectedPreset === preset.name
                      ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                      : 'bg-[#FCFAFF] text-soft border-line hover:border-[#5A2EA6]/40 hover:text-ink'
                  }`}
                >
                  {preset.name} (₹{preset.price})
                </button>
              ))}
            </div>
          </div>

          {/* Add Item Input Grid */}
          <div className="bg-gradient-to-br from-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/15 rounded-[24px] p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3.5">
              <div className="md:col-span-2">
                <label className="text-[10.5px] font-bold text-soft block mb-1">
                  Item / Treatment Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Keratin Treatment"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-white border border-line rounded-xl py-2 px-3 text-[12.5px] text-ink font-semibold outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-soft block mb-1">Category</label>
                <select
                  value={tempCategory}
                  onChange={(e) => setTempCategory(e.target.value)}
                  className="w-full bg-white border border-line rounded-xl py-2 px-3 text-[12px] text-ink font-semibold outline-none cursor-pointer focus:border-[#5A2EA6]"
                >
                  <option value="Services">Services</option>
                  <option value="Retail Haircare">Retail Haircare</option>
                  <option value="Skin & Spa">Skin &amp; Spa</option>
                  <option value="Package Session">Package Session</option>
                  <option value="Voucher Coupon">Voucher Coupon</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-soft block mb-1">HSN / SAC</label>
                <input
                  type="text"
                  value={tempSacCode}
                  onChange={(e) => setTempSacCode(e.target.value)}
                  className="w-full bg-white border border-line rounded-xl py-2 px-3 text-[12px] font-mono text-ink font-semibold outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-soft block mb-1">Price (₹)</label>
                <input
                  type="number"
                  placeholder="1500"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  className="w-full bg-white border border-line rounded-xl py-2 px-3 text-[12.5px] text-ink font-bold outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-soft block mb-1">Qty</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={tempQty}
                    onChange={(e) => setTempQty(e.target.value)}
                    className="w-full bg-white border border-line rounded-xl py-2 px-3 text-[12.5px] text-ink font-bold text-center outline-none focus:border-[#5A2EA6]"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-10 h-10 rounded-xl bg-[#5A2EA6] text-white flex items-center justify-center shrink-0 hover:bg-[#482289] transition-all cursor-pointer shadow-xs border-0"
                    title="Add Item"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Line Items Table */}
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold">
                <tr>
                  <th className="p-3.5 pl-5">#</th>
                  <th className="p-3.5">Item &amp; Description</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">HSN/SAC</th>
                  <th className="p-3.5 text-right">Unit Rate (₹)</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Total (₹)</th>
                  <th className="p-3.5 pr-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-paper/40 transition-colors">
                    <td className="p-3.5 pl-5 font-bold text-soft">{idx + 1}</td>
                    <td className="p-3.5 font-bold text-ink">{item.name}</td>
                    <td className="p-3.5 text-soft">{item.category}</td>
                    <td className="p-3.5 font-mono text-[11px] text-soft">{item.sacCode}</td>
                    <td className="p-3.5 text-right font-semibold text-ink">₹{item.price}</td>
                    <td className="p-3.5 text-center font-bold text-ink">{item.qty}</td>
                    <td className="p-3.5 text-right font-bold text-[#5A2EA6]">
                      ₹{item.price * item.qty}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all cursor-pointer border-0 inline-flex"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 3: Payment Method & Tax Breakdown Card ── */}
        <div className="bg-white border border-[#5A2EA6]/10 rounded-[28px] p-6 md:p-7 shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#5A2EA6]/10">
            <div className="w-9 h-9 rounded-2xl bg-[#5A2EA6]/10 text-[#5A2EA6] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-ink tracking-tight">
                Payment Settlement &amp; Tax Calculation
              </h3>
              <p className="text-[11.5px] text-soft">
                Multi-mode counter settlement options with automatic GST breakdown
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Left Options */}
            <div className="space-y-4">
              <div>
                <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    'Scanner UPI',
                    'Credit/Debit Card',
                    'Cash Drawer',
                    'Split Payment (UPI + Cash)',
                  ].map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`p-3 rounded-2xl text-[12px] font-bold border transition-all duration-200 text-left flex items-center gap-2 cursor-pointer ${
                        paymentMethod === m
                          ? 'bg-[#F8F5FF] text-[#5A2EA6] border-[#5A2EA6] shadow-xs'
                          : 'bg-[#FCFAFF] text-soft border-line hover:border-[#5A2EA6]/40'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${paymentMethod === m ? 'text-[#5A2EA6]' : 'text-slate-300'}`}
                      />
                      <span>{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11.5px] font-bold text-ink uppercase tracking-wider block mb-2">
                  Discount / Voucher Override (₹)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    className="w-full bg-[#FCFAFF] border border-line rounded-2xl py-3 pl-11 pr-4 text-[13px] font-bold text-ink outline-none focus:border-[#5A2EA6]"
                  />
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
                </div>
              </div>
            </div>

            {/* Total Calculation Display Card */}
            <div className="bg-gradient-to-br from-[#FCFAFF] via-[#F8F5FF] to-[#F3ECFF] border border-[#5A2EA6]/20 rounded-[28px] p-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="flex justify-between text-[13px] font-semibold text-soft">
                  <span>Taxable Subtotal (Excl. Tax):</span>
                  <strong className="text-ink font-bold">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between text-[13px] font-semibold text-soft">
                  <span>CGST (9% Central Tax):</span>
                  <strong className="text-[#5A2EA6] font-bold">
                    ₹{cgst.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between text-[13px] font-semibold text-soft">
                  <span>SGST (9% State Tax):</span>
                  <strong className="text-[#5A2EA6] font-bold">
                    ₹{sgst.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="flex justify-between text-[13px] font-semibold text-soft">
                  <span>Discount Applied:</span>
                  <strong className="text-rose-500 font-bold">
                    -₹{discountVal.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#5A2EA6]/20 flex justify-between items-center">
                <div>
                  <span className="font-serif text-[15px] font-bold text-ink block">
                    Grand Total Payable
                  </span>
                  <span className="text-[10px] text-soft block">
                    Includes 18% GST (CGST + SGST)
                  </span>
                </div>
                <span className="text-[26px] font-serif font-bold text-[#5A2EA6]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Info Banner ── */}
        <div className="bg-white border border-[#5A2EA6]/15 rounded-[24px] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#5A2EA6]">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-[13px] font-bold text-ink block">
              Automatic Shared PDF &amp; WhatsApp Receipt Dispatch
            </strong>
            <p className="text-[12px] text-soft mt-0.5 leading-relaxed">
              Confirming this invoice generates the official <strong>TAX INVOICE PDF</strong> with
              itemized SAC/HSN codes, 18% GST breakdown, UPI QR verification code, and instant
              WhatsApp link ready to share with {clientName || 'the client'}.
            </p>
          </div>
        </div>

        {/* ── Sticky Bottom Action Bar ── */}
        <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-[#5A2EA6]/20 rounded-[24px] py-4 px-7 flex items-center justify-between shadow-xl flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-[#5A2EA6]" />
            <span className="text-[13px] font-bold text-ink">
              Ready to Settle Invoice · Total:{' '}
              <span className="text-[#5A2EA6] text-[15px]">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewPdf}
              className="px-4 py-2.5 rounded-2xl text-[12px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Preview PDF / WhatsApp</span>
            </Button>

            <button
              type="submit"
              className="px-8 py-3 rounded-2xl text-[13px] font-bold text-white bg-gradient-to-r from-[#5A2EA6] via-[#482289] to-[#391873] hover:from-[#482289] hover:to-[#2B105F] shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 flex items-center gap-2 border-0 hover:-translate-y-0.5"
            >
              Generate Invoice &amp; Settle
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </form>

      {/* ── Official Invoice PDF / WhatsApp Dispatch Modal ── */}
      {isPreviewModalOpen && generatedInvoiceData && (
        <InvoicePdfPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          invoiceData={generatedInvoiceData}
        />
      )}
    </div>
  );
}

export default CreateInvoicePage;
