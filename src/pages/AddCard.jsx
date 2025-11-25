import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { Save, X, ArrowLeft, Check, Command } from 'lucide-react';
import TagInput from '../components/TagInput';

export default function AddCard() {
    const navigate = useNavigate();
    const location = useLocation();
    const { decks, addCard } = useStore();

    // Get deckId from navigation state or default to first deck
    const [deckId, setDeckId] = useState(location.state?.deckId || (decks.length > 0 ? decks[0].id : ''));
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [tagList, setTagList] = useState([]);
    const [status, setStatus] = useState(''); // 'saving', 'success', 'error'

    // Get all unique tags from the selected deck for autocomplete
    const availableTags = useMemo(() => {
        const selectedDeck = decks.find(d => d.id === deckId);
        if (!selectedDeck?.cards) return [];

        const tagSet = new Set();
        selectedDeck.cards.forEach(card => {
            card.tags?.forEach(tag => tagSet.add(tag));
        });
        return Array.from(tagSet);
    }, [deckId, decks]);

    // Update deckId if decks load after component mount
    useEffect(() => {
        if (!deckId && decks.length > 0) {
             
            setDeckId(decks[0].id);
        }
    }, [decks, deckId]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!deckId || !front.trim() || !back.trim()) return;

        setStatus('saving');
        try {
            await addCard(deckId, front, back, tagList);

            // Clear form but keep deck selected
            setFront('');
            setBack('');
            setTagList([]);
            setStatus('success');

            // Reset status after 2 seconds
            setTimeout(() => setStatus(''), 2000);

            // Focus back on front input
            document.getElementById('front-input')?.focus();
        } catch (error) {
            console.error('Error adding card:', error);
            setStatus('error');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl/Cmd + Enter to submit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
            // Escape to cancel
            if (e.key === 'Escape') {
                navigate('/');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [front, back, tagList, deckId, navigate]);

    if (decks.length === 0) {
        return (
            <div className="animate-fade-in max-w-2xl mx-auto pt-6">
                <div className="card text-center p-8">
                    <h2 className="mb-4">No Decks Found</h2>
                    <p className="mb-6">You need to create a deck before you can add cards.</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary">
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="add-card-container mx-auto pt-8 pb-12">
            <form onSubmit={handleSubmit} className="main-form">
                {status === 'success' && (
                    <div className="status-message success mb-6">
                        <Check size={18} />
                        <span>Card added successfully!</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="status-message error mb-6">
                        Error adding card. Please try again.
                    </div>
                )}

                <div className="form-grid">
                    {/* Type Field */}
                    <div className="form-row">
                        <label className="label" htmlFor="type-input">Type</label>
                        <div className="input-wrapper">
                            <input
                                id="type-input"
                                type="text"
                                className="input readonly-input"
                                value="Basic"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Deck Selector */}
                    <div className="form-row">
                        <label className="label" htmlFor="deck-select">Deck</label>
                        <div className="input-wrapper">
                            <select
                                id="deck-select"
                                className="input"
                                value={deckId}
                                onChange={(e) => setDeckId(e.target.value)}
                                required
                            >
                                {decks.map(deck => (
                                    <option key={deck.id} value={deck.id}>
                                        {deck.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Front Input */}
                    <div className="form-row">
                        <label className="label" htmlFor="front-input">Front</label>
                        <div className="input-wrapper">
                            <div className="textarea-wrapper">
                                <textarea
                                    id="front-input"
                                    className="card-textarea"
                                    value={front}
                                    onChange={(e) => setFront(e.target.value)}
                                    required
                                    autoFocus
                                    maxLength={500}
                                    placeholder=""
                                />
                                <div className="char-counter">
                                    {front.length}/500
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Input */}
                    <div className="form-row">
                        <label className="label" htmlFor="back-input">Back</label>
                        <div className="input-wrapper">
                            <div className="textarea-wrapper">
                                <textarea
                                    id="back-input"
                                    className="card-textarea"
                                    value={back}
                                    onChange={(e) => setBack(e.target.value)}
                                    required
                                    maxLength={500}
                                    placeholder=""
                                />
                                <div className="char-counter">
                                    {back.length}/500
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div className="form-row">
                        <label className="label" htmlFor="tags-input">Tags</label>
                        <div className="input-wrapper">
                            <TagInput
                                tags={tagList}
                                onChange={setTagList}
                                suggestions={availableTags}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-row action-row">
                        <div className="label-spacer"></div>
                        <div className="input-wrapper">
                            <div className="action-container">
                                {/* Keyboard Shortcuts Info */}
                                <div className="shortcuts-info">
                                    <div className="shortcut-item">
                                        <kbd className="kbd">
                                            <Command size={12} />
                                            <span>⏎</span>
                                        </kbd>
                                        <span className="shortcut-desc">Submit</span>
                                    </div>
                                    <div className="shortcut-item">
                                        <kbd className="kbd">
                                            <span>Esc</span>
                                        </kbd>
                                        <span className="shortcut-desc">Cancel</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={status === 'saving' || !front.trim() || !back.trim()}
                                >
                                    {status === 'saving' ? 'Adding...' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <style jsx>{`
                .add-card-container {
                    width: 100%;
                    max-width: 800px;
                    padding-left: 1.5rem;
                    padding-right: 1.5rem;
                }

                .form-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    gap: 1.5rem;
                    align-items: start;
                }

                .label {
                    padding-top: 0.75rem; /* Align with input text */
                    font-weight: 500;
                    color: var(--text-primary);
                    margin: 0;
                }

                .input-wrapper {
                    width: 100%;
                }

                .input {
                    background-color: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    transition: all var(--transition-fast);
                }

                .input:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 2px hsla(var(--accent-hue), 91%, 60%, 0.2);
                    outline: none;
                }

                .readonly-input {
                    background-color: var(--bg-secondary);
                    color: var(--text-secondary);
                    cursor: default;
                }

                .textarea-wrapper {
                    position: relative;
                    width: 100%;
                }

                .card-textarea {
                    width: 100%;
                    height: 120px;
                    padding: 0.75rem 1rem;
                    padding-bottom: 2rem;
                    background-color: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-family: inherit;
                    font-size: 1rem;
                    line-height: 1.5;
                    resize: none;
                    overflow-y: auto;
                    transition: all var(--transition-fast);
                }

                .card-textarea:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 2px hsla(var(--accent-hue), 91%, 60%, 0.2);
                }

                .card-textarea::placeholder {
                    color: var(--text-muted);
                }

                .char-counter {
                    position: absolute;
                    bottom: 0.5rem;
                    right: 1rem;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    pointer-events: none;
                }

                /* Custom scrollbar for textarea */
                .card-textarea::-webkit-scrollbar {
                    width: 8px;
                }

                .card-textarea::-webkit-scrollbar-track {
                    background: transparent;
                }

                .card-textarea::-webkit-scrollbar-thumb {
                    background: var(--glass-border);
                    border-radius: 4px;
                }

                .card-textarea::-webkit-scrollbar-thumb:hover {
                    background: var(--text-secondary);
                }

                .status-message {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-sm);
                    font-size: 0.9rem;
                }

                .status-message.success {
                    background-color: hsla(142, 71%, 45%, 0.1);
                    color: var(--success);
                }

                .status-message.error {
                    background-color: hsla(0, 84%, 60%, 0.1);
                    color: var(--danger);
                }

                .action-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 2rem;
                }

                .shortcuts-info {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .shortcut-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                }

                .kbd {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--glass-border);
                    border-radius: 0.25rem;
                    font-family: ui-monospace, monospace;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }

                .shortcut-desc {
                    font-weight: 500;
                }

                /* Responsive */
                @media (max-width: 640px) {
                    .add-card-container {
                        padding-top: 1rem;
                        padding-bottom: 1.5rem;
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }

                    .form-grid {
                        gap: 1rem;
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                        gap: 0.5rem;
                    }

                    .label {
                        padding-top: 0;
                    }

                    .card-textarea {
                        height: 80px;
                    }

                    .action-row .label-spacer {
                        display: none;
                    }

                    .action-container {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1rem;
                    }

                    .shortcuts-info {
                        justify-content: center;
                        gap: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
