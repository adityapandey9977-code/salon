import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TelephonyService } from '../../src/application/services/telephony.service';
import { CallDisposition } from '../../src/infrastructure/prisma/generated-client';

describe('TelephonyService - Call Logging & Dispositions', () => {
  let telephonyService: TelephonyService;
  let mockTelephonyRepo: any;
  let mockNotifService: any;

  beforeEach(() => {
    mockTelephonyRepo = {
      listAgents: vi.fn(),
      listCallLogs: vi.fn(),
      findCallById: vi.fn().mockResolvedValue({
        id: 'call-1',
        fromNumber: '+919876543210',
        toNumber: '+911122334455',
      }),
      createCallLog: vi.fn().mockImplementation((data) => ({ id: 'call-1', ...data })),
      updateDisposition: vi.fn().mockImplementation((tenantId, id, disposition) => ({
        id,
        tenantId,
        disposition,
        durationSeconds: 120,
      })),
    };

    mockNotifService = {
      sendNotification: vi.fn().mockResolvedValue({ status: 'DELIVERED' }),
    };

    telephonyService = new TelephonyService(mockTelephonyRepo, mockNotifService);
  });

  it('should record call disposition and dispatch followup WhatsApp when requested', async () => {
    const result = await telephonyService.recordDisposition('tenant-1', 'call-1', {
      disposition: CallDisposition.BOOKED,
      sendFollowupSms: true,
      notes: 'Customer booked facial appointment for Saturday',
    });

    expect(mockTelephonyRepo.updateDisposition).toHaveBeenCalledWith('tenant-1', 'call-1', CallDisposition.BOOKED, 'Customer booked facial appointment for Saturday');
    expect(mockNotifService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant-1',
        recipientId: '+919876543210',
      })
    );
    expect(result.disposition).toBe(CallDisposition.BOOKED);
  });
});
