import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { ReportItem } from '../../admin/pages/reports/EodShiftClosuresTab';

export async function generateBranchReportPDF(report: ReportItem): Promise<void> {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Branch Audit Report - ${report.id}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1a0b2e;
      background: #ffffff;
      padding: 40px;
      line-height: 1.5;
      font-size: 13px;
    }

    .report-card {
      max-width: 850px;
      margin: 0 auto;
      border: 1px solid #e2d9f3;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(90, 46, 166, 0.06);
    }

    .header-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #F8F5FF;
      color: #5A2EA6;
      border: 1px solid rgba(90, 46, 166, 0.2);
      border-radius: 9999px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f0edf6;
      padding-bottom: 20px;
      margin-bottom: 28px;
    }

    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #3b1c71;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .brand-sub {
      font-size: 12px;
      color: #6d5b73;
      margin-top: 4px;
    }

    .report-badge {
      text-align: right;
    }

    .report-id {
      font-size: 24px;
      font-weight: 700;
      color: #1a0b2e;
      font-family: monospace;
    }

    .status-stamp {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      margin-top: 6px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      background: #fbf9ff;
      border: 1px solid #efe8f8;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }

    .meta-box h5 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #5A2EA6;
      margin-bottom: 4px;
      font-weight: 700;
    }

    .meta-box p {
      font-size: 12.5px;
      font-weight: 700;
      color: #1a0b2e;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #eae1f5;
    }

    th {
      background: #f6f0ff;
      color: #5A2EA6;
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eae1f5;
    }

    td {
      padding: 14px 16px;
      font-size: 12.5px;
      border-bottom: 1px solid #f2ecfb;
      color: #3b2c4e;
    }

    .text-right { text-align: right; }
    .font-mono { font-family: monospace; font-weight: 700; }

    .notes-box {
      background: #fbf9ff;
      border: 1px solid #eae1f5;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 28px;
    }

    .notes-box h4 {
      font-size: 11px;
      color: #5A2EA6;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .notes-box p {
      font-size: 12px;
      color: #3b2c4e;
    }

    .footer {
      border-top: 1px solid #f0edf6;
      padding-top: 16px;
      font-size: 10.5px;
      color: #88789c;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="report-card">
    <div class="header-badge">DIGIFLEX SALON SAAS • BRANCH MANAGER AUDIT REGISTER</div>

    <div class="header-flex">
      <div>
        <h1 class="brand-title">${report.name}</h1>
        <div class="brand-sub">Branch: <strong>${report.branch}</strong> • Shift: <strong>${report.shift}</strong></div>
      </div>
      <div class="report-badge">
        <div class="report-id">${report.id}</div>
        <div><span class="status-stamp">${report.status}</span></div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-box">
        <h5>Date Compiled</h5>
        <p>${report.date}</p>
      </div>
      <div class="meta-box">
        <h5>Compiler</h5>
        <p>${report.author}</p>
      </div>
      <div class="meta-box">
        <h5>Category Scope</h5>
        <p>${report.category}</p>
      </div>
      <div class="meta-box">
        <h5>Ledger Lock State</h5>
        <p>Locked & Audited</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Financial Register Metric</th>
          <th class="text-right">System Expected</th>
          <th class="text-right">Actual Counted / Settled</th>
          <th class="text-right">Variance / Ref No.</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Cash Drawer Collection (₹)</strong></td>
          <td class="text-right font-mono">₹${report.totals.expectedCash.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">₹${report.totals.actualCash.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">₹${report.totals.cashVariance}</td>
        </tr>
        <tr>
          <td><strong>UPI & QR Gateway Collection (₹)</strong></td>
          <td class="text-right font-mono">₹${report.totals.upiAmount.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">₹${report.totals.upiAmount.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">Reconciled</td>
        </tr>
        <tr>
          <td><strong>Card / EDC POS Terminal (₹)</strong></td>
          <td class="text-right font-mono">₹${report.totals.cardAmount.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">₹${report.totals.cardAmount.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">${report.totals.posRefNo}</td>
        </tr>
        ${report.totals.homeServiceAmount
      ? `
        <tr>
          <td><strong>Home Service Doorstep Visits (₹)</strong></td>
          <td class="text-right font-mono">₹${report.totals.homeServiceAmount.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">₹${report.totals.homeServiceAmount.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">Doorstep Reconciled</td>
        </tr>
        `
      : ''
    }
        <tr>
          <td><strong>Staff Gratuity / Tips Tally (₹)</strong></td>
          <td class="text-right font-mono">₹${report.totals.totalTips.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">₹${report.totals.totalTips.toLocaleString('en-IN')}</td>
          <td class="text-right font-mono">Allocated</td>
        </tr>
        <tr style="background:#f8f5ff;">
          <td><strong style="color:#5A2EA6;">TOTAL NET BRANCH REVENUE</strong></td>
          <td class="text-right font-mono" colSpan="3"><strong style="color:#5A2EA6; font-size:15px;">₹${report.totals.totalNetRevenue.toLocaleString('en-IN')}</strong></td>
        </tr>
      </tbody>
    </table>

    ${report.notes
      ? `
    <div class="notes-box">
      <h4>Manager Discrepancy & Audit Remarks</h4>
      <p>${report.notes}</p>
    </div>
    `
      : ''
    }

    <div class="footer">
      <span>Computer-generated audit document issued by   Salon & Spa SaaS.</span>
      <span>Compiler Signature: ${report.author}</span>
    </div>
  </div>
</body>
</html>
  `;

  // Create offscreen container for html2canvas rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '850px';
  container.style.zIndex = '-1000';
  container.style.background = '#ffffff';

  const bodyContentMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const innerHtml = bodyContentMatch ? bodyContentMatch[1] : htmlContent;
  container.innerHTML = innerHtml;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Branch_Audit_Report_${report.id}.pdf`);
  } catch (err) {
    console.error('Error generating PDF report, printing instead', err);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
