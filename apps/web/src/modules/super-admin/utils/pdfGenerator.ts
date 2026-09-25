export interface InvoiceData {
  invoiceId: string;
  salon: string;
  amount: string;
  status: string;
  date: string;
  billingAddress?: string;
  gstin?: string;
  items?: { description: string; qty: number; rate: number; total: number }[];
  subtotal?: number;
  tax?: number;
  total?: number;
}

export function generateInvoicePDF(invoice: InvoiceData) {
  const subtotalVal =
    invoice.subtotal || Number.parseFloat(invoice.amount.replace(/[^0-9.]/g, '')) || 12500;
  const taxVal = invoice.tax || Math.round(subtotalVal * 0.18);
  const totalVal = invoice.total || subtotalVal + taxVal;
  const items = invoice.items || [
    {
      description: `Subscription Plan Renewal (${invoice.salon})`,
      qty: 1,
      rate: subtotalVal,
      total: subtotalVal,
    },
  ];

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${invoice.invoiceId}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 40px;
      background: #fff;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e2d9f3;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(90, 46, 166, 0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f0edf6;
      padding-bottom: 24px;
      margin-bottom: 30px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #5A2EA6;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 12px;
      color: #88789c;
      margin-top: 4px;
    }
    .invoice-badge {
      text-align: right;
    }
    .inv-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f142e;
      margin: 0;
    }
    .inv-meta {
      font-size: 13px;
      color: #6d5b73;
      margin-top: 6px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .meta-box h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #5A2EA6;
      margin: 0 0 8px 0;
    }
    .meta-box p {
      margin: 0;
      font-size: 13px;
      line-height: 1.6;
      color: #332640;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th {
      background: #f8f5ff;
      color: #5A2EA6;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e5daff;
    }
    td {
      padding: 14px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f3eefe;
      color: #433352;
    }
    .text-right { text-align: right; }
    .totals {
      width: 300px;
      margin-left: auto;
      margin-bottom: 30px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
      color: #554466;
    }
    .totals-row.grand {
      border-top: 2px solid #5A2EA6;
      font-size: 16px;
      font-weight: 700;
      color: #5A2EA6;
      padding-top: 12px;
      margin-top: 6px;
    }
    .status-stamp {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      background: ${invoice.status === 'Paid' ? '#d1fae5' : '#fef3c7'};
      color: ${invoice.status === 'Paid' ? '#065f46' : '#92400e'};
    }
    .footer {
      border-top: 1px solid #f0edf6;
      padding-top: 20px;
      font-size: 11px;
      color: #9382a6;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <h1 class="brand-title">  Salon & Spa SaaS</h1>
        <div class="brand-sub">Centralized Super Admin Operations • Global Multi-Tenant Billing</div>
      </div>
      <div class="invoice-badge">
        <div class="inv-title">TAX INVOICE</div>
        <div class="inv-meta"><strong>#${invoice.invoiceId}</strong></div>
        <div style="margin-top:8px;"><span class="status-stamp">${invoice.status}</span></div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-box">
        <h4>Billed To (Tenant)</h4>
        <p><strong>${invoice.salon}</strong></p>
        <p>${invoice.billingAddress || 'Main Branch Operations Center'}</p>
        <p>GSTIN: ${invoice.gstin || '23AAAAA0000A1Z5'}</p>
      </div>
      <div class="meta-box">
        <h4>Invoice Details</h4>
        <p>Issue Date: <strong>${invoice.date}</strong></p>
        <p>Due Date: <strong>15 Days from Issue</strong></p>
        <p>Payment Mode: <strong>UPI / Bank Transfer / Auto-Debit</strong></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Rate</th>
          <th class="text-right">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items
      .map(
        (item) => `
          <tr>
            <td><strong>${item.description}</strong></td>
            <td class="text-right">${item.qty}</td>
            <td class="text-right">₹${item.rate.toLocaleString('en-IN')}</td>
            <td class="text-right"><strong>₹${item.total.toLocaleString('en-IN')}</strong></td>
          </tr>
        `,
      )
      .join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal:</span>
        <span>₹${subtotalVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row">
        <span>GST (18%):</span>
        <span>₹${taxVal.toLocaleString('en-IN')}</span>
      </div>
      <div class="totals-row grand">
        <span>Total Payable:</span>
        <span>₹${totalVal.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div class="footer">
      This is a computer-generated tax invoice issued by   Salon Platform Operations.
    </div>
  </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  } else {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
