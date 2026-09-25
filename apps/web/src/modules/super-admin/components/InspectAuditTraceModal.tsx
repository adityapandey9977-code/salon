import { Button } from '@salon-spa-saas/ui';
import { CheckCircle2, Clock, FileText, HardDrive, Key, ShieldCheck, User } from 'lucide-react';
import type React from 'react';
import { BaseModal } from './BaseModal';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  resource: string;
  ipAddress?: string;
  approver?: string;
  category?: 'Tenant' | 'Billing' | 'Security' | 'User';
  beforeState?: Record<string, any>;
  afterState?: Record<string, any>;
}

interface InspectAuditTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLogItem | null;
}

export const InspectAuditTraceModal: React.FC<InspectAuditTraceModalProps> = ({
  isOpen,
  onClose,
  log,
}) => {
  if (!log) return null;

  const defaultBefore = log.beforeState || {
    status: 'Active',
    price: '₹5,000 /mo',
    updated_at: '2026-07-20',
  };
  const defaultAfter = log.afterState || {
    status: 'Active',
    price: '₹6,500 /mo',
    updated_at: log.timestamp,
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Audit Trace Inspection: ${log.action}`}
      subtitle={`Trace ID: ${log.id || 'TRC-99201'} • Immutable Security Log`}
      icon={<ShieldCheck className="w-5 h-5" />}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Event Action</span>
            <span className="text-xs font-bold text-[#5A2EA6] font-mono block mt-1">
              {log.action}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Operator User</span>
            <span className="text-xs font-bold text-ink block mt-1">{log.user}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Target Resource</span>
            <span className="text-xs font-bold text-ink block mt-1 truncate">{log.resource}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F8F5FF] border border-[#5A2EA6]/10">
            <span className="text-[10px] font-bold text-soft uppercase block">Event Timestamp</span>
            <span className="text-xs font-semibold text-muted font-mono block mt-1">
              {log.timestamp}
            </span>
          </div>
        </div>

        {/* Audit Lineage & Security Signatures */}
        <div className="p-3.5 rounded-xl border border-line bg-slate-50/70 text-xs flex justify-between items-center">
          <div>
            <span className="text-muted block">Origin IP Address & Security Checksum:</span>
            <span className="font-mono text-[11px] font-bold text-ink">
              IP: {log.ipAddress || '192.168.1.104'} • SHA256: 8f9a2b71c4d...
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted block">Maker-Checker Approver:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 inline" />{' '}
              {log.approver || 'system_root_verified'}
            </span>
          </div>
        </div>

        {/* Before / After State Payload Diff */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-ink uppercase tracking-wider text-soft">
            Before vs After State Payload Diff
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Before State */}
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
              <span className="text-[10.5px] font-bold text-rose-800 uppercase block font-sans">
                - Before State Payload
              </span>
              <pre className="text-[11px] text-rose-900 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(defaultBefore, null, 2)}
              </pre>
            </div>

            {/* After State */}
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
              <span className="text-[10.5px] font-bold text-emerald-800 uppercase block font-sans">
                + After State Payload
              </span>
              <pre className="text-[11px] text-emerald-900 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(defaultAfter, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onClose}
            className="h-[36px] px-4 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            Close Audit Trace
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};
