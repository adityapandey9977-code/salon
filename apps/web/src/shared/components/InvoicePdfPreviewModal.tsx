import { DialogModal } from '@/shared/components/DialogModal';
import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  MessageSquare,
  Printer,
  QrCode,
  Receipt,
  Share2,
  Sparkles,
} from 'lucide-react';
import React, { useState } from 'react';
import {
  type InvoiceFullData,
  defaultInvoiceValues,
  downloadInvoiceDocument,
  downloadInvoiceFromElement,
  downloadVectorInvoicePdf,
  downloadVectorReceiptPdf,
  generateTaxInvoiceHtml,
  numberToWordsIndian,
  printInvoice,
  sendInvoiceToWhatsApp,
} from '../utils/invoicePdfGenerator';

export interface InvoicePdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: Partial<InvoiceFullData>;
}

export function InvoicePdfPreviewModal({
  isOpen,
  onClose,
  invoiceData,
}: InvoicePdfPreviewModalProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'invoice' | 'receipt'>('invoice');
  const inv: InvoiceFullData = { ...defaultInvoiceValues, ...invoiceData };
  const totalInWords = numberToWordsIndian(inv.totalAmount);

  if (!isOpen) return null;

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={onClose}
      title={`GST Tax Invoice · ${inv.invoiceNumber}`}
      description="Official Tax Invoice & WhatsApp digital receipt for client dispatch"
    >
      <div className="space-y-4 pt-2">
        {/* Top Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('invoice')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0',
                viewMode === 'invoice'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-purple-100/50',
              )}
            >
              Tax Invoice Format
            </button>
            <button
              onClick={() => setViewMode('receipt')}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-0',
                viewMode === 'receipt'
                  ? 'bg-[#5A2EA6] text-white shadow-xs'
                  : 'text-[#5A2EA6] hover:bg-purple-100/50',
              )}
            >
              Payment Receipt Format
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* WhatsApp Send Action */}
            <Button
              onClick={() => {
                sendInvoiceToWhatsApp(inv, inv.clientPhone);
                toast('Opening WhatsApp with pre-filled Tax Invoice & Payment Receipt... 💬');
              }}
              className="h-8 px-3 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5B] text-white flex items-center gap-1.5 shadow-xs border-0 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Send WhatsApp</span>
            </Button>

            {/* Print Action */}
            <Button
              onClick={() => printInvoice(inv)}
              variant="outline"
              className="h-8 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Print A4 / Thermal</span>
            </Button>

            {/* Download PDF Action */}
            <Button
              onClick={() => {
                if (viewMode === 'invoice') {
                  toast(`Generating Tax Invoice PDF for ${inv.invoiceNumber}... 📄`);
                  downloadVectorInvoicePdf(inv);
                  toast(`Tax Invoice ${inv.invoiceNumber}.pdf downloaded! ✅`);
                } else {
                  toast(`Generating Payment Receipt PDF for ${inv.invoiceNumber}... 📄`);
                  downloadVectorReceiptPdf(inv);
                  toast(`Payment Receipt ${inv.invoiceNumber}.pdf downloaded! ✅`);
                }
              }}
              variant="outline"
              className="h-8 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>

        {/* Live Invoice Preview Sheet (Pixel-perfect recreation matching uploaded template) */}
        <div className="bg-slate-100 p-3 sm:p-4 rounded-2xl max-h-[60vh] overflow-y-auto border border-slate-200 shadow-inner">
          {viewMode === 'invoice' ? (
            <div
              id="invoice-live-sheet"
              className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-300 max-w-[740px] mx-auto text-[11px] text-[#111827] space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4 border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 shrink-0">
                    <svg viewBox="0 0 44 44" width="44" height="44" className="w-full h-full block">
                      <circle cx="22" cy="22" r="22" fill="#000000" />
                      <text
                        x="22"
                        y="28.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="20"
                        fontWeight="800"
                        fontFamily="Inter, system-ui, sans-serif"
                      >
                        A
                      </text>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[13px] text-ink leading-tight">
                      {inv.businessName}
                    </h2>
                    <p className="text-[10px] text-slate-600 mt-0.5">{inv.businessAddress}</p>
                    <p className="text-[10px] text-slate-600">
                      {inv.businessCityStatePin}, {inv.businessCountry}
                    </p>
                    <p className="text-[10px] text-slate-600 font-medium font-mono">
                      {inv.businessGstin}
                    </p>
                    <p className="text-[10px] text-slate-600">{inv.businessPhone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold tracking-wider text-ink block">
                    TAX INVOICE
                  </span>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 border border-slate-300 rounded-xs text-[10.5px]">
                <div className="p-2.5 border-r border-slate-300 space-y-1">
                  <div className="flex">
                    <span className="w-24 text-slate-600 font-semibold">#</span>
                    <span className="font-bold font-mono">: {inv.invoiceNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-600 font-semibold">Invoice Date</span>
                    <span className="font-semibold">: {inv.invoiceDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-600 font-semibold">Terms</span>
                    <span className="font-semibold">: {inv.terms}</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 text-slate-600 font-semibold">Due Date</span>
                    <span className="font-semibold">: {inv.dueDate}</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <div className="flex">
                    <span className="w-28 text-slate-600 font-semibold">Place Of Supply</span>
                    <span className="font-bold">: {inv.placeOfSupply}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-600 font-semibold">Payment Mode</span>
                    <span className="font-semibold text-emerald-700">: {inv.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="text-[10.5px] space-y-0.5">
                <span className="font-bold text-slate-700 block">Bill To</span>
                <strong className="text-ink text-[11.5px] block">{inv.clientName}</strong>
                {inv.clientAddress && <p className="text-slate-600">{inv.clientAddress}</p>}
                {inv.clientCity && (
                  <p className="text-slate-600">
                    {inv.clientCity}, {inv.clientStatePin}
                  </p>
                )}
                <p className="text-slate-600 font-medium">{inv.clientPhone}</p>
                {inv.clientGstin && (
                  <p className="text-slate-700 font-bold font-mono">GSTIN: {inv.clientGstin}</p>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-300 text-ink">
                      <th className="border border-slate-300 p-1.5 text-center w-6">#</th>
                      <th className="border border-slate-300 p-1.5 text-left">
                        Item &amp; Description
                      </th>
                      <th className="border border-slate-300 p-1.5 text-center w-16">HSN/SAC</th>
                      <th className="border border-slate-300 p-1.5 text-center w-8">Qty</th>
                      <th className="border border-slate-300 p-1.5 text-right w-14">Rate</th>
                      <th className="border border-slate-300 p-1.5 text-center w-10">CGST %</th>
                      <th className="border border-slate-300 p-1.5 text-right w-12">CGST Amt</th>
                      <th className="border border-slate-300 p-1.5 text-center w-10">SGST %</th>
                      <th className="border border-slate-300 p-1.5 text-right w-12">SGST Amt</th>
                      <th className="border border-slate-300 p-1.5 text-right w-16">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inv.items.map((it, idx) => {
                      const cgstRate = it.cgstRate ?? 9;
                      const sgstRate = it.sgstRate ?? 9;
                      const lineTaxable = it.rate * it.qty;
                      const lineCgst = (lineTaxable * cgstRate) / 100;
                      const lineSgst = (lineTaxable * sgstRate) / 100;
                      return (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5">
                            <strong className="text-ink font-bold block">{it.name}</strong>
                            {it.description && (
                              <span className="text-[9.5px] text-slate-500 block">
                                {it.description}
                              </span>
                            )}
                            {inv.stylistAssigned && (
                              <span className="text-[9px] text-[#5A2EA6] font-semibold block">
                                Stylist: {inv.stylistAssigned}
                              </span>
                            )}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center font-mono">
                            {it.sacCode}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold">
                            {it.qty}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-right">
                            ₹{it.rate.toFixed(2)}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center">{cgstRate}%</td>
                          <td className="border border-slate-300 p-1.5 text-right">
                            ₹{lineCgst.toFixed(2)}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center">{sgstRate}%</td>
                          <td className="border border-slate-300 p-1.5 text-right">
                            ₹{lineSgst.toFixed(2)}
                          </td>
                          <td className="border border-slate-300 p-1.5 text-right font-bold">
                            ₹{lineTaxable.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Summary Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Left side info */}
                <div className="space-y-3 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Total In Words</span>
                    <strong className="text-ink text-[11px] italic font-semibold">
                      {totalInWords}
                    </strong>
                  </div>

                  <div className="space-y-0.5 text-slate-600">
                    <strong className="text-ink text-[10.5px]">Notes</strong>
                    <p className="whitespace-pre-line leading-relaxed">{inv.notes}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5 text-[9.5px]">
                    <div>
                      <strong>UPI:</strong> <span className="font-mono">{inv.upiId}</span>
                    </div>
                    <div>
                      <strong>Account Name:</strong> {inv.accountName}
                    </div>
                    <div>
                      <strong>Account Number:</strong>{' '}
                      <span className="font-mono">{inv.accountNumber}</span>
                    </div>
                    <div>
                      <strong>IFSC:</strong> <span className="font-mono">{inv.ifscCode}</span> ·{' '}
                      <strong>Bank:</strong> {inv.bankName}
                    </div>
                  </div>

                  <div className="text-[9px] text-slate-500 leading-relaxed border-t pt-2 border-slate-200">
                    <strong>Terms &amp; Conditions:</strong>
                    <br />
                    14-day service guarantee &amp; revision policy. Annual package redemption
                    applies per branch booking calendar.
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center p-1">
                      <QrCode className="w-full h-full text-slate-800" />
                    </div>
                    <span className="text-[9.5px] text-slate-600 font-medium">
                      Scan the QR code to verify or pay using any UPI apps.
                    </span>
                  </div>
                </div>

                {/* Right side financials */}
                <div>
                  <table className="w-full text-[11px] border-collapse">
                    <tbody>
                      <tr>
                        <td className="py-1 text-right text-slate-600">Sub Total</td>
                        <td className="py-1 text-right font-semibold text-ink w-24">
                          ₹{inv.subTotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-right text-slate-600">CGST9 (9%)</td>
                        <td className="py-1 text-right font-semibold text-ink">
                          ₹{inv.cgstAmount.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-1 text-right text-slate-600">SGST9 (9%)</td>
                        <td className="py-1 text-right font-semibold text-ink">
                          ₹{inv.sgstAmount.toFixed(2)}
                        </td>
                      </tr>
                      {inv.rounding !== 0 && (
                        <tr>
                          <td className="py-1 text-right text-slate-600">Rounding</td>
                          <td className="py-1 text-right font-semibold text-ink">
                            ₹{inv.rounding.toFixed(2)}
                          </td>
                        </tr>
                      )}
                      <tr className="border-t border-b border-slate-400 font-extrabold text-sm text-ink">
                        <td className="py-1.5 text-right">Total</td>
                        <td className="py-1.5 text-right font-bold text-ink">
                          ₹{inv.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="text-emerald-700 font-bold">
                        <td className="py-1 text-right">Payment Made</td>
                        <td className="py-1 text-right">(-) ₹{inv.paymentMade.toFixed(2)}</td>
                      </tr>
                      <tr className="border-t border-slate-300 font-extrabold text-sm text-ink">
                        <td className="py-1.5 text-right">Balance Due</td>
                        <td className="py-1.5 text-right">₹{inv.balanceDue.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Payment Receipt Template matching Screenshot 2 */
            <div
              id="receipt-live-sheet"
              className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-300 max-w-[740px] mx-auto text-[11.5px] text-[#111827] space-y-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4 border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 shrink-0">
                    <svg viewBox="0 0 44 44" width="44" height="44" className="w-full h-full block">
                      <circle cx="22" cy="22" r="22" fill="#000000" />
                      <text
                        x="22"
                        y="28.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="20"
                        fontWeight="800"
                        fontFamily="Inter, system-ui, sans-serif"
                      >
                        A
                      </text>
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[13px] text-ink leading-tight">
                      {inv.businessName}
                    </h2>
                    <p className="text-[10px] text-slate-600 mt-0.5">{inv.businessAddress}</p>
                    <p className="text-[10px] text-slate-600">
                      {inv.businessCityStatePin}, {inv.businessCountry}
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono font-medium">
                      {inv.businessGstin}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold tracking-wider text-ink block">
                    PAYMENT RECEIPT
                  </span>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-2 space-y-2.5 text-[11px]">
                  <div className="flex">
                    <span className="w-36 text-slate-600 font-semibold">Payment Date</span>
                    <span className="font-bold">: {inv.invoiceDate}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 text-slate-600 font-semibold">Reference Number</span>
                    <span className="font-mono font-bold">: {inv.referenceNumber}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 text-slate-600 font-semibold">Payment Mode</span>
                    <span className="font-bold">: {inv.paymentMethod}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 text-slate-600 font-semibold">
                      Amount Received In Words
                    </span>
                    <span className="font-semibold italic">: {totalInWords}</span>
                  </div>
                </div>

                <div className="bg-emerald-600 text-white p-4 rounded-xl text-center shadow-xs">
                  <span className="text-[10.5px] uppercase tracking-wider block font-bold text-emerald-100">
                    Amount Received
                  </span>
                  <strong className="text-2xl font-serif font-extrabold block mt-1">
                    ₹{inv.totalAmount.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 font-bold block mb-1 text-[10.5px]">
                    Received From
                  </span>
                  <strong className="text-ink text-xs block">{inv.clientName}</strong>
                  <p className="text-slate-600 text-[10.5px]">
                    {inv.clientAddress || 'Walk-in Guest, Indrapuri'}
                  </p>
                  <p className="text-slate-600 text-[10.5px]">
                    {inv.clientCity || 'Bhopal'}, {inv.clientCountry || 'India'}
                  </p>
                </div>

                <div className="text-right flex flex-col justify-end items-end">
                  <div className="w-40 border-b border-slate-400 pb-1 text-center font-serif text-slate-600 italic">
                    Priya Sharma
                  </div>
                  <span className="text-slate-500 text-[10px] font-bold mt-1">
                    Authorized Cashier Signature
                  </span>
                </div>
              </div>

              {/* Payment for Table */}
              <div className="pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-800 text-xs block mb-2">Payment For</span>
                <table className="w-full border-collapse border border-slate-300 text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-300 text-ink">
                      <th className="border border-slate-300 p-2 text-left">Invoice Number</th>
                      <th className="border border-slate-300 p-2 text-left">Invoice Date</th>
                      <th className="border border-slate-300 p-2 text-right">Invoice Amount</th>
                      <th className="border border-slate-300 p-2 text-right">Payment Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 font-mono font-bold">
                        {inv.invoiceNumber}
                      </td>
                      <td className="border border-slate-300 p-2">{inv.invoiceDate}</td>
                      <td className="border border-slate-300 p-2 text-right font-semibold">
                        ₹{inv.totalAmount.toFixed(2)}
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-emerald-700">
                        ₹{inv.paymentMade.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-[11px] text-soft font-semibold">
            Ready for instant dispatch via WhatsApp or Thermal / A4 Print.
          </span>
          <Button onClick={onClose} className="h-9 px-4 rounded-xl text-xs font-bold">
            Done
          </Button>
        </div>
      </div>
    </DialogModal>
  );
}
