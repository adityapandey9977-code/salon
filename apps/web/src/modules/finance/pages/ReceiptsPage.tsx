import { useToast } from '@salon-spa-saas/ui';
import {
  Ban,
  Building2,
  CheckCircle2,
  Coins,
  CreditCard,
  Download,
  Eye,
  FileText,
  Globe,
  MapPin,
  Plus,
  Printer,
  Receipt as ReceiptIcon,
  Search,
  Sparkles,
  Tag,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFinanceBranch } from '../context/FinanceBranchContext';

export function ReceiptsPage() {
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
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // CREATE FORM STATE
  const [createForm, setCreateForm] = useState({
    clientName: '',
    outletBranch: 'Bandra West Flagship (Mumbai)',
    paymentChannel: 'UPI (GPay Dynamic QR)',
    serviceAmount: '',
    sacHsnCode: 'SAC 999721 (Salon Services)',
    clientGstin: '',
  });

  const [receipts, setReceipts] = useState([
    {
      receiptNo: 'RCP-8801',
      date: '2026-08-07 11:20 AM',
      customer: 'Aakanksha Sharma',
      branch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      invoice: 'INV-2026-9901',
      paymentMethod: 'UPI (GPay)',
      amount: '₹4,200.00',
      receivedBy: 'Vikram Kulkarni (Cashier)',
      status: 'Paid',
      sacHsnCode: 'SAC 999721 (Services) + HSN 3305 (Retail)',
      clientGstin: '27AABCS9912D1Z0 (B2B Tax Invoice)',
      services: 'Hydra Facial Glow & Hair Spa (₹3,800.00)',
      products: 'Schwarzkopf Professional Shampoo (₹760.00)',
      gst: '₹640.68 (CGST 9% + SGST 9%)',
      discount: '₹1,000.00 (Festive Offer)',
      paymentMode: 'UPI Digital Transfer',
      referenceNumber: 'TXN-UPI-99481023',
      notes: 'Customer opted for VIP package discount. Paid via GooglePay UPI POS terminal.',
    },
    {
      receiptNo: 'RCP-8802',
      date: '2026-08-07 10:15 AM',
      customer: 'Ananya Roy',
      branch: 'South Extension II (Delhi NCR)',
      branchId: 'delhi',
      invoice: 'INV-2026-9880',
      paymentMethod: 'Credit Card (POS)',
      amount: '₹7,800.00',
      receivedBy: 'Pooja Kashyap (Cashier)',
      status: 'Paid',
      sacHsnCode: 'SAC 999721 (Hair Care Services)',
      clientGstin: 'Unregistered Consumer (B2C)',
      services: 'Keratin Smooth Treatment & Styling (₹7,000.00)',
      products: 'Argan Hair Serum (₹1,500.00)',
      gst: '₹1,189.83 (CGST 9% + SGST 9%)',
      discount: '₹700.00 (Loyalty Points)',
      paymentMode: 'HDFC Credit Card POS',
      referenceNumber: 'TXN-CC-88192034',
      notes: 'HDFC Credit Card swiped at PineLabs POS terminal #2.',
    },
    {
      receiptNo: 'RCP-8799',
      date: '2026-08-06 05:40 PM',
      customer: 'Meenakshi Sundaram',
      branch: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      invoice: 'INV-2026-9750',
      paymentMethod: 'Digital Wallet',
      amount: '₹2,500.00',
      receivedBy: 'Kavita Sundaram (Cashier)',
      status: 'Paid',
      sacHsnCode: 'SAC 999721 (Nail & Spa Services)',
      clientGstin: 'Unregistered Consumer (B2C)',
      services: 'Deluxe Manicure & Pedicure Spa (₹2,200.00)',
      products: 'Nail Polish & Cream (₹500.00)',
      gst: '₹381.35 (CGST 9% + SGST 9%)',
      discount: '₹200.00 (Promo Code)',
      paymentMode: 'Salon Prepaid Wallet',
      referenceNumber: 'TXN-WLT-771829',
      notes: 'Prepaid Wallet credits redeemed at checkout.',
    },
    {
      receiptNo: 'RCP-8750',
      date: '2026-08-06 02:30 PM',
      customer: 'Rajesh Kumar',
      branch: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      invoice: 'INV-2026-9600',
      paymentMethod: 'Cash',
      amount: '₹1,200.00',
      receivedBy: 'Suresh Varma (Cashier)',
      status: 'Voided',
      sacHsnCode: 'SAC 999721 (Grooming)',
      clientGstin: 'Unregistered Consumer (B2C)',
      services: 'Gentlemen Haircut & Beard Grooming (₹1,200.00)',
      products: 'None',
      gst: '₹183.05 (CGST 9% + SGST 9%)',
      discount: '₹0.00',
      paymentMode: 'Cash Register',
      referenceNumber: 'TXN-CSH-002',
      notes: 'Bill voided due to double-entry cashier correction.',
    },
  ]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.clientName || !createForm.serviceAmount) return;

    const newId = `RCP-${Math.floor(8800 + Math.random() * 99)}`;
    const amt = Number(createForm.serviceAmount);
    const gstAmt = (amt * 0.18) / 1.18;

    const newReceipt = {
      receiptNo: newId,
      date: new Date().toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customer: createForm.clientName,
      branch: createForm.outletBranch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      invoice: `INV-2026-${Math.floor(9000 + Math.random() * 999)}`,
      paymentMethod: createForm.paymentChannel,
      amount: `₹${amt.toLocaleString('en-IN')}.00`,
      receivedBy: `${selectedBranch.leadAccountant.split(' ')[0]} (Cashier)`,
      status: 'Paid',
      sacHsnCode: createForm.sacHsnCode,
      clientGstin: createForm.clientGstin || 'Unregistered Consumer (B2C)',
      services: 'Salon & Spa Services',
      products: 'None',
      gst: `₹${gstAmt.toFixed(2)} (CGST 9% + SGST 9%)`,
      discount: '₹0.00',
      paymentMode: createForm.paymentChannel,
      referenceNumber: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Sales invoice generated and posted to tax ledger.',
    };

    setReceipts([newReceipt, ...receipts]);
    setIsCreateModalOpen(false);
    setCreateForm({
      clientName: '',
      outletBranch: 'Bandra West Flagship (Mumbai)',
      paymentChannel: 'UPI (GPay Dynamic QR)',
      serviceAmount: '',
      sacHsnCode: 'SAC 999721 (Salon Services)',
      clientGstin: '',
    });
    toast(
      `Sales Receipt Issued: [${newId}] created for ${newReceipt.customer} (${newReceipt.amount}).`,
    );
  };

  const filteredReceipts = receipts.filter((r) => {
    const matchesBranch = isAllBranches || r.branchId === selectedBranchId;
    const matchesSearch =
      r.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Customer Receipts &amp; GST Tax Invoices
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Sales Invoices' : `${selectedBranch.shortName} Receipts`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Complete customer billing ledger with SAC 999721 &amp; HSN 3305 tax itemization, split
            tender tracking, and printable tax receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Issue Sales Receipt
          </button>

          <button
            onClick={() =>
              toast(`Export Receipts: ${selectedBranch.shortName} receipts exported to CSV.`)
            }
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Receipts
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by receipt no, customer name, invoice #, or payment tender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* RECEIPTS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Receipt No &amp; Date</th>
                <th className="p-3">Customer &amp; GSTIN</th>
                <th className="p-3">Branch Location</th>
                <th className="p-3">Tax SAC / HSN Code</th>
                <th className="p-3">Payment Tender</th>
                <th className="p-3">Total Amount (₹)</th>
                <th className="p-3">Cashier</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredReceipts.map((rcp) => (
                <tr key={rcp.receiptNo} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-purple-700">
                    <div>{rcp.receiptNo}</div>
                    <div className="text-[10px] text-muted font-mono">{rcp.date}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-ink">{rcp.customer}</div>
                    <div className="text-[9.5px] text-soft font-mono">{rcp.clientGstin}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {rcp.branch}
                    </div>
                  </td>

                  <td className="p-3 font-mono font-semibold text-purple-900 text-[11px]">
                    {rcp.sacHsnCode}
                  </td>

                  <td className="p-3 font-semibold text-ink">{rcp.paymentMethod}</td>
                  <td className="p-3 font-bold text-emerald-700 text-sm">{rcp.amount}</td>
                  <td className="p-3 text-soft font-medium">{rcp.receivedBy}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rcp.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {rcp.status}
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => setSelectedReceipt(rcp)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[11px] font-bold border border-purple-200 cursor-pointer"
                    >
                      View Invoice
                    </button>
                    <button
                      onClick={() =>
                        toast(
                          `Print Tax Invoice: Sent ${rcp.receiptNo} to thermal receipt printer.`,
                        )
                      }
                      className="p-1 bg-pine/10 hover:bg-pine/20 rounded-lg text-ink cursor-pointer border-0 inline-flex items-center justify-center"
                      title="Print Tax Invoice"
                    >
                      <Printer className="w-3.5 h-3.5 text-soft" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE RECEIPT MODAL */}
      {isCreateModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Issue Sales Receipt &amp; Tax Invoice
                  </h3>
                  <p className="text-xs text-soft">
                    Generate customer receipt with SAC 999721 GST tax breakdown
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aakanksha Sharma"
                      value={createForm.clientName}
                      onChange={(e) => setCreateForm({ ...createForm, clientName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Salon Branch *
                    </label>
                    <select
                      value={createForm.outletBranch}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, outletBranch: e.target.value })
                      }
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
                      Total Bill Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4200"
                      value={createForm.serviceAmount}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, serviceAmount: e.target.value })
                      }
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl font-bold text-purple-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Payment Tender *
                    </label>
                    <select
                      value={createForm.paymentChannel}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, paymentChannel: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      <option value="UPI (GPay Dynamic QR)">UPI (GPay / PhonePe QR)</option>
                      <option value="HDFC Credit Card POS">Credit / Debit Card POS</option>
                      <option value="Cash Collections">Physical Cash Collections</option>
                      <option value="Digital Wallet Pass">Salon Prepaid Wallet</option>
                      <option value="Gift Card Redemption">Gift Card Voucher</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    B2B Customer GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 27AABCS1429B1Z8"
                    value={createForm.clientGstin}
                    onChange={(e) => setCreateForm({ ...createForm, clientGstin: e.target.value })}
                    className="w-full p-2.5 bg-white border border-line rounded-xl font-mono text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Issue Receipt &amp; Post Ledger
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* VIEW RECEIPT DETAILS MODAL */}
      {selectedReceipt &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Official Tax Invoice Dossier
                  </h3>
                  <p className="text-xs text-soft font-mono">
                    {selectedReceipt.receiptNo} • {selectedReceipt.invoice}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-pine/5 rounded-2xl border border-line">
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase">Client Name</span>
                    <div className="font-bold text-ink text-sm">{selectedReceipt.customer}</div>
                    <div className="text-[10px] text-muted font-mono">
                      {selectedReceipt.clientGstin}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-soft uppercase">
                      Branch Location
                    </span>
                    <div className="font-bold text-purple-900">{selectedReceipt.branch}</div>
                    <div className="text-[10px] text-muted">{selectedReceipt.date}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">Services Billed (SAC 999721):</span>
                    <span className="font-bold text-ink">{selectedReceipt.services}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">Retail Products (HSN 3305):</span>
                    <span className="font-bold text-ink">{selectedReceipt.products}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">GST Tax (CGST 9% + SGST 9%):</span>
                    <span className="font-bold text-indigo-700">{selectedReceipt.gst}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-line/40">
                    <span className="text-soft font-medium">Discount Applied:</span>
                    <span className="font-bold text-rose-600">-{selectedReceipt.discount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-line font-bold text-sm">
                    <span>Net Total Amount Paid:</span>
                    <span className="text-emerald-700 text-base">{selectedReceipt.amount}</span>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                    Audit &amp; Tender Reference
                  </span>
                  <div className="text-[11px] text-soft">
                    Payment Mode:{' '}
                    <strong className="text-ink">{selectedReceipt.paymentMode}</strong> • Ref:{' '}
                    <span className="font-mono text-purple-800">
                      {selectedReceipt.referenceNumber}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-soft italic mt-0.5">{selectedReceipt.notes}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() =>
                    toast(`Print Tax Invoice: Sent ${selectedReceipt.receiptNo} to printer.`)
                  }
                  className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Tax Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="px-5 py-2 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold border-0 cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
