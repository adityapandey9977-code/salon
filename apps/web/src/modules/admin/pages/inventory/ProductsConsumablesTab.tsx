import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  History,
  Layers,
  Package,
  Plus,
  Scissors,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AddMasterSkuModal } from './AddMasterSkuModal';
import { AddRecipeModal } from './AddRecipeModal';

// Mock Product / Consumable Item
export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  type: 'Retail Product' | 'Professional Consumable';
  unit: string;
  brand: string;
  currentStock: number;
  reorderLevel: number;
  minLevel: number;
  maxLevel: number;
  costPrice: string;
  sellingPrice?: string;
  stockValue: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  description: string;
  preferredSupplier: string;
  storageLocation: string;
  batches: {
    batchNumber: string;
    expiryDate: string;
    quantity: number;
    status: 'Good' | 'Near Expiry' | 'Expired';
  }[];
  stockBreakdown: {
    total: number;
    available: number;
    reserved: number;
    damaged: number;
    expired: number;
  };
}

// Mock Service Recipe / BOM Item
export interface ServiceRecipe {
  id: string;
  serviceName: string;
  category: string;
  durationMinutes: number;
  version: string;
  status: 'Active' | 'Draft' | 'Archived';
  updatedDate: string;
  updatedBy: string;
  materials: {
    consumableId: string;
    consumableName: string;
    quantity: number;
    unit: string;
    standardUsage: string;
    isRequired: boolean;
    costEstimate: string;
  }[];
  versionHistory: {
    version: string;
    date: string;
    author: string;
    changeNote: string;
  }[];
}

const mockProducts: ProductItem[] = [
  {
    id: 'PRD-001',
    name: "L'Oréal Professionnel Serie Expert Absolut Repair Shampoo (500ml)",
    sku: 'SKU-LOR-001',
    barcode: '8901030789123',
    category: 'Hair Care',
    type: 'Retail Product',
    unit: 'Bottle (500ml)',
    brand: "L'Oréal Professionnel",
    currentStock: 142,
    reorderLevel: 30,
    minLevel: 20,
    maxLevel: 250,
    costPrice: '₹850',
    sellingPrice: '₹1,450',
    stockValue: '₹1,20,700',
    status: 'Active',
    description:
      'Gold Quinoa and Protein deep restructuring shampoo for damaged salon-treated hair.',
    preferredSupplier: 'L’Oréal India Distribution Hub',
    storageLocation: 'Aisle 3 - Retail Shelf B',
    batches: [
      { batchNumber: 'LOT-LOR-2601', expiryDate: '15 Mar 2028', quantity: 100, status: 'Good' },
      { batchNumber: 'LOT-LOR-2540', expiryDate: '20 Oct 2027', quantity: 42, status: 'Good' },
    ],
    stockBreakdown: { total: 142, available: 135, reserved: 5, damaged: 2, expired: 0 },
  },
  {
    id: 'PRD-002',
    name: "L'Oréal Majirel Permanent Hair Colour Tube - 6.13 Dark Blonde",
    sku: 'SKU-MAJ-613',
    barcode: '8901030789456',
    category: 'Colour & Chemical',
    type: 'Professional Consumable',
    unit: 'Tube (50ml)',
    brand: "L'Oréal Professionnel",
    currentStock: 68,
    reorderLevel: 25,
    minLevel: 15,
    maxLevel: 150,
    costPrice: '₹340',
    stockValue: '₹23,120',
    status: 'Active',
    description:
      'Professional oxidation salon colouration for rich coverage and deep neutral cool reflex.',
    preferredSupplier: 'L’Oréal India Distribution Hub',
    storageLocation: 'Colour Bar - Shelf A1',
    batches: [
      { batchNumber: 'LOT-MAJ-992', expiryDate: '10 Jan 2028', quantity: 50, status: 'Good' },
      {
        batchNumber: 'LOT-MAJ-871',
        expiryDate: '12 Sep 2026',
        quantity: 18,
        status: 'Near Expiry',
      },
    ],
    stockBreakdown: { total: 68, available: 62, reserved: 4, damaged: 2, expired: 0 },
  },
  {
    id: 'PRD-003',
    name: 'O3+ Seaweed Facial Kit (Single Use Pods)',
    sku: 'SKU-O3-SEA01',
    barcode: '8904128912304',
    category: 'Skin & Aesthetics',
    type: 'Professional Consumable',
    unit: 'Kit (1 Unit)',
    brand: 'O3+ Professional',
    currentStock: 18,
    reorderLevel: 20,
    minLevel: 15,
    maxLevel: 80,
    costPrice: '₹950',
    stockValue: '₹17,100',
    status: 'Active',
    description:
      'Calming seaweed skin purifying facial kit formulated for oily and acne-prone skin.',
    preferredSupplier: 'O3+ Direct Skin Care Supply',
    storageLocation: 'Esthetics Dispensing Cabinet',
    batches: [
      { batchNumber: 'LOT-O3-8812', expiryDate: '24 Jun 2027', quantity: 18, status: 'Good' },
    ],
    stockBreakdown: { total: 18, available: 16, reserved: 2, damaged: 0, expired: 0 },
  },
  {
    id: 'PRD-004',
    name: "Kérastase Elixir Ultime L'Huile Originale Hair Oil (100ml)",
    sku: 'SKU-KER-OIL01',
    barcode: '3474636613908',
    category: 'Hair Care',
    type: 'Retail Product',
    unit: 'Bottle (100ml)',
    brand: 'Kérastase Luxury',
    currentStock: 48,
    reorderLevel: 15,
    minLevel: 10,
    maxLevel: 100,
    costPrice: '₹2,400',
    sellingPrice: '₹3,950',
    stockValue: '₹1,15,200',
    status: 'Active',
    description:
      'Iconic leave-in beautifying hair oil infused with sacred Marula and Camellia oils.',
    preferredSupplier: 'Luxury Beauty Brands LLP',
    storageLocation: 'VIP Retail Display Glass Case',
    batches: [
      { batchNumber: 'LOT-KER-019', expiryDate: '18 Nov 2028', quantity: 48, status: 'Good' },
    ],
    stockBreakdown: { total: 48, available: 45, reserved: 3, damaged: 0, expired: 0 },
  },
  {
    id: 'PRD-005',
    name: "L'Oréal Oxydant Crème Developer 20 Vol (6%) 1000ml",
    sku: 'SKU-LOR-DEV20',
    barcode: '8901030789789',
    category: 'Colour & Chemical',
    type: 'Professional Consumable',
    unit: 'Bottle (1000ml)',
    brand: "L'Oréal Professionnel",
    currentStock: 32,
    reorderLevel: 10,
    minLevel: 8,
    maxLevel: 60,
    costPrice: '₹420',
    stockValue: '₹13,440',
    status: 'Active',
    description:
      'Stabilized oxidant cream developer formulated specifically for Majirel and Blond Studio.',
    preferredSupplier: 'L’Oréal India Distribution Hub',
    storageLocation: 'Colour Mixing Station B',
    batches: [
      { batchNumber: 'LOT-DEV-201', expiryDate: '05 Dec 2027', quantity: 32, status: 'Good' },
    ],
    stockBreakdown: { total: 32, available: 30, reserved: 2, damaged: 0, expired: 0 },
  },
  {
    id: 'PRD-006',
    name: 'Moroccanoil Treatment Original (100ml)',
    sku: 'SKU-MOR-TRT01',
    barcode: '7290011521011',
    category: 'Hair Care',
    type: 'Retail Product',
    unit: 'Bottle (100ml)',
    brand: 'Moroccanoil',
    currentStock: 0,
    reorderLevel: 12,
    minLevel: 8,
    maxLevel: 60,
    costPrice: '₹2,200',
    sellingPrice: '₹3,600',
    stockValue: '₹0',
    status: 'Active',
    description:
      'Versatile argan oil-infused hair treatment used for conditioning, styling and finishing.',
    preferredSupplier: 'Luxury Beauty Brands LLP',
    storageLocation: 'Aisle 1 - Retail Shelf A',
    batches: [],
    stockBreakdown: { total: 0, available: 0, reserved: 0, damaged: 0, expired: 0 },
  },
];

const mockRecipes: ServiceRecipe[] = [
  {
    id: 'REC-001',
    serviceName: 'Global Hair Colouring (Medium Hair)',
    category: 'Hair Services',
    durationMinutes: 90,
    version: 'v2.2 (Active)',
    status: 'Active',
    updatedDate: '10 Aug 2026',
    updatedBy: 'Rohan Sharma (Master Stylist)',
    materials: [
      {
        consumableId: 'PRD-002',
        consumableName: "L'Oréal Majirel Colour Tube",
        quantity: 50,
        unit: 'ml',
        standardUsage: '1 Full Tube for Global Base',
        isRequired: true,
        costEstimate: '₹340',
      },
      {
        consumableId: 'PRD-005',
        consumableName: "L'Oréal Oxydant Developer 20 Vol",
        quantity: 75,
        unit: 'ml',
        standardUsage: '1:1.5 standard mixing ratio',
        isRequired: true,
        costEstimate: '₹31.50',
      },
      {
        consumableId: 'PRD-001',
        consumableName: 'Post-Colour Restructuring Shampoo',
        quantity: 20,
        unit: 'ml',
        standardUsage: 'Backwash emulsification cleansing',
        isRequired: true,
        costEstimate: '₹34',
      },
    ],
    versionHistory: [
      {
        version: 'v2.2',
        date: '10 Aug 2026',
        author: 'Rohan Sharma',
        changeNote: 'Calibrated developer ratio from 70ml to 75ml for longer hair lengths.',
      },
      {
        version: 'v2.1',
        date: '15 May 2026',
        author: 'Pooja Verma',
        changeNote: 'Updated shampoo consumable to Serie Expert Absolut Repair.',
      },
      {
        version: 'v1.0',
        date: '01 Jan 2026',
        author: 'System Admin',
        changeNote: 'Initial standard BOM recipe creation.',
      },
    ],
  },
  {
    id: 'REC-002',
    serviceName: 'O3+ Seaweed Brightening Facial',
    category: 'Skin & Aesthetics',
    durationMinutes: 60,
    version: 'v1.4 (Active)',
    status: 'Active',
    updatedDate: '02 Aug 2026',
    updatedBy: 'Ananya Roy (Head Esthetician)',
    materials: [
      {
        consumableId: 'PRD-003',
        consumableName: 'O3+ Seaweed Facial Single-Use Kit',
        quantity: 1,
        unit: 'Kit',
        standardUsage: 'Complete 6-step kit protocol',
        isRequired: true,
        costEstimate: '₹950',
      },
      {
        consumableId: 'PRD-007',
        consumableName: 'Cotton Pads & Sponges Disposable Pack',
        quantity: 6,
        unit: 'Pcs',
        standardUsage: 'Cleansing & toner application',
        isRequired: true,
        costEstimate: '₹12',
      },
    ],
    versionHistory: [
      {
        version: 'v1.4',
        date: '02 Aug 2026',
        author: 'Ananya Roy',
        changeNote: 'Mandated single-use disposable kit to eliminate tube variance.',
      },
    ],
  },
  {
    id: 'REC-003',
    serviceName: 'Keratin Hair Smoothing Treatment',
    category: 'Hair Treatments',
    durationMinutes: 150,
    version: 'v3.0 (Active)',
    status: 'Active',
    updatedDate: '28 Jul 2026',
    updatedBy: 'Vikram Malhotra (Technical Director)',
    materials: [
      {
        consumableId: 'PRD-008',
        consumableName: 'Keratin Complex Smoothing Infusion',
        quantity: 60,
        unit: 'ml',
        standardUsage: 'Section-by-section bowl application',
        isRequired: true,
        costEstimate: '₹1,200',
      },
      {
        consumableId: 'PRD-009',
        consumableName: 'Clarifying Pre-Treatment Shampoo',
        quantity: 30,
        unit: 'ml',
        standardUsage: '2x thorough cleansing to open cuticles',
        isRequired: true,
        costEstimate: '₹45',
      },
    ],
    versionHistory: [
      {
        version: 'v3.0',
        date: '28 Jul 2026',
        author: 'Vikram Malhotra',
        changeNote: 'Formaldehyde-free formula protocol revision.',
      },
    ],
  },
];

export function ProductsConsumablesTab() {
  const [productsList, setProductsList] = useState<ProductItem[]>(mockProducts);
  const [recipesList, setRecipesList] = useState<ServiceRecipe[]>(mockRecipes);

  const [activeSubView, setActiveSubView] = useState<'retail' | 'consumables' | 'recipes'>(
    'retail',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Selected Product Profile Modal & Creation Modals
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<ServiceRecipe | null>(null);
  const [isAddMasterSkuOpen, setIsAddMasterSkuOpen] = useState(false);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveMasterSku = (
    newProduct: ProductItem,
    branchAllocations: Record<string, number>,
  ) => {
    setProductsList([newProduct, ...productsList]);
    const totalUnits = Object.values(branchAllocations).reduce((a, b) => a + b, 0);
    showToast(
      `Master SKU "${newProduct.name}" (${newProduct.sku}) published with ${totalUnits || newProduct.currentStock} units inwarded to network stock.`,
    );
  };

  const handleSaveRecipe = (newRecipe: ServiceRecipe) => {
    setRecipesList([newRecipe, ...recipesList]);
    showToast(`Service Recipe BOM for "${newRecipe.serviceName}" published to master catalogue.`);
  };

  useEffect(() => {
    if (selectedProduct || selectedRecipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct, selectedRecipe]);

  // Filter Products
  const filteredProducts = productsList.filter((p) => {
    if (activeSubView === 'retail' && p.type !== 'Retail Product') return false;
    if (activeSubView === 'consumables' && p.type !== 'Professional Consumable') return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
    if (searchTerm) {
      const matchText = `${p.name} ${p.sku} ${p.barcode} ${p.brand}`.toLowerCase();
      return matchText.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Filter Recipes
  const filteredRecipes = recipesList.filter((r) => {
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (searchTerm) {
      const match = `${r.serviceName} ${r.category} ${r.updatedBy}`.toLowerCase();
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

      {/* 1. Sub-Navigation Tabs & Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-[#F8F5FF] p-1 rounded-xl border border-[#5A2EA6]/20">
          <button
            onClick={() => setActiveSubView('retail')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubView === 'retail'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Retail Products</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {productsList.filter((p) => p.type === 'Retail Product').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('consumables')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubView === 'consumables'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Professional Consumables</span>
            <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[#5A2EA6] text-[10px] font-bold">
              {productsList.filter((p) => p.type === 'Professional Consumable').length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('recipes')}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border-0 flex items-center gap-2',
              activeSubView === 'recipes'
                ? 'bg-[#5A2EA6] text-white shadow-xs'
                : 'text-soft hover:text-ink',
            )}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Service Recipe / BOM</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {recipesList.length} Active
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => showToast(`Exporting ${activeSubView} catalog list (CSV)...`)}
            className="h-[36px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Export Catalog</span>
          </Button>

          <Button
            onClick={() => {
              if (activeSubView === 'recipes') {
                setIsAddRecipeOpen(true);
              } else {
                setIsAddMasterSkuOpen(true);
              }
            }}
            className="h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeSubView === 'recipes' ? 'Add Service BOM' : 'Add Master SKU'}</span>
          </Button>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeSubView === 'recipes'
                  ? 'Search service recipe...'
                  : 'Search by name, SKU, barcode, brand...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#5A2EA6]/20 rounded-xl text-xs font-semibold text-ink placeholder:text-muted outline-none focus:border-[#5A2EA6]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Colour & Chemical">Colour &amp; Chemical</option>
            <option value="Skin & Aesthetics">Skin &amp; Aesthetics</option>
            <option value="Hair Services">Hair Services</option>
            <option value="Hair Treatments">Hair Treatments</option>
          </select>

          {activeSubView !== 'recipes' && (
            <>
              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
              >
                <option value="all">All Brands</option>
                <option value="L'Oréal Professionnel">L&apos;Oréal Professionnel</option>
                <option value="O3+ Professional">O3+ Professional</option>
                <option value="Kérastase Luxury">Kérastase Luxury</option>
                <option value="Moroccanoil">Moroccanoil</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl py-1.5 px-3 text-xs font-bold text-ink outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </>
          )}
        </div>

        <span className="text-xs text-soft font-semibold">
          Showing {activeSubView === 'recipes' ? filteredRecipes.length : filteredProducts.length}{' '}
          items
        </span>
      </div>

      {/* 3. Section 4 & 6: Main Tables */}
      {activeSubView !== 'recipes' ? (
        /* PRODUCTS & CONSUMABLES TABLE */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  {activeSubView === 'retail'
                    ? 'Retail Products Catalogue'
                    : 'Professional Salon Consumables'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Master SKU Repository
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Head Office master catalog with centralized reorder thresholds, UOM definitions, and
                FIFO valuation
              </p>
            </div>

            <span className="text-xs text-soft font-semibold">Brand Owner Authority</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Product &amp; SKU</th>
                  <th className="p-3.5">Category &amp; Type</th>
                  <th className="p-3.5">Brand</th>
                  <th className="p-3.5">Unit (UOM)</th>
                  <th className="p-3.5 text-center">Network Stock</th>
                  <th className="p-3.5 text-center">Reorder Level</th>
                  <th className="p-3.5 text-right">Cost Price</th>
                  {activeSubView === 'retail' && (
                    <th className="p-3.5 text-right">Selling Price</th>
                  )}
                  <th className="p-3.5 text-right">Stock Value</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredProducts.map((p) => {
                  const isLow = p.currentStock <= p.reorderLevel;
                  const isOut = p.currentStock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      {/* Product Name & SKU */}
                      <td className="p-3.5 pl-5 max-w-[280px]">
                        <strong
                          className="font-bold text-ink block text-xs truncate"
                          title={p.name}
                        >
                          {p.name}
                        </strong>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                          <span className="text-[#5A2EA6] font-semibold">{p.sku}</span>
                          <span className="text-muted font-mono">{p.barcode}</span>
                        </div>
                      </td>

                      {/* Category & Type */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 block text-xs">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-soft">{p.type}</span>
                      </td>

                      {/* Brand */}
                      <td className="p-3.5 whitespace-nowrap font-medium text-slate-800">
                        {p.brand}
                      </td>

                      {/* Unit */}
                      <td className="p-3.5 whitespace-nowrap text-soft">{p.unit}</td>

                      {/* Stock Level */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                            isOut
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : isLow
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200',
                          )}
                        >
                          {p.currentStock} Units
                        </span>
                      </td>

                      {/* Reorder Level */}
                      <td className="p-3.5 text-center text-slate-600 font-semibold whitespace-nowrap">
                        {p.reorderLevel} Units
                      </td>

                      {/* Cost Price */}
                      <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                        {p.costPrice}
                      </td>

                      {/* Selling Price */}
                      {activeSubView === 'retail' && (
                        <td className="p-3.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                          {p.sellingPrice || '—'}
                        </td>
                      )}

                      {/* Stock Value */}
                      <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] bg-purple-50/20 whitespace-nowrap">
                        {p.stockValue}
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap',
                            p.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : p.status === 'Inactive'
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200',
                          )}
                        >
                          {p.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedProduct(p)}
                            className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-[#5A2EA6]" />
                            <span>Inspect</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* SERVICE RECIPE / BOM TABLE (Section 6) */
        <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#5A2EA6]/10 flex flex-wrap items-center justify-between gap-3 bg-[#FCFAFF]">
            <div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-[#5A2EA6]" />
                <h3 className="font-serif font-bold text-ink text-base">
                  Service Recipe / Bill of Materials (BOM)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-extrabold whitespace-nowrap">
                  Standard Consumption Specifications
                </span>
              </div>
              <p className="text-[11px] text-muted mt-0.5">
                Standard recipe rules mapped to each service to automate backwash stock reduction
                and detect chairside variance
              </p>
            </div>

            <span className="text-xs font-bold text-[#5A2EA6] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 whitespace-nowrap">
              Automated Variance Tracker
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap">
                  <th className="p-3.5 pl-5">Salon Service</th>
                  <th className="p-3.5">Category &amp; Duration</th>
                  <th className="p-3.5">BOM Version</th>
                  <th className="p-3.5">Configured Consumables</th>
                  <th className="p-3.5 text-right">Standard Material Cost</th>
                  <th className="p-3.5">Last Updated</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
                {filteredRecipes.map((r) => {
                  const totalCost = r.materials.reduce((acc, m) => {
                    const num = Number.parseInt(m.costEstimate.replace(/[^0-9]/g, ''), 10) || 0;
                    return acc + num;
                  }, 0);

                  return (
                    <tr key={r.id} className="hover:bg-[#5A2EA6]/3 transition-colors">
                      {/* Service Name */}
                      <td className="p-3.5 pl-5 whitespace-nowrap">
                        <strong className="font-bold text-ink block text-xs">
                          {r.serviceName}
                        </strong>
                        <span className="text-[10px] text-[#5A2EA6] font-semibold">{r.id}</span>
                      </td>

                      {/* Category & Duration */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">{r.category}</span>
                        <span className="text-[10px] text-muted flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {r.durationMinutes} mins standard
                        </span>
                      </td>

                      {/* Version Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-[#5A2EA6] border border-purple-200 whitespace-nowrap">
                          {r.version}
                        </span>
                      </td>

                      {/* Materials List */}
                      <td className="p-3.5 max-w-[280px]">
                        <div className="space-y-1">
                          {r.materials.map((mat, mIdx) => (
                            <div
                              key={mIdx}
                              className="text-[11px] flex items-center justify-between gap-2"
                            >
                              <span
                                className="font-medium text-slate-800 truncate"
                                title={mat.consumableName}
                              >
                                • {mat.consumableName}
                              </span>
                              <span className="font-bold text-ink shrink-0 bg-slate-100 px-1.5 py-0.2 rounded">
                                {mat.quantity} {mat.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total Cost */}
                      <td className="p-3.5 text-right font-extrabold text-[#5A2EA6] whitespace-nowrap bg-purple-50/20">
                        ₹{totalCost.toFixed(2)}
                      </td>

                      {/* Last Updated */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-slate-800 block font-medium">{r.updatedDate}</span>
                        <span className="text-[10px] text-muted">{r.updatedBy}</span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          {r.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedRecipe(r)}
                            className="h-[30px] px-2.5 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3 text-[#5A2EA6]" />
                            <span>View Recipe</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              showToast(`Duplicating recipe template for ${r.serviceName}...`)
                            }
                            className="h-[30px] px-2 rounded-lg text-[11px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                            title="Duplicate Recipe"
                          >
                            <Copy className="w-3 h-3 text-[#5A2EA6]" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Section 5: PRODUCT / CONSUMABLE DETAILS MODAL */}
      {selectedProduct &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      {selectedProduct.type}
                    </span>
                    <span className="text-xs text-soft font-mono font-bold">
                      {selectedProduct.sku}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-muted">
                    Brand: {selectedProduct.brand} · Barcode: {selectedProduct.barcode}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Stock Overview Cards */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Stock Breakdown
                  </span>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                      <span className="text-[10px] text-soft block">Total Units</span>
                      <strong className="text-base font-serif font-bold text-[#5A2EA6]">
                        {selectedProduct.stockBreakdown.total}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <span className="text-[10px] text-soft block">Available</span>
                      <strong className="text-base font-serif font-bold text-emerald-700">
                        {selectedProduct.stockBreakdown.available}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                      <span className="text-[10px] text-soft block">Reserved</span>
                      <strong className="text-base font-serif font-bold text-blue-700">
                        {selectedProduct.stockBreakdown.reserved}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                      <span className="text-[10px] text-soft block">Damaged</span>
                      <strong className="text-base font-serif font-bold text-amber-700">
                        {selectedProduct.stockBreakdown.damaged}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                      <span className="text-[10px] text-soft block">Expired</span>
                      <strong className="text-base font-serif font-bold text-rose-700">
                        {selectedProduct.stockBreakdown.expired}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Basic Information & Inventory Config */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <strong className="text-ink font-bold block mb-1">
                      Inventory Configuration
                    </strong>
                    <div className="flex justify-between">
                      <span className="text-soft">Minimum Stock:</span>
                      <span className="font-bold">
                        {selectedProduct.minLevel} {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft">Reorder Trigger:</span>
                      <span className="font-bold text-amber-700">
                        {selectedProduct.reorderLevel} {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft">Maximum Stock:</span>
                      <span className="font-bold">
                        {selectedProduct.maxLevel} {selectedProduct.unit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft">Storage Bin:</span>
                      <span className="font-bold">{selectedProduct.storageLocation}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <strong className="text-ink font-bold block mb-1">
                      Pricing &amp; Supplier
                    </strong>
                    <div className="flex justify-between">
                      <span className="text-soft">Cost Price (FIFO):</span>
                      <span className="font-bold">{selectedProduct.costPrice}</span>
                    </div>
                    {selectedProduct.sellingPrice && (
                      <div className="flex justify-between">
                        <span className="text-soft">Selling MRP:</span>
                        <span className="font-bold text-emerald-700">
                          {selectedProduct.sellingPrice}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-soft">Total Valuation:</span>
                      <span className="font-bold text-[#5A2EA6]">{selectedProduct.stockValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-soft">Preferred Vendor:</span>
                      <span className="font-bold truncate max-w-[120px]">
                        {selectedProduct.preferredSupplier}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Batches Table */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Active Batches in Custody
                  </span>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5 pl-3">Batch Number</th>
                          <th className="p-2.5">Expiry Date</th>
                          <th className="p-2.5 text-right">Quantity</th>
                          <th className="p-2.5 pr-3 text-right">Batch Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedProduct.batches.map((b, bIdx) => (
                          <tr key={bIdx}>
                            <td className="p-2.5 pl-3 font-mono font-bold text-ink">
                              {b.batchNumber}
                            </td>
                            <td className="p-2.5 text-slate-700">{b.expiryDate}</td>
                            <td className="p-2.5 text-right font-bold">{b.quantity} pcs</td>
                            <td className="p-2.5 pr-3 text-right">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-[9px] font-bold',
                                  b.status === 'Good'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-800',
                                )}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <span className="text-xs text-soft font-semibold">UOM: {selectedProduct.unit}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(null);
                      showToast(`Opening purchase history for ${selectedProduct.name}...`);
                    }}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
                  >
                    Purchase History
                  </Button>
                  <Button
                    onClick={() => setSelectedProduct(null)}
                    className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Close Inspection
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 5. Section 6: SERVICE RECIPE DETAIL MODAL */}
      {selectedRecipe &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedRecipe(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-[#FCFAFF] rounded-t-3xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5A2EA6] text-white">
                      Service BOM Specification
                    </span>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {selectedRecipe.version}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-ink text-lg mt-1">
                    {selectedRecipe.serviceName}
                  </h3>
                  <p className="text-xs text-muted">
                    Category: {selectedRecipe.category} · Standard Duration:{' '}
                    {selectedRecipe.durationMinutes} mins
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 grid place-items-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Materials Breakdown */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    Standard Recipe Consumables (Per Service Execution)
                  </span>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8F5FF] text-[#5A2EA6] font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5 pl-3">Consumable Material</th>
                          <th className="p-2.5 text-center">Standard Qty</th>
                          <th className="p-2.5">Standard Usage Rule</th>
                          <th className="p-2.5 pr-3 text-right">Cost Est.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {selectedRecipe.materials.map((m, mIdx) => (
                          <tr key={mIdx} className="hover:bg-purple-50/30">
                            <td className="p-2.5 pl-3 font-bold text-ink">{m.consumableName}</td>
                            <td className="p-2.5 text-center font-bold text-[#5A2EA6]">
                              {m.quantity} {m.unit}
                            </td>
                            <td className="p-2.5 text-slate-600">{m.standardUsage}</td>
                            <td className="p-2.5 pr-3 text-right font-bold text-emerald-700">
                              {m.costEstimate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Version History */}
                <div>
                  <span className="text-[10px] font-bold text-soft uppercase tracking-wider block mb-2">
                    BOM Revision &amp; Version History
                  </span>
                  <div className="space-y-2">
                    {selectedRecipe.versionHistory.map((vh, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#5A2EA6]">{vh.version}</span>
                          <span className="text-[10px] text-muted">
                            {vh.date} by {vh.author}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{vh.changeNote}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 rounded-b-3xl">
                <span className="text-xs text-soft font-semibold">Maker-Checker Approved</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedRecipe(null);
                      showToast(`Opening recipe editor for ${selectedRecipe.serviceName}...`);
                    }}
                    className="h-[32px] px-3 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3 text-[#5A2EA6]" />
                    <span>Edit Recipe</span>
                  </Button>
                  <Button
                    onClick={() => setSelectedRecipe(null)}
                    className="h-[32px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                  >
                    Close Recipe
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 6. Section 7: ADD MASTER SKU & STOCK INTAKE MODAL */}
      <AddMasterSkuModal
        isOpen={isAddMasterSkuOpen}
        onClose={() => setIsAddMasterSkuOpen(false)}
        onSave={handleSaveMasterSku}
        defaultType={activeSubView === 'consumables' ? 'Professional Consumable' : 'Retail Product'}
      />

      {/* 7. Section 8: ADD SERVICE RECIPE BOM MODAL */}
      <AddRecipeModal
        isOpen={isAddRecipeOpen}
        onClose={() => setIsAddRecipeOpen(false)}
        onSave={handleSaveRecipe}
      />
    </div>
  );
}
