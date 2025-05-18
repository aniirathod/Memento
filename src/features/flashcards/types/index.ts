export type ReviewStatus = "new" | "learning" | "reviewing" | "mastered";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  tags: string[];
  deckId: string;
  createdAt: string;
  updatedAt: string;
  reviewHistory: Review[];
  easeFactor: number;
  interval: number;
  lastReviewed: string | null;
  dueDate: string | null;
  status: ReviewStatus;
  streak: number;
};

export type Review = {
  id: string;
  date: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5;
  wasCorrect: boolean;
};

export type Deck = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  cardCount: number;
  masteredCount: number;
  reviewingSoonCount: number;
};

export type UserStats = {
  streakDays: number;
  lastReviewDate: string | null;
  totalReviews: number;
  masteredCards: number;
  reviewsByDay: Record<string, number>;
  accuracy: number;
  xpPoints: number;
  level: number;
};
