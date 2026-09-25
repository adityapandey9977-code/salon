import type React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils';

interface ToastContextType {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Wait for animation to finish before clearing message
        setTimeout(() => setMessage(null), 300);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const toast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  const toastContent = message && (
    <div
      className={cn(
        'fixed top-6 right-6 max-w-md bg-[#1E152D] text-white px-5 py-3.5 rounded-2xl text-[13px] font-bold shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-purple-500/30 transition-all duration-300 pointer-events-auto z-[999999] flex items-center gap-3 backdrop-blur-md',
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95',
      )}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-pulse shadow-[0_0_10px_#34d399]" />
      <span className="text-white font-semibold text-[13px] tracking-wide flex-1 leading-snug">
        {message}
      </span>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white/60 hover:text-white ml-2 text-xs cursor-pointer border-0 bg-transparent"
      >
        ✕
      </button>
    </div>
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted && typeof document !== 'undefined' && createPortal(toastContent, document.body)}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
