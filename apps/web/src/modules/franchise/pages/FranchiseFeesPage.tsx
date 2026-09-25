import { useToast } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export function FranchiseFeesPage() {
  const { toast } = useToast();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [viewInvoiceFee, setViewInvoiceFee] = useState<any>(null);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  // ALL 8 EXACT TABLE COLUMNS REQUESTED BY USER: Month, Royalty, Software Subscription, Marketing Fee, Tax, Total, Due Date, Status
  const [feeLedger, setFeeLedger] = useState([
    {
      id: 'FEE-2026-08',
      month: 'August 2026',
      royalty: '₹3,88,000',
      softwareSubscription: '₹25,000',
      marketingFee: '₹97,000',
      tax: '₹91,800',
      total: '₹6,01,800',
      dueDate: '10 Aug 2026',
      status: 'Pending',
      gstNo: '23AAAAA0000A1Z5',
    },
    {
      id: 'FEE-2026-07',
      month: 'July 2026',
      royalty: '₹3,53,600',
      softwareSubscription: '₹25,000',
      marketingFee: '₹88,400',
      tax: '₹84,060',
      total: '₹5,51,060',
      dueDate: '10 Jul 2026',
      status: 'Paid',
      gstNo: '23AAAAA0000A1Z5',
    },
    {
      id: 'FEE-2026-06',
      month: 'June 2026',
      royalty: '₹3,28,000',
      softwareSubscription: '₹25,000',
      marketingFee: '₹82,000',
      tax: '₹78,300',
      total: '₹5,13,300',
      dueDate: '10 Jun 2026',
      status: 'Paid',
      gstNo: '23AAAAA0000A1Z5',
    },
    {
      id: 'FEE-2026-05',
      month: 'May 2026',
      royalty: '₹3,10,000',
      softwareSubscription: '₹25,000',
      marketingFee: '₹77,500',
      tax: '₹74,250',
      total: '₹4,86,750',
      dueDate: '10 May 2026',
      status: 'Paid',
      gstNo: '23AAAAA0000A1Z5',
    },
  ]);

  const handlePayFee = (fee: any) => {
    setSelectedFee(fee);
    setIsPayModalOpen(true);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee) return;

    setFeeLedger(feeLedger.map((f) => (f.id === selectedFee.id ? { ...f, status: 'Paid' } : f)));
    setIsPayModalOpen(false);
    toast(
      `Payment Successful: Franchise fee invoice for ${selectedFee.month} (${selectedFee.total}) paid to HQ.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Franchise Fee Billing &amp; Settlement Ledger
          </h1>
          <p className="text-xs text-soft mt-1">
            Monthly royalty settlement ledger, software subscriptions, national marketing fees, tax
            invoices, and instant payments.
          </p>
        </div>

        <button
          onClick={() =>
            toast('Export Statement: Franchise fee settlement statement exported to CSV.')
          }
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" /> Export Fee Statement
        </button>
      </div>

      {/* 8 TABLE COLUMNS & 3 BUTTONS REQUESTED BY USER */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-line flex justify-between items-center">
          <h3 className="text-base font-bold text-ink flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-600" /> Franchise Fee Ledger
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Month</th>
                <th className="p-3">Royalty</th>
                <th className="p-3">Software Subscription</th>
                <th className="p-3">Marketing Fee</th>
                <th className="p-3">Tax</th>
                <th className="p-3">Total</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {feeLedger.map((f) => (
                <tr key={f.id} className="hover:bg-purple-50/30 transition-colors">
                  {/* 1. Month */}
                  <td className="p-3 font-bold text-purple-700">
                    <div>{f.month}</div>
                    <div className="text-[10px] text-soft font-medium">{f.id}</div>
                  </td>

                  {/* 2. Royalty */}
                  <td className="p-3 font-semibold text-purple-900">{f.royalty}</td>

                  {/* 3. Software Subscription */}
                  <td className="p-3 font-semibold text-ink">{f.softwareSubscription}</td>

                  {/* 4. Marketing Fee */}
                  <td className="p-3 font-semibold text-emerald-700">{f.marketingFee}</td>

                  {/* 5. Tax */}
                  <td className="p-3 font-semibold text-soft">{f.tax}</td>

                  {/* 6. Total */}
                  <td className="p-3 font-bold text-ink text-sm">{f.total}</td>

                  {/* 7. Due Date */}
                  <td className="p-3 font-medium text-soft">{f.dueDate}</td>

                  {/* 8. Status */}
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        f.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>

                  {/* 3 BUTTONS (View Invoice, Pay Now, Download Invoice) */}
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                      {/* Button 1: View Invoice */}
                      <button
                        onClick={() => setViewInvoiceFee(f)}
                        className="px-2.5 py-1 border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 rounded-lg font-semibold text-[10.5px] cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <Eye className="w-3 h-3 text-purple-600" /> View Invoice
                      </button>

                      {/* Button 2: Pay Now */}
                      {f.status === 'Pending' && (
                        <button
                          onClick={() => handlePayFee(f)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10.5px] cursor-pointer border-0 shadow-xs inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <CreditCard className="w-3 h-3" /> Pay Now
                        </button>
                      )}

                      {/* Button 3: Download Invoice */}
                      <button
                        onClick={() =>
                          toast(
                            `Download Invoice: Downloading GST Tax Invoice PDF for ${f.month}...`,
                          )
                        }
                        className="px-2.5 py-1 border border-line text-soft hover:text-ink bg-white hover:bg-paper rounded-lg font-semibold text-[10.5px] cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
                      >
                        <Download className="w-3 h-3 text-soft" /> Download Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BUTTON 1 MODAL: VIEW INVOICE (createPortal) */}
      {viewInvoiceFee &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    GST Tax Invoice breakdown
                  </h3>
                  <p className="text-xs text-soft">
                    {viewInvoiceFee.month} ({viewInvoiceFee.id})
                  </p>
                </div>
                <button
                  onClick={() => setViewInvoiceFee(null)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-purple-800">
                    1. Royalty Fee (8%)
                  </span>
                  <strong className="text-purple-950 font-bold">{viewInvoiceFee.royalty}</strong>
                </div>

                <div className="p-3 bg-paper/40 rounded-xl border border-line flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-soft">
                    2. Software Subscription
                  </span>
                  <strong className="text-ink font-semibold">
                    {viewInvoiceFee.softwareSubscription}
                  </strong>
                </div>

                <div className="p-3 bg-paper/40 rounded-xl border border-line flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-soft">
                    3. National Marketing Fund (2%)
                  </span>
                  <strong className="text-emerald-700 font-bold">
                    {viewInvoiceFee.marketingFee}
                  </strong>
                </div>

                <div className="p-3 bg-paper/40 rounded-xl border border-line flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-soft">
                    4. GST Tax (18%)
                  </span>
                  <strong className="text-soft font-semibold">{viewInvoiceFee.tax}</strong>
                </div>

                <div className="p-3.5 bg-purple-900 text-white rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-purple-200">
                    Total Invoice Amount
                  </span>
                  <strong className="text-amber-300 font-bold text-base">
                    {viewInvoiceFee.total}
                  </strong>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-line">
                <button
                  onClick={() => setViewInvoiceFee(null)}
                  className="px-6 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                >
                  Close Invoice
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* BUTTON 2 MODAL: PAY NOW (createPortal) */}
      {isPayModalOpen &&
        selectedFee &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Pay Royalty Fee Invoice
                  </h3>
                  <p className="text-xs text-soft">{selectedFee.month} Settlement</p>
                </div>
                <button
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase text-purple-800">
                    Total Fee Amount Payable
                  </span>
                  <div className="text-2xl font-bold text-purple-950">{selectedFee.total}</div>
                  <div className="text-[11px] text-soft">Due Date: {selectedFee.dueDate}</div>
                </div>

                <div className="space-y-2">
                  <label className="block font-bold text-ink text-[11px]">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="p-3 border border-purple-600 bg-purple-50/60 rounded-xl font-bold text-purple-900 text-center cursor-pointer"
                    >
                      UPI / QR Code
                    </button>
                    <button
                      type="button"
                      className="p-3 border border-line bg-white rounded-xl font-semibold text-soft text-center cursor-pointer hover:border-purple-600"
                    >
                      Net Banking
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-soft font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer border-0 shadow"
                  >
                    Confirm &amp; Pay {selectedFee.total}
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
