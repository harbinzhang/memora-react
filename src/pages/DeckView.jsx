import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

export default function DeckView() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { decks, cards, addCard, deleteCard, updateCard } = useStore();

    const deck = decks.find(d => d.id === deckId);
    const deckCards = cards.filter(c => c.deckId === deckId);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [tags, setTags] = useState('');

    if (!deck) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Deck not found</h2>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
        );
    }

    const handleAddCard = async (e) => {
        e.preventDefault();
        if (!front.trim() || !back.trim()) return;

        await addCard(deckId, front, back, tags.split(',').map(t => t.trim()).filter(Boolean));
        setFront('');
        setBack('');
        setTags('');
        setIsAdding(false);
    };

    const startEdit = (card) => {
        setEditingId(card.id);
        setFront(card.front);
        setBack(card.back);
        setTags(card.tags.join(', '));
    };

    const handleUpdateCard = async (e) => {
        e.preventDefault();
        if (!front.trim() || !back.trim()) return;

        await updateCard(editingId, {
            front,
            back,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        });
        setEditingId(null);
        setFront('');
        setBack('');
        setTags('');
    };

    return (
        <div className="animate-fade-in">
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <Link to="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0 }}>{deck.name}</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{deckCards.length} cards</p>
                </div>
                <Link to={`/review/${deckId}`} className="btn btn-primary">
                    Study Now
                </Link>
            </header>

            {/* Add Card Form */}
            <div className="card" style={{ border: isAdding ? '1px solid var(--accent)' : undefined }}>
                {!isAdding ? (
                    <button
                        className="btn"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={() => { setIsAdding(true); setEditingId(null); setFront(''); setBack(''); setTags(''); }}
                    >
                        <Plus size={18} /> Add New Card
                    </button>
                ) : (
                    <form onSubmit={handleAddCard}>
                        <h3 style={{ marginTop: 0 }}>New Card</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Front</label>
                                <textarea
                                    className="input"
                                    rows="2"
                                    value={front}
                                    onChange={e => setFront(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Back</label>
                                <textarea
                                    className="input"
                                    rows="3"
                                    value={back}
                                    onChange={e => setBack(e.target.value)}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    placeholder="vocab, noun, unit1"
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Card</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Card List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {deckCards.map(card => (
                    <div key={card.id} className="card" style={{ padding: '1.5rem', marginBottom: 0 }}>
                        {editingId === card.id ? (
                            <form onSubmit={handleUpdateCard}>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <textarea className="input" rows="2" value={front} onChange={e => setFront(e.target.value)} />
                                    <textarea className="input" rows="3" value={back} onChange={e => setBack(e.target.value)} />
                                    <input className="input" value={tags} onChange={e => setTags(e.target.value)} />
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                        <button type="button" className="btn" onClick={() => setEditingId(null)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary"><Save size={16} /> Save</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{card.front}</div>
                                    <div style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{card.back}</div>
                                    {card.tags && card.tags.length > 0 && (
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {card.tags.map(tag => (
                                                <span key={tag} className="badge">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <button className="btn" style={{ padding: '0.4rem' }} onClick={() => startEdit(card)}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => deleteCard(card.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
