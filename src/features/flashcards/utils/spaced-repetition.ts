import type { Flashcard, ReviewStatus } from "../types";

/**
 * Calculates the next review date and related parameters using the SM-2 spaced repetition algorithm
 *
 * @param card - The flashcard being reviewed
 * @param quality - The quality of recall (0-5), where < 3 is incorrect and >= 3 is correct
 * @returns The updated card parameters for scheduling the next review
 */
export const calculateNextReview = (
  card: Flashcard,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): {
  interval: number;
  easeFactor: number;
  status: ReviewStatus;
  streak: number;
  dueDate: string;
} => {
  let { easeFactor, interval, streak } = card;
  let status: ReviewStatus = card.status;

  // Update ease factor based on quality response (0-5)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Determine the next interval
  if (quality < 3) {
    // If quality is below "good" (3), reset interval
    // DEBUG: Set to 0.0035 days (~5 minutes) instead of 1 day
    interval = 0.0035;
    streak = 0;
    status = "learning";
  } else {
    // Increase streak for correct answers
    streak += 1;

    // Update interval based on current state
    if (status === "new" || status === "learning") {
      // DEBUG: Set to 0.007 days (~10 minutes) instead of 1 day
      interval = 0.007;
      status = "reviewing";
    } else if (status === "reviewing") {
      if (interval === 0.007 || interval === 0.0035) {
        // DEBUG: Set to 0.014 days (~20 minutes) instead of 3 days
        interval = 0.014;
      } else {
        // Keep the multiplication logic, but start from the smaller base
        interval = Math.round(interval * easeFactor * 100) / 100;
      }

      // After a significant interval, consider it mastered
      // DEBUG: Lower the threshold for debugging
      if (interval > 0.1 && streak >= 2) {
        status = "mastered";
      }
    }
  }

  // Calculate the next due date
  const dueDate = new Date();
  // Use the fractional days to calculate minutes
  const minutesToAdd = Math.round(interval * 24 * 60);
  dueDate.setMinutes(dueDate.getMinutes() + minutesToAdd);

  return {
    interval,
    easeFactor,
    status,
    streak,
    dueDate: dueDate.toISOString(),
  };
};
