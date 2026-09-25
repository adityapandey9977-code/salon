import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Barcode,
  Building2,
  Check,
  CheckCircle2,
  Download,
  FileCheck,
  Globe,
  MapPin,
  PackageCheck,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  UserCheck,
  X,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export function GoodsReceiptPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [isGRNModalOpen, setIsGRNModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for GRN Intake with all user fields
  const [grnForm, setGrnForm] = useState({
    grnNumber: `GRN-${Math.floor(900 + Math.random() * 90)}`,
    receivingBranch: 'Bandra West Flagship (Mumbai)',
    purchaseOrder: 'PO-4091',
    supplier: 'L’Oréal India Ltd',
    invoiceNumber: 'INV-88401',
    receivedDate: '2026-08-07',
    receivedBy: 'Vikram Kulkarni (Head Storekeeper)',
    remarks: 'Physical inspection completed. Batch seals intact.',
    items: [
      {
        product: 'Developer 20Vol (1000ml)',
        quantity: 20,
        accepted: 20,
        rejected: 0,
        remarks: 'All 20 bottles verified',
      },
      {
        product: 'Majirel Hair Color Cream 7.1',
        quantity: 50,
        accepted: 48,
        rejected: 2,
        remarks: '2 tubes damaged/leaking in transit',
      },
    ],
  });

  const [grnList, setGrnList] = useState([
    {
      grnNumber: 'GRN-901',
      receivingBranch: 'Bandra West Flagship (Mumbai)',
      branchId: 'mumbai',
      purchaseOrder: 'PO-4091',
      supplier: 'L’Oréal India Ltd',
      invoiceNumber: 'INV-88401',
      receivedDate: '2026-08-07',
      receivedBy: 'Vikram Kulkarni',
      totalQty: 70,
      acceptedQty: 68,
      rejectedQty: 2,
      remarks: '2 tubes Majirel 7.1 rejected due to seal rupture.',
      status: 'Completed (GRN Posted)',
      totalValue: '₹42,500',
    },
    {
      grnNumber: 'GRN-902',
      receivingBranch: 'South Extension II (Delhi)',
      branchId: 'delhi',
      purchaseOrder: 'PO-4088',
      supplier: 'Luxury Beauty Distributors',
      invoiceNumber: 'INV-77210',
      receivedDate: '2026-08-04',
      receivedBy: 'Pooja Kashyap',
      totalQty: 10,
      acceptedQty: 8,
      rejectedQty: 2,
      remarks: '2 tubs Kérastase short shipment. Debit note claim issued.',
      status: 'Partial Receipt',
      totalValue: '₹14,000',
    },
  ]);

  // Button Action Handlers requested by user
  const handleReceiveShipment = (grnNumber: string) => {
    toast(`Shipment Intake: Received partial shipment items for ${grnNumber}.`);
  };

  const handleRejectShipment = (grnNumber: string) => {
    toast(`Shipment Rejected: Items for ${grnNumber} marked as rejected due to damage.`);
  };

  const handleReturnVendor = (grnNumber: string, supplier: string) => {
    toast(
      `Vendor Return Issued: Debit Note & Return manifest sent to ${supplier} for ${grnNumber}.`,
    );
  };

  const handleCompleteGRN = (grnNumber: string) => {
    setGrnList(
      grnList.map((g) =>
        g.grnNumber === grnNumber ? { ...g, status: 'Completed (GRN Posted)' } : g,
      ),
    );
    toast(
      `GRN Completed: ${grnNumber} fully verified. Accepted quantities posted to warehouse stock.`,
    );
  };

  const handleSaveGRNModal = (e: React.FormEvent) => {
    e.preventDefault();

    const totalQ = grnForm.items.reduce((acc, i) => acc + i.quantity, 0);
    const totalAcc = grnForm.items.reduce((acc, i) => acc + i.accepted, 0);
    const totalRej = grnForm.items.reduce((acc, i) => acc + i.rejected, 0);

    const newGRN = {
      grnNumber: grnForm.grnNumber,
      receivingBranch: grnForm.receivingBranch,
      branchId: selectedBranchId === 'all' ? 'mumbai' : selectedBranchId,
      purchaseOrder: grnForm.purchaseOrder,
      supplier: grnForm.supplier,
      invoiceNumber: grnForm.invoiceNumber,
      receivedDate: grnForm.receivedDate,
      receivedBy: grnForm.receivedBy,
      totalQty: totalQ,
      acceptedQty: totalAcc,
      rejectedQty: totalRej,
      remarks: grnForm.remarks,
      status: 'Completed (GRN Posted)',
      totalValue: '₹42,500',
    };

    setGrnList([newGRN, ...grnList]);
    setIsGRNModalOpen(false);
    toast(
      `GRN Posted: ${newGRN.grnNumber} issued for ${newGRN.purchaseOrder}. ${newGRN.acceptedQty} accepted items posted to stock.`,
    );
  };

  const filteredGRN = grnList.filter((g) => {
    const matchesBranch = isAllBranches || g.branchId === selectedBranchId;
    const matchesSearch =
      g.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.purchaseOrder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.receivingBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Goods Receiving (GRN) & Inwarding
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches
                ? 'Chain Inwarding Operations'
                : `${selectedBranch.shortName} Receiving Desk`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Receive incoming supplier shipments, verify physical quantities against POs, record
            accepted vs rejected items, and issue vendor debit notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGRNModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Issue Goods Receipt Note (GRN)
          </button>

          <button
            onClick={() => toast('Export GRN Log: Goods receipt log exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export GRN Log
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-2xl border border-line shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by GRN number, receiving branch, PO reference, supplier, or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* GRN LIST TABLE */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">GRN & PO Ref</th>
                <th className="p-3">Receiving Branch</th>
                <th className="p-3">Supplier & Invoice</th>
                <th className="p-3">Received Date & By</th>
                <th className="p-3">Total Qty (Delivered)</th>
                <th className="p-3">Accepted / Rejected</th>
                <th className="p-3">Inspection Remarks</th>
                <th className="p-3">GRN Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredGRN.map((grn) => (
                <tr key={grn.grnNumber} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-purple-700">{grn.grnNumber}</div>
                    <div className="text-[10px] text-muted font-mono">PO: {grn.purchaseOrder}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-700 shrink-0" />
                      {grn.receivingBranch}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-ink">{grn.supplier}</div>
                    <div className="text-[10px] text-soft font-mono">Inv: {grn.invoiceNumber}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-ink">{grn.receivedDate}</div>
                    <div className="text-[10px] text-soft">{grn.receivedBy}</div>
                  </td>
                  <td className="p-3 font-bold text-ink">{grn.totalQty} Units</td>
                  <td className="p-3">
                    <span className="text-emerald-700 font-bold">{grn.acceptedQty} Accepted</span>
                    {grn.rejectedQty > 0 && (
                      <span className="text-rose-700 font-bold ml-1">
                        ({grn.rejectedQty} Rejected)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-soft italic max-w-xs">{grn.remarks}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        grn.status.includes('Completed')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {grn.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {grn.rejectedQty > 0 && (
                        <button
                          onClick={() => handleReturnVendor(grn.grnNumber, grn.supplier)}
                          className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[10.5px] font-bold border border-rose-200 cursor-pointer"
                        >
                          Debit Note
                        </button>
                      )}
                      <button
                        onClick={() => handleCompleteGRN(grn.grnNumber)}
                        className="px-2 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-[10.5px] font-bold border border-purple-200 cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE GRN MODAL */}
      {isGRNModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Issue Goods Receipt Note (GRN)
                  </h3>
                  <p className="text-xs text-soft">
                    Verify incoming shipment quantities and post to branch stock
                  </p>
                </div>
                <button
                  onClick={() => setIsGRNModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGRNModal} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Receiving Branch *
                    </label>
                    <select
                      value={grnForm.receivingBranch}
                      onChange={(e) => setGrnForm({ ...grnForm, receivingBranch: e.target.value })}
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
                      Purchase Order (PO)
                    </label>
                    <input
                      type="text"
                      value={grnForm.purchaseOrder}
                      onChange={(e) => setGrnForm({ ...grnForm, purchaseOrder: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-mono font-bold text-purple-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Supplier Name
                    </label>
                    <input
                      type="text"
                      value={grnForm.supplier}
                      onChange={(e) => setGrnForm({ ...grnForm, supplier: e.target.value })}
                      className="w-full p-2.5 bg-white border border-line rounded-xl font-semibold text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Inspection Remarks
                  </label>
                  <input
                    type="text"
                    value={grnForm.remarks}
                    onChange={(e) => setGrnForm({ ...grnForm, remarks: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsGRNModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Confirm GRN & Update Stock
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
