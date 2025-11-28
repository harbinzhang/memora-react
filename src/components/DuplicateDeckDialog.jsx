import { useState, useEffect } from 'react';
import { X, AlertTriangle, GitMerge, Edit3 } from 'lucide-react';
import { generateUniqueDeckName } from '../utils/deckHelpers';

const DuplicateDeckDialog = ({
  existingDeck,
  importFileName,
  importCardCount,
  allDecks,
  onMerge,
  onRename,
  onCancel
}) => {
  const suggestedName = generateUniqueDeckName(importFileName, allDecks);
  const [newName, setNewName] = useState(suggestedName);
  const [error, setError] = useState('');
  const [showRenameInput, setShowRenameInput] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  const handleRename = () => {
    if (!newName.trim()) {
      setError('Deck name cannot be empty');
      return;
    }

    const isDuplicate = allDecks.some(
      deck => deck.name.toLowerCase() === newName.toLowerCase()
    );

    if (isDuplicate) {
      setError('This name is also already taken');
      return;
    }

    onRename(newName);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="duplicate-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 modal-backdrop transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="modal-content-panel w-full max-w-lg animate-scale-in" role="document">
        <div className="p-6">
          {/* Header */}
          <div className="modal-header">
            <div className="modal-title-group">
              <div className="danger-icon-wrapper p-2 rounded-full" style={{ backgroundColor: 'hsl(217, 91%, 60%, 0.1)' }}>
                <AlertTriangle size={22} style={{ color: 'var(--accent)' }} />
              </div>
              <h3 id="duplicate-dialog-title" className="text-xl font-semibold m-0">
                Duplicate Deck Name
              </h3>
            </div>
            <button
              onClick={onCancel}
              aria-label="Close dialog"
              className="close-btn text-secondary hover:text-primary transition-colors p-1 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <p className="text-secondary leading-relaxed m-0 mb-4">
              A deck named <strong style={{ color: 'var(--accent)' }}>{importFileName}</strong> already exists.
            </p>

            {/* Info Card */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="text-secondary">Existing deck:</span>
                <span className="text-primary font-medium">{existingDeck.cardCount} cards</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-secondary">Import file:</span>
                <span className="text-primary font-medium">{importCardCount} cards</span>
              </div>
            </div>

            <p className="text-secondary text-sm mb-4">What would you like to do?</p>

            {/* Action Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Merge Option */}
              <button
                onClick={onMerge}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
              >
                <GitMerge size={20} />
                <div>
                  <div className="font-semibold" style={{ marginBottom: '0.125rem' }}>Merge Cards</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    Add {importCardCount} cards to existing deck
                  </div>
                </div>
              </button>

              {/* Rename Option */}
              {!showRenameInput ? (
                <button
                  onClick={() => setShowRenameInput(true)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    justifyContent: 'flex-start',
                    textAlign: 'left'
                  }}
                >
                  <Edit3 size={20} />
                  <div>
                    <div className="font-semibold">Create New Deck</div>
                    <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                      Import as a new deck with a different name
                    </div>
                  </div>
                </button>
              ) : (
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Edit3 size={18} style={{ color: 'var(--accent)' }} />
                    <div className="font-semibold">New Deck Name</div>
                  </div>
                  <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    className="input"
                    placeholder="Enter new deck name"
                    autoFocus
                    style={{ marginBottom: '0.5rem' }}
                  />
                  {error && (
                    <p style={{
                      color: 'var(--danger)',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                      margin: '0 0 0.75rem 0'
                    }}>
                      {error}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => {
                        setShowRenameInput(false);
                        setNewName(suggestedName);
                        setError('');
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRename}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button onClick={onCancel} className="btn btn-danger">
              Cancel Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateDeckDialog;
