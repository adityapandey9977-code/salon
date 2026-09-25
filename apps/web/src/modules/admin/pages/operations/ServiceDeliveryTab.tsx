import { Avatar, Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  Gift,
  Pause,
  Play,
  Scissors,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { masterBranches } from '../locations/AllBranchesTab';

export interface ServiceDeliverySession {
  id: string;
  appointmentId: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  branch: string;
  room: string;
  startTime: string;
  durationMinutes: number;
  elapsedMinutes: number;
  status:
    | 'Checked-in'
    | 'Consultation'
    | 'Ready'
    | 'In Service'
    | 'Completed'
    | 'Awaiting Checkout';
  consultationStatus: 'Completed' | 'Pending';
  consentStatus: 'Accepted' | 'Pending' | 'Expired';
  patchTestStatus: 'Completed' | 'Required' | 'Not Applicable';
  photoStatus: 'Available' | 'Pending' | 'Not Required';
  checklist: { step: string; done: boolean }[];
  homecareRecommendation: string;
  nextVisitRecommendation: string;
}

export const initialServiceDeliveries: ServiceDeliverySession[] = [
  {
    id: 'DEL-01',
    appointmentId: 'APT-1091',
    clientName: 'Akanksha Sharma',
    serviceName: '7-Step Medical Hydra-Facial & Glow Infusion',
    staffName: 'Ananya Deshmukh',
    branch: 'Atelier Indrapuri Flagship',
    room: 'Clinical Aesthetic Suite #1',
    startTime: '10:00 AM',
    durationMinutes: 60,
    elapsedMinutes: 34,
    status: 'In Service',
    consultationStatus: 'Completed',
    consentStatus: 'Accepted',
    patchTestStatus: 'Completed',
    photoStatus: 'Available',
    checklist: [
      { step: 'Double Cleanse & Botanical Steam Prep', done: true },
      { step: 'Salicylic Acid Vortex-Exfoliation', done: true },
      { step: 'Hyaluronic Acid + Vitamin C Peptide Infusion', done: false },
      { step: 'LED Red Light Anti-Ageing Collagen Bath', done: false },
    ],
    homecareRecommendation: 'SkinCeuticals C E Ferulic + Mineral Matte SPF 50',
    nextVisitRecommendation: '4 Weeks (15 Sep 2026 for Maintenance Protocol)',
  },
  {
    id: 'DEL-02',
    appointmentId: 'APT-1093',
    clientName: 'Meera Nambiar',
    serviceName: 'Full Head Balayage & Keratin Infusion',
    staffName: 'Rohit Verma',
    branch: 'Atelier Koregaon Park Grand',
    room: 'Hair Art Studio Chair #1',
    startTime: '02:00 PM',
    durationMinutes: 120,
    elapsedMinutes: 0,
    status: 'Consultation',
    consultationStatus: 'Pending',
    consentStatus: 'Pending',
    patchTestStatus: 'Required',
    photoStatus: 'Pending',
    checklist: [
      { step: 'Color Consultation & Patch Test Verification', done: false },
      { step: 'Foil Highlighting & Bond Builder Formulation', done: false },
      { step: 'Glaze Toning & Keratin Complex Mask', done: false },
      { step: 'Signature Blowout & Style Set', done: false },
    ],
    homecareRecommendation: 'Kérastase Blond Absolu Shampoo & Mask',
    nextVisitRecommendation: '8 Weeks for Root Glaze Touch-up',
  },
];

import { useOperationsData, type OperationsData } from './useOperationsData';

export interface ServiceDeliveryTabProps {
  operationsData?: OperationsData;
}

export function ServiceDeliveryTab({ operationsData }: ServiceDeliveryTabProps = {}) {
  const fallbackOps = useOperationsData();
  const ops = operationsData || fallbackOps;
  const { toast } = useToast();

  const dynamicSessions: ServiceDeliverySession[] = React.useMemo(() => {
    const activeApts = ops.appointments.filter(
      (a) => a.status === 'In Service' || a.status === 'Checked-in' || a.status === 'Confirmed',
    );
    const targetList = activeApts.length > 0 ? activeApts : ops.appointments.slice(0, 3);

    return targetList.map((apt, idx) => {
      const srvName = apt.services[0]?.name || 'Specialized Treatment Protocol';
      return {
        id: `DEL-0${idx + 1}`,
        appointmentId: apt.id,
        clientName: apt.clientName,
        serviceName: srvName,
        staffName: apt.staffName,
        branch: apt.branch,
        room: apt.room || 'Clinical Suite #1',
        startTime: apt.time,
        durationMinutes: apt.durationMinutes || 45,
        elapsedMinutes: apt.status === 'In Service' ? 15 : 0,
        status: (apt.status === 'In Service'
          ? 'In Service'
          : apt.status === 'Checked-in'
            ? 'Checked-in'
            : 'Ready') as ServiceDeliverySession['status'],
        consultationStatus: 'Completed',
        consentStatus: 'Accepted',
        patchTestStatus: 'Completed',
        photoStatus: 'Available',
        checklist: [
          { step: `Client Consultation & Scalp/Skin Analysis for ${srvName}`, done: true },
          { step: 'Sanitization & Station Preparation Checklist', done: true },
          { step: `Primary Protocol Delivery: ${srvName}`, done: apt.status === 'In Service' },
          { step: 'Quality Finish, Styling & Homecare Recommendations', done: false },
        ],
        homecareRecommendation: 'Daily Hydration Ampoule + Protective Barrier Cream',
        nextVisitRecommendation: '4 Weeks for Maintenance Follow-up',
      };
    });
  }, [ops.appointments]);

  const [checklistOverrides, setChecklistOverrides] = useState<
    Record<string, { step: string; done: boolean }[]>
  >({});

  const sessions: ServiceDeliverySession[] = React.useMemo(() => {
    return dynamicSessions.map((s) => ({
      ...s,
      checklist: checklistOverrides[s.appointmentId] || s.checklist,
    }));
  }, [dynamicSessions, checklistOverrides]);

  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId || s.appointmentId === selectedSessionId) ||
    sessions[0] ||
    initialServiceDeliveries[0];
  const [timerRunning, setTimerRunning] = useState(true);

  const handleToggleStep = (stepIdx: number) => {
    if (!selectedSession) return;
    const nextChecklist = selectedSession.checklist.map((s, idx) =>
      idx === stepIdx ? { ...s, done: !s.done } : s,
    );
    setChecklistOverrides((prev) => ({
      ...prev,
      [selectedSession.appointmentId]: nextChecklist,
    }));
    toast(
      `Step "${selectedSession.checklist[stepIdx].step}" marked as ${nextChecklist[stepIdx].done ? 'completed' : 'pending'}.`,
    );
  };

  const handleAdvanceStatus = async (nextStatus: ServiceDeliverySession['status']) => {
    if (!selectedSession) return;
    const mappedBackendStatus =
      nextStatus === 'In Service'
        ? 'In Service'
        : nextStatus === 'Completed'
          ? 'Completed'
          : nextStatus === 'Checked-in'
            ? 'Checked-in'
            : 'Confirmed';

    await ops.handleUpdateStatus(selectedSession.appointmentId, mappedBackendStatus);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Service Delivery &amp; Clinical Execution
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {sessions.length} Live Floor Sessions
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Real-time treatment step checklists, live execution timer, digital consent validation,
            and patch-test verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Service Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-[#5A2EA6] uppercase tracking-wider">
            Active Floor Treatments
          </h3>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => setSelectedSessionId(sess.id)}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer space-y-2',
                  selectedSession.id === sess.id
                    ? 'bg-purple-50/70 border-[#5A2EA6] shadow-xs'
                    : 'bg-white border-purple-100 hover:border-purple-200',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] text-[#5A2EA6]">
                    {sess.appointmentId}
                  </span>
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9.5px] font-bold',
                      sess.status === 'In Service'
                        ? 'bg-purple-100 text-[#5A2EA6]'
                        : sess.status === 'Consultation'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800',
                    )}
                  >
                    {sess.status}
                  </span>
                </div>

                <div>
                  <strong className="text-xs text-ink block">{sess.clientName}</strong>
                  <span className="text-[11px] text-muted block truncate">{sess.serviceName}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-soft pt-1 border-t border-purple-50">
                  <span>{sess.staffName}</span>
                  <span className="font-bold text-ink">{sess.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Service Cockpit (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Header & Live Timer Card */}
          <div className="p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
              <div>
                <span className="text-[10px] font-mono text-[#5A2EA6] font-bold uppercase">
                  {selectedSession.branch}
                </span>
                <h3 className="font-serif text-lg font-bold text-ink">
                  {selectedSession.serviceName}
                </h3>
                <p className="text-xs text-muted">
                  Client: <strong>{selectedSession.clientName}</strong> · Specialist:{' '}
                  <strong>{selectedSession.staffName}</strong>
                </p>
              </div>

              {/* Timer Block */}
              <div className="p-3 bg-[#FAF7FF] rounded-2xl border border-purple-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5A2EA6] text-white grid place-items-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">
                    Elapsed Time
                  </span>
                  <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                    {selectedSession.elapsedMinutes}:15 / {selectedSession.durationMinutes}:00
                  </strong>
                </div>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="w-8 h-8 rounded-lg bg-white border border-purple-200 text-[#5A2EA6] grid place-items-center hover:bg-purple-50 cursor-pointer"
                >
                  {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2. Consent & Compliance Safeguard Panel */}
            <div className="p-4 rounded-xl bg-[#FCFAFF] border border-purple-100 space-y-2">
              <h4 className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider">
                Clinical Safety &amp; Consultation Verification
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-purple-50">
                  <span className="text-[10px] text-muted block">Consultation</span>
                  <strong
                    className={cn(
                      'text-[11px]',
                      selectedSession.consultationStatus === 'Completed'
                        ? 'text-emerald-700'
                        : 'text-amber-600',
                    )}
                  >
                    {selectedSession.consultationStatus === 'Completed'
                      ? '✓ Verified'
                      : '⚠ Pending'}
                  </strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-purple-50">
                  <span className="text-[10px] text-muted block">Consent &amp; Waiver</span>
                  <strong
                    className={cn(
                      'text-[11px]',
                      selectedSession.consentStatus === 'Accepted'
                        ? 'text-emerald-700'
                        : 'text-rose-600',
                    )}
                  >
                    {selectedSession.consentStatus === 'Accepted' ? '✓ Accepted' : '⚠ Pending'}
                  </strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-purple-50">
                  <span className="text-[10px] text-muted block">Patch Test</span>
                  <strong
                    className={cn(
                      'text-[11px]',
                      selectedSession.patchTestStatus === 'Completed'
                        ? 'text-emerald-700'
                        : 'text-amber-600',
                    )}
                  >
                    {selectedSession.patchTestStatus}
                  </strong>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-purple-50">
                  <span className="text-[10px] text-muted block">Before Photo</span>
                  <strong className="text-[11px] text-emerald-700">✓ Captured</strong>
                </div>
              </div>
            </div>

            {/* 3. Treatment Protocol Step Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Treatment Execution Checklist
              </h4>
              <div className="space-y-2">
                {selectedSession.checklist.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleStep(idx)}
                    className={cn(
                      'p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all text-xs',
                      step.done
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-white border-purple-100 hover:border-purple-200',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-md border flex items-center justify-center font-bold text-xs',
                          step.done
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300',
                        )}
                      >
                        {step.done && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span
                        className={cn(
                          'font-semibold',
                          step.done ? 'line-through text-emerald-800' : 'text-ink',
                        )}
                      >
                        Step {idx + 1}: {step.step}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted">
                      {step.done ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Recommendations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#FAF7FF] rounded-xl border border-purple-100 space-y-1">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Prescribed Home-Care
                </span>
                <p className="text-xs font-semibold text-ink">
                  {selectedSession.homecareRecommendation}
                </p>
              </div>
              <div className="p-3.5 bg-[#FAF7FF] rounded-xl border border-purple-100 space-y-1">
                <span className="text-[10px] text-muted uppercase font-bold block">
                  Next Visit Schedule
                </span>
                <p className="text-xs font-semibold text-[#5A2EA6]">
                  {selectedSession.nextVisitRecommendation}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-purple-50">
              {selectedSession.status === 'Consultation' && (
                <Button
                  onClick={() => handleAdvanceStatus('In Service')}
                  className="h-10 px-5 rounded-xl text-xs font-bold bg-[#5A2EA6] text-white"
                >
                  Start Treatment Session
                </Button>
              )}
              {selectedSession.status === 'In Service' && (
                <Button
                  onClick={() => handleAdvanceStatus('Completed')}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Complete Service
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDeliveryTab;
