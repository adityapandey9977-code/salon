import { ChevronLeft, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Div, H1, H2, Input, P, Span } from '../components/primitives';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    if (!emailOrPhone.trim()) {
      showToast('Please enter your phone number or email address.', 'error');
      return;
    }
    if (!password) {
      showToast('Please enter your password.', 'error');
      return;
    }

    showToast('Signed in successfully! Welcome back.', 'success');
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
            Sign In
          </H1>
          <Div className="w-12" />
        </Div>

        {/* Hero Branding Header */}
        <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs flex flex-col items-center text-center space-y-3">
          <Div className="w-20 h-20 rounded-full bg-[#7C3AED] flex flex-row items-center justify-center shadow-md border-4 border-white">
            <Sparkles size={36} color="#ffffff" fill="#ffffff" />
          </Div>
          <Div className="space-y-1 flex flex-col items-center">
            <H2 className="text-2xl font-black text-gray-900 text-center">Welcome Back! 👋</H2>
            <P className="text-xs font-medium text-gray-500 max-w-xs leading-relaxed text-center">
              Sign in to manage your appointment bookings, wallet balance & 11,250 loyalty points.
            </P>
          </Div>
        </Div>

        {/* Login Form Fields Card */}
        <Div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs space-y-4">
          {/* Email or Phone Input */}
          <Div className="space-y-1.5">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              PHONE OR EMAIL ADDRESS
            </Span>
            <Div className="relative justify-center">
              <Div className="absolute left-3.5 top-0 bottom-0 flex flex-row items-center justify-center z-10">
                <Mail size={18} color="#7c3aed" />
              </Div>
              <Input
                type="text"
                placeholder="e.g. aditya.pandey@example.com or +91..."
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
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
                placeholder="Enter password"
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

          {/* Forgot Password Link */}
          <Div className="flex flex-row justify-end pt-0.5">
            <Button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900"
            >
              <Span className="text-purple-700 font-bold text-xs">Forgot Password?</Span>
            </Button>
          </Div>
        </Div>

        {/* Footer Prompt */}
        <Div className="flex flex-row items-center justify-center gap-1.5 pt-2">
          <Span className="text-xs text-gray-500 font-medium">Don't have an account?</Span>
          <Button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-xs font-black text-purple-700 underline"
          >
            <Span className="text-purple-700 font-black text-xs">Create Account</Span>
          </Button>
        </Div>
      </Div>

      {/* Sticky Bottom Flush CTA Button */}
      <Div className="absolute bottom-0 left-0 right-0 p-4 px-5 pb-6 bg-white/95 backdrop-blur-md border-t border-purple-100 z-50">
        <Button
          type="button"
          onClick={handleLogin}
          className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-sm text-center flex flex-row items-center justify-center"
        >
          <Span className="text-white font-extrabold text-sm text-center w-full">Sign In</Span>
        </Button>
      </Div>
    </Div>
  );
};
