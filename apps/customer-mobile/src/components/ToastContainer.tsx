import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import type React from 'react';
import { useApp } from '../context/AppContext';
import { Div, Span } from './primitives';

export const ToastContainer: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      case 'error':
        return <AlertCircle size={20} color="#f43f5e" />;
      default:
        return <Info size={20} color="#7c3aed" />;
    }
  };

  return (
    <Div className="fixed top-12 left-4 right-4 z-50 flex flex-row justify-center items-center pointer-events-none">
      <Div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex flex-row items-center gap-3 border border-purple-200/20 max-w-xs self-center">
        {getIcon()}
        <Span className="text-xs font-bold text-white leading-tight flex-1">{toast.message}</Span>
      </Div>
    </Div>
  );
};
