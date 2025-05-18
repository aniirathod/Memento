import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";
import { BookOpen, Layers, BarChart, Zap } from "lucide-react";

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);
  const handleClose = () => {
    setOpen(false);
  };

  const features = [
    {
      icon: <Layers className="h-8 w-8 text-primary dark:text-blue-600" />,
      title: "Create Flashcard Decks",
      description: "Organize your learning with custom decks and tags",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary dark:text-blue-600" />,
      title: "Spaced Repetition",
      description: "Review cards at optimal intervals for better retention",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary dark:text-blue-600" />,
      title: "Adaptive Quiz Mode",
      description:
        "Test your knowledge with quizzes that adapt to your performance",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary dark:text-blue-600" />,
      title: "Track Your Progress",
      description: "Visualize your learning journey with detailed statistics",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Memento!</DialogTitle>
          <DialogDescription>
            Your personal spaced repetition flashcard app for efficient learning
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {feature.icon}
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
