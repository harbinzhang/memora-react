import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, RotateCw, CheckCircle } from 'lucide-react';

export default function ReviewSession() {
    const { deckId } = useParams();
    const { decks, getDueCards, submitReview, updateDeck } = useStore();

    const deck = decks.find(d => d.id === deckId);
    // Get cards that are due for review (with 20% flexibility window)
    const reviewCards = getDueCards(deckId);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [reviewStartTime, setReviewStartTime] = useState(null);

    useEffect(() => {
        if (reviewCards.length === 0) {
            setIsFinished(true);
        }
    }, [reviewCards]);

    // Track when user flips the card to measure response time
    useEffect(() => {
        if (isFlipped && !reviewStartTime) {
            setReviewStartTime(Date.now());
        }
    }, [isFlipped, reviewStartTime]);

    const currentCard = reviewCards[currentIndex];

    const handleFeedback = async (grade) => {
        // Calculate response time in seconds
        const responseTime = reviewStartTime
            ? (Date.now() - reviewStartTime) / 1000
            : 0;

        // Submit the review with SM-2 calculation
        await submitReview(currentCard.id, grade, responseTime);

        // Update deck's lastReviewed timestamp
        await updateDeck(deckId, { lastReviewed: new Date().toISOString() });

        // Reset state for next card
        setIsFlipped(false);
        setReviewStartTime(null);

        // Move to next card or finish
        if (currentIndex < reviewCards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const handleAgain = () => handleFeedback(0);  // Grade 0
    const handleHard = () => handleFeedback(3);   // Grade 3
    const handleGood = () => handleFeedback(4);   // Grade 4
    const handleEasy = () => handleFeedback(5);   // Grade 5

    if (!deck) return <div>Deck not found</div>;

    if (isFinished || reviewCards.length === 0) {
        const noDueCards = reviewCards.length === 0 && currentIndex === 0;

        return (
            <div className="animate-fade-in text-center mt-16 max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                    <CheckCircle size={64} className="text-success" />
                </div>
                <h1 className="mb-4">
                    {noDueCards ? 'No Cards Due!' : 'Session Complete!'}
                </h1>
                <p className="text-secondary mb-8">
                    {noDueCards
                        ? 'All cards in this deck are up to date. Come back later for review.'
                        : 'You have reviewed all due cards in this deck. Great job!'
                    }
                </p>
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
                <div className="animate-fade-in grid grid-cols-4 gap-3 mt-8">
                    <button
                        className="btn border-danger text-danger hover:bg-danger hover:text-white transition-all"
                        onClick={handleAgain}
                        title="Review again today"
                    >
                        Again
                    </button>
                    <button
                        className="btn border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all"
                        onClick={handleHard}
                        title="Difficult, shorter interval"
                    >
                        Hard
                    </button>
                    <button
                        className="btn border-accent text-accent hover:bg-accent hover:text-white transition-all"
                        onClick={handleGood}
                        title="Normal difficulty"
                    >
                        Good
                    </button>
                    <button
                        className="btn border-success text-success hover:bg-success hover:text-white transition-all"
                        onClick={handleEasy}
                        title="Easy, longer interval"
                    >
                        Easy
                    </button>
                </div>
            )}
        </div>
    );
}
