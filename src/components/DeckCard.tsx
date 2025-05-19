import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Deck } from "@/features/flashcards/types";
import { BookOpenIcon } from "lucide-react";
import { MagicCard } from "./animation/MagicCard";
import useThemeStore from "@/store/useThemeStore";

interface DeckCardProps {
  deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
  const { theme } = useThemeStore((state) => state);
  const masteryPercentage =
    deck.cardCount > 0
      ? Math.round((deck.masteredCount / deck.cardCount) * 100)
      : 0;

  const cardsDueCount = deck.cardCount - deck.masteredCount;

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className=" border-none outline-none shadow-none">
        <MagicCard
          className="py-3 px-2"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <CardHeader className="pb-8">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg truncate">{deck.name}</h3>
              <div className="flex items-center text-muted-foreground">
                <span className="text-sm font-medium">{deck.cardCount}</span>
                <BookOpenIcon className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {deck.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {deck.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{deck.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pb-6">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {deck.description || "No description provided"}
            </p>
          </CardContent>

          <CardFooter className="flex flex-col items-start py-3">
            <div className="w-full flex justify-between items-center mb-1 text-sm">
              <span>Mastery</span>
              <span className="font-medium">{masteryPercentage}%</span>
            </div>
            <Progress value={masteryPercentage} className="w-full h-2" />

            <div className="w-full flex justify-between mt-4">
              <Link
                to={`/dashboard/review/${deck.id}`}
                className="text-sm text-primary hover:underline"
              >
                Review ({cardsDueCount})
              </Link>
              <Link
                to={`/dashboard/decks/${deck.id}`}
                className="text-sm text-primary hover:underline"
              >
                View Details
              </Link>
            </div>
          </CardFooter>
        </MagicCard>
      </Card>
    </motion.div>
  );
};

export default DeckCard;
