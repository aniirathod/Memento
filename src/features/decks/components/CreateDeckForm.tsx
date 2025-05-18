import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { deckSchema, type DeckFormValues } from "@/lib/validations";
import { useFlashcardStore } from "@/features/flashcards/store/useFlashcardStore";
import TagsInput from "@/components/TagsInput";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const CreateDeckForm: React.FC = () => {
  const { createDeck } = useFlashcardStore();
  const navigate = useNavigate();

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });

  const onSubmit = (values: DeckFormValues) => {
    const newDeck = createDeck(
      values.name,
      values.description || "",
      values.tags || []
    );

    toast.success("Deck created successfully!");
    navigate(`/decks/${newDeck.id}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deck Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter deck name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a description for your deck"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (optional)</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add tags"
                  maxTags={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Create Deck
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateDeckForm;
