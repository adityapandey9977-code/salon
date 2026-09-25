import nodemailer from 'nodemailer';
import { config } from '../../config';
export class EmailService {
    transporter = null;
    constructor() {
        this.initTransporter();
    }
    initTransporter() {
        try {
            this.transporter = nodemailer.createTransport({
                host: config.SMTP_HOST,
                port: config.SMTP_PORT,
                secure: config.SMTP_PORT === 465,
                auth: {
                    user: config.SMTP_USER,
                    pass: config.SMTP_PASS,
                },
            });
        }
        catch (err) {
            console.warn('[EmailService] Failed to initialize nodemailer transporter:', err);
        }
    }
    async sendTenantCredentialsEmail(params) {
        if (!this.transporter) {
            this.initTransporter();
        }
        const loginUrl = params.loginUrl || config.APP_LOGIN_URL;
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your   Salon SaaS Credentials</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f6f0ff;
      margin: 0;
      padding: 30px 15px;
      color: #1e1b4b;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(90, 46, 166, 0.1);
      border: 1px solid #e9d5ff;
    }
    .header {
      background: linear-gradient(135deg, #5A2EA6 0%, #7C3AED 100%);
      color: #ffffff;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 13px;
      opacity: 0.9;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #312e81;
    }
    .intro {
      font-size: 14px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 24px;
    }
    .card {
      background-color: #faf5ff;
      border: 1.5px solid #d8b4fe;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .credential-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #ede9fe;
    }
    .credential-row:last-child {
      border-bottom: none;
    }
    .label {
      font-size: 12px;
      font-weight: 700;
      color: #6b21a8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      font-size: 14px;
      font-weight: 700;
      color: #1e1b4b;
      font-family: monospace;
      background: #ffffff;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #e9d5ff;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 24px 0;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #5A2EA6 0%, #7C3AED 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
    }
    .footer {
      background-color: #fdf4ff;
      padding: 20px 24px;
      text-align: center;
      font-size: 11px;
      color: #9333ea;
      border-top: 1px solid #f3e8ff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>  Salon & Spa SaaS</h1>
      <p>Tenant Account Provisioning Notice</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${params.ownerName},</div>
      <div class="intro">
        Congratulations! Your salon brand <strong>${params.salonName}</strong> has been successfully provisioned on the   Salon & Spa SaaS platform.
        <br><br>
        Below are your master tenant administrator credentials to log in to your management dashboard:
      </div>

      <div class="card">
        <div class="credential-row">
          <span class="label">Salon / Brand</span>
          <span class="value">${params.salonName}</span>
        </div>
        <div class="credential-row">
          <span class="label">Tenant Slug</span>
          <span class="value">${params.slug}</span>
        </div>
        <div class="credential-row">
          <span class="label">Login Email</span>
          <span class="value">${params.toEmail}</span>
        </div>
        <div class="credential-row">
          <span class="label">Temporary Password</span>
          <span class="value" style="color: #7c3aed; font-size: 15px;">${params.generatedPassword}</span>
        </div>
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Log In to Tenant Dashboard &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
        We recommend changing your password after your initial login under Account Settings.
      </p>
    </div>
    <div class="footer">
      &copy; 2026   Salon & Spa SaaS Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
        try {
            if (!this.transporter) {
                throw new Error('Transporter not configured');
            }
            const info = await this.transporter.sendMail({
                from: `"  Salon SaaS" <${config.SMTP_USER}>`,
                to: params.toEmail,
                subject: `Welcome to   Salon SaaS - Credentials for ${params.salonName}`,
                text: `Welcome ${params.ownerName},\n\nYour salon ${params.salonName} is active.\n\nLogin URL: ${loginUrl}\nLogin Email: ${params.toEmail}\nTemporary Password: ${params.generatedPassword}\n`,
                html: htmlContent,
            });
            console.info(`[EmailService] Credentials email sent successfully to ${params.toEmail}: ${info.messageId}`);
            return true;
        }
        catch (sendErr) {
            console.error(`[EmailService] Failed to send credentials email to ${params.toEmail}:`, sendErr);
            return false;
        }
    }
}
export const emailService = new EmailService();
