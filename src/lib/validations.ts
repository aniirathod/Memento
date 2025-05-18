import { z } from "zod";

export const deckSchema = z.object({
  name: z
    .string()
    .min(1, "Deck name is required")
    .max(50, "Deck name cannot exceed 50 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  tags: z.array(z.string()).max(10, "Cannot add more than 10 tags").optional(),
});

export const flashcardSchema = z.object({
  front: z
    .string()
    .min(1, "Question/prompt is required")
    .max(1000, "Front content cannot exceed 1000 characters"),
  back: z
    .string()
    .min(1, "Answer is required")
    .max(1000, "Back content cannot exceed 1000 characters"),
  tags: z.array(z.string()).max(10, "Cannot add more than 10 tags").optional(),
});

export type DeckFormValues = z.infer<typeof deckSchema>;
export type FlashcardFormValues = z.infer<typeof flashcardSchema>;
