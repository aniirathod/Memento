import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import DeckCard from "@/components/DeckCard";
import WelcomeMessage from "@/components/home/Welcomemessage";

const Home = () => {
  const { decks, flashcards, userStats } = useFlashcardStore();
  const [showWelcome, setShowWelcome] = useState(true);
  const [cardsToReview, setCardsToReview] = useState(0);

  // Count due cards across all decks
  useEffect(() => {
    const today = new Date();
    const dueCards = flashcards.filter((card) => {
      if (card.status === "new") return true;
      if (!card.dueDate) return true;
      return new Date(card.dueDate) <= today;
    });

    setCardsToReview(dueCards.length);
  }, [flashcards]);

  // Hide welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 ">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardContent className="pt-6">
                <h1 className="text-2xl font-bold mb-2">
                  Welcome to FlashLearn!
                </h1>
                <p className="opacity-90">
                  Start creating flashcards and improve your learning with
                  spaced repetition.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome message */}
      <WelcomeMessage cardsToReview={cardsToReview} />

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="bg-background-2">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Cards Due</p>
            <p className="text-2xl font-bold text-flashlearn-blue">
              {cardsToReview}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background-2">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Streak</p>
            <p className="text-2xl font-bold text-teal-600">
              {userStats.streakDays} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background-2">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Mastered</p>
            <p className="text-2xl font-bold text-flashlearn-accent">
              {userStats.masteredCards}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background-2">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="text-2xl font-bold text-purple-500">
              {userStats.xpPoints}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Review button */}
      {cardsToReview > 0 && (
        <div className="flex justify-center">
          <Link to="/review">
            <Button
              size="lg"
              className="bg-black dark:bg-purple-500 hover:bg-primary/90 px-8 "
            >
              Review {cardsToReview} Cards
            </Button>
          </Link>
        </div>
      )}

      {/* Recent decks */}
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Decks</h2>
          <Link to="/decks">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {decks.length === 0 ? (
          <Card>
            <CardContent className="pt-6 pb-8 flex flex-col items-center">
              <p className="text-muted-foreground mb-4">
                You don't have any decks yet. Create your first deck to get
                started!
              </p>
              <Link to="/add">
                <Button>Create Deck</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.slice(0, 4).map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
