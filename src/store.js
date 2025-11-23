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
        let unsubscribeDecks = () => {};
        let unsubscribeCards = () => {};

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
    }
}));
