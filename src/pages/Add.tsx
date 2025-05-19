import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateDeckForm from "@/features/decks/components/CreateDeckForm";
import CreateFlashcardForm from "@/features/flashcards/components/CreateFlashcardForm";
import { useFlashcardStore } from "@/features/flashcards/store/useFlashcardStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagicCard } from "@/components/animation/MagicCard";
import useThemeStore from "@/store/useThemeStore";

const Add = () => {
  const { decks } = useFlashcardStore();
  const { theme } = useThemeStore((state) => state);
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create</h1>

      <Tabs defaultValue="deck" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full bg-card">
          <TabsTrigger value="deck" className="cursor-pointer">
            New Deck
          </TabsTrigger>
          <TabsTrigger
            value="flashcard"
            className="cursor-pointer"
            disabled={decks.length === 0}
          >
            New Flashcard
          </TabsTrigger>
        </TabsList>

        <MagicCard
          className="rounded-xl"
          gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        >
          <TabsContent value="deck">
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Create a New Deck</CardTitle>
              </CardHeader>
              <CardContent>
                <CreateDeckForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcard">
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle className="text-lg">
                  Create a New Flashcard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {decks.length > 0 ? (
                  <>
                    <div className="mb-6 w-full">
                      <label className="block text-sm font-medium mb-2">
                        Select Deck
                      </label>
                      <Select
                        value={selectedDeckId}
                        onValueChange={setSelectedDeckId}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a deck" />
                        </SelectTrigger>
                        <SelectContent>
                          {decks.map((deck) => (
                            <SelectItem key={deck.id} value={deck.id}>
                              {deck.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedDeckId && (
                      <CreateFlashcardForm deckId={selectedDeckId} />
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    You need to create a deck first before adding flashcards.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </MagicCard>
      </Tabs>
    </div>
  );
};

export default Add;
