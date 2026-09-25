import { useToast } from '@salon-spa-saas/ui';
import {
  Barcode,
  Boxes,
  Building,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit2,
  Filter,
  FolderPlus,
  Layers,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  inventoryApi,
  type ApiInventoryCategory,
  type ApiInventorySku,
  type CreateSkuPayload,
  type UpdateSkuPayload,
} from '../../../shared/api';

export function ProductsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'products' | 'categories' | 'variants' | 'uom' | 'brands'
  >('products');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skus, setSkus] = useState<ApiInventorySku[]>([]);
  const [categories, setCategories] = useState<ApiInventoryCategory[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'retail' | 'consumable'>('all');

  // Add SKU Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingSku, setIsSubmittingSku] = useState(false);

  // Edit SKU Modal
  const [editingSku, setEditingSku] = useState<ApiInventorySku | null>(null);
  const [isUpdatingSku, setIsUpdatingSku] = useState(false);

  // Add Category Modal
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  // Product Add Form State
  const [skuForm, setSkuForm] = useState({
    skuCode: '',
    barcode: '',
    name: '',
    description: '',
    categoryId: '',
    unitOfMeasure: '1000 ml',
    costPrice: '850',
    retailPrice: '1200',
    taxRatePercent: '18',
    isConsumable: true,
    isRetail: true,
    reorderLevel: '10',
    minStock: '5',
    maxStock: '50',
  });

  // Fetch initial data
  const fetchData = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const [skuData, categoryData] = await Promise.all([
        inventoryApi.listSkus(),
        inventoryApi.listCategories(),
      ]);

      setSkus(skuData);
      setCategories(categoryData);

      // Set default category for form if available
      if (categoryData.length > 0 && !skuForm.categoryId) {
        setSkuForm((prev) => ({ ...prev, categoryId: categoryData[0].id }));
      }
    } catch (err: any) {
      console.error('Failed to load inventory products:', err);
      toast('Failed to load product catalog. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered SKUs
  const filteredSkus = useMemo(() => {
    return skus.filter((item) => {
      const matchesCategory =
        categoryFilter === 'all' || item.categoryId === categoryFilter;

      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'retail' && item.isRetail) ||
        (typeFilter === 'consumable' && item.isConsumable);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.skuCode.toLowerCase().includes(query) ||
        (item.barcode && item.barcode.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query));

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [skus, categoryFilter, typeFilter, searchQuery]);

  // Handle Add Product / SKU
  const handleAddSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuForm.name.trim() || !skuForm.skuCode.trim()) {
      toast('Validation Error: Please fill in product name and SKU code.');
      return;
    }

    try {
      setIsSubmittingSku(true);
      const payload: CreateSkuPayload = {
        skuCode: skuForm.skuCode.trim().toUpperCase(),
        barcode: skuForm.barcode.trim() || undefined,
        name: skuForm.name.trim(),
        description: skuForm.description.trim() || undefined,
        categoryId: skuForm.categoryId || (categories[0]?.id ?? ''),
        unitOfMeasure: skuForm.unitOfMeasure.trim() || 'PIECE',
        costPrice: Number.parseFloat(skuForm.costPrice) || 0,
        retailPrice: skuForm.retailPrice ? Number.parseFloat(skuForm.retailPrice) : undefined,
        taxRatePercent: Number.parseFloat(skuForm.taxRatePercent) || 18,
        isConsumable: skuForm.isConsumable,
        isRetail: skuForm.isRetail,
        reorderEnabled: true,
      };

      const created = await inventoryApi.createSku(payload);
      setSkus((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      toast(`SKU Created: ${created.name} (${created.skuCode}) saved successfully.`);

      // Reset form
      setSkuForm({
        skuCode: '',
        barcode: '',
        name: '',
        description: '',
        categoryId: categories[0]?.id || '',
        unitOfMeasure: '1000 ml',
        costPrice: '850',
        retailPrice: '1200',
        taxRatePercent: '18',
        isConsumable: true,
        isRetail: true,
        reorderLevel: '10',
        minStock: '5',
        maxStock: '50',
      });
    } catch (err: any) {
      console.error('Failed to create SKU:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to create product SKU';
      toast(`Error: ${msg}`);
    } finally {
      setIsSubmittingSku(false);
    }
  };

  // Handle Update SKU
  const handleUpdateSku = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSku) return;

    try {
      setIsUpdatingSku(true);
      const payload: UpdateSkuPayload = {
        name: editingSku.name,
        barcode: editingSku.barcode || undefined,
        description: editingSku.description || undefined,
        categoryId: editingSku.categoryId,
        unitOfMeasure: editingSku.unitOfMeasure,
        costPrice: Number(editingSku.costPrice) || 0,
        retailPrice: editingSku.retailPrice ? Number(editingSku.retailPrice) : undefined,
        isConsumable: editingSku.isConsumable,
        isRetail: editingSku.isRetail,
        isActive: editingSku.isActive,
      };

      const updated = await inventoryApi.updateSku(editingSku.id, payload);
      setSkus((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
      setEditingSku(null);
      toast(`Product Updated: ${updated.name} updated successfully.`);
    } catch (err: any) {
      console.error('Failed to update SKU:', err);
      toast('Failed to update product SKU. Please check inputs.');
    } finally {
      setIsUpdatingSku(false);
    }
  };

  // Handle Delete SKU
  const handleDeleteSku = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to deactivate and remove "${name}" from the catalog?`)) {
      return;
    }

    try {
      await inventoryApi.deleteSku(id);
      setSkus((prev) => prev.filter((s) => s.id !== id));
      toast(`Product Removed: ${name} has been deactivated.`);
    } catch (err: any) {
      console.error('Failed to delete SKU:', err);
      toast('Failed to remove SKU from catalog.');
    }
  };

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast('Validation Error: Please enter category name.');
      return;
    }

    try {
      setIsSubmittingCategory(true);
      const created = await inventoryApi.createCategory({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
      });

      setCategories((prev) => [...prev, created]);
      setIsAddCategoryOpen(false);
      setCategoryForm({ name: '', description: '' });
      toast(`Category Created: ${created.name} is now available.`);
    } catch (err: any) {
      console.error('Failed to create category:', err);
      toast('Failed to create category.');
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredSkus.length === 0) {
      toast('No products to export.');
      return;
    }

    const headers = [
      'SKU Code',
      'Name',
      'Barcode',
      'Category',
      'Unit',
      'Cost Price (INR)',
      'Retail Price (INR)',
      'Stock On Hand',
      'Type',
      'Status',
    ];

    const rows = filteredSkus.map((s) => {
      const categoryName =
        categories.find((c) => c.id === s.categoryId)?.name || 'Uncategorized';
      const stockOnHand = s.branchStocks?.[0]?.quantityOnHandProjection ?? 0;
      const typeStr = [s.isRetail && 'Retail', s.isConsumable && 'Consumable']
        .filter(Boolean)
        .join(' & ') || 'Standard';

      return [
        `"${s.skuCode}"`,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.barcode || ''}"`,
        `"${categoryName}"`,
        `"${s.unitOfMeasure}"`,
        Number(s.costPrice).toFixed(2),
        s.retailPrice ? Number(s.retailPrice).toFixed(2) : 'N/A',
        stockOnHand,
        `"${typeStr}"`,
        s.isActive ? 'Active' : 'Inactive',
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', ` _Product_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Catalog Exported: Downloaded product master CSV.');
  };

  // Static reference data for Variants, UOM, and Brands tabs
  const variantsList = [
    {
      name: 'L’Oréal Professionnel Developer',
      variants: ['20 Vol (1000ml)', '30 Vol (1000ml)', '40 Vol (1000ml)'],
      baseSku: 'LOR-DEV',
    },
    {
      name: 'Kérastase Nutritive Mask',
      variants: ['200 ml Retail Jar', '500 ml Salon Backbar Tub'],
      baseSku: 'KER-NUT',
    },
    {
      name: 'Hydra Facial Cleansing Gel',
      variants: ['100 ml Travel Size', '250 ml Standard', '500 ml Clinic Dispenser'],
      baseSku: 'HYD-CLE',
    },
    {
      name: 'Olaplex Bond Multiplier',
      variants: ['100 ml Salon Intro Kit', '525 ml Professional Backbar'],
      baseSku: 'OLA-NO1',
    },
    {
      name: 'Aroma Therapy Massage Oil',
      variants: ['250 ml Bottle', '500 ml Dispenser', '5000 ml Bulk Refill'],
      baseSku: 'SPA-MAS',
    },
  ];

  const uomList = [
    { code: 'ML', name: 'Millilitres (ml)', type: 'Volume', precision: 0, count: 5 },
    { code: 'GM', name: 'Grams (gm)', type: 'Weight', precision: 1, count: 2 },
    { code: 'PCS', name: 'Pieces / Units (pcs)', type: 'Quantity', precision: 0, count: 4 },
    { code: 'TUB', name: 'Tubes (tub)', type: 'Unit', precision: 0, count: 2 },
    { code: 'BTL', name: 'Bottles (btl)', type: 'Container', precision: 0, count: 3 },
    { code: 'PKT', name: 'Packets / Sachets (pkt)', type: 'Package', precision: 0, count: 1 },
  ];

  const brandsList = [
    { name: 'L’Oréal Professionnel', origin: 'France', tier: 'Premium Professional', activeProducts: 4 },
    { name: 'Kérastase Paris', origin: 'France', tier: 'Luxury Haircare', activeProducts: 3 },
    { name: 'Olaplex', origin: 'USA', tier: 'Bond Repair Pioneer', activeProducts: 2 },
    { name: 'Schwarzkopf Professional', origin: 'Germany', tier: 'High Performance Color', activeProducts: 2 },
    { name: 'Wella Professionals', origin: 'Germany', tier: 'Salon Essential', activeProducts: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight flex items-center gap-2.5">
            Product Master Data & SKU Catalog
            {loading && <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />}
          </h1>
          <p className="text-xs text-soft mt-1">
            Manage salon inventory categories, barcodes, variants, UOMs, purchase prices, retail selling rates, and stock thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(false)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-line bg-white hover:bg-pine/5 text-ink transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh Catalog Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-purple-600' : 'text-soft'}`} />
            Refresh
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-all border-0"
          >
            <Plus className="w-4 h-4" />
            Add Master Product SKU
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-purple-600 text-purple-600 bg-white hover:bg-purple-50 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-600" />
            Export Product Master
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-line pb-2 no-scrollbar">
        {[
          { id: 'products', label: 'All Products & Master SKUs', count: skus.length },
          { id: 'categories', label: 'Product Categories', count: categories.length },
          { id: 'variants', label: 'Product Variants (Sizes)', count: variantsList.length },
          { id: 'uom', label: 'Units of Measure (UOM)', count: uomList.length },
          { id: 'brands', label: 'Brands & Manufacturers', count: brandsList.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-soft hover:text-ink border border-line'
              }`}
          >
            {tab.label}{' '}
            {tab.count !== null && (
              <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-pine/10 text-ink'
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SEARCH AND FILTER BAR (Visible for products & categories) */}
      {activeTab === 'products' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-line shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search product, SKU code, or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none focus:border-purple-600 font-medium"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none font-semibold text-ink cursor-pointer"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="p-1.5 text-xs bg-pine/10 border border-line rounded-xl outline-none font-semibold text-ink cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="retail">Retail Only</option>
              <option value="consumable">Consumable Only</option>
            </select>
          </div>

          <div className="text-xs text-soft font-medium">
            Showing <span className="font-bold text-ink">{filteredSkus.length}</span> active master SKUs
          </div>
        </div>
      )}

      {/* DYNAMIC TAB VIEW CONTENT */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-line text-center space-y-3">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-ink">Loading product catalog from database...</p>
        </div>
      ) : activeTab === 'categories' ? (
        /* CATEGORIES TAB */
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <div>
              <h3 className="text-sm font-bold text-ink">Catalog Product Categories</h3>
              <p className="text-xs text-soft">Organize products into salon service backbar, retail, and spa hierarchies.</p>
            </div>
            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border-0"
            >
              <FolderPlus className="w-4 h-4" />
              New Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const assignedCount = skus.filter((p) => p.categoryId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-2xl border border-line shadow-sm flex flex-col justify-between hover:border-purple-300 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-ink">{c.name}</h3>
                      <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-bold text-[10px] rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-soft line-clamp-2">
                      {c.description || 'Standard salon category classification.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-line/40 flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">
                      {assignedCount} Product{assignedCount === 1 ? '' : 's'}
                    </span>
                    <button
                      onClick={() => {
                        setCategoryFilter(c.id);
                        setActiveTab('products');
                      }}
                      className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
                    >
                      View SKUs <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === 'variants' ? (
        /* VARIANTS TAB */
        <div className="space-y-4">
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <h3 className="text-sm font-bold text-ink">Master Product Variant Matrix</h3>
            <p className="text-xs text-soft">Configured packaging variants, bottle sizes, and salon backbar configurations.</p>
          </div>

          <div className="space-y-3">
            {variantsList.map((v, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-line shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-ink">{v.name}</h3>
                    <span className="px-2 py-0.5 bg-pine/10 text-[10px] font-mono font-bold text-purple-700 rounded-md">
                      Prefix: {v.baseSku}
                    </span>
                  </div>
                  <p className="text-xs text-soft mt-1">Multi-size master variant group</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {v.variants.map((vName, vIdx) => (
                    <span
                      key={vIdx}
                      className="px-3 py-1 bg-purple-50/80 border border-purple-200/60 text-purple-800 text-xs font-semibold rounded-xl"
                    >
                      {vName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'uom' ? (
        /* UOM TAB */
        <div className="space-y-4">
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <h3 className="text-sm font-bold text-ink">Standard Units of Measure (UOM)</h3>
            <p className="text-xs text-soft">Standard units used for procurement, recipe dosing, and retail checkout.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uomList.map((u) => (
              <div key={u.code} className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg">
                    {u.code}
                  </span>
                  <span className="text-[11px] text-soft font-medium">{u.type}</span>
                </div>
                <h4 className="text-sm font-bold text-ink">{u.name}</h4>
                <p className="text-xs text-soft">Used across {u.count} active SKUs</p>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'brands' ? (
        /* BRANDS TAB */
        <div className="space-y-4">
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <h3 className="text-sm font-bold text-ink">Partner Brands & Manufacturers</h3>
            <p className="text-xs text-soft">Authorized cosmetic and salon brands supplied across our franchise locations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandsList.map((b) => (
              <div key={b.name} className="bg-white p-5 rounded-2xl border border-line shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-ink">{b.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                    Active Partner
                  </span>
                </div>
                <p className="text-xs text-soft">{b.tier} • {b.origin}</p>
                <div className="pt-2 border-t border-line/40 text-xs font-semibold text-purple-700">
                  {b.activeProducts} Associated SKUs
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MAIN PRODUCTS MASTER TABLE */
        <div className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
          {filteredSkus.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-muted mx-auto" />
              <h3 className="text-base font-bold text-ink">No Products Found</h3>
              <p className="text-xs text-soft max-w-sm mx-auto">
                No product SKUs match your search query or filter selection.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setTypeFilter('all');
                }}
                className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-bold border border-purple-200 transition cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-pine/5 text-soft uppercase tracking-wider font-semibold border-b border-line">
                    <th className="p-3.5">SKU & Product Name</th>
                    <th className="p-3.5">Barcode</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Unit (UOM)</th>
                    <th className="p-3.5">Cost / Retail Price</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Stock On Hand</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {filteredSkus.map((p) => {
                    const category = categories.find((c) => c.id === p.categoryId);
                    const stockQty = p.branchStocks?.[0]?.quantityOnHandProjection ?? 0;
                    const isLowStock = Number(stockQty) <= (p.branchStocks?.[0]?.reorderLevel || 5);

                    return (
                      <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-ink text-[13px]">{p.name}</div>
                          <div className="text-[11px] font-mono text-purple-700 font-semibold">{p.skuCode}</div>
                        </td>
                        <td className="p-3.5 font-mono text-soft">
                          {p.barcode ? (
                            <span className="flex items-center gap-1">
                              <Barcode className="w-3.5 h-3.5 text-muted" />
                              {p.barcode}
                            </span>
                          ) : (
                            <span className="text-muted italic">None</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg font-semibold text-[11px] border border-purple-100">
                            {category?.name || 'Unassigned'}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-ink">{p.unitOfMeasure}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-emerald-700">₹{Number(p.costPrice).toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-soft">
                            {p.retailPrice ? `Sell: ₹${Number(p.retailPrice).toLocaleString('en-IN')}` : 'Internal / Cost Only'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {p.isRetail && (
                              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                                Retail
                              </span>
                            )}
                            {p.isConsumable && (
                              <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded">
                                Consumable
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold text-sm ${isLowStock ? 'text-rose-600' : 'text-ink'}`}>
                              {stockQty}
                            </span>
                            <span className="text-[10px] text-soft">{p.unitOfMeasure}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingSku(p)}
                              className="p-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition cursor-pointer border border-purple-200"
                              title="Edit SKU"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSku(p.id, p.name)}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer border border-rose-200"
                              title="Delete SKU"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Master Product Modal */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] w-full max-w-4xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] overflow-hidden border border-[#5A2EA6]/10 flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
              {/* LEFT SIDE: PRODUCT CATALOG BANNER */}
              <div className="w-full md:w-5/12 bg-gradient-to-br from-[#FCFAFF] via-[#F3E8FF] to-[#E2D4FF] p-6 text-[#3B2647] flex flex-col justify-between relative">
                <div className="z-10 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      Master Data Configuration
                    </span>
                    <h2 className="font-serif text-[22px] font-bold tracking-tight text-[#3B2647] mt-2">
                      New Product Master Setup
                    </h2>
                    <p className="text-[#3B2647]/70 text-[11.5px] font-sans font-medium mt-1">
                      Define SKU code, legal product title, category, purchase/selling pricing, and inventory attributes.
                    </p>
                  </div>

                  <div className="p-3.5 bg-white/70 rounded-2xl border border-[#5A2EA6]/15 text-xs text-[#3B2647] space-y-2">
                    <div className="font-bold text-[#5A2EA6]">Stock Level Threshold Rules</div>
                    <p className="text-[11px] text-soft">
                      Setting realistic unit costs and retail prices enables automated service profit margins and procurement calculations.
                    </p>
                  </div>
                </div>

                <p className="text-[9.5px] text-[#5A2EA6]/50 font-semibold tracking-wider uppercase mt-6 z-10">
                  Salon Warehouse Engine
                </p>
              </div>

              {/* RIGHT SIDE: FORM FIELDS */}
              <form
                onSubmit={handleAddSku}
                className="w-full md:w-7/12 p-6 bg-white flex flex-col justify-between space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center border-b border-line pb-3">
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Product Master Specification
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. L’Oréal Professionnel Developer 20Vol (1000ml)"
                      value={skuForm.name}
                      onChange={(e) => setSkuForm({ ...skuForm, name: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Master SKU Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="LOR-DEV-20V"
                        value={skuForm.skuCode}
                        onChange={(e) => setSkuForm({ ...skuForm, skuCode: e.target.value })}
                        className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-mono font-bold uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Barcode / EAN-13
                      </label>
                      <input
                        type="text"
                        placeholder="8901234567890"
                        value={skuForm.barcode}
                        onChange={(e) => setSkuForm({ ...skuForm, barcode: e.target.value })}
                        className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Category *
                      </label>
                      <select
                        value={skuForm.categoryId}
                        onChange={(e) => setSkuForm({ ...skuForm, categoryId: e.target.value })}
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Unit of Measure (UOM)
                      </label>
                      <input
                        type="text"
                        placeholder="1000 ml"
                        value={skuForm.unitOfMeasure}
                        onChange={(e) => setSkuForm({ ...skuForm, unitOfMeasure: e.target.value })}
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Cost Price (₹) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={skuForm.costPrice}
                        onChange={(e) => setSkuForm({ ...skuForm, costPrice: e.target.value })}
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Selling Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="1200"
                        value={skuForm.retailPrice}
                        onChange={(e) => setSkuForm({ ...skuForm, retailPrice: e.target.value })}
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        GST %
                      </label>
                      <select
                        value={skuForm.taxRatePercent}
                        onChange={(e) => setSkuForm({ ...skuForm, taxRatePercent: e.target.value })}
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                      >
                        <option value="18">18% GST</option>
                        <option value="12">12% GST</option>
                        <option value="5">5% GST</option>
                        <option value="0">0% GST</option>
                      </select>
                    </div>
                  </div>

                  {/* Usage Flags */}
                  <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-around">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={skuForm.isConsumable}
                        onChange={(e) => setSkuForm({ ...skuForm, isConsumable: e.target.checked })}
                        className="accent-purple-600 w-4 h-4 rounded"
                      />
                      Consumable (Backbar)
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={skuForm.isRetail}
                        onChange={(e) => setSkuForm({ ...skuForm, isRetail: e.target.checked })}
                        className="accent-purple-600 w-4 h-4 rounded"
                      />
                      Retail Sale
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Description / Usage Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter formula or mixing details..."
                      value={skuForm.description}
                      onChange={(e) => setSkuForm({ ...skuForm, description: e.target.value })}
                      className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink text-xs font-normal"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-line rounded-xl text-xs font-bold text-soft hover:text-ink cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingSku}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 disabled:opacity-50"
                  >
                    {isSubmittingSku && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Save Master SKU
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Edit Master Product Modal */}
      {editingSku &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] w-full max-w-xl shadow-[0_25px_60px_rgba(90,46,166,0.18)] overflow-hidden border border-[#5A2EA6]/10 animate-in zoom-in-95 duration-200">
              <form onSubmit={handleUpdateSku} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-line pb-3">
                  <div>
                    <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                      Edit Master SKU
                    </h3>
                    <p className="text-[11px] font-mono text-purple-700 mt-0.5">{editingSku.skuCode}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingSku(null)}
                    className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSku.name}
                      onChange={(e) => setEditingSku({ ...editingSku, name: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Barcode
                      </label>
                      <input
                        type="text"
                        value={editingSku.barcode || ''}
                        onChange={(e) => setEditingSku({ ...editingSku, barcode: e.target.value })}
                        className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={editingSku.categoryId}
                        onChange={(e) => setEditingSku({ ...editingSku, categoryId: e.target.value })}
                        className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Unit (UOM)
                      </label>
                      <input
                        type="text"
                        value={editingSku.unitOfMeasure}
                        onChange={(e) =>
                          setEditingSku({ ...editingSku, unitOfMeasure: e.target.value })
                        }
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Cost Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingSku.costPrice}
                        onChange={(e) =>
                          setEditingSku({ ...editingSku, costPrice: Number(e.target.value) })
                        }
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                        Retail Price (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingSku.retailPrice || ''}
                        onChange={(e) =>
                          setEditingSku({ ...editingSku, retailPrice: Number(e.target.value) })
                        }
                        className="w-full p-2 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                      />
                    </div>
                  </div>

                  {/* Usage Flags */}
                  <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center justify-around">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={editingSku.isConsumable}
                        onChange={(e) =>
                          setEditingSku({ ...editingSku, isConsumable: e.target.checked })
                        }
                        className="accent-purple-600 w-4 h-4 rounded"
                      />
                      Consumable
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={editingSku.isRetail}
                        onChange={(e) =>
                          setEditingSku({ ...editingSku, isRetail: e.target.checked })
                        }
                        className="accent-purple-600 w-4 h-4 rounded"
                      />
                      Retail
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-ink">
                      <input
                        type="checkbox"
                        checked={editingSku.isActive}
                        onChange={(e) =>
                          setEditingSku({ ...editingSku, isActive: e.target.checked })
                        }
                        className="accent-purple-600 w-4 h-4 rounded"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setEditingSku(null)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft hover:text-ink cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingSku}
                    className="flex items-center gap-2 px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 disabled:opacity-50"
                  >
                    {isUpdatingSku && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Update SKU
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* Add Category Modal */}
      {isAddCategoryOpen &&
        createPortal(
          <div className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-sm z-[9999] overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] w-full max-w-md shadow-[0_25px_60px_rgba(90,46,166,0.18)] overflow-hidden border border-[#5A2EA6]/10 animate-in zoom-in-95 duration-200">
              <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-line pb-3">
                  <h3 className="font-serif text-[18px] text-[#3B2647] font-bold tracking-tight">
                    Add Product Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="text-soft hover:text-ink transition bg-transparent border-0 cursor-pointer p-1 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nails & Pedicure"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-soft uppercase tracking-wider mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Category description and product classification..."
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, description: e.target.value })
                      }
                      className="w-full p-2.5 bg-paper/30 border border-line rounded-xl outline-none focus:border-[#5A2EA6] text-ink text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="px-4 py-2 border border-line rounded-xl text-xs font-bold text-soft hover:text-ink cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingCategory}
                    className="flex items-center gap-2 px-5 py-2 bg-[#5A2EA6] hover:bg-[#482387] text-white rounded-xl text-xs font-bold shadow cursor-pointer border-0 disabled:opacity-50"
                  >
                    {isSubmittingCategory && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Create Category
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
