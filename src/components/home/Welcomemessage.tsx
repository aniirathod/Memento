import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";

const WelcomeMessage = ({ cardsToReview }: { cardsToReview: number }) => {
  const { decks } = useFlashcardStore();

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="dark:bg-[#020817]">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {getTimeBasedGreeting()}, {"Learner"}!
              </h2>
              <p className="text-muted-foreground">
                {cardsToReview > 0
                  ? `You have ${cardsToReview} cards due for review today.`
                  : "You're all caught up with your reviews!"}
              </p>
            </div>
            <div className="flex gap-2">
              {decks.length === 0 ? (
                <Button
                  asChild
                  className="dark:bg-purple-500 text-white bg-black"
                >
                  <Link to="/decks">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Deck
                  </Link>
                </Button>
              ) : cardsToReview > 0 ? (
                <Button
                  asChild
                  className="dark:bg-purple-500 text-white bg-black"
                >
                  <Link to="/review">
                    Start Reviewing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="dark:bg-purple-500 text-white bg-black"
                >
                  <Link to="/decks">
                    Manage Decks
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeMessage;
