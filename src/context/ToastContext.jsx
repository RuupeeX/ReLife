import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";

// ═══════════════════════════════════════════
// TOAST CONTEXT
// ═══════════════════════════════════════════
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

// ═══════════════════════════════════════════
// TOAST ITEM
// ═══════════════════════════════════════════
const toastStyles = {
  success: {
    bg: "linear-gradient(135deg, #10b981, #14b8a6)",
    icon: Check,
    shadow: "0 8px 32px rgba(16,185,129,0.3)",
  },
  error: {
    bg: "linear-gradient(135deg, #ef4444, #dc2626)",
    icon: AlertCircle,
    shadow: "0 8px 32px rgba(239,68,68,0.3)",
  },
  info: {
    bg: "linear-gradient(135deg, #3b82f6, #2563eb)",
    icon: Info,
    shadow: "0 8px 32px rgba(59,130,246,0.3)",
  },
  warning: {
    bg: "linear-gradient(135deg, #f59e0b, #d97706)",
    icon: AlertCircle,
    shadow: "0 8px 32px rgba(245,158,11,0.3)",
  },
};

const ToastItem = ({ toast, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const config = toastStyles[toast.type] || toastStyles.info;
  const Icon = config.icon;

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 250);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [handleDismiss, toast.duration]);

  return (
    <div
      className="flex items-center gap-3 px-5 py-4 rounded-2xl text-white font-medium max-w-sm w-full pointer-events-auto"
      style={{
        background: config.bg,
        boxShadow: config.shadow,
        animation: exiting
          ? "toastOut 0.25s ease forwards"
          : "toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-[14px] font-semibold">{toast.message}</span>
      <button
        onClick={handleDismiss}
        className="w-6 h-6 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 border-none cursor-pointer text-white flex-shrink-0 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════
// TOAST CONTAINER
// ═══════════════════════════════════════════
const ToastContainer = ({ toasts, dismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex flex-col-reverse gap-3 pointer-events-none"
      style={{ maxWidth: 400 }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════
// TOAST PROVIDER
// ═══════════════════════════════════════════
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  // Shorthand methods
  const success = useCallback((msg, dur) => toast(msg, "success", dur), [toast]);
  const error = useCallback((msg, dur) => toast(msg, "error", dur), [toast]);
  const info = useCallback((msg, dur) => toast(msg, "info", dur), [toast]);
  const warning = useCallback((msg, dur) => toast(msg, "warning", dur), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      {/* Inject animations */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(40px) scale(0.95); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastContext;