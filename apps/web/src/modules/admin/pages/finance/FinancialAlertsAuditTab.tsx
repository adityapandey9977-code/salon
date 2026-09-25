import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  History,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
} from 'lucide-react';
import React, { useState } from 'react';

export interface FinancialAlert {
  id: string;
  type: string;
  branch: string;
  branchId: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  description: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
  actionLabel: string;
}

export interface FinancialAuditItem {
  id: string;
  user: string;
  userRole: string;
  action: string;
  module: 'Price Changes' | 'Discounts' | 'Refunds' | 'Credits' | 'Commissions' | 'Settlement';
  record: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
  reason: string;
  approver: string;
}

export const initialAlerts: FinancialAlert[] = [
  {
    id: 'ALT-101',
    type: 'High Refund Rate Notice',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    severity: 'High',
    date: '18 Aug 2026, 14:15',
    description:
      'Gwalior branch refund rate reached 2.99% (Threshold is 3.00%). 2 refunds triggered by stylist sudden leave.',
    status: 'Active',
    actionLabel: 'Inspect Refunds',
  },
  {
    id: 'ALT-102',
    type: 'Commission Pending Approval',
    branch: 'Indore Central (Flagship)',
    branchId: 'BR-01',
    severity: 'Medium',
    date: '18 Aug 2026, 11:35',
    description:
      'Vikram Joshi (Master Stylist) crossed 115% milestone; bonus tier ₹6,900 awaiting Director approval.',
    status: 'Active',
    actionLabel: 'Review Commission',
  },
  {
    id: 'ALT-103',
    type: 'Settlement Pending Manager Sign-off',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    severity: 'Medium',
    date: '18 Aug 2026, 09:00',
    description:
      'Fortnight 1 settlement (₹5,97,000) waiting for branch manager reconciliation clearance.',
    status: 'Active',
    actionLabel: 'View Settlement',
  },
  {
    id: 'ALT-104',
    type: 'Settlement On Hold (Discrepancy)',
    branch: 'Gwalior City Centre',
    branchId: 'BR-05',
    severity: 'Critical',
    date: '17 Aug 2026, 16:30',
    description:
      'Cash drawer discrepancy of ₹32,500 detected between physical cash & POS slip count.',
    status: 'Active',
    actionLabel: 'Audit Drawer',
  },
  {
    id: 'ALT-105',
    type: 'Outstanding Corporate Collection',
    branch: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    severity: 'Low',
    date: '18 Aug 2026, 14:05',
    description: 'Corporate membership invoice for ₹20,060 issued on 30-day payment terms.',
    status: 'Acknowledged',
    actionLabel: 'Track Invoice',
  },
];

export const initialAuditLogs: FinancialAuditItem[] = [
  {
    id: 'AUD-9912',
    user: 'Ananya Shah',
    userRole: 'Brand Owner / Super Director',
    action: 'Refund Authorization',
    module: 'Refunds',
    record: 'REF-2026-081 (Kavita Saxena)',
    oldValue: 'Status: Requested',
    newValue: 'Status: Approved (₹3,717 Full Reversal)',
    timestamp: '18 Aug 2026, 14:02',
    reason: 'Client satisfaction guarantee protocol applied',
    approver: 'Self-Authorized (Director Level)',
  },
  {
    id: 'AUD-9911',
    user: 'Deepak Verma',
    userRole: 'Pricing Director (HQ)',
    action: 'Service Price Update',
    module: 'Price Changes',
    record: 'SRV-042 (Keratin Silk Therapy)',
    oldValue: 'Base: ₹6,500',
    newValue: 'Base: ₹7,200 (+10.7%)',
    timestamp: '17 Aug 2026, 18:30',
    reason: 'Updated premium formaldehyde-free formula cost adjustment',
    approver: 'Ananya Shah (HQ Approval #889)',
  },
  {
    id: 'AUD-9910',
    user: 'Rajesh Nair',
    userRole: 'Indore Branch Manager',
    action: 'Discount Override',
    module: 'Discounts',
    record: 'INV-2026-8809 (VIP Client)',
    oldValue: 'Standard VIP: 10%',
    newValue: 'Special Courtesy: 20% (-₹1,400)',
    timestamp: '17 Aug 2026, 15:45',
    reason: 'Service delay apology courtesy discount approved on floor',
    approver: 'Branch Manager Indore',
  },
  {
    id: 'AUD-9909',
    user: 'Kavita Joshi',
    userRole: 'Storekeeper Vijay Nagar',
    action: 'Credit Note Issuance',
    module: 'Credits',
    record: 'CRN-2026-0045 (Sneha Patel)',
    oldValue: 'Unredeemed Cash Slip',
    newValue: 'Store Credit: ₹2,500 (180 Days)',
    timestamp: '17 Aug 2026, 17:15',
    reason: 'Sealed Olaplex retail product exchange return',
    approver: 'POS Rule Engine',
  },
  {
    id: 'AUD-9908',
    user: 'Finance Gateway Sync',
    userRole: 'Automated System',
    action: 'Settlement Payout Dispatch',
    module: 'Settlement',
    record: 'SET-2026-081 (Indore Central)',
    oldValue: 'Status: Processing',
    newValue: 'Status: Settled (₹13,53,000 NEFT)',
    timestamp: '16 Aug 2026, 11:30',
    reason: 'Fortnight 1 scheduled automated payout batch',
    approver: 'Finance Panel Cron',
  },
];

export function FinancialAlertsAuditTab() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<FinancialAlert[]>(initialAlerts);
  const [auditLogs, setAuditLogs] = useState<FinancialAuditItem[]>(initialAuditLogs);
  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'audit'>('alerts');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedAuditModule, setSelectedAuditModule] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getSeverityBadge = (sev: FinancialAlert['severity']) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Resolved' } : a)));
    toast(`Financial alert ${id} marked as resolved.`);
  };

  // Filters
  const filteredAlerts = alerts.filter((a) => {
    const matchesSev =
      selectedSeverity === 'all' || a.severity.toLowerCase() === selectedSeverity.toLowerCase();
    const matchesSearch =
      a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.branch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const filteredAudit = auditLogs.filter((log) => {
    const matchesMod =
      selectedAuditModule === 'all' ||
      log.module.toLowerCase() === selectedAuditModule.toLowerCase();
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.record.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMod && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Filter Bar & Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'alerts'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'bg-slate-100 text-soft hover:text-ink',
            )}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Financial Risk Alerts</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold ml-0.5 whitespace-nowrap inline-flex items-center">
              {alerts.filter((a) => a.status === 'Active').length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubTab === 'audit'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'bg-slate-100 text-soft hover:text-ink',
            )}
          >
            <History className="w-3.5 h-3.5" />
            <span>Immutable Financial Audit Trail</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast(
                `Exporting ${activeSubTab === 'alerts' ? 'Financial Alerts Register' : 'Audit Trail Ledger'} (CSV)...`,
              )
            }
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Register</span>
          </Button>
        </div>
      </div>

      {activeSubTab === 'alerts' ? (
        /* SECTION 19: FINANCIAL ALERTS */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border whitespace-nowrap inline-flex items-center',
                        getSeverityBadge(alert.severity),
                      )}
                    >
                      {alert.severity} Risk
                    </span>
                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.date}
                    </span>
                  </div>

                  <strong className="font-serif font-bold text-ink text-sm block">
                    {alert.type}
                  </strong>
                  <span className="text-[11px] text-[#5A2EA6] font-bold block mt-0.5">
                    {alert.branch} ({alert.branchId})
                  </span>

                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-md',
                      alert.status === 'Active'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700',
                    )}
                  >
                    {alert.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {alert.status === 'Active' && (
                      <Button
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      onClick={() => toast(`Opening details for ${alert.type}...`)}
                      className="h-[28px] px-3 rounded-lg text-[10px] font-bold premium-btn-primary"
                    >
                      {alert.actionLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SECTION 20: FINANCIAL AUDIT VIEW */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Financial Activity Audit Trail
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold">
                  {filteredAudit.length} Logged Events
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Statutory audit lineage of price alterations, discounts, refund approvals, and
                settlement payouts
              </p>
            </div>

            {/* Module Filter */}
            <select
              value={selectedAuditModule}
              onChange={(e) => setSelectedAuditModule(e.target.value)}
              className="bg-white border border-[#5A2EA6]/20 rounded-xl py-1 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Modules</option>
              <option value="price changes">Price Changes</option>
              <option value="discounts">Discounts</option>
              <option value="refunds">Refunds</option>
              <option value="credits">Credits</option>
              <option value="commissions">Commissions</option>
              <option value="settlement">Settlement</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Audit ID & Timestamp</th>
                  <th className="p-3.5">User & Role</th>
                  <th className="p-3.5">Module & Action</th>
                  <th className="p-3.5">Target Record</th>
                  <th className="p-3.5">Old Value $\to$ New Value</th>
                  <th className="p-3.5">Justification Reason</th>
                  <th className="p-3.5 pr-5">Approver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredAudit.map((log) => (
                  <tr key={log.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                    {/* ID & Time */}
                    <td className="p-3.5 pl-5 whitespace-nowrap">
                      <strong className="font-bold text-ink block text-xs">{log.id}</strong>
                      <span className="text-[10px] text-muted">{log.timestamp}</span>
                    </td>

                    {/* User */}
                    <td className="p-3.5 whitespace-nowrap">
                      <strong className="font-bold text-slate-900 block">{log.user}</strong>
                      <span className="text-[10px] text-soft">{log.userRole}</span>
                    </td>

                    {/* Module */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-[#5A2EA6] border border-purple-100 whitespace-nowrap shadow-3xs">
                        {log.module}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800 mt-0.5 block">
                        {log.action}
                      </span>
                    </td>

                    {/* Record */}
                    <td className="p-3.5 font-mono text-slate-900 font-bold whitespace-nowrap">
                      {log.record}
                    </td>

                    {/* Old vs New */}
                    <td className="p-3.5 text-[11px] whitespace-nowrap">
                      <span className="text-slate-400 block line-through">{log.oldValue}</span>
                      <strong className="text-emerald-700 font-bold block">{log.newValue}</strong>
                    </td>

                    {/* Reason */}
                    <td className="p-3.5 text-slate-600 max-w-[200px]">
                      <span className="block truncate" title={log.reason}>
                        {log.reason}
                      </span>
                    </td>

                    {/* Approver */}
                    <td className="p-3.5 pr-5 text-indigo-700 font-bold text-[11px] whitespace-nowrap">
                      {log.approver}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
