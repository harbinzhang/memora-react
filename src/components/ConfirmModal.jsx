import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDangerous = false
}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            aria-describedby="confirm-modal-message"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 modal-backdrop transition-opacity"
                onClick={onClose}
            />
            {/* Modal Content */}
            <div className="modal-content-panel w-full max-w-md animate-scale-in" role="document">
                <div className="p-6">
                    {/* Header */}
                    <div className="modal-header">
                        <div className="modal-title-group">
                            {isDangerous && (
                                <div className="danger-icon-wrapper p-2 rounded-full">
                                    <AlertTriangle size={22} />
                                </div>
                            )}
                            <h3 id="confirm-modal-title" className="text-xl font-semibold m-0">{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            aria-label="Close dialog"
                            className="close-btn text-secondary hover:text-primary transition-colors p-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Body */}
                    <div className="modal-body">
                        <p id="confirm-modal-message" className="text-secondary leading-relaxed m-0">{message}</p>
                    </div>
                    {/* Footer / Actions */}
                    <div className="modal-footer">
                        <button onClick={onClose} className="btn btn-secondary" autoFocus>
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`btn ${isDangerous ? 'btn-danger' : 'btn-primary'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
