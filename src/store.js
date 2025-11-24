import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';

// Check if Firebase is configured
const isFirebaseConfigured = () => {
    return !!db.app.options.apiKey;
};

export const useStore = create((set, get) => ({
    decks: [],
    cards: [],
    loading: false,
    error: null,
    theme: localStorage.getItem('memora_theme') || 'dark',
    user: null,
    loadingAuth: true,

    toggleTheme: () => {
        set(state => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('memora_theme', newTheme);
            return { theme: newTheme };
        });
    },

    setUser: (user) => {
        set({ user, loadingAuth: false });
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null });
        } catch (error) {
            console.error('Logout error:', error);
            set({ error: error.message });
        }
    },

    // Initialize listeners or load from local storage
    initialize: () => {
        let unsubscribeDecks = () => { };
        let unsubscribeCards = () => { };

        // Auth listener
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            set({ user: user || null, loadingAuth: false });

            // Clean up previous listeners
            unsubscribeDecks();
            unsubscribeCards();

            if (user && isFirebaseConfigured()) {
                // Firebase Realtime Listeners with user filtering
                const decksQuery = query(
                    collection(db, 'decks'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                unsubscribeDecks = onSnapshot(decksQuery, (snapshot) => {
                    const decks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    set({ decks });
                }, (error) => {
                    console.error("Firebase error:", error);
                    set({ error: error.message });
                });

                const cardsQuery = query(
                    collection(db, 'cards'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                unsubscribeCards = onSnapshot(cardsQuery, (snapshot) => {
                    const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    set({ cards });
                });
            } else if (!user) {
                // Clear data when logged out
                set({ decks: [], cards: [] });
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDecks();
            unsubscribeCards();
        };
    },

    addDeck: async (name) => {
        const user = get().user;
        if (!user) {
            throw new Error('Must be authenticated to create decks');
        }

        const newDeck = {
            name,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            cardCount: 0
        };

        if (isFirebaseConfigured()) {
            await addDoc(collection(db, 'decks'), newDeck);
        } else {
            const deckWithId = { ...newDeck, id: uuidv4() };
            const updatedDecks = [deckWithId, ...get().decks];
            set({ decks: updatedDecks });
            localStorage.setItem('memora_decks', JSON.stringify(updatedDecks));
        }
    },

    deleteDeck: async (id) => {
        if (isFirebaseConfigured()) {
            await deleteDoc(doc(db, 'decks', id));
            // Also delete associated cards (simplified for now)
        } else {
            const updatedDecks = get().decks.filter(d => d.id !== id);
            set({ decks: updatedDecks });
            localStorage.setItem('memora_decks', JSON.stringify(updatedDecks));

            // Delete associated cards
            const updatedCards = get().cards.filter(c => c.deckId !== id);
            set({ cards: updatedCards });
            localStorage.setItem('memora_cards', JSON.stringify(updatedCards));
        }
    },

    updateDeck: async (id, updates) => {
        if (isFirebaseConfigured()) {
            await updateDoc(doc(db, 'decks', id), updates);
        } else {
            const updatedDecks = get().decks.map(d =>
                d.id === id ? { ...d, ...updates } : d
            );
            set({ decks: updatedDecks });
            localStorage.setItem('memora_decks', JSON.stringify(updatedDecks));
        }
    },

    addCard: async (deckId, front, back, tags = []) => {
        const user = get().user;
        if (!user) {
            throw new Error('Must be authenticated to create cards');
        }

        const newCard = {
            deckId,
            userId: user.uid,
            front,
            back,
            tags,
            createdAt: new Date().toISOString(),
            nextReview: new Date().toISOString(), // Immediate review
            interval: 0, // 0 days
            easeFactor: 2.5,
            repetitions: 0
        };

        if (isFirebaseConfigured()) {
            await addDoc(collection(db, 'cards'), newCard);
            // Update deck card count
            const deckRef = doc(db, 'decks', deckId);
            // Note: In real app, use transaction or cloud function for count
        } else {
            const cardWithId = { ...newCard, id: uuidv4() };
            const updatedCards = [cardWithId, ...get().cards];
            set({ cards: updatedCards });
            localStorage.setItem('memora_cards', JSON.stringify(updatedCards));

            // Update deck count locally
            const updatedDecks = get().decks.map(d =>
                d.id === deckId ? { ...d, cardCount: (d.cardCount || 0) + 1 } : d
            );
            set({ decks: updatedDecks });
            localStorage.setItem('memora_decks', JSON.stringify(updatedDecks));
        }
    },

    updateCard: async (id, updates) => {
        if (isFirebaseConfigured()) {
            await updateDoc(doc(db, 'cards', id), updates);
        } else {
            const updatedCards = get().cards.map(c =>
                c.id === id ? { ...c, ...updates } : c
            );
            set({ cards: updatedCards });
            localStorage.setItem('memora_cards', JSON.stringify(updatedCards));
        }
    },

    deleteCard: async (id) => {
        if (isFirebaseConfigured()) {
            await deleteDoc(doc(db, 'cards', id));
        } else {
            const card = get().cards.find(c => c.id === id);
            const updatedCards = get().cards.filter(c => c.id !== id);
            set({ cards: updatedCards });
            localStorage.setItem('memora_cards', JSON.stringify(updatedCards));

            if (card) {
                const updatedDecks = get().decks.map(d =>
                    d.id === card.deckId ? { ...d, cardCount: Math.max(0, (d.cardCount || 0) - 1) } : d
                );
                set({ decks: updatedDecks });
                localStorage.setItem('memora_decks', JSON.stringify(updatedDecks));
            }
        }
    },

    // Custom Multiplier Spaced Repetition Algorithm
    // Calculate next review based on grade (0=Again, 3=Hard, 4=Good, 5=Easy)
    calculateNextReview: (card, grade) => {
        const MAX_INTERVAL = 365; // 1 year maximum
        let { interval, easeFactor, repetitions } = card;

        // If grade < 3 (Again button), reset the card
        if (grade < 3) {
            return {
                interval: 0,
                easeFactor: easeFactor, // Keep EF same or reset if desired
                repetitions: 0,
                nextReview: new Date().toISOString() // Review again today
            };
        }

        // Calculate new interval based on multipliers
        let newInterval;

        if (interval === 0) {
            // First successful review starts at 1 day
            newInterval = 1;
        } else {
            // Apply multipliers based on grade
            // Hard (3): x1.2
            // Good (4): x2.0 (Doubling)
            // Easy (5): x3.0 (Tripling)
            const multiplier = grade === 3 ? 1.2 : (grade === 4 ? 2.0 : 3.0);
            newInterval = Math.round(interval * multiplier);
        }

        // Cap at maximum interval (365 days)
        newInterval = Math.min(newInterval, MAX_INTERVAL);

        // Calculate next review date
        const nextReviewDate = new Date();
        nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

        return {
            interval: newInterval,
            easeFactor: easeFactor, // Unused in this simple logic but kept for schema compatibility
            repetitions: repetitions + 1,
            nextReview: nextReviewDate.toISOString()
        };
    },

    // Submit a review for a card
    submitReview: async (cardId, grade, responseTime) => {
        const user = get().user;
        if (!user) {
            throw new Error('Must be authenticated to submit reviews');
        }

        const card = get().cards.find(c => c.id === cardId);
        if (!card) {
            throw new Error('Card not found');
        }

        // Calculate new review parameters using SM-2
        const reviewResult = get().calculateNextReview(card, grade);

        // Update the card with new review parameters
        await get().updateCard(cardId, {
            ...reviewResult,
            lastGrade: grade,
            lastReview: new Date().toISOString()
        });

        // Save review history
        const reviewHistory = {
            cardId,
            userId: user.uid,
            grade,
            timestamp: new Date().toISOString(),
            responseTime,
            previousInterval: card.interval,
            newInterval: reviewResult.interval
        };

        if (isFirebaseConfigured()) {
            await addDoc(collection(db, 'reviewHistory'), reviewHistory);
        }

        return reviewResult;
    },

    // Get cards that are due for review (with 20% early review flexibility)
    getDueCards: (deckId) => {
        const now = new Date();
        const flexibilityWindow = 0.2; // 20% early review allowed

        return get().cards.filter(card => {
            if (card.deckId !== deckId) return false;

            const dueDate = new Date(card.nextReview);

            // Calculate flexible due date (20% earlier than scheduled)
            const earlyDate = new Date(dueDate);
            const flexibilityMs = card.interval * 24 * 60 * 60 * 1000 * flexibilityWindow;
            earlyDate.setTime(earlyDate.getTime() - flexibilityMs);

            // Card is due if current time is past the early review window
            return now >= earlyDate;
        });
    },

    // Get count of due cards for a specific deck
    getDueCardCount: (deckId) => {
        return get().getDueCards(deckId).length;
    },

    // Get cards that are NOT due for review, sorted by next review date
    getOverLearnCards: (deckId) => {
        const now = new Date();
        const flexibilityWindow = 0.2;

        return get().cards.filter(card => {
            if (card.deckId !== deckId) return false;

            const dueDate = new Date(card.nextReview);
            const earlyDate = new Date(dueDate);
            const flexibilityMs = card.interval * 24 * 60 * 60 * 1000 * flexibilityWindow;
            earlyDate.setTime(earlyDate.getTime() - flexibilityMs);

            // Card is NOT due if current time is before the early review window
            return now < earlyDate;
        }).sort((a, b) => new Date(a.nextReview) - new Date(b.nextReview));
    }
}));
