import { cn } from '@salon-spa-saas/ui';
import { ChevronDown } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: string;
  description?: string;
  isActive?: boolean;
}

interface NavDropdownProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  categoryLabel?: string;
  items: DropdownItem[];
  footerNote?: string;
}

export function NavDropdown({
  label,
  icon,
  isActive = false,
  categoryLabel,
  items,
  footerNote,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Clear any existing leave timeout
  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    cancelClose();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    cancelClose();
    // 180ms grace period so mouse moving between button and dropdown items never flickers or closes
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        cancelClose();
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      cancelClose();
    };
  }, []);

  const handleItemClick = (path: string) => {
    cancelClose();
    setIsOpen(false);
    navigate(path);
  };

  const handleTriggerClick = () => {
    cancelClose();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="relative shrink-0"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleTriggerClick}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 cursor-pointer select-none outline-none border border-transparent shrink-0 whitespace-nowrap',
          isActive
            ? 'bg-[#5A2EA6] text-white shadow-xs font-bold'
            : isOpen
              ? 'bg-[#F6F4FF] text-[#5A2EA6]'
              : 'text-soft/90 hover:text-ink hover:bg-white/60',
        )}
      >
        {icon && (
          <span className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-muted')}>
            {icon}
          </span>
        )}
        <span>{label}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            isOpen && 'rotate-180',
            isActive ? 'text-white/80' : 'text-muted',
          )}
        />
      </button>

      {/* Dropdown Menu Container with Hover Bridge */}
      {isOpen && (
        <div
          className="absolute left-0 top-full pt-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible hover bridge to prevent dead zones between trigger and menu */}
          <div className="w-64 bg-white rounded-2xl shadow-[0_16px_40px_rgba(59,38,71,0.14)] border border-line/80 py-2">
            {categoryLabel && (
              <div className="px-3.5 py-1 mb-1 border-b border-line/40 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A2EA6]">
                  {categoryLabel}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-0.5 py-1">
              {items.map((item) => {
                return (
                  <button
                    key={item.path + item.label}
                    type="button"
                    onClick={() => handleItemClick(item.path)}
                    className={cn(
                      'flex items-center gap-2.5 px-3.5 py-2 mx-1.5 rounded-xl text-left transition-all cursor-pointer border-0 bg-transparent group',
                      item.isActive
                        ? 'bg-[#F6F4FF] text-[#5A2EA6] font-bold'
                        : 'text-ink hover:bg-[#FAF8FC] hover:text-[#5A2EA6]',
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                        item.isActive
                          ? 'bg-[#5A2EA6] text-white shadow-xs'
                          : 'bg-pine/40 text-soft group-hover:bg-[#5A2EA6]/10 group-hover:text-[#5A2EA6]',
                      )}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#5A2EA6]/10 text-[#5A2EA6]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <span className="text-[10px] text-muted block truncate font-medium">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {footerNote && (
              <div className="mt-1 px-3.5 pt-2 border-t border-line/40 text-[10px] text-muted">
                {footerNote}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavDropdown;
