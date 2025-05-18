import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Decks from "./pages/Decks";
import DeckDetails from "./pages/DeckDetails";
import Review from "./pages/Review";
// import AIGeneratorPage from "./pages/AIGeneratorPage";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if it's the first visit to show onboarding
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");

    if (!hasVisitedBefore) {
      localStorage.setItem("hasVisitedBefore", "true");
      // This is where we would trigger the onboarding modal
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/add" element={<Add />} />
              <Route path="/decks" element={<Decks />} />
              <Route path="/decks/:id" element={<DeckDetails />} />
              <Route path="/review" element={<Review />} />
              <Route path="/review/:deckId" element={<Review />} />
              {/* <Route path="/ai-generator" element={<AIGeneratorPage />} /> */}
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
