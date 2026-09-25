import { Avatar, Button, Input, Modal, useToast } from '@salon-spa-saas/ui';
import { Building, Check, Clock, KeyRound, Mail, Phone, Shield, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useBranch } from '../../context/BranchContext';

interface BranchManagerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BranchManagerProfileModal({ isOpen, onClose }: BranchManagerProfileModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { assignedBranch, currentStaff } = useBranch();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branchRole, setBranchRole] = useState('');
  const [shiftHours, setShiftHours] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(user?.fullName || currentStaff?.fullName || 'Branch Manager');
      setEmail(user?.email || (currentStaff as any)?.email || 'manager@salon.com');
      setPhone(currentStaff?.mobile || assignedBranch?.phone || '+91 98765 43210');
      setBranchRole(`${user?.role || 'Branch Manager'} · Operations Lead`);
      setShiftHours(assignedBranch?.workingHours ? `Full Day (${assignedBranch.workingHours})` : 'General Shift (09:00 AM - 09:00 PM)');
    }
  }, [isOpen, user, currentStaff, assignedBranch]);

  // Password Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast('Branch Manager profile updated successfully.');
      onClose();
    }, 400);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast('Please enter current and new passwords.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('New passwords do not match.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast('Security credentials & PIN updated successfully.');
      onClose();
    }, 400);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header
        title="Branch Manager Profile & Security"
        subtitle="Manage your front-desk credentials, contact details, and shift preferences."
      />

      <div className="px-6 pt-2 pb-0 border-b border-line/50 flex gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'profile' ? 'text-[#5A2EA6]' : 'text-muted hover:text-ink'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </div>
          {activeTab === 'profile' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A2EA6] rounded-full" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`pb-2.5 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'security' ? 'text-[#5A2EA6]' : 'text-muted hover:text-ink'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Cashier PIN</span>
          </div>
          {activeTab === 'security' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A2EA6] rounded-full" />
          )}
        </button>
      </div>

      <Modal.Body className="p-6">
        {activeTab === 'profile' ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 bg-[#5A2EA6]/5 rounded-2xl border border-[#5A2EA6]/15">
              <Avatar
                initials={
                  name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'BM'
                }
                className="w-12 h-12 rounded-full bg-[#5A2EA6] text-white font-bold text-base shadow-xs"
              />
              <div className="space-y-0.5 min-w-0">
                <strong className="block text-sm font-bold text-ink truncate">{name}</strong>
                <span className="text-[11px] text-[#5A2EA6] font-semibold block truncate">
                  {branchRole}
                </span>
                <span className="text-[10.5px] text-muted flex items-center gap-1 font-medium">
                  <Building className="w-3 h-3 text-[#5A2EA6]" /> {assignedBranch?.name || 'Assigned Branch'} ({assignedBranch?.code || 'BRANCH'}) · {assignedBranch?.city || 'Local'}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Manager full name"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Work Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ateliersalon.com"
                  required
                />
                <Input
                  label="Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Assigned Role"
                  value={branchRole}
                  onChange={(e) => setBranchRole(e.target.value)}
                  disabled
                  helperText="Configured by Brand Owner HQ"
                />
                <Input
                  label="Active Shift Schedule"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(e.target.value)}
                  disabled
                  helperText="Shift #01 Active"
                />
              </div>
            </div>

            <Modal.Footer className="px-0 pt-4 pb-0 bg-transparent border-0">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </Modal.Footer>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-1">
              <strong className="block font-bold">Cashier & POS Security Policy</strong>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Your credentials are required to authorize discounts, perform cashier drawer
                closures, and approve refund overrides.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <Modal.Footer className="px-0 pt-4 pb-0 bg-transparent border-0">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Update Credentials'}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default BranchManagerProfileModal;
