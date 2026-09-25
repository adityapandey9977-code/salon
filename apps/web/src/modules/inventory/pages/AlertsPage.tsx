import { useToast } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  ArrowLeftRight,
  BellRing,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  Flame,
  Globe,
  MapPin,
  ShoppingCart,
  Sparkles,
  Truck,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { useInventoryBranch } from '../context/InventoryBranchContext';

export type AlertType =
  | 'Low Stock'
  | 'Expiring This Week'
  | 'Expired'
  | 'Pending Purchase Orders'
  | 'Pending Transfers';

export function AlertsPage() {
  const { toast } = useToast();
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    selectedBranch,
    isAllBranches,
    userRole,
  } = useInventoryBranch();

  const [activeCategory, setActiveCategory] = useState<'all' | AlertType>('all');

  const [alerts] = useState([
    {
      id: 'ALT-101',
      category: 'Low Stock' as AlertType,
      title: 'Olaplex No. 1 Bond Multiplier (525ml)',
      sku: 'OLA-NO1-525',
      branchId: 'bangalore',
      branchName: 'Indiranagar Atelier (Bangalore)',
      detail: 'Only 1 bottle remaining in Bangalore store (Safety Reorder Threshold: 4)',
      date: '2026-08-07',
      severity: 'Critical',
      actionLabel: 'Create PO',
    },
    {
      id: 'ALT-102',
      category: 'Low Stock' as AlertType,
      title: 'Kérastase Nutritive Mask (500ml)',
      sku: 'KER-NUT-500',
      branchId: 'mumbai',
      branchName: 'Bandra West Flagship (Mumbai)',
      detail: 'Only 2 tubs remaining in Mumbai store (Reorder Threshold: 5)',
      date: '2026-08-07',
      severity: 'High',
      actionLabel: 'Transfer from Delhi',
    },
    {
      id: 'ALT-103',
      category: 'Expiring This Week' as AlertType,
      title: 'Kérastase Nutritive Mask - Batch BAT-8820',
      sku: 'KER-NUT-500',
      branchId: 'mumbai',
      branchName: 'Bandra West Flagship (Mumbai)',
      detail: 'Expires in 4 days (Expiry Date: 2026-08-11) • 2 Tubs in Bin C',
      date: '2026-08-07',
      severity: 'Critical',
      actionLabel: 'FIFO Priority Dispatch',
    },
    {
      id: 'ALT-104',
      category: 'Expiring This Week' as AlertType,
      title: 'Majirel Hair Color Cream 6.0 - Batch BAT-4410',
      sku: 'LOR-MAJ-60',
      branchId: 'delhi',
      branchName: 'South Extension II (Delhi)',
      detail: 'Expires in 6 days (Expiry Date: 2026-08-13) • 5 Tubes in Aisle 4',
      date: '2026-08-07',
      severity: 'High',
      actionLabel: 'FIFO Priority Dispatch',
    },
    {
      id: 'ALT-105',
      category: 'Expired' as AlertType,
      title: 'Facial Peel Off Algae Serum - Batch BAT-3100',
      sku: 'HYD-ALG-100',
      branchId: 'hyderabad',
      branchName: 'Jubilee Hills Wellness (Hyderabad)',
      detail: 'Expired yesterday (2026-08-06) • 1 Bottle requires disposal write-off',
      date: '2026-08-06',
      severity: 'Critical',
      actionLabel: 'Log Write-Off',
    },
    {
      id: 'ALT-106',
      category: 'Pending Purchase Orders' as AlertType,
      title: 'PO-4091 (L’Oréal India Ltd)',
      sku: 'PO-4091',
      branchId: 'mumbai',
      branchName: 'Bandra West Flagship (Mumbai)',
      detail: 'Shipment in-transit arriving today • 6 SKUs (Developer 20V, Majirel 7.1)',
      date: '2026-08-05',
      severity: 'Medium',
      actionLabel: 'Receive Goods (GRN)',
    },
    {
      id: 'ALT-107',
      category: 'Pending Purchase Orders' as AlertType,
      title: 'PO-4093 (Olaplex India Pvt Ltd)',
      sku: 'PO-4093',
      branchId: 'bangalore',
      branchName: 'Indiranagar Atelier (Bangalore)',
      detail: 'Order pending brand manager approval • 2 SKUs (Total: ₹26,000)',
      date: '2026-08-07',
      severity: 'Medium',
      actionLabel: 'Approve PO',
    },
    {
      id: 'ALT-108',
      category: 'Pending Transfers' as AlertType,
      title: 'TRF-301 (Inter-Branch Transfer Manifest)',
      sku: 'TRF-301',
      branchId: 'mumbai',
      branchName: 'Bandra West Flagship (Mumbai)',
      detail: 'Dispatched from Bhiwandi Central Hub (Seal: SEAL-BHW-081) • 30 Units in-transit',
      date: '2026-08-07',
      severity: 'Medium',
      actionLabel: 'Confirm Intake',
    },
  ]);

  const handleAlertAction = (alert: any) => {
    toast(`Alert Action Triggered: [${alert.actionLabel}] executed for ${alert.title}.`);
  };

  const filteredAlerts = alerts.filter((a) => {
    const matchesBranch = isAllBranches || a.branchId === selectedBranchId;
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    return matchesBranch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
              Warehouse Risk Alerts & Thresholds
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
              {isAllBranches ? (
                <Globe className="w-3 h-3 text-rose-700" />
              ) : (
                <Building2 className="w-3 h-3 text-rose-700" />
              )}
              {isAllBranches
                ? 'Chain Monitoring (5 Branches)'
                : `${selectedBranch.shortName} Alerts`}
            </span>
          </div>
          <p className="text-xs text-soft mt-1">
            Real-time threshold monitoring for low stock items, expiring batches, expired
            write-offs, pending POs, and branch transfers.
          </p>
        </div>

        <button
          onClick={() =>
            toast(`Export Risk Alerts: Alerts for ${selectedBranch.name} exported to CSV.`)
          }
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-purple-600" />
          Export Risk Alerts
        </button>
      </div>

      {/* 5 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Low Stock */}
        <div
          onClick={() => setActiveCategory('Low Stock')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeCategory === 'Low Stock'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md'
              : 'bg-white border-line hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${activeCategory === 'Low Stock' ? 'text-white' : 'text-amber-700'}`}
            >
              Low Stock
            </span>
            <AlertTriangle
              className={`w-4 h-4 ${activeCategory === 'Low Stock' ? 'text-white' : 'text-amber-600'}`}
            />
          </div>
          <div className="text-2xl font-bold">
            {
              alerts.filter(
                (a) =>
                  (isAllBranches || a.branchId === selectedBranchId) && a.category === 'Low Stock',
              ).length
            }{' '}
            SKUs
          </div>
          <div
            className={`text-[10.5px] font-semibold mt-1 ${activeCategory === 'Low Stock' ? 'text-amber-100' : 'text-amber-700'}`}
          >
            Reorder Required
          </div>
        </div>

        {/* Card 2: Expiring This Week */}
        <div
          onClick={() => setActiveCategory('Expiring This Week')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeCategory === 'Expiring This Week'
              ? 'bg-purple-600 text-white border-purple-700 shadow-md'
              : 'bg-white border-line hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${activeCategory === 'Expiring This Week' ? 'text-white' : 'text-purple-700'}`}
            >
              Expiring This Week
            </span>
            <Clock
              className={`w-4 h-4 ${activeCategory === 'Expiring This Week' ? 'text-white' : 'text-purple-600'}`}
            />
          </div>
          <div className="text-2xl font-bold">
            {
              alerts.filter(
                (a) =>
                  (isAllBranches || a.branchId === selectedBranchId) &&
                  a.category === 'Expiring This Week',
              ).length
            }{' '}
            Batches
          </div>
          <div
            className={`text-[10.5px] font-semibold mt-1 ${activeCategory === 'Expiring This Week' ? 'text-purple-100' : 'text-purple-700'}`}
          >
            &lt;7 Days Expiry
          </div>
        </div>

        {/* Card 3: Expired */}
        <div
          onClick={() => setActiveCategory('Expired')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeCategory === 'Expired'
              ? 'bg-rose-600 text-white border-rose-700 shadow-md'
              : 'bg-white border-line hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${activeCategory === 'Expired' ? 'text-white' : 'text-rose-700'}`}
            >
              Expired
            </span>
            <XCircle
              className={`w-4 h-4 ${activeCategory === 'Expired' ? 'text-white' : 'text-rose-600'}`}
            />
          </div>
          <div className="text-2xl font-bold">
            {
              alerts.filter(
                (a) =>
                  (isAllBranches || a.branchId === selectedBranchId) && a.category === 'Expired',
              ).length
            }{' '}
            Batches
          </div>
          <div
            className={`text-[10.5px] font-semibold mt-1 ${activeCategory === 'Expired' ? 'text-rose-100' : 'text-rose-700'}`}
          >
            Write-Off Pending
          </div>
        </div>

        {/* Card 4: Pending Purchase Orders */}
        <div
          onClick={() => setActiveCategory('Pending Purchase Orders')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeCategory === 'Pending Purchase Orders'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md'
              : 'bg-white border-line hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${activeCategory === 'Pending Purchase Orders' ? 'text-white' : 'text-blue-700'}`}
            >
              Pending PO Orders
            </span>
            <ShoppingCart
              className={`w-4 h-4 ${activeCategory === 'Pending Purchase Orders' ? 'text-white' : 'text-blue-600'}`}
            />
          </div>
          <div className="text-2xl font-bold">
            {
              alerts.filter(
                (a) =>
                  (isAllBranches || a.branchId === selectedBranchId) &&
                  a.category === 'Pending Purchase Orders',
              ).length
            }{' '}
            POs
          </div>
          <div
            className={`text-[10.5px] font-semibold mt-1 ${activeCategory === 'Pending Purchase Orders' ? 'text-blue-100' : 'text-blue-700'}`}
          >
            Active Fulfillment
          </div>
        </div>

        {/* Card 5: Pending Transfers */}
        <div
          onClick={() => setActiveCategory('Pending Transfers')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeCategory === 'Pending Transfers'
              ? 'bg-teal-600 text-white border-teal-700 shadow-md'
              : 'bg-white border-line hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${activeCategory === 'Pending Transfers' ? 'text-white' : 'text-teal-700'}`}
            >
              Pending Transfers
            </span>
            <ArrowLeftRight
              className={`w-4 h-4 ${activeCategory === 'Pending Transfers' ? 'text-white' : 'text-teal-600'}`}
            />
          </div>
          <div className="text-2xl font-bold">
            {
              alerts.filter(
                (a) =>
                  (isAllBranches || a.branchId === selectedBranchId) &&
                  a.category === 'Pending Transfers',
              ).length
            }{' '}
            Shipments
          </div>
          <div
            className={`text-[10.5px] font-semibold mt-1 ${activeCategory === 'Pending Transfers' ? 'text-teal-100' : 'text-teal-700'}`}
          >
            In-Transit Inter-Branch
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'all', label: 'All Active Risk Alerts', count: filteredAlerts.length },
          {
            id: 'Low Stock',
            label: 'Low Stock Alerts',
            count: filteredAlerts.filter((a) => a.category === 'Low Stock').length,
          },
          {
            id: 'Expiring This Week',
            label: 'Expiring This Week',
            count: filteredAlerts.filter((a) => a.category === 'Expiring This Week').length,
          },
          {
            id: 'Expired',
            label: 'Expired Stock',
            count: filteredAlerts.filter((a) => a.category === 'Expired').length,
          },
          {
            id: 'Pending Purchase Orders',
            label: 'Pending POs',
            count: filteredAlerts.filter((a) => a.category === 'Pending Purchase Orders').length,
          },
          {
            id: 'Pending Transfers',
            label: 'Pending Transfers',
            count: filteredAlerts.filter((a) => a.category === 'Pending Transfers').length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
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

      {/* ALERT FEED CARDS */}
      <div className="space-y-3">
        {filteredAlerts.map((a) => (
          <div
            key={a.id}
            className="p-4 bg-white rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  a.severity === 'Critical'
                    ? 'bg-rose-100 text-rose-700'
                    : a.severity === 'High'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {a.category === 'Low Stock' && <AlertTriangle className="w-5 h-5" />}
                {a.category === 'Expiring This Week' && <Clock className="w-5 h-5" />}
                {a.category === 'Expired' && <XCircle className="w-5 h-5" />}
                {a.category === 'Pending Purchase Orders' && <ShoppingCart className="w-5 h-5" />}
                {a.category === 'Pending Transfers' && <ArrowLeftRight className="w-5 h-5" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      a.category === 'Low Stock'
                        ? 'bg-amber-100 text-amber-800'
                        : a.category === 'Expiring This Week'
                          ? 'bg-purple-100 text-purple-800'
                          : a.category === 'Expired'
                            ? 'bg-rose-100 text-rose-800'
                            : a.category === 'Pending Purchase Orders'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {a.category}
                  </span>
                  <span className="text-[10px] font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {a.branchName}
                  </span>
                  <span className="text-[10px] text-muted">
                    {a.id} • {a.date}
                  </span>
                </div>
                <div className="text-sm font-bold text-ink">{a.title}</div>
                <div className="text-xs text-soft font-medium">{a.detail}</div>
              </div>
            </div>

            <button
              onClick={() => handleAlertAction(a)}
              className="px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 transition-all whitespace-nowrap self-end sm:self-auto"
            >
              {a.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
