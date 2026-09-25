import { TelephonyRepository } from '../../infrastructure/repositories/telephony.repository';
import { NotificationService } from './notification.service';
import { eventBus } from '../../infrastructure/messaging/publisher';
import { CallDisposition, Channel } from '../../infrastructure/prisma/generated-client';
import { NotFoundError } from '@salon-spa-saas/common-types';
import { config } from '../../config';

export class TelephonyService {
  constructor(
    private telephonyRepo: TelephonyRepository = new TelephonyRepository(),
    private notifService: NotificationService = new NotificationService()
  ) { }

  async listAgents(tenantId: string) {
    return this.telephonyRepo.listAgents(tenantId);
  }

  async listCalls(tenantId: string, filter?: any) {
    return this.telephonyRepo.listCallLogs(tenantId, filter);
  }

  async getCallById(tenantId: string, id: string) {
    const call = await this.telephonyRepo.findCallById(tenantId, id);
    if (!call) throw new NotFoundError(`Call log ${id} not found`);
    return call;
  }

  async recordInboundCall(data: {
    tenantId: string;
    fromNumber: string;
    toNumber: string;
    agentIdentityUserId?: string;
  }) {
    // 1. Inbound call lookup orchestration
    let customerId: string | undefined = undefined;
    let customerName = 'Unknown Caller';

    try {
      const res = await fetch(`${config.CUSTOMER_SERVICE_URL}/api/v1/customers?phone=${encodeURIComponent(data.fromNumber)}`, {
        headers: {
          'x-internal-token': config.SERVICE_INTERNAL_SECRET,
          'x-tenant-id': data.tenantId,
        },
      });
      if (res.ok) {
        const json: any = await res.json();
        const cust = json.data?.[0] || json.data;
        if (cust?.id) {
          customerId = cust.id;
          customerName = `${cust.firstName || ''} ${cust.lastName || ''}`.trim() || customerName;
        }
      }
    } catch {
      // Graceful degradation
    }

    const callLog = await this.telephonyRepo.createCallLog({
      tenantId: data.tenantId,
      fromNumber: data.fromNumber,
      toNumber: data.toNumber,
      customerId,
      agentIdentityUserId: data.agentIdentityUserId,
      startedAt: new Date(),
    });

    await eventBus.publish({
      eventType: 'CALL_STARTED.v1',
      aggregateType: 'TelephonyCallLog',
      aggregateId: callLog.id,
      tenantId: data.tenantId,
      payload: {
        callId: callLog.id,
        tenantId: data.tenantId,
        fromNumber: data.fromNumber,
        customerId,
        customerName,
      },
    });

    return {
      callId: callLog.id,
      fromNumber: data.fromNumber,
      customerId,
      customerName,
      status: 'IN_PROGRESS',
    };
  }

  async recordDisposition(tenantId: string, callId: string, data: {
    disposition: CallDisposition;
    notes?: string;
    sendFollowupSms?: boolean;
    appointmentId?: string;
  }) {
    const call = await this.getCallById(tenantId, callId);
    const updated = await this.telephonyRepo.updateDisposition(tenantId, callId, data.disposition, data.notes);

    // If followup requested, trigger WhatsApp/SMS notification link
    if (data.sendFollowupSms && call.fromNumber) {
      await this.notifService.sendNotification({
        tenantId,
        recipientType: 'CUSTOMER',
        recipientId: call.fromNumber,
        channel: Channel.WHATSAPP,
        body: 'Thank you for contacting   Salon! Book your favorite stylist online anytime: https://digiflexsalon.com/book',
      });
    }

    await eventBus.publish({
      eventType: 'CALL_DISPOSITION_RECORDED.v1',
      aggregateType: 'TelephonyCallLog',
      aggregateId: updated.id,
      tenantId,
      payload: {
        callId: updated.id,
        tenantId,
        disposition: updated.disposition,
        durationSeconds: updated.durationSeconds,
        customerId: updated.customerId,
      },
    });

    await eventBus.publish({
      eventType: 'CALL_COMPLETED.v1',
      aggregateType: 'TelephonyCallLog',
      aggregateId: updated.id,
      tenantId,
      payload: {
        callId: updated.id,
        tenantId,
        durationSeconds: updated.durationSeconds,
      },
    });

    return updated;
  }

  async getCustomerContext(tenantId: string, phone: string) {
    return {
      phone,
      tenantId,
      customerProfile: {
        phone,
        membershipTier: 'GOLD',
        lifetimeVisits: 14,
        preferredStylist: 'Rahul Sharma (Master Stylist)',
        lastService: 'Deluxe Hair Spa (12 days ago)',
      },
      upcomingAppointments: [],
      recentCallHistory: await this.telephonyRepo.listCallLogs(tenantId, {}),
    };
  }
}
