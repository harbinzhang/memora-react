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
      <div className="modal-content-panel w-full max-w-md animate-scale-in" role="document">
        <div className="p-6">
          {/* Header */}
          <div className="modal-header">
            <div className="modal-title-group">
              <div className="danger-icon-wrapper p-2 rounded-full bg-[hsl(217,91%,60%,0.1)]">
                <AlertTriangle size={22} className="text-[var(--accent)]" />
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
              A deck named <strong className="text-[var(--accent)]">{importFileName}</strong> already exists.
            </p>

            {/* Info Card */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[var(--radius-lg)] p-4 mb-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Existing deck:</span>
                <span className="text-primary font-medium">{existingDeck.cardCount} cards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Import file:</span>
                <span className="text-primary font-medium">{importCardCount} cards</span>
              </div>
            </div>

            <p className="text-secondary text-sm mb-4">What would you like to do?</p>

            {/* Action Options */}
            <div className="flex flex-col gap-3">
              {/* Merge Option */}
              <button
                onClick={onMerge}
                className="btn btn-primary flex items-center gap-3 py-3.5 px-4 justify-start text-left"
              >
                <GitMerge size={20} />
                <div className="flex-1">
                  <div className="font-semibold mb-0.5">Merge Cards</div>
                  <div className="text-sm opacity-90">
                    Add {importCardCount} cards to existing deck
                  </div>
                </div>
              </button>

              {/* Rename Option */}
              {!showRenameInput ? (
                <button
                  onClick={() => setShowRenameInput(true)}
                  className="btn btn-secondary flex items-center gap-3 py-3.5 px-4 justify-start text-left"
                >
                  <Edit3 size={20} />
                  <div className="flex-1">
                    <div className="font-semibold">Create New Deck</div>
                    <div className="text-secondary text-sm">
                      Import as a new deck with a different name
                    </div>
                  </div>
                </button>
              ) : (
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--glass-border)] rounded-[var(--radius-lg)] space-y-3">
                  <div className="flex items-center gap-2">
                    <Edit3 size={18} className="text-[var(--accent)]" />
                    <div className="font-semibold">New Deck Name</div>
                  </div>
                  <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    className="input mb-2"
                    placeholder="Enter new deck name"
                    autoFocus
                  />
                  {error && (
                    <p className="text-[var(--danger)] text-sm m-0">
                      {error}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowRenameInput(false);
                        setNewName(suggestedName);
                        setError('');
                      }}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRename}
                      className="btn btn-primary flex-1"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer mt-6">
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
