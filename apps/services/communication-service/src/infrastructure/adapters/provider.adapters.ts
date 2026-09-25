import { createLogger } from '@salon-spa-saas/logger';
import crypto from 'crypto';
import nodemailer, { type Transporter } from 'nodemailer';
import { config } from '../../config';

const logger = createLogger('communication-adapters');

export interface SendResult {
  success: boolean;
  provider: string;
  providerMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<SendResult>;
}

export interface SmsProvider {
  sendSms(to: string, message: string): Promise<SendResult>;
}

export interface WhatsAppProvider {
  sendWhatsApp(to: string, message: string, templateName?: string): Promise<SendResult>;
}

export interface PushProvider {
  sendPush(token: string, title: string, body: string, data?: any): Promise<SendResult>;
}

// Nodemailer SMTP Email Provider
export class NodemailerEmailProvider implements EmailProvider {
  private transporter: Transporter | null = null;

  constructor() {
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
      logger.info({ host: config.SMTP_HOST, port: config.SMTP_PORT }, 'Nodemailer SMTP transporter initialized in Communication Service');
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize Nodemailer transporter in Communication Service');
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<SendResult> {
    if (this.transporter && config.SMTP_USER) {
      try {
        const info = await this.transporter.sendMail({
          from: `"  Salon SaaS" <${config.SMTP_USER}>`,
          to,
          subject,
          html,
        });
        logger.info({ to, subject, messageId: info.messageId }, '[Email Adapter] SMTP email sent successfully');
        return {
          success: true,
          provider: 'NODEMAILER_SMTP',
          providerMessageId: info.messageId,
        };
      } catch (sendErr: any) {
        logger.error({ to, err: sendErr }, '[Email Adapter] SMTP send failed, falling back to simulated');
      }
    }

    const msgId = `sim-email-${crypto.randomBytes(8).toString('hex')}`;
    logger.info({ to, subject, msgId }, '[Email Adapter] Simulated email dispatch recorded');
    return {
      success: true,
      provider: 'SIMULATED_EMAIL',
      providerMessageId: msgId,
    };
  }
}

export class SimulatedSmsProvider implements SmsProvider {
  async sendSms(to: string, message: string): Promise<SendResult> {
    const msgId = `sim-sms-${crypto.randomBytes(8).toString('hex')}`;
    logger.info({ to, message, msgId }, '[SMS Adapter] Simulated SMS dispatch successful');
    return {
      success: true,
      provider: 'SIMULATED_SMS',
      providerMessageId: msgId,
    };
  }
}

export class SimulatedWhatsAppProvider implements WhatsAppProvider {
  async sendWhatsApp(to: string, message: string, templateName?: string): Promise<SendResult> {
    const msgId = `sim-wa-${crypto.randomBytes(8).toString('hex')}`;
    logger.info({ to, templateName, msgId }, '[WhatsApp Adapter] Simulated WhatsApp dispatch successful');
    return {
      success: true,
      provider: 'SIMULATED_WHATSAPP',
      providerMessageId: msgId,
    };
  }
}

export class SimulatedPushProvider implements PushProvider {
  async sendPush(token: string, title: string, body: string, data?: any): Promise<SendResult> {
    const msgId = `sim-push-${crypto.randomBytes(8).toString('hex')}`;
    logger.info({ token, title, msgId }, '[Push Adapter] Simulated Push dispatch successful');
    return {
      success: true,
      provider: 'SIMULATED_PUSH',
      providerMessageId: msgId,
    };
  }
}

export const emailProvider: EmailProvider = new NodemailerEmailProvider();
export const smsProvider: SmsProvider = new SimulatedSmsProvider();
export const whatsAppProvider: WhatsAppProvider = new SimulatedWhatsAppProvider();
export const pushProvider: PushProvider = new SimulatedPushProvider();

