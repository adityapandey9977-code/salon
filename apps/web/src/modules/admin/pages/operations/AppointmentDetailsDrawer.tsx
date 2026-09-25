import { InvoicePdfPreviewModal } from '@/shared/components/InvoicePdfPreviewModal';
import {
  type InvoiceFullData,
  type InvoiceItemDetail,
  downloadInvoiceDocument,
  printInvoice,
  sendInvoiceToWhatsApp,
} from '@/shared/utils/invoicePdfGenerator';
import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  FileText,
  Layers,
  Mail,
  MapPin,
  Phone,
  Play,
  RotateCcw,
  Scissors,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { initialClients } from '../clients/clientsData';
import { masterBranches } from '../locations/AllBranchesTab';
import type { NewAppointmentData } from './NewAppointmentModal';

export interface FullAppointmentRecord extends NewAppointmentData {
  appointmentId?: string;
  bookingNumber?: string;
  rawStatus?: string;
  completedAt?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  status:
  | 'Booked'
  | 'Confirmed'
  | 'Checked-in'
  | 'In Service'
  | 'Completed'
  | 'Cancelled'
  | 'No-show'
  | 'Rescheduled';
  timeline: { title: string; time: string; user: string; status: string }[];
  clientVisits: number;
  lastVisit: string;
  membershipStatus: string;
  depositPaid: number;
  balanceDue: number;
}

interface AppointmentDetailsDrawerProps {
  appointment: FullAppointmentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    newStatus: FullAppointmentRecord['status'],
    updatedFields?: Partial<FullAppointmentRecord>,
  ) => void;
}

export function AppointmentDetailsDrawer({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
}: AppointmentDetailsDrawerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drawerNotice, setDrawerNotice] = useState<string | null>(null);

  const totalServiceSeconds = (appointment?.durationMinutes || 45) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalServiceSeconds);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(appointment?.status === 'In Service');

  // Reset notice and timer when appointment changes
  React.useEffect(() => {
    if (appointment) {
      const totalSec = (appointment.durationMinutes || 45) * 60;
      setSecondsRemaining(totalSec);
      setIsTimerActive(appointment.status === 'In Service');
      setDrawerNotice(null);
    }
  }, [appointment?.id, appointment?.status, appointment?.durationMinutes]);

  // Live countdown timer interval
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerActive && appointment?.status === 'In Service' && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, appointment?.status, secondsRemaining]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Persistent in-drawer notification banner without floating popup toast
  const triggerNotice = (msg: string) => {
    setDrawerNotice(msg);
  };

  // Reschedule / Cancel / Transfer sub-modals
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Official Tax Invoice PDF & WhatsApp Dispatch Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<Partial<InvoiceFullData> | null>(
    null,
  );

  const buildAppointmentInvoiceData = (apt: FullAppointmentRecord): Partial<InvoiceFullData> => {
    const invNo = `INV-${apt.id.replace(/[^0-9]/g, '') || '103910'}-26`;
    const totalAmt = apt.totalAmount || apt.estimatedAmount || (apt as any).totalPrice || 4500;
    const subTotal = Math.round(totalAmt / 1.18);
    const totalTax = totalAmt - subTotal;
    const cgst = Math.round(totalTax / 2);
    const sgst = totalTax - cgst;

    const branchName = apt.branch || 'Atelier Indrapuri Flagship';
    const isBhopal =
      branchName.toLowerCase().includes('bhopal') ||
      branchName.toLowerCase().includes('indrapuri') ||
      branchName.toLowerCase().includes('arera');
    const isUjjain = branchName.toLowerCase().includes('ujjain');
    const branchCity = isBhopal ? 'Bhopal' : isUjjain ? 'Ujjain' : 'Indore';
    const branchAddress = isBhopal
      ? 'Plot 42, Sector B, Main Commercial Belt, Indrapuri'
      : isUjjain
        ? 'Mahakal Commercial Road, Freeganj'
        : 'AB Road, Scheme 54, Indore';

    const primaryServiceName =
      apt.services && apt.services.length > 0
        ? apt.services.map((s) => s.name).join(', ')
        : (apt as any).serviceName || 'Custom Salon Treatment';

    const items: InvoiceItemDetail[] =
      apt.services && apt.services.length > 0
        ? apt.services.map((s) => ({
          name: s.name,
          description: `${s.category || 'Treatment'} protocol delivered by ${apt.staffName || 'Specialist'} (${s.duration || apt.durationMinutes} mins)`,
          sacCode: '999711',
          qty: 1,
          rate: s.price,
          cgstRate: 9,
          sgstRate: 9,
          amount: s.price,
        }))
        : [
          {
            name: primaryServiceName,
            description: `Treatment protocol delivered by ${apt.staffName || 'Specialist'} (${apt.durationMinutes} mins)`,
            sacCode: '999711',
            qty: 1,
            rate: totalAmt,
            cgstRate: 9,
            sgstRate: 9,
            amount: totalAmt,
          },
        ];

    return {
      invoiceNumber: invNo,
      invoiceDate: apt.date || '17 Aug 2026',
      dueDate: apt.date || '17 Aug 2026',
      terms: 'Due on Receipt',
      placeOfSupply: 'Madhya Pradesh (23)',
      businessName: `${branchName} · Atelier Salon & Spa`,
      businessAddress: branchAddress,
      businessCityStatePin: `${branchCity}, Madhya Pradesh 462022`,
      businessCountry: 'India',
      businessGstin: 'GSTIN 23AAAAA0000A1Z5',
      clientName: apt.clientName,
      clientPhone: apt.clientMobile || '+91 98200 44551',
      clientAddress: `${branchCity} Resident`,
      clientCity: branchCity,
      clientStatePin: `Madhya Pradesh`,
      clientCountry: 'India',
      items: items,
      subTotal: subTotal,
      cgstAmount: cgst,
      sgstAmount: sgst,
      rounding: 0.0,
      totalAmount: totalAmt,
      paymentMade: totalAmt,
      balanceDue: 0.0,
      paymentMethod: (apt as any).paymentMode || 'Scanner UPI',
      referenceNumber: `pay_${apt.id.toLowerCase()}`,
      stylistAssigned: apt.staffName,
      notes: `Thank you for visiting Atelier Salon & Spa!\nService: ${primaryServiceName} (${apt.durationMinutes} mins) by ${apt.staffName}.`,
    };
  };

  const [newRescheduleDate, setNewRescheduleDate] = useState('2026-08-20');
  const [newRescheduleTime, setNewRescheduleTime] = useState('02:00 PM');
  const [cancelReason, setCancelReason] = useState('Client personal emergency');
  const [targetBranch, setTargetBranch] = useState(
    masterBranches[1]?.name || 'Atelier Arera Luxury Lounge',
  );

  if (!isOpen || !appointment) return null;

  const handleConfirmReschedule = () => {
    onUpdateStatus(appointment.id, 'Rescheduled', {
      date: newRescheduleDate,
      time: newRescheduleTime,
    });
    setIsRescheduleOpen(false);
    triggerNotice(
      `Appointment #${appointment.id} successfully rescheduled to ${newRescheduleDate} at ${newRescheduleTime} for ${appointment.clientName}.`,
    );
  };

  const handleConfirmCancel = () => {
    onUpdateStatus(appointment.id, 'Cancelled', { notes: cancelReason });
    setIsCancelOpen(false);
    triggerNotice(
      `Appointment #${appointment.id} cancelled (Reason: "${cancelReason}"). Deposit policy applied.`,
    );
  };

  const handleConfirmTransfer = () => {
    onUpdateStatus(appointment.id, 'Confirmed', {
      branch: targetBranch,
    });
    triggerNotice(
      `Branch transfer completed for #${appointment.id}. Destination: ${targetBranch}. Staff roster synced.`,
    );
    setIsTransferOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-end bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-[0_25px_70px_rgba(90,46,166,0.25)] border-l border-purple-100 flex flex-col animate-in slide-in-from-right duration-300 text-xs">
        {/* Drawer Header */}
        <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-[#5A2EA6] bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                {appointment.id}
              </span>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                  appointment.status === 'Confirmed' || appointment.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : appointment.status === 'In Service'
                      ? 'bg-purple-100 text-[#5A2EA6]'
                      : appointment.status === 'Checked-in'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800',
                )}
              >
                {appointment.status}
              </span>
            </div>
            <h3 className="font-serif text-[17px] text-ink font-bold tracking-tight mt-1">
              {appointment.clientName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto custom-scroll flex-1 space-y-5">
          {/* Live Action Feedback Alert Banner inside Drawer */}
          {drawerNotice && (
            <div className="p-3.5 rounded-2xl bg-[#5A2EA6] text-white border border-purple-400/40 shadow-md text-xs font-semibold flex items-center justify-between gap-2.5 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="leading-snug">{drawerNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setDrawerNotice(null)}
                className="text-white/70 hover:text-white shrink-0 p-1 cursor-pointer border-0 bg-transparent"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Active Live Treatment Timer (When In Service) */}
          {appointment.status === 'In Service' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2D1552] to-[#5A2EA6] text-white shadow-lg space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-purple-200">
                    Live Service Protocol · In Progress
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/15 text-white font-bold backdrop-blur-xs border border-white/20">
                  {formatTimer(secondsRemaining)} Remaining
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-3xl font-mono font-extrabold tracking-tight">
                    {formatTimer(secondsRemaining)}
                  </span>
                  <span className="text-[11px] text-purple-200 ml-2 font-medium">
                    / {appointment.durationMinutes} mins scheduled
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-300">
                  {Math.min(
                    100,
                    Math.round(
                      ((totalServiceSeconds - secondsRemaining) / (totalServiceSeconds || 1)) * 100,
                    ),
                  )}
                  % Elapsed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-black/25 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-purple-300 to-white rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min(100, Math.round(((totalServiceSeconds - secondsRemaining) / (totalServiceSeconds || 1)) * 100))}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-purple-200 pt-0.5">
                <span>
                  Specialist: <strong>{appointment.staffName}</strong>
                </span>
                <span>
                  Station: <strong>{appointment.chair}</strong>
                </span>
              </div>
            </div>
          )}

          {/* 1. Appointment Core Telemetry */}
          <div className="p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100/80 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Scheduled Slot
                </span>
                <strong className="text-ink text-xs block">{appointment.date}</strong>
                <span className="text-[#5A2EA6] font-bold">
                  {appointment.time} ({appointment.durationMinutes} mins)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Assigned Specialist
                </span>
                <strong className="text-ink text-xs block">{appointment.staffName}</strong>
                <span className="text-muted">{appointment.branch}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-purple-50 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Treatment Suite &amp; Chair
                </span>
                <span className="text-ink font-semibold">{appointment.room}</span>
                <span className="text-muted block text-[10.5px]">{appointment.chair}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Booking Channel
                </span>
                <span className="inline-block px-2 py-0.5 rounded bg-purple-50 text-[#5A2EA6] font-bold text-[10px] border border-purple-100 mt-0.5">
                  {appointment.bookingSource}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Client Profile Card */}
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-3xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-ink text-xs uppercase tracking-wider">
                Client Dossier
              </h4>
              <button
                type="button"
                onClick={() => {
                  const matched = initialClients.find(
                    (c) =>
                      c.fullName.toLowerCase() === appointment.clientName.toLowerCase() ||
                      c.mobile.replace(/\s+/g, '') === appointment.clientMobile.replace(/\s+/g, ''),
                  );
                  const targetId = matched ? matched.id : 'CL-10492';
                  navigate(`/clients/${targetId}`);
                  onClose();
                }}
                className="text-[11px] font-bold text-[#5A2EA6] hover:text-[#4a2489] flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-0 p-0"
              >
                <span>View Full Client Page</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Avatar
                initials={appointment.clientName.slice(0, 2).toUpperCase()}
                className="w-10 h-10 rounded-xl bg-purple-100 text-[#5A2EA6] font-bold text-xs shrink-0"
              />
              <div className="min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    const matched = initialClients.find(
                      (c) =>
                        c.fullName.toLowerCase() === appointment.clientName.toLowerCase() ||
                        c.mobile.replace(/\s+/g, '') ===
                        appointment.clientMobile.replace(/\s+/g, ''),
                    );
                    const targetId = matched ? matched.id : 'CL-10492';
                    navigate(`/clients/${targetId}`);
                    onClose();
                  }}
                  className="text-left group bg-transparent border-0 p-0 cursor-pointer block"
                >
                  <strong className="text-ink text-xs font-bold block group-hover:text-[#5A2EA6] group-hover:underline transition-colors truncate">
                    {appointment.clientName}
                  </strong>
                </button>
                <span className="text-muted text-[11px] block truncate">
                  {appointment.clientMobile} · {appointment.clientEmail}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FAF7FF] border border-purple-50 text-[11px] text-muted flex justify-between">
              <span>
                Total Visits: <strong>{appointment.clientVisits || 14} Visits</strong>
              </span>
              <span>
                Last Visit: <strong>{appointment.lastVisit || '28 Jul 2026'}</strong>
              </span>
            </div>
          </div>

          {/* 3. Services Booked */}
          <div className="space-y-2">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">
              Booked Treatment Protocols
            </h4>
            <div className="space-y-2">
              {appointment.services.map((srv, i) => (
                <div
                  key={i}
                  className="p-3 bg-[#FCFAFF] rounded-xl border border-purple-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-ink block">{srv.name}</strong>
                    <span className="text-[10px] text-muted">
                      {srv.category} · {srv.duration} mins
                    </span>
                  </div>
                  <strong className="text-ink font-serif">
                    ₹{srv.price.toLocaleString('en-IN')}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Payment & Billing Summary */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
            <h4 className="font-bold text-purple-900 text-xs uppercase tracking-wider">
              Billing &amp; Deposit Summary
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted">
                <span>Total Service Amount:</span>
                <span className="text-ink font-semibold">
                  ₹{appointment.estimatedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Deposit Credited (25%):</span>
                <span className="text-emerald-700 font-bold">
                  ₹{(appointment.depositPaid || appointment.depositAmount).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-muted pt-1 border-t border-purple-100">
                <span className="font-bold text-ink">Balance Due on Checkout:</span>
                <strong className="text-ink font-serif text-sm">
                  ₹
                  {(
                    appointment.balanceDue ||
                    appointment.estimatedAmount - appointment.depositAmount
                  ).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>
          </div>

          {/* 5. Activity Timeline */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-ink text-xs uppercase tracking-wider">
              Operational Audit Timeline
            </h4>
            <div className="space-y-2 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-purple-100">
              {[
                {
                  title: 'Appointment Booked via Widget',
                  time: '18 Aug, 09:12 AM',
                  user: 'Online System',
                  status: 'Booked',
                },
                {
                  title: 'Deposit Payment ₹1,125 Received',
                  time: '18 Aug, 09:14 AM',
                  user: 'Razorpay Gateway',
                  status: 'Paid',
                },
                {
                  title: 'Automated WhatsApp Confirmation Sent',
                  time: '18 Aug, 09:15 AM',
                  user: '  Bot',
                  status: 'Delivered',
                },
              ].map((tl, idx) => (
                <div key={idx} className="relative pl-3 text-xs">
                  <span className="absolute -left-[14px] top-1 w-2.5 h-2.5 rounded-full bg-[#5A2EA6] border-2 border-white shadow-2xs" />
                  <div className="font-semibold text-ink">{tl.title}</div>
                  <div className="text-[10px] text-muted">
                    {tl.time} · {tl.user}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Action Bar */}
        <div className="px-6 py-4 border-t border-purple-50 bg-white shrink-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* 1. Booked / Unconfirmed State */}
            {appointment.status === 'Booked' && (
              <>
                <Button
                  onClick={() => {
                    onUpdateStatus(appointment.id, 'Confirmed');
                    triggerNotice(
                      `Booking #${appointment.id} confirmed for ${appointment.clientName}. Specialist ${appointment.staffName} notified.`,
                    );
                  }}
                  className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Booking</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(appointment.id, 'Checked-in');
                    triggerNotice(
                      `Client ${appointment.clientName} checked in at floor reception. Station ${appointment.chair} prepared.`,
                    );
                  }}
                  className="h-9 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Floor Check-in</span>
                </Button>
              </>
            )}

            {/* 2. Confirmed State */}
            {appointment.status === 'Confirmed' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    onUpdateStatus(appointment.id, 'Checked-in');
                    triggerNotice(
                      `Client ${appointment.clientName} checked in at floor reception. Station ${appointment.chair} prepared.`,
                    );
                  }}
                  className="h-9 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Floor Check-in</span>
                </Button>

                <Button
                  onClick={() => {
                    onUpdateStatus(appointment.id, 'In Service');
                    setIsTimerActive(true);
                    triggerNotice(
                      `Service protocol started for ${appointment.clientName} by ${appointment.staffName}. Live timer active for ${appointment.durationMinutes} mins.`,
                    );
                  }}
                  className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Service</span>
                </Button>
              </>
            )}

            {/* 3. Checked-in State */}
            {appointment.status === 'Checked-in' && (
              <Button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'In Service');
                  setIsTimerActive(true);
                  triggerNotice(
                    `Service protocol started for ${appointment.clientName} by ${appointment.staffName}. Live timer active for ${appointment.durationMinutes} mins.`,
                  );
                }}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Service</span>
              </Button>
            )}

            {/* 4. In Service State */}
            {appointment.status === 'In Service' && (
              <Button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'Completed');
                  setIsTimerActive(false);
                  const invData = buildAppointmentInvoiceData(appointment);
                  setSelectedInvoiceData(invData);
                  setIsPdfModalOpen(true);
                  triggerNotice(
                    `Service completed! Opening Tax Invoice & digital receipt for ${appointment.clientName}.`,
                  );
                }}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Complete Service &amp; Invoice</span>
              </Button>
            )}

            {/* 5. Completed State */}
            {appointment.status === 'Completed' && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    const invData = buildAppointmentInvoiceData(appointment);
                    setSelectedInvoiceData(invData);
                    setIsPdfModalOpen(true);
                  }}
                  className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5 shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resend Invoice to Mobile</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const invData = buildAppointmentInvoiceData(appointment);
                    sendInvoiceToWhatsApp(invData, appointment.clientMobile);
                    triggerNotice(
                      `Opening WhatsApp with Tax Invoice for ${appointment.clientName}... 💬`,
                    );
                  }}
                  className="h-9 px-3 rounded-xl text-xs font-bold border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Bill</span>
                </Button>
              </div>
            )}

            {/* 6. Cancelled State */}
            {appointment.status === 'Cancelled' && (
              <Button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'Confirmed');
                  triggerNotice(
                    `Appointment #${appointment.id} reopened and set to Confirmed for ${appointment.clientName}.`,
                  );
                }}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Booking</span>
              </Button>
            )}

            {/* 7. Rescheduled State */}
            {appointment.status === 'Rescheduled' && (
              <Button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'Confirmed');
                  triggerNotice(
                    `Rescheduled slot confirmed for ${appointment.clientName} on ${appointment.date} at ${appointment.time}.`,
                  );
                }}
                className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Re-Scheduled Slot</span>
              </Button>
            )}

            {/* Secondary Standard Controls */}
            {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsRescheduleOpen(true)}
                  className="h-9 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white"
                >
                  Reschedule
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsTransferOpen(true)}
                  className="h-9 px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white"
                >
                  Branch Transfer
                </Button>

                <button
                  type="button"
                  onClick={() => setIsCancelOpen(true)}
                  className="h-9 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border-0 cursor-pointer"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Sub-Modal */}
      {isRescheduleOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100 w-full max-w-md p-6 space-y-4 text-xs">
              <h3 className="font-serif text-[18px] text-ink font-bold">Reschedule Appointment</h3>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  New Date
                </label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  New Slot
                </label>
                <select
                  value={newRescheduleTime}
                  onChange={(e) => setNewRescheduleTime(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setIsRescheduleOpen(false)}
                  className="h-9 px-4 rounded-xl text-soft hover:bg-slate-100 cursor-pointer border border-slate-200 bg-white font-semibold"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleConfirmReschedule}
                  className="h-9 px-5 rounded-xl bg-[#5A2EA6] text-white font-bold"
                >
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Cancel Sub-Modal */}
      {isCancelOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-md p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    Cancel Appointment #{appointment.id}?
                  </h3>
                  <p className="text-[11px] text-muted">Deposit policy impact &amp; slot release</p>
                </div>
              </div>
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-purple-900 text-[11px]">
                Cancellation within 4 hours incurs a 50% deposit forfeiture as per Brand Policy.
                Remaining balance will be refunded to wallet.
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Reason for Cancellation
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCancelOpen(false)}
                  className="h-9 px-4 rounded-xl text-soft hover:bg-slate-100 cursor-pointer border border-slate-200 bg-white font-semibold"
                >
                  Keep Appointment
                </button>
                <Button
                  onClick={handleConfirmCancel}
                  className="h-9 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Branch Transfer Sub-Modal */}
      {isTransferOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100 w-full max-w-md p-6 space-y-4 text-xs">
              <h3 className="font-serif text-[18px] text-ink font-bold">
                Transfer Appointment to Branch
              </h3>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Current Location
                </label>
                <div className="p-3 bg-slate-50 rounded-xl text-ink font-semibold">
                  {appointment.branch}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                  Target Destination Branch
                </label>
                <select
                  value={targetBranch}
                  onChange={(e) => setTargetBranch(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink"
                >
                  {masterBranches.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="h-9 px-4 rounded-xl text-soft hover:bg-slate-100 cursor-pointer border border-slate-200 bg-white font-semibold"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleConfirmTransfer}
                  className="h-9 px-5 rounded-xl bg-[#5A2EA6] text-white font-bold"
                >
                  Initiate Transfer
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Official Tax Invoice / WhatsApp Modal */}
      {isPdfModalOpen && selectedInvoiceData && (
        <InvoicePdfPreviewModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          invoiceData={selectedInvoiceData}
        />
      )}
    </div>,
    document.body,
  );
}

export default AppointmentDetailsDrawer;
