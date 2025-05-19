import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Flashcard } from "../types";
import { MagicCard } from "@/components/animation/MagicCard";
import useThemeStore from "@/store/useThemeStore";

interface FlashcardProps {
  card: Flashcard;
  showAnswer?: boolean;
  className?: string;
  onFlip?: () => void;
}

const FlashcardComponent: React.FC<FlashcardProps> = ({
  card,
  showAnswer = false,
  className,
  onFlip,
}) => {
  const { theme } = useThemeStore((state) => state);
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (onFlip) onFlip();
  };

  // Status color mapping
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    learning: "bg-yellow-100 text-yellow-800",
    reviewing: "bg-green-100 text-green-800",
    mastered: "bg-purple-100 text-purple-800",
  };

  return (
    <motion.div
      className={cn(" h-64 w-full max-w-md mx-auto", className)}
      onClick={handleFlip}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <MagicCard
        className="h-full w-full relative rounded-xl"
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="w-full h-full  [transform-style:preserve-3d]"
        >
          {/* Front of card (question) */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-center px-6 py-8 rounded-xl shadow-md backface-hidden",
              !isFlipped ? "z-10 " : "z-0 [backface-visibility:hidden]"
            )}
          >
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 ">
              {card.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{card.tags.length - 2}
                </Badge>
              )}
            </div>

            <div className="absolute top-2 right-2 ">
              <Badge className={cn("text-xs", statusColors[card.status])}>
                {card.status}
              </Badge>
            </div>

            <div className="text-lg md:text-xl font-medium text-center ">
              {card.front}
            </div>

            <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground ">
              Tap to flip
            </div>
          </div>

          {/* Back of card (answer) */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-center px-6 py-8 rounded-xl overflow-y-auto shadow-md backface-hidden [transform:rotateY(180deg)]",
              isFlipped ? "z-10" : "z-0 [backface-visibility:hidden]"
            )}
          >
            <div className="text-lg md:text-xl">{card.back}</div>

            <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">
              Tap to flip back
            </div>
          </div>
        </motion.div>
      </MagicCard>
    </motion.div>
  );
};

export default FlashcardComponent;
