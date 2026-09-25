import { cn } from '@salon-spa-saas/ui';
import { X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = 'xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Responsive, screen-proportional width scaling
  const widthClasses = {
    sm: 'w-[92vw] max-w-xl',
    md: 'w-[94vw] max-w-3xl',
    lg: 'w-[95vw] max-w-4xl lg:max-w-5xl',
    xl: 'w-[95vw] max-w-5xl lg:max-w-6xl',
    '2xl': 'w-[96vw] max-w-6xl xl:max-w-7xl',
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
      {/* Dark Blurred Backdrop covering full screen and sidebar */}
      <div
        className="fixed inset-0 bg-[#3B2647]/50 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Screen-proportional Modal Container */}
      <div
        className={cn(
          'relative bg-white rounded-2xl sm:rounded-[32px] shadow-[0_30px_70px_rgba(90,46,166,0.25)] overflow-hidden z-10 border border-[#5A2EA6]/15 animate-in zoom-in-95 duration-200 my-auto min-h-[300px] sm:min-h-[480px] max-h-[94vh] flex flex-col',
          widthClasses[maxWidth],
        )}
      >
        {/* Modal Header */}
        <div className="premium-card-header px-4 sm:px-8 py-3.5 sm:py-5 relative min-h-[64px] sm:min-h-[76px] flex items-center justify-between z-10 shrink-0">
          <div className="premium-card-header-glow" />
          <div className="header-shine" />
          <div className="z-10 flex items-center gap-2.5 sm:gap-3.5">
            {icon && (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h3 className="font-serif text-base sm:text-lg md:text-xl text-white font-bold tracking-tight">
                {title}
              </h3>
              {subtitle && <p className="text-[11px] sm:text-[12px] text-white/80 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Content - Expanded Dynamic Height */}
        <div className="p-4 sm:p-7 lg:p-10 overflow-y-auto flex-1 max-h-[calc(94vh-70px)] sm:max-h-[calc(94vh-86px)] custom-scroll text-[13px]">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};
