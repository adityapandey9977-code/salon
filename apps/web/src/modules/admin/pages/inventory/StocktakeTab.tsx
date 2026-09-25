import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Layers,
  Plus,
  Search,
  TrendingDown,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ScheduleStocktakeModal } from './ScheduleStocktakeModal';

export interface StocktakeSession {
  id: string;
  branchName: string;
  branchId: string;
  auditDate: string;
  itemsCounted: number;
  expectedQuantity: number;
  actualQuantity: number;
  varianceQuantity: number;
  varianceValue: string;
  conductedBy: string;
  auditorRole: string;
  status: 'Planned' | 'In Progress' | 'Submitted' | 'Pending Approval' | 'Approved' | 'Completed';
  notes: string;
  itemDiscrepancies: {
    productName: string;
    sku: string;
    expectedStock: number;
    actualCounted: number;
    varianceDelta: number;
    unitCost: string;
    valueImpact: string;
    reason: string;
  }[];
}

const mockStocktakes: StocktakeSession[] = [
  {
    id: 'STK-AUDIT-AUG26-01',
    branchName: 'Indore Central Flagship',
    branchId: 'BR-01',
    auditDate: '12 Aug 2026',
    itemsCounted: 280,
    expectedQuantity: 4640,
    actualQuantity: 4620,
    varianceQuantity: -20,
    varianceValue: '-₹4,200',
    conductedBy: 'Sunil Rao',
    auditorRole: 'Internal Store Auditor',
    status: 'Completed',
    notes:
      'Monthly physical verification complete. Minor 0.43% variance due to backwash colour dispensing.',
    itemDiscrepancies: [
      {
        productName: "L'Oréal Majirel Colour Tube - 6.13",
        sku: 'SKU-MAJ-613',
        expectedStock: 68,
        actualCounted: 65,
        varianceDelta: -3,
        unitCost: '₹340',
        valueImpact: '-₹1,020',
        reason: 'Unrecorded backwash test mix',
      },
      {
        productName: "L'Oréal Oxydant Developer 20 Vol",
        sku: 'SKU-LOR-DEV20',
        expectedStock: 34,
        actualCounted: 32,
        varianceDelta: -2,
        unitCost: '₹420',
        valueImpact: '-₹840',
        reason: 'Bowl residue evaporation loss',
      },
    ],
  },
  {
    id: 'STK-AUDIT-AUG26-02',
    branchName: 'Vijay Nagar Boutique',
    branchId: 'BR-02',
    auditDate: '10 Aug 2026',
    itemsCounted: 245,
    expectedQuantity: 3435,
    actualQuantity: 3410,
    varianceQuantity: -25,
    varianceValue: '-₹6,800',
    conductedBy: 'Kunal Sen',
    auditorRole: 'Floor Manager',
    status: 'Approved',
    notes:
      'Approved write-off of 1 cracked retail shampoo bottle and 4 over-dispensed colour tubes.',
    itemDiscrepancies: [
      {
        productName: 'Moroccanoil Treatment Original (100ml)',
        sku: 'SKU-MOR-TRT01',
        expectedStock: 13,
        actualCounted: 12,
        varianceDelta: -1,
        unitCost: '₹2,200',
        valueImpact: '-₹2,200',
        reason: 'Shelf display dropped & damaged',
      },
    ],
  },
  {
    id: 'STK-AUDIT-AUG26-03',
    branchName: 'Bhopal Arera Colony',
    branchId: 'BR-03',
    auditDate: '08 Aug 2026',
    itemsCounted: 210,
    expectedQuantity: 2900,
    actualQuantity: 2890,
    varianceQuantity: -10,
    varianceValue: '-₹2,850',
    conductedBy: 'Kavita Nair',
    auditorRole: 'Branch Manager',
    status: 'Completed',
    notes: 'Clean cycle count audit.',
    itemDiscrepancies: [],
  },
  {
    id: 'STK-AUDIT-AUG26-04',
    branchName: 'Ujjain Mahakal Road',
    branchId: 'BR-04',
    auditDate: '14 Aug 2026',
    itemsCounted: 175,
    expectedQuantity: 2135,
    actualQuantity: 2120,
    varianceQuantity: -15,
    varianceValue: '-₹4,100',
    conductedBy: 'Pooja Verma',
    auditorRole: 'Storekeeper',
    status: 'Pending Approval',
    notes:
      'Submitted for Head Office discrepancy sign-off and inventory ledger adjustment posting.',
    itemDiscrepancies: [
      {
        productName: "L'Oréal Inoa Ammonia-Free Colour Tube",
        sku: 'SKU-INOA-04',
        expectedStock: 16,
        actualCounted: 12,
        varianceDelta: -4,
        unitCost: '₹380',
        valueImpact: '-₹1,520',
        reason: 'Unregistered salon usage',
      },
      {
        productName: 'Keratin Complex Smoothing Infusion',
        sku: 'SKU-KER-SMOOTH',
        expectedStock: 10,
        actualCounted: 8,
        varianceDelta: -2,
        unitCost: '₹1,200',
        valueImpact: '-₹2,400',
        reason: 'Heavy bridal application',
      },
    ],
  },
];

export interface StocktakeTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function StocktakeTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
}: StocktakeTabProps = {}) {
  const [stocktakesList, setStocktakesList] = useState<StocktakeSession[]>(mockStocktakes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(defaultBranch);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStocktake, setSelectedStocktake] = useState<StocktakeSession | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveStocktake = (newSession: StocktakeSession) => {
    setStocktakesList([newSession, ...stocktakesList]);
    showToast(
      `Stocktake session ${newSession.id} scheduled for ${newSession.branchName} on ${newSession.auditDate}.`,
    );
  };

  useEffect(() => {
    if (selectedStocktake) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedStocktake]);

  const getStatusBadge = (st: StocktakeSession['status']) => {
    switch (st) {
      case 'Completed':
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Approval':
      case 'Submitted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Planned':
        return 'bg-purple-50 text-[#5A2EA6] border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredStocktakes = stocktakesList.filter((st) => {
    if (!lockBranch && selectedBranch !== 'all' && st.branchId !== selectedBranch) return false;
    if (selectedStatus !== 'all' && st.status !== selectedStatus) return false;
    if (searchTerm) {
      const match = `${st.id} ${st.branchName} ${st.conductedBy}`.toLowerCase();
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

      {/* 1. Header Filters & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search stocktake ID, auditor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {!lockBranch && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
            >
              <option value="all">All Audited Branches</option>
              <option value="BR-01">Indore Central Flagship</option>
              <option value="BR-02">Vijay Nagar Boutique</option>
              <option value="BR-03">Bhopal Arera Colony</option>
              <option value="BR-04">Ujjain Mahakal Road</option>
            </select>
          )}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Stocktake Statuses</option>
            <option value="Planned">Planned (Scheduled)</option>
            <option value="Pending Approval">Pending Authorization</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed &amp; Posted</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast('Exporting stocktake audit summary (CSV)...')}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Summary</span>
          </Button>

          <Button
            onClick={() => setIsScheduleModalOpen(true)}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Stocktake</span>
          </Button>
        </div>
      </div>

      {/* 2. Section 24: STOCKTAKE TABLE */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#5A2EA6]" />
              <h3 className="font-serif font-bold text-ink text-base">
                {lockBranch
                  ? `${defaultBranch} · Physical Stocktake & Audit Ledger`
                  : 'Physical Stocktake & Cycle Count Verification'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                {filteredStocktakes.length} Audits Logged
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              {lockBranch
                ? `Shelf stock verification comparing book stock against physical floor counts for ${defaultBranch}`
                : 'Head Office reconciliation comparing system book stock against physical shelf counts with variance adjustment approvals'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsScheduleModalOpen(true)}
              className="h-[32px] px-3.5 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Stocktake</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                <th className="p-3.5 pl-5">Audit ID &amp; Date</th>
                {!lockBranch && <th className="p-3.5">Branch Location</th>}
                <th className="p-3.5 text-center">SKUs Audited</th>
                <th className="p-3.5 text-center">Expected Book Qty</th>
                <th className="p-3.5 text-center">Physical Count</th>
                <th className="p-3.5 text-center">Variance Units</th>
                <th className="p-3.5 text-right">Variance Impact</th>
                <th className="p-3.5">Conducted By</th>
                <th className="p-3.5 text-center">Audit Status</th>
                <th className="p-3.5 pr-5 text-right">Oversight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {filteredStocktakes.map((st) => (
                <tr key={st.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                  <td className="p-3.5 pl-5 whitespace-nowrap">
                    <strong className="font-bold text-ink block text-xs">{st.id}</strong>
                    <span className="text-[10px] text-muted">{st.auditDate}</span>
                  </td>

                  {!lockBranch && (
                    <td className="p-3.5 whitespace-nowrap font-semibold text-slate-900">
                      {st.branchName}
                    </td>
                  )}

                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-ink">
                    {st.itemsCounted} SKUs
                  </td>

                  <td className="p-3.5 text-center whitespace-nowrap text-soft">
                    {st.expectedQuantity.toLocaleString()} pcs
                  </td>

                  <td className="p-3.5 text-center whitespace-nowrap font-bold text-slate-900">
                    {st.actualQuantity.toLocaleString()} pcs
                  </td>

                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        st.varianceQuantity === 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200',
                      )}
                    >
                      {st.varianceQuantity} pcs
                    </span>
                  </td>

                  <td className="p-3.5 text-right font-extrabold text-red-700 whitespace-nowrap">
                    {st.varianceValue}
                  </td>

                  <td className="p-3.5 whitespace-nowrap text-slate-700">
                    <span className="font-medium text-slate-900 block">{st.conductedBy}</span>
                    <span className="text-[10px] text-soft">{st.auditorRole}</span>
                  </td>

                  <td className="p-3.5 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                        getStatusBadge(st.status),
                      )}
                    >
                      {st.status}
                    </span>
                  </td>

                  <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedStocktake(st)}
                      className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1 inline-flex"
                    >
                      <Eye className="w-3 h-3 text-[#5A2EA6]" />
                      <span>
                        {st.status === 'Pending Approval' ? 'Review & Reconcile' : 'Inspect'}
                      </span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. STOCKTAKE RECONCILIATION MODAL */}
      {selectedStocktake &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedStocktake(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Stocktake Reconciliation Dossier
                    </span>
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                        getStatusBadge(selectedStocktake.status),
                      )}
                    >
                      {selectedStocktake.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-xl mt-1">
                    {selectedStocktake.id}
                  </h3>
                  <p className="text-xs text-muted">
                    Branch: {selectedStocktake.branchName} · Audit Date:{' '}
                    {selectedStocktake.auditDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStocktake(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Audit Summary Metrics */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Book Expected
                    </span>
                    <strong className="text-base font-serif font-bold text-slate-800">
                      {selectedStocktake.expectedQuantity} pcs
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Physical Counted
                    </span>
                    <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                      {selectedStocktake.actualQuantity} pcs
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Variance Units
                    </span>
                    <strong className="text-base font-serif font-bold text-amber-800">
                      {selectedStocktake.varianceQuantity} pcs
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100">
                    <span className="text-soft block text-[10px] uppercase font-bold">
                      Value Impact
                    </span>
                    <strong className="text-base font-serif font-bold text-rose-700">
                      {selectedStocktake.varianceValue}
                    </strong>
                  </div>
                </div>

                {/* Item Discrepancies Table */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Line-Item Discrepancies &amp; Variances
                  </span>
                  {selectedStocktake.itemDiscrepancies.length > 0 ? (
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                          <tr>
                            <th className="p-2.5 pl-3">Product Name &amp; SKU</th>
                            <th className="p-2.5 text-center">Expected</th>
                            <th className="p-2.5 text-center">Counted</th>
                            <th className="p-2.5 text-center">Variance</th>
                            <th className="p-2.5 text-right">Cost Impact</th>
                            <th className="p-2.5 pr-3">Stated Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {selectedStocktake.itemDiscrepancies.map((it, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 pl-3">
                                <strong className="font-bold text-ink block">
                                  {it.productName}
                                </strong>
                                <span className="text-[10px] text-muted">{it.sku}</span>
                              </td>
                              <td className="p-2.5 text-center text-soft">{it.expectedStock}</td>
                              <td className="p-2.5 text-center font-bold text-ink">
                                {it.actualCounted}
                              </td>
                              <td className="p-2.5 text-center font-bold text-rose-700">
                                {it.varianceDelta}
                              </td>
                              <td className="p-2.5 text-right font-extrabold text-red-700">
                                {it.valueImpact}
                              </td>
                              <td className="p-2.5 pr-3 text-slate-700 text-[11px]">{it.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-semibold">
                      Zero line-item discrepancies identified. System book stock exactly matches
                      physical shelf counts.
                    </div>
                  )}
                </div>

                {/* Auditor Notes */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-ink font-bold block mb-1">Auditor Field Notes</strong>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {selectedStocktake.notes}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <span className="text-xs text-soft font-semibold">Authorized by Brand Owner</span>
                <div className="flex items-center gap-2">
                  {selectedStocktake.status === 'Pending Approval' ? (
                    <Button
                      onClick={() => {
                        selectedStocktake.status = 'Approved';
                        showToast(
                          `Stocktake ${selectedStocktake.id} variances authorized and posted to ledger.`,
                        );
                        setSelectedStocktake(null);
                      }}
                      className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Authorize &amp; Post Variance Adjustment
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedStocktake(null)}
                      className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                    >
                      Close Dossier
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Section 25: SCHEDULE STOCKTAKE MODAL */}
      <ScheduleStocktakeModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={handleSaveStocktake}
        defaultBranch={defaultBranch}
        lockBranch={lockBranch}
      />
    </div>
  );
}
