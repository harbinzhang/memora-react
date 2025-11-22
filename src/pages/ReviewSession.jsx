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
            <div className="animate-fade-in text-center mt-16 max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                    <CheckCircle size={64} className="text-success" />
                </div>
                <h1 className="mb-4">Session Complete!</h1>
                <p className="text-secondary mb-8">You have reviewed all cards in this deck.</p>
                <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <header className="flex items-center mb-8">
                <Link to={`/deck/${deckId}`} className="text-secondary hover:text-primary mr-4 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <div className="flex justify-between items-end mb-2">
                        <h2 className="text-lg m-0 font-medium">Review: {deck.name}</h2>
                        <span className="text-sm text-secondary">
                            {currentIndex + 1} / {reviewCards.length}
                        </span>
                    </div>
                    <div className="h-1 bg-card rounded-full overflow-hidden">
                        <div
                            className="h-full bg-accent transition-all duration-300 ease-out"
                            style={{ width: `${((currentIndex) / reviewCards.length) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            <div
                className="card min-h-[300px] flex flex-col justify-center items-center cursor-pointer relative perspective-1000 group hover:border-accent/50 transition-colors"
                onClick={() => !isFlipped && setIsFlipped(true)}
            >
                <div className="text-center w-full p-8">
                    <h3 className="text-2xl mb-4 font-medium">{currentCard.front}</h3>

                    {isFlipped ? (
                        <div className="animate-fade-in border-t border-glass-border pt-6 mt-6">
                            <p className="text-xl text-secondary">{currentCard.back}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-secondary mt-8 opacity-50 group-hover:opacity-100 transition-opacity">
                            Click to show answer
                        </p>
                    )}
                </div>
            </div>

            {isFlipped && (
                <div className="animate-fade-in grid grid-cols-3 gap-4 mt-8">
                    <button
                        className="btn border-danger text-danger hover:bg-danger hover:text-white"
                        onClick={handleNext}
                    >
                        Again
                    </button>
                    <button
                        className="btn border-accent text-accent hover:bg-accent hover:text-white"
                        onClick={handleNext}
                    >
                        Good
                    </button>
                    <button
                        className="btn border-success text-success hover:bg-success hover:text-white"
                        onClick={handleNext}
                    >
                        Easy
                    </button>
                </div>
            )}
        </div>
    );
}
