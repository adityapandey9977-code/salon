import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowLeftRight,
  Building,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Globe,
  Layers,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export type MovementReason = 'Transfer' | 'Damage' | 'Expired' | 'Correction' | 'Consumption';

export function TransfersPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [activeReasonTab, setActiveReasonTab] = useState<'all' | MovementReason>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Form State for Stock Movement Modal
  const [movementForm, setMovementForm] = useState({
    transferId: `TRF-${Math.floor(300 + Math.random() * 90)}`,
    reason: 'Transfer' as MovementReason,
    sourceBranch: 'Bandra West Flagship (Mumbai)',
    destinationBranch: 'South Extension II (Delhi)',
    sealNumber: 'SEAL-2026-9921',
    carrier: 'Internal Salon Van (Route A)',
    date: '2026-08-07',
    notes: 'Standard branch stock replenishment',
    items: [
      { product: 'Developer 20Vol (1000ml)', sku: 'LOR-DEV-20V', quantity: 10, batch: 'BAT-9940' },
      {
        product: 'Majirel Hair Color Cream 7.1',
        sku: 'LOR-MAJ-71',
        quantity: 20,
        batch: 'BAT-6650',
      },
    ],
  });

  const [movements, setMovements] = useState([
    {
      id: 'TRF-301',
      reason: 'Transfer' as MovementReason,
      sourceBranch: 'Central Logistics Hub (Bhiwandi)',
      destinationBranch: 'Bandra West Flagship (Mumbai)',
      sealNumber: 'SEAL-BHW-081',
      carrier: 'Express Logistics Van',
      date: '2026-08-07',
      itemsCount: 4,
      totalQty: 30,
      status: 'In-Transit',
      dispatchBy: 'Anand Shinde',
      notes: 'Weekly branch stock replenishment',
    },
    {
      id: 'TRF-302',
      reason: 'Transfer' as MovementReason,
      sourceBranch: 'South Extension II (Delhi)',
      destinationBranch: 'Indiranagar Atelier (Bangalore)',
      sealNumber: 'SEAL-DEL-044',
      carrier: 'BlueDart Courier Express',
      date: '2026-08-05',
      itemsCount: 8,
      totalQty: 50,
      status: 'Received & Verified',
      dispatchBy: 'Pooja Kashyap',
      notes: 'Emergency hair color stock request',
    },
    {
      id: 'DMG-101',
      reason: 'Damage' as MovementReason,
      sourceBranch: 'Bandra West Flagship (Mumbai)',
      destinationBranch: 'N/A (Disposed)',
      sealNumber: 'N/A',
      carrier: 'N/A',
      date: '2026-08-04',
      itemsCount: 1,
      totalQty: 2,
      status: 'Write-Off Logged',
      dispatchBy: 'Rohit Verma',
      notes: '2 developer bottles cracked during shelf handling',
    },
    {
      id: 'EXP-102',
      reason: 'Expired' as MovementReason,
      sourceBranch: 'Central Logistics Hub (Bhiwandi)',
      destinationBranch: 'N/A (Disposed)',
      sealNumber: 'N/A',
      carrier: 'N/A',
      date: '2026-08-02',
      itemsCount: 1,
      totalQty: 1,
      status: 'Write-Off Logged',
      dispatchBy: 'Anand Shinde',
      notes: 'Expired facial mask tub write-off',
    },
    {
      id: 'COR-103',
      reason: 'Correction' as MovementReason,
      sourceBranch: 'South Extension II (Delhi)',
      destinationBranch: 'N/A (Ledger Audit)',
      sealNumber: 'N/A',
      carrier: 'N/A',
      date: '2026-07-30',
      itemsCount: 2,
      totalQty: 5,
      status: 'Audit Corrected',
      dispatchBy: 'Pooja Kashyap',
      notes: 'Physical stock audit balance adjustment',
    },
    {
      id: 'CNS-104',
      reason: 'Consumption' as MovementReason,
      sourceBranch: 'Jubilee Hills Wellness (Hyderabad)',
      destinationBranch: 'Stylist Station #3',
      sealNumber: 'N/A',
      carrier: 'Internal Handover',
      date: '2026-07-29',
      itemsCount: 3,
      totalQty: 12,
      status: 'Station Issued',
      dispatchBy: 'Suresh Reddy',
      notes: 'Internal station consumables issuance',
    },
  ]);

  const handleConfirmIntake = (id: string) => {
    setMovements(movements.map((m) => (m.id === id ? { ...m, status: 'Received & Verified' } : m)));
    toast(`Stock Intake Confirmed: ${id} verified and received into branch inventory.`);
  };

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();

    const totalQ = movementForm.items.reduce((acc, i) => acc + i.quantity, 0);

    const newMov = {
      id: movementForm.transferId,
      reason: movementForm.reason,
      sourceBranch: movementForm.sourceBranch,
      destinationBranch:
        movementForm.reason === 'Transfer' ? movementForm.destinationBranch : 'N/A (Adjusted)',
      sealNumber: movementForm.reason === 'Transfer' ? movementForm.sealNumber : 'N/A',
      carrier: movementForm.reason === 'Transfer' ? movementForm.carrier : 'N/A',
      date: movementForm.date,
      itemsCount: movementForm.items.length,
      totalQty: totalQ,
      status: movementForm.reason === 'Transfer' ? 'In-Transit' : 'Write-Off Logged',
      dispatchBy: 'Vikram Kulkarni',
      notes: movementForm.notes,
    };

    setMovements([newMov, ...movements]);
    setIsTransferModalOpen(false);
    toast(`Stock Movement Recorded: ${newMov.id} logged under [${newMov.reason}] reason code.`);
  };

  const filteredMovements = movements.filter((m) => {
    const matchesBranch =
      isAllBranches ||
      m.sourceBranch.includes(selectedBranch.shortName.split(' ')[0]) ||
      m.destinationBranch.includes(selectedBranch.shortName.split(' ')[0]);
    const matchesReason = activeReasonTab === 'all' || m.reason === activeReasonTab;
    const matchesSearch =
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sourceBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.destinationBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesReason && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Stock Movement & Inter-Branch Transfers
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-purple-700" />
              ) : (
                <Building2 className="w-3 h-3 text-purple-700" />
              )}
              {isAllBranches ? 'Chain Logistics Network' : `${selectedBranch.shortName} Dispatches`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Dispatch inter-branch stock transfers, track tamper-evident seals, record damage
            write-offs, and execute ledger corrections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Record Stock Movement
          </button>

          <button
            onClick={() => toast('Export Movements: Stock movement log exported to CSV.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Movement Log
          </button>
        </div>
      </div>

      {/* 5 REASON CODE FILTER TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Movements', count: movements.length },
          {
            id: 'Transfer',
            label: 'Branch Transfers (Transfer)',
            count: movements.filter((m) => m.reason === 'Transfer').length,
          },
          {
            id: 'Damage',
            label: 'Damage Write-offs (Damage)',
            count: movements.filter((m) => m.reason === 'Damage').length,
          },
          {
            id: 'Expired',
            label: 'Expired Stock (Expired)',
            count: movements.filter((m) => m.reason === 'Expired').length,
          },
          {
            id: 'Correction',
            label: 'Ledger Corrections (Correction)',
            count: movements.filter((m) => m.reason === 'Correction').length,
          },
          {
            id: 'Consumption',
            label: 'Station Issuance (Consumption)',
            count: movements.filter((m) => m.reason === 'Consumption').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReasonTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeReasonTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
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
            placeholder="Search by Movement ID, source/destination branch, seal number, or reason notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* MOVEMENTS TABLE WITH ALL USER FIELDS */}
      <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                <th className="p-3">Movement ID & Date</th>
                <th className="p-3">Reason Code</th>
                <th className="p-3">Source Origin</th>
                <th className="p-3">Destination Branch</th>
                <th className="p-3">Tamper Seal & Carrier</th>
                <th className="p-3">Total Quantity</th>
                <th className="p-3">Reason Notes</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-3 font-bold text-purple-700">
                    <div>{m.id}</div>
                    <div className="text-[10px] text-muted">{m.date}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.reason === 'Transfer'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : m.reason === 'Damage'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : m.reason === 'Expired'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : m.reason === 'Correction'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {m.reason}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-ink">{m.sourceBranch}</td>
                  <td className="p-3 font-bold text-purple-900">{m.destinationBranch}</td>
                  <td className="p-3">
                    <div className="font-mono font-bold text-[11px] text-indigo-900">
                      {m.sealNumber}
                    </div>
                    <div className="text-[10px] text-soft">{m.carrier}</div>
                  </td>
                  <td className="p-3 font-bold text-ink">
                    {m.totalQty} Units ({m.itemsCount} SKUs)
                  </td>
                  <td className="p-3 text-soft italic max-w-xs">{m.notes}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status.includes('Received')
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'In-Transit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    {m.status === 'In-Transit' && (
                      <button
                        onClick={() => handleConfirmIntake(m.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold cursor-pointer border-0"
                      >
                        Confirm Intake
                      </button>
                    )}
                    <button
                      onClick={() =>
                        toast(
                          `View Manifest: Opened manifest breakdown for ${m.id} (${m.sealNumber}).`,
                        )
                      }
                      className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-semibold text-[11px] border border-purple-200 cursor-pointer"
                    >
                      Manifest
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MOVEMENT MODAL (Wide max-w-4xl createPortal) */}
      {isTransferModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] p-6 space-y-4 border border-[#5A2EA6]/10">
              <div className="flex justify-between items-center border-b border-line pb-3">
                <div>
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Record Stock Movement & Transfer
                  </h3>
                  <p className="text-xs text-soft">
                    Select movement reason code (Transfer, Damage, Expired, Correction, Consumption)
                  </p>
                </div>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMovement} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Reason Code *
                    </label>
                    <select
                      value={movementForm.reason}
                      onChange={(e) =>
                        setMovementForm({
                          ...movementForm,
                          reason: e.target.value as MovementReason,
                        })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-bold text-purple-900 cursor-pointer outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Transfer">Transfer (Branch-to-Branch)</option>
                      <option value="Damage">Damage (Transit / Spillage)</option>
                      <option value="Expired">Expired (Dormant Write-Off)</option>
                      <option value="Correction">Correction (Ledger Audit Diff)</option>
                      <option value="Consumption">Consumption (Station Issuance)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Source Origin Branch *
                    </label>
                    <select
                      value={movementForm.sourceBranch}
                      onChange={(e) =>
                        setMovementForm({ ...movementForm, sourceBranch: e.target.value })
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
                      Destination Branch
                    </label>
                    <select
                      disabled={movementForm.reason !== 'Transfer'}
                      value={movementForm.destinationBranch}
                      onChange={(e) =>
                        setMovementForm({ ...movementForm, destinationBranch: e.target.value })
                      }
                      className={`w-full p-2.5 border border-line rounded-xl font-semibold text-ink cursor-pointer ${
                        movementForm.reason !== 'Transfer' ? 'bg-pine/5 text-soft' : 'bg-paper/30'
                      }`}
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

                {movementForm.reason === 'Transfer' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-950 uppercase tracking-wider mb-1">
                        Tamper-Evident Seal Number *
                      </label>
                      <input
                        type="text"
                        value={movementForm.sealNumber}
                        onChange={(e) =>
                          setMovementForm({ ...movementForm, sealNumber: e.target.value })
                        }
                        placeholder="e.g. SEAL-BOM-8821"
                        className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl font-mono font-bold text-indigo-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-950 uppercase tracking-wider mb-1">
                        Logistics Carrier Mode *
                      </label>
                      <input
                        type="text"
                        value={movementForm.carrier}
                        onChange={(e) =>
                          setMovementForm({ ...movementForm, carrier: e.target.value })
                        }
                        placeholder="e.g. Internal Salon Van / BlueDart"
                        className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl font-semibold text-ink"
                      />
                    </div>
                  </div>
                )}

                {/* PRODUCTS LIST IN MODAL */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-soft uppercase tracking-wider">
                    Transferred Product Items & Quantities
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {movementForm.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-pine/5 rounded-2xl border border-line grid grid-cols-12 gap-2 items-center text-xs"
                      >
                        <div className="col-span-5">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Product Name / SKU
                          </label>
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => {
                              const updated = [...movementForm.items];
                              updated[idx].product = e.target.value;
                              setMovementForm({ ...movementForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-semibold"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="text-[9.5px] font-bold text-muted uppercase block">
                            Batch Number
                          </label>
                          <input
                            type="text"
                            value={item.batch}
                            onChange={(e) => {
                              const updated = [...movementForm.items];
                              updated[idx].batch = e.target.value;
                              setMovementForm({ ...movementForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-mono"
                          />
                        </div>

                        <div className="col-span-4">
                          <label className="text-[9.5px] font-bold text-purple-900 uppercase block">
                            Transferred Quantity
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...movementForm.items];
                              updated[idx].quantity = Number.parseInt(e.target.value) || 0;
                              setMovementForm({ ...movementForm, items: updated });
                            }}
                            className="w-full p-2 bg-white border border-line rounded-xl font-bold text-purple-900 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                    Reason Description & Notes
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly replenishment for Arera Colony salon suite"
                    value={movementForm.notes}
                    onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-paper/30 border border-line rounded-xl font-semibold text-ink"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0"
                  >
                    Dispatch Stock Movement
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
