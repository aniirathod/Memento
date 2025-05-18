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

const Add = () => {
  const { decks } = useFlashcardStore();
  const [selectedDeckId, setSelectedDeckId] = useState<string>("");

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Create</h1>

      <Tabs defaultValue="deck" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full bg-card">
          <TabsTrigger value="deck">New Deck</TabsTrigger>
          <TabsTrigger value="flashcard" disabled={decks.length === 0}>
            New Flashcard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deck">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create a New Deck</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateDeckForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcard">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create a New Flashcard</CardTitle>
            </CardHeader>
            <CardContent>
              {decks.length > 0 ? (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Select Deck
                    </label>
                    <Select
                      value={selectedDeckId}
                      onValueChange={setSelectedDeckId}
                    >
                      <SelectTrigger>
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
      </Tabs>
    </div>
  );
};

export default Add;
