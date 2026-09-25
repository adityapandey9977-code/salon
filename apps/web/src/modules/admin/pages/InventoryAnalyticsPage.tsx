import { BoxIcon, Button, cn, useToast } from '@salon-spa-saas/ui';
import { ChevronDown, ClipboardList, PackagePlus, Pencil, Search, Trash2, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { DialogModal } from '../../../shared/components/DialogModal';

const initialStockItems = [
  {
    name: 'Organic Hydration Serum 100ml',
    category: 'Hair Therapy',
    stock: 14,
    status: 'Low Stock Alert',
    value: '₹21,000',
    alert: true,
  },
  {
    name: 'Premium Keratin Mask 500g',
    category: 'Hair Styling',
    stock: 45,
    status: 'In Stock',
    value: '₹67,500',
    alert: false,
  },
  {
    name: 'Teatree Face Scrub 200g',
    category: 'Skin Care',
    stock: 8,
    status: 'Reorder Required',
    value: '₹8,000',
    alert: true,
  },
  {
    name: 'Professional Gel Polish Kit',
    category: 'Nails Art',
    stock: 32,
    status: 'In Stock',
    value: '₹16,000',
    alert: false,
  },
];

const mockOrderLogs: Record<
  string,
  Array<{
    date: string;
    orderId: string;
    quantity: number;
    cost: string;
    status: 'Delivered' | 'In Transit' | 'Pending';
  }>
> = {
  'Organic Hydration Serum 100ml': [
    { date: '2026-07-15', orderId: 'ORD-9874', quantity: 24, cost: '₹36,000', status: 'Delivered' },
    { date: '2026-06-10', orderId: 'ORD-9612', quantity: 15, cost: '₹22,500', status: 'Delivered' },
    { date: '2026-05-02', orderId: 'ORD-9304', quantity: 30, cost: '₹45,000', status: 'Delivered' },
  ],
  'Premium Keratin Mask 500g': [
    { date: '2026-07-20', orderId: 'ORD-9905', quantity: 10, cost: '₹15,000', status: 'Delivered' },
    { date: '2026-06-15', orderId: 'ORD-9654', quantity: 20, cost: '₹30,000', status: 'Delivered' },
  ],
  'Teatree Face Scrub 200g': [
    {
      date: '2026-07-18',
      orderId: 'ORD-9889',
      quantity: 15,
      cost: '₹15,000',
      status: 'In Transit',
    },
    { date: '2026-05-20', orderId: 'ORD-9411', quantity: 10, cost: '₹10,000', status: 'Delivered' },
  ],
  'Professional Gel Polish Kit': [
    { date: '2026-07-28', orderId: 'ORD-9972', quantity: 8, cost: '₹4,000', status: 'Pending' },
    { date: '2026-06-01', orderId: 'ORD-9598', quantity: 12, cost: '₹6,000', status: 'Delivered' },
  ],
};

export function InventoryAnalyticsPage() {
  const { toast } = useToast();
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [searchTerm, setSearchTerm] = useState('');

  // Custom Filter states
  const [stockFilter, setStockFilter] = useState<'All' | 'Low Stock' | 'In Stock'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Delete inventory item handler
  const handleDeleteItem = (name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setStockItems((prev) => prev.filter((item) => item.name !== name));
      toast(`Successfully deleted ${name} from inventory.`);
    }
  };

  // Modals state
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<(typeof initialStockItems)[0] | null>(null);
  const [selectedItemForLogs, setSelectedItemForLogs] = useState<
    (typeof initialStockItems)[0] | null
  >(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Hair Therapy');
  const [newStock, setNewStock] = useState('20');
  const [newValue, setNewValue] = useState('₹10,000');

  // Edit states
  const [editStock, setEditStock] = useState('');
  const [editValue, setEditValue] = useState('');

  // Add stock item handler
  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast('Please enter a valid item name.');
      return;
    }

    const qty = Number.parseInt(newStock) || 0;
    const isAlert = qty < 15;
    const computedStatus =
      qty === 0 ? 'Reorder Required' : isAlert ? 'Low Stock Alert' : 'In Stock';

    const newObj = {
      name: newName,
      category: newCategory,
      stock: qty,
      status: computedStatus,
      value: newValue.startsWith('₹') ? newValue : `₹${newValue}`,
      alert: isAlert || qty === 0,
    };

    setStockItems((prev) => [...prev, newObj]);
    toast(`Successfully logged inventory item: ${newName}!`);

    // Reset and close drawer
    setNewName('');
    setIsAddDrawerOpen(false);
  };

  // Edit item action
  const openEditModal = (item: (typeof initialStockItems)[0]) => {
    setSelectedItem(item);
    setEditStock(item.stock.toString());
    setEditValue(item.value);
    setIsEditModalOpen(true);
  };

  // Save edits
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qty = Number.parseInt(editStock) || 0;
    const isAlert = qty < 15;
    const computedStatus =
      qty === 0 ? 'Reorder Required' : isAlert ? 'Low Stock Alert' : 'In Stock';

    setStockItems((prev) =>
      prev.map((item) => {
        if (item.name === selectedItem.name) {
          return {
            ...item,
            stock: qty,
            status: computedStatus,
            value: editValue.startsWith('₹') ? editValue : `₹${editValue}`,
            alert: isAlert || qty === 0,
          };
        }
        return item;
      }),
    );

    toast(`Updated supply parameters for ${selectedItem.name}!`);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  // Filter calculations
  const filtered = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock =
      stockFilter === 'All'
        ? true
        : stockFilter === 'Low Stock'
          ? item.alert === true
          : item.alert === false;

    const matchesCategory = categoryFilter === 'All' ? true : item.category === categoryFilter;

    return matchesSearch && matchesStock && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-300 relative">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-serif text-[26px] text-ink font-semibold tracking-tight">
            Inventory &amp; Stock Levels
          </h1>
          <p className="text-[13px] text-muted mt-1">
            Track store items, check low stock alerts, and place supply orders.
          </p>
        </div>
        <Button
          onClick={() => setIsAddDrawerOpen(true)}
          className="h-[40px] px-4 rounded-xl text-xs font-semibold premium-btn-primary gap-1.5 flex items-center shadow-md hover:shadow-lg transition-all"
        >
          <BoxIcon className="w-3.5 h-3.5" />
          <span>Place Restock Order</span>
        </Button>
      </div>

      {/* Premium Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Total Inventory Value', count: '₹85.4 Lakhs', detail: 'Across all 3 branches' },
          {
            label: 'Low Stock Items',
            count: `${stockItems.filter((i) => i.alert).length} Alerts`,
            detail: 'Items requiring reordering',
          },
          { label: 'Pending Shipments', count: '03 Orders', detail: 'En route from suppliers' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-white via-[#FCFAFF] to-[#F8F5FF] border border-[#5A2EA6]/10 rounded-[20px] shadow-xs hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 p-5 cursor-pointer"
          >
            <span className="text-[10px] font-bold text-soft uppercase tracking-wider block">
              {stat.label}
            </span>
            <strong className="text-xl font-serif font-bold text-ink mt-1.5 block">
              {stat.count}
            </strong>
            <span className="text-[10.5px] text-[#5A2EA6] mt-0.5 font-semibold block">
              {stat.detail}
            </span>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-line rounded-xl py-2 px-3 pl-9 outline-none text-[12px] placeholder:text-soft focus:border-[#5A2EA6] shadow-xs"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Stock Alert Filter Select */}
          <div className="flex items-center gap-1.5 bg-white border border-[#ECE6F8] rounded-xl px-2.5 py-1 text-[11px] font-semibold text-ink shadow-xs">
            <span className="text-[#8A6AB8]">Stock:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-transparent border-none outline-none font-bold text-ink cursor-pointer focus:ring-0 text-[11.5px]"
            >
              <option value="All">All Stocks</option>
              <option value="Low Stock">Low Stock Alerts</option>
              <option value="In Stock">In Stock Only</option>
            </select>
          </div>

          {/* Category Filter Select */}
          <div className="flex items-center gap-1.5 bg-white border border-[#ECE6F8] rounded-xl px-2.5 py-1 text-[11px] font-semibold text-ink shadow-xs">
            <span className="text-[#8A6AB8]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-ink cursor-pointer focus:ring-0 text-[11.5px]"
            >
              <option value="All">All Categories</option>
              <option value="Hair Therapy">Hair Therapy</option>
              <option value="Hair Styling">Hair Styling</option>
              <option value="Skin Care">Skin Care</option>
              <option value="Nails Art">Nails Art</option>
            </select>
          </div>
        </div>
      </div>

      {/* Premium Table Card */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full">
            <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
              Stock Inventory Log
            </h3>
            <p className="text-[10px] text-white/80 mt-0.5">
              Retail items and professional cabin use stock
            </p>
          </div>
        </div>
        <div className="p-0 flex-1 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Item Name',
                    'Category',
                    'Available Qty',
                    'Status',
                    'Estimated Value',
                    'Actions',
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-4 font-bold text-[10px] tracking-wider uppercase',
                        i === 0 ? 'pl-6' : i === 5 ? 'pr-6 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {filtered.map((item, i) => (
                  <tr key={i} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-4 pl-6 font-bold text-ink">{item.name}</td>
                    <td className="p-4 font-semibold">{item.category}</td>
                    <td className="p-4 font-bold text-ink">{item.stock} units</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold ${
                          item.alert
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-[#5A2EA6]">{item.value}</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Quick Edit Stock"
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItemForLogs(item);
                            setIsLogsDrawerOpen(true);
                          }}
                          title="View Order Logs"
                          className="text-[#5A2EA6] hover:bg-[#5A2EA6]/5 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.name)}
                          title="Delete Item"
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all border-0 cursor-pointer bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Slide-Over Drawer for Restock Order */}
      <div
        className={cn(
          'fixed inset-0 z-50 overflow-hidden transition-opacity duration-300',
          isAddDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsAddDrawerOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div
            className={cn(
              'w-screen max-w-md bg-white shadow-2xl transform transition duration-300 ease-in-out flex flex-col justify-between',
              isAddDrawerOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            {/* Drawer Header */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="flex items-center gap-2.5 z-10">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                  <PackagePlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-[17px] text-white font-bold tracking-tight">
                    Place Restock Order
                  </h2>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    Add a retail product or professional supply log
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddDrawerOpen(false)}
                className="z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-0 shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body / Form */}
            <form
              onSubmit={handleAddStock}
              className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FCFAFF]"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Item Stock Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Argan Oil Extract 200ml"
                  className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                  Category Type
                </label>
                <div className="relative">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl pl-3.5 pr-9 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition cursor-pointer appearance-none"
                  >
                    <option value="Hair Therapy">Hair Therapy</option>
                    <option value="Hair Styling">Hair Styling</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Nails Art">Nails Art</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-soft pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-ink uppercase tracking-wider">
                    Valuation (INR)
                  </label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. ₹12,000"
                    className="w-full bg-white border border-[#E9E1FF] rounded-xl px-3.5 py-2.5 text-[12px] font-medium text-ink outline-none focus:border-[#5A2EA6] shadow-2xs transition"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-white border border-[#EBE3FA] rounded-2xl text-[11px] text-[#5A2EA6] font-medium leading-relaxed shadow-3xs">
                💡 <strong>Auto-alert threshold:</strong> Low stock status logic threshold
                automatically triggers when standard inventory quantity dips below 15 units.
              </div>

              {/* Drawer Footer Buttons */}
              <div className="pt-4 border-t border-[#EBE3FA] flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-soft border border-line bg-white hover:bg-paper/20 hover:text-ink transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white bg-gradient-to-r from-[#7B4DFF] to-[#A970FF] hover:from-[#6B3DE6] hover:to-[#9560EE] shadow-sm hover:shadow-md cursor-pointer transition border-0"
                >
                  Place Restock Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Edit Dialog */}
      <DialogModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Quick Edit Inventory Stock"
        description={`Configure parameters for ${selectedItem?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Operational Quantity Available</label>
            <input
              type="number"
              value={editStock}
              onChange={(e) => setEditStock(e.target.value)}
              className="bg-paper/40 border border-line rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-ink">Estimated Valuation (INR)</label>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="bg-paper/40 border border-[#5A2EA6]/20 rounded-xl p-2.5 text-[12px] outline-none focus:border-[#5A2EA6]"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold premium-btn-primary cursor-pointer"
            >
              Save Stock Levels
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-line hover:bg-paper/20 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogModal>

      {/* Right Slide-Over Drawer for View Order Logs */}
      <div
        className={cn(
          'fixed inset-0 z-50 overflow-hidden transition-opacity duration-300',
          isLogsDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsLogsDrawerOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div
            className={cn(
              'w-screen max-w-md bg-white shadow-2xl transform transition duration-300 ease-in-out flex flex-col justify-between',
              isLogsDrawerOpen ? 'translate-x-0' : 'translate-x-full',
            )}
          >
            {/* Drawer Header */}
            <div className="premium-card-header px-6 py-5 relative min-h-[72px] flex items-center justify-between z-10 shrink-0">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="flex items-center gap-2.5 z-10">
                <div className="p-2 bg-white/15 rounded-xl backdrop-blur-md">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-[17px] text-white font-bold tracking-tight">
                    Order History Logs
                  </h2>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    Listing recent supply invoices & restock requests
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogsDrawerOpen(false)}
                className="z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border-0 shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            {selectedItemForLogs && (
              <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FCFAFF]">
                {/* Active Item Summary */}
                <div className="bg-white border border-[#EBE3FA] p-4.5 rounded-2xl shadow-3xs flex justify-between items-center">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#3B2647]">
                      {selectedItemForLogs.name}
                    </h4>
                    <p className="text-[10px] text-soft mt-1">
                      {selectedItemForLogs.category} • {selectedItemForLogs.stock} units left
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      selectedItemForLogs.alert
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}
                  >
                    {selectedItemForLogs.status}
                  </span>
                </div>

                {/* Logs History Ledger */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-soft uppercase tracking-wider pl-1">
                    Restock Event Logs
                  </h3>

                  {(
                    mockOrderLogs[selectedItemForLogs.name] || [
                      {
                        date: '2026-07-10',
                        orderId: 'ORD-9810',
                        quantity: 15,
                        cost: '₹12,000',
                        status: 'Delivered',
                      },
                      {
                        date: '2026-06-05',
                        orderId: 'ORD-9540',
                        quantity: 10,
                        cost: '₹8,000',
                        status: 'Delivered',
                      },
                    ]
                  ).map((log, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-[#EBE3FA] p-4 rounded-xl shadow-2xs flex justify-between items-center hover:border-[#5A2EA6]/25 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-bold text-ink">{log.orderId}</span>
                          <span className="text-[10px] text-soft font-semibold">{log.date}</span>
                        </div>
                        <p className="text-[10px] text-soft">
                          Quantity: <strong className="text-ink">{log.quantity} units</strong> •
                          Cost: <strong className="text-[#5A2EA6]">{log.cost}</strong>
                        </p>
                      </div>

                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[8.5px] font-extrabold ${
                          log.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : log.status === 'In Transit'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drawer Footer */}
            <div className="p-4 bg-white border-t border-[#EBE3FA] flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsLogsDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl text-[12px] font-bold text-soft border border-line bg-white hover:bg-paper/20 hover:text-ink transition cursor-pointer"
              >
                Dismiss Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
