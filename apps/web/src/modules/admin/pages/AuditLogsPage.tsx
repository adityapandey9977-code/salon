import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  Activity,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  History,
  Layers,
  Lock,
  Search,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface BrandAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetModule:
    | 'Pricing'
    | 'Discounts'
    | 'Staff'
    | 'Inventory'
    | 'Finance'
    | 'Customer'
    | 'Security';
  branchLocation: string;
  ipAddress: string;
  details: string;
  beforeValue?: string;
  afterValue?: string;
}

const initialAuditLogs: BrandAuditLog[] = [
  {
    id: 'LOG-88491',
    timestamp: '2026-08-17 14:45:10',
    actor: 'Ananya Shah (HQ Admin)',
    actorRole: 'Super Director',
    action: 'SERVICE_PRICE_MODIFIED',
    targetModule: 'Pricing',
    branchLocation: 'All Branches (HQ Policy)',
    ipAddress: '103.21.124.8',
    details: 'Updated base pricing for "HydraFacial Deluxe" across Bhopal & Indore branches.',
    beforeValue: 'Base Price: ₹3,200',
    afterValue: 'Base Price: ₹3,600',
  },
  {
    id: 'LOG-88490',
    timestamp: '2026-08-17 14:12:30',
    actor: 'Rajiv Mehra',
    actorRole: 'Branch Manager',
    action: 'OVERRIDE_DISCOUNT_APPROVED',
    targetModule: 'Discounts',
    branchLocation: 'Indrapuri · Bhopal',
    ipAddress: '192.168.10.45',
    details: 'Maker-Checker approval: 25% VIP promotional discount on Invoice #INV-9902.',
    beforeValue: 'Invoice Amount: ₹6,400 (0% disc)',
    afterValue: 'Invoice Amount: ₹4,800 (25% disc approved)',
  },
  {
    id: 'LOG-88489',
    timestamp: '2026-08-17 13:30:15',
    actor: 'Sunita Roy',
    actorRole: 'Procurement Officer',
    action: 'WASTAGE_ADJUSTMENT_POSTED',
    targetModule: 'Inventory',
    branchLocation: 'Arera Colony · Bhopal',
    ipAddress: '192.168.12.19',
    details: "Approved 250ml L'Oreal Inoa Color developer shrinkage due to seal compromise.",
    beforeValue: 'Stock Balance: 14 units',
    afterValue: 'Stock Balance: 13 units (1 unit damaged)',
  },
  {
    id: 'LOG-88488',
    timestamp: '2026-08-17 11:05:00',
    actor: 'Ananya Shah (HQ Admin)',
    actorRole: 'Super Director',
    action: 'FRANCHISE_ROYALTY_SETTLED',
    targetModule: 'Finance',
    branchLocation: 'Pune Koregaon Unit',
    ipAddress: '103.21.124.8',
    details: 'Generated monthly royalty receipt for Franchise #FR-003.',
    beforeValue: 'Settlement Status: Pending',
    afterValue: 'Settlement Status: Settled (₹2,56,500)',
  },
  {
    id: 'LOG-88487',
    timestamp: '2026-08-17 09:40:22',
    actor: 'Pooja Verma',
    actorRole: 'Front Desk Lead',
    action: 'CUSTOMER_PROFILE_MERGED',
    targetModule: 'Customer',
    branchLocation: 'Indrapuri · Bhopal',
    ipAddress: '192.168.10.22',
    details: 'De-duplicated customer profiles CUST-1049 & CUST-1082 under primary ID CUST-1049.',
    beforeValue: '2 Duplicate Client Records',
    afterValue: '1 Merged Client Record',
  },
  {
    id: 'LOG-88486',
    timestamp: '2026-08-16 18:22:10',
    actor: 'Karan Joshi',
    actorRole: 'Branch Manager',
    action: 'CASHIER_DAY_CLOSED',
    targetModule: 'Finance',
    branchLocation: 'Indore MG Road',
    ipAddress: '192.168.15.11',
    details:
      'Completed daily drawer closure (Z-Report). Total collection ₹48,920 with ₹0 variance.',
    beforeValue: 'Drawer Status: Open',
    afterValue: 'Drawer Status: Closed & Reconciled',
  },
];

export function AuditLogsPage() {
  const { toast } = useToast();
  const [logs] = useState<BrandAuditLog[]>(initialAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [selectedLog, setSelectedLog] = useState<BrandAuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.branchLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = moduleFilter === 'All' || log.targetModule === moduleFilter;
      return matchesSearch && matchesModule;
    });
  }, [logs, searchQuery, moduleFilter]);

  const handleExport = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Actor',
      'Role',
      'Action',
      'Module',
      'Location',
      'Details',
    ];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.actor}"`,
      l.actorRole,
      l.action,
      l.targetModule,
      `"${l.branchLocation}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `brand_owner_audit_logs_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast(`Downloaded ${filteredLogs.length} audit trail records as CSV.`);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[11px] font-bold tracking-wide uppercase mb-1.5 border border-[#5A2EA6]/20">
            <History className="w-3.5 h-3.5" />
            <span>Immutable Governance Audit Trail</span>
          </div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            System &amp; Brand Audit Logs
          </h1>
          <p className="text-[13px] text-muted mt-0.5">
            Cryptographically sealed timeline of price overrides, discount approvals, cashier
            closures, and data access.
          </p>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          className="h-[40px] px-4 rounded-xl text-xs font-semibold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Archive</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search audit trail by actor, action, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Filter Module:</span>
          {['All', 'Pricing', 'Discounts', 'Inventory', 'Finance', 'Customer'].map((mod) => (
            <button
              key={mod}
              onClick={() => setModuleFilter(mod)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                moduleFilter === mod
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
              )}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Activity &amp; Operational Ledger
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Real-time chronological events log with previous vs current values
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredLogs.length} Events Recorded
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Timestamp & ID',
                  'Operator / Actor',
                  'Action Event',
                  'Module Scope',
                  'Branch / Location',
                  'Event Summary',
                  'Inspect',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-4 font-bold text-[10px] tracking-wider uppercase',
                      i === 0 ? 'pl-6' : i === 6 ? 'pr-6 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                  <td className="p-4 pl-6">
                    <div className="font-mono text-[11.5px] font-bold text-ink">{log.id}</div>
                    <div className="text-[10px] text-muted">{log.timestamp}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-ink">{log.actor}</div>
                    <div className="text-[10px] text-purple-700 font-semibold">{log.actorRole}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-[#5A2EA6]/10 text-[#5A2EA6]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-ink text-[11.5px]">{log.targetModule}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-soft text-[11.5px] font-medium">
                      {log.branchLocation}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-[11.5px] text-ink line-clamp-2">{log.details}</div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] inline-flex items-center justify-center transition-colors cursor-pointer border-0"
                      title="Inspect Full Audit Record"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal (Portaled to document.body) */}
      {selectedLog &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Audit Record Details
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5 font-mono">
                    {selectedLog.id} · {selectedLog.timestamp}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(JSON.stringify(selectedLog, null, 2));
                      toast('Audit payload copied to clipboard.');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#5A2EA6] text-xs font-semibold transition-colors cursor-pointer border border-purple-100 flex items-center gap-1"
                    title="Copy JSON"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Payload</span>
                  </button>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto custom-scroll">
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Immutable audit ledger record for regulatory compliance, data traceability, and
                  security monitoring.
                </div>

                <div className="grid grid-cols-2 gap-3.5 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">
                      Operator User
                    </span>
                    <strong className="text-ink text-[13px]">{selectedLog.actor}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">
                      Role Authority
                    </span>
                    <strong className="text-[#5A2EA6] text-[13px]">{selectedLog.actorRole}</strong>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">
                      Origin IP Address
                    </span>
                    <span className="font-mono text-soft text-[11px]">{selectedLog.ipAddress}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-bold">
                      Location Scope
                    </span>
                    <span className="text-soft text-[11px]">{selectedLog.branchLocation}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] block uppercase tracking-wider mb-1.5">
                    Event Description
                  </label>
                  <div className="p-3.5 bg-[#FCFAFF] rounded-xl border border-purple-100 text-xs text-ink leading-relaxed font-medium">
                    {selectedLog.details}
                  </div>
                </div>

                {selectedLog.beforeValue && selectedLog.afterValue && (
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100">
                      <span className="text-rose-700 text-[10px] font-bold uppercase block mb-1">
                        State Before
                      </span>
                      <div className="text-[11.5px] font-medium text-rose-900">
                        {selectedLog.beforeValue}
                      </div>
                    </div>
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="text-emerald-700 text-[10px] font-bold uppercase block mb-1">
                        State After
                      </span>
                      <div className="text-[11.5px] font-medium text-emerald-900">
                        {selectedLog.afterValue}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-end border-t border-purple-50">
                  <Button
                    onClick={() => setSelectedLog(null)}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Close Audit Record
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default AuditLogsPage;
