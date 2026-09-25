import { InvoicePdfPreviewModal } from '@/shared/components/InvoicePdfPreviewModal';
import {
  type InvoiceFullData,
  type InvoiceItemDetail,
  downloadInvoiceDocument,
  printInvoice,
  sendInvoiceToWhatsApp,
} from '@/shared/utils/invoicePdfGenerator';
import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Phone,
  Plus,
  Printer,
  Receipt,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Tag,
  User,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { DialogModal } from '../../../shared/components/DialogModal';

/* -------------------------------------------------------------------------- */
/* Data Contracts                                                             */
/* -------------------------------------------------------------------------- */

export interface PaymentItem {
  name: string;
  sacCode: string;
  qty: number;
  price: number;
  gstRate: number;
}

export interface Payment {
  ref: string;
  invNo: string;
  client: string;
  phone: string;
  service: string;
  items: PaymentItem[];
  method: string;
  amount: string;
  subtotal: string;
  gstTax: string;
  discount: string;
  date: string;
  status: 'Received' | 'Pending' | 'Refunded' | 'Partially Paid';
  settledLocation: string;
  stylistAssigned?: string;
  notes?: string;
}

/* -------------------------------------------------------------------------- */
/* Initial Mock Data                                                          */
/* -------------------------------------------------------------------------- */

const initialPayments: Payment[] = [
  {
    ref: 'TXN-9023',
    invNo: 'INV-103910',
    client: 'Twinkle Beauty parlour',
    phone: '+91 91114 54949',
    service: 'Signature Precision Cut & Blowout',
    items: [
      {
        name: 'Signature Precision Cut & Blowout',
        sacCode: '999711',
        qty: 1,
        price: 1500,
        gstRate: 18,
      },
    ],
    method: 'Scanner UPI',
    amount: '₹1,770',
    subtotal: '₹1,500',
    gstTax: '₹270 (9% CGST + 9% SGST)',
    discount: '₹0',
    date: '17 Aug 2026, 09:15 AM',
    status: 'Received',
    settledLocation: 'Counter Desk #01',
    stylistAssigned: 'Emma Burke (Master Stylist)',
    notes: 'Paid via ICICI UPI QR at main front desk.',
  },
  {
    ref: 'TXN-9022',
    invNo: 'INV-103909',
    client: 'Mia Chen',
    phone: '+91 98765 22222',
    service: 'Gel Manicure & 3D Nail Art',
    items: [{ name: 'Gel Manicure & 3D Art', sacCode: '999713', qty: 1, price: 1017, gstRate: 18 }],
    method: 'Credit Card',
    amount: '₹1,200',
    subtotal: '₹1,017',
    gstTax: '₹183 (9% CGST + 9% SGST)',
    discount: '₹0',
    date: '17 Aug 2026, 10:45 AM',
    status: 'Received',
    settledLocation: 'Counter Desk #01',
    stylistAssigned: 'Mia Chen (Nail Expert)',
    notes: 'HDFC POS swipe approval #882103.',
  },
  {
    ref: 'TXN-9020',
    invNo: 'INV-103908',
    client: 'Vikram Malhotra',
    phone: '+91 98765 33333',
    service: 'Aromatherapy Body Massage 60m',
    items: [
      { name: 'Aromatherapy Massage 60m', sacCode: '999714', qty: 1, price: 3220, gstRate: 18 },
    ],
    method: 'Cash Drawer',
    amount: '₹3,800',
    subtotal: '₹3,220',
    gstTax: '₹580 (9% CGST + 9% SGST)',
    discount: '₹0',
    date: '17 Aug 2026, 01:30 PM',
    status: 'Received',
    settledLocation: 'Counter Desk #01',
    stylistAssigned: 'Priyanjali Rao (Senior Aesthetician)',
    notes: 'Cash collected in cash drawer #1.',
  },
  {
    ref: 'TXN-9018',
    invNo: 'INV-103907',
    client: 'Ananya Sen',
    phone: '+91 98765 44444',
    service: 'Keratin Treatment & Olaplex Serum',
    items: [
      { name: 'Keratin Hair Treatment', sacCode: '999711', qty: 1, price: 4500, gstRate: 18 },
      { name: 'Olaplex Hair Serum 100ml', sacCode: '330590', qty: 1, price: 1850, gstRate: 18 },
    ],
    method: 'Split Payment (UPI + Cash)',
    amount: '₹7,493',
    subtotal: '₹6,350',
    gstTax: '₹1,143 (9% CGST + 9% SGST)',
    discount: '₹0',
    date: '17 Aug 2026, 03:15 PM',
    status: 'Received',
    settledLocation: 'Counter Desk #01',
    stylistAssigned: 'Emma Burke (Master Stylist)',
    notes: 'Split payment: ₹5,000 GPay UPI + ₹2,493 Cash.',
  },
];

export function PaymentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Core Dynamic Payments State
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');

  // Shared PDF / WhatsApp Modal State
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<Partial<InvoiceFullData> | null>(
    null,
  );
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* Helper to Map Payment to Official Invoice PDF Data                         */
  /* -------------------------------------------------------------------------- */

  const mapPaymentToInvoice = (pay: Payment): Partial<InvoiceFullData> => {
    const amountNumber = Number.parseFloat(pay.amount.replace(/[^0-9.]/g, '')) || 0;
    const subtotalNumber =
      Number.parseFloat(pay.subtotal.replace(/[^0-9.]/g, '')) || Math.round(amountNumber / 1.18);
    const taxTotal = amountNumber - subtotalNumber;
    const cgstAmt = Math.round(taxTotal / 2);
    const sgstAmt = taxTotal - cgstAmt;

    const lineItems: InvoiceItemDetail[] =
      pay.items && pay.items.length > 0
        ? pay.items.map((it) => ({
            name: it.name,
            sacCode: it.sacCode || '999711',
            qty: it.qty || 1,
            rate: it.price || subtotalNumber,
            cgstRate: 9,
            sgstRate: 9,
            amount: (it.price || subtotalNumber) * (it.qty || 1),
          }))
        : [
            {
              name: pay.service,
              description: `Salon & Spa treatment delivered at ${pay.settledLocation}`,
              sacCode: '999711',
              qty: 1,
              rate: subtotalNumber,
              cgstRate: 9,
              sgstRate: 9,
              amount: subtotalNumber,
            },
          ];

    return {
      invoiceNumber: pay.invNo || `INV-${pay.ref.replace(/[^0-9]/g, '')}`,
      invoiceDate: pay.date.split(',')[0] || '17 Aug 2026',
      dueDate: pay.date.split(',')[0] || '17 Aug 2026',
      terms: 'Due on Receipt',
      placeOfSupply: 'Madhya Pradesh (23)',
      clientName: pay.client,
      clientPhone: pay.phone,
      clientAddress: 'mahalaxmi nagar',
      clientCity: 'Indore',
      clientStatePin: '452010 Madhya Pradesh',
      clientCountry: 'India',
      items: lineItems,
      subTotal: subtotalNumber,
      cgstAmount: cgstAmt,
      sgstAmount: sgstAmt,
      rounding: 0.0,
      totalAmount: amountNumber,
      paymentMade: amountNumber,
      balanceDue: 0.0,
      paymentMethod: pay.method,
      referenceNumber: pay.ref,
      stylistAssigned: pay.stylistAssigned || 'Emma Burke (Master Stylist)',
      notes:
        pay.notes ||
        'Thank you for your visit. You just made our day.\nLooking forward to your next salon & spa appointment.',
    };
  };

  /* -------------------------------------------------------------------------- */
  /* Filtering Logic                                                            */
  /* -------------------------------------------------------------------------- */

  const filteredPayments = payments.filter((pay) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      pay.ref.toLowerCase().includes(query) ||
      pay.invNo.toLowerCase().includes(query) ||
      pay.client.toLowerCase().includes(query) ||
      pay.phone.toLowerCase().includes(query) ||
      pay.service.toLowerCase().includes(query);

    const matchesMethod =
      methodFilter === 'All' || pay.method.toLowerCase().includes(methodFilter.toLowerCase());

    return matchesSearch && matchesMethod;
  });

  /* -------------------------------------------------------------------------- */
  /* Handlers                                                                   */
  /* -------------------------------------------------------------------------- */

  const handleOpenPdfModal = (pay: Payment) => {
    const invData = mapPaymentToInvoice(pay);
    setSelectedInvoiceData(invData);
    setIsPdfModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = [
      'TXN Ref',
      'Invoice No',
      'Client Name',
      'Phone',
      'Service / Items',
      'Payment Method',
      'Subtotal',
      'GST Tax (18%)',
      'Grand Total',
      'Timestamp',
      'Status',
      'Settled Location',
    ];
    const rows = filteredPayments.map((p) => [
      p.ref,
      p.invNo,
      `"${p.client}"`,
      p.phone,
      `"${p.service}"`,
      `"${p.method}"`,
      p.subtotal,
      `"${p.gstTax}"`,
      p.amount,
      p.date,
      p.status,
      `"${p.settledLocation}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Branch_Payments_Log_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(`Exported ${filteredPayments.length} payment transactions to CSV!`);
  };

  const handlePrintReceipt = (pay: Payment) => {
    const invData = mapPaymentToInvoice(pay);
    printInvoice(invData);
    toast(`Sent ${invData.invoiceNumber} to printer... 🖨️`);
  };

  const handleShareWhatsApp = (pay: Payment) => {
    const invData = mapPaymentToInvoice(pay);
    sendInvoiceToWhatsApp(invData, pay.phone);
    toast(`Opening WhatsApp with Tax Invoice ${invData.invoiceNumber} for ${pay.client}... 💬`);
  };

  const handleRefund = (ref: string) => {
    if (confirm(`Are you sure you want to initiate a full tax refund for transaction ${ref}?`)) {
      setPayments((prev) => prev.map((p) => (p.ref === ref ? { ...p, status: 'Refunded' } : p)));
      toast(`Transaction ${ref} refunded and journal updated.`);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 pb-16 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Payments, Invoices &amp; Counter Checkout
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Real-time cashier register logs, official GST Tax Invoice dispatch via WhatsApp &amp;
            Print.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-[40px] px-3.5 rounded-xl text-xs font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#5A2EA6]" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={() => navigate('/payments/new-invoice')}
            className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Invoice</span>
          </Button>
        </div>
      </div>

      {/* ── Top Metric Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Gross Collections",
            val: '₹18,043',
            detail: '4 Transactions Settled',
            icon: DollarSign,
            color: 'text-[#5A2EA6]',
          },
          {
            label: 'Scanner UPI Share',
            val: '₹9,263',
            detail: '51.3% of Total Volume',
            icon: CreditCard,
            color: 'text-emerald-700',
          },
          {
            label: 'Card Swipes (POS)',
            val: '₹1,200',
            detail: 'HDFC POS Active',
            icon: Receipt,
            color: 'text-blue-700',
          },
          {
            label: 'Cash in Register Drawer',
            val: '₹7,580',
            detail: 'Float Balance Reconciled',
            icon: Building2,
            color: 'text-amber-700',
          },
        ].map((stat, i) => (
          <div key={i} className="premium-branch-card rounded-[22px] p-5 bg-white shadow-xs">
            <span className="text-[11px] font-bold text-soft uppercase tracking-wider block">
              {stat.label}
            </span>
            <strong className={`font-serif text-[26px] font-bold ${stat.color} block mt-1`}>
              {stat.val}
            </strong>
            <span className="text-[10.5px] text-[#5A2EA6] mt-0.5 font-semibold block">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white border border-[#5A2EA6]/10 rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, phone, ref code, or service..."
            className="w-full bg-[#FCFAFF] border border-line rounded-xl py-2 pl-10 pr-4 text-[12px] text-ink font-semibold outline-none focus:border-[#5A2EA6] transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span className="text-[11.5px] font-bold text-soft uppercase tracking-wider">
              Method:
            </span>
          </div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-[#FCFAFF] border border-line rounded-xl px-3 py-2 text-[12px] text-ink font-semibold outline-none cursor-pointer focus:border-[#5A2EA6]"
          >
            <option value="All">All Methods</option>
            <option value="UPI">Scanner UPI</option>
            <option value="Card">Credit/Debit Card</option>
            <option value="Cash">Cash Drawer</option>
            <option value="Split">Split Payment</option>
          </select>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between shadow-sm">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex items-center justify-between">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Counter Sales Log &amp; Digital Invoices
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Daily incoming transaction journal · {filteredPayments.length} entries · Official
                GST Formats
              </p>
            </div>

            <span className="text-[9.5px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/20">
              Live Register Journal
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Reference & Inv',
                    'Client & Contact',
                    'Service / Items',
                    'Payment Method',
                    'Amount (Incl. GST)',
                    'Time & Date',
                    'Status',
                    'Actions & Dispatch',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-4 font-bold text-[9.5px] tracking-wider uppercase',
                        i === 0 ? 'pl-6' : i === 7 ? 'pr-6 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((pay) => (
                    <tr
                      key={pay.ref}
                      className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                    >
                      <td className="p-4 pl-6 font-mono text-[11.5px] font-bold text-ink">
                        <span className="block text-[#5A2EA6]">{pay.ref}</span>
                        <span className="text-[9.5px] text-soft font-normal">{pay.invNo}</span>
                      </td>

                      <td className="p-4 font-bold text-ink">
                        <strong className="block text-ink text-[12.5px] font-bold">
                          {pay.client}
                        </strong>
                        <span className="text-[10px] text-soft font-normal">{pay.phone}</span>
                      </td>

                      <td className="p-4 font-semibold">
                        <span className="block text-ink text-[12px] font-bold">{pay.service}</span>
                        {pay.stylistAssigned && (
                          <span className="text-[9.5px] text-[#5A2EA6] block mt-0.5">
                            Stylist: {pay.stylistAssigned}
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-medium text-soft">
                        <span className="px-2 py-0.5 bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold rounded-md">
                          {pay.method}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-[#5A2EA6] text-[13px]">
                        {pay.amount}
                        <span className="block text-[9px] text-soft font-normal">
                          Incl. 18% GST
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-[11.5px] text-ink">{pay.date}</td>

                      <td className="p-4">
                        <span
                          className={cn(
                            'inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border',
                            pay.status === 'Received'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : pay.status === 'Refunded'
                                ? 'bg-rose-100 text-rose-800 border-rose-200'
                                : 'bg-amber-100 text-amber-800 border-amber-200',
                          )}
                        >
                          {pay.status}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Official Tax Invoice PDF */}
                          <button
                            onClick={() => handleOpenPdfModal(pay)}
                            title="Inspect Official GST Tax Invoice PDF"
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] flex items-center justify-center transition-all cursor-pointer border border-[#5A2EA6]/20 shadow-xs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Download Tax Invoice PDF */}
                          <button
                            onClick={async () => {
                              const invData = mapPaymentToInvoice(pay);
                              toast(
                                `Generating Tax Invoice PDF for ${invData.invoiceNumber}... 📄`,
                              );
                              await downloadInvoiceDocument(invData);
                              toast(`Tax Invoice ${invData.invoiceNumber}.pdf downloaded! ✅`);
                            }}
                            title="Download Official Tax Invoice PDF"
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-all cursor-pointer border border-[#5A2EA6]/20 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Thermal / A4 Receipt */}
                          <button
                            onClick={() => handlePrintReceipt(pay)}
                            title="Print Official Tax Invoice Receipt"
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-all cursor-pointer border-0"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Send on WhatsApp */}
                          <button
                            onClick={() => handleShareWhatsApp(pay)}
                            title="Send Official Tax Invoice & Receipt via WhatsApp"
                            className="w-8 h-8 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] flex items-center justify-center transition-all cursor-pointer border border-[#25D366]/30 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Refund */}
                          {pay.status !== 'Refunded' && (
                            <button
                              onClick={() => handleRefund(pay.ref)}
                              title="Refund Transaction"
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all cursor-pointer border-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted font-medium">
                      No matching register transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Official Invoice PDF / WhatsApp Dispatch Modal ── */}
      {isPdfModalOpen && selectedInvoiceData && (
        <InvoicePdfPreviewModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          invoiceData={selectedInvoiceData}
        />
      )}
    </div>
  );
}

export default PaymentsPage;
