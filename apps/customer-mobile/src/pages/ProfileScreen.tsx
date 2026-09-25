import {
  AlertTriangle,
  Bell,
  Camera,
  ChevronLeft,
  ChevronRight,
  Lock,
  LogOut,
  MapPin,
  MessageSquare,
  User,
  Users,
  X,
} from 'lucide-react-native';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Button,
  Div,
  H1,
  H2,
  H3,
  H4,
  Img,
  Input,
  ModalOverlay,
  P,
  Span,
} from '../components/primitives';
import { useApp } from '../context/AppContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
];

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    householdMembers,
    toggleConsent,
    updateUserAllergies,
    updateUserProfile,
    showToast,
  } = useApp();

  const [showEditProfileModal, setShowEditProfileModal] = useState<boolean>(false);
  const [showAllergyModal, setShowAllergyModal] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [showHouseholdModal, setShowHouseholdModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // Edit Profile Form State
  const [nameInput, setNameInput] = useState<string>(user.name);
  const [phoneInput, setPhoneInput] = useState<string>(user.phone || '+91 98765 43210');
  const [emailInput, setEmailInput] = useState<string>(user.email || 'aditya.pandey@digiflex.com');
  const [addressInput, setAddressInput] = useState<string>(user.savedAddress);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);
  const [allergyInput, setAllergyInput] = useState<string>(user.allergies.join(', '));

  const menuItems = [
    {
      label: 'Personal Information',
      icon: User,
      action: () => setShowEditProfileModal(true),
    },
    {
      label: 'Health & Allergy Profile',
      icon: AlertTriangle,
      action: () => setShowAllergyModal(true),
    },
    {
      label: 'Household Beauty Members',
      icon: Users,
      action: () => setShowHouseholdModal(true),
    },
    {
      label: 'Communication Consent',
      icon: MessageSquare,
      action: () => setShowConsentModal(true),
    },
    {
      label: 'Saved Delivery Addresses',
      icon: MapPin,
      action: () => setShowEditProfileModal(true),
    },
    {
      label: 'Notification Settings',
      icon: Bell,
      action: () => showToast('Push notifications enabled', 'info'),
    },
    {
      label: 'Reset Security Password',
      icon: Lock,
      action: () => navigate('/reset-password'),
    },
    {
      label: 'Logout',
      icon: LogOut,
      danger: true,
      action: () => setShowLogoutModal(true),
    },
  ];

  const handleSaveProfile = () => {
    updateUserProfile({
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
      savedAddress: addressInput,
      avatar: selectedAvatar,
    });
    setShowEditProfileModal(false);
  };

  const handleSaveAllergies = () => {
    const list = allergyInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    updateUserAllergies(list);
    setShowAllergyModal(false);
  };

  return (
    <Div className="p-4 px-5 space-y-6 pb-28">
      {/* Header with Clean Spacing */}
      <Div className="flex flex-row items-center justify-between pt-2 pb-1">
        <Button
          type="button"
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-white border border-purple-100 flex flex-row items-center justify-center text-gray-700 shadow-xs flex-shrink-0"
        >
          <ChevronLeft size={24} color="#374151" />
        </Button>
        <H1 className="text-xl font-extrabold text-gray-900 tracking-tight text-center">Profile</H1>
        <Div className="w-12" />
      </Div>

      {/* User Profile Card with Avatar Edit Camera Overlay Badge */}
      <Div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-xs flex flex-col items-center text-center space-y-3">
        <Button
          type="button"
          onClick={() => setShowEditProfileModal(true)}
          className="relative cursor-pointer self-center"
        >
          <Div className="w-22 h-22 rounded-full p-1 bg-[#7C3AED] flex flex-row items-center justify-center shadow-md relative">
            <Img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white"
            />
            <Div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-[#7C3AED] flex flex-row items-center justify-center shadow-sm">
              <Camera size={14} color="#7c3aed" />
            </Div>
          </Div>
        </Button>

        <Div className="space-y-1 flex flex-col items-center">
          <H2 className="text-lg font-black text-gray-900 text-center">{user.name}</H2>
          <Span className="text-xs font-bold text-amber-900 bg-amber-100 px-4 py-1.5 rounded-full border border-amber-300 inline-block text-center mt-1">
            👑 {user.tier}
          </Span>
        </Div>
      </Div>

      {/* Menu Options List */}
      <Div className="bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isLast = idx === menuItems.length - 1;
          return (
            <Button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`w-full p-4.5 px-5 flex flex-row items-center justify-between text-left hover:bg-purple-50/50 transition ${!isLast ? 'border-b border-purple-100' : ''
                }`}
            >
              <Div className="flex flex-row items-center gap-3.5">
                <Div
                  className={`w-10 h-10 rounded-2xl flex flex-row items-center justify-center ${item.danger ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-700'
                    }`}
                >
                  <Icon size={18} color={item.danger ? '#e11d48' : '#7c3aed'} />
                </Div>
                <Span
                  className={`text-xs font-bold ${item.danger ? 'text-rose-600' : 'text-gray-800'}`}
                >
                  {item.label}
                </Span>
              </Div>
              <ChevronRight size={18} color="#9ca3af" />
            </Button>
          );
        })}
      </Div>

      {/* Edit Personal Info & Profile Pic Modal Overlay */}
      <ModalOverlay isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl self-center">
          <Div className="flex flex-row items-center justify-between border-b border-purple-50 pb-3">
            <H3 className="text-sm font-extrabold text-gray-900">Edit Profile & Avatar</H3>
            <Button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex flex-row items-center justify-center"
            >
              <X size={16} color="#4b5563" />
            </Button>
          </Div>

          {/* Profile Picture Selector */}
          <Div className="space-y-2">
            <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
              CHOOSE PROFILE AVATAR
            </Span>
            <Div className="flex flex-row items-center justify-around gap-2 pt-1">
              {AVATAR_PRESETS.map((url, idx) => (
                <Button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative p-0.5 rounded-full border-2 transition-all ${selectedAvatar === url
                      ? 'border-[#7C3AED] scale-110 shadow-sm'
                      : 'border-transparent'
                    }`}
                >
                  <Img
                    src={url}
                    alt={`Avatar ${idx + 1}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Button>
              ))}
            </Div>
          </Div>

          {/* Form Fields */}
          <Div className="space-y-3 pt-1">
            <Div className="space-y-1">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                FULL NAME
              </Span>
              <Input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>

            <Div className="space-y-1">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                PHONE NUMBER
              </Span>
              <Input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter phone number"
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>

            <Div className="space-y-1">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                EMAIL ADDRESS
              </Span>
              <Input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>

            <Div className="space-y-1">
              <Span className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider block">
                DELIVERY / HOME ADDRESS
              </Span>
              <Input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter delivery address"
                className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-gray-900 font-bold"
              />
            </Div>
          </Div>

          <Div className="flex flex-row gap-2.5 pt-2">
            <Button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="flex-1 py-3.5 text-xs font-bold border border-gray-200 text-gray-600 rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-600 font-bold text-xs text-center">Cancel</Span>
            </Button>
            <Button
              type="button"
              onClick={handleSaveProfile}
              className="flex-1 py-3.5 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Save Changes</Span>
            </Button>
          </Div>
        </Div>
      </ModalOverlay>

      {/* Health & Allergy Modal Overlay */}
      <ModalOverlay isOpen={showAllergyModal} onClose={() => setShowAllergyModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl self-center">
          <H3 className="text-sm font-extrabold text-gray-900 text-center">
            Health & Allergy Cautions
          </H3>
          <P className="text-xs text-gray-500 leading-relaxed text-center">
            List any product sensitivities or chemical allergies to ensure safe treatments.
          </P>
          <Input
            type="text"
            value={allergyInput}
            onChange={(e) => setAllergyInput(e.target.value)}
            placeholder="e.g. Ammonia, Latex, PPD"
            className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-xs text-gray-900 font-bold"
          />
          <Div className="flex flex-row gap-2.5">
            <Button
              type="button"
              onClick={() => setShowAllergyModal(false)}
              className="flex-1 py-3.5 text-xs font-bold border border-gray-200 text-gray-600 rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-600 font-bold text-xs text-center">Cancel</Span>
            </Button>
            <Button
              type="button"
              onClick={handleSaveAllergies}
              className="flex-1 py-3.5 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Save Profile</Span>
            </Button>
          </Div>
        </Div>
      </ModalOverlay>

      {/* Communication Consent Modal Overlay */}
      <ModalOverlay isOpen={showConsentModal} onClose={() => setShowConsentModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl self-center">
          <H3 className="text-sm font-extrabold text-gray-900 text-center">
            Communication Preferences
          </H3>
          <Div className="space-y-3">
            {(['whatsapp', 'sms', 'email'] as const).map((channel) => {
              const isConsent = user.communicationConsent[channel];
              return (
                <Div
                  key={channel}
                  onClick={() => toggleConsent(channel)}
                  className="flex flex-row items-center justify-between p-3.5 rounded-2xl border border-purple-100 bg-purple-50/40 cursor-pointer"
                >
                  <Span className="text-xs font-bold uppercase text-gray-800">{channel}</Span>
                  <Span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${isConsent ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {isConsent ? 'ON' : 'OFF'}
                  </Span>
                </Div>
              );
            })}
          </Div>
          <Button
            type="button"
            onClick={() => setShowConsentModal(false)}
            className="w-full py-3.5 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl flex flex-row items-center justify-center"
          >
            <Span className="text-white font-bold text-xs text-center">Done</Span>
          </Button>
        </Div>
      </ModalOverlay>

      {/* Household Members Modal Overlay */}
      <ModalOverlay isOpen={showHouseholdModal} onClose={() => setShowHouseholdModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl self-center">
          <H3 className="text-sm font-extrabold text-gray-900 text-center">
            Household Beauty Profiles
          </H3>
          <Div className="space-y-3">
            {householdMembers.map((m) => (
              <Div
                key={m.id}
                className="flex flex-row items-center gap-3.5 p-3 border rounded-2xl bg-purple-50/40 border-purple-100"
              >
                <Img
                  src={m.avatar}
                  alt={m.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-100"
                />
                <Div className="space-y-0.5">
                  <H4 className="text-xs font-bold text-gray-900">{m.name}</H4>
                  <P className="text-[11px] font-medium text-gray-500">{m.relation}</P>
                </Div>
              </Div>
            ))}
          </Div>
          <Button
            type="button"
            onClick={() => setShowHouseholdModal(false)}
            className="w-full py-3.5 text-xs font-bold bg-[#7C3AED] text-white rounded-2xl flex flex-row items-center justify-center"
          >
            <Span className="text-white font-bold text-xs text-center">Close</Span>
          </Button>
        </Div>
      </ModalOverlay>

      {/* Logout Confirmation Modal Overlay */}
      <ModalOverlay isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <Div className="bg-white rounded-3xl p-6 w-full max-w-xs space-y-4 shadow-2xl self-center flex flex-col items-center text-center">
          <Div className="w-16 h-16 rounded-full bg-[#ffe4e6] flex flex-row items-center justify-center border-2 border-rose-200 shadow-xs self-center">
            <LogOut size={28} color="#e11d48" />
          </Div>
          <Div className="space-y-1 flex flex-col items-center">
            <H3 className="text-base font-extrabold text-gray-900 text-center">
              Logout of   Salon?
            </H3>
            <P className="text-xs text-gray-500 leading-relaxed text-center">
              Are you sure you want to log out? You will need to sign in again to access your wallet
              & appointments.
            </P>
          </Div>
          <Div className="flex flex-row gap-2.5 w-full pt-1">
            <Button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-3.5 text-xs font-bold border border-gray-200 bg-white text-gray-700 rounded-2xl flex flex-row items-center justify-center"
            >
              <Span className="text-gray-700 font-bold text-xs text-center">Cancel</Span>
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowLogoutModal(false);
                showToast('Logged out successfully!', 'info');
                navigate('/login');
              }}
              className="flex-1 py-3.5 text-xs font-bold bg-[#e11d48] text-white rounded-2xl shadow-xs flex flex-row items-center justify-center"
            >
              <Span className="text-white font-bold text-xs text-center">Yes, Logout</Span>
            </Button>
          </Div>
        </Div>
      </ModalOverlay>
    </Div>
  );
};
