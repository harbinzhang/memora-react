import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, RotateCw, CheckCircle, BookOpen } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const formatInterval = (days) => {
    if (days === 0) return '< 1m';

    // Handle sub-day intervals (minutes and hours)
    if (days < 1) {
        const totalMinutes = Math.round(days * 24 * 60);

        // Less than 1 hour: show minutes
        if (totalMinutes < 60) {
            return `${totalMinutes}m`;
        }

        // 1+ hours but less than 1 day: show hours
        const hours = Math.round(totalMinutes / 60);
        return `${hours}h`;
    }

    // Handle day-level intervals
    if (days >= 365) return `${(days / 365).toFixed(1)}y`;
    if (days >= 30) return `${(days / 30).toFixed(1)}mo`;
    return `${Math.round(days)}d`;
};

export default function ReviewSession() {
    const { deckId } = useParams();
    const { decks, getDueCards, getOverLearnCards, submitReview, updateDeck, calculateNextReview } = useStore();

    const deck = decks.find(d => d.id === deckId);

    // Capture review cards once at component mount to prevent recalculation during reviews
    const [reviewCards, setReviewCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [reviewStartTime, setReviewStartTime] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Initialize review cards once when component mounts or deckId changes
    useEffect(() => {
        const cards = getDueCards(deckId);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReviewCards(cards);
        if (cards.length === 0) {
             
            setIsFinished(true);
        }
    }, [deckId, getDueCards]);

    // Track when user flips the card to measure response time
    useEffect(() => {
        if (isFlipped && !reviewStartTime) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const handleOverLearn = () => {
        const overLearnCards = getOverLearnCards(deckId);
        if (overLearnCards.length > 0) {
            setReviewCards(overLearnCards);
            setIsFinished(false);
            setCurrentIndex(0);
        }
    };

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
                <div className="flex flex-col gap-3">
                    <Link to="/" className="btn btn-primary">Back to Dashboard</Link>
                    {noDueCards && (
                        <button
                            className="btn btn-secondary flex items-center justify-center gap-2"
                            onClick={() => setShowConfirmModal(true)}
                        >
                            <BookOpen size={18} />
                            Study Anyway (Over-learn)
                        </button>
                    )}
                </div>

                <ConfirmModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    title="Over-learn Mode"
                    message="You are about to study cards that are not yet due. Reviewing them now will reset their learning interval based on the current time. Do you want to proceed?"
                    confirmText="Start Over-learning"
                    onConfirm={handleOverLearn}
                />
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
                        className="btn border-danger text-danger hover:bg-danger hover:text-white transition-all flex flex-col items-center justify-center py-3"
                        onClick={handleAgain}
                        title="Review again today"
                    >
                        <span className="font-medium">Again</span>
                        <span className="text-xs opacity-80 font-normal mt-1">
                            {formatInterval(calculateNextReview(currentCard, 0).interval)}
                        </span>
                    </button>
                    <button
                        className="btn border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all flex flex-col items-center justify-center py-3"
                        onClick={handleHard}
                        title="Difficult, shorter interval"
                    >
                        <span className="font-medium">Hard</span>
                        <span className="text-xs opacity-80 font-normal mt-1">
                            {formatInterval(calculateNextReview(currentCard, 3).interval)}
                        </span>
                    </button>
                    <button
                        className="btn border-accent text-accent hover:bg-accent hover:text-white transition-all flex flex-col items-center justify-center py-3"
                        onClick={handleGood}
                        title="Normal difficulty"
                    >
                        <span className="font-medium">Good</span>
                        <span className="text-xs opacity-80 font-normal mt-1">
                            {formatInterval(calculateNextReview(currentCard, 4).interval)}
                        </span>
                    </button>
                    <button
                        className="btn border-success text-success hover:bg-success hover:text-white transition-all flex flex-col items-center justify-center py-3"
                        onClick={handleEasy}
                        title="Easy, longer interval"
                    >
                        <span className="font-medium">Easy</span>
                        <span className="text-xs opacity-80 font-normal mt-1">
                            {formatInterval(calculateNextReview(currentCard, 5).interval)}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
