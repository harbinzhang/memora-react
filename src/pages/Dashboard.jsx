import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Plus, BookOpen, Clock, Upload } from 'lucide-react';
import { parseImportFile } from '../utils/importParser';
import { useToast } from '../contexts/ToastContext';
import DuplicateDeckDialog from '../components/DuplicateDeckDialog';
import { findDeckByName } from '../utils/deckHelpers';

export default function Dashboard() {
    const { decks, addDeck, addCard, getDueCardCount } = useStore();
    const [newDeckName, setNewDeckName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [deckCreationError, setDeckCreationError] = useState('');
    const [duplicateDialog, setDuplicateDialog] = useState(null);
    const fileInputRef = useRef(null);
    const toast = useToast();

    const handleFileImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const content = event.target.result;
                const cards = parseImportFile(content);

                if (cards.length === 0) {
                    toast.error('No valid cards found in file');
                    return;
                }

                const deckName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                const existingDeck = findDeckByName(deckName, decks);

                // If duplicate found, show dialog
                if (existingDeck) {
                    setDuplicateDialog({
                        existingDeck,
                        importFileName: deckName,
                        importCardCount: cards.length,
                        cards
                    });
                    return;
                }

                // No duplicate, proceed with import
                await importCards(deckName, cards);

            } catch (error) {
                console.error('Import error:', error);
                toast.error('Error importing file');
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const importCards = async (deckName, cards) => {
        try {
            // Create deck and get the ID back (now that store.addDeck returns ID)
            const deckId = await addDeck(deckName, { skipDuplicateCheck: true });

            // Add cards to the deck
            for (const card of cards) {
                await addCard(deckId, card.front, card.back);
            }

            toast.success(`Successfully imported ${cards.length} cards into "${deckName}"`);
        } catch (error) {
            console.error('Import cards error:', error);
            toast.error('Error importing cards');
            throw error;
        }
    };

    const handleMergeCards = async () => {
        if (!duplicateDialog) return;

        const { existingDeck, cards, importFileName } = duplicateDialog;

        try {
            // Add cards to existing deck
            for (const card of cards) {
                await addCard(existingDeck.id, card.front, card.back);
            }

            toast.success(`Added ${cards.length} cards to existing deck "${importFileName}"`);
            setDuplicateDialog(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Merge error:', error);
            toast.error('Error merging cards');
        }
    };

    const handleRenameAndImport = async (newName) => {
        if (!duplicateDialog) return;

        const { cards } = duplicateDialog;

        try {
            await importCards(newName, cards);
            setDuplicateDialog(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Rename and import error:', error);
            toast.error('Error importing with new name');
        }
    };

    const handleCancelImport = () => {
        setDuplicateDialog(null);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        if (!newDeckName.trim()) return;

        try {
            await addDeck(newDeckName);
            setNewDeckName('');
            setIsCreating(false);
            setDeckCreationError('');
            toast.success('Deck created successfully');
        } catch (error) {
            setDeckCreationError(error.message);
        }
    };

    const handleDeckNameChange = (e) => {
        setNewDeckName(e.target.value);
        setDeckCreationError(''); // Clear error when user types
    };

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-4">
                <h1>Your Decks</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileImport}
                        accept=".txt,.csv,.tsv"
                        className="hidden"
                    />
                    <button
                        className="btn btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={18} />
                        Import
                    </button>
                    <Link to="/add" className="btn btn-secondary">
                        <Plus size={18} />
                        Card
                    </Link>
                    <button className="btn btn-secondary" onClick={() => setIsCreating(true)}>
                        <Plus size={18} />
                        Deck
                    </button>
                </div>
            </header>

            {isCreating && (
                <div className="card animate-fade-in mb-4">
                    <form onSubmit={handleCreateDeck}>
                        <h3>Create New Deck</h3>
                        <div className="input-group">
                            <input
                                type="text"
                                className="input"
                                placeholder="Deck Name (e.g., Japanese Vocabulary)"
                                value={newDeckName}
                                onChange={handleDeckNameChange}
                                autoFocus
                            />
                            {deckCreationError && (
                                <p className="text-red-400 text-sm mt-2">{deckCreationError}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                setIsCreating(false);
                                setDeckCreationError('');
                                setNewDeckName('');
                            }}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-decks">
                {decks.map(deck => {
                    const dueCount = getDueCardCount(deck.id);
                    const hasDueCards = dueCount > 0;

                    return (
                        <div key={deck.id} className="card flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <Link to={`/deck/${deck.id}`} className="flex-1 group">
                                    <h2 className="text-xl mb-1 group-hover:text-accent transition-colors">{deck.name}</h2>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-secondary flex items-center gap-2 m-0">
                                            <BookOpen size={16} />
                                            {deck.cardCount || 0} cards
                                        </p>
                                        {hasDueCards && (
                                            <p className="text-sm text-accent font-medium flex items-center gap-2 m-0">
                                                <Clock size={16} />
                                                {dueCount} due for review
                                            </p>
                                        )}
                                        {deck.lastReviewed && (
                                            <p className="text-xs text-secondary/70 flex items-center gap-2 m-0">
                                                <Clock size={14} />
                                                Last reviewed: {new Date(deck.lastReviewed).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </div>
                            <div className="flex gap-4 mt-auto">
                                <Link
                                    to={`/review/${deck.id}`}
                                    className={`btn flex-1 ${hasDueCards ? 'btn-primary' : 'btn-secondary opacity-60'}`}
                                >
                                    {hasDueCards ? `Review (${dueCount})` : 'Up to Date'}
                                </Link>
                                <Link to={`/deck/${deck.id}`} className="btn btn-secondary flex-1">
                                    Manage
                                </Link>
                            </div>
                        </div>
                    );
                })}

                {decks.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-12 text-secondary">
                        <p>No decks yet. Create one to get started!</p>
                    </div>
                )}
            </div>

            {/* Duplicate Deck Dialog */}
            {duplicateDialog && (
                <DuplicateDeckDialog
                    existingDeck={duplicateDialog.existingDeck}
                    importFileName={duplicateDialog.importFileName}
                    importCardCount={duplicateDialog.importCardCount}
                    allDecks={decks}
                    onMerge={handleMergeCards}
                    onRename={handleRenameAndImport}
                    onCancel={handleCancelImport}
                />
            )}
        </div>
    );
}
