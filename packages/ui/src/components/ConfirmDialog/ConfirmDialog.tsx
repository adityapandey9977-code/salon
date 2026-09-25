import { AlertCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import type React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { Modal } from '../Modal';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const variantIcons = {
    danger: <AlertCircle className="w-6 h-6 text-rose-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    info: <Info className="w-6 h-6 text-sky-600" />,
  };

  const variantStyles = {
    danger: {
      bg: 'bg-rose-50 border-rose-100',
      btnClass: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-100',
      btnClass: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    },
    info: {
      bg: 'bg-sky-50 border-sky-100',
      btnClass: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20',
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <div className="p-6 text-left space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs',
              variantStyles[variant].bg,
            )}
          >
            {variantIcons[variant]}
          </div>

          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
            <div className="text-xs text-slate-500 font-medium leading-relaxed">{description}</div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-9 px-4 rounded-xl text-xs font-semibold"
          >
            {cancelText}
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'h-9 px-5 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
              variantStyles[variant].btnClass,
            )}
          >
            {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
