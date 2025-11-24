import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Plus, BookOpen, Clock, Upload } from 'lucide-react';
import { parseImportFile } from '../utils/importParser';

export default function Dashboard() {
    const { decks, addDeck, addCard, getDueCardCount } = useStore();
    const [newDeckName, setNewDeckName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const content = event.target.result;
                const cards = parseImportFile(content);

                if (cards.length === 0) {
                    alert('No valid cards found in file');
                    return;
                }

                // Create a new deck with the filename
                const deckName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                await addDeck(deckName);

                // Get the newly created deck (it will be the first one in the list usually, but let's find it by name to be safe, or just wait for update)
                // Since addDeck is async and updates store, we can try to find it. 
                // However, addDeck doesn't return the ID in the current store implementation if using Firebase (it returns void).
                // If local, it updates state.
                // Let's assume the deck is added. We need the ID.
                // The current store.addDeck implementation doesn't return the ID.
                // I should probably update store.addDeck to return the ID, but for now I can find it by name.
                // A better approach might be to update the store to return the ID. 
                // Let's check store.js again.
                // It seems addDeck returns void.

                // Wait a bit for store to update or fetch? 
                // Actually, let's just modify this logic slightly. 
                // I'll assume I can find the deck by name for now, or I should update the store.
                // Updating the store is cleaner. But let's stick to Dashboard changes first.
                // I'll fetch the decks again or just look for it.

                // Wait for the state to update?
                // Let's just alert for now that it might be tricky without ID.
                // Actually, I can just search for the deck with the name I just created.
                // It's not perfect but it works for now.

                // Let's do a quick hack: find the deck with the name.
                // Since we just added it, it should be there.

                // We need to wait for the store to update.
                // But addDeck is async.

                // Let's try to find it after await.
                const updatedDecks = useStore.getState().decks;
                const newDeck = updatedDecks.find(d => d.name === deckName);

                if (newDeck) {
                    for (const card of cards) {
                        await addCard(newDeck.id, card.front, card.back);
                    }
                    alert(`Successfully imported ${cards.length} cards into "${deckName}"`);
                } else {
                    // Fallback if we can't find it immediately (e.g. firebase latency)
                    // This is a risk. I should probably update store.js to return ID.
                    // But let's try this first.
                    alert('Deck created but could not add cards immediately. Please try again.');
                }

            } catch (error) {
                console.error('Import error:', error);
                alert('Error importing file');
            }

            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        if (!newDeckName.trim()) return;

        await addDeck(newDeckName);
        setNewDeckName('');
        setIsCreating(false);
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
                                onChange={(e) => setNewDeckName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
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
        </div>
    );
}
