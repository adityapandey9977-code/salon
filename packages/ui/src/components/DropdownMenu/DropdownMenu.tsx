import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useClickOutside } from '../../hooks';
import { cn } from '../../utils';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown compound components must be used within a DropdownMenu');
  }
  return context;
};

export interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> & {
  Trigger: typeof DropdownTrigger;
  Content: typeof DropdownContent;
  Item: typeof DropdownItem;
  Separator: typeof DropdownSeparator;
  Label: typeof DropdownLabel;
} = ({ children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  const containerRef = useClickOutside<HTMLDivElement>(close);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, close }}>
      <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { isOpen, setIsOpen } = useDropdown();

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={cn('inline-flex cursor-pointer select-none', className)}
    >
      {children}
    </div>
  );
};

export interface DropdownContentProps {
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: string;
  className?: string;
}

export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  align = 'right',
  width = 'w-52',
  className,
}) => {
  const { isOpen } = useDropdown();

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'absolute top-full mt-1.5 bg-white rounded-2xl border border-slate-200/90 shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 text-left',
        align === 'right' ? 'right-0' : 'left-0',
        width,
        className,
      )}
    >
      {children}
    </div>
  );
};

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  icon,
  danger = false,
  disabled = false,
  className,
}) => {
  const { close } = useDropdown();

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    onClick?.();
    close();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition text-left cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
        danger
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-700 hover:bg-[#5A2EA6]/5 hover:text-[#5A2EA6]',
        className,
      )}
    >
      {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
      <span className="truncate flex-1">{children}</span>
    </button>
  );
};

export const DropdownSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('h-px bg-slate-100 my-1 -mx-1.5', className)} />;
};

export const DropdownLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

DropdownMenu.Trigger = DropdownTrigger;
DropdownMenu.Content = DropdownContent;
DropdownMenu.Item = DropdownItem;
DropdownMenu.Separator = DropdownSeparator;
DropdownMenu.Label = DropdownLabel;
