import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import FlashcardComponent from "@/features/flashcards/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Review = () => {
  const { deckId } = useParams<{ deckId?: string }>();
  const navigate = useNavigate();
  const {
    decks,
    getCardsToReview,
    reviewCard,
    addXpPoints,
    activeDeckId,
    setActiveDeck,
  } = useFlashcardStore();

  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(
    deckId || activeDeckId || null
  );
  const [cards, setCards] = useState<ReturnType<typeof getCardsToReview>>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Load cards for review
  useEffect(() => {
    if (selectedDeckId) {
      const cardsToReview = getCardsToReview(selectedDeckId);
      setCards(cardsToReview);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      setReviewCount(0);
      setCorrectCount(0);
      setIsFinished(false);
      setActiveDeck(selectedDeckId);
    }
  }, [selectedDeckId, getCardsToReview, setActiveDeck]);

  const currentCard = cards[currentCardIndex];

  // Handle answer selection (0-5 quality scale from SM-2 algorithm)
  const handleAnswer = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return;

    // Record this answer
    reviewCard(currentCard.id, quality);

    // Update counts
    setReviewCount((prev) => prev + 1);
    if (quality >= 3) {
      setCorrectCount((prev) => prev + 1);
    }

    // Show a toast based on quality
    if (quality >= 4) {
      toast.success("Well done! You know this card well!");
      addXpPoints(2); // Bonus XP for high quality answers
    } else if (quality === 3) {
      toast.success("Good! You remembered this card.");
      addXpPoints(1);
    } else {
      toast("Keep practicing this card!");
    }

    // Move to next card or finish review
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      // Completed all cards
      setIsFinished(true);
      addXpPoints(5); // Bonus XP for completing review session
      toast.success("Review session completed!", {
        description: `You reviewed ${cards.length} cards`,
      });
    }
  };

  // Calculate accuracy percentage
  const accuracyPercentage =
    reviewCount > 0 ? Math.round((correctCount / reviewCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Review Cards</h1>

      {!selectedDeckId ? (
        <Card>
          <CardContent className="pt-6 flex justify-center items-center flex-col">
            <h2 className="text-xl font-bold mb-4">Select a Deck to Review</h2>

            {decks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any decks yet.
                </p>
                <Link to="/dashboard/add">
                  <Button>Create Your First Deck</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 ">
                <Select onValueChange={(value) => setSelectedDeckId(value)}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder="Choose a deck"
                      className="text-center w-full"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {decks.map((deck) => (
                      <SelectItem key={deck.id} value={deck.id}>
                        {deck.name} ({deck.cardCount} cards)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {isFinished ? (
            <div className="max-w-md mx-auto">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center ">
                  <div className="mb-6 flex items-center justify-center">
                    <CheckCircleIcon className="h-12 w-12 text-green-500" />
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    Review Session Complete!
                  </h2>

                  <p className="text-muted-foreground text-center mb-6">
                    You've reviewed all cards due in this deck.
                  </p>

                  <div className="w-full space-y-4 mb-8">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Accuracy</span>
                        <span className="text-sm font-medium">
                          {accuracyPercentage}%
                        </span>
                      </div>
                      <Progress value={accuracyPercentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Reviewed
                        </p>
                        <p className="text-xl font-bold">{reviewCount}</p>
                      </div>

                      <div className="text-center p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Correct</p>
                        <p className="text-xl font-bold">{correctCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button onClick={() => navigate("/")}>Return Home</Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsFinished(false);
                        const cardsToReview = getCardsToReview(selectedDeckId);
                        if (cardsToReview.length > 0) {
                          setCards(cardsToReview);
                          setCurrentCardIndex(0);
                          setShowAnswer(false);
                          setReviewCount(0);
                          setCorrectCount(0);
                        } else {
                          toast("No more cards to review!");
                        }
                      }}
                    >
                      Review Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {cards.length > 0 ? (
                <div className="max-w-md mx-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Card {currentCardIndex + 1} of {cards.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {decks.find((d) => d.id === selectedDeckId)?.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDeckId(null)}
                      >
                        Change
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Progress
                      value={(currentCardIndex / cards.length) * 100}
                      className="h-2"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCardIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FlashcardComponent
                        card={currentCard}
                        showAnswer={showAnswer}
                        onFlip={() => setShowAnswer(!showAnswer)}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-6">
                    {!showAnswer ? (
                      <div className="hidden">
                        <Button
                          size="lg"
                          onClick={() => setShowAnswer(true)}
                          className="px-8"
                        >
                          Show Answer
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-center text-sm text-muted-foreground mb-4">
                          How well did you know this card?
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <Button
                            variant="outline"
                            className="border-red-300 hover:bg-red-50"
                            onClick={() => handleAnswer(1)}
                          >
                            <XCircleIcon className="h-5 w-5 mr-1 text-red-500" />
                            Hard
                          </Button>
                          <Button
                            variant="outline"
                            className="border-yellow-300 hover:bg-yellow-50"
                            onClick={() => handleAnswer(3)}
                          >
                            Ok
                          </Button>
                          <Button
                            variant="outline"
                            className="border-green-300 hover:bg-green-50"
                            onClick={() => handleAnswer(5)}
                          >
                            <CheckCircleIcon className="h-5 w-5 mr-1 text-green-500" />
                            Easy
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <Alert>
                      <AlertTriangleIcon className="h-4 w-4" />
                      <AlertDescription>
                        No cards due for review in this deck.
                      </AlertDescription>
                    </Alert>
                    <div className="mt-6 flex justify-center">
                      <Button onClick={() => setSelectedDeckId(null)}>
                        Select Another Deck
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Review;
