import { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

const TOAST_STYLES = {
  success: {
    classes: 'bg-green-50 border-green-100 text-green-700',
    iconColor: 'text-green-500',
    icon: 'M20 6L9 17l-5-5'
  },
  warning: {
    classes: 'bg-amber-50 border-amber-100 text-amber-800',
    iconColor: 'text-amber-500',
    icon: 'M12 9v3.5m0 3.5h.01M10.61 4.4 2.4 18.5A1.8 1.8 0 0 0 3.96 21h16.08a1.8 1.8 0 0 0 1.56-2.5L13.39 4.4a1.8 1.8 0 0 0-2.78 0z'
  },
  error: {
    classes: 'bg-red-50 border-red-100 text-red-700',
    iconColor: 'text-red-500',
    icon: 'M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
  },
  info: {
    classes: 'bg-white border-ink-100 text-ink-700',
    iconColor: 'text-brand-500',
    icon: 'M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
  }
};

const ToastItem = ({ toast, onDismiss }) => {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  return (
    <div className={`flex items-start gap-2.5 border rounded-xl shadow-card-hover px-4 py-3 animate-slide-up ${style.classes}`}>
      <svg viewBox="0 0 24 24" className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconColor}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={style.icon} />
      </svg>
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity shrink-0"
        aria-label="Dismiss"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 w-[calc(100%-2.5rem)] max-w-sm pointer-events-none">
    {toasts.map((toast) => (
      <div key={toast.id} className="pointer-events-auto">
        <ToastItem toast={toast} onDismiss={onDismiss} />
      </div>
    ))}
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
