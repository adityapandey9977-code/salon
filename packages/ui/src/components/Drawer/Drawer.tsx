import { X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

export const Drawer: React.FC<DrawerProps> & {
  Header: typeof DrawerHeader;
  Body: typeof DrawerBody;
  Footer: typeof DrawerFooter;
  CloseButton: typeof DrawerCloseButton;
} = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  size = 'md',
  className,
  closeOnEsc = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={cn(
          'fixed inset-y-0 flex max-w-full',
          position === 'right' ? 'right-0 pl-10' : 'left-0 pr-10',
        )}
      >
        <div
          className={cn(
            'w-screen bg-white shadow-2xl border-slate-200/80 flex flex-col relative animate-in duration-300',
            position === 'right' ? 'border-l slide-in-from-right' : 'border-r slide-in-from-left',
            sizeClasses[size],
            className,
          )}
        >
          {showCloseButton && <DrawerCloseButton onClick={onClose} />}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export const DrawerHeader: React.FC<{
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, badge, children, className }) => {
  return (
    <div
      className={cn(
        'px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white flex flex-col justify-center text-left shrink-0',
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <div className="space-y-1 pr-8">
          {badge && <div className="mb-1">{badge}</div>}
          {title && (
            <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const DrawerBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return <div className={cn('p-6 overflow-y-auto flex-1 text-left', className)} {...props} />;
};

export const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0',
        className,
      )}
      {...props}
    />
  );
};

export const DrawerCloseButton: React.FC<{ onClick: () => void; className?: string }> = ({
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition cursor-pointer z-20 shadow-2xs',
        className,
      )}
      aria-label="Close drawer"
    >
      <X className="w-4 h-4" />
    </button>
  );
};

Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;
Drawer.CloseButton = DrawerCloseButton;
