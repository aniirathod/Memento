import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import { AnimatedGridPattern } from "../animation/AnimatedGridPattern";
import { cn } from "@/lib/utils";
import { ShinyButton } from "../animation/ShinyButton";

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
      <Card className="dark:bg-[#020817] relative">
        <CardContent className="p-6">
          <div className="absolute inset-0 z-0">
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.1}
              duration={3}
              repeatDelay={1}
              className={cn(
                "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
              )}
            />
          </div>
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

            <Link
              to={
                decks.length === 0
                  ? "/dashboard/decks"
                  : cardsToReview > 0
                  ? "/dashboard/review"
                  : "/dashboard/decks"
              }
            >
              <ShinyButton className="text-white bg-black dark:bg-purple-500 hover:bg-primary/90 cursor-pointer">
                <div className="flex items-center gap-2">
                  {decks.length === 0 ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Deck
                    </>
                  ) : cardsToReview > 0 ? (
                    <>
                      Start Reviewing
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Manage Decks
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </div>
              </ShinyButton>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeMessage;
