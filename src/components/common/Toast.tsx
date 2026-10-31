import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { notification, dismissNotification } = useApp();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-[#315F91] shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 bg-white text-emerald-950',
    error: 'border-red-200 bg-white text-red-950',
    info: 'border-blue-200 bg-white text-slate-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 sm:px-0 pointer-events-auto">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border ${borderStyles[notification.type]} transition-all animate-in fade-in slide-in-from-bottom-3 duration-200`}
        role="alert"
      >
        {icons[notification.type]}
        <div className="flex-1 pr-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {notification.title}
          </h5>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            {notification.message}
          </p>
        </div>
        <button
          onClick={dismissNotification}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
