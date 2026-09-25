import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Cake,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Heart,
  Mail,
  MessageSquare,
  Percent,
  Phone,
  Repeat,
  Send,
  Sliders,
  Sparkles,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { FullClientRecord } from './ClientProfileDossierModal';
import { getNextOccurrence } from './ClientProfilePage';

interface SendCelebrationPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: FullClientRecord;
  occasionType: 'birthday' | 'anniversary';
  initialMode?: 'instant' | 'auto';
  onUpdateAutoSettings?: (settings: {
    occasionType: 'birthday' | 'anniversary';
    autoSend: boolean;
    leadDays: number;
    channel: 'whatsapp' | 'sms' | 'email';
    couponCode: string;
    discountOffer: string;
  }) => void;
}

export function SendCelebrationPromoModal({
  isOpen,
  onClose,
  client,
  occasionType,
  initialMode = 'instant',
  onUpdateAutoSettings,
}: SendCelebrationPromoModalProps) {
  const { toast } = useToast();

  const isBirthday = occasionType === 'birthday';
  const occasionTitle = isBirthday ? 'Birthday Celebration Promo' : 'Anniversary Milestone Promo';
  const occasionIcon = isBirthday ? Cake : Heart;

  const nextOccur = isBirthday
    ? getNextOccurrence(client.dob)
    : getNextOccurrence(client.anniversary || '18 Nov 2018');
  const occasionDate = nextOccur.date;

  const defaultCoupon = isBirthday ? 'BDAY-25-LUMEN' : 'LOVE-ANNIV-30';
  const defaultDiscount = isBirthday
    ? '25% Off Any Luxury Facial or Hair Ritual'
    : '30% Off Couple Spa & Complimentary Toast';

  // Read client's current auto settings if available
  const currentAuto = isBirthday
    ? {
      autoSend: client.autoCelebrationSettings?.birthdayAutoSend ?? true,
      leadDays: client.autoCelebrationSettings?.birthdayLeadDays ?? 3,
      channel: client.autoCelebrationSettings?.birthdayChannel ?? 'whatsapp',
    }
    : {
      autoSend: client.autoCelebrationSettings?.anniversaryAutoSend ?? true,
      leadDays: client.autoCelebrationSettings?.anniversaryLeadDays ?? 5,
      channel: client.autoCelebrationSettings?.anniversaryChannel ?? 'whatsapp',
    };

  const [mode, setMode] = useState<'instant' | 'auto'>(initialMode);
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>(currentAuto.channel);
  const [couponCode, setCouponCode] = useState(defaultCoupon);
  const [discountOffer, setDiscountOffer] = useState(defaultDiscount);
  const [validityDays, setValidityDays] = useState('30');
  const [leadDays, setLeadDays] = useState<number>(currentAuto.leadDays);
  const [isAutoEnabled, setIsAutoEnabled] = useState<boolean>(currentAuto.autoSend);
  const [repeatYearly, setRepeatYearly] = useState<boolean>(true);
  const [dispatchTime, setDispatchTime] = useState('09:00 AM');

  const [customMessage, setCustomMessage] = useState(
    isBirthday
      ? `Dear ${client.firstName}, Happy Birthday from the   Salon family! 🎂✨ Celebrate your special day with 25% OFF your next luxury ritual. Use code ${defaultCoupon} on your next visit or online booking.`
      : `Dear ${client.firstName}, Happy Anniversary! 💍✨ We invite you and your partner to celebrate with a complimentary toast & 30% OFF our Couple Aromatherapy Spa. Use code ${defaultCoupon}.`,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setMode(initialMode);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleInstantSend = () => {
    toast(
      `Promo voucher "${couponCode}" instantly dispatched to ${client.fullName} via ${channel.toUpperCase()}!`,
    );
    onClose();
  };

  const handleSaveAutoSchedule = () => {
    if (onUpdateAutoSettings) {
      onUpdateAutoSettings({
        occasionType,
        autoSend: isAutoEnabled,
        leadDays,
        channel,
        couponCode,
        discountOffer,
      });
    }
    const leadText =
      leadDays === 0
        ? 'on the exact day'
        : `${leadDays} day${leadDays > 1 ? 's' : ''} prior to ${occasionDate}`;
    toast(
      isAutoEnabled
        ? `Auto-Promo rule configured: Voucher "${couponCode}" will automatically dispatch ${leadText} at ${dispatchTime} via ${channel.toUpperCase()}.`
        : `Auto-Promo rule paused for ${client.fullName}'s ${isBirthday ? 'birthday' : 'anniversary'}.`,
    );
    onClose();
  };

  const IconComp = occasionIcon;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FCFAFF] to-[#F6F0FF] rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-2xl grid place-items-center text-white shadow-md shrink-0',
                isBirthday
                  ? 'bg-gradient-to-br from-[#7B4DFF] to-[#A970FF]'
                  : 'bg-gradient-to-br from-[#E11D48] to-[#F43F5E]',
              )}
            >
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                  CRM Marketing Automation
                </span>
                <span className="text-xs font-semibold text-soft">
                  {isBirthday ? 'Birthday Voucher' : 'Anniversary Milestone'}
                </span>
              </div>
              <h3 className="font-serif font-bold text-ink text-xl mt-0.5">{occasionTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer border-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab / Mode Toggle: Instant Send vs Auto-Schedule */}
        <div className="px-6 pt-4">
          <div className="p-1 bg-[#FAF7FF] border border-purple-100 rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMode('instant')}
              className={cn(
                'flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0',
                mode === 'instant'
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink',
              )}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Send Promo Now (Instant)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('auto')}
              className={cn(
                'flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-0',
                mode === 'auto'
                  ? 'bg-[#5A2EA6] text-white shadow-sm'
                  : 'bg-transparent text-soft hover:text-ink',
              )}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Auto-Send Rule (Advance Days)</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Client Milestone Info Box */}
          <div className="p-3.5 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted block uppercase font-bold">
                Recipient Guest
              </span>
              <strong className="text-sm font-bold text-ink block mt-0.5">{client.fullName}</strong>
              <span className="text-[11px] text-muted">{client.mobile}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-muted block uppercase font-bold">
                Next {isBirthday ? 'Birthday' : 'Anniversary'}
              </span>
              <strong className="text-xs font-bold text-[#5A2EA6] block mt-0.5">
                {occasionDate} {nextOccur.daysLeftText ? `(${nextOccur.daysLeftText})` : ''}
              </strong>
              <span className="text-[10px] text-emerald-700 font-semibold">Active CRM Profile</span>
            </div>
          </div>

          {/* Auto-Dispatch Advance Days Configuration (Highlighted when in Auto mode) */}
          {mode === 'auto' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#5A2EA6]/8 to-[#8B6FD8]/5 border border-[#5A2EA6]/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#5A2EA6]" />
                  <strong className="text-xs text-ink">Automated Dispatch Timing Rule</strong>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAutoEnabled}
                    onChange={(e) => setIsAutoEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#5A2EA6]" />
                </label>
              </div>

              {isAutoEnabled ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10.5px] font-bold text-[#5A2EA6] block mb-1 uppercase tracking-wider">
                        Send Promo In Advance By
                      </label>
                      <select
                        value={leadDays}
                        onChange={(e) => setLeadDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-bold text-ink text-xs outline-none cursor-pointer shadow-3xs"
                      >
                        <option value={0}>On Milestone Day (0 days before)</option>
                        <option value={1}>1 Day in Advance</option>
                        <option value={2}>2 Days in Advance</option>
                        <option value={3}>3 Days in Advance (Standard CRM)</option>
                        <option value={5}>5 Days in Advance</option>
                        <option value={7}>7 Days in Advance (1 Week Prior)</option>
                        <option value={14}>14 Days in Advance (2 Weeks Prior)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-[#5A2EA6] block mb-1 uppercase tracking-wider">
                        Scheduled Dispatch Time
                      </label>
                      <select
                        value={dispatchTime}
                        onChange={(e) => setDispatchTime(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#5A2EA6]/20 rounded-xl font-bold text-ink text-xs outline-none cursor-pointer shadow-3xs"
                      >
                        <option value="09:00 AM">09:00 AM (Morning Greeting)</option>
                        <option value="11:00 AM">11:00 AM (Mid-Day)</option>
                        <option value="02:00 PM">02:00 PM (Afternoon)</option>
                        <option value="06:00 PM">06:00 PM (Evening Relaxation)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-purple-100/60 text-[11px]">
                    <div className="flex items-center gap-1.5 text-muted">
                      <Repeat className="w-3.5 h-3.5 text-[#5A2EA6]" />
                      <span>Recurring Annual Automation</span>
                    </div>
                    <label className="flex items-center gap-1.5 font-semibold text-ink cursor-pointer">
                      <input
                        type="checkbox"
                        checked={repeatYearly}
                        onChange={(e) => setRepeatYearly(e.target.checked)}
                        className="rounded text-[#5A2EA6] focus:ring-0"
                      />
                      <span>Auto-Repeat Every Year</span>
                    </label>
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-muted italic">
                  Automatic promo dispatch is currently disabled for this client. Toggle on to
                  schedule automatic delivery before their {isBirthday ? 'birthday' : 'anniversary'}
                  .
                </p>
              )}
            </div>
          )}

          {/* Channel Selector */}
          <div>
            <label className="text-soft font-bold block mb-1.5 uppercase text-[10px] tracking-wider">
              Preferred Marketing Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={cn(
                  'p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer',
                  channel === 'whatsapp'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-[#F8F5FF] text-slate-700 hover:bg-slate-100 border-purple-100',
                )}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={cn(
                  'p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer',
                  channel === 'sms'
                    ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                    : 'bg-[#F8F5FF] text-slate-700 hover:bg-slate-100 border-purple-100',
                )}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>SMS Text</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={cn(
                  'p-2.5 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer',
                  channel === 'email'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-[#F8F5FF] text-slate-700 hover:bg-slate-100 border-purple-100',
                )}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email HTML</span>
              </button>
            </div>
          </div>

          {/* Voucher Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-soft font-bold block mb-1">Promo Coupon Code</label>
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl">
                <Tag className="w-3.5 h-3.5 text-[#5A2EA6]" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="bg-transparent font-mono font-bold text-[#5A2EA6] text-xs outline-none w-full border-0 p-0"
                />
              </div>
            </div>

            <div>
              <label className="text-soft font-bold block mb-1">Coupon Validity</label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-bold text-ink text-xs outline-none cursor-pointer"
              >
                <option value="15">Valid for 15 Days</option>
                <option value="30">Valid for 30 Days (Standard)</option>
                <option value="60">Valid for 60 Days</option>
              </select>
            </div>
          </div>

          {/* Discount Benefit */}
          <div>
            <label className="text-soft font-bold block mb-1">
              Promotional Privilege Description
            </label>
            <input
              type="text"
              value={discountOffer}
              onChange={(e) => setDiscountOffer(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-semibold text-ink text-xs outline-none"
            />
          </div>

          {/* Live Message Preview */}
          <div>
            <label className="text-soft font-bold block mb-1">Personalized Message Template</label>
            <textarea
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl font-medium text-ink text-xs outline-none resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700 bg-white"
          >
            Cancel
          </Button>

          {mode === 'instant' ? (
            <Button
              type="button"
              onClick={handleInstantSend}
              className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Promo Offer Now</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSaveAutoSchedule}
              className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save &amp; Activate Auto-Dispatch</span>
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default SendCelebrationPromoModal;
