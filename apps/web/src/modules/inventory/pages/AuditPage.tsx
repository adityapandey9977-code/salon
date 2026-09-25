import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  Globe,
  Lock,
  MapPin,
  Plus,
  Search,
  Sparkles,
  TrendingDown,
  Unlock,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export function AuditPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [activeTab, setActiveTab] = useState<'physical' | 'auditRuns'>('physical');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isBlindCountMode, setIsBlindCountMode] = useState(true);
  const [isPosFrozen, setIsPosFrozen] = useState(false);

  // Form state for physical stock count entry
  const [auditForm, setAuditForm] = useState({
    auditRef: `AUD-${Math.floor(500 + Math.random() * 90)}`,
    branchName: 'Bandra West Flagship (Mumbai)',
    product: 'L’Oréal Developer 20Vol (1000ml)',
    systemQuantity: 14,
    physicalQuantity: 12,
    reason: 'Unrecorded Spillage during mixing',
    approvedBy: 'Vikram Kulkarni (Head Storekeeper)',
    approvedStatus: 'Approved & Adjusted',
  });

  const [physicalCounts, setPhysicalCounts] = useState([
    {
      id: 'AUD-501',
      branchName: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      product: 'L’Oréal Developer 20Vol (LOR-DEV-20V)',
      systemQuantity: 14,
      physicalQuantity: 12,
      difference: -2,
      lossValue: '₹1,700',
      reason: 'Unrecorded Spillage during mixing',
      approved: 'Approved',
      approvedBy: 'Vikram Kulkarni',
      date: '2026-08-01',
    },
    {
      id: 'AUD-502',
      branchName: 'South Extension II (Delhi)',
      branchId: 'delhi',
      product: 'Kérastase Nutritive Mask 500ml',
      systemQuantity: 5,
      physicalQuantity: 5,
      difference: 0,
      lossValue: '₹0',
      reason: 'Zero Variance (Matched)',
      approved: 'Approved',
      approvedBy: 'Pooja Kashyap',
      date: '2026-07-28',
    },
    {
      id: 'AUD-503',
      branchName: 'Indiranagar Atelier (Bangalore)',
      branchId: 'bangalore',
      product: 'Olaplex No. 1 Bond Multiplier',
      systemQuantity: 4,
      physicalQuantity: 3,
      difference: -1,
      lossValue: '₹6,500',
      reason: 'Misplaced in Shelf B Bin 3',
      approved: 'Pending Approval',
      approvedBy: 'Pending Audit Sign-off',
      date: '2026-08-05',
    },
    {
      id: 'AUD-504',
      branchName: 'South Extension II (Delhi)',
      branchId: 'delhi',
      product: 'Majirel Hair Color Cream 7.1',
      systemQuantity: 85,
      physicalQuantity: 86,
      difference: +1,
      lossValue: '+₹340 (Gain)',
      reason: 'Unrecorded Return Restock',
      approved: 'Approved',
      approvedBy: 'Pooja Kashyap',
      date: '2026-08-02',
    },
  ]);

  const handleApproveVariance = (id: string) => {
    setPhysicalCounts(
      physicalCounts.map((p) =>
        p.id === id ? { ...p, approved: 'Approved', approvedBy: 'Vikram Kulkarni' } : p,
      ),
    );
    toast(`Audit Variance Approved: ${id} verified and inventory ledger updated.`);
  };

  const handleTogglePosLock = () => {
    const nextState = !isPosFrozen;
    setIsPosFrozen(nextState);
    toast(
      nextState
        ? `POS Stock Freeze Active: POS billing restricted during stocktake audit at ${selectedBranch.shortName}.`
        : `POS Stock Freeze Lifted: Normal billing resumed for ${selectedBranch.shortName}.`,
    );
  };

  const handleSaveAuditRun = (e: React.FormEvent) => {
    e.preventDefault();

    const diff = auditForm.physicalQuantity - auditForm.systemQuantity;

    const newCount = {
      id: auditForm.auditRef,
      branchName: auditForm.branchName,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      product: auditForm.product,
      systemQuantity: auditForm.systemQuantity,
      physicalQuantity: auditForm.physicalQuantity,
      difference: diff,
      lossValue: diff < 0 ? `₹${Math.abs(diff) * 850}` : '₹0',
      reason: auditForm.reason,
      approved: 'Approved',
      approvedBy: auditForm.approvedBy,
      date: new Date().toISOString().split('T')[0],
    };

    setPhysicalCounts([newCount, ...physicalCounts]);
    setIsAuditModalOpen(false);
    toast(`Stocktake Entry Recorded: ${newCount.id} logged with ${diff} variance.`);
  };

  const filteredCounts = physicalCounts.filter((p) => {
    const matchesBranch = isAllBranches || p.branchId === selectedBranchId;
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Physical Stocktake & Cycle Count Audits
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain-Wide Audit Sessions' : `${selectedBranch.shortName} Audit`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Conduct blind physical inventory counts, lock POS during audit windows, calculate ledger
            variances, and approve loss write-offs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* POS Lock Toggle Button */}
          <button
            onClick={handleTogglePosLock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              isPosFrozen
                ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            {isPosFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {isPosFrozen ? 'POS Stock Lockdown: ACTIVE' : 'Lock POS for Audit'}
          </button>

          {/* Blind Count Mode Toggle */}
          <button
            onClick={() => {
              setIsBlindCountMode(!isBlindCountMode);
              toast(
                isBlindCountMode
                  ? 'Blind Count Disabled: Book quantities revealed.'
                  : 'Blind Count Enabled: Theoretical book quantities hidden from floor auditor.',
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              isBlindCountMode
                ? 'bg-purple-50 border-purple-300 text-purple-900'
                : 'bg-white border-line text-soft hover:text-ink'
            }`}
          >
            {isBlindCountMode ? (
              <EyeOff className="w-3.5 h-3.5 text-purple-700" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            {isBlindCountMode ? 'Blind Count Mode: ON' : 'Blind Count Mode: OFF'}
          </button>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            New Physical Count
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by audit ID, product SKU, branch location, or variance reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Audit Ref & Date</th>
                <th className="p-3">Audited Branch</th>
                <th className="p-3">Product Name & SKU</th>
                <th className="p-3">Book (System) Qty</th>
                <th className="p-3">Physical Hand Count</th>
                <th className="p-3">Variance Delta & Value</th>
                <th className="p-3">Variance Reason</th>
                <th className="p-3">Sign-Off Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredCounts.map((p) => (
                <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-purple-700">
                    <div>{p.id}</div>
                    <div className="text-[10px] text-muted">{p.date}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {p.branchName}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-ink">{p.product}</td>

                  {/* Book Quantity (Hidden in Blind Count Mode) */}
                  <td className="p-3">
                    {isBlindCountMode ? (
                      <span className="px-2 py-0.5 bg-pine/10 text-soft rounded-md font-mono text-[10.5px]">
                        [Hidden Blind]
                      </span>
                    ) : (
                      <span className="font-semibold text-ink">{p.systemQuantity} Units</span>
                    )}
                  </td>

                  {/* Physical Count */}
                  <td className="p-3 font-bold text-purple-900">{p.physicalQuantity} Units</td>

                  {/* Variance Delta */}
                  <td className="p-3">
                    <div
                      className={`font-bold ${p.difference === 0 ? 'text-emerald-700' : p.difference > 0 ? 'text-blue-700' : 'text-rose-700'}`}
                    >
                      {p.difference > 0 ? `+${p.difference}` : p.difference} Units
                    </div>
                    <div className="text-[10px] text-soft font-semibold">{p.lossValue}</div>
                  </td>

                  <td className="p-3 text-soft italic max-w-xs">{p.reason}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.approved === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.approved}
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-1">
                    {p.approved !== 'Approved' && (
                      <button
                        onClick={() => handleApproveVariance(p.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Approve Write-off
                      </button>
                    )}
                    <button
                      onClick={() => toast(`Audit Report: Downloaded certificate for ${p.id}.`)}
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] border border-purple-200 cursor-pointer"
                    >
                      Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE AUDIT COUNT MODAL */}
      {isAuditModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Record Physical Shelf Count
                  </h3>
                  <p className="text-xs text-soft">
                    Enter physical audit count and loss/gain variance justification
                  </p>
                </div>
                <button
                  onClick={() => setIsAuditModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAuditRun} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Audit Reference
                    </label>
                    <input
                      type="text"
                      value={auditForm.auditRef}
                      disabled
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-mono font-bold text-purple-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Target Salon Branch *
                    </label>
                    <select
                      value={auditForm.branchName}
                      onChange={(e) => setAuditForm({ ...auditForm, branchName: e.target.value })}
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
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Audited Product SKU *
                  </label>
                  <input
                    type="text"
                    value={auditForm.product}
                    onChange={(e) => setAuditForm({ ...auditForm, product: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      System Book Quantity
                    </label>
                    <input
                      type="number"
                      value={auditForm.systemQuantity}
                      onChange={(e) =>
                        setAuditForm({
                          ...auditForm,
                          systemQuantity: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2.5 bg-pine/5 border border-line rounded-xl font-bold text-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
                      Physical Hand Count *
                    </label>
                    <input
                      type="number"
                      value={auditForm.physicalQuantity}
                      onChange={(e) =>
                        setAuditForm({
                          ...auditForm,
                          physicalQuantity: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2.5 bg-white border border-purple-400 rounded-xl font-bold text-purple-900 text-sm outline-none focus:border-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Variance Justification / Reason *
                  </label>
                  <select
                    value={auditForm.reason}
                    onChange={(e) => setAuditForm({ ...auditForm, reason: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink cursor-pointer"
                  >
                    <option value="Zero Variance (Matched)">Zero Variance (Matched)</option>
                    <option value="Unrecorded Spillage during mixing">
                      Unrecorded Spillage during mixing
                    </option>
                    <option value="Misplaced in Other Bin/Aisle">
                      Misplaced in Other Bin/Aisle
                    </option>
                    <option value="Dropped / Broken Bottle Floor Loss">
                      Dropped / Broken Bottle Floor Loss
                    </option>
                    <option value="Unrecorded Return Restock">Unrecorded Return Restock</option>
                    <option value="Unaccounted Discrepancy / Pilferage">
                      Unaccounted Discrepancy / Pilferage
                    </option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAuditModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Post Stocktake Journal
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
