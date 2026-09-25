import {
  Check,
  ChevronLeft,
  Crown,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, Input, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const SignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserProfile, showToast } = useApp();

  const [fullName, setFullName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const handleSignup = () => {
    if (!fullName.trim()) {
      showToast('Please enter your full name.', 'error');
      return;
    }
    if (!phoneNumber.trim()) {
      showToast('Please enter your phone number.', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    updateUserProfile({
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      email: emailAddress.trim() || 'user@example.com',
    });

    showToast('Account created! 500 Bonus Loyalty Points added.', 'success');
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <Div style={{ flex: 1, position: 'relative', height: '100%' }}>
      {/* Scrollable Form Content */}
      <Div className="p-4 px-5 space-y-6 pb-28">
        {/* Header with Clean Spacing */}
        <Div className="flex flex-row items-center justify-between pt-2 pb-1">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
          >
            <ChevronLeft size={24} color="#374151" />
          </Button>
          <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">
            Sign Up
          </H1>
          <Div className="w-12" />
        </Div>

        {/* Hero Branding Header */}
        <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs flex flex-col items-center text-center space-y-3">
          <Div className="w-20 h-20 rounded-full bg-amber-100 flex flex-row items-center justify-center shadow-md border-4 border-amber-300">
            <Crown size={36} color="#d97706" fill="#d97706" />
          </Div>
          <Div className="space-y-1 flex flex-col items-center">
            <H2 className="text-2xl font-black text-gray-900 text-center">
              Create Free Account ✨
            </H2>
            <P className="text-xs font-medium text-gray-500 max-w-xs leading-relaxed text-center">
              Join   Salon SaaS and instantly unlock 500 bonus loyalty points & Gold tier
              perks!
            </P>
          </Div>
        </Div>

        {/* Signup Form Fields Card */}
        <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-4">
          {/* Full Name */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              FULL NAME
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <User size={18} color="#7c3aed" />
              </Div>
              <Input
                type="text"
                placeholder="e.g. Aditya Pandey"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>
          </Div>

          {/* Phone Number */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              PHONE NUMBER
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <Phone size={18} color="#7c3aed" />
              </Div>
              <Input
                type="text"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>
          </Div>

          {/* Email Address */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              EMAIL ADDRESS (OPTIONAL)
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <Mail size={18} color="#7c3aed" />
              </Div>
              <Input
                type="text"
                placeholder="aditya.pandey@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>
          </Div>

          {/* Password Input */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              PASSWORD
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <Lock size={18} color="#7c3aed" />
              </Div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl pl-12 pr-12 py-3.5 text-xs text-gray-900 font-bold"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10"
              >
                {showPassword ? (
                  <EyeOff size={18} color="#9ca3af" />
                ) : (
                  <Eye size={18} color="#7c3aed" />
                )}
              </Button>
            </Div>
          </Div>

          {/* Confirm Password Input */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              CONFIRM PASSWORD
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <ShieldCheck size={18} color="#7c3aed" />
              </Div>
              <Input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
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

        {/* Footer Prompt */}
        <Div className="flex flex-row items-center justify-center gap-1.5 pt-2">
          <Span className="text-xs text-gray-500 font-medium">Already have an account?</Span>
          <Button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs font-black text-purple-700 underline"
          >
            <Span className="text-purple-700 font-black text-xs">Sign In</Span>
          </Button>
        </Div>
      </Div>

      {/* Sticky Bottom Flush CTA Button */}
      <Div className="absolute bottom-0 left-0 right-0 p-4 px-5 pb-6 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleSignup}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">
            Create Free Account
          </Span>
        </Button>
      </Div>
    </Div>
  );
};
