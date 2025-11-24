import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import Pagination from '../components/Pagination';

const CARDS_PER_PAGE = 10;

export default function DeckView() {
    const { deckId } = useParams();
    const navigate = useNavigate();
    const { decks, cards, addCard, deleteCard, updateCard, deleteDeck } = useStore();

    const deck = decks.find(d => d.id === deckId);
    const deckCards = cards.filter(c => c.deckId === deckId);

    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Form State
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [tags, setTags] = useState('');

    // Calculate pagination
    const totalPages = Math.ceil(deckCards.length / CARDS_PER_PAGE);
    const indexOfLastCard = currentPage * CARDS_PER_PAGE;
    const indexOfFirstCard = indexOfLastCard - CARDS_PER_PAGE;
    const currentCards = deckCards.slice(indexOfFirstCard, indexOfLastCard);

    // Reset to page 1 when deck changes or cards are added/deleted
    useEffect(() => {
        setCurrentPage(1);
    }, [deckId, deckCards.length]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!deck) {
        return (
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                <h2>Deck not found</h2>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
        );
    }

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

            {/* Add Card Button */}
            <div className="mb-8">
                <Link
                    to="/add"
                    state={{ deckId: deck.id }}
                    className="btn w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-glass-border hover:border-accent hover:text-accent transition-all"
                >
                    <Plus size={20} />
                    Add New Card to {deck.name}
                </Link>
            </div>

            {/* Card List */}
            <div className="flex flex-col gap-4">
                {currentCards.map(card => (
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

            {/* Pagination */}
            {deckCards.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={deckCards.length}
                    itemsPerPage={CARDS_PER_PAGE}
                />
            )}

            <div className="mt-12 border-t border-glass-border pt-8">
                <h3 className="text-danger mb-4">Danger Zone</h3>
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
                            deleteDeck(deck.id);
                            navigate('/');
                        }
                    }}
                >
                    <Trash2 size={18} />
                    Delete Deck
                </button>
            </div>
        </div>
    );
}
