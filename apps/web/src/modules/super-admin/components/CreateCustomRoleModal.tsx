import { Button } from '@salon-spa-saas/ui';
import { Check, Layers, Lock, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { type RoleScope, useSuperAdminStore, getDefaultModulePermissions, type ModuleCrudPermission, isSystemProtectedRole } from '../context/SuperAdminContext';
import { BaseModal } from './BaseModal';

interface CreateCustomRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRole?: RoleScope | null;
}

export const CreateCustomRoleModal: React.FC<CreateCustomRoleModalProps> = ({
  isOpen,
  onClose,
  editRole,
}) => {
  const { addCustomRole, updateCustomRole } = useSuperAdminStore();
  const [formData, setFormData] = useState({
    role: editRole?.role || '',
    description: editRole?.description || '',
    scope: editRole?.scope || 'Platform Wide',
    permissions: editRole?.permissions || {
      tenants: true,
      billing: false,
      auditLogs: false,
      featureFlags: false,
      usersRbac: false,
    },
  });

  useEffect(() => {
    if (editRole) {
      setFormData({
        role: editRole.role,
        description: editRole.description,
        scope: editRole.scope,
        permissions: editRole.permissions,
      });
    } else {
      setFormData({
        role: '',
        description: '',
        scope: 'Platform Wide',
        permissions: {
          tenants: true,
          billing: false,
          auditLogs: false,
          featureFlags: false,
          usersRbac: false,
        },
      });
    }
  }, [editRole, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) return;

    if (editRole && isSystemProtectedRole(editRole)) {
      onClose();
      return;
    }

    const modPerms: Record<string, ModuleCrudPermission> = getDefaultModulePermissions('none');
    if (formData.permissions.tenants) {
      modPerms.tenants = { view: true, edit: true, update: true, delete: false };
      modPerms.supportTickets = { view: true, edit: true, update: true, delete: false };
      modPerms.announcements = { view: true, edit: false, update: false, delete: false };
      modPerms.notifications = { view: true, edit: false, update: false, delete: false };
    }
    if (formData.permissions.billing) {
      modPerms.billingPayments = { view: true, edit: true, update: true, delete: true };
      modPerms.subscriptionPlans = { view: true, edit: true, update: true, delete: false };
    }
    if (formData.permissions.auditLogs) {
      modPerms.auditLogs = { view: true, edit: false, update: false, delete: false };
    }
    if (formData.permissions.featureFlags) {
      modPerms.featureFlags = { view: true, edit: true, update: true, delete: false };
    }
    if (formData.permissions.usersRbac) {
      modPerms.users = { view: true, edit: true, update: true, delete: false };
      modPerms.rolesPermissions = { view: true, edit: true, update: true, delete: false };
    }

    const payload = {
      ...formData,
      modulePermissions: editRole?.modulePermissions || modPerms,
    };

    if (editRole) {
      updateCustomRole(editRole.id, payload);
    } else {
      addCustomRole(payload);
    }

    onClose();
  };

  const handlePermissionToggle = (key: keyof typeof formData.permissions) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key],
      },
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editRole ? `Edit Role Scope: ${editRole.role}` : 'Create Custom Role Scope'}
      subtitle="Define role name, scope area boundaries & system module access permissions"
      icon={<ShieldCheck className="w-5 h-5" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
              Role Group Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Regional Support Manager, Platform Security Specialist"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full h-[40px] px-3.5 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-1.5">
            Role Description & Scope Explanation *
          </label>
          <textarea
            rows={2}
            required
            placeholder="Describe what operators in this role group can view and manage..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 rounded-xl border border-[#5A2EA6]/20 bg-[#FCFAFF] text-xs font-medium text-ink focus:outline-none focus:border-[#5A2EA6]"
          />
        </div>

        {/* Permission Checkboxes Grid */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-soft mb-2">
            Module Access Entitlements
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'tenants', label: 'Tenants & Salons Registry Access' },
              { key: 'billing', label: 'Billing, Payments & Invoices Access' },
              { key: 'auditLogs', label: 'System Audit Logs & Security Traces' },
              { key: 'featureFlags', label: 'Feature Flags & System Integrations' },
              { key: 'usersRbac', label: 'User & RBAC Permissions Management' },
            ].map((perm) => {
              const isChecked = formData.permissions[perm.key as keyof typeof formData.permissions];
              return (
                <div
                  key={perm.key}
                  onClick={() => handlePermissionToggle(perm.key as any)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isChecked
                      ? 'border-[#5A2EA6] bg-[#F8F5FF]'
                      : 'border-[#5A2EA6]/15 bg-white hover:border-[#5A2EA6]/30'
                  }`}
                >
                  <span className="text-xs font-medium text-ink">{perm.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#5A2EA6] cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#5A2EA6]/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-[38px] px-4 rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-[38px] px-5 rounded-xl text-xs font-semibold premium-btn-primary"
          >
            {editRole ? 'Save Scope Changes' : 'Create Custom Role'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
