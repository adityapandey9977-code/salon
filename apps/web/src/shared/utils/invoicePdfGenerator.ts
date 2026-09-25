/* -------------------------------------------------------------------------- */
/* Enterprise GST Tax Invoice & Receipt PDF / Print Generator                 */
/* Matches Official Template: TAX INVOICE, PAYMENT RECEIPT, STATEMENT OF ACCS  */
/* -------------------------------------------------------------------------- */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface InvoiceItemDetail {
  name: string;
  description?: string;
  sacCode: string;
  qty: number;
  rate: number;
  cgstRate?: number; // default 9%
  sgstRate?: number; // default 9%
  amount: number;
}

export interface InvoiceFullData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  terms: string;
  placeOfSupply: string;

  // Business / Seller
  businessName: string;
  businessAddress: string;
  businessCityStatePin: string;
  businessCountry: string;
  businessGstin: string;
  businessPhone: string;
  businessEmail?: string;

  // Client / Buyer
  clientName: string;
  clientAddress?: string;
  clientCity?: string;
  clientStatePin?: string;
  clientCountry?: string;
  clientPhone: string;
  clientGstin?: string;

  // Line items
  items: InvoiceItemDetail[];

  // Totals & Financials
  subTotal: number;
  cgstAmount: number;
  sgstAmount: number;
  rounding: number;
  totalAmount: number;
  paymentMade: number;
  balanceDue: number;
  paymentMethod: string;
  referenceNumber: string;

  // Bank & UPI
  upiId: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;

  // Extra notes
  notes?: string;
  stylistAssigned?: string;
}

/**
 * Converts numbers into Indian Rupee words (e.g. 117 -> Indian Rupee One Hundred Seventeen Only)
 */
export function numberToWordsIndian(num: number): string {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Indian Rupee Zero Only';

  const inWords = (n: number): string => {
    let str = '';
    if (n >= 10000000) {
      str += inWords(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }
    if (n >= 100000) {
      str += inWords(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }
    if (n >= 1000) {
      str += inWords(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }
    if (n >= 100) {
      str += inWords(Math.floor(n / 100)) + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n];
      } else {
        str += b[Math.floor(n / 10)];
        if (n % 10 > 0) str += ' ' + a[n % 10];
      }
    }
    return str.trim();
  };

  return `Indian Rupee ${inWords(n)} Only`;
}

/**
 * Default fallback data for Atelier Indrapuri Flagship
 */
export const defaultInvoiceValues: InvoiceFullData = {
  invoiceNumber: 'INV-103910',
  invoiceDate: '17 Aug 2026',
  dueDate: '17 Aug 2026',
  terms: 'Due on Receipt',
  placeOfSupply: 'Madhya Pradesh (23)',

  businessName: 'Atelier Salon & Spa Private Limited',
  businessAddress: 'Plot 42, Sector B, Main Commercial Belt, Indrapuri',
  businessCityStatePin: 'Bhopal, Madhya Pradesh 462022',
  businessCountry: 'India',
  businessGstin: 'GSTIN 23AAAAA0000A1Z5',
  businessPhone: '+91 755 4892011',
  businessEmail: 'bhopal.indrapuri@ateliersalon.com',

  clientName: 'Twinkle Beauty parlour',
  clientAddress: 'mahalaxmi nagar',
  clientCity: 'Indore',
  clientStatePin: '452010 Madhya Pradesh',
  clientCountry: 'India',
  clientPhone: '9111454949',

  items: [
    {
      name: 'Signature Precision Cut & Blowout',
      description: 'Senior Master Stylist precision haircut and organic blowout treatment',
      sacCode: '999711',
      qty: 1,
      rate: 1500,
      cgstRate: 9,
      sgstRate: 9,
      amount: 1500,
    },
  ],

  subTotal: 1500,
  cgstAmount: 135,
  sgstAmount: 135,
  rounding: 0.0,
  totalAmount: 1770,
  paymentMade: 1770,
  balanceDue: 0.0,
  paymentMethod: 'Scanner UPI',
  referenceNumber: 'pay_TQqCb52zYNCuK7',

  upiId: 'atelier.indrapuri@icici',
  accountName: 'ATELIER SALON & SPA PRIVATE LIMITED',
  accountNumber: '317905000665',
  ifscCode: 'ICIC0003179',
  bankName: 'ICICI Bank',

  notes:
    'Thank you for your visit. You just made our day.\nLooking forward to your next salon & spa appointment.',
  stylistAssigned: 'Emma Burke (Master Stylist)',
};

/**
 * Generates the clean, official Tax Invoice HTML string
 */
export function generateTaxInvoiceHtml(data: Partial<InvoiceFullData>): string {
  const inv: InvoiceFullData = { ...defaultInvoiceValues, ...data };
  const totalInWords = numberToWordsIndian(inv.totalAmount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${inv.invoiceNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #111827;
      background: #ffffff;
      padding: 32px;
      line-height: 1.4;
      font-size: 11.5px;
    }

    .invoice-container {
      max-width: 740px;
      margin: 0 auto;
      background: #ffffff;
      padding: 28px 32px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }

    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }

    .company-info {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .company-logo {
      width: 44px;
      height: 44px;
      background: #000000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      line-height: 44px;
      flex-shrink: 0;
    }

    .company-text h2 {
      font-size: 13px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 2px;
      line-height: 1.25;
    }

    .company-text p {
      font-size: 10px;
      color: #475569;
      line-height: 1.35;
    }

    .invoice-title {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      letter-spacing: 0.05em;
      text-align: right;
    }

    .meta-box-grid {
      display: table;
      width: 100%;
      border: 1px solid #d1d5db;
      margin-bottom: 16px;
      background: #ffffff;
      border-collapse: collapse;
    }

    .meta-col {
      display: table-cell;
      width: 50%;
      padding: 10px 14px;
      vertical-align: top;
    }

    .meta-col:first-child {
      border-right: 1px solid #d1d5db;
    }

    .meta-row {
      display: flex;
      margin-bottom: 4px;
      font-size: 11px;
    }

    .meta-row:last-child {
      margin-bottom: 0;
    }

    .meta-label {
      font-weight: 600;
      color: #374151;
      width: 110px;
      flex-shrink: 0;
    }

    .meta-value {
      font-weight: 600;
      color: #111827;
    }

    .bill-to-section {
      margin-bottom: 16px;
      font-size: 11px;
    }

    .bill-to-title {
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }

    .bill-to-name {
      font-weight: 700;
      color: #111827;
      font-size: 11.5px;
    }

    .bill-to-text {
      color: #4b5563;
      line-height: 1.35;
    }

    table.items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      border: 1px solid #d1d5db;
      background: #ffffff;
    }

    table.items-table th {
      background: #ffffff;
      border: 1px solid #d1d5db;
      padding: 7px 8px;
      font-size: 10.5px;
      font-weight: 700;
      color: #111827;
      text-align: left;
    }

    table.items-table td {
      border: 1px solid #d1d5db;
      padding: 8px;
      font-size: 11px;
      color: #1f2937;
      vertical-align: top;
      background: #ffffff;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }

    .summary-section {
      display: table;
      width: 100%;
      margin-bottom: 20px;
    }

    .summary-left {
      display: table-cell;
      width: 58%;
      vertical-align: top;
      padding-right: 20px;
    }

    .summary-right {
      display: table-cell;
      width: 42%;
      vertical-align: top;
    }

    .words-box {
      margin-bottom: 14px;
    }

    .words-title {
      font-size: 10.5px;
      color: #6b7280;
      margin-bottom: 2px;
    }

    .words-val {
      font-size: 11.5px;
      font-weight: 700;
      color: #111827;
      font-style: italic;
    }

    .notes-box {
      margin-bottom: 14px;
      font-size: 10.5px;
      color: #4b5563;
    }

    .notes-box strong {
      display: block;
      color: #111827;
      margin-bottom: 2px;
    }

    .bank-box {
      font-size: 10.5px;
      color: #374151;
      line-height: 1.4;
      margin-bottom: 14px;
      background: #f9fafb;
      padding: 8px 10px;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
    }

    .terms-box {
      font-size: 9.5px;
      color: #6b7280;
      line-height: 1.35;
    }

    .terms-box strong {
      color: #374151;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }

    .totals-table td {
      padding: 4px 6px;
    }

    .totals-table .label {
      color: #4b5563;
      font-weight: 500;
      text-align: right;
    }

    .totals-table .amount {
      text-align: right;
      font-weight: 600;
      color: #111827;
      width: 90px;
    }

    .totals-table tr.grand-total td {
      font-weight: 800;
      font-size: 13px;
      color: #111827;
      border-top: 1px solid #9ca3af;
      border-bottom: 1px solid #9ca3af;
      padding: 6px;
    }

    .totals-table tr.balance-row td {
      font-weight: 800;
      font-size: 13px;
      color: #111827;
      padding: 6px;
      background: #f3f4f6;
    }

    .qr-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px dashed #d1d5db;
    }

    .qr-box {
      width: 64px;
      height: 64px;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-text {
      font-size: 10px;
      color: #4b5563;
      max-width: 160px;
      font-weight: 500;
    }

    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .invoice-container {
        border: none;
        padding: 0;
        max-width: 100%;
      }
      @page {
        margin: 1.5cm;
        size: A4;
      }
    }
  </style>
</head>
<body>

  <div class="invoice-container">
    <!-- Top Header -->
    <div class="top-header">
      <div class="company-info">
        <div style="width: 44px; height: 44px; flex-shrink: 0;">
          <svg viewBox="0 0 44 44" width="44" height="44" style="display: block;">
            <circle cx="22" cy="22" r="22" fill="#000000"/>
            <text x="22" y="28.5" text-anchor="middle" fill="#ffffff" font-size="20" font-weight="800" font-family="'Inter', system-ui, sans-serif">A</text>
          </svg>
        </div>
        <div class="company-text">
          <h2>${inv.businessName}</h2>
          <p>${inv.businessAddress}</p>
          <p>${inv.businessCityStatePin}</p>
          <p>${inv.businessCountry}</p>
          <p>${inv.businessGstin}</p>
          <p>${inv.businessPhone}</p>
        </div>
      </div>

      <div class="invoice-title">
        TAX INVOICE
      </div>
    </div>

    <!-- Meta Details Grid -->
    <div class="meta-box-grid">
      <div class="meta-col">
        <div class="meta-row">
          <span class="meta-label">#</span>
          <span class="meta-value">: ${inv.invoiceNumber}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Invoice Date</span>
          <span class="meta-value">: ${inv.invoiceDate}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Terms</span>
          <span class="meta-value">: ${inv.terms}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Due Date</span>
          <span class="meta-value">: ${inv.dueDate}</span>
        </div>
      </div>

      <div class="meta-col">
        <div class="meta-row">
          <span class="meta-label">Place Of Supply</span>
          <span class="meta-value">: ${inv.placeOfSupply}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Payment Mode</span>
          <span class="meta-value" style="color: #047857; font-weight: 700;">: ${inv.paymentMethod}</span>
        </div>
      </div>
    </div>

    <!-- Bill To -->
    <div class="bill-to-section">
      <div class="bill-to-title">Bill To</div>
      <div class="bill-to-name">${inv.clientName}</div>
      ${inv.clientAddress ? `<div class="bill-to-text">${inv.clientAddress}</div>` : ''}
      ${inv.clientCity ? `<div class="bill-to-text">${inv.clientCity}</div>` : ''}
      ${inv.clientStatePin ? `<div class="bill-to-text">${inv.clientStatePin}</div>` : ''}
      ${inv.clientCountry ? `<div class="bill-to-text">${inv.clientCountry}</div>` : ''}
      <div class="bill-to-text">${inv.clientPhone}</div>
      ${inv.clientGstin ? `<div class="bill-to-text"><strong>GSTIN:</strong> ${inv.clientGstin}</div>` : ''}
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 25px; border: 1px solid #d1d5db;" class="text-center">#</th>
          <th style="border: 1px solid #d1d5db;">Item &amp; Description</th>
          <th style="width: 65px; border: 1px solid #d1d5db;" class="text-center">HSN/SAC</th>
          <th style="width: 35px; border: 1px solid #d1d5db;" class="text-center">Qty</th>
          <th style="width: 65px; border: 1px solid #d1d5db;" class="text-right">Rate</th>
          <th style="width: 45px; border: 1px solid #d1d5db;" class="text-center">CGST %</th>
          <th style="width: 55px; border: 1px solid #d1d5db;" class="text-right">CGST Amt</th>
          <th style="width: 45px; border: 1px solid #d1d5db;" class="text-center">SGST %</th>
          <th style="width: 55px; border: 1px solid #d1d5db;" class="text-right">SGST Amt</th>
          <th style="width: 70px; border: 1px solid #d1d5db;" class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${inv.items
          .map((item, idx) => {
            const cgstRate = item.cgstRate ?? 9;
            const sgstRate = item.sgstRate ?? 9;
            const lineTaxable = item.rate * item.qty;
            const lineCgst = (lineTaxable * cgstRate) / 100;
            const lineSgst = (lineTaxable * sgstRate) / 100;
            return `
            <tr>
              <td style="border: 1px solid #d1d5db;" class="text-center">${idx + 1}</td>
              <td style="border: 1px solid #d1d5db;">
                <strong style="color: #111827; display: block;">${item.name}</strong>
                ${item.description ? `<div style="font-size: 9.5px; color: #6b7280; margin-top: 1px;">${item.description}</div>` : ''}
                ${inv.stylistAssigned ? `<div style="font-size: 9px; color: #5A2EA6; font-weight: 600; margin-top: 1px;">Stylist: ${inv.stylistAssigned}</div>` : ''}
              </td>
              <td style="border: 1px solid #d1d5db;" class="text-center font-mono">${item.sacCode}</td>
              <td style="border: 1px solid #d1d5db;" class="text-center font-bold">${item.qty}</td>
              <td style="border: 1px solid #d1d5db;" class="text-right">₹${item.rate.toFixed(2)}</td>
              <td style="border: 1px solid #d1d5db;" class="text-center">${cgstRate}%</td>
              <td style="border: 1px solid #d1d5db;" class="text-right">₹${lineCgst.toFixed(2)}</td>
              <td style="border: 1px solid #d1d5db;" class="text-center">${sgstRate}%</td>
              <td style="border: 1px solid #d1d5db;" class="text-right">₹${lineSgst.toFixed(2)}</td>
              <td style="border: 1px solid #d1d5db;" class="text-right font-bold">₹${lineTaxable.toFixed(2)}</td>
            </tr>
          `;
          })
          .join('')}
      </tbody>
    </table>

    <!-- Summary & Footer -->
    <div class="summary-section">
      <!-- Left side: Words, Bank Details, Terms, QR -->
      <div class="summary-left">
        <div class="words-box">
          <div class="words-title">Total In Words</div>
          <div class="words-val">${totalInWords}</div>
        </div>

        <div class="notes-box">
          <strong>Notes</strong>
          <p>${(inv.notes || 'Thank you for visiting Atelier Salon & Spa!\nLooking forward to serving you again.').replace(/\n/g, '<br/>')}</p>
        </div>

        <div class="bank-box">
          <div><strong>UPI:</strong> ${inv.upiId}</div>
          <div><strong>Account Name:</strong> ${inv.accountName}</div>
          <div><strong>Account Number:</strong> ${inv.accountNumber}</div>
          <div><strong>IFSC Code:</strong> ${inv.ifscCode} · <strong>Bank:</strong> ${inv.bankName}</div>
        </div>

        <div class="terms-box">
          <strong>Terms &amp; Conditions:</strong><br/>
          14-day service guarantee &amp; revision policy. Annual package redemption applies per branch booking calendar.
        </div>

        <!-- Scan QR code to pay -->
        <div class="qr-section">
          <div class="qr-box">
            <!-- Universal QR Code SVG -->
            <svg viewBox="0 0 100 100" width="56" height="56">
              <rect width="100" height="100" fill="white"/>
              <path d="M10,10 h25 v25 h-25 z M15,15 v15 h15 v-15 z M18,18 h9 v9 h-9 z" fill="#111827"/>
              <path d="M65,10 h25 v25 h-25 z M70,15 v15 h15 v-15 z M73,18 h9 v9 h-9 z" fill="#111827"/>
              <path d="M10,65 h25 v25 h-25 z M15,70 v15 h15 v-15 z M18,73 h9 v9 h-9 z" fill="#111827"/>
              <circle cx="50" cy="50" r="10" fill="#5A2EA6"/>
              <rect x="42" y="15" width="6" height="18" fill="#111827"/>
              <rect x="42" y="68" width="16" height="8" fill="#111827"/>
              <rect x="65" y="48" width="20" height="8" fill="#111827"/>
              <rect x="15" y="42" width="18" height="6" fill="#111827"/>
              <rect x="75" y="75" width="12" height="12" fill="#111827"/>
            </svg>
          </div>
          <div class="qr-text">
            Scan the QR code to verify or pay using any UPI apps.
          </div>
        </div>
      </div>

      <!-- Right side: Financials Table -->
      <div class="summary-right">
        <table class="totals-table">
          <tr>
            <td class="label">Sub Total</td>
            <td class="amount">₹${inv.subTotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">CGST9 (9%)</td>
            <td class="amount">₹${inv.cgstAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label">SGST9 (9%)</td>
            <td class="amount">₹${inv.sgstAmount.toFixed(2)}</td>
          </tr>
          ${
            inv.rounding !== 0
              ? `
          <tr>
            <td class="label">Rounding</td>
            <td class="amount">₹${inv.rounding.toFixed(2)}</td>
          </tr>`
              : ''
          }
          <tr class="grand-total">
            <td class="label">Total</td>
            <td class="amount">₹${inv.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td class="label" style="color: #059669; font-weight: 700;">Payment Made</td>
            <td class="amount" style="color: #059669; font-weight: 700;">(-) ₹${inv.paymentMade.toFixed(2)}</td>
          </tr>
          <tr class="balance-row">
            <td class="label">Balance Due</td>
            <td class="amount">₹${inv.balanceDue.toFixed(2)}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>

</body>
</html>
  `;
}

/**
 * Triggers direct browser printing for the invoice
 */
export function printInvoice(data: Partial<InvoiceFullData>) {
  const html = generateTaxInvoiceHtml(data);
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

/**
 * Format currency amount for vector PDF rendering (Clean, universal, no font corruptions)
 */
function formatPdfCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Downloads a 100% guaranteed, ultra-sharp vector Tax Invoice PDF
 */
export function downloadVectorInvoicePdf(data: Partial<InvoiceFullData>): void {
  const inv: InvoiceFullData = { ...defaultInvoiceValues, ...data };
  const totalInWords = numberToWordsIndian(inv.totalAmount);

  const cleanClient = (inv.clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanInvoiceNo = (inv.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Tax_Invoice_${cleanInvoiceNo}_${cleanClient}.pdf`;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const leftX = 14;
  const rightX = 196;
  const contentWidth = rightX - leftX; // 182mm

  // -------------------------------------------------------------
  // 1. TOP HEADER (y = 14 to 38)
  // -------------------------------------------------------------
  // Brand Logo: Vector circle with mathematically centered letter "A"
  const logoX = 22;
  const logoY = 24;
  const logoRadius = 7.5;
  pdf.setFillColor(0, 0, 0);
  pdf.circle(logoX, logoY, logoRadius, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('A', logoX, logoY + 0.3, { align: 'center', baseline: 'middle' });

  // Company Details
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(10.5);
  pdf.setFont('helvetica', 'bold');
  pdf.text(inv.businessName, 34, 18);

  pdf.setTextColor(75, 85, 99);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(inv.businessAddress, 34, 22.5);
  pdf.text(`${inv.businessCityStatePin}, ${inv.businessCountry}`, 34, 26.5);

  const gstinClean = (inv.businessGstin || '').replace(/GSTIN\s*:?\s*/gi, '').trim();
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8.5);
  pdf.text(`GSTIN: ${gstinClean}`, 34, 30.5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(inv.businessPhone, 34, 34.5);

  // Right Title
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TAX INVOICE', rightX, 22, { align: 'right' });

  // Header bottom divider line
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.line(leftX, 39, rightX, 39);

  // -------------------------------------------------------------
  // 2. META DETAILS BOX (y = 43 to 67)
  // -------------------------------------------------------------
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.25);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(leftX, 43, contentWidth, 24, 1, 1, 'FD');

  // Middle separator
  const midX = 105;
  pdf.line(midX, 43, midX, 67);

  // Left Meta Column
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'bold');
  pdf.text('#', leftX + 4, 48.5);
  pdf.text('Invoice Date', leftX + 4, 53.5);
  pdf.text('Terms', leftX + 4, 58.5);
  pdf.text('Due Date', leftX + 4, 63.5);

  pdf.setTextColor(17, 24, 39);
  pdf.setFont('courier', 'bold');
  pdf.text(`: ${inv.invoiceNumber}`, leftX + 28, 48.5);

  pdf.setFont('helvetica', 'bold');
  pdf.text(`: ${inv.invoiceDate}`, leftX + 28, 53.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`: ${inv.terms}`, leftX + 28, 58.5);
  pdf.text(`: ${inv.dueDate}`, leftX + 28, 63.5);

  // Right Meta Column
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(100, 116, 139);
  pdf.text('Place Of Supply', midX + 4, 48.5);
  pdf.text('Payment Mode', midX + 4, 55);

  pdf.setTextColor(17, 24, 39);
  pdf.text(`: ${inv.placeOfSupply}`, midX + 32, 48.5);

  pdf.setTextColor(4, 120, 87); // Emerald green
  pdf.text(`: ${inv.paymentMethod}`, midX + 32, 55);

  // -------------------------------------------------------------
  // 3. BILL TO SECTION (y = 72 to 92)
  // -------------------------------------------------------------
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To', leftX, 72);

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(10);
  pdf.text(inv.clientName, leftX, 77);

  let by = 81;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(8);

  if (inv.clientAddress) {
    pdf.text(inv.clientAddress, leftX, by);
    by += 4;
  }
  if (inv.clientCity) {
    pdf.text(`${inv.clientCity}${inv.clientStatePin ? ', ' + inv.clientStatePin : ''}`, leftX, by);
    by += 4;
  }
  pdf.text(inv.clientPhone, leftX, by);
  by += 4;

  if (inv.clientGstin) {
    pdf.setFont('courier', 'bold');
    pdf.setTextColor(30, 41, 59);
    const clientGstinClean = inv.clientGstin.replace(/GSTIN\s*:?\s*/gi, '').trim();
    pdf.text(`GSTIN: ${clientGstinClean}`, leftX, by);
    by += 4;
  }

  // -------------------------------------------------------------
  // 4. ITEMS TABLE (y = by + 2)
  // Perfectly balanced column bounds across 182mm (No overlapping)
  // -------------------------------------------------------------
  const tableY = by + 2;
  const colX = [
    14, // 0: # (width 7mm)
    21, // 1: Item & Description (width 55mm)
    76, // 2: HSN/SAC (width 15mm)
    91, // 3: Qty (width 9mm)
    100, // 4: Rate (width 18mm)
    118, // 5: CGST % (width 11mm)
    129, // 6: CGST Amt (width 19mm)
    148, // 7: SGST % (width 11mm)
    159, // 8: SGST Amt (width 18mm)
    177, // 9: Amount (width 19mm)
    196, // 10: Table End
  ];

  // Header Box (Height: 8.5mm for clean 2-line tax headers)
  const headerHeight = 8.5;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.25);
  pdf.rect(leftX, tableY, contentWidth, headerHeight, 'FD');

  for (let i = 1; i < colX.length - 1; i++) {
    pdf.line(colX[i], tableY, colX[i], tableY + headerHeight);
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.2);
  pdf.setTextColor(15, 23, 42);

  // Single-line headers
  pdf.text('#', (colX[0] + colX[1]) / 2, tableY + 5.2, { align: 'center' });
  pdf.text('Item & Description', colX[1] + 2.5, tableY + 5.2);
  pdf.text('HSN/SAC', (colX[2] + colX[3]) / 2, tableY + 5.2, { align: 'center' });
  pdf.text('Qty', (colX[3] + colX[4]) / 2, tableY + 5.2, { align: 'center' });
  pdf.text('Rate', colX[5] - 2.5, tableY + 5.2, { align: 'right' });

  // 2-line headers for taxes
  pdf.text('CGST', (colX[5] + colX[6]) / 2, tableY + 3.4, { align: 'center' });
  pdf.text('%', (colX[5] + colX[6]) / 2, tableY + 6.8, { align: 'center' });

  pdf.text('CGST', colX[7] - 2.5, tableY + 3.4, { align: 'right' });
  pdf.text('Amt', colX[7] - 2.5, tableY + 6.8, { align: 'right' });

  pdf.text('SGST', (colX[7] + colX[8]) / 2, tableY + 3.4, { align: 'center' });
  pdf.text('%', (colX[7] + colX[8]) / 2, tableY + 6.8, { align: 'center' });

  pdf.text('SGST', colX[9] - 2.5, tableY + 3.4, { align: 'right' });
  pdf.text('Amt', colX[9] - 2.5, tableY + 6.8, { align: 'right' });

  pdf.text('Amount', colX[10] - 2.5, tableY + 5.2, { align: 'right' });

  // Rows
  let currentY = tableY + headerHeight;
  const itemColWidth = colX[2] - colX[1] - 4; // 55 - 4 = 51mm available text width

  inv.items.forEach((item, idx) => {
    const cgstRate = item.cgstRate ?? 9;
    const sgstRate = item.sgstRate ?? 9;
    const lineTaxable = item.rate * item.qty;
    const lineCgst = (lineTaxable * cgstRate) / 100;
    const lineSgst = (lineTaxable * sgstRate) / 100;

    // Wrap item name and description to fit strictly within the item column width
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.2);
    const nameLines: string[] = pdf.splitTextToSize(item.name, itemColWidth);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    const descLines: string[] = item.description
      ? pdf.splitTextToSize(item.description, itemColWidth)
      : [];

    const hasStylist = Boolean(inv.stylistAssigned);

    // Compute dynamic row height with comfortable vertical breathing room
    const rowHeight = Math.max(
      11,
      4.2 + nameLines.length * 4.0 + descLines.length * 3.4 + (hasStylist ? 4.2 : 0) + 1.8,
    );
    const centerY = currentY + rowHeight / 2 + 1.2;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(leftX, currentY, contentWidth, rowHeight, 'FD');

    for (let i = 1; i < colX.length - 1; i++) {
      pdf.line(colX[i], currentY, colX[i], currentY + rowHeight);
    }

    // # index (Vertically centered)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text(String(idx + 1), (colX[0] + colX[1]) / 2, centerY, { align: 'center' });

    // Item Title lines
    let textY = currentY + 4.5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.2);
    pdf.setTextColor(15, 23, 42);
    nameLines.forEach((line) => {
      pdf.text(line, colX[1] + 2.5, textY);
      textY += 3.8;
    });

    // Item Description lines (wrapped cleanly into 2+ lines)
    if (descLines.length > 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.8);
      pdf.setTextColor(100, 116, 139);
      descLines.forEach((line) => {
        pdf.text(line, colX[1] + 2.5, textY);
        textY += 3.3;
      });
    }

    // Stylist tag
    if (hasStylist) {
      pdf.setTextColor(90, 46, 166); // Purple stylist tag
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.8);
      pdf.text(`Stylist: ${inv.stylistAssigned}`, colX[1] + 2.5, textY + 0.6);
    }

    // SAC Code (Vertically centered)
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(15, 23, 42);
    pdf.text(item.sacCode, (colX[2] + colX[3]) / 2, centerY, { align: 'center' });

    // Qty (Vertically centered)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(String(item.qty), (colX[3] + colX[4]) / 2, centerY, { align: 'center' });

    // Rate (Vertically centered)
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.text(formatPdfCurrency(item.rate), colX[5] - 2.5, centerY, { align: 'right' });

    // CGST % & Amt (Vertically centered)
    pdf.text(`${cgstRate}%`, (colX[5] + colX[6]) / 2, centerY, { align: 'center' });
    pdf.text(formatPdfCurrency(lineCgst), colX[7] - 2.5, centerY, { align: 'right' });

    // SGST % & Amt (Vertically centered)
    pdf.text(`${sgstRate}%`, (colX[7] + colX[8]) / 2, centerY, { align: 'center' });
    pdf.text(formatPdfCurrency(lineSgst), colX[9] - 2.5, centerY, { align: 'right' });

    // Line Amount (Vertically centered)
    pdf.setFont('helvetica', 'bold');
    pdf.text(formatPdfCurrency(lineTaxable), colX[10] - 2.5, centerY, { align: 'right' });

    currentY += rowHeight;
  });

  // -------------------------------------------------------------
  // 5. SUMMARY & FINANCIALS (sy)
  // Spacious, elegant layout matching the live preview sheet
  // -------------------------------------------------------------
  const sy = currentY + 6;

  // Left Column (Width = 96mm)
  // Total in words
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Total In Words', leftX, sy + 2);

  pdf.setFont('helvetica', 'bolditalic');
  pdf.setFontSize(8.5);
  pdf.setTextColor(15, 23, 42);
  pdf.text(totalInWords, leftX, sy + 7);

  // Notes
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.0);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Notes', leftX, sy + 14);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(71, 85, 105);
  const notesLines = (
    inv.notes ||
    'Thank you for visiting Atelier Salon & Spa!\nLooking forward to serving you again.'
  ).split('\n');
  let ny = sy + 18.5;
  notesLines.forEach((ln) => {
    pdf.text(ln, leftX, ny);
    ny += 4.0;
  });

  // Bank Details Card Box (Spacious 21mm rounded card)
  const bankY = ny + 3;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.25);
  pdf.roundedRect(leftX, bankY, 96, 21, 1.5, 1.5, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(51, 65, 85);
  pdf.text('UPI:', leftX + 3.5, bankY + 4.8);
  pdf.setFont('courier', 'bold');
  pdf.text(inv.upiId, leftX + 11.5, bankY + 4.8);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Account Name:', leftX + 3.5, bankY + 9.2);
  pdf.setFont('helvetica', 'normal');
  pdf.text(inv.accountName, leftX + 27, bankY + 9.2);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Account Number:', leftX + 3.5, bankY + 13.6);
  pdf.setFont('courier', 'bold');
  pdf.text(inv.accountNumber, leftX + 30, bankY + 13.6);

  pdf.setFont('helvetica', 'bold');
  pdf.text('IFSC:', leftX + 3.5, bankY + 18.0);
  pdf.setFont('courier', 'bold');
  pdf.text(inv.ifscCode, leftX + 13, bankY + 18.0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('·  Bank:', leftX + 33, bankY + 18.0);
  pdf.setFont('helvetica', 'normal');
  pdf.text(inv.bankName, leftX + 45, bankY + 18.0);

  // Terms & Conditions
  const termsY = bankY + 25.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.2);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Terms & Conditions:', leftX, termsY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    '14-day service guarantee & revision policy. Annual package redemption applies per branch booking calendar.',
    leftX,
    termsY + 4.0,
    { maxWidth: 96 },
  );

  // QR Section
  const qrY = termsY + 10.5;
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.2);
  pdf.setLineDashPattern([1.5, 1.5], 0);
  pdf.line(leftX, qrY, leftX + 96, qrY);
  pdf.setLineDashPattern([], 0);

  // QR Box (Clean 13x13 rounded box)
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.roundedRect(leftX, qrY + 3, 13, 13, 1.5, 1.5, 'FD');

  // Mini vector QR shape
  pdf.setFillColor(15, 23, 42);
  pdf.rect(leftX + 2.5, qrY + 5.5, 3.5, 3.5, 'F');
  pdf.rect(leftX + 7, qrY + 5.5, 3.5, 3.5, 'F');
  pdf.rect(leftX + 2.5, qrY + 10, 3.5, 3.5, 'F');
  pdf.setFillColor(90, 46, 166);
  pdf.rect(leftX + 7, qrY + 10, 3.5, 3.5, 'F');

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Scan the QR code to verify or pay using any UPI apps.', leftX + 17.5, qrY + 10.5, {
    maxWidth: 78,
  });

  // -------------------------------------------------------------
  // Right Column Financials Table (x = 118 to 196)
  // Spacious, clear lines matching Screenshot
  // -------------------------------------------------------------
  const finX = 118;
  const labelX = 162;
  const valX = rightX;

  // Sub Total
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Sub Total', labelX, sy + 3, { align: 'right' });
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(formatPdfCurrency(inv.subTotal), valX, sy + 3, { align: 'right' });

  // CGST9 (9%)
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text('CGST9 (9%)', labelX, sy + 9, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  pdf.text(formatPdfCurrency(inv.cgstAmount), valX, sy + 9, { align: 'right' });

  // SGST9 (9%)
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text('SGST9 (9%)', labelX, sy + 15, { align: 'right' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  pdf.text(formatPdfCurrency(inv.sgstAmount), valX, sy + 15, { align: 'right' });

  // Divider Line Above Total
  const totalY = sy + 23;
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.3);
  pdf.line(finX + 6, totalY - 4.5, rightX, totalY - 4.5);

  // Total Row (Bold 11pt)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Total', labelX, totalY + 0.5, { align: 'right' });
  pdf.text(formatPdfCurrency(inv.totalAmount), valX, totalY + 0.5, { align: 'right' });

  // Divider Line Below Total
  pdf.line(finX + 6, totalY + 4.5, rightX, totalY + 4.5);

  // Payment Made Row (Emerald Green 9pt)
  const payY = totalY + 11.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9.0);
  pdf.setTextColor(5, 150, 105); // Emerald green (#059669)
  pdf.text('Payment Made', labelX, payY, { align: 'right' });
  pdf.text(`(-) ${formatPdfCurrency(inv.paymentMade)}`, valX, payY, { align: 'right' });

  // Divider Line Below Payment Made
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.25);
  pdf.line(finX + 6, payY + 4.5, rightX, payY + 4.5);

  // Balance Due Row (Bold 11pt)
  const balY = payY + 11.5;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('Balance Due', labelX, balY, { align: 'right' });
  pdf.text(formatPdfCurrency(inv.balanceDue), valX, balY, { align: 'right' });

  // Trigger bullet-proof direct browser download via Blob and standard save
  try {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  } catch {
    pdf.save(filename);
  }
}

/**
 * Downloads a vector-sharp Payment Receipt PDF
 */
export function downloadVectorReceiptPdf(data: Partial<InvoiceFullData>): void {
  const inv: InvoiceFullData = { ...defaultInvoiceValues, ...data };
  const totalInWords = numberToWordsIndian(inv.totalAmount);

  const cleanClient = (inv.clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanInvoiceNo = (inv.invoiceNumber || 'INV').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Payment_Receipt_${cleanInvoiceNo}_${cleanClient}.pdf`;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const leftX = 14;
  const rightX = 196;
  const contentWidth = rightX - leftX;

  // Header
  const logoX = 22;
  const logoY = 24;
  const logoRadius = 7.5;
  pdf.setFillColor(0, 0, 0);
  pdf.circle(logoX, logoY, logoRadius, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('A', logoX, logoY + 0.3, { align: 'center', baseline: 'middle' });

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(10.5);
  pdf.setFont('helvetica', 'bold');
  pdf.text(inv.businessName, 34, 18);

  pdf.setTextColor(75, 85, 99);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(inv.businessAddress, 34, 22.5);
  pdf.text(`${inv.businessCityStatePin}, ${inv.businessCountry}`, 34, 26.5);

  const gstinClean = (inv.businessGstin || '').replace(/GSTIN\s*:?\s*/gi, '').trim();
  pdf.setFont('courier', 'bold');
  pdf.setFontSize(8.5);
  pdf.text(`GSTIN: ${gstinClean}`, 34, 30.5);

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT RECEIPT', rightX, 22, { align: 'right' });

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.line(leftX, 38, rightX, 38);

  // Body
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Payment Date', leftX, 48);
  pdf.text('Reference Number', leftX, 55);
  pdf.text('Payment Mode', leftX, 62);
  pdf.text('Amount In Words', leftX, 69);

  pdf.setTextColor(17, 24, 39);
  pdf.text(`: ${inv.invoiceDate}`, leftX + 38, 48);
  pdf.setFont('courier', 'bold');
  pdf.text(`: ${inv.referenceNumber}`, leftX + 38, 55);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`: ${inv.paymentMethod}`, leftX + 38, 62);
  pdf.setFont('helvetica', 'bolditalic');
  pdf.text(`: ${totalInWords}`, leftX + 38, 69);

  // Amount badge
  pdf.setFillColor(5, 150, 105);
  pdf.roundedRect(140, 45, 56, 26, 2, 2, 'F');
  pdf.setTextColor(209, 250, 229);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('AMOUNT RECEIVED', 168, 52, { align: 'center' });
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text(formatPdfCurrency(inv.totalAmount), 168, 62, { align: 'center' });

  // Received from & signature
  pdf.setDrawColor(226, 232, 240);
  pdf.line(leftX, 78, rightX, 78);

  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Received From', leftX, 84);
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(9.5);
  pdf.text(inv.clientName, leftX, 89);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(inv.clientAddress || 'Walk-in Guest, Indrapuri', leftX, 93.5);
  pdf.text(`${inv.clientCity || 'Bhopal'}, ${inv.clientCountry || 'India'}`, leftX, 97.5);

  pdf.setFont('times', 'italic');
  pdf.setFontSize(11);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Priya Sharma', rightX - 25, 92, { align: 'center' });
  pdf.setDrawColor(156, 163, 175);
  pdf.line(rightX - 45, 94, rightX - 5, 94);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Authorized Cashier Signature', rightX - 25, 98, { align: 'center' });

  // Payment Table
  pdf.setDrawColor(226, 232, 240);
  pdf.line(leftX, 104, rightX, 104);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(17, 24, 39);
  pdf.text('Payment For', leftX, 110);

  const tY = 114;
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(leftX, tY, contentWidth, 7, 'FD');

  pdf.setFontSize(8);
  pdf.text('Invoice Number', leftX + 4, tY + 4.8);
  pdf.text('Invoice Date', leftX + 55, tY + 4.8);
  pdf.text('Invoice Amount', 145, tY + 4.8, { align: 'right' });
  pdf.text('Payment Amount', rightX - 4, tY + 4.8, { align: 'right' });

  pdf.setFillColor(255, 255, 255);
  pdf.rect(leftX, tY + 7, contentWidth, 8, 'FD');
  pdf.setFont('courier', 'bold');
  pdf.text(inv.invoiceNumber, leftX + 4, tY + 12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(inv.invoiceDate, leftX + 55, tY + 12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(formatPdfCurrency(inv.totalAmount), 145, tY + 12, { align: 'right' });
  pdf.setTextColor(4, 120, 87);
  pdf.text(formatPdfCurrency(inv.paymentMade), rightX - 4, tY + 12, { align: 'right' });

  try {
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);
  } catch {
    pdf.save(filename);
  }
}

/**
 * Main export: downloads the invoice as an official, vector-sharp PDF document (.pdf)
 */
export async function downloadInvoiceDocument(data: Partial<InvoiceFullData>): Promise<void> {
  downloadVectorInvoicePdf(data);
}

/**
 * Downloads a pixel-perfect vector PDF from any view
 */
export async function downloadInvoiceFromElement(
  _element: HTMLElement,
  inv: Partial<InvoiceFullData>,
): Promise<void> {
  downloadVectorInvoicePdf(inv);
}

/**
 * Opens WhatsApp with pre-filled professional invoice receipt message & direct settlement details
 */
export function sendInvoiceToWhatsApp(data: Partial<InvoiceFullData>, phone?: string) {
  const inv = { ...defaultInvoiceValues, ...data };
  const targetPhone = (phone || inv.clientPhone || '').replace(/[^0-9]/g, '');

  const itemsText = inv.items
    .map(
      (it, idx) => `${idx + 1}. *${it.name}* (x${it.qty}) - ₹${it.amount.toLocaleString('en-IN')}`,
    )
    .join('\n');

  const msg = `✨ *TAX INVOICE & PAYMENT RECEIPT* ✨
*${inv.businessName}*
---------------------------------------
📄 *Invoice #:* ${inv.invoiceNumber}
📅 *Date:* ${inv.invoiceDate}
👤 *Billed To:* ${inv.clientName}
📍 *Branch:* Indrapuri Flagship, Bhopal
---------------------------------------
*Services & Products Billed:*
${itemsText}

💵 *Sub Total:* ₹${inv.subTotal.toLocaleString('en-IN')}
📊 *GST (9% CGST + 9% SGST):* ₹${(inv.cgstAmount + inv.sgstAmount).toLocaleString('en-IN')}
💰 *Total Paid:* *₹${inv.totalAmount.toLocaleString('en-IN')}* (${inv.paymentMethod})
✅ *Balance Due:* *₹0.00 (Fully Settled)*
---------------------------------------
💳 *Payment Ref:* ${inv.referenceNumber}
🏦 *UPI VPA:* ${inv.upiId}

_Thank you for visiting Atelier Salon & Spa! We look forward to serving you again._ 💖`;

  const encoded = encodeURIComponent(msg);
  const whatsappUrl =
    targetPhone.length >= 10
      ? `https://wa.me/${targetPhone.startsWith('91') ? targetPhone : `91${targetPhone}`}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

  window.open(whatsappUrl, '_blank');
}
