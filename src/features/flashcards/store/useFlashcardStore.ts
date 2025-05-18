import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Flashcard,
  Deck,
  UserStats,
  Review,
  ReviewStatus,
} from "../types";
import { calculateNextReview } from "../utils/spaced-repetition";

interface FlashcardState {
  decks: Deck[];
  flashcards: Flashcard[];
  userStats: UserStats;
  activeDeckId: string | null;
  activeCardId: string | null;

  // Deck actions
  createDeck: (name: string, description: string, tags: string[]) => Deck;
  updateDeck: (id: string, updates: Partial<Omit<Deck, "id">>) => void;
  deleteDeck: (id: string) => void;
  setActiveDeck: (id: string | null) => void;

  // Flashcard actions
  createFlashcard: (
    deckId: string,
    front: string,
    back: string,
    tags: string[]
  ) => Flashcard;
  updateFlashcard: (
    id: string,
    updates: Partial<Omit<Flashcard, "id">>
  ) => void;
  deleteFlashcard: (id: string) => void;
  setActiveCard: (id: string | null) => void;

  // Review actions
  reviewCard: (cardId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  getCardsToReview: (deckId: string, limit?: number) => Flashcard[];

  // Stats actions
  updateStreak: () => void;
  addXpPoints: (points: number) => void;
}

// Create the store with persist middleware
export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      decks: [],
      flashcards: [],
      activeDeckId: null,
      activeCardId: null,
      userStats: {
        streakDays: 0,
        lastReviewDate: null,
        totalReviews: 0,
        masteredCards: 0,
        reviewsByDay: {},
        accuracy: 100,
        xpPoints: 0,
        level: 1,
      },

      // Deck actions
      createDeck: (name, description, tags) => {
        const newDeck: Deck = {
          id: uuidv4(),
          name,
          description,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          cardCount: 0,
          masteredCount: 0,
          reviewingSoonCount: 0,
        };

        set((state) => ({
          decks: [...state.decks, newDeck],
        }));

        return newDeck;
      },

      updateDeck: (id, updates) => {
        set((state) => ({
          decks: state.decks.map((deck) =>
            deck.id === id
              ? { ...deck, ...updates, updatedAt: new Date().toISOString() }
              : deck
          ),
        }));
      },

      deleteDeck: (id) => {
        // Remove deck and its flashcards
        set((state) => ({
          decks: state.decks.filter((deck) => deck.id !== id),
          flashcards: state.flashcards.filter((card) => card.deckId !== id),
        }));
      },

      setActiveDeck: (id) => {
        set({ activeDeckId: id });
      },

      // Flashcard actions
      createFlashcard: (deckId, front, back, tags) => {
        const newFlashcard: Flashcard = {
          id: uuidv4(),
          front,
          back,
          tags,
          deckId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reviewHistory: [],
          easeFactor: 2.5, // Initial ease factor
          interval: 0, // Days until next review
          lastReviewed: null,
          dueDate: null, // Due immediately
          status: "new",
          streak: 0,
        };

        set((state) => {
          // Update card count in the deck
          const updatedDecks = state.decks.map((deck) =>
            deck.id === deckId
              ? {
                  ...deck,
                  cardCount: deck.cardCount + 1,
                  updatedAt: new Date().toISOString(),
                }
              : deck
          );

          return {
            flashcards: [...state.flashcards, newFlashcard],
            decks: updatedDecks,
          };
        });

        return newFlashcard;
      },

      updateFlashcard: (id, updates) => {
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id
              ? { ...card, ...updates, updatedAt: new Date().toISOString() }
              : card
          ),
        }));
      },

      deleteFlashcard: (id) => {
        const { flashcards } = get();
        const cardToDelete = flashcards.find((card) => card.id === id);

        if (!cardToDelete) return;

        set((state) => {
          // Update card count in the deck
          const updatedDecks = state.decks.map((deck) =>
            deck.id === cardToDelete.deckId
              ? {
                  ...deck,
                  cardCount: Math.max(0, deck.cardCount - 1),
                  // If the card was mastered, decrement mastered count
                  masteredCount:
                    cardToDelete.status === "mastered"
                      ? Math.max(0, deck.masteredCount - 1)
                      : deck.masteredCount,
                  updatedAt: new Date().toISOString(),
                }
              : deck
          );

          return {
            flashcards: state.flashcards.filter((card) => card.id !== id),
            decks: updatedDecks,
          };
        });
      },

      setActiveCard: (id) => {
        set({ activeCardId: id });
      },

      // Review actions
      reviewCard: (cardId, quality) => {
        const { flashcards, userStats } = get();
        const card = flashcards.find((c) => c.id === cardId);

        if (!card) return;

        const wasCorrect = quality >= 3;
        const today = new Date().toISOString().split("T")[0];

        // Calculate next review data using SM-2 algorithm
        const { interval, easeFactor, status, streak, dueDate } =
          calculateNextReview(card, quality);

        const newReview: Review = {
          id: uuidv4(),
          date: new Date().toISOString(),
          quality,
          wasCorrect,
        };

        // Update flashcard
        const updatedCard: Flashcard = {
          ...card,
          interval,
          easeFactor,
          status,
          streak,
          dueDate,
          lastReviewed: new Date().toISOString(),
          reviewHistory: [...card.reviewHistory, newReview],
        };

        // Update user stats
        let updatedStats = { ...userStats };

        // Update review count for today
        const reviewsByDay = { ...updatedStats.reviewsByDay };
        reviewsByDay[today] = (reviewsByDay[today] || 0) + 1;

        // Update total stats
        updatedStats.totalReviews += 1;

        // Update accuracy
        const totalReviews = updatedStats.totalReviews;
        const correctReviews = wasCorrect
          ? (totalReviews - 1) * (updatedStats.accuracy / 100) + 1
          : (totalReviews - 1) * (updatedStats.accuracy / 100);

        updatedStats.accuracy = Math.round(
          (correctReviews / totalReviews) * 100
        );

        // Check if card status was changed to mastered
        if (status === "mastered" && card.status !== "mastered") {
          updatedStats.masteredCards += 1;

          // Update deck's mastered count
          set((state) => ({
            decks: state.decks.map((deck) =>
              deck.id === card.deckId
                ? { ...deck, masteredCount: deck.masteredCount + 1 }
                : deck
            ),
          }));

          // Award XP for mastering a card
          updatedStats.xpPoints += 10;
        }

        // Update flashcards with the reviewed card
        set((state) => ({
          flashcards: state.flashcards.map((c) =>
            c.id === cardId ? updatedCard : c
          ),
          userStats: {
            ...updatedStats,
            reviewsByDay,
          },
        }));

        // After review is done, update streak
        get().updateStreak();
      },

      getCardsToReview: (deckId, limit = 20) => {
        const { flashcards } = get();
        const today = new Date();

        // Get cards from the specified deck that are due for review
        const dueCards = flashcards
          .filter((card) => {
            // Include cards from this deck
            if (card.deckId !== deckId) return false;

            // New cards are always due
            if (card.status === "new") return true;

            // Cards with no due date are due
            if (!card.dueDate) return true;

            // Check if the due date is today or earlier
            const dueDate = new Date(card.dueDate);
            return dueDate <= today;
          })
          .sort((a, b) => {
            // Prioritize new cards, then by due date
            if (a.status === "new" && b.status !== "new") return -1;
            if (a.status !== "new" && b.status === "new") return 1;

            // If both have due dates, sort by earliest
            if (a.dueDate && b.dueDate) {
              return (
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              );
            }

            return 0;
          })
          .slice(0, limit);

        return dueCards;
      },

      // Stats actions
      updateStreak: () => {
        set((state) => {
          const { userStats } = state;
          const today = new Date().toISOString().split("T")[0];
          const lastReviewDate = userStats.lastReviewDate?.split("T")[0];

          let streakDays = userStats.streakDays;
          let xpPoints = userStats.xpPoints;

          // If this is the first review ever
          if (!lastReviewDate) {
            streakDays = 1;
            xpPoints += 5; // First day bonus
          }
          // If reviewed today already, streak remains the same
          else if (lastReviewDate === today) {
            // No change to streak
          }
          // If reviewed yesterday, increment streak
          else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];

            if (lastReviewDate === yesterdayStr) {
              streakDays += 1;

              // Award XP for streak milestone
              if (streakDays % 7 === 0) {
                xpPoints += 50; // Weekly streak bonus
              } else {
                xpPoints += 5; // Daily streak bonus
              }
            }
            // Streak broken
            else {
              streakDays = 1;
            }
          }

          // Calculate level based on XP
          // Level formula: level = 1 + floor(sqrt(xp / 100))
          const level = 1 + Math.floor(Math.sqrt(xpPoints / 100));

          return {
            userStats: {
              ...userStats,
              streakDays,
              lastReviewDate: new Date().toISOString(),
              xpPoints,
              level,
            },
          };
        });
      },

      addXpPoints: (points) => {
        set((state) => {
          const newXpPoints = state.userStats.xpPoints + points;
          // Recalculate level
          const level = 1 + Math.floor(Math.sqrt(newXpPoints / 100));

          return {
            userStats: {
              ...state.userStats,
              xpPoints: newXpPoints,
              level,
            },
          };
        });
      },
    }),
    {
      name: "flashlearn-storage",
      // Optional merge function to handle version changes
      merge: (persistedState: unknown, currentState: FlashcardState) => {
        const typedState = persistedState as Partial<FlashcardState>;

        return {
          ...currentState,
          ...typedState,
          userStats: {
            ...currentState.userStats,
            ...typedState.userStats,
          },
        };
      },
    }
  )
);

export default useFlashcardStore;
