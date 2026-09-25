import { Calendar, Grid, Home, User, Wallet } from 'lucide-react-native';
import type React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Div, Span } from '../components/primitives';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide bottom nav bar on booking flow, auth and reset-password pages so sticky buttons pin flush at bottom
  const shouldHideNav =
    location.pathname.startsWith('/booking') ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/signup');
  if (shouldHideNav) {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Grid },
    { label: 'Appointments', path: '/appointments', icon: Calendar },
    { label: 'Wallet', path: '/wallet', icon: Wallet },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <Div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-purple-100 px-3 py-3 pb-7 flex flex-row items-center justify-around z-50 shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/' || location.pathname === ''
            : location.pathname.startsWith(item.path);

        return (
          <Button
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center py-1 px-2.5"
          >
            <Icon
              size={30}
              color={isActive ? '#7c3aed' : '#6b7280'}
              fill={isActive && item.label === 'Home' ? '#7c3aed' : 'transparent'}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <Span
              className={`text-xs mt-1 font-bold ${isActive ? 'text-purple-700' : 'text-gray-500'}`}
            >
              {item.label}
            </Span>
          </Button>
        );
      })}
    </Div>
  );
};
