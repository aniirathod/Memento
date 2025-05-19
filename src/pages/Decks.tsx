import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import DeckCard from "@/components/DeckCard";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

const Decks = () => {
  const { decks } = useFlashcardStore();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Extract all unique tags from decks
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    decks.forEach((deck) => {
      deck.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  }, [decks]);

  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Filter and sort decks
  const filteredDecks = useMemo(() => {
    return decks
      .filter((deck) => {
        const matchesSearch =
          search === "" ||
          deck.name.toLowerCase().includes(search.toLowerCase()) ||
          deck.description.toLowerCase().includes(search.toLowerCase());

        const matchesTag =
          selectedTag === "all" || deck.tags.includes(selectedTag);

        return matchesSearch && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortBy === "cards") {
          return b.cardCount - a.cardCount;
        } else if (sortBy === "mastery") {
          const masteryA =
            a.cardCount > 0 ? (a.masteredCount / a.cardCount) * 100 : 0;
          const masteryB =
            b.cardCount > 0 ? (b.masteredCount / b.cardCount) * 100 : 0;
          return masteryB - masteryA;
        }
        return 0;
      });
  }, [decks, search, sortBy, selectedTag]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Decks</h1>
        <Link to="/dashboard/add">
          <Button size="sm" className="bg-black dark:bg-purple-500">
            <PlusIcon className="h-4 w-4 mr-1" />
            New Deck
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search decks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="cards">Card Count</SelectItem>
              <SelectItem value="mastery">Mastery</SelectItem>
            </SelectContent>
          </Select>

          {allTags.length > 0 && (
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="sm:w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedTag && (
          <div className="flex">
            <Badge className="mr-1">{selectedTag}</Badge>
            <button
              onClick={() => setSelectedTag("all")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Deck list */}
      {decks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            You haven't created any decks yet.
          </p>
          <Link to="/dashboard/add">
            <Button>Create Your First Deck</Button>
          </Link>
        </div>
      ) : filteredDecks.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredDecks.map((deck) => (
            <motion.div key={deck.id} variants={item}>
              <DeckCard deck={deck} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No decks match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Decks;
