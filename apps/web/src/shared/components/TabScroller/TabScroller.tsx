import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@salon-spa-saas/ui';

interface TabScrollerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function TabScroller({
  children,
  className,
  containerClassName,
}: TabScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    window.addEventListener('resize', checkScroll);

    const resizeObserver = new ResizeObserver(() => {
      checkScroll();
    });
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(() => {
      checkScroll();
    });
    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [checkScroll]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(220, Math.floor(el.clientWidth * 0.6));
    const offset = direction === 'left' ? -step : step;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div
      className={cn(
        'relative group/scroller bg-white p-1.5 rounded-[22px] border border-[#5A2EA6]/15 shadow-xs flex items-center min-w-0 w-full overflow-hidden',
        containerClassName,
      )}
    >
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <div className="absolute left-1.5 z-20 flex items-center pointer-events-auto">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs border border-[#5A2EA6]/30 shadow-md flex items-center justify-center text-[#5A2EA6] hover:bg-[#5A2EA6] hover:text-white transition-all duration-150 cursor-pointer active:scale-95 shrink-0"
            title="Scroll tabs left"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={cn(
          'flex items-center gap-1.5 overflow-x-auto tab-scroll w-full scroll-smooth select-none px-1 transition-all',
          canScrollLeft && 'pl-8',
          canScrollRight && 'pr-8',
          className,
        )}
      >
        {children}
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <div className="absolute right-1.5 z-20 flex items-center pointer-events-auto">
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs border border-[#5A2EA6]/30 shadow-md flex items-center justify-center text-[#5A2EA6] hover:bg-[#5A2EA6] hover:text-white transition-all duration-150 cursor-pointer active:scale-95 shrink-0"
            title="Scroll tabs right"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default TabScroller;
