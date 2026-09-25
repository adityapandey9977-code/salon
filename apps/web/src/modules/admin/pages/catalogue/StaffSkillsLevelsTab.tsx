import { Button, cn, useToast } from '@salon-spa-saas/ui';
import {
  AlertCircle,
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Edit2,
  Eye,
  Filter,
  GraduationCap,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAdminContext } from '../../context/AdminContext';
import {
  catalogueApi,
  staffApi,
  type ApiServiceCategory,
  type ApiServiceMaster,
  type ApiSkillMaster,
} from '@/shared/api';
import { extractErrorMessage } from './ServiceCategoriesTab';

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface SkillItem {
  id: string;
  code: string;
  name: string;
  category: string;
  categoryId?: string;
  description: string;
  staffCount: number;
  servicesLinked: number;
  status: 'Active' | 'Inactive';
}

export interface SkillLevelItem {
  id: string;
  level: 'Junior' | 'Intermediate' | 'Senior' | 'Expert';
  description: string;
  requiredExperience: string;
  staffCount: number;
  commissionMultiplier: string;
  status: 'Active' | 'Inactive';
}

export interface StaffSkillAssignment {
  id: string;
  staffName: string;
  branch: string;
  skill: string;
  level: 'Junior' | 'Intermediate' | 'Senior' | 'Expert';
  status: 'Certified' | 'In Training' | 'Pending Review';
}

// ─── INITIAL FALLBACK DATA ───────────────────────────────────────────────────

export const initialSkills: SkillItem[] = [
  {
    id: 'SKL-001',
    code: 'SKL-HAIR-01',
    name: 'Precision Hair Styling',
    category: 'Hair Dressing & Styling',
    description: 'Structural sectioning, bespoke layered cuts, and razor feathering techniques.',
    staffCount: 38,
    servicesLinked: 14,
    status: 'Active',
  },
  {
    id: 'SKL-002',
    code: 'SKL-CHEM-02',
    name: 'Chemical Hair Therapy',
    category: 'Hair Dressing & Styling',
    description: 'Keratin, cysteine, balayage bleaching, and ammonia-free root melt chemistry.',
    staffCount: 22,
    servicesLinked: 8,
    status: 'Active',
  },
  {
    id: 'SKL-003',
    code: 'SKL-SKIN-03',
    name: 'Clinical Skin Aesthetics',
    category: 'Skin & Organic Therapy',
    description: 'Hydrodermabrasion, high-frequency ozone therapy, chemical peel neutralisation.',
    staffCount: 18,
    servicesLinked: 10,
    status: 'Active',
  },
  {
    id: 'SKL-004',
    code: 'SKL-SPA-04',
    name: 'Spa Bodywork & Acupressure',
    category: 'Spa & Wellness Rituals',
    description: 'Swedish effleurage, lymphatic drainage, reflexology point pressure, hot stones.',
    staffCount: 14,
    servicesLinked: 8,
    status: 'Active',
  },
  {
    id: 'SKL-005',
    code: 'SKL-NAIL-05',
    name: 'Nail Architecture & Artistry',
    category: 'Nails Art & Spa Lounge',
    description: 'Polygel apex sculpting, electric file cuticle prep, chrome encapsulation.',
    staffCount: 16,
    servicesLinked: 9,
    status: 'Active',
  },
  {
    id: 'SKL-006',
    code: 'SKL-MAKE-06',
    name: 'Couture Airbrush Makeup',
    category: 'Bridal & Red Carpet Studio',
    description: 'High-definition micro-pigment misting, contouring, silicone bridal sealing.',
    staffCount: 12,
    servicesLinked: 6,
    status: 'Active',
  },
];

export const initialLevels: SkillLevelItem[] = [
  {
    id: 'LVL-01',
    level: 'Junior',
    description:
      'Entry-level technician / apprentice handling prep, blow-drys, and express sessions.',
    requiredExperience: '0 - 2 Years',
    staffCount: 24,
    commissionMultiplier: '1.0x Base',
    status: 'Active',
  },
  {
    id: 'LVL-02',
    level: 'Intermediate',
    description:
      'Skilled practitioner performing standard salon cuts, color root touches, and facials.',
    requiredExperience: '2 - 4 Years',
    staffCount: 42,
    commissionMultiplier: '1.25x Base',
    status: 'Active',
  },
  {
    id: 'LVL-03',
    level: 'Senior',
    description: 'Senior specialist trusted with balayage, hydra-facials, and bridal styling.',
    requiredExperience: '4 - 7 Years',
    staffCount: 36,
    commissionMultiplier: '1.5x Base',
    status: 'Active',
  },
  {
    id: 'LVL-04',
    level: 'Expert',
    description: 'Master artistic director managing high-ticket bespoke transformations.',
    requiredExperience: '7+ Years',
    staffCount: 18,
    commissionMultiplier: '2.0x Base',
    status: 'Active',
  },
];

export const initialStaffAssignments: StaffSkillAssignment[] = [
  {
    id: 'STAFF-01',
    staffName: 'Ananya Deshmukh',
    branch: 'Atelier Indrapuri Flagship',
    skill: 'Precision Hair Styling',
    level: 'Senior',
    status: 'Certified',
  },
  {
    id: 'STAFF-02',
    staffName: 'Rohit Verma',
    branch: 'Atelier Koregaon Park Grand',
    skill: 'Chemical Hair Therapy',
    level: 'Expert',
    status: 'Certified',
  },
  {
    id: 'STAFF-03',
    staffName: 'Kavita Iyer',
    branch: 'Atelier Whitefield Studio',
    skill: 'Clinical Skin Aesthetics',
    level: 'Senior',
    status: 'Certified',
  },
  {
    id: 'STAFF-04',
    staffName: 'Sameer Sheikh',
    branch: 'Atelier MG Road Express',
    skill: 'Barbering & Hot Towel Shave',
    level: 'Intermediate',
    status: 'Certified',
  },
  {
    id: 'STAFF-05',
    staffName: 'Pooja Kashyap',
    branch: 'Atelier Arera Luxury Lounge',
    skill: 'Couture Airbrush Makeup',
    level: 'Expert',
    status: 'Certified',
  },
  {
    id: 'STAFF-06',
    staffName: 'Manish Rawat',
    branch: 'Atelier Jaipur Royal Spa',
    skill: 'Spa Bodywork & Acupressure',
    level: 'Senior',
    status: 'In Training',
  },
];

export interface StaffSkillsLevelsTabProps {
  defaultBranch?: string;
  lockBranch?: boolean;
  readOnly?: boolean;
  onSkillsCountChange?: (count: number) => void;
}

export function StaffSkillsLevelsTab({
  defaultBranch = 'Atelier Indrapuri Flagship',
  lockBranch = false,
  readOnly = false,
  onSkillsCountChange,
}: StaffSkillsLevelsTabProps = {}) {
  const { toast } = useToast();
  const { salon } = useAdminContext();
  const [subView, setSubView] = useState<'skills' | 'levels' | 'mapping' | 'staff'>('skills');

  // Database Data States
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<ApiServiceCategory[]>([]);
  const [dbServices, setDbServices] = useState<ApiServiceMaster[]>([]);
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<SkillItem | null>(null);
  const [deleteConfirmSkill, setDeleteConfirmSkill] = useState<SkillItem | null>(null);

  // Unified Form State for Add Skill
  const [newSkill, setNewSkill] = useState<{
    name: string;
    code: string;
    category: string;
    categoryId: string;
    description: string;
    status: 'Active' | 'Inactive';
  }>({
    name: '',
    code: '',
    category: '',
    categoryId: '',
    description: '',
    status: 'Active',
  });

  // Load all live database records on mount
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [fetchedCategories, fetchedSkills, fetchedServices, fetchedStaff] =
        await Promise.allSettled([
          catalogueApi.fetchCategories(),
          catalogueApi.fetchSkills(),
          catalogueApi.fetchServices(),
          staffApi.list(),
        ]);

      const categories: ApiServiceCategory[] =
        fetchedCategories.status === 'fulfilled' ? fetchedCategories.value || [] : [];
      setCategoriesList(categories);

      const services: ApiServiceMaster[] =
        fetchedServices.status === 'fulfilled' ? fetchedServices.value || [] : [];
      setDbServices(services);

      const staff: any[] =
        fetchedStaff.status === 'fulfilled' ? fetchedStaff.value || [] : [];
      setStaffMembers(staff);

      const skillsFromDb: ApiSkillMaster[] =
        fetchedSkills.status === 'fulfilled' ? fetchedSkills.value || [] : [];

      // Combine database skills and any skills required by database services for this tenant
      const allDbSkillsMap = new Map<string, ApiSkillMaster>();
      skillsFromDb.forEach((s) => {
        allDbSkillsMap.set(s.name.trim().toLowerCase(), s);
      });

      services.forEach((srv) => {
        const skillName = (srv.requiredSkill || '').trim();
        if (skillName && !allDbSkillsMap.has(skillName.toLowerCase())) {
          allDbSkillsMap.set(skillName.toLowerCase(), {
            id: `SKL-SRV-${srv.id.slice(0, 8)}`,
            code: `SKL-${skillName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}`,
            name: skillName,
            categoryId: srv.categoryId,
            categoryName: categories.find((c) => c.id === srv.categoryId)?.name || 'General Services',
            description: `Technical competency required for ${srv.name}`,
            status: 'Active',
          });
        }
      });

      const combinedSkills = Array.from(allDbSkillsMap.values());

      if (combinedSkills.length > 0) {
        const mappedSkills: SkillItem[] = combinedSkills.map((s) => {
          // Count how many staff have this skill or role matching
          const staffCount = staff.filter((st) => {
            const hasSkill =
              Array.isArray(st.skills) &&
              st.skills.some((sk: any) =>
                typeof sk === 'string'
                  ? sk.toLowerCase() === s.name.toLowerCase() ||
                    sk.toLowerCase() === s.code.toLowerCase()
                  : (sk?.name || sk?.code || '').toLowerCase() === s.name.toLowerCase(),
              );
            const jobMatch = (st.jobTitle || '').toLowerCase().includes(s.name.toLowerCase());
            return hasSkill || jobMatch;
          }).length;

          // Count linked services
          const servicesLinked = services.filter(
            (srv) =>
              (srv.requiredSkill || '').trim().toLowerCase() === s.name.trim().toLowerCase() ||
              (srv.requiredSkill || '').trim().toLowerCase() === s.code.trim().toLowerCase(),
          ).length;

          // Match category name
          const cat = categories.find((c) => c.id === s.categoryId);
          const categoryName = s.categoryName || cat?.name || 'General Services';

          return {
            id: s.id,
            code: s.code,
            name: s.name,
            category: categoryName,
            categoryId: s.categoryId || cat?.id || '',
            description: s.description || 'Master skill certification.',
            staffCount: staffCount > 0 ? staffCount : s.staffCount || 0,
            servicesLinked: servicesLinked > 0 ? servicesLinked : s.servicesLinked || 0,
            status: s.status,
          };
        });
        setSkills(mappedSkills);
        onSkillsCountChange?.(mappedSkills.length);
      } else {
        setSkills([]);
        onSkillsCountChange?.(0);
      }
    } catch (err) {
      console.error('[StaffSkillsLevelsTab] Error loading data:', err);
      toast('Could not synchronize skills with database.');
      setSkills([]);
      onSkillsCountChange?.(0);
    } finally {
      setIsLoading(false);
    }
  };

  const [isSeedingSkills, setIsSeedingSkills] = useState(false);

  const handleSeedStandardSkills = async () => {
    setIsSeedingSkills(true);
    try {
      await catalogueApi.seedSkills();
      await loadAllData();
      toast('Standard technical skills seeded successfully into database.');
    } catch (err) {
      console.error('Failed to seed standard skills:', err);
      toast('Failed to seed standard skills to database.');
    } finally {
      setIsSeedingSkills(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Live duplicate code detection
  const isAddCodeTaken = useMemo(() => {
    const code = newSkill.code.trim().toUpperCase();
    if (!code) return false;
    return skills.some((s) => s.code.trim().toUpperCase() === code);
  }, [newSkill.code, skills]);

  const isEditCodeTaken = useMemo(() => {
    if (!editSkill) return false;
    const code = editSkill.code.trim().toUpperCase();
    if (!code) return false;
    return skills.some(
      (s) => s.id !== editSkill.id && s.code.trim().toUpperCase() === code,
    );
  }, [editSkill, skills]);

  // Open Add Skill Modal with dynamic defaults
  const handleOpenAddModal = () => {
    const defaultCat = categoriesList[0]?.name || 'Hair & Styling';
    const defaultCatId = categoriesList[0]?.id || '';
    const prefix = (categoriesList[0]?.code || 'SKL').replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase();
    setNewSkill({
      name: '',
      code: `SKL-${prefix}-${String(skills.length + 1).padStart(2, '0')}`,
      category: defaultCat,
      categoryId: defaultCatId,
      description: '',
      status: 'Active',
    });
    setIsAddSkillModalOpen(true);
  };

  // Open Edit Skill Modal with full fields
  const handleOpenEditModal = (skill: SkillItem) => {
    const matchingCat = categoriesList.find(
      (c) => c.name === skill.category || c.id === skill.categoryId,
    );
    setEditSkill({
      ...skill,
      category: matchingCat?.name || skill.category,
      categoryId: matchingCat?.id || skill.categoryId || '',
    });
  };

  // Add Skill Action Handler
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.code.trim()) {
      toast('Please provide a skill title and skill code.');
      return;
    }
    if (isAddCodeTaken) {
      toast(`Skill code "${newSkill.code.toUpperCase()}" already exists. Please choose a unique code.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = categoriesList.find((c) => c.name === newSkill.category);
      const catId = selectedCat?.id || newSkill.categoryId || undefined;
      const catName = selectedCat?.name || newSkill.category;

      const created = await catalogueApi.createSkill({
        name: newSkill.name.trim(),
        code: newSkill.code.trim().toUpperCase(),
        categoryId: catId,
        categoryName: catName,
        description: newSkill.description.trim() || undefined,
        status: newSkill.status,
      });

      const newItem: SkillItem = {
        id: created.id,
        code: created.code,
        name: created.name,
        category: created.categoryName || catName,
        categoryId: created.categoryId || catId,
        description: created.description || '',
        staffCount: 0,
        servicesLinked: 0,
        status: created.status,
      };

      setSkills((prev) => [...prev, newItem]);
      setIsAddSkillModalOpen(false);
      toast(`Skill "${newItem.name}" registered successfully.`);
    } catch (err: any) {
      console.error('Failed to create skill:', err);
      toast(extractErrorMessage(err, 'Failed to register skill.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Skill Action Handler
  const handleSaveEditSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSkill) return;
    if (!editSkill.name.trim() || !editSkill.code.trim()) {
      toast('Please provide a skill title and skill code.');
      return;
    }
    if (isEditCodeTaken) {
      toast(`Skill code "${editSkill.code.toUpperCase()}" is already assigned to another skill.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCat = categoriesList.find((c) => c.name === editSkill.category);
      const catId = selectedCat?.id || editSkill.categoryId || undefined;
      const catName = selectedCat?.name || editSkill.category;

      const updated = await catalogueApi.updateSkill(editSkill.id, {
        name: editSkill.name.trim(),
        code: editSkill.code.trim().toUpperCase(),
        categoryId: catId,
        categoryName: catName,
        description: editSkill.description.trim() || undefined,
        status: editSkill.status,
      });

      setSkills((prev) =>
        prev.map((s) =>
          s.id === editSkill.id
            ? {
                ...s,
                name: updated.name,
                code: updated.code,
                category: updated.categoryName || catName,
                categoryId: updated.categoryId || catId,
                description: updated.description || '',
                status: updated.status,
              }
            : s,
        ),
      );
      setEditSkill(null);
      toast(`Skill "${editSkill.name}" updated successfully.`);
    } catch (err: any) {
      console.error('Failed to update skill:', err);
      toast(extractErrorMessage(err, 'Failed to update skill.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Skill Action Handler
  const handleDeleteSkill = async (skill: SkillItem) => {
    setIsSubmitting(true);
    try {
      await catalogueApi.deleteSkill(skill.id);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      setDeleteConfirmSkill(null);
      toast(`Skill "${skill.name}" removed from catalogue.`);
    } catch (err: any) {
      console.error('Failed to delete skill:', err);
      toast(extractErrorMessage(err, 'Failed to delete skill.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic Skill Levels with live counts from staffMembers
  const dynamicLevels = useMemo(() => {
    const tierCounts: Record<string, number> = {
      Junior: 0,
      Intermediate: 0,
      Senior: 0,
      Expert: 0,
    };

    staffMembers.forEach((st) => {
      const lvl = (st.profile?.experienceLevel || st.skillLevel || 'Senior').toLowerCase();
      if (lvl.includes('expert') || lvl.includes('master')) tierCounts.Expert += 1;
      else if (lvl.includes('senior')) tierCounts.Senior += 1;
      else if (lvl.includes('inter')) tierCounts.Intermediate += 1;
      else tierCounts.Junior += 1;
    });

    return initialLevels.map((lvl) => ({
      ...lvl,
      staffCount: staffMembers.length > 0 ? tierCounts[lvl.level] ?? 0 : 0,
    }));
  }, [staffMembers]);

  // Filter skills by search query
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
  }, [skills, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-[22px] border border-[#5A2EA6]/12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-[20px] text-ink font-bold tracking-tight">
              Staff Skills, Experience Levels &amp; Service Mapping
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
              Competency Matrix
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Certify staff technical proficiencies, tier experience levels, and link required staff
            tiers to services.
          </p>
        </div>

        {/* Sub-View Switcher Tabs */}
        <div className="flex items-center p-1 bg-[#FCFAFF] rounded-xl border border-[#5A2EA6]/20 overflow-x-auto no-scrollbar">
          {[
            { id: 'skills' as const, label: 'Skills Registry', icon: Award },
            { id: 'levels' as const, label: 'Skill Levels', icon: GraduationCap },
            { id: 'mapping' as const, label: 'Service Mapping', icon: Layers },
            { id: 'staff' as const, label: 'Staff Roster Mapping', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubView(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 flex items-center gap-1.5 whitespace-nowrap',
                  isActive
                    ? 'bg-[#5A2EA6] text-white shadow-2xs'
                    : 'bg-transparent text-soft hover:text-ink',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 1. SKILLS DIRECTORY ================= */}
      {subView === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[38px] px-3.5 pl-9 rounded-xl border border-[#5A2EA6]/20 bg-white text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
              />
              <Search className="w-4 h-4 text-muted absolute left-3 top-2.5" />
            </div>

            {!readOnly && (
              <Button
                onClick={handleOpenAddModal}
                className="h-10 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </Button>
            )}
          </div>

          <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
            <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
              <div className="premium-card-header-glow" />
              <div className="header-shine" />
              <div className="z-10 w-full flex justify-between items-center">
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Master Technical Skills Registry
                </h3>
                <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  {skills.length} Skills Registered
                </span>
              </div>
            </div>

            <div className="p-0 flex-1 bg-transparent overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-xs text-soft flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#5A2EA6]" />
                  <span>Loading live skills registry from database...</span>
                </div>
              ) : skills.length === 0 ? (
                <div className="p-12 text-center text-xs text-soft flex flex-col items-center justify-center gap-3">
                  <Award className="w-8 h-8 text-purple-300" />
                  <p className="font-bold text-ink">No skills registered yet.</p>
                  <p className="text-muted text-[11.5px]">
                    Create your first technical skill to link competencies with services.
                  </p>
                  {!readOnly && (
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1">
                      <Button
                        onClick={handleOpenAddModal}
                        className="h-9 px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register First Skill</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSeedStandardSkills}
                        disabled={isSeedingSkills}
                        className="h-9 px-4 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/10 bg-white flex items-center gap-1.5 shadow-xs"
                      >
                        {isSeedingSkills ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-[#5A2EA6]" />
                        )}
                        <span>Seed Industry Standard Skills</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                    <tr>
                      {[
                        'Skill Title & Code',
                        'Category',
                        'Description Scope',
                        'Certified Staff',
                        'Services Linked',
                        'Status',
                        ...(!readOnly ? ['Actions'] : []),
                      ].map((h, i) => (
                        <th
                          key={h}
                          className={cn(
                            'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                            i === 0 ? 'pl-5' : !readOnly && i === 6 ? 'pr-5 text-right' : '',
                          )}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                    {filteredSkills.map((skill) => (
                      <tr
                        key={skill.id}
                        className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                      >
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-ink text-[13px]">{skill.name}</div>
                          <div className="text-[10px] text-[#5A2EA6] font-mono font-bold">
                            {skill.code}
                          </div>
                        </td>
                        <td className="p-3.5 font-semibold text-soft">{skill.category}</td>
                        <td className="p-3.5 max-w-xs truncate text-[11.5px] text-soft">
                          {skill.description}
                        </td>
                        <td className="p-3.5 font-bold text-ink">{skill.staffCount} Stylists</td>
                        <td className="p-3.5 font-semibold text-[#5A2EA6]">
                          {skill.servicesLinked} Treatments
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                              skill.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600',
                            )}
                          >
                            {skill.status}
                          </span>
                        </td>
                        {!readOnly && (
                          <td className="p-3.5 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(skill)}
                                className="w-8 h-8 rounded-lg bg-[#5A2EA6]/5 hover:bg-[#5A2EA6]/15 text-[#5A2EA6] flex items-center justify-center transition-colors cursor-pointer border-0"
                                title="Edit Skill"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmSkill(skill)}
                                className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer border-0"
                                title="Delete Skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. SKILL LEVELS ================= */}
      {subView === 'levels' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicLevels.map((lvl) => (
              <div
                key={lvl.id}
                className="p-5 bg-white rounded-[24px] border border-[#5A2EA6]/15 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6] text-[10px] font-bold">
                      Tier Level
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {lvl.commissionMultiplier}
                    </span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink">{lvl.level}</h3>
                  <p className="text-xs text-soft mt-1 leading-relaxed">{lvl.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Req Experience:</span>
                    <strong className="text-ink">{lvl.requiredExperience}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Staff in Tier:</span>
                    <strong className="text-[#5A2EA6]">{lvl.staffCount} Team Members</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 3. SERVICE-SKILL MAPPING MATRIX ================= */}
      {subView === 'mapping' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Service → Skill → Certification Tier Mapping
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Appointments are only dispatchable to staff possessing the required skill and
                  level tier
                </p>
              </div>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {dbServices.length} Linked Services
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            {dbServices.length === 0 ? (
              <div className="p-12 text-center text-xs text-soft">
                No active services found in database. Create services in the Catalogue tab to map competencies.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12px]">
                <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                  <tr>
                    {[
                      'Service Treatment',
                      'Category Group',
                      'Required Technical Skill',
                      'Minimum Staff Level Tier',
                      'Resource Requisite',
                      'Action',
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                          i === 0 ? 'pl-5' : i === 5 ? 'pr-5 text-right' : '',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                  {dbServices.map((srv) => {
                    const cat = categoriesList.find((c) => c.id === srv.categoryId);
                    const categoryName = cat?.name || 'General Treatments';
                    return (
                      <tr
                        key={srv.id}
                        className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                      >
                        <td className="p-3.5 pl-5">
                          <div className="font-bold text-ink text-[13px]">{srv.name}</div>
                          <div className="text-[10px] text-muted font-mono">{srv.code}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-soft">{categoryName}</td>
                        <td className="p-3.5 font-bold text-[#5A2EA6]">
                          {srv.requiredSkill || 'General Treatment'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={cn(
                              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold',
                              srv.requiredLevel === 'Expert'
                                ? 'bg-rose-100 text-rose-800'
                                : srv.requiredLevel === 'Senior'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800',
                            )}
                          >
                            {srv.requiredLevel || 'Junior'}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-soft">
                          {srv.requiredRoomOrChair || 'Station'} · {srv.requiredEquipment || 'Standard'}
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            Mapped ✓
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ================= 4. STAFF ROSTER MAPPING ================= */}
      {subView === 'staff' && (
        <div className="premium-branch-card rounded-[24px] overflow-hidden bg-transparent flex flex-col justify-between">
          <div className="premium-card-header px-5 py-3.5 relative min-h-[64px] flex items-center justify-between z-10">
            <div className="premium-card-header-glow" />
            <div className="header-shine" />
            <div className="z-10 w-full flex justify-between items-center">
              <div>
                <h3 className="font-serif text-[15px] text-white font-bold tracking-tight">
                  Branch Staff Skill Certification Roster
                </h3>
                <p className="text-[10px] text-white/80 mt-0.5">
                  Live verification of stylist accreditations and active certification standing
                </p>
              </div>
              <span className="text-[11px] font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {staffMembers.length} Staff Mapped
              </span>
            </div>
          </div>

          <div className="p-0 flex-1 bg-transparent overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12px]">
              <thead className="bg-[#F8F5FF] border-b border-[#5A2EA6]/10 text-[#5A2EA6]">
                <tr>
                  {[
                    'Stylist / Staff Name',
                    ...(!lockBranch ? ['Branch Location'] : []),
                    'Accredited Skill',
                    'Certified Level',
                    'Certification Status',
                  ].map((h, i, arr) => (
                    <th
                      key={h}
                      className={cn(
                        'p-3.5 font-bold text-[9.5px] uppercase tracking-wider',
                        i === 0 ? 'pl-5' : i === arr.length - 1 ? 'pr-5 text-right' : '',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#5A2EA6]/5 text-[#6d5b73]">
                {staffMembers.length > 0
                  ? staffMembers.map((st) => {
                      const branchName =
                        st.primaryBranch?.name ||
                        (st.branches && st.branches[0]?.name) ||
                        st.branch ||
                        defaultBranch;
                      const skillTitle =
                        (Array.isArray(st.skills) && st.skills[0]?.name) ||
                        (Array.isArray(st.skills) && typeof st.skills[0] === 'string'
                          ? st.skills[0]
                          : st.jobTitle || 'Master Styling');
                      const level =
                        st.profile?.experienceLevel || st.skillLevel || 'Senior';
                      const isCertified =
                        st.employmentStatus === 'ACTIVE' || st.status === 'Active';

                      return (
                        <tr
                          key={st.id}
                          className="hover:bg-[#5A2EA6]/3 transition-colors duration-200"
                        >
                          <td className="p-3.5 pl-5">
                            <div className="font-bold text-ink text-[13px]">
                              {st.displayName || st.fullName || `${st.firstName || ''} ${st.lastName || ''}`.trim() || 'Stylist'}
                            </div>
                            <div className="text-[10px] text-muted font-mono">
                              {st.employeeCode || st.id.slice(0, 8)}
                            </div>
                          </td>
                          {!lockBranch && (
                            <td className="p-3.5 font-semibold text-soft">{branchName}</td>
                          )}
                          <td className="p-3.5 font-bold text-ink">{skillTitle}</td>
                          <td className="p-3.5">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#5A2EA6]">
                              {level}
                            </span>
                          </td>
                          <td className="p-3.5 pr-5 text-right">
                            <span
                              className={cn(
                                'inline-block px-2.5 py-0.5 rounded-full text-[9.5px] font-bold',
                                isCertified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800',
                              )}
                            >
                              {isCertified ? 'Certified' : 'In Training'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  : (
                    <tr>
                      <td colSpan={lockBranch ? 4 : 5} className="p-8 text-center text-muted text-xs">
                        <Users className="w-7 h-7 text-[#5A2EA6]/40 mx-auto mb-2" />
                        <p className="font-bold text-ink">No staff members assigned to this salon</p>
                        <p className="text-[11px] text-soft mt-0.5">
                          Add staff in the Team section to map stylist skill accreditations and active certification standing.
                        </p>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODALS (Portaled to document.body) ================= */}

      {/* 1. Register Skill Modal (Create) */}
      {isAddSkillModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Register Technical Skill Certification
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Define technical capabilities required for salon and aesthetic treatments.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddSkillModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleAddSkill}
                className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Skills enforce smart appointment dispatching so that junior staff are never
                  assigned complex chemical or medical protocols without certification.
                </div>

                {/* 1. Skill Title */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Precision Balayage & Foil Master"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* 2. Skill Code & Category Group */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Skill Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SKL-BAL-07"
                      value={newSkill.code}
                      onChange={(e) => setNewSkill({ ...newSkill, code: e.target.value })}
                      className={cn(
                        'w-full h-11 px-4 rounded-xl border bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none uppercase font-mono',
                        isAddCodeTaken
                          ? 'border-rose-400 ring-1 ring-rose-400 focus:border-rose-500'
                          : 'border-purple-100 focus:border-[#5A2EA6]',
                      )}
                    />
                    {isAddCodeTaken && (
                      <p className="text-[10.5px] text-rose-600 font-semibold mt-1">
                        Skill code already exists. Please choose a unique code.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Category Group *
                    </label>
                    <select
                      required
                      value={newSkill.category}
                      onChange={(e) => {
                        const cat = categoriesList.find((c) => c.name === e.target.value);
                        setNewSkill({
                          ...newSkill,
                          category: e.target.value,
                          categoryId: cat?.id || '',
                        });
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="" disabled>
                        Select category from database...
                      </option>
                      {categoriesList.length > 0 ? (
                        categoriesList.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.code})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Hair Dressing & Styling">Hair Dressing & Styling</option>
                          <option value="Skin & Organic Therapy">Skin & Organic Therapy</option>
                          <option value="Spa & Wellness Rituals">Spa & Wellness Rituals</option>
                          <option value="Nails Art & Spa Lounge">Nails Art & Spa Lounge</option>
                          <option value="Bridal & Red Carpet Studio">Bridal & Red Carpet Studio</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* 3. Proficiency Description Scope */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Proficiency Description Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Outline the technical competencies, chemical knowledge, or tooling mastery required..."
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* 4. Certification Status */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Certification Status
                  </label>
                  <select
                    value={newSkill.status}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, status: e.target.value as 'Active' | 'Inactive' })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Active">Active Certification</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setIsAddSkillModalOpen(false)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isAddCodeTaken || isSubmitting}
                    className={cn(
                      'h-10 px-6 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
                      isAddCodeTaken || isSubmitting
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md cursor-pointer',
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <span>Register Skill</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 2. Edit Skill Modal (Identical form to Create Skill) */}
      {editSkill &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[28px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-purple-100/80 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4.5 border-b border-purple-50 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-[18px] text-ink font-bold tracking-tight">
                    Edit Technical Skill Certification
                  </h3>
                  <p className="text-[11.5px] text-muted mt-0.5">
                    Modify technical capabilities and category association for {editSkill.name}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditSkill(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-ink hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSaveEditSkill}
                className="p-6 space-y-4 overflow-y-auto custom-scroll text-xs"
              >
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed font-medium">
                  Skills enforce smart appointment dispatching so that junior staff are never
                  assigned complex chemical or medical protocols without certification.
                </div>

                {/* 1. Skill Title */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Precision Balayage & Foil Master"
                    value={editSkill.name}
                    onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* 2. Skill Code & Category Group */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Skill Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SKL-BAL-07"
                      value={editSkill.code}
                      onChange={(e) => setEditSkill({ ...editSkill, code: e.target.value })}
                      className={cn(
                        'w-full h-11 px-4 rounded-xl border bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none uppercase font-mono',
                        isEditCodeTaken
                          ? 'border-rose-400 ring-1 ring-rose-400 focus:border-rose-500'
                          : 'border-purple-100 focus:border-[#5A2EA6]',
                      )}
                    />
                    {isEditCodeTaken && (
                      <p className="text-[10.5px] text-rose-600 font-semibold mt-1">
                        Skill code already exists. Please choose a unique code.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                      Category Group *
                    </label>
                    <select
                      required
                      value={editSkill.category}
                      onChange={(e) => {
                        const cat = categoriesList.find((c) => c.name === e.target.value);
                        setEditSkill({
                          ...editSkill,
                          category: e.target.value,
                          categoryId: cat?.id || editSkill.categoryId || '',
                        });
                      }}
                      className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                    >
                      <option value="" disabled>
                        Select category from database...
                      </option>
                      {categoriesList.length > 0 ? (
                        categoriesList.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.code})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Hair Dressing & Styling">Hair Dressing & Styling</option>
                          <option value="Skin & Organic Therapy">Skin & Organic Therapy</option>
                          <option value="Spa & Wellness Rituals">Spa & Wellness Rituals</option>
                          <option value="Nails Art & Spa Lounge">Nails Art & Spa Lounge</option>
                          <option value="Bridal & Red Carpet Studio">Bridal & Red Carpet Studio</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* 3. Proficiency Description Scope */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Proficiency Description Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Outline the technical competencies, chemical knowledge, or tooling mastery required..."
                    value={editSkill.description}
                    onChange={(e) => setEditSkill({ ...editSkill, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  />
                </div>

                {/* 4. Certification Status */}
                <div>
                  <label className="text-[11px] font-bold text-[#5A2EA6] uppercase tracking-wider block mb-1.5">
                    Certification Status
                  </label>
                  <select
                    value={editSkill.status}
                    onChange={(e) =>
                      setEditSkill({ ...editSkill, status: e.target.value as 'Active' | 'Inactive' })
                    }
                    className="w-full h-11 px-4 rounded-xl border border-purple-100 bg-[#FCFAFF] text-xs font-semibold text-ink focus:outline-none focus:border-[#5A2EA6]"
                  >
                    <option value="Active">Active Certification</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-50">
                  <button
                    type="button"
                    onClick={() => setEditSkill(null)}
                    className="h-10 px-5 rounded-xl text-xs font-semibold text-soft hover:bg-slate-100 transition-colors border border-slate-200 bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isEditCodeTaken || isSubmitting}
                    className={cn(
                      'h-10 px-6 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
                      isEditCodeTaken || isSubmitting
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                        : 'bg-[#5A2EA6] hover:bg-[#4a2489] text-white shadow-md cursor-pointer',
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}

      {/* 3. Delete Confirmation Modal */}
      {deleteConfirmSkill &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#3B2647]/50 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-[0_25px_70px_rgba(90,46,166,0.25)] border border-rose-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-[18px] text-ink font-bold">
                  Delete Technical Skill?
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Are you sure you want to remove{' '}
                  <strong className="text-ink">"{deleteConfirmSkill.name}"</strong> (
                  <span className="font-mono text-[#5A2EA6]">{deleteConfirmSkill.code}</span>) from
                  the catalogue? This action cannot be undone.
                </p>
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmSkill(null)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold text-soft hover:bg-white transition-colors border border-slate-200 bg-white cursor-pointer"
                >
                  Keep Skill
                </button>
                <Button
                  onClick={() => handleDeleteSkill(deleteConfirmSkill)}
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
