import { cn } from '@salon-spa-saas/ui';
import { Check, ChevronDown, MapPin, Store } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { useAdminContext } from '../../context/AdminContext';

export function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedLocation, setSelectedLocation, locationsList, salon } = useAdminContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer select-none text-left shadow-xs outline-none',
          isOpen
            ? 'border-[#5A2EA6] bg-[#5A2EA6]/5 text-[#5A2EA6] ring-2 ring-[#5A2EA6]/10'
            : 'border-line/70 bg-white/80 hover:bg-white hover:border-[#5A2EA6]/40 text-ink',
        )}
      >
        <div className="w-5 h-5 rounded-full bg-[#5A2EA6]/10 grid place-items-center text-[#5A2EA6] shrink-0">
          <Store className="w-3 h-3" />
        </div>
        <span className="text-[12px] font-semibold tracking-tight truncate max-w-[140px] md:max-w-[170px]">
          {selectedLocation.name}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-muted transition-transform duration-200',
            isOpen && 'rotate-180 text-[#5A2EA6]',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="bg-white rounded-2xl shadow-[0_16px_40px_rgba(59,38,71,0.14)] border border-line/80 py-2">
            <div className="px-3.5 py-1.5 border-b border-line/50 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A2EA6]">
                Switch Branch Scope
              </span>
              <span className="text-[10px] text-muted font-medium">
                {salon.branchesCount ?? salon.branches.length} Branches Active
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto py-1">
              {locationsList.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full px-3.5 py-2 flex items-center justify-between text-left transition-colors cursor-pointer border-0 bg-transparent',
                      isSelected ? 'bg-[#F6F4FF] text-[#5A2EA6]' : 'hover:bg-[#FAF8FC] text-ink',
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-semibold',
                          isSelected ? 'bg-[#5A2EA6] text-white' : 'bg-pine/50 text-soft',
                        )}
                      >
                        {loc.id === 'all' ? (
                          <Store className="w-3.5 h-3.5" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <strong className="block text-[12px] font-semibold truncate">
                          {loc.name}
                        </strong>
                        <span className="text-[10px] text-muted block truncate font-medium">
                          {loc.subtitle}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#5A2EA6] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
