import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Plus, BookOpen, Trash2 } from 'lucide-react';

export default function Dashboard() {
    const { decks, addDeck, deleteDeck } = useStore();
    const [newDeckName, setNewDeckName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

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
                <div className="flex gap-3">
                    <Link to="/add" className="btn btn-secondary">
                        <Plus size={18} />
                        Add Card
                    </Link>
                    <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
                        <Plus size={18} />
                        Create Deck
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
                {decks.map(deck => (
                    <div key={deck.id} className="card flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <Link to={`/deck/${deck.id}`} className="flex-1 group">
                                <h2 className="text-xl mb-1 group-hover:text-accent transition-colors">{deck.name}</h2>
                                <p className="text-sm text-secondary flex items-center gap-2">
                                    <BookOpen size={16} />
                                    {deck.cardCount || 0} cards
                                </p>
                            </Link>
                            <button
                                className="btn btn-danger p-2"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this deck?')) deleteDeck(deck.id);
                                }}
                                title="Delete Deck"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="flex gap-4 mt-auto">
                            <Link to={`/review/${deck.id}`} className="btn btn-primary flex-1">
                                Review Now
                            </Link>
                            <Link to={`/deck/${deck.id}`} className="btn btn-secondary flex-1">
                                Manage
                            </Link>
                        </div>
                    </div>
                ))}

                {decks.length === 0 && !isCreating && (
                    <div className="col-span-full text-center py-12 text-secondary">
                        <p>No decks yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
