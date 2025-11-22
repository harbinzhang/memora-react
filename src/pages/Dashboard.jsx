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
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Your Decks</h1>
                <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
                    <Plus size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Create Deck
                </button>
            </header>

            {isCreating && (
                <div className="card animate-fade-in">
                    <form onSubmit={handleCreateDeck}>
                        <h3>Create New Deck</h3>
                        <input
                            type="text"
                            className="input"
                            placeholder="Deck Name (e.g., Japanese Vocabulary)"
                            value={newDeckName}
                            onChange={(e) => setNewDeckName(e.target.value)}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn" onClick={() => setIsCreating(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Create</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {decks.map(deck => (
                    <div key={deck.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Link to={`/deck/${deck.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                                <h2 style={{ marginTop: 0 }}>{deck.name}</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    <BookOpen size={16} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                                    {deck.cardCount || 0} cards
                                </p>
                            </Link>
                            <button
                                className="btn btn-danger"
                                style={{ padding: '0.4rem', marginLeft: '1rem' }}
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this deck?')) deleteDeck(deck.id);
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <Link to={`/review/${deck.id}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                                Review Now
                            </Link>
                            <Link to={`/deck/${deck.id}`} className="btn" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                                Manage
                            </Link>
                        </div>
                    </div>
                ))}

                {decks.length === 0 && !isCreating && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <p>No decks yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
