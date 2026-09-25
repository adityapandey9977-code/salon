import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { CreateInvoiceModal } from '../components/CreateInvoiceModal';
import { Invoice, useSuperAdminStore } from '../context/SuperAdminContext';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export function BillingPaymentsPage() {
  const { invoices } = useSuperAdminStore();
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [periodFilter, setPeriodFilter] = useState<string>('All');

  // Unique Billing Periods
  const uniquePeriods = useMemo(() => {
    const periods = new Set(invoices.map((i) => i.billingPeriod).filter(Boolean));
    return Array.from(periods);
  }, [invoices]);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.salon.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.amount.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
      const matchesPeriod = periodFilter === 'All' || invoice.billingPeriod === periodFilter;

      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [invoices, searchQuery, statusFilter, periodFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || periodFilter !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPeriodFilter('All');
  };

  const totalPaidAmount = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((acc, i) => acc + (i.numericAmount || 24990), 0);

  const pendingCount = invoices.filter((i) => i.status === 'Pending').length;
  const overdueCount = invoices.filter((i) => i.status === 'Overdue').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 backdrop-blur-md p-5 rounded-[24px] border border-[#5A2EA6]/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl md:text-3xl text-ink font-semibold tracking-tight">
              Billing & Payments Operations
            </h1>
            <span className="bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#5A2EA6]/20">
              {invoices.length} Total Invoices
            </span>
          </div>
          <p className="text-[13px] text-muted mt-1">
            Global telemetry for tracking platform invoices, automated subscription billing, and tax
            receipt exports.
          </p>
        </div>
        <Button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary flex items-center gap-2 shadow-sm hover:shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </Button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Total Platform Revenue
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              ₹{(totalPaidAmount / 100000).toFixed(1)} Lakhs
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Pending Invoices
            </span>
            <strong className="text-xl font-serif font-bold text-amber-700">
              {pendingCount} Pending
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Overdue Invoices
            </span>
            <strong className="text-xl font-serif font-bold text-rose-700">
              {overdueCount} Overdue
            </strong>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-soft font-bold uppercase tracking-wider block">
              Total Invoices Issued
            </span>
            <strong className="text-xl font-serif font-bold text-ink">
              {invoices.length} Invoices
            </strong>
          </div>
        </div>
      </div>

      {/* Billing & Payments Registry Table */}
      <div className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[24px] shadow-xs overflow-hidden">
        {/* Search & Filter Header Bar */}
        <div className="p-5 border-b border-[#5A2EA6]/10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">
                Billing Transactions & Archival Roster
              </h3>
              <p className="text-[12px] text-muted mt-0.5">
                Filter by payment status, billing period, or search by invoice ID and salon name
              </p>
            </div>
            <div className="text-xs text-muted flex items-center gap-2">
              <span className="font-semibold text-[#5A2EA6]">
                Showing {filteredInvoices.length} of {invoices.length} Invoices
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
                >
                  <X className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Search Bar & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search invoice ID, salon name, amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl pl-9 pr-3 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Billing Period Filter */}
            <div className="relative">
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full bg-white border border-[#5A2EA6]/15 rounded-xl px-3 py-2 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
              >
                <option value="All">All Billing Periods</option>
                {uniquePeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Invoice ID',
                  'Salon / Tenant',
                  'Billing Period',
                  'Amount Due',
                  'Payment Status',
                  'Issued Date',
                  'Actions',
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
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((bill) => (
                  <tr
                    key={bill.invoiceId}
                    className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                  >
                    <td className="p-4 pl-6 font-mono text-[11.5px] font-bold text-ink">
                      {bill.invoiceId}
                    </td>
                    <td className="p-4 font-bold text-ink">{bill.salon}</td>
                    <td className="p-4 text-[11px] font-medium text-muted">
                      {bill.billingPeriod || 'August 2026'}
                    </td>
                    <td className="p-4 font-bold text-[#5A2EA6] text-[13px]">{bill.amount}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-block px-2.5 py-1 rounded-full text-[9.5px] font-bold border',
                          bill.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : bill.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-rose-100 text-rose-800 border-rose-200',
                        )}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{bill.date}</td>

                    {/* Download PDF Action */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => generateInvoicePDF(bill)}
                        className="text-[#5A2EA6] hover:text-[#462088] hover:bg-[#5A2EA6]/10 px-3 py-1.5 rounded-lg border border-[#5A2EA6]/20 font-semibold cursor-pointer inline-flex items-center gap-1.5 text-[11.5px] transition-all"
                      >
                        <Download className="w-3.5 h-3.5 inline" /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted text-xs">
                    No invoices found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
}
