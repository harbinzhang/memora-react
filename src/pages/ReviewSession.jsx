import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, RotateCw, CheckCircle } from 'lucide-react';

export default function ReviewSession() {
    const { deckId } = useParams();
    const { decks, cards } = useStore();

    const deck = decks.find(d => d.id === deckId);
    // Simple review logic: just show all cards in the deck for now
    // In a real app, filter by due date
    const reviewCards = cards.filter(c => c.deckId === deckId);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (reviewCards.length === 0) {
            setIsFinished(true);
        }
    }, [reviewCards]);

    const currentCard = reviewCards[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        if (currentIndex < reviewCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (!deck) return <div>Deck not found</div>;

    if (isFinished) {
        return (
            <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
                <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
                <h1>Session Complete!</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You have reviewed all cards in this deck.</p>
                <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to={`/deck/${deckId}`} style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}>
                    <ArrowLeft size={20} />
                </Link>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Review: {deck.name}</h2>
                    <div style={{ height: '4px', background: 'var(--bg-card)', marginTop: '0.5rem', borderRadius: '2px' }}>
                        <div
                            style={{
                                height: '100%',
                                background: 'var(--accent)',
                                width: `${((currentIndex) / reviewCards.length) * 100}%`,
                                borderRadius: '2px',
                                transition: 'width 0.3s'
                            }}
                        />
                    </div>
                </div>
                <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {currentIndex + 1} / {reviewCards.length}
                </span>
            </header>

            <div
                className="card"
                style={{
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    perspective: '1000px'
                }}
                onClick={() => !isFlipped && setIsFlipped(true)}
            >
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{currentCard.front}</h3>

                    {isFlipped && (
                        <div className="animate-fade-in" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{currentCard.back}</p>
                        </div>
                    )}

                    {!isFlipped && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2rem' }}>
                            Click to show answer
                        </p>
                    )}
                </div>
            </div>

            {isFlipped && (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                    <button className="btn" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleNext}>
                        Again
                    </button>
                    <button className="btn" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={handleNext}>
                        Good
                    </button>
                    <button className="btn" style={{ borderColor: 'var(--success)', color: 'var(--success)' }} onClick={handleNext}>
                        Easy
                    </button>
                </div>
            )}
        </div>
    );
}
