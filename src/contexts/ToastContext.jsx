import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration + animation time
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration + 300);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);

  const value = {
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <div key={toast.id} style={{ top: `${20 + index * 80}px` }}>
            <Toast
              message={toast.message}
              type={toast.type}
              duration={0}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          pointer-events: none;
          z-index: 9999;
        }

        .toast-container > div {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: auto;
          transition: top 0.3s ease;
        }

        @media (max-width: 640px) {
          .toast-container > div {
            left: 20px;
            right: 20px;
            transform: none;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
