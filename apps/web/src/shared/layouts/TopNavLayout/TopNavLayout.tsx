import { ToastProvider } from '@salon-spa-saas/ui';
import type React from 'react';
import { Outlet } from 'react-router';

interface TopNavLayoutProps {
  navbar: React.ReactNode;
}

export function TopNavLayout({ navbar }: TopNavLayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#F3EEF9] text-ink selection:bg-[#5A2EA6]/20 overflow-x-hidden">
        {/* Sticky Top Navbar */}
        <div className="sticky top-0 z-40 w-full shrink-0 shadow-[0_4px_20px_rgba(90,46,166,0.06)] border-b border-line/60 bg-white/95 backdrop-blur-md">
          {navbar}
        </div>

        {/* Main Full-Width Page Container */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <main className="flex-1 w-full p-3 sm:p-5 md:p-6 lg:p-7 custom-scroll overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default TopNavLayout;
