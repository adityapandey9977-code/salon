import { cn } from '@salon-spa-saas/ui';
import { X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'center' | 'drawer';
}

export function DialogModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  variant = 'center',
}: DialogModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDrawer = variant === 'drawer';

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 bg-[#3B2647]/50 backdrop-blur-md z-[9999] p-4 animate-in fade-in duration-200',
        isDrawer ? 'flex justify-end p-0' : 'flex items-center justify-center',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white border-[#5A2EA6]/15 overflow-hidden flex flex-col relative shadow-[0_30px_70px_rgba(90,46,166,0.25)] z-10 my-auto',
          isDrawer
            ? 'border-l h-full w-full max-w-xl animate-in slide-in-from-right duration-300'
            : 'border rounded-[32px] w-[94vw] max-w-4xl lg:max-w-5xl animate-in zoom-in-95 duration-200 min-h-[460px] max-h-[92vh]',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-b from-[#FCFAFF] to-[#F8F5FF] px-6 py-4 border-b border-[#5A2EA6]/10 flex justify-between items-center relative">
          <div className="z-10">
            <h3 className="font-serif text-[15px] text-ink font-bold tracking-tight">{title}</h3>
            {description && (
              <p className="text-[10px] text-soft mt-0.5 font-medium">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-soft hover:text-ink bg-transparent hover:bg-paper/40 p-1.5 rounded-full cursor-pointer transition-colors duration-200 border-0 flex items-center justify-center z-10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div
          className={cn(
            'p-6 overflow-y-auto text-[12px] flex-1',
            isDrawer ? 'max-h-[calc(100vh-60px)]' : 'max-h-[calc(100vh-120px)]',
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
