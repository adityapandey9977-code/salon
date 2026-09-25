import { Button, cn } from '@salon-spa-saas/ui';
import {
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Eye,
  FileText,
  Filter,
  History,
  Percent,
  Search,
  ShieldCheck,
  Sliders,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

interface AuditEntry {
  id: string;
  dateTime: string;
  settingName: string;
  category:
    | 'Pricing'
    | 'Tax & GST'
    | 'Discount Policy'
    | 'Permissions'
    | 'Working Hours'
    | 'Brand Controls';
  previousValue: string;
  newValue: string;
  changedBy: string;
  scope: 'Brand-wide' | 'Branch-specific';
  branch?: string;
  ipAddress: string;
}

const initialAuditLogs: AuditEntry[] = [
  {
    id: 'AUD-001',
    dateTime: '18 Aug 2026, 10:14 AM',
    settingName: 'Discretionary Cashier Max Discount',
    category: 'Discount Policy',
    previousValue: '15% per invoice',
    newValue: '10% Max Cashier Limit (>15% Requires Manager PIN)',
    changedBy: 'Ananya Shah (Super Director)',
    scope: 'Brand-wide',
    ipAddress: '103.21.144.12',
  },
  {
    id: 'AUD-002',
    dateTime: '16 Aug 2026, 04:30 PM',
    settingName: 'Pricing Override on Signature Balayage',
    category: 'Pricing',
    previousValue: '₹4,500 (Shared Master)',
    newValue: '₹5,200 (+15.5% Tier Surcharge)',
    changedBy: 'Rahul Sharma (CFO)',
    scope: 'Branch-specific',
    branch: 'Indore - Palasia Premium',
    ipAddress: '103.21.144.18',
  },
  {
    id: 'AUD-003',
    dateTime: '14 Aug 2026, 11:20 AM',
    settingName: 'Branch Manager Role Export Permission',
    category: 'Permissions',
    previousValue: 'Export: Disabled',
    newValue: 'Export: Enabled for Client & Staff Lists',
    changedBy: 'Priya Patel (Legal / HR)',
    scope: 'Brand-wide',
    ipAddress: '103.21.144.12',
  },
  {
    id: 'AUD-004',
    dateTime: '10 Aug 2026, 02:45 PM',
    settingName: 'Sunday Operating Hours Extension',
    category: 'Working Hours',
    previousValue: '10:00 AM - 09:00 PM',
    newValue: '09:00 AM - 10:00 PM (Weekend Bridal Window)',
    changedBy: 'Amit Deshmukh (Operations)',
    scope: 'Brand-wide',
    ipAddress: '103.21.144.25',
  },
  {
    id: 'AUD-005',
    dateTime: '05 Aug 2026, 09:15 AM',
    settingName: 'Home & Bridal Concierge Feature Toggle',
    category: 'Brand Controls',
    previousValue: 'Enabled',
    newValue: 'Disabled (Soft Hiding without Deleting Records)',
    changedBy: 'Ananya Shah (Super Director)',
    scope: 'Brand-wide',
    ipAddress: '103.21.144.12',
  },
  {
    id: 'AUD-006',
    dateTime: '01 Aug 2026, 12:00 PM',
    settingName: 'GST SAC Code Hairdressing Mapping',
    category: 'Tax & GST',
    previousValue: '999719',
    newValue: '999721 (Official CBIC Salon Standard)',
    changedBy: 'Rahul Sharma (CFO)',
    scope: 'Brand-wide',
    ipAddress: '103.21.144.18',
  },
];

export function AuditHistoryTab() {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(initialAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (searchTerm) {
      const match =
        `${log.settingName} ${log.changedBy} ${log.category} ${log.newValue}`.toLowerCase();
      return match.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#5A2EA6]" />
            <h2 className="font-serif font-bold text-ink text-lg">
              Configuration Change History &amp; Audit Trail
            </h2>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Immutable log of all material changes to pricing, tax rules, cashier discounts,
            permissions, and business policies
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl">
            <Search className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs font-semibold text-ink outline-none placeholder:text-muted w-44"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Change Categories</option>
            <option value="Pricing">Pricing Overrides</option>
            <option value="Discount Policy">Discount Policy</option>
            <option value="Permissions">Role Permissions</option>
            <option value="Working Hours">Working Hours</option>
            <option value="Brand Controls">Brand Controls</option>
            <option value="Tax & GST">Tax &amp; GST Rules</option>
          </select>
        </div>
      </div>

      {/* Audit Log Master Table (Section 11 PRD) */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <h3 className="font-serif font-bold text-ink text-base">
              Configuration Audit Trail Ledger
            </h3>
            <p className="text-[11px] text-muted mt-0.5">
              Read-only record tracking configuration changes with author identity, timestamp,
              scope, and values
            </p>
          </div>
          <span className="text-xs text-soft font-semibold">
            {filteredLogs.length} Logged Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Setting / Parameter</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-rose-700">Previous Value</th>
                <th className="p-3.5 text-emerald-700 font-bold">New Updated Value</th>
                <th className="p-3.5">Changed By</th>
                <th className="p-3.5 pr-5 text-right">Scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap font-mono text-[11px] text-slate-800">
                    {log.dateTime}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{log.settingName}</strong>
                    <span className="text-[9px] font-mono text-muted">IP: {log.ipAddress}</span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-200">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-rose-700 font-mono text-[11px] max-w-xs truncate">
                    {log.previousValue}
                  </td>
                  <td className="p-3.5 text-emerald-700 font-mono font-bold text-[11px] max-w-xs truncate">
                    {log.newValue}
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-slate-800 text-[11px] font-semibold">
                    {log.changedBy}
                  </td>
                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        log.scope === 'Brand-wide'
                          ? 'bg-purple-50 text-[#5A2EA6] border-purple-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200',
                      )}
                    >
                      {log.scope}
                      {log.branch && ` (${log.branch.split(' - ')[1] || log.branch})`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
