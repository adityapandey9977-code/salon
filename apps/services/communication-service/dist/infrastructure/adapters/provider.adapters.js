import { createLogger } from '@salon-spa-saas/logger';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { config } from '../../config';
const logger = createLogger('communication-adapters');
// Nodemailer SMTP Email Provider
export class NodemailerEmailProvider {
    transporter = null;
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
        }
        catch (err) {
            logger.warn({ err }, 'Failed to initialize Nodemailer transporter in Communication Service');
        }
    }
    async sendEmail(to, subject, html) {
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
            }
            catch (sendErr) {
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
export class SimulatedSmsProvider {
    async sendSms(to, message) {
        const msgId = `sim-sms-${crypto.randomBytes(8).toString('hex')}`;
        logger.info({ to, message, msgId }, '[SMS Adapter] Simulated SMS dispatch successful');
        return {
            success: true,
            provider: 'SIMULATED_SMS',
            providerMessageId: msgId,
        };
    }
}
export class SimulatedWhatsAppProvider {
    async sendWhatsApp(to, message, templateName) {
        const msgId = `sim-wa-${crypto.randomBytes(8).toString('hex')}`;
        logger.info({ to, templateName, msgId }, '[WhatsApp Adapter] Simulated WhatsApp dispatch successful');
        return {
            success: true,
            provider: 'SIMULATED_WHATSAPP',
            providerMessageId: msgId,
        };
    }
}
export class SimulatedPushProvider {
    async sendPush(token, title, body, data) {
        const msgId = `sim-push-${crypto.randomBytes(8).toString('hex')}`;
        logger.info({ token, title, msgId }, '[Push Adapter] Simulated Push dispatch successful');
        return {
            success: true,
            provider: 'SIMULATED_PUSH',
            providerMessageId: msgId,
        };
    }
}
export const emailProvider = new NodemailerEmailProvider();
export const smsProvider = new SimulatedSmsProvider();
export const whatsAppProvider = new SimulatedWhatsAppProvider();
export const pushProvider = new SimulatedPushProvider();
