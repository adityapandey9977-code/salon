import { useToast } from '@salon-spa-saas/ui';
import {
  AlertOctagon,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  Flame,
  Globe,
  MapPin,
  Package,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export type WastageReason = 'Expired' | 'Damaged' | 'Leakage' | 'Broken' | 'Quality Issue';

export function ConsumptionPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [activeReasonFilter, setActiveReasonFilter] = useState<'all' | WastageReason>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWastageModalOpen, setIsWastageModalOpen] = useState(false);

  // Form State with all 6 requested fields and 5 reason codes
  const [wastageForm, setWastageForm] = useState({
    id: `WST-${Math.floor(800 + Math.random() * 90)}`,
    branchName: 'Bandra West Flagship (Mumbai)',
    product: 'L’Oréal Developer 20Vol (1000ml)',
    batch: 'BAT-9940',
    quantity: '100 ml',
    reason: 'Leakage' as WastageReason,
    approvedBy: 'Vikram Kulkarni (Head Storekeeper)',
    remarks: 'Container cap cracked during shelf movement causing 100ml leakage',
    costLoss: '₹85',
    date: '2026-08-07',
  });

  const [wastageLogs, setWastageLogs] = useState([
    {
      id: 'WST-801',
      branchName: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      product: 'L’Oréal Developer 20Vol',
      batch: 'BAT-9940',
      quantity: '100 ml',
      reason: 'Leakage' as WastageReason,
      approvedBy: 'Vikram Kulkarni',
      remarks: 'Container cap cracked during shelf movement causing 100ml leakage',
      costLoss: '₹85',
      date: '2026-08-07',
    },
    {
      id: 'WST-802',
      branchName: 'South Extension II (Delhi)',
      branchId: 'delhi',
      product: 'Kérastase Nutritive Mask (500ml)',
      batch: 'BAT-8820',
      quantity: '1 Tub (500ml)',
      reason: 'Expired' as WastageReason,
      approvedBy: 'Pooja Kashyap',
      remarks: 'Reached expiry date 2026-08-28. Disposed as per FIFO policy.',
      costLoss: '₹2,400',
      date: '2026-08-04',
    },
    {
      id: 'WST-803',
      branchName: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      product: 'Olaplex No. 1 Bond Multiplier',
      batch: 'BAT-7710',
      quantity: '1 Glass Dispenser',
      reason: 'Broken' as WastageReason,
      approvedBy: 'Vikram Kulkarni',
      remarks: 'Glass dispenser dropped accidentally at station #2',
      costLoss: '₹6,500',
      date: '2026-08-02',
    },
    {
      id: 'WST-804',
      branchName: 'Jubilee Hills Wellness (Hyderabad)',
      branchId: 'hyderabad',
      product: 'Majirel Hair Color Cream 6.0',
      batch: 'BAT-5510',
      quantity: '3 Tubes',
      reason: 'Damaged' as WastageReason,
      approvedBy: 'Suresh Varma',
      remarks: 'Physical foil damage during delivery unpacking',
      costLoss: '₹1,020',
      date: '2026-07-28',
    },
    {
      id: 'WST-805',
      branchName: 'Central Logistics Hub (Bhiwandi)',
      branchId: 'central-hub',
      product: 'Facial Peel Off Algae Serum',
      batch: 'BAT-3320',
      quantity: '2 Bottles',
      reason: 'Quality Issue' as WastageReason,
      approvedBy: 'Gaurav Patil',
      remarks: 'Formula separation observed upon unsealing. Vendor defect note sent.',
      costLoss: '₹900',
      date: '2026-07-25',
    },
  ]);

  const handleSaveWastage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageForm.product || !wastageForm.quantity) {
      toast('Validation Error: Please fill in product name and wasted quantity.');
      return;
    }

    const newLog = {
      ...wastageForm,
      id: `WST-${Math.floor(800 + Math.random() * 90)}`,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      date: new Date().toISOString().split('T')[0],
    };

    setWastageLogs([newLog, ...wastageLogs]);
    setIsWastageModalOpen(false);
    toast(
      `Wastage Recorded: ${newLog.id} logged under [${newLog.reason}] for ${newLog.branchName}.`,
    );
  };

  const filteredLogs = wastageLogs.filter((log) => {
    const matchesBranch = isAllBranches || log.branchId === selectedBranchId;
    const matchesReason = activeReasonFilter === 'all' || log.reason === activeReasonFilter;
    const matchesSearch =
      log.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.approvedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesReason && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Material Wastage & Loss Logging
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-rose-700" />
              ) : (
                <Building2 className="w-3 h-3 text-rose-700" />
              )}
              {isAllBranches ? 'Chain Wastage Audits' : `${selectedBranch.shortName} Loss Log`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Log and audit stock write-offs by standardized reason codes: Expired, Damaged, Leakage,
            Broken, and Quality Issues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWastageModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Log Spillage / Wastage
          </button>

          <button
            onClick={() => toast('Export Wastage Log: Material wastage log exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Wastage Log
          </button>
        </div>
      </div>

      {/* 5 REASON CODE FILTER TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Wastage Logs', count: filteredLogs.length },
          {
            id: 'Expired',
            label: 'Expired Stock',
            count: filteredLogs.filter((w) => w.reason === 'Expired').length,
          },
          {
            id: 'Damaged',
            label: 'Damaged Items',
            count: filteredLogs.filter((w) => w.reason === 'Damaged').length,
          },
          {
            id: 'Leakage',
            label: 'Spillage / Leakage',
            count: filteredLogs.filter((w) => w.reason === 'Leakage').length,
          },
          {
            id: 'Broken',
            label: 'Dispenser Breakage',
            count: filteredLogs.filter((w) => w.reason === 'Broken').length,
          },
          {
            id: 'Quality Issue',
            label: 'Vendor Defects',
            count: filteredLogs.filter((w) => w.reason === 'Quality Issue').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReasonFilter(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeReasonFilter === tab.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-white/20 text-current rounded-full">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by product name, branch location, batch number, approver, or remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* WASTAGE LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Wastage ID & Date</th>
                <th className="p-3">Branch Location</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Batch Number</th>
                <th className="p-3">Quantity Wasted</th>
                <th className="p-3">Reason Code</th>
                <th className="p-3">Approved By</th>
                <th className="p-3">Remarks & Notes</th>
                <th className="p-3 text-right">Financial Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="p-3 font-bold text-rose-700">
                    <div>{log.id}</div>
                    <div className="text-[10px] text-muted">{log.date}</div>
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {log.branchName}
                    </div>
                  </td>

                  <td className="p-3 font-bold text-ink">{log.product}</td>
                  <td className="p-3 font-mono font-bold text-purple-700">{log.batch}</td>
                  <td className="p-3 font-bold text-ink">{log.quantity}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.reason === 'Expired'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : log.reason === 'Damaged'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : log.reason === 'Leakage'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : log.reason === 'Broken'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {log.reason}
                    </span>
                  </td>

                  <td className="p-3 text-soft font-semibold">{log.approvedBy}</td>
                  <td className="p-3 text-soft italic max-w-xs">{log.remarks}</td>
                  <td className="p-3 text-right font-bold text-rose-600">{log.costLoss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD WASTAGE MODAL */}
      {isWastageModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Record Material Spillage / Loss
                  </h3>
                  <p className="text-xs text-soft">
                    Log stock write-off with financial loss reason code
                  </p>
                </div>
                <button
                  onClick={() => setIsWastageModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWastage} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Target Branch *
                    </label>
                    <select
                      value={wastageForm.branchName}
                      onChange={(e) =>
                        setWastageForm({ ...wastageForm, branchName: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      {branches
                        .filter((b) => b.id !== 'all')
                        .map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.city})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Product SKU *
                    </label>
                    <input
                      type="text"
                      value={wastageForm.product}
                      onChange={(e) => setWastageForm({ ...wastageForm, product: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={wastageForm.batch}
                      onChange={(e) => setWastageForm({ ...wastageForm, batch: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-mono font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Quantity Wasted *
                    </label>
                    <input
                      type="text"
                      value={wastageForm.quantity}
                      onChange={(e) => setWastageForm({ ...wastageForm, quantity: e.target.value })}
                      className="w-full p-2.5 bg-white border border-rose-300 rounded-xl font-bold text-rose-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Reason Code *
                    </label>
                    <select
                      value={wastageForm.reason}
                      onChange={(e) =>
                        setWastageForm({ ...wastageForm, reason: e.target.value as WastageReason })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                    >
                      <option value="Expired">Expired</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Leakage">Leakage</option>
                      <option value="Broken">Broken</option>
                      <option value="Quality Issue">Quality Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Detailed Remarks
                  </label>
                  <input
                    type="text"
                    value={wastageForm.remarks}
                    onChange={(e) => setWastageForm({ ...wastageForm, remarks: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsWastageModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Post Wastage Write-Off
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
