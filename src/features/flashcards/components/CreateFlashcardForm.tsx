import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { flashcardSchema, type FlashcardFormValues } from "@/lib/validations";
import { useFlashcardStore } from "@/features/flashcards/store/useFlashcardStore";
import TagsInput from "@/components/TagsInput";
import { toast } from "sonner";

interface CreateFlashcardFormProps {
  deckId: string;
  onSuccess?: () => void;
}

const CreateFlashcardForm: React.FC<CreateFlashcardFormProps> = ({
  deckId,
  onSuccess,
}) => {
  const { createFlashcard } = useFlashcardStore();

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      front: "",
      back: "",
      tags: [],
    },
  });

  const onSubmit = (values: FlashcardFormValues) => {
    createFlashcard(deckId, values.front, values.back, values.tags || []);

    toast.success("Flashcard created successfully!");
    form.reset();

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question/Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the question or prompt"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the answer"
                  className="min-h-24"
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
            Create Flashcard
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateFlashcardForm;
