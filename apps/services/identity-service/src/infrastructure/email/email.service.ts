import nodemailer, { type Transporter } from 'nodemailer';
import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';

const logger = createLogger('identity-email-service');

export interface SendUserCredentialsEmailParams {
  toEmail: string;
  fullName: string;
  userType?: 'PLATFORM' | 'TENANT' | 'CUSTOMER';
  roleName?: string;
  generatedPassword: string;
  loginUrl?: string;
}

export interface SendPasswordResetEmailParams {
  toEmail: string;
  token: string;
  userType: 'USER' | 'TENANT' | 'PLATFORM';
}


export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
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
      logger.info({ host: config.SMTP_HOST, port: config.SMTP_PORT }, 'Nodemailer SMTP transporter initialized in Identity Service');
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize nodemailer transporter in Identity Service');
    }
  }

  public async sendUserCredentialsEmail(
    params: SendUserCredentialsEmailParams,
  ): Promise<boolean> {
    if (!this.transporter) {
      this.initTransporter();
    }

    const isPlatform = params.userType === 'PLATFORM';
    const defaultLoginUrl = isPlatform
      ? `${config.APP_URL}/super-admin/login`
      : `${config.APP_URL}/login`;
    const loginUrl = params.loginUrl || defaultLoginUrl;

    const portalTitle = isPlatform
      ? 'Super Admin Portal'
      : '  Salon & Spa SaaS Portal';

    const headerSubtitle = isPlatform
      ? 'Internal Super Administrator Operator Credentials'
      : 'Account Provisioning & Access Credentials';

    const roleBadge = params.roleName || (isPlatform ? 'Super Administrator' : 'Tenant Operator');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${portalTitle} Credentials</title>
  <style>
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
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
    .security-note {
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      margin: 0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>  Salon & Spa SaaS</h1>
      <p>${headerSubtitle}</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${params.fullName},</div>
      <div class="intro">
        Your user account has been successfully created on the <strong>  Salon & Spa SaaS</strong> platform.
        <br><br>
        Below are your initial authentication credentials to access your administrative dashboard:
      </div>

      <div class="card">
        <div class="credential-row">
          <span class="label">Assigned Role</span>
          <span class="value" style="color: #5A2EA6;">${roleBadge}</span>
        </div>
        <div class="credential-row">
          <span class="label">Login Email</span>
          <span class="value">${params.toEmail}</span>
        </div>
        <div class="credential-row">
          <span class="label">Temporary Password</span>
          <span class="value" style="color: #7c3aed; font-size: 15px; letter-spacing: 0.5px;">${params.generatedPassword}</span>
        </div>
        <div class="credential-row">
          <span class="label">Portal URL</span>
          <span class="value" style="font-size: 12px;">${loginUrl}</span>
        </div>
      </div>

      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Log In to Portal &rarr;</a>
      </div>

      <p class="security-note">
        <strong>Security Notice:</strong> This auto-generated password was sent exclusively to your email. For security compliance, please change your password after your initial sign-in under Account Settings.
      </p>
    </div>
    <div class="footer">
      &copy; 2026   Salon & Spa SaaS Platform. Enterprise Security & Identity Management.
    </div>
  </div>
</body>
</html>
    `;

    try {
      if (!this.transporter) {
        throw new Error('Transporter not configured');
      }

      const subject = isPlatform
        ? `Super Admin Operator Access Credentials -   Salon SaaS`
        : `Your   Salon SaaS Account Credentials`;

      const info = await this.transporter.sendMail({
        from: `"  Salon SaaS" <${config.SMTP_USER}>`,
        to: params.toEmail,
        subject,
        text: `Welcome ${params.fullName},\n\nYour account is active on   Salon SaaS.\n\nLogin URL: ${loginUrl}\nLogin Email: ${params.toEmail}\nTemporary Password: ${params.generatedPassword}\n\nPlease change your password on first login.\n`,
        html: htmlContent,
      });

      logger.info({ to: params.toEmail, messageId: info.messageId }, 'User credentials email dispatched successfully via SMTP');
      return true;
    } catch (sendErr) {
      logger.error({ to: params.toEmail, err: sendErr }, 'Failed to send credentials email via SMTP');
      return false;
    }
  }

  public async sendPasswordResetEmail(
    params: SendPasswordResetEmailParams,
  ): Promise<boolean> {
    if (!this.transporter) {
      this.initTransporter();
    }

    const isPlatform = params.userType === 'PLATFORM';
    const isTenant = params.userType === 'TENANT';

    // Construct the correct portal reset link based on the userType
    let portalPath = '/reset-password';
    if (isPlatform) portalPath = '/super-admin/reset-password';
    else if (isTenant) portalPath = '/tenant/reset-password';

    const resetUrl = `${config.APP_URL}${portalPath}?token=${params.token}`;
    const portalTitle = isPlatform ? 'Super Admin Portal' : '  Salon & Spa SaaS Portal';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
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
    .content {
      padding: 32px 28px;
    }
    .intro {
      font-size: 14px;
      line-height: 1.6;
      color: #4b5563;
      margin-bottom: 24px;
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
    .security-note {
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      margin: 0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>  Salon & Spa SaaS</h1>
      <p>Password Reset Request</p>
    </div>
    <div class="content">
      <div class="intro">
        We received a request to reset your password for the <strong>${portalTitle}</strong>.
        <br><br>
        If you didn't make this request, you can safely ignore this email. Your password will remain unchanged.
      </div>

      <div class="btn-container">
        <a href="${resetUrl}" class="btn">Reset Password &rarr;</a>
      </div>

      <p class="security-note">
        <strong>Note:</strong> This link will expire in 15 minutes for your security.
      </p>
    </div>
    <div class="footer">
      &copy; 2026   Salon & Spa SaaS Platform. Enterprise Security & Identity Management.
    </div>
  </div>
</body>
</html>
    `;

    try {
      if (!this.transporter) {
        throw new Error('Transporter not configured');
      }

      const subject = `Password Reset Request - ${portalTitle}`;

      const info = await this.transporter.sendMail({
        from: `"  Salon SaaS" <${config.SMTP_USER}>`,
        to: params.toEmail,
        subject,
        text: `We received a request to reset your password.\n\nPlease go to the following URL to reset your password:\n${resetUrl}\n\nIf you didn't request this, ignore this email.`,
        html: htmlContent,
      });

      logger.info({ to: params.toEmail, messageId: info.messageId }, 'Password reset email dispatched successfully via SMTP');
      return true;
    } catch (sendErr) {
      logger.error({ to: params.toEmail, err: sendErr }, 'Failed to send password reset email via SMTP');
      return false;
    }
  }
}

export const emailService = new EmailService();
