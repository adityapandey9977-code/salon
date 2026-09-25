import { X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
  '3xl': 'max-w-6xl',
  full: 'max-w-[95vw] h-[90vh]',
};

export const Modal: React.FC<ModalProps> & {
  Header: typeof ModalHeader;
  Title: typeof ModalTitle;
  Description: typeof ModalDescription;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
  CloseButton: typeof ModalCloseButton;
} = ({
  isOpen,
  onClose,
  children,
  size = 'lg',
  className,
  closeOnBackdropClick = true,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => closeOnBackdropClick && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={cn(
          'relative w-full bg-white rounded-[24px] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200',
          sizeClasses[size],
          className,
        )}
      >
        {showCloseButton && <ModalCloseButton onClick={onClose} />}
        {children}
      </div>
    </div>,
    document.body,
  );
};

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  badge,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white flex flex-col justify-center text-left',
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div className="space-y-1 pr-8">
          {badge && <div className="mb-1">{badge}</div>}
          {title && (
            <h2 className="font-serif text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => {
  return (
    <h2
      className={cn('font-serif text-xl font-bold text-slate-900 tracking-tight', className)}
      {...props}
    />
  );
};

export const ModalDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => {
  return <p className={cn('text-xs text-slate-500 font-medium mt-1', className)} {...props} />;
};

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('p-6 overflow-y-auto max-h-[calc(85vh-140px)] text-left', className)}
      {...props}
    />
  );
};

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3',
        className,
      )}
      {...props}
    />
  );
};

export const ModalCloseButton: React.FC<{ onClick: () => void; className?: string }> = ({
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
      aria-label="Close dialog"
    >
      <X className="w-4 h-4" />
    </button>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.CloseButton = ModalCloseButton;
