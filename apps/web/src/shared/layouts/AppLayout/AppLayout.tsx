import { ToastProvider, cn } from '@salon-spa-saas/ui';
import { Menu, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation } from 'react-router';

interface AppLayoutProps {
  sidebar: React.ReactNode;
}

export function AppLayout({ sidebar }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile menu on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to dismiss mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-pine p-0 md:p-2 lg:p-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0 relative z-30">{sidebar}</div>

        {/* Mobile Slide-Over Drawer Portal */}
        {typeof document !== 'undefined' &&
          createPortal(
            <div
              className={cn(
                'fixed inset-0 z-[9999] md:hidden pointer-events-none transition-all duration-300',
                isMobileMenuOpen && 'pointer-events-auto',
              )}
            >
              {/* Mobile Slide-Over Drawer Backdrop */}
              <div
                className={cn(
                  'fixed inset-0 z-[9999] transition-opacity duration-300 md:hidden',
                  isMobileMenuOpen
                    ? 'opacity-100 pointer-events-auto bg-black/60 backdrop-blur-xs'
                    : 'opacity-0 pointer-events-none',
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Mobile Slide-Over Drawer Container */}
              <div
                className={cn(
                  'fixed inset-y-0 left-0 z-[10000] w-[280px] max-w-[85vw] h-[100dvh] h-screen bg-pine text-soft shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out',
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
                )}
              >
                {/* Mobile Drawer Header with Close Button */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-line/30 bg-pine shrink-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#5A2EA6] to-[#7B4DFF] flex items-center justify-center text-white font-serif font-black text-xs shadow-xs shrink-0">
                      D
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        Salon
                      </span>
                      <span className="text-[9px] text-[#c3a0ff] uppercase tracking-wider font-semibold block truncate">
                        Navigation Console
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl text-soft/80 hover:text-white hover:bg-white/10 transition cursor-pointer border-0 bg-transparent flex items-center justify-center"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Drawer Sidebar Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scroll p-0 no-scrollbar">
                  {sidebar}
                </div>
              </div>
            </div>,
            document.body,
          )}

        {/* Main Floating Page Container */}
        <div className="relative z-20 flex min-w-0 flex-1 flex-col overflow-hidden rounded-none md:rounded-2xl bg-paper shadow-[0_12px_40px_rgba(59,38,71,0.08)] md:my-2 md:mr-2 lg:my-3 lg:mr-3 lg:rounded-[22px]">
          {/* Mobile Sticky Header Bar */}
          <header className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-pine border-b border-line/30 text-white shrink-0 z-10">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition cursor-pointer border border-white/10 flex items-center justify-center shadow-xs"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#5A2EA6] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                  D
                </div>
                <div>
                  <span className="font-serif text-sm font-bold text-white block leading-tight">
                    Platform
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[#c3a0ff] font-semibold block">
                    Salon & Spa SaaS
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-paper outline-none p-3 sm:p-5 md:p-6 lg:p-8 custom-scroll">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
