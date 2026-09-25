import { Button, cn } from '@salon-spa-saas/ui';
import { Check, Copy, Download, Eye, Filter, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { type AuditLogItem, InspectAuditTraceModal } from '../components/InspectAuditTraceModal';
import { useSuperAdminStore } from '../context/SuperAdminContext';
import { auditApi } from '../../../shared/api/audit.api';

export function AuditLogsPage() {
  const { auditLogs, isLoadingAuditLogs, fetchAuditLogs } = useSuperAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [inspectingLog, setInspectingLog] = useState<AuditLogItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAuditLogs();
    setIsRefreshing(false);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (log.action && log.action.toLowerCase().includes(q)) ||
        (log.user && log.user.toLowerCase().includes(q)) ||
        (log.resource && log.resource.toLowerCase().includes(q)) ||
        (log.id && log.id.toLowerCase().includes(q)) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [auditLogs, searchQuery, categoryFilter]);

  const handleCopy = (log: AuditLogItem) => {
    const text = JSON.stringify(log, null, 2);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(log.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportCSV = async () => {
    try {
      // First try calling backend export endpoint
      const result = await auditApi.export({
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        search: searchQuery || undefined,
      });

      if (result && result.csvData) {
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + result.csvData);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `audit_logs_archive_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
    } catch {
      // Fallback to local table export
    }

    const headers = [
      'Trace ID',
      'Timestamp',
      'Event Action',
      'Operator User',
      'Target Resource',
      'Category',
      'IP Address',
    ];
    const rows = filteredLogs.map((l) => [
      l.id || 'N/A',
      l.timestamp,
      l.action,
      l.user,
      `"${l.resource.replace(/"/g, '""')}"`,
      l.category || 'General',
      l.ipAddress || '127.0.0.1',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `audit_logs_archive_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Audit Logs
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Global platform system-wide security operations and immutable audit trail logs.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoadingAuditLogs || isRefreshing}
            className="h-[40px] px-3.5 rounded-xl text-xs font-semibold border-[#5A2EA6]/20 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={cn('w-4 h-4', (isLoadingAuditLogs || isRefreshing) && 'animate-spin')} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="h-[40px] px-4 rounded-xl text-xs font-semibold border-[#5A2EA6]/30 text-[#5A2EA6] bg-white hover:bg-[#5A2EA6]/5 flex items-center gap-2 shadow-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Logs Archive</span>
          </Button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/10 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search audit logs by operator, action or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Event Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-[34px] px-3 rounded-lg border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
          >
            <option value="All">All Categories</option>
            <option value="Tenant">Tenant Operations</option>
            <option value="Billing">Billing & Subscription</option>
            <option value="Security">Security & API Keys</option>
            <option value="User">User RBAC Governance</option>
          </select>
        </div>
      </div>

      {/* Audit Trail Database Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Audit Trail Database
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Real-time system events logging logbook with immutable audit signatures
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredLogs.length} Events Logged
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {['Timestamp', 'Event Action', 'Operator User', 'Target Resource', 'Actions'].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-4 font-bold text-[10px] tracking-wider uppercase',
                          i === 0 ? 'pl-6' : i === 4 ? 'pr-6 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {isLoadingAuditLogs && filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#5A2EA6]" />
                        <span>Loading live audit trail records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted">
                      <div className="flex flex-col items-center justify-center py-4">
                        <ShieldCheck className="w-8 h-8 text-[#5A2EA6]/40 mb-2" />
                        <span className="font-medium text-xs text-ink">No audit logs found</span>
                        <span className="text-[11px] text-muted mt-0.5">
                          {searchQuery || categoryFilter !== 'All'
                            ? 'Try clearing filters or search query'
                            : 'Perform platform operations to populate the audit trail'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                      <td className="p-4 pl-6 font-mono text-[11.5px] text-soft">{log.timestamp}</td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-ink">{log.user}</td>
                      <td className="p-4 font-semibold">{log.resource}</td>

                      {/* Action buttons */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Trace Modal */}
                          <button
                            onClick={() => setInspectingLog(log)}
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                            title="Inspect Complete Audit Trace & Diff Payload"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Copy Event Action */}
                          <button
                            onClick={() => handleCopy(log)}
                            className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                            title="Copy Event Trace JSON"
                          >
                            {copiedId === log.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
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

      {/* Inspect Audit Trace Modal */}
      <InspectAuditTraceModal
        isOpen={!!inspectingLog}
        onClose={() => setInspectingLog(null)}
        log={inspectingLog}
      />
    </div>
  );
}

