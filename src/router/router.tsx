import { createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import DashboardHome from "@/pages/Dashboard";
import Add from "@/pages/Add";
import Decks from "@/pages/Decks";
import DeckDetail from "@/pages/DeckDetails";
import Review from "@/pages/Review";
import Stats from "@/pages/Stats";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "add", element: <Add /> },
      { path: "decks", element: <Decks /> },
      { path: "decks/:id", element: <DeckDetail /> },
      { path: "review", element: <Review /> },
      { path: "review/:deckId", element: <Review /> },
      { path: "stats", element: <Stats /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
