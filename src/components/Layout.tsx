import { Link, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  HomeIcon,
  BookOpenIcon,
  BarChartIcon,
  PlusIcon,
  BookmarkIcon,
  Brain,
} from "lucide-react";
import { useFlashcardStore } from "@/features/flashcards/store/useFlashcardStore";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import { OnboardingDialog } from "./OnboardingDialog";
import StarBorder from "@/components/animation/StarBorder";

const Layout = () => {
  const location = useLocation();
  const { userStats } = useFlashcardStore();

  // Navigation items with their paths and icons
  const navItems = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      name: "Review",
      path: "/dashboard/review",
      icon: <BookOpenIcon className="h-5 w-5" />,
    },
    {
      name: "Add",
      path: "/dashboard/add",
      icon: <PlusIcon className="h-5 w-5" />,
    },
    {
      name: "Decks",
      path: "/dashboard/decks",
      icon: <BookmarkIcon className="h-5 w-5" />,
    },
    {
      name: "Stats",
      path: "/dashboard/stats",
      icon: <BarChartIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background-2">
      <OnboardingDialog />
      {/* Header */}

      <header className="border-b shadow-sm ">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold">Memento</span>
          </Link>

          <div className="flex items-center space-x-8">
            {/* User streak & level */}
            <div className="hidden md:flex items-center ">
              <StarBorder
                className="rounded-full px-4 py-1 space-x-5 bg-gradient-t0-b from-white to-white  dark:bg-gradient-to-b dark:from-black dark:to-gray-900 "
                starClass="rounded-full"
              >
                <span className="text-primary font-semibold">
                  🔥 {userStats.streakDays} days
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-primary">
                  Level {userStats.level}
                </span>
              </StarBorder>
            </div>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 shadow-lg border-t z-50 bg-background-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-3 px-4 text-muted-foreground transition-colors",
                  location.pathname === item.path && "text-primary"
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
