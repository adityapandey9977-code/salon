import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  History,
  Info,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  X,
  XCircle,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface PermissionChangeAudit {
  id: string;
  dateTime: string;
  roleName: string;
  roleId: string;
  module: string;
  permission: 'View' | 'Create' | 'Edit' | 'Delete' | 'Approve' | 'Export';
  previousValue: 'Enabled' | 'Disabled';
  newValue: 'Enabled' | 'Disabled';
  changedBy: string;
  scope: string;
  status: 'Approved' | 'Pending Approval' | 'Draft' | 'Rejected';
  requestedBy: string;
  approvedBy?: string;
  reason: string;
}

export function PermissionHistoryTab() {
  const [historyLogs, setHistoryLogs] = useState<PermissionChangeAudit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedChangeForDossier, setSelectedChangeForDossier] =
    useState<PermissionChangeAudit | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (selectedChangeForDossier) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedChangeForDossier]);

  // Maker-Checker Approvals (Section 15 PRD)
  const handleApprove = (id: string) => {
    setHistoryLogs(
      historyLogs.map((h) =>
        h.id === id ? { ...h, status: 'Approved', approvedBy: 'Ananya Shah (You)' } : h,
      ),
    );
    showToast('Permission change request APPROVED successfully.');
  };

  const handleReject = (id: string) => {
    setHistoryLogs(
      historyLogs.map((h) =>
        h.id === id ? { ...h, status: 'Rejected', approvedBy: 'Ananya Shah (You)' } : h,
      ),
    );
    showToast('Permission change request REJECTED.');
  };

  const filteredHistory = historyLogs.filter((h) => {
    if (statusFilter !== 'all' && h.status !== statusFilter) return false;
    if (searchTerm) {
      const match =
        `${h.roleName} ${h.module} ${h.permission} ${h.changedBy} ${h.reason}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Change Details Dossier Modal (Section 14 PRD) */}
      {selectedChangeForDossier &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedChangeForDossier(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Maker-Checker Audit
                    </span>
                    <span className="text-xs font-mono font-bold text-soft">
                      {selectedChangeForDossier.id}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    Permission Delta Dossier
                  </h3>
                  <p className="text-xs text-muted">
                    Complete before/after comparison and justification log
                  </p>
                </div>
                <button
                  onClick={() => setSelectedChangeForDossier(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Before / After Delta Box */}
                <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#5A2EA6]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-ink">
                      {selectedChangeForDossier.roleName}
                    </strong>
                    <span className="text-[10px] font-mono text-[#5A2EA6] font-bold">
                      {selectedChangeForDossier.module} · {selectedChangeForDossier.permission}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-[9px] text-rose-700 font-bold block uppercase">
                        Previous State
                      </span>
                      <strong className="text-sm font-bold text-rose-800 block mt-0.5">
                        {selectedChangeForDossier.previousValue}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[9px] text-emerald-700 font-bold block uppercase">
                        Requested New State
                      </span>
                      <strong className="text-sm font-bold text-emerald-800 block mt-0.5">
                        {selectedChangeForDossier.newValue}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Justification */}
                <div>
                  <span className="text-soft font-bold block mb-1">
                    Stated Business Justification
                  </span>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium leading-relaxed">
                    {selectedChangeForDossier.reason}
                  </p>
                </div>

                {/* Audit Details */}
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-soft block font-semibold">Requested By</span>
                    <strong className="text-ink font-bold">
                      {selectedChangeForDossier.requestedBy}
                    </strong>
                  </div>
                  <div>
                    <span className="text-soft block font-semibold">Approval Authority</span>
                    <strong className="text-slate-800 font-bold">
                      {selectedChangeForDossier.approvedBy || 'Pending Executive Review'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-soft block font-semibold">Scope of Impact</span>
                    <span className="text-slate-800 font-semibold">
                      {selectedChangeForDossier.scope}
                    </span>
                  </div>
                  <div>
                    <span className="text-soft block font-semibold">Audit Timestamp</span>
                    <span className="text-slate-800 font-mono">
                      {selectedChangeForDossier.dateTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <Button
                  variant="outline"
                  onClick={() => setSelectedChangeForDossier(null)}
                  className="h-[36px] px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                >
                  Close Dossier
                </Button>

                {selectedChangeForDossier.status === 'Pending Approval' && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleReject(selectedChangeForDossier.id);
                        setSelectedChangeForDossier(null);
                      }}
                      className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        handleApprove(selectedChangeForDossier.id);
                        setSelectedChangeForDossier(null);
                      }}
                      className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Approve Change
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Header & Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl">
            <Search className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <input
              type="text"
              placeholder="Search history by role, module, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs font-semibold text-ink outline-none placeholder:text-muted w-60"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Approval States</option>
            <option value="Pending Approval">Pending Approval (Maker-Checker)</option>
            <option value="Approved">Approved &amp; Enforced</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <span className="text-xs text-soft font-semibold">
          {filteredHistory.length} Audit Events
        </span>
      </div>

      {/* Permission History Master Table (Section 13 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                Permission Modifications &amp; Approval History
              </h3>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Maker-checker authorization trail tracking role, module, previous state, new state,
              and approval status
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Role Name</th>
                <th className="p-3.5">Module &amp; Permission</th>
                <th className="p-3.5 text-rose-700">Previous</th>
                <th className="p-3.5 text-emerald-700 font-bold">New Value</th>
                <th className="p-3.5">Requested By</th>
                <th className="p-3.5 text-center">Maker-Checker Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] flex items-center justify-center border border-purple-200">
                        <History className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif font-bold text-ink text-base">No Audit Events Logged</h4>
                      <p className="text-xs text-muted max-w-sm">
                        {searchTerm || statusFilter !== 'all'
                          ? 'No permission modification events match your filter criteria.'
                          : 'No permission changes or pending approvals have been logged yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-mono text-[11px] text-slate-800">
                    {h.dateTime}
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-bold text-ink text-xs">
                    {h.roleName}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-[#5A2EA6] block">{h.module}</span>
                    <span className="text-[10px] text-muted font-mono">{h.permission}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-rose-700 font-mono font-semibold">
                    {h.previousValue}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-emerald-700 font-mono font-bold">
                    {h.newValue}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 text-[11px]">
                    <span className="font-semibold block">{h.requestedBy}</span>
                    <span className="text-[9px] text-muted">{h.scope}</span>
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        h.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : h.status === 'Pending Approval'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200',
                      )}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedChangeForDossier(h)}
                        className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </Button>

                      {h.status === 'Pending Approval' && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => handleApprove(h.id)}
                            className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleReject(h.id)}
                            className="h-[28px] px-2 rounded-lg text-[10px] font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
                            title="Reject Request"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
