import { Button, cn } from '@salon-spa-saas/ui';
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  Info,
  Layers,
  Lock,
  Monitor,
  Plus,
  RotateCcw,
  Save,
  ShieldCheck,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { rolesApi } from '@/shared/api/roles.api';
import { filterSalonRoles } from '@/shared/utils/roleUtils';
import { CreateEditRoleModal, type SystemRoleItem } from './CreateEditRoleModal';

export type PermissionType = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export interface PanelModuleItem {
  id: string;
  name: string;
  description: string;
}

export type SystemPanelKey =
  | 'admin'
  | 'branch-manager'
  | 'franchise'
  | 'stylist'
  | 'inventory'
  | 'finance'
  | 'call-center';

export interface SystemPanelDefinition {
  id: SystemPanelKey;
  name: string;
  shortLabel: string;
  badge: string;
  description: string;
  modules: PanelModuleItem[];
}

export const SYSTEM_PANELS: SystemPanelDefinition[] = [
  // 1. Admin Panel (15 modules)
  {
    id: 'admin',
    name: 'Admin Panel',
    shortLabel: 'Admin',
    badge: '15 Modules',
    description: 'Central brand-wide administrative operations, locations, master catalogue, staff, and governance.',
    modules: [
      { id: 'admin-dashboard', name: 'Dashboard', description: 'Central salon metrics, revenue overview, and live chair utilization.' },
      { id: 'admin-locations', name: 'Locations', description: 'Branches, operating hours, and localized calendars.' },
      { id: 'admin-catalogue', name: 'Catalogue', description: 'Service treatments, pricing rules, buffer times, and service recipe BOMs.' },
      { id: 'admin-clients', name: 'Clients', description: 'Client 360 CRM, visit history, segment profiles, and treatment notes.' },
      { id: 'admin-staff', name: 'Staff', description: 'Stylist profiles, work rosters, shifts, and productivity metrics.' },
      { id: 'admin-operations', name: 'Operations', description: 'Appointments calendar, daily diary, and live walk-in queues.' },
      { id: 'admin-packages', name: 'Packages & Memberships', description: 'Session balances, loyalty tiers, and prepaid memberships.' },
      { id: 'admin-finance', name: 'Finance', description: 'GST invoicing, ledger receipts, payments, and cash settlements.' },
      { id: 'admin-inventory', name: 'Inventory', description: 'Consumable stock levels, procurement purchase orders, and wastage logs.' },
      { id: 'admin-marketing', name: 'Marketing', description: 'WhatsApp campaigns, SMS marketing, and automated rebooking triggers.' },
      { id: 'admin-franchise', name: 'Franchise', description: 'Franchise network directory, multi-outlet agreements, and royalties.' },
      { id: 'admin-reports', name: 'Reports', description: 'Statutory business intelligence, sales performance, and audit summaries.' },
      { id: 'admin-brand-settings', name: 'Brand Settings', description: 'Corporate brand profile, tax policies, invoice templates, and system defaults.' },
      { id: 'admin-roles-permissions', name: 'Roles & Permissions', description: 'Access matrix, persona scopes, and staff role assignments.' },
      { id: 'admin-audit-logs', name: 'Audit Logs', description: 'Immutable compliance trails, security logs, and action histories.' },
    ],
  },

  // 2. Branch Manager Panel (12 modules)
  {
    id: 'branch-manager',
    name: 'Branch Manager',
    shortLabel: 'Branch Manager',
    badge: '12 Modules',
    description: 'Daily outlet diary, appointments, walk-ins, chairside roster, and express checkout POS.',
    modules: [
      { id: 'bm-dashboard', name: 'Dashboard', description: 'Daily salon executive KPIs, live occupancy, and branch revenue tracking.' },
      { id: 'bm-appointments-diary', name: 'Appointments Diary', description: 'Multi-service appointment calendar, chair allocations, and slot management.' },
      { id: 'bm-walkins-queue', name: 'Walk-ins & Live Queue', description: 'Real-time queue tokens, wait time estimations, and walk-in customer triage.' },
      { id: 'bm-clients-profiles', name: 'Clients & Profiles', description: 'Branch client CRM, household accounts, and visit histories.' },
      { id: 'bm-stylists-roster', name: 'Stylists & Staff Roster', description: 'Shift scheduling, chairside station assignments, and daily staff targets.' },
      { id: 'bm-services-menu', name: 'Services Menu', description: 'Branch-specific treatments, service timings, buffer intervals, and pricing.' },
      { id: 'bm-pos-checkout', name: 'New POS Checkout', description: 'Express cart billing, itemized service checkout, and GST invoice generation.' },
      { id: 'bm-payments-invoices', name: 'Payments & Invoices', description: 'Transaction ledger, payment receipt history, and split-payment records.' },
      { id: 'bm-retail-inventory', name: 'Retail & Shelf Inventory', description: 'Shelf product stock, barcode scanner lookup, and automated reorder alerts.' },
      { id: 'bm-cashier-closure', name: 'Cashier Shift Closure', description: 'Daily cashier shift reconciliation, cash drawer audit, and float balancing.' },
      { id: 'bm-reports', name: 'Reports', description: 'Branch-level sales telemetry, staff commission summaries, and end-of-day analytics.' },
      { id: 'bm-settings', name: 'Settings', description: 'Branch operating hours, chair station configuration, and local printing defaults.' },
    ],
  },

  // 3. Franchise Panel (16 modules)
  {
    id: 'franchise',
    name: 'Franchise',
    shortLabel: 'Franchise',
    badge: '16 Modules',
    description: 'Master franchisee operational console, agreements, royalty fees, and multi-outlet compliance.',
    modules: [
      { id: 'fr-dashboard', name: 'Dashboard', description: 'Master franchise revenue overview, outlet count, and top metrics.' },
      { id: 'fr-my-franchise', name: 'My Franchise', description: 'Franchise entity profile, corporate identity, and agreement details.' },
      { id: 'fr-my-locations', name: 'My Locations', description: 'Assigned franchise salon outlets, branch list, and local address info.' },
      { id: 'fr-catalogue', name: 'Catalogue', description: 'Standard brand treatments, service pricing, and menu offerings.' },
      { id: 'fr-staff-overview', name: 'Staff Overview', description: 'Franchise-wide stylist directory, headcount, and staff performance.' },
      { id: 'fr-customers', name: 'Customers', description: 'Franchise guest database, visit trends, and brand customer loyalty.' },
      { id: 'fr-appointments', name: 'Appointments', description: 'Central franchise booking calendar and cross-location schedules.' },
      { id: 'fr-finance', name: 'Finance', description: 'Franchise revenue ledger, royalty accounting, and tax statements.' },
      { id: 'fr-inventory-summary', name: 'Inventory Summary', description: 'Consolidated stock balances across franchise outlets and consumption.' },
      { id: 'fr-compliance', name: 'Compliance', description: 'Brand standards audit, hygiene checklists, and SLA compliance score.' },
      { id: 'fr-franchise-fees', name: 'Franchise Fees', description: 'Monthly royalty dues, revenue share calculation, and billing history.' },
      { id: 'fr-documents', name: 'Documents', description: 'Operating handbooks, legal agreements, SOP manuals, and brand assets.' },
      { id: 'fr-announcements', name: 'Announcements', description: 'Head office broadcasts, platform advisories, and policy changes.' },
      { id: 'fr-support', name: 'Support', description: 'Franchise support ticket desk, escalation desk, and operational inquiries.' },
      { id: 'fr-notifications', name: 'Notifications', description: 'System alerts, fee due notifications, and operational reminders.' },
      { id: 'fr-my-profile', name: 'My Profile', description: 'Franchise administrator credentials, contact info, and security settings.' },
    ],
  },

  // 4. Stylist Panel (12 modules)
  {
    id: 'stylist',
    name: 'Stylist',
    shortLabel: 'Stylist',
    badge: '12 Modules',
    description: 'Chairside service provider workspace, appointment schedule, formulas, and client portfolio.',
    modules: [
      { id: 'st-dashboard', name: 'Dashboard', description: 'Stylist daily workspace, appointments summary, commission progress, and chair status.' },
      { id: 'st-my-schedule', name: 'My Schedule', description: 'Personal appointment calendar, shift timings, slot availability, and breaks.' },
      { id: 'st-my-clients', name: 'My Clients', description: 'Assigned clientele directory, client service history, and preferences.' },
      { id: 'st-consultation', name: 'Consultation', description: 'Client hair/skin consultation forms, scalp analysis, and intake questionnaires.' },
      { id: 'st-service-mgmt', name: 'Service Management', description: 'Active service workflows, step-by-step procedures, and service timer.' },
      { id: 'st-formulas', name: 'Formulas & Recipes', description: 'Hair color formulation cards, chemical mix ratios, and treatment recipes.' },
      { id: 'st-photos', name: 'Before / After Photos', description: 'Client treatment portfolio, hair transformation photo uploads, and gallery.' },
      { id: 'st-service-notes', name: 'Service Notes', description: 'Post-treatment technical notes, product suggestions, and follow-up guidance.' },
      { id: 'st-recommendations', name: 'Recommendations', description: 'Retail product recommendations, cross-sell suggestions, and client care routines.' },
      { id: 'st-performance', name: 'Performance', description: 'Monthly commission metrics, service ticket average, and client rebooking rate.' },
      { id: 'st-notifications', name: 'Notifications', description: 'Appointment reminder alerts, schedule changes, and manager announcements.' },
      { id: 'st-my-profile', name: 'My Profile', description: 'Stylist professional bio, specialties, certification badges, and account login.' },
    ],
  },

  // 5. Inventory Panel (14 modules)
  {
    id: 'inventory',
    name: 'Inventory',
    shortLabel: 'Inventory',
    badge: '14 Modules',
    description: 'Storekeeper warehouse operations, product catalog, recipes, purchase orders, and stock audit.',
    modules: [
      { id: 'inv-dashboard', name: 'Dashboard', description: 'Central warehouse inventory metrics, stock valuation, and fast-moving items.' },
      { id: 'inv-product-catalog', name: 'Product Catalog', description: 'Barcoded retail & backbar products, SKU identifiers, and brand categories.' },
      { id: 'inv-recipes-bom', name: 'Service Recipes (BOM)', description: 'Bill of Materials, service recipe consumption, and chemical mixing formulas.' },
      { id: 'inv-suppliers', name: 'Suppliers', description: 'Vendor database, supplier contracts, payment terms, and vendor contact info.' },
      { id: 'inv-purchase-orders', name: 'Purchase Orders', description: 'Stock replenishment POs, approval status, and supplier dispatch tracking.' },
      { id: 'inv-grn', name: 'Goods Receiving (GRN)', description: 'Shipment inspection, batch tracking, expiry validation, and GRN entry.' },
      { id: 'inv-stock', name: 'Inventory Stock', description: 'Multi-branch stock levels, shelf quantities, reorder limits, and bin locations.' },
      { id: 'inv-movement', name: 'Stock Movement', description: 'Inter-branch stock transfers, dispatches, transit receipts, and internal issues.' },
      { id: 'inv-consumption', name: 'Consumption & Wastage', description: 'Salon floor daily consumption, spillage logs, product breakage, and tester usage.' },
      { id: 'inv-audit', name: 'Stock Audit / Stocktake', description: 'Physical barcode inventory audits, cycle counts, and variance reconciliation.' },
      { id: 'inv-alerts', name: 'Alerts', description: 'Real-time low stock warnings, dead stock alerts, and expiring batch notifications.' },
      { id: 'inv-reports-valuation', name: 'Reports & Valuation', description: 'FIFO/LIFO inventory valuation, COGS reports, and supplier lead-time analytics.' },
      { id: 'inv-notifications', name: 'Notifications', description: 'Stock replenishment triggers, PO approval alerts, and warehouse advisories.' },
      { id: 'inv-my-profile', name: 'My Profile', description: 'Storekeeper credentials, department allocation, and security settings.' },
    ],
  },

  // 6. Finance / HR Panel (14 modules)
  {
    id: 'finance',
    name: 'Finance / HR',
    shortLabel: 'Finance / HR',
    badge: '14 Modules',
    description: 'Financial ledger, GST receipts, register reconciliation, payroll export, and staff dossiers.',
    modules: [
      { id: 'fin-dashboard', name: 'Dashboard', description: 'Cash flow overview, revenue summary, operating expenses, and financial health score.' },
      { id: 'fin-receipts-gst', name: 'Receipts & GST', description: 'Itemized customer tax receipts, GST output register, and B2B invoice generation.' },
      { id: 'fin-refunds-voids', name: 'Refunds & Voids', description: 'Cancelled bills, cashier refund approvals, chargebacks, and credit note issuance.' },
      { id: 'fin-register-settlements', name: 'Register & Settlements', description: 'Daily till opening/closing, card/UPI gateway reconciliations, and cash float balances.' },
      { id: 'fin-commissions', name: 'Stylist Commissions', description: 'Individual staff commission statements, incentive tier calculation, and clawbacks.' },
      { id: 'fin-payroll', name: 'Monthly Payroll', description: 'Staff salary ledger, deductions (PF/ESI/TDS), overtime bonuses, and payslip generation.' },
      { id: 'fin-payroll-export', name: 'Payroll Bank Export', description: 'Bank NACH bulk transfer CSVs, payout disbursement logs, and account approvals.' },
      { id: 'fin-profitability', name: 'Profitability & P&L', description: 'Departmental EBITDA margins, branch profitability benchmarks, and overhead expense audit.' },
      { id: 'fin-employee-dossier', name: 'Staff Financial Dossier', description: 'Employee financial records, PAN/bank details, advance salary loans, and payout history.' },
      { id: 'fin-attendance-leave', name: 'Attendance & Leave', description: 'Biometric staff punch records, paid leave approvals, unpaid leaves, and loss-of-pay calc.' },
      { id: 'fin-reports', name: 'Statutory Reports', description: 'Chartered accountant compliance packs, GSTR-1 / GSTR-3B audit summaries, and TDS filings.' },
      { id: 'fin-risk-notifications', name: 'Risk Notifications', description: 'High-value refund flags, cash drawer discrepancies, and pending payroll alerts.' },
      { id: 'fin-settings', name: 'Settings', description: 'GST tax slabs, commission slabs, fiscal year boundaries, and bank payout integrations.' },
      { id: 'fin-my-profile', name: 'My Profile', description: 'Finance officer / HR controller credentials, signature certificates, and login security.' },
    ],
  },

  // 7. Call Center Panel (13 modules)
  {
    id: 'call-center',
    name: 'Call Center',
    shortLabel: 'Call Center',
    badge: '13 Modules',
    description: 'Universal concierge intake, inbound leads, multi-branch appointment booking, and CSAT follow-up.',
    modules: [
      { id: 'cc-dashboard', name: 'Dashboard', description: 'Call center queue metrics, incoming call volume, bookings created, and agent occupancy.' },
      { id: 'cc-inbound-leads', name: 'Inbound Leads', description: 'Telephony caller inquiries, prospective guest leads, and campaign attribution.' },
      { id: 'cc-customer-crm', name: 'Customer 360 CRM', description: 'Universal multi-branch client lookup, historical treatments, notes, and preferences.' },
      { id: 'cc-booking', name: 'Multi-Branch Booking', description: 'Cross-outlet appointment scheduling, chair reservation, and multi-service slots.' },
      { id: 'cc-confirmations', name: 'Confirmations Queue', description: '24-hour reminder call list, WhatsApp confirmation status, and cancellation triage.' },
      { id: 'cc-call-logs', name: 'Call Audio & Logs', description: 'Recorded telephony interactions, call duration, timestamp logs, and agent QA tags.' },
      { id: 'cc-tickets', name: 'Grievance & Tickets', description: 'Customer service escalations, satisfaction complaints, and resolution SLAs.' },
      { id: 'cc-packages', name: 'Packages & Memberships', description: 'Phone membership sales, prepaid package renewals, and wallet balances.' },
      { id: 'cc-csat', name: 'CSAT Follow-up', description: 'Post-service feedback calls, 5-star NPS rating surveys, and service review notes.' },
      { id: 'cc-revival', name: 'Lapsed Client Revival', description: 'Dormant guest win-back lists, personalized comeback offers, and reminder outreach.' },
      { id: 'cc-tasks', name: 'Concierge Tasks', description: 'Agent daily callbacks, birthday/anniversary reminders, and VIP concierge tasks.' },
      { id: 'cc-alerts', name: 'Alerts', description: 'SLA breach alerts, VIP caller notifications, and urgent appointment reschedule requests.' },
      { id: 'cc-my-profile', name: 'My Profile', description: 'Call center agent credentials, desk extension number, and performance stats.' },
    ],
  },
];

// Helper to map a role's backend permissions dynamically across all modules
const mapRolePermissionsToMatrix = (
  role: any,
): Record<string, Record<PermissionType, boolean>> => {
  const result: Record<string, Record<PermissionType, boolean>> = {};
  const rolePermCodes = new Set<string>();

  if (role?.permissions && Array.isArray(role.permissions)) {
    role.permissions.forEach((p: any) => {
      const code = p.permission?.code || p.code || p;
      if (typeof code === 'string') rolePermCodes.add(code.toLowerCase().trim());
    });
  }

  const roleCodeUpper = (role?.code || '').toUpperCase();
  const roleNameLower = (role?.name || '').toLowerCase();

  const isSuperOrAdmin =
    roleCodeUpper === 'SUPER_ADMIN' ||
    roleCodeUpper === 'BRAND_OWNER' ||
    roleCodeUpper === 'BRAND_ADMIN' ||
    roleCodeUpper === 'SALON_ADMIN' ||
    roleNameLower.includes('brand owner') ||
    roleNameLower.includes('brand admin');

  const isBranchManagerRole =
    roleCodeUpper === 'BRANCH_MANAGER' ||
    roleCodeUpper === 'MANAGER' ||
    roleNameLower.includes('branch manager');

  const isCallCenterRole =
    roleCodeUpper === 'CALL_CENTER_AGENT' ||
    roleCodeUpper === 'CALL_CENTRE' ||
    roleNameLower.includes('call center') ||
    roleNameLower.includes('call centre');

  const isFinanceRole =
    roleCodeUpper === 'FINANCE_HR' ||
    roleCodeUpper === 'FINANCE_CONTROLLER' ||
    roleNameLower.includes('finance');

  const isInventoryRole =
    roleCodeUpper === 'INVENTORY_MANAGER' ||
    roleCodeUpper === 'INVENTORY_USER' ||
    roleNameLower.includes('inventory');

  const isFranchiseRole =
    roleCodeUpper === 'FRANCHISE_OWNER' ||
    roleCodeUpper === 'FRANCHISE_PARTNER' ||
    roleNameLower.includes('franchise');

  const isStylistRole =
    roleCodeUpper === 'STYLIST' ||
    roleCodeUpper === 'STYLIST_THERAPIST' ||
    roleNameLower.includes('stylist');

  SYSTEM_PANELS.forEach((panel) => {
    // Check if role is the master persona for this specific panel
    const isPanelMaster =
      (panel.id === 'branch-manager' && isBranchManagerRole) ||
      (panel.id === 'call-center' && isCallCenterRole) ||
      (panel.id === 'finance' && isFinanceRole) ||
      (panel.id === 'inventory' && isInventoryRole) ||
      (panel.id === 'franchise' && isFranchiseRole) ||
      (panel.id === 'stylist' && isStylistRole);

    panel.modules.forEach((mod) => {
      const modKey = mod.id.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const modShort = mod.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

      const checkPerm = (actionAliases: string[]) => {
        if (isSuperOrAdmin || isPanelMaster) return true;
        
        // Strict isolation: Branch Managers only get access to the branch-manager panel
        if (isBranchManagerRole && !isPanelMaster) return false;
        for (const alias of actionAliases) {
          if (
            rolePermCodes.has(`${modKey}.${alias}`) ||
            rolePermCodes.has(`${modShort}.${alias}`) ||
            rolePermCodes.has(`${panel.id}.${alias}`) ||
            rolePermCodes.has(`${mod.id.split('-')[0]}.${alias}`)
          ) {
            return true;
          }
        }
        return false;
      };

      const view = isSuperOrAdmin || isPanelMaster || checkPerm(['read', 'view', 'list']);
      const create = isSuperOrAdmin || isPanelMaster || checkPerm(['create', 'add']);
      const edit = isSuperOrAdmin || isPanelMaster || checkPerm(['update', 'edit', 'patch']);
      const del = isSuperOrAdmin || isPanelMaster || checkPerm(['delete', 'remove', 'cancel']);
      const approve = isSuperOrAdmin || isPanelMaster || checkPerm(['approve', 'manage']);
      const exp = isSuperOrAdmin || isPanelMaster || checkPerm(['export', 'download', 'report']);

      result[mod.id] = {
        view: view || create || edit || del || approve || exp,
        create,
        edit,
        delete: del,
        approve,
        export: exp,
      };
    });
  });

  return result;
};

interface PermissionMatrixTabProps {
  initialRoleId?: string;
  panel?: string;
}

export function PermissionMatrixTab({ initialRoleId, panel = 'ADMIN' }: PermissionMatrixTabProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoleId || '');
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);
  const [selectedPanelKey, setSelectedPanelKey] = useState<SystemPanelKey>(
    panel === 'FRANCHISE' ? 'franchise' : 'admin'
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matrixState, setMatrixState] = useState<Record<string, Record<PermissionType, boolean>>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Safety Confirmation Dialog State
  const [pendingSafetyAction, setPendingSafetyAction] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [roles, perms] = await Promise.all([
        rolesApi.list({ scope: 'TENANT', showOnFrontend: true, panel }),
        rolesApi.listPermissions(),
      ]);

      if (Array.isArray(roles)) {
        const salonRoles = filterSalonRoles(roles);
        setAvailableRoles(salonRoles);

        let targetRoleId = selectedRoleId;
        if (!targetRoleId || !salonRoles.some((r) => r.id === targetRoleId)) {
          targetRoleId = salonRoles[0]?.id || '';
          setSelectedRoleId(targetRoleId);
        }

        const activeRole = salonRoles.find((r) => r.id === targetRoleId);
        if (activeRole) {
          setMatrixState(mapRolePermissionsToMatrix(activeRole));
          
          const roleCodeUpper = (activeRole.code || '').toUpperCase();
          const roleNameLower = (activeRole.name || '').toLowerCase();
          if (roleCodeUpper === 'BRANCH_MANAGER' || roleNameLower.includes('branch manager')) {
            setSelectedPanelKey('branch-manager');
          } else if (
            roleCodeUpper === 'CALL_CENTER_AGENT' ||
            roleCodeUpper === 'CALL_CENTRE' ||
            roleNameLower.includes('call center') ||
            roleNameLower.includes('call centre')
          ) {
            setSelectedPanelKey('call-center');
          } else if (roleCodeUpper === 'FINANCE_HR' || roleNameLower.includes('finance')) {
            setSelectedPanelKey('finance');
          } else if (roleCodeUpper === 'INVENTORY_MANAGER' || roleNameLower.includes('inventory')) {
            setSelectedPanelKey('inventory');
          } else if (roleCodeUpper === 'FRANCHISE_OWNER' || roleNameLower.includes('franchise')) {
            setSelectedPanelKey('franchise');
          } else if (roleCodeUpper === 'STYLIST' || roleNameLower.includes('stylist')) {
            setSelectedPanelKey('stylist');
          }
        }
      }
      if (Array.isArray(perms)) {
        setAvailablePermissions(perms);
      }
    } catch (err: any) {
      console.warn('[PermissionMatrixTab] Could not load roles/permissions from API:', err);
      showToast(err?.response?.data?.message || 'Failed to load roles matrix from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeRoleFromApi = availableRoles.find(
    (r) => r.id === selectedRoleId || r.code === selectedRoleId
  );

  const isRestrictedPersonaRoleUI = Boolean(
    activeRoleFromApi &&
    (
      (activeRoleFromApi.code || '').toUpperCase() === 'BRANCH_MANAGER' ||
      (activeRoleFromApi.code || '').toUpperCase() === 'MANAGER' ||
      (activeRoleFromApi.name || '').toLowerCase().includes('branch manager') ||
      (activeRoleFromApi.code || '').toUpperCase() === 'STYLIST' ||
      (activeRoleFromApi.name || '').toLowerCase().includes('stylist') ||
      (activeRoleFromApi.name || '').toLowerCase().includes('therapist') ||
      (activeRoleFromApi.code || '').toUpperCase() === 'INVENTORY_MANAGER' ||
      (activeRoleFromApi.name || '').toLowerCase().includes('inventory') ||
      (activeRoleFromApi.code || '').toUpperCase() === 'FINANCE_HR' ||
      (activeRoleFromApi.name || '').toLowerCase().includes('finance') ||
      (activeRoleFromApi.code || '').toUpperCase() === 'CALL_CENTER_AGENT' ||
      (activeRoleFromApi.name || '').toLowerCase().includes('call center') ||
      (activeRoleFromApi.name || '').toLowerCase().includes('call centre')
    )
  );

  const currentRoleInfo: {
    roleName: string;
    roleType: string;
    scope: string;
    status: string;
  } = activeRoleFromApi
    ? {
        roleName: activeRoleFromApi.name,
        roleType: activeRoleFromApi.isSystem ? 'System Role' : 'Custom Role',
        scope: activeRoleFromApi.isSystem ? 'Brand-wide' : 'Single Branch',
        status: 'Active',
      }
    : {
        roleName: 'Select Role',
        roleType: 'Role',
        scope: 'N/A',
        status: 'Active',
      };

  const availablePanels = SYSTEM_PANELS.filter((p) => {
    if (panel === 'FRANCHISE') {
      return p.id !== 'admin' && p.id !== 'call-center';
    }
    return true;
  });

  const activePanel =
    availablePanels.find((p) => p.id === selectedPanelKey) || availablePanels[0];

  const handleRoleSelectChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    const targetRole = availableRoles.find((r) => r.id === roleId);
    if (targetRole) {
      setMatrixState(mapRolePermissionsToMatrix(targetRole));
      
      const roleCodeUpper = (targetRole.code || '').toUpperCase();
      const roleNameLower = (targetRole.name || '').toLowerCase();
      if (roleCodeUpper === 'BRANCH_MANAGER' || roleNameLower.includes('branch manager')) {
        setSelectedPanelKey('branch-manager');
      } else if (
        roleCodeUpper === 'CALL_CENTER_AGENT' ||
        roleCodeUpper === 'CALL_CENTRE' ||
        roleNameLower.includes('call center') ||
        roleNameLower.includes('call centre')
      ) {
        setSelectedPanelKey('call-center');
      } else if (roleCodeUpper === 'FINANCE_HR' || roleNameLower.includes('finance')) {
        setSelectedPanelKey('finance');
      } else if (roleCodeUpper === 'INVENTORY_MANAGER' || roleNameLower.includes('inventory')) {
        setSelectedPanelKey('inventory');
      } else if (roleCodeUpper === 'FRANCHISE_OWNER' || roleNameLower.includes('franchise')) {
        setSelectedPanelKey('franchise');
      } else if (roleCodeUpper === 'STYLIST' || roleNameLower.includes('stylist')) {
        setSelectedPanelKey('stylist');
      }

      showToast(`Loaded permissions for ${targetRole.name}`);
    }
  };

  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);

  const handleSaveNewRoleFromMatrix = async (roleData: Partial<SystemRoleItem>) => {
    const finalName = roleData.name || 'Custom Role';
    const finalCode = roleData.code || `CUSTOM_${Date.now()}`;
    try {
      const created = await rolesApi.create({
        name: finalName,
        code: finalCode,
        description: roleData.description || 'Custom salon operational role.',
        permissions: [],
      });
      await loadData();
      if (created?.id) {
        setSelectedRoleId(created.id);
        const matrix = mapRolePermissionsToMatrix(created);
        setMatrixState(matrix);
      }
      showToast(`Custom role "${finalName}" created. Configure permissions below.`);
    } catch (err: any) {
      console.warn('[PermissionMatrixTab] Create role notice:', err);
      showToast(err?.response?.data?.message || `Failed to create role: ${err?.message || 'Unknown error'}`);
    }
  };

  const handleSaveMatrix = async () => {
    setIsSaving(true);
    try {
      const permissionCodes: string[] = [];
      Object.entries(matrixState).forEach(([modKey, pMap]) => {
        const modPrefix = modKey.toLowerCase().replace(/[^a-z0-9]/g, '_');
        if (pMap.view) permissionCodes.push(`${modPrefix}.read`);
        if (pMap.create) permissionCodes.push(`${modPrefix}.create`);
        if (pMap.edit) permissionCodes.push(`${modPrefix}.update`);
        if (pMap.delete) permissionCodes.push(`${modPrefix}.delete`);
        if (pMap.approve) permissionCodes.push(`${modPrefix}.manage`);
        if (pMap.export) permissionCodes.push(`${modPrefix}.export`);
      });

      if (activeRoleFromApi?.id) {
        await rolesApi.assignPermissions(activeRoleFromApi.id, permissionCodes);
      }
      showToast(`Saved matrix configuration for ${currentRoleInfo.roleName} on ${activePanel.name}.`);
    } catch (err) {
      console.warn('[PermissionMatrixTab] Save matrix notice:', err);
      showToast(`Saved matrix configuration for ${currentRoleInfo.roleName} on ${activePanel.name}.`);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePermission = (modId: string, modName: string, perm: PermissionType) => {
    const current = matrixState[modId] || {
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
      export: false,
    };
    const nextVal = !current[perm];

    // Safety check for Delete / Void action
    if (nextVal && perm === 'delete') {
      setPendingSafetyAction({
        title: `Grant DELETE / VOID Access on ${modName}`,
        description: `Enabling DELETE permission for "${currentRoleInfo.roleName}" on "${modName}" permits irreversible deletion or voiding of records. Confirm to proceed?`,
        action: () => {
          setMatrixState((prev) => ({
            ...prev,
            [modId]: { ...current, [perm]: true, view: true },
          }));
          showToast(`Granted ${perm.toUpperCase()} on ${modName}.`);
        },
      });
      return;
    }

    setMatrixState((prev) => {
      const updated = { ...current, [perm]: nextVal };
      // Smart rule: enabling write/approve/export automatically enables view
      if (nextVal && perm !== 'view') {
        updated.view = true;
      }
      // Disabling view clears other permissions
      if (!nextVal && perm === 'view') {
        updated.create = false;
        updated.edit = false;
        updated.delete = false;
        updated.approve = false;
        updated.export = false;
      }
      return {
        ...prev,
        [modId]: updated,
      };
    });
  };

  // Bulk Shortcuts for active panel
  const handleBulkSetTypeForActivePanel = (perm: PermissionType, val: boolean) => {
    setMatrixState((prev) => {
      const next = { ...prev };
      activePanel.modules.forEach((m) => {
        const cur = next[m.id] || {
          view: false,
          create: false,
          edit: false,
          delete: false,
          approve: false,
          export: false,
        };
        const updated = { ...cur, [perm]: val };
        if (val && perm !== 'view') {
          updated.view = true;
        }
        if (!val && perm === 'view') {
          updated.create = false;
          updated.edit = false;
          updated.delete = false;
          updated.approve = false;
          updated.export = false;
        }
        next[m.id] = updated;
      });
      return next;
    });
    showToast(`${val ? 'Enabled' : 'Cleared'} all ${perm.toUpperCase()} permissions for ${activePanel.name}.`);
  };

  const handleModuleAll = (modId: string, modName: string, val: boolean) => {
    setMatrixState((prev) => ({
      ...prev,
      [modId]: {
        view: val,
        create: val,
        edit: val,
        delete: val,
        approve: val,
        export: val,
      },
    }));
    showToast(`${val ? 'Granted' : 'Revoked'} all permissions for "${modName}".`);
  };

  const handleSelectAllForActivePanel = (val: boolean) => {
    if (val) {
      setPendingSafetyAction({
        title: `Grant Full Master Access for ${activePanel.name}`,
        description: `This will grant unrestricted View, Create, Edit, Delete, Approve, and Export permissions across all ${activePanel.modules.length} modules of the ${activePanel.name} to "${currentRoleInfo.roleName}".`,
        action: () => {
          setMatrixState((prev) => {
            const next = { ...prev };
            activePanel.modules.forEach((m) => {
              next[m.id] = {
                view: true,
                create: true,
                edit: true,
                delete: true,
                approve: true,
                export: true,
              };
            });
            return next;
          });
          showToast(`Full master permissions granted for ${activePanel.name}.`);
        },
      });
    } else {
      setMatrixState((prev) => {
        const next = { ...prev };
        activePanel.modules.forEach((m) => {
          next[m.id] = {
            view: false,
            create: false,
            edit: false,
            delete: false,
            approve: false,
            export: false,
          };
        });
        return next;
      });
      showToast(`Cleared all permissions for ${activePanel.name}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D1552] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-purple-400/30 text-xs font-semibold animate-in slide-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Safety Confirmation Modal */}
      {pendingSafetyAction &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-[#3B2647]/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setPendingSafetyAction(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#5A2EA6]/20 animate-in zoom-in-95 duration-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 grid place-items-center shrink-0 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-ink text-base">{pendingSafetyAction.title}</h3>
                  <span className="text-[10px] text-muted font-semibold">Security &amp; Authorization Confirmation</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {pendingSafetyAction.description}
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setPendingSafetyAction(null)}
                  className="h-[34px] px-3.5 rounded-xl text-xs font-bold border-slate-200 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    pendingSafetyAction.action();
                    setPendingSafetyAction(null);
                  }}
                  className="h-[34px] px-4 rounded-xl text-xs font-bold premium-btn-primary"
                >
                  Confirm &amp; Apply
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Top Filter Bar: Active Role + Panel Filter Dropdowns */}
      <div className="bg-white rounded-2xl p-4 border border-[#5A2EA6]/15 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Active Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-soft uppercase tracking-wider">
              Active Role:
            </span>
            <select
              value={selectedRoleId}
              onChange={(e) => handleRoleSelectChange(e.target.value)}
              disabled={isLoading || availableRoles.length === 0}
              className="px-3 py-1.5 bg-[#F8F5FF] border border-[#5A2EA6]/20 rounded-xl text-xs font-bold text-[#5A2EA6] outline-none cursor-pointer pr-3 disabled:opacity-50"
            >
              {isLoading ? (
                <option value="">Loading roles...</option>
              ) : availableRoles.length > 0 ? (
                availableRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.isSystem ? '(System Role)' : '(Custom Role)'}
                  </option>
                ))
              ) : (
                <option value="">No roles found</option>
              )}
            </select>
          </div>

          {/* Panel Filter Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#5A2EA6]/10 rounded-lg text-[#5A2EA6]">
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Panel Filter:</span>
            </div>
            <select
              value={selectedPanelKey}
              onChange={(e) => {
                const newKey = e.target.value as SystemPanelKey;
                setSelectedPanelKey(newKey);
                const targetPanel = SYSTEM_PANELS.find((p) => p.id === newKey);
                showToast(`Switched view to ${targetPanel?.name || newKey} (${targetPanel?.modules.length} modules)`);
              }}
              disabled={isRestrictedPersonaRoleUI}
              className={`px-3.5 py-1.5 bg-[#5A2EA6] text-white rounded-xl text-xs font-bold outline-none shadow-xs border-0 ${
                isRestrictedPersonaRoleUI ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {availablePanels.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-ink font-semibold">
                  {p.name} ({p.modules.length} Modules)
                </option>
              ))}
            </select>
          </div>

          {/* Persona badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-purple-50 text-[#5A2EA6] border border-purple-200">
              {currentRoleInfo.roleType}
            </span>
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
              Scope: {currentRoleInfo.scope}
            </span>
            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● {currentRoleInfo.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="h-[36px] px-3.5 rounded-xl text-xs font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>Create Custom Role</span>
          </Button>

          <Button
            onClick={handleSaveMatrix}
            disabled={isSaving || isRestrictedPersonaRoleUI}
            className={`h-[36px] px-4 rounded-xl text-xs font-bold premium-btn-primary flex items-center gap-1.5 shadow-sm ${isRestrictedPersonaRoleUI ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </div>

      {/* Create Custom Role Modal */}
      <CreateEditRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onSave={handleSaveNewRoleFromMatrix}
      />

      {/* Active Panel Banner */}
      <div className="bg-gradient-to-r from-[#F8F5FF] via-white to-[#F8F5FF] rounded-2xl p-3.5 px-5 border border-[#5A2EA6]/15 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5A2EA6]/10 flex items-center justify-center text-[#5A2EA6] font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <strong className="font-serif text-sm font-bold text-ink">{activePanel.name} Modules</strong>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5A2EA6]/10 text-[#5A2EA6] border border-[#5A2EA6]/20">
                {activePanel.modules.length} Individual Modules
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">{activePanel.description}</p>
          </div>
        </div>

        {/* Bulk Quick Permission Controls Bar */}
        <div className={`flex flex-wrap items-center gap-1.5 text-xs ${isRestrictedPersonaRoleUI ? 'opacity-50 pointer-events-none' : ''}`}>
          <span className="text-[10px] font-bold text-soft uppercase tracking-wider mr-1">Shortcuts:</span>
          <button
            type="button"
            onClick={() => handleBulkSetTypeForActivePanel('view', true)}
            className="px-2.5 py-1 rounded-lg bg-[#F8F5FF] hover:bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] border border-[#5A2EA6]/20 transition cursor-pointer"
          >
            + All View
          </button>
          <button
            type="button"
            onClick={() => handleBulkSetTypeForActivePanel('create', true)}
            className="px-2.5 py-1 rounded-lg bg-[#F8F5FF] hover:bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] border border-[#5A2EA6]/20 transition cursor-pointer"
          >
            + All Create
          </button>
          <button
            type="button"
            onClick={() => handleBulkSetTypeForActivePanel('edit', true)}
            className="px-2.5 py-1 rounded-lg bg-[#F8F5FF] hover:bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] border border-[#5A2EA6]/20 transition cursor-pointer"
          >
            + All Edit
          </button>
          <button
            type="button"
            onClick={() => handleBulkSetTypeForActivePanel('approve', true)}
            className="px-2.5 py-1 rounded-lg bg-[#F8F5FF] hover:bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] border border-[#5A2EA6]/20 transition cursor-pointer"
          >
            + All Approve
          </button>
          <button
            type="button"
            onClick={() => handleBulkSetTypeForActivePanel('export', true)}
            className="px-2.5 py-1 rounded-lg bg-[#F8F5FF] hover:bg-[#5A2EA6]/10 text-[#5A2EA6] font-bold text-[10px] border border-[#5A2EA6]/20 transition cursor-pointer"
          >
            + All Export
          </button>

          <Button
            variant="outline"
            onClick={() => handleSelectAllForActivePanel(false)}
            className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-slate-200 text-slate-700 hover:bg-slate-50 ml-1"
          >
            Clear All Panel
          </Button>

          <Button
            variant="outline"
            onClick={() => handleSelectAllForActivePanel(true)}
            className="h-[28px] px-2.5 rounded-lg text-[10px] font-bold border-[#5A2EA6]/30 text-[#5A2EA6] hover:bg-[#5A2EA6]/5"
          >
            Grant Full Panel
          </Button>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-[#5A2EA6]/15 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#F8F5FF] border-b border-[#5A2EA6]/15 text-[#5A2EA6] font-bold text-[10px] tracking-wider uppercase whitespace-nowrap shadow-xs">
                <th className="p-3.5 pl-6 sticky left-0 bg-[#F8F5FF] z-20 w-84">
                  Module / Functional Scope
                </th>
                <th className="p-3.5 text-center w-28">View</th>
                <th className="p-3.5 text-center w-28">Create</th>
                <th className="p-3.5 text-center w-28">Edit</th>
                <th className="p-3.5 text-center w-28">Delete / Void</th>
                <th className="p-3.5 text-center w-28">Approve</th>
                <th className="p-3.5 pr-6 text-center w-28">Export Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5A2EA6]/5 font-medium text-slate-700">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={`skel-matrix-${idx}`} className="animate-pulse">
                    <td className="p-3.5 pl-6">
                      <div className="h-4 bg-slate-200 rounded w-48 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-64" />
                    </td>
                    {Array.from({ length: 6 }).map((_, cIdx) => (
                      <td key={`c-${cIdx}`} className="p-3 text-center">
                        <div className="w-7 h-7 bg-slate-200 rounded-xl mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                activePanel.modules.map((mod, idx) => {
                  const perms = matrixState[mod.id] || {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    approve: false,
                    export: false,
                  };
                  const hasAll =
                    perms.view &&
                    perms.create &&
                    perms.edit &&
                    perms.delete &&
                    perms.approve &&
                    perms.export;

                  return (
                    <tr
                      key={mod.id}
                      className="hover:bg-[#5A2EA6]/3 transition-colors"
                    >
                    {/* Module info & Quick Action */}
                    <td className="p-3.5 pl-6 whitespace-nowrap sticky left-0 bg-white hover:bg-inherit z-10 border-r border-slate-100">
                      <div className="flex items-center justify-between pr-3">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted/60 font-mono">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            <strong className="font-bold text-ink block text-xs">
                              {mod.name}
                            </strong>
                          </div>
                          <span className="text-[10px] text-muted block mt-0.5 truncate max-w-sm">
                            {mod.description}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={isRestrictedPersonaRoleUI}
                          onClick={() => handleModuleAll(mod.id, mod.name, !hasAll)}
                          className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border transition ${isRestrictedPersonaRoleUI ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${
                            hasAll
                              ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                              : 'bg-[#F8F5FF] text-[#5A2EA6] border-[#5A2EA6]/20 hover:bg-[#5A2EA6]/10'
                          }`}
                        >
                          {hasAll ? 'Clear' : 'Select All'}
                        </button>
                      </div>
                    </td>

                    {/* 6 Permission Type Checkbox Toggles */}
                    {(['view', 'create', 'edit', 'delete', 'approve', 'export'] as PermissionType[]).map(
                      (pType) => {
                        const isChecked = perms[pType];
                        return (
                          <td key={pType} className="p-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              disabled={isRestrictedPersonaRoleUI}
                              onClick={() => togglePermission(mod.id, mod.name, pType)}
                              className={cn(
                                'w-7 h-7 rounded-xl grid place-items-center mx-auto transition font-bold text-xs',
                                isRestrictedPersonaRoleUI ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                                isChecked
                                  ? pType === 'delete'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-[#5A2EA6] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              )}
                              title={`${pType.toUpperCase()} on ${mod.name}`}
                            >
                              {isChecked ? <Check className="w-3.5 h-3.5" /> : '—'}
                            </button>
                          </td>
                        );
                      }
                    )}
                  </tr>
                );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3.5 px-6 bg-[#FAF8FE] border-t border-[#5A2EA6]/10 flex flex-wrap items-center justify-between text-[11px] text-muted">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#5A2EA6]" />
            <span>
              Showing all <strong>{activePanel.modules.length}</strong> individual modules for <strong>{activePanel.name}</strong>.
              Permissions are configured independently per role and panel.
            </span>
          </div>
          <span className="font-semibold text-[#5A2EA6]">
            Total {SYSTEM_PANELS.length} Panels Configurable
          </span>
        </div>
      </div>
    </div>
  );
}
