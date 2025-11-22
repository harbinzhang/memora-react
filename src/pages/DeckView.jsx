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
            <header className="flex items-center mb-8 gap-4">
                <Link to="/" className="text-secondary hover:text-primary transition-colors flex items-center">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="mb-1">{deck.name}</h1>
                    <p className="m-0">{deckCards.length} cards</p>
                </div>
                <Link to={`/review/${deckId}`} className="btn btn-primary">
                    Study Now
                </Link>
            </header>

            {/* Add Card Form */}
            <div className={`card mb-8 ${isAdding ? 'border-accent' : ''}`}>
                {!isAdding ? (
                    <button
                        className="btn w-full flex items-center justify-center gap-2"
                        onClick={() => { setIsAdding(true); setEditingId(null); setFront(''); setBack(''); setTags(''); }}
                    >
                        <Plus size={18} /> Add New Card
                    </button>
                ) : (
                    <form onSubmit={handleAddCard}>
                        <h3 className="mt-0">New Card</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="label">Front</label>
                                <textarea
                                    className="textarea"
                                    rows="2"
                                    value={front}
                                    onChange={e => setFront(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="label">Back</label>
                                <textarea
                                    className="textarea"
                                    rows="3"
                                    value={back}
                                    onChange={e => setBack(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="label">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    placeholder="vocab, noun, unit1"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Card</button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            {/* Card List */}
            <div className="flex flex-col gap-4">
                {deckCards.map(card => (
                    <div key={card.id} className="card p-6 mb-0">
                        {editingId === card.id ? (
                            <form onSubmit={handleUpdateCard}>
                                <div className="flex flex-col gap-4">
                                    <textarea className="textarea" rows="2" value={front} onChange={e => setFront(e.target.value)} />
                                    <textarea className="textarea" rows="3" value={back} onChange={e => setBack(e.target.value)} />
                                    <input className="input" value={tags} onChange={e => setTags(e.target.value)} />
                                    <div className="flex justify-end gap-4">
                                        <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary"><Save size={16} /> Save</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="font-medium mb-2">{card.front}</div>
                                    <div className="text-secondary whitespace-pre-wrap">{card.back}</div>
                                    {card.tags && card.tags.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {card.tags.map(tag => (
                                                <span key={tag} className="badge">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="btn p-2" onClick={() => startEdit(card)} title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn btn-danger p-2" onClick={() => deleteCard(card.id)} title="Delete">
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
