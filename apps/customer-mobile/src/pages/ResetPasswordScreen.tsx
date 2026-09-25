import { Check, ChevronLeft, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, Input, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const ResetPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Security Criteria Checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isMatching = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    currentPassword.length > 0 && hasMinLength && hasUpperAndLower && hasNumber && isMatching;

  const handleUpdatePassword = () => {
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (!isFormValid) {
      showToast('Please fulfill all security criteria before updating.', 'error');
      return;
    }

    showToast('Password updated successfully! Please login with your new password.', 'success');
    setTimeout(() => {
      navigate('/profile');
    }, 1000);
  };

  return (
    <Div style={{ flex: 1, position: 'relative', height: '100%' }}>
      {/* Scrollable Form Content Container */}
      <Div className="p-4 px-5 space-y-6 pb-28">
        {/* Header with Clean Spacing */}
        <Div className="flex flex-row items-center justify-between pt-2 pb-1">
          <Button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
          >
            <ChevronLeft size={24} color="#374151" />
          </Button>
          <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">
            Reset Password
          </H1>
          <Div className="w-12" />
        </Div>

        {/* Hero Security Graphic & Instructions */}
        <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs flex flex-col items-center text-center space-y-3">
          <Div className="w-20 h-20 rounded-full bg-purple-100 flex flex-row items-center justify-center border-2 border-purple-200 shadow-xs">
            <Lock size={36} color="#7c3aed" />
          </Div>
          <Div className="space-y-1 flex flex-col items-center">
            <H2 className="text-base font-extrabold text-gray-900 text-center">
              Update Account Password
            </H2>
            <P className="text-xs font-medium text-gray-500 max-w-xs leading-relaxed text-center">
              Ensure your   Salon account is protected with a strong, secure password.
            </P>
          </Div>
        </Div>

        {/* Password Form Card */}
        <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-4">
          {/* Current Password */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              CURRENT PASSWORD
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <KeyRound size={18} color="#7c3aed" />
              </Div>
              <Input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-12 py-3.5 text-xs text-gray-900 font-bold"
              />
              <Button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10"
              >
                {showCurrent ? (
                  <EyeOff size={18} color="#9ca3af" />
                ) : (
                  <Eye size={18} color="#7c3aed" />
                )}
              </Button>
            </Div>
          </Div>

          {/* New Password */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              NEW PASSWORD
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <Lock size={18} color="#7c3aed" />
              </Div>
              <Input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-12 py-3.5 text-xs text-gray-900 font-bold"
              />
              <Button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10"
              >
                {showNew ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#7c3aed" />}
              </Button>
            </Div>
          </Div>

          {/* Confirm New Password */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              CONFIRM NEW PASSWORD
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <ShieldCheck size={18} color="#7c3aed" />
              </Div>
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-12 py-3.5 text-xs text-gray-900 font-bold"
              />
              <Button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10"
              >
                {showConfirm ? (
                  <EyeOff size={18} color="#9ca3af" />
                ) : (
                  <Eye size={18} color="#7c3aed" />
                )}
              </Button>
            </Div>
          </Div>
        </Div>

        {/* Password Security Criteria Checklist */}
        <Div className="bg-purple-50/70 border border-purple-200 rounded-3xl p-5 space-y-2.5">
          <Span className="text-xs font-extrabold text-purple-900 block">
            PASSWORD SECURITY CRITERIA
          </Span>
          <Div className="space-y-2">
            {[
              { label: 'At least 8 characters long', valid: hasMinLength },
              { label: 'Uppercase & lowercase letters', valid: hasUpperAndLower },
              { label: 'At least one number (0-9)', valid: hasNumber },
              { label: 'Passwords match', valid: isMatching },
            ].map(({ label, valid }) => (
              <Div key={label} className="flex flex-row items-center gap-2">
                <Div
                  className={`w-4 h-4 rounded-full flex flex-row items-center justify-center ${valid ? 'bg-emerald-600' : 'bg-purple-200'
                    }`}
                >
                  <Check size={10} color="#ffffff" />
                </Div>
                <Span
                  className={`text-xs font-bold ${valid ? 'text-emerald-800' : 'text-purple-700/80'
                    }`}
                >
                  {label}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
      </Div>

      {/* Flush Bottom Sticky CTA Pinned to Viewport Bottom */}
      <Div className="absolute bottom-0 left-0 right-0 p-4 px-5 pb-6 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleUpdatePassword}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">
            Update Password
          </Span>
        </Button>
      </Div>
    </Div>
  );
};
