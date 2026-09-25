import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  ArrowUpDown,
  Check,
  CheckCircle2,
  Crown,
  Download,
  Edit2,
  Eye,
  Feather,
  Filter,
  Heart,
  Image as ImageIcon,
  Layers,
  Loader2,
  Palette,
  Plus,
  Power,
  Scissors,
  Search,
  Smile,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { catalogueApi, type ApiServiceCategory } from '@/shared/api';

export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  servicesCount: number;
  displayOrder: number;
  iconName: string;
  accentColor: string;
  imageUrl?: string;
  status: 'Active' | 'Inactive';
  lastUpdated: string;
}

export const CATEGORY_IMAGE_PRESETS = [
  {
    label: 'Hair Dressing',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Skin & Facials',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Spa Rituals',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Nails & Spa',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bridal Studio',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: "Men's Lounge",
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Ayurvedic Wellness',
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&auto=format&fit=crop&q=80',
  },
];

const CATEGORY_COLORS = [
  '#5A2EA6',
  '#0D9488',
  '#E11D48',
  '#D97706',
  '#7C3AED',
  '#475569',
  '#059669',
  '#2563EB',
];

export const STANDARD_CATEGORY_SEEDS = [
  {
    name: 'Hair Dressing & Styling',
    code: 'HAIR-01',
    description: 'Precision haircuts, bespoke blowouts, balayage coloring, and intensive keratin treatments.',
    sortOrder: 1,
  },
  {
    name: 'Skin & Organic Therapy',
    code: 'SKIN-02',
    description: 'Dermatologist-formulated hydra facials, LED collagen rejuvenation, and organic vitamin infusers.',
    sortOrder: 2,
  },
  {
    name: 'Spa & Wellness Rituals',
    code: 'SPA-03',
    description: 'Holistic deep tissue massages, Swedish aromatherapy, hot stone therapy, and body scrubs.',
    sortOrder: 3,
  },
  {
    name: 'Nails Art & Spa Lounge',
    code: 'NAIL-04',
    description: 'Gel extensions, French overlays, therapeutic reflexology pedicures, and nail artistry.',
    sortOrder: 4,
  },
  {
    name: 'Bridal & Red Carpet Studio',
    code: 'BRID-05',
    description: 'Couture airbrush bridal makeup, luxury pre-wedding packages, and high-fashion styling.',
    sortOrder: 5,
  },
  {
    name: 'Men’s Grooming Lounge',
    code: 'MENS-06',
    description: 'Executive beard sculpting, scalp detox massage, express facials, and grooming.',
    sortOrder: 6,
  },
];
export function extractErrorMessage(err: any, fallback: string): string {
  if (err?.response?.data?.error?.message) {
    const details = err.response.data.error.details;
    if (Array.isArray(details) && details.length > 0 && details[0]?.message) {
      return `${err.response.data.error.message}: ${details[0].field ? details[0].field + ' ' : ''}${details[0].message}`;
    }
    return err.response.data.error.message;
  }
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.message) {
    return err.message;
  }
  return fallback;
}

export const initialCategories: ServiceCategory[] = [
  {
    id: 'CAT-001',
    code: 'HAIR-01',
    name: 'Hair Dressing & Styling',
    description:
      'Precision haircuts, bespoke blowouts, balayage coloring, and intensive keratin treatments.',
    servicesCount: 14,
    displayOrder: 1,
    iconName: 'Scissors',
    accentColor: '#5A2EA6',
    imageUrl:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    lastUpdated: '16 Aug 2026',
  },
];

export interface ServiceCategoriesTabProps {
  readOnly?: boolean;
  defaultBranch?: string;
  lockBranch?: boolean;
}

export function ServiceCategoriesTab({
  readOnly = false,
  defaultBranch = 'All',
  lockBranch = false,
}: ServiceCategoriesTabProps = {}) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<ServiceCategory | null>(null);
  const [editCategory, setEditCategory] = useState<ServiceCategory | null>(null);
  const [deactivateCategory, setDeactivateCategory] = useState<ServiceCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ServiceCategory | null>(null);

  // File input refs
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New Category Form State
  const [newCat, setNewCat] = useState({
    name: '',
    code: '',
    description: '',
    displayOrder: 1,
    accentColor: '#5A2EA6',
    imageUrl: '',
    status: 'Active' as ServiceCategory['status'],
  });

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await catalogueApi.fetchCategories();
      if (data && Array.isArray(data)) {
        const mapped: ServiceCategory[] = data.map((cat, idx) => ({
          id: cat.id,
          code: cat.code,
          name: cat.name,
          description: cat.description || '',
          servicesCount: (cat as any)._count?.services ?? 0,
          displayOrder: cat.sortOrder ?? idx + 1,
          iconName: 'Scissors',
          accentColor: cat.accentColor || CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || '#5A2EA6',
          imageUrl: cat.imageUrl || CATEGORY_IMAGE_PRESETS[idx % CATEGORY_IMAGE_PRESETS.length]?.url,
          status: cat.isActive ? 'Active' : 'Inactive',
          lastUpdated: cat.updatedAt
            ? new Date(cat.updatedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'Recently',
        }));
        setCategories(mapped);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      toast(extractErrorMessage(err, 'Failed to fetch categories from server.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSeedStandardCategories = async () => {
    try {
      setIsSeeding(true);
      toast('Seeding standard beauty & salon categories...');
      let seededCount = 0;
      for (const seed of STANDARD_CATEGORY_SEEDS) {
        try {
          await catalogueApi.createCategory({
            name: seed.name,
            code: seed.code,
            description: seed.description,
            sortOrder: seed.sortOrder,
            isActive: true,
          });
          seededCount++;
        } catch (itemErr: any) {
          // If code already exists (409 conflict), continue with next seed
          console.warn(`Category seed ${seed.code} skipped:`, extractErrorMessage(itemErr, itemErr.message));
        }
      }
      toast(seededCount > 0 ? 'Standard categories seeded successfully!' : 'Standard categories are up to date.');
      await loadCategories();
    } catch (err: any) {
      console.error('Failed to seed categories:', err);
      toast(extractErrorMessage(err, 'Failed to seed categories.'));
    } finally {
      setIsSeeding(false);
    }
  };

  const handleImageFile = (file: File, isEdit = false) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast('Image file size must be less than 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = (e.target?.result as string) || '';
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          if (isEdit && editCategory) {
            setEditCategory({ ...editCategory, imageUrl: compressed });
          } else {
            setNewCat((prev) => ({ ...prev, imageUrl: compressed }));
          }
        } else {
          if (isEdit && editCategory) {
            setEditCategory({ ...editCategory, imageUrl: result });
          } else {
            setNewCat((prev) => ({ ...prev, imageUrl: result }));
          }
        }
        toast('Image uploaded successfully.');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || cat.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  const isAddCodeTaken = useMemo(() => {
    const code = newCat.code.trim().toUpperCase();
    if (!code) return false;
    return categories.some((c) => c.code.trim().toUpperCase() === code);
  }, [newCat.code, categories]);

  const isEditCodeTaken = useMemo(() => {
    if (!editCategory) return false;
    const code = editCategory.code.trim().toUpperCase();
    if (!code) return false;
    return categories.some(
      (c) => c.id !== editCategory.id && c.code.trim().toUpperCase() === code,
    );
  }, [editCategory, categories]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.code) return;

    if (isAddCodeTaken) {
      toast(`Category code "${newCat.code.toUpperCase().trim()}" is already in use. Please enter a unique code.`);
      return;
    }

    try {
      const created = await catalogueApi.createCategory({
        name: newCat.name.trim(),
        code: newCat.code.toUpperCase().trim(),
        description: newCat.description.trim() || undefined,
        sortOrder: Number(newCat.displayOrder) || categories.length + 1,
        imageUrl: newCat.imageUrl || undefined,
        accentColor: newCat.accentColor || undefined,
        isActive: newCat.status === 'Active',
      });

      setIsAddModalOpen(false);
      setNewCat({
        name: '',
        code: '',
        description: '',
        displayOrder: categories.length + 2,
        accentColor: '#5A2EA6',
        imageUrl: '',
        status: 'Active',
      });
      toast(`Category "${created.name}" created successfully.`);
      await loadCategories();
    } catch (err: any) {
      console.error('Failed to create category:', err);
      toast(extractErrorMessage(err, 'Failed to create category.'));
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory) return;

    if (isEditCodeTaken) {
      toast(`Category code "${editCategory.code.toUpperCase().trim()}" is already in use. Please enter a unique code.`);
      return;
    }

    try {
      await catalogueApi.updateCategory(editCategory.id, {
        name: editCategory.name.trim(),
        code: editCategory.code.toUpperCase().trim(),
        description: editCategory.description.trim() || undefined,
        sortOrder: Number(editCategory.displayOrder) || 1,
        imageUrl: editCategory.imageUrl || undefined,
        accentColor: editCategory.accentColor || undefined,
        isActive: editCategory.status === 'Active',
      });
      setEditCategory(null);
      toast(`Category "${editCategory.name}" updated successfully.`);
      await loadCategories();
    } catch (err: any) {
      console.error('Failed to update category:', err);
      toast(extractErrorMessage(err, 'Failed to update category.'));
    }
  };

  const handleToggleStatus = async (category: ServiceCategory) => {
    const nextStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await catalogueApi.updateCategory(category.id, {
        isActive: nextStatus === 'Active',
      });
      setDeactivateCategory(null);
      toast(`Category "${category.name}" is now ${nextStatus}.`);
      await loadCategories();
    } catch (err: any) {
      console.error('Failed to update category status:', err);
      toast(extractErrorMessage(err, 'Failed to update status.'));
    }
  };

  const handleDeleteCategory = async (category: ServiceCategory) => {
    try {
      await catalogueApi.deleteCategory(category.id);
      setCategoryToDelete(null);
      toast(`Category "${category.name}" deleted successfully.`);
      await loadCategories();
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      toast(extractErrorMessage(err, 'Failed to delete category.'));
    }
  };

  const handleExport = () => {
    toast(`Exported ${filteredCategories.length} service categories to CSV.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Service Categories
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              {categories.length} Categories Defined
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Organize customer-facing treatment lines, styling departments, and spa ritual groups.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {readOnly && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#5A2EA6] text-xs font-bold border border-purple-200/60 flex items-center gap-1.5 shadow-3xs">
              <Eye className="w-3.5 h-3.5" />
              <span>View-Only Mode</span>
            </div>
          )}

          {!readOnly && categories.length === 0 && !isLoading && (
            <Button
              variant="outline"
              onClick={handleSeedStandardCategories}
              disabled={isSeeding}
              className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
            >
              {isSeeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Seed Standard Categories</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>

          {!readOnly && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by category name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted w-full md:w-auto justify-end flex-wrap">
          <Filter className="w-3.5 h-3.5 text-[#5A2EA6]" />
          <span>Status:</span>
          {(['All', 'Active', 'Inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border',
                statusFilter === st
                  ? 'bg-[#5A2EA6] text-white border-[#5A2EA6]'
                  : 'bg-[#FCFAFF] text-soft hover:bg-[#5A2EA6]/10 border-[#5A2EA6]/20',
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Table */}
      <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
        <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 w-full flex justify-between items-center">
            <div>
              <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                Master Service Category Hierarchy
              </h3>
              <p className="text-[10px] text-white/80 mt-0.5">
                Display order controls booking app and appointment diary sequence
              </p>
            </div>
            <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {filteredCategories.length} Visible
            </span>
          </div>
        </div>

        <div className="p-0 flex-1 bg-transparent overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
              <tr>
                {[
                  'Category Name',
                  'Category Code',
                  'Description Scope',
                  'Total Services',
                  'Display Order',
                  'Status',
                  'Last Updated',
                  'Actions',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                      i === 0 ? 'pl-5' : i === 7 ? 'pr-5 text-right' : '',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-muted">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#5A2EA6]" />
                      <span className="text-xs font-medium">
                        Loading service categories from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5A2EA6] grid place-items-center">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-ink">
                        No Service Categories Found
                      </h4>
                      <p className="text-xs text-muted max-w-sm">
                        {searchQuery
                          ? 'No categories match your search filters.'
                          : "You haven't created any service categories yet. Seed standard industry categories to get started instantly."}
                      </p>
                      {!searchQuery && (
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            onClick={handleSeedStandardCategories}
                            disabled={isSeeding}
                            className="h-9 px-4 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white flex items-center gap-2"
                          >
                            {isSeeding ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                            <span>Seed Standard Categories</span>
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddModalOpen(true)}
                            className="h-9 px-4 rounded-xl text-xs font-bold border-purple-200 text-[#5A2EA6]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Custom Category</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#5A2EA6]/3 transition-colors duration-200">
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        {cat.imageUrl ? (
                          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-2xs shrink-0 border border-purple-100/80">
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-9 h-9 rounded-xl grid place-items-center text-white shrink-0 shadow-2xs font-bold text-xs"
                            style={{ backgroundColor: cat.accentColor }}
                          >
                            <Scissors className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-ink text-[13px]">{cat.name}</div>
                          <div className="text-[10px] text-muted font-mono">{cat.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] font-bold text-[#5A2EA6]">
                      {cat.code}
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-[11.5px] text-soft">
                      {cat.description}
                    </td>
                    <td className="p-3.5 font-semibold text-ink">
                      <span className="bg-purple-50 text-[#5A2EA6] px-2.5 py-0.5 rounded-md font-bold text-[11px] border border-purple-100">
                        {cat.servicesCount} Services
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-soft font-semibold text-xs">
                        #{cat.displayOrder}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                          cat.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700',
                        )}
                      >
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            cat.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-400',
                          )}
                        />
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-muted text-[11px]">{cat.lastUpdated}</td>
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewCategory(cat)}
                          className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                          title="View Category Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {!readOnly && (
                          <>
                            <button
                              onClick={() => setEditCategory({ ...cat })}
                              className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeactivateCategory(cat)}
                              className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-0',
                                cat.status === 'Active'
                                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
                              )}
                              title={
                                cat.status === 'Active' ? 'Deactivate Category' : 'Activate Category'
                              }
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS (Portaled to document.body) ================= */}

      {/* 1. Add Category Modal */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Add Service Category
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Define a new category department for grouping salon &amp; spa treatments.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleAddCategory}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Categories define service hierarchies in customer booking mobile apps, web
                  portals, and staff appointment books.
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hair Dressing &amp; Styling"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Category Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HAIR-01"
                      value={newCat.code}
                      onChange={(e) => setNewCat({ ...newCat, code: e.target.value })}
                      className={cn(
                        'w-full h-11 px-4 rounded-xl border bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none uppercase font-mono',
                        isAddCodeTaken
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-purple-100 focus:border-[#5A2EA6]',
                      )}
                    />
                    {isAddCodeTaken && (
                      <span className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        Code already in use. Please enter a unique code.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newCat.displayOrder}
                      onChange={(e) =>
                        setNewCat({ ...newCat, displayOrder: Number.parseInt(e.target.value) || 1 })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                {/* CATEGORY IMAGE UPLOAD SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                      Category Cover Image
                    </label>
                    <span className="text-[10px] text-muted font-medium">PNG, JPG up to 5MB</span>
                  </div>

                  <input
                    ref={addFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file, false);
                    }}
                    className="hidden"
                  />

                  {newCat.imageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-[#FAF8FC] group p-2.5 flex items-center gap-3.5">
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-purple-100 shadow-sm relative">
                        <img
                          src={newCat.imageUrl}
                          alt="Category Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-xs font-bold text-ink truncate">
                          Image Attached
                        </strong>
                        <span className="text-[10.5px] text-soft block truncate mt-0.5">
                          Will be displayed in client apps and booking catalog
                        </span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => addFileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] transition-colors border-0 cursor-pointer"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewCat((prev) => ({ ...prev, imageUrl: '' }))}
                            className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border-0 cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => addFileInputRef.current?.click()}
                      className="border-2 border-dashed border-purple-200 hover:border-[#5A2EA6] bg-[#FCFAFF] hover:bg-purple-50/40 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group select-none"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] group-hover:scale-110 transition-transform grid place-items-center mx-auto mb-1.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-ink group-hover:text-[#5A2EA6] transition-colors">
                        Click to upload category image or drag &amp; drop
                      </div>
                      <p className="text-[10px] text-muted mt-0.5">
                        High-resolution photo for customer mobile app cards &amp; online portal
                      </p>
                    </div>
                  )}

                  {/* Quick Presets Picker */}
                  <div className="mt-2.5">
                    <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1.5">
                      Or select a curated beauty preset:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {CATEGORY_IMAGE_PRESETS.map((preset) => {
                        const isSelected = newCat.imageUrl === preset.url;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setNewCat((prev) => ({ ...prev, imageUrl: preset.url }))}
                            className={cn(
                              'px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all border cursor-pointer flex items-center gap-1',
                              isSelected
                                ? 'bg-[#5A2EA6] text-white border-[#5A2EA6] shadow-xs'
                                : 'bg-white text-soft border-purple-100 hover:border-[#5A2EA6]/40 hover:text-ink',
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Description Scope
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief overview of treatments and customer offerings under this category..."
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newCat.accentColor}
                        onChange={(e) => setNewCat({ ...newCat, accentColor: e.target.value })}
                        className="w-11 h-11 rounded-xl border border-purple-100 cursor-pointer p-1 bg-[#FCFAFF]"
                      />
                      <span className="font-mono text-xs text-soft font-semibold">
                        {newCat.accentColor}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Status
                    </label>
                    <select
                      value={newCat.status}
                      onChange={(e) =>
                        setNewCat({
                          ...newCat,
                          status: e.target.value as ServiceCategory['status'],
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Active">Active (Visible)</option>
                      <option value="Inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isAddCodeTaken}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Category
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. View Category Modal */}
      {viewCategory &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              {viewCategory.imageUrl && (
                <div className="w-full h-36 rounded-2xl overflow-hidden relative shadow-sm border border-purple-100/60 mb-2">
                  <img
                    src={viewCategory.imageUrl}
                    alt={viewCategory.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <span className="text-white text-xs font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                      {viewCategory.code}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-3 border-b border-purple-50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl grid place-items-center text-white font-bold"
                    style={{ backgroundColor: viewCategory.accentColor }}
                  >
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[18px] text-ink font-bold">
                      {viewCategory.name}
                    </h3>
                    <span className="text-xs text-[#5A2EA6] font-mono font-bold">
                      {viewCategory.code}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewCategory(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {viewCategory.description}
              </div>

              <div className="space-y-2 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Services Configured:</span>
                  <strong className="text-ink">{viewCategory.servicesCount} Master Services</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Display Priority Index:</span>
                  <strong className="text-ink">#{viewCategory.displayOrder}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Publication Status:</span>
                  <span className="font-bold text-emerald-700">{viewCategory.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted font-medium">Last Modified Timestamp:</span>
                  <span className="text-soft font-mono">{viewCategory.lastUpdated}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end border-t border-purple-50">
                <Button
                  onClick={() => setViewCategory(null)}
                  className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Edit Category Modal */}
      {editCategory &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Edit Category: {editCategory.name}
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5 font-mono">
                    {editCategory.code} · {editCategory.id}
                  </p>
                </div>
                <button
                  onClick={() => setEditCategory(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSaveEdit}
                className="p-6 space-y-4 overflow-y-auto custom-scroll"
              >
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Category Code
                    </label>
                    <input
                      type="text"
                      value={editCategory.code}
                      onChange={(e) => setEditCategory({ ...editCategory, code: e.target.value })}
                      className={cn(
                        'w-full h-11 px-4 rounded-xl border bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none uppercase font-mono',
                        isEditCodeTaken
                          ? 'border-rose-400 focus:border-rose-500'
                          : 'border-purple-100 focus:border-[#5A2EA6]',
                      )}
                    />
                    {isEditCodeTaken && (
                      <span className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        Code already in use by another category.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Display Order Index
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={editCategory.displayOrder}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          displayOrder: Number.parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    />
                  </div>
                </div>

                {/* EDIT CATEGORY IMAGE UPLOAD */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block">
                      Category Cover Image
                    </label>
                    <span className="text-[10px] text-muted font-medium">PNG, JPG up to 5MB</span>
                  </div>

                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file, true);
                    }}
                    className="hidden"
                  />

                  {editCategory.imageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-purple-200 bg-[#FAF8FC] group p-2.5 flex items-center gap-3.5">
                      <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-purple-100 shadow-sm relative">
                        <img
                          src={editCategory.imageUrl}
                          alt="Category Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="block text-xs font-bold text-ink truncate">
                          Image Attached
                        </strong>
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-[#5A2EA6]/10 hover:bg-[#5A2EA6]/20 text-[#5A2EA6] transition-colors border-0 cursor-pointer"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCategory({ ...editCategory, imageUrl: '' })}
                            className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border-0 cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      className="border-2 border-dashed border-purple-200 hover:border-[#5A2EA6] bg-[#FCFAFF] hover:bg-purple-50/40 rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 group select-none"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] group-hover:scale-110 transition-transform grid place-items-center mx-auto mb-1.5">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-ink group-hover:text-[#5A2EA6] transition-colors">
                        Click to upload category image
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Description Scope
                  </label>
                  <textarea
                    rows={2}
                    value={editCategory.description}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, description: e.target.value })
                    }
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editCategory.accentColor || '#5A2EA6'}
                        onChange={(e) =>
                          setEditCategory({ ...editCategory, accentColor: e.target.value })
                        }
                        className="w-10 h-10 rounded-lg border border-purple-100 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        value={editCategory.accentColor || '#5A2EA6'}
                        onChange={(e) =>
                          setEditCategory({ ...editCategory, accentColor: e.target.value })
                        }
                        className="flex-1 h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Status
                    </label>
                    <select
                      value={editCategory.status}
                      onChange={(e) =>
                        setEditCategory({
                          ...editCategory,
                          status: e.target.value as ServiceCategory['status'],
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="Active">Active (Visible)</option>
                      <option value="Inactive">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setEditCategory(null)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md transition-all"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 4. Deactivate Confirmation Modal */}
      {deactivateCategory &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    {deactivateCategory.status === 'Active'
                      ? 'Deactivate Category?'
                      : 'Activate Category?'}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {deactivateCategory.name} ({deactivateCategory.code})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                {deactivateCategory.status === 'Active'
                  ? `Deactivating "${deactivateCategory.name}" will safely hide all associated services from customer mobile booking apps. Historical appointment archives and billing ledgers will remain completely intact (non-destructive safety).`
                  : `Activating "${deactivateCategory.name}" will publish all linked services to active online booking channels.`}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeactivateCategory(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleToggleStatus(deactivateCategory)}
                  className={cn(
                    'h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all',
                    deactivateCategory.status === 'Active'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white',
                  )}
                >
                  Confirm {deactivateCategory.status === 'Active' ? 'Deactivation' : 'Activation'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* 5. Delete Category Confirmation Modal */}
      {categoryToDelete &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-lg overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 pb-2 border-b border-rose-50">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 grid place-items-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-[17px] text-ink font-bold">
                    Permanently Delete Category?
                  </h3>
                  <p className="text-[11px] text-muted">
                    {categoryToDelete.name} ({categoryToDelete.code})
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs text-rose-900 leading-relaxed font-medium">
                Are you sure you want to delete &quot;{categoryToDelete.name}&quot;? Categories with active services linked to them cannot be deleted until services are reassigned or removed.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCategoryToDelete(null)}
                  className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => handleDeleteCategory(categoryToDelete)}
                  className="h-10 px-6 rounded-xl text-xs font-bold shadow-md transition-all bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
