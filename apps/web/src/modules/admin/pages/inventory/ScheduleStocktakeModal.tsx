import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  EyeOff,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { masterBranches } from '../locations/AllBranchesTab';
import type { StocktakeSession } from './StocktakeTab';

export interface ScheduleStocktakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (session: StocktakeSession) => void;
  defaultBranch?: string;
  lockBranch?: boolean;
}

const AUDIT_TYPES = [
  {
    label: 'Full Store Comprehensive Audit',
    desc: 'All retail SKUs, professional backwash consumables & equipment',
    defaultSkus: 280,
    defaultBookQty: 4500,
  },
  {
    label: 'High-Value Category Cycle Count',
    desc: 'Colour tubes, high-ticket retail treatments & serums',
    defaultSkus: 85,
    defaultBookQty: 1200,
  },
  {
    label: 'Fast-Moving Consumables Spot Check',
    desc: 'Shampoos, conditioners, developers & waxing supplies',
    defaultSkus: 60,
    defaultBookQty: 950,
  },
  {
    label: 'Quarterly Financial Valuation Audit',
    desc: 'Mandatory fiscal quarter end reconciliations for accounting',
    defaultSkus: 320,
    defaultBookQty: 5200,
  },
];

const AUDITOR_ROLES = [
  'Internal Store Auditor',
  'Floor Manager',
  'Branch Manager',
  'Head Office Inventory Controller',
  'External Certified Auditor',
];

export function ScheduleStocktakeModal({
  isOpen,
  onClose,
  onSave,
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: ScheduleStocktakeModalProps) {
  const [branchId, setBranchId] = useState(masterBranches[0]?.id || 'BR-01');
  const [auditDate, setAuditDate] = useState('2026-08-28');
  const [timeWindow, setTimeWindow] = useState('After Hours (09:00 PM - 11:30 PM)');
  const [auditTypeIndex, setAuditTypeIndex] = useState(0);
  const [countingMode, setCountingMode] = useState<'Blind Count' | 'Visible Book Count'>(
    'Blind Count',
  );
  const [freezePOS, setFreezePOS] = useState(true);
  const [leadAuditor, setLeadAuditor] = useState('Sunil Rao');
  const [auditorRole, setAuditorRole] = useState(AUDITOR_ROLES[0]);
  const [witnessName, setWitnessName] = useState('Kunal Sen (Floor Manager)');
  const [instructions, setInstructions] = useState(
    'Verify all open chemical tubes and unsealed retail packaging before logging count.',
  );

  const selectedBranch = masterBranches.find((b) => b.id === branchId) || masterBranches[0];
  const currentAuditType = AUDIT_TYPES[auditTypeIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadAuditor.trim()) {
      alert('Please provide lead auditor name.');
      return;
    }

    const auditId = `STK-AUDIT-AUG26-${Math.floor(10 + Math.random() * 90)}`;
    const formattedDate =
      new Date(auditDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) || '28 Aug 2026';

    const newSession: StocktakeSession = {
      id: auditId,
      branchName: selectedBranch.name,
      branchId: selectedBranch.id,
      auditDate: formattedDate,
      itemsCounted: currentAuditType.defaultSkus,
      expectedQuantity: currentAuditType.defaultBookQty,
      actualQuantity: currentAuditType.defaultBookQty, // Scheduled baseline
      varianceQuantity: 0,
      varianceValue: '₹0',
      conductedBy: leadAuditor.trim(),
      auditorRole,
      status: 'Planned',
      notes: `${currentAuditType.label} (${countingMode}). ${instructions.trim()}`,
      itemDiscrepancies: [],
    };

    onSave(newSession);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#2D1552]/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#5A2EA6]/25 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#5A2EA6]/15 flex items-start justify-between gap-4 bg-gradient-to-r from-[#FAF7FF] via-[#F5EFFF] to-[#FAF7FF] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A2EA6] text-white flex items-center justify-center shadow-md shadow-[#5A2EA6]/20 shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                PHYSICAL INVENTORY AUDIT DESK
              </span>
              <h2 className="font-serif font-bold text-ink text-lg sm:text-xl leading-tight mt-0.5">
                Schedule Physical Stocktake &amp; Cycle Count
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 grid place-items-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Branch & Schedule Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 p-4 rounded-2xl bg-[#FCFAFF] border border-purple-100">
            <div className="sm:col-span-6">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Target Salon Outlet / Location *
              </label>
              {lockBranch ? (
                <input
                  type="text"
                  disabled
                  value={defaultBranch}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-slate-100 text-xs font-bold text-slate-700 cursor-not-allowed"
                />
              ) : (
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  {masterBranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Scheduled Audit Date *
              </label>
              <input
                type="date"
                required
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1">
                Audit Time Window
              </label>
              <select
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
              >
                <option value="After Hours (09:00 PM - 11:30 PM)">
                  After Hours (09:00 PM - 11:30 PM)
                </option>
                <option value="Early Morning (07:30 AM - 09:30 AM)">
                  Early Morning (07:30 AM - 09:30 AM)
                </option>
                <option value="Mid-Day Cycle Count (02:00 PM - 04:00 PM)">
                  Mid-Day Cycle Count (02:00 PM - 04:00 PM)
                </option>
                <option value="Full Day Closed Audit (09:00 AM - 06:00 PM)">
                  Full Day Closed Audit (09:00 AM - 06:00 PM)
                </option>
              </select>
            </div>
          </div>

          {/* 2. Audit Type & Scope Selection */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-ink uppercase tracking-wider block">
              Select Audit Type &amp; Scope
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AUDIT_TYPES.map((type, idx) => {
                const isSelected = auditTypeIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAuditTypeIndex(idx)}
                    className={cn(
                      'p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between',
                      isSelected
                        ? 'bg-[#F8F5FF] border-[#5A2EA6] shadow-sm'
                        : 'bg-white border-slate-200 hover:border-purple-200',
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <strong
                        className={cn(
                          'text-xs block font-bold',
                          isSelected ? 'text-[#5A2EA6]' : 'text-ink',
                        )}
                      >
                        {type.label}
                      </strong>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#5A2EA6] shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted mt-1 leading-snug">{type.desc}</p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-soft font-medium">Estimated Scope:</span>
                      <strong className="text-slate-700 font-bold">
                        {type.defaultSkus} SKUs · ~{type.defaultBookQty} Units
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Verification Protocol & Counting Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                Counting Methodology
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCountingMode('Blind Count')}
                  className={cn(
                    'flex-1 p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer',
                    countingMode === 'Blind Count'
                      ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
                  )}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Blind Count</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCountingMode('Visible Book Count')}
                  className={cn(
                    'flex-1 p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer',
                    countingMode === 'Visible Book Count'
                      ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
                  )}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Visible Count</span>
                </button>
              </div>
              <p className="text-[10.5px] text-muted">
                {countingMode === 'Blind Count'
                  ? 'Auditor counts without seeing system quantities (industry best practice to prevent bias).'
                  : 'Auditor compares live counts directly against system quantities.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                Inventory Lockdown &amp; Freeze
              </span>
              <label className="flex items-center gap-2.5 cursor-pointer p-2 bg-purple-50/50 rounded-xl border border-purple-100">
                <input
                  type="checkbox"
                  checked={freezePOS}
                  onChange={(e) => setFreezePOS(e.target.checked)}
                  className="rounded text-[#5A2EA6] focus:ring-[#5A2EA6] w-4 h-4"
                />
                <div>
                  <strong className="text-xs font-bold text-ink block flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#5A2EA6]" />
                    <span>Freeze POS Dispensing &amp; Inwarding</span>
                  </strong>
                  <span className="text-[10px] text-muted block">
                    Prevents variance noise during physical count
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Auditor Team Assignment */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
              Auditor Team &amp; Dual-Sign-off Assignment
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Lead Auditor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunil Rao"
                  value={leadAuditor}
                  onChange={(e) => setLeadAuditor(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Auditor Designation
                </label>
                <select
                  value={auditorRole}
                  onChange={(e) => setAuditorRole(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                >
                  {AUDITOR_ROLES.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Secondary Witness / Counter-Sign
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kunal Sen (Floor Manager)"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>

              <div className="sm:col-span-12">
                <label className="text-[10px] font-bold text-soft uppercase block mb-1">
                  Audit Checklist Notes &amp; Special Directives
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Directives for weighing open bottles, checking seal intactness..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 rounded-b-3xl">
          <span className="text-xs text-muted font-medium">
            Audit protocol creates an active counting worksheet accessible on auditor tablets.
          </span>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-10 px-4 rounded-xl text-xs font-bold border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>

            <button
              type="button"
              onClick={handleSubmit}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md shadow-[#5A2EA6]/25 transition-all flex items-center gap-2 cursor-pointer border-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm &amp; Schedule Stocktake</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
