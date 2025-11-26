import { useEffect } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose} aria-label="Close notification">
          <X size={18} />
        </button>
      </div>

      <style jsx>{`
        .toast {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 500px;
          min-width: 300px;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
                      0 2px 8px rgba(0, 0, 0, 0.05);
          z-index: 9999;
          animation: slideInDown 0.3s ease-out;
          border: 1px solid;
        }

        @keyframes slideInDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .toast-success {
          background: hsla(142, 71%, 45%, 0.15);
          border-color: var(--success);
          color: var(--success);
        }

        .toast-error {
          background: hsla(0, 84%, 60%, 0.15);
          border-color: var(--danger);
          color: var(--danger);
        }

        .toast-warning {
          background: hsla(38, 92%, 50%, 0.15);
          border-color: hsl(38, 92%, 50%);
          color: hsl(38, 92%, 50%);
        }

        .toast-info {
          background: hsla(217, 91%, 60%, 0.15);
          border-color: hsl(217, 91%, 60%);
          color: hsl(217, 91%, 60%);
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .toast-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .toast-message {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.4;
          color: var(--text-primary);
        }

        .toast-close {
          flex-shrink: 0;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          opacity: 0.7;
          transition: opacity 0.2s ease, background-color 0.2s ease;
        }

        .toast-close:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.05);
        }

        .toast-close:active {
          transform: scale(0.95);
        }

        @media (max-width: 640px) {
          .toast {
            max-width: calc(100vw - 40px);
            min-width: unset;
            left: 20px;
            right: 20px;
            transform: none;
          }

          @keyframes slideInDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
