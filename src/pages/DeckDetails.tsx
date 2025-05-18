import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useFlashcardStore from "@/features/flashcards/store/useFlashcardStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangleIcon,
  ListIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import CreateFlashcardForm from "@/features/flashcards/components/CreateFlashcardForm";
import FlashcardComponent from "@/features/flashcards/components/Flashcard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DeckDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { decks, flashcards, deleteDeck, deleteFlashcard } =
    useFlashcardStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("cards");

  const deck = useMemo(() => decks.find((d) => d.id === id), [decks, id]);

  const deckCards = useMemo(() => {
    if (!deck) return [];

    return flashcards
      .filter((card) => card.deckId === id)
      .filter((card) => {
        if (!searchTerm) return true;
        return (
          card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      });
  }, [id, flashcards, deck, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!deck || !deckCards.length) {
      return {
        newCards: 0,
        learningCards: 0,
        reviewingCards: 0,
        masteredCards: 0,
        masteryPercentage: 0,
      };
    }

    const newCards = deckCards.filter((card) => card.status === "new").length;
    const learningCards = deckCards.filter(
      (card) => card.status === "learning"
    ).length;
    const reviewingCards = deckCards.filter(
      (card) => card.status === "reviewing"
    ).length;
    const masteredCards = deckCards.filter(
      (card) => card.status === "mastered"
    ).length;
    const masteryPercentage = (masteredCards / deckCards.length) * 100;

    return {
      newCards,
      learningCards,
      reviewingCards,
      masteredCards,
      masteryPercentage,
    };
  }, [deck, deckCards]);

  if (!deck) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              Deck not found. The deck might have been deleted.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => navigate("/decks")}>Return to Decks</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteDeck = () => {
    deleteDeck(deck.id);
    toast.success(`Deck "${deck.name}" deleted successfully`);
    navigate("/decks");
  };

  const handleDeleteCard = (cardId: string) => {
    deleteFlashcard(cardId);
    toast.success("Card deleted successfully");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{deck.name}</CardTitle>
              <CardDescription className="mt-2">
                {deck.description || "No description provided"}
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/review/${deck.id}`)}
              >
                Review Deck
              </Button>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete deck</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this deck? This will also
                      delete all {deck.cardCount} flashcards in this deck. This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteDeck}>
                      Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {deck.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-xl font-bold text-blue-600">
                  {stats.newCards}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Learning</p>
                <p className="text-xl font-bold text-yellow-600">
                  {stats.learningCards}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Reviewing</p>
                <p className="text-xl font-bold text-green-600">
                  {stats.reviewingCards}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Mastered</p>
                <p className="text-xl font-bold text-purple-600">
                  {stats.masteredCards}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Mastery progress</p>
              <p className="text-sm font-medium">
                {Math.round(stats.masteryPercentage)}%
              </p>
            </div>
            <Progress value={stats.masteryPercentage} className="h-2" />
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cards" className="flex items-center">
                <ListIcon className="h-4 w-4 mr-2" />
                Cards ({deckCards.length})
              </TabsTrigger>
              <TabsTrigger value="add">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Card
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards">
              {deckCards.length > 0 ? (
                <>
                  <div className="my-4">
                    <Input
                      placeholder="Search cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Front</TableHead>
                          <TableHead>Back</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Reviewed</TableHead>
                          <TableHead className="w-14">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deckCards.map((card) => (
                          <TableRow key={card.id}>
                            <TableCell className="max-w-[200px] truncate">
                              {card.front}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {card.back}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  card.status === "new"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : card.status === "learning"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : card.status === "reviewing"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                }
                                variant="outline"
                              >
                                {card.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {card.lastReviewed
                                ? format(
                                    new Date(card.lastReviewed),
                                    "MMM d, yyyy"
                                  )
                                : "Never"}
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDeleteCard(card.id)}
                                  >
                                    <Trash2Icon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {searchTerm && deckCards.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No cards match your search.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    This deck doesn't have any flashcards yet.
                  </p>
                  <Button onClick={() => setSelectedTab("add")}>
                    Add Your First Card
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add a New Flashcard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateFlashcardForm deckId={deck.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {deckCards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden">
              <motion.div
                className="flex space-x-4 py-4 overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {deckCards.slice(0, 5).map((card) => (
                  <div key={card.id} className="min-w-[270px] w-[270px]">
                    <FlashcardComponent card={card} />
                  </div>
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeckDetail;
