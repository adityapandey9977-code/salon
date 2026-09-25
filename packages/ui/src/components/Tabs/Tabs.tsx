import type React from 'react';
import { createContext, useContext } from 'react';
import { cn } from '../../utils';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  variant: 'underline' | 'pill' | 'boxed';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  variant?: 'underline' | 'pill' | 'boxed';
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> & {
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
} = ({ value, onValueChange, variant = 'underline', children, className }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange, variant }}>
      <div className={cn('w-full space-y-4', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const { variant } = useTabs();

  const variantStyles = {
    underline: 'flex items-center gap-6 border-b border-slate-200/90 overflow-x-auto no-scrollbar',
    pill: 'inline-flex items-center gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60 overflow-x-auto',
    boxed:
      'flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto',
  };

  return <div className={cn(variantStyles[variant], className)}>{children}</div>;
};

export interface TabsTriggerProps {
  value: string;
  count?: number;
  badgeVariant?: 'default' | 'purple' | 'warning' | 'danger' | 'success';
  icon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value: triggerValue,
  count,
  badgeVariant = 'default',
  icon,
  disabled = false,
  children,
  className,
}) => {
  const { value, onValueChange, variant } = useTabs();
  const isActive = value === triggerValue;

  const badgeStyles = {
    default: isActive ? 'bg-[#5A2EA6] text-white' : 'bg-slate-200 text-slate-700',
    purple: 'bg-[#5A2EA6]/10 text-[#5A2EA6]',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
    success: 'bg-emerald-100 text-emerald-800',
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onValueChange(triggerValue)}
        className={cn(
          'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed',
          isActive
            ? 'bg-white text-[#5A2EA6] shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50',
          className,
        )}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              'text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center',
              badgeStyles[badgeVariant],
            )}
          >
            {count}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'boxed') {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onValueChange(triggerValue)}
        className={cn(
          'px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed',
          isActive
            ? 'bg-[#5A2EA6] text-white shadow-xs'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          className,
        )}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
        {count !== undefined && (
          <span
            className={cn(
              'text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center',
              isActive ? 'bg-white/20 text-white' : badgeStyles[badgeVariant],
            )}
          >
            {count}
          </span>
        )}
      </button>
    );
  }

  // Default: underline
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onValueChange(triggerValue)}
      className={cn(
        'py-3 text-xs font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed',
        isActive ? 'text-[#5A2EA6]' : 'text-slate-500 hover:text-slate-800',
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={cn(
            'text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-4 text-center',
            badgeStyles[badgeVariant],
          )}
        >
          {count}
        </span>
      )}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#5A2EA6] rounded-full animate-in fade-in duration-150" />
      )}
    </button>
  );
};

export const TabsContent: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value: contentValue, children, className }) => {
  const { value } = useTabs();
  if (value !== contentValue) return null;

  return (
    <div className={cn('animate-in fade-in duration-200 text-left', className)}>{children}</div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
