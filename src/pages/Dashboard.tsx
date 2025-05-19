import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import DeckCard from "@/components/DeckCard";
import WelcomeMessage from "@/components/home/Welcomemessage";
import { ShinyButton } from "@/components/animation/ShinyButton";

const DashboardHome = () => {
  const { decks, flashcards, userStats } = useFlashcardStore();
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

  return (
    <div className="space-y-6 ">
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
          <Link to="/dashboard/review">
            <ShinyButton className="text-white bg-black dark:bg-purple-500 hover:bg-primary/90 px-8 cursor-pointer">
              Review {cardsToReview} Cards
            </ShinyButton>
          </Link>
        </div>
      )}

      {/* Recent decks */}
      <div className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Decks</h2>
          <Link to="/dashboard/decks">
            <Button
              size="sm"
              className="bg-black dark:bg-purple-500 text-white cursor-pointer"
            >
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
              <Link to="/dashboard/add">
                <Button>Create Deck</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {decks.slice(0, 3).map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
